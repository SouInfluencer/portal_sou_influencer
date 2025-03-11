export interface User {
  id: string;
  profile: 'INFLUENCER' | 'ADVERTISER' | 'ADMIN';
  owner: boolean;
  completeRegistration?: boolean;
  firstName: string;
  lastName: string;
  status: string;
  email: string;
  avatar?: string;
  username: string;
  imageUrl?: string;
}

export interface SocialAccount {
  platform: 'instagram' | 'youtube' | 'twitter' | 'tiktok';
  username: string;
  followers: number;
  pricing: {
    post: number;
    story: number;
    reels: number;
  };
  verified: boolean;
  connected: boolean;
  accountType: 'personal' | 'creator' | 'business';
  contentCategories: string[];
  contentTypes: string[];
  audienceAge: string[];
  audienceGender: {
    male: number;
    female: number;
    other: number;
  };
  audienceLocations: string[];
}

export interface Influencer extends User {
  type: 'influencer';
  niche: string[];
  followers: number;
  engagement: number;
  platforms: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    twitter?: string;
    linkedin?: string;
  };
  pricing: {
    post: number;
    story: number;
    video: number;
    live: number;
  };
  location: string;
}

export interface Business extends User {
  type: 'business';
  cnpj: string;
  segment: string;
  averageBudget: number;
  campaigns: Campaign[];
}

export interface Campaign {
  id: string;
  title: string;
  brand: {
    name: string;
    logo?: string;
  };
  description: string;
  budget: number;
  deadline: Date;
  requirements: string[];
  platform: string;
  contentType: string;
  status: 'pending' | 'accepted' | 'delivered' | 'approved' | 'completed' | 'rejected';
  deliveryProof?: {
    url: string;
    submittedAt: Date;
    status: 'pending' | 'approved' | 'rejected';
    feedback?: string;
  };
  payment?: {
    status: 'pending' | 'processing' | 'completed';
    amount: number;
    processedAt?: Date;
  };
}