import mongoose from 'mongoose';
import { ICard } from '../interface/card.interface';

const CardSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        cardNumber: {
            type: String,
        },
        expiry: {
            type: String,
        },
        cvv: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export default mongoose.model<ICard>('Card', CardSchema);
