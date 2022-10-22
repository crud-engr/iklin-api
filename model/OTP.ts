import mongoose from 'mongoose';

const OTPSchema = new mongoose.Schema(
    {
        email: {
            type: String,
        },
        otpCode: {
            type: String,
        },
        expiry: {
            type: Date,
        },
        used: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export default mongoose.model('OTP', OTPSchema);
