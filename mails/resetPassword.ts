import config from 'config';
import axios from 'axios';
import moment from 'moment';

let sendchamp_email_url: string = config.get('SENDCHAMP_EMAIL_URL');
let sendchamp_public_access_key: string = config.get(
    'SENDCHAMP_PUB_ACCESS_KEY',
);
let email_name_from: string = config.get('EMAIL_NAME_FROM');
let email_from: string = config.get('EMAIL_FROM');

export const sendResetPasswordOTPEmail = async (
    email: string,
    otp: string,
    firstName: string,
): Promise<void> => {
    const timeStamp = moment().format('LLLL');
    try {
        const response: any = await axios(sendchamp_email_url, {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: `Bearer ${sendchamp_public_access_key}`,
            },
            data: {
                to: [{ email, name: `${firstName}` }],
                from: { name: email_name_from, email: email_from },
                message_body: {
                    type: 'text/html',
                    value: `
                        <div>
                            <p>Hi ${firstName}.</p>
                            <p>Welcome Back!</p>
                            <p>You forgot your password and requested for password reset on ${timeStamp}.</p>
                            <p>Use this reset code ${otp} as your One Time Password to reset your Iklin password</p>
                            <p>If this is not you, please ignore and send us a mail on hello@iklin.app </p>
                        </div>`,
                },
                subject: 'Iklin Reset Password Code',
            },
        });
    } catch (err: any) {
        console.log('Unable to send email ----------');
        throw Error(err);
    }
};
