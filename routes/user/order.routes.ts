import { Router } from 'express';
import { AuthController } from '../../controller/user/auth.controller';
import { OrderController } from '../../controller/user/laundry-order.controller';
import { OrderPolicy } from '../../policy/user/laundry-order.policy';

const router = Router();

// protect all routes after this middleware
router.use(new AuthController().protect);

router
    .route('/laundry')
    .post(
        [new OrderPolicy().validateCreateLaundryOrder],
        new OrderController().createLaundryOrder,
    );

export default router;
