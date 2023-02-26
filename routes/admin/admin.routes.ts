import { Router } from 'express';
import { AdminController } from '../../controller/admin/admin.controller';

const router = Router();

router
    .route('/vendors')
    .post([], new AdminController().createVendor)
    .get([], new AdminController().fetchVendors);

router
    .route('/orders/laundry')
    .get([], new AdminController().fetchLaundryOrders);

export default router;
