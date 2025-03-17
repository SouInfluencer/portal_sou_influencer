import { API_URL } from "./constants";
import { authService } from "./authService";
import type { Influencer } from "../types";

export interface InfluencerFilters {
  platform?: string;
  categories?: string[];
  minFollowers?: number;
  maxFollowers?: number;
  location?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface InfluencerResponse {
  data: Influencer[];
  total: number;
  page: number;
  totalPages: number;
}

class InfluencerService {
  private static instance: InfluencerService;
  private readonly baseUrl: string;
  private readonly defaultHeaders: HeadersInit;

  private constructor() {
    this.baseUrl = API_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  public static getInstance(): InfluencerService {
    if (!InfluencerService.instance) {
      InfluencerService.instance = new InfluencerService();
    }
    return InfluencerService.instance;
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

  async getInfluencers(filters?: InfluencerFilters): Promise<InfluencerResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        if (filters.platform) queryParams.append('platform', filters.platform);
        if (filters.categories?.length) queryParams.append('categories', filters.categories.join(','));
        if (filters.minFollowers) queryParams.append('minFollowers', filters.minFollowers.toString());
        if (filters.maxFollowers) queryParams.append('maxFollowers', filters.maxFollowers.toString());
        if (filters.location) queryParams.append('location', filters.location);
        if (filters.page) queryParams.append('page', filters.page.toString());
        if (filters.limit) queryParams.append('limit', filters.limit.toString());
        if (filters.search) queryParams.append('search', filters.search);
      }

      const response = await fetch(
        `${this.baseUrl}/influencers?${queryParams.toString()}`,
        { headers: this.getAuthHeaders() }
      );

      return this.handleResponse<InfluencerResponse>(response);
    } catch (error) {
      console.error('Error fetching influencers:', error);
      throw error instanceof Error ? error : new Error('Erro ao buscar influenciadores');
    }
  }

  async getInfluencerById(id: string): Promise<Influencer> {
    try {
      const response = await fetch(
        `${this.baseUrl}/influencers/${id}`,
        { headers: this.getAuthHeaders() }
      );

      return this.handleResponse<Influencer>(response);
    } catch (error) {
      console.error('Error fetching influencer:', error);
      throw error instanceof Error ? error : new Error('Erro ao buscar influenciador');
    }
  }

  async getInfluencerMetrics(id: string): Promise<{
    reachRate: number;
    engagementRate: number;
    completionRate: number;
    averageViews: number;
  }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/influencers/${id}/metrics`,
        { headers: this.getAuthHeaders() }
      );

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching influencer metrics:', error);
      throw error instanceof Error ? error : new Error('Erro ao buscar métricas do influenciador');
    }
  }
}

export const influencerService = InfluencerService.getInstance();