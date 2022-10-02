import express from 'express';
import config from 'config';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

import log from './logger';
import connect from './db/connect';
import routes from './routes/routes';

const port: number = parseInt(config.get('port'));
const host: string = config.get('host');

// start express app
const app = express();
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
const limiter = rateLimit({
    max: 100,
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    message:
        'We received too many requests from this IP. Please try again in 24hrs to this time',
});
app.use('/api', limiter);
app.use(helmet());
app.use(mongoSanitize());
app.use(compression());

app.listen(port, async () => {
    log.info(`Server running on http://${host}:${port}`);
    // start db connection
    await connect();
    // initialize routes
    routes(app);
});
