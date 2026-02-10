-- Add per-key rate limit columns to api_keys table
ALTER TABLE public.api_keys 
ADD COLUMN IF NOT EXISTS rate_limit_read integer DEFAULT 10,
ADD COLUMN IF NOT EXISTS rate_limit_write integer DEFAULT 2;

-- Add comment for documentation
COMMENT ON COLUMN public.api_keys.rate_limit_read IS 'Custom read rate limit (requests per second). Default: 10';
COMMENT ON COLUMN public.api_keys.rate_limit_write IS 'Custom write rate limit (requests per second). Default: 2';