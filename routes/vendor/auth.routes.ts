import { Router } from 'express';
import { VAuthController } from '../../controller/vendor/auth.controller';
import { AuthPolicy } from '../../policy/vendor/auth.policy';

const router = Router();

router
    .route('/basic_signup')
    .post(
        [new AuthPolicy().validateBasicRegistration],
        new VAuthController().saveBasicRegistration,
    );

router
    .route('/activate_basic_signup')
    .post(
        [new AuthPolicy().validateActivateBasicRegistration],
        new VAuthController().activateBasicRegistration,
    );

router
    .route('/complete_signup_process')
    .post(
        [new AuthPolicy().validateCompleteSignupProcess],
        new VAuthController().completeSignupProcess,
    );

router
    .route('/resend_token')
    .post(
        [new AuthPolicy().validateBasicRegistration],
        new VAuthController().resendToken,
    );

router
    .route('/reset_password')
    .post(
        [new AuthPolicy().validateResetPassword],
        new VAuthController().resetPassword,
    );

router.route('/forgot_password').post(new VAuthController().forgotPassword);

router
    .route('/login')
    .post([new AuthPolicy().validateLogin], new VAuthController().login);

export default router;
