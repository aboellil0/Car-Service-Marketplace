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
    updateUser(userId: string, userData: Partial<IUser>): Promise<ApiResponse<IUser>>;
    deleteUser(user: IUser): Promise<ApiResponse<IUser>>;
    addPhoto(user: IUser, image: string): Promise<ApiResponse<IUser>>;
    addFullAddress(user: IUser, fullAddress: FullAddress): Promise<ApiResponse<IUser>>;
    addCar(user: IUser, car: ICars): Promise<ApiResponse<IUser>>;
    addCarInfo(user: IUser, carInfo: ICarInfo): Promise<ApiResponse<IUser>>;
    completeProfile(user: IUser): Promise<ApiResponse<IUser>>;
}


class UserService implements IUserService {
    async updateUser(userId: string, userData: Partial<IUser>): Promise<ApiResponse<IUser>> {
        return new Promise(async (resolve, reject) => {
            try {
                const existingUser = await User.findById(userId);
                if (existingUser) {
                    existingUser.name = userData.name || existingUser.name;
                    existingUser.phone = userData.phone || existingUser.phone;
                    existingUser.location = userData.location || existingUser.location;
                    existingUser.image = userData.image || existingUser.image;
                    existingUser.carId = userData.carId || existingUser.carId;
                    existingUser.carInfoId = userData.carInfoId || existingUser.carInfoId;
                    await existingUser.save();
                    resolve({
                        success: true,
                        message: 'User updated successfully',
                        data: existingUser
                    });
                }
                else {
                    return reject({
                        success: false,
                        message: 'User not found',
                        data: null
                    });
                }
            } catch (err) {
                reject({
                    success: false,
                    message: 'Error finding user',
                    data: null,
                    error: err instanceof Error ? err.message : 'Unknown error'
                });
            }
        });
    }
    async deleteUser(user: IUser): Promise<ApiResponse<IUser>> {
        return new Promise(async (resolve, reject) => {
            try {
                const userId = user._id;
                if (!userId) {
                    return reject({
                        success: false,
                        message: 'User ID is required',
                        data: null
                    });
                }
                const deletedUser = await User.findByIdAndDelete(userId);
                if (deletedUser) {
                    resolve({
                        success: true,
                        message: 'User deleted successfully',
                        data: deletedUser
                    });
                } else {
                    return reject({
                        success: false,
                        message: 'User not found',
                        data: null
                    });
                }
            } catch (err) {
                reject({
                    success: false,
                    message: 'Error deleting user',
                    data: null,
                    error: err instanceof Error ? err.message : 'Unknown error'
                });
            }
        });
    }
    async addPhoto(user: IUser, image: string): Promise<ApiResponse<IUser>> {
        return new Promise(async (resolve, reject) => {
            try {
                const userId = user._id;
                if (!userId) {
                    return reject({
                        success: false,
                        message: 'User ID is required',
                        data: null
                    });
                }
                const updatedUser = await User.findByIdAndUpdate(userId, { image }, { new: true });
                if (updatedUser) {
                    resolve({
                        success: true,
                        message: 'Photo added successfully',
                        data: updatedUser
                    });
                } else {
                    return reject({
                        success: false,
                        message: 'User not found',
                        data: null
                    });
                }
            } catch (err) {
                reject({
                    success: false,
                    message: 'Error adding photo',
                    data: null,
                    error: err instanceof Error ? err.message : 'Unknown error'
                });
            }
        }
        );
    }
    async addFullAddress(user: IUser, fullAddress: FullAddress): Promise<ApiResponse<IUser>> {
        
    }
    async addCar(user: IUser, car: ICars): Promise<ApiResponse<IUser>> {
        
    }
    async addCarInfo(user: IUser, carInfo: ICarInfo): Promise<ApiResponse<IUser>> {
        
    }
    async completeProfile(user: IUser): Promise<ApiResponse<IUser>> {
        
    }
}