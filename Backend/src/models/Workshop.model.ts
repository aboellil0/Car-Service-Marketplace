import mongoose from "mongoose";
import { User } from "./User.model";
export interface Workshop {

    id: mongoose.Types.ObjectId;
    ownerId: mongoose.Types.ObjectId;
    BusinessName: string;
    discription: string;
    LicenceNumber?:string;
    images?: string[];
    avatar?: string;
    location: {
        address: string;
        city: string;
        state: string;
    }
    services: mongoose.Types.ObjectId[];
    WorkingHours: {
        day: string;
        openTime: string;
        closeTime: string;
    }[];
    phone: string[];
    hasEmergencyService: boolean;
    reviews: mongoose.Types.ObjectId[]; 
    createdAt: Date;
    updatedAt: Date;
}

const WorkshopSchema = new mongoose.Schema<Workshop>({
    ownerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    BusinessName: { type: String, required: true },
    discription: { type: String, required: true },
    LicenceNumber: { type: String, default: "" },
    images: { type: [String], default: [] },
    avatar: { type: String, default: "" },
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true }
    },
    services: [{ type: mongoose.Types.ObjectId, ref: "Service", required:true }],
    WorkingHours: [{
        day: { type: String, required:true },
        openTime:{type:String,required:true},
        closeTime:{type:String,required:true}
    }],
    phone:[{type:String}],
    hasEmergencyService:{type:Boolean,default:false},
    reviews:[{type:mongoose.Types.ObjectId,ref:"Review"}]
}, {
    timestamps:true
});


const WorkshopModel = mongoose.model<Workshop>("Workshop", WorkshopSchema);
export default WorkshopModel;