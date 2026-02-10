-- Add featured_image_alt column for SEO alt text requirement
ALTER TABLE public.posts 
ADD COLUMN featured_image_alt TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.posts.featured_image_alt IS 'Alt text for featured image, required for SEO accessibility';