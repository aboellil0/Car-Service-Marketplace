import mongoose from "mongoose";
import User,{ IUser } from "./User.model";


export interface IWorkshop {
    id: mongoose.Types.ObjectId;
    ownerId: mongoose.Types.ObjectId;
    BusinessName: string;
    discription?: string;
    LicenceNumber?:string;
    images?: string[];
    avatar?: string;
    location: {
        address: string;
        city: string;
        state: string;
        map?: string; // Optional field for map link
    }
    services?: mongoose.Types.ObjectId[];
    WorkingHours?: {
        days: string;
        openTime: string;
        closeTime: string;
    }[];
    isverified: boolean;
    phone: string[];
    hasEmergencyService: boolean;
    reviews: mongoose.Types.ObjectId[]; 
    createdAt: Date;
    updatedAt: Date;
}

const WorkshopSchema = new mongoose.Schema<IWorkshop>({
    ownerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    BusinessName: { type: String, required: true },
    discription: { type: String, default: "" },
    LicenceNumber: { type: String, default: "" },
    images: { type: [String], default: [] },
    avatar: { type: String, default: "" },
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        map: { type: String, default: "" } // Optional field for map link
    },
    services: [{ type: mongoose.Types.ObjectId, ref: "Service", required:true }],
    WorkingHours: [{
        day: { type: String,default: "" },
        openTime:{type:String,default:"" },
        closeTime:{type:String,default:"" }
    }],
    isverified: { type: Boolean, default: false },
    phone:[{type:String}],
    hasEmergencyService:{type:Boolean,default:false},
    reviews:[{type:mongoose.Types.ObjectId,ref:"Review"}]
}, {
    timestamps:true
});


const WorkshopModel = mongoose.model<IWorkshop>("Workshop", WorkshopSchema);
export default WorkshopModel;