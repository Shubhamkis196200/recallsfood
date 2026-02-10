import Image from '@tiptap/extension-image';
import { mergeAttributes } from '@tiptap/core';

// Custom Image extension that supports class, style, and caption attributes
// Images with captions are wrapped in <figure> with <figcaption>
export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: 'editor-image',
        parseHTML: element => element.getAttribute('class'),
        renderHTML: attributes => {
          if (!attributes.class) {
            return {};
          }
          return { class: attributes.class };
        },
      },
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => {
          if (!attributes.style) {
            return {};
          }
          return { style: attributes.style };
        },
      },
      caption: {
        default: null,
        parseHTML: element => {
          // Check if image is inside a figure, get caption from figcaption
          const figure = element.closest('figure');
          if (figure) {
            const figcaption = figure.querySelector('figcaption');
            return figcaption?.textContent || null;
          }
          return element.getAttribute('data-caption');
        },
        renderHTML: attributes => {
          if (!attributes.caption) {
            return {};
          }
          return { 'data-caption': attributes.caption };
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const { caption, ...imgAttrs } = HTMLAttributes;
    
    if (caption) {
      // Wrap in figure with figcaption when caption exists
      return [
        'figure',
        { class: 'image-figure', style: imgAttrs.style },
        ['img', mergeAttributes(this.options.HTMLAttributes, { ...imgAttrs, style: undefined })],
        ['figcaption', { class: 'image-caption' }, caption],
      ];
    }
    
    return ['img', mergeAttributes(this.options.HTMLAttributes, imgAttrs)];
  },

  parseHTML() {
    return [
      {
        tag: 'figure',
        getAttrs: node => {
          const img = (node as HTMLElement).querySelector('img');
          if (!img) return false;
          return {};
        },
        contentElement: 'img',
      },
      {
        tag: 'img[src]',
      },
    ];
  },
});