import React, { useState, useMemo } from 'react';
import { 
  Hourglass, 
  Plus, 
  Trash2, 
  Edit2, 
  ChevronDown, 
  ChevronRight, 
  BookOpen, 
  Users, 
  Search, 
  ArrowUp, 
  ArrowDown, 
  ArrowDownCircle, 
  Milestone, 
  Calendar, 
  Clock, 
  X, 
  Check, 
  Flame, 
  Flag,
  Maximize2,
  GripVertical
} from 'lucide-react';
import { Project, TimelineEra, TimelineEvent, TimelineImportance } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';
import { FocusTextModal } from '../common/FocusTextModal';
import { CustomSelect, CustomSelectOption } from '../common/CustomSelect';

interface TimelineViewProps {
  project: Project;
  onUpdateTimelineEras: (eras: TimelineEra[]) => void;
  onNavigateToChapter: (chapterId: string) => void;
  onNavigateToCharacter: (characterId: string) => void;
  t: (key: string) => string;
}

const ERA_PALETTES: Record<string, { bg: string; border: string; text: string; dot: string; lightBg: string; name: string }> = {
  amber: {
    bg: 'bg-amber-600',
    border: 'border-amber-300',
    text: 'text-amber-900',
    dot: 'bg-amber-500 ring-amber-200',
    lightBg: 'bg-amber-50/70',
    name: 'Ambra e oro (miti, aurora)'
  },
  sapphire: {
    bg: 'bg-sky-600',
    border: 'border-sky-300',
    text: 'text-sky-900',
    dot: 'bg-sky-500 ring-sky-200',
    lightBg: 'bg-sky-50/70',
    name: 'Zaffiro e oceano (pace, regni)'
  },
  emerald: {
    bg: 'bg-emerald-600',
    border: 'border-emerald-300',
    text: 'text-emerald-900',
    dot: 'bg-emerald-500 ring-emerald-200',
    lightBg: 'bg-emerald-50/70',
    name: 'Smeraldo (natura, origini)'
  },
  purple: {
    bg: 'bg-purple-600',
    border: 'border-purple-300',
    text: 'text-purple-900',
    dot: 'bg-purple-500 ring-purple-200',
    lightBg: 'bg-purple-50/70',
    name: 'Ametista e magia (arcano, mistero)'
  },
  rose: {
    bg: 'bg-rose-600',
    border: 'border-rose-300',
    text: 'text-rose-900',
    dot: 'bg-rose-500 ring-rose-200',
    lightBg: 'bg-rose-50/70',
    name: 'Rubino e sangue (guerra, crisi)'
  },
  stone: {
    bg: 'bg-stone-600',
    border: 'border-stone-300',
    text: 'text-stone-900',
    dot: 'bg-stone-500 ring-stone-200',
    lightBg: 'bg-stone-100/70',
    name: 'Pietra e rovine (passato remoto)'
  },
  folia: {
    bg: 'bg-folia-700',
    border: 'border-folia-300',
    text: 'text-folia-900',
    dot: 'bg-folia-600 ring-folia-200',
    lightBg: 'bg-folia-50/70',
    name: 'Folia foresta (era narrativa)'
  }
};

const IMPORTANCE_CONFIG: Record<TimelineImportance, { label: string; badge: string; icon: React.ReactNode }> = {
  climax: {
    label: 'Svolta epocale / climax',
    badge: 'bg-rose-100 text-rose-800 border-rose-200',
    icon: <Flame className="w-3.5 h-3.5 text-rose-600" />
  },
  major: {
    label: 'Evento principale',
    badge: 'bg-sky-100 text-sky-800 border-sky-200',
    icon: <Milestone className="w-3.5 h-3.5 text-sky-600" />
  },
  minor: {
    label: 'Evento secondario',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: <Flag className="w-3.5 h-3.5 text-emerald-600" />
  },
  lore: {
    label: 'Lore e antefatto',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: <BookOpen className="w-3.5 h-3.5 text-amber-600" />
  }
};

export const TimelineView: React.FC<TimelineViewProps> = ({
  project,
  onUpdateTimelineEras,
  onNavigateToChapter,
  onNavigateToCharacter,
  t
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEraFilter, setSelectedEraFilter] = useState<string | 'all'>('all');
  const [collapsedEras, setCollapsedEras] = useState<Record<string, boolean>>({});

  // Modals state
  const [editingEra, setEditingEra] = useState<TimelineEra | 'new' | null>(null);
  const [editingEvent, setEditingEvent] = useState<{ eraId: string; event: TimelineEvent | 'new' } | null>(null);
  const [deletingEra, setDeletingEra] = useState<TimelineEra | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<{ eraId: string; event: TimelineEvent } | null>(null);

  // Form State for Era Modal
  const [eraFormTitle, setEraFormTitle] = useState('');
  const [eraFormTimeRange, setEraFormTimeRange] = useState('');
  const [eraFormDesc, setEraFormDesc] = useState('');
  const [eraFormColor, setEraFormColor] = useState('amber');

  // Form State for Event Modal
  const [eventFormEraId, setEventFormEraId] = useState('');
  const [eventFormTitle, setEventFormTitle] = useState('');
  const [eventFormDate, setEventFormDate] = useState('');
  const [eventFormSummary, setEventFormSummary] = useState('');
  const [eventFormImportance, setEventFormImportance] = useState<TimelineImportance>('major');
  const [eventFormChapters, setEventFormChapters] = useState<string[]>([]);
  const [eventFormCharacters, setEventFormCharacters] = useState<string[]>([]);
  const [focusTextData, setFocusTextData] = useState<{
    title: string;
    subtitle: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
  } | null>(null);

  // Drag and Drop state for events
  const [draggedEvent, setDraggedEvent] = useState<{ eraId: string; eventId: string } | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{ eraId: string; targetEventId?: string; position?: 'before' | 'after' } | null>(null);

  const eras = useMemo(() => project.timelineEras || [], [project.timelineEras]);
  const manuscript = useMemo(() => project.manuscript || [], [project.manuscript]);
  const characters = useMemo(() => project.characters || [], [project.characters]);

  // Total count of events
  const totalEventsCount = useMemo(() => {
    return eras.reduce((acc, era) => acc + (era.events?.length || 0), 0);
  }, [eras]);

  // Filtered Eras & Events
  const filteredEras = useMemo(() => {
    let list = eras;
    if (selectedEraFilter !== 'all') {
      list = list.filter(e => e.id === selectedEraFilter);
    }
    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase();
    return list.map(era => {
      const eraMatches = (era.title || '').toLowerCase().includes(q) || 
                         (era.timeRange || '').toLowerCase().includes(q) || 
                         (era.description || '').toLowerCase().includes(q);

      const matchedEvents = (era.events || []).filter(ev => 
        (ev.title || '').toLowerCase().includes(q) || 
        (ev.dateOrPeriod || '').toLowerCase().includes(q) || 
        (ev.summary || '').toLowerCase().includes(q)
      );

      if (eraMatches) return era;
      if (matchedEvents.length > 0) {
        return { ...era, events: matchedEvents };
      }
      return null;
    }).filter(Boolean) as TimelineEra[];
  }, [eras, selectedEraFilter, searchQuery]);

  // Era filter options for CustomSelect in header
  const eraFilterOptions: CustomSelectOption[] = useMemo(() => [
    { value: 'all', label: `Tutte le ere (${eras.length})` },
    ...eras.map(era => ({
      value: era.id,
      label: era.title
    }))
  ], [eras]);

  // Era selection options for Event Modal
  const eraSelectOptions: CustomSelectOption[] = useMemo(() => {
    return eras.map(era => ({
      value: era.id,
      label: era.title,
      badge: era.timeRange
    }));
  }, [eras]);

  // Importance options for CustomSelect in Event Modal
  const importanceOptions: CustomSelectOption[] = useMemo(() => [
    { value: 'climax', label: 'Svolta epocale / climax', icon: <Flame className="w-3.5 h-3.5 text-rose-600" /> },
    { value: 'major', label: 'Evento principale', icon: <Milestone className="w-3.5 h-3.5 text-sky-600" /> },
    { value: 'minor', label: 'Evento secondario', icon: <Flag className="w-3.5 h-3.5 text-emerald-600" /> },
    { value: 'lore', label: 'Lore e antefatto', icon: <BookOpen className="w-3.5 h-3.5 text-amber-600" /> }
  ], []);

  // Open Era Modal
  const handleOpenEraModal = (era: TimelineEra | 'new') => {
    if (era === 'new') {
      setEraFormTitle('');
      setEraFormTimeRange('');
      setEraFormDesc('');
      setEraFormColor('amber');
    } else {
      setEraFormTitle(era.title || '');
      setEraFormTimeRange(era.timeRange || '');
      setEraFormDesc(era.description || '');
      setEraFormColor(era.color || 'amber');
    }
    setEditingEra(era);
  };

  // Save Era
  const handleSaveEra = (e: React.FormEvent) => {
    e.preventDefault();
    const title = eraFormTitle.trim();
    if (!title) return;

    if (editingEra === 'new') {
      const newEra: TimelineEra = {
        id: 'era-' + Date.now(),
        title,
        timeRange: eraFormTimeRange.trim() || undefined,
        description: eraFormDesc.trim() || undefined,
        color: eraFormColor,
        order: eras.length,
        events: []
      };
      onUpdateTimelineEras([...eras, newEra]);
    } else if (editingEra) {
      const updated = eras.map(e => e.id === editingEra.id ? {
        ...e,
        title,
        timeRange: eraFormTimeRange.trim() || undefined,
        description: eraFormDesc.trim() || undefined,
        color: eraFormColor
      } : e);
      onUpdateTimelineEras(updated);
    }
    setEditingEra(null);
  };

  // Delete Era Confirm
  const handleConfirmDeleteEra = () => {
    if (!deletingEra) return;
    onUpdateTimelineEras(eras.filter(e => e.id !== deletingEra.id));
    setDeletingEra(null);
  };

  // Move Era
  const handleMoveEra = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= eras.length) return;
    const newEras = [...eras];
    const temp = newEras[index];
    newEras[index] = newEras[targetIndex];
    newEras[targetIndex] = temp;
    newEras.forEach((era, idx) => era.order = idx);
    onUpdateTimelineEras(newEras);
  };

  // Open Event Modal
  const handleOpenEventModal = (eraId: string, event: TimelineEvent | 'new') => {
    setEventFormEraId(eraId);
    if (event === 'new') {
      setEventFormTitle('');
      setEventFormDate('');
      setEventFormSummary('');
      setEventFormImportance('major');
      setEventFormChapters([]);
      setEventFormCharacters([]);
    } else {
      setEventFormTitle(event.title || '');
      setEventFormDate(event.dateOrPeriod || '');
      setEventFormSummary(event.summary || '');
      setEventFormImportance(event.importance || 'major');
      setEventFormChapters(event.linkedChapterIds || []);
      setEventFormCharacters(event.linkedCharacterIds || []);
    }
    setEditingEvent({ eraId, event });
  };

  // Save Event
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const title = eventFormTitle.trim();
    if (!title || !editingEvent) return;

    const targetEraId = eventFormEraId || editingEvent.eraId;

    if (editingEvent.event === 'new') {
      const newEvent: TimelineEvent = {
        id: 'ev-' + Date.now(),
        eraId: targetEraId,
        title,
        dateOrPeriod: eventFormDate.trim() || 'Periodo non specificato',
        summary: eventFormSummary.trim(),
        importance: eventFormImportance,
        linkedChapterIds: eventFormChapters,
        linkedCharacterIds: eventFormCharacters,
        order: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedEras = eras.map(era => {
        if (era.id === targetEraId) {
          return {
            ...era,
            events: [...(era.events || []), newEvent]
          };
        }
        return era;
      });
      onUpdateTimelineEras(updatedEras);
    } else {
      const originalEraId = editingEvent.eraId;
      const eventId = editingEvent.event.id;

      const updatedEvent: TimelineEvent = {
        ...editingEvent.event,
        eraId: targetEraId,
        title,
        dateOrPeriod: eventFormDate.trim() || 'Periodo non specificato',
        summary: eventFormSummary.trim(),
        importance: eventFormImportance,
        linkedChapterIds: eventFormChapters,
        linkedCharacterIds: eventFormCharacters,
        updatedAt: new Date().toISOString()
      };

      let updatedEras = [...eras];

      // If moved to a different era
      if (originalEraId !== targetEraId) {
        updatedEras = updatedEras.map(era => {
          if (era.id === originalEraId) {
            return {
              ...era,
              events: (era.events || []).filter(ev => ev.id !== eventId)
            };
          }
          if (era.id === targetEraId) {
            return {
              ...era,
              events: [...(era.events || []), updatedEvent]
            };
          }
          return era;
        });
      } else {
        updatedEras = updatedEras.map(era => {
          if (era.id === targetEraId) {
            return {
              ...era,
              events: (era.events || []).map(ev => ev.id === eventId ? updatedEvent : ev)
            };
          }
          return era;
        });
      }
      onUpdateTimelineEras(updatedEras);
    }

    setEditingEvent(null);
  };

  // Delete Event Confirm
  const handleConfirmDeleteEvent = () => {
    if (!deletingEvent) return;
    const { eraId, event } = deletingEvent;
    const updatedEras = eras.map(era => {
      if (era.id === eraId) {
        return {
          ...era,
          events: (era.events || []).filter(ev => ev.id !== event.id)
        };
      }
      return era;
    });
    onUpdateTimelineEras(updatedEras);
    setDeletingEvent(null);
  };

  // Move Event inside an Era
  const handleMoveEvent = (eraId: string, eventIndex: number, direction: 'up' | 'down') => {
    const era = eras.find(e => e.id === eraId);
    if (!era || !era.events) return;
    const targetIndex = direction === 'up' ? eventIndex - 1 : eventIndex + 1;
    if (targetIndex < 0 || targetIndex >= era.events.length) return;

    const newEvents = [...era.events];
    const temp = newEvents[eventIndex];
    newEvents[eventIndex] = newEvents[targetIndex];
    newEvents[targetIndex] = temp;
    newEvents.forEach((ev, idx) => ev.order = idx);

    const updatedEras = eras.map(e => e.id === eraId ? { ...e, events: newEvents } : e);
    onUpdateTimelineEras(updatedEras);
  };

  // Drag and Drop Event Reordering (within same era or across eras)
  const handleReorderEvent = (
    sourceEraId: string,
    sourceEventId: string,
    targetEraId: string,
    targetEventId?: string,
    position: 'before' | 'after' = 'after'
  ) => {
    if (sourceEraId === targetEraId && (!targetEventId || sourceEventId === targetEventId)) return;

    const sourceEra = eras.find(e => e.id === sourceEraId);
    const targetEra = eras.find(e => e.id === targetEraId);
    if (!sourceEra || !targetEra) return;

    const eventToMove = (sourceEra.events || []).find(ev => ev.id === sourceEventId);
    if (!eventToMove) return;

    const updatedEvent = { ...eventToMove, eraId: targetEraId };
    let updatedEras = [...eras];

    if (sourceEraId === targetEraId) {
      if (!targetEventId) return;
      const currentEvents = [...(sourceEra.events || [])];
      const sourceIdx = currentEvents.findIndex(ev => ev.id === sourceEventId);
      if (sourceIdx === -1) return;

      currentEvents.splice(sourceIdx, 1);
      const targetIdx = currentEvents.findIndex(ev => ev.id === targetEventId);
      if (targetIdx === -1) return;
      const insertIdx = position === 'before' ? targetIdx : targetIdx + 1;

      currentEvents.splice(insertIdx, 0, updatedEvent);
      currentEvents.forEach((ev, idx) => (ev.order = idx));

      updatedEras = updatedEras.map(e => e.id === sourceEraId ? { ...e, events: currentEvents } : e);
    } else {
      const sourceEvents = (sourceEra.events || []).filter(ev => ev.id !== sourceEventId);
      sourceEvents.forEach((ev, idx) => (ev.order = idx));

      const targetEvents = [...(targetEra.events || [])];
      if (targetEventId) {
        const targetIdx = targetEvents.findIndex(ev => ev.id === targetEventId);
        const insertIdx = targetIdx !== -1 ? (position === 'before' ? targetIdx : targetIdx + 1) : targetEvents.length;
        targetEvents.splice(insertIdx, 0, updatedEvent);
      } else {
        // Appending to target era (e.g. empty era or dropped directly on era)
        targetEvents.push(updatedEvent);
      }
      targetEvents.forEach((ev, idx) => (ev.order = idx));

      updatedEras = updatedEras.map(e => {
        if (e.id === sourceEraId) return { ...e, events: sourceEvents };
        if (e.id === targetEraId) return { ...e, events: targetEvents };
        return e;
      });

      // Automatically uncollapse target era so the user sees the moved event
      setCollapsedEras(prev => ({ ...prev, [targetEraId]: false }));
    }

    onUpdateTimelineEras(updatedEras);
  };

  // Toggle Collapse
  const toggleCollapseEra = (eraId: string) => {
    setCollapsedEras(prev => ({ ...prev, [eraId]: !prev[eraId] }));
  };

  // Template starter generator
  const handleGenerateSampleTimeline = () => {
    const sampleEras: TimelineEra[] = [
      {
        id: 'era-ancient',
        title: 'Era antica: l\'alba dei primi regni',
        timeRange: 'Anni 1 - 500',
        description: 'La fondazione delle prime dinastie, la scoperta della magia e la prima grande divisione tra popoli.',
        color: 'amber',
        order: 0,
        events: [
          {
            id: 'ev-1',
            eraId: 'era-ancient',
            title: 'Fondazione della città d\'oro',
            dateOrPeriod: 'Anno 12',
            summary: 'I primi coloni giungono sulle rive del grande fiume e pongono la prima pietra del tempio.',
            importance: 'lore',
            order: 0,
            linkedChapterIds: []
          },
          {
            id: 'ev-2',
            eraId: 'era-ancient',
            title: 'La notte dei miti perduti',
            dateOrPeriod: 'Anno 340',
            summary: 'Un antico potere magico viene sigillato nelle cripte sotterranee per evitare il collasso del reame.',
            importance: 'major',
            order: 1,
            linkedChapterIds: []
          }
        ]
      },
      {
        id: 'era-middle',
        title: 'Seconda era: il grande conflitto',
        timeRange: 'Anni 501 - 950',
        description: 'Epoca di guerre territoriali, ascesa e caduta degli ordini cavallereschi.',
        color: 'rose',
        order: 1,
        events: [
          {
            id: 'ev-3',
            eraId: 'era-middle',
            title: 'La battaglia del passo di ferro',
            dateOrPeriod: 'Anno 720',
            summary: 'L\'esercito ribelle respinge le forze imperiali sancendo l\'indipendenza delle terre del nord.',
            importance: 'climax',
            order: 0,
            linkedChapterIds: []
          }
        ]
      },
      {
        id: 'era-current',
        title: 'Era attuale: il presente della narrazione',
        timeRange: 'Anno 1000 - Presente',
        description: 'Il periodo temporale in cui si svolgono i capitoli principali del manoscritto.',
        color: 'folia',
        order: 2,
        events: [
          {
            id: 'ev-4',
            eraId: 'era-current',
            title: 'L\'inizio del viaggio del protagonista',
            dateOrPeriod: 'Primavera dell\'anno 1000',
            summary: 'La partenza improvvisa dal villaggio natale a seguito della scoperta dell\'antico sigillo.',
            importance: 'major',
            order: 0,
            linkedChapterIds: manuscript.length > 0 ? [manuscript[0].id] : []
          }
        ]
      }
    ];

    onUpdateTimelineEras(sampleEras);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-paper-100 overflow-hidden select-none">
      {/* Top Header Bar */}
      <header className="px-6 py-4 bg-paper-50/90 backdrop-blur-xs border-b border-paper-250 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-folia-100 text-folia-800 border border-folia-200 flex items-center justify-center shrink-0 shadow-2xs">
            <Hourglass className="w-5 h-5 text-folia-800" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-brand font-bold text-xl text-paper-900 leading-tight">
                Linea temporale
              </h2>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-paper-200 text-paper-700 border border-paper-300">
                {eras.length} {eras.length === 1 ? 'era' : 'ere'} • {totalEventsCount} {totalEventsCount === 1 ? 'evento' : 'eventi'}
              </span>
            </div>
            <p className="text-xs text-paper-500 mt-0.5">
              Gestisci archi temporali estesi, epoche storiche ed eventi collegati ai capitoli del manoscritto
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-paper-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca evento, data o nota..."
              className="pl-8 pr-3 py-1.5 text-xs bg-paper-150 border border-paper-250 rounded-xl text-paper-800 placeholder:text-paper-400 placeholder:font-normal focus:outline-none focus:border-folia-500 focus:bg-white transition-all w-48 focus:w-64 font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-paper-400 hover:text-paper-700 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Era Filter with CustomSelect */}
          {eras.length > 1 && (
            <CustomSelect
              size="sm"
              value={selectedEraFilter}
              options={eraFilterOptions}
              onChange={(val) => setSelectedEraFilter(val)}
              className="w-44"
            />
          )}

          {/* Add Era Button */}
          <button
            onClick={() => handleOpenEraModal('new')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-paper-200 hover:bg-paper-250 text-paper-800 text-xs font-semibold border border-paper-300 transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuova era</span>
          </button>

          {/* Add Event Button */}
          <button
            onClick={() => {
              if (eras.length === 0) {
                handleOpenEraModal('new');
              } else {
                handleOpenEventModal(eras[0].id, 'new');
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-folia-700 hover:bg-folia-800 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuovo evento</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
        {/* Empty State */}
        {eras.length === 0 ? (
          <div className="max-w-xl mx-auto mt-12 p-8 bg-paper-50 rounded-3xl border border-paper-300 shadow-sm text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-folia-100 text-folia-800 border border-folia-200 flex items-center justify-center mx-auto shadow-sm">
              <Hourglass className="w-8 h-8 text-folia-800" />
            </div>
            <div className="space-y-2">
              <h3 className="font-brand font-bold text-2xl text-paper-900">
                Crea la cronologia del tuo mondo
              </h3>
              <p className="text-sm text-paper-600 leading-relaxed font-sans">
                La linea temporale ti permette di tracciare secoli o millenni di storia: organizza le grandi ere (es. <em>L'alba dei draghi</em>, <em>L'età delle guerre</em> o <em>Il presente</em>), inserisci i punti di svolta cruciali e collega direttamente i capitoli del tuo manoscritto per non perdere mai il filo della narrazione.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => handleOpenEraModal('new')}
                className="w-full sm:w-auto px-5 py-2.5 bg-folia-700 hover:bg-folia-800 text-white text-sm font-semibold rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Crea la prima era da zero</span>
              </button>
              <button
                onClick={handleGenerateSampleTimeline}
                className="w-full sm:w-auto px-5 py-2.5 bg-paper-200 hover:bg-paper-250 text-paper-800 text-sm font-semibold rounded-2xl border border-paper-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-folia-700" />
                <span>Genera cronologia d'esempio</span>
              </button>
            </div>
          </div>
        ) : filteredEras.length === 0 ? (
          <div className="text-center py-16 text-paper-500 space-y-2">
            <Search className="w-8 h-8 mx-auto text-paper-400 opacity-60" />
            <p className="text-sm font-medium">Nessun evento o era corrisponde alla ricerca «{searchQuery}»</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedEraFilter('all'); }}
              className="text-xs text-folia-700 hover:underline cursor-pointer"
            >
              Azzera filtri di ricerca
            </button>
          </div>
        ) : (
          /* Timeline Content by Era */
          <div className="max-w-4xl mx-auto space-y-10">
            {filteredEras.map((era, eraIdx) => {
              const palette = ERA_PALETTES[era.color] || ERA_PALETTES.amber;
              const isCollapsed = !!collapsedEras[era.id];
              const events = era.events || [];

              return (
                <section 
                  key={era.id} 
                  className="bg-paper-50 rounded-3xl border border-paper-250 shadow-2xs overflow-hidden transition-all"
                >
                  {/* Era Header */}
                  <div 
                    onDragOver={(e) => {
                      if (!draggedEvent || draggedEvent.eraId === era.id) return;
                      if (isCollapsed) {
                        e.preventDefault();
                        e.stopPropagation();
                        setDropIndicator({ eraId: era.id });
                      }
                    }}
                    onDragLeave={(e) => {
                      if (isCollapsed && dropIndicator?.eraId === era.id && !dropIndicator?.targetEventId) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        if (e.clientX < rect.left || e.clientX >= rect.right || e.clientY < rect.top || e.clientY >= rect.bottom) {
                          setDropIndicator(null);
                        }
                      }
                    }}
                    onDrop={(e) => {
                      if (isCollapsed && draggedEvent && draggedEvent.eraId !== era.id) {
                        e.preventDefault();
                        e.stopPropagation();
                        handleReorderEvent(
                          draggedEvent.eraId,
                          draggedEvent.eventId,
                          era.id
                        );
                        setDraggedEvent(null);
                        setDropIndicator(null);
                      }
                    }}
                    className={`p-5 md:p-6 ${palette.lightBg} ${!isCollapsed ? 'border-b border-paper-200' : ''} flex items-start justify-between gap-4 transition-all ${
                      isCollapsed && dropIndicator?.eraId === era.id && !dropIndicator?.targetEventId
                        ? 'ring-2 ring-folia-500 bg-folia-100/80 scale-[1.005]'
                        : ''
                    }`}
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <button
                        onClick={() => toggleCollapseEra(era.id)}
                        className="p-1 rounded-lg text-paper-600 hover:bg-paper-200/60 transition-colors mt-0.5 cursor-pointer shrink-0"
                        title={isCollapsed ? 'Espandi era' : 'Comprimi era'}
                      >
                        {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>

                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${palette.bg} shrink-0 ring-2 ring-white shadow-2xs`} />
                          <h3 className="font-brand font-bold text-xl text-paper-900 leading-snug break-words">
                            {era.title}
                          </h3>
                          {era.timeRange && (
                            <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-white/80 text-paper-700 border border-paper-300 shadow-2xs">
                              {era.timeRange}
                            </span>
                          )}
                          <span className="text-xs text-paper-500 font-sans">
                            ({events.length} {events.length === 1 ? 'evento' : 'eventi'})
                          </span>
                        </div>

                        {era.description && (
                          <p className="text-xs text-paper-600 leading-relaxed font-sans max-w-2xl pt-1">
                            {era.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Era Action Buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleMoveEra(eraIdx, 'up')}
                        disabled={eraIdx === 0}
                        className="p-1.5 rounded-lg text-paper-400 hover:text-paper-700 hover:bg-paper-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Sposta era in alto"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveEra(eraIdx, 'down')}
                        disabled={eraIdx === eras.length - 1}
                        className="p-1.5 rounded-lg text-paper-400 hover:text-paper-700 hover:bg-paper-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        title="Sposta era in basso"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEraModal(era)}
                        className="p-1.5 rounded-lg text-paper-500 hover:text-paper-800 hover:bg-paper-200 transition-colors cursor-pointer"
                        title="Modifica era"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingEra(era)}
                        className="p-1.5 rounded-lg text-paper-400 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Elimina era"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Era Events Timeline */}
                  {!isCollapsed && (
                    <div className="p-6 md:p-8">
                      {events.length === 0 ? (
                        <div 
                          onDragOver={(e) => {
                            if (!draggedEvent) return;
                            e.preventDefault();
                            e.stopPropagation();
                            setDropIndicator({ eraId: era.id });
                          }}
                          onDragLeave={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            if (e.clientX < rect.left || e.clientX >= rect.right || e.clientY < rect.top || e.clientY >= rect.bottom) {
                              if (dropIndicator?.eraId === era.id && !dropIndicator?.targetEventId) {
                                setDropIndicator(null);
                              }
                            }
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (draggedEvent) {
                              handleReorderEvent(
                                draggedEvent.eraId,
                                draggedEvent.eventId,
                                era.id
                              );
                            }
                            setDraggedEvent(null);
                            setDropIndicator(null);
                          }}
                          className={`py-8 text-center rounded-2xl border transition-all space-y-2 ${
                            dropIndicator?.eraId === era.id && !dropIndicator?.targetEventId
                              ? 'border-folia-500 bg-folia-50/80 ring-2 ring-folia-400/40 scale-[1.01]'
                              : 'border-dashed border-paper-300 bg-paper-100/60'
                          }`}
                        >
                          {dropIndicator?.eraId === era.id && !dropIndicator?.targetEventId ? (
                            <div className="py-2 space-y-1">
                              <ArrowDownCircle className="w-6 h-6 mx-auto text-folia-600 animate-bounce" />
                              <p className="text-xs text-folia-800 font-semibold">Rilascia qui per spostare l'evento in questa era</p>
                            </div>
                          ) : (
                            <>
                              <Clock className="w-6 h-6 mx-auto text-paper-400" />
                              <p className="text-xs text-paper-600 font-medium">Nessun evento ancora registrato in questa era.</p>
                              <button
                                onClick={() => handleOpenEventModal(era.id, 'new')}
                                className="text-xs text-folia-700 font-semibold hover:underline cursor-pointer"
                              >
                                + Aggiungi il primo evento
                              </button>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="relative pl-10 space-y-6">
                          {/* Continuous Vertical Timeline Line */}
                          <div className="absolute left-5 top-3 bottom-3 w-0.5 -translate-x-1/2 bg-paper-300" />

                          {events.map((ev, evIdx) => {
                            const impConfig = IMPORTANCE_CONFIG[ev.importance || 'major'];
                            const linkedDocs = manuscript.filter(doc => (ev.linkedChapterIds || []).includes(doc.id));
                            const linkedChars = characters.filter(ch => (ev.linkedCharacterIds || []).includes(ch.id));

                            return (
                              <div 
                                key={ev.id} 
                                draggable
                                onDragStart={(e) => {
                                  e.dataTransfer.setData('text/plain', ev.id);
                                  e.dataTransfer.effectAllowed = 'move';
                                  setDraggedEvent({ eraId: era.id, eventId: ev.id });
                                }}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (!draggedEvent || draggedEvent.eventId === ev.id) return;
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  const midY = rect.top + rect.height / 2;
                                  const position = e.clientY < midY ? 'before' : 'after';
                                  setDropIndicator({ eraId: era.id, targetEventId: ev.id, position });
                                }}
                                onDragLeave={(e) => {
                                  if (dropIndicator?.targetEventId === ev.id) {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const x = e.clientX;
                                    const y = e.clientY;
                                    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
                                      setDropIndicator(null);
                                    }
                                  }
                                }}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (draggedEvent && dropIndicator && dropIndicator.targetEventId === ev.id) {
                                    handleReorderEvent(
                                      draggedEvent.eraId,
                                      draggedEvent.eventId,
                                      dropIndicator.eraId,
                                      dropIndicator.targetEventId,
                                      dropIndicator.position
                                    );
                                  }
                                  setDraggedEvent(null);
                                  setDropIndicator(null);
                                }}
                                onDragEnd={() => {
                                  setDraggedEvent(null);
                                  setDropIndicator(null);
                                }}
                                className={`relative group transition-all select-none ${
                                  draggedEvent?.eventId === ev.id ? 'opacity-35 scale-[0.99]' : ''
                                }`}
                              >
                                {/* Visual Drop Indicator Line */}
                                {dropIndicator?.targetEventId === ev.id && (
                                  <div
                                    className={`absolute left-0 right-0 h-1 bg-folia-600 z-30 pointer-events-none rounded-full shadow-sm ${
                                      dropIndicator.position === 'before' ? '-top-3' : '-bottom-3'
                                    }`}
                                  />
                                )}

                                {/* Node Dot on the timeline */}
                                <div 
                                  className={`absolute -left-5 top-3.5 w-4 h-4 -translate-x-1/2 rounded-full border-2 border-white shadow-2xs ${palette.dot} ring-4 transition-transform group-hover:scale-125`} 
                                />

                                {/* Event Card */}
                                <div className="bg-white hover:bg-paper-50/80 rounded-2xl border border-paper-250 hover:border-paper-350 p-4 md:p-5 shadow-2xs hover:shadow-xs transition-all space-y-3">
                                  {/* Event Header */}
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="space-y-1 min-w-0">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xs font-medium text-folia-850 bg-folia-50 px-2 py-0.5 rounded-lg border border-folia-200">
                                          {ev.dateOrPeriod}
                                        </span>
                                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border flex items-center gap-1 ${impConfig.badge}`}>
                                          {impConfig.icon}
                                          <span>{impConfig.label}</span>
                                        </span>
                                      </div>

                                      <h4 className="font-brand font-bold text-lg text-paper-900 leading-snug break-words pt-0.5">
                                        {ev.title}
                                      </h4>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                                      <div
                                        className="p-1.5 rounded-lg text-paper-400 hover:text-folia-800 hover:bg-paper-150 transition-colors cursor-grab active:cursor-grabbing"
                                        title="Trascina per riordinare l'evento"
                                      >
                                        <GripVertical className="w-3.5 h-3.5" />
                                      </div>
                                      <button
                                        onClick={() => handleOpenEventModal(era.id, ev)}
                                        className="p-1.5 rounded-lg text-paper-500 hover:text-paper-800 hover:bg-paper-150 transition-colors cursor-pointer"
                                        title="Modifica evento"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => setDeletingEvent({ eraId: era.id, event: ev })}
                                        className="p-1.5 rounded-lg text-paper-400 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                                        title="Elimina evento"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Event Description / Notes */}
                                  {ev.summary && (
                                    <p className="text-sm text-paper-700 font-sans leading-relaxed whitespace-pre-line">
                                      {ev.summary}
                                    </p>
                                  )}

                                  {/* Linked Chapters and Characters Tags */}
                                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                                    {/* Linked Chapters Badges (Click to navigate to editor!) */}
                                    {linkedDocs.length > 0 && (
                                      <div className="flex flex-wrap items-center gap-1.5">
                                        {linkedDocs.map(doc => (
                                          <button
                                            key={doc.id}
                                            onClick={() => onNavigateToChapter(doc.id)}
                                            className="group/doc flex items-center gap-1 px-2.5 py-1 rounded-lg bg-folia-100/80 hover:bg-folia-200 text-folia-900 border border-folia-300 font-medium text-[11px] transition-colors cursor-pointer shadow-2xs"
                                            title="Clicca per aprire questo capitolo nell'editor"
                                          >
                                            <BookOpen className="w-3 h-3 text-folia-700 group-hover/doc:scale-110 transition-transform" />
                                            <span className="truncate max-w-[200px]">{doc.title || 'Capitolo senza titolo'}</span>
                                            <span className="text-[10px] text-folia-600 opacity-70">↗</span>
                                          </button>
                                        ))}
                                      </div>
                                    )}

                                    {/* Linked Characters Badges (Click to open character sheet!) */}
                                    {linkedChars.length > 0 && (
                                      <div className="flex flex-wrap items-center gap-1.5">
                                        {linkedChars.map(ch => (
                                          <button
                                            key={ch.id}
                                            onClick={() => onNavigateToCharacter(ch.id)}
                                            className="group/char flex items-center gap-1 px-2.5 py-1 rounded-lg bg-paper-150 hover:bg-paper-200 text-paper-700 hover:text-paper-900 border border-paper-250 hover:border-paper-350 font-medium text-[11px] transition-colors cursor-pointer shadow-2xs"
                                            title="Clicca per aprire la scheda di questo personaggio"
                                          >
                                            <Users className="w-3 h-3 text-paper-500 group-hover/char:text-folia-700 transition-colors" />
                                            <span className="truncate max-w-[200px]">{ch.name}</span>
                                            <span className="text-[10px] text-paper-400 group-hover/char:text-folia-600 opacity-70">↗</span>
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Add Event Button at the end of the Era */}
                      <div className="pt-4 flex justify-start">
                        <button
                          onClick={() => handleOpenEventModal(era.id, 'new')}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-paper-150 hover:bg-paper-200 text-paper-700 text-xs font-medium border border-paper-300 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Aggiungi evento in {era.title}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL: ERA (Create / Edit) */}
      {/* ========================================================= */}
      {editingEra && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in folia-modal-overlay"
          onClick={() => setEditingEra(null)}
        >
          <div 
            className="bg-paper-50 rounded-2xl shadow-modal border border-paper-300 w-full max-w-xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-paper-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-folia-100 text-folia-800 rounded-xl">
                  <Calendar className="w-5 h-5 text-folia-800" />
                </div>
                <div>
                  <h3 className="font-brand font-bold text-lg text-paper-900">
                    {editingEra === 'new' ? 'Nuova era / epoca' : 'Modifica era'}
                  </h3>
                  <p className="text-xs text-paper-500">
                    Definisci un grande periodo storico o una fase cronologica
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingEra(null)}
                className="p-1 rounded-lg text-paper-400 hover:text-paper-700 hover:bg-paper-150 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEra} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-paper-800 mb-1">
                  Titolo dell'era <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={eraFormTitle}
                  onChange={(e) => setEraFormTitle(e.target.value)}
                  placeholder="Es. Prima Era, Età del Bronzo, Il Secolo di Pace, Guerra dei Tre Regni..."
                  className="w-full px-3.5 py-2 text-sm bg-white border border-paper-300 rounded-xl text-paper-900 placeholder:text-paper-400 placeholder:font-normal font-sans focus:outline-none focus:border-folia-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-paper-800 mb-1">
                  Arco temporale indicativo (opzionale)
                </label>
                <input
                  type="text"
                  value={eraFormTimeRange}
                  onChange={(e) => setEraFormTimeRange(e.target.value)}
                  placeholder="Es. Anni 1 - 1250, 300 a.C. - 0, Tre secoli prima del cataclisma..."
                  className="w-full px-3.5 py-2 text-sm bg-white border border-paper-300 rounded-xl text-paper-900 placeholder:text-paper-400 placeholder:font-normal font-sans focus:outline-none focus:border-folia-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-paper-800 mb-1">
                  Colore tematico dell'era
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(ERA_PALETTES).map(([key, pal]) => {
                    const isSelected = eraFormColor === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setEraFormColor(key)}
                        className={`flex items-center gap-2 px-2.5 py-2 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                          isSelected 
                            ? 'border-folia-600 bg-white shadow-2xs font-semibold text-paper-900' 
                            : 'border-paper-250 bg-paper-100 hover:bg-paper-150 text-paper-700'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full ${pal.bg} shrink-0`} />
                        <span className="flex-1 whitespace-nowrap">{pal.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-folia-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-paper-800">
                    Descrizione e note sull'epoca
                  </label>
                  <button
                    type="button"
                    onClick={() => setFocusTextData({
                      title: eraFormTitle || "Descrizione dell'era",
                      subtitle: "Appunti generali sull'epoca",
                      value: eraFormDesc,
                      onChange: (val) => setEraFormDesc(val),
                      placeholder: "Appunti generali sul clima politico, culturale, magico o sociale di quest'era..."
                    })}
                    title="Ingrandisci e scrivi a schermo intero"
                    className="p-1 rounded-lg text-paper-400 hover:text-folia-800 hover:bg-paper-200 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-medium"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Ingrandisci</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={eraFormDesc}
                  onChange={(e) => setEraFormDesc(e.target.value)}
                  placeholder="Appunti generali sul clima politico, culturale, magico o sociale di quest'era..."
                  className="w-full px-3.5 py-2 text-sm bg-white border border-paper-300 rounded-xl text-paper-900 placeholder:text-paper-400 placeholder:font-normal font-sans focus:outline-none focus:border-folia-500 resize-y min-h-[80px]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-paper-200">
                <button
                  type="button"
                  onClick={() => setEditingEra(null)}
                  className="px-4 py-2 rounded-xl bg-paper-200 hover:bg-paper-250 text-paper-800 text-xs font-semibold cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={!eraFormTitle.trim()}
                  className="px-5 py-2 rounded-xl bg-folia-700 hover:bg-folia-800 disabled:opacity-40 text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  {editingEra === 'new' ? 'Crea era' : 'Salva modifiche'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EVENT (Create / Edit) */}
      {/* ========================================================= */}
      {editingEvent && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in folia-modal-overlay"
          onClick={() => setEditingEvent(null)}
        >
          <div 
            className="bg-paper-50 rounded-2xl shadow-modal border border-paper-300 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-paper-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-folia-100 text-folia-800 rounded-xl">
                  <Milestone className="w-5 h-5 text-folia-800" />
                </div>
                <div>
                  <h3 className="font-brand font-bold text-lg text-paper-900">
                    {editingEvent.event === 'new' ? 'Nuovo evento temporale' : 'Modifica evento'}
                  </h3>
                  <p className="text-xs text-paper-500">
                    Registra un punto saliente della storia e collegalo ai capitoli
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingEvent(null)}
                className="p-1 rounded-lg text-paper-400 hover:text-paper-700 hover:bg-paper-150 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="p-6 overflow-y-auto space-y-4">
              {/* Era Selection with CustomSelect */}
              <div>
                <label className="block text-xs font-semibold text-paper-800 mb-1">
                  Era di appartenenza
                </label>
                <CustomSelect
                  value={eventFormEraId}
                  options={eraSelectOptions}
                  onChange={(val) => setEventFormEraId(val)}
                  className="w-full"
                />
              </div>

              {/* Date / Period and Importance with CustomSelect */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-paper-800 mb-1">
                    Data o periodo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={eventFormDate}
                    onChange={(e) => setEventFormDate(e.target.value)}
                    placeholder="Es. Primavera dell'anno 842, 10 anni prima..."
                    className="w-full px-3.5 py-2 text-sm bg-white border border-paper-300 rounded-xl text-paper-900 placeholder:text-paper-400 placeholder:font-normal font-sans focus:outline-none focus:border-folia-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-paper-800 mb-1">
                    Importanza narrativa
                  </label>
                  <CustomSelect
                    value={eventFormImportance}
                    options={importanceOptions}
                    onChange={(val) => setEventFormImportance(val as TimelineImportance)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-paper-800 mb-1">
                  Titolo dell'evento <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={eventFormTitle}
                  onChange={(e) => setEventFormTitle(e.target.value)}
                  placeholder="Es. L'incoronazione, La caduta di Valoria, Il ritrovamento..."
                  className="w-full px-3.5 py-2 text-sm bg-white border border-paper-300 rounded-xl text-paper-900 placeholder:text-paper-400 placeholder:font-normal font-sans focus:outline-none focus:border-folia-500"
                />
              </div>

              {/* Summary / Notes */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-paper-800">
                    Appunti, dettagli e conseguenze
                  </label>
                  <button
                    type="button"
                    onClick={() => setFocusTextData({
                      title: eventFormTitle || "Dettagli dell'evento",
                      subtitle: "Appunti, dettagli e conseguenze",
                      value: eventFormSummary,
                      onChange: (val) => setEventFormSummary(val),
                      placeholder: "Cosa accade in questo frangente? Quali conseguenze provoca nella storia o nei personaggi?"
                    })}
                    title="Ingrandisci e scrivi a schermo intero"
                    className="p-1 rounded-lg text-paper-400 hover:text-folia-800 hover:bg-paper-200 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-medium"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Ingrandisci</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={eventFormSummary}
                  onChange={(e) => setEventFormSummary(e.target.value)}
                  placeholder="Cosa accade in questo frangente? Quali conseguenze provoca nella storia o nei personaggi?"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-paper-300 rounded-xl text-paper-900 placeholder:text-paper-400 placeholder:font-normal font-sans focus:outline-none focus:border-folia-500 resize-y min-h-[90px]"
                />
              </div>

              {/* Link Chapters of the Manuscript */}
              <div>
                <label className="block text-xs font-semibold text-paper-800 mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-folia-700" />
                  <span>Capitoli del manoscritto collegati</span>
                </label>
                <p className="text-[11px] text-paper-500 mb-2 font-sans">
                  Seleziona i capitoli in cui questo evento viene narrato o menzionato:
                </p>

                {manuscript.length === 0 ? (
                  <p className="text-xs text-paper-400 italic bg-paper-100 p-2.5 rounded-xl border border-paper-250">
                    Nessun capitolo nel manoscritto.
                  </p>
                ) : (
                  <div className="max-h-32 overflow-y-auto flex flex-wrap gap-1.5 bg-paper-100 p-2.5 rounded-xl border border-paper-250">
                    {manuscript.map(doc => {
                      const isSelected = eventFormChapters.includes(doc.id);
                      return (
                        <button
                          key={doc.id}
                          type="button"
                          onClick={() => {
                            setEventFormChapters(prev => 
                              isSelected ? prev.filter(id => id !== doc.id) : [...prev, doc.id]
                            );
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected 
                              ? 'bg-folia-700 text-white shadow-2xs' 
                              : 'bg-white hover:bg-paper-200 text-paper-700 border border-paper-300'
                          }`}
                        >
                          <BookOpen className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-paper-400'}`} />
                          <span className="truncate max-w-[200px]">{doc.title || 'Senza titolo'}</span>
                          {isSelected && <Check className="w-3 h-3" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Link Characters */}
              {characters.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-paper-800 mb-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-paper-600" />
                    <span>Personaggi coinvolti</span>
                  </label>
                  <div className="max-h-28 overflow-y-auto flex flex-wrap gap-1.5 bg-paper-100 p-2.5 rounded-xl border border-paper-250">
                    {characters.map(ch => {
                      const isSelected = eventFormCharacters.includes(ch.id);
                      return (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => {
                            setEventFormCharacters(prev => 
                              isSelected ? prev.filter(id => id !== ch.id) : [...prev, ch.id]
                            );
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                            isSelected 
                              ? 'bg-folia-700 text-white shadow-2xs' 
                              : 'bg-white hover:bg-paper-200 text-paper-700 border border-paper-300'
                          }`}
                        >
                          <span>{ch.name}</span>
                          {isSelected && <Check className="w-3 h-3" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-3 border-t border-paper-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 rounded-xl bg-paper-200 hover:bg-paper-250 text-paper-800 text-xs font-semibold cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={!eventFormTitle.trim()}
                  className="px-5 py-2 rounded-xl bg-folia-700 hover:bg-folia-800 disabled:opacity-40 text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  {editingEvent.event === 'new' ? 'Aggiungi evento' : 'Salva evento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Era Confirm Modal */}
      {deletingEra && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setDeletingEra(null)}
          onConfirm={handleConfirmDeleteEra}
          title={`Eliminare l'era «${deletingEra.title}»?`}
          subtitle="Questa operazione rimuoverà anche tutti gli eventi contenuti in quest'era."
          message={
            <span>
              Sei sicuro di voler rimuovere <strong>{deletingEra.title}</strong> e i suoi <strong>{deletingEra.events?.length || 0} eventi</strong>? L'operazione è irreversibile.
            </span>
          }
          confirmLabel="Elimina era"
          cancelLabel="Annulla"
          variant="danger"
        />
      )}

      {/* Delete Event Confirm Modal */}
      {deletingEvent && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setDeletingEvent(null)}
          onConfirm={handleConfirmDeleteEvent}
          title={`Eliminare l'evento «${deletingEvent.event.title}»?`}
          message={
            <span>
              Sei sicuro di voler rimuovere questo evento dalla cronologia? I capitoli e i testi del manoscritto non subiranno alcuna modifica.
            </span>
          }
          confirmLabel="Elimina evento"
          cancelLabel="Annulla"
          variant="danger"
        />
      )}

      {/* Focus Text Modal for full-screen writing */}
      {focusTextData && (
        <FocusTextModal
          isOpen={!!focusTextData}
          onClose={() => setFocusTextData(null)}
          title={focusTextData.title}
          subtitle={focusTextData.subtitle}
          icon={<Milestone className="w-5 h-5 text-folia-800" />}
          value={focusTextData.value}
          onChange={(val) => {
            focusTextData.onChange(val);
            setFocusTextData(prev => prev ? { ...prev, value: val } : null);
          }}
          placeholder={focusTextData.placeholder}
        />
      )}
    </div>
  );
};
