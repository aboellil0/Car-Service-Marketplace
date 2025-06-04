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


interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

export interface CreateBookingRequest {
    customerId: string;
    serviceId: string;  
    workshopId: string;
    scheduledDate?: Date;
    description: string;
  }

export interface IBookingService{
    createBooking(bookingData:createBookingReq) 
}

