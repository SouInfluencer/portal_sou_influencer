import { API_URL } from "./constants";
import { authService } from "./authService";
import type { SocialAccount } from "../types";

class SocialNetworksService {
  private static instance: SocialNetworksService;
  private readonly baseUrl: string;
  private readonly defaultHeaders: HeadersInit;

  private constructor() {
    this.baseUrl = API_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  public static getInstance(): SocialNetworksService {
    if (!SocialNetworksService.instance) {
      SocialNetworksService.instance = new SocialNetworksService();
    }
    return SocialNetworksService.instance;
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

  async getConnectedAccounts(): Promise<SocialAccount[]> {
    try {
      const response = await fetch(`${this.baseUrl}/social-networks`, {
        headers: this.getAuthHeaders()
      });

      return this.handleResponse<SocialAccount[]>(response);
    } catch (error) {
      console.error('Error fetching connected accounts:', error);
      throw error instanceof Error ? error : new Error('Erro ao buscar contas conectadas');
    }
  }

  async connectAccount(platform: string, code: string): Promise<SocialAccount> {
    try {
      const response = await fetch(`${this.baseUrl}/social-networks/connect`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ platform, code })
      });

      return this.handleResponse<SocialAccount>(response);
    } catch (error) {
      console.error('Error connecting account:', error);
      throw error instanceof Error ? error : new Error('Erro ao conectar conta');
    }
  }

  async disconnectAccount(platform: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/social-networks/${platform}/disconnect`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      return this.handleResponse<{ success: boolean }>(response);
    } catch (error) {
      console.error('Error disconnecting account:', error);
      throw error instanceof Error ? error : new Error('Erro ao desconectar conta');
    }
  }

  async updateAccountSettings(platform: string, settings: {
    pricing?: {
      post?: number;
      story?: number;
      reels?: number;
    };
    categories?: string[];
    contentTypes?: string[];
  }): Promise<SocialAccount> {
    try {
      const response = await fetch(`${this.baseUrl}/social-networks/${platform}/settings`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(settings)
      });

      return this.handleResponse<SocialAccount>(response);
    } catch (error) {
      console.error('Error updating account settings:', error);
      throw error instanceof Error ? error : new Error('Erro ao atualizar configurações da conta');
    }
  }
}

export const socialNetworksService = SocialNetworksService.getInstance();