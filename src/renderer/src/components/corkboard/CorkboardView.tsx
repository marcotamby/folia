import React, { useState } from 'react';
import { LayoutGrid, Plus, FileText, CheckCircle2, Clock, ExternalLink, Trash2, Maximize2 } from 'lucide-react';
import { Project, ManuscriptItem, CardStatus } from '../../types';
import { CustomSelect } from '../common/CustomSelect';
import { FocusTextModal } from '../common/FocusTextModal';

interface CorkboardViewProps {
  project: Project;
  onSelectDoc: (id: string) => void;
  onAddChapter: () => void;
  onUpdateDocSynopsis: (id: string, synopsis: string) => void;
  onUpdateDocStatus: (id: string, status: CardStatus) => void;
  onUpdateDocTitle: (id: string, title: string) => void;
  onDeleteDoc: (id: string) => void;
  t: (key: string) => string;
}

export const CorkboardView: React.FC<CorkboardViewProps> = ({
  project,
  onSelectDoc,
  onAddChapter,
  onUpdateDocSynopsis,
  onUpdateDocStatus,
  onUpdateDocTitle,
  onDeleteDoc,
  t
}) => {
  const manuscriptList = project.manuscript || [];
  const [expandedCard, setExpandedCard] = useState<{
    id: string;
    title: string;
    synopsis: string;
  } | null>(null);

  const statusOptions: { value: CardStatus; label: string; color: string }[] = [
    { value: 'idea', label: t('corkboard.status_idea'), color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { value: 'draft', label: t('corkboard.status_draft'), color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'revised', label: t('corkboard.status_revised'), color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { value: 'done', label: t('corkboard.status_done'), color: 'bg-green-100 text-green-800 border-green-200' },
  ];

  return (
    <div className="flex-1 h-full bg-[#EAE8E1]/80 overflow-y-auto p-6 md:p-8 select-none">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between bg-paper-50/90 backdrop-blur-xs p-4 rounded-2xl border border-paper-250 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-800 rounded-xl">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-brand font-bold text-lg text-paper-900">{t('corkboard.title')}</h2>
              <p className="text-xs text-paper-500">Panoramica a schede del manoscritto stile Scrivener</p>
            </div>
          </div>

          <button
            onClick={onAddChapter}
            className="flex items-center gap-2 px-4 py-2 bg-folia-700 hover:bg-folia-800 text-white rounded-xl text-xs font-medium shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {t('corkboard.add_card')}
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {manuscriptList.map((item, index) => {
            const currentStatus = item.status || 'draft';

            return (
              <div
                key={item.id}
                className="bg-paper-50 rounded-2xl border border-paper-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group hover:border-folia-400"
              >
                {/* Card Header with index and title */}
                <div className="p-4 border-b border-paper-200 bg-paper-100/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="font-mono text-xs font-bold text-folia-800 bg-folia-100 px-1.5 py-0.5 rounded">
                      #{index + 1}
                    </span>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => onUpdateDocTitle(item.id, e.target.value)}
                      placeholder="Titolo capitolo / scena..."
                      className="font-brand font-bold text-sm text-paper-900 bg-transparent border-none focus:outline-hidden focus:ring-1 focus:ring-folia-500 rounded px-1 truncate flex-1"
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setExpandedCard({
                        id: item.id,
                        title: item.title || `Scheda #${index + 1}`,
                        synopsis: item.synopsis || ''
                      })}
                      title="Ingrandisci e metti in primo piano"
                      className="p-1 rounded-lg text-paper-400 hover:text-folia-800 hover:bg-folia-50 transition-colors cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onSelectDoc(item.id)}
                      title={t('corkboard.open_in_editor')}
                      className="p-1 rounded-lg text-paper-400 hover:text-folia-700 hover:bg-folia-50 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Synopsis Body */}
                <div className="p-4 flex-1">
                  <textarea
                    value={item.synopsis || ''}
                    onChange={(e) => onUpdateDocSynopsis(item.id, e.target.value)}
                    placeholder="Scrivi qui la sinossi o il riassunto di questa scena..."
                    rows={4}
                    className="w-full text-xs font-sans text-paper-700 bg-transparent border-none focus:outline-hidden resize-none leading-relaxed"
                  />
                </div>

                {/* Card Footer: Status Selector & Stats */}
                <div className="px-4 py-2.5 bg-paper-100/80 border-t border-paper-200 flex items-center justify-between text-[11px]">
                  {/* Status Dropdown Premium */}
                  <CustomSelect
                    value={currentStatus}
                    onChange={(val) => onUpdateDocStatus(item.id, val as CardStatus)}
                    options={statusOptions}
                    buttonClassName="py-0.5 px-2 text-[11px] font-medium bg-white"
                  />

                  <div className="flex items-center gap-2 text-paper-500">
                    <span>{(item.wordCount || 0).toLocaleString()} {t('app.words')}</span>
                    <button
                      onClick={() => onDeleteDoc(item.id)}
                      title={t('sidebar.delete_item')}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-600 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expanded Focus Text Modal */}
      {expandedCard && (
        <FocusTextModal
          isOpen={!!expandedCard}
          onClose={() => setExpandedCard(null)}
          title={`Sinossi: ${expandedCard.title}`}
          subtitle="Bacheca schede capitoli e scene"
          icon={<LayoutGrid className="w-5 h-5 text-folia-800" />}
          value={expandedCard.synopsis}
          onChange={(val) => {
            onUpdateDocSynopsis(expandedCard.id, val);
            setExpandedCard(prev => prev ? { ...prev, synopsis: val } : null);
          }}
          placeholder="Scrivi qui la sinossi o il riassunto di questa scena..."
        />
      )}
    </div>
  );
};
