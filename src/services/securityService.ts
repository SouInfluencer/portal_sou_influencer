import { API_URL } from "./constants";
import { authService } from "./authService";

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

class SecurityService {
  private static instance: SecurityService;
  private readonly baseUrl: string;
  private readonly defaultHeaders: HeadersInit;

  private constructor() {
    this.baseUrl = API_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  public static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
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

  async changePassword(data: PasswordChangeData): Promise<{ success: boolean }> {
    try {
      // Validate passwords match
      if (data.newPassword !== data.confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      // Validate password requirements
      if (data.newPassword.length < 8) {
        throw new Error('A nova senha deve ter pelo menos 8 caracteres');
      }

      const response = await fetch(`${this.baseUrl}/user/security/password`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        })
      });

      return this.handleResponse<{ success: boolean }>(response);
    } catch (error) {
      console.error('Error changing password:', error);
      throw error instanceof Error ? error : new Error('Erro ao alterar senha');
    }
  }

  async deleteAccount(password: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/user`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ password })
      });

      return this.handleResponse<{ success: boolean }>(response);
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error instanceof Error ? error : new Error('Erro ao excluir conta');
    }
  }

  async requestTwoFactorSetup(): Promise<{ qrCode: string; secret: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/user/security/2fa/setup`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });

      return this.handleResponse<{ qrCode: string; secret: string }>(response);
    } catch (error) {
      console.error('Error requesting 2FA setup:', error);
      throw error instanceof Error ? error : new Error('Erro ao configurar autenticação de dois fatores');
    }
  }

  async verifyTwoFactorSetup(token: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/user/security/2fa/verify`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ token })
      });

      return this.handleResponse<{ success: boolean }>(response);
    } catch (error) {
      console.error('Error verifying 2FA setup:', error);
      throw error instanceof Error ? error : new Error('Erro ao verificar autenticação de dois fatores');
    }
  }
}

export const securityService = SecurityService.getInstance();