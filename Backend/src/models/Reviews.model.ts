import mongoose from "mongoose";

export interface IReviews {
    _id?: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    workspaceId: mongoose.Types.ObjectId;
    bookingId: mongoose.Types.ObjectId;
    rating: string;
    comment?: string;
    createdAt: Date;
}


const ReviewsSchema = new mongoose.Schema<IReviews>({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    workspaceId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Workspace" },
    bookingId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Booking" },
    rating: { type: String, required: true },
    comment: { type: String, default: "" }
}, {
    timestamps: true
});

const ReviewsModel = mongoose.model<IReviews>("Reviews", ReviewsSchema);
export default ReviewsModel;