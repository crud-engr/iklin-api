require('dotenv').config();

export default {
    PORT: process.env.PORT,
    DBURI: process.env.DBURI,
    PASSWORD_SALT: process.env.PASSWORD_SALT,
    NODE_ENV: process.env.NODE_ENV,
    EMAIL_NAME_FROM: process.env.EMAIL_NAME_FROM,
    EMAIL_FROM: process.env.EMAIL_FROM,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    TRAEFIK_MANAGER_ID: process.env.TRAEFIK_MANAGER_ID,
    HTTPS_ROUTER_TLS_MODE: process.env.HTTPS_ROUTER_TLS_MODE,
    BASIC_AUTH_USERS: process.env.BASIC_AUTH_USERS,
    HOST: process.env.HOST,
    // SENDGRID_SERVER: process.env.SENDGRID_SERVER,
    // SENDGRID_PORT: process.env.SENDGRID_PORT,
    // SENDGRID_USERNAME: process.env.SENDGRID_USERNAME,
    // SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    // AWS_REGION: process.env.AWS_REGION,
    EMAIL_SERVICE: process.env.EMAIL_SERVICE,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    EMAIL_USERNAME: process.env.EMAIL_USERNAME,
};
