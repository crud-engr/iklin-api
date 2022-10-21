import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../interface/user.interface';

const UserSchema = new mongoose.Schema(
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
        password: {
            type: String,
            required: true,
        },
        referral: {
            type: String,
            default: '',
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
        // useFingerprint: {
        //     type: Boolean,
        //     default: false,
        // },
        // device_token: {
        //     type: String,
        //     default: '',
        // },
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
            default: 'user',
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

UserSchema.methods.comparePasswordMatch = async function (
    password: string,
): Promise<Boolean> {
    return await bcrypt.compare(password, this.password);
};

UserSchema.methods.isUserAuthorized = function (role: string): boolean {
    return this.role === role ? true : false;
};

export default mongoose.model<IUser>('User', UserSchema);
