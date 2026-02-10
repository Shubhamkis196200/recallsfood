import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Image } from "https://deno.land/x/imagescript@1.3.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ImageGenerationRequest {
  model_id: string;
  prompt: string;
  context?: string;
  section_heading?: string;
  article_title?: string;
  section_content?: string;
  alt_text_hint?: string;
  style_preset_id?: string;
}

// Image dimensions: 1152x768 for 3:2 aspect ratio
const IMAGE_WIDTH = 1152;
const IMAGE_HEIGHT = 768;
const IMAGE_QUALITY = 80;

// Dynamic prompt variation arrays
const cameraAngles = [
  "eye-level perspective",
  "low angle looking up",
  "bird's eye view from above",
  "Dutch angle tilted composition",
  "close-up detail shot",
  "wide establishing shot",
  "over-the-shoulder perspective",
  "symmetrical frontal view",
];

const lightingStyles = [
  "soft natural daylight",
  "dramatic side lighting with deep shadows",
  "golden hour warm glow",
  "high-key bright and airy lighting",
  "moody low-key atmospheric lighting",
  "rim lighting highlighting edges",
  "diffused overcast soft lighting",
  "chiaroscuro dramatic contrast",
];

const moods = [
  "sophisticated elegance",
  "dynamic energy and movement",
  "serene tranquility",
  "bold confidence",
  "intimate warmth",
  "minimalist refinement",
  "opulent grandeur",
  "modern sophistication",
];

const compositions = [
  "rule of thirds balanced",
  "centered symmetrical",
  "leading lines guiding the eye",
  "generous negative space",
  "layered depth with foreground interest",
  "dynamic diagonal composition",
  "frame within a frame",
  "golden ratio spiral",
];

const lensEffects = [
  "shallow depth of field with creamy bokeh",
  "wide angle expansive view",
  "macro extreme detail",
  "portrait lens flattering perspective",
  "tilt-shift miniature effect",
  "sharp focus throughout",
  "soft focus dreamy quality",
  "telephoto compressed perspective",
];

// Random selection helper
function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Extract visual themes from content
function extractVisualThemes(content: string): string[] {
  const themes: string[] = [];
  const lowerContent = content.toLowerCase();
  
  // Fashion/Style themes
  if (lowerContent.includes('fashion') || lowerContent.includes('style') || lowerContent.includes('clothing')) {
    themes.push('fashion editorial');
  }
  if (lowerContent.includes('luxury') || lowerContent.includes('premium') || lowerContent.includes('exclusive')) {
    themes.push('luxury lifestyle');
  }
  if (lowerContent.includes('jewelry') || lowerContent.includes('accessories') || lowerContent.includes('watch')) {
    themes.push('fine accessories');
  }
  if (lowerContent.includes('travel') || lowerContent.includes('destination') || lowerContent.includes('resort')) {
    themes.push('luxury travel');
  }
  if (lowerContent.includes('food') || lowerContent.includes('cuisine') || lowerContent.includes('dining')) {
    themes.push('gourmet dining');
  }
  if (lowerContent.includes('interior') || lowerContent.includes('home') || lowerContent.includes('decor')) {
    themes.push('interior design');
  }
  if (lowerContent.includes('beauty') || lowerContent.includes('skincare') || lowerContent.includes('wellness')) {
    themes.push('beauty and wellness');
  }
  if (lowerContent.includes('car') || lowerContent.includes('automotive') || lowerContent.includes('vehicle')) {
    themes.push('luxury automotive');
  }
  
  return themes.length > 0 ? themes : ['sophisticated lifestyle'];
}

// Build dynamic, varied image prompt
function buildDynamicImagePrompt(
  basePrompt: string,
  sectionHeading?: string,
  articleTitle?: string,
  sectionContent?: string
): string {
  // Select random variations
  const angle = randomFrom(cameraAngles);
  const lighting = randomFrom(lightingStyles);
  const mood = randomFrom(moods);
  const composition = randomFrom(compositions);
  const lens = randomFrom(lensEffects);
  
  // Extract visual themes from content
  const themes = extractVisualThemes(sectionContent || basePrompt);
  const primaryTheme = themes[0];
  
  // Build a unique, context-aware prompt
  let dynamicPrompt = `Professional magazine-quality photograph`;
  
  // Add section-specific context
  if (sectionHeading && sectionHeading !== articleTitle) {
    dynamicPrompt += ` representing "${sectionHeading}"`;
  }
  
  // Add visual concept from base prompt
  dynamicPrompt += `. Subject: ${basePrompt.substring(0, 150)}`;
  
  // Add unique stylistic variations
  dynamicPrompt += `. ${angle}, ${lighting}, ${mood} atmosphere, ${composition} composition, ${lens}`;
  
  // Add theme-specific styling
  dynamicPrompt += `. Theme: ${primaryTheme}`;
  
  // Core requirements
  dynamicPrompt += `. Ultra high resolution, editorial quality, 3:2 aspect ratio. CRITICAL: Generate ONLY visual imagery - absolutely NO text, words, letters, numbers, watermarks, logos, labels, captions, titles, or any typography whatsoever.`;
  
  return dynamicPrompt;
}

// Intelligent prompt compression for Bedrock (preserves key visual descriptors)
function compressPromptForBedrock(prompt: string, maxLength: number = 500): string {
  if (prompt.length <= maxLength) return prompt;
  
  // Extract the most important parts
  const parts = prompt.split('.');
  let compressed = '';
  
  // Always include first part (subject)
  if (parts[0]) {
    compressed = parts[0];
  }
  
  // Add essential style keywords
  const essentialKeywords = [
    'magazine-quality', 'professional', 'editorial', 'high resolution',
    'luxury', 'sophisticated', 'elegant', '3:2 aspect ratio'
  ];
  
  for (const part of parts.slice(1)) {
    if (compressed.length + part.length + 2 < maxLength - 100) {
      compressed += '. ' + part.trim();
    } else {
      // Check if part contains essential keywords
      const hasEssential = essentialKeywords.some(kw => part.toLowerCase().includes(kw));
      if (hasEssential && compressed.length + part.length + 2 < maxLength - 50) {
        compressed += '. ' + part.trim();
      }
    }
  }
  
  // Always add no-text instruction
  compressed += '. NO text, words, or typography.';
  
  return compressed.substring(0, maxLength);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: ImageGenerationRequest = await req.json();
    const { model_id, prompt, context, section_heading, article_title, section_content, alt_text_hint, style_preset_id } = body;

    if (!model_id || !prompt) {
      return new Response(JSON.stringify({ error: "model_id and prompt are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get image model configuration
    const { data: imageModel, error: modelError } = await supabase
      .from("ai_image_models")
      .select("*")
      .eq("id", model_id)
      .single();

    if (modelError || !imageModel) {
      return new Response(JSON.stringify({ error: "Image model not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get style preset if specified
    let stylePreset = null;
    if (style_preset_id && style_preset_id !== 'none') {
      const { data: preset } = await supabase
        .from("image_style_presets")
        .select("*")
        .eq("id", style_preset_id)
        .single();
      stylePreset = preset;
    }

    // Build dynamic image prompt with variations
    let fullPrompt = buildDynamicImagePrompt(
      prompt,
      section_heading,
      article_title,
      section_content || context
    );
    
    // Apply style preset if available
    if (stylePreset) {
      const prefix = stylePreset.prompt_prefix || "";
      const suffix = stylePreset.prompt_suffix || "";
      fullPrompt = `${prefix}${fullPrompt}${suffix}`;
    }

    console.log(`Generating image with provider: ${imageModel.provider}, model: ${imageModel.model_id}`);
    console.log(`Prompt length: ${fullPrompt.length} chars`);

    let imageBase64: string;

    // Generate image based on provider
    switch (imageModel.provider) {
      case "lovable":
        imageBase64 = await generateWithLovable(fullPrompt, imageModel.model_id);
        break;

      case "bedrock":
        // Use intelligent compression for Bedrock
        const bedrockPrompt = compressPromptForBedrock(fullPrompt, 500);
        console.log(`Bedrock compressed prompt: ${bedrockPrompt.length} chars`);
        imageBase64 = await generateWithBedrock(bedrockPrompt, imageModel.model_id);
        break;

      default:
        throw new Error(`Unsupported provider: ${imageModel.provider}. Only 'lovable' and 'bedrock' are supported.`);
    }

    // Compress image to JPEG
    console.log("Converting image to JPEG with 80% quality compression...");
    const compressedImage = await compressImage(imageBase64, IMAGE_QUALITY);
    console.log(`Compressed image size: ${compressedImage.byteLength} bytes`);

    const fileName = `ai-generated/${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(fileName, compressedImage, {
        contentType: "image/jpeg",
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error("Failed to upload generated image");
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(fileName);

    // Generate alt text
    const altText = alt_text_hint || 
      (section_heading ? `${section_heading} - ${article_title || 'Article image'}` : 
       `AI-generated image: ${prompt.substring(0, 80)}`);

    // Save to media table
    const { data: mediaRecord, error: mediaError } = await supabase
      .from("media")
      .insert({
        file_name: fileName.split("/").pop(),
        file_path: publicUrl,
        file_type: "image/jpeg",
        file_size: compressedImage.byteLength,
        alt_text: altText,
        caption: null,
        uploaded_by: user.id,
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
      })
      .select()
      .single();

    if (mediaError) {
      console.error("Media insert error:", mediaError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        image: {
          image_url: publicUrl,
          alt_text: altText,
          media_id: mediaRecord?.id,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Image generation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Image generation failed";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Clean base64 string
function cleanBase64(base64String: string): string {
  let cleaned = base64String.replace(/^data:image\/\w+;base64,/, "");
  cleaned = cleaned.replace(/\s/g, "");
  const padding = cleaned.length % 4;
  if (padding > 0) {
    cleaned += "=".repeat(4 - padding);
  }
  return cleaned;
}

// Compress image to JPEG
async function compressImage(base64Image: string, quality: number): Promise<Uint8Array> {
  try {
    const cleanedBase64 = cleanBase64(base64Image);
    const binaryString = atob(cleanedBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const image = await Image.decode(bytes);
    
    if (image.width !== IMAGE_WIDTH || image.height !== IMAGE_HEIGHT) {
      image.resize(IMAGE_WIDTH, IMAGE_HEIGHT);
    }

    const jpegBuffer = await image.encodeJPEG(quality);
    return jpegBuffer;
  } catch (error) {
    console.error("Image compression error:", error);
    console.log("Falling back to original format...");
    try {
      const cleanedBase64 = cleanBase64(base64Image);
      const binaryString = atob(cleanedBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError);
      throw new Error("Failed to process image data");
    }
  }
}

async function generateWithLovable(prompt: string, modelId: string): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelId || "google/gemini-2.5-flash-image-preview",
      messages: [{ role: "user", content: prompt }],
      modalities: ["image", "text"],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Lovable AI error: ${error}`);
  }

  const data = await response.json();
  const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  
  if (!imageUrl) throw new Error("No image generated");
  
  return imageUrl.replace(/^data:image\/\w+;base64,/, "");
}

async function generateWithBedrock(prompt: string, modelId: string): Promise<string> {
  const accessKey = Deno.env.get("AWS_ACCESS_KEY_ID");
  const secretKey = Deno.env.get("AWS_SECRET_ACCESS_KEY");
  const region = Deno.env.get("AWS_REGION") || "us-east-1";

  if (!accessKey || !secretKey) {
    throw new Error("AWS credentials not configured.");
  }

  const host = `bedrock-runtime.${region}.amazonaws.com`;
  const endpoint = `https://${host}/model/${modelId}/invoke`;

  const body = JSON.stringify({
    textToImageParams: {
      text: prompt,
    },
    taskType: "TEXT_IMAGE",
    imageGenerationConfig: {
      numberOfImages: 1,
      height: IMAGE_HEIGHT,
      width: IMAGE_WIDTH,
      cfgScale: 8.0,
    },
  });

  // AWS Signature v4
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.substring(0, 8);

  const canonicalUri = `/model/${encodeURIComponent(modelId)}/invoke`;
  const canonicalQuerystring = "";
  const payloadHash = await sha256(body);

  const canonicalHeaders = [
    `content-type:application/json`,
    `host:${host}`,
    `x-amz-date:${amzDate}`,
  ].join("\n") + "\n";

  const signedHeaders = "content-type;host;x-amz-date";
  const canonicalRequest = [
    "POST",
    canonicalUri,
    canonicalQuerystring,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const algorithm = "AWS4-HMAC-SHA256";
  const credentialScope = `${dateStamp}/${region}/bedrock/aws4_request`;
  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    await sha256(canonicalRequest),
  ].join("\n");

  const signingKey = await getSignatureKey(secretKey, dateStamp, region, "bedrock");
  const signature = await hmacHex(signingKey, stringToSign);

  const authorizationHeader = [
    `${algorithm} Credential=${accessKey}/${credentialScope}`,
    `SignedHeaders=${signedHeaders}`,
    `Signature=${signature}`,
  ].join(", ");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Amz-Date": amzDate,
      Authorization: authorizationHeader,
    },
    body: body,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Bedrock error: ${error}`);
  }

  const data = await response.json();
  const imageBase64 = data.images?.[0] || data.result;
  
  if (!imageBase64) {
    console.error("No image in Bedrock response:", Object.keys(data));
    throw new Error("No image data in Bedrock response");
  }
  
  return imageBase64;
}

async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(key: BufferSource, message: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(message));
}

async function hmacHex(key: BufferSource, message: string): Promise<string> {
  const signature = await hmac(key, message);
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function getSignatureKey(
  key: string,
  dateStamp: string,
  region: string,
  service: string
): Promise<ArrayBuffer> {
  const kDate = await hmac(new TextEncoder().encode("AWS4" + key).buffer as ArrayBuffer, dateStamp);
  const kRegion = await hmac(kDate, region);
  const kService = await hmac(kRegion, service);
  const kSigning = await hmac(kService, "aws4_request");
  return kSigning;
}
