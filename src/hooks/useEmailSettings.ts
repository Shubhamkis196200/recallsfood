import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface EmailSettings {
  id: string;
  provider: string;
  from_email: string | null;
  from_name: string | null;
  smtp_host: string | null;
  smtp_port: number | null;
  smtp_user: string | null;
  is_active: boolean;
  updated_at: string;
  updated_by: string | null;
}

export const useEmailSettings = () => {
  return useQuery({
    queryKey: ['email-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as EmailSettings | null;
    },
  });
};

export const useSaveEmailSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<EmailSettings>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Check if settings exist
      const { data: existing } = await supabase
        .from('email_settings')
        .select('id')
        .limit(1)
        .single();

      if (existing) {
        const { error } = await supabase
          .from('email_settings')
          .update({
            ...settings,
            updated_at: new Date().toISOString(),
            updated_by: user?.id,
          })
          .eq('id', existing.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('email_settings')
          .insert({
            ...settings,
            updated_by: user?.id,
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-settings'] });
    },
  });
};

export const useTestEmailSettings = () => {
  return useMutation({
    mutationFn: async (testEmail: string) => {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: testEmail,
          subject: 'Test Email from RecallsFood',
          html: '<h1>Test Email</h1><p>This is a test email to verify your email settings are configured correctly.</p>',
          isTest: true,
        },
      });

      if (error) throw error;
      return data;
    },
  });
};
