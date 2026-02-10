import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { CustomImage } from './extensions/CustomImage';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { Highlight } from '@tiptap/extension-highlight';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Youtube } from '@tiptap/extension-youtube';
import { useState, useCallback, useEffect, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Strikethrough,
  Underline as UnderlineIcon,
  Heading2, 
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  Upload,
  Check,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Palette,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  Crop,
  Table as TableIcon,
  Video,
  Globe,
  Plus,
  Trash2,
  RowsIcon,
  Columns,
  Merge,
  SplitSquareHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMedia, useUploadMedia } from '@/hooks/useMedia';
import { useToast } from '@/hooks/use-toast';
import { ColorPicker } from './ColorPicker';
import { ImageCropDialog } from './ImageCropDialog';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuButton = ({ 
  onClick, 
  isActive = false, 
  disabled = false,
  title,
  children 
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded transition-colors ${
      isActive 
        ? 'bg-foreground text-background' 
        : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {children}
  </button>
);

const IMAGE_SIZES = [
  { label: 'Small (25%)', value: '25' },
  { label: 'Medium (50%)', value: '50' },
  { label: 'Large (75%)', value: '75' },
  { label: 'Full Width', value: '100' },
];

const IMAGE_ALIGNMENTS = [
  { label: 'Left', value: 'left', icon: AlignLeft },
  { label: 'Center', value: 'center', icon: AlignCenter },
  { label: 'Right', value: 'right', icon: AlignRight },
];

export const RichTextEditor = ({ content, onChange, placeholder = 'Write your content here...' }: RichTextEditorProps) => {
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [imageAltText, setImageAltText] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [imageSize, setImageSize] = useState('100');
  const [imageAlignment, setImageAlignment] = useState('center');
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [textColor, setTextColor] = useState('#000000');
  const [highlightColor, setHighlightColor] = useState('#FFFF00');
  
  // Table dialog state
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [includeHeader, setIncludeHeader] = useState(true);
  
  // Video dialog state
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  
  // External image URL dialog state
  const [imageUrlDialogOpen, setImageUrlDialogOpen] = useState(false);
  const [externalImageUrl, setExternalImageUrl] = useState('');
  const [externalImageAlt, setExternalImageAlt] = useState('');
  const [externalImageCaption, setExternalImageCaption] = useState('');
  const [externalImageSize, setExternalImageSize] = useState('100');
  const [externalImageAlignment, setExternalImageAlignment] = useState('center');
  
  // Link dialog state
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkOpenInNewTab, setLinkOpenInNewTab] = useState(false);
  const [linkNofollow, setLinkNofollow] = useState(false);
  const [linkSponsored, setLinkSponsored] = useState(false);
  
  const { data: media, isLoading: mediaLoading } = useMedia();
  const uploadMedia = useUploadMedia();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to clean up empty tags from HTML output
  const cleanHtml = (html: string) => {
    return html
      // Remove empty paragraphs
      .replace(/<p><\/p>/g, '')
      .replace(/<p>\s*<br\s*\/?>\s*<\/p>/g, '')
      // Remove multiple consecutive line breaks
      .replace(/(<br\s*\/?>\s*){3,}/g, '<br><br>')
      // Trim whitespace
      .trim();
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4, 5, 6],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
        // Allow custom rel and target attributes
      }).extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            rel: {
              default: null,
              parseHTML: element => element.getAttribute('rel'),
              renderHTML: attributes => {
                if (!attributes.rel) return {};
                return { rel: attributes.rel };
              },
            },
            target: {
              default: null,
              parseHTML: element => element.getAttribute('target'),
              renderHTML: attributes => {
                if (!attributes.target) return {};
                return { target: attributes.target };
              },
            },
          };
        },
      }),
      CustomImage.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
      // Configure TextAlign to use classes instead of inline styles
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }),
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      Color,
      TextStyle,
      Subscript,
      Superscript,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'editor-table',
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
      Youtube.configure({
        controls: true,
        nocookie: true,
        HTMLAttributes: {
          class: 'editor-youtube',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      // Clean HTML before passing to parent (Bug #7 fix)
      onChange(cleanHtml(editor.getHTML()));
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none min-h-[400px] p-4 focus:outline-none font-body',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const openLinkDialog = useCallback(() => {
    if (!editor) return;
    const attrs = editor.getAttributes('link');
    const previousUrl = attrs.href || '';
    const previousRel = attrs.rel || '';
    const previousTarget = attrs.target || '';
    
    setLinkUrl(previousUrl);
    setLinkOpenInNewTab(previousTarget === '_blank');
    setLinkNofollow(previousRel.includes('nofollow'));
    setLinkSponsored(previousRel.includes('sponsored'));
    setLinkDialogOpen(true);
  }, [editor]);

  const handleSetLink = useCallback(() => {
    if (!editor) return;
    
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      // Build rel attribute
      const relParts: string[] = [];
      if (linkNofollow) relParts.push('nofollow');
      if (linkSponsored) relParts.push('sponsored');
      if (linkOpenInNewTab) relParts.push('noopener', 'noreferrer');
      
      const linkAttrs: { href: string; target?: string; rel?: string } = { href: linkUrl };
      if (linkOpenInNewTab) linkAttrs.target = '_blank';
      if (relParts.length > 0) linkAttrs.rel = relParts.join(' ');
      
      editor.chain().focus().extendMarkRange('link').setLink(linkAttrs).run();
    }
    
    setLinkDialogOpen(false);
    setLinkUrl('');
    setLinkOpenInNewTab(false);
    setLinkNofollow(false);
    setLinkSponsored(false);
  }, [editor, linkUrl, linkOpenInNewTab, linkNofollow, linkSponsored]);

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
      setSelectedImageUrl(result.file_path);
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

  // Bug #3, #4, #5 Fix: Apply size and alignment using inline styles for reliability
  const getImageStyles = (size: string, alignment: string) => {
    const widthPercent = `${size}%`;
    let style = `width: ${widthPercent}; max-width: ${widthPercent};`;
    
    if (alignment === 'left') {
      style += ' float: left; margin-right: 1.5rem; margin-bottom: 1rem;';
    } else if (alignment === 'right') {
      style += ' float: right; margin-left: 1.5rem; margin-bottom: 1rem;';
    } else {
      style += ' display: block; margin-left: auto; margin-right: auto;';
    }
    
    return style;
  };

  const insertSelectedImage = () => {
    if (editor && selectedImageUrl) {
      const alignClass = `image-align-${imageAlignment}`;
      const sizeClass = `image-size-${imageSize}`;
      const inlineStyle = getImageStyles(imageSize, imageAlignment);
      
      editor.chain().focus().setImage({ 
        src: selectedImageUrl,
        alt: imageAltText,
        title: imageAltText,
      }).run();

      // Apply alignment, size, and caption
      editor.chain().focus().updateAttributes('image', {
        class: `editor-image ${alignClass} ${sizeClass}`,
        style: inlineStyle,
        caption: imageCaption || null,
      }).run();
      
      resetImageDialog();
    }
  };

  const resetImageDialog = () => {
    setImagePickerOpen(false);
    setSelectedImageUrl(null);
    setImageAltText('');
    setImageCaption('');
    setImageSize('100');
    setImageAlignment('center');
  };

  const handleImageClick = (url: string) => {
    setSelectedImageUrl(url === selectedImageUrl ? null : url);
  };

  const handleCropClick = () => {
    if (selectedImageUrl) {
      setImageToCrop(selectedImageUrl);
      setCropDialogOpen(true);
    }
  };

  const handleCropComplete = async (croppedImageUrl: string) => {
    try {
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
      
      const result = await uploadMedia.mutateAsync(file);
      setSelectedImageUrl(result.file_path);
      URL.revokeObjectURL(croppedImageUrl);
      
      toast({
        title: 'Crop successful',
        description: 'Cropped image has been saved.'
      });
    } catch (error: any) {
      toast({
        title: 'Crop failed',
        description: error.message || 'Failed to save cropped image.',
        variant: 'destructive'
      });
    }
  };

  const applyTextColor = (color: string) => {
    setTextColor(color);
    editor?.chain().focus().setColor(color).run();
  };

  const applyHighlight = (color: string) => {
    setHighlightColor(color);
    editor?.chain().focus().toggleHighlight({ color }).run();
  };

  // Table functions
  const insertTable = () => {
    if (editor) {
      editor.chain().focus().insertTable({ 
        rows: tableRows, 
        cols: tableCols, 
        withHeaderRow: includeHeader 
      }).run();
      setTableDialogOpen(false);
      setTableRows(3);
      setTableCols(3);
      setIncludeHeader(true);
    }
  };

  // Video functions
  const insertVideo = () => {
    if (!editor || !videoUrl.trim()) return;
    
    const url = videoUrl.trim();
    
    // Check if it's a YouTube URL
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (youtubeMatch) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 360,
      });
    } else {
      // For Vimeo and other embeddable videos, use iframe
      let embedUrl = url;
      
      // Convert Vimeo URL to embed format
      const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
      if (vimeoMatch) {
        embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
      }
      
      editor.commands.setIframe({ src: embedUrl });
    }
    
    setVideoDialogOpen(false);
    setVideoUrl('');
  };

  // External image URL functions - Bug #5 Fix: Apply size and alignment with inline styles
  const insertExternalImage = () => {
    if (!editor || !externalImageUrl.trim()) return;
    
    const alignClass = `image-align-${externalImageAlignment}`;
    const sizeClass = `image-size-${externalImageSize}`;
    const inlineStyle = getImageStyles(externalImageSize, externalImageAlignment);
    
    editor.chain().focus().setImage({
      src: externalImageUrl.trim(),
      alt: externalImageAlt || 'Image',
    }).run();
    
    // Apply alignment, size, and caption
    editor.chain().focus().updateAttributes('image', {
      class: `editor-image ${alignClass} ${sizeClass}`,
      style: inlineStyle,
      caption: externalImageCaption || null,
    }).run();
    
    setImageUrlDialogOpen(false);
    setExternalImageUrl('');
    setExternalImageAlt('');
    setExternalImageCaption('');
    setExternalImageSize('100');
    setExternalImageAlignment('center');
  };

  if (!editor) {
    return null;
  }

  const isInTable = editor.isActive('table');

  return (
    <div className="border border-border rounded-none overflow-hidden">
      {/* Toolbar */}
      {/* Bug #2 Fix: Sticky toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-background sticky top-0 z-50">
        {/* Text formatting */}
        <div className="flex items-center gap-0.5 border-r border-border pr-2 mr-2">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Underline"
          >
            <UnderlineIcon className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </MenuButton>
        </div>

        {/* Superscript/Subscript */}
        <div className="flex items-center gap-0.5 border-r border-border pr-2 mr-2">
          <MenuButton
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            isActive={editor.isActive('superscript')}
            title="Superscript"
          >
            <SuperscriptIcon className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            isActive={editor.isActive('subscript')}
            title="Subscript"
          >
            <SubscriptIcon className="w-4 h-4" />
          </MenuButton>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-0.5 border-r border-border pr-2 mr-2">
          <ColorPicker color={textColor} onChange={applyTextColor}>
            <button
              type="button"
              title="Text Color"
              className="p-2 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="relative">
                <Palette className="w-4 h-4" />
                <div 
                  className="absolute -bottom-0.5 left-0 right-0 h-1 rounded-sm"
                  style={{ backgroundColor: textColor }}
                />
              </div>
            </button>
          </ColorPicker>
          <ColorPicker color={highlightColor} onChange={applyHighlight}>
            <button
              type="button"
              title="Highlight"
              className={`p-2 rounded transition-colors ${
                editor.isActive('highlight') 
                  ? 'bg-foreground text-background' 
                  : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="relative">
                <Highlighter className="w-4 h-4" />
                <div 
                  className="absolute -bottom-0.5 left-0 right-0 h-1 rounded-sm"
                  style={{ backgroundColor: highlightColor }}
                />
              </div>
            </button>
          </ColorPicker>
        </div>

        {/* Headings - H2 to H6 (H1 removed - reserved for page title) */}
        <div className="flex items-center gap-0.5 border-r border-border pr-2 mr-2">
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            isActive={editor.isActive('heading', { level: 4 })}
            title="Heading 4"
          >
            <Heading4 className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
            isActive={editor.isActive('heading', { level: 5 })}
            title="Heading 5"
          >
            <Heading5 className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
            isActive={editor.isActive('heading', { level: 6 })}
            title="Heading 6"
          >
            <Heading6 className="w-4 h-4" />
          </MenuButton>
        </div>

        {/* Text Alignment */}
        <div className="flex items-center gap-0.5 border-r border-border pr-2 mr-2">
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            isActive={editor.isActive({ textAlign: 'justify' })}
            title="Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </MenuButton>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-0.5 border-r border-border pr-2 mr-2">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </MenuButton>
        </div>

        {/* Links, Images, Video, Table */}
        <div className="flex items-center gap-0.5 border-r border-border pr-2 mr-2">
          <MenuButton
            onClick={openLinkDialog}
            isActive={editor.isActive('link')}
            title="Insert Link"
          >
            <LinkIcon className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => setImagePickerOpen(true)} title="Insert Image from Library">
            <ImageIcon className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => setImageUrlDialogOpen(true)} title="Insert Image from URL">
            <Globe className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => setVideoDialogOpen(true)} title="Insert Video">
            <Video className="w-4 h-4" />
          </MenuButton>
          <MenuButton onClick={() => setTableDialogOpen(true)} title="Insert Table" isActive={isInTable}>
            <TableIcon className="w-4 h-4" />
          </MenuButton>
        </div>

        {/* Table Operations (contextual) */}
        {isInTable && (
          <div className="flex items-center gap-0.5 border-r border-border pr-2 mr-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  title="Table Options"
                  className="p-2 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <RowsIcon className="w-4 h-4" />
                  <span className="text-xs">Rows</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => editor.chain().focus().addRowBefore().run()}>
                  <Plus className="w-4 h-4 mr-2" /> Add Row Before
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().addRowAfter().run()}>
                  <Plus className="w-4 h-4 mr-2" /> Add Row After
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => editor.chain().focus().deleteRow().run()}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Row
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  title="Column Options"
                  className="p-2 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <Columns className="w-4 h-4" />
                  <span className="text-xs">Cols</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => editor.chain().focus().addColumnBefore().run()}>
                  <Plus className="w-4 h-4 mr-2" /> Add Column Before
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().addColumnAfter().run()}>
                  <Plus className="w-4 h-4 mr-2" /> Add Column After
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Column
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <MenuButton
              onClick={() => editor.chain().focus().mergeCells().run()}
              title="Merge Cells"
            >
              <Merge className="w-4 h-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().splitCell().run()}
              title="Split Cell"
            >
              <SplitSquareHorizontal className="w-4 h-4" />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().deleteTable().run()}
              title="Delete Table"
            >
              <Trash2 className="w-4 h-4" />
            </MenuButton>
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-0.5 border-r border-border pr-2 mr-2">
          <MenuButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
            <Minus className="w-4 h-4" />
          </MenuButton>
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-0.5">
          <MenuButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </MenuButton>
        </div>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Word Count Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-secondary/20 text-sm text-muted-foreground font-body">
        <div className="flex items-center gap-4">
          <span>
            {editor.storage.characterCount?.words?.() || 
              editor.getText().split(/\s+/).filter(Boolean).length} words
          </span>
          <span>
            {editor.storage.characterCount?.characters?.() || 
              editor.getText().length} characters
          </span>
        </div>
        <span>
          ~{Math.max(1, Math.ceil((editor.getText().split(/\s+/).filter(Boolean).length) / 200))} min read
        </span>
      </div>

      <Dialog open={imagePickerOpen} onOpenChange={(open) => !open && resetImageDialog()}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-bold">Insert Image</DialogTitle>
          </DialogHeader>
          
          <div className="flex items-center justify-between py-2 border-b border-border">
            <p className="text-sm text-muted-foreground font-body">
              Select an image or upload a new one
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

          <div className="flex-1 overflow-y-auto py-4 min-h-0">
            {mediaLoading ? (
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
                      selectedImageUrl === item.file_path
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-transparent hover:border-muted-foreground/30'
                    }`}
                  >
                    <img
                      src={item.file_path}
                      alt={item.alt_text || item.file_name}
                      className="w-full h-full object-cover"
                    />
                    {selectedImageUrl === item.file_path && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-5 h-5 text-primary-foreground" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Image Options */}
          {selectedImageUrl && (
            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCropClick}
                >
                  <Crop className="w-4 h-4 mr-2" />
                  Crop Image
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="altText" className="text-sm">Alt Text (SEO)</Label>
                  <Input
                    id="altText"
                    value={imageAltText}
                    onChange={(e) => setImageAltText(e.target.value)}
                    placeholder="Describe the image..."
                    className="h-9"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageCaption" className="text-sm">Caption (optional)</Label>
                  <Input
                    id="imageCaption"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    placeholder="Image caption..."
                    className="h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Size</Label>
                  <Select value={imageSize} onValueChange={setImageSize}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {IMAGE_SIZES.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Alignment</Label>
                  <div className="flex gap-1">
                    {IMAGE_ALIGNMENTS.map((align) => (
                      <Button
                        key={align.value}
                        type="button"
                        variant={imageAlignment === align.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setImageAlignment(align.value)}
                        className="flex-1"
                      >
                        <align.icon className="w-4 h-4" />
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={resetImageDialog}>
              Cancel
            </Button>
            <Button
              onClick={insertSelectedImage}
              disabled={!selectedImageUrl}
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              Insert Image
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Crop Dialog */}
      {imageToCrop && (
        <ImageCropDialog
          open={cropDialogOpen}
          onOpenChange={setCropDialogOpen}
          imageSrc={imageToCrop}
          onCropComplete={handleCropComplete}
        />
      )}

      {/* Table Dialog */}
      <Dialog open={tableDialogOpen} onOpenChange={setTableDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bold">Insert Table</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tableRows">Rows</Label>
                <Input
                  id="tableRows"
                  type="number"
                  min={1}
                  max={20}
                  value={tableRows}
                  onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tableCols">Columns</Label>
                <Input
                  id="tableCols"
                  type="number"
                  min={1}
                  max={10}
                  value={tableCols}
                  onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="includeHeader"
                checked={includeHeader}
                onChange={(e) => setIncludeHeader(e.target.checked)}
                className="rounded border-border"
              />
              <Label htmlFor="includeHeader" className="cursor-pointer">Include header row</Label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setTableDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={insertTable} className="bg-foreground text-background hover:bg-foreground/90">
              Insert Table
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Dialog */}
      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bold">Insert Video</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
              />
              <p className="text-xs text-muted-foreground">
                Supports YouTube and Vimeo URLs
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setVideoDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={insertVideo} 
              disabled={!videoUrl.trim()}
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              Insert Video
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* External Image URL Dialog - Bug #5 Fix: Added size and alignment controls */}
      <Dialog open={imageUrlDialogOpen} onOpenChange={setImageUrlDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bold">Insert Image from URL</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="externalImageUrl">Image URL</Label>
              <Input
                id="externalImageUrl"
                value={externalImageUrl}
                onChange={(e) => setExternalImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="externalImageAlt">Alt Text (optional)</Label>
              <Input
                id="externalImageAlt"
                value={externalImageAlt}
                onChange={(e) => setExternalImageAlt(e.target.value)}
                placeholder="Describe the image..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="externalImageCaption">Caption (optional)</Label>
              <Input
                id="externalImageCaption"
                value={externalImageCaption}
                onChange={(e) => setExternalImageCaption(e.target.value)}
                placeholder="Image caption..."
              />
            </div>
            
            {/* Size and Alignment Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Size</Label>
                <Select value={externalImageSize} onValueChange={setExternalImageSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {IMAGE_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Alignment</Label>
                <div className="flex gap-1">
                  {IMAGE_ALIGNMENTS.map((align) => (
                    <Button
                      key={align.value}
                      type="button"
                      variant={externalImageAlignment === align.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setExternalImageAlignment(align.value)}
                      className="flex-1"
                    >
                      <align.icon className="w-4 h-4" />
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            {externalImageUrl && (
              <div className="border border-border rounded p-2">
                <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                <img 
                  src={externalImageUrl} 
                  alt="Preview" 
                  className="max-h-40 mx-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setImageUrlDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={insertExternalImage} 
              disabled={!externalImageUrl.trim()}
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              Insert Image
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bold">Insert Link</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="linkUrl">URL</Label>
              <Input
                id="linkUrl"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSetLink();
                  }
                }}
              />
            </div>
            
            {/* Link Options */}
            <div className="space-y-3 border-t border-border pt-4">
              <Label className="text-sm font-medium">Link Options</Label>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="linkOpenInNewTab"
                  checked={linkOpenInNewTab}
                  onChange={(e) => setLinkOpenInNewTab(e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="linkOpenInNewTab" className="text-sm font-normal cursor-pointer">
                  Open in new tab
                </Label>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="linkNofollow"
                  checked={linkNofollow}
                  onChange={(e) => setLinkNofollow(e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="linkNofollow" className="text-sm font-normal cursor-pointer">
                  Nofollow (tells search engines not to follow this link)
                </Label>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="linkSponsored"
                  checked={linkSponsored}
                  onChange={(e) => setLinkSponsored(e.target.checked)}
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor="linkSponsored" className="text-sm font-normal cursor-pointer">
                  Sponsored / Affiliate link
                </Label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {editor?.isActive('link') && (
              <Button 
                variant="destructive"
                onClick={() => {
                  editor?.chain().focus().extendMarkRange('link').unsetLink().run();
                  setLinkDialogOpen(false);
                  setLinkUrl('');
                  setLinkOpenInNewTab(false);
                  setLinkNofollow(false);
                  setLinkSponsored(false);
                }}
              >
                Remove Link
              </Button>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSetLink}
                disabled={!linkUrl.trim()}
                className="bg-foreground text-background hover:bg-foreground/90"
              >
                Apply Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
