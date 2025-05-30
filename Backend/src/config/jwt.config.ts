import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';
import crypto from 'crypto';
import dotenv from 'dotenv';

const JWT_SECRET = process.env.JWT_SECRET as string;
const Jwt_Access_Expires_In = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const Jwt_Refresh_Expires_In = process.env.JWT_REFRESH_EXPIRES_IN || '7d';


interface TokenPayload {
    userId: string;
    email?: string;
    language?: string;
    name?: string;
    role?: string;
}

export const generateAccessToken = (user: User): string => {
    const payload: TokenPayload = {
        userId: user._id.toString(),
        email: user.email,
        language: "ar", // Default language, can be customized
        name: user.name,
        role: user.role,
    };
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "15m",
    });
}


export const generateRefreshToken = (user: User): string => {
    const payload: TokenPayload = {
        userId: user._id.toString(),
        email: user.email,
    }
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "7d",
    });
}

export const verifyToken = (token: string): Promise<TokenPayload> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return reject(err);
            }
            resolve(decoded as TokenPayload);
        });
    });
}

export const gentateVerficationToken = (): string => {
    return crypto.randomUUID();
}

