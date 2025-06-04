import { Mongoose } from "mongoose";
import mongoose from "mongoose";

export interface IBooking {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    workshopId: mongoose.Types.ObjectId;
    serviceId: mongoose.Types.ObjectId;
    vehicleId: mongoose.Types.ObjectId;
    vihicleName_inEmgrancy: string;
    location: string;
    date: Date;
    status: "pending" | "confirmed" |"in_progress"| "cancelled" | "completed";
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema = new mongoose.Schema<IBooking>({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    workshopId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Workshop" },
    serviceId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Service" },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
    vihicleName_inEmgrancy: { type: String, default: "" },  
    location: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["pending", "confirmed", "in_progress", "cancelled", "completed"], default:"pending" }
}, {
    timestamps:true
});

const BookingModel = mongoose.model<IBooking>("Booking", BookingSchema);
export default BookingModel;