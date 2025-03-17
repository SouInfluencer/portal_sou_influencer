/*
  # Add followers count to social networks table

  1. New Column
    - `followers_count` (bigint) - Number of followers for the social network
    - Default value: 0
    - Not nullable

  2. Changes
    - Add followers_count column to social_networks table
    - Update existing policies to include new field

  3. Security
    - Maintain existing RLS policies
    - Allow users to update their own followers count
*/

-- Add followers_count column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'social_networks' AND column_name = 'followers_count') THEN
    ALTER TABLE public.social_networks ADD COLUMN followers_count bigint NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Update existing policies to include new field
DROP POLICY IF EXISTS "social_networks_select_policy_v2" ON public.social_networks;
DROP POLICY IF EXISTS "social_networks_insert_policy_v2" ON public.social_networks;
DROP POLICY IF EXISTS "social_networks_update_policy_v2" ON public.social_networks;
DROP POLICY IF EXISTS "social_networks_delete_policy_v2" ON public.social_networks;

-- Recreate policies
CREATE POLICY "social_networks_select_policy_v2" ON public.social_networks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "social_networks_insert_policy_v2" ON public.social_networks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "social_networks_update_policy_v2" ON public.social_networks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "social_networks_delete_policy_v2" ON public.social_networks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.social_networks TO postgres;
GRANT ALL ON public.social_networks TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_networks TO authenticated;