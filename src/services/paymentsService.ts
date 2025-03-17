import { API_URL } from "./constants";
import { authService } from "./authService";

export interface Payment {
  id: string;
  campaignId: number;
  campaignName: string;
  brand: {
    name: string;
    logo: string;
  };
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  date: string;
  releaseDate: string;
  paymentMethod: {
    type: 'credit_card';
    last4: string;
    brand: string;
  };
}

export interface BankTransfer {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  requestDate: string;
  completionDate?: string;
  bankAccount: {
    bank: string;
    agency: string;
    account: string;
    holder: string;
  };
}

export interface BankAccount {
  id: string;
  bank: string;
  agency: string;
  account: string;
  holder: string;
  isDefault: boolean;
}

class PaymentsService {
  private static instance: PaymentsService;
  private readonly baseUrl: string;
  private readonly defaultHeaders: HeadersInit;

  private constructor() {
    this.baseUrl = API_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  public static getInstance(): PaymentsService {
    if (!PaymentsService.instance) {
      PaymentsService.instance = new PaymentsService();
    }
    return PaymentsService.instance;
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

  async getPayments(filters?: {
    status?: string[];
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: Payment[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        if (filters.status?.length) queryParams.append('status', filters.status.join(','));
        if (filters.startDate) queryParams.append('startDate', filters.startDate);
        if (filters.endDate) queryParams.append('endDate', filters.endDate);
        if (filters.page) queryParams.append('page', filters.page.toString());
        if (filters.limit) queryParams.append('limit', filters.limit.toString());
      }

      const response = await fetch(
        `${this.baseUrl}/payments?${queryParams.toString()}`,
        { headers: this.getAuthHeaders() }
      );

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error instanceof Error ? error : new Error('Erro ao buscar pagamentos');
    }
  }

  async getTransfers(filters?: {
    status?: string[];
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: BankTransfer[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        if (filters.status?.length) queryParams.append('status', filters.status.join(','));
        if (filters.startDate) queryParams.append('startDate', filters.startDate);
        if (filters.endDate) queryParams.append('endDate', filters.endDate);
        if (filters.page) queryParams.append('page', filters.page.toString());
        if (filters.limit) queryParams.append('limit', filters.limit.toString());
      }

      const response = await fetch(
        `${this.baseUrl}/transfers?${queryParams.toString()}`,
        { headers: this.getAuthHeaders() }
      );

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching transfers:', error);
      throw error instanceof Error ? error : new Error('Erro ao buscar transferências');
    }
  }

  async getBankAccounts(): Promise<BankAccount[]> {
    try {
      const response = await fetch(`${this.baseUrl}/bank-accounts`, {
        headers: this.getAuthHeaders()
      });

      return this.handleResponse<BankAccount[]>(response);
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      throw error instanceof Error ? error : new Error('Erro ao buscar contas bancárias');
    }
  }

  async addBankAccount(data: {
    bank: string;
    agency: string;
    account: string;
    holder: string;
  }): Promise<BankAccount> {
    try {
      const response = await fetch(`${this.baseUrl}/bank-accounts`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });

      return this.handleResponse<BankAccount>(response);
    } catch (error) {
      console.error('Error adding bank account:', error);
      throw error instanceof Error ? error : new Error('Erro ao adicionar conta bancária');
    }
  }

  async updateDefaultBankAccount(accountId: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/bank-accounts/default`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ accountId })
      });

      return this.handleResponse<{ success: boolean }>(response);
    } catch (error) {
      console.error('Error updating default bank account:', error);
      throw error instanceof Error ? error : new Error('Erro ao atualizar conta bancária padrão');
    }
  }

  async deleteBankAccount(accountId: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/bank-accounts/${accountId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      return this.handleResponse<{ success: boolean }>(response);
    } catch (error) {
      console.error('Error deleting bank account:', error);
      throw error instanceof Error ? error : new Error('Erro ao remover conta bancária');
    }
  }

  async requestTransfer(amount: number): Promise<BankTransfer> {
    try {
      const response = await fetch(`${this.baseUrl}/transfers`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ amount })
      });

      return this.handleResponse<BankTransfer>(response);
    } catch (error) {
      console.error('Error requesting transfer:', error);
      throw error instanceof Error ? error : new Error('Erro ao solicitar transferência');
    }
  }

  async getPaymentStats(): Promise<{
    totalEarnings: number;
    availableForWithdraw: number;
    pendingAmount: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/payments/stats`, {
        headers: this.getAuthHeaders()
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      throw error instanceof Error ? error : new Error('Erro ao buscar estatísticas de pagamento');
    }
  }
}

export const paymentsService = PaymentsService.getInstance();