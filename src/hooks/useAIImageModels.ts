import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AIImageModel {
  id: string;
  name: string;
  provider: string;
  model_id: string;
  api_key_encrypted?: string;
  bedrock_account_id?: string;
  is_active: boolean;
  created_by?: string;
  created_at?: string;
}

export const useAIImageModels = () => {
  return useQuery({
    queryKey: ["ai-image-models"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_image_models")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as AIImageModel[];
    },
  });
};

export const useCreateAIImageModel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (model: Omit<AIImageModel, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("ai_image_models")
        .insert(model)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-image-models"] });
      toast({ title: "Image model added successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add image model",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateAIImageModel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AIImageModel> & { id: string }) => {
      const { data, error } = await supabase
        .from("ai_image_models")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-image-models"] });
      toast({ title: "Image model updated" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update image model",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteAIImageModel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ai_image_models").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-image-models"] });
      toast({ title: "Image model deleted" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete image model",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
