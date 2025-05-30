import mongoose from "mongoose";

export interface IEmergency {
    _id?: mongoose.Types.ObjectId;
    workspaces: mongoose.Types.ObjectId[]; // Array of workspace IDs
    emergencyType: string; // e.g., "Fire", "Medical", "Security"
    description?: string;
    area: {
        city: string;
        state: string;
    }
}


const EmergencySchema = new mongoose.Schema<IEmergency>({
    workspaces: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Workspace" }],
    emergencyType: { type: String, required: true },
    description: { type: String, default: "" },
    area: {
        city: { type: String, required: true },
        state: { type: String, required: true }
    }
}, {
    timestamps: true
});

const EmergencyModel = mongoose.model<IEmergency>("Emergency", EmergencySchema);
export default EmergencyModel;