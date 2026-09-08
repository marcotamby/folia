import { Node, mergeAttributes } from '@tiptap/core';

export const FootnoteNode = Node.create({
  name: 'footnote',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,
  draggable: false,

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-fn'),
        renderHTML: (attributes) => {
          if (!attributes.id) return {};
          return { 'data-fn': attributes.id };
        },
      },
      number: {
        default: 1,
        parseHTML: (element) => {
          const numAttr = element.getAttribute('data-number');
          if (numAttr) return parseInt(numAttr, 10);
          const text = element.textContent || '';
          const match = text.match(/\d+/);
          return match ? parseInt(match[0], 10) : 1;
        },
        renderHTML: (attributes) => ({
          'data-number': attributes.number,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'sup.folia-fn-ref',
      },
      {
        tag: 'sup[data-fn]',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'sup',
      mergeAttributes(HTMLAttributes, {
        class: 'folia-fn-ref',
        contenteditable: 'false',
        title: `Nota a piè di pagina ${node.attrs.number}`,
      }),
      `[${node.attrs.number}]`,
    ];
  },
});
