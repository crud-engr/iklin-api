require('dotenv').config();

export default {
    port: process.env.port,
    host: process.env.host,
    dbURI: process.env.dbURI,
    password_salt: process.env.password_salt,
};
