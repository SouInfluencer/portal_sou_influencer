/*
  # Add notification preferences columns

  1. New Columns
    - `email_notifications` (jsonb) - Email notification preferences
    - `push_notifications` (jsonb) - Push notification preferences

  2. Changes
    - Add default notification preferences structure
    - Update policies to allow access to new columns

  3. Security
    - Maintain existing RLS policies
    - Allow users to update their own notification preferences
*/

-- Add notification preferences columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email_notifications') THEN
    ALTER TABLE public.users ADD COLUMN email_notifications jsonb DEFAULT jsonb_build_object(
      'campaigns', true,
      'messages', true,
      'updates', false,
      'marketing', false
    );
  END IF;

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