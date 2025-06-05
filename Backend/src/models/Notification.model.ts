import mongoose from "mongoose";


export interface INotification {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: 'BOOKING_CREATED' | 'BOOKING_ACCEPTED' | 'BOOKING_REJECTED' | 'BOOKING_COMPLETED' | 'EMERGENCY_BROADCAST' | 'EMERGENCY_ACCEPTED' | 'SYSTEM_ANNOUNCEMENT';
    isRead: boolean;
    data: object;
    createdAt: Date;
}

const NotificationSchema = new mongoose.Schema<INotification>({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['BOOKING_CREATED', 'BOOKING_ACCEPTED', 'BOOKING_REJECTED', 'BOOKING_COMPLETED', 'EMERGENCY_BROADCAST', 'EMERGENCY_ACCEPTED', 'SYSTEM_ANNOUNCEMENT'] },
    isRead: { type: Boolean, default: false },
    data: { type: Object, default: {} }
}, {
    timestamps: true
});
const NotificationModel = mongoose.model<INotification>("Notification", NotificationSchema);
export default NotificationModel;
