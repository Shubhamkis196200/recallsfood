import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ImageStylePreset {
  id: string;
  name: string;
  description?: string;
  prompt_prefix?: string;
  prompt_suffix?: string;
  negative_prompt?: string;
  is_default?: boolean;
  is_active?: boolean;
  created_by?: string;
  created_at?: string;
}

export const useImageStylePresets = () => {
  return useQuery({
    queryKey: ["image-style-presets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("image_style_presets")
        .select("*")
        .order("is_default", { ascending: false })
        .order("name", { ascending: true });
      if (error) throw error;
      return data as ImageStylePreset[];
    },
  });
};

export const useActiveImageStylePresets = () => {
  return useQuery({
    queryKey: ["image-style-presets", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("image_style_presets")
        .select("*")
        .eq("is_active", true)
        .order("is_default", { ascending: false })
        .order("name", { ascending: true });
      if (error) throw error;
      return data as ImageStylePreset[];
    },
  });
};

export const useCreateImageStylePreset = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (preset: Omit<ImageStylePreset, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("image_style_presets")
        .insert(preset)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["image-style-presets"] });
      toast({ title: "Image style preset created" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create preset",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateImageStylePreset = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ImageStylePreset> & { id: string }) => {
      const { data, error } = await supabase
        .from("image_style_presets")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["image-style-presets"] });
      toast({ title: "Image style preset updated" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update preset",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteImageStylePreset = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("image_style_presets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["image-style-presets"] });
      toast({ title: "Image style preset deleted" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete preset",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
