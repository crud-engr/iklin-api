import nodemailer from 'nodemailer';
import config from 'config';
import pug from 'pug';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
const { convert } = require('html-to-text');

let mail_host = config.get('EMAIL_HOST');
let mail_port = config.get('EMAIL_PORT');
let mail_username = config.get('EMAIL_USERNAME');
let mail_password = config.get('EMAIL_PASSWORD');
let mail_from = config.get('EMAIL_FROM');

export class Email {
    public to: string;
    public subject!: string;
    public user: any;
    public otp?: string;
    public from: string;
    public firstName: string;

    constructor(user: any, otp: string) {
        this.to = user.email;
        this.from = `Iklin <${mail_from}>`;
        this.otp = otp;
        this.firstName = user.firstName
            ? user.firstName
            : user.email.split('@')[0];
    }

    async send(template: string, subject: string) {
        const htmlTemplate: any = pug.renderFile(
            `${__dirname}/../../views/${template}.pug`,
            {
                firstName: this.firstName,
                otp: this.otp,
                subject,
            },
        );

        const mailOptions: {
            from: string;
            to: string;
            subject: string;
            text: string;
            html: any;
        } = {
            from: this.from,
            to: this.to,
            subject,
            text: convert(htmlTemplate),
            html: htmlTemplate,
        };

        if (config.get('NODE_ENV') === 'production') {
            // use sendchamp service
            return 1;
        }
        return nodemailer
            .createTransport({
                host: mail_host,
                port: mail_port,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: mail_username,
                    pass: mail_password,
                },
            } as SMTPTransport.Options)
            .sendMail(mailOptions);
    }

    async userWelcome() {
        await this.send('userWelcome', 'Welcome to iklin ✔🎉');
    }

    async vendorWelcome() {
        await this.send('vendorWelcome', 'Welcome to iklin ✔🎉');
    }

    async basicSignupOTP() {
        await this.send('signupOTP', 'Verify your account');
    }

    async basicSignupActivationSuccessful() {
        await this.send('basicSignupSuccess', 'Account verified');
    }
}
