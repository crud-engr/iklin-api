import nodemailer from 'nodemailer';
import config from 'config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const email_name_from: string = config.get('EMAIL_NAME_FROM');
const email_from: string = config.get('EMAIL_FROM');
const EMAIL_USERNAME: string = config.get('EMAIL_USERNAME');
const EMAIL_PASSWORD: string = config.get('EMAIL_PASSWORD');
const EMAIL_SERVICE: string = config.get('EMAIL_SERVICE');

export const sendEmail = async (options: {
    to: string;
    subject: string;
    text: string;
    html: string;
}) => {
    const transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> =
        nodemailer.createTransport({
            service: EMAIL_SERVICE,
            auth: {
                user: EMAIL_USERNAME,
                pass: EMAIL_PASSWORD,
            },
        });
    const mailOptions = {
        from: `${email_name_from} <${email_from}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
    };
    await transporter.sendMail(mailOptions);
};
