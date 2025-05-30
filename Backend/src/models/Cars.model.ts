import mongoose from "mongoose";

export interface ICars {
    _id: mongoose.Types.ObjectId;
    brand: string;
    brandEnglish: string;
    country?: string;
    models: string[];
    year: number;
}

const CarSchema = new mongoose.Schema<ICars>({
    brand: { type: String, required: true },
    brandEnglish: { type: String, required: true },
    country: { type: String, default: "" },
    models: { type: [String], required: true },
    year: { type: Number, required: true }
}, {
    timestamps: true
});


const Cars = mongoose.model<ICars>("Cars", CarSchema);
export default Cars;