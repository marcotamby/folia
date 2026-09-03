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
import { ManuscriptItem, PageFormat, PageMargins, FontFamily, ParagraphSpacing, Character, WorldEntry, PageNumberPosition, PageNumberFormat, Footnote, DocumentComment } from '../../types';
import { FootnotesList } from './FootnotesList';
import { CommentsDrawer } from './CommentsDrawer';
import { InsertionMark, DeletionMark } from './TrackChangesExtension';
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, FileText, Minimize2, Highlighter, Link2, ExternalLink, Unlink, MessageSquare } from 'lucide-react';

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
  onChangeFontSize: (size: number) => void;
  onChangeTitleFontSize?: (size: number) => void;
  pageFormat: PageFormat;
  onChangePageFormat: (format: PageFormat) => void;
  pageMargins: PageMargins;
  onChangePageMargins: (margins: PageMargins) => void;
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
  onChangeFontSize,
  onChangeTitleFontSize,
  pageFormat,
  onChangePageFormat,
  pageMargins,
  onChangePageMargins,
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
  t
}) => {
  const [hoveredEntity, setHoveredEntity] = useState<{ id: string; type: 'character' | 'world' } | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isCardHoveredRef = useRef<boolean>(false);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [isTitleFocused, setIsTitleFocused] = useState(false);

  // Keep references updated for TipTap plugin
  const charsRef = useRef(characters);
  const worldRef = useRef(worldbuilding);
  useEffect(() => {
    charsRef.current = characters;
    worldRef.current = worldbuilding;
  }, [characters, worldbuilding]);

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
    Table.configure({
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
    InterlinkExtension.configure({
      getCharacters: () => charsRef.current,
      getWorldbuilding: () => worldRef.current,
    }),
  ], []);

  const editor = useEditor({
    extensions,
    content: document?.content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-paper max-w-none focus:outline-hidden min-h-[500px]',
        spellcheck: spellcheck ? 'true' : 'false',
      },
      handleClick: (_view, _pos, event) => {
        const anchor = (event.target as HTMLElement)?.closest('a');
        if (anchor) {
          const href = anchor.getAttribute('href');
          if (href) {
            // If Ctrl+Click or Cmd+Click, immediately open in external browser
            if (event.ctrlKey || event.metaKey) {
              event.preventDefault();
              if ((window as any).foliaAPI?.openExternal) {
                (window as any).foliaAPI.openExternal(href);
              } else {
                window.open(href, '_blank');
              }
              return true;
            }
          }
        }
        return false;
      }
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const words = editor.storage.characterCount.words();
      onUpdateContent(html, words);
    },
  });

  // Dynamically update spellcheck attribute on editor DOM
  useEffect(() => {
    if (editor && editor.view && editor.view.dom) {
      editor.view.dom.setAttribute('spellcheck', spellcheck ? 'true' : 'false');
    }
  }, [spellcheck, editor]);

  // Re-run decorations when characters or worldbuilding entities change
  useEffect(() => {
    if (editor && editor.view) {
      editor.view.dispatch(editor.state.tr.setMeta(interlinkPluginKey, true));
    }
  }, [characters, worldbuilding, editor]);

  // Sync content when active document changes
  useEffect(() => {
    if (editor && document) {
      const currentHTML = editor.getHTML();
      if (document.content !== currentHTML) {
        editor.commands.setContent(document.content || '', false);
      }
    }
  }, [document?.id, editor]);

  // Handle special characters insertion
  const insertChar = (char: string) => {
    if (editor) {
      editor.chain().focus().insertContent(char).run();
    }
  };

  // Handle page break insertion
  const handleInsertPageBreak = () => {
    if (editor) {
      editor.chain().focus().insertContent('<div class="folia-page-break" data-page-break="true"><span class="folia-page-break-label">Interruzione di pagina</span></div><p></p>').run();
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

  const handleOpenLinkModal = () => {
    if (!editor) return;
    const isEditing = editor.isActive('link');
    const url = isEditing ? (editor.getAttributes('link').href || '') : '';
    
    // Get currently selected text
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, ' ');

    setLinkModalData({
      url,
      text: selectedText,
      isEditing
    });
    setIsLinkModalOpen(true);
  };

  const handleSaveLink = (url: string, text?: string) => {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    if (from === to && text) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'text',
          text,
          marks: [{ type: 'link', attrs: { href: url } }]
        })
        .run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    }
  };

  const handleRemoveLink = () => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
  };

  // Find & Replace and Image states
  const [isFindReplaceOpen, setIsFindReplaceOpen] = useState(false);
  const [showReplaceInBar, setShowReplaceInBar] = useState(false);
  const [isInsertImageOpen, setIsInsertImageOpen] = useState(false);

  // Footnote actions
  const handleInsertFootnote = () => {
    if (!editor || !document) return;
    const currentFootnotes = document.footnotes || [];
    const nextNum = currentFootnotes.length + 1;
    const fnId = `fn-${Date.now()}`;
    const newFootnote: Footnote = {
      id: fnId,
      number: nextNum,
      content: ''
    };

    // Insert footnote reference in TipTap editor at cursor
    editor.chain().focus().insertContent(`<sup class="folia-fn-ref" data-fn="${fnId}">[${nextNum}]</sup>&nbsp;`).run();

    const updated = [...currentFootnotes, newFootnote];
    onUpdateFootnotes?.(updated);

    // Scroll down to the new footnote
    setTimeout(() => {
      const el = document.getElementById(`footnote-${fnId}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const ta = el?.querySelector('textarea');
      ta?.focus();
    }, 100);
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
  };

  const handleJumpToFootnoteInText = (id: string) => {
    const ref = editorContainerRef.current?.querySelector(`[data-fn="${id}"]`);
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (ref as HTMLElement).classList.add('bg-folia-200');
      setTimeout(() => (ref as HTMLElement).classList.remove('bg-folia-200'), 1500);
    }
  };

  // Keyboard shortcuts: Ctrl + K (link), Ctrl + F (find), Ctrl + H (find & replace), Ctrl + Alt + F (footnote)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.altKey && e.key.toLowerCase() === 'f') {
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
  const [isTrackingChanges, setIsTrackingChanges] = useState(false);

  // Comments actions
  const handleAddComment = (text: string, quotedText?: string) => {
    if (!document) return;
    const current = document.comments || [];
    const newComment: DocumentComment = {
      id: `comment-${Date.now()}`,
      text,
      quotedText: quotedText || '',
      author: defaultAuthor || 'Autore',
      createdAt: new Date().toISOString(),
      resolved: false
    };
    const updated = [...current, newComment];
    onUpdateComments?.(updated);
    setSelectedTextForComment('');
  };

  const handleToggleResolveComment = (id: string) => {
    if (!document) return;
    const current = document.comments || [];
    const updated = current.map(c => c.id === id ? { ...c, resolved: !c.resolved } : c);
    onUpdateComments?.(updated);
  };

  const handleDeleteComment = (id: string) => {
    if (!document) return;
    const current = document.comments || [];
    const updated = current.filter(c => c.id !== id);
    onUpdateComments?.(updated);
  };

  const handleJumpToCommentInText = (comment: DocumentComment) => {
    if (!editor || !comment.quotedText) return;
    const doc = editor.state.doc;
    let foundPos = -1;
    doc.descendants((node, pos) => {
      if (node.isText && node.text && node.text.includes(comment.quotedText)) {
        foundPos = pos + node.text.indexOf(comment.quotedText);
      }
    });
    if (foundPos !== -1) {
      editor.chain().setTextSelection({ from: foundPos, to: foundPos + comment.quotedText.length }).scrollIntoView().run();
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

  // Set up hover listener on editor content DOM for interlinks
  useEffect(() => {
    const container = editorContainerRef.current;
    if (!container) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('.folia-interlink') as HTMLElement;
      if (target) {
        const id = target.getAttribute('data-id');
        const type = target.getAttribute('data-type') as 'character' | 'world';
        if (id && type) {
          if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
          const rect = target.getBoundingClientRect();
          setHoverPosition({
            x: rect.left + rect.width / 2,
            y: rect.top,
          });
          setHoveredEntity({ id, type });
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('.folia-interlink');
      if (target) {
        hoverTimeoutRef.current = setTimeout(() => {
          if (!isCardHoveredRef.current) {
            setHoveredEntity(null);
            setHoverPosition(null);
          }
        }, 200);
      }
    };

    container.addEventListener('mouseover', handleMouseOver);
    container.addEventListener('mouseout', handleMouseOut);

    return () => {
      container.removeEventListener('mouseover', handleMouseOver);
      container.removeEventListener('mouseout', handleMouseOut);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

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

  const handleNavigate = (id: string, type: 'character' | 'world') => {
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
        return 'max-w-[800px] min-h-[1130px] my-6 bg-white shadow-page border border-paper-250/70 rounded-md';
      case 'novel':
        return 'max-w-[620px] min-h-[920px] my-6 bg-[#FCFCFA] shadow-page border border-paper-250/70 rounded-md';
      case 'cartella':
        return 'max-w-[760px] min-h-[1050px] my-6 bg-[#FEFEFD] shadow-page border border-folia-200/60 rounded-md';
      case 'letter':
        return 'max-w-[820px] min-h-[1060px] my-6 bg-white shadow-page border border-paper-250/70 rounded-md';
      case 'continuous':
      default:
        return 'max-w-[840px] min-h-full py-8 px-8 bg-transparent';
    }
  }, [pageFormat]);

  const marginClasses = useMemo(() => {
    if (pageFormat === 'continuous') return 'px-6';
    switch (pageMargins) {
      case 'narrow': return 'px-8 py-8 md:px-10 md:py-10';
      case 'wide': return 'px-14 py-14 md:px-20 md:py-20';
      case 'normal':
      default: return 'px-10 py-10 md:px-14 md:py-14';
    }
  }, [pageFormat, pageMargins]);

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

  // Estimated page count for pagination display (~250 words per standard page)
  const estimatedPages = Math.max(1, Math.ceil((document.wordCount || 0) / 250));

  // Format page number label
  const getPageNumberText = () => {
    switch (pageNumberFormat) {
      case 'page_x_of_y':
        return `Pagina 1 di ${estimatedPages}`;
      case 'dashes':
        return `— 1 —`;
      case 'simple':
      default:
        return `1`;
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
    <div className="flex-1 flex flex-col h-full bg-paper-200/60 overflow-hidden relative" ref={editorContainerRef}>
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
          fontFamily={fontFamily}
          onChangeFontFamily={onChangeFontFamily}
          headingFontFamily={headingFontFamily}
          onChangeHeadingFontFamily={onChangeHeadingFontFamily}
          fontSize={fontSize}
          activeFontSize={activeFontSize}
          onChangeFontSize={handleToolbarFontSizeChange}
          pageFormat={pageFormat}
          onChangePageFormat={onChangePageFormat}
          pageMargins={pageMargins}
          onChangePageMargins={onChangePageMargins}
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
          onOpenLink={handleOpenLinkModal}
          onOpenFindReplace={(showReplace) => {
            setIsFindReplaceOpen(true);
            setShowReplaceInBar(!!showReplace);
          }}
          onOpenInsertImage={() => setIsInsertImageOpen(true)}
          onInsertFootnote={handleInsertFootnote}
          isCommentsOpen={isCommentsDrawerOpen}
          onToggleComments={() => setIsCommentsDrawerOpen(!isCommentsDrawerOpen)}
          commentsCount={document?.comments?.filter(c => !c.resolved).length || 0}
          isTrackingChanges={isTrackingChanges}
          onToggleTrackChanges={() => setIsTrackingChanges(!isTrackingChanges)}
          onAcceptAllChanges={handleAcceptAllChanges}
          onRejectAllChanges={handleRejectAllChanges}
          t={t}
        />
      )}

      {/* Editor & Comments Flex Container */}
      <div className="flex-1 overflow-hidden flex flex-row relative">
        {/* Main Page Canvas */}
        <div className="flex-1 overflow-y-auto flex justify-center px-4">
        <div 
          className={`w-full ${formatClasses} ${marginClasses} transition-all duration-300 relative flex flex-col justify-between`}
          style={{
            fontFamily: getFontFamilyStyle(fontFamily),
            fontSize: `${fontSize}pt`,
            lineHeight: lineHeight,
            hyphens: hyphenation ? 'auto' : 'none',
            WebkitHyphens: hyphenation ? 'auto' : 'none',
          }}
        >
          <div>
            {/* Top Page Number Header (if configured) */}
            {isTopNumber && (
              <div className={`mb-6 pb-2.5 border-b border-paper-300/70 flex items-center text-xs font-serif font-medium text-paper-700 select-none ${getPageNumberAlignClass(pageNumberPosition)}`}>
                <span className="tracking-wide">{getPageNumberText()}</span>
              </div>
            )}

            {/* Document Title Header */}
            <div className="mb-6 pb-4 border-b border-paper-200">
              <input
                type="text"
                value={document.title}
                onChange={(e) => onUpdateTitle(e.target.value)}
                onFocus={() => setIsTitleFocused(true)}
                onBlur={() => setTimeout(() => setIsTitleFocused(false), 200)}
                placeholder="Titolo del capitolo..."
                style={{
                  fontFamily: getFontFamilyStyle(headingFontFamily),
                  fontSize: `${titleFontSize || document.titleFontSize || 26}pt`,
                }}
                className="w-full font-bold text-black bg-transparent border-none focus:outline-hidden placeholder-paper-300 tracking-tight"
              />
            </div>

            {/* Floating Bubble Menu on selection */}
            {editor && (
              <BubbleMenu
                editor={editor}
                tippyOptions={{ duration: 100 }}
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
                  onClick={handleOpenLinkModal}
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
                    setIsCommentsDrawerOpen(true);
                  }}
                  className="p-1 rounded hover:bg-paper-800 text-amber-300"
                  title="Aggiungi commento sulla selezione"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
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
              }
              .ProseMirror p, .ProseMirror li, .ProseMirror blockquote, .ProseMirror h1, .ProseMirror h2, .ProseMirror h3 {
                color: inherit;
              }
              .ProseMirror p {
                font-size: ${fontSize}pt !important;
                line-height: ${lineHeight} !important;
                text-indent: ${firstLineIndent}cm;
                margin-bottom: ${paragraphSpacing === 'tight' ? '0.4em' : paragraphSpacing === 'relaxed' ? '1.2em' : '0.75em'};
              }
              .ProseMirror li {
                font-size: ${fontSize}pt !important;
                line-height: ${lineHeight} !important;
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
                padding: 0 1px;
                border-radius: 2px;
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
              .folia-page-break {
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 3rem -2.5rem;
                padding: 1.25rem 0;
                position: relative;
                user-select: none;
                background: linear-gradient(180deg, #F3F1ED 0%, #E9E6DE 50%, #F3F1ED 100%);
                border-top: 1px solid #D5D1C7;
                border-bottom: 1px solid #D5D1C7;
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.03), inset 0 -2px 4px rgba(0,0,0,0.03);
                page-break-after: always;
                break-after: page;
              }
              .folia-page-break-label {
                background-color: #FFFFFF;
                padding: 4px 14px;
                font-size: 10px;
                font-family: ui-sans-serif, system-ui, sans-serif;
                font-weight: 700;
                color: #57534E;
                border-radius: 9999px;
                border: 1px solid #D5D1C7;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                z-index: 2;
                text-transform: uppercase;
                letter-spacing: 0.08em;
              }
              @media print {
                .folia-page-break {
                  page-break-after: always !important;
                  break-after: page !important;
                  height: 0 !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  border: none !important;
                  visibility: hidden !important;
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
              .ProseMirror table.folia-table {
                border-collapse: collapse;
                margin: 1.5rem auto;
                table-layout: fixed;
                width: 100%;
                overflow: hidden;
                border-radius: 0.75rem;
                border: 1px solid #E8E5DF;
                box-shadow: 0 1px 3px rgba(0,0,0,0.03);
              }
              .ProseMirror table.folia-table td,
              .ProseMirror table.folia-table th {
                min-width: 1em;
                border: 1px solid #E8E5DF;
                padding: 8px 12px;
                vertical-align: top;
                box-sizing: border-box;
                position: relative;
              }
              .ProseMirror table.folia-table th {
                font-weight: bold;
                text-align: left;
                background-color: #F7F6F3;
                color: #171614;
              }
              .ProseMirror .selectedCell:after {
                z-index: 2;
                position: absolute;
                content: "";
                left: 0; right: 0; top: 0; bottom: 0;
                background: rgba(27, 67, 50, 0.08);
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
            `}</style>
            <EditorContent editor={editor} />

            {/* Footnotes Section at bottom of chapter */}
            <FootnotesList
              footnotes={document?.footnotes || []}
              onUpdateFootnote={handleUpdateFootnote}
              onDeleteFootnote={handleDeleteFootnote}
              onJumpToFootnoteInText={handleJumpToFootnoteInText}
            />
          </div>

          {/* Bottom Page Number Footer (if configured) */}
          {isBottomNumber && (
            <div className={`mt-12 pt-4 border-t border-paper-300/70 flex items-center text-xs font-serif font-medium text-paper-700 select-none ${getPageNumberAlignClass(pageNumberPosition)}`}>
              <span className="tracking-wide">{getPageNumberText()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Margin Comments Drawer */}
      <CommentsDrawer
        isOpen={isCommentsDrawerOpen}
        onClose={() => setIsCommentsDrawerOpen(false)}
        comments={document?.comments || []}
        selectedText={selectedTextForComment}
        defaultAuthor={defaultAuthor}
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
    </div>
  );
};
