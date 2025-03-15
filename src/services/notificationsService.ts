import { API_URL } from "./constants";
import { authService } from "./authService";

export interface Notification {
  id: string;
  type: 'campaign' | 'message' | 'payment' | 'review';
  title: string;
  description: string;
  time: string;
  read: boolean;
  action?: {
    label: string;
    href: string;
  };
}

class NotificationsService {
  private static instance: NotificationsService;
  private readonly baseUrl: string;
  private readonly defaultHeaders: HeadersInit;

  private constructor() {
    this.baseUrl = API_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  public static getInstance(): NotificationsService {
    if (!NotificationsService.instance) {
      NotificationsService.instance = new NotificationsService();
    }
    return NotificationsService.instance;
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

  async getNotifications(filters?: {
    type?: string[];
    read?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{
    data: Notification[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters) {
        if (filters.type?.length) queryParams.append('type', filters.type.join(','));
        if (filters.read !== undefined) queryParams.append('read', filters.read.toString());
        if (filters.page) queryParams.append('page', filters.page.toString());
        if (filters.limit) queryParams.append('limit', filters.limit.toString());
      }

      const response = await fetch(
        `${this.baseUrl}/notifications?${queryParams.toString()}`,
        { headers: this.getAuthHeaders() }
      );

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      
      // Return empty data on error
      return {
        data: [],
        total: 0,
        page: filters?.page || 1,
        totalPages: 0
      };
    }
  }

  async markAsRead(notificationId: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/notifications/${notificationId}/read`,
        {
          method: 'PUT',
          headers: this.getAuthHeaders()
        }
      );

      return this.handleResponse<{ success: boolean }>(response);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error instanceof Error ? error : new Error('Erro ao marcar notificação como lida');
    }
  }

  async markAllAsRead(): Promise<{ success: boolean }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/notifications/read-all`,
        {
          method: 'PUT',
          headers: this.getAuthHeaders()
        }
      );

      return this.handleResponse<{ success: boolean }>(response);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error instanceof Error ? error : new Error('Erro ao marcar todas notificações como lidas');
    }
  }

  async deleteNotification(notificationId: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/notifications/${notificationId}`,
        {
          method: 'DELETE',
          headers: this.getAuthHeaders()
        }
      );

      return this.handleResponse<{ success: boolean }>(response);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error instanceof Error ? error : new Error('Erro ao excluir notificação');
    }
  }

  async deleteAllNotifications(): Promise<{ success: boolean }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/notifications`,
        {
          method: 'DELETE',
          headers: this.getAuthHeaders()
        }
      );

      return this.handleResponse<{ success: boolean }>(response);
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      throw error instanceof Error ? error : new Error('Erro ao excluir todas as notificações');
    }
  }
}

export const notificationsService = NotificationsService.getInstance();