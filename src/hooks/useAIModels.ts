import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'google' | 'anthropic' | 'bedrock' | 'lovable';
  model_id: string;
  api_key_encrypted?: string;
  bedrock_account_id?: string;
  is_active: boolean;
  created_at: string;
  created_by?: string;
}

export function useAIModels() {
  return useQuery({
    queryKey: ["ai-models"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_models")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as AIModel[];
    },
  });
}

export function useCreateAIModel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (model: Omit<AIModel, "id" | "created_at" | "created_by">) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("ai_models")
        .insert({
          ...model,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-models"] });
      toast({ title: "AI model added successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to add AI model", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateAIModel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AIModel> & { id: string }) => {
      const { data, error } = await supabase
        .from("ai_models")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-models"] });
      toast({ title: "AI model updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update AI model", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteAIModel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("ai_models")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-models"] });
      toast({ title: "AI model deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete AI model", description: error.message, variant: "destructive" });
    },
  });
}
