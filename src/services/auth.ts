import { User } from '../types';

interface AuthResponse {
  user: User;
  accessToken: string;
  expiresIn: number;
}

interface LoginCredentials {
  email: string;
  password: string;
  checkme?: boolean;
}

class AuthService {
  private static instance: AuthService;
  private API_URL = 'https://api.souinfluencer.com.br';

  private constructor() {}

  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_URL}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          profile: 'INFLUENCER'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar conta');
      }

      const user = await response.json();
      
      // Automatically login after successful registration
      const authResponse = await this.login({
        email: data.email,
        password: data.password
      });
      
      return authResponse;
    } catch (error) {
      throw error;
    }
  }


  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async requestPasswordReset(email: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (data.code === 'USER_NOT_FOUND') {
          throw new Error('Usuário não encontrado.');
        }
        throw new Error(data.message || 'Erro ao solicitar redefinição de senha.');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }


  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_URL}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const data = await response.json();
      this.setSession(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expiresIn');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const expiresIn = this.getExpiresIn();
    
    if (!token || !expiresIn) {
      return false;
    }

    return Date.now() < expiresIn;
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  private getExpiresIn(): number | null {
    const expiresIn = localStorage.getItem('expiresIn');
    return expiresIn ? parseInt(expiresIn) : null;
  }

  private setSession(authResult: AuthResponse): void {
    localStorage.setItem('user', JSON.stringify(authResult.user));
    localStorage.setItem('accessToken', authResult.accessToken);
    localStorage.setItem('expiresIn', authResult.expiresIn.toString());
  }
}

export const authService = AuthService.getInstance();