import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BedrockImageModel {
  modelId: string;
  modelName: string;
  providerName: string;
  inputModalities: string[];
  outputModalities: string[];
}

export function useBedrockImageModels(bedrockAccountId: string | undefined) {
  return useQuery({
    queryKey: ["bedrock-image-models", bedrockAccountId],
    queryFn: async () => {
      // Pass "env" to signal using environment variables
      const { data, error } = await supabase.functions.invoke("list-bedrock-models", {
        body: { use_env_credentials: true },
      });

      if (error) throw error;
      
      // Filter models that have IMAGE in outputModalities
      const allModels = (data.models || []) as BedrockImageModel[];
      return allModels.filter(model => 
        model.outputModalities?.includes("IMAGE")
      );
    },
    enabled: !!bedrockAccountId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
