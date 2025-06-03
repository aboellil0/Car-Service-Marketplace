import mongoose from "mongoose";
import User ,{IUser} from "../models/User.model"
import axios from "axios";
import { generateAccessToken, generateRefreshToken, gentateVerficationToken, revokeRefreshToken, verifyToken } from "../config/jwt.config";
import { sendVerdicationEmail, sendPasswordResetEmail } from "../config/email.config";
import { AuthRequest } from "../middleware/auth.middleware";
import { resolve } from "path";
import { rejects } from "assert";
import { error } from "console";



interface GeneralResponse {
    success: boolean;
    message: string;
}

interface AuthResponse extends GeneralResponse {
    accessToken: string;
    refreshToken: string;
}

interface RegisterDto{
    username: string;
    password: string;
    phone: string;
}

interface CustomerRegisterDto extends RegisterDto {
    role: "customer";
    location:{
        city: string;
    };
}

interface Workshop_OwnerRegisterDto extends RegisterDto {
    role: "workshop_owner";
    businessName: string;
    location: {
        address: string;
        city: string;
        state: string;
        mapLink?: string;
    };
}
    
export interface IAuthService {
    registerCustomer(userData: CustomerRegisterDto): Promise<AuthResponse>;
    registerWorkshopOwner(userData: Workshop_OwnerRegisterDto): Promise<AuthResponse>;
    loginWithUsername(username: string, password: string): Promise<AuthResponse>;
    loginWithEmail(email: string, password: string): Promise<AuthResponse>;
    logoutUser(userId: string): Promise<AuthResponse>;
    refreshToken(refreshToken: string): Promise<AuthResponse>;
    requestAddEmail(userId: mongoose.Types.ObjectId, email: string): Promise<GeneralResponse>;
    saveEmail(userId: mongoose.Types.ObjectId, email: string): Promise<GeneralResponse>;
    forgetPassword(userId: string): Promise<GeneralResponse>;
    resetPassword(token: string, newPassword: string): Promise<GeneralResponse>;
    loginWithGoogle(token: string): Promise<AuthResponse>;
}


class AuthService implements IAuthService{
    async registerCustomer(userData: CustomerRegisterDto): Promise<AuthResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                const { username, password, phone, location } = userData;
                const existingUser = await User.findOne({ username });
                if (existingUser) {
                    return reject({ success: false, message: "Username already exists" });
                }

                const newUser = new User({
                    username,
                    password,
                    phone,
                    role: "customer",
                    location
                });

                await newUser.save();
                const accessToken = generateAccessToken(newUser);
                const refreshToken = generateRefreshToken(newUser);
                
                resolve({
                    success: true,
                    message: "Customer registered successfully",
                    accessToken,
                    refreshToken
                });
            } catch (error) {
                reject({ success: false, message: "An unexpected error occurred. Please try again later." });
            }
        });
    }

    async registerWorkshopOwner(userData: Workshop_OwnerRegisterDto): Promise<AuthResponse> {
        return new Promise(async (resolve,reject) =>{
            try{
                const {username,password,phone,businessName,location} = userData;

                const existingUser = await User.findOne({ username });
                if (existingUser) {
                    return reject({ success: false, message: "Username already exists" });
                }

                const newUser = new User({
                    username,
                    password,
                    phone,
                    role: "workshop_owner",
                    location
                });

                await newUser.save();
                const accessToken = generateAccessToken(newUser);
                const refreshToken = generateRefreshToken(newUser);
                
                resolve({
                    success: true,
                    message: "workshop_owner",
                    accessToken,
                    refreshToken
                });

            }catch(error){
                reject({success:false,message:error})
            }
        })
    }

    // async addEmail(userId: mongoose.Types.ObjectId): Promise<AuthResponse> {
    //     return new Promise(async (resolve,reject)=>{
    //         try{
    //             const user = await User.findById(userId);
    //             if (!user) {
    //                 return reject({ success: false, message: "User not found" });
    //             }
    //             const { email } = user;
    //             if (!email) {
    //                 return reject({ success: false, message: "Email is required" });
    //             }

    //             const existingUser = await User.findOne({ email });
    //             if (existingUser) {
    //                 return reject({ success: false, message: "Email already exists" });
    //             }
                
    //             user.email = email;
    //             await user.save();

    //             resolve({
    //                 success: true,
    //                 message: "Email added successfully",
    //                 accessToken: generateAccessToken(user),
    //                 refreshToken: generateRefreshToken(user)
    //             });
    //         } catch (error) {
    //             reject({ success: false, message: error });
    //         }
    //     })
    // }

    async loginWithUsername(username: string, password: string): Promise<AuthResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.findOne({ username });
                if (!user || !(await user.comparePassword(password))) {
                    return reject({ success: false, message: "Invalid username or password" });
                }

                const accessToken = generateAccessToken(user);
                const refreshToken = generateRefreshToken(user);

                resolve({
                    success: true,
                    message: "Login successful",
                    accessToken,
                    refreshToken
                });
            } catch (error) {
                reject({ success: false, message: error });
            }
        });
    }

    async loginWithEmail(email: string, password: string): Promise<AuthResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.findOne({ email });
                if (!user || !(await user.comparePassword(password))) {
                    return reject({ success: false, message: "Invalid email or password" });
                }

                const accessToken = generateAccessToken(user);
                const refreshToken = generateRefreshToken(user);

                resolve({
                    success: true,
                    message: "Login successful",
                    accessToken,
                    refreshToken
                });
            } catch (error) {
                reject({ success: false, message: error });
            }
        });
    }

    async logoutUser(userId: string): Promise<AuthResponse> {
        return new Promise((resolve, reject) => {
            try {
                // Logic to invalidate the user's session or token
                revokeRefreshToken(userId);
                resolve({
                    success: true,
                    message: "User logged out successfully",
                    accessToken: "",
                    refreshToken: ""
                });
            } catch (error) {
                reject({ success: false, message: error });
            }
        });
    }

    async refreshToken(refreshToken: string): Promise<AuthResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                const decoded = await verifyToken(refreshToken);
                const user = await User.findById(decoded.userId);
                if (!user) {
                    return reject({ success: false, message: "User not found" });
                }

                const newAccessToken = generateAccessToken(user);
                const newRefreshToken = generateRefreshToken(user);

                resolve({
                    success: true,
                    message: "Tokens refreshed successfully",
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken
                });
            } catch (error) {
                reject({ success: false, message: error });
            }
        });
    }

    async requestAddEmail(userId: mongoose.Types.ObjectId, email: string): Promise<GeneralResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.findById(userId);
                if (!user) {
                    return reject({ success: false, message: "User not found" });
                }

                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    return reject({ success: false, message: "Email already exists" });
                }

                user.emailVerificationToken = gentateVerficationToken();
                user.emailVerificationExpires = new Date(Date.now() + 3600000); 
                user.temporaryEmail = email; // Store the email temporarily
                await user.save();

                await sendVerdicationEmail(email, user.emailVerificationToken);

                resolve({
                    success: true,
                    message: "Verification email sent successfully"
                });
            } catch (error) {
                reject({ success: false, message: error });
            }
        });
    }

    async saveEmail(userId: mongoose.Types.ObjectId, token: string): Promise<GeneralResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.findOne({ 
                  emailVerificationToken: token,
                  emailVerificationExpires: { $gt: new Date(Date.now()) } // Ensure comparison is done with a Date object
                });

                if (!user) {
                    return reject({ success: false, message: "User not found" });
                }

                if (user.emailVerificationToken !== token) {
                    return reject({ success: false, message: "Invalid or expired verification token" });
                }

                user.email = user.temporaryEmail; 
                user.temporaryEmail = undefined;
                await user.save();

                resolve({
                    success: true,
                    message: "Email saved successfully"
                });
            } catch (error) {
                reject({ success: false, message: error });
            }
        });
    }
    
}

