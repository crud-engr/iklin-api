import mongoose from 'mongoose';

const ActivityLogsSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        action: {
            type: String,
            default: '',
        },
        ipAddress: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export default mongoose.model('ActivityLogs', ActivityLogsSchema);
