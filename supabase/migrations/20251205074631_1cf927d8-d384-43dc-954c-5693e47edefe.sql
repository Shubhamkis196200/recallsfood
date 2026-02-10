-- Create image style presets table
CREATE TABLE public.image_style_presets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  prompt_prefix TEXT,
  prompt_suffix TEXT,
  negative_prompt TEXT,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.image_style_presets ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Admin and editors can view image style presets"
  ON public.image_style_presets FOR SELECT
  USING (is_admin_or_editor(auth.uid()));

CREATE POLICY "Admin and editors can create image style presets"
  ON public.image_style_presets FOR INSERT
  WITH CHECK (is_admin_or_editor(auth.uid()));

CREATE POLICY "Admin and editors can update image style presets"
  ON public.image_style_presets FOR UPDATE
  USING (is_admin_or_editor(auth.uid()));

CREATE POLICY "Admin and editors can delete image style presets"
  ON public.image_style_presets FOR DELETE
  USING (is_admin_or_editor(auth.uid()));

-- Insert default presets
INSERT INTO public.image_style_presets (name, description, prompt_prefix, prompt_suffix, negative_prompt, is_default, is_active) VALUES
('Photorealistic', 'High-quality realistic photography style', 'Professional photography, photorealistic, ultra detailed, sharp focus, ', ', 8k resolution, studio lighting, high quality', 'cartoon, illustration, drawing, painting, sketch, low quality, blurry', true, true),
('Editorial', 'Magazine-quality editorial photography', 'Editorial fashion photography, professional magazine shoot, elegant, sophisticated, ', ', vogue style, high fashion, cinematic lighting', 'amateur, low quality, blurry, cartoon', false, true),
('Artistic', 'Creative artistic illustration style', 'Artistic illustration, creative design, artistic style, ', ', vibrant colors, artistic composition', 'photo, photograph, realistic, blurry', false, true),
('Minimalist', 'Clean minimalist aesthetic', 'Minimalist design, clean aesthetic, simple composition, ', ', white space, elegant simplicity', 'cluttered, busy, complex, messy', false, true),
('Luxury', 'Premium luxury brand aesthetic', 'Luxury brand aesthetic, premium quality, opulent, refined, ', ', gold accents, sophisticated elegance, high-end', 'cheap, low quality, amateur', false, true),
('Vintage', 'Classic vintage photography style', 'Vintage photography, retro aesthetic, classic style, ', ', film grain, nostalgic feel, timeless', 'modern, digital, contemporary', false, true);