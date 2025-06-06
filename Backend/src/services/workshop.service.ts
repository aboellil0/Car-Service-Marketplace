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
    addPhonenumber(workshopData: Partial<IWorkshop>) : Promise<ApiResponse<IWorkshopService>>; // owner
    updateWorkshop(id: string, workshopData: Partial<IWorkshop>): Promise<ApiResponse<IWorkshop>>; //owner
    deleteWorkshop(id: string): Promise<ApiResponse<null>>; // owner
    findNearbyWorkshops(location: { lat: number; lng: number }): Promise<ApiResponse<IWorkshop[]>>;
    addServiceToWorkshop(workshopId: string, serviceData: IService): Promise<ApiResponse<IWorkshop>>; // owner
    updateServiceInWorkshop(workshopId: string, serviceId: string, serviceData: IService): Promise<ApiResponse<IWorkshop>>; //owner
    deleteServiceFromWorkshop(workshopId: string, serviceId: string): Promise<ApiResponse<IWorkshop>>;//owner
    getWorkshopServices(workshopId: string): Promise<ApiResponse<IService[]>>;
}

