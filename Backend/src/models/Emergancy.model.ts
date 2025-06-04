import mongoose from "mongoose";

export interface IEmergency {
    _id?: mongoose.Types.ObjectId;
    workspaces: mongoose.Types.ObjectId[]; // Array of workspace IDs
    emergencyType: string; // e.g., "Fire", "Medical", "Security"
    description?: string;
    status: "broadcasting" | "accepted" | "completed";
    phone: string;
    car: string;
    city: string;
    sharedlocation: string;
}


const EmergencySchema = new mongoose.Schema<IEmergency>({
    workspaces: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Workshop" }],
    emergencyType: { type: String, required: true },
    description: { type: String, default: "" },
    status:{type: String,enum:["broadcasting" ,"accepted" ,"completed"]},
    phone: {type:String, required:true},
    car:{type:String,required:true},
    sharedlocation:{type:String,required:true},
    city:{type:String,required:true}
}, {
    timestamps: true
});

const EmergencyModel = mongoose.model<IEmergency>("Emergency", EmergencySchema);
export default EmergencyModel;