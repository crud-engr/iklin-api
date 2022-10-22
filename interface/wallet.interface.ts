import mongoose from 'mongoose';

export interface IWallet extends mongoose.Document {
    user: string;
    balance: number;
}
