import mongoose from "mongoose";

export interface ICarInfo {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    year: number;
    color: string;
    plateNumber: string;
    image?: string;
}

const CarInfoSchema = new mongoose.Schema<ICarInfo>({
    year: { type: Number, required: true },
    color: { type: String, required: true },
    plateNumber: { type: String, required: true, unique: true },
    image: { type: String, default: "" },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true }
}, {
    timestamps: true
});

const CarInfo = mongoose.model<ICarInfo>("CarInfo", CarInfoSchema);
export default CarInfo;