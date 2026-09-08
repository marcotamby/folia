import React, { useState, useEffect, useRef } from 'react';
import { Bookmark, X, Trash2, Check, Tag, Clock, Radio } from 'lucide-react';
import { SessionMarker } from '../../types';
import { formatDuration } from './AudioPlayer';

interface MarkerEditModalProps {
  isOpen: boolean;
  marker: SessionMarker | null;
  isLive?: boolean;
  onSave: (updatedMarker: SessionMarker) => void;
  onClose: () => void;
  onDelete?: (markerId: string) => void;
  t?: (key: string) => string;
}

const QUICK_TAGS = [
  'Combattimento',
  'Incontro PNG',
  'Loot & Tesoro',
  'Luogo chiave',
  'Rivelazione',
  'Colpo di scena',
  'Regola & Note'
];

export const MarkerEditModal: React.FC<MarkerEditModalProps> = ({
  isOpen,
  marker,
  isLive = false,
  onSave,
  onClose,
  onDelete
}) => {
  const [label, setLabel] = useState('');
  const [notes, setNotes] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (marker) {
      setLabel(marker.label === 'Segnalibro' && isLive ? '' : marker.label || '');
      setNotes(marker.notes || '');
    }
  }, [marker, isLive]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen || !marker) return null;

  const handleSave = () => {
    onSave({
      ...marker,
      label: label.trim() || 'Segnalibro',
      notes: notes.trim() ? notes.trim() : undefined
    });
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  const applyTag = (tag: string) => {
    if (!label.trim()) {
      setLabel(tag);
    } else if (!label.toLowerCase().includes(tag.toLowerCase())) {
      setLabel(`${tag}: ${label}`);
    }
    inputRef.current?.focus();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div 
        className="w-full max-w-lg bg-paper-50 rounded-2xl shadow-modal border border-paper-300 p-6 space-y-4 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-paper-200 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center shadow-2xs shrink-0">
              <Bookmark className="w-5 h-5 fill-amber-500 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-paper-900 font-brand">
                  {isLive ? 'Appunto sul Segnalibro' : 'Modifica Segnalibro'}
                </h3>
                {/* Timestamp Badge */}
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-amber-900 text-xs font-mono font-bold">
                  <Clock className="w-3 h-3 text-amber-700" />
                  <span>{formatDuration(marker.timestamp)}</span>
                </div>
              </div>

              {/* Live recording indicator */}
              {isLive ? (
                <div className="flex items-center gap-1.5 text-[11px] text-red-600 font-medium mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  <span>Registrazione audio attiva in background</span>
                </div>
              ) : (
                <p className="text-xs text-paper-500 mt-0.5">
                  Modifica titolo e dettagli di questo momento della sessione
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-paper-400 hover:text-paper-700 hover:bg-paper-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-3.5">
          {/* Label field */}
          <div>
            <label className="block text-xs font-semibold text-paper-800 mb-1">
              Titolo o Evento <span className="text-amber-700">*</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
                  e.preventDefault();
                  handleSave();
                }
              }}
              placeholder="Es. Incontro con il mercante, Combattimento, Indizio segreto..."
              className="w-full px-3 py-2 text-xs bg-white border border-paper-300 rounded-xl text-paper-900 placeholder:text-paper-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs font-medium"
            />
          </div>

          {/* Quick Tag suggestions */}
          <div>
            <div className="flex items-center gap-1 text-[11px] text-paper-500 mb-1.5 font-medium">
              <Tag className="w-3 h-3 text-paper-400" />
              <span>Suggerimenti rapidi:</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => applyTag(tag)}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-paper-100 hover:bg-amber-100 hover:text-amber-900 border border-paper-250 text-paper-700 transition-colors cursor-pointer shadow-2xs"
                >
                  +{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Notes textarea */}
          <div>
            <label className="block text-xs font-semibold text-paper-800 mb-1">
              Note & Dettagli <span className="text-paper-400 font-normal">(facoltativo)</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Appunta qui cosa è accaduto: danni, nomi di PNG, oggetti trovati o decisioni importanti..."
              className="w-full p-3 text-xs leading-relaxed bg-white border border-paper-300 rounded-xl text-paper-900 placeholder:text-paper-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-paper-200">
          <div>
            {onDelete && !isLive && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Eliminare questo segnalibro?')) {
                    onDelete(marker.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Elimina</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-paper-700 hover:bg-paper-200 rounded-xl transition-colors cursor-pointer"
            >
              {isLive ? 'Chiudi (lascia predefinito)' : 'Annulla'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-folia-700 hover:bg-folia-800 rounded-xl shadow-xs transition-colors cursor-pointer active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Salva appunto</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
