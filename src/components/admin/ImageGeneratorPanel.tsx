import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAIImageModels } from "@/hooks/useAIImageModels";
import { useActiveImageStylePresets } from "@/hooks/useImageStylePresets";
import { useAIImageGenerate, GeneratedImage } from "@/hooks/useAIImageGenerate";
import { ImagePlus, Loader2, CheckCircle2, Image as ImageIcon, Sparkles, Wand2 } from "lucide-react";

interface ContentSection {
  type: 'intro' | 'section' | 'conclusion' | 'cta';
  heading?: string;
  content: string;
  index: number;
}

interface ImageGeneratorPanelProps {
  blogTitle: string;
  blogContent: string;
  contentSections: ContentSection[];
  onFeaturedImageGenerated: (image: GeneratedImage) => void;
  onSectionImageGenerated: (sectionIndex: number, image: GeneratedImage) => void;
}

export function ImageGeneratorPanel({
  blogTitle,
  blogContent,
  contentSections,
  onFeaturedImageGenerated,
  onSectionImageGenerated,
}: ImageGeneratorPanelProps) {
  const { data: imageModels, isLoading: loadingModels } = useAIImageModels();
  const { data: stylePresets, isLoading: loadingPresets } = useActiveImageStylePresets();
  const generateImage = useAIImageGenerate();

  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [selectedStylePresetId, setSelectedStylePresetId] = useState<string>("");
  const [selectedSections, setSelectedSections] = useState<number[]>([]);
  const [generatingFeatured, setGeneratingFeatured] = useState(false);
  const [generatingSections, setGeneratingSections] = useState<number[]>([]);
  const [generatedImages, setGeneratedImages] = useState<Record<string, GeneratedImage>>({});

  const activeModels = imageModels?.filter(m => m.is_active) || [];
  const defaultStylePreset = stylePresets?.find(p => p.is_default);

  // Set default style preset when data loads
  useEffect(() => {
    if (defaultStylePreset && !selectedStylePresetId) {
      setSelectedStylePresetId(defaultStylePreset.id);
    }
  }, [defaultStylePreset, selectedStylePresetId]);

  // Filter sections - exclude intro, conclusion, and cta
  const imageableSections = contentSections.filter(
    s => s.type === 'section' && s.heading
  );

  const toggleSection = (index: number) => {
    setSelectedSections(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const selectAllSections = () => {
    setSelectedSections(imageableSections.map(s => s.index));
  };

  const clearSelection = () => {
    setSelectedSections([]);
  };

  // Extract key visual concept from section content
  const extractVisualConcept = (heading: string, content: string): string => {
    // Strip HTML and get text content
    const textContent = content.replace(/<[^>]+>/g, ' ').trim();
    
    // Extract meaningful keywords (nouns, adjectives)
    const words = textContent.split(/\s+/).filter(w => w.length > 4);
    const keyWords = words.slice(0, 15).join(' ');
    
    return `${heading}: ${keyWords}`;
  };

  const handleGenerateFeaturedImage = async () => {
    if (!selectedModelId) return;
    
    setGeneratingFeatured(true);
    try {
      // Extract key themes from content for better prompt
      const textContent = blogContent.replace(/<[^>]+>/g, ' ').substring(0, 500);
      
      const result = await generateImage.mutateAsync({
        model_id: selectedModelId,
        prompt: `Featured image for luxury magazine article: "${blogTitle}"`,
        context: textContent,
        article_title: blogTitle,
        alt_text_hint: `Featured image for ${blogTitle}`,
        style_preset_id: selectedStylePresetId || undefined,
      });
      
      setGeneratedImages(prev => ({ ...prev, featured: result }));
      onFeaturedImageGenerated(result);
    } finally {
      setGeneratingFeatured(false);
    }
  };

  const handleGenerateSectionImages = async () => {
    if (!selectedModelId || selectedSections.length === 0) return;
    
    setGeneratingSections(selectedSections);
    
    for (const sectionIndex of selectedSections) {
      const section = contentSections.find(s => s.index === sectionIndex);
      if (!section) continue;
      
      try {
        const sectionText = section.content.replace(/<[^>]+>/g, ' ').substring(0, 400);
        const visualConcept = extractVisualConcept(section.heading || '', section.content);
        
        const result = await generateImage.mutateAsync({
          model_id: selectedModelId,
          prompt: visualConcept,
          context: sectionText,
          section_heading: section.heading,
          article_title: blogTitle,
          section_content: sectionText,
          alt_text_hint: `${section.heading} - ${blogTitle}`,
          style_preset_id: selectedStylePresetId || undefined,
        });
        
        setGeneratedImages(prev => ({ ...prev, [`section-${sectionIndex}`]: result }));
        onSectionImageGenerated(sectionIndex, result);
        setGeneratingSections(prev => prev.filter(i => i !== sectionIndex));
      } catch (error) {
        console.error(`Failed to generate image for section ${sectionIndex}:`, error);
        setGeneratingSections(prev => prev.filter(i => i !== sectionIndex));
      }
    }
    
    setGeneratingSections([]);
  };

  if (loadingModels || loadingPresets) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (activeModels.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 font-semibold">No Image Models Configured</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Go to AI Settings → Image Models to add and enable AI image generation models.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.href = '/admin/ai-settings'}>
            Configure Image Models
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI Image Generator
        </CardTitle>
        <CardDescription>
          Generate unique AI images (1152×768px JPEG @ 80% quality) with dynamic styling for each section
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Model Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Image Generation Model</Label>
            <Select value={selectedModelId} onValueChange={setSelectedModelId}>
              <SelectTrigger>
                <SelectValue placeholder="Select an image model" />
              </SelectTrigger>
              <SelectContent>
                {activeModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex items-center gap-2">
                      <span>{model.name}</span>
                      <Badge variant="outline" className="text-xs">{model.provider}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Image Style Preset
            </Label>
            <Select value={selectedStylePresetId} onValueChange={setSelectedStylePresetId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a style (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No style preset</SelectItem>
                {stylePresets?.map((preset) => (
                  <SelectItem key={preset.id} value={preset.id}>
                    <div className="flex items-center gap-2">
                      <span>{preset.name}</span>
                      {preset.is_default && <Badge variant="secondary" className="text-xs">Default</Badge>}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Featured Image */}
        <div className="space-y-3 p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Featured Image</h4>
              <p className="text-sm text-muted-foreground">Main image for the article (1152×768px)</p>
            </div>
            {generatedImages.featured ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">Generated</span>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={handleGenerateFeaturedImage}
                disabled={!selectedModelId || generatingFeatured}
              >
                {generatingFeatured ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ImagePlus className="h-4 w-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            )}
          </div>
          
          {generatedImages.featured && (
            <div className="mt-3">
              <img 
                src={generatedImages.featured.image_url} 
                alt={generatedImages.featured.alt_text}
                className="w-full h-40 object-cover rounded-md"
              />
              <p className="text-xs text-muted-foreground mt-1">{generatedImages.featured.alt_text}</p>
            </div>
          )}
        </div>

        {/* Section Images */}
        {imageableSections.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Section Images</h4>
                <p className="text-sm text-muted-foreground">Each section gets a unique, context-aware image</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={selectAllSections}>
                  Select All
                </Button>
                <Button variant="ghost" size="sm" onClick={clearSelection}>
                  Clear
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[200px] rounded-md border p-3">
              <div className="space-y-2">
                {imageableSections.map((section) => {
                  const isGenerated = !!generatedImages[`section-${section.index}`];
                  const isGenerating = generatingSections.includes(section.index);
                  
                  return (
                    <div 
                      key={section.index}
                      className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
                        isGenerated ? 'bg-green-500/10' : 'hover:bg-muted/50'
                      }`}
                    >
                      <Checkbox
                        id={`section-${section.index}`}
                        checked={selectedSections.includes(section.index)}
                        onCheckedChange={() => toggleSection(section.index)}
                        disabled={isGenerating || isGenerated}
                      />
                      <label
                        htmlFor={`section-${section.index}`}
                        className="flex-1 text-sm cursor-pointer"
                      >
                        {section.heading}
                      </label>
                      {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
                      {isGenerated && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <Button
              onClick={handleGenerateSectionImages}
              disabled={!selectedModelId || selectedSections.length === 0 || generatingSections.length > 0}
              className="w-full"
            >
              {generatingSections.length > 0 ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating {generatingSections.length} image(s)...
                </>
              ) : (
                <>
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Generate Images for {selectedSections.length} Section(s)
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Export generated images for use in AIWriterPanel
export type { GeneratedImage };
