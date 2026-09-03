import React from 'react';
import { Trash2, ExternalLink, BookmarkCheck } from 'lucide-react';
import { Footnote } from '../../types';

interface FootnotesListProps {
  footnotes: Footnote[];
  onUpdateFootnote: (id: string, content: string) => void;
  onDeleteFootnote: (id: string) => void;
  onJumpToFootnoteInText: (id: string) => void;
}

export const FootnotesList: React.FC<FootnotesListProps> = ({
  footnotes,
  onUpdateFootnote,
  onDeleteFootnote,
  onJumpToFootnoteInText
}) => {
  if (!footnotes || footnotes.length === 0) return null;

  return (
    <div className="mt-12 pt-6 border-t border-paper-300 select-text font-serif">
      <div className="flex items-center justify-between mb-3 text-xs font-sans text-paper-500 font-semibold uppercase tracking-wider select-none">
        <div className="flex items-center gap-2">
          <BookmarkCheck className="w-4 h-4 text-folia-800" />
          <span>Note a piè di pagina ({footnotes.length})</span>
        </div>
        <span className="text-[10.5px] text-paper-400 font-normal lowercase italic">
          visibili in fondo al capitolo
        </span>
      </div>

      <div className="space-y-3">
        {footnotes.map((fn, idx) => (
          <div 
            key={fn.id} 
            id={`footnote-${fn.id}`}
            className="group flex items-start gap-2.5 p-2 rounded-xl hover:bg-paper-100/70 border border-transparent hover:border-paper-250 transition-colors"
          >
            {/* Footnote Index Marker */}
            <div className="flex items-center gap-1 font-bold text-xs text-folia-900 pt-1 shrink-0 font-sans select-none">
              <span className="w-5 text-right font-mono">{idx + 1}.</span>
            </div>

            {/* Note Textarea */}
            <textarea
              value={fn.content}
              onChange={(e) => onUpdateFootnote(fn.id, e.target.value)}
              placeholder="Inserisci qui il testo della nota a piè di pagina, citazione o commento bibliografico..."
              rows={2}
              className="flex-1 p-2 bg-white/70 hover:bg-white focus:bg-white rounded-lg border border-paper-250 focus:border-folia-600 focus:outline-hidden text-xs text-paper-800 leading-relaxed resize-none transition-all font-serif"
            />

            {/* Action buttons */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity pt-1 select-none">
              <button
                type="button"
                onClick={() => onJumpToFootnoteInText(fn.id)}
                title="Torna al riferimento nel testo"
                className="p-1 rounded-lg text-paper-400 hover:text-folia-800 hover:bg-paper-200 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDeleteFootnote(fn.id)}
                title="Elimina nota a piè di pagina"
                className="p-1 rounded-lg text-paper-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
