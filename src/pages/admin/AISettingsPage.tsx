import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useAIModels, useCreateAIModel, useUpdateAIModel, useDeleteAIModel, AIModel } from "@/hooks/useAIModels";
import { useBedrockModels } from "@/hooks/useBedrockModels";
import { useBedrockImageModels } from "@/hooks/useBedrockImageModels";
import { useAITonePresets, useCreateAITonePreset, useUpdateAITonePreset, useDeleteAITonePreset, AITonePreset, ArticleStructure } from "@/hooks/useAITonePresets";
import { useAIImageModels, useCreateAIImageModel, useUpdateAIImageModel, useDeleteAIImageModel, AIImageModel } from "@/hooks/useAIImageModels";
import { useImageStylePresets, useCreateImageStylePreset, useUpdateImageStylePreset, useDeleteImageStylePreset, ImageStylePreset } from "@/hooks/useImageStylePresets";
import { Bot, Cloud, Key, Plus, Settings2, Trash2, Pencil, Sparkles, Zap, Palette, ImageIcon, Wand2, Shield } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Simplified to only Lovable AI and Bedrock
const PROVIDER_OPTIONS = [
  { value: "lovable", label: "Lovable AI", description: "Pre-configured, no API key needed" },
  { value: "bedrock", label: "AWS Bedrock", description: "90+ models via Cloud secrets" },
];

const TONE_OPTIONS = [
  "professional",
  "casual",
  "food-safety",
  "technical",
  "conversational",
  "academic",
  "persuasive",
  "storytelling",
];

// Standard tones that can be enabled
const STANDARD_TONES = [
  { name: "Optimistic", description: "Positive and hopeful perspective", tone: "optimistic" },
  { name: "Humorous", description: "Light-hearted and entertaining", tone: "humorous" },
  { name: "Pessimistic", description: "Cautious and realistic viewpoint", tone: "pessimistic" },
  { name: "Curious", description: "Questioning and exploratory", tone: "curious" },
  { name: "Animated", description: "Energetic and lively", tone: "animated" },
  { name: "Informal", description: "Casual and relaxed", tone: "informal" },
  { name: "Sarcastic", description: "Ironic and witty", tone: "sarcastic" },
  { name: "Cautionary", description: "Warning and advisory", tone: "cautionary" },
  { name: "Formal", description: "Professional and structured", tone: "formal" },
  { name: "Persuasive", description: "Convincing and compelling", tone: "persuasive" },
  { name: "Assertive", description: "Confident and direct", tone: "assertive" },
  { name: "Encouraging", description: "Supportive and motivating", tone: "encouraging" },
  { name: "Compassionate", description: "Empathetic and caring", tone: "compassionate" },
  { name: "Informative", description: "Educational and factual", tone: "informative" },
  { name: "Serious", description: "Grave and earnest", tone: "serious" },
  { name: "Conversational", description: "Friendly and dialogue-like", tone: "conversational" },
  { name: "Authoritative", description: "Expert and commanding", tone: "authoritative" },
  { name: "Sympathetic", description: "Understanding and supportive", tone: "sympathetic" },
  { name: "Inspirational", description: "Motivating and uplifting", tone: "inspirational" },
];

export default function AISettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Integration</h1>
        <p className="text-muted-foreground">
          Configure AI models and writing presets for blog generation
        </p>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          AWS credentials are securely stored in Cloud Secrets. Configure them in Settings → Cloud → Secrets.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="models" className="space-y-4">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="models" className="gap-2">
            <Bot className="h-4 w-4" />
            AI Models
          </TabsTrigger>
          <TabsTrigger value="image-models" className="gap-2">
            <ImageIcon className="h-4 w-4" />
            Image Models
          </TabsTrigger>
          <TabsTrigger value="image-styles" className="gap-2">
            <Wand2 className="h-4 w-4" />
            Image Styles
          </TabsTrigger>
          <TabsTrigger value="standard-tones" className="gap-2">
            <Palette className="h-4 w-4" />
            Standard Tones
          </TabsTrigger>
          <TabsTrigger value="presets" className="gap-2">
            <Settings2 className="h-4 w-4" />
            Custom Presets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="models">
          <AIModelsTab />
        </TabsContent>

        <TabsContent value="image-models">
          <ImageModelsTab />
        </TabsContent>

        <TabsContent value="image-styles">
          <ImageStylePresetsTab />
        </TabsContent>

        <TabsContent value="standard-tones">
          <StandardTonesTab />
        </TabsContent>

        <TabsContent value="presets">
          <TonePresetsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AIModelsTab() {
  const { data: models, isLoading } = useAIModels();
  const createModel = useCreateAIModel();
  const updateModel = useUpdateAIModel();
  const deleteModel = useDeleteAIModel();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    provider: "lovable" as AIModel["provider"],
    model_id: "google/gemini-2.5-flash",
  });

  // Fetch Bedrock models when provider is bedrock
  const { data: bedrockModels, isLoading: isLoadingBedrockModels } = useBedrockModels(
    formData.provider === "bedrock" ? "env" : undefined
  );

  const handleSubmit = async () => {
    const displayName = formData.provider === "bedrock" && bedrockModels
      ? bedrockModels.find(m => m.modelId === formData.model_id)?.modelName || formData.name
      : formData.name;

    await createModel.mutateAsync({
      name: displayName,
      provider: formData.provider,
      model_id: formData.model_id,
      is_active: true,
    });
    setIsDialogOpen(false);
    setFormData({ name: "", provider: "lovable", model_id: "google/gemini-2.5-flash" });
  };

  const toggleModelActive = (model: AIModel) => {
    updateModel.mutate({ id: model.id, is_active: !model.is_active });
  };

  const getProviderBadgeColor = (provider: string) => {
    switch (provider) {
      case "lovable": return "bg-purple-500 text-white";
      case "bedrock": return "bg-amber-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const LOVABLE_MODELS = [
    { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash (Recommended)" },
    { id: "google/gemini-2.5-pro", name: "Gemini 2.5 Pro" },
    { id: "google/gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite" },
    { id: "openai/gpt-5", name: "GPT-5" },
    { id: "openai/gpt-5-mini", name: "GPT-5 Mini" },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>AI Models</CardTitle>
          <CardDescription>
            Configure AI models for blog content generation (Lovable AI or AWS Bedrock)
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Model
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add AI Model</DialogTitle>
              <DialogDescription>
                Configure a new AI model for content generation
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Provider</Label>
                <Select
                  value={formData.provider}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    provider: value as AIModel["provider"], 
                    model_id: value === "lovable" ? "google/gemini-2.5-flash" : "",
                    name: "" 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVIDER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span>{option.label}</span>
                          <span className="text-xs text-muted-foreground">{option.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.provider === "lovable" && (
                <>
                  <div className="space-y-2">
                    <Label>Display Name</Label>
                    <Input
                      placeholder="e.g., Gemini Flash"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Select
                      value={formData.model_id}
                      onValueChange={(value) => setFormData({ ...formData, model_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent>
                        {LOVABLE_MODELS.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                    Lovable AI uses the pre-configured API key. No additional setup required!
                  </p>
                </>
              )}

              {formData.provider === "bedrock" && (
                <>
                  <div className="space-y-2">
                    <Label>Model</Label>
                    {isLoadingBedrockModels ? (
                      <p className="text-sm text-muted-foreground">Loading available models...</p>
                    ) : bedrockModels && bedrockModels.length > 0 ? (
                      <Select
                        value={formData.model_id}
                        onValueChange={(value) => {
                          const model = bedrockModels.find(m => m.modelId === value);
                          setFormData({ ...formData, model_id: value, name: model?.modelName || "" });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {bedrockModels.map((model) => (
                            <SelectItem key={model.modelId} value={model.modelId}>
                              <div className="flex flex-col">
                                <span>{model.modelName}</span>
                                <span className="text-xs text-muted-foreground">{model.providerName}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No models found. Make sure AWS credentials are configured in Cloud Secrets.
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                    AWS credentials are read from Cloud Secrets (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION).
                  </p>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!formData.name || !formData.model_id || createModel.isPending}
              >
                {createModel.isPending ? "Adding..." : "Add Model"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground">Loading models...</p>
        ) : models?.length === 0 ? (
          <div className="text-center py-8">
            <Bot className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2 text-muted-foreground">No AI models configured yet</p>
            <p className="text-sm text-muted-foreground">Add Lovable AI for free or use AWS Bedrock</p>
          </div>
        ) : (
          <div className="space-y-3">
            {models?.map((model) => (
              <div
                key={model.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{model.name}</span>
                      <Badge className={getProviderBadgeColor(model.provider)}>
                        {model.provider}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{model.model_id}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Active</span>
                    <Switch
                      checked={model.is_active}
                      onCheckedChange={() => toggleModelActive(model)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteModel.mutate(model.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Simplified to only Lovable AI and Bedrock
const IMAGE_PROVIDER_OPTIONS = [
  { value: "lovable", label: "Lovable AI (Nano Banana)", description: "Gemini Flash Image - Fast & Free" },
  { value: "bedrock", label: "AWS Bedrock", description: "Titan Image, Stable Diffusion" },
];

function ImageModelsTab() {
  const { data: models, isLoading } = useAIImageModels();
  const createModel = useCreateAIImageModel();
  const updateModel = useUpdateAIImageModel();
  const deleteModel = useDeleteAIImageModel();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    provider: "lovable" as string,
    model_id: "google/gemini-2.5-flash-image-preview",
  });

  // Fetch Bedrock image models
  const { data: bedrockImageModels, isLoading: isLoadingBedrockModels } = useBedrockImageModels(
    formData.provider === "bedrock" ? "env" : undefined
  );

  const handleSubmit = async () => {
    const displayName = formData.provider === "bedrock" && bedrockImageModels
      ? bedrockImageModels.find(m => m.modelId === formData.model_id)?.modelName || formData.name
      : formData.name;

    await createModel.mutateAsync({
      name: displayName,
      provider: formData.provider,
      model_id: formData.model_id,
      is_active: true,
    });
    setIsDialogOpen(false);
    setFormData({ name: "", provider: "lovable", model_id: "google/gemini-2.5-flash-image-preview" });
  };

  const toggleModelActive = (model: AIImageModel) => {
    updateModel.mutate({ id: model.id, is_active: !model.is_active });
  };

  const getProviderBadgeColor = (provider: string) => {
    switch (provider) {
      case "lovable": return "bg-purple-500 text-white";
      case "bedrock": return "bg-amber-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Image Generation Models</CardTitle>
          <CardDescription>
            Configure AI models for generating featured images and section images
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Image Model
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Image Generation Model</DialogTitle>
              <DialogDescription>
                Configure a new AI model for image generation
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Provider</Label>
                <Select
                  value={formData.provider}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    provider: value, 
                    model_id: value === "lovable" ? "google/gemini-2.5-flash-image-preview" : "",
                    name: ""
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {IMAGE_PROVIDER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span>{option.label}</span>
                          <span className="text-xs text-muted-foreground">{option.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.provider === "lovable" && (
                <>
                  <div className="space-y-2">
                    <Label>Display Name</Label>
                    <Input
                      placeholder="e.g., Nano Banana"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Model ID</Label>
                    <Input
                      placeholder="google/gemini-2.5-flash-image-preview"
                      value={formData.model_id}
                      onChange={(e) => setFormData({ ...formData, model_id: e.target.value })}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                    Lovable AI uses the pre-configured API key. No additional setup required!
                  </p>
                </>
              )}

              {formData.provider === "bedrock" && (
                <>
                  <div className="space-y-2">
                    <Label>Model</Label>
                    {isLoadingBedrockModels ? (
                      <p className="text-sm text-muted-foreground">Loading available image models...</p>
                    ) : bedrockImageModels && bedrockImageModels.length > 0 ? (
                      <Select
                        value={formData.model_id}
                        onValueChange={(value) => {
                          const model = bedrockImageModels.find(m => m.modelId === value);
                          setFormData({ ...formData, model_id: value, name: model?.modelName || "" });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an image model" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {bedrockImageModels.map((model) => (
                            <SelectItem key={model.modelId} value={model.modelId}>
                              <div className="flex flex-col">
                                <span>{model.modelName}</span>
                                <span className="text-xs text-muted-foreground">{model.providerName}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No image models found. Make sure AWS credentials are configured in Cloud Secrets.
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                    AWS credentials are read from Cloud Secrets (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION).
                  </p>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!formData.name || !formData.model_id || createModel.isPending}
              >
                {createModel.isPending ? "Adding..." : "Add Model"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground">Loading models...</p>
        ) : models?.length === 0 ? (
          <div className="text-center py-8">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2 text-muted-foreground">No image models configured yet</p>
            <p className="text-sm text-muted-foreground">Add Nano Banana (Lovable AI) for free image generation</p>
          </div>
        ) : (
          <div className="space-y-3">
            {models?.map((model) => (
              <div
                key={model.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{model.name}</span>
                      <Badge className={getProviderBadgeColor(model.provider)}>
                        {model.provider}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{model.model_id}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Active</span>
                    <Switch
                      checked={model.is_active}
                      onCheckedChange={() => toggleModelActive(model)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteModel.mutate(model.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ImageStylePresetsTab() {
  const { data: presets, isLoading } = useImageStylePresets();
  const createPreset = useCreateImageStylePreset();
  const updatePreset = useUpdateImageStylePreset();
  const deletePreset = useDeleteImageStylePreset();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<ImageStylePreset | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    prompt_prefix: "",
    prompt_suffix: "",
    negative_prompt: "",
    is_default: false,
  });

  useEffect(() => {
    if (editingPreset) {
      setFormData({
        name: editingPreset.name,
        description: editingPreset.description || "",
        prompt_prefix: editingPreset.prompt_prefix || "",
        prompt_suffix: editingPreset.prompt_suffix || "",
        negative_prompt: editingPreset.negative_prompt || "",
        is_default: editingPreset.is_default || false,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        prompt_prefix: "",
        prompt_suffix: "",
        negative_prompt: "",
        is_default: false,
      });
    }
  }, [editingPreset]);

  const handleSubmit = async () => {
    if (editingPreset) {
      await updatePreset.mutateAsync({
        id: editingPreset.id,
        ...formData,
      });
    } else {
      await createPreset.mutateAsync({
        ...formData,
        is_active: true,
      });
    }
    setIsDialogOpen(false);
    setEditingPreset(null);
  };

  const handleEdit = (preset: ImageStylePreset) => {
    setEditingPreset(preset);
    setIsDialogOpen(true);
  };

  const togglePresetActive = (preset: ImageStylePreset) => {
    updatePreset.mutate({ id: preset.id, is_active: !preset.is_active });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Image Style Presets</CardTitle>
          <CardDescription>
            Create reusable style presets for consistent image generation
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingPreset(null);
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Preset
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPreset ? "Edit" : "Add"} Image Style Preset</DialogTitle>
              <DialogDescription>
                Define style modifiers that will be applied to image prompts
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  placeholder="e.g., Photorealistic, Editorial, Artistic"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  placeholder="Brief description of this style"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Prompt Prefix</Label>
                <Textarea
                  placeholder="Text added before the main prompt, e.g., 'Professional photography, '"
                  value={formData.prompt_prefix}
                  onChange={(e) => setFormData({ ...formData, prompt_prefix: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Prompt Suffix</Label>
                <Textarea
                  placeholder="Text added after the main prompt, e.g., ', high resolution, 8k'"
                  value={formData.prompt_suffix}
                  onChange={(e) => setFormData({ ...formData, prompt_suffix: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Negative Prompt (optional)</Label>
                <Textarea
                  placeholder="Elements to avoid, e.g., 'blurry, low quality, text, watermark'"
                  value={formData.negative_prompt}
                  onChange={(e) => setFormData({ ...formData, negative_prompt: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_default"
                  checked={formData.is_default}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_default: checked as boolean })}
                />
                <Label htmlFor="is_default">Set as default preset</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsDialogOpen(false);
                setEditingPreset(null);
              }}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!formData.name || createPreset.isPending || updatePreset.isPending}
              >
                {(createPreset.isPending || updatePreset.isPending) ? "Saving..." : (editingPreset ? "Update" : "Add") + " Preset"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground">Loading presets...</p>
        ) : presets?.length === 0 ? (
          <div className="text-center py-8">
            <Wand2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2 text-muted-foreground">No image style presets yet</p>
            <p className="text-sm text-muted-foreground">Create presets to ensure consistent image styling</p>
          </div>
        ) : (
          <div className="space-y-3">
            {presets?.map((preset) => (
              <div
                key={preset.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{preset.name}</span>
                    {preset.is_default && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                  </div>
                  {preset.description && (
                    <span className="text-sm text-muted-foreground">{preset.description}</span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Active</span>
                    <Switch
                      checked={preset.is_active}
                      onCheckedChange={() => togglePresetActive(preset)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(preset)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deletePreset.mutate(preset.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StandardTonesTab() {
  const { data: existingPresets, isLoading } = useAITonePresets();
  const createPreset = useCreateAITonePreset();
  const deletePreset = useDeleteAITonePreset();
  const { toast } = useToast();

  const enabledTones = existingPresets?.map(p => p.tone) || [];

  const handleToggleTone = async (tone: typeof STANDARD_TONES[0], enabled: boolean) => {
    if (enabled) {
      // Create the preset
      await createPreset.mutateAsync({
        name: tone.name,
        description: tone.description,
        tone: tone.tone,
        is_default: false,
        word_count_min: 800,
        word_count_max: 1500,
        article_structure: { intro: true, sections: 3, conclusion: true, cta: false },
      });
      toast({ title: `${tone.name} tone enabled` });
    } else {
      // Find and delete the preset
      const preset = existingPresets?.find(p => p.tone === tone.tone);
      if (preset) {
        await deletePreset.mutateAsync(preset.id);
        toast({ title: `${tone.name} tone disabled` });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Standard Writing Tones</CardTitle>
        <CardDescription>
          Enable or disable pre-defined writing tones for AI content generation
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground">Loading tones...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {STANDARD_TONES.map((tone) => {
              const isEnabled = enabledTones.includes(tone.tone);
              return (
                <div
                  key={tone.tone}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{tone.name}</span>
                    <span className="text-xs text-muted-foreground">{tone.description}</span>
                  </div>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={(checked) => handleToggleTone(tone, checked)}
                    disabled={createPreset.isPending || deletePreset.isPending}
                  />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TonePresetsTab() {
  const { data: presets, isLoading } = useAITonePresets();
  const createPreset = useCreateAITonePreset();
  const updatePreset = useUpdateAITonePreset();
  const deletePreset = useDeleteAITonePreset();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<AITonePreset | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tone: "professional",
    word_count_min: 800,
    word_count_max: 1500,
    article_structure: {
      intro: true,
      sections: 3,
      conclusion: true,
      cta: false,
    } as ArticleStructure,
    custom_prompt: "",
    style_guidelines: "",
    is_default: false,
  });

  // Filter out standard tones to show only custom presets
  const customPresets = presets?.filter(p => 
    !STANDARD_TONES.some(st => st.tone === p.tone && st.name === p.name)
  );

  useEffect(() => {
    if (editingPreset) {
      setFormData({
        name: editingPreset.name,
        description: editingPreset.description || "",
        tone: editingPreset.tone || "professional",
        word_count_min: editingPreset.word_count_min || 800,
        word_count_max: editingPreset.word_count_max || 1500,
        article_structure: (editingPreset.article_structure as ArticleStructure) || {
          intro: true,
          sections: 3,
          conclusion: true,
          cta: false,
        },
        custom_prompt: editingPreset.custom_prompt || "",
        style_guidelines: editingPreset.style_guidelines || "",
        is_default: editingPreset.is_default || false,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        tone: "professional",
        word_count_min: 800,
        word_count_max: 1500,
        article_structure: {
          intro: true,
          sections: 3,
          conclusion: true,
          cta: false,
        },
        custom_prompt: "",
        style_guidelines: "",
        is_default: false,
      });
    }
  }, [editingPreset]);

  const handleSubmit = async () => {
    if (editingPreset) {
      await updatePreset.mutateAsync({
        id: editingPreset.id,
        ...formData,
      });
    } else {
      await createPreset.mutateAsync(formData);
    }
    setIsDialogOpen(false);
    setEditingPreset(null);
  };

  const handleEdit = (preset: AITonePreset) => {
    setEditingPreset(preset);
    setIsDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Custom Writing Presets</CardTitle>
          <CardDescription>
            Create detailed presets with custom prompts and style guidelines
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingPreset(null);
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Preset
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPreset ? "Edit" : "Add"} Writing Preset</DialogTitle>
              <DialogDescription>
                Configure detailed instructions for AI content generation
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    placeholder="e.g., RecallsFood"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select
                    value={formData.tone}
                    onValueChange={(value) => setFormData({ ...formData, tone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TONE_OPTIONS.map((tone) => (
                        <SelectItem key={tone} value={tone}>
                          {tone.charAt(0).toUpperCase() + tone.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  placeholder="Brief description of this preset"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Word Count Range: {formData.word_count_min} - {formData.word_count_max}</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    value={formData.word_count_min}
                    onChange={(e) => setFormData({ ...formData, word_count_min: parseInt(e.target.value) || 800 })}
                    className="w-24"
                  />
                  <span>to</span>
                  <Input
                    type="number"
                    value={formData.word_count_max}
                    onChange={(e) => setFormData({ ...formData, word_count_max: parseInt(e.target.value) || 1500 })}
                    className="w-24"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Article Structure</Label>
                <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="intro"
                      checked={formData.article_structure.intro}
                      onCheckedChange={(checked) => setFormData({
                        ...formData,
                        article_structure: { ...formData.article_structure, intro: checked as boolean }
                      })}
                    />
                    <Label htmlFor="intro">Introduction</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="conclusion"
                      checked={formData.article_structure.conclusion}
                      onCheckedChange={(checked) => setFormData({
                        ...formData,
                        article_structure: { ...formData.article_structure, conclusion: checked as boolean }
                      })}
                    />
                    <Label htmlFor="conclusion">Conclusion</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cta"
                      checked={formData.article_structure.cta}
                      onCheckedChange={(checked) => setFormData({
                        ...formData,
                        article_structure: { ...formData.article_structure, cta: checked as boolean }
                      })}
                    />
                    <Label htmlFor="cta">Call to Action</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label>Sections:</Label>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={formData.article_structure.sections}
                      onChange={(e) => setFormData({
                        ...formData,
                        article_structure: { ...formData.article_structure, sections: parseInt(e.target.value) || 3 }
                      })}
                      className="w-16"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Custom Prompt</Label>
                <Textarea
                  placeholder="Additional instructions for the AI, e.g., 'Always include a quote from an industry expert'"
                  value={formData.custom_prompt}
                  onChange={(e) => setFormData({ ...formData, custom_prompt: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Style Guidelines</Label>
                <Textarea
                  placeholder="Writing style guidelines, e.g., 'Use short paragraphs, avoid jargon, include data-backed claims'"
                  value={formData.style_guidelines}
                  onChange={(e) => setFormData({ ...formData, style_guidelines: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_default_preset"
                  checked={formData.is_default}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_default: checked as boolean })}
                />
                <Label htmlFor="is_default_preset">Set as default preset</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsDialogOpen(false);
                setEditingPreset(null);
              }}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!formData.name || createPreset.isPending || updatePreset.isPending}
              >
                {(createPreset.isPending || updatePreset.isPending) ? "Saving..." : (editingPreset ? "Update" : "Add") + " Preset"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground">Loading presets...</p>
        ) : customPresets?.length === 0 ? (
          <div className="text-center py-8">
            <Settings2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2 text-muted-foreground">No custom presets yet</p>
            <p className="text-sm text-muted-foreground">Create presets with detailed prompts and style guidelines</p>
          </div>
        ) : (
          <div className="space-y-3">
            {customPresets?.map((preset) => (
              <div
                key={preset.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{preset.name}</span>
                    {preset.is_default && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                    <Badge variant="outline">{preset.tone}</Badge>
                  </div>
                  {preset.description && (
                    <span className="text-sm text-muted-foreground">{preset.description}</span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {preset.word_count_min}-{preset.word_count_max} words
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(preset)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deletePreset.mutate(preset.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
