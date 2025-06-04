import Emergency,{IEmergency} from "../models/Emergancy.model";
import Workshop,{IWorkshop} from "../models/Workshop.model";
import User,{IUser} from "../models/User.model"


interface EmergencyRequestData{
    emergencyType: string;
    description?: string;
    phone: string;
    car: string;
    city: string;
    sharedlocation: string;
}


interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

enum EmergencyStatus {
    BROADCASTING = "broadcasting",
    ACCEPTED = "accepted",
    COMPLETED = "completed"
}

interface EmergencyResponse {
    providerId: string;
    providerName: string;
    estimatedArrivalTime: number; // in minutes
    estimatedCost?: number;
    message?: string;
    respondedAt: Date;
}


export interface IEmergencyService {
    broadcastEmergencyRequest(requestData: EmergencyRequestData): Promise<ApiResponse<IEmergency>>;
    getActiveEmergencyRequests(providerId: string): Promise<ApiResponse<IEmergency[]>>;
    respondToEmergency(broadcastId: string, providerId: string, response: EmergencyResponse): Promise<ApiResponse<void>>;
    acceptEmergencyService(broadcastId: string, providerId: string): Promise<ApiResponse<void>>;
    cancelEmergencyBroadcast(broadcastId: string): Promise<ApiResponse<void>>;
}