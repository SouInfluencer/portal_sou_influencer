/*
  # Add settings fields to users table

  1. New Columns
    - Address fields:
      - cep (text)
      - street (text)
      - number (text)
      - complement (text)
      - neighborhood (text)
      - city (text)
      - state (text)
    - Bank fields:
      - bank (text)
      - account_type (text)
      - agency (text)
      - account (text)

  2. Changes
    - Add new columns to users table
    - Update policies to allow access to new columns

  3. Security
    - Maintain existing RLS policies
    - Allow users to update their own data
*/

-- Add address fields if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'cep') THEN
    ALTER TABLE public.users ADD COLUMN cep text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'street') THEN
    ALTER TABLE public.users ADD COLUMN street text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'number') THEN
    ALTER TABLE public.users ADD COLUMN number text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'complement') THEN
    ALTER TABLE public.users ADD COLUMN complement text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'neighborhood') THEN
    ALTER TABLE public.users ADD COLUMN neighborhood text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'city') THEN
    ALTER TABLE public.users ADD COLUMN city text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'state') THEN
    ALTER TABLE public.users ADD COLUMN state text;
  END IF;

  -- Add bank fields
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'bank') THEN
    ALTER TABLE public.users ADD COLUMN bank text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'account_type') THEN
    ALTER TABLE public.users ADD COLUMN account_type text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'agency') THEN
    ALTER TABLE public.users ADD COLUMN agency text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'account') THEN
    ALTER TABLE public.users ADD COLUMN account text;
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