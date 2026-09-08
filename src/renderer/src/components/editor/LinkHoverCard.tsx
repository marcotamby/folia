import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Edit2, Unlink, Globe } from 'lucide-react';

interface LinkHoverCardProps {
  url: string | null;
  text?: string;
  position: { x: number; y: number } | null;
  onOpen: (url: string) => void;
  onEdit: () => void;
  onRemove: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const LinkHoverCard: React.FC<LinkHoverCardProps> = ({
  url,
  text,
  position,
  onOpen,
  onEdit,
  onRemove,
  onMouseEnter,
  onMouseLeave
}) => {
  const [copied, setCopied] = useState(false);

  if (!url || !position || typeof url !== 'string') return null;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen(url);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove();
  };

  // Ensure card stays within viewport horizontally
  const clampedX = Math.min(Math.max(180, position.x), window.innerWidth - 180);
  const isNearTop = position.y < 90;

  // Format clean display URL (remove protocol prefix for compact display)
  const displayUrl = url.replace(/^https?:\/\//i, '').replace(/^www\./i, '');

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        top: isNearTop ? `${Math.round(position.y + 26)}px` : `${Math.round(position.y - 8)}px`,
        left: `${Math.round(clampedX)}px`,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      }}
      className={`fixed z-50 transform -translate-x-1/2 ${
        isNearTop ? '' : '-translate-y-full'
      } bg-white rounded-2xl border border-paper-300 shadow-xl p-2.5 text-xs select-none animate-in fade-in duration-100 min-w-[280px] max-w-sm folia-link-hover-card`}
    >
      {/* Safe hover bridge between text and card */}
      <div 
        className={`absolute left-0 right-0 h-4 pointer-events-auto ${
          isNearTop ? '-top-4' : '-bottom-4'
        }`} 
      />

      {/* Top: URL preview & Quick Open */}
      <div className="flex items-center gap-2 px-1 pb-2 border-b border-paper-150">
        <div className="p-1.5 rounded-lg bg-folia-100 text-folia-800 shrink-0">
          <Globe className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          {text && (
            <p className="text-[11px] font-semibold text-paper-800 truncate leading-tight">
              {text}
            </p>
          )}
          <button
            type="button"
            onClick={handleOpen}
            title={`Apri ${url}`}
            className="text-[11px] font-mono text-folia-700 hover:text-folia-900 hover:underline truncate block text-left cursor-pointer w-full"
          >
            {displayUrl}
          </button>
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="flex items-center justify-between pt-2 gap-1">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleOpen}
            title="Apri nel browser predefinito"
            className="px-2.5 py-1 rounded-lg bg-folia-800 hover:bg-folia-900 text-white font-semibold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Apri</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            title="Copia link negli appunti"
            className="px-2 py-1 rounded-lg text-paper-700 hover:text-paper-900 hover:bg-paper-150 text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copiato!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copia</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleEdit}
            title="Modifica link e testo"
            className="px-2 py-1 rounded-lg text-paper-700 hover:text-paper-900 hover:bg-paper-150 text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
            <span>Modifica</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleRemove}
          title="Rimuovi collegamento (mantieni il testo)"
          className="px-2 py-1 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Unlink className="w-3 h-3" />
          <span>Rimuovi</span>
        </button>
      </div>

      {/* Quick shortcut hint */}
      <div className="mt-1.5 pt-1.5 border-t border-paper-100 flex items-center justify-between text-[10px] text-paper-400">
        <span>Suggerimento rapido:</span>
        <span className="font-sans">
          <kbd className="px-1 py-0.5 bg-paper-100 border border-paper-250 rounded font-mono text-[9px] text-paper-600">Ctrl</kbd> + Clic sul testo per aprire
        </span>
      </div>
    </div>
  );
};
