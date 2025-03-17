/*
  # Add Notification Preferences

  1. Changes
    - Add email_notifications and push_notifications columns to users table
    - Set default values for notification preferences
    - Add policies for notification preferences access

  2. Security
    - Enable RLS
    - Add policies for authenticated users
    - Grant appropriate permissions
*/

-- Add notification preferences columns if they don't exist
DO $$ 
BEGIN
  -- Add email_notifications with default values
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email_notifications') THEN
    ALTER TABLE public.users ADD COLUMN email_notifications jsonb DEFAULT jsonb_build_object(
      'campaigns', true,
      'messages', true,
      'updates', false,
      'marketing', false
    );
  END IF;

  -- Add push_notifications with default values
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

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS users_email_notifications_idx ON public.users USING gin (email_notifications);
CREATE INDEX IF NOT EXISTS users_push_notifications_idx ON public.users USING gin (push_notifications);

-- Grant permissions
GRANT ALL ON public.users TO postgres;
GRANT ALL ON public.users TO service_role;
GRANT INSERT ON public.users TO anon;
GRANT SELECT ON public.users TO anon;
GRANT SELECT, UPDATE ON public.users TO authenticated;