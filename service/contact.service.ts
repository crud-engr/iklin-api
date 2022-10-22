import { Request, Response } from 'express';
import { sendContactUsEmail } from '../mails/contactUs';
import ContactUs from '../model/ContactUs';

export class ContactService {
    async contactUs(req: Request, res: Response) {
        try {
            const { name, email, subject, message } = req.body;
            await ContactUs.create({ name, email, subject, message });
            // send mail to iklin
            await sendContactUsEmail(name, email, subject, message);
            return res.status(200).json({
                status: 'success',
                message: 'Message sent',
                code: 200,
            });
        } catch (err: any) {
            return {
                status: 'error',
                message: 'an error occured',
                code: 500,
            };
        }
    }
}
