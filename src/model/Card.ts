import mongoose from 'mongoose';

const CardSchema = new mongoose.Schema(
    {
        cardNumber: {
            type: String,
        },
        expiry: {
            type: Date,
        },
        cvv: {
            type: Number,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export default mongoose.model('Card', CardSchema);
