import { API_URL } from "./constants";
import { authService } from "./authService";
import type { Campaign } from "../types";

interface CampaignDetails extends Campaign {
  metrics: {
    reach: number;
    engagement: number;
    clicks: number;
    conversions: number;
  };
  timeline: Array<{
    id: string;
    date: string;
    type: 'milestone' | 'update' | 'message';
    content: string;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    completed: boolean;
    dueDate?: string;
  }>;
}

class CampaignDetailsService {
  private static instance: CampaignDetailsService;
  private readonly baseUrl: string;
  private readonly defaultHeaders: HeadersInit;

  private constructor() {
    this.baseUrl = API_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  public static getInstance(): CampaignDetailsService {
    if (!CampaignDetailsService.instance) {
      CampaignDetailsService.instance = new CampaignDetailsService();
    }
    return CampaignDetailsService.instance;
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

  async getCampaignDetails(id: string): Promise<CampaignDetails> {
    try {
      const response = await fetch(
        `${this.baseUrl}/campaigns/${id}/details`,
        { headers: this.getAuthHeaders() }
      );

      return this.handleResponse<CampaignDetails>(response);
    } catch (error) {
      console.error('Error fetching campaign details:', error);
      
      // Return empty/default values on error
      return {
        id: id,
        title: '',
        brand: {
          name: '',
          logo: ''
        },
        description: '',
        budget: 0,
        deadline: new Date(),
        requirements: [],
        platform: '',
        contentType: '',
        status: 'pending',
        metrics: {
          reach: 0,
          engagement: 0,
          clicks: 0,
          conversions: 0
        },
        timeline: [],
        tasks: []
      };
    }
  }

  async updateCampaignStatus(id: string, status: Campaign['status']): Promise<CampaignDetails> {
    try {
      const response = await fetch(
        `${this.baseUrl}/campaigns/${id}/status`,
        {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ status })
        }
      );

      return this.handleResponse<CampaignDetails>(response);
    } catch (error) {
      console.error('Error updating campaign status:', error);
      throw error instanceof Error ? error : new Error('Erro ao atualizar status da campanha');
    }
  }

  async completeTask(campaignId: string, taskId: string): Promise<CampaignDetails> {
    try {
      const response = await fetch(
        `${this.baseUrl}/campaigns/${campaignId}/tasks/${taskId}/complete`,
        {
          method: 'PUT',
          headers: this.getAuthHeaders()
        }
      );

      return this.handleResponse<CampaignDetails>(response);
    } catch (error) {
      console.error('Error completing task:', error);
      throw error instanceof Error ? error : new Error('Erro ao completar tarefa');
    }
  }

  async submitDeliveryProof(campaignId: string, data: {
    url: string;
    type: string;
    notes?: string;
  }): Promise<CampaignDetails> {
    try {
      const response = await fetch(
        `${this.baseUrl}/campaigns/${campaignId}/delivery`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(data)
        }
      );

      return this.handleResponse<CampaignDetails>(response);
    } catch (error) {
      console.error('Error submitting delivery proof:', error);
      throw error instanceof Error ? error : new Error('Erro ao enviar comprovante de entrega');
    }
  }

  async validateDelivery(campaignId: string, data: {
    approved: boolean;
    feedback?: string;
  }): Promise<CampaignDetails> {
    try {
      const response = await fetch(
        `${this.baseUrl}/campaigns/${campaignId}/delivery/validate`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(data)
        }
      );

      return this.handleResponse<CampaignDetails>(response);
    } catch (error) {
      console.error('Error validating delivery:', error);
      throw error instanceof Error ? error : new Error('Erro ao validar entrega');
    }
  }
}

export const campaignDetailsService = CampaignDetailsService.getInstance();