import mongoose from "mongoose";

export interface IService {
    _id?: mongoose.Types.ObjectId;
    workspaceId: mongoose.Types.ObjectId;
    name: string;
    description: string;
    price?: number;
    duration?: number;
    requireApproval: boolean;
    isActive: boolean;
    createdAt: Date;
}

const ServiceSchema = new mongoose.Schema<IService>({
    workspaceId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Workspace" },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, default: 0 },
    duration: { type: Number, default: 0 }, // Duration in minutes
    requireApproval: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

const ServiceModel = mongoose.model<IService>("Service", ServiceSchema);
export default ServiceModel;



