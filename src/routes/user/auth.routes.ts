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

router
    .route('/complete_signup_process')
    .post(
        [new AuthPolicy().validateCompleteSignupProcess],
        new AuthController().completeSignupProcess,
    );

router.route('/save_location').post(new AuthController().saveLocation);
router
    .route('/save_card')
    .post([new AuthPolicy().validateSaveCard], new AuthController().saveCard);

export default router;
