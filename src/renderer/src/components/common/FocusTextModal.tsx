import React, { useEffect, useRef } from 'react';
import { Minimize2, X, FileText } from 'lucide-react';

export interface FocusTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const FocusTextModal: React.FC<FocusTextModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  value,
  onChange,
  placeholder = 'Scrivi qui...'
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus textarea and move cursor to end of text
      const timer = setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const length = textareaRef.current.value.length;
          textareaRef.current.setSelectionRange(length, length);
        }
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const wordCount = value.trim() ? value.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = value.length;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 md:p-8 animate-in fade-in select-none"
      onClick={onClose}
    >
      <div 
        className="bg-paper-50 rounded-2xl shadow-modal border border-paper-300 w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-paper-200/80 bg-paper-100/60">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-folia-100 border border-folia-200/80 flex items-center justify-center text-folia-800 shrink-0 shadow-2xs">
              {icon || <FileText className="w-5 h-5 text-folia-800" />}
            </div>
            <div className="min-w-0">
              <h3 className="font-brand font-bold text-base md:text-lg text-paper-900 truncate leading-tight">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-paper-500 truncate mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Word & Char Counter */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-paper-500 bg-paper-200/60 px-3 py-1.5 rounded-lg border border-paper-250">
              <span className="font-medium text-paper-800">{wordCount}</span> parole
              <span className="text-paper-300">•</span>
              <span className="font-medium text-paper-800">{charCount}</span> caratteri
            </div>

            <button
              type="button"
              onClick={onClose}
              title="Riduci a vista normale (Esc)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-paper-600 hover:text-paper-900 hover:bg-paper-200 border border-paper-250 transition-colors cursor-pointer text-xs font-medium"
            >
              <Minimize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Riduci</span>
            </button>
          </div>
        </div>

        {/* Modal Body / Textarea */}
        <div className="flex-1 p-6 md:p-8 flex flex-col bg-paper-100/30 overflow-hidden">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 w-full p-5 bg-paper-50 rounded-xl border border-paper-250 focus:outline-hidden focus:ring-1 focus:ring-folia-600 focus:border-folia-600 text-base md:text-lg text-paper-900 placeholder-paper-350 leading-relaxed resize-none font-sans overflow-y-auto select-text shadow-2xs"
          />
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-paper-200/80 bg-paper-100/60 text-xs">
          <span className="text-paper-400 text-[11px]">
            Suggerimento: premi <kbd className="px-1.5 py-0.5 rounded bg-paper-200 text-paper-700 font-mono text-[10px] border border-paper-300">Esc</kbd> per tornare alla scheda
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-folia-800 hover:bg-folia-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Fatto e chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
