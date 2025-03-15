import { API_URL } from "./constants";
import { authService } from "./authService";

export interface Review {
  id: string;
  author: {
    name: string;
    avatar: string;
    company: string;
  };
  rating: number;
  comment: string;
  date: string;
  campaign?: {
    id: string;
    title: string;
    platform: string;
  };
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number;
  };
}

class ReviewsService {
  private static instance: ReviewsService;
  private readonly baseUrl: string;
  private readonly defaultHeaders: HeadersInit;

  private constructor() {
    this.baseUrl = API_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  public static getInstance(): ReviewsService {
    if (!ReviewsService.instance) {
      ReviewsService.instance = new ReviewsService();
    }
    return ReviewsService.instance;
  }

  private getAuthHeaders(): HeadersInit {
    const token = authService.getToken();
    if (!token) {
      throw new Error('Usuário não autenticado');
    }
    return {
      ...this.defaultHeaders,
      'Authorization': `Bearer ${token}`
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro na requisição');
    }
    return response.json();
  }

  async getReviews(filters?: {
    rating?: number;
    page?: number;
    limit?: number;
  }): Promise<{
    data: Review[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        if (filters.rating) queryParams.append('rating', filters.rating.toString());
        if (filters.page) queryParams.append('page', filters.page.toString());
        if (filters.limit) queryParams.append('limit', filters.limit.toString());
      }

      const response = await fetch(
        `${this.baseUrl}/reviews?${queryParams.toString()}`,
        { headers: this.getAuthHeaders() }
      );

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      
      // Return empty data on error
      return {
        data: [],
        total: 0,
        page: filters?.page || 1,
        totalPages: 0
      };
    }
  }

  async getReviewStats(): Promise<ReviewStats> {
    try {
      const response = await fetch(
        `${this.baseUrl}/reviews/stats`,
        { headers: this.getAuthHeaders() }
      );

      return this.handleResponse<ReviewStats>(response);
    } catch (error) {
      console.error('Error fetching review stats:', error);
      
      // Return default values on error
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0
        }
      };
    }
  }
}

export const reviewsService = ReviewsService.getInstance();