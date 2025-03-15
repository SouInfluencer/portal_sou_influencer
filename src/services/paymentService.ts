import { API_URL } from "./constants";
import { authService } from "./authService";

export interface CampaignPayment {
  id: string;
  campaignId: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  paymentMethod?: {
    type: string;
    last4: string;
    brand: string;
  };
  releaseDate?: string;
}

class PaymentService {
  private static instance: PaymentService;
  private readonly baseUrl: string;
  private readonly defaultHeaders: HeadersInit;

  private constructor() {
    this.baseUrl = API_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
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

  async getCampaignPayment(campaignId: string): Promise<CampaignPayment> {
    try {
      const response = await fetch(
        `${this.baseUrl}/campaigns/${campaignId}/payment`,
        { headers: this.getAuthHeaders() }
      );

      return this.handleResponse<CampaignPayment>(response);
    } catch (error) {
      console.error('Error fetching campaign payment:', error);
      throw error instanceof Error ? error : new Error('Erro ao buscar pagamento da campanha');
    }
  }

  async processCampaignPayment(campaignId: string, paymentMethodId: string): Promise<CampaignPayment> {
    try {
      const response = await fetch(
        `${this.baseUrl}/campaigns/${campaignId}/payment`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ paymentMethodId })
        }
      );

      return this.handleResponse<CampaignPayment>(response);
    } catch (error) {
      console.error('Error processing campaign payment:', error);
      throw error instanceof Error ? error : new Error('Erro ao processar pagamento da campanha');
    }
  }

  async releaseCampaignPayment(campaignId: string): Promise<CampaignPayment> {
    try {
      const response = await fetch(
        `${this.baseUrl}/campaigns/${campaignId}/payment/release`,
        {
          method: 'POST',
          headers: this.getAuthHeaders()
        }
      );

      return this.handleResponse<CampaignPayment>(response);
    } catch (error) {
      console.error('Error releasing campaign payment:', error);
      throw error instanceof Error ? error : new Error('Erro ao liberar pagamento da campanha');
    }
  }

  async refundCampaignPayment(campaignId: string, reason: string): Promise<CampaignPayment> {
    try {
      const response = await fetch(
        `${this.baseUrl}/campaigns/${campaignId}/payment/refund`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ reason })
        }
      );

      return this.handleResponse<CampaignPayment>(response);
    } catch (error) {
      console.error('Error refunding campaign payment:', error);
      throw error instanceof Error ? error : new Error('Erro ao reembolsar pagamento da campanha');
    }
  }
}

export const paymentService = PaymentService.getInstance();