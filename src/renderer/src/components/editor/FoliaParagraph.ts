/**
 * FoliaParagraph.ts
 *
 * Extends TipTap's default Paragraph to support a `paginationContinuation`
 * attribute. When true, the paragraph is a pagination-generated continuation
 * of the preceding paragraph (i.e. the second half after a mid-paragraph
 * page break). The CSS suppresses first-line-indent on these paragraphs.
 */
import { Paragraph } from "@tiptap/extension-paragraph";

export const FoliaParagraph = Paragraph.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      // Marks this paragraph as the continuation of a split paragraph.
      paginationContinuation: {
        default: false,
        parseHTML: (el) => el.getAttribute("data-pagination-continuation") === "true",
        renderHTML: (attrs) =>
          attrs.paginationContinuation
            ? { "data-pagination-continuation": "true" }
            : {},
      },
      // Stores a split ID linking continuation back to its source paragraph.
      paginationSplitId: {
        default: null,
        parseHTML: (el) => el.getAttribute("data-pagination-split-id") || null,
        renderHTML: (attrs) =>
          attrs.paginationSplitId
            ? { "data-pagination-split-id": String(attrs.paginationSplitId) }
            : {},
      },
    };
  },
});
