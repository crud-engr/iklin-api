'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
const index_routes_1 = __importDefault(require('./index.routes'));
const health_routes_1 = __importDefault(require('./health.routes'));
const auth_routes_1 = __importDefault(require('./user/auth.routes'));
const contact_routes_1 = __importDefault(require('./contact.routes'));
// import RoleRoute from './role.routes';
function default_1(app) {
    app.use((req, res, next) => {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept',
        );
        next();
    });
    // general routes
    app.use('/', index_routes_1.default);
    app.use('/health_check', health_routes_1.default);
    app.use('/api/contact_us', contact_routes_1.default);
    // user routes
    app.use('/api/users/auth', auth_routes_1.default);
}
exports.default = default_1;
