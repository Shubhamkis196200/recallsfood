import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
"Access-Control-Allow-Origin": "*",
"Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GenerationRequest {
model_id: string;
preset_id?: string;
topic: string;
target_keyword?: string;
word_count_min?: number;
word_count_max?: number;
custom_instructions?: string;
}

interface GeneratedContent {
title: string;
subtitle: string;
slug: string;
excerpt: string;
meta_title: string;
meta_description: string;
content: string;
suggested_tags: string[];
}

function countWords(htmlContent: string): number {
const text = htmlContent
.replace(/<[^>]+>/g, ' ')
.replace(/&[a-z]+;/gi, ' ')
.replace(/\s+/g, ' ')
.trim();
if (!text) return 0;
return text.split(/\s+/).filter(word => word.length > 0).length;
}

function clampText(text: string, minLen: number, maxLen: number): string {
if (text.length <= maxLen && text.length >= minLen) return text;
if (text.length > maxLen) {
let truncated = text.substring(0, maxLen);
const lastSpace = truncated.lastIndexOf(' ');
if (lastSpace > Math.max(0, maxLen - 40)) {
truncated = truncated.substring(0, lastSpace);
}
truncated = truncated.replace(/[,\s]+$/, '');
if (!truncated.endsWith('.') && !truncated.endsWith('!') && !truncated.endsWith('?')) {
truncated += '.';
}
return truncated;
}
return text;
}

function clampHtmlToWords(html: string, maxWords: number): string {
try {
const parts = html.split(/(<\/p>|<\/li>|<\/h2>|<\/h3>)/gi);
let rebuilt = "";
for (let i = 0; i < parts.length; i += 2) {
const chunk = parts[i] + (parts[i+1] || "");
rebuilt += chunk;
if (countWords(rebuilt) >= maxWords) {
const words = rebuilt.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(/\s+/);
const truncated = words.slice(0, maxWords).join(' ');
return `<p>${truncated}...</p>`;
}
}
const plain = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const truncated = plain.split(/\s+/).slice(0, maxWords).join(' ');
return `<p>${truncated}...</p>`;
} catch (e) {
const plain = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
return plain.split(/\s+/).slice(0, maxWords).join(' ');
}
}

async function callTextModel(provider: string, modelId: string, prompt: string, maxTokens = 2048): Promise<string> {
if (provider === "lovable") {
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
method: "POST",
headers: {
Authorization: `Bearer ${LOVABLE_API_KEY}`,
"Content-Type": "application/json",
},
body: JSON.stringify({
model: modelId || "google/gemini-2.5-flash",
messages: [
{ role: "system", content: "You are a precise HTML editor and content refiner. Return only the requested HTML text." },
{ role: "user", content: prompt },
],
temperature: 0.0,
max_tokens: maxTokens,
}),
});
if (!resp.ok) {
const errText = await resp.text();
throw new Error(`Lovable text call failed: ${resp.status} ${errText}`);
}
const data = await resp.json();
const text = data.choices?.[0]?.message?.content ?? "";
return String(text).trim();
}

const accessKey = Deno.env.get("AWS_ACCESS_KEY_ID");
const secretKey = Deno.env.get("AWS_SECRET_ACCESS_KEY");
const region = Deno.env.get("AWS_REGION") || "us-east-1";
if (!accessKey || !secretKey) throw new Error("AWS credentials not configured");
const host = `bedrock-runtime.${region}.amazonaws.com`;
const apiPath = `/model/${encodeURIComponent(modelId)}/converse`;
const endpoint = `https://${host}${apiPath}`;
const body = JSON.stringify({
messages: [{ role: "user", content: [{ text: prompt }] }],
inferenceConfig: { maxTokens: Math.min(maxTokens, 8000), temperature: 0.0 },
});
const now = new Date();
const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
const dateStamp = amzDate.substring(0, 8);
const canonicalUri = apiPath;
const canonicalQuerystring = "";
const payloadHash = await sha256(body);
const canonicalHeaders = [
`content-type:application/json`,
`host:${host}`,
`x-amz-date:${amzDate}`,
].join("\n") + "\n";
const signedHeaders = "content-type;host;x-amz-date";
const canonicalRequest = ["POST", canonicalUri, canonicalQuerystring, canonicalHeaders, signedHeaders, payloadHash].join("\n");
const algorithm = "AWS4-HMAC-SHA256";
const credentialScope = `${dateStamp}/${region}/bedrock/aws4_request`;
const stringToSign = [algorithm, amzDate, credentialScope, await sha256(canonicalRequest)].join("\n");
const signingKey = await getSignatureKey(secretKey, dateStamp, region, "bedrock");
const signature = await hmacHex(signingKey, stringToSign);
const authorizationHeader = `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
const resp = await fetch(endpoint, {
method: "POST",
headers: {
"Content-Type": "application/json",
"X-Amz-Date": amzDate,
Authorization: authorizationHeader,
},
body,
});
if (!resp.ok) {
const err = await resp.text();
throw new Error(`Bedrock text call failed: ${resp.status} ${err}`);
}
const data = await resp.json();
const text =
data.output?.message?.content?.[0]?.text ||
data.content?.[0]?.text ||
data.results?.[0]?.outputText ||
data.outputs?.[0]?.text ||
(typeof data === "string" ? data : "");
return String(text).trim();
}

async function refineContent(
content: GeneratedContent,
action: 'shorten' | 'expand',
targetWordCount: number,
modelId: string,
provider: string,
targetKeyword?: string
): Promise<GeneratedContent> {
const currentWordCount = countWords(content.content);
const target = targetWordCount;
const instruction = action === 'shorten'
? `Shorten the HTML article from approximately ${currentWordCount} words to about ${target} words. Preserve H2/H3 structure and keep paragraphs and lists intact. Remove redundant sentences and filler. Maintain tone and SEO keyword "${targetKeyword || ''}". Return ONLY the updated HTML body.`
: `Expand the HTML article from approximately ${currentWordCount} words to at least ${target} words. Add useful examples, details, and clarifications. Preserve H2/H3 structure and lists. Maintain tone and SEO keyword "${targetKeyword || ''}". Return ONLY the updated HTML body.`;
const prompt = `${instruction}\n\nOriginal HTML:\n${content.content}`;
try {
const refinedHtml = await callTextModel(provider, modelId, prompt, 2048);
let cleaned = String(refinedHtml).replace(/^`html?\n?/i, "").replace(/`$/g, "").trim();
if (!cleaned) throw new Error("Refinement returned empty content");
return {
...content,
content: cleaned,
};
} catch (err) {
return content;
}
}

async function validateAndRefineWordCount(
content: GeneratedContent,
minWords: number,
maxWords: number,
modelId: string,
provider: string,
targetKeyword?: string
): Promise<GeneratedContent> {
const MAX_REFINEMENT_ATTEMPTS = 3;
let currentContent = { ...content };
let wc = countWords(currentContent.content);
for (let attempt = 1; attempt <= MAX_REFINEMENT_ATTEMPTS; attempt++) {
if (wc >= minWords && wc <= maxWords) {
break;
}
const action = wc > maxWords ? 'shorten' : 'expand';
const target = action === 'shorten' ? Math.floor((minWords + maxWords) / 2) : minWords;
const refined = await refineContent(currentContent, action, target, modelId, provider, targetKeyword);
const newWordCount = countWords(refined.content);
if (newWordCount !== wc) {
currentContent = refined;
wc = newWordCount;
continue;
}
break;
}
if (countWords(currentContent.content) > maxWords) {
currentContent.content = clampHtmlToWords(currentContent.content, maxWords);
}
return currentContent;
}

async function correctMetaField(
fieldType: 'meta_title' | 'meta_description',
currentValue: string,
contextValue: string,
minLen: number,
maxLen: number,
modelId: string,
provider: string,
targetKeyword?: string
): Promise<string> {
const fieldName = fieldType === 'meta_title' ? 'SEO meta title' : 'SEO meta description';
const prompt = `Rewrite this ${fieldName} to be BETWEEN ${minLen} and ${maxLen} characters inclusive. Context: ${contextValue}. Current: ${currentValue}. Include keyword "${targetKeyword || ''}" if relevant. Return ONLY the rewritten text, no quotes.`;
try {
const corrected = await callTextModel(provider, modelId, prompt, 200);
const cleaned = String(corrected).trim();
if (cleaned.length >= minLen && cleaned.length <= maxLen) return cleaned;
return clampText(cleaned || currentValue, minLen, maxLen);
} catch (e) {
return clampText(currentValue, minLen, maxLen);
}
}

async function validateAndCorrectMetaFields(
content: GeneratedContent,
modelId: string,
provider: string,
targetKeyword?: string
): Promise<GeneratedContent> {
const META_TITLE_MIN = 48;
const META_TITLE_MAX = 58;
const META_DESC_MIN = 140;
const META_DESC_MAX = 158;
let correctedContent = { ...content };
const titleLen = correctedContent.meta_title.length;
if (titleLen < META_TITLE_MIN || titleLen > META_TITLE_MAX) {
try {
const correctedTitle = await correctMetaField(
'meta_title',
correctedContent.meta_title,
correctedContent.title,
META_TITLE_MIN,
META_TITLE_MAX,
modelId,
provider,
targetKeyword
);
correctedContent.meta_title = correctedTitle;
} catch (e) {
correctedContent.meta_title = clampText(correctedContent.meta_title, META_TITLE_MIN, META_TITLE_MAX);
}
}
const descLen = correctedContent.meta_description.length;
if (descLen < META_DESC_MIN || descLen > META_DESC_MAX) {
try {
const correctedDesc = await correctMetaField(
'meta_description',
correctedContent.meta_description,
correctedContent.excerpt || correctedContent.title,
META_DESC_MIN,
META_DESC_MAX,
modelId,
provider,
targetKeyword
);
correctedContent.meta_description = correctedDesc;
} catch (e) {
correctedContent.meta_description = clampText(correctedContent.meta_description, META_DESC_MIN, META_DESC_MAX);
}
}
return correctedContent;
}

serve(async (req) => {
if (req.method === "OPTIONS") {
return new Response(null, { headers: corsHeaders });
}
try {
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);
const authHeader = req.headers.get("Authorization");
if (!authHeader) {
return new Response(JSON.stringify({ error: "No authorization header" }), {
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
const body: GenerationRequest = await req.json();
const { model_id, preset_id, topic, target_keyword, word_count_min, word_count_max, custom_instructions } = body;
if (!model_id || !topic) {
return new Response(JSON.stringify({ error: "model_id and topic are required" }), {
status: 400,
headers: { ...corsHeaders, "Content-Type": "application/json" },
});
}
const { data: model, error: modelError } = await supabase
.from("ai_models")
.select("*")
.eq("id", model_id)
.eq("is_active", true)
.single();
if (modelError || !model) {
return new Response(JSON.stringify({ error: "Model not found or inactive" }), {
status: 404,
headers: { ...corsHeaders, "Content-Type": "application/json" },
});
}
let preset = null;
if (preset_id) {
const { data: presetData, error: presetError } = await supabase
.from("ai_tone_presets")
.select("*")
.eq("id", preset_id)
.single();
if (!presetError && presetData) {
preset = presetData;
}
}
const minWords = word_count_min || preset?.word_count_min || 800;
const maxWords = word_count_max || preset?.word_count_max || 1500;
const systemPrompt = buildSystemPrompt(preset, target_keyword, minWords, maxWords, custom_instructions);
const userPrompt = buildUserPrompt(topic, target_keyword, preset);
let generatedContent: GeneratedContent;
try {
if (model.provider === "lovable") {
generatedContent = await callLovableAI(model.model_id, systemPrompt, userPrompt);
} else if (model.provider === "bedrock") {
generatedContent = await callBedrockAI(model.model_id, systemPrompt, userPrompt);
} else {
throw new Error(`Unsupported provider: ${model.provider}. Only 'lovable' and 'bedrock' are supported.`);
}
} catch (aiError) {
return new Response(JSON.stringify({
error: "AI generation failed",
details: aiError instanceof Error ? aiError.message : "Unknown error"
}), {
status: 500,
headers: { ...corsHeaders, "Content-Type": "application/json" },
});
}
generatedContent = await validateAndRefineWordCount(
generatedContent,
minWords,
maxWords,
model.model_id,
model.provider,
target_keyword
);
generatedContent = await validateAndCorrectMetaFields(
generatedContent,
model.model_id,
model.provider,
target_keyword
);
await supabase.from("ai_generations").insert({
model_id: model_id,
preset_id: preset_id || null,
topic: topic,
target_keyword: target_keyword || null,
generated_content: generatedContent,
created_by: user.id,
});
return new Response(JSON.stringify({
success: true,
content: generatedContent
}), {
headers: { ...corsHeaders, "Content-Type": "application/json" },
});
} catch (error) {
return new Response(JSON.stringify({
error: "Internal server error",
details: error instanceof Error ? error.message : "Unknown error"
}), {
status: 500,
headers: { ...corsHeaders, "Content-Type": "application/json" },
});
}
});

function buildSystemPrompt(
preset: any,
targetKeyword?: string,
wordCountMin?: number,
wordCountMax?: number,
customInstructions?: string
): string {
const minWords = wordCountMin || preset?.word_count_min || 800;
const maxWords = wordCountMax || preset?.word_count_max || 1500;
const tone = preset?.tone || "professional";
const structure = preset?.article_structure || { intro: true, sections: 3, conclusion: true, cta: false };
let prompt = `You are an expert luxury magazine content writer. Generate a high-quality blog article in JSON format.

CRITICAL REQUIREMENTS:

1. Output ONLY valid JSON, no markdown code blocks, no explanations
2. The JSON must match this exact structure:
   {
   "title": "compelling headline under 60 characters",
   "subtitle": "engaging subtitle under 100 characters",
   "slug": "url-friendly-slug-with-hyphens",
   "excerpt": "compelling 2-3 sentence summary under 160 characters",
   "meta_title": "SEO title EXACTLY 48-58 characters",
   "meta_description": "SEO description EXACTLY 140-158 characters",
   "content": "full HTML article content with proper formatting",
   "suggested_tags": ["tag1", "tag2", "tag3"]
   }

SEO META REQUIREMENTS (CRITICAL - COUNT CAREFULLY):

* meta_title MUST be EXACTLY 48-58 characters (count every character including spaces)
* meta_description MUST be EXACTLY 140-158 characters (count every character)
* Both should include the target keyword naturally

WORD COUNT REQUIREMENT (STRICT):

* Article body content MUST be between ${minWords}-${maxWords} words
* Count words carefully and stay within this range
* Do NOT exceed ${maxWords} words under any circumstances

CONTENT GUIDELINES:

* Tone: ${tone}
* Writing style: Sophisticated, engaging, authoritative`;
  if (targetKeyword) {
    prompt += `
* Target keyword: "${targetKeyword}" - must appear in title, H2/H3 headings, first paragraph, and naturally throughout`;
  }
  if (structure) {
    prompt += `

ARTICLE STRUCTURE:`;
    if (structure.intro) prompt += `

* Strong introduction that hooks the reader`;
    prompt += `
* ${structure.sections} main content sections with H2 headings`;
    if (structure.conclusion) prompt += `
* Thoughtful conclusion that summarizes key points`;
    if (structure.cta) prompt += `
* Call-to-action at the end`;
  }
  if (preset?.custom_prompt) {
    prompt += `

CUSTOM INSTRUCTIONS:
${preset.custom_prompt}`;
  }
  if (preset?.style_guidelines) {
    prompt += `

STYLE GUIDELINES:
${preset.style_guidelines}`;
  }
  if (customInstructions) {
    prompt += `

ADDITIONAL INSTRUCTIONS:
${customInstructions}`;
  }
  prompt += `

HTML FORMATTING:

* Use <h2> for main section headings
* Use <h3> for subsection headings
* Use <p> for paragraphs
* Use <strong> and <em> for emphasis
* Use <ul>/<li> or <ol>/<li> for lists
* Use <blockquote> for quotes
* Keep paragraphs concise (3-5 sentences)

Remember: Output ONLY the JSON object, nothing else. Complete the entire JSON response. Double-check word count and character counts before responding.`;
return prompt;
}

function buildUserPrompt(topic: string, targetKeyword?: string, preset?: any): string {
let prompt = `Write a ${preset?.tone || "professional"} luxury magazine article about: ${topic}`;
if (targetKeyword) {
prompt += `\n\nTarget SEO keyword: "${targetKeyword}"`;
}
return prompt;
}

async function callLovableAI(modelId: string, systemPrompt: string, userPrompt: string): Promise<GeneratedContent> {
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
if (!LOVABLE_API_KEY) {
throw new Error("LOVABLE_API_KEY is not configured");
}
const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
method: "POST",
headers: {
Authorization: `Bearer ${LOVABLE_API_KEY}`,
"Content-Type": "application/json",
},
body: JSON.stringify({
model: modelId || "google/gemini-2.5-flash",
messages: [
{ role: "system", content: systemPrompt },
{ role: "user", content: userPrompt },
],
temperature: 0.7,
max_tokens: 8192,
}),
});
if (!response.ok) {
const errorText = await response.text();
if (response.status === 429) {
throw new Error("Rate limit exceeded. Please try again later.");
}
if (response.status === 402) {
throw new Error("Payment required. Please add credits to your Lovable AI workspace.");
}
throw new Error(`Lovable AI error: ${response.status}`);
}
const data = await response.json();
const content = data.choices?.[0]?.message?.content;
if (!content) {
throw new Error("No content in Lovable AI response");
}
return parseAIResponse(content);
}

async function callBedrockAI(modelId: string, systemPrompt: string, userPrompt: string): Promise<GeneratedContent> {
const accessKey = Deno.env.get("AWS_ACCESS_KEY_ID");
const secretKey = Deno.env.get("AWS_SECRET_ACCESS_KEY");
const region = Deno.env.get("AWS_REGION") || "us-east-1";
if (!accessKey || !secretKey) {
throw new Error("AWS credentials not configured. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in Cloud Secrets.");
}
const host = `bedrock-runtime.${region}.amazonaws.com`;
let body: string;
let useConverseApi = false;
if (modelId.includes("anthropic")) {
body = JSON.stringify({
anthropic_version: "bedrock-2023-05-31",
max_tokens: 8192,
system: systemPrompt,
messages: [{ role: "user", content: userPrompt }],
});
} else if (modelId.includes("amazon.titan-text")) {
body = JSON.stringify({
inputText: `${systemPrompt}\n\n${userPrompt}`,
textGenerationConfig: {
maxTokenCount: 8192,
temperature: 0.7,
},
});
} else {
useConverseApi = true;
body = JSON.stringify({
messages: [
{ role: "user", content: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
],
inferenceConfig: {
maxTokens: 8192,
temperature: 0.7,
},
});
}
const now = new Date();
const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
const dateStamp = amzDate.substring(0, 8);
const apiPath = useConverseApi
? `/model/${encodeURIComponent(modelId)}/converse`
: `/model/${encodeURIComponent(modelId)}/invoke`;
const endpoint = `https://${host}${apiPath}`;
const canonicalUri = apiPath;
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
const errorText = await response.text();
throw new Error(`Bedrock error: ${response.status} - ${errorText}`);
}
const data = await response.json();
let content: string;
if (useConverseApi && data.output?.message?.content?.[0]?.text) {
content = data.output.message.content[0].text;
} else if (data.content?.[0]?.text) {
content = data.content[0].text;
} else if (data.results?.[0]?.outputText) {
content = data.results[0].outputText;
} else if (data.generation) {
content = data.generation;
} else if (data.outputs?.[0]?.text) {
content = data.outputs[0].text;
} else {
throw new Error("Unknown Bedrock response format");
}
return parseAIResponse(content);
}

function parseAIResponse(content: string): GeneratedContent {
let cleanContent = content.trim();
if (cleanContent.startsWith("`json")) {
    cleanContent = cleanContent.slice(7);
  } else if (cleanContent.startsWith("`")) {
cleanContent = cleanContent.slice(3);
}
if (cleanContent.endsWith("```")) {
cleanContent = cleanContent.slice(0, -3);
}
cleanContent = cleanContent.trim();
const jsonMatch = cleanContent.match(/{[\s\S]*}/);
if (jsonMatch) {
cleanContent = jsonMatch[0];
}
try {
const parsed = JSON.parse(cleanContent);
if (!parsed.title || !parsed.content) {
throw new Error("Missing required fields in AI response (title or content)");
}
if (!parsed.slug) {
parsed.slug = parsed.title
.toLowerCase()
.replace(/[^a-z0-9\s-]/g, "")
.replace(/\s+/g, "-")
.replace(/-+/g, "-")
.slice(0, 60);
}
return {
title: parsed.title || "",
subtitle: parsed.subtitle || "",
slug: parsed.slug || "",
excerpt: parsed.excerpt || "",
meta_title: parsed.meta_title || parsed.title?.slice(0, 58) || "",
meta_description: parsed.meta_description || parsed.excerpt?.slice(0, 158) || "",
content: parsed.content || "",
suggested_tags: Array.isArray(parsed.suggested_tags) ? parsed.suggested_tags : [],
};
} catch (e) {
const jsonContains = cleanContent.includes('"title"') && cleanContent.includes('"content"');
if (jsonContains) {
try {
const extractField = (fieldName: string): string => {
const regex = new RegExp(`"${fieldName}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`);
const match = cleanContent.match(regex);
return match ? match[1].replace(/\"/g, '"').replace(/\n/g, '\n') : '';
};
const title = extractField('title');
const content = extractField('content');
if (title && content) {
return {
title,
subtitle: extractField('subtitle'),
slug: extractField('slug') || title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 60),
excerpt: extractField('excerpt'),
meta_title: extractField('meta_title') || title.slice(0, 58),
meta_description: extractField('meta_description') || extractField('excerpt').slice(0, 158),
content,
suggested_tags: [],
};
}
let repairedContent = cleanContent;
const openBraces = (repairedContent.match(/{/g) || []).length;
const closeBraces = (repairedContent.match(/}/g) || []).length;
const openBrackets = (repairedContent.match(/\[/g) || []).length;
const closeBrackets = (repairedContent.match(/]/g) || []).length;
for (let i = 0; i < openBrackets - closeBrackets; i++) {
repairedContent += ']';
}
for (let i = 0; i < openBraces - closeBraces; i++) {
repairedContent += '}';
}
const repaired = JSON.parse(repairedContent);
if (repaired.title && repaired.content) {
return {
title: repaired.title || "",
subtitle: repaired.subtitle || "",
slug: repaired.slug || repaired.title?.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 60) || "",
excerpt: repaired.excerpt || "",
meta_title: repaired.meta_title || repaired.title?.slice(0, 58) || "",
meta_description: repaired.meta_description || repaired.excerpt?.slice(0, 158) || "",
content: repaired.content || "",
suggested_tags: Array.isArray(repaired.suggested_tags) ? repaired.suggested_tags : [],
};
}
} catch (repairError) {
}
}
throw new Error("Failed to parse AI response as JSON");
}
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
