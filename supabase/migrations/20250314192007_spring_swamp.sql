/*
  # Add location column to users table

  1. New Columns
    - `location` (text) - User's location/address
    - `website` (text) - User's website URL

  2. Changes
    - Add location and website fields to users table
    - Update policies to allow access to new columns

  3. Security
    - Maintain existing RLS policies
    - Allow users to update their own location and website
*/

-- Add location and website columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'location') THEN
    ALTER TABLE public.users ADD COLUMN location text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'website') THEN
    ALTER TABLE public.users ADD COLUMN website text;
  END IF;
END $$;

-- Update existing policies to include new fields
DROP POLICY IF EXISTS "Users can update own data" ON public.users;

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Grant permissions
GRANT ALL ON public.users TO postgres;
GRANT ALL ON public.users TO service_role;
GRANT INSERT ON public.users TO anon;
GRANT SELECT ON public.users TO anon;
GRANT SELECT, UPDATE ON public.users TO authenticated;