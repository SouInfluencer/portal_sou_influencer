import { ImageIcon } from 'lucide-react';

export type CampaignType = 'single' | 'multiple';
export type Platform = 'Instagram' | 'YouTube' | 'TikTok';
export type ContentType = 'Feed' | 'Story' | 'Reels' | 'Shorts' | 'Video' | 'Live';

export interface ContentTypeOption {
  id: ContentType;
  label: string;
  icon: typeof ImageIcon;
  description: string;
  platforms: Platform[];
}

export interface CampaignForm {
  type: CampaignType;
  categories: string[];
  title: string;
  description: string;
  platform: Platform;
  contentType: ContentType;
  budget: number;
  deadline: string;
  requirements: string[];
  influencer?: Influencer;
  content?: {
    caption?: string;
    hashtags?: string[];
    mentions?: string[];
  };
}

export interface Influencer {
  id: string;
  name: string;
  avatar: string;
  platform: Platform;
  followers: number;
  engagement: number;
  categories: string[];
  location: string;
}

export interface InfluencerFilters {
  platform?: Platform;
  minFollowers?: number;
  maxFollowers?: number;
  categories?: string[];
  location?: string;
}

export interface CampaignType {
  id: string;
  title: string;
  status: 'proposal' | 'production' | 'prepayment' | 'delivery' | 'validation' | 'payment';
  nextAction: {
    title: string;
    description: string;
    action: string;
    buttonText: string;
  };
  metrics: Array<{
    icon: React.ElementType;
    label: string;
    value: string;
    color?: string;
  }>;
  tasks: Array<{
    title: string;
    completed: boolean;
    description?: string;
  }>;
}