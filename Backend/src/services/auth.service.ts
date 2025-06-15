import mongoose from "mongoose";
import User ,{IUser} from "../models/User.model"
import axios from "axios";
import { generateAccessToken, generateRefreshToken, gentateVerficationToken, revokeRefreshToken, verifyToken } from "../config/jwt.config";
import { sendVerdicationEmail, sendPasswordResetEmail } from "../config/email.config";
import { AuthRequest } from "../middleware/auth.middleware";
import { resolve } from "path";
import { rejects } from "assert";
import { error } from "console";
import { getGoogleUser } from "../config/google.config";
import WorkshopService,{IWorkshopService} from "./workshop.service";

interface GoogleProfile{
    id: string;
    email: string;
    name: string;
    picture: string;
    verified_email: boolean;
    given_name: string;
    family_name: string;
    locale: string;
}

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
    loginWithGoogle(code: string): Promise<AuthResponse>;
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

                const workshop = {
                    owner: newUser._id,
                    businessName,
                    location: {                
                        address: userData.location.address,
                        city: userData.location.city,
                        state: userData.location.state,
                        mapLink: userData.location.mapLink
                    }
                };
                
                const workshopService = new WorkshopService();
                const newWorkshop= await workshopService.createWorkshop(workshop, newUser._id.toString());
                if (!newWorkshop.success) {
                    return reject({ success: false, message: "Failed to create workshop" });
                }
                
                const accessToken = generateAccessToken(newUser);
                const refreshToken = generateRefreshToken(newUser);
                
                resolve({
                    success: true,
                    message: "Workshop owner registered successfully",
                    accessToken,
                    refreshToken
                });

            }catch(error){
                reject({success:false,message:error})
            }
        })
    }

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
    async forgetPassword(userId: string): Promise<GeneralResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.findById(userId);
                if (!user) {
                    return reject({ success: false, message: "User not found" });
                }

                user.passwordResetToken = gentateVerficationToken();
                user.passwordResetExpires = new Date(Date.now() + 3600000); 
                await user.save();

                if (!user.email) {
                    return reject({ success: false, message: "Email not found for user" });
                }
                await sendPasswordResetEmail(user.email, user.passwordResetToken);

                resolve({
                    success: true,
                    message: "Password reset email sent successfully"
                });
            } catch (error) {
                reject({ success: false, message: error });
            }
        });
    }

    async resetPassword(token: string, newPassword: string): Promise<GeneralResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.findOne({ 
                    passwordResetToken: token,
                    passwordResetExpires: { $gt: new Date(Date.now()) } 
                });

                if (!user) {
                    return reject({ success: false, message: "Invalid or expired password reset token" });
                }

                user.password = newPassword; 
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
                await user.save();

                resolve({
                    success: true,
                    message: "Password reset successfully"
                });
            } catch (error) {
                reject({ success: false, message: error });
            }
        });
    }

    async loginWithGoogle(code: string): Promise<AuthResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                const googleUser = await getGoogleUser(code) as GoogleProfile;
                
                let user = await User.findOne({ googleId: googleUser.id });
                
                if (!user) {
                    // Check if user exists with the same email
                    user = await User.findOne({ email: googleUser.email });
                    
                    if (user) {
                        // Link Google account to existing user
                        user.googleId = googleUser.id;
                        user.isVerfied = true;
                        await user.save();
                    } else {
                        // Create new user
                        const username = googleUser.email.split('@')[0] + '_' + Math.random().toString(36).substring(2, 5);
                        user = new User({
                            username,
                            email: googleUser.email,
                            name: googleUser.name,
                            googleId: googleUser.id,
                            role: 'user',
                            isVerfied: true,
                            avatar: googleUser.picture
                        });
                        await user.save();
                    }
                }

                const accessToken = generateAccessToken(user);
                const refreshToken = generateRefreshToken(user);

                resolve({
                    success: true,
                    message: "Google login successful",
                    accessToken,
                    refreshToken
                });
            } catch (error) {
                reject({ 
                    success: false, 
                    message: "Google authentication failed",
                    accessToken: "",
                    refreshToken: ""
                });
            }
        });
    }
}

