import { Request, Response } from 'express';
import crypto from 'crypto';
import TemporarySignup from '../../model/TemporarySignup';
import { Email } from '../../utils/mail';

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
            const tempUser = await TemporarySignup.create({ email });
            const otp = await this.generateOTP();
            console.log('O-T-P: ', otp);
            // send otp mail to user
            await new Email(tempUser, otp).basicSignupOTP();
            // hash otp
            const hashedOTP = crypto
                .createHash('sha256')
                .update(otp)
                .digest('hex');
            await TemporarySignup.findOneAndUpdate(
                { email },
                { email, activationToken: hashedOTP },
            );
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

    async activateBasicRegistration(req: Request, res: Response) {}
}
