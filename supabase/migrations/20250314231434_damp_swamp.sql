/*
  # Add cover_image column to users table

  1. New Column
    - `cover_image` (text) - User's cover image URL

  2. Changes
    - Add cover_image field to users table
    - Update policies to allow access to new column

  3. Security
    - Maintain existing RLS policies
    - Allow users to update their own cover image
*/

-- Add cover_image column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'cover_image') THEN
    ALTER TABLE public.users ADD COLUMN cover_image text;
  END IF;
END $$;

-- Update existing policies to include new field
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