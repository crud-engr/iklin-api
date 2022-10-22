import { Request, Response } from 'express';
import { ContactService } from '../service/contact.service';

export class ContactController {
    async contactUs(req: Request, res: Response) {
        try {
            return new ContactService().contactUs(req, res);
        } catch (err) {
            return {
                status: 'error',
                message: 'an error occured',
                code: 500,
            };
        }
    }
}
