import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ImageGenerationRequest {
  model_id: string;
  prompt: string;
  context?: string;
  section_heading?: string;
  article_title?: string;
  section_content?: string;
  alt_text_hint?: string;
  style_preset_id?: string;
}

export interface GeneratedImage {
  image_url: string;
  alt_text: string;
  media_id?: string;
}

export function useAIImageGenerate() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (request: ImageGenerationRequest): Promise<GeneratedImage> => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error("You must be logged in to generate images");
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-generate-image`,
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
        
        throw new Error(errorData.error || errorData.details || `Image generation failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to generate image");
      }

      return data.image;
    },
    onError: (error: Error) => {
      toast({
        title: "Image generation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
