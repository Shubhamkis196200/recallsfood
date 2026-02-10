-- Fix 1-4: Update database functions with proper search_path

-- 1. Fix update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 2. Fix generate_slug
CREATE OR REPLACE FUNCTION public.generate_slug(title text)
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
  slug TEXT;
BEGIN
  slug := lower(trim(title));
  slug := regexp_replace(slug, '[^a-z0-9\s-]', '', 'g');
  slug := regexp_replace(slug, '\s+', '-', 'g');
  slug := regexp_replace(slug, '-+', '-', 'g');
  slug := trim(both '-' from slug);
  RETURN slug;
END;
$function$;

-- 3. Fix calculate_read_time
CREATE OR REPLACE FUNCTION public.calculate_read_time(content text)
RETURNS integer
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
  word_count INTEGER;
  read_time INTEGER;
BEGIN
  IF content IS NULL OR content = '' THEN
    RETURN 1;
  END IF;
  word_count := array_length(regexp_split_to_array(regexp_replace(content, '<[^>]*>', '', 'g'), '\s+'), 1);
  read_time := GREATEST(1, CEIL(word_count::DECIMAL / 200));
  RETURN read_time;
END;
$function$;

-- 4. Fix posts_before_insert_update
CREATE OR REPLACE FUNCTION public.posts_before_insert_update()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.generate_slug(NEW.title);
  END IF;
  NEW.read_time_minutes := public.calculate_read_time(NEW.content);
  IF NEW.status = 'published' AND (OLD IS NULL OR OLD.status != 'published') THEN
    NEW.published_at := COALESCE(NEW.published_at, now());
  END IF;
  RETURN NEW;
END;
$function$;

-- Fix 5: Update profiles RLS policy to require authentication
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Fix 6: Update media RLS policy to require authentication
DROP POLICY IF EXISTS "Anyone can view media" ON public.media;

CREATE POLICY "Authenticated users can view media"
ON public.media
FOR SELECT
USING (auth.uid() IS NOT NULL);