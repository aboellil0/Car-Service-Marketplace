import { Request,Response,NextFunction } from "express";
import { verifyToken } from "../config/jwt.config";
import User,{IUser} from  "../models/User.model";

export interface AuthRequest extends Request {
    user?:any;
}



export const HasCar = async (req: AuthRequest, res: Response, next: NextFunction) => {
if (!req.user.hasCar) {
    return res.status(403).json({ message: "User is not not add a Car" });
}
    next();
};

export const HasCarInfo = async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user.hasCarInfo) {
        return res.status(403).json({ message: "User is not not add a information of his car" });
    }
        next();
};

export const HasFullAddress = async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user.hasFullAddress) {
        return res.status(403).json({ message: "User is not not add a his address" });
    }
        next();
};

export const IsCompleted = async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user.IsCompleted) {
        return res.status(403).json({ message: "User is not not completed his profile" });
    }
        next();
};