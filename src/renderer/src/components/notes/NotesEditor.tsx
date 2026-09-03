import React, { useState } from 'react';
import { StickyNote, Plus, Trash2, Tag, Search, BookOpen, Maximize2 } from 'lucide-react';
import { Project, ResearchNote } from '../../types';
import { FocusTextModal } from '../common/FocusTextModal';

interface NotesEditorProps {
  project: Project;
  onUpdateNotes: (notes: ResearchNote[]) => void;
  t: (key: string) => string;
}

export const NotesEditor: React.FC<NotesEditorProps> = ({
  project,
  onUpdateNotes,
  t
}) => {
  const notesList = project.notes || [];

  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(
    notesList.length > 0 ? notesList[0].id : null
  );
  const [search, setSearch] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const activeNote = notesList.find(n => n.id === selectedNoteId) || null;

  const handleAddNote = () => {
    const newNote: ResearchNote = {
      id: 'note-' + Date.now(),
      title: 'Nuova nota di ricerca',
      content: '',
      tags: ['ricerca'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onUpdateNotes([newNote, ...notesList]);
    setSelectedNoteId(newNote.id);
  };

  const handleUpdateNote = (id: string, field: keyof ResearchNote, value: any) => {
    const updated = notesList.map(n => n.id === id ? { ...n, [field]: value, updatedAt: new Date().toISOString() } : n);
    onUpdateNotes(updated);
  };

  const handleDeleteNote = (id: string) => {
    const remaining = notesList.filter(n => n.id !== id);
    onUpdateNotes(remaining);
    if (selectedNoteId === id) {
      setSelectedNoteId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const filteredNotes = notesList.filter(n => 
    !search || (n.title || '').toLowerCase().includes(search.toLowerCase()) || (n.content || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 h-full bg-paper-150 flex select-none overflow-hidden">
      {/* Left List of Notes */}
      <div className="w-64 md:w-72 bg-paper-50 border-r border-paper-200 flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-paper-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StickyNote className="w-4 h-4 text-teal-600" />
            <span className="font-brand font-bold text-sm text-paper-900">{t('sections.notes')}</span>
          </div>
          <button
            onClick={handleAddNote}
            className="p-1.5 rounded-lg bg-folia-700 hover:bg-folia-800 text-white transition-colors cursor-pointer shadow-2xs"
            title={t('notes.new_note')}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-paper-200">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-paper-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('app.search')}
              className="w-full pl-8 pr-3 py-1.5 bg-paper-100 border border-paper-200 rounded-lg text-xs text-paper-800 focus:outline-hidden focus:border-folia-600 font-sans"
            />
          </div>
        </div>

        {/* Notes Items */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredNotes.length === 0 ? (
            <div className="p-4 text-center text-xs text-paper-400 italic">
              Nessuna nota trovata
            </div>
          ) : (
            filteredNotes.map(note => (
              <div
                key={note.id}
                onClick={() => setSelectedNoteId(note.id)}
                className={`p-3 rounded-xl cursor-pointer transition-all border ${
                  selectedNoteId === note.id
                    ? 'bg-folia-50/80 border-folia-300 shadow-2xs'
                    : 'bg-white hover:bg-paper-100 border-paper-200'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <h4 className="font-brand font-bold text-xs text-paper-900 truncate">
                    {note.title || 'Senza titolo'}
                  </h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNote(note.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-paper-400 hover:text-red-600 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[11px] text-paper-500 line-clamp-2 leading-relaxed">
                  {note.content || 'Nessun contenuto...'}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Note Editor */}
      <div className="flex-1 bg-paper-100 flex flex-col h-full overflow-y-auto">
        {activeNote ? (
          <div className="max-w-3xl mx-auto w-full p-6 md:p-10 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <input
                type="text"
                value={activeNote.title || ''}
                onChange={(e) => handleUpdateNote(activeNote.id, 'title', e.target.value)}
                placeholder="Titolo della nota..."
                className="w-full font-brand font-bold text-2xl text-paper-900 bg-transparent border-none focus:outline-hidden focus:ring-1 focus:ring-folia-500 rounded px-1"
              />
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsExpanded(true)}
                  className="p-2 text-paper-400 hover:text-folia-800 hover:bg-paper-200 rounded-xl transition-colors cursor-pointer"
                  title="Ingrandisci e metti in primo piano (focus)"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteNote(activeNote.id)}
                  className="p-2 text-paper-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="Elimina nota"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <textarea
              value={activeNote.content || ''}
              onChange={(e) => handleUpdateNote(activeNote.id, 'content', e.target.value)}
              placeholder="Scrivi qui i tuoi appunti di ricerca, riferimenti storici, dettagli tecnici o bozze..."
              rows={16}
              className="w-full p-4 bg-white rounded-2xl border border-paper-250 shadow-xs focus:outline-hidden focus:border-folia-600 text-sm text-paper-800 leading-relaxed font-serif resize-none"
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-paper-400 p-8 text-center">
            <StickyNote className="w-12 h-12 stroke-[1.5] mb-3 text-paper-300" />
            <p className="text-xs">Seleziona una nota dall'elenco o creane una nuova</p>
          </div>
        )}
      </div>

      {/* Expanded Focus Text Modal */}
      {activeNote && isExpanded && (
        <FocusTextModal
          isOpen={isExpanded}
          onClose={() => setIsExpanded(false)}
          title={activeNote.title || 'Nota di ricerca'}
          subtitle="Sezione note e documentazione"
          icon={<StickyNote className="w-5 h-5 text-teal-700" />}
          value={activeNote.content || ''}
          onChange={(val) => handleUpdateNote(activeNote.id, 'content', val)}
          placeholder="Scrivi qui i tuoi appunti di ricerca, riferimenti storici, dettagli tecnici o bozze..."
        />
      )}
    </div>
  );
};
