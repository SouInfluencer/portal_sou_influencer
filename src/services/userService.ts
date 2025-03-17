import {API_URL} from "./constants.ts";
import { supabase } from '../lib/supabase';

class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public async checkUsernameAvailability(username: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('username', username);

      if (error) {
        throw new Error('Erro ao verificar disponibilidade do nome de usuário');
      }

      // Return true if no users found with this username (meaning it's available)
      return !data || data.length === 0;
    } catch (err) {
      console.error('Error checking username availability:', err);
      throw new Error('Falha ao verificar disponibilidade. Tente novamente.');
    }
  }
}

export const userService = UserService.getInstance();