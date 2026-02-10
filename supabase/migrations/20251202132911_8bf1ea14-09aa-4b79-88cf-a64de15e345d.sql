-- Create authors table for managing article authors/editors
CREATE TABLE public.authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  bio text,
  avatar_url text,
  email text,
  social_links jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;

-- Public can view active authors
CREATE POLICY "Anyone can view active authors"
ON public.authors
FOR SELECT
USING (is_active = true);

-- Admin/Editor can manage all authors
CREATE POLICY "Admin/Editor can manage authors"
ON public.authors
FOR ALL
USING (is_admin_or_editor(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_authors_updated_at
BEFORE UPDATE ON public.authors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert 5 default editors
INSERT INTO public.authors (name, slug, bio, display_order) VALUES
  ('Editorial Team', 'editorial-team', 'The editorial team at Global Luxe Times brings you the finest in luxury lifestyle coverage.', 1),
  ('Fashion Editor', 'fashion-editor', 'Our fashion editor curates the latest trends from haute couture to street style.', 2),
  ('Lifestyle Editor', 'lifestyle-editor', 'Bringing you the best in premium lifestyle, travel, and wellness.', 3),
  ('Accessories Editor', 'accessories-editor', 'Expert coverage of fine jewelry, watches, and luxury accessories.', 4),
  ('Guest Contributor', 'guest-contributor', 'Contributing writers and industry experts sharing their insights.', 5);

-- Add author_name_id column to posts table
ALTER TABLE public.posts ADD COLUMN author_name_id uuid REFERENCES public.authors(id);