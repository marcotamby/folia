import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { PageFormat, PageMargins, CustomPageMargins, PageNumberFormat, PageNumberPosition, Footnote } from '../../types';
// @ts-ignore
import itHyphen from 'hyphen/it';

export interface PaginationOptions {
  pageFormat: PageFormat;
  pageMargins: PageMargins;
  customMargins?: CustomPageMargins;
  showPageNumbers: boolean;
  pageNumberPosition: PageNumberPosition;
  pageNumberFormat: PageNumberFormat;
  documentTitle: string;
  footnotes?: Footnote[];
  onUpdateFootnote?: (id: string, content: string) => void;
  onDeleteFootnote?: (id: string) => void;
  onJumpToFootnoteInText?: (id: string) => void;
  onPageCountChange?: (count: number) => void;
  onLastPagePaddingChange?: (padding: number) => void;
  onLastPageFootnotesChange?: (footnotes: Footnote[]) => void;
}

export interface PaginationExtensionOptions {
  getOptions: () => PaginationOptions;
}

export const paginationPluginKey = new PluginKey('folia-pagination');

// Reference usable content heights in pixels for each format
export interface PageMetrics {
  sheetHeight: number;
  topMarginPx: number;
  bottomMarginPx: number;
  leftMarginPx: number;
  rightMarginPx: number;
  headerHeightPx: number;
  footerHeightPx: number;
  firstPageLimit: number;
  subsequentPageLimit: number;
}

export function getPageMetrics(
  format: PageFormat,
  margins: PageMargins,
  customMargins?: CustomPageMargins
): PageMetrics {
  const pxPerCm = 37.8;

  // 1. Physical sheet height (standard sizes at 96 DPI)
  let sheetHeight = 1124; // A4 (29.7cm * 37.8 = 1122.66 -> 1124px)
  if (format === 'novel') {
    sheetHeight = 880; // Novel/Book format (~21cm)
  } else if (format === 'cartella') {
    sheetHeight = 1124; // Cartella editoriale su foglio A4
  } else if (format === 'letter') {
    sheetHeight = 1056; // US Letter (11 in * 96 = 1056px)
  } else if (format === 'continuous') {
    sheetHeight = Infinity;
  }

  // 2. Margins in cm
  let topCm = 2.5;
  let bottomCm = 2.5;
  let leftCm = 2.5;
  let rightCm = 2.5;

  if (margins === 'narrow') {
    topCm = 1.5;
    bottomCm = 1.5;
    leftCm = 1.5;
    rightCm = 1.5;
  } else if (margins === 'wide') {
    topCm = 3.2;
    bottomCm = 3.2;
    leftCm = 3.2;
    rightCm = 3.2;
  } else if (margins === 'custom' && customMargins) {
    topCm = customMargins.top ?? 2.5;
    bottomCm = customMargins.bottom ?? 2.5;
    leftCm = customMargins.left ?? 2.5;
    rightCm = customMargins.right ?? 2.5;
  }

  const topMarginPx = Math.round(topCm * pxPerCm);
  const bottomMarginPx = Math.round(bottomCm * pxPerCm);
  const leftMarginPx = Math.round(leftCm * pxPerCm);
  const rightMarginPx = Math.round(rightCm * pxPerCm);

  // 3. Header & Footer reserved heights
  const headerHeightPx = 36;
  const footerHeightPx = 32;

  // Document title header block on Page 1: ~74px
  const titleBlockHeightPx = 74;

  if (sheetHeight === Infinity) {
    return {
      sheetHeight: Infinity,
      topMarginPx: 32,
      bottomMarginPx: 32,
      leftMarginPx: 32,
      rightMarginPx: 32,
      headerHeightPx: 0,
      footerHeightPx: 0,
      firstPageLimit: Infinity,
      subsequentPageLimit: Infinity,
    };
  }

  // Usable content height for subsequent pages: margins are strictly from sheet edge to text body!
  // Header and page numbers live inside the margin areas, without subtracting from text capacity
  const subsequentPageLimit = Math.max(
    300,
    sheetHeight - topMarginPx - bottomMarginPx
  );

  // Usable content height for first page (title block instead of running header)
  const firstPageLimit = Math.max(
    250,
    sheetHeight - topMarginPx - bottomMarginPx - titleBlockHeightPx
  );

  return {
    sheetHeight,
    topMarginPx,
    bottomMarginPx,
    leftMarginPx,
    rightMarginPx,
    headerHeightPx: 0,
    footerHeightPx: 0,
    firstPageLimit,
    subsequentPageLimit,
  };
}

function formatPageNum(pageNum: number, totalPages: number, format: PageNumberFormat): string {
  switch (format) {
    case 'page_x_of_y':
      return `Pagina ${pageNum} di ${totalPages}`;
    case 'dashes':
      return `— ${pageNum} —`;
    case 'simple':
    default:
      return `${pageNum}`;
  }
}

/**
 * Finds document positions within a top-level block where an inline page break widget
 * should be inserted to visually divide the paragraph across pages.
 */
/**
 * Finds all document positions within a top-level block where an inline page break widget
 * should be inserted so that text smoothly flows onto subsequent physical sheets.
 */
function isWordChar(char: string | undefined): boolean {
  if (!char) return false;
  return /[a-zA-Z0-9\u00C0-\u024F]/.test(char);
}

export interface InlineSplitPoint {
  pos: number;
  hasHyphen: boolean;
}

function findInlineSplits(
  domEl: HTMLElement,
  startRemainingPx: number,
  pageLimitPx: number,
  editorView: EditorView
): InlineSplitPoint[] {
  // Do not split tables or table wrappers inline across pages
  if (
    domEl.tagName === 'TABLE' ||
    domEl.classList.contains('tableWrapper') ||
    domEl.querySelector('table')
  ) {
    return [];
  }

  // If less than ~36px (approx 1 line) remains, don't split here — let the whole block move
  if (startRemainingPx < 36) return [];

  // Temporarily hide any existing inline page-break widgets in domEl so the browser
  // renders the text in its pure, natural continuous flow for measurement
  const existingBreakWidgets = Array.from(
    domEl.querySelectorAll('.folia-virtual-page-break, .folia-page-break-hyphen')
  ) as HTMLElement[];

  existingBreakWidgets.forEach((w) => {
    w.style.display = 'none';
  });

  try {
    // 1. Collect all valid text nodes belonging to the content of this block
    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(domEl, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (
          node.parentElement?.closest('.folia-virtual-page-break') ||
          node.parentElement?.closest('.folia-page-break-hyphen')
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    let tNode: Text | null;
    while ((tNode = walker.nextNode() as Text | null)) {
      if (tNode.textContent && tNode.textContent.length > 0) {
        textNodes.push(tNode);
      }
    }

    if (textNodes.length === 0) return [];

    const elRect = domEl.getBoundingClientRect();
    const blockTrueTop = elRect.top;
    let currentTargetOffset = startRemainingPx;
    const splits: InlineSplitPoint[] = [];

    // 2. Walk through the text nodes to find where the text crosses each page boundary
    for (let nodeIdx = 0; nodeIdx < textNodes.length; nodeIdx++) {
      const textNode = textNodes[nodeIdx];
      const prevTextNode = nodeIdx > 0 ? textNodes[nodeIdx - 1] : null;
      const textLen = textNode.textContent?.length || 0;
      if (textLen === 0) continue;

      while (true) {
        const endRange = document.createRange();
        endRange.setStart(textNode, textLen - 1);
        endRange.setEnd(textNode, textLen);
        const endRect = endRange.getBoundingClientRect();
        const nodeOffsetFromTop = endRect.bottom - blockTrueTop;

        if (nodeOffsetFromTop <= currentTargetOffset) {
          break;
        }

        const startRange = document.createRange();
        startRange.setStart(textNode, 0);
        startRange.setEnd(textNode, Math.min(1, textLen));
        const startRect = startRange.getBoundingClientRect();
        const nodeStartOffset = startRect.top - blockTrueTop;

        let splitOffset = 0;
        let needsHyphen = false;

        if (nodeStartOffset >= currentTargetOffset) {
          splitOffset = 0;
          needsHyphen = false;
        } else {
          // Binary search for character crossing currentTargetOffset
          let lo = 0;
          let hi = textLen;
          while (lo < hi) {
            const mid = Math.ceil((lo + hi) / 2);
            const r = document.createRange();
            r.setStart(textNode, 0);
            r.setEnd(textNode, mid);
            const rRect = r.getBoundingClientRect();
            const rOffset = rRect.bottom - blockTrueTop;

            if (rOffset <= currentTargetOffset) {
              lo = mid;
            } else {
              hi = mid - 1;
            }
          }

          const nodeStr = textNode.textContent || '';

          // Check if lo falls inside a word to perform rule-based Italian syllable hyphenation
          const textBeforeLo = nodeStr.substring(0, lo);
          const spaceMatch = textBeforeLo.match(/[\s.,;!?:'"«»()—–][^\s.,;!?:'"«»()—–]*$/);
          const wordStart = spaceMatch ? spaceMatch.index! + 1 : 0;

          const textAfterLo = nodeStr.substring(lo);
          const endMatch = textAfterLo.match(/[\s.,;!?:'"«»()—–]/);
          const wordEnd = endMatch ? lo + endMatch.index! : nodeStr.length;

          const currentWord = nodeStr.substring(wordStart, wordEnd);

          if (currentWord.length >= 4 && lo > wordStart + 1 && lo < wordEnd) {
            // lo falls within a word of 4+ letters. Check syllable hyphenation using itHyphen
            try {
              const hyphenLib = (itHyphen as any)?.default || itHyphen;
              const hyphenated: string = hyphenLib.hyphenateSync(currentWord);
              const syllableOffsets: number[] = [];
              let origIdx = 0;
              for (let i = 0; i < hyphenated.length; i++) {
                if (hyphenated[i] === '\u00AD') {
                  syllableOffsets.push(origIdx);
                } else {
                  origIdx++;
                }
              }

              const maxSyllableInWord = lo - wordStart;
              const fittingSyllables = syllableOffsets.filter(
                (offset) => offset >= 2 && offset <= maxSyllableInWord && (currentWord.length - offset) >= 2
              );

              if (fittingSyllables.length > 0) {
                const bestSyllableOffset = fittingSyllables[fittingSyllables.length - 1];
                splitOffset = wordStart + bestSyllableOffset;
                needsHyphen = nodeStr[splitOffset - 1] !== '-';
              } else {
                splitOffset = wordStart;
                needsHyphen = false;
              }
            } catch {
              // Fallback to cutting at lo with hyphen if inside word
              splitOffset = lo;
              needsHyphen = nodeStr[splitOffset - 1] !== '-';
            }
          } else {
            const lastSpaceMatch = textBeforeLo.match(/.*[\s\u00AD\-]/);
            if (lastSpaceMatch && lastSpaceMatch[0].length > 0) {
              const matchedChar = textBeforeLo[lastSpaceMatch[0].length - 1];
              splitOffset = lastSpaceMatch[0].length;
              // If we split on a soft-hyphen \u00AD, render the visible hyphen at page break
              needsHyphen = matchedChar === '\u00AD';
            } else {
              splitOffset = lo;
              // If cut inside a word without spaces, add hyphen
              const prevChar = nodeStr[splitOffset - 1] || '';
              needsHyphen = splitOffset > 0 && !/[\s\-\u2013\u2014]/.test(prevChar);
            }
          }
        }

        // Universal word boundary check: if the split point divides letters of a word, it MUST have a hyphen!
        if (splitOffset === 0) {
          const prevStr = prevTextNode?.textContent || '';
          const prevChar = prevStr[prevStr.length - 1] || '';
          const nextChar = textNode.textContent?.[0] || '';
          if (isWordChar(prevChar) && isWordChar(nextChar) && prevChar !== '-') {
            needsHyphen = true;
          }
        } else {
          const nodeStr = textNode.textContent || '';
          const prevChar = nodeStr[splitOffset - 1] || '';
          const nextChar = nodeStr[splitOffset] || '';
          if ((isWordChar(prevChar) || prevChar === '\u00AD') && isWordChar(nextChar) && prevChar !== '-') {
            needsHyphen = true;
          }
        }

        try {
          const splitPos = editorView.posAtDOM(textNode, splitOffset);
          if (splitPos != null && !splits.some(s => s.pos === splitPos)) {
            splits.push({ pos: splitPos, hasHyphen: needsHyphen });
          }
        } catch (err) {
          console.warn('[Folia Pagination] posAtDOM warning:', err);
        }

        currentTargetOffset += pageLimitPx;
      }
    }

    return splits;
  } catch (err) {
    console.warn('[Folia Pagination] findInlineSplits warning:', err);
    return [];
  } finally {
    existingBreakWidgets.forEach((w) => {
      w.style.display = '';
    });
  }
}

type EditorView = import('@tiptap/pm/view').EditorView;

export const PaginationExtension = Extension.create<PaginationExtensionOptions>({
  name: 'foliaPagination',

  addOptions() {
    return {
      getOptions: () => ({
        pageFormat: 'a4',
        pageMargins: 'normal',
        showPageNumbers: true,
        pageNumberPosition: 'bottom-right',
        pageNumberFormat: 'simple',
        documentTitle: '',
        onPageCountChange: undefined,
        onLastPagePaddingChange: undefined,
      }),
    };
  },

  addProseMirrorPlugins() {
    const extension = this;
    let lastDecorationSet: DecorationSet = DecorationSet.empty;
    let lastBreakPositionsKey = '';
    let scheduledRecalc: any = null;
    let isCalculating = false;

    return [
      new Plugin({
        key: paginationPluginKey,
        state: {
          init() {
            return DecorationSet.empty;
          },
          apply(tr, oldSet) {
            const meta = tr.getMeta(paginationPluginKey);
            // CRITICAL: only return meta if it's a valid DecorationSet (never boolean!)
            if (meta instanceof DecorationSet) {
              return meta;
            }
            if (tr.docChanged && oldSet instanceof DecorationSet) {
              try {
                return oldSet.map(tr.mapping, tr.doc);
              } catch {
                return DecorationSet.empty;
              }
            }
            return oldSet instanceof DecorationSet ? oldSet : DecorationSet.empty;
          },
        },
        props: {
          decorations(state) {
            const set = this.getState(state);
            return (set instanceof DecorationSet) ? set : DecorationSet.empty;
          },
        },
        view(editorView) {
          const calculateDecorations = () => {
            if (isCalculating || editorView.isDestroyed) return;
            isCalculating = true;

            try {
              const currentOpts = extension.options.getOptions();
              const { pageFormat, pageMargins, customMargins, showPageNumbers, pageNumberFormat, pageNumberPosition, documentTitle, onPageCountChange, onLastPagePaddingChange } = currentOpts;

              if (pageFormat === 'continuous') {
                onPageCountChange?.(1);
                onLastPagePaddingChange?.(0);
                if (lastBreakPositionsKey !== 'continuous') {
                  lastBreakPositionsKey = 'continuous';
                  lastDecorationSet = DecorationSet.empty;
                  const tr = editorView.state.tr.setMeta(paginationPluginKey, DecorationSet.empty);
                  editorView.dispatch(tr);
                }
                return;
              }

              const dom = editorView.dom;
              if (!dom || !dom.children || dom.children.length === 0) {
                onPageCountChange?.(1);
                return;
              }

              const metrics = getPageMetrics(pageFormat, pageMargins, customMargins);
              if (metrics.sheetHeight === Infinity) return;

              const { firstPageLimit, subsequentPageLimit, topMarginPx, bottomMarginPx } = metrics;
              const doc = editorView.state.doc;

              // Filter only content block elements, cleanly excluding any virtual page break widgets
              const allChildren = Array.from(dom.children) as HTMLElement[];
              const blockElements = allChildren.filter(
                (el) =>
                  !el.classList.contains('folia-virtual-page-break') &&
                  el.getAttribute('data-virtual-page-break') !== 'true'
              );

              if (doc.childCount === 0 || blockElements.length === 0) {
                onPageCountChange?.(1);
                onLastPagePaddingChange?.(firstPageLimit);
                return;
              }

              const breakPositions: Array<{
                pos: number;
                prevPage: number;
                nextPage: number;
                spacerHeight: number;
                isInline?: boolean;
                hasHyphen?: boolean;
              }> = [];
              let currentPos = 0;
              let currentPageIndex = 1;
              let accumulatedHeightOnCurrentPage = 0;

              for (let i = 0; i < doc.childCount; i++) {
                const node = doc.child(i);
                const domEl = blockElements[i];

                // Intrinsic block height (independent of previous spacers or viewport coordinates)
                let blockHeight = 24;
                if (domEl) {
                  const rect = domEl.getBoundingClientRect();
                  const computed = window.getComputedStyle(domEl);
                  const marginBottom = parseFloat(computed.marginBottom) || 0;
                  const marginTop = parseFloat(computed.marginTop) || 0;
                  let rawHeight = rect.height || domEl.offsetHeight || 24;

                  // Subtract height of any inline page-break widgets already inside this element
                  const innerWidgets = domEl.querySelectorAll('.folia-virtual-page-break');
                  innerWidgets.forEach((w) => {
                    rawHeight -= (w as HTMLElement).offsetHeight || 0;
                  });

                  blockHeight = Math.max(24, rawHeight) + marginBottom + marginTop;
                }

                const limitForThisPage = currentPageIndex === 1 ? firstPageLimit : subsequentPageLimit;

                // Check for manual page break
                const isManualBreak =
                  domEl &&
                  (domEl.classList.contains('folia-page-break') ||
                    domEl.getAttribute('data-page-break') === 'true');

                if (isManualBreak) {
                  const spacerHeight = Math.max(0, limitForThisPage - accumulatedHeightOnCurrentPage);
                  breakPositions.push({
                    pos: currentPos,
                    prevPage: currentPageIndex,
                    nextPage: currentPageIndex + 1,
                    spacerHeight,
                  });
                  currentPageIndex++;
                  accumulatedHeightOnCurrentPage = 0;
                  currentPos += node.nodeSize;
                  continue;
                }

                // If block exceeds page limit
                if (accumulatedHeightOnCurrentPage + blockHeight > limitForThisPage) {
                  const remainingOnPage = Math.max(0, limitForThisPage - accumulatedHeightOnCurrentPage);
                  const availableSlot = accumulatedHeightOnCurrentPage === 0 ? limitForThisPage : remainingOnPage;

                  // Try to find inline splits if there's reasonable room on this page, or if block is taller than a page
                  const isTable = node.type.name === 'table' || (domEl && (domEl.tagName === 'TABLE' || domEl.classList.contains('tableWrapper') || domEl.querySelector('table') !== null));
                  const canSplitInline = !isTable && domEl && (availableSlot >= 36 || accumulatedHeightOnCurrentPage === 0);
                  const inlineSplits = canSplitInline
                    ? findInlineSplits(domEl, availableSlot, subsequentPageLimit, editorView)
                    : [];

                  if (inlineSplits.length > 0) {
                    // One or more inline splits inside this block
                    for (const inlineSplit of inlineSplits) {
                      breakPositions.push({
                        pos: inlineSplit.pos,
                        prevPage: currentPageIndex,
                        nextPage: currentPageIndex + 1,
                        spacerHeight: 0,
                        isInline: true,
                        hasHyphen: inlineSplit.hasHyphen,
                      });
                      currentPageIndex++;
                    }

                    // Remaining height of this block on the last page it reaches
                    const usedHeight = availableSlot + (inlineSplits.length - 1) * subsequentPageLimit;
                    accumulatedHeightOnCurrentPage = Math.max(0, blockHeight - usedHeight);

                  } else {
                    // Fallback: move the whole block to the next page (e.g. less than 1 line fits, or non-text block)
                    if (accumulatedHeightOnCurrentPage > 0) {
                      const spacerHeight = remainingOnPage;
                      breakPositions.push({
                        pos: currentPos,
                        prevPage: currentPageIndex,
                        nextPage: currentPageIndex + 1,
                        spacerHeight,
                      });
                      currentPageIndex++;
                      accumulatedHeightOnCurrentPage = 0;
                    }

                    // If the block itself is taller than a full page but couldn't be split inline
                    if (blockHeight > subsequentPageLimit) {
                      const fullPagesSpanned = Math.floor(blockHeight / subsequentPageLimit);
                      const remainderHeight = blockHeight % subsequentPageLimit;
                      currentPageIndex += fullPagesSpanned;
                      accumulatedHeightOnCurrentPage = remainderHeight;
                    } else {
                      accumulatedHeightOnCurrentPage = blockHeight;
                    }
                  }
                } else {
                  accumulatedHeightOnCurrentPage += blockHeight;
                }

                currentPos += node.nodeSize;
              }

              const totalPages = currentPageIndex;

              // Map footnote nodes to their respective physical page
              const footnotesByPage = new Map<number, Footnote[]>();
              const docFootnotes = currentOpts.footnotes || [];
              const footnoteMap = new Map<string, Footnote>(docFootnotes.map(f => [f.id, f]));

              doc.descendants((node, pos) => {
                if (node.type.name === 'footnote') {
                  const fnId = node.attrs.id;
                  const fn = footnoteMap.get(fnId) || {
                    id: fnId,
                    number: node.attrs.number || 1,
                    content: '',
                  };
                  let page = 1;
                  for (const bp of breakPositions) {
                    if (pos >= bp.pos) {
                      page = bp.nextPage;
                    }
                  }
                  const list = footnotesByPage.get(page) || [];
                  list.push(fn);
                  footnotesByPage.set(page, list);
                }
              });

              // Final page limit
              const finalPageLimit = totalPages === 1 ? firstPageLimit : subsequentPageLimit;
              // accumulatedHeightOnCurrentPage is the accurate, fresh height of content on the final page
              const finalContentHeight = Math.max(0, accumulatedHeightOnCurrentPage);
              const lastPagePadding = Math.max(0, finalPageLimit - finalContentHeight);

              const fnKey = (currentOpts.footnotes || []).map(f => `${f.id}:${f.content}`).join('|');
              const newKey = `${pageFormat}-${pageMargins}-${customMargins ? `${customMargins.top},${customMargins.bottom}` : ''}-${showPageNumbers ? '1' : '0'}-${pageNumberPosition}-${pageNumberFormat}-${breakPositions.map(b => `${b.pos}:${b.spacerHeight}:${b.hasHyphen ? '1' : '0'}`).join(',')}-${fnKey}`;
              if (newKey === lastBreakPositionsKey) {
                return;
              }

              // Sanitize and deduplicate break positions within document content bounds
              const seenBreakPositions = new Set<number>();
              const validBreakPositions = breakPositions.filter(bp => {
                if (!Number.isFinite(bp.pos) || bp.pos < 0 || bp.pos > doc.content.size) return false;
                if (seenBreakPositions.has(bp.pos)) return false;
                seenBreakPositions.add(bp.pos);
                return true;
              });

              const decorations: Decoration[] = [];

              validBreakPositions.forEach((bp) => {
                const safePos = Math.max(0, Math.min(doc.content.size, bp.pos));

                // If a word was split at syllable boundary across pages, render hyphen at the end of the line
                if (bp.hasHyphen) {
                  const hyphenWidget = Decoration.widget(
                    safePos,
                    () => {
                      const span = document.createElement('span');
                      span.className = 'folia-page-break-hyphen select-none pointer-events-none';
                      span.textContent = '-';
                      return span;
                    },
                    { side: -1, key: `page-break-hyphen-${safePos}` }
                  );
                  decorations.push(hyphenWidget);
                }

                const prevPageNumText = formatPageNum(bp.prevPage, totalPages, pageNumberFormat);
                const isAlignLeft = pageNumberPosition.includes('left');
                const isAlignCenter = pageNumberPosition.includes('center');
                const alignClass = isAlignLeft ? 'text-left justify-start' : isAlignCenter ? 'text-center justify-center' : 'text-right justify-end';

                const widget = Decoration.widget(
                  safePos,
                  () => {
                    const container = document.createElement('span');
                    container.className = 'folia-virtual-page-break' + (bp.isInline ? ' inline-break' : '');
                    container.style.display = 'block';
                    container.style.width = '100%';
                    container.style.clear = 'both';
                    container.setAttribute('contenteditable', 'false');
                    container.setAttribute('data-virtual-page-break', 'true');

                    const footerSection = document.createElement('span');
                    footerSection.className = 'folia-page-bottom-footer';
                    footerSection.style.display = 'block';

                    const pageFootnotes = footnotesByPage.get(bp.prevPage) || [];
                    const fnEstimatedHeight = pageFootnotes.length * 52;
                    const adjustedSpacer = Math.max(0, bp.spacerHeight - fnEstimatedHeight);

                    // Equalizer spacer so every page has the EXACT same physical height
                    if (adjustedSpacer > 0) {
                      const spacer = document.createElement('span');
                      spacer.style.height = `${adjustedSpacer}px`;
                      spacer.style.display = 'block';
                      spacer.className = 'folia-page-bottom-spacer pointer-events-none select-none';
                      footerSection.appendChild(spacer);
                    }

                    // Render footnotes of this specific page at the bottom
                    if (pageFootnotes.length > 0) {
                      const fnContainer = document.createElement('span');
                      fnContainer.className = 'folia-page-footnotes my-3 pt-2.5 border-t border-paper-300 pointer-events-auto select-text';
                      fnContainer.style.display = 'block';

                      pageFootnotes.forEach(fn => {
                        const item = document.createElement('span');
                        item.className = 'group flex items-start gap-2 text-xs font-serif mb-1.5';
                        item.id = `footnote-${fn.id}`;

                        const numSpan = document.createElement('span');
                        numSpan.className = 'font-bold text-[11px] text-folia-900 shrink-0 select-none pt-1';
                        numSpan.textContent = `[${fn.number}]`;
                        item.appendChild(numSpan);

                        const ta = document.createElement('textarea');
                        ta.value = fn.content || '';
                        ta.placeholder = 'Testo della nota a piè di pagina...';
                        ta.rows = 1;
                        ta.className = 'flex-1 p-1.5 bg-white/80 hover:bg-white focus:bg-white rounded border border-paper-250 focus:border-folia-600 focus:outline-hidden text-xs text-paper-800 leading-normal resize-none font-serif transition-colors';
                        
                        ta.addEventListener('keydown', (e) => e.stopPropagation());
                        ta.addEventListener('mousedown', (e) => e.stopPropagation());
                        ta.addEventListener('click', (e) => e.stopPropagation());
                        ta.addEventListener('input', () => {
                          currentOpts.onUpdateFootnote?.(fn.id, ta.value);
                        });
                        item.appendChild(ta);

                        const jumpBtn = document.createElement('button');
                        jumpBtn.type = 'button';
                        jumpBtn.title = 'Torna al riferimento nel testo';
                        jumpBtn.className = 'p-1 text-paper-400 hover:text-folia-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pt-1 cursor-pointer';
                        jumpBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`;
                        jumpBtn.addEventListener('click', (e) => {
                          e.stopPropagation();
                          currentOpts.onJumpToFootnoteInText?.(fn.id);
                        });
                        item.appendChild(jumpBtn);

                        const delBtn = document.createElement('button');
                        delBtn.type = 'button';
                        delBtn.title = 'Elimina nota';
                        delBtn.className = 'p-1 text-paper-400 hover:text-rose-600 rounded opacity-0 group-hover:opacity-100 transition-opacity pt-1 cursor-pointer';
                        delBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;
                        delBtn.addEventListener('click', (e) => {
                          e.stopPropagation();
                          currentOpts.onDeleteFootnote?.(fn.id);
                        });
                        item.appendChild(delBtn);

                        fnContainer.appendChild(item);
                      });

                      footerSection.appendChild(fnContainer);
                    }

                    // Dedicated bottom margin area: exact height of bottomMarginPx
                    // Page numbers live strictly inside this margin area without pushing or altering text margins
                    const footerMargin = document.createElement('span');
                    footerMargin.style.height = `${bottomMarginPx}px`;
                    footerMargin.style.display = 'flex';
                    footerMargin.style.boxSizing = 'border-box';
                    footerMargin.className = `items-center text-xs font-serif font-medium text-paper-700 select-none ${alignClass}`;

                    if (showPageNumbers && pageNumberPosition.startsWith('bottom')) {
                      footerMargin.innerHTML = `<span class="tracking-wide">${prevPageNumText}</span>`;
                    }
                    footerSection.appendChild(footerMargin);
                    container.appendChild(footerSection);

                    const deskGap = document.createElement('span');
                    deskGap.className = 'folia-page-desk-gap';
                    deskGap.innerHTML = `
                      <span class="folia-page-badge">
                        <span>Pagina ${bp.nextPage}</span>
                      </span>
                    `;
                    container.appendChild(deskGap);

                    // Dedicated top margin area: exact height of topMarginPx
                    // Running chapter title and divider line live strictly inside this margin area
                    const headerSection = document.createElement('span');
                    headerSection.className = 'folia-page-top-header';
                    headerSection.style.height = `${topMarginPx}px`;
                    headerSection.style.display = 'flex';
                    headerSection.style.boxSizing = 'border-box';
                    headerSection.style.flexDirection = 'column';
                    headerSection.style.justifyContent = 'flex-end';
                    headerSection.style.paddingBottom = '8px';

                    const headerContent = document.createElement('span');
                    headerContent.className = 'flex items-center justify-between text-[11px] font-serif font-medium text-paper-500 select-none pb-1.5 border-b border-paper-200/80 w-full';

                    const runningTitle = document.createElement('span');
                    runningTitle.className = 'truncate max-w-[300px] italic tracking-wide text-paper-600';
                    runningTitle.textContent = documentTitle || 'Folia';
                    headerContent.appendChild(runningTitle);

                    if (showPageNumbers && pageNumberPosition.startsWith('top')) {
                      const topNum = document.createElement('span');
                      topNum.className = 'tracking-wide text-paper-700 font-semibold';
                      topNum.textContent = formatPageNum(bp.nextPage, totalPages, pageNumberFormat);
                      headerContent.appendChild(topNum);
                    }

                    headerSection.appendChild(headerContent);
                    container.appendChild(headerSection);

                    return container;
                  },
                  { side: bp.hasHyphen ? 1 : -1, key: `page-break-${safePos}` }
                );

                decorations.push(widget);
              });

              decorations.sort((a, b) => {
                if (a.from !== b.from) {
                  return a.from - b.from;
                }
                const sideA = (a.spec as any)?.side ?? 0;
                const sideB = (b.spec as any)?.side ?? 0;
                return sideA - sideB;
              });

              let newDecorationSet: DecorationSet;
              try {
                newDecorationSet = DecorationSet.create(doc, decorations);
              } catch (decErr) {
                console.warn('[Folia Pagination] DecorationSet creation warning, fallback to lastDecorationSet:', decErr);
                newDecorationSet = (lastDecorationSet instanceof DecorationSet) ? lastDecorationSet : DecorationSet.empty;
              }

              lastDecorationSet = newDecorationSet;
              lastBreakPositionsKey = newKey;

              const tr = editorView.state.tr.setMeta(paginationPluginKey, newDecorationSet);
              editorView.dispatch(tr);

              // Notify parent callbacks after successful dispatch
              onPageCountChange?.(totalPages);
              onLastPagePaddingChange?.(lastPagePadding);

              // Notify parent about final page footnotes
              const finalPageFootnotes = footnotesByPage.get(totalPages) || [];
              currentOpts.onLastPageFootnotesChange?.(finalPageFootnotes);
            } catch (err) {
              console.error('[Folia Pagination] Error during pagination calculation:', err);
              lastBreakPositionsKey = '';
            } finally {
              isCalculating = false;
            }
          };

          const scheduleRecalc = (delay = 60) => {
            if (scheduledRecalc) clearTimeout(scheduledRecalc);
            scheduledRecalc = setTimeout(calculateDecorations, delay);
          };

          // Attach manual recalc function to DOM element for direct calls
          (editorView.dom as any)._foliaRecalcPagination = () => {
            lastBreakPositionsKey = '';
            scheduleRecalc(10);
          };

          // ResizeObserver to detect layout or font reflow (filter only container width changes to avoid height feedback loops)
          let lastObservedWidth = 0;
          let resizeObserver: ResizeObserver | null = null;
          if (typeof ResizeObserver !== 'undefined' && editorView.dom) {
            resizeObserver = new ResizeObserver((entries) => {
              for (const entry of entries) {
                const width = Math.round(entry.contentRect.width);
                if (lastObservedWidth === 0) {
                  lastObservedWidth = width;
                } else if (Math.abs(width - lastObservedWidth) >= 4) {
                  lastObservedWidth = width;
                  scheduleRecalc(50);
                }
              }
            });
            resizeObserver.observe(editorView.dom);
          }

          // Listen for font loading ready
          if (typeof document !== 'undefined' && (document as any).fonts) {
            (document as any).fonts.ready.then(() => scheduleRecalc(50));
          }

          // Initial calculation after layout settles
          setTimeout(() => scheduleRecalc(20), 50);

          return {
            update(view, prevState) {
              if (view.state.doc !== prevState.doc) {
                lastBreakPositionsKey = '';
                scheduleRecalc(40);
              }
            },
            destroy() {
              if (scheduledRecalc) clearTimeout(scheduledRecalc);
              if (resizeObserver) resizeObserver.disconnect();
              delete (editorView.dom as any)._foliaRecalcPagination;
            },
          };
        },
      }),
    ];
  },
});
