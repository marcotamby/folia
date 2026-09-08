import React, { useState, useEffect, useRef } from 'react';
import { Link2, X, ExternalLink, Unlink, Check } from 'lucide-react';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUrl?: string;
  initialText?: string;
  isEditingExisting?: boolean;
  onSave: (url: string, text?: string) => void;
  onRemove?: () => void;
}

export const LinkModal: React.FC<LinkModalProps> = ({
  isOpen,
  onClose,
  initialUrl = '',
  initialText = '',
  isEditingExisting = false,
  onSave,
  onRemove
}) => {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUrl(typeof initialUrl === 'string' ? initialUrl : '');
      setText(typeof initialText === 'string' ? initialText : '');
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  }, [isOpen, initialUrl, initialText]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let cleanUrl = typeof url === 'string' ? url.trim() : '';
    if (!cleanUrl) return;

    // Automatically prepend https:// if missing protocol
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://') && !cleanUrl.startsWith('mailto:')) {
      cleanUrl = 'https://' + cleanUrl;
    }

    onSave(cleanUrl, typeof text === 'string' ? text.trim() || undefined : undefined);
    onClose();
  };

  const handleTestLink = () => {
    let cleanUrl = typeof url === 'string' ? url.trim() : '';
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

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in select-none folia-modal-overlay"
      onClick={onClose}
    >
      <div 
        className="bg-paper-50 rounded-2xl shadow-modal border border-paper-300 w-full max-w-md overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-paper-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-folia-100 text-folia-800 rounded-xl border border-folia-200">
              <Link2 className="w-4 h-4 text-folia-800" />
            </div>
            <div>
              <h3 className="font-brand font-bold text-base text-paper-900 leading-tight">
                {isEditingExisting ? 'Modifica collegamento web' : 'Inserisci collegamento web'}
              </h3>
              <p className="text-xs text-paper-500">
                Apre la pagina nel tuo browser predefinito
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-paper-400 hover:text-paper-700 hover:bg-paper-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body / Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Testo visualizzato (opzionale se già selezionato) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-paper-700 block">
              Testo visualizzato
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Testo del link nel manoscritto"
              className="w-full px-3 py-2 text-sm bg-white border border-paper-300 rounded-xl focus:border-folia-600 focus:ring-1 focus:ring-folia-600 outline-hidden text-paper-900 placeholder:text-paper-400"
            />
          </div>

          {/* Indirizzo Web / URL */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-paper-700 block">
                Indirizzo web (URL)
              </label>
              {url.trim() && (
                <button
                  type="button"
                  onClick={handleTestLink}
                  title="Verifica link nel browser"
                  className="text-[11px] text-folia-700 hover:text-folia-900 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Apri nel browser</span>
                </button>
              )}
            </div>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.esempio.it"
                required
                className="w-full px-3 py-2 text-sm bg-white border border-paper-300 rounded-xl focus:border-folia-600 focus:ring-1 focus:ring-folia-600 outline-hidden text-paper-900 placeholder:text-paper-400 font-mono text-xs"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-paper-200">
            <div>
              {isEditingExisting && onRemove && (
                <button
                  type="button"
                  onClick={() => {
                    onRemove();
                    onClose();
                  }}
                  className="px-3 py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Unlink className="w-3.5 h-3.5" />
                  <span>Rimuovi link</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs text-paper-600 hover:text-paper-800 hover:bg-paper-200 rounded-xl font-medium transition-colors cursor-pointer"
              >
                Annulla
              </button>
              <button
                type="submit"
                disabled={!url.trim()}
                className="px-4 py-1.5 text-xs bg-folia-700 hover:bg-folia-800 disabled:opacity-50 text-white rounded-xl font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isEditingExisting ? 'Aggiorna' : 'Inserisci'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
