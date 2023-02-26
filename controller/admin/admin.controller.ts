import { Request, Response } from 'express';
import { AdminService } from '../../service/admin/admin.service';

export class AdminController {
    async createVendor(req: Request, res: Response) {
        try {
            return new AdminService().createVendor(req, res);
        } catch (err) {
            return res.status(500).json({
                status: 'error',
                message: 'an error occured',
                code: 500,
            });
        }
    }

    async fetchVendors(req: Request, res: Response) {
        try {
            return new AdminService().fetchVendors(req, res);
        } catch (err) {
            return res.status(500).json({
                status: 'error',
                message: 'an error occured',
                code: 500,
            });
        }
    }

    async fetchLaundryOrders(req: Request, res: Response) {
        try {
            return new AdminService().fetchLaundryOrders(req, res);
        } catch (err) {
            return res.status(500).json({
                status: 'error',
                message: 'an error occured',
                code: 500,
            });
        }
    }
}
