import { useState, useRef } from 'react';
import { useMedia, useUploadMedia, useDeleteMedia, useBulkDeleteMedia, useUpdateMedia, MediaItem } from '@/hooks/useMedia';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Upload, Trash2, Image as ImageIcon, Copy, Check, Edit2, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const MediaLibrary = () => {
  const { data: media, isLoading } = useMedia();
  const uploadMedia = useUploadMedia();
  const deleteMedia = useDeleteMedia();
  const bulkDeleteMedia = useBulkDeleteMedia();
  const updateMedia = useUpdateMedia();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingAlt, setEditingAlt] = useState('');
  const [editingCaption, setEditingCaption] = useState('');
  
  // Bulk selection state
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: `${file.name} is not an image file.`,
          variant: 'destructive'
        });
        continue;
      }

      try {
        await uploadMedia.mutateAsync(file);
        toast({
          title: 'Upload successful',
          description: `${file.name} has been uploaded.`
        });
      } catch (error: any) {
        toast({
          title: 'Upload failed',
          description: error.message || 'Failed to upload file.',
          variant: 'destructive'
        });
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteMedia.mutateAsync(deleteTarget);
      toast({
        title: 'Deleted',
        description: 'Media file has been deleted.'
      });
      setDeleteTarget(null);
      if (selectedMedia?.id === deleteTarget.id) {
        setSelectedMedia(null);
      }
    } catch (error: any) {
      toast({
        title: 'Delete failed',
        description: error.message || 'Failed to delete file.',
        variant: 'destructive'
      });
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpdateDetails = async () => {
    if (!selectedMedia) return;

    try {
      await updateMedia.mutateAsync({
        id: selectedMedia.id,
        alt_text: editingAlt,
        caption: editingCaption
      });
      toast({
        title: 'Updated',
        description: 'Media details have been saved.'
      });
      setSelectedMedia(null);
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const openDetails = (item: MediaItem) => {
    setSelectedMedia(item);
    setEditingAlt(item.alt_text || '');
    setEditingCaption(item.caption || '');
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Bulk selection handlers
  const toggleBulkMode = () => {
    setBulkSelectMode(!bulkSelectMode);
    setSelectedIds(new Set());
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    if (media) {
      setSelectedIds(new Set(media.map(item => item.id)));
    }
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleBulkDelete = async () => {
    if (!media || selectedIds.size === 0) return;

    const itemsToDelete = media.filter(item => selectedIds.has(item.id));
    
    try {
      await bulkDeleteMedia.mutateAsync(itemsToDelete);
      toast({
        title: 'Deleted',
        description: `${selectedIds.size} images have been deleted.`
      });
      setSelectedIds(new Set());
      setShowBulkDeleteDialog(false);
      setBulkSelectMode(false);
    } catch (error: any) {
      toast({
        title: 'Delete failed',
        description: error.message || 'Failed to delete files.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">Media Library</h1>
          <p className="text-muted-foreground font-body mt-1">
            Upload and manage images for your posts
          </p>
        </div>
        <div className="flex items-center gap-2">
          {media && media.length > 0 && (
            <Button
              variant={bulkSelectMode ? "secondary" : "outline"}
              onClick={toggleBulkMode}
            >
              {bulkSelectMode ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </>
              ) : (
                'Select Multiple'
              )}
            </Button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMedia.isPending}
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploadMedia.isPending ? 'Uploading...' : 'Upload Images'}
          </Button>
        </div>
      </div>

      {/* Bulk selection toolbar */}
      {bulkSelectMode && media && media.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border">
          <div className="flex items-center gap-4">
            <span className="text-sm font-body">
              {selectedIds.size} of {media.length} selected
            </span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={selectAll}>
                Select All
              </Button>
              <Button variant="ghost" size="sm" onClick={deselectAll} disabled={selectedIds.size === 0}>
                Deselect All
              </Button>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowBulkDeleteDialog(true)}
            disabled={selectedIds.size === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected ({selectedIds.size})
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground font-body">Loading media...</p>
        </div>
      ) : !media?.length ? (
        <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
          <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="font-serif text-lg mb-2">No images yet</h3>
          <p className="text-muted-foreground font-body text-sm mb-4">
            Upload images to use in your posts
          </p>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload your first image
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className={`group relative border rounded overflow-hidden bg-secondary/20 transition-all ${
                bulkSelectMode && selectedIds.has(item.id) 
                  ? 'border-primary ring-2 ring-primary/30' 
                  : 'border-border'
              }`}
              onClick={bulkSelectMode ? () => toggleSelection(item.id) : undefined}
            >
              {/* Checkbox for bulk selection */}
              {bulkSelectMode && (
                <div className="absolute top-2 left-2 z-10">
                  <Checkbox
                    checked={selectedIds.has(item.id)}
                    onCheckedChange={() => toggleSelection(item.id)}
                    className="bg-background border-2"
                  />
                </div>
              )}
              <div className={`aspect-square ${bulkSelectMode ? 'cursor-pointer' : ''}`}>
                <img
                  src={item.file_path}
                  alt={item.alt_text || item.file_name}
                  className="w-full h-full object-cover"
                />
              </div>
              {!bulkSelectMode && (
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/60 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleCopyUrl(item.file_path, item.id)}
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openDetails(item)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteTarget(item)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <div className="p-2 border-t border-border">
                <p className="text-xs font-body truncate">{item.file_name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif">Media Details</DialogTitle>
          </DialogHeader>
          {selectedMedia && (
            <div className="grid grid-cols-2 gap-6">
              <div className="aspect-square bg-secondary/30 rounded overflow-hidden">
                <img
                  src={selectedMedia.file_path}
                  alt={selectedMedia.alt_text || selectedMedia.file_name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-body text-muted-foreground">File name</p>
                  <p className="font-body">{selectedMedia.file_name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-body text-muted-foreground">Size</p>
                    <p className="font-body">{formatFileSize(selectedMedia.file_size)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-body text-muted-foreground">Dimensions</p>
                    <p className="font-body">
                      {selectedMedia.width && selectedMedia.height
                        ? `${selectedMedia.width} × ${selectedMedia.height}`
                        : 'Unknown'}
                    </p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="alt_text" className="font-body text-sm">Alt Text</Label>
                  <Input
                    id="alt_text"
                    value={editingAlt}
                    onChange={(e) => setEditingAlt(e.target.value)}
                    placeholder="Describe the image"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="caption" className="font-body text-sm">Caption</Label>
                  <Input
                    id="caption"
                    value={editingCaption}
                    onChange={(e) => setEditingCaption(e.target.value)}
                    placeholder="Optional caption"
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleUpdateDetails}
                    disabled={updateMedia.isPending}
                    className="bg-foreground text-background hover:bg-foreground/90"
                  >
                    Save Details
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleCopyUrl(selectedMedia.file_path, selectedMedia.id)}
                  >
                    {copiedId === selectedMedia.id ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy URL
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif">Delete Image?</AlertDialogTitle>
            <AlertDialogDescription className="font-body">
              This will permanently delete "{deleteTarget?.file_name}". This action cannot be undone.
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

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif">Delete {selectedIds.size} Images?</AlertDialogTitle>
            <AlertDialogDescription className="font-body">
              This will permanently delete {selectedIds.size} selected images. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={bulkDeleteMedia.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {bulkDeleteMedia.isPending ? 'Deleting...' : `Delete ${selectedIds.size} Images`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MediaLibrary;
