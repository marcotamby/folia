import React from 'react';
import { AlertTriangle, Save, LogOut, X } from 'lucide-react';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAndExit: () => void;
  onDiscardAndExit: () => void;
  projectTitle?: string;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onClose,
  onSaveAndExit,
  onDiscardAndExit,
  projectTitle
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-in fade-in select-none folia-modal-overlay">
      <div 
        className="bg-paper-50 rounded-2xl shadow-modal border border-paper-300 w-full max-w-md overflow-hidden flex flex-col p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center shrink-0 shadow-2xs">
              <AlertTriangle className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <h3 className="font-brand font-bold text-lg text-paper-900 leading-snug">Modifiche non salvate</h3>
              <p className="text-xs text-paper-500">Salva il tuo lavoro prima di chiudere Folia</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-paper-400 hover:text-paper-700 hover:bg-paper-150 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message body */}
        <div className="text-sm text-paper-700 leading-relaxed bg-paper-100 p-4 rounded-xl border border-paper-250">
          Hai apportato modifiche a <strong>"{projectTitle || 'questo progetto'}"</strong> che non sono state ancora salvate su disco. Vuoi salvare prima di uscire?
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl bg-paper-200 hover:bg-paper-300 text-paper-800 text-xs font-semibold transition-colors cursor-pointer text-center"
          >
            Annulla
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onDiscardAndExit}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Esci senza salvare</span>
            </button>

            <button
              type="button"
              onClick={onSaveAndExit}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-folia-700 hover:bg-folia-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salva ed esci</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
