import { Router } from 'express';
import { AuthController } from '../../controller/user/auth.controller';
import { AuthPolicy } from '../../policy/user/auth.policy';

const router = Router();

router
    .route('/basic_signup')
    .post(
        [new AuthPolicy().validateBasicRegistration],
        new AuthController().saveBasicRegistration,
    );

router
    .route('/activate_basic_signup')
    .post(
        [new AuthPolicy().validateActivateBasicRegistration],
        new AuthController().activateBasicRegistration,
    );

export default router;
