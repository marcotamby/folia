import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Replace, 
  CaseSensitive, 
  WholeWord,
  CheckCheck
} from 'lucide-react';
import { Editor } from '@tiptap/react';

interface FindReplaceBarProps {
  editor: Editor | null;
  isOpen: boolean;
  onClose: () => void;
  showReplaceInitially?: boolean;
}

interface MatchRange {
  from: number;
  to: number;
}

export const FindReplaceBar: React.FC<FindReplaceBarProps> = ({
  editor,
  isOpen,
  onClose,
  showReplaceInitially = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [showReplace, setShowReplace] = useState(showReplaceInitially);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [matches, setMatches] = useState<MatchRange[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when bar opens
  useEffect(() => {
    if (isOpen) {
      setShowReplace(showReplaceInitially);
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.select();
        }
      }, 50);
    } else {
      setSearchTerm('');
      setMatches([]);
      setCurrentIndex(-1);
    }
  }, [isOpen, showReplaceInitially]);

  // Compute matches whenever search criteria or doc changes
  const computeMatches = useCallback((): MatchRange[] => {
    if (!editor || !searchTerm.trim()) {
      return [];
    }

    const doc = editor.state.doc;
    const results: MatchRange[] = [];

    // Escape regex special chars
    let escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (wholeWord) {
      escaped = `\\b${escaped}\\b`;
    }

    const flags = caseSensitive ? 'gu' : 'giu';
    let regex: RegExp;
    try {
      regex = new RegExp(escaped, flags);
    } catch {
      return [];
    }

    // Traverse doc text nodes
    doc.descendants((node, pos) => {
      if (node.isText && node.text) {
        let match: RegExpExecArray | null;
        while ((match = regex.exec(node.text)) !== null) {
          const from = pos + match.index;
          const to = from + match[0].length;
          results.push({ from, to });
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      }
    });

    return results;
  }, [editor, searchTerm, caseSensitive, wholeWord]);

  // Update matches and jump to first
  useEffect(() => {
    if (!isOpen) return;
    const newMatches = computeMatches();
    setMatches(newMatches);

    if (newMatches.length > 0) {
      // Find closest match to current selection
      const currentPos = editor?.state.selection.from ?? 0;
      let nextIdx = newMatches.findIndex(m => m.from >= currentPos);
      if (nextIdx === -1) nextIdx = 0;
      setCurrentIndex(nextIdx);

      const target = newMatches[nextIdx];
      editor?.chain().setTextSelection({ from: target.from, to: target.to }).scrollIntoView().run();
    } else {
      setCurrentIndex(-1);
    }
  }, [searchTerm, caseSensitive, wholeWord, computeMatches, isOpen]);

  const goToNext = () => {
    if (matches.length === 0) return;
    const next = (currentIndex + 1) % matches.length;
    setCurrentIndex(next);
    const target = matches[next];
    editor?.chain().setTextSelection({ from: target.from, to: target.to }).scrollIntoView().run();
  };

  const goToPrev = () => {
    if (matches.length === 0) return;
    const prev = (currentIndex - 1 + matches.length) % matches.length;
    setCurrentIndex(prev);
    const target = matches[prev];
    editor?.chain().setTextSelection({ from: target.from, to: target.to }).scrollIntoView().run();
  };

  const replaceCurrent = () => {
    if (!editor || currentIndex === -1 || matches.length === 0) return;
    const target = matches[currentIndex];

    // Replace current selection
    editor.chain().focus().insertContentAt({ from: target.from, to: target.to }, replaceTerm).run();

    // Recompute
    setTimeout(() => {
      const refreshed = computeMatches();
      setMatches(refreshed);
      if (refreshed.length > 0) {
        const nextIdx = Math.min(currentIndex, refreshed.length - 1);
        setCurrentIndex(nextIdx);
        const nextTarget = refreshed[nextIdx];
        editor.chain().setTextSelection({ from: nextTarget.from, to: nextTarget.to }).scrollIntoView().run();
      } else {
        setCurrentIndex(-1);
      }
    }, 20);
  };

  const replaceAll = () => {
    if (!editor || matches.length === 0) return;

    // Replace from bottom to top to preserve character offsets
    const sorted = [...matches].sort((a, b) => b.from - a.from);
    let tr = editor.state.tr;
    sorted.forEach(m => {
      tr = tr.insertText(replaceTerm, m.from, m.to);
    });
    editor.view.dispatch(tr);

    setTimeout(() => {
      setMatches([]);
      setCurrentIndex(-1);
    }, 20);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        goToPrev();
      } else {
        goToNext();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      editor?.commands.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-3 right-5 z-30 bg-paper-50/95 backdrop-blur-md border border-paper-300 shadow-modal rounded-2xl p-3 w-84 md:w-96 text-xs flex flex-col gap-2.5 animate-in slide-in-from-top-2 duration-150 select-none">
      {/* Search Row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 flex items-center">
          <Search className="w-3.5 h-3.5 text-paper-400 absolute left-2.5 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Trova nel capitolo..."
            className="w-full pl-8 pr-24 py-1.5 bg-paper-100/80 border border-paper-250 rounded-xl text-paper-900 focus:outline-hidden focus:bg-white focus:border-folia-600 focus:ring-1 focus:ring-folia-600 font-sans text-xs"
          />
          {/* Match counter inside search input */}
          <div className="absolute right-2 text-[10.5px] font-medium text-paper-500 pointer-events-none">
            {searchTerm.trim() ? (
              matches.length > 0 ? (
                <span>{currentIndex + 1} di {matches.length}</span>
              ) : (
                <span className="text-rose-600">Nessun match</span>
              )
            ) : null}
          </div>
        </div>

        {/* Prev / Next buttons */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={goToPrev}
            disabled={matches.length === 0}
            title="Precedente (Shift+Invio)"
            className="p-1.5 rounded-lg text-paper-600 hover:bg-paper-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={goToNext}
            disabled={matches.length === 0}
            title="Successivo (Invio)"
            className="p-1.5 rounded-lg text-paper-600 hover:bg-paper-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          title="Chiudi (Esc)"
          className="p-1.5 rounded-lg text-paper-400 hover:text-paper-800 hover:bg-paper-200 transition-colors cursor-pointer ml-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Options & Replace Toggle */}
      <div className="flex items-center justify-between pt-0.5 border-t border-paper-200/60 text-[11px]">
        <div className="flex items-center gap-1">
          {/* Case Sensitive */}
          <button
            type="button"
            onClick={() => setCaseSensitive(!caseSensitive)}
            title="Distingui maiuscole e minuscole"
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[10.5px] font-semibold transition-all cursor-pointer ${
              caseSensitive 
                ? 'bg-folia-100 text-folia-900 border-folia-400 shadow-2xs' 
                : 'bg-paper-100 text-paper-600 border-paper-250 hover:bg-paper-200'
            }`}
          >
            <CaseSensitive className="w-3.5 h-3.5" />
            <span>Aa</span>
          </button>

          {/* Whole Word */}
          <button
            type="button"
            onClick={() => setWholeWord(!wholeWord)}
            title="Parola intera"
            className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[10.5px] font-semibold transition-all cursor-pointer ${
              wholeWord 
                ? 'bg-folia-100 text-folia-900 border-folia-400 shadow-2xs' 
                : 'bg-paper-100 text-paper-600 border-paper-250 hover:bg-paper-200'
            }`}
          >
            <WholeWord className="w-3.5 h-3.5" />
            <span>Parola</span>
          </button>
        </div>

        {/* Toggle Replace row */}
        <button
          type="button"
          onClick={() => setShowReplace(!showReplace)}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors cursor-pointer text-[11px] font-medium ${
            showReplace ? 'text-folia-800 bg-folia-50 font-semibold' : 'text-paper-600 hover:text-paper-900'
          }`}
        >
          <Replace className="w-3 h-3" />
          <span>{showReplace ? 'Nascondi sostituzione' : 'Sostituisci...'}</span>
        </button>
      </div>

      {/* Replace Row (Collapsible) */}
      {showReplace && (
        <div className="pt-2 border-t border-paper-200/60 flex flex-col gap-2 animate-in fade-in duration-100">
          <div className="relative flex items-center">
            <Replace className="w-3.5 h-3.5 text-paper-400 absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              value={replaceTerm}
              onChange={(e) => setReplaceTerm(e.target.value)}
              placeholder="Sostituisci con..."
              className="w-full pl-8 pr-3 py-1.5 bg-paper-100/80 border border-paper-250 rounded-xl text-paper-900 focus:outline-hidden focus:bg-white focus:border-folia-600 focus:ring-1 focus:ring-folia-600 font-sans text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={replaceCurrent}
              disabled={matches.length === 0}
              className="px-2.5 py-1 rounded-lg bg-paper-200 hover:bg-paper-300 disabled:opacity-30 disabled:hover:bg-paper-200 text-paper-800 text-[11px] font-medium transition-colors cursor-pointer"
            >
              Sostituisci
            </button>
            <button
              type="button"
              onClick={replaceAll}
              disabled={matches.length === 0}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-folia-800 hover:bg-folia-900 disabled:opacity-30 disabled:hover:bg-folia-800 text-white text-[11px] font-semibold transition-colors cursor-pointer shadow-2xs"
            >
              <CheckCheck className="w-3 h-3" />
              <span>Sostituisci tutto ({matches.length})</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
