import React, { useState } from 'react';
import { 
  GitCommit, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronRight, 
  BookOpen, 
  Link as LinkIcon, 
  CheckCircle2, 
  Layers,
  Compass,
  Edit2,
  AlertTriangle,
  Maximize2
} from 'lucide-react';
import { Project, PlotAct, PlotBeat } from '../../types';
import { PLOT_TEMPLATES, PlotTemplateInfo } from '../../utils/plotTemplates';
import { CustomSelect } from '../common/CustomSelect';
import { ConfirmModal } from '../common/ConfirmModal';
import { FocusTextModal } from '../common/FocusTextModal';

interface PlotOutlinerProps {
  project: Project;
  onUpdatePlotActs: (acts: PlotAct[]) => void;
  t: (key: string) => string;
}

export const PlotOutliner: React.FC<PlotOutlinerProps> = ({
  project,
  onUpdatePlotActs,
  t
}) => {
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [collapsedActs, setCollapsedActs] = useState<Record<string, boolean>>({});
  const [confirmTemplate, setConfirmTemplate] = useState<PlotTemplateInfo | null>(null);
  const [deletingAct, setDeletingAct] = useState<PlotAct | null>(null);
  const [expandedBeat, setExpandedBeat] = useState<{
    actId: string;
    beatId: string;
    title: string;
    actTitle: string;
    description: string;
    placeholder?: string;
  } | null>(null);

  const plotActsList = project.plotActs || [];
  const manuscriptList = project.manuscript || [];
  const isTtrpg = project.settings?.projectType === 'ttrpg_master';

  const toggleCollapseAct = (actId: string) => {
    setCollapsedActs(prev => ({ ...prev, [actId]: !prev[actId] }));
  };

  const handleApplyTemplate = (template: PlotTemplateInfo) => {
    if (plotActsList.length > 0) {
      setConfirmTemplate(template);
      return;
    }
    onUpdatePlotActs(template.createActs());
    setShowTemplatesModal(false);
  };

  const addAct = () => {
    const newAct: PlotAct = {
      id: 'act-' + Date.now(),
      title: `Nuovo atto ${plotActsList.length + 1}`,
      subtitle: 'Descrizione della fase narrativa',
      beats: [
        {
          id: 'beat-' + Date.now(),
          actId: 'act-' + Date.now(),
          title: 'Punto di svolta iniziale',
          description: 'Cosa accade in questo momento cruciale...',
          order: 0
        }
      ]
    };
    onUpdatePlotActs([...plotActsList, newAct]);
  };

  const updateActTitle = (actId: string, title: string) => {
    onUpdatePlotActs(
      plotActsList.map(act => act.id === actId ? { ...act, title } : act)
    );
  };

  const updateActSubtitle = (actId: string, subtitle: string) => {
    onUpdatePlotActs(
      plotActsList.map(act => act.id === actId ? { ...act, subtitle } : act)
    );
  };

  const deleteAct = (actId: string) => {
    onUpdatePlotActs(plotActsList.filter(act => act.id !== actId));
  };

  const addBeat = (actId: string) => {
    onUpdatePlotActs(
      plotActsList.map(act => {
        if (act.id === actId) {
          const newBeat: PlotBeat = {
            id: 'beat-' + Date.now(),
            actId,
            title: `Punto di svolta ${(act.beats || []).length + 1}`,
            description: '',
            order: (act.beats || []).length
          };
          return { ...act, beats: [...(act.beats || []), newBeat] };
        }
        return act;
      })
    );
  };

  const updateBeat = (actId: string, beatId: string, updates: Partial<PlotBeat>) => {
    onUpdatePlotActs(
      plotActsList.map(act => {
        if (act.id === actId) {
          return {
            ...act,
            beats: (act.beats || []).map(b => b.id === beatId ? { ...b, ...updates } : b)
          };
        }
        return act;
      })
    );
  };

  const deleteBeat = (actId: string, beatId: string) => {
    onUpdatePlotActs(
      plotActsList.map(act => {
        if (act.id === actId) {
          return {
            ...act,
            beats: (act.beats || []).filter(b => b.id !== beatId)
          };
        }
        return act;
      })
    );
  };

  return (
    <div className="flex-1 h-full bg-paper-150 overflow-y-auto p-6 md:p-10 select-none">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header with Template Selector & Add Act Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-paper-50 p-6 rounded-2xl border border-paper-250 shadow-page">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-folia-100 text-folia-800 rounded-2xl border border-folia-200 shadow-2xs">
              <Layers className="w-6 h-6 text-folia-800" />
            </div>
            <div>
              <h2 className="font-brand font-bold text-2xl text-paper-900">{t('plot.title')}</h2>
              <p className="text-xs text-paper-500 font-sans mt-0.5">Struttura la narrazione, i punti di svolta e gli archi narrativi</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowTemplatesModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-paper-100 hover:bg-paper-200 text-paper-800 rounded-xl text-xs font-semibold border border-paper-300 transition-all cursor-pointer shadow-2xs"
            >
              <Compass className="w-4 h-4 text-folia-700" />
              <span>Modelli narrativi</span>
            </button>

            <button
              onClick={addAct}
              className="flex items-center gap-1.5 px-4 py-2 bg-folia-700 hover:bg-folia-800 text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Aggiungi atto</span>
            </button>
          </div>
        </div>

        {/* Acts List */}
        {plotActsList.length === 0 ? (
          <div className="bg-paper-50 rounded-2xl border border-paper-250 p-12 text-center space-y-4 shadow-page">
            <div className="w-16 h-16 rounded-2xl bg-folia-50 text-folia-700 border border-folia-200 mx-auto flex items-center justify-center">
              <Layers className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-brand font-bold text-xl text-paper-800">Nessuna struttura definita</h3>
              <p className="text-sm text-paper-500 max-w-md mx-auto mt-1">
                Scegli uno dei modelli narrativi pronti all'uso (viaggio dell'eroe, 3 atti, salva il gatto, giallo, kishōtenketsu) oppure crea la tua struttura libera.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setShowTemplatesModal(true)}
                className="px-5 py-2.5 bg-folia-700 hover:bg-folia-800 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
              >
                Esplora modelli narrativi
              </button>
              <button
                onClick={addAct}
                className="px-5 py-2.5 bg-paper-100 hover:bg-paper-200 text-paper-800 rounded-xl text-xs font-semibold border border-paper-300 cursor-pointer shadow-2xs"
              >
                Crea atto personalizzato
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {plotActsList.map((act, actIndex) => {
              const isCollapsed = collapsedActs[act.id];
              const beatsList = act.beats || [];
              return (
                <div 
                  key={act.id} 
                  className="bg-paper-50 rounded-2xl border border-paper-250 shadow-page overflow-hidden transition-all"
                >
                  {/* Act Header */}
                  <div className="p-4 md:p-5 bg-paper-100/80 border-b border-paper-200 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 mr-3">
                      <button 
                        onClick={() => toggleCollapseAct(act.id)}
                        className="p-1 rounded-lg hover:bg-paper-200 text-paper-500 transition-colors cursor-pointer"
                      >
                        {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>

                      <div className="flex-1 space-y-1">
                        <input
                          type="text"
                          value={act.title || ''}
                          onChange={(e) => updateActTitle(act.id, e.target.value)}
                          placeholder="Titolo atto / fase..."
                          className="w-full font-brand font-bold text-lg md:text-xl text-paper-900 bg-transparent border-none focus:outline-hidden focus:ring-1 focus:ring-folia-500 rounded px-1"
                        />
                        <input
                          type="text"
                          value={act.subtitle || ''}
                          onChange={(e) => updateActSubtitle(act.id, e.target.value)}
                          placeholder="Sottotitolo o scopo narrativo della fase..."
                          className="w-full text-xs text-paper-500 bg-transparent border-none focus:outline-hidden focus:ring-1 focus:ring-folia-500 rounded px-1"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => addBeat(act.id)}
                        title="Aggiungi punto di svolta all'atto"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-folia-50 hover:bg-folia-100 text-folia-800 rounded-xl text-xs font-semibold border border-folia-200 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Aggiungi punto di svolta</span>
                      </button>

                      <button
                        onClick={() => setDeletingAct(act)}
                        title="Elimina questo atto"
                        className="p-2 rounded-xl hover:bg-red-50 text-paper-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Beats Timeline */}
                  {!isCollapsed && (
                    <div className="p-5 md:p-6 space-y-4">
                      {beatsList.length === 0 ? (
                        <p className="text-xs text-paper-400 italic py-3 text-center">Nessun punto di svolta inserito. Clicca su "+ Aggiungi punto di svolta".</p>
                      ) : (
                        beatsList.map((beat, bIndex) => (
                          <div
                            key={beat.id}
                            className="bg-white rounded-2xl border border-paper-250 p-4 md:p-5 shadow-xs hover:border-folia-300 transition-all flex flex-col gap-3 group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5 flex-1 mr-2">
                                <div className="w-6 h-6 rounded-full bg-folia-100 text-folia-800 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                                  {bIndex + 1}
                                </div>
                                <input
                                  type="text"
                                  value={beat.title || ''}
                                  onChange={(e) => updateBeat(act.id, beat.id, { title: e.target.value })}
                                  placeholder="Nome del punto di svolta..."
                                  className="w-full font-bold text-sm text-paper-900 bg-transparent border-none focus:outline-hidden focus:ring-1 focus:ring-folia-500 rounded px-1"
                                />
                              </div>

                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  onClick={() => setExpandedBeat({
                                    actId: act.id,
                                    beatId: beat.id,
                                    title: beat.title || `Punto di svolta ${bIndex + 1}`,
                                    actTitle: act.title,
                                    description: beat.description || '',
                                    placeholder: beat.guideline || (isTtrpg ? "Descrivi l'incontro, la sfida o lo svolgimento della quest..." : "Descrivi cosa accade in questa scena, le rivelazioni o i conflitti...")
                                  })}
                                  title="Ingrandisci e metti in primo piano"
                                  className="p-1 rounded-lg text-paper-400 hover:text-folia-800 hover:bg-paper-150 transition-colors cursor-pointer"
                                >
                                  <Maximize2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => deleteBeat(act.id, beat.id)}
                                  title="Elimina punto di svolta"
                                  className="p-1 text-paper-400 hover:text-red-600 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <textarea
                              value={beat.description || ''}
                              onChange={(e) => updateBeat(act.id, beat.id, { description: e.target.value })}
                              placeholder={beat.guideline || (isTtrpg ? "Descrivi l'incontro, la sfida o lo svolgimento della quest..." : "Descrivi cosa accade in questa scena, le rivelazioni o i conflitti...")}
                              rows={3}
                              className="w-full text-sm font-serif text-paper-800 placeholder:text-paper-400 placeholder:italic placeholder:font-normal bg-paper-50 p-3 rounded-xl border border-paper-200 focus:outline-hidden focus:bg-white focus:border-folia-600 focus:ring-1 focus:ring-folia-600 resize-none leading-relaxed"
                            />

                            {/* Link to manuscript chapter with CustomSelect */}
                            <div className="flex items-center justify-between pt-1 text-xs text-paper-500">
                              <div className="flex items-center gap-2">
                                <LinkIcon className="w-3.5 h-3.5 text-paper-400" />
                                <span className="font-medium text-paper-600">Capitolo collegato:</span>
                                <CustomSelect
                                  value={beat.linkedSceneId || ''}
                                  onChange={(val) => updateBeat(act.id, beat.id, { linkedSceneId: val || undefined })}
                                  placeholder="-- Nessun capitolo --"
                                  options={[
                                    { value: '', label: '-- Nessun capitolo --' },
                                    ...manuscriptList.map(doc => ({
                                      value: doc.id,
                                      label: doc.title || 'Senza titolo'
                                    }))
                                  ]}
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Narrative Templates Modal */}
      {showTemplatesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div 
            className="bg-paper-50 rounded-2xl shadow-modal border border-paper-300 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-paper-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-folia-100 text-folia-800 rounded-2xl">
                  <Compass className="w-6 h-6 text-folia-800" />
                </div>
                <div>
                  <h3 className="font-brand font-bold text-xl text-paper-900">Scegli modello struttura narrativa</h3>
                  <p className="text-xs text-paper-500">Seleziona una griglia narrativa classica, moderna o libera</p>
                </div>
              </div>
              <button 
                onClick={() => setShowTemplatesModal(false)}
                className="p-2 rounded-xl text-paper-400 hover:text-paper-700 hover:bg-paper-150 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3.5">
              {PLOT_TEMPLATES.map(template => (
                <div
                  key={template.id}
                  onClick={() => handleApplyTemplate(template)}
                  className="p-4 bg-white hover:bg-folia-50/60 rounded-xl border border-paper-250 hover:border-folia-400 transition-all cursor-pointer shadow-2xs group flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h4 className="font-brand font-bold text-base text-paper-900 group-hover:text-folia-950 flex items-center gap-2">
                      <span>{template.name}</span>
                    </h4>
                    <p className="text-xs text-paper-600 leading-relaxed font-sans">{template.description}</p>
                  </div>

                  <button className="px-3.5 py-2 rounded-xl bg-paper-100 group-hover:bg-folia-700 group-hover:text-white text-paper-700 text-xs font-semibold transition-colors shrink-0 cursor-pointer">
                    Applica
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-paper-200 bg-paper-100 flex justify-end">
              <button
                onClick={() => setShowTemplatesModal(false)}
                className="px-5 py-2 rounded-xl bg-paper-200 hover:bg-paper-300 text-paper-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Confirm Template Replacement Modal */}
      <ConfirmModal
        isOpen={!!confirmTemplate}
        onClose={() => setConfirmTemplate(null)}
        onConfirm={() => {
          if (confirmTemplate) {
            onUpdatePlotActs(confirmTemplate.createActs());
            setConfirmTemplate(null);
            setShowTemplatesModal(false);
          }
        }}
        title="Applica modello narrativo"
        subtitle="Conferma sostituzione della struttura"
        message={
          <span>
            Vuoi applicare la struttura <strong>"{confirmTemplate?.name}"</strong>? Gli atti e i punti di svolta attuali verranno sostituiti con la nuova struttura.
          </span>
        }
        confirmLabel="Applica struttura"
        cancelLabel="Annulla"
        variant="folia"
      />

      {/* Premium Confirm Act Deletion Modal */}
      <ConfirmModal
        isOpen={!!deletingAct}
        onClose={() => setDeletingAct(null)}
        onConfirm={() => {
          if (deletingAct) {
            deleteAct(deletingAct.id);
            setDeletingAct(null);
          }
        }}
        title="Elimina atto narrativo"
        subtitle="Questa azione eliminerà l'atto e tutti i punti di svolta contenuti"
        message={
          <span>
            Sei sicuro di voler eliminare <strong>"{deletingAct?.title || 'questo atto'}"</strong>?
          </span>
        }
        confirmLabel="Elimina definitivamente"
        cancelLabel="Annulla"
        variant="danger"
      />

      {/* Expanded Focus Text Modal for Beat */}
      {expandedBeat && (
        <FocusTextModal
          isOpen={!!expandedBeat}
          onClose={() => setExpandedBeat(null)}
          title={expandedBeat.title}
          subtitle={`Atto: ${expandedBeat.actTitle}`}
          icon={<GitCommit className="w-5 h-5 text-folia-800" />}
          value={expandedBeat.description}
          onChange={(val) => {
            updateBeat(expandedBeat.actId, expandedBeat.beatId, { description: val });
            setExpandedBeat(prev => prev ? { ...prev, description: val } : null);
          }}
          placeholder={expandedBeat.placeholder}
        />
      )}
    </div>
  );
};
