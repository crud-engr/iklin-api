'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('express');
const auth_controller_1 = require('../../controller/user/auth.controller');
const auth_policy_1 = require('../../policy/user/auth.policy');
const router = (0, express_1.Router)();
router
    .route('/basic_signup')
    .post(
        [new auth_policy_1.AuthPolicy().validateBasicRegistration],
        new auth_controller_1.AuthController().saveBasicRegistration,
    );
router
    .route('/activate_basic_signup')
    .post(
        [new auth_policy_1.AuthPolicy().validateActivateBasicRegistration],
        new auth_controller_1.AuthController().activateBasicRegistration,
    );
router
    .route('/complete_signup_process')
    .post(
        [new auth_policy_1.AuthPolicy().validateCompleteSignupProcess],
        new auth_controller_1.AuthController().completeSignupProcess,
    );
router
    .route('/save_location')
    .post(new auth_controller_1.AuthController().saveLocation);
router
    .route('/save_card')
    .post(
        [new auth_policy_1.AuthPolicy().validateSaveCard],
        new auth_controller_1.AuthController().saveCard,
    );
router
    .route('/resend_token')
    .post(
        [new auth_policy_1.AuthPolicy().validateBasicRegistration],
        new auth_controller_1.AuthController().resendToken,
    );
router
    .route('/reset_password')
    .post(
        [new auth_policy_1.AuthPolicy().validateResetPassword],
        new auth_controller_1.AuthController().resetPassword,
    );
router
    .route('/forgot_password')
    .post(new auth_controller_1.AuthController().forgotPassword);
router.route('/login').post(new auth_controller_1.AuthController().login);
exports.default = router;
