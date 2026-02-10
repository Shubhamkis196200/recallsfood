import { useState, useRef, useCallback } from 'react';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ImageCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string;
  onCropComplete: (croppedImageUrl: string) => void;
}

const ASPECT_RATIOS = [
  { label: 'Free', value: undefined },
  { label: '16:9', value: 16 / 9 },
  { label: '4:3', value: 4 / 3 },
  { label: '1:1', value: 1 },
  { label: '3:4', value: 3 / 4 },
  { label: '9:16', value: 9 / 16 },
];

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export const ImageCropDialog = ({
  open,
  onOpenChange,
  imageSrc,
  onCropComplete,
}: ImageCropDialogProps) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      let initialCrop: Crop;
      
      if (aspect) {
        initialCrop = centerAspectCrop(width, height, aspect);
      } else {
        initialCrop = {
          unit: '%',
          x: 5,
          y: 5,
          width: 90,
          height: 90,
        };
      }
      setCrop(initialCrop);
      
      // Bug #3 Fix: Initialize completedCrop so Apply Crop works immediately
      const pixelCrop: PixelCrop = {
        unit: 'px',
        x: (initialCrop.x! * width) / 100,
        y: (initialCrop.y! * height) / 100,
        width: (initialCrop.width! * width) / 100,
        height: (initialCrop.height! * height) / 100,
      };
      setCompletedCrop(pixelCrop);
    },
    [aspect]
  );

  const handleAspectChange = (newAspect: number | undefined) => {
    setAspect(newAspect);
    if (imgRef.current && newAspect) {
      const { width, height } = imgRef.current;
      setCrop(centerAspectCrop(width, height, newAspect));
    }
  };

  const getCroppedImg = useCallback(async () => {
    if (!imgRef.current || !completedCrop) return;

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise<string>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve(url);
          }
        },
        'image/jpeg',
        0.95
      );
    });
  }, [completedCrop]);

  const handleCropConfirm = async () => {
    const croppedUrl = await getCroppedImg();
    if (croppedUrl) {
      onCropComplete(croppedUrl);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-bold">Crop Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Aspect Ratio Selection */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Aspect Ratio:</span>
            <div className="flex gap-1">
              {ASPECT_RATIOS.map((ratio) => (
                <Button
                  key={ratio.label}
                  type="button"
                  variant={aspect === ratio.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleAspectChange(ratio.value)}
                  className="text-xs"
                >
                  {ratio.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Crop Area */}
          <div className="flex justify-center bg-secondary/30 rounded p-4 max-h-[60vh] overflow-auto">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              className="max-w-full"
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop preview"
                onLoad={onImageLoad}
                crossOrigin="anonymous"
                className="max-w-full max-h-[50vh] object-contain"
              />
            </ReactCrop>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleCropConfirm} disabled={!completedCrop}>
              Apply Crop
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
