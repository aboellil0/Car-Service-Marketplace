import mongoose from "mongoose";

export interface CarInfo {
    _id: mongoose.Types.ObjectId;
    year: number;
    color: string;
    plateNumber: string;
    image?:string;
}

const CarInfoSchema = new mongoose.Schema<CarInfo>({
    year: { type: Number, required: true },
    color: { type: String, required: true },
    plateNumber: { type: String, required: true, unique: true },
    image: { type: String, default: "" }
}, {
    timestamps: true
});

const CarInfo = mongoose.model<CarInfo>("CarInfo", CarInfoSchema);
export default CarInfo;