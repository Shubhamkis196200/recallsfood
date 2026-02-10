import { useState, useRef } from 'react';
import { useMedia, useUploadMedia, MediaItem } from '@/hooks/useMedia';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Upload, Image as ImageIcon, Check } from 'lucide-react';

interface MediaPickerProps {
  value?: string;
  onChange: (url: string) => void;
  trigger?: React.ReactNode;
}

export const MediaPicker = ({ value, onChange, trigger }: MediaPickerProps) => {
  const [open, setOpen] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const { data: media, isLoading } = useMedia();
  const uploadMedia = useUploadMedia();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const result = await uploadMedia.mutateAsync(file);
      toast({
        title: 'Upload successful',
        description: 'Image has been uploaded.'
      });
      setSelectedUrl(result.file_path);
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload file.',
        variant: 'destructive'
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelect = () => {
    if (selectedUrl) {
      onChange(selectedUrl);
      setOpen(false);
      setSelectedUrl(null);
    }
  };

  const handleImageClick = (url: string) => {
    setSelectedUrl(url === selectedUrl ? null : url);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" type="button">
            <ImageIcon className="w-4 h-4 mr-2" />
            Select Image
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-bold">Select Image</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center justify-between py-2 border-b border-border">
          <p className="text-sm text-muted-foreground font-body">
            Click an image to select it, or upload a new one
          </p>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMedia.isPending}
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploadMedia.isPending ? 'Uploading...' : 'Upload New'}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground font-body">Loading media...</p>
            </div>
          ) : !media?.length ? (
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
              <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-bold text-lg mb-2">No images yet</h3>
              <p className="text-muted-foreground font-body text-sm mb-4">
                Upload an image to get started
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {media.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleImageClick(item.file_path)}
                  className={`relative aspect-square rounded overflow-hidden border-2 transition-all ${
                    selectedUrl === item.file_path
                      ? 'border-primary ring-2 ring-primary/20'
                      : item.file_path === value
                      ? 'border-muted-foreground/50'
                      : 'border-transparent hover:border-muted-foreground/30'
                  }`}
                >
                  <img
                    src={item.file_path}
                    alt={item.alt_text || item.file_name}
                    className="w-full h-full object-cover"
                  />
                  {selectedUrl === item.file_path && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-5 h-5 text-primary-foreground" />
                      </div>
                    </div>
                  )}
                  {item.file_path === value && selectedUrl !== item.file_path && (
                    <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-foreground/80 text-background text-xs rounded">
                      Current
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSelect}
            disabled={!selectedUrl}
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            Select Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
