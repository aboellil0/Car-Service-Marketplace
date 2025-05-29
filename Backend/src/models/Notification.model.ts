import mongoose from "mongoose";


export interface Notification {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: "info" | "booking" | "emergancy" | "system";
    isRead: boolean;
    data: object;
    createdAt: Date;
}

const NotificationSchema = new mongoose.Schema<Notification>({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["info", "booking", "emergancy", "system"], default: "info" },
    isRead: { type: Boolean, default: false },
    data: { type: Object, default: {} }
}, {
    timestamps: true
});

const NotificationModel = mongoose.model<Notification>("Notification", NotificationSchema);
export default NotificationModel;