import Reviews,{IReviews} from "../models/Reviews.model";


interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}


export interface IReviewService {
    createReview(reviewData: CreateReviewRequest): Promise<ApiResponse<IReviews>>;
    getProviderReviews(providerId: string, page: number, limit: number): Promise<ApiResponse<PaginatedReviews>>;
    getCustomerReviews(customerId: string): Promise<ApiResponse<IReviews[]>>;
    updateReview(reviewId: string, updates: UpdateReviewRequest): Promise<ApiResponse<IReviews>>;
    deleteReview(reviewId: string): Promise<ApiResponse<void>>;
    reportReview(reviewId: string, reason: string): Promise<ApiResponse<void>>;
}

interface CreateReviewRequest {
    bookingId: string;
    customerId: string;
    serviceProviderId: string;
    rating: number; // 1-5
    comment: string;
    serviceQuality: number;
    timeliness: number;
    communication: number;
    value: number;
}
interface UpdateReviewRequest {
    rating?: number;
    comment?: string;
    serviceQuality?: number;
    timeliness?: number;
    communication?: number;
    value?: number;
}


interface PaginatedReviews {
    reviews: IReviews[];
    totalCount: number;
    averageRating: number;
    ratingDistribution: Record<number, number>;
    page: number;
    limit: number;
    totalPages: number;
}