import mongoose from 'mongoose';

export interface IActivityLogs extends mongoose.Document {
    user: mongoose.Schema.Types.ObjectId;
    action: string;
    ipAddress: string;
}
