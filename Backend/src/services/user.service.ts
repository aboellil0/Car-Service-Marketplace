import User,{ IUser } from '../models/User.model';
import Cars,{ICars} from '../models/Cars.model';
import CarInfo,{ICarInfo} from '../models/CarInfo.model';
import mongoose from 'mongoose';
import { resolve } from 'path';

interface location {
        address: string;
        state: string;
        city: string;
}

interface completeProfile{
    location: location;
    car: ICars;
    carInfo: ICarInfo;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    error?: string;
}

interface IUserService {
    updateUser(userId: string, userData: Partial<IUser>): Promise<ApiResponse<IUser>>;
    deleteUser(userId: string): Promise<ApiResponse<IUser>>;
    addPhoto(userId: string, image: string): Promise<ApiResponse<IUser>>;
    addFullAddress(userId: string, fullAddress: location): Promise<ApiResponse<IUser>>;
    addCar(userId: string, car: ICars): Promise<ApiResponse<IUser>>;
    addCarInfo(userId: string, carInfo: ICarInfo): Promise<ApiResponse<IUser>>;
    completeProfile(userId: string, compProfile: completeProfile): Promise<ApiResponse<IUser>>;
}


class UserService implements IUserService {
    async updateUser(userId: string, userData: Partial<IUser>): Promise<ApiResponse<IUser>> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!userId){
                    reject({
                        success:false,
                        message:'user id is required',
                        data:null
                    });
                }

                const updatedUser = await User.findByIdAndUpdate(userId,userData,{new:true});
                if (updatedUser) {
                    resolve({
                        success: true,
                        message: 'User updated successfully',
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
                    message: 'Error finding user',
                    data: null,
                    error: err instanceof Error ? err.message : 'Unknown error'
                });
            }
        });
    }
    async deleteUser(userId: string): Promise<ApiResponse<IUser>> {
        return new Promise(async (resolve, reject) => {
            try {
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
    async addPhoto(userId: string, image: string): Promise<ApiResponse<IUser>> {
        return new Promise(async (resolve, reject) => {
            try {
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
    async addFullAddress(userId: string, fullAddress: location): Promise<ApiResponse<IUser>> {
        return new Promise(async (resolve,reject)=>{
            try{
                if(!userId){
                    reject({
                        success: false,
                        message:'user id is required',
                        data:null
                    });

                    const kk = 55;
                    const updatedUser = await User.findByIdAndUpdate(userId,{location},{new:true});
                    if (updatedUser) {
                        resolve({
                            success: true,
                            message: 'User updatedUser successfully',
                            data: updatedUser
                        });
                    } else {
                        return reject({
                            success: false,
                            message: 'User not found',
                            data: null
                        });
                    }
                }
            } catch (err) {
                reject({
                    success: false,
                    message: 'Error adding photo',
                    data: null,
                    error: err instanceof Error ? err.message : 'Unknown error'
                });
            }
        });
    }
    async addCar(userId: string, car: ICars): Promise<ApiResponse<IUser>> {
        return new Promise(async (resolve,reject)=>{
            try{
                if(!userId){
                    reject({
                        success: false,
                        message:'user id is required',
                        data:null
                    });

                    const updatedUser = await User.findByIdAndUpdate(userId, { car }, { new: true });
                    if (updatedUser) {
                        resolve({
                            success: true,
                            message: 'Car added successfully',
                            data: updatedUser
                        });
                    } else {
                        return reject({
                            success: false,
                            message: 'User not found',
                            data: null
                        });
                    }
                }
            } catch (err) {
                reject({
                    success: false,
                    message: 'Error adding photo',
                    data: null,
                    error: err instanceof Error ? err.message : 'Unknown error'
                });
            }
        });
    }
    async addCarInfo(userId: string, carInfo: ICarInfo): Promise<ApiResponse<IUser>> {
        return new Promise(async (resolve,reject)=>{
            try{
                if(!userId){
                    reject({
                        success: false,
                        message:'user id is required',
                        data:null
                    });
                }

                const newCarInfo = new CarInfo(carInfo);
                const savedCarInfo = await newCarInfo.save();
                const updatedUser = await User.findByIdAndUpdate(userId, { carInfo: savedCarInfo._id }, { new: true });
                if (updatedUser) {
                    resolve({
                        success: true,
                        message: 'Car info added successfully',
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
        });
    }
    async completeProfile(userId: string,compProfile: completeProfile): Promise<ApiResponse<IUser>> {
        return new Promise(async (resolve,reject)=>{
            try{
                if(!userId){
                    reject({
                        success: false,
                        message:'user id is required',
                        data:null
                    });
                }
                const { location, car, carInfo } = compProfile;
                const newcarInfo = new CarInfo(carInfo);
                const savedCarInfo = await newcarInfo.save();
                const updatedUser = await User.findByIdAndUpdate(userId,{ location, car, carInfo: savedCarInfo._id },{ new: true });
                if (updatedUser) {
                    resolve({
                        success: true,
                        message: 'Profile completed successfully',
                        data: updatedUser
                    });
                } else {
                    reject({
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
        });
    }
}