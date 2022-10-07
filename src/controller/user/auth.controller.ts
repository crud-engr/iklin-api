import { Request, Response } from 'express';
import { AuthService } from '../../service/user/auth.service';

export class AuthController {
    async saveBasicRegistration(req: Request, res: Response) {
        try {
            return new AuthService().saveBasicRegistration(req, res);
        } catch (err) {
            return res.status(500).json({
                status: 'error',
                message: 'an error occured',
                code: 500,
            });
        }
    }

    async activateBasicRegistration(req: Request, res: Response) {
        try {
            return new AuthService().activateBasicRegistration(req, res);
        } catch (err) {
            return res.status(500).json({
                status: 'error',
                message: 'an error occured',
                code: 500,
            });
        }
    }
}
