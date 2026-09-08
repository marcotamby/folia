import React, { useState } from 'react';
import { 
  FolderOpen, 
  Plus, 
  BookOpen, 
  Trash2, 
  Copy, 
  Edit3, 
  Check, 
  X, 
  Clock, 
  Calendar,
  FileText, 
  Search,
  HardDrive,
  Compass
} from 'lucide-react';
import { Project, ProjectType } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';

export interface ProjectSummary {
  id: string;
  title: string;
  author: string;
  wordCount: number;
  chapterCount: number;
  characterCount: number;
  updatedAt: string;
  filePath?: string;
  projectType?: ProjectType;
}

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProjectId: string;
  projectsList: ProjectSummary[];
  onSelectProject: (id: string) => void;
  onOpenCreateProject?: () => void;
  onRenameProject: (id: string, newTitle: string) => void;
  onDuplicateProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onBrowseFromFile: () => void;
  t: (key: string) => string;
}

export const ProjectsModal: React.FC<ProjectsModalProps> = ({
  isOpen,
  onClose,
  currentProjectId,
  projectsList = [],
  onSelectProject,
  onOpenCreateProject,
  onRenameProject,
  onDuplicateProject,
  onDeleteProject,
  onBrowseFromFile,
  t
}) => {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [deletingProject, setDeletingProject] = useState<ProjectSummary | null>(null);

  if (!isOpen) return null;

  const safeList = Array.isArray(projectsList) ? projectsList : [];

  const handleStartRename = (proj: ProjectSummary, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(proj.id);
    setEditingTitle(proj.title || '');
  };

  const handleConfirmRename = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (editingTitle.trim()) {
      onRenameProject(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  const filteredProjects = safeList.filter(p => {
    const title = (p?.title || '').toLowerCase();
    const author = (p?.author || '').toLowerCase();
    const q = (search || '').toLowerCase();
    return title.includes(q) || author.includes(q);
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in select-none folia-modal-overlay"
      onClick={onClose}
    >
      <div 
        className="bg-paper-50 rounded-2xl shadow-modal border border-paper-300 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-paper-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-folia-100 text-folia-800 rounded-xl border border-folia-200">
              <FolderOpen className="w-5 h-5 text-folia-800" />
            </div>
            <div>
              <h3 className="font-brand font-bold text-lg text-paper-900">I tuoi progetti</h3>
              <p className="text-xs text-paper-500">Tutti i manoscritti e le campagne creati su questo dispositivo</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-paper-400 hover:text-paper-700 hover:bg-paper-150 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar & Search */}
        <div className="px-6 py-3 border-b border-paper-200 bg-paper-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-paper-400" />
            <input
              type="text"
              placeholder="Cerca per titolo o autore..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-paper-50 border border-paper-250 rounded-lg text-paper-800 placeholder-paper-400 focus:outline-hidden focus:border-folia-600 focus:ring-1 focus:ring-folia-600 shadow-2xs font-sans"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onBrowseFromFile}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-paper-300 bg-paper-50 hover:bg-paper-150 text-paper-700 text-xs font-medium transition-colors cursor-pointer shadow-2xs"
              title="Apri un file di progetto salvato sul computer (.folia)"
            >
              <HardDrive className="w-3.5 h-3.5 text-paper-500" />
              <span>Sfoglia file...</span>
            </button>

            {onOpenCreateProject && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCreateProject();
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-folia-700 hover:bg-folia-800 text-white text-xs font-medium transition-all cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nuovo progetto</span>
              </button>
            )}
          </div>
        </div>

        {/* Projects List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {filteredProjects.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-paper-200 mx-auto flex items-center justify-center text-paper-400">
                <BookOpen className="w-6 h-6 text-folia-600" />
              </div>
              <p className="text-xs text-paper-600 font-medium">Nessun progetto trovato</p>
              <p className="text-[11px] text-paper-400">Crea un nuovo progetto o apri un file dal computer.</p>
            </div>
          ) : (
            filteredProjects.map(proj => {
              if (!proj) return null;
              const isCurrent = proj.id === currentProjectId;
              const isEditing = editingId === proj.id;

              return (
                <div
                  key={proj.id}
                  onClick={() => {
                    if (!isEditing) {
                      onSelectProject(proj.id);
                      onClose();
                    }
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer shadow-2xs group flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isCurrent
                      ? 'bg-folia-50/60 border-folia-300 ring-1 ring-folia-400'
                      : 'bg-white hover:bg-paper-100 border-paper-250 hover:border-paper-300'
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5 flex-1" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="px-2 py-0.5 text-sm font-brand font-bold text-paper-900 bg-white border border-folia-600 rounded focus:outline-hidden"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleConfirmRename(proj.id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                          />
                          <button
                            onClick={(e) => handleConfirmRename(proj.id, e)}
                            className="p-1 rounded bg-folia-700 text-white hover:bg-folia-800 cursor-pointer"
                            title="Salva titolo"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingId(null); }}
                            className="p-1 rounded bg-paper-200 text-paper-600 hover:bg-paper-300 cursor-pointer"
                            title="Annulla"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <h4 className="font-brand font-bold text-sm text-paper-900 truncate">
                            {proj.title || 'Nuovo progetto'}
                          </h4>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-folia-100 text-folia-800 border border-folia-200 shrink-0">
                              Attivo
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-paper-500 font-sans">
                      {proj.author && (
                        <span>di <strong className="text-paper-700">{proj.author}</strong></span>
                      )}
                      <span><strong>{(proj.wordCount || 0).toLocaleString()}</strong> parole</span>
                      <span>•</span>
                      <span><strong>{proj.chapterCount || 0}</strong> capitoli</span>
                      {(proj.characterCount || 0) > 0 && (
                        <>
                          <span>•</span>
                          <span><strong>{proj.characterCount}</strong> personaggi</span>
                        </>
                      )}
                      <span>•</span>
                      <span className="text-[10px] text-paper-400">
                        Modificato il {proj.updatedAt ? new Date(proj.updatedAt).toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'oggi'}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {!isEditing && (
                      <button
                        onClick={(e) => handleStartRename(proj, e)}
                        title="Rinomina progetto"
                        className="p-1.5 rounded-lg text-paper-400 hover:text-paper-700 hover:bg-paper-200 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => onDuplicateProject(proj.id)}
                      title="Duplica progetto"
                      className="p-1.5 rounded-lg text-paper-400 hover:text-paper-700 hover:bg-paper-200 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {safeList.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingProject(proj);
                        }}
                        title="Elimina progetto"
                        className="p-1.5 rounded-lg text-paper-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-paper-200 bg-paper-100 flex items-center justify-between text-xs text-paper-500">
          <span>{safeList.length} {safeList.length === 1 ? 'progetto' : 'progetti'} salvati</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-paper-200 hover:bg-paper-300 text-paper-800 rounded-xl font-medium transition-colors cursor-pointer"
          >
            Chiudi
          </button>
        </div>
      </div>

      {/* Premium Confirm Deletion Modal */}
      <ConfirmModal
        isOpen={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        onConfirm={() => {
          if (deletingProject) {
            onDeleteProject(deletingProject.id);
            setDeletingProject(null);
          }
        }}
        title="Elimina progetto"
        subtitle="Questa operazione rimuoverà il progetto dal tuo elenco"
        message={
          <span>
            Sei sicuro di voler eliminare definitivamente <strong>"{deletingProject?.title || 'questo progetto'}"</strong>? Tutti i capitoli, le schede e le note associate verranno rimossi.
          </span>
        }
        confirmLabel="Elimina definitivamente"
        cancelLabel="Annulla"
        variant="danger"
      />
    </div>
  );
};
