import React from 'react';
import { FolderOpen, Plus, BookOpen, FileText, ArrowRight } from 'lucide-react';
import logoImg from '../../assets/logo.png';

interface WelcomeScreenProps {
  recentProjects: Array<{ id: string; title: string; author: string; wordCount: number; updatedAt?: string }>;
  currentProjectTitle?: string;
  hasExistingProject: boolean;
  onContinue: () => void;
  onOpenNewProject: () => void;
  onOpenProjectsList: () => void;
  onSelectProject: (id: string) => void;
  onBrowseFromFile: () => void;
  t: (key: string) => string;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  recentProjects,
  currentProjectTitle,
  hasExistingProject,
  onContinue,
  onOpenNewProject,
  onOpenProjectsList,
  onSelectProject,
  onBrowseFromFile,
}) => {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch { return ''; }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-paper-150 select-none overflow-y-auto py-12 px-4">
      <div className="w-full max-w-3xl space-y-10">

        {/* Logo + Titolo */}
        <div className="flex flex-col items-center gap-3 text-center">
          <img src={logoImg} alt="Folia" className="w-16 h-16 rounded-2xl object-contain shadow-md" />
          <div>
            <h1 className="font-brand font-bold text-4xl text-paper-900 tracking-tight">Folia</h1>
            <p className="text-paper-500 text-sm mt-1">Il tuo studio di scrittura professionale</p>
          </div>
        </div>

        {/* Continua progetto corrente */}
        {hasExistingProject && currentProjectTitle && (
          <button
            onClick={onContinue}
            className="group w-full bg-folia-700 hover:bg-folia-800 text-white rounded-2xl p-5 flex items-center gap-4 shadow-md hover:shadow-lg transition-all text-left cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <ArrowRight className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-folia-200 text-xs font-semibold uppercase tracking-wide mb-0.5">Continua da dove hai lasciato</div>
              <div className="font-brand font-bold text-lg leading-tight truncate">{currentProjectTitle}</div>
            </div>
          </button>
        )}

        {/* Azioni principali */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nuovo Progetto */}
          <button
            onClick={onOpenNewProject}
            className={`group rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-all text-left cursor-pointer border ${
              hasExistingProject
                ? 'bg-paper-50 hover:bg-paper-100 border-paper-300 text-paper-900'
                : 'bg-folia-700 hover:bg-folia-800 text-white border-transparent shadow-md hover:shadow-lg'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${
              hasExistingProject ? 'bg-folia-100' : 'bg-white/20'
            }`}>
              <Plus className={`w-6 h-6 ${hasExistingProject ? 'text-folia-700' : 'text-white'}`} />
            </div>
            <div>
              <div className={`font-brand font-bold text-lg leading-tight ${hasExistingProject ? 'text-paper-900' : ''}`}>
                Nuovo progetto
              </div>
              <div className={`text-sm mt-0.5 ${hasExistingProject ? 'text-paper-500' : 'text-folia-200'}`}>
                Romanzo, racconto, campagna D&D…
              </div>
            </div>
          </button>

          {/* Apri progetto esistente */}
          <button
            onClick={onOpenProjectsList}
            className="group bg-paper-50 hover:bg-paper-100 border border-paper-300 text-paper-900 rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-all text-left cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FolderOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="font-brand font-bold text-lg leading-tight text-paper-900">I tuoi progetti</div>
              <div className="text-paper-500 text-sm mt-0.5">Apri o gestisci tutti i progetti</div>
            </div>
          </button>

          {/* Apri da file */}
          <button
            onClick={onBrowseFromFile}
            className="group bg-paper-50 hover:bg-paper-100 border border-paper-300 text-paper-900 rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-all text-left cursor-pointer sm:col-span-2"
          >
            <div className="w-12 h-12 rounded-xl bg-paper-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6 text-paper-500" />
            </div>
            <div>
              <div className="font-brand font-bold text-lg leading-tight text-paper-900">Apri da file…</div>
              <div className="text-paper-500 text-sm mt-0.5">Cerca un file <span className="font-mono text-xs">.folia</span> sul tuo computer</div>
            </div>
          </button>
        </div>

        {/* Progetti recenti */}
        {recentProjects.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-paper-400" />
              <h2 className="text-xs font-semibold text-paper-500 uppercase tracking-widest">Recenti</h2>
            </div>
            <div className="bg-paper-50 border border-paper-200 rounded-2xl overflow-hidden shadow-sm">
              {recentProjects.slice(0, 6).map((proj, i) => (
                <button
                  key={proj.id}
                  onClick={() => onSelectProject(proj.id)}
                  className={`w-full flex items-center justify-between px-5 py-3.5 hover:bg-folia-50 transition-colors text-left cursor-pointer group ${
                    i > 0 ? 'border-t border-paper-150' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-folia-100 flex items-center justify-center shrink-0 group-hover:bg-folia-200 transition-colors">
                      <BookOpen className="w-4 h-4 text-folia-700" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-paper-900 text-sm truncate">{proj.title || 'Progetto senza titolo'}</div>
                      {proj.author && <div className="text-paper-400 text-xs truncate">{proj.author}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 ml-3">
                    <span className="text-xs text-paper-400 font-mono hidden sm:block">
                      {(proj.wordCount || 0).toLocaleString('it-IT')} parole
                    </span>
                    <span className="text-xs text-paper-400 hidden md:block">
                      {formatDate(proj.updatedAt)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-paper-400">
          Folia — Studio di scrittura per autori · Tutti i tuoi dati restano sul tuo computer
        </p>
      </div>
    </div>
  );
};
