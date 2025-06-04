import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
    _id: mongoose.Types.ObjectId;
    carId?: mongoose.Types.ObjectId;
    carInfoId?: mongoose.Types.ObjectId;
    username: string;
    email?: string;
    temporaryEmail?: string;
    password: string;
    name: string;
    role: "admin" | "user" | "WorkshropOwner" | "technican" ;
    phone: string;
    googleId?: string;  // Added for Google auth
    location: {
        address?: string;
        city: string;
        state?: string;
    };
    avatar?: string;
    image?: string;
    isVerfied: boolean;
    isCompleted: boolean;
    hasCar: boolean;
    hasCarInfo: boolean;
    hasFullAddress: boolean;
    createdAt: Date;
    updatedAt: Date;
    emailVerificationToken?: string;
    emailVerificationExpires?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    phoneVerificationCode?: string;
    phoneVerificationExpires?: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}


const UserSchema = new mongoose.Schema<IUser>({
    carId: { type: mongoose.Types.ObjectId, ref: "Cars" },
    carInfoId: { type: mongoose.Types.ObjectId, ref: "CarInfo" },
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true, default: "" },
    temporaryEmail: { type: String, default: "" },
    password: { type: String },  // Made optional for Google auth
    name: { type: String, required: true },
    role: { type: String, enum: ["admin", "user", "WorkshropOwner", "technican"]},
    phone: { type: String, unique: true },  // Made optional for Google auth
    location: {
        address: { type: String, default: "" },
        city: { type: String },  // Made optional for Google auth
        state: { type: String, default: "" }
    },
    avatar: { type: String, default: "" },
    googleId: { type: String, unique: true, sparse: true },  // Added for Google auth
    image: { type: String, default: "" },
    isVerfied: { type: Boolean, default: false },
    hasCar: { type: Boolean, default: false },
    hasCarInfo: { type: Boolean, default: false },
    hasFullAddress: { type: Boolean, default: false },
    isCompleted: { 
        type: Boolean, 
        default: function(this: IUser) {
            return this.hasCar && this.hasCarInfo && this.hasFullAddress;
        }
    },
    emailVerificationToken: { type: String, default: "" },
    emailVerificationExpires: { type: Date, default: null },
    passwordResetToken: { type: String, default: "" },
    passwordResetExpires: { type: Date, default: null },
    phoneVerificationCode: { type: String, default: "" },
    phoneVerificationExpires: { type: Date, default: null }
},
{
    timestamps: true
});

UserSchema.pre("save",async function (next) {
    if (!this.isModified("password")) return next();
    try{
        const salt = await bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
        next();

    }catch (error:any) {
        next(error);
    }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error("Error comparing passwords");
    }
}


const UserModel = mongoose.model<IUser>("User", UserSchema);
export default UserModel;