/*
  # Fix Bank Accounts RLS Policies

  1. Changes
    - Drop existing policies
    - Create new simplified policies for bank accounts
    - Add proper RLS for authenticated users
    - Fix insert policy to allow first record creation
  
  2. Security
    - Enable RLS
    - Users can only access their own records
    - Service role has full access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own bank account" ON public.bank_accounts;
DROP POLICY IF EXISTS "Users can update own bank account" ON public.bank_accounts;
DROP POLICY IF EXISTS "Users can insert own bank account" ON public.bank_accounts;
DROP POLICY IF EXISTS "Users can delete own bank account" ON public.bank_accounts;

-- Create new simplified policies
CREATE POLICY "Users can read own bank account"
  ON public.bank_accounts
  FOR SELECT
  TO authenticated
  USING ((auth.uid() = user_id) OR (auth.role() = 'service_role'::text));

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
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bank account"
  ON public.bank_accounts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Ensure RLS is enabled
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON public.bank_accounts TO postgres;
GRANT ALL ON public.bank_accounts TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bank_accounts TO authenticated;