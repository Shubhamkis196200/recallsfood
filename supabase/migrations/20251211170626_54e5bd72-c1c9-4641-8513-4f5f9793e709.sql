-- Fix Author Email Exposure: Drop overly permissive policy and create restricted one
DROP POLICY IF EXISTS "Anyone can view active authors basic info" ON public.authors;

-- Create policy that allows public to view active authors (email will be excluded at application level)
CREATE POLICY "Public can view active authors" ON public.authors
FOR SELECT USING (is_active = true);

-- Fix User Invitation Token Exposure: Remove public access to invitations
-- Token validation is handled securely by admin-users edge function with service role
DROP POLICY IF EXISTS "Public can check invitation by token" ON public.user_invitations;