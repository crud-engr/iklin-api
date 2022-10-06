import mongoose from 'mongoose';

const TemporarySignupSchema = new mongoose.Schema(
    {
        email: {
            type: String,
        },
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        phone: {
            type: String,
        },
        password: {
            type: String,
        },
        confirmPassword: {
            type: String,
        },
        referral: {
            type: String,
            default: '',
        },
        location: {
            type: String,
            default: '',
        },
        addLocation: {
            type: Boolean,
            default: false,
        },
        addCard: {
            type: Boolean,
            default: false,
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
