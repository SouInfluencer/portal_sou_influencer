/*
  # Add social network validation fields

  1. New Table
    - `social_networks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `platform` (text)
      - `username` (text)
      - `post_url` (text)
      - `status` (text)
      - `verified` (boolean)
      - `verified_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for CRUD operations
    - Add validation status tracking
*/

-- Create social_networks table
CREATE TABLE IF NOT EXISTS public.social_networks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  platform text NOT NULL,
  username text NOT NULL,
  post_url text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'validating', 'approved', 'rejected')),
  verified boolean DEFAULT false,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, platform, username)
);

-- Enable RLS
ALTER TABLE public.social_networks ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS social_networks_user_id_idx ON public.social_networks(user_id);
CREATE INDEX IF NOT EXISTS social_networks_platform_idx ON public.social_networks(platform);
CREATE INDEX IF NOT EXISTS social_networks_status_idx ON public.social_networks(status);

-- Create policies
CREATE POLICY "Users can read own social networks"
  ON public.social_networks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own social networks"
  ON public.social_networks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own social networks"
  ON public.social_networks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own social networks"
  ON public.social_networks
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