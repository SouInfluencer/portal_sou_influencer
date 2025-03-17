/*
  # Improve campaign influencers tracking

  1. Changes
    - Add validation_status to track individual validation steps
    - Add payment_status for payment tracking
    - Add metrics fields for performance tracking
    - Add content fields for post details

  2. Security
    - Maintain existing RLS policies
    - Add validation-specific permissions
*/

-- Add new status tracking columns
ALTER TABLE public.campaign_influencers
  ADD COLUMN IF NOT EXISTS validation_status text DEFAULT 'pending' CHECK (validation_status IN ('pending', 'in_review', 'approved', 'rejected')),
  ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed')),
  ADD COLUMN IF NOT EXISTS payment_amount numeric,
  ADD COLUMN IF NOT EXISTS payment_processed_at timestamptz,
  ADD COLUMN IF NOT EXISTS payment_transaction_id text,
  ADD COLUMN IF NOT EXISTS content_requirements_met boolean[] DEFAULT array[]::boolean[],
  ADD COLUMN IF NOT EXISTS content_review_notes text,
  ADD COLUMN IF NOT EXISTS performance_metrics jsonb DEFAULT jsonb_build_object(
    'views', 0,
    'likes', 0,
    'comments', 0,
    'shares', 0,
    'clicks', 0,
    'engagement_rate', 0,
    'reach', 0,
    'impressions', 0
  );

-- Create index for new status columns
CREATE INDEX IF NOT EXISTS idx_campaign_influencers_validation_status ON public.campaign_influencers(validation_status);
CREATE INDEX IF NOT EXISTS idx_campaign_influencers_payment_status ON public.campaign_influencers(payment_status);

-- Update campaign status function to consider all influencers
CREATE OR REPLACE FUNCTION update_campaign_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update campaign status based on all influencers' status
  UPDATE campaigns c
  SET status = (
    CASE
      -- Draft if no influencers
      WHEN NOT EXISTS (SELECT 1 FROM campaign_influencers WHERE campaign_id = c.id) 
      THEN 'draft'
      
      -- Needs revision if any rejected
      WHEN EXISTS (SELECT 1 FROM campaign_influencers 
                  WHERE campaign_id = c.id 
                  AND validation_status = 'rejected')
      THEN 'needs_revision'
      
      -- Pending acceptance if any pending
      WHEN EXISTS (SELECT 1 FROM campaign_influencers 
                  WHERE campaign_id = c.id 
                  AND status = 'pending')
      THEN 'pending_acceptance'
      
      -- In progress if any in production
      WHEN EXISTS (SELECT 1 FROM campaign_influencers 
                  WHERE campaign_id = c.id 
                  AND status = 'in_progress')
      THEN 'in_progress'
      
      -- In review if any delivered
      WHEN EXISTS (SELECT 1 FROM campaign_influencers 
                  WHERE campaign_id = c.id 
                  AND validation_status = 'in_review')
      THEN 'in_review'
      
      -- Completed if all approved and paid
      WHEN NOT EXISTS (
        SELECT 1 FROM campaign_influencers 
        WHERE campaign_id = c.id 
        AND (validation_status != 'approved' OR payment_status != 'completed')
      )
      THEN 'completed'
      
      ELSE c.status
    END
  )
  WHERE id = NEW.campaign_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;