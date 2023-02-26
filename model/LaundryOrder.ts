import { NextFunction } from 'express';
import mongoose from 'mongoose';
import { ILaundryOrder } from '../interface/order.interface';

const OrderSchema = new mongoose.Schema(
    {
        serviceType: {
            type: String,
        },
        laundryType: {
            type: String,
        },
        preferredLaundry: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vendor',
        },
        basket: [
            {
                quantity: Number,
                name: String,
            },
        ],
        pickupDate: {
            type: String,
        },
        deliveryDate: {
            type: String,
        },
        laundryMode: {
            type: String,
        },
        isLaundryConfirmed: {
            type: Boolean,
            default: false,
        },
        isLaundryStarted: {
            type: Boolean,
            default: false,
        },
        isLaundryReadyForDelivery: {
            type: Boolean,
            default: false,
        },
        isLaundryDelivered: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

OrderSchema.pre(/^find/, function (next: any) {
    this.populate({
        path: 'preferredLaundry',
        select: '-_id -role -location -notificationCounter -activated -updatedAt -createdAt -isLocked -isDeleted',
    });
    next();
});

export default mongoose.model<ILaundryOrder>('LaundryOrder', OrderSchema);
