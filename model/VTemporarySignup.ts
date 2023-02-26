import mongoose from 'mongoose';

const VTemporarySignupSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            default: '',
        },
        lastName: {
            type: String,
            default: '',
        },
        phone: {
            type: String,
            default: '',
        },
        password: {
            type: String,
            default: '',
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
            default: '',
        },
        role: {
            type: String,
            default: 'vendor',
        },
        businessName: {
            type: String,
            default: '',
        },
        businessAddress: {
            type: String,
            default: '',
        },
        profession: {
            type: String,
            default: '',
        },
        nin: {
            type: String,
            default: '',
        },
        cac: {
            type: String,
            default: '',
        },
        isNINVerified: {
            type: Boolean,
            default: false,
        },
        isCACVerified: {
            type: Boolean,
            default: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export default mongoose.model('VTemporarySignup', VTemporarySignupSchema);
