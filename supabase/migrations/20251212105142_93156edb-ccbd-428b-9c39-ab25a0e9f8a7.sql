-- Fix overly permissive api_key_usage INSERT policy
-- Drop the existing policy that allows anyone to insert
DROP POLICY IF EXISTS "Service role can insert usage" ON public.api_key_usage;

-- Create a more restrictive policy
-- Only the service role (used by edge functions) can insert
-- This is effectively "no direct client inserts" since service role bypasses RLS
-- But we make the policy explicit for documentation
CREATE POLICY "Only service role can insert usage" 
ON public.api_key_usage 
FOR INSERT 
WITH CHECK (false);

-- Note: Service role bypasses RLS entirely, so edge functions using service role
-- will still be able to insert. This policy prevents any client-side inserts.

-- Also remove sensitive credential columns from email_settings since we now use Cloud Secrets
ALTER TABLE public.email_settings DROP COLUMN IF EXISTS api_key;
ALTER TABLE public.email_settings DROP COLUMN IF EXISTS smtp_pass;