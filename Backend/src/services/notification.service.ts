import Notification,{INotification} from "../models/Notification.model";



interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

interface NotificationRequest {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    data?: Record<string, any>;
    priority: 'LOW' | 'NORMAL' | 'HIGH';
}


enum NotificationType {
    BOOKING_CREATED = 'BOOKING_CREATED',
    BOOKING_ACCEPTED = 'BOOKING_ACCEPTED',
    BOOKING_REJECTED = 'BOOKING_REJECTED',
    BOOKING_COMPLETED = 'BOOKING_COMPLETED',
    EMERGENCY_BROADCAST = 'EMERGENCY_BROADCAST',
    EMERGENCY_ACCEPTED = 'EMERGENCY_ACCEPTED',
    SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT'
}

export interface INotificationService {
    sendNotification(notification: NotificationRequest): Promise<ApiResponse<void>>;
    sendBulkNotifications(notifications: NotificationRequest[]): Promise<ApiResponse<void>>;
    getUserNotifications(userId: string): Promise<ApiResponse<INotification[]>>;
    markNotificationAsRead(notificationId: string): Promise<ApiResponse<void>>;
    subscribeToNotifications(userId: string, deviceToken: string): Promise<ApiResponse<void>>;
    unsubscribeFromNotifications(userId: string, deviceToken: string): Promise<ApiResponse<void>>;
}
