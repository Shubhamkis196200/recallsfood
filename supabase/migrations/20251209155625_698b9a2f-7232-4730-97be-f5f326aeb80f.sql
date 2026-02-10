-- Drop activity_logs table and its trigger
DROP TRIGGER IF EXISTS validate_activity_log_trigger ON public.activity_logs;
DROP TABLE IF EXISTS public.activity_logs;

-- Drop newsletter_subscribers table
DROP TABLE IF EXISTS public.newsletter_subscribers;