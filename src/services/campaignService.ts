import { authService } from './authService';
import { API_URL } from './constants';
import type { Campaign } from '../types';

export interface CampaignFilters {
  status?: string[];
  platform?: string[];
  startDate?: string;
  endDate?: string;
  minBudget?: number;
  maxBudget?: number;
  page?: number;
  limit?: number;
  search?: string;
}

export interface CampaignInput {
  title: string;
  description: string;
  platform: string;
  contentType: string;
  budget: number;
  deadline: Date;
  requirements: string[];
  influencerId?: string;
  type?: 'single' | 'multiple';
  categories?: string[];
  content?: {
    caption?: string;
    hashtags?: string[];
    mentions?: string[];
  };
}

export interface CampaignResponse {
  data: Campaign[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class CampaignService {
  private static instance: CampaignService;
  private readonly baseUrl: string;
  private readonly defaultHeaders: HeadersInit;

  private constructor() {
    this.baseUrl = API_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  public static getInstance(): CampaignService {
    if (!CampaignService.instance) {
      CampaignService.instance = new CampaignService();
    }
    return CampaignService.instance;
  }

  private getAuthHeaders(): HeadersInit {
    const token = authService.getToken();
    if (!token) {
      throw new Error('Não autorizado');
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

  async getCampaigns(filters?: CampaignFilters): Promise<CampaignResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        if (filters.status?.length) queryParams.append('status', filters.status.join(','));
        if (filters.platform?.length) queryParams.append('platform', filters.platform.join(','));
        if (filters.startDate) queryParams.append('startDate', filters.startDate);
        if (filters.endDate) queryParams.append('endDate', filters.endDate);
        if (filters.minBudget) queryParams.append('minBudget', filters.minBudget.toString());
        if (filters.maxBudget) queryParams.append('maxBudget', filters.maxBudget.toString());
        if (filters.page) queryParams.append('page', filters.page.toString());
        if (filters.limit) queryParams.append('limit', filters.limit.toString());
        if (filters.search) queryParams.append('search', filters.search);
      }

      const response = await fetch(
        `${this.baseUrl}/campaigns?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders()
        }
      );

      return this.handleResponse<CampaignResponse>(response);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error instanceof Error ? error : new Error('Erro ao buscar campanhas');
    }
  }

  async getCampaign(id: string): Promise<Campaign> {
    try {
      const response = await fetch(
        `${this.baseUrl}/campaigns/${id}`,
        {
          method: 'GET',
          headers: this.getAuthHeaders()
        }
      );

      return this.handleResponse<Campaign>(response);
    } catch (error) {
      console.error('Error fetching campaign:', error);
      throw error instanceof Error ? error : new Error('Erro ao buscar campanha');
    }
  }

  async createCampaign(data: CampaignInput): Promise<Campaign> {
    try {
      // Input validation
      this.validateCampaignInput(data);

      const response = await fetch(
        `${this.baseUrl}/campaigns`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(data)
        }
      );

      return this.handleResponse<Campaign>(response);
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error instanceof Error ? error : new Error('Erro ao criar campanha');
    }
  }

  async updateCampaign(id: string, data: Partial<CampaignInput>): Promise<Campaign> {
    try {
      const response = await fetch(
        `${this.baseUrl}/campaigns/${id}`,
        {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(data)
        }
      );

      return this.handleResponse<Campaign>(response);
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error instanceof Error ? error : new Error('Erro ao atualizar campanha');
    }
  }

  async deleteCampaign(id: string): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseUrl}/campaigns/${id}`,
        {
          method: 'DELETE',
          headers: this.getAuthHeaders()
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao excluir campanha');
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error instanceof Error ? error : new Error('Erro ao excluir campanha');
    }
  }

  private validateCampaignInput(data: CampaignInput): void {
    const errors: string[] = [];

    if (!data.title?.trim()) {
      errors.push('Título é obrigatório');
    }

    if (!data.description?.trim()) {
      errors.push('Descrição é obrigatória');
    }

    if (!data.platform) {
      errors.push('Plataforma é obrigatória');
    }

    if (!data.contentType) {
      errors.push('Tipo de conteúdo é obrigatório');
    }

    if (!data.budget || data.budget <= 0) {
      errors.push('Orçamento deve ser maior que zero');
    }

    if (!data.deadline) {
      errors.push('Prazo é obrigatório');
    } else {
      const deadlineDate = new Date(data.deadline);
      if (deadlineDate < new Date()) {
        errors.push('Prazo deve ser uma data futura');
      }
    }

    if (!data.requirements?.length) {
      errors.push('Pelo menos um requisito é obrigatório');
    }

    if (data.type === 'single' && !data.influencerId) {
      errors.push('Influenciador é obrigatório para campanhas individuais');
    }

    if (data.type === 'multiple' && !data.categories?.length) {
      errors.push('Pelo menos uma categoria é obrigatória para campanhas múltiplas');
    }

    if (errors.length > 0) {
      throw new Error(`Erros de validação:\n${errors.join('\n')}`);
    }
  }
}

export const campaignService = CampaignService.getInstance();