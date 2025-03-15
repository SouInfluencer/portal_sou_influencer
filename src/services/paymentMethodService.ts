import { API_URL } from "./constants";
import { authService } from "./authService";

export interface PaymentMethod {
  id: string;
  type: 'credit_card';
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  holderName: string;
  isDefault: boolean;
}

export interface NewPaymentMethodData {
  number: string;
  expMonth: string;
  expYear: string;
  cvc: string;
  holderName: string;
}

class PaymentMethodService {
  private static instance: PaymentMethodService;
  private readonly baseUrl: string;
  private readonly defaultHeaders: HeadersInit;

  private constructor() {
    this.baseUrl = API_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  public static getInstance(): PaymentMethodService {
    if (!PaymentMethodService.instance) {
      PaymentMethodService.instance = new PaymentMethodService();
    }
    return PaymentMethodService.instance;
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

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await fetch(`${this.baseUrl}/payment-methods`, {
        headers: this.getAuthHeaders()
      });

      return this.handleResponse<PaymentMethod[]>(response);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error instanceof Error ? error : new Error('Erro ao buscar métodos de pagamento');
    }
  }

  async addPaymentMethod(data: NewPaymentMethodData): Promise<PaymentMethod> {
    try {
      const response = await fetch(`${this.baseUrl}/payment-methods`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });

      return this.handleResponse<PaymentMethod>(response);
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error instanceof Error ? error : new Error('Erro ao adicionar método de pagamento');
    }
  }

  async updateDefaultPaymentMethod(paymentMethodId: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/payment-methods/default`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ paymentMethodId })
      });

      return this.handleResponse<{ success: boolean }>(response);
    } catch (error) {
      console.error('Error updating default payment method:', error);
      throw error instanceof Error ? error : new Error('Erro ao atualizar método de pagamento padrão');
    }
  }

  async deletePaymentMethod(paymentMethodId: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/payment-methods/${paymentMethodId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      return this.handleResponse<{ success: boolean }>(response);
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error instanceof Error ? error : new Error('Erro ao remover método de pagamento');
    }
  }
}

export const paymentMethodService = PaymentMethodService.getInstance();