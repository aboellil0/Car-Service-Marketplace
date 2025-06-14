// GET    /api/workshops                    # Public: Browse workshops
// GET    /api/workshops/:id               # Public: Workshop details
// POST   /api/workshops                   # Workshop Owner: Create workshop
// PUT    /api/workshops/:id               # Workshop Owner: Update workshop
// DELETE /api/workshops/:id              # Workshop Owner: Delete workshop
// GET    /api/workshops/nearby            # Public: Find nearby workshops
// POST   /api/workshops/:id/services      # Workshop Owner: Add service
// PUT    /api/workshops/:id/services/:serviceId  # Workshop Owner: Update service
// DELETE /api/workshops/:id/services/:serviceId # Workshop Owner: Delete service


import User,{IUser} from "../models/User.model";
import Workshop, {IWorkshop} from "../models/Workshop.model";
import Service,{ IService } from "../models/Sevices.model";
import { Types } from "mongoose";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

interface IWorkshopService {
    getAllWorkshops(): Promise<ApiResponse<IWorkshop[]>>;
    getWorkshopById(id: string): Promise<ApiResponse<IWorkshop>>;
    createWorkshop(workshopData: Partial<IWorkshop>, ownerId: string): Promise<ApiResponse<IWorkshop>>; // owner
    addPhonenumber(WorkshopId:string, phone:string) : Promise<ApiResponse<IWorkshop>>; // owner
    updateWorkshop(id: string, workshopData: Partial<IWorkshop>): Promise<ApiResponse<IWorkshop>>; //owner
    deleteWorkshop(id: string): Promise<ApiResponse<null>>; // owner
    findNearbyWorkshops(state: string): Promise<ApiResponse<IWorkshop[]>>;
    addServiceToWorkshop(workshopId: string, serviceData: IService): Promise<ApiResponse<IWorkshop>>; // owner
    updateServiceInWorkshop(workshopId: string, serviceId: string, serviceData: Partial<IService>): Promise<ApiResponse<IWorkshop>>; //owner
    deleteServiceFromWorkshop(workshopId: string, serviceId: string): Promise<ApiResponse<IWorkshop>>;//owner
    getWorkshopServices(workshopId: string): Promise<ApiResponse<IService[]>>;
}

class WorkshopService implements IWorkshopService{
    async getAllWorkshops(): Promise<ApiResponse<IWorkshop[]>> {
        return new Promise(async (resolve, reject) => {
            try {
                const workshops = await Workshop.find().populate('owner', 'name email phoneNumber');
                resolve({ success: true, message: 'Workshops retrieved successfully', data: workshops });
            } catch (error) {
                reject({ success: false, message: 'Error retrieving workshops', error: error });
            }
        });
    }

    async getWorkshopById(id: string): Promise<ApiResponse<IWorkshop>> {
        return new Promise(async (resolve, reject) => {
            try {
                const workshop = await Workshop.findById(id).populate('owner', 'name email phoneNumber');
                if (!workshop) {
                    return reject({ success: false, message: 'Workshop not found' });
                }
                resolve({ success: true, message: 'Workshop retrieved successfully', data: workshop });
            } catch (error) {
                reject({ success: false, message: 'Error retrieving workshop', error: error });
            }
        });
    }

    async createWorkshop(workshopData: Partial<IWorkshop>, ownerId: string): Promise<ApiResponse<IWorkshop>> {
        return new Promise(async (resolve, reject) => {
            try {
                const owner = await User.findById(ownerId);
                if (!owner) {
                    return reject({ success: false, message: 'Owner not found' });
                }
                const workshop = new Workshop({ ...workshopData, owner: ownerId });
                await workshop.save();
                resolve({ success: true, message: 'Workshop created successfully', data: workshop });
            } catch (error) {
                reject({ success: false, message: 'Error creating workshop', error: error });
            }
        });
    }

    async addPhonenumber(WorkshopId:string, phone:string): Promise<ApiResponse<IWorkshop>> {
        return new Promise(async (resolve, reject) => {
            try {
                // Assuming workshopData contains the phone number to be added
                const workshop = await Workshop.findByIdAndUpdate(WorkshopId, { phoneNumber: phone }, { new: true });
                if (!workshop) {
                    return reject({ success: false, message: 'Workshop not found' });
                }
                resolve({ success: true, message: 'Phone number added successfully', data: workshop });
            } catch (error) {
                reject({ success: false, message: 'Error adding phone number', error: error });
            }
        });
    }

    async updateWorkshop(id: string, workshopData: Partial<IWorkshop>): Promise<ApiResponse<IWorkshop>> {
        return new Promise(async (resolve, reject) => {
            try {
                const workshop = await Workshop.findByIdAndUpdate(id, workshopData, { new: true });
                if (!workshop) {
                    return reject({ success: false, message: 'Workshop not found' });
                }
                resolve({ success: true, message: 'Workshop updated successfully', data: workshop });
            } catch (error) {
                reject({ success: false, message: 'Error updating workshop', error: error });
            }
        });
    }

    async deleteWorkshop(id: string): Promise<ApiResponse<null>> {
        return new Promise(async (resolve, reject) => {
            try {
                const workshop = await Workshop.findByIdAndDelete(id);
                if (!workshop) {
                    return reject({ success: false, message: 'Workshop not found' });
                }
                resolve({ success: true, message: 'Workshop deleted successfully', data: null });
            } catch (error) {
                reject({ success: false, message: 'Error deleting workshop', error: error });
            }
        });
    }

    async findNearbyWorkshops(state: string): Promise<ApiResponse<IWorkshop[]>> {
        return new Promise(async (resolve, reject) => {
            try {
                const workshops = await Workshop.find({ state }).populate('owner', 'name email phoneNumber');
                resolve({ success: true, message: 'Nearby workshops retrieved successfully', data: workshops });
            } catch (error) {
                reject({ success: false, message: 'Error retrieving nearby workshops', error: error });
            }
        });
    }

    async addServiceToWorkshop(workshopId: string, serviceData: IService): Promise<ApiResponse<IWorkshop>> {
        return new Promise(async (resolve, reject) => {
            try {
                const workshop = await Workshop.findById(workshopId);
                if (!workshop) {
                    return reject({ success: false, message: 'Workshop not found' });
                }
                const service = new Service(serviceData);
                await service.save();
                if (!workshop.services) {
                    workshop.services = [];
                }
                workshop.services.push(service._id);
                await workshop.save();
                resolve({ success: true, message: 'Service added successfully', data: workshop });
            } catch (error) {
                reject({ success: false, message: 'Error adding service', error: error });
            }
        });
    }

    async updateServiceInWorkshop(workshopId: string, serviceId: string, serviceData: Partial<IService>): Promise<ApiResponse<IWorkshop>> {
        return new Promise(async (resolve, reject) => {
            try {
                const workshop = await Workshop.findById(workshopId);
                if (!workshop) {
                    return reject({ success: false, message: 'Workshop not found' });
                }
                const service = await Service.findByIdAndUpdate(serviceId, serviceData, { new: true });
                if (!service) {
                    return reject({ success: false, message: 'Service not found' });
                }
                resolve({ success: true, message: 'Service updated successfully', data: workshop });
            } catch (error) {
                reject({ success: false, message: 'Error updating service', error: error });
            }
        });
    }

    async deleteServiceFromWorkshop(workshopId: string, serviceId: string): Promise<ApiResponse<IWorkshop>> {
        return new Promise(async (resolve, reject) => {
            try {
                const workshop = await Workshop.findById(workshopId);
                if (!workshop) {
                    return reject({ success: false, message: 'Workshop not found' });
                }
                const service = workshop.services;
                if (!service || service.length === 0) {
                    return reject({ success: false, message: 'No services found in workshop' });
                }
                const serviceIndex = service.indexOf(new Types.ObjectId(serviceId));
                if (serviceIndex === -1) {
                    return reject({ success: false, message: 'Service not found in workshop' });
                }
                service.splice(serviceIndex, 1);
                await workshop.save();
                await Service.findByIdAndDelete(serviceId);
                resolve({ success: true, message: 'Service deleted successfully', data: workshop });
            } catch (error) {
                reject({ success: false, message: 'Error deleting service', error: error });
            }
        });
    }

    async getWorkshopServices(workshopId: string): Promise<ApiResponse<IService[]>> {
        return new Promise(async (resolve, reject) => {
            try {
                const workshop = await Workshop.findById(workshopId).populate('services');
                if (!workshop) {
                    return reject({ success: false, message: 'Workshop not found' });
                }
                const services = workshop.services as unknown as IService[];
                if (!services || services.length === 0) {
                    return reject({ success: false, message: 'No services found for this workshop' });
                }
                resolve({ success: true, message: 'Services retrieved successfully', data: services });
            } catch (error) {
                reject({ success: false, message: 'Error retrieving services', error: error });
            }
        });
    }
}


export default WorkshopService;
export { IWorkshopService, ApiResponse, WorkshopService };