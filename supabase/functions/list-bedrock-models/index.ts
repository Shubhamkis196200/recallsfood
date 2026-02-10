import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use AWS credentials from environment variables (Cloud Secrets)
    const accessKey = Deno.env.get("AWS_ACCESS_KEY_ID");
    const secretKey = Deno.env.get("AWS_SECRET_ACCESS_KEY");
    const region = Deno.env.get("AWS_REGION") || "us-east-1";

    if (!accessKey || !secretKey) {
      return new Response(
        JSON.stringify({ 
          error: "AWS credentials not configured", 
          details: "Please configure AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in Cloud Secrets" 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create AWS signature for the request
    const service = "bedrock";
    const host = `bedrock.${region}.amazonaws.com`;
    const endpoint = `https://${host}/foundation-models?byInferenceType=ON_DEMAND`;
    const method = "GET";
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "").slice(0, 15) + "Z";
    const dateStamp = amzDate.slice(0, 8);

    // Create canonical request
    const canonicalUri = "/foundation-models";
    const canonicalQuerystring = "byInferenceType=ON_DEMAND";
    const canonicalHeaders = `host:${host}\nx-amz-date:${amzDate}\n`;
    const signedHeaders = "host;x-amz-date";
    const payloadHash = await sha256("");
    const canonicalRequest = `${method}\n${canonicalUri}\n${canonicalQuerystring}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

    // Create string to sign
    const algorithm = "AWS4-HMAC-SHA256";
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${await sha256(canonicalRequest)}`;

    // Calculate signature
    const kDate = await hmacSha256(`AWS4${secretKey}`, dateStamp);
    const kRegion = await hmacSha256Raw(kDate, region);
    const kService = await hmacSha256Raw(kRegion, service);
    const kSigning = await hmacSha256Raw(kService, "aws4_request");
    const signature = await hmacSha256Hex(kSigning, stringToSign);

    const authorizationHeader = `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    // Make the API call
    const response = await fetch(endpoint, {
      method: method,
      headers: {
        "Host": host,
        "X-Amz-Date": amzDate,
        "Authorization": authorizationHeader,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AWS Bedrock API error:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to fetch models from AWS Bedrock", details: errorText }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    
    // Filter and format models - only include those with ON_DEMAND inference
    const models = (data.modelSummaries || [])
      .filter((model: any) => 
        model.inferenceTypesSupported?.includes("ON_DEMAND") &&
        model.modelLifecycle?.status === "ACTIVE"
      )
      .map((model: any) => ({
        modelId: model.modelId,
        modelName: model.modelName,
        providerName: model.providerName,
        inputModalities: model.inputModalities,
        outputModalities: model.outputModalities,
      }))
      .sort((a: any, b: any) => {
        // Sort by provider, then by name
        if (a.providerName !== b.providerName) {
          return a.providerName.localeCompare(b.providerName);
        }
        return a.modelName.localeCompare(b.modelName);
      });

    return new Response(
      JSON.stringify({ models }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Helper functions for AWS Signature V4
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSha256(key: string, message: string): Promise<ArrayBuffer> {
  const keyBuffer = new TextEncoder().encode(key);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const msgBuffer = new TextEncoder().encode(message);
  return await crypto.subtle.sign("HMAC", cryptoKey, msgBuffer);
}

async function hmacSha256Raw(key: ArrayBuffer, message: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const msgBuffer = new TextEncoder().encode(message);
  return await crypto.subtle.sign("HMAC", cryptoKey, msgBuffer);
}

async function hmacSha256Hex(key: ArrayBuffer, message: string): Promise<string> {
  const result = await hmacSha256Raw(key, message);
  return Array.from(new Uint8Array(result))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
