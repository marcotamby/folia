import React, { useState } from 'react';
import { X, BookOpen, Compass, GraduationCap, Mail, Plus, Check } from 'lucide-react';
import { ProjectType } from '../../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (title: string, author: string, type: ProjectType) => void;
  t: (key: string) => string;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
  t
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [projectType, setProjectType] = useState<ProjectType>('novel');

  if (!isOpen) return null;

  const handleConfirm = () => {
    let defaultTitle = 'Nuovo progetto';
    if (projectType === 'ttrpg_master') defaultTitle = 'Nuova campagna D&D';
    else if (projectType === 'academic_thesis') defaultTitle = 'Tesi di laurea';
    else if (projectType === 'letter') defaultTitle = 'Lettera formale';

    onCreateProject(title.trim() || defaultTitle, author.trim(), projectType);
    setTitle('');
    setAuthor('');
    setProjectType('novel');
    onClose();
  };

  const titleLabel = 
    projectType === 'ttrpg_master' ? 'Nome della campagna *' :
    projectType === 'academic_thesis' ? 'Titolo della tesi *' :
    projectType === 'letter' ? 'Oggetto o titolo della lettera *' :
    'Titolo del progetto *';

  const titlePlaceholder = 
    projectType === 'ttrpg_master' ? 'es. Le cronache di Faerûn, La maledizione di Strahd...' :
    projectType === 'academic_thesis' ? 'es. L\'impatto dell\'IA nella letteratura contemporanea...' :
    projectType === 'letter' ? 'es. Lettera formale al Comune, Richiesta di colloquio...' :
    "es. L'ultima alba, I racconti del vento...";

  const authorLabel = 
    projectType === 'ttrpg_master' ? 'Dungeon Master (opzionale)' :
    projectType === 'academic_thesis' ? 'Candidato / tesista (opzionale)' :
    projectType === 'letter' ? 'Mittente (opzionale)' :
    'Autore (opzionale)';

  const authorPlaceholder = 
    projectType === 'ttrpg_master' ? 'es. Dungeon Master...' :
    projectType === 'academic_thesis' ? 'es. Mario Rossi...' :
    projectType === 'letter' ? 'es. Nome del mittente...' :
    'es. Nome autore o pseudonimo...';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-in fade-in select-none folia-modal-overlay"
      onClick={onClose}
    >
      <div 
        className="bg-paper-50 rounded-2xl shadow-modal border border-paper-300 w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-paper-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-folia-100 text-folia-800 rounded-xl border border-folia-200 shadow-2xs">
              <Plus className="w-5 h-5 text-folia-800" />
            </div>
            <div>
              <h3 className="font-brand font-bold text-lg text-paper-900">Nuovo progetto</h3>
              <p className="text-xs text-paper-500">Scegli la modalità ideale per la tua opera</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-paper-400 hover:text-paper-700 hover:bg-paper-150 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Project Type Switcher */}
          <div>
            <label className="block text-xs font-semibold text-paper-700 uppercase tracking-wider mb-2.5">
              Tipologia di progetto
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Romanzo & Narrativa */}
              <button
                type="button"
                onClick={() => setProjectType('novel')}
                className={`p-3.5 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer ${
                  projectType === 'novel'
                    ? 'border-folia-600 bg-folia-50/80 text-folia-950 ring-1 ring-folia-600 shadow-xs'
                    : 'border-paper-250 bg-paper-100 hover:bg-paper-150 text-paper-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-folia-700" />
                    <span className="font-bold text-xs">Romanzo & narrativa</span>
                  </div>
                  {projectType === 'novel' && <Check className="w-4 h-4 text-folia-700" />}
                </div>
                <p className="text-[11px] text-paper-500 leading-relaxed">
                  Per romanzi, saggi e racconti. Struttura in capitoli, schede personaggi, archi narrativi e worldbuilding.
                </p>
              </button>

              {/* Master D&D / GdR */}
              <button
                type="button"
                onClick={() => setProjectType('ttrpg_master')}
                className={`p-3.5 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer ${
                  projectType === 'ttrpg_master'
                    ? 'border-folia-600 bg-folia-50/80 text-folia-950 ring-1 ring-folia-600 shadow-xs'
                    : 'border-paper-250 bg-paper-100 hover:bg-paper-150 text-paper-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-amber-700" />
                    <span className="font-bold text-xs">Master D&D / GdR</span>
                  </div>
                  {projectType === 'ttrpg_master' && <Check className="w-4 h-4 text-folia-700" />}
                </div>
                <p className="text-[11px] text-paper-500 leading-relaxed">
                  Per Dungeon Master. Sessioni di gioco, party (classe/razza), dungeon, quest, loot e regole.
                </p>
              </button>

              {/* Tesi di Laurea */}
              <button
                type="button"
                onClick={() => setProjectType('academic_thesis')}
                className={`p-3.5 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer ${
                  projectType === 'academic_thesis'
                    ? 'border-folia-600 bg-folia-50/80 text-folia-950 ring-1 ring-folia-600 shadow-xs'
                    : 'border-paper-250 bg-paper-100 hover:bg-paper-150 text-paper-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-700" />
                    <span className="font-bold text-xs">Tesi di laurea & saggio</span>
                  </div>
                  {projectType === 'academic_thesis' && <Check className="w-4 h-4 text-folia-700" />}
                </div>
                <p className="text-[11px] text-paper-500 leading-relaxed">
                  Struttura accademica: frontespizio, capitoli tesi, fonti & bibliografia, metodologia e scaletta.
                </p>
              </button>

              {/* Lettera & Corrispondenza */}
              <button
                type="button"
                onClick={() => setProjectType('letter')}
                className={`p-3.5 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer ${
                  projectType === 'letter'
                    ? 'border-folia-600 bg-folia-50/80 text-folia-950 ring-1 ring-folia-600 shadow-xs'
                    : 'border-paper-250 bg-paper-100 hover:bg-paper-150 text-paper-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-700" />
                    <span className="font-bold text-xs">Lettera & corrispondenza</span>
                  </div>
                  {projectType === 'letter' && <Check className="w-4 h-4 text-folia-700" />}
                </div>
                <p className="text-[11px] text-paper-500 leading-relaxed">
                  Documento snello e mirato: testo lettera, bozze, destinatari e allegati.
                </p>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-paper-700 mb-1">
                {titleLabel}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={titlePlaceholder}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                className="w-full px-3.5 py-2 text-sm bg-paper-50 border border-paper-250 rounded-xl text-paper-900 placeholder-paper-400 focus:outline-hidden focus:border-folia-600 focus:ring-1 focus:ring-folia-600 shadow-2xs font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-paper-700 mb-1">
                {authorLabel}
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder={authorPlaceholder}
                onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                className="w-full px-3.5 py-2 text-sm bg-paper-50 border border-paper-250 rounded-xl text-paper-900 placeholder-paper-400 focus:outline-hidden focus:border-folia-600 focus:ring-1 focus:ring-folia-600 shadow-2xs font-sans"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-paper-100/70 border-t border-paper-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-paper-600 hover:bg-paper-200 rounded-xl transition-colors cursor-pointer"
          >
            Annulla
          </button>
          <button
            onClick={handleConfirm}
            className="flex items-center gap-1.5 px-5 py-2 bg-folia-700 hover:bg-folia-800 text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Crea e apri</span>
          </button>
        </div>
      </div>
    </div>
  );
};
