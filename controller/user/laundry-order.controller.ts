import { Request, Response } from 'express';
import { OrderService } from '../../service/user/order.service';

export class OrderController {
    async createLaundryOrder(req: Request, res: Response) {
        try {
            return new OrderService().createLaundryOrder(req, res);
        } catch (err: any) {
            return err;
        }
    }
}
