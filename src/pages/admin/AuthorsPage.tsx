import { useState } from 'react';
import { useAuthors, useCreateAuthor, useUpdateAuthor, useDeleteAuthor, Author } from '@/hooks/useAuthors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, User } from 'lucide-react';

const AuthorsPage = () => {
  const { data: authors, isLoading } = useAuthors();
  const createAuthor = useCreateAuthor();
  const updateAuthor = useUpdateAuthor();
  const deleteAuthor = useDeleteAuthor();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [deletingAuthor, setDeletingAuthor] = useState<Author | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar_url: '',
    email: '',
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      bio: '',
      avatar_url: '',
      email: '',
      is_active: true,
    });
    setEditingAuthor(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (author: Author) => {
    setEditingAuthor(author);
    setFormData({
      name: author.name,
      bio: author.bio || '',
      avatar_url: author.avatar_url || '',
      email: author.email || '',
      is_active: author.is_active,
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (author: Author) => {
    setDeletingAuthor(author);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Author name is required.',
        variant: 'destructive'
      });
      return;
    }

    try {
      if (editingAuthor) {
        await updateAuthor.mutateAsync({
          id: editingAuthor.id,
          name: formData.name,
          bio: formData.bio || null,
          avatar_url: formData.avatar_url || null,
          email: formData.email || null,
          is_active: formData.is_active,
        });
        toast({ title: 'Author Updated', description: 'Author has been updated successfully.' });
      } else {
        await createAuthor.mutateAsync({
          name: formData.name,
          bio: formData.bio || undefined,
          avatar_url: formData.avatar_url || undefined,
          email: formData.email || undefined,
          is_active: formData.is_active,
        });
        toast({ title: 'Author Created', description: 'New author has been created successfully.' });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save author.',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingAuthor) return;
    
    try {
      await deleteAuthor.mutateAsync(deletingAuthor.id);
      toast({ title: 'Author Deleted', description: 'Author has been deleted successfully.' });
      setIsDeleteDialogOpen(false);
      setDeletingAuthor(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete author.',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground font-body">Loading authors...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl">Authors</h1>
          <p className="text-muted-foreground font-body mt-1">
            Manage authors and editorial team members
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Add Author
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {authors?.map((author) => (
          <div
            key={author.id}
            className="border border-border p-6 space-y-4 hover:border-foreground/30 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {author.avatar_url ? (
                  <img
                    src={author.avatar_url}
                    alt={author.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                    <User className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg">{author.name}</h3>
                  {!author.is_active && (
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            </div>

            {author.bio && (
              <p className="text-sm text-muted-foreground font-body line-clamp-2">
                {author.bio}
              </p>
            )}

            {author.email && (
              <p className="text-xs text-muted-foreground font-body">
                {author.email}
              </p>
            )}

            <div className="flex gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditDialog(author)}
                className="flex-1"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openDeleteDialog(author)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bold">
              {editingAuthor ? 'Edit Author' : 'Add Author'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name" className="font-body text-sm">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Author name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="bio" className="font-body text-sm">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Short biography"
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="avatar_url" className="font-body text-sm">Avatar URL</Label>
              <Input
                id="avatar_url"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                placeholder="https://..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email" className="font-body text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="author@example.com"
                className="mt-1"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_active" className="font-body text-sm">Active</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={createAuthor.isPending || updateAuthor.isPending}
            >
              {editingAuthor ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Author</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingAuthor?.name}"? This action cannot be undone.
              Authors with assigned posts cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AuthorsPage;