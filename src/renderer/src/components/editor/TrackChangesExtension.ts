import { Mark, mergeAttributes } from '@tiptap/core';

export const InsertionMark = Mark.create({
  name: 'insertion',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      { tag: 'ins' },
      { tag: 'span[data-revision="insertion"]' },
      { class: 'folia-ins' }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'ins',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: 'folia-ins bg-emerald-100/70 text-emerald-950 underline decoration-emerald-600 decoration-2 rounded-xs px-0.5',
        'data-revision': 'insertion'
      }),
      0
    ];
  },
});

export const DeletionMark = Mark.create({
  name: 'deletion',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      { tag: 'del' },
      { tag: 'span[data-revision="deletion"]' },
      { class: 'folia-del' }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'del',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: 'folia-del bg-rose-100/70 text-rose-900 line-through decoration-rose-600 decoration-2 rounded-xs px-0.5',
        'data-revision': 'deletion'
      }),
      0
    ];
  },
});
