import { Express, Request, Response, NextFunction } from 'express';
import IndexRoute from './index.routes';
import HealthcheckRoute from './health.routes';
// import UserRoute from './user/user.routes';
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

    // role routes
    // app.use('/api/roles', RoleRoute);

    // user routes
    // app.use('/api/users', UserRoute);
}
