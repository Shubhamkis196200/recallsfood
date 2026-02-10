import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAIModels } from "@/hooks/useAIModels";
import { useAITonePresets } from "@/hooks/useAITonePresets";
import { useAIGenerate, GeneratedContent } from "@/hooks/useAIGenerate";
import { 
  Bot, Sparkles, Loader2, ChevronDown, CheckCircle2, XCircle, Link2, FileText, 
  AlertCircle, Eye, RefreshCw, ExternalLink, ShieldCheck, Plus, ImagePlus
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ImageGeneratorPanel } from "./ImageGeneratorPanel";
import { GeneratedImage } from "@/hooks/useAIImageGenerate";
import DOMPurify from "dompurify";

interface AIWriterPanelProps {
  onContentGenerated: (content: GeneratedContent) => void;
  onTagSuggestionClick?: (tag: string) => void;
  onFeaturedImageGenerated?: (imageUrl: string) => void;
  onSectionImageInsert?: (sectionIndex: number, imageHtml: string) => void;
}

interface InternalLinkSuggestion {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  relevance: number;
  inserted?: boolean;
}

interface KeywordValidation {
  keyword: string;
  inTitle: boolean;
  inH2: boolean;
  inH3: boolean;
  inFirstParagraph: boolean;
  inContent: boolean;
  score: number;
}

interface ContentSection {
  type: 'intro' | 'section' | 'conclusion';
  heading?: string;
  content: string;
  index: number;
}

interface PlagiarismResult {
  score: number;
  status: 'original' | 'warning' | 'concern';
  details: string;
}

export function AIWriterPanel({ onContentGenerated, onTagSuggestionClick, onFeaturedImageGenerated, onSectionImageInsert }: AIWriterPanelProps) {
  const { data: models, isLoading: loadingModels } = useAIModels();
  const { data: presets, isLoading: loadingPresets } = useAITonePresets();
  const generateMutation = useAIGenerate();

  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");
  const [topic, setTopic] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [wordCountRange, setWordCountRange] = useState([800, 1500]);
  const [customInstructions, setCustomInstructions] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [internalLinks, setInternalLinks] = useState<InternalLinkSuggestion[]>([]);
  const [keywordValidation, setKeywordValidation] = useState<KeywordValidation | null>(null);
  const [loadingLinks, setLoadingLinks] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [plagiarismResult, setPlagiarismResult] = useState<PlagiarismResult | null>(null);
  const [checkingPlagiarism, setCheckingPlagiarism] = useState(false);
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [regeneratingSection, setRegeneratingSection] = useState<number | null>(null);
  
  // Store generated images for pulling to editor
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string>("");
  const [sectionImages, setSectionImages] = useState<Record<number, { url: string; alt: string }>>({});
  
  // Meta title/description state for regeneration
  const [metaTitle, setMetaTitle] = useState<string>("");
  const [metaDescription, setMetaDescription] = useState<string>("");
  const [regeneratingMeta, setRegeneratingMeta] = useState<'title' | 'description' | null>(null);

  const activeModels = models?.filter(m => m.is_active) || [];
  const defaultPreset = presets?.find(p => p.is_default);

  // Set defaults when data loads
  useEffect(() => {
    if (activeModels.length > 0 && !selectedModelId) {
      setSelectedModelId(activeModels[0].id);
    }
  }, [activeModels, selectedModelId]);

  useEffect(() => {
    if (defaultPreset && !selectedPresetId) {
      setSelectedPresetId(defaultPreset.id);
      setWordCountRange([defaultPreset.word_count_min, defaultPreset.word_count_max]);
    }
  }, [defaultPreset, selectedPresetId]);

  // Update word count when preset changes
  useEffect(() => {
    const preset = presets?.find(p => p.id === selectedPresetId);
    if (preset) {
      setWordCountRange([preset.word_count_min, preset.word_count_max]);
    }
  }, [selectedPresetId, presets]);

  // Parse content into sections and populate meta fields when generated
  useEffect(() => {
    if (generatedContent?.content) {
      const sections = parseContentSections(generatedContent.content);
      setContentSections(sections);
    }
    if (generatedContent?.meta_title) {
      setMetaTitle(generatedContent.meta_title);
    }
    if (generatedContent?.meta_description) {
      setMetaDescription(generatedContent.meta_description);
    }
  }, [generatedContent]);

  const parseContentSections = (html: string): ContentSection[] => {
    const sections: ContentSection[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const children = doc.body.children;
    
    let currentSection: ContentSection | null = null;
    let sectionIndex = 0;
    let foundFirstH2 = false;
    
    for (let i = 0; i < children.length; i++) {
      const el = children[i];
      const tagName = el.tagName.toLowerCase();
      
      if (tagName === 'h2') {
        // Save previous section if exists
        if (currentSection) {
          sections.push(currentSection);
        }
        
        if (!foundFirstH2 && sectionIndex === 0) {
          // Any content before first H2 is intro
          const introContent = Array.from(children)
            .slice(0, i)
            .map(e => e.outerHTML)
            .join('');
          if (introContent.trim()) {
            sections.push({ type: 'intro', content: introContent, index: sectionIndex++ });
          }
          foundFirstH2 = true;
        }
        
        currentSection = {
          type: 'section',
          heading: el.textContent || '',
          content: el.outerHTML,
          index: sectionIndex++
        };
      } else if (currentSection) {
        currentSection.content += el.outerHTML;
      }
    }
    
    // Add last section
    if (currentSection) {
      sections.push(currentSection);
    }
    
    // If no H2s found, treat entire content as single section
    if (sections.length === 0) {
      sections.push({ type: 'section', content: html, index: 0 });
    }
    
    return sections;
  };

  const handleGenerate = async () => {
    if (!selectedModelId || !topic.trim()) return;

    // Parse multiple keywords separated by comma+space
    const keywords = targetKeyword.trim()
      ? targetKeyword.split(/,\s+/).map(k => k.trim()).filter(k => k.length > 0)
      : [];
    const primaryKeyword = keywords[0] || undefined;

    const result = await generateMutation.mutateAsync({
      model_id: selectedModelId,
      preset_id: selectedPresetId || undefined,
      topic: topic.trim(),
      target_keyword: primaryKeyword,
      word_count_min: wordCountRange[0],
      word_count_max: wordCountRange[1],
      custom_instructions: keywords.length > 1 
        ? `${customInstructions.trim()}\n\nAdditional target keywords to include: ${keywords.slice(1).join(', ')}`
        : customInstructions.trim() || undefined,
    });

    setGeneratedContent(result);
    
    // Validate all keywords if provided
    if (primaryKeyword) {
      validateKeyword(primaryKeyword, result);
    }

    // Find internal link suggestions
    findInternalLinks(result.content);
    
    // Run plagiarism check
    checkPlagiarism(result.content);
  };

  const validateKeyword = (keyword: string, content: GeneratedContent) => {
    const lowerKeyword = keyword.toLowerCase();
    const lowerTitle = content.title.toLowerCase();
    const lowerContent = content.content.toLowerCase();

    const h2Matches = content.content.match(/<h2[^>]*>([^<]+)<\/h2>/gi) || [];
    const h3Matches = content.content.match(/<h3[^>]*>([^<]+)<\/h3>/gi) || [];
    const h2Text = h2Matches.map(h => h.replace(/<[^>]+>/g, '').toLowerCase()).join(' ');
    const h3Text = h3Matches.map(h => h.replace(/<[^>]+>/g, '').toLowerCase()).join(' ');

    const firstPMatch = content.content.match(/<p[^>]*>([^<]+)<\/p>/i);
    const firstParagraph = firstPMatch ? firstPMatch[1].toLowerCase() : '';

    const validation: KeywordValidation = {
      keyword,
      inTitle: lowerTitle.includes(lowerKeyword),
      inH2: h2Text.includes(lowerKeyword),
      inH3: h3Text.includes(lowerKeyword),
      inFirstParagraph: firstParagraph.includes(lowerKeyword),
      inContent: lowerContent.includes(lowerKeyword),
      score: 0,
    };

    let score = 0;
    if (validation.inTitle) score += 25;
    if (validation.inH2) score += 25;
    if (validation.inH3) score += 15;
    if (validation.inFirstParagraph) score += 20;
    if (validation.inContent) score += 15;
    validation.score = score;

    setKeywordValidation(validation);
  };

  const checkPlagiarism = async (htmlContent: string) => {
    setCheckingPlagiarism(true);
    try {
      const textContent = htmlContent.replace(/<[^>]+>/g, ' ').trim();
      const words = textContent.split(/\s+/).filter(w => w.length > 3);
      const uniqueWords = new Set(words);
      const uniquenessRatio = uniqueWords.size / words.length;
      
      const score = Math.round(uniquenessRatio * 100);
      
      let status: PlagiarismResult['status'] = 'original';
      let details = '';
      
      if (score >= 70) {
        status = 'original';
        details = 'Content appears to be original with good vocabulary diversity.';
      } else if (score >= 50) {
        status = 'warning';
        details = 'Content has moderate vocabulary diversity. Consider adding more unique phrasing.';
      } else {
        status = 'concern';
        details = 'Content may benefit from more diverse vocabulary and unique phrasing.';
      }
      
      setPlagiarismResult({ score, status, details });
    } catch (error) {
      console.error("Plagiarism check failed:", error);
    } finally {
      setCheckingPlagiarism(false);
    }
  };

  const findInternalLinks = async (htmlContent: string) => {
    setLoadingLinks(true);
    try {
      const textContent = htmlContent.replace(/<[^>]+>/g, ' ').toLowerCase();
      const words = textContent.split(/\s+/).filter(w => w.length > 4);
      const uniqueWords = [...new Set(words)].slice(0, 20);

      const { data: posts } = await supabase
        .from('posts')
        .select('id, title, slug, excerpt')
        .eq('status', 'published')
        .limit(10);

      if (posts) {
        const suggestions: InternalLinkSuggestion[] = posts
          .map(post => {
            const postTitle = post.title.toLowerCase();
            const postExcerpt = (post.excerpt || '').toLowerCase();
            let relevance = 0;

            uniqueWords.forEach(word => {
              if (postTitle.includes(word)) relevance += 3;
              if (postExcerpt.includes(word)) relevance += 1;
            });

            return { ...post, relevance, inserted: false };
          })
          .filter(p => p.relevance > 0)
          .sort((a, b) => b.relevance - a.relevance)
          .slice(0, 5);

        setInternalLinks(suggestions);
      }
    } catch (error) {
      console.error("Failed to find internal links:", error);
    } finally {
      setLoadingLinks(false);
    }
  };

  // Safe internal link insertion using DOM parsing
  const insertInternalLink = (link: InternalLinkSuggestion) => {
    if (!generatedContent) return;
    
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(generatedContent.content, 'text/html');
      
      // Get all paragraph elements (avoid headings, lists, blockquotes, existing links)
      const paragraphs = doc.querySelectorAll('p');
      let inserted = false;
      
      // Build search phrases from link title (multi-word preferred)
      const titleWords = link.title.split(/\s+/).filter(w => w.length > 3);
      const searchPhrases: string[] = [];
      
      // Add 2-3 word phrases from title
      for (let i = 0; i < titleWords.length - 1; i++) {
        searchPhrases.push(`${titleWords[i]} ${titleWords[i + 1]}`);
        if (i < titleWords.length - 2) {
          searchPhrases.push(`${titleWords[i]} ${titleWords[i + 1]} ${titleWords[i + 2]}`);
        }
      }
      // Add individual significant words as fallback
      titleWords.forEach(w => {
        if (w.length > 5) searchPhrases.push(w);
      });
      
      for (const paragraph of paragraphs) {
        if (inserted) break;
        
        // Skip if paragraph already contains a link
        if (paragraph.querySelector('a')) continue;
        
        const paragraphText = paragraph.textContent || '';
        const paragraphHtml = paragraph.innerHTML;
        
        for (const phrase of searchPhrases) {
          if (inserted) break;
          
          // Case-insensitive search
          const regex = new RegExp(`\\b(${escapeRegExp(phrase)})\\b`, 'i');
          const match = paragraphText.match(regex);
          
          if (match) {
            // Find the actual text in the HTML (preserve case)
            const actualPhrase = match[1];
            const htmlRegex = new RegExp(`\\b(${escapeRegExp(actualPhrase)})\\b`);
            
            if (htmlRegex.test(paragraphHtml)) {
              // Replace only the first occurrence
              paragraph.innerHTML = paragraphHtml.replace(
                htmlRegex,
                `<a href="/news/${link.slug}" class="internal-link">$1</a>`
              );
              inserted = true;
              break;
            }
          }
        }
      }
      
      if (inserted) {
        // Serialize back to HTML
        const newContent = doc.body.innerHTML;
        setGeneratedContent({ ...generatedContent, content: newContent });
        setInternalLinks(prev => prev.map(l => 
          l.id === link.id ? { ...l, inserted: true } : l
        ));
      }
    } catch (error) {
      console.error("Failed to insert internal link:", error);
    }
  };
  
  // Helper to escape regex special characters
  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const regenerateSection = async (sectionIndex: number) => {
    if (!generatedContent || !selectedModelId) return;
    
    setRegeneratingSection(sectionIndex);
    try {
      const section = contentSections[sectionIndex];
      const sectionPrompt = section.heading 
        ? `Rewrite this section about "${section.heading}" with fresh perspective and improved quality.`
        : `Rewrite this introduction section with a stronger hook and better engagement.`;
      
      const result = await generateMutation.mutateAsync({
        model_id: selectedModelId,
        preset_id: selectedPresetId || undefined,
        topic: sectionPrompt,
        target_keyword: targetKeyword.trim() || undefined,
        word_count_min: 200,
        word_count_max: 500,
        custom_instructions: `This is a SECTION REGENERATION. Only generate the specific section content, not a full article. ${customInstructions}`,
      });
      
      // Replace the section content
      const newSections = [...contentSections];
      if (section.heading) {
        newSections[sectionIndex] = {
          ...section,
          content: `<h2>${section.heading}</h2>${result.content}`
        };
      } else {
        newSections[sectionIndex] = {
          ...section,
          content: result.content
        };
      }
      setContentSections(newSections);
      
      // Rebuild full content
      const newContent = newSections.map(s => s.content).join('\n');
      setGeneratedContent({ ...generatedContent, content: newContent });
    } catch (error) {
      console.error("Failed to regenerate section:", error);
    } finally {
      setRegeneratingSection(null);
    }
  };

  const regenerateMetaTitle = async () => {
    if (!selectedModelId || !generatedContent) return;
    setRegeneratingMeta('title');
    try {
      const result = await generateMutation.mutateAsync({
        model_id: selectedModelId,
        preset_id: selectedPresetId || undefined,
        topic: `Generate ONLY a meta title (48-58 characters exactly) for an article titled "${generatedContent.title}". Target keyword: ${targetKeyword || 'food safety'}. Return ONLY the meta title text, nothing else.`,
        word_count_min: 50,
        word_count_max: 100,
        custom_instructions: "Return ONLY the meta title text (48-58 chars). No JSON, no quotes, no explanation.",
      });
      const newTitle = result.meta_title || result.title?.substring(0, 58) || metaTitle;
      setMetaTitle(newTitle);
    } catch (error) {
      console.error("Failed to regenerate meta title:", error);
    } finally {
      setRegeneratingMeta(null);
    }
  };

  const regenerateMetaDescription = async () => {
    if (!selectedModelId || !generatedContent) return;
    setRegeneratingMeta('description');
    try {
      const result = await generateMutation.mutateAsync({
        model_id: selectedModelId,
        preset_id: selectedPresetId || undefined,
        topic: `Generate ONLY a meta description (140-158 characters exactly) for an article titled "${generatedContent.title}" with excerpt: "${generatedContent.excerpt}". Target keyword: ${targetKeyword || 'food safety'}. Return ONLY the meta description text, nothing else.`,
        word_count_min: 100,
        word_count_max: 200,
        custom_instructions: "Return ONLY the meta description text (140-158 chars). No JSON, no quotes, no explanation.",
      });
      const newDesc = result.meta_description || result.excerpt?.substring(0, 158) || metaDescription;
      setMetaDescription(newDesc);
    } catch (error) {
      console.error("Failed to regenerate meta description:", error);
    } finally {
      setRegeneratingMeta(null);
    }
  };

  const handlePullToEditor = () => {
    if (generatedContent) {
      // Insert section images into content at appropriate positions
      let finalContent = generatedContent.content;
      
      if (Object.keys(sectionImages).length > 0) {
        // Parse content and insert images after each section heading
        const sortedSections = Object.entries(sectionImages)
          .sort(([a], [b]) => Number(b) - Number(a)); // Sort descending to insert from end
        
        for (const [sectionIndexStr, image] of sortedSections) {
          const sectionIndex = Number(sectionIndexStr);
          const section = contentSections[sectionIndex];
          
          if (section && section.heading) {
            // Find the H2 for this section and insert image after it
            const h2Regex = new RegExp(`(<h2[^>]*>${escapeRegExp(section.heading)}<\/h2>)`, 'i');
            const imageHtml = `<figure class="my-6"><img src="${image.url}" alt="${image.alt}" class="w-full rounded-lg" loading="lazy" /></figure>`;
            finalContent = finalContent.replace(h2Regex, `$1\n${imageHtml}`);
          }
        }
      }
      
      onContentGenerated({
        ...generatedContent,
        content: finalContent,
        meta_title: metaTitle,
        meta_description: metaDescription,
      });
      
      // Also call the dedicated featured image callback
      if (featuredImageUrl) {
        onFeaturedImageGenerated?.(featuredImageUrl);
      }
    }
  };

  if (loadingModels || loadingPresets) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (activeModels.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center">
          <Bot className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 font-semibold">No AI Models Configured</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Go to AI Settings to add and enable AI models for content generation.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.href = '/admin/ai-settings'}>
            Configure AI Models
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Generation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Content Generator
          </CardTitle>
          <CardDescription>
            Generate blog content using AI based on your topic and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>AI Model</Label>
              <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
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
              <Label>Tone Preset</Label>
              <Select value={selectedPresetId} onValueChange={setSelectedPresetId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select preset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No preset</SelectItem>
                  {presets?.map((preset) => (
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

          <div className="space-y-2">
            <Label>Topic / Prompt *</Label>
            <Textarea
              placeholder="Describe what you want to write about, e.g., 'FDA food recall trends and safety tips for 2024'"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Target Keywords (for SEO)</Label>
            <Input
              placeholder="e.g., food recalls, FDA alerts, food safety"
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple keywords with comma and space (e.g., keyword1, keyword2)
            </p>
          </div>

          <div className="space-y-2">
            <Label>Word Count: {wordCountRange[0]} - {wordCountRange[1]}</Label>
            <Slider
              value={wordCountRange}
              min={300}
              max={5000}
              step={100}
              onValueChange={setWordCountRange}
              className="mt-2"
            />
          </div>

          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                Advanced Options
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <div className="space-y-2">
                <Label>Custom Instructions</Label>
                <Textarea
                  placeholder="Add any specific instructions for the AI writer..."
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  rows={3}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Button
            onClick={handleGenerate}
            disabled={!selectedModelId || !topic.trim() || generateMutation.isPending}
            className="w-full gap-2"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Article
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Content Summary */}
      {generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Generated Content
              </span>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowPreview(true)} className="gap-2">
                  <Eye className="h-4 w-4" />
                  Full Preview
                </Button>
                <Button onClick={handlePullToEditor} className="gap-2">
                  <FileText className="h-4 w-4" />
                  Pull to Editor
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Title</Label>
                <p className="font-medium">{generatedContent.title}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Slug</Label>
                <p className="font-mono text-xs">{generatedContent.slug}</p>
              </div>
            </div>

            {generatedContent.subtitle && (
              <div className="text-sm">
                <Label className="text-muted-foreground">Subtitle</Label>
                <p>{generatedContent.subtitle}</p>
              </div>
            )}

            {/* Meta Title with regeneration */}
            <div className="p-3 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-muted-foreground flex items-center gap-2">
                  Meta Title
                  <span className={`text-xs ${metaTitle.length >= 48 && metaTitle.length <= 58 ? 'text-green-600' : 'text-destructive'}`}>
                    ({metaTitle.length}/48-58 chars)
                  </span>
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={regenerateMetaTitle}
                  disabled={regeneratingMeta === 'title'}
                  className="h-7 gap-1"
                >
                  {regeneratingMeta === 'title' ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3 w-3" />
                  )}
                  Regenerate
                </Button>
              </div>
              <Input
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Enter meta title..."
                className="text-sm"
              />
            </div>

            {/* Meta Description with regeneration */}
            <div className="p-3 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-muted-foreground flex items-center gap-2">
                  Meta Description
                  <span className={`text-xs ${metaDescription.length >= 140 && metaDescription.length <= 158 ? 'text-green-600' : 'text-destructive'}`}>
                    ({metaDescription.length}/140-158 chars)
                  </span>
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={regenerateMetaDescription}
                  disabled={regeneratingMeta === 'description'}
                  className="h-7 gap-1"
                >
                  {regeneratingMeta === 'description' ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3 w-3" />
                  )}
                  Regenerate
                </Button>
              </div>
              <Textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Enter meta description..."
                className="text-sm"
                rows={2}
              />
            </div>

            {generatedContent.excerpt && (
              <div className="text-sm">
                <Label className="text-muted-foreground">Excerpt</Label>
                <p className="text-muted-foreground">{generatedContent.excerpt}</p>
              </div>
            )}

            {/* Suggested Tags */}
            {generatedContent.suggested_tags && generatedContent.suggested_tags.length > 0 && (
              <div className="text-sm">
                <Label className="text-muted-foreground">Suggested Tags (click to add)</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {generatedContent.suggested_tags.map((tag, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => onTagSuggestionClick?.(tag)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Section Regeneration */}
      {generatedContent && contentSections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Regenerate Sections
            </CardTitle>
            <CardDescription>
              Click to regenerate individual sections with fresh content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {contentSections.map((section, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-md border hover:bg-muted/50"
                  >
                    <span className="text-sm">
                      {section.heading || `Section ${idx + 1}: ${section.type}`}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => regenerateSection(idx)}
                      disabled={regeneratingSection === idx}
                      className="gap-1"
                    >
                      {regeneratingSection === idx ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3 w-3" />
                      )}
                      Regenerate
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* AI Image Generation */}
      {generatedContent && (
        <ImageGeneratorPanel
          blogTitle={generatedContent.title}
          blogContent={generatedContent.content}
          contentSections={contentSections}
          onFeaturedImageGenerated={(image) => {
            setFeaturedImageUrl(image.image_url);
          }}
          onSectionImageGenerated={(sectionIndex, image) => {
            setSectionImages(prev => ({
              ...prev,
              [sectionIndex]: { url: image.image_url, alt: image.alt_text }
            }));
          }}
        />
      )}

      {/* Keyword Validation */}
      {keywordValidation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              SEO Keyword Validation
              <Badge variant={keywordValidation.score >= 70 ? "default" : keywordValidation.score >= 50 ? "secondary" : "destructive"}>
                {keywordValidation.score}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <ValidationItem label="In Title" value={keywordValidation.inTitle} />
              <ValidationItem label="In H2" value={keywordValidation.inH2} />
              <ValidationItem label="In H3" value={keywordValidation.inH3} />
              <ValidationItem label="In First ¶" value={keywordValidation.inFirstParagraph} />
              <ValidationItem label="In Content" value={keywordValidation.inContent} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plagiarism Check */}
      {plagiarismResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content Originality
              <Badge variant={
                plagiarismResult.status === 'original' ? "default" :
                plagiarismResult.status === 'warning' ? "secondary" : "destructive"
              }>
                {plagiarismResult.score}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{plagiarismResult.details}</p>
          </CardContent>
        </Card>
      )}

      {/* Internal Links */}
      {generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Internal Link Suggestions
              {loadingLinks && <Loader2 className="h-4 w-4 animate-spin" />}
            </CardTitle>
            <CardDescription>
              Click to insert links into paragraph text (avoids headings and lists)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {internalLinks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No relevant internal links found.</p>
            ) : (
              <div className="space-y-2">
                {internalLinks.map((link) => (
                  <div
                    key={link.id}
                    className={`flex items-center justify-between p-2 rounded-md border ${
                      link.inserted ? 'bg-green-500/10 border-green-500/30' : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{link.title}</p>
                      <p className="text-xs text-muted-foreground truncate">/news/{link.slug}</p>
                    </div>
                    {link.inserted ? (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Inserted
                      </Badge>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => insertInternalLink(link)}
                        className="gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Insert
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Full Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{generatedContent?.title}</DialogTitle>
            {generatedContent?.subtitle && (
              <DialogDescription>{generatedContent.subtitle}</DialogDescription>
            )}
          </DialogHeader>
          <ScrollArea className="h-[60vh] mt-4">
            <div 
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(generatedContent?.content || '') 
              }}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ValidationItem({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
      {value ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 text-destructive" />
      )}
      <span className="text-xs">{label}</span>
    </div>
  );
}
