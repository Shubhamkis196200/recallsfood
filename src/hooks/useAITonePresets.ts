import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";

export interface ArticleStructure {
  intro: boolean;
  sections: number;
  conclusion: boolean;
  cta: boolean;
}

export interface AITonePreset {
  id: string;
  name: string;
  description?: string;
  tone: string;
  word_count_min: number;
  word_count_max: number;
  custom_prompt?: string;
  article_structure: ArticleStructure;
  style_guidelines?: string;
  is_default: boolean;
  created_at: string;
  created_by?: string;
}

function parseArticleStructure(json: Json): ArticleStructure {
  if (typeof json === 'object' && json !== null && !Array.isArray(json)) {
    return {
      intro: Boolean((json as Record<string, unknown>).intro ?? true),
      sections: Number((json as Record<string, unknown>).sections ?? 3),
      conclusion: Boolean((json as Record<string, unknown>).conclusion ?? true),
      cta: Boolean((json as Record<string, unknown>).cta ?? false),
    };
  }
  return { intro: true, sections: 3, conclusion: true, cta: false };
}

export function useAITonePresets() {
  return useQuery({
    queryKey: ["ai-tone-presets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_tone_presets")
        .select("*")
        .order("is_default", { ascending: false })
        .order("name", { ascending: true });

      if (error) throw error;
      return data.map(item => ({
        ...item,
        article_structure: parseArticleStructure(item.article_structure),
      })) as AITonePreset[];
    },
  });
}

export function useCreateAITonePreset() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (preset: Omit<AITonePreset, "id" | "created_at" | "created_by">) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("ai_tone_presets")
        .insert({
          name: preset.name,
          description: preset.description,
          tone: preset.tone,
          word_count_min: preset.word_count_min,
          word_count_max: preset.word_count_max,
          custom_prompt: preset.custom_prompt,
          article_structure: preset.article_structure as unknown as Json,
          style_guidelines: preset.style_guidelines,
          is_default: preset.is_default,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-tone-presets"] });
      toast({ title: "Tone preset created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to create tone preset", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateAITonePreset() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AITonePreset> & { id: string }) => {
      const updateData: Record<string, unknown> = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.tone !== undefined) updateData.tone = updates.tone;
      if (updates.word_count_min !== undefined) updateData.word_count_min = updates.word_count_min;
      if (updates.word_count_max !== undefined) updateData.word_count_max = updates.word_count_max;
      if (updates.custom_prompt !== undefined) updateData.custom_prompt = updates.custom_prompt;
      if (updates.article_structure !== undefined) updateData.article_structure = updates.article_structure as unknown as Json;
      if (updates.style_guidelines !== undefined) updateData.style_guidelines = updates.style_guidelines;
      if (updates.is_default !== undefined) updateData.is_default = updates.is_default;

      const { data, error } = await supabase
        .from("ai_tone_presets")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-tone-presets"] });
      toast({ title: "Tone preset updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update tone preset", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteAITonePreset() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("ai_tone_presets")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-tone-presets"] });
      toast({ title: "Tone preset deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete tone preset", description: error.message, variant: "destructive" });
    },
  });
}
