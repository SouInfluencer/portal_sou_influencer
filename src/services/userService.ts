import {API_URL} from "./constants.ts";

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
      const response = await fetch(`${API_URL}/user/check-username?username=${username}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao verificar disponibilidade do nome de usuário');
      }

      const data = await response.json();
      return !data.exists; // Se "exists" for true, o nome já está em uso
    } catch (err) {
      console.error(err);
      throw new Error('Falha ao verificar disponibilidade. Tente novamente.');
    }
  };

}

export const userService = UserService.getInstance();