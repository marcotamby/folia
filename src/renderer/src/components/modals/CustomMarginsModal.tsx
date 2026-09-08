import React, { useState, useEffect } from 'react';
import { X, Sliders, Check } from 'lucide-react';
import { CustomPageMargins } from '../../types';

interface CustomMarginsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMargins?: CustomPageMargins;
  onSave: (margins: CustomPageMargins) => void;
}

export const CustomMarginsModal: React.FC<CustomMarginsModalProps> = ({
  isOpen,
  onClose,
  initialMargins,
  onSave,
}) => {
  const [top, setTop] = useState(initialMargins?.top ?? 3.0);
  const [bottom, setBottom] = useState(initialMargins?.bottom ?? 3.0);
  const [left, setLeft] = useState(initialMargins?.left ?? 3.0);
  const [right, setRight] = useState(initialMargins?.right ?? 3.0);
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    if (initialMargins) {
      setTop(initialMargins.top);
      setBottom(initialMargins.bottom);
      setLeft(initialMargins.left);
      setRight(initialMargins.right);
      setIsLocked(
        initialMargins.top === initialMargins.bottom &&
        initialMargins.top === initialMargins.left &&
        initialMargins.top === initialMargins.right
      );
    }
  }, [initialMargins, isOpen]);

  if (!isOpen) return null;

  const handleAllChange = (val: number) => {
    setTop(val);
    setBottom(val);
    setLeft(val);
    setRight(val);
  };

  const handleSave = () => {
    onSave({ top, bottom, left, right });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in folia-modal-overlay"
      onClick={onClose}
    >
      <div 
        className="bg-paper-50 rounded-2xl border border-paper-300 shadow-2xl max-w-md w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-paper-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-folia-100 text-folia-800">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-paper-900">Margini Personalizzati</h3>
              <p className="text-xs text-paper-500">Configura le distanze dei margini di pagina in centimetri</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-paper-400 hover:text-paper-700 hover:bg-paper-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Quick presets */}
          <div>
            <label className="block text-[11px] font-bold text-paper-600 uppercase tracking-wider mb-2">
              Preset rapidi consigliati
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  handleAllChange(3.0);
                  setIsLocked(true);
                }}
                className={`p-2.5 text-left rounded-xl border transition-all cursor-pointer text-xs ${
                  top === 3.0 && bottom === 3.0 && left === 3.0 && right === 3.0
                    ? 'border-folia-600 bg-folia-50 text-folia-900 font-semibold'
                    : 'border-paper-200 bg-white hover:bg-paper-100 text-paper-800'
                }`}
              >
                <div className="font-bold">Cartella Editoriale</div>
                <div className="text-[10px] text-paper-500">3.0 cm tutti i lati (canonico)</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAllChange(2.5);
                  setIsLocked(true);
                }}
                className={`p-2.5 text-left rounded-xl border transition-all cursor-pointer text-xs ${
                  top === 2.5 && bottom === 2.5 && left === 2.5 && right === 2.5
                    ? 'border-folia-600 bg-folia-50 text-folia-900 font-semibold'
                    : 'border-paper-200 bg-white hover:bg-paper-100 text-paper-800'
                }`}
              >
                <div className="font-bold">Standard A4 / Word</div>
                <div className="text-[10px] text-paper-500">2.5 cm tutti i lati</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAllChange(1.5);
                  setIsLocked(true);
                }}
                className={`p-2.5 text-left rounded-xl border transition-all cursor-pointer text-xs ${
                  top === 1.5 && bottom === 1.5 && left === 1.5 && right === 1.5
                    ? 'border-folia-600 bg-folia-50 text-folia-900 font-semibold'
                    : 'border-paper-200 bg-white hover:bg-paper-100 text-paper-800'
                }`}
              >
                <div className="font-bold">Stretto</div>
                <div className="text-[10px] text-paper-500">1.5 cm tutti i lati</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTop(2.5);
                  setBottom(2.5);
                  setLeft(3.2);
                  setRight(2.2);
                  setIsLocked(false);
                }}
                className={`p-2.5 text-left rounded-xl border transition-all cursor-pointer text-xs ${
                  top === 2.5 && bottom === 2.5 && left === 3.2 && right === 2.2
                    ? 'border-folia-600 bg-folia-50 text-folia-900 font-semibold'
                    : 'border-paper-200 bg-white hover:bg-paper-100 text-paper-800'
                }`}
              >
                <div className="font-bold">Rilegatura Libro</div>
                <div className="text-[10px] text-paper-500">Sx 3.2 cm · Dx 2.2 cm</div>
              </button>
            </div>
          </div>

          {/* Symmetrical lock toggle */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-medium text-paper-800">Mantieni tutti i lati uguali</span>
            <button
              type="button"
              onClick={() => {
                if (!isLocked) {
                  handleAllChange(top);
                }
                setIsLocked(!isLocked);
              }}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                isLocked ? 'bg-folia-700' : 'bg-paper-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  isLocked ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Individual Inputs */}
          {isLocked ? (
            <div className="p-4 bg-white rounded-xl border border-paper-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-paper-700">Tutti i margini:</span>
                <span className="font-bold text-folia-800">{top.toFixed(1)} cm</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.5"
                step="0.1"
                value={top}
                onChange={(e) => handleAllChange(Number(e.target.value))}
                className="w-full accent-folia-700 cursor-pointer"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 p-4 bg-white rounded-xl border border-paper-200">
              <div>
                <label className="block text-xs text-paper-600 mb-1">Superiore: <b>{top.toFixed(1)} cm</b></label>
                <input
                  type="range"
                  min="0.5"
                  max="5.5"
                  step="0.1"
                  value={top}
                  onChange={(e) => setTop(Number(e.target.value))}
                  className="w-full accent-folia-700 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs text-paper-600 mb-1">Inferiore: <b>{bottom.toFixed(1)} cm</b></label>
                <input
                  type="range"
                  min="0.5"
                  max="5.5"
                  step="0.1"
                  value={bottom}
                  onChange={(e) => setBottom(Number(e.target.value))}
                  className="w-full accent-folia-700 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs text-paper-600 mb-1">Sinistro: <b>{left.toFixed(1)} cm</b></label>
                <input
                  type="range"
                  min="0.5"
                  max="5.5"
                  step="0.1"
                  value={left}
                  onChange={(e) => setLeft(Number(e.target.value))}
                  className="w-full accent-folia-700 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs text-paper-600 mb-1">Destro: <b>{right.toFixed(1)} cm</b></label>
                <input
                  type="range"
                  min="0.5"
                  max="5.5"
                  step="0.1"
                  value={right}
                  onChange={(e) => setRight(Number(e.target.value))}
                  className="w-full accent-folia-700 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-paper-200 bg-paper-100/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-paper-700 hover:bg-paper-200 rounded-xl transition-colors cursor-pointer"
          >
            Annulla
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-folia-700 hover:bg-folia-800 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Applica margini</span>
          </button>
        </div>
      </div>
    </div>
  );
};
