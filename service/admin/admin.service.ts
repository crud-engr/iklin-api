import { Request, Response } from 'express';
import LaundryOrder from '../../model/LaundryOrder';
import Vendor from '../../model/Vendor';

export class AdminService {
    async createVendor(req: Request, res: Response) {
        const email: string = req.body.email;
        const firstName: string = req.body.firstName;
        const lastName: string = req.body.lastName;
        const phone: string = req.body.phone;
        const businessName: string = req.body.businessName;
        const businessAddress: string = req.body.businessAddress;
        const profession: string = req.body.profession;

        const vendor = await Vendor.create({
            email,
            firstName,
            lastName,
            phone,
            businessName,
            businessAddress,
            profession,
        });
        return res.status(201).json({
            status: 'success',
            message: 'Vendor successfully created',
            data: { vendor },
            code: 201,
        });
    }

    async fetchVendors(req: Request, res: Response) {
        const vendors = await Vendor.find({}).exec();
        return res.status(200).json({
            status: 'success',
            message: 'Vendor successfully fetched',
            recordCount: vendors.length,
            data: { vendors },
            code: 200,
        });
    }

    async fetchLaundryOrders(req: Request, res: Response) {
        const orders = await LaundryOrder.find({}).exec();
        return res.status(200).json({
            status: 'success',
            message: 'Orders successfully fetched',
            recordCount: orders.length,
            data: { orders },
            code: 200,
        });
    }
}
