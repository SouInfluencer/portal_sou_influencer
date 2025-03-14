import { supabase } from '../lib/supabase';
import { Campaign } from '../types';

class CampaignService {
  private static instance: CampaignService;

  private constructor() {}

  public static getInstance(): CampaignService {
    if (!CampaignService.instance) {
      CampaignService.instance = new CampaignService();
    }
    return CampaignService.instance;
  }

  async createCampaign(campaignData: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>): Promise<Campaign> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Insert campaign
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .insert({
          user_id: user.id,
          title: campaignData.title,
          description: campaignData.description,
          budget: campaignData.budget,
          deadline: campaignData.deadline,
          platform: campaignData.platform,
          content_type: campaignData.contentType,
          requirements: campaignData.requirements,
          status: 'draft'
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Insert categories if provided
      if (campaignData.categories?.length) {
        const { data: categories } = await supabase
          .from('categories')
          .select('id')
          .in('name', campaignData.categories);

        if (categories && categories.length > 0) {
          const { error: categoriesError } = await supabase
            .from('campaign_categories')
            .insert(
              categories.map(category => ({
                campaign_id: campaign.id,
                category_id: category.id
              }))
            );

          if (categoriesError) throw categoriesError;
        }
      }

      // Insert influencer if provided
      if (campaignData.influencer) {
        const { error: influencerError } = await supabase
          .from('campaign_influencers')
          .insert({
            campaign_id: campaign.id,
            user_id: campaignData.influencer.id,
            status: 'pending'
          });

        if (influencerError) throw influencerError;
      }

      return campaign;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }

  async getCampaign(id: string): Promise<Campaign> {
    try {
      const { data: campaign, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          campaign_categories (
            categories (
              name
            )
          ),
          campaign_influencers (
            users (
              id,
              first_name,
              last_name,
              avatar_url
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!campaign) throw new Error('Campanha não encontrada');

      return campaign;
    } catch (error) {
      console.error('Error fetching campaign:', error);
      throw error;
    }
  }

  async getUserCampaigns(): Promise<Campaign[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const { data: campaigns, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          campaign_categories (
            categories (
              name
            )
          ),
          campaign_influencers (
            users (
              id,
              first_name,
              last_name,
              avatar_url
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return campaigns || [];
    } catch (error) {
      console.error('Error fetching user campaigns:', error);
      throw error;
    }
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign> {
    try {
      const { data: campaign, error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!campaign) throw new Error('Campanha não encontrada');

      return campaign;
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  }

  async deleteCampaign(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  }
}

export const campaignService = CampaignService.getInstance();