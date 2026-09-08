import React, { useState, useRef, useEffect } from 'react';
import { X, Image as ImageIcon, Upload, Link as LinkIcon, AlertCircle, Loader2 } from 'lucide-react';
import { optimizeImage } from '../../utils/imageOptimizer';

interface InsertImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertImage: (src: string, alt?: string) => void;
}

export const InsertImageModal: React.FC<InsertImageModalProps> = ({
  isOpen,
  onClose,
  onInsertImage
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setImagePreview(null);
      setImageUrl('');
      setCaption('');
      setError(null);
      setActiveTab('upload');
      setIsOptimizing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Seleziona un file immagine valido (PNG, JPG, WEBP, GIF)');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError("L'immagine supera la dimensione massima consentita di 20MB.");
      return;
    }

    setIsOptimizing(true);
    try {
      const optimized = await optimizeImage(file);
      setImagePreview(optimized);
    } catch (err) {
      console.error('Failed to optimize image, fallback to raw:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    setError(null);
    if (url.trim()) {
      setImagePreview(url.trim());
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSrc = activeTab === 'upload' ? imagePreview : imageUrl.trim();

    if (!finalSrc) {
      setError('Seleziona un file o inserisci un URL valido.');
      return;
    }

    onInsertImage(finalSrc, caption.trim() || undefined);
    onClose();
    // Reset state
    setImageUrl('');
    setImagePreview(null);
    setCaption('');
    setError(null);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-in fade-in select-none folia-modal-overlay"
      onClick={onClose}
    >
      <div 
        className="bg-paper-50 rounded-2xl shadow-modal border border-paper-300 w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-paper-200/80 bg-paper-100/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-folia-100 border border-folia-200 flex items-center justify-center text-folia-800 shrink-0 shadow-2xs">
              <ImageIcon className="w-5 h-5 text-folia-800" />
            </div>
            <div>
              <h3 className="font-brand font-bold text-base text-paper-900">Inserisci immagine</h3>
              <p className="text-xs text-paper-500">Aggiungi mappe, stemmi o illustrazioni al capitolo</p>
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

        {/* Tabs */}
        <div className="flex border-b border-paper-200 px-6 pt-3 bg-paper-50">
          <button
            type="button"
            onClick={() => { setActiveTab('upload'); setError(null); }}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'upload' 
                ? 'border-folia-700 text-folia-900' 
                : 'border-transparent text-paper-500 hover:text-paper-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Dal computer</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('url'); setError(null); }}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'url' 
                ? 'border-folia-700 text-folia-900' 
                : 'border-transparent text-paper-500 hover:text-paper-800'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Da indirizzo Web</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'upload' ? (
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
                className="border-2 border-dashed border-paper-300 hover:border-folia-600 rounded-2xl p-6 text-center cursor-pointer bg-paper-100/50 hover:bg-paper-100 transition-all flex flex-col items-center justify-center gap-2"
              >
                {isOptimizing ? (
                  <div className="flex flex-col items-center justify-center py-2">
                    <Loader2 className="w-8 h-8 text-folia-600 animate-spin mb-2" />
                    <span className="font-semibold text-folia-800 text-xs">Ottimizzazione in corso...</span>
                    <p className="text-[11px] text-paper-500 mt-0.5">Conversione in formato WebP leggero ad alta qualità</p>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-paper-200 flex items-center justify-center text-paper-500">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-semibold text-folia-800">Clicca per selezionare un'immagine</span>
                      <p className="text-[11px] text-paper-500 mt-0.5">PNG, JPG, WEBP fino a 20 MB (ottimizzata automaticamente)</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="font-semibold text-paper-700 block">URL dell'immagine</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://esempio.com/mappa.jpg"
                className="w-full p-2.5 bg-paper-100/60 border border-paper-250 rounded-xl text-paper-900 text-xs focus:outline-hidden focus:bg-white focus:border-folia-600 focus:ring-1 focus:ring-folia-600 font-sans"
              />
            </div>
          )}

          {/* Preview */}
          {imagePreview && (
            <div className="space-y-1.5">
              <span className="font-semibold text-paper-600 text-[11px] uppercase tracking-wider block">Anteprima:</span>
              <div className="relative rounded-xl border border-paper-300 overflow-hidden bg-paper-200 max-h-48 flex items-center justify-center">
                <img 
                  src={imagePreview} 
                  alt="Anteprima" 
                  className="max-h-48 max-w-full object-contain"
                  onError={() => setError('Impossibile caricare l\'anteprima da questo indirizzo.')}
                />
              </div>
            </div>
          )}

          {/* Optional Caption */}
          <div className="space-y-1.5 pt-1">
            <label className="font-semibold text-paper-700 block">Didascalia / Titolo alternativo (opzionale)</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="es. Mappa delle Terre Settentrionali..."
              className="w-full p-2.5 bg-paper-100/60 border border-paper-250 rounded-xl text-paper-900 text-xs focus:outline-hidden focus:bg-white focus:border-folia-600 focus:ring-1 focus:ring-folia-600 font-sans"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-paper-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-paper-600 hover:bg-paper-200 transition-colors cursor-pointer font-medium"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={!imagePreview || isOptimizing}
              className="px-5 py-2 bg-folia-800 hover:bg-folia-900 disabled:opacity-35 disabled:hover:bg-folia-800 text-white rounded-xl font-semibold transition-colors cursor-pointer shadow-xs"
            >
              Inserisci immagine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
