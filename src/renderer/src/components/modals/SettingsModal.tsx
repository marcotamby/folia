import React, { useState, useEffect } from 'react';
import { X, Settings, Globe, Type, Heading1, Target, Check, WrapText, Indent, AlignJustify, Info, BookOpen, Compass, GraduationCap, Mail, SpellCheck, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Project, Language, FontFamily, PageMargins, PageFormat, ParagraphSpacing, ProjectType } from '../../types';
import { CustomSelect } from '../common/CustomSelect';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onUpdateSettings: (newSettings: Partial<Project['settings']>) => void;
  onLanguageChange: (lang: Language) => void;
  t: (key: string) => string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  project,
  onUpdateSettings,
  onLanguageChange,
  t
}) => {
  if (!isOpen) return null;

  const [newDictWord, setNewDictWord] = useState('');
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);
  const [checkingUpdates, setCheckingUpdates] = useState(false);
  const [updateFeedback, setUpdateFeedback] = useState<string | null>(null);

  useEffect(() => {
    const folia = (window as any).foliaAPI;
    if (folia?.getUpdateSettings) {
      folia.getUpdateSettings().then((s: any) => {
        if (s && typeof s.autoUpdateEnabled === 'boolean') {
          setAutoUpdateEnabled(s.autoUpdateEnabled);
        }
      }).catch(() => {});
    }
  }, []);

  const handleToggleAutoUpdate = async (val: boolean) => {
    setAutoUpdateEnabled(val);
    const folia = (window as any).foliaAPI;
    if (folia?.setUpdateSettings) {
      await folia.setUpdateSettings({ autoUpdateEnabled: val }).catch(() => {});
    }
  };

  const handleCheckUpdatesManual = async () => {
    setCheckingUpdates(true);
    setUpdateFeedback(null);
    const folia = (window as any).foliaAPI;
    if (folia?.checkForUpdates) {
      try {
        const res = await folia.checkForUpdates();
        if (res?.isDev) {
          setUpdateFeedback('Modalità sviluppo: verifica aggiornamenti attiva sull\'app compilata.');
        } else if (res?.success) {
          setUpdateFeedback('Verifica inviata. Se è presente una nuova versione, il download si avvierà in basso.');
        } else {
          setUpdateFeedback(res?.error || 'Nessun nuovo aggiornamento trovato.');
        }
      } catch (err: any) {
        setUpdateFeedback('Impossibile verificare gli aggiornamenti al momento.');
      }
    } else {
      setUpdateFeedback('Funzione non supportata in questo ambiente.');
    }
    setCheckingUpdates(false);
  };
  const customWords = project.settings.customDictionary || [];

  const handleAddDictWord = () => {
    const trimmed = newDictWord.trim();
    if (!trimmed || customWords.includes(trimmed)) return;
    const updated = [...customWords, trimmed];
    onUpdateSettings({ customDictionary: updated });
    if ((window as any).foliaAPI?.addWordToSpellchecker) {
      (window as any).foliaAPI.addWordToSpellchecker(trimmed);
    }
    setNewDictWord('');
  };

  const handleRemoveDictWord = (wordToRemove: string) => {
    const updated = customWords.filter(w => w !== wordToRemove);
    onUpdateSettings({ customDictionary: updated });
  };

  const currentType: ProjectType = project.settings.projectType || 'novel';

  const fonts: FontFamily[] = [
    'Times New Roman',
    'Garamond',
    'Courier New',
    'Georgia',
    'Baskerville',
    'Palatino',
    'Book Antiqua',
    'Lora',
    'Merriweather',
    'Playfair Display',
    'Plus Jakarta Sans',
    'Inter',
    'Arial',
    'Verdana',
    'Calibri',
    'JetBrains Mono',
    'Consolas'
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in folia-modal-overlay"
      onClick={onClose}
    >
      <div 
        className="bg-paper-50 rounded-2xl shadow-modal border border-paper-300 w-full max-w-lg overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-paper-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-paper-200 text-paper-800 rounded-xl">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-brand font-semibold text-lg text-paper-900">{t('app.settings')}</h3>
              <p className="text-xs text-paper-500">Personalizza l'ambiente di scrittura</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-paper-400 hover:text-paper-700 hover:bg-paper-150 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Project Mode / Type */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-paper-700 uppercase tracking-wider mb-2.5">
              <BookOpen className="w-4 h-4 text-folia-700" />
              <span>Modalità & tipologia di opera</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onUpdateSettings({ projectType: 'novel' })}
                className={`p-3.5 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer ${
                  currentType === 'novel'
                    ? 'border-folia-600 bg-folia-50/80 text-folia-950 ring-1 ring-folia-600 shadow-xs'
                    : 'border-paper-200 bg-paper-100 hover:bg-paper-150 text-paper-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-folia-700" />
                    <span className="font-bold text-xs">Romanzo & narrativa</span>
                  </div>
                  {currentType === 'novel' && <Check className="w-4 h-4 text-folia-700" />}
                </div>
                <p className="text-[11px] text-paper-500 leading-snug">
                  Struttura per narrativa: capitoli, schede personaggi, worldbuilding, trama & beat sheet.
                </p>
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ projectType: 'ttrpg_master' })}
                className={`p-3.5 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer ${
                  currentType === 'ttrpg_master'
                    ? 'border-folia-600 bg-folia-50/80 text-folia-950 ring-1 ring-folia-600 shadow-xs'
                    : 'border-paper-200 bg-paper-100 hover:bg-paper-150 text-paper-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-amber-700" />
                    <span className="font-bold text-xs">Master D&D / GdR</span>
                  </div>
                  {currentType === 'ttrpg_master' && <Check className="w-4 h-4 text-folia-700" />}
                </div>
                <p className="text-[11px] text-paper-500 leading-snug">
                  Struttura per Dungeon Master: sessioni, party (classe/razza), dungeon, quest, loot e regole.
                </p>
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ projectType: 'academic_thesis' })}
                className={`p-3.5 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer ${
                  currentType === 'academic_thesis'
                    ? 'border-folia-600 bg-folia-50/80 text-folia-950 ring-1 ring-folia-600 shadow-xs'
                    : 'border-paper-200 bg-paper-100 hover:bg-paper-150 text-paper-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-700" />
                    <span className="font-bold text-xs">Tesi di laurea & saggio</span>
                  </div>
                  {currentType === 'academic_thesis' && <Check className="w-4 h-4 text-folia-700" />}
                </div>
                <p className="text-[11px] text-paper-500 leading-snug">
                  Struttura accademica: frontespizio, capitoli tesi, fonti & bibliografia, metodologia e scaletta.
                </p>
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ projectType: 'letter' })}
                className={`p-3.5 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer ${
                  currentType === 'letter'
                    ? 'border-folia-600 bg-folia-50/80 text-folia-950 ring-1 ring-folia-600 shadow-xs'
                    : 'border-paper-200 bg-paper-100 hover:bg-paper-150 text-paper-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-700" />
                    <span className="font-bold text-xs">Lettera & corrispondenza</span>
                  </div>
                  {currentType === 'letter' && <Check className="w-4 h-4 text-folia-700" />}
                </div>
                <p className="text-[11px] text-paper-500 leading-snug">
                  Documento snello e mirato: testo lettera, bozze, destinatari e allegati.
                </p>
              </button>
            </div>
          </div>
          {/* Language Selection without emojis */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-paper-700 uppercase tracking-wider mb-2.5">
              <Globe className="w-4 h-4 text-folia-700" />
              <span>Lingua dell'applicazione</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  onLanguageChange('it');
                  onUpdateSettings({ language: 'it' });
                }}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs font-medium transition-all cursor-pointer ${
                  project.settings.language === 'it'
                    ? 'border-folia-600 bg-folia-50 text-folia-900 ring-1 ring-folia-600'
                    : 'border-paper-200 bg-paper-100 hover:bg-paper-150 text-paper-700'
                }`}
              >
                <span>Italiano (IT)</span>
                {project.settings.language === 'it' && <Check className="w-4 h-4 text-folia-700" />}
              </button>

              <button
                onClick={() => {
                  onLanguageChange('en');
                  onUpdateSettings({ language: 'en' });
                }}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs font-medium transition-all cursor-pointer ${
                  project.settings.language === 'en'
                    ? 'border-folia-600 bg-folia-50 text-folia-900 ring-1 ring-folia-600'
                    : 'border-paper-200 bg-paper-100 hover:bg-paper-150 text-paper-700'
                }`}
              >
                <span>English (US/UK)</span>
                {project.settings.language === 'en' && <Check className="w-4 h-4 text-folia-700" />}
              </button>
            </div>
          </div>

          {/* Typography: Body & Headings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-paper-700 uppercase tracking-wider mb-2.5">
                <Type className="w-4 h-4 text-folia-700" />
                <span>Carattere Testo</span>
              </div>
              <CustomSelect
                value={project.settings.fontFamily}
                onChange={(val) => onUpdateSettings({ fontFamily: val as FontFamily })}
                options={fonts.map((f) => ({ value: f, label: f }))}
                className="w-full"
                buttonClassName="w-full py-2 px-3 justify-between"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-paper-700 uppercase tracking-wider mb-2.5">
                <Heading1 className="w-4 h-4 text-folia-700" />
                <span>Carattere Titoli & Capitoli</span>
              </div>
              <CustomSelect
                value={project.settings.headingFontFamily || 'Plus Jakarta Sans'}
                onChange={(val) => onUpdateSettings({ headingFontFamily: val as FontFamily })}
                options={fonts.map((f) => ({ value: f, label: f }))}
                className="w-full"
                buttonClassName="w-full py-2 px-3 justify-between"
              />
            </div>
          </div>

          {/* Font size & Line height & Title Size */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-paper-700 mb-1.5">
                Dimensione Testo: {project.settings.fontSize} pt
              </label>
              <input
                type="range"
                min="10"
                max="32"
                step="1"
                value={project.settings.fontSize}
                onChange={(e) => onUpdateSettings({ fontSize: Number(e.target.value) })}
                className="w-full accent-folia-700"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-paper-700 mb-1.5">
                Dimensione Titoli: {project.settings.titleFontSize || 26} pt
              </label>
              <input
                type="range"
                min="18"
                max="48"
                step="1"
                value={project.settings.titleFontSize || 26}
                onChange={(e) => onUpdateSettings({ titleFontSize: Number(e.target.value) })}
                className="w-full accent-folia-700"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-paper-700 mb-1.5">
                {t('editor.line_height')}: {project.settings.lineHeight}x
              </label>
              <input
                type="range"
                min="1.2"
                max="2.2"
                step="0.1"
                value={project.settings.lineHeight}
                onChange={(e) => onUpdateSettings({ lineHeight: Number(e.target.value) })}
                className="w-full accent-folia-700"
              />
            </div>
          </div>

          {/* Paragraph Formatting: Indent & Hyphenation */}
          <div className="p-4 bg-paper-100 rounded-xl border border-paper-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-medium text-paper-800">
                <Indent className="w-4 h-4 text-folia-700" />
                <span>Rientro prima riga (indent)</span>
              </div>
              <CustomSelect
                value={String(project.settings.firstLineIndent ?? 1.0)}
                onChange={(val) => onUpdateSettings({ firstLineIndent: Number(val) })}
                align="right"
                options={[
                  { value: '0', label: 'Nessuno' },
                  { value: '0.5', label: '0.5 cm' },
                  { value: '1', label: '1.0 cm (standard)' },
                  { value: '1.25', label: '1.25 cm' },
                  { value: '1.5', label: '1.5 cm' }
                ]}
                buttonClassName="py-1 px-2.5 text-xs"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-paper-200">
              <div className="flex items-center gap-2 font-medium text-paper-800">
                <AlignJustify className="w-4 h-4 text-folia-700" />
                <span>Spaziatura tra paragrafi</span>
              </div>
              <CustomSelect
                value={project.settings.paragraphSpacing ?? 'normal'}
                onChange={(val) => onUpdateSettings({ paragraphSpacing: val as ParagraphSpacing })}
                align="right"
                options={[
                  { value: 'none', label: 'Nessuna (stile libro)' },
                  { value: 'tight', label: 'Stretta' },
                  { value: 'normal', label: 'Media (standard)' },
                  { value: 'relaxed', label: 'Ampia' }
                ]}
                buttonClassName="py-1 px-2.5 text-xs"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-paper-200">
              <div className="flex items-center gap-2 font-medium text-paper-800">
                <WrapText className="w-4 h-4 text-folia-700" />
                <span>Sillabazione a fine riga (hyphenation)</span>
              </div>
              <button
                type="button"
                onClick={() => onUpdateSettings({ hyphenation: !project.settings.hyphenation })}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  project.settings.hyphenation ? 'bg-folia-700' : 'bg-paper-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    project.settings.hyphenation ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Word goals */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-paper-700 uppercase tracking-wider mb-2.5">
              <Target className="w-4 h-4 text-folia-700" />
              <span>Obiettivi di scrittura</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-paper-600 mb-1">Obiettivo giornaliero (parole)</label>
                <input
                  type="number"
                  value={project.settings.dailyWordGoal}
                  onChange={(e) => onUpdateSettings({ dailyWordGoal: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 text-xs bg-paper-100 border border-paper-300 rounded-xl focus:outline-hidden focus:border-folia-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs text-paper-600 mb-1">Target manoscritto (parole)</label>
                <input
                  type="number"
                  value={project.settings.totalWordGoal}
                  onChange={(e) => onUpdateSettings({ totalWordGoal: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 text-xs bg-paper-100 border border-paper-300 rounded-xl focus:outline-hidden focus:border-folia-600 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Custom Spellchecker Dictionary */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-paper-700 uppercase tracking-wider mb-2">
              <SpellCheck className="w-4 h-4 text-folia-700" />
              <span>Dizionario dell'Autore (Termini personalizzati)</span>
            </div>
            <p className="text-[11px] text-paper-500 mb-2.5 leading-relaxed">
              I termini aggiunti qui non verranno mai segnalati come errori dal correttore ortografico (nomi fantasy, luoghi inventati, neologismi, termini tecnici o latini).
            </p>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newDictWord}
                onChange={(e) => setNewDictWord(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddDictWord();
                  }
                }}
                placeholder="Aggiungi nuovo termine (es. Eldrin)..."
                className="flex-1 px-3 py-1.5 text-xs bg-paper-100 border border-paper-300 rounded-xl focus:outline-hidden focus:border-folia-600 font-medium"
              />
              <button
                type="button"
                onClick={handleAddDictWord}
                className="px-3.5 py-1.5 bg-folia-800 hover:bg-folia-900 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                Aggiungi
              </button>
            </div>

            {/* Badges list */}
            {customWords.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 p-3 bg-paper-100/60 rounded-xl border border-paper-250 max-h-36 overflow-y-auto">
                {customWords.map(word => (
                  <span
                    key={word}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-paper-300 text-xs text-paper-800 shadow-2xs"
                  >
                    <span>{word}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDictWord(word)}
                      title={`Rimuovi "${word}" dal dizionario`}
                      className="text-paper-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-[11px] text-paper-400 italic p-3 bg-paper-100/40 rounded-xl border border-dashed border-paper-250 text-center">
                Nessun termine salvato. Puoi aggiungere parole anche cliccando con il tasto destro sul testo durante la scrittura.
              </div>
            )}
          </div>

          {/* Aggiornamenti dell'applicazione */}
          <div className="pt-2 border-t border-paper-250 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-paper-700 uppercase tracking-wider">
              <RefreshCw className="w-4 h-4 text-folia-700" />
              <span>Aggiornamenti dell'applicazione</span>
            </div>

            <div className="p-4 bg-paper-100/70 border border-paper-200 rounded-xl space-y-3">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoUpdateEnabled}
                  onChange={(e) => handleToggleAutoUpdate(e.target.checked)}
                  className="mt-0.5 rounded border-paper-300 text-folia-600 focus:ring-folia-500 w-4 h-4 cursor-pointer accent-folia-600"
                />
                <div className="text-xs">
                  <span className="font-semibold text-paper-900 block">
                    Aggiornamenti automatici
                  </span>
                  <span className="text-paper-600 leading-relaxed block mt-0.5">
                    Verifica e scarica in background le nuove versioni. Quando un aggiornamento è pronto, Folia mostrerà una notifica per applicarlo.
                  </span>
                </div>
              </label>

              <div className="pt-2 border-t border-paper-200/80 flex items-center justify-between gap-3">
                <span className="text-[11px] text-paper-500">
                  Versione attuale: <strong className="text-paper-700">1.0.3</strong>
                </span>
                <button
                  type="button"
                  onClick={handleCheckUpdatesManual}
                  disabled={checkingUpdates}
                  className="px-3 py-1.5 bg-paper-200 hover:bg-paper-250 text-paper-800 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${checkingUpdates ? 'animate-spin' : ''}`} />
                  <span>{checkingUpdates ? 'Verifica in corso...' : 'Verifica ora'}</span>
                </button>
              </div>

              {updateFeedback && (
                <div className="p-2.5 rounded-lg bg-folia-50 border border-folia-200 text-folia-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-folia-600 shrink-0" />
                  <span>{updateFeedback}</span>
                </div>
              )}
            </div>
          </div>

          {/* Copyright Box in Settings */}
          <div className="pt-2 border-t border-paper-200 text-center text-[11px] text-paper-500">
            <div>Folia v1.0.3 &bull; Tutti i diritti riservati sono di <strong>Marco Tamborrino, 2026</strong>.</div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-paper-200 bg-paper-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-folia-700 hover:bg-folia-800 text-white text-xs font-medium transition-colors cursor-pointer shadow-xs"
          >
            Fatto
          </button>
        </div>
      </div>
    </div>
  );
};
