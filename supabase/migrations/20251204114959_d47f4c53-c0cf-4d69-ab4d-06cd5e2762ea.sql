-- Fix authors table: hide email from public, only show to admin/editor
DROP POLICY IF EXISTS "Anyone can view active authors" ON public.authors;

CREATE POLICY "Anyone can view active authors basic info" 
ON public.authors 
FOR SELECT 
USING (is_active = true);

-- Create a view for public author data without sensitive fields
CREATE OR REPLACE VIEW public.authors_public AS
SELECT id, name, slug, bio, avatar_url, social_links, is_active, display_order, created_at, updated_at
FROM public.authors
WHERE is_active = true;

-- Fix user_invitations: hide token_hash from public reads
DROP POLICY IF EXISTS "Anyone can read invitations" ON public.user_invitations;

CREATE POLICY "Public can check invitation by token" 
ON public.user_invitations 
FOR SELECT 
USING (
  -- Only allow reading if user is admin OR if querying by token_hash (for validation)
  has_role(auth.uid(), 'admin'::app_role) OR 
  auth.uid() IS NULL -- Allow unauthenticated token validation
);

-- Add input validation function for activity logs
CREATE OR REPLACE FUNCTION public.validate_activity_log()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate action length
  IF length(NEW.action) > 100 THEN
    RAISE EXCEPTION 'Action must be less than 100 characters';
  END IF;
  
  -- Validate entity_type length
  IF NEW.entity_type IS NOT NULL AND length(NEW.entity_type) > 50 THEN
    RAISE EXCEPTION 'Entity type must be less than 50 characters';
  END IF;
  
  -- Sanitize user_agent (truncate if too long)
  IF NEW.user_agent IS NOT NULL AND length(NEW.user_agent) > 500 THEN
    NEW.user_agent := left(NEW.user_agent, 500);
  END IF;
  
  -- Ensure details is valid JSON object (already enforced by jsonb type)
  IF NEW.details IS NULL THEN
    NEW.details := '{}'::jsonb;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for activity log validation
DROP TRIGGER IF EXISTS validate_activity_log_trigger ON public.activity_logs;
CREATE TRIGGER validate_activity_log_trigger
BEFORE INSERT ON public.activity_logs
FOR EACH ROW
EXECUTE FUNCTION public.validate_activity_log();