import React, { useState } from 'react';
import { Lightbulb, Plus, Trash2, Tag } from 'lucide-react';
import { Project, IdeaNote } from '../../types';

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

  const ideasList = project.ideas || [];

  const tags: { value: IdeaNote['tag']; label: string }[] = [
    { value: 'dialogue', label: t('ideas.tag_dialogue') },
    { value: 'plot_twist', label: t('ideas.tag_plot_twist') },
    { value: 'scene', label: t('ideas.tag_scene') },
    { value: 'world', label: t('ideas.tag_world') },
    { value: 'research', label: t('ideas.tag_research') },
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
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder={t('ideas.placeholder')}
            rows={2}
            className="w-full p-3 bg-white rounded-xl border border-paper-200 focus:outline-hidden focus:border-folia-600 text-xs text-paper-900 resize-none font-sans"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-paper-500 font-medium">Categoria:</span>
              <select
                value={newTag}
                onChange={(e) => setNewTag(e.target.value as any)}
                className="px-2.5 py-1 text-xs bg-white border border-paper-250 rounded-lg text-paper-800 focus:outline-hidden"
              >
                {tags.map(tag => (
                  <option key={tag.value} value={tag.value}>{tag.label}</option>
                ))}
              </select>
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
                <textarea
                  value={idea.text}
                  onChange={(e) => handleUpdateIdeaText(idea.id, e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-hidden text-xs text-stone-900 font-sans leading-relaxed resize-none flex-1"
                />

                <div className="flex items-center justify-between pt-2 border-t border-black/5 text-[10px] text-stone-600">
                  <span className="font-semibold uppercase tracking-wider">
                    {tags.find(t => t.value === idea.tag)?.label || idea.tag}
                  </span>

                  <button
                    onClick={() => handleDeleteIdea(idea.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-700 transition-opacity"
                    title="Elimina idea"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
