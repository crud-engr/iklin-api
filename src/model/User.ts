import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
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
        },
        notificationCounter: {
            type: Number,
            default: 0,
        },
        profileImage: {
            type: String,
            default: '',
        },
        // useFingerprint: {
        //     type: Boolean,
        //     default: false,
        // },
        // device_token: {
        //     type: String,
        //     default: '',
        // },
        isDeleted: {
            type: Boolean,
            default: false,
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

export default mongoose.model('User', UserSchema);
