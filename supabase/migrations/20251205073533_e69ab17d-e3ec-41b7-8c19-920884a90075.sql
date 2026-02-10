-- Create ai_image_models table for storing image generation model configurations
CREATE TABLE public.ai_image_models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT NOT NULL, -- 'lovable', 'bedrock', 'ideogram', 'openai', 'stability'
  model_id TEXT NOT NULL,
  api_key_encrypted TEXT,
  bedrock_account_id UUID REFERENCES public.bedrock_accounts(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_image_models ENABLE ROW LEVEL SECURITY;

-- RLS policies - admin/editor can view and manage
CREATE POLICY "Admin and editors can view image models"
  ON public.ai_image_models FOR SELECT
  USING (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Admin and editors can create image models"
  ON public.ai_image_models FOR INSERT
  WITH CHECK (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Admin and editors can update image models"
  ON public.ai_image_models FOR UPDATE
  USING (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Admin and editors can delete image models"
  ON public.ai_image_models FOR DELETE
  USING (public.is_admin_or_editor(auth.uid()));