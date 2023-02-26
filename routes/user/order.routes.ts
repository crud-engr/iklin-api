import { Router } from 'express';
import { OrderController } from '../../controller/user/laundry-order.controller';
import { OrderPolicy } from '../../policy/user/laundry-order.policy';

const router = Router();

router
    .route('/laundry')
    .post(
        [new OrderPolicy().validateCreateLaundryOrder],
        new OrderController().createLaundryOrder,
    );

export default router;
