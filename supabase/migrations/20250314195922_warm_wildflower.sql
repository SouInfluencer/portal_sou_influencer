/*
  # Fix Bank Accounts Error

  1. Changes
    - Update RLS policies to handle empty results better
    - Add missing indexes and constraints
    - Ensure proper error handling for non-existent records

  2. Security
    - Maintain existing security model
    - Add service_role access for system operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own bank account" ON public.bank_accounts;
DROP POLICY IF EXISTS "Users can update own bank account" ON public.bank_accounts;
DROP POLICY IF EXISTS "Users can insert own bank account" ON public.bank_accounts;
DROP POLICY IF EXISTS "Users can delete own bank account" ON public.bank_accounts;

-- Create updated policies with better handling
CREATE POLICY "Users can read own bank account"
  ON public.bank_accounts
  FOR SELECT
  TO authenticated
  USING (
    -- Allow reading own records or if user has service_role
    auth.uid() = user_id OR
    auth.role() = 'service_role'
  );

CREATE POLICY "Users can update own bank account"
  ON public.bank_accounts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own bank account"
  ON public.bank_accounts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Ensure user can only insert their own records
    auth.uid() = user_id AND
    -- Ensure no duplicate records
    NOT EXISTS (
      SELECT 1 FROM public.bank_accounts
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own bank account"
  ON public.bank_accounts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Ensure indexes exist
CREATE INDEX IF NOT EXISTS bank_accounts_user_id_idx ON public.bank_accounts(user_id);

-- Ensure foreign key constraint exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'bank_accounts_user_id_fkey'
  ) THEN
    ALTER TABLE public.bank_accounts
    ADD CONSTRAINT bank_accounts_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Ensure unique constraint exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'bank_accounts_user_id_key'
  ) THEN
    ALTER TABLE public.bank_accounts
    ADD CONSTRAINT bank_accounts_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Grant permissions
GRANT ALL ON public.bank_accounts TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bank_accounts TO authenticated;