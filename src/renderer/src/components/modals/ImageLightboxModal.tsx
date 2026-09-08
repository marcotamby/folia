import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Camera, Download } from 'lucide-react';

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  src?: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  onEdit?: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  onClose,
  src,
  alt = 'Immagine',
  title,
  subtitle,
  onEdit
}) => {
  const [zoom, setZoom] = useState(1);

  // Reset zoom on open
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !src) return null;

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom(1);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/85 backdrop-blur-md p-4 md:p-6 animate-in fade-in duration-200 select-none cursor-pointer"
      onClick={onClose}
    >
      {/* Top Floating Toolbar */}
      <div
        className="w-full max-w-5xl flex items-center justify-between gap-4 py-2 px-4 rounded-2xl bg-black/60 border border-white/15 text-white backdrop-blur-md shrink-0 cursor-default shadow-xl z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="min-w-0 flex items-center gap-3">
          <div>
            {title && (
              <h3 className="font-brand font-bold text-base md:text-lg text-white truncate drop-shadow-xs">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-white/70 truncate">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-xl border border-white/10 text-xs">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              title="Riduci zoom (-)"
              className="p-1 rounded-lg hover:bg-white/20 disabled:opacity-30 transition-colors cursor-pointer text-white"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              title="Ripristina zoom 100%"
              className="px-1.5 py-0.5 text-xs font-mono font-semibold hover:text-folia-300 transition-colors cursor-pointer text-white"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              title="Aumenta zoom (+)"
              className="p-1 rounded-lg hover:bg-white/20 disabled:opacity-30 transition-colors cursor-pointer text-white"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {onEdit && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-folia-600 hover:bg-folia-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              title="Cambia o modifica immagine"
            >
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Modifica</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
            title="Chiudi (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Viewport */}
      <div
        className="flex-1 w-full flex items-center justify-center overflow-auto p-2 cursor-default"
        onClick={onClose}
      >
        <div
          className="relative max-w-full max-h-full flex items-center justify-center transition-transform duration-150 ease-out"
          style={{ transform: `scale(${zoom})` }}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={src}
            alt={alt}
            draggable={false}
            className="max-h-[82vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl border border-white/10"
          />
        </div>
      </div>

      {/* Footer Info Hint */}
      <div
        className="text-[11px] text-white/60 text-center py-1 cursor-default shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        Clicca all'esterno o premi <kbd className="px-1.5 py-0.5 bg-white/15 rounded text-[10px] text-white font-mono">Esc</kbd> per chiudere
      </div>
    </div>
  );
};
