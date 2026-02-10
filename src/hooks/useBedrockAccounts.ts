import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface BedrockAccount {
  id: string;
  name: string;
  aws_access_key_encrypted: string;
  aws_secret_key_encrypted: string;
  aws_region: string;
  is_active: boolean;
  created_at: string;
  created_by?: string;
}

export function useBedrockAccounts() {
  return useQuery({
    queryKey: ["bedrock-accounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bedrock_accounts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as BedrockAccount[];
    },
  });
}

export function useCreateBedrockAccount() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (account: Omit<BedrockAccount, "id" | "created_at" | "created_by">) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("bedrock_accounts")
        .insert({
          ...account,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bedrock-accounts"] });
      toast({ title: "Bedrock account added successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to add Bedrock account", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateBedrockAccount() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BedrockAccount> & { id: string }) => {
      const { data, error } = await supabase
        .from("bedrock_accounts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bedrock-accounts"] });
      toast({ title: "Bedrock account updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to update Bedrock account", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteBedrockAccount() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("bedrock_accounts")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bedrock-accounts"] });
      toast({ title: "Bedrock account deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete Bedrock account", description: error.message, variant: "destructive" });
    },
  });
}
