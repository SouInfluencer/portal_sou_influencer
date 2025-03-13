import { API_URL } from "./constants";
import { authService } from "./authService";
import type { SocialAccount } from "../types";
import { storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

interface ValidationResponse {
  valid: boolean;
  username?: string;
  followers?: number;
  engagement?: number;
  error?: string;
}

class SocialNetworkService {
  private static instance: SocialNetworkService;
  private readonly baseUrl: string;
  private readonly defaultHeaders: HeadersInit;

  private constructor() {
    this.baseUrl = API_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  public static getInstance(): SocialNetworkService {
    if (!SocialNetworkService.instance) {
      SocialNetworkService.instance = new SocialNetworkService();
    }
    return SocialNetworkService.instance;
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

  async validateAccount(platform: string, username: string): Promise<ValidationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/social-networks/validate`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ platform, username })
      });

      return this.handleResponse<ValidationResponse>(response);
    } catch (error) {
      console.error('Error validating account:', error);
      throw error instanceof Error ? error : new Error('Erro ao validar conta');
    }
  }

  async submitValidationPost(platform: string, username: string, postUrl: string): Promise<ValidationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/social-networks/validate/post`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ platform, username, postUrl })
      });

      return this.handleResponse<ValidationResponse>(response);
    } catch (error) {
      console.error('Error submitting validation post:', error);
      throw error instanceof Error ? error : new Error('Erro ao validar publicação');
    }
  }

  async connectAccount(platform: string, username: string): Promise<SocialAccount> {
    try {
      const response = await fetch(`${this.baseUrl}/social-networks/connect`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ platform, username })
      });

      return this.handleResponse<SocialAccount>(response);
    } catch (error) {
      console.error('Error connecting account:', error);
      throw error instanceof Error ? error : new Error('Erro ao conectar conta');
    }
  }

  async uploadValidationImage(imageFile: File): Promise<string> {
    try {
      // Generate unique filename
      const fileExtension = imageFile.name.split('.').pop();
      const fileName = `validation-images/${uuidv4()}.${fileExtension}`;
      
      // Create storage reference
      const storageRef = ref(storage, fileName);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, imageFile);
      
      // Get download URL
      const downloadUrl = await getDownloadURL(snapshot.ref);
      
      return downloadUrl;
    } catch (error) {
      console.error('Error uploading validation image:', error);
      throw error instanceof Error ? error : new Error('Erro ao fazer upload da imagem');
    }
  }

  async getValidationImage(platform: string): Promise<{
    imageUrl: string;
    caption: string;
  }> {
    try {
      // First try to get validation image from API
      const response = await fetch(`${this.baseUrl}/social-networks/validation-image/${platform}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      return this.handleResponse<{
        imageUrl: string;
        caption: string;
      }>(response);
    } catch (error) {
      console.error('Error getting validation image:', error);
      
      // Return default values if API fails
      return {
        imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop',
        caption: '#SouInfluencer #Verificação\n\nEste post confirma que sou eu mesmo(a) conectando minha conta à plataforma Sou Influencer.'
      };
    }
  }
}

export const socialNetworkService = SocialNetworkService.getInstance();