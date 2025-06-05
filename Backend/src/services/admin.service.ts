import { IUser } from "../models/User.model";
import WorkShop, { IWorkshop } from "../models/Workshop.model";




interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}


interface SystemStats {
    totalUsers: number;
    activeProviders: number;
    pendingProviders: number;
    totalBookings: number;
    activeBookings: number;
    totalRevenue: number;
    systemHealth: {
        uptime: number;
        responseTime: number;
        errorRate: number;
    };
}

interface DisputeResolution {
    resolution: string;
    compensationAmount?: number;
    actionTaken: string;
}

interface SystemAnnouncement {
    title: string;
    message: string;
    targetAudience: UserRole[];
    priority: 'LOW' | 'NORMAL' | 'HIGH';
    expiresAt?: Date;
}

enum UserRole {
    ADMIN = "admin",
    USER = "user",
    WORKSHOP_OWNER = "WorkshropOwner",
    TECHNICIAN = "technican"
}

export interface IAdminService {
    getPendingProviders(): Promise<ApiResponse<IUser[]>>;
    approveProvider(providerId: string): Promise<ApiResponse<IUser>>;
    rejectProvider(providerId: string, reason: string): Promise<ApiResponse<void>>;
    suspendProvider(providerId: string, reason: string): Promise<ApiResponse<void>>;
    reactivateProvider(providerId: string): Promise<ApiResponse<IUser>>;
    getSystemStats(): Promise<ApiResponse<SystemStats>>;
    manageDisputes(disputeId: string, resolution: DisputeResolution): Promise<ApiResponse<void>>;
    broadcastSystemAnnouncement(announcement: SystemAnnouncement): Promise<ApiResponse<void>>;
}



