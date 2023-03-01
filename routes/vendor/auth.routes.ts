import { Router } from 'express';
import { AuthController } from '../../controller/vendor/auth.controller';
import { AuthPolicy } from '../../policy/vendor/auth.policy';

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

router
    .route('/complete_signup_process')
    .post(
        [new AuthPolicy().validateCompleteSignupProcess],
        new AuthController().completeSignupProcess,
    );

router
    .route('/resend_token')
    .post(
        [new AuthPolicy().validateBasicRegistration],
        new AuthController().resendToken,
    );

router
    .route('/reset_password')
    .post(
        [new AuthPolicy().validateResetPassword],
        new AuthController().resetPassword,
    );

router.route('/forgot_password').post(new AuthController().forgotPassword);

router
    .route('/login')
    .post([new AuthPolicy().validateLogin], new AuthController().login);

export default router;
