import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Link as LinkIcon, Image as ImageIcon, Trash2, Check, Loader2 } from 'lucide-react';
import { optimizeImage } from '../../utils/imageOptimizer';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveImage: (url: string) => void;
  title?: string;
  currentImage?: string;
  onRemoveImage?: () => void;
  contained?: boolean;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  onSaveImage,
  title = 'Carica Immagine',
  currentImage,
  onRemoveImage,
  contained = false
}) => {
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [previewSrc, setPreviewSrc] = useState<string | null>(currentImage || null);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever the modal opens or currentImage changes
  useEffect(() => {
    if (isOpen) {
      setPreviewSrc(currentImage || null);
      setImageUrl('');
      setFileName('');
      setError(null);
      setTab('upload');
      setIsOptimizing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen, currentImage]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Seleziona un file immagine valido (PNG, JPG, WebP, GIF).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError("L'immagine è troppo grande (massimo 20 MB).");
      return;
    }

    setError(null);
    setFileName(file.name);
    setIsOptimizing(true);
    try {
      const optimizedUrl = await optimizeImage(file);
      setPreviewSrc(optimizedUrl);
    } catch (err) {
      console.error('Failed to optimize image, using fallback:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = event.target?.result as string;
        setPreviewSrc(res);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleUrlChange = (val: string) => {
    setImageUrl(val);
    setError(null);
    if (val.trim()) {
      setPreviewSrc(val.trim());
    } else {
      setPreviewSrc(null);
    }
  };

  const handleConfirm = () => {
    if (!previewSrc) {
      setError("Seleziona o incolla un'immagine prima di salvare.");
      return;
    }
    onSaveImage(previewSrc);
    onClose();
  };

  const handleRemove = () => {
    if (onRemoveImage) {
      onRemoveImage();
    }
    setPreviewSrc(null);
    setImageUrl('');
    setFileName('');
    onClose();
  };

  return (
    <div 
      className={`${contained ? 'absolute' : 'fixed'} inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in select-none folia-modal-overlay`}
      onClick={onClose}
    >
      <div 
        className="bg-paper-50 rounded-2xl shadow-modal border border-paper-300 w-full max-w-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-paper-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-folia-100 text-folia-800 rounded-xl">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-brand font-semibold text-lg text-paper-900">{title}</h3>
              <p className="text-xs text-paper-500">Formati supportati: PNG, JPG, WebP, GIF</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-paper-400 hover:text-paper-700 hover:bg-paper-150 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-paper-200 bg-paper-100/60 px-6 pt-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => setTab('upload')}
            className={`flex items-center gap-1.5 px-4 py-2 border-b-2 font-medium transition-colors cursor-pointer ${
              tab === 'upload'
                ? 'border-folia-700 text-folia-900 font-semibold'
                : 'border-transparent text-paper-600 hover:text-paper-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Carica dal computer</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('url')}
            className={`flex items-center gap-1.5 px-4 py-2 border-b-2 font-medium transition-colors cursor-pointer ${
              tab === 'url'
                ? 'border-folia-700 text-folia-900 font-semibold'
                : 'border-transparent text-paper-600 hover:text-paper-900'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Indirizzo Web (URL)</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {tab === 'upload' ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-paper-300 hover:border-folia-600 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-white/60 hover:bg-folia-50/40"
              >
                {isOptimizing ? (
                  <div className="flex flex-col items-center justify-center py-2">
                    <Loader2 className="w-8 h-8 text-folia-600 animate-spin mb-2" />
                    <div className="text-xs font-semibold text-folia-800 mb-1">
                      Ottimizzazione in corso...
                    </div>
                    <div className="text-[11px] text-paper-500">
                      Conversione in formato WebP ad alta qualità e peso ridotto
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-paper-400 mx-auto mb-2" />
                    <div className="text-xs font-semibold text-paper-800 mb-1">
                      {fileName ? fileName : "Clicca per scegliere un'immagine"}
                    </div>
                    <div className="text-[11px] text-paper-500">
                      PNG, JPG, WebP fino a 20 MB (ottimizzata automaticamente)
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-paper-700 uppercase tracking-wider mb-1.5">
                {"URL dell'immagine"}
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://esempio.com/illustrazione.jpg"
                className="w-full px-3.5 py-2 text-xs bg-white border border-paper-300 rounded-xl focus:outline-hidden focus:border-folia-600 focus:ring-1 focus:ring-folia-600 font-sans"
              />
            </div>
          )}

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs">
              {error}
            </div>
          )}

          {/* Preview Box */}
          {previewSrc && (
            <div>
              <div className="text-[11px] font-bold text-paper-600 uppercase tracking-wider mb-2">
                Anteprima
              </div>
              <div className="w-full h-44 rounded-xl border border-paper-300 bg-paper-100 overflow-hidden flex items-center justify-center relative shadow-xs">
                <img
                  src={previewSrc}
                  alt="Anteprima"
                  onError={() => setError("Impossibile caricare l'immagine da questo URL.")}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-paper-200 bg-paper-100 flex items-center justify-between">
          <div>
            {currentImage && onRemoveImage && (
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-700 hover:text-rose-800 hover:bg-rose-50 rounded-xl font-medium transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Rimuovi immagine</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-paper-700 hover:bg-paper-200 transition-colors cursor-pointer"
            >
              Annulla
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!previewSrc || isOptimizing}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-folia-700 hover:bg-folia-800 disabled:opacity-40 text-white text-xs font-medium transition-colors cursor-pointer shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Salva immagine</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
