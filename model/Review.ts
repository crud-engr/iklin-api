import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vendor',
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);
// prevent dupliacte reviews with index
ReviewSchema.index({ vendor: 1, user: 1 }, { unique: true });

ReviewSchema.pre(/^find/, function (next: any) {
    this.populate('user');
    next();
});

export default mongoose.model('Review', ReviewSchema);
