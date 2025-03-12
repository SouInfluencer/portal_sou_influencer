export interface WaitlistEntry {
  full_name: string;
  email: string;
  profile_type: 'influencer' | 'brand';
}

export interface InfluencerProfile {
  waitlist_id?: string;
  followers_count: number | null; // Updated to allow null
  instagram_handle?: string;
  social_networks: string;
}

export interface BrandProfile {
  waitlist_id?: string;
  segment: string;
  company_size: 'small' | 'medium' | 'large';
}

export interface WaitlistFormData extends WaitlistEntry {
  influencer_profile?: InfluencerProfile;
  brand_profile?: BrandProfile;
}