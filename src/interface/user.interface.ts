import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
    referral: string;
    location: string;
    role: string;
    activated: boolean;
    profileImage: string;
    isLocked: boolean;
    notificationCounter: number;
    activationToken: string;
    comparePasswordMatch(password: string): Promise<Boolean>;
    isUserAuthorized(role: string): Promise<Boolean>;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
