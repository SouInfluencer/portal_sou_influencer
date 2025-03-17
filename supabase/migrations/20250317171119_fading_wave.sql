/*
  # Add campaign progress tracking for multiple influencers

  1. Changes
    - Add rejection_reason field to campaign_influencers
    - Add progress tracking fields for each stage
    - Add validation fields for content review

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Update campaign_influencers table with progress tracking
ALTER TABLE public.campaign_influencers
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'delivered', 'approved', 'rejected')),
  ADD COLUMN IF NOT EXISTS rejection_reason text,
  ADD COLUMN IF NOT EXISTS accepted_at timestamptz,
  ADD COLUMN IF NOT EXISTS production_started_at timestamptz,
  ADD COLUMN IF NOT EXISTS delivered_at timestamptz,
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS rejected_at timestamptz,
  ADD COLUMN IF NOT EXISTS post_url text,
  ADD COLUMN IF NOT EXISTS post_caption text,
  ADD COLUMN IF NOT EXISTS post_hashtags text[],
  ADD COLUMN IF NOT EXISTS post_mentions text[],
  ADD COLUMN IF NOT EXISTS validation_feedback text,
  ADD COLUMN IF NOT EXISTS engagement_metrics jsonb DEFAULT '{}'::jsonb;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS campaign_influencers_status_idx ON public.campaign_influencers(status);

-- Update campaign status to be derived from influencers' status
CREATE OR REPLACE FUNCTION update_campaign_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update campaign status based on influencers' status
  UPDATE campaigns c
  SET status = (
    CASE
      WHEN NOT EXISTS (SELECT 1 FROM campaign_influencers WHERE campaign_id = c.id) THEN 'draft'
      WHEN EXISTS (SELECT 1 FROM campaign_influencers WHERE campaign_id = c.id AND status = 'rejected') THEN 'needs_revision'
      WHEN EXISTS (SELECT 1 FROM campaign_influencers WHERE campaign_id = c.id AND status = 'pending') THEN 'pending_acceptance'
      WHEN EXISTS (SELECT 1 FROM campaign_influencers WHERE campaign_id = c.id AND status = 'in_progress') THEN 'in_progress'
      WHEN EXISTS (SELECT 1 FROM campaign_influencers WHERE campaign_id = c.id AND status = 'delivered') THEN 'in_review'
      WHEN EXISTS (SELECT 1 FROM campaign_influencers WHERE campaign_id = c.id AND status = 'approved') THEN 'completed'
      ELSE c.status
    END
  )
  WHERE id = NEW.campaign_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update campaign status
DROP TRIGGER IF EXISTS update_campaign_status_trigger ON campaign_influencers;
CREATE TRIGGER update_campaign_status_trigger
  AFTER INSERT OR UPDATE OF status
  ON campaign_influencers
  FOR EACH ROW
  EXECUTE FUNCTION update_campaign_status();

-- Update campaigns table status check
ALTER TABLE campaigns 
  DROP CONSTRAINT IF EXISTS campaigns_status_check,
  ADD CONSTRAINT campaigns_status_check 
  CHECK (status IN ('draft', 'pending_acceptance', 'in_progress', 'in_review', 'needs_revision', 'completed', 'cancelled'));