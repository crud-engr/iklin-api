import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { IVendor } from '../interface/vendor.interface';

const VendorSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            default: '',
        },
        activated: {
            type: Boolean,
            default: false,
        },
        activationToken: {
            type: String,
        },
        notificationCounter: {
            type: Number,
            default: 0,
        },
        profileImage: {
            type: String,
            default: '',
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        isLocked: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            default: 'vendor',
        },
        password: {
            type: String,
            required: true,
        },
        businessName: {
            type: String,
        },
        businessAddress: {
            type: String,
        },
        profession: {
            type: String,
        },
        isNINVerified: {
            type: Boolean,
            default: false,
        },
        nin: {
            type: String,
        },
        cac: {
            type: String,
        },
        isCACVerified: {
            type: Boolean,
            default: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        ratings: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Rating',
        },
        isOpen: {
            type: Boolean,
            default: true,
        },
        mostWashedItems: [{ item: String, quantity: Number }],
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

VendorSchema.methods.comparePasswordMatch = async function (
    password: string,
): Promise<Boolean> {
    return await bcrypt.compare(password, this.password);
};

VendorSchema.methods.isUserAuthorized = function (role: string): boolean {
    return this.role === role ? true : false;
};

export default mongoose.model<IVendor>('Vendor', VendorSchema);
