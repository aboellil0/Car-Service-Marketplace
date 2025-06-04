// GET    /api/bookings                    # Customer: My bookings
// POST   /api/bookings                    # Customer: Create booking
// GET    /api/bookings/:id               # Customer/Workshop: Booking details
// PUT    /api/bookings/:id/status        # Workshop: Update booking status
// DELETE /api/bookings/:id              # Customer: Cancel booking
// GET    /api/bookings/workshop/:workshopId # Workshop Owner: Workshop bookings

import User,{IUser} from "../models/User.model"
import Workshop,{IWorkshop} from "../models/Workshop.model"
import Service,{IService} from "../models/Sevices.model"
import Cars,{ ICars } from "../models/Cars.model";
import Booking,{IBooking} from "../models/Booking.model"
import mongoose from "mongoose";


interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

export interface createBookingRequest {
    customerId: string;
    serviceId: string;  
    workshopId: string;
    scheduledDate?: Date;
    description: string;
}

// export interface BookingCompletionRequest {
//     finalPrice: number;
//     workPerformed: string;
//     partsUsed?: string[];
//     recommendations?: string;
// }

enum BookingStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    IN_PROGRESS = "in_progress",
    CANCELLED = "cancelled",
    COMPLETED = "completed"
}

export interface IBookingService{
    createBooking(bookingData:createBookingRequest) : Promise<ApiResponse<IBooking>>;
    getBooking(bookingId: mongoose.Types.ObjectId) : Promise<ApiResponse<IBooking>>;
    updateBookingStatus(bookingId: string, status: BookingStatus, providerId?: string): Promise<ApiResponse<IBooking>>;
    cancelBooking(bookingId: string, userId: string): Promise<ApiResponse<IBooking>>;
    getCustomerBookings(customerId: string): Promise<ApiResponse<IBooking[]>>;
    getProviderBookings(providerId: string): Promise<ApiResponse<IBooking[]>>;
    acceptBooking(bookingId: string, providerId: string): Promise<ApiResponse<IBooking>>;
    rejectBooking(bookingId: string, providerId: string, reason: string): Promise<ApiResponse<IBooking>>;
}

