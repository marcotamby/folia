import React, { useState } from 'react';
import { 
  MapPin, 
  Castle, 
  Flag, 
  Flame, 
  Scroll, 
  ShieldCheck, 
  Trash2, 
  Eye, 
  Lock, 
  Globe, 
  AlertTriangle,
  Maximize2,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { WorldEntry } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';
import { FocusTextModal } from '../common/FocusTextModal';
import { ImageUploadModal } from '../modals/ImageUploadModal';

interface WorldEditorProps {
  entry: WorldEntry | null;
  onUpdateEntry: (entry: WorldEntry) => void;
  onDeleteEntry: (id: string) => void;
  t: (key: string) => string;
}

export const WorldEditor: React.FC<WorldEditorProps> = ({
  entry,
  onUpdateEntry,
  onDeleteEntry,
  t
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expandedBox, setExpandedBox] = useState<{
    field: keyof WorldEntry;
    title: string;
    icon: React.ReactNode;
    placeholder?: string;
  } | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  if (!entry) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-paper-150 p-8 text-center select-none">
        <div className="w-16 h-16 rounded-2xl bg-paper-200 border border-paper-300 flex items-center justify-center text-paper-400 mb-4">
          <MapPin className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="font-brand text-xl font-semibold text-paper-800 mb-1">Nessuna voce di ambientazione selezionata</h3>
        <p className="text-xs text-paper-500 max-w-xs">Crea un nuovo luogo, fazione, sistema magico o elemento storico per arricchire il tuo mondo narrativo.</p>
      </div>
    );
  }

  const handleChange = (field: keyof WorldEntry, value: any) => {
    onUpdateEntry({
      ...entry,
      [field]: value,
      updatedAt: new Date().toISOString()
    });
  };

  const categories = [
    { value: 'location', label: t('world.cat_location'), icon: MapPin },
    { value: 'city', label: t('world.cat_city'), icon: Castle },
    { value: 'faction', label: t('world.cat_faction'), icon: Flag },
    { value: 'culture', label: t('world.cat_culture'), icon: Scroll },
    { value: 'magic', label: t('world.cat_magic'), icon: Flame },
    { value: 'religion', label: t('world.cat_religion'), icon: Globe },
    { value: 'item', label: t('world.cat_item'), icon: ShieldCheck },
    { value: 'history', label: t('world.cat_history'), icon: Scroll },
  ];

  return (
    <div className="flex-1 h-full bg-paper-150 overflow-y-auto p-6 md:p-10 select-none">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Entry Card */}
        <div className="bg-paper-50 rounded-2xl border border-paper-250 p-6 md:p-8 shadow-page">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-paper-200">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div 
                  onClick={() => setIsImageModalOpen(true)}
                  title="Clicca per aggiungere o cambiare l'illustrazione dell'ambientazione"
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-emerald-100/70 border-2 border-emerald-200/80 hover:border-folia-600 flex items-center justify-center text-emerald-800 text-2xl font-bold font-brand shadow-xs relative group cursor-pointer transition-all overflow-hidden"
                >
                  {entry.imageUrl ? (
                    <img
                      src={entry.imageUrl}
                      alt={entry.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{entry.name.charAt(0) || 'W'}</span>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-150">
                    <Camera className="w-5 h-5 mb-0.5" />
                    <span className="text-[9px] font-sans font-bold">Cambia</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(true)}
                  className="text-[11px] font-sans font-medium text-folia-700 hover:text-folia-950 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Camera className="w-3 h-3" />
                  <span>{entry.imageUrl ? 'Modifica' : '+ Foto'}</span>
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={entry.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder={t('world.name')}
                  className="text-2xl md:text-3xl font-brand font-bold text-paper-900 bg-transparent border-none focus:outline-hidden focus:ring-1 focus:ring-folia-600 rounded-lg px-1 w-full placeholder-paper-300"
                />
                <span className="text-xs text-emerald-800 font-semibold px-2.5 py-1 bg-emerald-50 rounded-lg border border-emerald-200 inline-block mt-1">
                  {categories.find(c => c.value === entry.category)?.label || entry.category}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              title="Elimina voce"
              className="p-2 rounded-xl text-paper-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Category Selector */}
          <div className="pt-6">
            <label className="block text-[11px] font-bold text-paper-600 uppercase tracking-wider mb-2.5">
              {t('world.category')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = entry.category === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => handleChange('category', cat.value)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500/20 shadow-xs'
                        : 'bg-paper-100 border-paper-250 text-paper-700 hover:bg-paper-150'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-700' : 'text-paper-400'}`} />
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Location Artwork / Banner (if set) */}
        {entry.imageUrl && (
          <div className="relative rounded-2xl overflow-hidden border border-paper-300 shadow-page group animate-in fade-in">
            <img
              src={entry.imageUrl}
              alt={entry.name}
              className="w-full h-56 md:h-72 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
              <div className="text-white drop-shadow-md">
                <span className="text-[11px] uppercase tracking-wider font-semibold opacity-80">Illustrazione del luogo</span>
                <div className="text-base font-bold font-brand">{entry.name}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(true)}
                  className="px-3 py-1.5 bg-white/90 hover:bg-white text-paper-900 text-xs rounded-xl font-semibold backdrop-blur-xs transition-colors cursor-pointer shadow-xs"
                >
                  Cambia
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('imageUrl', undefined)}
                  className="px-3 py-1.5 bg-rose-600/90 hover:bg-rose-600 text-white text-xs rounded-xl font-semibold backdrop-blur-xs transition-colors cursor-pointer shadow-xs"
                >
                  Rimuovi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sensory & Atmospheric Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-paper-50 rounded-2xl border border-paper-250 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs text-emerald-800 uppercase tracking-wider">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>{t('world.atmosphere')}</span>
              </div>
              <button
                type="button"
                onClick={() => setExpandedBox({
                  field: 'atmosphere',
                  title: t('world.atmosphere'),
                  icon: <Eye className="w-5 h-5 text-emerald-600" />,
                  placeholder: 'Odori, suoni, luci, clima, sensazione generale...'
                })}
                title="Ingrandisci e metti in primo piano"
                className="p-1 rounded-lg text-paper-400 hover:text-emerald-800 hover:bg-paper-200/80 transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <textarea
              value={entry.atmosphere || ''}
              onChange={(e) => handleChange('atmosphere', e.target.value)}
              placeholder="Odori, suoni, luci, clima, sensazione generale..."
              rows={3}
              className="w-full p-3.5 bg-paper-100/60 rounded-xl border border-paper-200 focus:outline-hidden focus:bg-white focus:border-folia-600 text-sm text-paper-800 resize-none font-sans leading-relaxed"
            />
          </div>

          <div className="bg-paper-50 rounded-2xl border border-paper-250 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs text-amber-800 uppercase tracking-wider">
                <Castle className="w-4 h-4 text-amber-600" />
                <span>{t('world.inhabitants')}</span>
              </div>
              <button
                type="button"
                onClick={() => setExpandedBox({
                  field: 'inhabitants',
                  title: t('world.inhabitants'),
                  icon: <Castle className="w-5 h-5 text-amber-600" />,
                  placeholder: 'Popolazione, gerarchie sociali, fazioni al potere...'
                })}
                title="Ingrandisci e metti in primo piano"
                className="p-1 rounded-lg text-paper-400 hover:text-amber-800 hover:bg-paper-200/80 transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <textarea
              value={entry.inhabitants || ''}
              onChange={(e) => handleChange('inhabitants', e.target.value)}
              placeholder="Popolazione, gerarchie sociali, fazioni al potere..."
              rows={3}
              className="w-full p-3.5 bg-paper-100/60 rounded-xl border border-paper-200 focus:outline-hidden focus:bg-white focus:border-folia-600 text-sm text-paper-800 resize-none font-sans leading-relaxed"
            />
          </div>
        </div>

        {/* Rules, Laws & Secrets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-paper-50 rounded-2xl border border-paper-250 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs text-blue-800 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>{t('world.rules')}</span>
              </div>
              <button
                type="button"
                onClick={() => setExpandedBox({
                  field: 'rules',
                  title: t('world.rules'),
                  icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
                  placeholder: 'Regole magiche, codici legali, tabù culturali o limiti fisici...'
                })}
                title="Ingrandisci e metti in primo piano"
                className="p-1 rounded-lg text-paper-400 hover:text-blue-800 hover:bg-paper-200/80 transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <textarea
              value={entry.rules || ''}
              onChange={(e) => handleChange('rules', e.target.value)}
              placeholder="Regole magiche, codici legali, tabù culturali o limiti fisici..."
              rows={3}
              className="w-full p-3.5 bg-paper-100/60 rounded-xl border border-paper-200 focus:outline-hidden focus:bg-white focus:border-folia-600 text-sm text-paper-800 resize-none font-sans leading-relaxed"
            />
          </div>

          <div className="bg-paper-50 rounded-2xl border border-paper-250 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs text-purple-800 uppercase tracking-wider">
                <Lock className="w-4 h-4 text-purple-600" />
                <span>{t('world.secrets')}</span>
              </div>
              <button
                type="button"
                onClick={() => setExpandedBox({
                  field: 'secrets',
                  title: t('world.secrets'),
                  icon: <Lock className="w-5 h-5 text-purple-600" />,
                  placeholder: 'Misteri non rivelati, pericoli nascosti, verità dimenticate...'
                })}
                title="Ingrandisci e metti in primo piano"
                className="p-1 rounded-lg text-paper-400 hover:text-purple-800 hover:bg-paper-200/80 transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <textarea
              value={entry.secrets || ''}
              onChange={(e) => handleChange('secrets', e.target.value)}
              placeholder="Misteri non rivelati, pericoli nascosti, verità dimenticate..."
              rows={3}
              className="w-full p-3.5 bg-paper-100/60 rounded-xl border border-paper-200 focus:outline-hidden focus:bg-white focus:border-folia-600 text-sm text-paper-800 resize-none font-sans leading-relaxed"
            />
          </div>
        </div>

        {/* Full Detailed Lore */}
        <div className="bg-paper-50 rounded-2xl border border-paper-250 p-6 md:p-8 shadow-page space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xs text-paper-800 uppercase tracking-wider">
              <Scroll className="w-4 h-4 text-folia-700" />
              <span>{t('world.full_desc')}</span>
            </div>
            <button
              type="button"
              onClick={() => setExpandedBox({
                field: 'description',
                title: t('world.full_desc'),
                icon: <Scroll className="w-5 h-5 text-folia-700" />,
                placeholder: 'Descrivi la storia, le origini e i dettagli narrativi completi di questa voce di worldbuilding...'
              })}
              title="Ingrandisci e metti in primo piano"
              className="p-1 rounded-lg text-paper-400 hover:text-folia-800 hover:bg-paper-200/80 transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <textarea
            value={entry.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Descrivi la storia, le origini e i dettagli narrativi completi di questa voce di worldbuilding..."
            rows={5}
            className="w-full p-3.5 bg-paper-100/60 rounded-xl border border-paper-200 focus:outline-hidden focus:bg-white focus:border-folia-600 text-sm text-paper-800 resize-none font-sans leading-relaxed"
          />
        </div>
      </div>

      {/* Expanded Focus Text Modal */}
      {expandedBox && (
        <FocusTextModal
          isOpen={!!expandedBox}
          onClose={() => setExpandedBox(null)}
          title={expandedBox.title}
          subtitle={`Elemento: ${entry.name || 'Nuova voce ambientazione'}`}
          icon={expandedBox.icon}
          value={(entry[expandedBox.field] as string) || ''}
          onChange={(val) => handleChange(expandedBox.field, val)}
          placeholder={expandedBox.placeholder}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDeleteEntry(entry.id);
          setShowDeleteConfirm(false);
        }}
        title="Elimina voce ambientazione"
        subtitle="Questa azione non può essere annullata"
        message={
          <span>
            Sei sicuro di voler eliminare la voce <strong>"{entry.name || 'Nuovo luogo'}"</strong>?
          </span>
        }
        confirmLabel="Elimina definitivamente"
        cancelLabel="Annulla"
        variant="danger"
      />

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        title={`Illustrazione per ${entry.name || 'Ambientazione'}`}
        currentImage={entry.imageUrl}
        onSaveImage={(url) => handleChange('imageUrl', url)}
        onRemoveImage={() => handleChange('imageUrl', undefined)}
      />
    </div>
  );
};
