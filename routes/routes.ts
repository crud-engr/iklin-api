import { Express, Request, Response, NextFunction } from 'express';
import IndexRoute from './index.routes';
import HealthcheckRoute from './health.routes';
import UserAuthRoute from './user/auth.routes';
import ContactRoute from './contact.routes';
// import RoleRoute from './role.routes';

export default function (app: Express) {
    app.use((req: Request, res: Response, next: NextFunction) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept',
        );
        next();
    });

    // general routes
    app.use('/', IndexRoute);
    app.use('/health_check', HealthcheckRoute);
    app.use('/api/contact_us', ContactRoute);

    // user routes
    app.use('/api/users/auth', UserAuthRoute);
}
