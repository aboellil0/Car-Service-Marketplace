import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface User {
    _id: mongoose.Types.ObjectId;
    email: string;
    password: string;
    name: string;
    role: "admin" | "user" | "WorkshropOwner" | "technican" ;
    phone: string;
    address: string;
    avatar: string;
    image: string;
    isVerfied: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    emailVerificationToken?: string;
    emailVerificationExpires?: Date;
    phoneVerificationCode?: string;
    phoneVerificationExpires?: Date;
}


const UserSchema = new mongoose.Schema<User>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["admin", "user", "WorkshropOwner", "technican"], default: "user" },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    avatar: { type: String, default: "" },
    image: { type: String, default: "" },
    isVerfied: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    emailVerificationToken: { type: String, default: "" },
    emailVerificationExpires: { type: Date, default: null },
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


const UserModel = mongoose.model<User>("User", UserSchema);
export default UserModel;