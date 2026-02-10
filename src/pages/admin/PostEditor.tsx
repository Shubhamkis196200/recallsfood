import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCreatePost, useUpdatePost } from '@/hooks/usePosts';
import { useCategories } from '@/hooks/useCategories';
import { useAuthors } from '@/hooks/useAuthors';
import { usePostTags, useUpdatePostTags } from '@/hooks/useTags';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { TagSelector } from '@/components/admin/TagSelector';
import { AIWriterPanel } from '@/components/admin/AIWriterPanel';
import { GeneratedContent } from '@/hooks/useAIGenerate';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { MediaPicker } from '@/components/admin/MediaPicker';
import { ArrowLeft, Save, Eye, Image as ImageIcon, Calendar as CalendarIcon, Clock, X, PenLine, Sparkles } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type PostStatus = Database['public']['Enums']['post_status'];

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: categories } = useCategories();
  const { data: authors } = useAuthors();
  const { data: postTags } = usePostTags(id || '');
  const updatePostTags = useUpdatePostTags();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const { toast } = useToast();
  const isEditing = !!id;

  const [editorMode, setEditorMode] = useState<'manual' | 'ai'>('manual');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const initialFormDataRef = useRef<string>('');

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    slug: '',
    excerpt: '',
    content: '',
    category_id: '',
    author_name_id: '',
    featured_image: '',
    featured_image_alt: '',
    meta_title: '',
    meta_description: '',
    is_featured: false,
    is_trending: false,
    status: 'draft' as PostStatus,
    scheduled_at: null as Date | null,
  });

  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  // Track unsaved changes
  useEffect(() => {
    const currentFormData = JSON.stringify(formData);
    if (initialFormDataRef.current && currentFormData !== initialFormDataRef.current) {
      setHasUnsavedChanges(true);
    }
  }, [formData]);

  // Warn before browser close/refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleNavigateAway = (path: string) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(path);
      setShowExitDialog(true);
    } else {
      navigate(path);
    }
  };

  const handleConfirmExit = () => {
    setShowExitDialog(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  const handleSaveAsDraftAndExit = async () => {
    await handleSubmit('draft');
    setShowExitDialog(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  const handleCancelExit = () => {
    setShowExitDialog(false);
    setPendingNavigation(null);
  };

  const { data: existingPost, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  useEffect(() => {
    if (existingPost) {
      const scheduledDate = existingPost.scheduled_at 
        ? new Date(existingPost.scheduled_at) 
        : null;
      
      if (scheduledDate) {
        setScheduleTime(format(scheduledDate, 'HH:mm'));
      }

      const newFormData = {
        title: existingPost.title || '',
        subtitle: existingPost.subtitle || '',
        slug: existingPost.slug || '',
        excerpt: existingPost.excerpt || '',
        content: existingPost.content || '',
        category_id: existingPost.category_id || '',
        author_name_id: (existingPost as any).author_name_id || '',
        featured_image: existingPost.featured_image || '',
        featured_image_alt: (existingPost as any).featured_image_alt || '',
        meta_title: existingPost.meta_title || '',
        meta_description: existingPost.meta_description || '',
        is_featured: existingPost.is_featured || false,
        is_trending: existingPost.is_trending || false,
        status: existingPost.status || 'draft',
        scheduled_at: scheduledDate,
      };
      setFormData(newFormData);
      initialFormDataRef.current = JSON.stringify(newFormData);
    } else if (!id) {
      // For new posts, set initial state
      initialFormDataRef.current = JSON.stringify(formData);
    }
  }, [existingPost, id]);

  // Load existing tags
  useEffect(() => {
    if (postTags) {
      setSelectedTagIds(postTags.map((t) => t.id));
    }
  }, [postTags]);

  const handleSubmit = async (status: PostStatus, scheduledAt?: Date | null) => {
    if (!formData.title.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a title for your post.',
        variant: 'destructive'
      });
      return;
    }

    // Require alt text for featured images when publishing or scheduling
    if ((status === 'published' || status === 'scheduled') && formData.featured_image && !formData.featured_image_alt?.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please add alt text for the featured image before publishing.',
        variant: 'destructive'
      });
      return;
    }

    if (status === 'scheduled' && !scheduledAt) {
      toast({
        title: 'Validation Error',
        description: 'Please select a date and time for scheduling.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const postData = {
        ...formData,
        status,
        author_id: user?.id,
        category_id: formData.category_id || null,
        author_name_id: formData.author_name_id || null,
        scheduled_at: status === 'scheduled' && scheduledAt ? scheduledAt.toISOString() : null,
      };

      setHasUnsavedChanges(false);
      initialFormDataRef.current = JSON.stringify(formData);

      if (isEditing && id) {
        await updatePost.mutateAsync({ id, ...postData });
        // Update tags
        await updatePostTags.mutateAsync({ postId: id, tagIds: selectedTagIds });
        toast({
          title: 'Post Updated',
          description: status === 'scheduled' 
            ? `Scheduled for ${format(scheduledAt!, 'PPP')} at ${format(scheduledAt!, 'p')}`
            : 'Your changes have been saved.'
        });
      } else {
        const newPost = await createPost.mutateAsync(postData);
        // Update tags for new post
        if (newPost?.id && selectedTagIds.length > 0) {
          await updatePostTags.mutateAsync({ postId: newPost.id, tagIds: selectedTagIds });
        }
        toast({
          title: 'Post Created',
          description: status === 'published' 
            ? 'Your post has been published!' 
            : status === 'scheduled'
            ? `Scheduled for ${format(scheduledAt!, 'PPP')} at ${format(scheduledAt!, 'p')}`
            : 'Your draft has been saved.'
        });
        navigate('/admin/posts');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save post. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleSchedule = () => {
    if (!formData.scheduled_at) {
      toast({
        title: 'Select Date',
        description: 'Please select a date to schedule this post.',
        variant: 'destructive'
      });
      return;
    }

    // Combine date with time
    const [hours, minutes] = scheduleTime.split(':').map(Number);
    const scheduledDate = new Date(formData.scheduled_at);
    scheduledDate.setHours(hours, minutes, 0, 0);

    if (scheduledDate <= new Date()) {
      toast({
        title: 'Invalid Schedule',
        description: 'Scheduled time must be in the future.',
        variant: 'destructive'
      });
      return;
    }

    handleSubmit('scheduled', scheduledDate);
  };

  const clearSchedule = () => {
    setFormData({ ...formData, scheduled_at: null });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground font-body">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => handleNavigateAway('/admin/posts')}
            className="p-2 hover:bg-secondary rounded transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-serif text-3xl">
              {isEditing ? 'Edit Post' : 'New Post'}
            </h1>
            {formData.status === 'scheduled' && formData.scheduled_at && (
              <p className="text-sm text-muted-foreground font-body mt-1">
                Scheduled for {format(formData.scheduled_at, 'PPP p')} (UTC)
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleSubmit('draft')}
            disabled={createPost.isPending || updatePost.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button
            onClick={() => handleSubmit('published')}
            className="bg-foreground text-background hover:bg-foreground/90"
            disabled={createPost.isPending || updatePost.isPending}
          >
            <Eye className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Editor Mode Toggle */}
          <Tabs value={editorMode} onValueChange={(v) => setEditorMode(v as 'manual' | 'ai')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual" className="gap-2">
                <PenLine className="w-4 h-4" />
                Manual Editor
              </TabsTrigger>
              <TabsTrigger value="ai" className="gap-2">
                <Sparkles className="w-4 h-4" />
                AI Writer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="mt-4">
              <div className="border border-border p-6 space-y-4">
                <div>
                  <Label htmlFor="title" className="font-body text-sm">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter post title"
                    className="mt-1 font-serif text-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="subtitle" className="font-body text-sm">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Enter a subtitle"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="slug" className="font-body text-sm">
                    Slug (auto-generated if empty)
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="post-url-slug"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt" className="font-body text-sm">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Brief description for previews and SEO"
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="font-body text-sm mb-2 block">Content</Label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    placeholder="Write your post content here..."
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="mt-4">
              <AIWriterPanel
                onContentGenerated={(content: GeneratedContent) => {
                  setFormData({
                    ...formData,
                    title: content.title,
                    subtitle: content.subtitle,
                    slug: content.slug,
                    excerpt: content.excerpt,
                    content: content.content,
                    meta_title: content.meta_title,
                    meta_description: content.meta_description,
                  });
                  setEditorMode('manual');
                  toast({
                    title: "Content pulled to editor",
                    description: "AI-generated content is now ready for editing.",
                  });
                }}
                onFeaturedImageGenerated={(imageUrl: string) => {
                  setFormData(prev => ({ ...prev, featured_image: imageUrl }));
                  toast({
                    title: "Featured image set",
                    description: "AI-generated featured image has been added to the post.",
                  });
                }}
                onTagSuggestionClick={(suggestedTag: string) => {
                  // Create a slug from the tag name
                  const tagSlug = suggestedTag.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                  // Check if we already have this tag name in selected tags
                  // For now, we'll just show a toast - actual tag creation/selection would need tag lookup
                  toast({
                    title: "Tag suggested",
                    description: `"${suggestedTag}" - Go to Tags section to add if not exists.`,
                  });
                }}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category & Status */}
          <div className="border border-border p-6 space-y-4">
            <h3 className="font-serif text-lg border-b border-border pb-2">Settings</h3>
            
            <div>
              <Label className="font-body text-sm">Category</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="font-body text-sm">Author</Label>
              <Select
                value={formData.author_name_id}
                onValueChange={(value) => setFormData({ ...formData, author_name_id: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select an author" />
                </SelectTrigger>
                <SelectContent>
                  {authors?.map((author) => (
                    <SelectItem key={author.id} value={author.id}>
                      {author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="featured" className="font-body text-sm">Featured Post</Label>
              <Switch
                id="featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="trending" className="font-body text-sm">Trending</Label>
              <Switch
                id="trending"
                checked={formData.is_trending}
                onCheckedChange={(checked) => setFormData({ ...formData, is_trending: checked })}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="border border-border p-6 space-y-4">
            <h3 className="font-serif text-lg border-b border-border pb-2">Tags</h3>
            <TagSelector
              postId={id}
              selectedTagIds={selectedTagIds}
              onChange={setSelectedTagIds}
            />
          </div>

          {/* Schedule */}
          <div className="border border-border p-6 space-y-4">
            <h3 className="font-serif text-lg border-b border-border pb-2">Schedule</h3>
            
            {formData.scheduled_at ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded">
                  <div>
                    <p className="font-body text-sm font-medium">
                      {format(formData.scheduled_at, 'PPP p')} (UTC)
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSchedule}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div>
                  <Label className="font-body text-sm">Time (UTC)</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <Input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSchedule}
                  className="w-full"
                  variant="outline"
                  disabled={createPost.isPending || updatePost.isPending}
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {formData.status === 'scheduled' ? 'Update Schedule' : 'Schedule Post'}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.scheduled_at && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Pick a date to schedule
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.scheduled_at || undefined}
                      onSelect={(date) => setFormData({ ...formData, scheduled_at: date || null })}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground font-body">
                  Schedule this post to be published automatically at a future date and time.
                  <span className="block mt-1 font-medium">All times are in UTC.</span>
                </p>
              </div>
            )}
          </div>

          {/* Featured Image */}
          <div className="border border-border p-6 space-y-4">
            <h3 className="font-serif text-lg border-b border-border pb-2">Featured Image</h3>
            {formData.featured_image ? (
              <div className="space-y-3">
                <div className="aspect-video bg-secondary/30 overflow-hidden rounded">
                  <img 
                    src={formData.featured_image} 
                    alt={formData.featured_image_alt || "Preview"} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="featured_image_alt" className="font-body text-sm">
                    Alt Text <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="featured_image_alt"
                    value={formData.featured_image_alt}
                    onChange={(e) => setFormData({ ...formData, featured_image_alt: e.target.value })}
                    placeholder="Describe this image for accessibility and SEO"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Required for SEO and accessibility
                  </p>
                </div>
                <div className="flex gap-2">
                  <MediaPicker
                    value={formData.featured_image}
                    onChange={(url) => setFormData({ ...formData, featured_image: url })}
                    trigger={
                      <Button variant="outline" size="sm" type="button" className="flex-1">
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Change
                      </Button>
                    }
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => setFormData({ ...formData, featured_image: '', featured_image_alt: '' })}
                    className="text-destructive hover:text-destructive"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <MediaPicker
                value={formData.featured_image}
                onChange={(url) => setFormData({ ...formData, featured_image: url })}
                trigger={
                  <button
                    type="button"
                    className="w-full aspect-video border-2 border-dashed border-border rounded flex flex-col items-center justify-center gap-2 hover:border-muted-foreground/50 transition-colors"
                  >
                    <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                    <span className="text-sm text-muted-foreground font-body">
                      Click to select image
                    </span>
                  </button>
                }
              />
            )}
          </div>

          {/* SEO */}
          <div className="border border-border p-6 space-y-4">
            <h3 className="font-serif text-lg border-b border-border pb-2">SEO</h3>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="meta_title" className="font-body text-sm">Meta Title</Label>
                <span className={cn(
                  "text-xs",
                  formData.meta_title.length === 0 ? "text-muted-foreground" :
                  formData.meta_title.length >= 50 && formData.meta_title.length <= 60 ? "text-green-600" :
                  formData.meta_title.length > 60 ? "text-destructive" : "text-amber-600"
                )}>
                  {formData.meta_title.length}/60
                </span>
              </div>
              <Input
                id="meta_title"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                placeholder="SEO title (50-60 characters recommended)"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">Recommended: 50-60 characters</p>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="meta_description" className="font-body text-sm">Meta Description</Label>
                <span className={cn(
                  "text-xs",
                  formData.meta_description.length === 0 ? "text-muted-foreground" :
                  formData.meta_description.length >= 150 && formData.meta_description.length <= 160 ? "text-green-600" :
                  formData.meta_description.length > 160 ? "text-destructive" : "text-amber-600"
                )}>
                  {formData.meta_description.length}/160
                </span>
              </div>
              <Textarea
                id="meta_description"
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                placeholder="SEO description (150-160 characters recommended)"
                rows={3}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">Recommended: 150-160 characters</p>
            </div>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You have unsaved changes</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to save your changes before leaving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelExit}>Cancel</AlertDialogCancel>
            <Button variant="outline" onClick={handleConfirmExit}>
              Exit without saving
            </Button>
            <AlertDialogAction onClick={handleSaveAsDraftAndExit}>
              Save as Draft
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PostEditor;
