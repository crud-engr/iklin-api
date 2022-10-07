import { Request, Response } from 'express';
import crypto from 'crypto';
import TemporarySignup from '../../model/TemporarySignup';
import { sendBasicSignupOTPEmail } from '../../utils/mail/signupOTP';
// import recordActivityLogs from '../../utils/activityLogs';
import OTP from '../../model/OTP';
import moment from 'moment';

export class AuthService {
    async generateOTP() {
        return `${Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)}`;
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
                { email, used: false },
                {
                    email,
                    otpCode: hashedOTP,
                    expiry: moment().add('5', 'minutes'),
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

    async activateBasicRegistration(req: Request, res: Response) {
        try {
            const { otp } = req.body;
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
            return res.status(200).json({
                status: 'success',
                message:
                    'Account successfully verified. Please complete your profile',
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

    async completeSignupProcess(req: Request, res: Response) {}
}
