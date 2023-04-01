import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../../service/vendor/auth.service';

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

    async completeSignupProcess(req: Request, res: Response) {
        try {
            return new AuthService().completeSignupProcess(req, res);
        } catch (err) {
            return res.status(500).json({
                status: 'error',
                message: 'an error occured',
                code: 500,
            });
        }
    }

    async resendToken(req: Request, res: Response) {
        try {
            return new AuthService().resendToken(req, res);
        } catch (err) {
            return res.status(500).json({
                status: 'error',
                message: 'an error occured',
                code: 500,
            });
        }
    }

    async resetPassword(req: Request, res: Response) {
        try {
            return new AuthService().resetPassword(req, res);
        } catch (err) {
            return res.status(500).json({
                status: 'error',
                message: 'an error occured',
                code: 500,
            });
        }
    }

    async forgotPassword(req: Request, res: Response) {
        try {
            return new AuthService().forgotPassword(req, res);
        } catch (err) {
            return res.status(500).json({
                status: 'error',
                message: 'an error occured',
                code: 500,
            });
        }
    }

    async login(req: Request, res: Response) {
        console.log('Login here!!!');
        try {
            return new AuthService().login(req, res);
        } catch (err) {
            return res.status(500).json({
                status: 'error',
                message: 'an error occured',
                code: 500,
            });
        }
    }

    async protect(req: Request, res: Response, next: NextFunction) {
        try {
            return new AuthService().protect(req, res, next);
        } catch (err) {
            return res.status(500).json({
                status: 'error',
                message: 'an error occured',
                code: 500,
            });
        }
    }
}
