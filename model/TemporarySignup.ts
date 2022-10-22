import mongoose from 'mongoose';

const TemporarySignupSchema = new mongoose.Schema(
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
            default: 'user',
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export default mongoose.model('TemporarySignup', TemporarySignupSchema);
