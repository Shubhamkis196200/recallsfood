import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface GeneratedContent {
  title: string;
  subtitle: string;
  slug: string;
  excerpt: string;
  meta_title: string;
  meta_description: string;
  content: string;
  suggested_tags: string[];
}

export interface GenerationRequest {
  model_id: string;
  preset_id?: string;
  topic: string;
  target_keyword?: string;
  word_count_min?: number;
  word_count_max?: number;
  custom_instructions?: string;
}

export function useAIGenerate() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (request: GenerationRequest): Promise<GeneratedContent> => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error("You must be logged in to generate content");
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-generate-blog`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(request),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please wait a moment and try again.");
        }
        if (response.status === 402) {
          throw new Error("AI credits exhausted. Please add credits to continue.");
        }
        
        throw new Error(errorData.error || errorData.details || `Generation failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.content) {
        throw new Error(data.error || "Failed to generate content");
      }

      return data.content;
    },
    onError: (error: Error) => {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
