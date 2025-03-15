import { API_URL } from "./constants";
import { authService } from "./authService";
import { storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import {CepSerchDto} from "../types/cep-search-dto.ts";
import {PersonalDataDto} from "../types/personal-data-dto.ts";

export interface ProfileData {
  id: string;
  name: string;
  username: string;
  verified: boolean;
  avatar: string;
  coverImage: string;
  bio: {
    headline: string;
    tagline: string;
    description: string;
    specialties: string[];
  };
  location: string;
  languages: string[];
  website: string;
  contact: {
    email: string;
    phone: string;
  };
  metrics: {
    totalReach: string;
    avgEngagement: string;
    completedCampaigns: number;
    rating: number;
  };
  pricing: {
    feed: number;
    story: number;
    reels: number;
    video: number;
  };
  platforms: Array<{
    name: string;
    username: string;
    followers: number;
    engagement: number;
    link: string;
  }>;
  expertise: Array<{
    name: string;
    description: string;
    campaigns: number;
  }>;
  recentCampaigns: Array<{
    brand: string;
    product: string;
    type: string;
    performance: {
      views: string;
      engagement: string;
      clicks: string;
    };
  }>;
}

class ProfileService {
  private static instance: ProfileService;
  private readonly baseUrl: string;
  private readonly defaultHeaders: HeadersInit;

  private constructor() {
    this.baseUrl = API_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  public static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
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

  async getProfile(): Promise<ProfileData> {
    try {
      const response = await fetch(`${this.baseUrl}/profile`, {
        headers: this.getAuthHeaders()
      });

      return this.handleResponse<ProfileData>(response);
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      // Return empty profile data on error
      return {
        id: '',
        name: '',
        username: '',
        verified: false,
        avatar: '',
        coverImage: '',
        bio: {
          headline: '',
          tagline: '',
          description: '',
          specialties: []
        },
        location: '',
        languages: [],
        website: '',
        contact: {
          email: '',
          phone: ''
        },
        metrics: {
          totalReach: '0',
          avgEngagement: '0%',
          completedCampaigns: 0,
          rating: 0
        },
        pricing: {
          feed: 0,
          story: 0,
          reels: 0,
          video: 0
        },
        platforms: [],
        expertise: [],
        recentCampaigns: []
      };
    }
  }

  async updateProfile(data: Partial<PersonalDataDto>): Promise<boolean> {
    try {
      await fetch(`${this.baseUrl}/profile`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });

      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error instanceof Error ? error : new Error('Erro ao atualizar perfil');
    }
  }

  async uploadProfileImage(file: File, type: 'avatar' | 'cover'): Promise<string> {
    try {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Imagem deve ter no máximo 5MB');
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Arquivo deve ser uma imagem');
      }

      // Generate unique filename
      const fileExtension = file.name.split('.').pop();
      const fileName = `profile-images/${type}/${uuidv4()}.${fileExtension}`;
      
      // Create storage reference
      const storageRef = ref(storage, fileName);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadUrl = await getDownloadURL(snapshot.ref);
      
      // Update profile with new image URL
      await this.updateProfile({
        [type === 'avatar' ? 'avatar' : 'coverImage']: downloadUrl
      });

      return downloadUrl;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error instanceof Error ? error : new Error('Erro ao fazer upload da imagem');
    }
  }

  async updatePricing(pricing: ProfileData['pricing']): Promise<ProfileData> {
    try {
      const response = await fetch(`${this.baseUrl}/profile/pricing`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(pricing)
      });

      return this.handleResponse<ProfileData>(response);
    } catch (error) {
      console.error('Error updating pricing:', error);
      throw error instanceof Error ? error : new Error('Erro ao atualizar preços');
    }
  }

  async updateExpertise(expertise: ProfileData['expertise']): Promise<ProfileData> {
    try {
      const response = await fetch(`${this.baseUrl}/profile/expertise`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(expertise)
      });

      return this.handleResponse<ProfileData>(response);
    } catch (error) {
      console.error('Error updating expertise:', error);
      throw error instanceof Error ? error : new Error('Erro ao atualizar áreas de expertise');
    }
  }

  async getProfileMetrics(): Promise<{
    views: number[];
    engagement: number[];
    earnings: number[];
    dates: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/profile/metrics`, {
        headers: this.getAuthHeaders()
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching profile metrics:', error);
      
      // Return empty arrays on error
      return {
        views: [],
        engagement: [],
        earnings: [],
        dates: []
      };
    }
  }

  async searchCEP(cep: string): Promise<CepSerchDto> {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) {
        throw new Error('Erro ao buscar o CEP');
      }
      const data = await response.json();
      if (data.erro) {
        throw new Error('CEP não encontrado');
      }
      return data;
    } catch (error) {
      console.error('Erro:', error);
      return null;
    }
  }

  async updateAddress(addressData: {
    cep: string | undefined;
    street: string | undefined;
    number: string | undefined;
    neighborhood: string | undefined;
    city: string | undefined;
    state: string | undefined
  }) {


    return true;
  }

  async updateBankInfo(bankData: {
    bank: string | undefined;
    accountType: string | undefined;
    agency: string | undefined;
    account: string | undefined
  }) {

    return true
  }
}

export const profileService = ProfileService.getInstance();