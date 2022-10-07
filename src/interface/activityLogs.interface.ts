import mongoose from 'mongoose';

export interface IActivityLogs {
    user: mongoose.Schema.Types.ObjectId;
    action: string;
    ipAddress: string;
}
