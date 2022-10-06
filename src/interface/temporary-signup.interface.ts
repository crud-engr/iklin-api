import mongoose from 'mongoose';

export interface ITemporarySignup extends mongoose.Document {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
    confirmPassword: string;
    referral: string;
    location: string;
    role: string;
    addLocation: boolean;
    addCard: boolean;
    activated: boolean;
    activationToken: string;
    createdAt: Date;
    updatedAt: Date;
}
