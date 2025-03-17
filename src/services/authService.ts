import { createClient } from '@supabase/supabase-js';
import { User } from '../types';

const supabaseUrl = 'https://gtowalbzuwhztxyvreut.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0b3dhbGJ6dXdoenR4eXZyZXV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5NzUzMTgsImV4cCI6MjA1NzU1MTMxOH0.0ZELY6qbmJGToTKCoiFMK6mOtbY8YBR6pmWB07xZXNs';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface LoginCredentials {
  email: string;
  password: string;
  checkme?: boolean;
}

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profile: string;
  }): Promise<any> {
    try {
      // Create auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            profile: data.profile,
            full_name: `${data.firstName} ${data.lastName}`
          }
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      // Create user profile in users table
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email: data.email,
              first_name: data.firstName,
              last_name: data.lastName,
              profile: data.profile,
              full_name: `${data.firstName} ${data.lastName}`,
              complete_registration: false
            }
          ]);

        if (profileError) {
          // Rollback auth user creation
          await supabase.auth.admin.deleteUser(authData.user.id);
          throw new Error('Erro ao criar perfil do usuário');
        }
      }

      return authData;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Erro ao criar conta');
    }
  }

  async requestPasswordReset(email: string): Promise<{ success: boolean }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  }

  async login(credentials: LoginCredentials): Promise<any> {
    try {
      // Sign in with Supabase Auth
      const { data: { user, session }, error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          throw new Error('Email ou senha incorretos');
        }
        throw signInError;
      }

      if (!user || !session) {
        throw new Error('Erro ao fazer login');
      }

      // Get user profile data
      let { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (userError) {
        console.error('Error fetching user data:', userError);
        throw new Error('Erro ao carregar dados do usuário');
      }

      if (!userData) {
        // If user doesn't exist in users table, create profile
        const { error: createError } = await supabase
          .from('users')
          .insert([{
            id: user.id,
            email: user.email,
            first_name: user.user_metadata.first_name,
            last_name: user.user_metadata.last_name,
            profile: user.user_metadata.profile,
            full_name: user.user_metadata.full_name,
            complete_registration: false
          }]);

        if (createError) {
          console.error('Error creating user profile:', createError);
          throw new Error('Erro ao criar perfil do usuário');
        }

        userData = {
          id: user.id,
          email: user.email,
          first_name: user.user_metadata.first_name,
          last_name: user.user_metadata.last_name,
          profile: user.user_metadata.profile,
          full_name: user.user_metadata.full_name,
          complete_registration: false
        };
      }

      const userProfile = {
        id: user.id,
        email: user.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        profile: userData.profile,
        username: userData.username,
        imageUrl: userData.avatar_url,
        completeRegistration: userData.complete_registration
      };

      // Set session data
      this.setSession({
        user: userProfile,
        accessToken: session.access_token,
        expiresIn: new Date().getTime() + (session.expires_in || 3600) * 1000
      });

      return {
        user: userProfile,
        session: session
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Delete bank account data
      const { error: bankError } = await supabase
        .from('bank_accounts')
        .delete()
        .eq('user_id', user.id);

      if (bankError) {
        console.error('Error deleting bank account:', bankError);
      }

      // Delete address data
      const { error: addressError } = await supabase
        .from('addresses')
        .delete()
        .eq('user_id', user.id);

      if (addressError) {
        console.error('Error deleting address:', addressError);
      }

      // Delete user data
      const { error: userError } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id);

      if (userError) {
        throw new Error('Erro ao excluir dados do usuário');
      }

      // Sign out the user
      await this.logout();

      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Error deleting account:', error);
      throw new Error('Erro ao excluir conta');
    }
  }

  async logout(): Promise<void> {
    await supabase.auth.signOut();
    localStorage.removeItem('username');
    localStorage.removeItem('profile');
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

  private setSession(authResult: { user: User; accessToken: string; expiresIn: number }): void {
    localStorage.setItem('username', JSON.stringify(authResult.user.username));
    localStorage.setItem('profile', JSON.stringify(authResult.user.profile));
    localStorage.setItem('user', JSON.stringify(authResult.user));
    localStorage.setItem('accessToken', authResult.accessToken);
    localStorage.setItem('expiresIn', authResult.expiresIn.toString());
  }
}

export const authService = AuthService.getInstance();