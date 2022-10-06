require('dotenv').config();

export default {
    PORT: process.env.PORT,
    HOST: process.env.HOST,
    DBURI: process.env.DBURI,
    PASSWORD_SALT: process.env.PASSWORD_SALT,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT,
    NODE_ENV: process.env.NODE_ENV,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_USERNAME: process.env.EMAIL_USERNAME,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
};
