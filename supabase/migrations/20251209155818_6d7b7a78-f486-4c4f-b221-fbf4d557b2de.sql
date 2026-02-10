-- Drop unused validate_activity_log function
DROP FUNCTION IF EXISTS public.validate_activity_log();

-- Remove API key columns from ai_models (no longer used - using Cloud Secrets)
ALTER TABLE public.ai_models DROP COLUMN IF EXISTS api_key_encrypted;

-- Remove API key columns from ai_image_models (no longer used - using Cloud Secrets)
ALTER TABLE public.ai_image_models DROP COLUMN IF EXISTS api_key_encrypted;

-- Remove AWS credential columns from bedrock_accounts (now using Cloud Secrets)
ALTER TABLE public.bedrock_accounts DROP COLUMN IF EXISTS aws_access_key_encrypted;
ALTER TABLE public.bedrock_accounts DROP COLUMN IF EXISTS aws_secret_key_encrypted;