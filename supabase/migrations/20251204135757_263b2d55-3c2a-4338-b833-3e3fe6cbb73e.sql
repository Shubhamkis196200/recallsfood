-- Add columns to track CRM sync status and unsubscribe events
ALTER TABLE public.newsletter_subscribers 
ADD COLUMN IF NOT EXISTS crm_synced_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS crm_provider TEXT,
ADD COLUMN IF NOT EXISTS crm_contact_id TEXT,
ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS unsubscribe_source TEXT;

-- Add index for faster lookups by CRM contact ID
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_crm_contact_id 
ON public.newsletter_subscribers(crm_contact_id) WHERE crm_contact_id IS NOT NULL;