-- Drop the security definer view (not needed, direct queries with RLS are safer)
DROP VIEW IF EXISTS public.authors_public;