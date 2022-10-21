import config from 'config';
import axios from 'axios';

let sendchamp_email_url: string = config.get('SENDCHAMP_EMAIL_URL');
let sendchamp_public_access_key: string = config.get(
    'SENDCHAMP_PUB_ACCESS_KEY',
);
let email_name_from: string = config.get('EMAIL_NAME_FROM');
let email_from: string = config.get('EMAIL_FROM');

export const sendContactUsEmail = async (
    user_name: string,
    user_email: string,
    subject: string,
    user_message: string,
): Promise<void> => {
    try {
        const response: any = await axios(sendchamp_email_url, {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: `Bearer ${sendchamp_public_access_key}`,
            },
            data: {
                to: [{ email: 'hello@iklin.app', name: 'Iklin' }],
                from: { name: user_name, email: user_email },
                message_body: {
                    type: 'text/html',
                    value: `
                        <div>
                            <p>Hello Iklin.</p>
                            <p>${user_message}</p>
                        </div>`,
                },
                subject,
            },
        });
    } catch (err: any) {
        console.log('Unable to send email ----------');
        throw Error(err);
    }
};
