-- Create API key usage tracking table
CREATE TABLE public.api_key_usage (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  api_key_id uuid NOT NULL REFERENCES public.api_keys(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  method text NOT NULL,
  status_code integer,
  response_time_ms integer,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index for efficient querying
CREATE INDEX idx_api_key_usage_api_key_id ON public.api_key_usage(api_key_id);
CREATE INDEX idx_api_key_usage_created_at ON public.api_key_usage(created_at);

-- Enable RLS
ALTER TABLE public.api_key_usage ENABLE ROW LEVEL SECURITY;

-- Only admins can view API key usage
CREATE POLICY "Admins can view API key usage"
ON public.api_key_usage
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Edge functions can insert usage records (service role)
CREATE POLICY "Service role can insert usage"
ON public.api_key_usage
FOR INSERT
WITH CHECK (true);