import React, { useState } from 'react';
import { Lightbulb, Plus, Trash2, Tag, MessageSquare, Zap, BookOpen, Globe, Search, Maximize2 } from 'lucide-react';
import { Project, IdeaNote } from '../../types';
import { CustomSelect, CustomSelectOption } from '../common/CustomSelect';
import { FocusTextModal } from '../common/FocusTextModal';

interface IdeasBoardProps {
  project: Project;
  onUpdateIdeas: (ideas: IdeaNote[]) => void;
  t: (key: string) => string;
}

export const IdeasBoard: React.FC<IdeasBoardProps> = ({
  project,
  onUpdateIdeas,
  t
}) => {
  const [newText, setNewText] = useState('');
  const [newTag, setNewTag] = useState<IdeaNote['tag']>('dialogue');
  const [newColor, setNewColor] = useState('#FEF08A'); // yellow
  const [focusData, setFocusData] = useState<{
    title: string;
    subtitle?: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
  } | null>(null);

  const ideasList = project.ideas || [];

  const tags: (CustomSelectOption & { value: IdeaNote['tag'] })[] = [
    {
      value: 'dialogue',
      label: t('ideas.tag_dialogue'),
      icon: <MessageSquare className="w-3.5 h-3.5 text-amber-600 shrink-0" />
    },
    {
      value: 'plot_twist',
      label: t('ideas.tag_plot_twist'),
      icon: <Zap className="w-3.5 h-3.5 text-rose-500 shrink-0" />
    },
    {
      value: 'scene',
      label: t('ideas.tag_scene'),
      icon: <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
    },
    {
      value: 'world',
      label: t('ideas.tag_world'),
      icon: <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
    },
    {
      value: 'research',
      label: t('ideas.tag_research'),
      icon: <Search className="w-3.5 h-3.5 text-purple-600 shrink-0" />
    },
  ];

  const colors = [
    '#FEF08A', // Yellow
    '#BBF7D0', // Green
    '#BFDBFE', // Blue
    '#DDD6FE', // Purple
    '#FECDD3', // Rose
    '#FED7AA', // Orange
  ];

  const handleAddIdea = () => {
    if (!newText.trim()) return;
    const idea: IdeaNote = {
      id: 'idea-' + Date.now(),
      text: newText.trim(),
      tag: newTag,
      color: newColor,
      createdAt: new Date().toISOString()
    };
    onUpdateIdeas([idea, ...ideasList]);
    setNewText('');
  };

  const handleDeleteIdea = (id: string) => {
    onUpdateIdeas(ideasList.filter(i => i.id !== id));
  };

  const handleUpdateIdeaText = (id: string, text: string) => {
    onUpdateIdeas(ideasList.map(i => i.id === id ? { ...i, text } : i));
  };

  return (
    <div className="flex-1 h-full bg-paper-150 overflow-y-auto p-6 md:p-8 select-none">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between bg-paper-50 p-4 rounded-2xl border border-paper-250 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-brand font-bold text-lg text-paper-900">{t('ideas.title')}</h2>
              <p className="text-xs text-paper-500">Post-it digitali per annotare battute, colpi di scena e intuizioni</p>
            </div>
          </div>
        </div>

        {/* Input Box to add idea */}
        <div className="bg-paper-50 p-4 rounded-2xl border border-paper-250 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-paper-700">Aggiungi una nuova nota o idea:</span>
            <button
              type="button"
              onClick={() => {
                setFocusData({
                  title: 'Nuova nota o idea veloce',
                  subtitle: 'Scrittura a schermo intero con conteggio parole',
                  value: newText,
                  onChange: (val) => setNewText(val),
                  placeholder: t('ideas.placeholder')
                });
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-paper-600 hover:text-folia-800 hover:bg-paper-200/80 rounded-lg transition-colors cursor-pointer border border-paper-250 shadow-2xs"
              title="Ingrandisci a schermo intero"
            >
              <Maximize2 className="w-3.5 h-3.5 text-folia-700" />
              <span>Ingrandisci</span>
            </button>
          </div>

          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder={t('ideas.placeholder')}
            rows={2}
            className="w-full p-3 bg-white rounded-xl border border-paper-200 focus:outline-hidden focus:border-folia-600 text-xs text-paper-900 resize-y min-h-[64px] font-sans"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-paper-500 font-medium">Categoria:</span>
              <CustomSelect
                value={newTag}
                options={tags}
                onChange={(val) => setNewTag(val as IdeaNote['tag'])}
                buttonClassName="h-8 px-3 text-xs bg-white hover:bg-paper-50 border-paper-250 rounded-xl text-paper-800 font-medium shadow-2xs hover:border-folia-600 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-paper-500 font-medium">Colore:</span>
              <div className="flex items-center gap-1.5">
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setNewColor(color)}
                    style={{ backgroundColor: color }}
                    className={`w-5 h-5 rounded-full border border-black/10 transition-transform ${
                      newColor === color ? 'scale-125 ring-2 ring-folia-600' : 'hover:scale-110'
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleAddIdea}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-folia-700 hover:bg-folia-800 text-white rounded-xl text-xs font-medium shadow-xs transition-colors cursor-pointer ml-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Aggiungi nota</span>
            </button>
          </div>
        </div>

        {/* Ideas Sticky Notes Grid */}
        {ideasList.length === 0 ? (
          <div className="p-12 text-center text-paper-400 bg-paper-50 rounded-2xl border border-paper-250">
            <Lightbulb className="w-10 h-10 mx-auto mb-2 text-paper-300 stroke-[1.5]" />
            <p className="text-xs">Nessuna idea salvata. Scrivi un appunto qui sopra!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ideasList.map(idea => (
              <div
                key={idea.id}
                style={{ backgroundColor: idea.color || '#FEF08A' }}
                className="p-4 rounded-2xl shadow-xs hover:shadow-md border border-black/5 transition-all flex flex-col justify-between min-h-[140px] group relative"
              >
                <div className="flex items-center justify-end pb-1 -mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => {
                      const foundTag = tags.find(t => t.value === idea.tag);
                      setFocusData({
                        title: foundTag ? `${foundTag.label} - Nota` : 'Nota veloce',
                        subtitle: 'Visualizzazione e modifica a schermo intero',
                        value: idea.text,
                        onChange: (val) => handleUpdateIdeaText(idea.id, val),
                        placeholder: t('ideas.placeholder')
                      });
                    }}
                    className="p-1 hover:text-folia-900 text-stone-600 hover:bg-black/5 rounded-md transition-colors cursor-pointer"
                    title="Ingrandisci a schermo intero"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <textarea
                  value={idea.text}
                  onChange={(e) => handleUpdateIdeaText(idea.id, e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-hidden text-xs text-stone-900 font-sans leading-relaxed resize-y min-h-[64px] flex-1"
                />

                <div className="flex items-center justify-between pt-2 border-t border-black/5 text-[10px] text-stone-600">
                  <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    {(() => {
                      const found = tags.find(t => t.value === idea.tag);
                      return (
                        <>
                          {found?.icon}
                          <span>{found?.label || idea.tag}</span>
                        </>
                      );
                    })()}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        const foundTag = tags.find(t => t.value === idea.tag);
                        setFocusData({
                          title: foundTag ? `${foundTag.label} - Nota` : 'Nota veloce',
                          subtitle: 'Visualizzazione e modifica a schermo intero',
                          value: idea.text,
                          onChange: (val) => handleUpdateIdeaText(idea.id, val),
                          placeholder: t('ideas.placeholder')
                        });
                      }}
                      className="p-1 hover:text-folia-900 text-stone-600 transition-colors cursor-pointer rounded"
                      title="Ingrandisci nota"
                    >
                      <Maximize2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteIdea(idea.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-700 transition-opacity cursor-pointer rounded"
                      title="Elimina idea"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Focus Text Modal for full-screen reading/writing */}
      {focusData && (
        <FocusTextModal
          isOpen={!!focusData}
          onClose={() => setFocusData(null)}
          title={focusData.title}
          subtitle={focusData.subtitle}
          icon={<Lightbulb className="w-5 h-5 text-amber-600" />}
          value={focusData.value}
          onChange={(val) => {
            focusData.onChange(val);
            setFocusData(prev => prev ? { ...prev, value: val } : null);
          }}
          placeholder={focusData.placeholder}
        />
      )}
    </div>
  );
};
