import mongoose from 'mongoose';

export interface ICard extends mongoose.Document {
    user: mongoose.Schema.Types.ObjectId;
    cardNumber: string;
    expiry: string;
    cvv: string;
    createdAt: Date;
    updatedAt: Date;
}
