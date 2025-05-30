import { Request,Response,NextFunction } from "express";
import { verifyToken } from "../config/jwt.config";
import User from  "../models/User.model";

export interface AuthRequest extends Request {
    user?:any;
}

export const isAuthenticated = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const user = await User.findById((await decoded).userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const isVerfied = async (req: AuthRequest, res: Response, next: NextFunction) => {
if (!req.user.isVerfied) {
    return res.status(403).json({ message: "User is not verified" });
}
    next();
};

export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "User is not an admin" });
    }
    next();
};
export const isUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user.role !== "user") {
        return res.status(403).json({ message: "User is not a regular user" });
    }
    next();
};

export const isWorkshropOwner = async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user.role !== "WorkshropOwner") {
        return res.status(403).json({ message: "User is not a moderator" });
    }
    next();
};

export const isTechnican = async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user.role !== "technican") {
        return res.status(403).json({ message: "User is not a technican" });
    }
    next();
};