/*
  # Create campaigns table and related schemas

  1. New Tables
    - `campaigns`
      - Basic campaign info
      - Budget and deadline
      - Platform and content type
      - Requirements and status
    - `campaign_categories`
      - Links campaigns to categories
    - `campaign_influencers`
      - Links campaigns to influencers

  2. Security
    - Enable RLS on all tables
    - Add policies for CRUD operations
    - Ensure proper user access control
*/

-- Create campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  budget numeric NOT NULL,
  deadline timestamptz NOT NULL,
  platform text NOT NULL,
  content_type text NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'in_progress', 'completed', 'cancelled')),
  requirements jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create campaign_categories table
CREATE TABLE IF NOT EXISTS public.campaign_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(campaign_id, category_id)
);

-- Create campaign_influencers table
CREATE TABLE IF NOT EXISTS public.campaign_influencers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(campaign_id, user_id)
);

-- Enable RLS
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_influencers ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX campaigns_user_id_idx ON public.campaigns(user_id);
CREATE INDEX campaigns_status_idx ON public.campaigns(status);
CREATE INDEX campaign_categories_campaign_id_idx ON public.campaign_categories(campaign_id);
CREATE INDEX campaign_categories_category_id_idx ON public.campaign_categories(category_id);
CREATE INDEX campaign_influencers_campaign_id_idx ON public.campaign_influencers(campaign_id);
CREATE INDEX campaign_influencers_user_id_idx ON public.campaign_influencers(user_id);
CREATE INDEX campaign_influencers_status_idx ON public.campaign_influencers(status);

-- Create policies for campaigns
CREATE POLICY "Users can read own campaigns" ON public.campaigns
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own campaigns" ON public.campaigns
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaigns" ON public.campaigns
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own campaigns" ON public.campaigns
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for campaign_categories
CREATE POLICY "Users can read own campaign categories" ON public.campaign_categories
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.campaigns
    WHERE id = campaign_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own campaign categories" ON public.campaign_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.campaigns
    WHERE id = campaign_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own campaign categories" ON public.campaign_categories
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.campaigns
    WHERE id = campaign_id AND user_id = auth.uid()
  ));

-- Create policies for campaign_influencers
CREATE POLICY "Users can read own campaign influencers" ON public.campaign_influencers
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.campaigns
    WHERE id = campaign_id AND user_id = auth.uid()
  ) OR user_id = auth.uid());

CREATE POLICY "Users can insert own campaign influencers" ON public.campaign_influencers
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.campaigns
    WHERE id = campaign_id AND user_id = auth.uid()
  ) OR user_id = auth.uid());

CREATE POLICY "Users can update own campaign influencers" ON public.campaign_influencers
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.campaigns
    WHERE id = campaign_id AND user_id = auth.uid()
  ) OR user_id = auth.uid())
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.campaigns
    WHERE id = campaign_id AND user_id = auth.uid()
  ) OR user_id = auth.uid());

CREATE POLICY "Users can delete own campaign influencers" ON public.campaign_influencers
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.campaigns
    WHERE id = campaign_id AND user_id = auth.uid()
  ) OR user_id = auth.uid());

-- Create triggers for updated_at
CREATE TRIGGER campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER campaign_influencers_updated_at
  BEFORE UPDATE ON public.campaign_influencers
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Grant permissions
GRANT ALL ON public.campaigns TO postgres;
GRANT ALL ON public.campaigns TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaigns TO authenticated;

GRANT ALL ON public.campaign_categories TO postgres;
GRANT ALL ON public.campaign_categories TO service_role;
GRANT SELECT, INSERT, DELETE ON public.campaign_categories TO authenticated;

GRANT ALL ON public.campaign_influencers TO postgres;
GRANT ALL ON public.campaign_influencers TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaign_influencers TO authenticated;