// import mongoose from 'mongoose';
import { LaundryModeEnum } from '../enum/laundry-mode.enum';

export interface ILaundryOrder {
    serviceType: string;
    laundryType: string;
    preferredLaundry: string;
    basket: Array<[]>;
    pickupDate: Date;
    deliveryDate: Date;
    laundryMode: LaundryModeEnum;
}
