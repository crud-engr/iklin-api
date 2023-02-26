import mongoose from 'mongoose';

export interface ITemporarySignup extends mongoose.Document {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    location: string;
    role: string;
    activated: boolean;
    password: boolean;
    profileImage: string;
    isLocked: boolean;
    notificationCounter: number;
    activationToken: string;
    businessName: string;
    businessAddress: string;
    profession: string;
    nin: string;
    cac: string;
    isNINVerified: boolean;
    isCACVerified: boolean;
    isVerified: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
