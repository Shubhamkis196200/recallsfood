import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BedrockModel {
  modelId: string;
  modelName: string;
  providerName: string;
  inputModalities: string[];
  outputModalities: string[];
}

export function useBedrockModels(bedrockAccountId: string | undefined) {
  return useQuery({
    queryKey: ["bedrock-models", bedrockAccountId],
    queryFn: async () => {
      // Pass "env" to signal using environment variables
      const { data, error } = await supabase.functions.invoke("list-bedrock-models", {
        body: { use_env_credentials: true },
      });

      if (error) throw error;
      return (data.models || []) as BedrockModel[];
    },
    enabled: !!bedrockAccountId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
