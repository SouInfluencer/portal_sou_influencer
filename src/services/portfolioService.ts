import { API_URL } from "./constants";
import { authService } from "./authService";

export interface PortfolioItem {
  id: string;
  brand: {
    name: string;
    logo: string;
  };
  product: string;
  type: string;
  performance: {
    views: string;
    engagement: string;
    clicks: string;
  };
  date: string;
  platform: string;
  content: {
    type: string;
    url: string;
    thumbnail?: string;
  };
  metrics: {
    reach: number;
    engagement: number;
    clicks: number;
    conversions: number;
  };
}

export interface PortfolioStats {
  totalCampaigns: number;
  totalReach: string;
  avgEngagement: string;
  totalEarnings: number;
}

class PortfolioService {
  private static instance: PortfolioService;
  private readonly baseUrl: string;
  private readonly defaultHeaders: HeadersInit;

  private constructor() {
    this.baseUrl = API_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  public static getInstance(): PortfolioService {
    if (!PortfolioService.instance) {
      PortfolioService.instance = new PortfolioService();
    }
    return PortfolioService.instance;
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

  async getPortfolioItems(): Promise<PortfolioItem[]> {
    try {
      const response = await fetch(`${this.baseUrl}/portfolio`, {
        headers: this.getAuthHeaders()
      });

      return this.handleResponse<PortfolioItem[]>(response);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      return []; // Return empty array on error
    }
  }

  async getPortfolioStats(): Promise<PortfolioStats> {
    try {
      const response = await fetch(`${this.baseUrl}/portfolio/stats`, {
        headers: this.getAuthHeaders()
      });

      return this.handleResponse<PortfolioStats>(response);
    } catch (error) {
      console.error('Error fetching portfolio stats:', error);
      // Return default values on error
      return {
        totalCampaigns: 0,
        totalReach: '0',
        avgEngagement: '0%',
        totalEarnings: 0
      };
    }
  }

  async getPortfolioMetrics(): Promise<{
    views: number[];
    engagement: number[];
    earnings: number[];
    dates: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/portfolio/metrics`, {
        headers: this.getAuthHeaders()
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching portfolio metrics:', error);
      // Return empty arrays on error
      return {
        views: [],
        engagement: [],
        earnings: [],
        dates: []
      };
    }
  }
}

export const portfolioService = PortfolioService.getInstance();