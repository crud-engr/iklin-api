import mongoose from 'mongoose';

export interface IContactUs extends mongoose.Document {
    name: string;
    email: string;
    subject: string;
    message: string;
}
