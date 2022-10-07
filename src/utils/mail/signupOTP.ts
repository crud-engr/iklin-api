import config from 'config';
import axios from 'axios';

let sendchamp_email_url: string = config.get('SENDCHAMP_EMAIL_URL');
let sendchamp_public_access_key: string = config.get(
    'SENDCHAMP_PUB_ACCESS_KEY',
);
let email_name_from: string = config.get('EMAIL_NAME_FROM');
let email_from: string = config.get('EMAIL_FROM');

export const sendBasicSignupOTPEmail = async (email: string, otp: string) => {
    try {
        const response: any = await axios(sendchamp_email_url, {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: `Bearer ${sendchamp_public_access_key}`,
            },
            data: {
                to: [{ email, name: `${email.split('@')[0]}` }],
                from: { name: email_name_from, email: email_from },
                message_body: {
                    type: 'text/html',
                    value: `Hi ${
                        email.split('@')[0]
                    }, \n\n Please enter the following verification code to verify your Iklin Account. 
                    \n\n OTP: ${otp}`,
                },
                subject: 'Iklin Verification Code',
            },
        });
    } catch (err: any) {
        console.log('Unable to send email ----------');
        throw Error(err);
    }
};
