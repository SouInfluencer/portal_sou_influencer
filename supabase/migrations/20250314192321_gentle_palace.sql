/*
  # Add missing columns to users table

  1. New Columns
    - `phone` (text) - User's phone number
    - `location` (text) - User's location
    - `email_notifications` (jsonb) - User's email notification preferences
    - `push_notifications` (jsonb) - User's push notification preferences

  2. Changes
    - Add missing columns to users table
    - Set default values for notification preferences
    - Update policies to allow access to new columns

  3. Security
    - Maintain existing RLS policies
    - Allow users to update their own data
*/

-- Add missing columns if they don't exist
DO $$ 
BEGIN
  -- Add phone column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'phone') THEN
    ALTER TABLE public.users ADD COLUMN phone text;
  END IF;

  -- Add location column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'location') THEN
    ALTER TABLE public.users ADD COLUMN location text;
  END IF;

  -- Add email_notifications column with default values
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email_notifications') THEN
    ALTER TABLE public.users ADD COLUMN email_notifications jsonb DEFAULT jsonb_build_object(
      'campaigns', true,
      'messages', true,
      'updates', false,
      'marketing', false
    );
  END IF;

  -- Add push_notifications column with default values
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'push_notifications') THEN
    ALTER TABLE public.users ADD COLUMN push_notifications jsonb DEFAULT jsonb_build_object(
      'campaigns', true,
      'messages', true,
      'updates', true,
      'marketing', false
    );
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