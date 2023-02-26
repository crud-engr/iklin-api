import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import config from 'config';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../utils/Email';
import OTP from '../../model/OTP';
import moment from 'moment';
import User from '../../model/User';
import Vendor from '../../model/Vendor';
import VTemporarySignup from '../../model/VTemporarySignup';
import { IVendor } from '../../interface/vendor.interface';

interface JwtPayload {
    vendorId: string;
}

export class AuthService {
    async generateOTP() {
        return `${Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)}`;
    }

    async saveBasicRegistration(req: Request, res: Response) {
        const { email } = req.body;
        const vendor = await VTemporarySignup.exists({ email });
        if (vendor) {
            return res.status(400).json({
                status: 'error',
                message: 'User already exists',
                code: 400,
            });
        }
        const userExist = await User.exists({ email });
        if (userExist) {
            return res.status(400).json({
                status: 'error',
                message: 'User already exists.',
                code: 400,
            });
        }
        // check if user has the email
        const tempVendor = new VTemporarySignup({ email });
        await tempVendor.save();
        const otp = await this.generateOTP();
        // send otp mail to vendor
        try {
            await sendEmail({
                to: tempVendor.email,
                subject: 'Iklin Verification Code',
                text: `Hi ${
                    tempVendor.email.split('@')[0]
                }, Use this code ${otp} as your One Time Password to verify your Iklin Account`,
                html: `Hi <strong>${
                    tempVendor.email.split('@')[0]
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
            await VTemporarySignup.findOneAndUpdate(
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
                message: `Verification code has been sent to ${tempVendor.email}`,
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
            const vendor = await VTemporarySignup.findOne({ email }).exec();
            if (!vendor) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email not found',
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
                to: vendor.email,
                subject: 'Iklin Activation Success',
                text: `Hi ${
                    vendor.email.split('@')[0]
                }, Your account has been successfully verified. Please complete your onboarding process`,
                html: `Hi <strong>${
                    vendor.email.split('@')[0]
                }</strong>, <br /><br />Your account has been successfully verified. Please complete your onboarding process`,
            });
            await VTemporarySignup.findOneAndUpdate(
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

    // verify nin later
    async verifyNin(data: string): Promise<boolean> {
        return true;
    }
    // verify cac later
    async verifyCACNumber(data: string): Promise<boolean> {
        return true;
    }

    // send email to this endpoint
    async completeSignupProcess(req: Request, res: Response) {
        try {
            let {
                email,
                firstName,
                lastName,
                phone,
                password,
                businessName,
                businessAddress,
                profession,
                nin,
                cac,
            } = req.body;
            const tempVendor = await VTemporarySignup.findOne({ email }).exec();
            if (!tempVendor) {
                return res.status(400).json({
                    status: 'error',
                    message: 'User not found',
                    code: 400,
                });
            }
            if (!tempVendor.activated) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Account is not activated',
                    code: 400,
                });
            }
            const vendorExist = await Vendor.findOne({ email }).exec();
            if (vendorExist) {
                return res.status(400).json({
                    status: 'error',
                    message: 'User already exist',
                    code: 400,
                });
            }
            phone = await this.reformatPhoneNumber(phone);
            password = await this.hashPassword(password);
            let ninIsVerified = await this.verifyNin(nin);
            if (!ninIsVerified) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid NIN supplied',
                    code: 400,
                });
            }
            let cacIsVerified = await this.verifyCACNumber(cac);
            if (!cacIsVerified) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid CAC supplied',
                    code: 400,
                });
            }
            let fieldsToUpdate: object = {
                email,
                firstName,
                lastName,
                phone,
                password,
                businessName,
                businessAddress,
                profession,
                nin,
                cac,
            };
            await VTemporarySignup.findOneAndUpdate(
                { email },
                fieldsToUpdate,
            ).exec();
            const vendor = await VTemporarySignup.findOne({ email }).exec();
            const finalVendor = new Vendor({
                email: vendor?.email,
                firstName: vendor?.firstName,
                lastName: vendor?.lastName,
                phone: vendor?.phone,
                password: vendor?.password,
                referral: vendor?.referral,
                activated: vendor?.activated,
                activationToken: vendor?.activationToken,
                businessName: vendor?.businessName,
                businessAddress: vendor?.businessAddress,
                profession: vendor?.profession,
                nin: vendor?.nin,
                cac: vendor?.cac,
                isNINVerified: true,
                isCACVerified: true,
                isVerified: true,
            });
            await finalVendor.save();
            await VTemporarySignup.deleteOne({ email }).exec();
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

    async signJWTToken(vendorId: string) {
        return jwt.sign({ vendorId }, config.get('JWT_SECRET'), {
            expiresIn: config.get('JWT_EXPIRES_IN'),
        });
    }

    // send email to this endpoint
    async resendToken(req: Request, res: Response) {
        try {
            const email: string = req.body.email;
            const vendor = await Vendor.findOne({ email }).exec();
            if (!vendor) {
                return res.status(400).json({
                    status: 'error',
                    message: 'User not found',
                    code: 400,
                });
            }
            const otp = await this.generateOTP();
            await sendEmail({
                to: vendor.email,
                subject: 'Iklin Verification Code',
                text: `Hi ${
                    vendor.email.split('@')[0]
                }, Use this code <strong>${otp}</strong> as your One Time Password to verify your Iklin Account`,
                html: `Hi <strong>${
                    vendor.email.split('@')[0]
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
            const vendor = await Vendor.findOne({ email }).exec();
            if (!vendor) {
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
                to: vendor.email,
                subject: 'Iklin Reset Password Code',
                text: `<div>
                            <p>Hi <strong>${vendor.firstName}</strong>.</p>
                            <p>Welcome Back!</p>
                            <p>You forgot your password and requested for password reset on <strong>${timeStamp}</strong>.</p>
                            <p>Use this reset code <strong>${otp}</strong> as your One Time Password to reset your Iklin password</p>
                            <p>If this is not you, please ignore and send us a mail on hello@iklin.app </p>
                        </div>`,
                html: `<div>
                            <p>Hi <strong>${vendor.firstName}</strong>.</p>
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
            const vendor = await Vendor.findOne({ email }).exec();
            if (!vendor) {
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
            await Vendor.findOneAndUpdate(
                { email: tokenExist.email },
                { email: tokenExist.email, password: hashedPassword },
            ).exec();
            await OTP.findOneAndUpdate(
                { email: tokenExist.email, used: false },
                { email: tokenExist.email, used: true },
            ).exec();
            // const user: IVendor | null = await Vendor.findOne({
            //     email: tokenExist.email,
            // }).exec();
            const timeStamp = moment().format('LLLL');
            await sendEmail({
                to: vendor.email,
                subject: 'Iklin Reset Password Success',
                text: `<div>
                            <p>Hi <strong>${vendor.firstName}</strong>.</p>
                            <p>Your password has been successfully reset on <strong>${timeStamp}</strong>.</p>
                            <p>If this is not you, please contact us on hello@iklin.app </p>
                        </div>`,
                html: `<div>
                            <p>Hi <strong>${vendor.firstName}</strong>.</p>
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
            const vendor = await Vendor.findOne({ email }).exec();
            if (!vendor) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid email',
                    code: 401,
                });
            }
            if (!(await vendor.comparePasswordMatch(password))) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid password',
                    code: 401,
                });
            }
            if (!vendor.isUserAuthorized('vendor')) {
                return res.status(401).json({
                    status: 'error',
                    message: 'User is not authorized for this resource',
                    code: 401,
                });
            }
            if (vendor.isDeleted) {
                return res.status(401).json({
                    status: 'error',
                    message: 'User does not exists',
                    code: 401,
                });
            }
            if (vendor.isLocked) {
                return res.status(401).json({
                    status: 'error',
                    message:
                        'Account is temporarily locked. Please contact admin',
                    code: 401,
                });
            }
            if (!vendor.activated) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Account is not activated',
                    code: 401,
                });
            }
            const timeStamp = moment().format('LLLL');
            await sendEmail({
                to: vendor.email,
                subject: 'Iklin Login',
                text: `<div>
                            <p>Hi <strong>${vendor.firstName}</strong>.</p>
                            <p>You just logged into your account on <strong>${timeStamp}</strong>.</p>
                            <p>If this is not you, please reset your password and contact us on hello@iklin.app </p>
                        </div>`,
                html: `<div>
                            <p>Hi <strong>${vendor.firstName}</strong>.</p>
                            <p>You just logged into your account on <strong>${timeStamp}</strong>.</p>
                            <p>If this is not you, please reset your password and contact us on hello@iklin.app </p>
                        </div>`,
            });
            const token = await this.signJWTToken(vendor._id);
            return res.status(200).json({
                status: 'success',
                message: 'Login successful',
                data: { token },
                code: 200,
            });
        } catch (err: any) {
            console.log(err);
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
            const { vendorId } = jwt.verify(
                token,
                config.get('JWT_SECRET'),
            ) as JwtPayload;
            // find vendor with the token
            let vendor: IVendor | null = await Vendor.findOne({
                _id: vendorId,
            });
            if (!vendor) {
                return res.status(401).json({
                    status: 'error',
                    message: 'User with this token does not exist',
                    code: 401,
                });
            }
            if (vendor.role !== 'vendor') {
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
