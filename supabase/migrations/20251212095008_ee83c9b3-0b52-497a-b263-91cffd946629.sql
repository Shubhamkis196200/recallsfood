-- Remove dynamic rate limit columns from api_keys table
ALTER TABLE public.api_keys DROP COLUMN IF EXISTS rate_limit_read;
ALTER TABLE public.api_keys DROP COLUMN IF EXISTS rate_limit_write;