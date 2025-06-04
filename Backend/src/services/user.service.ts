import User,{ IUser } from '../models/User.model';
import Cars,{ICars} from '../models/Cars.model';
import CarInfo,{ICarInfo} from '../models/CarInfo.model';
import mongoose from 'mongoose';

interface FullAddress {
    location: {
        address: string;
        state: string;
        city: string;
    };
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    error?: string;
}

interface IUserService {
    updateUser(user: IUser, userData: Partial<IUser>): Promise<ApiResponse<IUser>>;
    deleteUser(user: IUser): Promise<ApiResponse<IUser>>;
    addPhoto(user: IUser, image: string): Promise<ApiResponse<IUser>>;
    addFullAddress(user: IUser, fullAddress: FullAddress): Promise<ApiResponse<IUser>>;
    addCar(user: IUser, car: ICars): Promise<ApiResponse<IUser>>;
    addCarInfo(user: IUser, carInfo: ICarInfo): Promise<ApiResponse<IUser>>;
    completeProfile(user: IUser): Promise<ApiResponse<IUser>>;
}

