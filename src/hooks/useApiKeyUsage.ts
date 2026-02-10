import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ApiKeyUsageRecord {
  id: string;
  api_key_id: string;
  endpoint: string;
  method: string;
  status_code: number | null;
  response_time_ms: number | null;
  created_at: string;
}

export interface UsageStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  avgResponseTime: number;
  requestsToday: number;
  requestsByEndpoint: Record<string, number>;
  requestsByMethod: Record<string, number>;
  requestsOverTime: { date: string; count: number }[];
}

export const useApiKeyUsage = (apiKeyId: string | null) => {
  return useQuery({
    queryKey: ["api-key-usage", apiKeyId],
    queryFn: async (): Promise<ApiKeyUsageRecord[]> => {
      if (!apiKeyId) return [];
      
      const { data, error } = await supabase
        .from("api_key_usage")
        .select("*")
        .eq("api_key_id", apiKeyId)
        .order("created_at", { ascending: false })
        .limit(500);

      if (error) throw error;
      return data as ApiKeyUsageRecord[];
    },
    enabled: !!apiKeyId,
  });
};

export const useApiKeyStats = (apiKeyId: string | null) => {
  const { data: usage, isLoading } = useApiKeyUsage(apiKeyId);

  const stats: UsageStats | null = usage ? calculateStats(usage) : null;

  return { stats, isLoading };
};

function calculateStats(records: ApiKeyUsageRecord[]): UsageStats {
  const today = new Date().toISOString().split('T')[0];
  
  const requestsByEndpoint: Record<string, number> = {};
  const requestsByMethod: Record<string, number> = {};
  const requestsByDate: Record<string, number> = {};
  
  let totalResponseTime = 0;
  let responseTimeCount = 0;
  let successfulRequests = 0;
  let failedRequests = 0;
  let requestsToday = 0;

  records.forEach((record) => {
    // Endpoint stats
    const endpoint = record.endpoint || 'unknown';
    requestsByEndpoint[endpoint] = (requestsByEndpoint[endpoint] || 0) + 1;

    // Method stats
    const method = record.method || 'unknown';
    requestsByMethod[method] = (requestsByMethod[method] || 0) + 1;

    // Date stats
    const date = record.created_at.split('T')[0];
    requestsByDate[date] = (requestsByDate[date] || 0) + 1;

    if (date === today) {
      requestsToday++;
    }

    // Response time
    if (record.response_time_ms) {
      totalResponseTime += record.response_time_ms;
      responseTimeCount++;
    }

    // Success/failure
    if (record.status_code) {
      if (record.status_code >= 200 && record.status_code < 400) {
        successfulRequests++;
      } else {
        failedRequests++;
      }
    }
  });

  // Convert requestsByDate to sorted array (last 30 days)
  const requestsOverTime = Object.entries(requestsByDate)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30);

  return {
    totalRequests: records.length,
    successfulRequests,
    failedRequests,
    avgResponseTime: responseTimeCount > 0 ? Math.round(totalResponseTime / responseTimeCount) : 0,
    requestsToday,
    requestsByEndpoint,
    requestsByMethod,
    requestsOverTime,
  };
}
