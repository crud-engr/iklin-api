import { Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import config from 'config';

import TemporarySignup from '../../model/TemporarySignup';
import { sendBasicSignupOTPEmail } from '../../mails/signupOTP';
import OTP from '../../model/OTP';
import moment from 'moment';
import { accountVerificationSuccessEmail } from '../../mails/accountVerifySuccess';
import User from '../../model/User';
// import recordActivityLogs from '../../utils/activityLogs';

export class AuthService {
    async generateOTP() {
        return `${Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)}`;
    }

    async saveBasicRegistration(req: Request, res: Response) {
        try {
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
            console.log('O-T-P: ', otp);
            // send otp mail to user
            await sendBasicSignupOTPEmail(email, otp);
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
                    message: 'User not found',
                    code: 400,
                });
            }
            // encrypt otp
            const hashed_otp = crypto
                .createHash('sha256')
                .update(otp)
                .digest('hex');
            const isOTPFound = await OTP.findOne({
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
            await accountVerificationSuccessEmail(isOTPFound.email!);
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
            password = await bcrypt.hash(
                password,
                parseInt(config.get('PASSWORD_SALT')),
            );
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
            // prepare user wallet here---------
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
            const location: string = req.body.location;
            const email: string = req.body.email;
            if (!email) {
                return res.status(400).json({
                    status: 'error',
                    message: 'User not found',
                    code: 400,
                });
            }
            if (!location) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Location is required',
                    code: 400,
                });
            }
            const user = await User.findOneAndUpdate(
                { email },
                { email, location },
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

    // send email to this endpoint
    async saveCard(req: Request, res: Response) {
        try {
            const card_number: string = req.body.cardNumber;
            const expiry: Date = req.body.expiry;
            const cvv: number = req.body.cvv;
            const email: string = req.body.email;
            if (!email) {
                return res.status(400).json({
                    status: 'error',
                    message: 'User not found',
                    code: 400,
                });
            }
            // await User.findOne({ email }).exec();

            return res.status(200).json({
                status: 'success',
                message: 'Card successfully saved',
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
}
