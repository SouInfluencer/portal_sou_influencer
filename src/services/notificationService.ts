import { API_URL } from "./constants";
import { authService } from "./authService";

interface NotificationPreferences {
  emailNotifications: {
    campaigns: boolean;
    messages: boolean;
    updates: boolean;
    marketing: boolean;
  };
  pushNotifications: {
    campaigns: boolean;
    messages: boolean;
    updates: boolean;
    marketing: boolean;
  };
}

class NotificationService {
  private static instance: NotificationService;
  private readonly baseUrl: string;
  private readonly defaultHeaders: HeadersInit;

  private constructor() {
    this.baseUrl = API_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
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

  async getNotificationPreferences(): Promise<NotificationPreferences> {
    try {
      const response = await fetch(`${this.baseUrl}/user/notifications/preferences`, {
        headers: this.getAuthHeaders()
      });

      return this.handleResponse<NotificationPreferences>(response);
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      throw error instanceof Error ? error : new Error('Erro ao buscar preferências de notificação');
    }
  }

  async updateNotificationPreferences(
    type: 'email' | 'push',
    setting: string,
    enabled: boolean
  ): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/user/notifications/preferences`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          type,
          setting,
          enabled
        })
      });

      return this.handleResponse<{ success: boolean }>(response);
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error instanceof Error ? error : new Error('Erro ao atualizar preferências de notificação');
    }
  }

  async updateAllNotificationPreferences(preferences: NotificationPreferences): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/user/notifications/preferences/all`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(preferences)
      });

      return this.handleResponse<{ success: boolean }>(response);
    } catch (error) {
      console.error('Error updating all notification preferences:', error);
      throw error instanceof Error ? error : new Error('Erro ao atualizar todas as preferências de notificação');
    }
  }
}

export const notificationService = NotificationService.getInstance();