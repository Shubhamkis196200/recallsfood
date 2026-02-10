import { useState } from 'react';
import { useTags, useCreateTag, usePostTags, useUpdatePostTags } from '@/hooks/useTags';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, X, Tag } from 'lucide-react';

interface TagSelectorProps {
  postId?: string;
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
}

export const TagSelector = ({ postId, selectedTagIds, onChange }: TagSelectorProps) => {
  const { data: allTags, isLoading } = useTags();
  const createTag = useCreateTag();
  const { toast } = useToast();

  const [newTagName, setNewTagName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleToggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTagIds, tagId]);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const newTag = await createTag.mutateAsync({
        name: newTagName.trim(),
        slug: generateSlug(newTagName),
      });
      onChange([...selectedTagIds, newTag.id]);
      setNewTagName('');
      setIsCreating(false);
      toast({ title: 'Tag created and added' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading tags...</p>;
  }

  return (
    <div className="space-y-3">
      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2">
        {selectedTagIds.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tags selected</p>
        ) : (
          selectedTagIds.map((tagId) => {
            const tag = allTags?.find((t) => t.id === tagId);
            return tag ? (
              <Badge
                key={tagId}
                variant="default"
                className="flex items-center gap-1 pr-1"
              >
                {tag.name}
                <button
                  type="button"
                  onClick={() => handleToggleTag(tagId)}
                  className="hover:bg-background/20 rounded p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ) : null;
          })
        )}
      </div>

      {/* Available Tags */}
      <div className="flex flex-wrap gap-2">
        {allTags
          ?.filter((tag) => !selectedTagIds.includes(tag.id))
          .map((tag) => (
            <Badge
              key={tag.id}
              variant="outline"
              className="cursor-pointer hover:bg-secondary"
              onClick={() => handleToggleTag(tag.id)}
            >
              <Plus className="w-3 h-3 mr-1" />
              {tag.name}
            </Badge>
          ))}
      </div>

      {/* Create New Tag */}
      {isCreating ? (
        <div className="flex items-center gap-2">
          <Input
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="New tag name"
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleCreateTag();
              }
            }}
          />
          <Button
            type="button"
            size="sm"
            onClick={handleCreateTag}
            disabled={createTag.isPending}
          >
            Add
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              setIsCreating(false);
              setNewTagName('');
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsCreating(true)}
        >
          <Tag className="w-4 h-4 mr-2" />
          Create New Tag
        </Button>
      )}
    </div>
  );
};
