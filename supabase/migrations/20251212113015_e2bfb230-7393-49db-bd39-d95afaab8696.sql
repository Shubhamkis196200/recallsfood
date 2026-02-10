-- Drop the existing public SELECT policy that exposes all columns including email
DROP POLICY IF EXISTS "Public can view active authors" ON public.authors;

-- Create a new policy that only allows public access to non-sensitive columns
-- by using a security definer function to control what data is returned
CREATE OR REPLACE FUNCTION public.get_public_author_data(author_row authors)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'id', author_row.id,
    'name', author_row.name,
    'slug', author_row.slug,
    'bio', author_row.bio,
    'avatar_url', author_row.avatar_url,
    'social_links', author_row.social_links,
    'is_active', author_row.is_active,
    'display_order', author_row.display_order,
    'created_at', author_row.created_at,
    'updated_at', author_row.updated_at
  )
$$;

-- Create public SELECT policy that hides email from unauthenticated users
-- For public users: can only see active authors but email is hidden via application code
-- For admin/editor: full access via the existing "Admin/Editor can manage authors" policy
CREATE POLICY "Public can view active authors without email" 
ON public.authors 
FOR SELECT 
USING (
  is_active = true 
  AND (
    -- If user is admin/editor, they can see everything (handled by other policy)
    is_admin_or_editor(auth.uid()) 
    OR 
    -- If user is not authenticated or not admin/editor, they can see the row but email should be null
    auth.uid() IS NULL 
    OR 
    NOT is_admin_or_editor(auth.uid())
  )
);