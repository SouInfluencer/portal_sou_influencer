import { API_URL } from "./constants";
import { authService } from "./authService";
import type { SocialAccount } from "../types";

interface SocialNetworkMetrics {
  followers: number;
  engagement: number;
  reachRate: number;
  averageViews: number;
  averageLikes: number;
  averageComments: number;
  demographics: {
    age: {
      [key: string]: number;
    };
    gender: {
      male: number;
      female: number;
      other: number;
    };
    locations: Array<{
      city: string;
      percentage: number;
    }>;
  };
  growth: {
    monthly: number;
    weekly: number;
    daily: number;
  };
  bestTime: {
    day: string;
    hour: string;
    engagement: number;
  };
  contentPerformance: Array<{
    type: string;
    averageEngagement: number;
    averageReach: number;
  }>;
}

class SocialNetworkMetricsService {
  private static instance: SocialNetworkMetricsService;
  private readonly baseUrl: string;
  private readonly defaultHeaders: HeadersInit;

  private constructor() {
    this.baseUrl = API_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  public static getInstance(): SocialNetworkMetricsService {
    if (!SocialNetworkMetricsService.instance) {
      SocialNetworkMetricsService.instance = new SocialNetworkMetricsService();
    }
    return SocialNetworkMetricsService.instance;
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

  async getAccountMetrics(platform: SocialAccount['platform']): Promise<SocialNetworkMetrics> {
    try {
      const response = await fetch(
        `${this.baseUrl}/social-networks/${platform}/metrics`,
        { headers: this.getAuthHeaders() }
      );

      return this.handleResponse<SocialNetworkMetrics>(response);
    } catch (error) {
      console.error('Error fetching social network metrics:', error);
      
      // Return empty/default values on error
      return {
        followers: 0,
        engagement: 0,
        reachRate: 0,
        averageViews: 0,
        averageLikes: 0,
        averageComments: 0,
        demographics: {
          age: {},
          gender: {
            male: 0,
            female: 0,
            other: 0
          },
          locations: []
        },
        growth: {
          monthly: 0,
          weekly: 0,
          daily: 0
        },
        bestTime: {
          day: '',
          hour: '',
          engagement: 0
        },
        contentPerformance: []
      };
    }
  }

  async getAccountInsights(platform: SocialAccount['platform'], period: 'day' | 'week' | 'month' = 'month'): Promise<{
    views: number[];
    engagement: number[];
    followers: number[];
    dates: string[];
  }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/social-networks/${platform}/insights?period=${period}`,
        { headers: this.getAuthHeaders() }
      );

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching social network insights:', error);
      
      // Return empty arrays on error
      return {
        views: [],
        engagement: [],
        followers: [],
        dates: []
      };
    }
  }

  async getContentAnalytics(platform: SocialAccount['platform'], contentId: string): Promise<{
    views: number;
    likes: number;
    comments: number;
    shares: number;
    engagement: number;
    reach: number;
    impressions: number;
    saves: number;
  }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/social-networks/${platform}/content/${contentId}/analytics`,
        { headers: this.getAuthHeaders() }
      );

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching content analytics:', error);
      
      // Return zeros on error
      return {
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        engagement: 0,
        reach: 0,
        impressions: 0,
        saves: 0
      };
    }
  }

  async getAudienceInterests(platform: SocialAccount['platform']): Promise<Array<{
    category: string;
    percentage: number;
  }>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/social-networks/${platform}/audience/interests`,
        { headers: this.getAuthHeaders() }
      );

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching audience interests:', error);
      return []; // Return empty array on error
    }
  }
}

export const socialNetworkMetricsService = SocialNetworkMetricsService.getInstance();