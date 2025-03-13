import { API_URL } from "./constants";
import { authService } from "./authService";

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
}

export interface Subscription {
  id: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

class PlanService {
  private static instance: PlanService;
  private readonly baseUrl: string;
  private readonly defaultHeaders: HeadersInit;

  private constructor() {
    this.baseUrl = API_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  public static getInstance(): PlanService {
    if (!PlanService.instance) {
      PlanService.instance = new PlanService();
    }
    return PlanService.instance;
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

  async getPlans(): Promise<Plan[]> {
    try {
      const response = await fetch(`${this.baseUrl}/plans`, {
        headers: this.getAuthHeaders()
      });

      return this.handleResponse<Plan[]>(response);
    } catch (error) {
      console.error('Error fetching plans:', error);
      throw error instanceof Error ? error : new Error('Erro ao buscar planos');
    }
  }

  async getCurrentSubscription(): Promise<Subscription | null> {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions/current`, {
        headers: this.getAuthHeaders()
      });

      return this.handleResponse<Subscription | null>(response);
    } catch (error) {
      console.error('Error fetching current subscription:', error);
      throw error instanceof Error ? error : new Error('Erro ao buscar assinatura atual');
    }
  }

  async upgradePlan(planId: string): Promise<{ success: boolean; subscriptionId: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions/upgrade`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ planId })
      });

      return this.handleResponse<{ success: boolean; subscriptionId: string }>(response);
    } catch (error) {
      console.error('Error upgrading plan:', error);
      throw error instanceof Error ? error : new Error('Erro ao fazer upgrade do plano');
    }
  }

  async downgradePlan(reason: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions/downgrade`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ reason })
      });

      return this.handleResponse<{ success: boolean }>(response);
    } catch (error) {
      console.error('Error downgrading plan:', error);
      throw error instanceof Error ? error : new Error('Erro ao fazer downgrade do plano');
    }
  }

  async cancelSubscription(reason: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions/cancel`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ reason })
      });

      return this.handleResponse<{ success: boolean }>(response);
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error instanceof Error ? error : new Error('Erro ao cancelar assinatura');
    }
  }

  async reactivateSubscription(): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions/reactivate`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      return this.handleResponse<{ success: boolean }>(response);
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      throw error instanceof Error ? error : new Error('Erro ao reativar assinatura');
    }
  }

  async getUsageMetrics(): Promise<{
    campaignsThisMonth: number;
    approvalRate: number;
    monthlyEarnings: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions/metrics`, {
        headers: this.getAuthHeaders()
      });

      return this.handleResponse<{
        campaignsThisMonth: number;
        approvalRate: number;
        monthlyEarnings: number;
      }>(response);
    } catch (error) {
      console.error('Error fetching usage metrics:', error);
      throw error instanceof Error ? error : new Error('Erro ao buscar métricas de uso');
    }
  }
}

export const planService = PlanService.getInstance();