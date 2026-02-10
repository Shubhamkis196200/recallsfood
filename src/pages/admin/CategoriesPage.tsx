import { useState } from 'react';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, X, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const CategoriesPage = () => {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    display_order: 0,
  });

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '', display_order: 0 });
    setEditingCategory(null);
  };

  const handleOpenDialog = (category?: any) => {
    if (category) {
      setEditingCategory(category.id);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        display_order: category.display_order || 0,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a category name.',
        variant: 'destructive'
      });
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({ id: editingCategory, ...formData });
        toast({ title: 'Category Updated' });
      } else {
        await createCategory.mutateAsync({
          ...formData,
          slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        });
        toast({ title: 'Category Created' });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save category.',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory.mutateAsync(id);
      toast({ title: 'Category Deleted' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete category.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl mb-2">Categories</h1>
          <p className="text-muted-foreground font-body">
            Organize your posts with categories
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-foreground text-background hover:bg-foreground/90"
              onClick={() => handleOpenDialog()}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">
                {editingCategory ? 'Edit Category' : 'New Category'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="name" className="font-body text-sm">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Category name"
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
                  placeholder="category-slug"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description" className="font-body text-sm">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description"
                  rows={3}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="order" className="font-body text-sm">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="bg-foreground text-background hover:bg-foreground/90"
                  disabled={createCategory.isPending || updateCategory.isPending}
                >
                  {editingCategory ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground font-body">
          Loading categories...
        </div>
      ) : categories?.length === 0 ? (
        <div className="text-center py-12 border border-border">
          <p className="text-muted-foreground font-body mb-4">No categories yet</p>
          <Button variant="outline" onClick={() => handleOpenDialog()}>
            Create your first category
          </Button>
        </div>
      ) : (
        <div className="border border-border">
          <table className="w-full">
            <thead className="bg-secondary/30">
              <tr className="text-left">
                <th className="p-4 font-body text-sm font-medium text-muted-foreground">Order</th>
                <th className="p-4 font-body text-sm font-medium text-muted-foreground">Name</th>
                <th className="p-4 font-body text-sm font-medium text-muted-foreground">Slug</th>
                <th className="p-4 font-body text-sm font-medium text-muted-foreground">Description</th>
                <th className="p-4 font-body text-sm font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories?.map((category) => (
                <tr key={category.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="p-4 text-sm text-muted-foreground font-body">
                    {category.display_order}
                  </td>
                  <td className="p-4 font-serif text-lg">{category.name}</td>
                  <td className="p-4 text-sm text-muted-foreground font-body">
                    {category.slug}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground font-body line-clamp-1">
                    {category.description || '—'}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenDialog(category)}
                        className="p-2 hover:bg-secondary rounded transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="p-2 hover:bg-destructive/10 rounded transition-colors text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Category</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{category.name}"? Posts in this category will become uncategorized.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(category.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
