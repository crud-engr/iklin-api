import { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import config from 'config';
import jwt from 'jsonwebtoken';
import TemporarySignup from '../../model/TemporarySignup';
import { sendEmail } from '../../utils/Email';
import OTP from '../../model/OTP';
import moment from 'moment';
import User from '../../model/User';
import { IUser } from '../../interface/user.interface';
// import recordActivityLogs from '../../utils/activityLogs';

interface JwtPayload {
    userId: string;
}

export class AuthService {
    async generateOTP() {
        return `${Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)}`;
    }

    async saveBasicRegistration(req: Request, res: Response) {
        const { email } = req.body;
        const user = await TemporarySignup.exists({ email });
        if (user) {
            return res.status(400).json({
                status: 'error',
                message: 'User already exists',
                code: 400,
            });
        }
        const tempUser = new TemporarySignup({ email });
        await tempUser.save();
        const otp = await this.generateOTP();
        // send otp mail to user
        try {
            await sendEmail({
                to: tempUser.email,
                subject: 'Iklin Verification Code',
                text: `Hi ${
                    tempUser.email.split('@')[0]
                }, Use this code ${otp} as your One Time Password to verify your Iklin Account`,
                html: `Hi <strong>${
                    tempUser.email.split('@')[0]
                }</strong>, <br /><br />Use this code <strong>${otp}</strong> as your One Time Password to verify your Iklin Account`,
            });

            // record log activity to database
            // await recordActivityLogs({
            //     email,
            //     action: 'Sent a verification code',
            //     ipAddress: req.socket.remoteAddress,
            // });
            // hash otp
            const hashedOTP = crypto
                .createHash('sha256')
                .update(otp)
                .digest('hex');
            await TemporarySignup.findOneAndUpdate(
                { email },
                { email, activationToken: hashedOTP },
            );
            await OTP.findOneAndUpdate(
                { email },
                {
                    email,
                    otpCode: hashedOTP,
                    expiry: moment().add('5', 'minutes'),
                    used: false,
                },
                { new: true, upsert: true, setDefaultsOnInsert: true },
            ).exec();
            return res.status(201).json({
                status: 'success',
                message: `Verification code has been sent to ${tempUser.email}`,
                code: 201,
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(500).json({
                status: 'error',
                message: 'an error occured',
                code: 500,
            });
        }
    }

    // send email to this endpoint
    async activateBasicRegistration(req: Request, res: Response) {
        try {
            const { otp, email } = req.body;
            if (!email) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Bad request',
                    code: 400,
                });
            }
            const user = await TemporarySignup.findOne({ email }).exec();
            if (!user) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Bad request',
                    code: 400,
                });
            }
            // encrypt otp
            const hashed_otp = crypto
                .createHash('sha256')
                .update(otp)
                .digest('hex');
            const isOTPFound = await OTP.findOne({
                email,
                otpCode: hashed_otp,
                used: false,
            }).exec();
            if (!isOTPFound) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid OTP',
                    code: 400,
                });
            }
            // check if otp has not expired
            const now = moment(Date.now());
            const sentTime = moment(isOTPFound.expiry);
            const duration = moment.duration(now.diff(sentTime));
            const mins = duration.asMinutes();
            if (mins > 60) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid or expired otp. Please resend!',
                    code: 400,
                });
            }
            await OTP.findOneAndUpdate(
                { otpCode: hashed_otp, used: false },
                { otpCode: hashed_otp, used: true },
            ).exec();
            // send account verify mail
            await sendEmail({
                to: user.email,
                subject: 'Iklin Activation Success',
                text: `Hi ${
                    user.email.split('@')[0]
                }, Your account has been successfully verified. Please complete your onboarding process`,
                html: `Hi <strong>${
                    user.email.split('@')[0]
                }</strong>, <br /><br />Your account has been successfully verified. Please complete your onboarding process`,
            });
            await TemporarySignup.findOneAndUpdate(
                { email: isOTPFound.email },
                { email: isOTPFound.email, activated: true },
            ).exec();
            return res.status(200).json({
                status: 'success',
                message: 'Account successfully verified.',
                code: 200,
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(500).json({
                status: 'error',
                message: 'an error occured',
                code: 500,
            });
        }
    }

    async reformatPhoneNumber(phone: string) {
        // remove starting zero for all phone numbers
        if (phone.startsWith('0')) {
            phone = phone.substring(1);
        }
        return phone;
    }

    // send email to this endpoint
    async completeSignupProcess(req: Request, res: Response) {
        try {
            let { email, firstName, lastName, phone, password, referral } =
                req.body;
            const tempUser = await TemporarySignup.findOne({ email }).exec();
            if (!tempUser) {
                return res.status(400).json({
                    status: 'error',
                    message: 'User not found',
                    code: 400,
                });
            }
            if (!tempUser.activated) {
                return res.status(400).json({
                    status: 'error',
                    message: 'account is not activated',
                    code: 400,
                });
            }
            const userExist = await User.findOne({ email }).exec();
            if (userExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'user already exist',
                    code: 400,
                });
            }
            phone = await this.reformatPhoneNumber(phone);
            password = await this.hashPassword(password);
            let fieldsToUpdate: object = {
                email,
                firstName,
                lastName,
                phone,
                password,
                referral: referral ? referral : '',
            };
            await TemporarySignup.findOneAndUpdate(
                { email },
                fieldsToUpdate,
            ).exec();
            const user = await TemporarySignup.findOne({ email }).exec();
            const finalUser = new User({
                email: user?.email,
                firstName: user?.firstName,
                lastName: user?.lastName,
                phone: user?.phone,
                password: user?.password,
                referral: user?.referral,
                activated: user?.activated,
                activationToken: user?.activationToken,
            });
            await finalUser.save();
            // prepare user wallet
            // await this.prepareUserWallet(finalUser._id.toString());
            await TemporarySignup.deleteOne({ email }).exec();
            return res.status(201).json({
                status: 'success',
                message: 'Account successfully created',
                code: 200,
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(500).json({
                status: 'error',
                message: 'an error occured',
                code: 500,
            });
        }
    }

    // send email to this endpoint
    async saveLocation(req: Request, res: Response) {
        try {
            const address: string = req.body.location;
            const landmark: string = req.body.landmark;
            const city: string = req.body.city;
            const state: string = req.body.state;
            const email: string = req.body.email;
            if (!email) {
                return res.status(400).json({
                    status: 'error',
                    message: 'User not found',
                    code: 400,
                });
            }
            if (!address) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Address is required',
                    code: 400,
                });
            }
            if (!landmark) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Landmark is required',
                    code: 400,
                });
            }
            if (!city) {
                return res.status(400).json({
                    status: 'error',
                    message: 'City is required',
                    code: 400,
                });
            }
            if (!state) {
                return res.status(400).json({
                    status: 'error',
                    message: 'State is required',
                    code: 400,
                });
            }
            const user = await User.findOneAndUpdate(
                { email },
                { email, landmark, city, address, state },
            );
            return res.status(200).json({
                status: 'success',
                message: 'Location successfully saved',
                code: 200,
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(500).json({
                status: 'error',
                message: 'an error occured',
                code: 500,
            });
        }
    }

    // async validateCard(expiryDate: string): Promise<Boolean> {
    //     let expiry_month: number = parseInt(expiryDate.split('/')[0]);
    //     let expiry_year: number = parseInt(expiryDate.split('/')[1]);
    //     let current_month = moment().month();
    //     let current_year = parseInt(moment().year().toString().substring(2));
    //     if (current_year > expiry_year || current_month > expiry_month) {
    //         return false;
    //     }
    //     return true;
    // }

    async signJWTToken(userId: string) {
        return jwt.sign({ userId }, config.get('JWT_SECRET'), {
            expiresIn: config.get('JWT_EXPIRES_IN'),
        });
    }

    // async prepareUserWallet(userId: string): Promise<IWallet> {
    //     try {
    //         console.log('Preparing user wallet -----------------');
    //         return await Wallet.create({ user: userId });
    //     } catch (err: any) {
    //         console.log('Error creating user wallet');
    //         throw new Error('Error creating user wallet');
    //     }
    // }

    // send email to this endpoint
    // async saveCard(req: Request, res: Response) {
    //     try {
    //         const card_number: string = req.body.cardNumber;
    //         let expiry: string = req.body.expiry;
    //         const cvv: number = req.body.cvv;
    //         const email: string = req.body.email;
    //         const user = await User.findOne({ email }).exec();
    //         if (!user) {
    //             return res.status(400).json({
    //                 status: 'error',
    //                 message: 'User not found',
    //                 code: 400,
    //             });
    //         }
    //         const findCard = await Card.findOne({
    //             cardNumber: card_number,
    //         }).exec();
    //         if (findCard) {
    //             return res.status(400).json({
    //                 status: 'error',
    //                 message: 'Card already exist',
    //                 code: 400,
    //             });
    //         }
    //         // validate card
    //         const isCardValid = await this.validateCard(expiry);
    //         if (!isCardValid) {
    //             return res.status(200).json({
    //                 status: 'error',
    //                 message: 'Invalid or expired card',
    //                 code: 200,
    //             });
    //         }
    //         const card: ICard = new Card({
    //             user: user._id,
    //             cardNumber: card_number,
    //             expiry,
    //             cvv,
    //         });
    //         await card.save();
    //         const token: string = await this.signJWTToken(user._id);
    //         return res.status(200).json({
    //             status: 'success',
    //             message: 'Account successfully completed',
    //             token,
    //             code: 200,
    //         });
    //     } catch (err: any) {
    //         console.log(err.message);
    //         return res.status(500).json({
    //             status: 'error',
    //             message: 'an error occured',
    //             code: 500,
    //         });
    //     }
    // }

    // send email to this endpoint

    async resendToken(req: Request, res: Response) {
        try {
            const email: string = req.body.email;
            const user = await User.findOne({ email }).exec();
            if (!user) {
                return res.status(400).json({
                    status: 'error',
                    message: 'User not found',
                    code: 400,
                });
            }
            const otp = await this.generateOTP();
            await sendEmail({
                to: user.email,
                subject: 'Iklin Verification Code',
                text: `Hi ${
                    user.email.split('@')[0]
                }, Use this code <strong>${otp}</strong> as your One Time Password to verify your Iklin Account`,
                html: `Hi <strong>${
                    user.email.split('@')[0]
                }</strong>, <br /><br />Use this code <strong>${otp}</strong> as your One Time Password to verify your Iklin Account`,
            });
            const hashedOTP = crypto
                .createHash('sha256')
                .update(otp)
                .digest('hex');
            await User.findOneAndUpdate(
                { email },
                { email, activationToken: hashedOTP },
            );
            await OTP.findOneAndUpdate(
                { email },
                {
                    email,
                    otpCode: hashedOTP,
                    expiry: moment().add('5', 'minutes'),
                    used: false,
                },
                { new: true, upsert: true, setDefaultsOnInsert: true },
            ).exec();
            return res.status(200).json({
                status: 'success',
                message: 'Token successfully resent.',
                code: 200,
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(500).json({
                status: 'error',
                message: 'an error occured',
                code: 500,
            });
        }
    }

    async forgotPassword(req: Request, res: Response) {
        try {
            const email: string = req.body.email;
            if (!email) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email is required',
                    code: 400,
                });
            }
            const user = await User.findOne({ email }).exec();
            if (!user) {
                return res.status(400).json({
                    status: 'error',
                    message: 'User not found',
                    code: 400,
                });
            }
            const otp: string = await this.generateOTP();
            // console.log('O-T-P: ', otp);
            const timeStamp = moment().format('LLLL');
            await sendEmail({
                to: user.email,
                subject: 'Iklin Reset Password Code',
                text: `<div>
                            <p>Hi <strong>${user.firstName}</strong>.</p>
                            <p>Welcome Back!</p>
                            <p>You forgot your password and requested for password reset on <strong>${timeStamp}</strong>.</p>
                            <p>Use this reset code <strong>${otp}</strong> as your One Time Password to reset your Iklin password</p>
                            <p>If this is not you, please ignore and send us a mail on hello@iklin.app </p>
                        </div>`,
                html: `<div>
                            <p>Hi <strong>${user.firstName}</strong>.</p>
                            <p>Welcome Back!</p>
                            <p>You forgot your password and requested for password reset on <strong>${timeStamp}</strong>.</p>
                            <p>Use this reset code <strong>${otp}</strong> as your One Time Password to reset your Iklin password</p>
                            <p>If this is not you, please ignore and send us a mail on hello@iklin.app </p>
                        </div>`,
            });
            const hashedOTP = crypto
                .createHash('sha256')
                .update(otp)
                .digest('hex');
            await User.findOneAndUpdate(
                { email },
                { email, activationToken: hashedOTP },
            );
            await OTP.findOneAndUpdate(
                { email },
                {
                    email,
                    otpCode: hashedOTP,
                    expiry: moment().add('5', 'minutes'),
                    used: false,
                },
                { new: true, upsert: true, setDefaultsOnInsert: true },
            ).exec();
            return res.status(200).json({
                status: 'success',
                message: `A reset code has been sent to ${email}`,
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(500).json({
                status: 'error',
                message: 'an error occured',
                code: 500,
            });
        }
    }

    // send email to this endpoint
    async resetPassword(req: Request, res: Response) {
        try {
            const email: string = req.body.email;
            const token: string = req.body.token;
            const password: string = req.body.password;
            // const confirmPassword: string = req.body.confirmPassword;
            if (!email) {
                return res.status(400).json({
                    status: 'error',
                    message: 'bad request',
                    code: 400,
                });
            }
            const user = await User.findOne({ email }).exec();
            if (!user) {
                return res.status(400).json({
                    status: 'error',
                    message: 'bad request',
                    code: 400,
                });
            }
            // compare token
            const hashedToken = crypto
                .createHash('sha256')
                .update(token)
                .digest('hex');
            // check if token is there.
            const tokenExist = await OTP.findOne({
                otpCode: hashedToken,
                used: false,
            }).exec();
            if (!tokenExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Token not found',
                    code: 400,
                });
            }
            // check if token not yet expired
            const now = moment(Date.now());
            const sent = moment(tokenExist.expiry);
            const duration = moment.duration(now.diff(sent));
            const mins = duration.asMinutes();
            if (mins > 60) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid or expired token',
                    code: 400,
                });
            }
            // hash new password
            const hashedPassword = await this.hashPassword(password);
            await User.findOneAndUpdate(
                { email: tokenExist.email },
                { email: tokenExist.email, password: hashedPassword },
            ).exec();
            await OTP.findOneAndUpdate(
                { email: tokenExist.email, used: false },
                { email: tokenExist.email, used: true },
            ).exec();
            // const user: IUser | null = await User.findOne({
            //     email: tokenExist.email,
            // }).exec();
            const timeStamp = moment().format('LLLL');
            await sendEmail({
                to: user.email,
                subject: 'Iklin Reset Password Success',
                text: `<div>
                            <p>Hi <strong>${user.firstName}</strong>.</p>
                            <p>Your password has been successfully reset on <strong>${timeStamp}</strong>.</p>
                            <p>If this is not you, please contact us on hello@iklin.app </p>
                        </div>`,
                html: `<div>
                            <p>Hi <strong>${user.firstName}</strong>.</p>
                            <p>Your password has been successfully reset on <strong>${timeStamp}</strong>.</p>
                            <p>If this is not you, please contact us on hello@iklin.app </p>
                        </div>`,
            });
            return res.status(200).json({
                status: 'success',
                message: 'Password successfully reset',
                code: 200,
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(500).json({
                status: 'error',
                message: 'an error occured',
                code: 500,
            });
        }
    }

    async hashPassword(password: string) {
        return await bcrypt.hash(
            password,
            parseInt(config.get('PASSWORD_SALT')),
        );
    }

    async login(req: Request, res: Response) {
        try {
            const email: string = req.body.email;
            const password: string = req.body.password;
            const user = await User.findOne({ email }).exec();
            if (!user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid email',
                    code: 401,
                });
            }
            if (!(await user.comparePasswordMatch(password))) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid password',
                    code: 401,
                });
            }
            if (!user.isUserAuthorized('user')) {
                return res.status(401).json({
                    status: 'error',
                    message: 'User is not authorized for this resource',
                    code: 401,
                });
            }
            if (user.isDeleted) {
                return res.status(401).json({
                    status: 'error',
                    message: 'User does not exists',
                    code: 401,
                });
            }
            if (user.isLocked) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Account is temporarily locked',
                    code: 401,
                });
            }
            if (!user.activated) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Account is not activated',
                    code: 401,
                });
            }
            const timeStamp = moment().format('LLLL');
            await sendEmail({
                to: user.email,
                subject: 'Iklin Login',
                text: `<div>
                            <p>Hi <strong>${user.firstName}</strong>.</p>
                            <p>You just logged into your account on <strong>${timeStamp}</strong>.</p>
                            <p>If this is not you, please reset your password and contact us on hello@iklin.app </p>
                        </div>`,
                html: `<div>
                            <p>Hi <strong>${user.firstName}</strong>.</p>
                            <p>You just logged into your account on <strong>${timeStamp}</strong>.</p>
                            <p>If this is not you, please reset your password and contact us on hello@iklin.app </p>
                        </div>`,
            });
            const token = await this.signJWTToken(user._id);
            return res.status(200).json({
                status: 'success',
                message: 'Login successful',
                data: { token },
                code: 200,
            });
        } catch (err: any) {
            console.log(err.message);
            return res.status(500).json({
                status: 'error',
                message: 'an error occured',
                code: 500,
            });
        }
    }

    async protect(req: Request, res: Response, next: NextFunction) {
        try {
            let token: string = '';
            // grab token from the headers
            if (
                req.headers.authorization &&
                req.headers.authorization.startsWith('Bearer')
            ) {
                token = req.headers.authorization.split(' ')[1];
            }
            // confirm token
            if (!token) {
                return res.status(401).json({
                    status: 'error',
                    message:
                        'You are not authenticated. Please login to gain access',
                    code: 401,
                });
            }
            // verify token
            const { userId } = jwt.verify(
                token,
                config.get('JWT_SECRET'),
            ) as JwtPayload;
            // find user with the token
            let user: IUser | null = await User.findOne({
                _id: userId,
            });
            if (!user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'User with this token does not exist',
                    code: 401,
                });
            }
            if (user.role !== 'user') {
                return res.status(401).json({
                    status: 'error',
                    message: 'User is not authorized to access this resource.',
                    code: 401,
                });
            }
            next();
        } catch (err: any) {
            if (err.name === 'TokenExpiredError') {
                err.message = 'Token expired. Please login again.';
            } else if (err.name === 'JsonWebTokenError') {
                err.message = 'Invalid token. Please login again.';
            }
            return res.status(401).json({
                status: 'error',
                message: err.message,
                code: 401,
            });
        }
    }
}
