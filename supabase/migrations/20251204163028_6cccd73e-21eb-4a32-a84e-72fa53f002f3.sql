-- AWS Bedrock Accounts
CREATE TABLE public.bedrock_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  aws_access_key_encrypted TEXT NOT NULL,
  aws_secret_key_encrypted TEXT NOT NULL,
  aws_region TEXT DEFAULT 'us-east-1',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users
);

-- AI Models Configuration
CREATE TABLE public.ai_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('openai', 'google', 'anthropic', 'bedrock', 'lovable')),
  model_id TEXT NOT NULL,
  api_key_encrypted TEXT,
  bedrock_account_id UUID REFERENCES public.bedrock_accounts ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users,
  UNIQUE(provider, model_id)
);

-- Writing Tone Presets
CREATE TABLE public.ai_tone_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  tone TEXT DEFAULT 'professional',
  word_count_min INTEGER DEFAULT 800,
  word_count_max INTEGER DEFAULT 1500,
  custom_prompt TEXT,
  article_structure JSONB DEFAULT '{"intro": true, "sections": 3, "conclusion": true, "cta": false}'::jsonb,
  style_guidelines TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users
);

-- AI Generation History
CREATE TABLE public.ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID REFERENCES public.ai_models ON DELETE SET NULL,
  preset_id UUID REFERENCES public.ai_tone_presets ON DELETE SET NULL,
  topic TEXT NOT NULL,
  target_keyword TEXT,
  generated_content JSONB,
  plagiarism_score NUMERIC,
  keyword_validation JSONB,
  internal_links JSONB,
  similar_posts JSONB,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users
);

-- Enable RLS
ALTER TABLE public.bedrock_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tone_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Admin only for sensitive data
CREATE POLICY "Admins can manage bedrock accounts" ON public.bedrock_accounts
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage AI models" ON public.ai_models
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Editor and Admin can use tone presets
CREATE POLICY "Admin/Editor can manage tone presets" ON public.ai_tone_presets
  FOR ALL USING (is_admin_or_editor(auth.uid()));

CREATE POLICY "Admin/Editor can view tone presets" ON public.ai_tone_presets
  FOR SELECT USING (is_admin_or_editor(auth.uid()));

-- Generation history - users can see their own
CREATE POLICY "Users can view own generations" ON public.ai_generations
  FOR SELECT USING (auth.uid() = created_by OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create generations" ON public.ai_generations
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Indexes
CREATE INDEX idx_ai_models_provider ON public.ai_models(provider);
CREATE INDEX idx_ai_models_active ON public.ai_models(is_active);
CREATE INDEX idx_ai_tone_presets_default ON public.ai_tone_presets(is_default);
CREATE INDEX idx_ai_generations_created_by ON public.ai_generations(created_by);
CREATE INDEX idx_bedrock_accounts_active ON public.bedrock_accounts(is_active);