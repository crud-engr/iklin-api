import { Request, Response } from 'express';
import { ServiceTypeEnum } from '../../enum/service-type.enum';
import LaundryOrder from '../../model/LaundryOrder';

export class OrderService {
    async createLaundryOrder(req: Request, res: Response) {
        const serviceType: string = req.body.serviceType;
        const laundryType: string = req.body.laundryType;
        const preferredLaundry: string = req.body.preferredLaundry;
        const basket: Array<[]> = req.body.basket;
        const pickupDate: Date = req.body.pickupDate;
        const deliveryDate: Date = req.body.deliveryDate;
        const laundryMode: string = req.body.laundryMode;
        // service option
        const laundryServiceType = ServiceTypeEnum.LAUNDRY;
        if (laundryServiceType !== serviceType) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid service type option',
                code: 400,
            });
        }
        if (basket.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'basket cannot be empty',
                code: 400,
            });
        }
        // create new order
        const newOrder = await LaundryOrder.create({
            serviceType,
            laundryType,
            preferredLaundry,
            basket,
            pickupDate,
            deliveryDate,
            laundryMode,
        });
        return res.status(201).json({
            status: 'success',
            message: 'Order successfully created',
            data: { newOrder },
            code: 201,
        });
    }

    async fetchLaundryOrders(res: Response) {
        const orders = await LaundryOrder.find({}).populate('preferredLaundry');
        return res.status(200).json({
            status: 'success',
            message: 'Order successfully fetched',
            recordCount: orders.length,
            data: { orders },
            code: 200,
        });
    }
}
