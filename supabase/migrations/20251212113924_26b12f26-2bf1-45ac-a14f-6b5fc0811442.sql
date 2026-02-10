-- Add explicit SELECT policy for user_invitations table restricting to admins only
CREATE POLICY "Only admins can view invitations" 
ON public.user_invitations 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));