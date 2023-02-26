import mongoose from 'mongoose';
import { LaundryModeEnum } from '../enum/laundry-mode.enum';

export interface ILaundryOrder extends mongoose.Document {
    serviceType: string;
    laundryType: string;
    preferredLaundry: mongoose.Schema.Types.ObjectId;
    basket: Array<[]>;
    pickupDate: Date;
    deliveryDate: Date;
    laundryMode: LaundryModeEnum;
}
