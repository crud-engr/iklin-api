require('dotenv').config();

export default {
    // MAILTRAP_EMAIL_PORT: process.env.EMAIL_PORT,
    // MAILTRAP_EMAIL_HOST: process.env.EMAIL_HOST,
    // MAILTRAP_EMAIL_FROM: process.env.EMAIL_FROM,
    // MAILTRAP_EMAIL_USERNAME: process.env.EMAIL_USERNAME,
    // MAILTRAP_EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    PORT: process.env.PORT,
    HOST: process.env.HOST,
    DBURI: process.env.DBURI,
    PASSWORD_SALT: process.env.PASSWORD_SALT,
    NODE_ENV: process.env.NODE_ENV,
    EMAIL_NAME_FROM: process.env.EMAIL_NAME_FROM,
    EMAIL_FROM: process.env.EMAIL_FROM,
    SENDCHAMP_EMAIL_URL: process.env.SENDCHAMP_EMAIL_URL,
    SENDCHAMP_PUB_ACCESS_KEY: process.env.SENDCHAMP_PUB_ACCESS_KEY,
};
