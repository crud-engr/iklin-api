import mongoose from 'mongoose';
import crypto from 'crypto';
import { IWallet } from '../interface/wallet.interface';

const WalletSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        balance: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true, versionKey: false },
);

export default mongoose.model<IWallet>('Wallet', WalletSchema);
