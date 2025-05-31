import mongoose from "mongoose";
import User ,{IUser} from "../models/User.model"
import axios from "axios";
import { generateAccessToken, generateRefreshToken, gentateVerficationToken } from "../config/jwt.config";
import { sendVerdicationEmail, sendPasswordResetEmail } from "../config/email.config";
import { AuthRequest } from "../middleware/auth.middleware";


interface AuthResponse {
    success: boolean;
    message: string;
    accessToken: string;
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
    BusinessName: string;
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
    requestEmailVerification(userId: string): Promise<AuthResponse>;
    verifyEmail(token: string): Promise<AuthResponse>;
    forgetPassword(userId: string): Promise<AuthResponse>;
    resetPassword(token: string, newPassword: string): Promise<AuthResponse>;
    loginWithGoogle(token: string): Promise<AuthResponse>;
}

