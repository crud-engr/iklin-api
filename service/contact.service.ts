import { Request, Response } from 'express';
import config from 'config';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import ContactUs from '../model/ContactUs';
const iklin_mail: string = config.get('EMAIL_FROM');
const iklin_name: string = config.get('EMAIL_NAME_FROM');
const EMAIL_USERNAME: string = config.get('EMAIL_USERNAME');
const EMAIL_PASSWORD: string = config.get('EMAIL_PASSWORD');
const EMAIL_SERVICE: string = config.get('EMAIL_SERVICE');

export class ContactService {
    async contactUs(req: Request, res: Response) {
        try {
            const { name, email, subject, message } = req.body;
            await ContactUs.create({ name, email, subject, message });
            // send mail from customer to iklin
            const transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> =
                nodemailer.createTransport({
                    service: EMAIL_SERVICE,
                    auth: {
                        user: EMAIL_USERNAME,
                        pass: EMAIL_PASSWORD,
                    },
                });
            const mailOptions = {
                from: `${name} <${email}>`,
                to: iklin_mail,
                subject,
                text: `<div>
                    <p>A new message from <strong>${name}</strong> <${email}></p> 
                    <p>${message}</p>
                </div>`,
                html: `<div>
                    <p>A new message from <strong>${name}</strong> <${email}></p> 
                    <p>${message}</p>
                </div>`,
            };
            await transporter.sendMail(mailOptions);
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
