import mongoose from "mongoose";
import User ,{IUser} from "../models/User.model"
import axios from "axios";
import { generateAccessToken, generateRefreshToken, gentateVerficationToken } from "../config/jwt.config";
import { sendVerdicationEmail, sendPasswordResetEmail } from "../config/email.config";
import { AuthRequest } from "../middleware/auth.middleware";

export interface IAuthService {
    registerUser(userData: IUser): Promise<IUser>;
    loginUser(email: string, password: string): Promise<{ user: IUser; accessToken: string; refreshToken: string }>;
    logoutUser(userId: string): Promise<void>;
    refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }>;
    verifyEmail(token: string): Promise<IUser>;
    requestPasswordReset(email: string): Promise<void>;
    forgotPassword(token: string): Promise<IUser>;
    resetPassword(token: string, newPassword: string): Promise<IUser>;
    loginWithGoogle(token: string): Promise<{ user: IUser; accessToken: string; refreshToken: string }>;
}

