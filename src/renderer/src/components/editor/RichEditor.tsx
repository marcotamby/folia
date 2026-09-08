import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import CharacterCount from '@tiptap/extension-character-count';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TiptapImage from '@tiptap/extension-image';
import { EditorToolbar } from './EditorToolbar';
import { LinkModal } from '../modals/LinkModal';
import { InsertImageModal } from '../modals/InsertImageModal';
import { FindReplaceBar } from './FindReplaceBar';
import { FontSizeExtension } from './FontSizeExtension';
import { InterlinkExtension, interlinkPluginKey } from './InterlinkExtension';
import { InterlinkHoverCard } from './InterlinkHoverCard';
import { LinkHoverCard } from './LinkHoverCard';
import {
  PaginationExtension,
  paginationPluginKey,
  getPageMetrics,
  PaginationOptions
} from './PaginationExtension';
import { FoliaParagraph } from './FoliaParagraph';
import { HyphenationExtension, hyphenationPluginKey } from './HyphenationExtension';
import { FootnoteNode } from './FootnoteExtension';
import { ManuscriptItem, PageFormat, PageMargins, CustomPageMargins, FontFamily, ParagraphSpacing, Character, WorldEntry, PageNumberPosition, PageNumberFormat, Footnote, DocumentComment } from '../../types';
import { FootnotesList } from './FootnotesList';
import { CommentsDrawer } from './CommentsDrawer';
import { InsertionMark, DeletionMark } from './TrackChangesExtension';
import { SearchHighlightExtension } from './SearchHighlightExtension';
import { CommentMark } from './CommentExtension';
import { WordCountModal, TextStats, SelectionStats } from '../modals/WordCountModal';
import { CustomMarginsModal } from '../modals/CustomMarginsModal';
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, FileText, Minimize2, Highlighter, Link2, ExternalLink, Unlink, MessageSquare, Table as TableIcon, Trash2 } from 'lucide-react';

interface RichEditorProps {
  document: ManuscriptItem | null;
  characters: Character[];
  worldbuilding: WorldEntry[];
  onNavigateToCharacter: (id: string) => void;
  onNavigateToWorld: (id: string) => void;
  onUpdateContent: (content: string, wordCount: number) => void;
  onUpdateTitle: (title: string) => void;
  onUpdateSynopsis: (synopsis: string) => void;
  onUpdateFootnotes?: (footnotes: Footnote[]) => void;
  onUpdateComments?: (comments: DocumentComment[]) => void;
  defaultAuthor?: string;
  fontFamily: FontFamily;
  onChangeFontFamily: (font: FontFamily) => void;
  headingFontFamily: FontFamily;
  onChangeHeadingFontFamily: (font: FontFamily) => void;
  fontSize: number;
  titleFontSize?: number;
  titleAlignment?: 'left' | 'center' | 'right' | 'justify';
  onChangeFontSize: (size: number) => void;
  onChangeTitleFontSize?: (size: number) => void;
  onChangeTitleAlignment?: (align: 'left' | 'center' | 'right' | 'justify') => void;
  pageFormat: PageFormat;
  onChangePageFormat: (format: PageFormat) => void;
  pageMargins: PageMargins;
  onChangePageMargins: (margins: PageMargins) => void;
  customMargins?: CustomPageMargins;
  onChangeCustomMargins?: (margins: CustomPageMargins) => void;
  lineHeight: number;
  firstLineIndent: number;
  onChangeFirstLineIndent: (indent: number) => void;
  paragraphSpacing: ParagraphSpacing;
  onChangeParagraphSpacing: (spacing: ParagraphSpacing) => void;
  hyphenation: boolean;
  onToggleHyphenation: () => void;
  spellcheck: boolean;
  onToggleSpellcheck: () => void;
  showPageNumbers: boolean;
  onTogglePageNumbers: () => void;
  pageNumberPosition: PageNumberPosition;
  onChangePageNumberPosition: (pos: PageNumberPosition) => void;
  pageNumberFormat: PageNumberFormat;
  onChangePageNumberFormat: (fmt: PageNumberFormat) => void;
  isFocusMode: boolean;
  onExitFocusMode: () => void;
  onOpenSpecialChars: () => void;
  projectWords?: number;
  projectChars?: number;
  t: (key: string) => string;
}

export const RichEditor: React.FC<RichEditorProps> = ({
  document,
  characters,
  worldbuilding,
  onNavigateToCharacter,
  onNavigateToWorld,
  onUpdateContent,
  onUpdateTitle,
  onUpdateSynopsis,
  onUpdateFootnotes,
  onUpdateComments,
  defaultAuthor = 'Autore',
  fontFamily,
  onChangeFontFamily,
  headingFontFamily = 'Plus Jakarta Sans',
  onChangeHeadingFontFamily,
  fontSize,
  titleFontSize,
  titleAlignment,
  onChangeFontSize,
  onChangeTitleFontSize,
  onChangeTitleAlignment,
  pageFormat,
  onChangePageFormat,
  pageMargins,
  onChangePageMargins,
  customMargins,
  onChangeCustomMargins,
  lineHeight,
  firstLineIndent,
  onChangeFirstLineIndent,
  paragraphSpacing,
  onChangeParagraphSpacing,
  hyphenation,
  onToggleHyphenation,
  spellcheck,
  onToggleSpellcheck,
  showPageNumbers,
  onTogglePageNumbers,
  pageNumberPosition = 'bottom-right',
  onChangePageNumberPosition,
  pageNumberFormat = 'simple',
  onChangePageNumberFormat,
  isFocusMode,
  onExitFocusMode,
  onOpenSpecialChars,
  projectWords = 0,
  projectChars = 0,
  t
}) => {
  const [hoveredEntity, setHoveredEntity] = useState<{ id: string; type: 'character' | 'world'; name: string } | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);
  const [hoverPlacement, setHoverPlacement] = useState<'top' | 'bottom'>('bottom');
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isCardHoveredRef = useRef<boolean>(false);

  // Floating Web Link Tooltip State
  const [hoveredLink, setHoveredLink] = useState<{ url: string; text: string; pos?: number } | null>(null);
  const [linkHoverPosition, setLinkHoverPosition] = useState<{ x: number; y: number } | null>(null);
  const linkHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isLinkCardHoveredRef = useRef<boolean>(false);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [tableContextMenu, setTableContextMenu] = useState<{ x: number; y: number } | null>(null);

  // Close table context menu on outside click or scroll
  useEffect(() => {
    if (!tableContextMenu) return;
    const handleClose = () => setTableContextMenu(null);
    window.addEventListener('click', handleClose);
    window.addEventListener('scroll', handleClose, true);
    return () => {
      window.removeEventListener('click', handleClose);
      window.removeEventListener('scroll', handleClose, true);
    };
  }, [tableContextMenu]);

  // Keep references updated for TipTap plugins
  const charsRef = useRef(characters);
  const worldRef = useRef(worldbuilding);
  useEffect(() => {
    charsRef.current = characters;
    worldRef.current = worldbuilding;
  }, [characters, worldbuilding]);

  const [actualPageCount, setActualPageCount] = useState(1);
  const totalDisplayPages = Math.max(actualPageCount, 1);
  const [lastPagePadding, setLastPagePadding] = useState(0);
  const [lastPageFootnotes, setLastPageFootnotes] = useState<Footnote[]>([]);

  const hyphenationRef = useRef(hyphenation);

  const paginationOptionsRef = useRef<PaginationOptions>({
    pageFormat,
    pageMargins,
    customMargins,
    showPageNumbers,
    pageNumberPosition,
    pageNumberFormat,
    documentTitle: document?.title || '',
    footnotes: document?.footnotes || [],
    onPageCountChange: (count: number) => setActualPageCount(count),
    onLastPagePaddingChange: (pad: number) => setLastPagePadding(pad),
    onLastPageFootnotesChange: (fns: Footnote[]) => setLastPageFootnotes(fns),
  });

  const extensions = useMemo(() => [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
      bulletList: { keepMarks: true },
      orderedList: { keepMarks: true },
    }),
    Underline,
    TextStyle,
    FontSizeExtension,
    Color,
    Highlight.configure({ multicolor: true }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
      HTMLAttributes: {
        class: 'folia-link'
      }
    }),
    CharacterCount,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Table.extend({
      addKeyboardShortcuts() {
        return {
          'Mod-Backspace': () => {
            if (this.editor.isActive('table')) {
              return this.editor.commands.deleteTable();
            }
            return false;
          },
          'Mod-Delete': () => {
            if (this.editor.isActive('table')) {
              return this.editor.commands.deleteTable();
            }
            return false;
          },
          'Backspace': () => {
            if (!this.editor.isActive('table')) return false;
            const { selection } = this.editor.state;
            if ((selection as any).isRowSelection?.() && (selection as any).isColSelection?.()) {
              return this.editor.commands.deleteTable();
            }
            const $from = selection.$from;
            for (let d = $from.depth; d > 0; d--) {
              const node = $from.node(d);
              if (node.type.name === 'table') {
                if (node.textContent.trim() === '') {
                  return this.editor.commands.deleteTable();
                }
                break;
              }
            }
            return false;
          },
          'Delete': () => {
            if (!this.editor.isActive('table')) return false;
            const { selection } = this.editor.state;
            if ((selection as any).isRowSelection?.() && (selection as any).isColSelection?.()) {
              return this.editor.commands.deleteTable();
            }
            return false;
          }
        };
      }
    }).configure({
      resizable: true,
      HTMLAttributes: {
        class: 'folia-table',
      }
    }),
    TableRow,
    TableHeader,
    TableCell,
    TiptapImage.configure({
      inline: false,
      allowBase64: true,
      HTMLAttributes: {
        class: 'folia-image',
      }
    }),
    InsertionMark,
    DeletionMark,
    CommentMark,
    SearchHighlightExtension,
    FootnoteNode,
    InterlinkExtension.configure({
      getCharacters: () => charsRef.current,
      getWorldbuilding: () => worldRef.current,
    }),
    PaginationExtension.configure({
      getOptions: () => paginationOptionsRef.current,
    }),
    HyphenationExtension.configure({
      getEnabled: () => hyphenationRef.current,
      getCharacters: () => charsRef.current,
      getWorldbuilding: () => worldRef.current,
    }),
  ], []);

  const editor = useEditor({
    extensions,
    content: document?.content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-paper max-w-none focus:outline-hidden',
        spellcheck: spellcheck ? 'true' : 'false',
        lang: 'it',
      },
      handleClick: (_view, _pos, event) => {
        const commentEl = (event.target as HTMLElement)?.closest('.folia-comment-mark') as HTMLElement | null;
        if (commentEl) {
          const cId = commentEl.getAttribute('data-comment-id');
          if (cId) {
            setIsCommentsDrawerOpen(true);
            setActiveCommentId(cId);
            const editorDom = editorContainerRef.current;
            if (editorDom) {
              editorDom.querySelectorAll('.folia-comment-active').forEach(el => {
                el.classList.remove('folia-comment-active');
              });
            }
            commentEl.classList.add('folia-comment-active');
            setTimeout(() => {
              const card = document.getElementById(`comment-card-${cId}`);
              card?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
          }
        }

        const anchor = (event.target as HTMLElement)?.closest('a');
        if (anchor && !anchor.classList.contains('folia-interlink')) {
          const href = anchor.getAttribute('href');
          if (href) {
            // If Ctrl+Click or Cmd+Click, immediately open in external browser
            if (event.ctrlKey || event.metaKey) {
              event.preventDefault();
              let cleanUrl = href.trim();
              if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://') && !cleanUrl.startsWith('mailto:')) {
                cleanUrl = 'https://' + cleanUrl;
              }
              if ((window as any).foliaAPI?.openExternal) {
                (window as any).foliaAPI.openExternal(cleanUrl);
              } else {
                window.open(cleanUrl, '_blank');
              }
              return true;
            } else {
              // Normal click on link: show floating hover card
              const rect = anchor.getBoundingClientRect();
              setLinkHoverPosition({
                x: rect.left + rect.width / 2,
                y: rect.top,
              });
              setHoveredLink({
                url: href,
                text: anchor.textContent || '',
              });
            }
          }
        }
        return false;
      },
      handleDOMEvents: {
        contextmenu: (view, event) => {
          const target = event.target as HTMLElement;
          const tableEl = target?.closest('.folia-table, table, .tableWrapper');
          if (tableEl) {
            event.preventDefault();
            const coords = { left: event.clientX, top: event.clientY };
            const pos = view.posAtCoords(coords);
            if (pos && typeof pos.pos === 'number') {
              view.focus();
              try {
                const tr = view.state.tr.setSelection(
                  (view.state.selection.constructor as any).near(view.state.doc.resolve(pos.pos))
                );
                view.dispatch(tr);
              } catch (e) {}
            }
            setTableContextMenu({ x: event.clientX, y: event.clientY });
            return true;
          }
          setTableContextMenu(null);
          return false;
        }
      }
    },
    onFocus: () => {
      setIsTitleFocused(false);
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const words = editor.storage.characterCount.words();
      onUpdateContent(html, words);
    },
  });

  // Dynamically update spellcheck and lang attributes on editor DOM
  useEffect(() => {
    if (editor && editor.view && editor.view.dom) {
      editor.view.dom.setAttribute('spellcheck', spellcheck ? 'true' : 'false');
      editor.view.dom.setAttribute('lang', 'it');
    }
  }, [spellcheck, editor]);

  // Re-run decorations when characters or worldbuilding entities change
  useEffect(() => {
    if (editor && editor.view) {
      editor.view.dispatch(
        editor.state.tr
          .setMeta(interlinkPluginKey, true)
          .setMeta(hyphenationPluginKey, true)
      );
    }
  }, [characters, worldbuilding, editor]);

  // Re-run pagination when format, margins, title, or footnotes change
  useEffect(() => {
    paginationOptionsRef.current = {
      pageFormat,
      pageMargins,
      customMargins,
      showPageNumbers,
      pageNumberPosition,
      pageNumberFormat,
      documentTitle: document?.title || '',
      footnotes: document?.footnotes || [],
      onUpdateFootnote: handleUpdateFootnote,
      onDeleteFootnote: handleDeleteFootnote,
      onJumpToFootnoteInText: handleJumpToFootnoteInText,
      onPageCountChange: (count: number) => setActualPageCount(count),
      onLastPagePaddingChange: (pad: number) => setLastPagePadding(pad),
      onLastPageFootnotesChange: (fns: Footnote[]) => setLastPageFootnotes(fns),
    };
    if (editor && editor.view && editor.view.dom) {
      (editor.view.dom as any)._foliaRecalcPagination?.();
    }
  }, [pageFormat, pageMargins, customMargins, showPageNumbers, pageNumberPosition, pageNumberFormat, document?.title, document?.footnotes, fontSize, lineHeight, paragraphSpacing, hyphenation, editor]);

  // Re-run hyphenation decorations when hyphenation toggle changes
  useEffect(() => {
    hyphenationRef.current = hyphenation;
    if (editor && editor.view && !editor.isDestroyed) {
      const tr = editor.view.state.tr.setMeta(hyphenationPluginKey, true);
      editor.view.dispatch(tr);
    }
  }, [hyphenation, editor]);

  // Reset scroll to top when switching chapters
  useEffect(() => {
    const resetScroll = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    };

    resetScroll();
    const rafId = requestAnimationFrame(resetScroll);
    const timer1 = setTimeout(resetScroll, 60);
    const timer2 = setTimeout(resetScroll, 160);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [document?.id]);

  // Listen for external scroll-to-top requests (e.g. clicking current chapter in sidebar)
  useEffect(() => {
    const handleScrollTop = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('folia-scroll-editor-top', handleScrollTop);
    return () => window.removeEventListener('folia-scroll-editor-top', handleScrollTop);
  }, []);

  // Sync content when active document changes
  useEffect(() => {
    if (editor && document) {
      const currentHTML = editor.getHTML();
      if (document.content !== currentHTML) {
        editor.commands.setContent(document.content || '', false);
      }
      setTimeout(() => {
        (editor.view.dom as any)?._foliaRecalcPagination?.();
      }, 50);
    }
  }, [document?.id, editor]);

  // Handle special characters insertion
  const insertChar = (char: string) => {
    if (editor) {
      editor.chain().focus().insertContent(char).run();
    }
  };

  // Handle page break insertion (Ctrl + Enter)
  const handleInsertPageBreak = () => {
    if (editor) {
      editor.chain().focus().insertContent('<div class="folia-page-break" data-page-break="true"><div class="folia-page-bottom-footer"></div><div class="folia-page-desk-gap"><div class="folia-page-badge"><span>Interruzione di pagina</span></div></div><div class="folia-page-top-header"></div></div><p></p>').run();
    }
  };

  useEffect(() => {
    (window as any)._insertCharToEditor = insertChar;
    return () => {
      delete (window as any)._insertCharToEditor;
    };
  }, [editor]);

  // Web Hyperlink state & handlers
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkModalData, setLinkModalData] = useState<{ url: string; text: string; isEditing: boolean }>({
    url: '',
    text: '',
    isEditing: false
  });

  const handleOpenExternalLink = (url: string) => {
    let cleanUrl = (url || '').trim();
    if (!cleanUrl) return;
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://') && !cleanUrl.startsWith('mailto:')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    if ((window as any).foliaAPI?.openExternal) {
      (window as any).foliaAPI.openExternal(cleanUrl);
    } else {
      window.open(cleanUrl, '_blank');
    }
  };

  const handleOpenLinkModal = (customUrl?: unknown, customText?: unknown) => {
    if (!editor) return;

    // Close link hover card if open
    setHoveredLink(null);
    setLinkHoverPosition(null);

    // Sanitize parameters to guarantee they are strings (prevent React SyntheticEvent from being treated as url)
    const validUrl = typeof customUrl === 'string' ? customUrl.trim() : '';
    const validText = typeof customText === 'string' ? customText.trim() : '';

    let isEditing = editor.isActive('link');
    let url = validUrl;
    let selectedText = validText;

    if (isEditing) {
      editor.chain().extendMarkRange('link').run();
      if (!url) url = editor.getAttributes('link').href || '';
      if (!selectedText) {
        const { from, to } = editor.state.selection;
        selectedText = editor.state.doc.textBetween(from, to, ' ');
      }
    } else if (validUrl) {
      isEditing = true;
    } else {
      const { from, to } = editor.state.selection;
      selectedText = from < to ? editor.state.doc.textBetween(from, to, ' ') : '';
    }

    setLinkModalData({
      url: typeof url === 'string' ? url : '',
      text: typeof selectedText === 'string' ? selectedText : '',
      isEditing: !!isEditing
    });
    setIsLinkModalOpen(true);
  };

  const handleSaveLink = (url: string, text?: string) => {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    if (editor.isActive('link')) {
      editor.chain().focus().extendMarkRange('link').run();
      const currentFrom = editor.state.selection.from;
      const currentTo = editor.state.selection.to;
      const currentText = editor.state.doc.textBetween(currentFrom, currentTo, ' ');

      if (text && text !== currentText) {
        editor
          .chain()
          .focus()
          .insertContentAt(
            { from: currentFrom, to: currentTo },
            {
              type: 'text',
              text,
              marks: [{ type: 'link', attrs: { href: url } }]
            }
          )
          .run();
      } else {
        editor.chain().focus().setLink({ href: url }).run();
      }
    } else if (from === to) {
      // Insert new link at cursor
      const displayText = text || url;
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'text',
          text: displayText,
          marks: [{ type: 'link', attrs: { href: url } }]
        })
        .run();
    } else {
      // Text range selected
      if (text) {
        const currentText = editor.state.doc.textBetween(from, to, ' ');
        if (text !== currentText) {
          editor
            .chain()
            .focus()
            .insertContentAt(
              { from, to },
              {
                type: 'text',
                text,
                marks: [{ type: 'link', attrs: { href: url } }]
              }
            )
            .run();
          return;
        }
      }
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const handleRemoveLink = () => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    setHoveredLink(null);
    setLinkHoverPosition(null);
  };

  const handleRemoveLinkFromHover = () => {
    if (!editor) return;
    if (hoveredLink?.pos !== undefined) {
      editor.chain().setTextSelection(hoveredLink.pos).extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    }
    setHoveredLink(null);
    setLinkHoverPosition(null);
  };

  const handleEditLinkFromHover = () => {
    if (!editor || !hoveredLink) return;
    if (hoveredLink.pos !== undefined) {
      editor.chain().setTextSelection(hoveredLink.pos).extendMarkRange('link').run();
    }
    handleOpenLinkModal(hoveredLink.url, hoveredLink.text);
  };

  // Find & Replace and Image states
  const [isFindReplaceOpen, setIsFindReplaceOpen] = useState(false);
  const [showReplaceInBar, setShowReplaceInBar] = useState(false);
  const [isInsertImageOpen, setIsInsertImageOpen] = useState(false);

  // Footnote actions
  const handleInsertFootnote = () => {
    if (!editor || !document) return;
    const currentFootnotes = document.footnotes || [];
    const fnId = `fn-${Date.now()}`;

    // Calculate sequential number based on position in document
    const { from } = editor.state.selection;
    let countBefore = 0;
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'footnote' && pos < from) {
        countBefore++;
      }
    });
    const nextNum = countBefore + 1;

    // Insert footnote reference node in TipTap editor at cursor
    editor
      .chain()
      .focus()
      .insertContent([
        {
          type: 'footnote',
          attrs: { id: fnId, number: nextNum },
        },
        {
          type: 'text',
          text: ' ',
        },
      ])
      .run();

    const newFootnote: Footnote = {
      id: fnId,
      number: nextNum,
      content: '',
    };

    const updated = [
      ...currentFootnotes.slice(0, countBefore),
      newFootnote,
      ...currentFootnotes.slice(countBefore),
    ].map((f, i) => ({
      ...f,
      number: i + 1,
    }));
    onUpdateFootnotes?.(updated);

    // Sync node numbers in editor
    setTimeout(() => {
      let tr = editor.state.tr;
      editor.state.doc.descendants((node, pos) => {
        if (node.type.name === 'footnote') {
          const match = updated.find(f => f.id === node.attrs.id);
          if (match && match.number !== node.attrs.number) {
            tr = tr.setNodeMarkup(pos, undefined, { ...node.attrs, number: match.number });
          }
        }
      });
      if (tr.docChanged) {
        editor.view.dispatch(tr);
      }
    }, 50);

    // Scroll down to the new footnote textarea at the bottom of the page
    setTimeout(() => {
      const el = window.document.getElementById(`footnote-${fnId}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const ta = el?.querySelector('textarea');
      ta?.focus();
    }, 200);
  };

  const handleUpdateFootnote = (id: string, content: string) => {
    if (!document) return;
    const current = document.footnotes || [];
    const updated = current.map(f => f.id === id ? { ...f, content } : f);
    onUpdateFootnotes?.(updated);
  };

  const handleDeleteFootnote = (id: string) => {
    if (!document || !editor) return;
    const current = document.footnotes || [];
    const filtered = current.filter(f => f.id !== id);
    const renumbered = filtered.map((f, i) => ({ ...f, number: i + 1 }));
    onUpdateFootnotes?.(renumbered);

    // Delete footnote node in editor document and update numbers
    let tr = editor.state.tr;
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'footnote') {
        if (node.attrs.id === id) {
          tr = tr.delete(pos, pos + node.nodeSize);
        } else {
          const match = renumbered.find(f => f.id === node.attrs.id);
          if (match && match.number !== node.attrs.number) {
            tr = tr.setNodeMarkup(pos, undefined, { ...node.attrs, number: match.number });
          }
        }
      }
    });
    if (tr.docChanged) {
      editor.view.dispatch(tr);
    }
  };

  const handleJumpToFootnoteInText = (id: string) => {
    const ref = editorContainerRef.current?.querySelector(`[data-fn="${id}"]`);
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (ref as HTMLElement).classList.add('bg-folia-200');
      setTimeout(() => (ref as HTMLElement).classList.remove('bg-folia-200'), 1500);
    }
  };

  // Click on footnote reference in editor jumps down to footnote textarea
  useEffect(() => {
    const handleContainerClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('.folia-fn-ref');
      if (target) {
        const fnId = target.getAttribute('data-fn');
        if (fnId) {
          const el = window.document.getElementById(`footnote-${fnId}`);
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const ta = el?.querySelector('textarea');
          ta?.focus();
        }
      }
    };
    const container = editorContainerRef.current;
    container?.addEventListener('click', handleContainerClick);
    return () => {
      container?.removeEventListener('click', handleContainerClick);
    };
  }, []);

  // Keyboard shortcuts: Ctrl + Enter (page break), Ctrl + K (link), Ctrl + F (find), Ctrl + H (find & replace), Ctrl + Alt + F (footnote)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleInsertPageBreak();
        } else if (e.altKey && e.key.toLowerCase() === 'f') {
          e.preventDefault();
          handleInsertFootnote();
        } else if (e.key.toLowerCase() === 'k') {
          e.preventDefault();
          handleOpenLinkModal();
        } else if (e.key.toLowerCase() === 'f') {
          e.preventDefault();
          setIsFindReplaceOpen(true);
          setShowReplaceInBar(false);
        } else if (e.key.toLowerCase() === 'h') {
          e.preventDefault();
          setIsFindReplaceOpen(true);
          setShowReplaceInBar(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor, document]);

  // Comments & Track changes states
  const [isCommentsDrawerOpen, setIsCommentsDrawerOpen] = useState(false);
  const [selectedTextForComment, setSelectedTextForComment] = useState('');
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const commentSelectionRangeRef = useRef<{ from: number; to: number } | null>(null);
  const [isTrackingChanges, setIsTrackingChanges] = useState(false);

  // Comments actions
  const handleAddComment = (text: string, quotedText?: string) => {
    if (!document || !editor) return;
    const commentId = `comment-${Date.now()}`;
    const newComment: DocumentComment = {
      id: commentId,
      text,
      quotedText: quotedText || '',
      author: defaultAuthor || 'Autore',
      createdAt: new Date().toISOString(),
      resolved: false
    };

    // Apply mark to text if selection range is known, or search quotedText
    const range = commentSelectionRangeRef.current;
    if (range && range.from < range.to) {
      editor.chain().setTextSelection(range).setComment({ commentId, resolved: false }).run();
    } else if (quotedText) {
      const doc = editor.state.doc;
      let foundPos = -1;
      doc.descendants((node, pos) => {
        if (foundPos === -1 && node.isText && node.text && node.text.includes(quotedText)) {
          foundPos = pos + node.text.indexOf(quotedText);
        }
      });
      if (foundPos !== -1) {
        editor.chain().setTextSelection({ from: foundPos, to: foundPos + quotedText.length }).setComment({ commentId, resolved: false }).run();
      }
    }

    const current = document.comments || [];
    const updated = [...current, newComment];
    onUpdateComments?.(updated);
    setSelectedTextForComment('');
    commentSelectionRangeRef.current = null;
    setActiveCommentId(commentId);
  };

  const handleToggleResolveComment = (id: string) => {
    if (!document || !editor) return;
    const current = document.comments || [];
    const targetComment = current.find(c => c.id === id);
    const newResolved = targetComment ? !targetComment.resolved : false;

    // Update mark attributes in doc
    const tr = editor.state.tr;
    editor.state.doc.descendants((node, pos) => {
      if (node.isText && node.marks) {
        node.marks.forEach(mark => {
          if (mark.type.name === 'comment' && mark.attrs.commentId === id) {
            tr.removeMark(pos, pos + node.nodeSize, mark);
            tr.addMark(pos, pos + node.nodeSize, editor.schema.marks.comment.create({ commentId: id, resolved: newResolved }));
          }
        });
      }
    });
    editor.view.dispatch(tr);

    const updated = current.map(c => c.id === id ? { ...c, resolved: newResolved } : c);
    onUpdateComments?.(updated);
  };

  const handleDeleteComment = (id: string) => {
    if (!document || !editor) return;
    // Remove mark from editor
    editor.commands.unsetComment(id);

    const current = document.comments || [];
    const updated = current.filter(c => c.id !== id);
    onUpdateComments?.(updated);
    if (activeCommentId === id) {
      setActiveCommentId(null);
    }
  };

  const handleJumpToCommentInText = (comment: DocumentComment) => {
    if (!editor) return;
    setActiveCommentId(comment.id);

    // 1. Try to find mark by data-comment-id in DOM
    let el = editor.view.dom.querySelector(`[data-comment-id="${comment.id}"]`) as HTMLElement | null;

    // 2. If not found by mark, but comment has quotedText, find it in the doc and apply mark
    if (!el && comment.quotedText) {
      const doc = editor.state.doc;
      let foundPos = -1;
      doc.descendants((node, pos) => {
        if (foundPos === -1 && node.isText && node.text && node.text.includes(comment.quotedText)) {
          foundPos = pos + node.text.indexOf(comment.quotedText);
        }
      });
      if (foundPos !== -1) {
        editor.chain().setTextSelection({ from: foundPos, to: foundPos + comment.quotedText.length }).setComment({ commentId: comment.id, resolved: comment.resolved }).run();
        el = editor.view.dom.querySelector(`[data-comment-id="${comment.id}"]`) as HTMLElement | null;
      }
    }

    // 3. Highlight and scroll
    if (el) {
      // Clear active classes from other comment marks
      editor.view.dom.querySelectorAll('.folia-comment-active').forEach(item => {
        item.classList.remove('folia-comment-active');
      });

      // Add active pulse class
      el.classList.add('folia-comment-active');

      // Scroll smoothly to center in scrollable parent
      let scrollParent: HTMLElement | null = el.parentElement;
      while (scrollParent) {
        const style = window.getComputedStyle(scrollParent);
        if (style.overflowY === 'auto' || style.overflowY === 'scroll') break;
        scrollParent = scrollParent.parentElement;
      }
      if (scrollParent) {
        const elemRect = el.getBoundingClientRect();
        const parentRect = scrollParent.getBoundingClientRect();
        const offsetTop = elemRect.top - parentRect.top + scrollParent.scrollTop;
        const targetScroll = offsetTop - parentRect.height / 2 + elemRect.height / 2;
        scrollParent.scrollTo({ top: targetScroll, behavior: 'smooth' });
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Select the comment in editor
      editor.state.doc.descendants((node, pos) => {
        if (node.isText && node.marks) {
          if (node.marks.some(m => m.type.name === 'comment' && m.attrs.commentId === comment.id)) {
            editor.chain().setTextSelection({ from: pos, to: pos + node.nodeSize }).run();
            return false;
          }
        }
      });
    }
  };

  // Track changes: accept & reject all
  const handleAcceptAllChanges = () => {
    if (!editor) return;
    const tr = editor.state.tr;
    const doc = editor.state.doc;
    const deletionRanges: { from: number; to: number }[] = [];
    const insertionRanges: { from: number; to: number }[] = [];

    doc.descendants((node, pos) => {
      if (node.isText && node.marks) {
        if (node.marks.some(m => m.type.name === 'deletion')) {
          deletionRanges.push({ from: pos, to: pos + node.nodeSize });
        }
        if (node.marks.some(m => m.type.name === 'insertion')) {
          insertionRanges.push({ from: pos, to: pos + node.nodeSize });
        }
      }
    });

    // Remove deletion text (from bottom to top)
    deletionRanges.sort((a, b) => b.from - a.from).forEach(r => {
      tr.delete(r.from, r.to);
    });

    // Unset insertion mark from inserted text
    insertionRanges.forEach(r => {
      tr.removeMark(r.from, r.to, editor.schema.marks.insertion);
    });

    editor.view.dispatch(tr);
  };

  const handleRejectAllChanges = () => {
    if (!editor) return;
    const tr = editor.state.tr;
    const doc = editor.state.doc;
    const deletionRanges: { from: number; to: number }[] = [];
    const insertionRanges: { from: number; to: number }[] = [];

    doc.descendants((node, pos) => {
      if (node.isText && node.marks) {
        if (node.marks.some(m => m.type.name === 'insertion')) {
          insertionRanges.push({ from: pos, to: pos + node.nodeSize });
        }
        if (node.marks.some(m => m.type.name === 'deletion')) {
          deletionRanges.push({ from: pos, to: pos + node.nodeSize });
        }
      }
    });

    // Remove insertion text (from bottom to top)
    insertionRanges.sort((a, b) => b.from - a.from).forEach(r => {
      tr.delete(r.from, r.to);
    });

    // Unset deletion mark from deleted text (restoring it as normal text)
    deletionRanges.forEach(r => {
      tr.removeMark(r.from, r.to, editor.schema.marks.deletion);
    });

    editor.view.dispatch(tr);
  };

  // Determine the active font size based on current focus or cursor position
  const activeFontSize = useMemo(() => {
    if (isTitleFocused) {
      return titleFontSize || document?.titleFontSize || 26;
    }
    if (!editor) return fontSize;

    // 1. If text has a custom inline fontSize mark, show that
    const customFontSizeAttr = editor.getAttributes('textStyle').fontSize;
    if (customFontSizeAttr) {
      const parsed = parseInt(customFontSizeAttr, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }

    // 2. If inside heading, show heading size
    if (editor.isActive('heading', { level: 1 })) return 24;
    if (editor.isActive('heading', { level: 2 })) return 18;
    if (editor.isActive('heading', { level: 3 })) return 15;

    // 3. Otherwise standard body font size
    return fontSize;
  }, [isTitleFocused, titleFontSize, document?.titleFontSize, fontSize, editor?.state.selection]);

  const handleToolbarFontSizeChange = (newSize: number) => {
    if (isTitleFocused) {
      if (onChangeTitleFontSize) {
        onChangeTitleFontSize(newSize);
      }
      return;
    }

    if (!editor) {
      onChangeFontSize(newSize);
      return;
    }

    const { from, to } = editor.state.selection;
    if (from !== to) {
      // User has selected text -> apply font size to selection (just like Word!)
      editor.chain().focus().setFontSize(`${newSize}pt`).run();
    } else if (editor.isActive('heading')) {
      // Cursor is inside a heading -> apply font size to heading
      editor.chain().focus().setFontSize(`${newSize}pt`).run();
    } else {
      // Normal body text -> update base font size
      onChangeFontSize(newSize);
    }
  };

  // Real-time Text Statistics (Words, Characters with & without spaces, Cartelle, Selection)
  const [isWordCountModalOpen, setIsWordCountModalOpen] = useState(false);
  const [isCustomMarginsModalOpen, setIsCustomMarginsModalOpen] = useState(false);

  const textStats: TextStats = useMemo(() => {
    if (!editor) {
      return {
        words: 0,
        charsWithSpaces: 0,
        charsNoSpaces: 0,
        paragraphs: 0,
        pages: totalDisplayPages,
        cartelle: 0,
        readingTimeMinutes: 0,
      };
    }

    const words = editor.storage.characterCount?.words() || 0;
    const text = editor.state.doc.textBetween(0, editor.state.doc.content.size, ' ', ' ');
    const charsWithSpaces = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    
    // Count paragraphs
    let paragraphs = 0;
    editor.state.doc.descendants((node) => {
      if (node.isBlock && (node.type.name === 'paragraph' || node.type.name.startsWith('heading'))) {
        paragraphs++;
      }
    });

    const cartelle = charsWithSpaces / 1800;
    const readingTimeMinutes = Math.max(1, Math.ceil(words / 220));

    return {
      words,
      charsWithSpaces,
      charsNoSpaces,
      paragraphs: Math.max(paragraphs, 1),
      pages: totalDisplayPages,
      cartelle,
      readingTimeMinutes,
    };
  }, [editor?.state.doc, totalDisplayPages]);

  // Selection statistics (when user highlights text, exactly like Word & Google Docs)
  const selectionStats: SelectionStats = useMemo(() => {
    if (!editor) {
      return { hasSelection: false, words: 0, charsWithSpaces: 0, charsNoSpaces: 0, paragraphs: 0 };
    }

    const { from, to } = editor.state.selection;
    if (from === to) {
      return { hasSelection: false, words: 0, charsWithSpaces: 0, charsNoSpaces: 0, paragraphs: 0 };
    }

    const selectedText = editor.state.doc.textBetween(from, to, ' ', ' ');
    const words = selectedText.trim().split(/\s+/).filter(Boolean).length;
    const charsWithSpaces = selectedText.length;
    const charsNoSpaces = selectedText.replace(/\s/g, '').length;

    // Paragraphs within selection
    let paragraphs = 0;
    editor.state.doc.nodesBetween(from, to, (node) => {
      if (node.isBlock && (node.type.name === 'paragraph' || node.type.name.startsWith('heading'))) {
        paragraphs++;
      }
    });

    return {
      hasSelection: true,
      words,
      charsWithSpaces,
      charsNoSpaces,
      paragraphs: Math.max(paragraphs, 1),
    };
  }, [editor?.state.selection]);

  // Global shortcut Ctrl+Shift+C / Cmd+Shift+C to toggle Word Count
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        setIsWordCountModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Set up hover listener on editor content DOM for interlinks and web links
  useEffect(() => {
    const container = editorContainerRef.current;
    const scrollEl = scrollContainerRef.current;
    if (!container) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.folia-link-hover-card')) {
        isLinkCardHoveredRef.current = true;
        if (linkHoverTimeoutRef.current) clearTimeout(linkHoverTimeoutRef.current);
        return;
      }
      if (target.closest('.folia-interlink-card')) {
        isCardHoveredRef.current = true;
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        return;
      }

      // 1. Interlink hover inside editor content
      const interlinkTarget = target.closest('.ProseMirror .folia-interlink') as HTMLElement | null;
      if (interlinkTarget) {
        const id = interlinkTarget.getAttribute('data-entity-id');
        const type = interlinkTarget.getAttribute('data-entity-type') as 'character' | 'world';
        const name = interlinkTarget.getAttribute('data-entity-name') || '';
        if (id && type) {
          if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
          const rect = interlinkTarget.getBoundingClientRect();
          const hasSelection = editor && !editor.state.selection.empty;
          const spaceBelow = window.innerHeight - rect.bottom;
          const spaceAbove = rect.top;

          // When text is selected, the black BubbleMenu (formatting/comments) appears ABOVE the selection.
          // Positioning the entity hover card BELOW ensures the two floating menus will NEVER collide or overlap!
          let placement: 'top' | 'bottom' = 'bottom';
          if (hasSelection) {
            placement = (spaceBelow >= 180 || spaceBelow >= spaceAbove) ? 'bottom' : 'top';
          } else {
            placement = (spaceBelow >= 220 || spaceBelow >= spaceAbove) ? 'bottom' : 'top';
          }

          setHoverPlacement(placement);
          setHoverPosition({
            x: rect.left + rect.width / 2,
            y: placement === 'bottom' ? rect.bottom : rect.top,
          });
          setHoveredEntity({ id, type, name });
        }
      }

      // 2. Web hyperlink hover inside editor content
      const linkTarget = target.closest('.ProseMirror a.folia-link, .ProseMirror a[href]') as HTMLAnchorElement | null;
      if (linkTarget && !linkTarget.classList.contains('folia-interlink')) {
        const href = linkTarget.getAttribute('href');
        if (href) {
          if (linkHoverTimeoutRef.current) clearTimeout(linkHoverTimeoutRef.current);
          const rect = linkTarget.getBoundingClientRect();
          const pos = editor?.view ? editor.view.posAtDOM(linkTarget, 0) : undefined;
          setLinkHoverPosition({
            x: rect.left + rect.width / 2,
            y: rect.top,
          });
          setHoveredLink({
            url: href,
            text: linkTarget.textContent || '',
            pos,
          });
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.folia-link-hover-card, .folia-interlink-card')) {
        return;
      }

      // 1. Interlink mouseout
      const interlinkTarget = target.closest('.ProseMirror .folia-interlink');
      if (interlinkTarget) {
        hoverTimeoutRef.current = setTimeout(() => {
          if (!isCardHoveredRef.current) {
            setHoveredEntity(null);
            setHoverPosition(null);
          }
        }, 200);
      }

      // 2. Web hyperlink mouseout
      const linkTarget = target.closest('.ProseMirror a.folia-link, .ProseMirror a[href]');
      if (linkTarget && !linkTarget.classList.contains('folia-interlink')) {
        linkHoverTimeoutRef.current = setTimeout(() => {
          if (!isLinkCardHoveredRef.current) {
            setHoveredLink(null);
            setLinkHoverPosition(null);
          }
        }, 350);
      }
    };

    const handleScroll = () => {
      if (!isCardHoveredRef.current) {
        setHoveredEntity(null);
        setHoverPosition(null);
      }
      if (!isLinkCardHoveredRef.current) {
        setHoveredLink(null);
        setLinkHoverPosition(null);
      }
    };

    container.addEventListener('mouseover', handleMouseOver);
    container.addEventListener('mouseout', handleMouseOut);
    scrollEl?.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('mouseover', handleMouseOver);
      container.removeEventListener('mouseout', handleMouseOut);
      scrollEl?.removeEventListener('scroll', handleScroll);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (linkHoverTimeoutRef.current) clearTimeout(linkHoverTimeoutRef.current);
    };
  }, [editor]);

  const currentHoveredChar = useMemo(() => {
    if (hoveredEntity?.type === 'character') {
      return characters.find(c => c.id === hoveredEntity.id);
    }
    return undefined;
  }, [hoveredEntity, characters]);

  const currentHoveredWorld = useMemo(() => {
    if (hoveredEntity?.type === 'world') {
      return worldbuilding.find(w => w.id === hoveredEntity.id);
    }
    return undefined;
  }, [hoveredEntity, worldbuilding]);

  const handleNavigate = (type: 'character' | 'world', id: string) => {
    setHoveredEntity(null);
    setHoverPosition(null);
    if (type === 'character') {
      onNavigateToCharacter(id);
    } else {
      onNavigateToWorld(id);
    }
  };

  if (!document) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-paper-100 text-paper-500 p-8 select-none">
        <FileText className="w-12 h-12 text-paper-300 mb-3 stroke-[1.5]" />
        <h3 className="font-brand font-bold text-lg text-paper-700">Nessun capitolo selezionato</h3>
        <p className="text-xs text-paper-400 mt-1">Seleziona o crea un capitolo dalla barra laterale per iniziare a scrivere</p>
      </div>
    );
  }

  // Calculate sheet dimensions and padding based on PageFormat and Margins
  const formatClasses = useMemo(() => {
    switch (pageFormat) {
      case 'a4':
        return 'max-w-[800px] my-6 bg-white shadow-page border border-paper-250/70 rounded-md';
      case 'novel':
        return 'max-w-[620px] my-6 bg-[#FCFCFA] shadow-page border border-paper-250/70 rounded-md';
      case 'cartella':
        return 'max-w-[760px] my-6 bg-[#FEFEFD] shadow-page border border-folia-200/60 rounded-md';
      case 'letter':
        return 'max-w-[820px] my-6 bg-white shadow-page border border-paper-250/70 rounded-md';
      case 'continuous':
      default:
        return 'max-w-[840px] min-h-full py-8 px-8 bg-transparent';
    }
  }, [pageFormat]);

  const pageMetrics = useMemo(() => {
    return getPageMetrics(pageFormat, pageMargins, customMargins);
  }, [pageFormat, pageMargins, customMargins]);

  const horizontalPadding = useMemo(() => {
    if (pageFormat === 'continuous') return { left: '1.5rem', right: '1.5rem' };
    return {
      left: `${pageMetrics.leftMarginPx}px`,
      right: `${pageMetrics.rightMarginPx}px`,
    };
  }, [pageFormat, pageMetrics.leftMarginPx, pageMetrics.rightMarginPx]);

  // Font family inline styling for body text
  const getFontFamilyStyle = (font: FontFamily) => {
    switch (font) {
      case 'Times New Roman': return '"Times New Roman", Times, "Liberation Serif", serif';
      case 'Garamond': return '"EB Garamond", Garamond, "Cormorant Garamond", Georgia, serif';
      case 'Georgia': return 'Georgia, "Times New Roman", serif';
      case 'Baskerville': return '"Libre Baskerville", Baskerville, Georgia, serif';
      case 'Palatino': return '"Palatino Linotype", "Book Antiqua", Palatino, serif';
      case 'Book Antiqua': return '"Book Antiqua", "Palatino Linotype", Palatino, serif';
      case 'Lora': return '"Lora", Georgia, serif';
      case 'Merriweather': return '"Merriweather", Georgia, serif';
      case 'Spectral': return '"Spectral", Georgia, serif';
      case 'Crimson Pro': return '"Crimson Pro", "Crimson Text", Garamond, serif';
      case 'Cormorant Garamond': return '"Cormorant Garamond", Garamond, serif';
      case 'Libre Caslon Text': return '"Libre Caslon Text", Caslon, Georgia, serif';
      case 'Cinzel': return '"Cinzel", Georgia, serif';
      case 'Playfair Display': return '"Playfair Display", Georgia, serif';
      case 'Plus Jakarta Sans': return '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif';
      case 'Inter': return '"Inter", -apple-system, BlinkMacSystemFont, sans-serif';
      case 'Outfit': return '"Outfit", "Plus Jakarta Sans", sans-serif';
      case 'Montserrat': return '"Montserrat", sans-serif';
      case 'Raleway': return '"Raleway", sans-serif';
      case 'Arial': return 'Arial, Helvetica, sans-serif';
      case 'Verdana': return 'Verdana, Geneva, sans-serif';
      case 'Calibri': return 'Calibri, "Segoe UI", sans-serif';
      case 'Courier New': return '"Courier New", Courier, monospace';
      case 'Courier Prime': return '"Courier Prime", "Courier New", monospace';
      case 'JetBrains Mono': return '"JetBrains Mono", Consolas, monospace';
      case 'Consolas': return 'Consolas, "Courier New", monospace';
      default: return '"EB Garamond", Garamond, "Times New Roman", serif';
    }
  };

  // Dynamic total sheet height: guarantees every page gets full physical sheet height
  const sheetMinHeight = useMemo(() => {
    if (pageFormat === 'continuous') return undefined;
    const gapHeight = 36;
    return `${totalDisplayPages * pageMetrics.sheetHeight + (totalDisplayPages - 1) * gapHeight}px`;
  }, [pageFormat, totalDisplayPages, pageMetrics.sheetHeight]);

  // Format page number label
  const getPageNumberText = (pageNum: number = 1) => {
    switch (pageNumberFormat) {
      case 'page_x_of_y':
        return `Pagina ${pageNum} di ${totalDisplayPages}`;
      case 'dashes':
        return `— ${pageNum} —`;
      case 'simple':
      default:
        return `${pageNum}`;
    }
  };

  // Alignment classes for header/footer page numbers
  const getPageNumberAlignClass = (pos: PageNumberPosition) => {
    if (pos.includes('left')) return 'justify-start text-left';
    if (pos.includes('center')) return 'justify-center text-center';
    return 'justify-end text-right';
  };

  const isTopNumber = showPageNumbers && pageFormat !== 'continuous' && pageNumberPosition.startsWith('top');
  const isBottomNumber = showPageNumbers && pageFormat !== 'continuous' && pageNumberPosition.startsWith('bottom');

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F7F6F3] overflow-hidden relative" ref={editorContainerRef}>
      {/* Floating Exit Focus Button */}
      {isFocusMode && (
        <button
          onClick={onExitFocusMode}
          title="Esci dalla modalità a schermo intero (Esc)"
          className="fixed top-4 right-6 z-50 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-paper-900/80 hover:bg-paper-900 text-paper-50 backdrop-blur-md text-xs font-medium shadow-lg transition-all opacity-40 hover:opacity-100 group cursor-pointer"
        >
          <Minimize2 className="w-3.5 h-3.5" />
          <span>Esci dal Focus (Esc)</span>
        </button>
      )}

      {/* Editor Toolbar */}
      {!isFocusMode && (
        <EditorToolbar
          editor={editor}
          fontFamily={isTitleFocused ? headingFontFamily : fontFamily}
          onChangeFontFamily={(f) => {
            if (isTitleFocused) {
              onChangeHeadingFontFamily(f);
            } else {
              onChangeFontFamily(f);
            }
          }}
          headingFontFamily={headingFontFamily}
          onChangeHeadingFontFamily={onChangeHeadingFontFamily}
          fontSize={fontSize}
          activeFontSize={activeFontSize}
          onChangeFontSize={handleToolbarFontSizeChange}
          pageFormat={pageFormat}
          onChangePageFormat={onChangePageFormat}
          pageMargins={pageMargins}
          onChangePageMargins={onChangePageMargins}
          customMargins={customMargins}
          onOpenCustomMargins={() => setIsCustomMarginsModalOpen(true)}
          firstLineIndent={firstLineIndent}
          onChangeFirstLineIndent={onChangeFirstLineIndent}
          paragraphSpacing={paragraphSpacing}
          onChangeParagraphSpacing={onChangeParagraphSpacing}
          hyphenation={hyphenation}
          onToggleHyphenation={onToggleHyphenation}
          spellcheck={spellcheck}
          onToggleSpellcheck={onToggleSpellcheck}
          showPageNumbers={showPageNumbers}
          onTogglePageNumbers={onTogglePageNumbers}
          pageNumberPosition={pageNumberPosition}
          onChangePageNumberPosition={onChangePageNumberPosition}
          pageNumberFormat={pageNumberFormat}
          onChangePageNumberFormat={onChangePageNumberFormat}
          onInsertPageBreak={handleInsertPageBreak}
          onOpenSpecialChars={onOpenSpecialChars}
          onOpenLink={() => handleOpenLinkModal()}
          onOpenFindReplace={(showReplace) => {
            setIsFindReplaceOpen(true);
            setShowReplaceInBar(!!showReplace);
          }}
          onOpenInsertImage={() => setIsInsertImageOpen(true)}
          onInsertFootnote={handleInsertFootnote}
          isCommentsOpen={isCommentsDrawerOpen}
          onToggleComments={() => {
            if (!isCommentsDrawerOpen && editor) {
              const { from, to } = editor.state.selection;
              if (from < to) {
                const text = editor.state.doc.textBetween(from, to, ' ');
                setSelectedTextForComment(text);
                commentSelectionRangeRef.current = { from, to };
              } else {
                setSelectedTextForComment('');
                commentSelectionRangeRef.current = null;
              }
            }
            setIsCommentsDrawerOpen(!isCommentsDrawerOpen);
          }}
          commentsCount={document?.comments?.filter(c => !c.resolved).length || 0}
          isTrackingChanges={isTrackingChanges}
          onToggleTrackChanges={() => setIsTrackingChanges(!isTrackingChanges)}
          onAcceptAllChanges={handleAcceptAllChanges}
          onRejectAllChanges={handleRejectAllChanges}
          onOpenWordCount={() => setIsWordCountModalOpen(true)}
          isTitleFocused={isTitleFocused}
          titleAlignment={document?.titleAlignment || titleAlignment || 'left'}
          onChangeTitleAlignment={(align) => {
            if (onChangeTitleAlignment) {
              onChangeTitleAlignment(align);
            }
            if (document) {
              onUpdateDocument({ ...document, titleAlignment: align });
            }
          }}
          t={t}
        />
      )}

      {/* Editor & Comments Flex Container */}
      <div className="flex-1 overflow-hidden flex flex-row relative">
        {/* Main Page Canvas */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto flex justify-center items-start px-4 bg-[#F7F6F3]"
        >
        <div 
          className={`w-full ${formatClasses} transition-[max-width] duration-150 relative flex flex-col`}
          style={{
            minHeight: sheetMinHeight,
            fontFamily: getFontFamilyStyle(fontFamily),
            fontSize: `${fontSize}pt`,
            lineHeight: lineHeight,
            hyphens: hyphenation ? 'manual' : 'none',
            WebkitHyphens: hyphenation ? 'manual' : 'none',
            paddingLeft: horizontalPadding.left,
            paddingRight: horizontalPadding.right,
            paddingTop: pageFormat === 'continuous' ? '2rem' : `${pageMetrics.topMarginPx}px`,
            paddingBottom: pageFormat === 'continuous' ? '2rem' : '0px',
            ['--sheet-pad-left' as any]: horizontalPadding.left,
            ['--sheet-pad-right' as any]: horizontalPadding.right,
            ['--sheet-pad-top' as any]: `${pageMetrics.topMarginPx}px`,
            ['--sheet-pad-bottom' as any]: `${pageMetrics.bottomMarginPx}px`,
          }}
          lang="it"
        >
          <div className="flex-1 flex flex-col">
            <div>
              {/* Top Page Number Header (if configured) */}
            {isTopNumber && (
              <div className={`mb-6 pb-2.5 border-b border-paper-300/70 flex items-center text-xs font-serif font-medium text-paper-700 select-none ${getPageNumberAlignClass(pageNumberPosition)}`}>
                <span className="tracking-wide">{getPageNumberText()}</span>
              </div>
            )}

            {/* Document Title Header */}
            <div className="mb-6 pb-4 border-b border-paper-200 relative group">
              <input
                type="text"
                value={document.title}
                onChange={(e) => onUpdateTitle(e.target.value)}
                onFocus={() => setIsTitleFocused(true)}
                onClick={() => setIsTitleFocused(true)}
                placeholder="Titolo del capitolo..."
                style={{
                  fontFamily: getFontFamilyStyle(headingFontFamily),
                  fontSize: `${titleFontSize || document.titleFontSize || 26}pt`,
                  textAlign: (document.titleAlignment || titleAlignment || 'left') as any,
                }}
                className={`w-full font-bold text-black bg-transparent border-none focus:outline-hidden placeholder-paper-300 tracking-tight transition-all duration-150 ${
                  (document.titleAlignment || titleAlignment) === 'center'
                    ? 'text-center'
                    : (document.titleAlignment || titleAlignment) === 'right'
                    ? 'text-right'
                    : (document.titleAlignment || titleAlignment) === 'justify'
                    ? 'text-justify'
                    : 'text-left'
                }`}
              />
            </div>

            {/* Floating Bubble Menu on selection (hidden when inside a table or when modals are open) */}
            {editor && (
              <BubbleMenu
                editor={editor}
                shouldShow={({ editor }) => 
                  !editor.isActive('table') && 
                  !editor.state.selection.empty && 
                  !isLinkModalOpen && 
                  !isWordCountModalOpen && 
                  !isInsertImageOpen && 
                  !isCustomMarginsModalOpen
                }
                tippyOptions={{ 
                  duration: 100, 
                  zIndex: 40,
                  placement: 'top',
                  offset: [0, 8]
                }}
                className="flex items-center gap-1 bg-paper-900 text-paper-50 px-2 py-1 rounded-xl shadow-lg text-xs"
              >
                <button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-1 rounded ${editor.isActive('bold') ? 'bg-folia-700 text-white' : 'hover:bg-paper-800'}`}
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-1 rounded ${editor.isActive('italic') ? 'bg-folia-700 text-white' : 'hover:bg-paper-800'}`}
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={`p-1 rounded ${editor.isActive('underline') ? 'bg-folia-700 text-white' : 'hover:bg-paper-800'}`}
                >
                  <UnderlineIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  className={`p-1 rounded ${editor.isActive('strike') ? 'bg-folia-700 text-white' : 'hover:bg-paper-800'}`}
                >
                  <Strikethrough className="w-3.5 h-3.5" />
                </button>
                <div className="w-[1px] h-3.5 bg-paper-700 mx-0.5" />
                <button
                  onClick={() => editor.chain().focus().toggleHighlight({ color: '#FEF08A' }).run()}
                  className={`p-1 rounded ${editor.isActive('highlight') ? 'bg-amber-400 text-paper-950 font-bold' : 'hover:bg-paper-800 text-paper-200'}`}
                  title="Evidenzia testo"
                >
                  <Highlighter className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleOpenLinkModal()}
                  className={`p-1 rounded ${editor.isActive('link') ? 'bg-folia-700 text-white font-bold' : 'hover:bg-paper-800 text-paper-200'}`}
                  title="Collega indirizzo web (Ctrl+K)"
                >
                  <Link2 className="w-3.5 h-3.5" />
                </button>
                {editor.isActive('link') && (
                  <button
                    onClick={() => {
                      const href = editor.getAttributes('link').href;
                      if (href) {
                        if ((window as any).foliaAPI?.openExternal) {
                          (window as any).foliaAPI.openExternal(href);
                        } else {
                          window.open(href, '_blank');
                        }
                      }
                    }}
                    className="p-1 rounded hover:bg-paper-800 text-folia-300"
                    title="Apri nel browser"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
                <div className="w-[1px] h-3.5 bg-paper-700 mx-0.5" />
                <button
                  onClick={() => {
                    const { from, to } = editor.state.selection;
                    const text = editor.state.doc.textBetween(from, to, ' ');
                    setSelectedTextForComment(text);
                    commentSelectionRangeRef.current = { from, to };
                    setIsCommentsDrawerOpen(true);
                  }}
                  className="p-1 rounded hover:bg-paper-800 text-amber-300"
                  title="Aggiungi commento sulla selezione"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>
              </BubbleMenu>
            )}

            {/* Floating Table Toolbar when inside table */}
            {editor && (
              <BubbleMenu
                editor={editor}
                shouldShow={({ editor }) => editor.isActive('table')}
                tippyOptions={{
                  duration: 150,
                  placement: 'top-start',
                  offset: [0, 8],
                  zIndex: 40,
                }}
                className="flex items-center gap-1 bg-paper-900/95 backdrop-blur-xs text-paper-50 px-2.5 py-1 rounded-xl shadow-xl border border-paper-700 text-xs select-none z-40"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-paper-300 pr-1.5 border-r border-paper-700">
                  <TableIcon className="w-3.5 h-3.5 text-folia-400" />
                  <span>Tabella</span>
                </div>

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                  className="px-1.5 py-0.5 rounded text-[11px] hover:bg-paper-800 text-paper-200 transition-colors cursor-pointer"
                  title="Aggiungi riga sotto"
                >
                  + Riga
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                  className="px-1.5 py-0.5 rounded text-[11px] hover:bg-paper-800 text-paper-200 transition-colors cursor-pointer"
                  title="Aggiungi colonna a destra"
                >
                  + Colonna
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().deleteRow().run()}
                  className="px-1.5 py-0.5 rounded text-[11px] hover:bg-paper-800 text-paper-300 hover:text-rose-300 transition-colors cursor-pointer"
                  title="Elimina riga corrente"
                >
                  − Riga
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                  className="px-1.5 py-0.5 rounded text-[11px] hover:bg-paper-800 text-paper-300 hover:text-rose-300 transition-colors cursor-pointer"
                  title="Elimina colonna corrente"
                >
                  − Colonna
                </button>

                <div className="w-[1px] h-3.5 bg-paper-700 mx-0.5" />

                {/* Primary Action: Delete Table directly from text */}
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor.chain().focus().deleteTable().run()}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-medium text-[11px] transition-colors shadow-2xs cursor-pointer"
                  title="Elimina l'intera tabella dal testo"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Elimina tabella</span>
                </button>
              </BubbleMenu>
            )}

            {/* TipTap Document Area with custom styling */}
            <style>{`
              .ProseMirror {
                font-family: ${getFontFamilyStyle(fontFamily)};
                font-size: ${fontSize}pt !important;
                line-height: ${lineHeight} !important;
                color: #000000 !important;
                hyphens: ${hyphenation ? 'auto' : 'manual'} !important;
                -webkit-hyphens: ${hyphenation ? 'auto' : 'manual'} !important;
                -ms-hyphens: ${hyphenation ? 'auto' : 'manual'} !important;
                hyphenate-limit-chars: 5 2 2 !important;
                word-break: normal;
                overflow-wrap: break-word;
              }
              .ProseMirror p, .ProseMirror li, .ProseMirror blockquote, .ProseMirror h1, .ProseMirror h2, .ProseMirror h3 {
                color: inherit;
              }
              .ProseMirror p {
                font-size: ${fontSize}pt !important;
                line-height: ${lineHeight} !important;
                text-indent: ${firstLineIndent}cm;
                margin-top: 0 !important;
                margin-bottom: ${paragraphSpacing === 'none' ? '0' : paragraphSpacing === 'tight' ? '0.35em' : paragraphSpacing === 'relaxed' ? '1.1em' : '0.65em'} !important;
                hyphens: ${hyphenation ? 'auto' : 'manual'} !important;
                -webkit-hyphens: ${hyphenation ? 'auto' : 'manual'} !important;
                -ms-hyphens: ${hyphenation ? 'auto' : 'manual'} !important;
                hyphenate-limit-chars: 5 2 2 !important;
              }
              .ProseMirror p[data-pagination-continuation="true"] {
                text-indent: 0 !important;
              }
              .ProseMirror li {
                font-size: ${fontSize}pt !important;
                line-height: ${lineHeight} !important;
                margin-top: 0 !important;
                margin-bottom: ${paragraphSpacing === 'none' ? '0' : paragraphSpacing === 'tight' ? '0.35em' : paragraphSpacing === 'relaxed' ? '1.1em' : '0.65em'} !important;
                hyphens: ${hyphenation ? 'auto' : 'manual'} !important;
                -webkit-hyphens: ${hyphenation ? 'auto' : 'manual'} !important;
                -ms-hyphens: ${hyphenation ? 'auto' : 'manual'} !important;
                hyphenate-limit-chars: 5 2 2 !important;
              }
              .ProseMirror blockquote {
                font-size: ${fontSize}pt !important;
                line-height: ${lineHeight} !important;
              }
              .ProseMirror h1 {
                font-family: ${getFontFamilyStyle(headingFontFamily)};
                font-size: calc(${fontSize}pt * 1.85) !important;
                line-height: 1.25 !important;
              }
              .ProseMirror h2 {
                font-family: ${getFontFamilyStyle(headingFontFamily)};
                font-size: calc(${fontSize}pt * 1.45) !important;
                line-height: 1.3 !important;
              }
              .ProseMirror h3 {
                font-family: ${getFontFamilyStyle(headingFontFamily)};
                font-size: calc(${fontSize}pt * 1.2) !important;
                line-height: 1.35 !important;
              }
              .folia-interlink {
                border-bottom-width: 1.5px;
                border-bottom-style: dotted;
                transition: all 0.15s ease-in-out;
                cursor: pointer;
                padding: 0;
                border-radius: 2px;
                box-decoration-break: clone;
                -webkit-box-decoration-break: clone;
              }
              .folia-interlink-character {
                border-bottom-color: rgba(46, 125, 50, 0.6);
                color: #1B4332;
              }
              .folia-interlink-character:hover {
                background-color: rgba(235, 247, 238, 0.85);
                border-bottom-color: #2E7D32;
              }
              .folia-interlink-world {
                border-bottom-color: rgba(180, 83, 9, 0.6);
                color: #78350F;
              }
              .folia-interlink-world:hover {
                background-color: rgba(254, 243, 199, 0.85);
                border-bottom-color: #B45309;
              }
              /* Realistic multi-sheet physical pagination */
              .folia-virtual-page-break, .folia-page-break {
                margin-left: calc(-1 * var(--sheet-pad-left, 3.5rem)) !important;
                margin-right: calc(-1 * var(--sheet-pad-right, 3.5rem)) !important;
                width: calc(100% + var(--sheet-pad-left, 3.5rem) + var(--sheet-pad-right, 3.5rem)) !important;
                user-select: none;
                pointer-events: none;
                display: block;
                clear: both;
              }
              .folia-virtual-page-break.inline-break {
                text-indent: 0 !important;
              }
              .folia-page-break-hyphen {
                display: inline-block !important;
                width: 0 !important;
                max-width: 0 !important;
                overflow: visible !important;
                white-space: nowrap !important;
                user-select: none !important;
                pointer-events: none !important;
                color: inherit !important;
                font-family: inherit !important;
                font-size: inherit !important;
                line-height: inherit !important;
              }
              .folia-page-bottom-footer {
                background: inherit;
                padding-left: var(--sheet-pad-left, 3.5rem);
                padding-right: var(--sheet-pad-right, 3.5rem);
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                border-bottom: 1px solid #E8E5DF;
                box-sizing: border-box;
              }
              .folia-page-desk-gap {
                height: 36px;
                background-color: #F7F6F3 !important;
                margin-left: -20px !important;
                margin-right: -20px !important;
                width: calc(100% + 40px) !important;
                border: none !important;
                box-shadow: none !important;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                z-index: 10;
              }
              .folia-page-badge {
                background-color: #FFFFFF;
                border: 1px solid #E2DFD7;
                padding: 2px 14px;
                border-radius: 9999px;
                font-size: 10px;
                font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
                font-weight: 600;
                color: #78716C;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                display: flex;
                align-items: center;
                gap: 5px;
              }
              .folia-page-top-header {
                background: inherit;
                padding-left: var(--sheet-pad-left, 3.5rem);
                padding-right: var(--sheet-pad-right, 3.5rem);
                border-top: 1px solid #E8E5DF;
                box-shadow: 0 -2px 5px -1px rgba(0, 0, 0, 0.04);
                box-sizing: border-box;
              }
              @media print {
                .folia-virtual-page-break, .folia-page-break {
                  page-break-after: always !important;
                  break-after: page !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  border: none !important;
                }
                .folia-page-desk-gap {
                  display: none !important;
                }
              }
              /* Elegant light folia-green underline for web hyperlinks */
              .ProseMirror a, .ProseMirror a.folia-link {
                color: #1B4332;
                text-decoration: underline;
                text-decoration-color: #86EFAC;
                text-decoration-thickness: 1.5px;
                text-underline-offset: 4px;
                transition: color 0.15s ease, text-decoration-color 0.15s ease;
                cursor: pointer;
              }
              .ProseMirror a:hover, .ProseMirror a.folia-link:hover {
                color: #0F291E;
                text-decoration-color: #2D6A4F;
              }

              /* Folia Table Styles */
              .ProseMirror .tableWrapper {
                margin: 1.5rem 0;
                overflow-x: auto;
                max-width: 100%;
              }
              .ProseMirror table,
              .ProseMirror table.folia-table {
                border-collapse: collapse;
                margin: 1.25rem auto;
                table-layout: fixed;
                width: 100%;
                overflow: hidden;
                border-radius: 0.5rem;
                border: 1.5px solid #CBD5E1;
                box-shadow: 0 1px 3px rgba(0,0,0,0.03);
              }
              .ProseMirror table td,
              .ProseMirror table th,
              .ProseMirror table.folia-table td,
              .ProseMirror table.folia-table th {
                min-width: 2.5em;
                min-height: 2.2em;
                border: 1px solid #CBD5E1;
                padding: 8px 12px;
                vertical-align: top;
                box-sizing: border-box;
                position: relative;
              }
              .ProseMirror table th,
              .ProseMirror table.folia-table th {
                font-weight: 600;
                text-align: left;
                background-color: #F1F5F9;
                color: #0F172A;
              }
              .ProseMirror table td,
              .ProseMirror table.folia-table td {
                background-color: #FFFFFF;
              }
              .ProseMirror table td p,
              .ProseMirror table th p {
                margin: 0 !important;
                padding: 0 !important;
                min-height: 1.25em;
                line-height: 1.4 !important;
              }
              .ProseMirror .selectedCell:after {
                z-index: 2;
                position: absolute;
                content: "";
                left: 0; right: 0; top: 0; bottom: 0;
                background: rgba(27, 67, 50, 0.12);
                pointer-events: none;
              }
              .ProseMirror .column-resize-handle {
                position: absolute;
                right: -2px;
                top: 0;
                bottom: -2px;
                width: 4px;
                background-color: #047857;
                pointer-events: none;
              }
              .ProseMirror.resize-cursor {
                cursor: col-resize;
              }

              /* Folia Image Styles */
              .ProseMirror img.folia-image {
                max-width: 100%;
                height: auto;
                border-radius: 0.75rem;
                border: 1px solid #E8E5DF;
                box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                margin: 1.5rem auto;
                display: block;
              }

              /* Footnote Reference Marker */
              .ProseMirror sup.folia-fn-ref {
                font-size: 0.75em;
                color: #1B4332;
                font-weight: 700;
                cursor: pointer;
                padding: 1px 3px;
                border-radius: 4px;
                transition: background-color 0.15s ease;
              }
              .ProseMirror sup.folia-fn-ref:hover {
                background-color: #D8F3DC;
                color: #081C15;
              }

              /* Search (Find) Highlighting - Luminous continuous highlighter on the entire word */
              .folia-search-match {
                background-color: rgba(254, 240, 138, 0.5) !important;
                color: inherit !important;
                border-radius: 2px;
                padding: 0 1px !important;
                box-decoration-break: slice !important;
                -webkit-box-decoration-break: slice !important;
              }
              .folia-search-match-active {
                background-color: #fde047 !important; /* Luminous sunny yellow highlighter */
                color: #000000 !important;
                border-bottom: 2.5px solid #ca8a04 !important;
                border-radius: 2px;
                padding: 0 1px !important;
                font-weight: 500 !important;
                box-decoration-break: slice !important;
                -webkit-box-decoration-break: slice !important;
              }

              /* Comment Marks in Text */
              .folia-comment-mark {
                background-color: rgba(251, 191, 36, 0.32) !important;
                border-bottom: 2px solid #f59e0b !important;
                border-radius: 2px;
                padding: 1px 2px;
                cursor: pointer;
                transition: background-color 0.2s ease, box-shadow 0.2s ease;
                box-decoration-break: clone;
                -webkit-box-decoration-break: clone;
              }
              .folia-comment-mark:hover {
                background-color: rgba(251, 191, 36, 0.55) !important;
              }
              .folia-comment-mark.folia-comment-active {
                background-color: rgba(245, 158, 11, 0.6) !important;
                box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.45), 0 2px 8px rgba(217, 119, 6, 0.3) !important;
                border-bottom: 2px solid #b45309 !important;
                animation: folia-comment-pulse 1.8s ease-in-out infinite;
              }
              .folia-comment-mark.folia-comment-resolved {
                background-color: rgba(16, 185, 129, 0.15) !important;
                border-bottom: 2px dashed #10b981 !important;
                opacity: 0.75;
              }
              @keyframes folia-comment-pulse {
                0%, 100% {
                  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.35);
                }
                50% {
                  box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.65), 0 2px 10px rgba(217, 119, 6, 0.4);
                }
              }
            `}</style>
            <EditorContent editor={editor} />
          </div>

          {/* Dynamic Last Page Filler, Footnotes and Standardized Footer */}
            {(() => {
              if (pageFormat === 'continuous') {
                const docFns = document?.footnotes || [];
                return docFns.length > 0 ? (
                  <div className="pt-4 border-t border-paper-250">
                    <FootnotesList
                      footnotes={docFns}
                      onUpdateFootnote={handleUpdateFootnote}
                      onDeleteFootnote={handleDeleteFootnote}
                      onJumpToFootnoteInText={handleJumpToFootnoteInText}
                    />
                  </div>
                ) : null;
              }

              const finalPageFootnotesList = lastPageFootnotes.length > 0
                ? lastPageFootnotes
                : (actualPageCount === 1 ? (document?.footnotes || []) : []);
              const fnHeight = finalPageFootnotesList.length * 52;
              const adjustedPadding = Math.max(0, lastPagePadding - fnHeight);

              return (
                <div className="folia-final-page-bottom select-none w-full bg-inherit rounded-b-md">
                  {/* Equalizer spacer filling remaining content slot */}
                  {adjustedPadding > 0 && (
                    <div 
                      style={{ height: `${adjustedPadding}px` }} 
                      className="pointer-events-none select-none transition-all duration-150" 
                      aria-hidden="true"
                    />
                  )}

                  {/* Footnotes Section at bottom of final page */}
                  {finalPageFootnotesList.length > 0 && (
                    <div className="pointer-events-auto select-text my-3 pt-2.5 border-t border-paper-300">
                      <FootnotesList
                        footnotes={finalPageFootnotesList}
                        onUpdateFootnote={handleUpdateFootnote}
                        onDeleteFootnote={handleDeleteFootnote}
                        onJumpToFootnoteInText={handleJumpToFootnoteInText}
                      />
                    </div>
                  )}

                  {/* Standardized Final Page Footer: Page Number and Bottom Margin matching all preceding physical sheets */}
                  <div 
                    style={{ 
                      height: `${pageMetrics.bottomMarginPx}px`,
                      boxSizing: 'border-box'
                    }}
                    className={`flex items-center text-xs font-serif font-medium text-paper-700 select-none ${getPageNumberAlignClass(pageNumberPosition)}`}
                  >
                    {isBottomNumber && (
                      <span className="tracking-wide">{getPageNumberText(totalDisplayPages)}</span>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

        {/* Floating Live Status Counter (Word & Google Docs style counter) */}
        {!isFocusMode && (
          <div className="absolute bottom-4 right-6 z-20 flex items-center gap-1.5 bg-paper-50/95 hover:bg-white backdrop-blur-md px-3.5 py-1.5 rounded-full border border-paper-250 shadow-md text-xs text-paper-700 select-none transition-all">
            <button
              onClick={() => setIsWordCountModalOpen(true)}
              title="Visualizza statistiche dettagliate di battute e caratteri (Ctrl + Shift + C)"
              className="flex items-center gap-2 text-[11.5px] font-medium text-paper-600 hover:text-folia-800 transition-colors cursor-pointer"
            >
              {selectionStats.hasSelection ? (
                <span className="flex items-center gap-1.5 text-folia-850 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-folia-600 animate-pulse"></span>
                  <span>{selectionStats.words.toLocaleString()} di {textStats.words.toLocaleString()} parole</span>
                  <span className="text-paper-400">·</span>
                  <span>{selectionStats.charsWithSpaces.toLocaleString()} battute</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span className="font-semibold text-paper-850">{textStats.words.toLocaleString()} parole</span>
                  <span className="text-paper-300">•</span>
                  <span className="text-paper-700">{textStats.charsWithSpaces.toLocaleString()} battute (con spazi)</span>
                  <span className="text-paper-300">•</span>
                  <span className="text-paper-500">{textStats.charsNoSpaces.toLocaleString()} senza spazi</span>
                </span>
              )}
            </button>
          </div>
        )}

      {/* Margin Comments Drawer */}
      <CommentsDrawer
        isOpen={isCommentsDrawerOpen}
        onClose={() => setIsCommentsDrawerOpen(false)}
        comments={document?.comments || []}
        selectedText={selectedTextForComment}
        defaultAuthor={defaultAuthor}
        activeCommentId={activeCommentId}
        onAddComment={handleAddComment}
        onToggleResolveComment={handleToggleResolveComment}
        onDeleteComment={handleDeleteComment}
        onJumpToCommentInText={handleJumpToCommentInText}
      />
    </div>

      {/* Floating Interlink Hover Card */}
      <InterlinkHoverCard
        entity={hoveredEntity}
        character={currentHoveredChar}
        worldEntry={currentHoveredWorld}
        position={hoverPosition}
        placement={hoverPlacement}
        onNavigate={handleNavigate}
        onMouseEnter={() => {
          isCardHoveredRef.current = true;
          clearTimeout(hoverTimeoutRef.current);
        }}
        onMouseLeave={() => {
          isCardHoveredRef.current = false;
          setHoveredEntity(null);
          setHoverPosition(null);
        }}
      />

      {/* Floating Web Hyperlink Hover Card */}
      <LinkHoverCard
        url={hoveredLink?.url || null}
        text={hoveredLink?.text}
        position={linkHoverPosition}
        onOpen={handleOpenExternalLink}
        onEdit={handleEditLinkFromHover}
        onRemove={handleRemoveLinkFromHover}
        onMouseEnter={() => {
          isLinkCardHoveredRef.current = true;
          if (linkHoverTimeoutRef.current) clearTimeout(linkHoverTimeoutRef.current);
        }}
        onMouseLeave={() => {
          isLinkCardHoveredRef.current = false;
          linkHoverTimeoutRef.current = setTimeout(() => {
            if (!isLinkCardHoveredRef.current) {
              setHoveredLink(null);
              setLinkHoverPosition(null);
            }
          }, 300);
        }}
      />

      {/* Web Hyperlink Modal */}
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        initialUrl={linkModalData.url}
        initialText={linkModalData.text}
        isEditingExisting={linkModalData.isEditing}
        onSave={handleSaveLink}
        onRemove={handleRemoveLink}
      />

      {/* Find & Replace Floating Bar */}
      <FindReplaceBar
        editor={editor}
        isOpen={isFindReplaceOpen}
        onClose={() => setIsFindReplaceOpen(false)}
        showReplaceInitially={showReplaceInBar}
      />

      {/* Insert Image Modal */}
      <InsertImageModal
        isOpen={isInsertImageOpen}
        onClose={() => setIsInsertImageOpen(false)}
        onInsertImage={(src, alt) => {
          editor?.chain().focus().setImage({ src, alt, title: alt }).run();
        }}
      />

      {/* Detailed Word & Character Count Statistics Modal */}
      <WordCountModal
        isOpen={isWordCountModalOpen}
        onClose={() => setIsWordCountModalOpen(false)}
        documentTitle={document?.title || ''}
        stats={textStats}
        selectionStats={selectionStats}
        projectWords={projectWords}
        projectChars={projectChars}
        projectCartelle={projectChars > 0 ? +(projectChars / 1800).toFixed(1) : (projectWords > 0 ? +(projectWords * 6 / 1800).toFixed(1) : 0)}
      />

      {/* Custom Margins Configuration Modal */}
      <CustomMarginsModal
        isOpen={isCustomMarginsModalOpen}
        onClose={() => setIsCustomMarginsModalOpen(false)}
        initialMargins={customMargins}
        onSave={(margins) => {
          onChangeCustomMargins?.(margins);
          onChangePageMargins('custom');
        }}
      />

      {/* Custom Context Menu on Table Right Click */}
      {tableContextMenu && (
        <div
          style={{ top: `${tableContextMenu.y}px`, left: `${tableContextMenu.x}px` }}
          className="fixed z-50 bg-paper-50 border border-paper-300 rounded-xl shadow-modal p-1.5 min-w-[190px] text-xs select-none animate-in fade-in"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="px-2 py-1 text-[10px] font-bold text-paper-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-paper-200 mb-1">
            <TableIcon className="w-3 h-3 text-folia-700" />
            <span>Gestione Tabella</span>
          </div>
          
          <button
            type="button"
            onClick={() => { editor?.chain().focus().addRowBefore().run(); setTableContextMenu(null); }}
            className="w-full text-left px-2 py-1.5 rounded hover:bg-paper-200 text-paper-800 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <span>+ Riga sopra</span>
          </button>
          <button
            type="button"
            onClick={() => { editor?.chain().focus().addRowAfter().run(); setTableContextMenu(null); }}
            className="w-full text-left px-2 py-1.5 rounded hover:bg-paper-200 text-paper-800 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <span>+ Riga sotto</span>
          </button>
          <button
            type="button"
            onClick={() => { editor?.chain().focus().addColumnBefore().run(); setTableContextMenu(null); }}
            className="w-full text-left px-2 py-1.5 rounded hover:bg-paper-200 text-paper-800 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <span>+ Colonna a sinistra</span>
          </button>
          <button
            type="button"
            onClick={() => { editor?.chain().focus().addColumnAfter().run(); setTableContextMenu(null); }}
            className="w-full text-left px-2 py-1.5 rounded hover:bg-paper-200 text-paper-800 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <span>+ Colonna a destra</span>
          </button>

          <div className="my-1 border-t border-paper-200" />

          <button
            type="button"
            onClick={() => { editor?.chain().focus().deleteRow().run(); setTableContextMenu(null); }}
            className="w-full text-left px-2 py-1.5 rounded hover:bg-rose-50 text-rose-700 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <span>− Elimina riga</span>
          </button>
          <button
            type="button"
            onClick={() => { editor?.chain().focus().deleteColumn().run(); setTableContextMenu(null); }}
            className="w-full text-left px-2 py-1.5 rounded hover:bg-rose-50 text-rose-700 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <span>− Elimina colonna</span>
          </button>

          <div className="my-1 border-t border-paper-200" />

          <button
            type="button"
            onClick={() => { editor?.chain().focus().deleteTable().run(); setTableContextMenu(null); }}
            className="w-full text-left px-2 py-1.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-900 font-semibold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-700" />
            <span>Elimina tabella intera</span>
          </button>
        </div>
      )}
    </div>
  );
};
