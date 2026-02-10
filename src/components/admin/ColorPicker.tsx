import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  children: React.ReactNode;
}

const PRESET_COLORS = [
  '#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB',
  '#DC2626', '#EA580C', '#D97706', '#CA8A04', '#65A30D',
  '#16A34A', '#059669', '#0D9488', '#0891B2', '#0284C7',
  '#2563EB', '#4F46E5', '#7C3AED', '#9333EA', '#C026D3',
  '#DB2777', '#E11D48', '#F43F5E', '#FFFFFF',
];

export const ColorPicker = ({ color, onChange, children }: ColorPickerProps) => {
  const [open, setOpen] = useState(false);

  const handleColorSelect = (selectedColor: string) => {
    onChange(selectedColor);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4 bg-popover" align="start">
        <div className="grid grid-cols-6 gap-2">
          {PRESET_COLORS.map((presetColor) => (
            <button
              key={presetColor}
              type="button"
              onClick={() => handleColorSelect(presetColor)}
              className={`w-9 h-9 rounded-sm border-2 transition-all hover:scale-110 ${
                color === presetColor ? 'ring-2 ring-primary ring-offset-2' : 'border-transparent'
              } ${presetColor === '#FFFFFF' ? 'border-border' : ''}`}
              style={{ backgroundColor: presetColor }}
            />
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">Custom:</span>
            <div className="relative">
              <input
                type="color"
                value={color?.match(/^#[0-9A-Fa-f]{6}$/) ? color : '#000000'}
                onChange={(e) => handleColorSelect(e.target.value.toUpperCase())}
                className="w-10 h-10 cursor-pointer border border-border rounded-sm p-0.5 bg-background"
              />
            </div>
            <input
              type="text"
              value={color || ''}
              onChange={(e) => {
                let value = e.target.value.toUpperCase();
                // Allow # at start
                if (!value.startsWith('#') && value.length > 0) {
                  value = '#' + value;
                }
                // Filter to only valid hex characters
                value = value.replace(/[^#0-9A-F]/g, '');
                // Limit length
                if (value.length > 7) value = value.slice(0, 7);
                onChange(value);
              }}
              placeholder="#000000"
              className="flex-1 px-3 py-2 text-sm border border-border rounded-sm bg-background font-mono uppercase tracking-wider"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
