import mongoose from 'mongoose';
import config from 'config';
import log from '../logger';

const connect = async () => {
    const dbURI: string = config.get('dbURI');

    try {
        const db = await mongoose.connect(dbURI, {});
        log.info(`database connected: ${db.connection.host}`);
    } catch (error) {
        log.error(`database connection error: ${error}`);
        process.exit(1);
    }
};

export default connect;
