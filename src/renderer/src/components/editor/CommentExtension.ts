import { Mark, mergeAttributes } from '@tiptap/core';

export interface CommentMarkAttributes {
  commentId: string;
  resolved?: boolean;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    comment: {
      setComment: (attributes: CommentMarkAttributes) => ReturnType;
      unsetComment: (commentId?: string) => ReturnType;
    };
  }
}

export const CommentMark = Mark.create({
  name: 'comment',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      commentId: {
        default: null,
        parseHTML: element => element.getAttribute('data-comment-id'),
        renderHTML: attributes => {
          if (!attributes.commentId) return {};
          return { 'data-comment-id': attributes.commentId };
        },
      },
      resolved: {
        default: false,
        parseHTML: element => element.getAttribute('data-comment-resolved') === 'true',
        renderHTML: attributes => {
          if (!attributes.resolved) return {};
          return { 'data-comment-resolved': 'true' };
        },
      },
    };
  },

  parseHTML() {
    return [
      { tag: 'mark[data-comment-id]' },
      { tag: 'span[data-comment-id]' },
      { class: 'folia-comment-mark' },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const isResolved = HTMLAttributes['data-comment-resolved'] === 'true';
    return [
      'mark',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: `folia-comment-mark ${isResolved ? 'folia-comment-resolved' : ''}`.trim(),
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setComment:
        (attributes: CommentMarkAttributes) =>
        ({ commands }) => {
          return commands.setMark(this.name, attributes);
        },
      unsetComment:
        (commentId?: string) =>
        ({ tr, dispatch, state }) => {
          if (!commentId) {
            if (dispatch) {
              const { from, to } = state.selection;
              tr.removeMark(from, to, this.type);
            }
            return true;
          }

          if (dispatch) {
            state.doc.descendants((node, pos) => {
              if (node.isText && node.marks) {
                node.marks.forEach(mark => {
                  if (mark.type === this.type && mark.attrs.commentId === commentId) {
                    tr.removeMark(pos, pos + node.nodeSize, mark);
                  }
                });
              }
            });
          }
          return true;
        },
    };
  },
});
