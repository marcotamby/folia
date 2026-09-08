import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  List, 
  ListOrdered, 
  Quote, 
  Minus, 
  Undo, 
  Redo, 
  WrapText, 
  SpellCheck, 
  SeparatorHorizontal, 
  Hash,
  ChevronDown,
  Highlighter,
  Palette,
  Check,
  Link2,
  Plus,
  Table as TableIcon,
  Image as ImageIcon,
  Search,
  MessageSquare,
  GitBranch,
  FileText,
  Sliders
} from 'lucide-react';
import { Editor } from '@tiptap/react';
import { PageFormat, PageMargins, CustomPageMargins, FontFamily, ParagraphSpacing, PageNumberPosition, PageNumberFormat } from '../../types';
import { CustomSelect } from '../common/CustomSelect';
import { Checkbox } from '../common/Checkbox';

interface EditorToolbarProps {
  editor: Editor | null;
  fontFamily: FontFamily;
  onChangeFontFamily: (font: FontFamily) => void;
  headingFontFamily: FontFamily;
  onChangeHeadingFontFamily: (font: FontFamily) => void;
  fontSize: number;
  activeFontSize?: number;
  onChangeFontSize: (size: number) => void;
  pageFormat: PageFormat;
  onChangePageFormat: (format: PageFormat) => void;
  pageMargins: PageMargins;
  onChangePageMargins: (margins: PageMargins) => void;
  customMargins?: CustomPageMargins;
  onOpenCustomMargins?: () => void;
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
  onInsertPageBreak: () => void;
  onOpenSpecialChars: () => void;
  onOpenLink?: () => void;
  onOpenFindReplace?: (showReplace?: boolean) => void;
  onOpenInsertImage?: () => void;
  onInsertFootnote?: () => void;
  isCommentsOpen?: boolean;
  onToggleComments?: () => void;
  commentsCount?: number;
  isTrackingChanges?: boolean;
  onToggleTrackChanges?: () => void;
  onAcceptAllChanges?: () => void;
  onRejectAllChanges?: () => void;
  onOpenWordCount?: () => void;
  isTitleFocused?: boolean;
  titleAlignment?: 'left' | 'center' | 'right' | 'justify';
  onChangeTitleAlignment?: (align: 'left' | 'center' | 'right' | 'justify') => void;
  t: (key: string) => string;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  fontFamily,
  onChangeFontFamily,
  headingFontFamily,
  onChangeHeadingFontFamily,
  fontSize,
  activeFontSize,
  onChangeFontSize,
  pageFormat,
  onChangePageFormat,
  pageMargins,
  onChangePageMargins,
  customMargins,
  onOpenCustomMargins,
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
  onInsertPageBreak,
  onOpenSpecialChars,
  onOpenLink,
  onOpenFindReplace,
  onOpenInsertImage,
  onInsertFootnote,
  isCommentsOpen,
  onToggleComments,
  commentsCount,
  isTrackingChanges,
  onToggleTrackChanges,
  onAcceptAllChanges,
  onRejectAllChanges,
  onOpenWordCount,
  isTitleFocused = false,
  titleAlignment = 'left',
  onChangeTitleAlignment,
  t
}) => {
  const [showPageNumMenu, setShowPageNumMenu] = useState(false);
  const [showTextColorMenu, setShowTextColorMenu] = useState(false);
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [hoverGrid, setHoverGrid] = useState<{ rows: number; cols: number }>({ rows: 3, cols: 3 });

  const textColorRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const tableMenuRef = useRef<HTMLDivElement>(null);

  const handleInsertTable = (rows: number, cols: number) => {
    setShowTableMenu(false);
    if (!editor) return;

    editor.chain().focus().run();
    try {
      const success = editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
      if (!success) {
        editor.chain().focus().insertContent('<p></p>').insertTable({ rows, cols, withHeaderRow: true }).run();
      }
    } catch (err) {
      console.error('Error inserting table:', err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (textColorRef.current && !textColorRef.current.contains(e.target as Node)) {
        setShowTextColorMenu(false);
      }
      if (highlightRef.current && !highlightRef.current.contains(e.target as Node)) {
        setShowHighlightMenu(false);
      }
      if (tableMenuRef.current && !tableMenuRef.current.contains(e.target as Node)) {
        setShowTableMenu(false);
      }
    };
    if (showTextColorMenu || showHighlightMenu || showTableMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTextColorMenu, showHighlightMenu, showTableMenu]);

  const textColors = [
    { hex: '#000000', label: 'Nero assoluto (predefinito)' },
    { hex: '#FFFFFF', label: 'Bianco assoluto' },
    { hex: '#2B2925', label: 'Inchiostro scuro' },
    { hex: '#44403C', label: 'Carbone' },
    { hex: '#1B4332', label: 'Verde Folia' },
    { hex: '#047857', label: 'Smeraldo' },
    { hex: '#1E3A8A', label: 'Blu notte' },
    { hex: '#2563EB', label: 'Cobalto' },
    { hex: '#831843', label: 'Borgogna' },
    { hex: '#DC2626', label: 'Rosso carminio' },
    { hex: '#C2410C', label: 'Terracotta' },
    { hex: '#D97706', label: 'Ambra' },
    { hex: '#7C3AED', label: 'Viola imperiale' },
    { hex: '#64748B', label: 'Grigio ardesia' }
  ];

  const highlightColors = [
    { hex: '#FEF08A', label: 'Giallo solare' },
    { hex: '#A7F3D0', label: 'Verde menta' },
    { hex: '#BAE6FD', label: 'Celeste aria' },
    { hex: '#FBCFE8', label: 'Rosa cipria' },
    { hex: '#E9D5FF', label: 'Lavanda' },
    { hex: '#FED7AA', label: 'Pesca tenue' },
    { hex: '#E7E5E4', label: 'Grigio carta' },
    { hex: '#FDE047', label: 'Giallo evidenziatore' }
  ];

  if (!editor) return null;

  const activeTextColor = editor.getAttributes('textStyle').color || '';
  const activeHighlightColor = editor.isActive('highlight') ? (editor.getAttributes('highlight').color || '#FEF08A') : '';

  const fontSelectOptions = [
    // Classici & Narrativa (Serif)
    { value: 'Garamond', label: 'EB Garamond', group: 'Classici & Narrativa (Serif)' },
    { value: 'Spectral', label: 'Spectral', group: 'Classici & Narrativa (Serif)' },
    { value: 'Crimson Pro', label: 'Crimson Pro', group: 'Classici & Narrativa (Serif)' },
    { value: 'Cormorant Garamond', label: 'Cormorant Garamond', group: 'Classici & Narrativa (Serif)' },
    { value: 'Libre Caslon Text', label: 'Libre Caslon Text', group: 'Classici & Narrativa (Serif)' },
    { value: 'Cinzel', label: 'Cinzel', group: 'Classici & Narrativa (Serif)' },
    { value: 'Baskerville', label: 'Libre Baskerville', group: 'Classici & Narrativa (Serif)' },
    { value: 'Palatino', label: 'Palatino', group: 'Classici & Narrativa (Serif)' },
    { value: 'Book Antiqua', label: 'Book Antiqua', group: 'Classici & Narrativa (Serif)' },
    { value: 'Georgia', label: 'Georgia', group: 'Classici & Narrativa (Serif)' },
    { value: 'Lora', label: 'Lora', group: 'Classici & Narrativa (Serif)' },
    { value: 'Merriweather', label: 'Merriweather', group: 'Classici & Narrativa (Serif)' },
    { value: 'Playfair Display', label: 'Playfair Display', group: 'Classici & Narrativa (Serif)' },
    { value: 'Times New Roman', label: 'Times New Roman', group: 'Classici & Narrativa (Serif)' },
    // Moderni & Saggi (Sans-Serif)
    { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans', group: 'Moderni & Saggi (Sans)' },
    { value: 'Inter', label: 'Inter', group: 'Moderni & Saggi (Sans)' },
    { value: 'Outfit', label: 'Outfit', group: 'Moderni & Saggi (Sans)' },
    { value: 'Montserrat', label: 'Montserrat', group: 'Moderni & Saggi (Sans)' },
    { value: 'Raleway', label: 'Raleway', group: 'Moderni & Saggi (Sans)' },
    { value: 'Arial', label: 'Arial', group: 'Moderni & Saggi (Sans)' },
    { value: 'Verdana', label: 'Verdana', group: 'Moderni & Saggi (Sans)' },
    { value: 'Calibri', label: 'Calibri', group: 'Moderni & Saggi (Sans)' },
    // Monospace
    { value: 'Courier Prime', label: 'Courier Prime', group: 'Macchina da Scrivere (Mono)' },
    { value: 'Courier New', label: 'Courier New', group: 'Macchina da Scrivere (Mono)' },
    { value: 'JetBrains Mono', label: 'JetBrains Mono', group: 'Macchina da Scrivere (Mono)' },
    { value: 'Consolas', label: 'Consolas', group: 'Macchina da Scrivere (Mono)' }
  ];

  const FONT_SIZE_STEPS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 24, 26, 28, 32, 36, 40, 48];
  const currentSize = activeFontSize ?? fontSize;

  const handleDecreaseFontSize = () => {
    const currentIndex = FONT_SIZE_STEPS.findIndex(s => s >= currentSize);
    const targetIndex = currentIndex > 0 ? currentIndex - 1 : 0;
    onChangeFontSize(FONT_SIZE_STEPS[targetIndex]);
  };

  const handleIncreaseFontSize = () => {
    const currentIndex = FONT_SIZE_STEPS.findIndex(s => s > currentSize);
    const targetIndex = currentIndex !== -1 ? currentIndex : FONT_SIZE_STEPS.length - 1;
    onChangeFontSize(FONT_SIZE_STEPS[targetIndex]);
  };

  const dynamicSizeOptions = React.useMemo(() => {
    const steps = [...FONT_SIZE_STEPS];
    if (!steps.includes(currentSize)) {
      steps.push(currentSize);
      steps.sort((a, b) => a - b);
    }
    return steps.map(s => ({
      value: s.toString(),
      label: `${s} pt`
    }));
  }, [currentSize]);

  const currentHeadingVal = editor.isActive('heading', { level: 1 })
    ? 'h1'
    : editor.isActive('heading', { level: 2 })
    ? 'h2'
    : editor.isActive('heading', { level: 3 })
    ? 'h3'
    : 'p';

  return (
    <div className="border-b border-paper-200 bg-paper-50 px-3 py-2 flex flex-col gap-1.5 text-xs select-none sticky top-0 z-20 shadow-2xs">
      {/* ROW 1: Font Testo, Font Titoli, Dimensione, Stili, Allineamenti ed Elenchi */}
      <div className="flex items-center justify-between gap-y-1.5 gap-x-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Undo / Redo */}
          <div className="flex items-center gap-0.5 pr-1.5 border-r border-paper-200">
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Annulla (Ctrl+Z)"
              className="p-1.5 rounded-lg text-paper-600 hover:bg-paper-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
            >
              <Undo className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Ripristina (Ctrl+Y)"
              className="p-1.5 rounded-lg text-paper-600 hover:bg-paper-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
            >
              <Redo className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Font Testo Corpo Paragrafo */}
          <div className="flex items-center gap-1 pr-1.5 border-r border-paper-200">
            <span className="text-[10.5px] font-medium text-paper-500">Testo:</span>
            <CustomSelect
              value={fontFamily}
              onChange={(val) => onChangeFontFamily(val as FontFamily)}
              options={fontSelectOptions}
              title="Carattere per il corpo del testo"
            />
          </div>

          {/* Font Titoli & Capitoli */}
          <div className="flex items-center gap-1 pr-1.5 border-r border-paper-200">
            <span className="text-[10.5px] font-medium text-paper-500">Titoli:</span>
            <CustomSelect
              value={headingFontFamily || 'Plus Jakarta Sans'}
              onChange={(val) => onChangeHeadingFontFamily(val as FontFamily)}
              options={fontSelectOptions}
              title="Carattere per capitoli e intestazioni (H1, H2, H3)"
            />
          </div>

          {/* Font Size Selector with - and + buttons (like Word) */}
          <div className="flex items-center gap-0.5 pr-1.5 border-r border-paper-200">
            <button
              type="button"
              onClick={handleDecreaseFontSize}
              disabled={currentSize <= FONT_SIZE_STEPS[0]}
              title="Riduci dimensione carattere"
              className="p-1 rounded-md text-paper-600 hover:bg-paper-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer flex items-center justify-center"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <CustomSelect
              value={currentSize.toString()}
              onChange={(val) => onChangeFontSize(Number(val))}
              options={dynamicSizeOptions}
              title="Dimensione carattere"
            />
            <button
              type="button"
              onClick={handleIncreaseFontSize}
              disabled={currentSize >= FONT_SIZE_STEPS[FONT_SIZE_STEPS.length - 1]}
              title="Aumenta dimensione carattere"
              className="p-1 rounded-md text-paper-600 hover:bg-paper-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer flex items-center justify-center"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Paragraph / Headings */}
          <div className="pr-1.5 border-r border-paper-200">
            <CustomSelect
              value={currentHeadingVal}
              onChange={(val) => {
                if (val === 'p') editor.chain().focus().setParagraph().run();
                else if (val === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run();
                else if (val === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run();
                else if (val === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run();
              }}
              options={[
                { value: 'p', label: 'Testo normale' },
                { value: 'h1', label: 'Titolo 1 (capitolo)' },
                { value: 'h2', label: 'Titolo 2 (sezione / scena)' },
                { value: 'h3', label: 'Titolo 3 (sottosezione)' }
              ]}
              title="Stile paragrafo o intestazione"
            />
          </div>

          {/* Basic Formatting: Bold, Italic, Underline, Strike */}
          <div className="flex items-center gap-0.5 pr-1.5 border-r border-paper-200">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              title={t('editor.bold')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                editor.isActive('bold') ? 'bg-folia-100 text-folia-900 font-bold' : 'text-paper-700 hover:bg-paper-200'
              }`}
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              title={t('editor.italic')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                editor.isActive('italic') ? 'bg-folia-100 text-folia-900' : 'text-paper-700 hover:bg-paper-200'
              }`}
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              title={t('editor.underline')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                editor.isActive('underline') ? 'bg-folia-100 text-folia-900' : 'text-paper-700 hover:bg-paper-200'
              }`}
            >
              <UnderlineIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              title={t('editor.strikethrough')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                editor.isActive('strike') ? 'bg-folia-100 text-folia-900' : 'text-paper-700 hover:bg-paper-200'
              }`}
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Text Color & Highlight */}
          <div className="flex items-center gap-1 pr-1.5 border-r border-paper-200">
            {/* Text Color */}
            <div className="relative" ref={textColorRef}>
              <button
                type="button"
                onClick={() => {
                  setShowTextColorMenu(!showTextColorMenu);
                  setShowHighlightMenu(false);
                }}
                title="Colore del testo"
                className={`flex items-center gap-0.5 px-1.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeTextColor ? 'bg-folia-100 text-folia-900 font-semibold' : 'text-paper-700 hover:bg-paper-200'
                }`}
              >
                <div className="flex flex-col items-center justify-center leading-none">
                  <span className="font-serif font-bold text-[13px]">A</span>
                  <div 
                    className="w-3.5 h-[3px] rounded-xs mt-[1px]" 
                    style={{ backgroundColor: activeTextColor || '#2B2925' }} 
                  />
                </div>
                <ChevronDown className="w-2.5 h-2.5 text-paper-400" />
              </button>

              {showTextColorMenu && (
                <div className="absolute left-0 top-full mt-1.5 w-60 bg-paper-50 border border-paper-300 rounded-xl shadow-modal p-3 z-50 animate-in fade-in space-y-2.5 select-none">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-paper-800">Colore del testo</span>
                    <button
                      type="button"
                      onClick={() => {
                        editor.chain().focus().unsetColor().run();
                        setShowTextColorMenu(false);
                      }}
                      className="text-[10px] text-paper-500 hover:text-folia-800 underline cursor-pointer"
                    >
                      Predefinito
                    </button>
                  </div>

                  <div className="grid grid-cols-6 gap-1.5">
                    {textColors.map(c => {
                      const isSelected = activeTextColor.toLowerCase() === c.hex.toLowerCase();
                      return (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => {
                            editor.chain().focus().setColor(c.hex).run();
                            setShowTextColorMenu(false);
                          }}
                          title={c.label}
                          className={`w-7 h-7 rounded-lg border ${c.hex.toLowerCase() === '#ffffff' ? 'border-paper-400 shadow-xs' : 'border-paper-300'} hover:scale-110 transition-transform flex items-center justify-center cursor-pointer shadow-2xs`}
                          style={{ backgroundColor: c.hex }}
                        >
                          {isSelected && (
                            <Check className={`w-3.5 h-3.5 ${c.hex.toLowerCase() === '#ffffff' ? 'text-paper-950 font-bold' : 'text-white drop-shadow-sm'}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-paper-200 flex items-center justify-between text-xs">
                    <label className="text-[11px] text-paper-600 font-medium cursor-pointer flex items-center gap-2">
                      <span>Altro colore:</span>
                      <input
                        type="color"
                        value={activeTextColor || '#000000'}
                        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                        className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Text Highlight */}
            <div className="relative" ref={highlightRef}>
              <button
                type="button"
                onClick={() => {
                  setShowHighlightMenu(!showHighlightMenu);
                  setShowTextColorMenu(false);
                }}
                title="Evidenziatore testo"
                className={`flex items-center gap-0.5 px-1.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  editor.isActive('highlight') ? 'bg-amber-100 text-amber-900 font-semibold' : 'text-paper-700 hover:bg-paper-200'
                }`}
              >
                <div className="flex flex-col items-center justify-center leading-none">
                  <Highlighter className="w-3.5 h-3.5" />
                  <div 
                    className="w-3.5 h-[3px] rounded-xs mt-[1px]" 
                    style={{ backgroundColor: activeHighlightColor || 'transparent' }} 
                  />
                </div>
                <ChevronDown className="w-2.5 h-2.5 text-paper-400" />
              </button>

              {showHighlightMenu && (
                <div className="absolute left-0 top-full mt-1.5 w-56 bg-paper-50 border border-paper-300 rounded-xl shadow-modal p-3 z-50 animate-in fade-in space-y-2.5 select-none">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-paper-800">Evidenziatore</span>
                    {editor.isActive('highlight') && (
                      <button
                        type="button"
                        onClick={() => {
                          editor.chain().focus().unsetHighlight().run();
                          setShowHighlightMenu(false);
                        }}
                        className="text-[10px] text-paper-500 hover:text-red-700 underline cursor-pointer"
                      >
                        Rimuovi
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {highlightColors.map(c => {
                      const isSelected = editor.isActive('highlight', { color: c.hex });
                      return (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => {
                            editor.chain().focus().toggleHighlight({ color: c.hex }).run();
                            setShowHighlightMenu(false);
                          }}
                          title={c.label}
                          className="h-7 rounded-lg border border-paper-300 hover:scale-105 transition-transform flex items-center justify-center cursor-pointer shadow-2xs"
                          style={{ backgroundColor: c.hex }}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-paper-800" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Web Hyperlink */}
            {onOpenLink && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onOpenLink()}
                title="Inserisci o modifica collegamento web (Ctrl + K)"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  editor.isActive('link') ? 'bg-folia-100 text-folia-900 font-semibold' : 'text-paper-700 hover:bg-paper-200'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Table Dropdown */}
            <div className="relative" ref={tableMenuRef}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowTableMenu(!showTableMenu)}
                title="Inserisci tabella o gestisci celle"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-0.5 ${
                  editor.isActive('table') || showTableMenu ? 'bg-folia-100 text-folia-900 font-semibold' : 'text-paper-700 hover:bg-paper-200'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <ChevronDown className="w-2.5 h-2.5 text-paper-400" />
              </button>

              {showTableMenu && (
                <div 
                  onMouseDown={(e) => e.preventDefault()}
                  className="absolute left-0 top-full mt-1.5 bg-paper-50 border border-paper-300 rounded-xl shadow-modal p-3 z-50 animate-in fade-in space-y-2.5 select-none w-56"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-paper-800">Inserisci tabella</span>
                    <span className="font-mono text-[11px] text-folia-800 font-semibold">{hoverGrid.rows} × {hoverGrid.cols}</span>
                  </div>

                  {/* 6x6 Grid Selector */}
                  <div className="grid grid-cols-6 gap-1 p-1.5 bg-paper-100/70 rounded-lg border border-paper-250">
                    {Array.from({ length: 6 }).map((_, r) => (
                      Array.from({ length: 6 }).map((_, c) => {
                        const isHovered = r < hoverGrid.rows && c < hoverGrid.cols;
                        return (
                          <div
                            key={`${r}-${c}`}
                            onMouseEnter={() => setHoverGrid({ rows: r + 1, cols: c + 1 })}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleInsertTable(r + 1, c + 1)}
                            className={`w-6 h-6 rounded border cursor-pointer transition-colors ${
                              isHovered ? 'bg-folia-600 border-folia-700' : 'bg-white border-paper-300 hover:border-paper-400'
                            }`}
                          />
                        );
                      })
                    ))}
                  </div>

                  {/* Quick Action Button for Table Insertion */}
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleInsertTable(hoverGrid.rows, hoverGrid.cols)}
                    className="w-full py-1 px-2 bg-folia-700 hover:bg-folia-800 text-white rounded-lg text-xs font-semibold text-center transition-colors cursor-pointer shadow-xs"
                  >
                    Inserisci tabella {hoverGrid.rows} × {hoverGrid.cols}
                  </button>

                  {/* Table active tools */}
                  {editor.isActive('table') && (
                    <div className="pt-2 border-t border-paper-200 space-y-1.5 text-[11px]">
                      <span className="font-semibold text-paper-500 text-[10px] uppercase tracking-wider block">Azioni tabella:</span>
                      <div className="grid grid-cols-2 gap-1 text-[10.5px]">
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => { editor.chain().focus().addRowBefore().run(); setShowTableMenu(false); }}
                          className="px-2 py-1 bg-paper-100 hover:bg-paper-200 rounded text-left transition-colors cursor-pointer"
                        >
                          + Riga sopra
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => { editor.chain().focus().addRowAfter().run(); setShowTableMenu(false); }}
                          className="px-2 py-1 bg-paper-100 hover:bg-paper-200 rounded text-left transition-colors cursor-pointer"
                        >
                          + Riga sotto
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => { editor.chain().focus().addColumnBefore().run(); setShowTableMenu(false); }}
                          className="px-2 py-1 bg-paper-100 hover:bg-paper-200 rounded text-left transition-colors cursor-pointer"
                        >
                          + Colonna sx
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => { editor.chain().focus().addColumnAfter().run(); setShowTableMenu(false); }}
                          className="px-2 py-1 bg-paper-100 hover:bg-paper-200 rounded text-left transition-colors cursor-pointer"
                        >
                          + Colonna dx
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => { editor.chain().focus().deleteRow().run(); setShowTableMenu(false); }}
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded text-left transition-colors cursor-pointer"
                        >
                          − Elimina riga
                        </button>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => { editor.chain().focus().deleteColumn().run(); setShowTableMenu(false); }}
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded text-left transition-colors cursor-pointer"
                        >
                          − Elimina colonna
                        </button>
                      </div>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => { editor.chain().focus().deleteTable().run(); setShowTableMenu(false); }}
                        className="w-full px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded font-semibold text-center transition-colors cursor-pointer mt-1"
                      >
                        Elimina tabella intera
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Insert Image */}
            {onOpenInsertImage && (
              <button
                type="button"
                onClick={onOpenInsertImage}
                title="Inserisci immagine (Ctrl+Shift+I)"
                className="p-1.5 rounded-lg text-paper-700 hover:bg-paper-200 transition-colors cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Find & Replace */}
            {onOpenFindReplace && (
              <button
                type="button"
                onClick={() => onOpenFindReplace(false)}
                title="Trova e sostituisci nel testo (Ctrl + F)"
                className="p-1.5 rounded-lg text-paper-700 hover:bg-paper-200 hover:text-folia-800 transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Footnote Button */}
            {onInsertFootnote && (
              <button
                type="button"
                onClick={onInsertFootnote}
                title="Inserisci nota a piè di pagina (Ctrl + Alt + F)"
                className="p-1.5 rounded-lg text-paper-700 hover:bg-paper-200 hover:text-folia-800 transition-colors cursor-pointer flex items-center gap-0.5 font-serif font-bold text-xs"
              >
                <span className="text-folia-800">[¹]</span>
              </button>
            )}
          </div>

          {/* Text Alignment */}
          <div className="flex items-center gap-0.5 pr-1.5 border-r border-paper-200">
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                if (isTitleFocused && onChangeTitleAlignment) {
                  onChangeTitleAlignment('left');
                } else if (editor) {
                  editor.chain().focus().setTextAlign('left').run();
                }
              }}
              title={t('editor.align_left')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                (isTitleFocused ? titleAlignment === 'left' : editor?.isActive({ textAlign: 'left' }))
                  ? 'bg-folia-100 text-folia-900 font-semibold' 
                  : 'text-paper-700 hover:bg-paper-200'
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                if (isTitleFocused && onChangeTitleAlignment) {
                  onChangeTitleAlignment('center');
                } else if (editor) {
                  editor.chain().focus().setTextAlign('center').run();
                }
              }}
              title={t('editor.align_center')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                (isTitleFocused ? titleAlignment === 'center' : editor?.isActive({ textAlign: 'center' }))
                  ? 'bg-folia-100 text-folia-900 font-semibold' 
                  : 'text-paper-700 hover:bg-paper-200'
              }`}
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                if (isTitleFocused && onChangeTitleAlignment) {
                  onChangeTitleAlignment('right');
                } else if (editor) {
                  editor.chain().focus().setTextAlign('right').run();
                }
              }}
              title={t('editor.align_right')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                (isTitleFocused ? titleAlignment === 'right' : editor?.isActive({ textAlign: 'right' }))
                  ? 'bg-folia-100 text-folia-900 font-semibold' 
                  : 'text-paper-700 hover:bg-paper-200'
              }`}
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                if (isTitleFocused && onChangeTitleAlignment) {
                  onChangeTitleAlignment('justify');
                } else if (editor) {
                  editor.chain().focus().setTextAlign('justify').run();
                }
              }}
              title={t('editor.align_justify')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                (isTitleFocused ? titleAlignment === 'justify' : editor?.isActive({ textAlign: 'justify' }))
                  ? 'bg-folia-100 text-folia-900 font-semibold' 
                  : 'text-paper-700 hover:bg-paper-200'
              }`}
            >
              <AlignJustify className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Lists & Quotes */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              title={t('editor.bullet_list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                editor.isActive('bulletList') ? 'bg-folia-100 text-folia-900' : 'text-paper-700 hover:bg-paper-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              title={t('editor.ordered_list') !== 'editor.ordered_list' ? t('editor.ordered_list') : 'Elenco numerato'}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                editor.isActive('orderedList') ? 'bg-folia-100 text-folia-900' : 'text-paper-700 hover:bg-paper-200'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              title={t('editor.blockquote') !== 'editor.blockquote' ? t('editor.blockquote') : 'Citazione'}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                editor.isActive('blockquote') ? 'bg-folia-100 text-folia-900' : 'text-paper-700 hover:bg-paper-200'
              }`}
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title={t('editor.divider')}
              className="p-1.5 rounded-lg text-paper-700 hover:bg-paper-200 transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ROW 2: Special Characters, Indent, Hyphenation, Spellcheck, Page Breaks, Advanced Page Numbers, Formats & Margins */}
      <div className="flex items-center justify-between gap-y-1.5 gap-x-2 pt-1 border-t border-paper-200/70 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap relative">
          {/* Special Characters button */}
          <button
            onClick={onOpenSpecialChars}
            title={t('special_chars.title')}
            className="h-7 flex items-center gap-1.5 px-2.5 rounded-lg bg-paper-100/90 hover:bg-folia-50 text-paper-800 hover:text-folia-900 border border-paper-300 hover:border-folia-400 font-serif font-semibold transition-colors shadow-2xs cursor-pointer shrink-0"
          >
            <span className="text-folia-800 font-bold text-xs">« » —</span>
            <span className="font-sans font-medium text-[11px]">{t('editor.special_chars')}</span>
          </button>

          {/* First line indent */}
          <CustomSelect
            value={firstLineIndent.toString()}
            onChange={(val) => onChangeFirstLineIndent(Number(val))}
            size="sm"
            options={[
              { value: '0', label: 'Rientro: nessuno' },
              { value: '0.5', label: 'Rientro: 0.5 cm' },
              { value: '1', label: 'Rientro: 1.0 cm' },
              { value: '1.25', label: 'Rientro: 1.25 cm' },
              { value: '1.5', label: 'Rientro: 1.5 cm' }
            ]}
            title={t('editor.indent')}
          />

          {/* Paragraph spacing */}
          <CustomSelect
            value={paragraphSpacing}
            onChange={(val) => onChangeParagraphSpacing(val as ParagraphSpacing)}
            size="sm"
            options={[
              { value: 'none', label: 'Spaziatura: nessuna (stile libro)' },
              { value: 'tight', label: 'Spaziatura: stretta' },
              { value: 'normal', label: 'Spaziatura: media' },
              { value: 'relaxed', label: 'Spaziatura: ampia' }
            ]}
            title="Spazio aggiuntivo tra paragrafi"
          />

          {/* Hyphenation toggle */}
          <button
            onClick={onToggleHyphenation}
            title={`Sillabazione: ${hyphenation ? 'Attiva' : 'Disattiva'}`}
            className={`h-7 flex items-center gap-1.5 px-2.5 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer shadow-2xs shrink-0 ${
              hyphenation 
                ? 'bg-folia-100 border-folia-400 text-folia-900 font-semibold' 
                : 'bg-paper-100/90 border-paper-300 text-paper-700 hover:bg-paper-200 hover:text-paper-900'
            }`}
          >
            <WrapText className="w-3.5 h-3.5 text-folia-700" />
            <span>Sillabazione</span>
          </button>

          {/* Spellcheck toggle */}
          <button
            onClick={onToggleSpellcheck}
            title={`Controllo ortografico: ${spellcheck ? 'Attivo' : 'Disattivo'}`}
            className={`h-7 flex items-center gap-1.5 px-2.5 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer shadow-2xs shrink-0 ${
              spellcheck 
                ? 'bg-folia-100 border-folia-400 text-folia-900 font-semibold' 
                : 'bg-paper-100/90 border-paper-300 text-paper-700 hover:bg-paper-200 hover:text-paper-900'
            }`}
          >
            <SpellCheck className="w-3.5 h-3.5 text-folia-700" />
            <span>Ortografia</span>
          </button>

          {/* Page Break Button */}
          <button
            onClick={onInsertPageBreak}
            title="Inserisci interruzione di pagina"
            className="h-7 flex items-center gap-1.5 px-2.5 rounded-lg text-[11px] font-medium border bg-paper-100/90 border-paper-300 text-paper-700 hover:bg-paper-200 hover:text-folia-900 transition-colors cursor-pointer shadow-2xs shrink-0"
          >
            <SeparatorHorizontal className="w-3.5 h-3.5 text-folia-700" />
            <span>Interruzione</span>
          </button>

          {/* Advanced Page Numbers Dropdown Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowPageNumMenu(!showPageNumMenu)}
              title="Configura numerazione pagine (stile e posizione)"
              className={`h-7 flex items-center gap-1.5 px-2.5 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer shadow-2xs shrink-0 ${
                showPageNumbers && pageNumberPosition !== 'none'
                  ? 'bg-folia-100 border-folia-400 text-folia-900 font-semibold' 
                  : 'bg-paper-100/90 border-paper-300 text-paper-700 hover:bg-paper-200 hover:text-paper-900'
              }`}
            >
              <Hash className="w-3.5 h-3.5 text-folia-700" />
              <span>Num. pagina</span>
              <ChevronDown className="w-3 h-3 text-paper-500" />
            </button>

            {/* Page Numbers Popover Menu */}
            {showPageNumMenu && (
              <div 
                className="absolute left-0 top-full mt-1 w-64 bg-paper-50 rounded-xl shadow-modal border border-paper-300 p-3 z-50 space-y-3 animate-in fade-in"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-paper-200">
                  <span className="font-bold text-xs text-paper-900">Numerazione Pagine</span>
                  <Checkbox
                    checked={showPageNumbers && pageNumberPosition !== 'none'}
                    onChange={(isChecked) => {
                      if (isChecked) {
                        if (!showPageNumbers) onTogglePageNumbers();
                        if (pageNumberPosition === 'none') {
                          onChangePageNumberPosition('bottom-right');
                        }
                      } else {
                        if (showPageNumbers) onTogglePageNumbers();
                      }
                    }}
                    label="Attiva"
                  />
                </div>

                {/* Position selector */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-paper-500 block">Posizione</label>
                  <CustomSelect
                    value={pageNumberPosition}
                    onChange={(val) => onChangePageNumberPosition(val as PageNumberPosition)}
                    options={[
                      { value: 'bottom-right', label: 'In basso a destra' },
                      { value: 'bottom-center', label: 'In basso al centro' },
                      { value: 'bottom-left', label: 'In basso a sinistra' },
                      { value: 'top-right', label: 'In alto a destra' },
                      { value: 'top-center', label: 'In alto al centro' },
                      { value: 'top-left', label: 'In alto a sinistra' }
                    ]}
                    className="w-full"
                    buttonClassName="w-full"
                  />
                </div>

                {/* Format selector */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-paper-500 block">Formato stile</label>
                  <CustomSelect
                    value={pageNumberFormat}
                    onChange={(val) => onChangePageNumberFormat(val as PageNumberFormat)}
                    options={[
                      { value: 'simple', label: 'Numero semplice (1, 2, 3)' },
                      { value: 'page_x_of_y', label: 'Pagina 1 di X' },
                      { value: 'dashes', label: 'Trattini editoriali (— 1 —)' }
                    ]}
                    className="w-full"
                    buttonClassName="w-full"
                  />
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => setShowPageNumMenu(false)}
                    className="px-3 py-1 bg-folia-700 text-white rounded-lg text-[11px] font-medium cursor-pointer"
                  >
                    Salva opzioni
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Word & Character Count Modal Trigger */}
          {onOpenWordCount && (
            <button
              type="button"
              onClick={onOpenWordCount}
              title="Conteggio parole, caratteri e battute (Ctrl + Shift + C)"
              className="h-7 flex items-center gap-1.5 px-2.5 rounded-lg text-[11px] font-medium border bg-paper-100/90 border-paper-300 text-paper-700 hover:bg-paper-200 hover:text-folia-900 transition-colors cursor-pointer shadow-2xs shrink-0"
            >
              <FileText className="w-3.5 h-3.5 text-folia-700" />
              <span>Conteggio</span>
            </button>
          )}

          {/* Margin Comments Toggle Button */}
          {onToggleComments && (
            <button
              type="button"
              onClick={onToggleComments}
              title="Mostra o nascondi pannello commenti a margine"
              className={`h-7 flex items-center gap-1.5 px-2.5 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer shadow-2xs shrink-0 ${
                isCommentsOpen 
                  ? 'bg-folia-100 border-folia-400 text-folia-900 font-semibold' 
                  : 'bg-paper-100/90 border-paper-300 text-paper-700 hover:bg-paper-200 hover:text-paper-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-folia-700" />
              <span>Commenti {commentsCount ? `(${commentsCount})` : ''}</span>
            </button>
          )}
        </div>

        {/* Right side: Page & Margins layout controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Page format selector */}
          <CustomSelect
            value={pageFormat}
            onChange={(val) => onChangePageFormat(val as PageFormat)}
            size="sm"
            align="right"
            options={[
              { value: 'a4', label: 'A4' },
              { value: 'cartella', label: 'Cartella editoriale' },
              { value: 'novel', label: 'Romanzo' },
              { value: 'letter', label: 'Lettera' },
              { value: 'continuous', label: 'Continuo' }
            ]}
            title={t('editor.page_format')}
          />

          {/* Margins selector */}
          {pageFormat !== 'continuous' && (
            <div className="flex items-center gap-1">
              <CustomSelect
                value={pageMargins}
                onChange={(val) => {
                  if (val === 'custom') {
                    onChangePageMargins('custom');
                    onOpenCustomMargins?.();
                  } else {
                    onChangePageMargins(val as PageMargins);
                  }
                }}
                size="sm"
                align="right"
                options={[
                  { value: 'normal', label: 'Normale (2.5 cm)' },
                  { value: 'narrow', label: 'Stretto (1.5 cm)' },
                  { value: 'wide', label: 'Ampio (3.0 cm)' },
                  { 
                    value: 'custom', 
                    label: customMargins 
                      ? `Personalizzato (${customMargins.left} cm)` 
                      : 'Personalizzato...' 
                  }
                ]}
                title={t('editor.margins')}
              />
              {pageMargins === 'custom' && (
                <button
                  type="button"
                  onClick={onOpenCustomMargins}
                  title="Modifica margini personalizzati"
                  className="h-7 w-7 flex items-center justify-center rounded-lg bg-folia-100 hover:bg-folia-200 text-folia-800 transition-colors cursor-pointer border border-folia-300 shadow-2xs"
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
