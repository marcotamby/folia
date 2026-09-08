import React, { useState } from 'react';
import { X, Search } from 'lucide-react';

interface SpecialCharsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertChar: (char: string) => void;
  t: (key: string) => string;
}

interface CharCategory {
  title: string;
  items: { char: string; name: string; shortcut?: string }[];
}

export const SpecialCharsModal: React.FC<SpecialCharsModalProps> = ({
  isOpen,
  onClose,
  onInsertChar,
  t
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const categories: CharCategory[] = [
    {
      title: t('special_chars.quotes'),
      items: [
        { char: '«', name: 'Caporale Aperto / Guillemet Left' },
        { char: '»', name: 'Caporale Chiuso / Guillemet Right' },
        { char: '“', name: 'Virgoletta Doppia Aperta (66)' },
        { char: '”', name: 'Virgoletta Doppia Chiusa (99)' },
        { char: '‘', name: 'Virgoletta Singola Aperta' },
        { char: '’', name: 'Apostrofo / Virgoletta Singola Chiusa' },
        { char: '„', name: 'Virgoletta Bassa Aperta' },
        { char: '‹', name: 'Singolo Caporale Sinistro' },
        { char: '›', name: 'Singolo Caporale Destro' },
      ]
    },
    {
      title: t('special_chars.dashes'),
      items: [
        { char: '—', name: 'Em Dash (Trattino Lungo Dialogico)', shortcut: 'Alt+0151' },
        { char: '–', name: 'En Dash (Trattino Medio)', shortcut: 'Alt+0150' },
        { char: '…', name: 'Puntini di Sospensione (Ellipsis)' },
        { char: '•', name: 'Punto Elenco (Bullet)' },
        { char: '·', name: 'Punto Mediano' },
        { char: '§', name: 'Simbolo di Paragrafo / Sezione' },
        { char: '¶', name: 'Piede di Mosca (Pilcrow)' },
      ]
    },
    {
      title: t('special_chars.accents'),
      items: [
        { char: 'È', name: 'E maiuscola con accento grave' },
        { char: 'É', name: 'E maiuscola con accento acuto' },
        { char: 'À', name: 'A maiuscola con accento grave' },
        { char: 'Ò', name: 'O maiuscola con accento grave' },
        { char: 'Ù', name: 'U maiuscola con accento grave' },
        { char: 'Ì', name: 'I maiuscola con accento grave' },
        { char: 'è', name: 'e con accento grave' },
        { char: 'é', name: 'e con accento acuto' },
        { char: 'à', name: 'a con accento grave' },
        { char: 'ò', name: 'o con accento grave' },
        { char: 'ù', name: 'u con accento grave' },
        { char: 'ì', name: 'i con accento grave' },
      ]
    },
    {
      title: t('special_chars.symbols'),
      items: [
        { char: '❦', name: 'Hedera / Foglia Floreale' },
        { char: '❧', name: 'Hedera Floreale Rotata' },
        { char: '⁂', name: 'Asterismo (Separatore di Scena)' },
        { char: '†', name: 'Daga / Croce' },
        { char: '‡', name: 'Doppia Daga' },
        { char: '©', name: 'Copyright' },
        { char: '®', name: 'Marchio Registrato' },
        { char: '™', name: 'Trademark' },
        { char: '°', name: 'Gradi' },
        { char: '✦', name: 'Stella a 4 punte' },
        { char: '✧', name: 'Stella cava' },
        { char: '✓', name: 'Segno di Spunta' },
      ]
    }
  ];

  const filteredCategories = categories.map(cat => ({
    ...cat,
    items: cat.items.filter(
      item => item.name.toLowerCase().includes(search.toLowerCase()) || item.char.includes(search)
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4 animate-in fade-in folia-modal-overlay"
      onClick={onClose}
    >
      <div 
        className="bg-paper-50 rounded-2xl shadow-modal border border-paper-300 w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-paper-200">
          <div>
            <h3 className="font-brand font-semibold text-lg text-paper-900">{t('special_chars.title')}</h3>
            <p className="text-xs text-paper-500">Clicca su qualsiasi carattere per inserirlo nel punto corrente del testo</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-paper-400 hover:text-paper-700 hover:bg-paper-150 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-paper-200 bg-paper-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-paper-400" />
            <input
              type="text"
              placeholder="Cerca carattere o descrizione (es: caporale, trattino, accento)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-paper-50 border border-paper-300 rounded-lg focus:outline-hidden focus:border-folia-600 focus:ring-1 focus:ring-folia-600"
              autoFocus
            />
          </div>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-6">
          {filteredCategories.map((cat, i) => (
            <div key={i}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-paper-500 mb-3">{cat.title}</h4>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {cat.items.map((item, j) => (
                  <button
                    key={j}
                    onClick={() => {
                      onInsertChar(item.char);
                      onClose();
                    }}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-paper-200 bg-paper-50 hover:bg-folia-50 hover:border-folia-400 hover:shadow-xs transition-all group cursor-pointer"
                    title={item.name}
                  >
                    <span className="text-2xl font-serif text-paper-900 group-hover:text-folia-700 group-hover:scale-110 transition-transform">
                      {item.char}
                    </span>
                    <span className="text-[10px] text-paper-500 group-hover:text-folia-800 text-center truncate w-full mt-1">
                      {item.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-paper-200 bg-paper-100 flex justify-between items-center text-xs text-paper-500">
          <span>Suggerimento: usa i caporali « » o il trattino lungo — per i dialoghi</span>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-paper-300 bg-paper-50 text-paper-700 hover:bg-paper-150 font-medium transition-colors"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
