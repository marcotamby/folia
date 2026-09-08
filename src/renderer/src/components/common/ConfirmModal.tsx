import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  subtitle?: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'folia';
  contained?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  subtitle = 'Questa azione non può essere annullata',
  message,
  confirmLabel = 'Elimina definitivamente',
  cancelLabel = 'Annulla',
  variant = 'danger',
  contained = false
}) => {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';
  const isWarning = variant === 'warning';

  return (
    <div 
      className={`${contained ? 'absolute' : 'fixed'} inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in select-none folia-modal-overlay`}
      onClick={onClose}
    >
      <div 
        className="bg-paper-50 rounded-2xl shadow-modal border border-paper-300 w-full max-w-md overflow-hidden flex flex-col p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-2xs ${
              isDanger 
                ? 'bg-rose-100 text-rose-800 border-rose-200' 
                : isWarning 
                ? 'bg-amber-100 text-amber-800 border-amber-200' 
                : 'bg-folia-100 text-folia-800 border-folia-200'
            }`}>
              {isDanger ? (
                <Trash2 className="w-6 h-6 text-rose-700" />
              ) : isWarning ? (
                <AlertTriangle className="w-6 h-6 text-amber-700" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-folia-800" />
              )}
            </div>
            <div>
              <h3 className="font-brand font-bold text-lg text-paper-900 leading-snug">{title}</h3>
              {subtitle && <p className="text-xs text-paper-500">{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-paper-400 hover:text-paper-700 hover:bg-paper-150 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-sm text-paper-700 leading-relaxed bg-paper-100 p-3.5 rounded-xl border border-paper-250">
          {message}
        </div>

        <div className="flex justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-paper-200 hover:bg-paper-300 text-paper-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-5 py-2 rounded-xl text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer ${
              isDanger 
                ? 'bg-rose-700 hover:bg-rose-800' 
                : isWarning 
                ? 'bg-amber-700 hover:bg-amber-800' 
                : 'bg-folia-700 hover:bg-folia-800'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
