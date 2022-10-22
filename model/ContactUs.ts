import mongoose from 'mongoose';

const ContactUsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        subject: {
            type: String,
        },
        message: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export default mongoose.model('ContactUs', ContactUsSchema);
