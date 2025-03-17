/*
  # Add validation fields to social networks table

  1. New Columns
    - `validation_image` (text) - URL of the validation image
    - `validation_caption` (text) - Required caption for validation
    - `validation_instructions` (text) - Platform-specific instructions

  2. Changes
    - Add new columns for validation process
    - Update status check constraint
    - Add validation-related fields

  3. Security
    - Maintain existing RLS policies
    - Allow users to update validation fields
*/

-- Drop existing table and policies if they exist
DROP TABLE IF EXISTS public.social_networks CASCADE;

-- Create social_networks table with validation fields
CREATE TABLE public.social_networks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  platform text NOT NULL,
  username text NOT NULL,
  post_url text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'validating', 'approved', 'rejected')),
  verified boolean DEFAULT false,
  verified_at timestamptz,
  validation_image text,
  validation_caption text,
  validation_instructions text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, platform, username)
);

-- Enable RLS
ALTER TABLE public.social_networks ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX social_networks_user_id_idx ON public.social_networks(user_id);
CREATE INDEX social_networks_platform_idx ON public.social_networks(platform);
CREATE INDEX social_networks_status_idx ON public.social_networks(status);

-- Create policies with unique names
CREATE POLICY "social_networks_select_policy" ON public.social_networks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "social_networks_insert_policy" ON public.social_networks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "social_networks_update_policy" ON public.social_networks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "social_networks_delete_policy" ON public.social_networks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER social_networks_updated_at
  BEFORE UPDATE ON public.social_networks
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Grant permissions
GRANT ALL ON public.social_networks TO postgres;
GRANT ALL ON public.social_networks TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_networks TO authenticated;