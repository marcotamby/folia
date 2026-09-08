import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  Globe, 
  GitBranch, 
  LayoutGrid, 
  Lightbulb, 
  FolderOpen, 
  Trash2, 
  Plus, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Edit3, 
  Trash, 
  Settings,
  PanelLeftClose,
  PanelLeft,
  FileText,
  Clock,
  Target,
  Layers,
  StickyNote,
  Pencil,
  Check,
  Award,
  GraduationCap,
  Mail,
  Compass,
  GripVertical,
  Radio
} from 'lucide-react';
import { Project, ViewMode, ManuscriptItem, Character, WorldEntry, CharacterRole } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';

interface SidebarProps {
  project: Project;
  activeView: ViewMode;
  selectedDocId: string | null;
  selectedCharId: string | null;
  selectedWorldId: string | null;
  selectedMapId?: string | null;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSelectView: (view: ViewMode) => void;
  onSelectDoc: (id: string) => void;
  onSelectChar: (id: string) => void;
  onSelectWorld: (id: string) => void;
  onSelectMap?: (id: string) => void;
  onAddChapter: () => void;
  onAddCharacter: () => void;
  onAddWorldEntry: () => void;
  onAddMap?: () => void;
  onDeleteDoc: (id: string) => void;
  onDeleteChar: (id: string) => void;
  onDeleteWorld: (id: string) => void;
  onDeleteMap?: (id: string) => void;
  onReorderManuscript?: (newManuscript: ManuscriptItem[]) => void;
  onReorderCharacters?: (newCharacters: Character[]) => void;
  onReorderWorld?: (newWorld: WorldEntry[]) => void;
  onUpdateCharacterRole?: (charId: string, newRole: CharacterRole) => void;
  onUpdateDailyGoal: (goal: number) => void;
  onUpdateProjectTitle: (newTitle: string) => void;
  onOpenProjectsModal: () => void;
  t: (key: string) => string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  project,
  activeView,
  selectedDocId,
  selectedCharId,
  selectedWorldId,
  selectedMapId,
  isCollapsed,
  onToggleCollapse,
  onSelectView,
  onSelectDoc,
  onSelectChar,
  onSelectWorld,
  onSelectMap,
  onAddChapter,
  onAddCharacter,
  onAddWorldEntry,
  onAddMap,
  onDeleteDoc,
  onDeleteChar,
  onDeleteWorld,
  onDeleteMap,
  onReorderManuscript,
  onReorderCharacters,
  onReorderWorld,
  onUpdateCharacterRole,
  onUpdateDailyGoal,
  onUpdateProjectTitle,
  onOpenProjectsModal,
  t
}) => {
  const [manuscriptExpanded, setManuscriptExpanded] = useState(true);
  const [charactersExpanded, setCharactersExpanded] = useState(true);
  const [worldExpanded, setWorldExpanded] = useState(true);
  const [mapsExpanded, setMapsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Distinctive dot styling exclusively for protagonists & antagonists
  const getCharacterDotClass = (role?: CharacterRole) => {
    if (role === 'protagonist') {
      return 'bg-[#0284c7] ring-1 ring-[#0369a1]/35'; // Tono Folia tendente al blu elegante
    }
    if (role === 'antagonist') {
      return 'bg-[#a21caf] ring-1 ring-[#86198f]/35'; // Tono viola/magenta elegante
    }
    return 'bg-emerald-500 ring-1 ring-emerald-600/20'; // Standard verde Folia per tutti gli altri ruoli
  };
  
  // Role group collapse states for Character Submenus
  const [roleGroupExpanded, setRoleGroupExpanded] = useState<Record<string, boolean>>({
    protagonist: true,
    antagonist: true,
    deuteragonist: true,
    rival: true,
    mentor: true,
    sidekick: true,
    love_interest: true,
    traitor: true,
    herald: true,
    guardian: true,
    supporting: true
  });

  // Project title inline editing state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(project.title || 'Nuovo progetto');

  // Daily goal inline editing state
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(project.settings?.dailyWordGoal?.toString() || '1000');

  // Premium delete confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'doc' | 'char' | 'world' | 'map';
    id: string;
    title: string;
  } | null>(null);

  // Drag & Drop state: Manuscript
  const [draggedDocId, setDraggedDocId] = useState<string | null>(null);
  const [docDropIndicator, setDocDropIndicator] = useState<{ targetId: string; position: 'before' | 'after' } | null>(null);

  // Drag & Drop state: Characters
  const [draggedCharId, setDraggedCharId] = useState<string | null>(null);
  const [charDropIndicator, setCharDropIndicator] = useState<{ targetId: string; position: 'before' | 'after' } | null>(null);
  const [hoveredRoleGroup, setHoveredRoleGroup] = useState<CharacterRole | null>(null);

  // Drag & Drop state: Worldbuilding
  const [draggedWorldId, setDraggedWorldId] = useState<string | null>(null);
  const [worldDropIndicator, setWorldDropIndicator] = useState<{ targetId: string; position: 'before' | 'after' } | null>(null);

  // Stable set of active role categories so DOM elements never shift during drag gestures
  const [activeRoles, setActiveRoles] = useState<Set<CharacterRole>>(() => {
    const initial = new Set<CharacterRole>(['protagonist']);
    (project.characters || []).forEach(c => {
      if (c.role) initial.add(c.role);
    });
    return initial;
  });

  useEffect(() => {
    setActiveRoles(prev => {
      const next = new Set(prev);
      next.add('protagonist');
      (project.characters || []).forEach(c => {
        if (c.role) next.add(c.role);
      });
      return next;
    });
  }, [project.characters]);

  const toggleRoleGroup = (role: string) => {
    setRoleGroupExpanded(prev => ({
      ...prev,
      [role]: !prev[role]
    }));
  };

  const handleSaveTitle = () => {
    const trimmed = tempTitle.trim();
    if (trimmed && trimmed !== project.title) {
      onUpdateProjectTitle(trimmed);
    } else {
      setTempTitle(project.title || 'Nuovo progetto');
    }
    setIsEditingTitle(false);
  };

  const handleSaveGoal = () => {
    const num = parseInt(tempGoal, 10);
    if (!isNaN(num) && num > 0) {
      onUpdateDailyGoal(num);
    } else {
      setTempGoal(project.settings?.dailyWordGoal?.toString() || '1000');
    }
    setIsEditingGoal(false);
  };

  if (isCollapsed) {
    return (
      <aside className="w-12 border-r border-paper-200 bg-paper-100 flex flex-col items-center py-3 select-none shrink-0 transition-all duration-300 z-20">
        <button
          onClick={onToggleCollapse}
          title={t('sidebar.expand_sidebar')}
          className="p-2 rounded-lg text-paper-500 hover:bg-paper-200 hover:text-paper-900 transition-colors cursor-pointer mb-4"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <div className="space-y-3 flex flex-col items-center flex-1">
          <button
            onClick={() => onSelectView('editor')}
            title={t('sections.manuscript')}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              activeView === 'editor' ? 'bg-folia-100 text-folia-800' : 'text-paper-600 hover:bg-paper-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSelectView('characters')}
            title={t('sections.characters')}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              activeView === 'characters' ? 'bg-folia-100 text-folia-800' : 'text-paper-600 hover:bg-paper-200'
            }`}
          >
            <Users className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSelectView('world')}
            title={t('sections.world')}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              activeView === 'world' ? 'bg-folia-100 text-folia-800' : 'text-paper-600 hover:bg-paper-200'
            }`}
          >
            <Globe className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSelectView('maps')}
            title="Mappe"
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              activeView === 'maps' ? 'bg-folia-100 text-folia-800' : 'text-paper-600 hover:bg-paper-200'
            }`}
          >
            <Compass className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSelectView('corkboard')}
            title={t('sections.corkboard')}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              activeView === 'corkboard' ? 'bg-folia-100 text-folia-800' : 'text-paper-600 hover:bg-paper-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSelectView('plot')}
            title={t('sections.plot')}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              activeView === 'plot' ? 'bg-folia-100 text-folia-800' : 'text-paper-600 hover:bg-paper-200'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSelectView('ideas')}
            title={t('sections.ideas')}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              activeView === 'ideas' ? 'bg-folia-100 text-folia-800' : 'text-paper-600 hover:bg-paper-200'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSelectView('notes')}
            title={t('sections.notes')}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              activeView === 'notes' ? 'bg-folia-100 text-folia-800' : 'text-paper-600 hover:bg-paper-200'
            }`}
          >
            <StickyNote className="w-4 h-4" />
          </button>
        </div>
      </aside>
    );
  }

  // Filtered lists based on search query
  const manuscriptList = project.manuscript || [];
  const charactersList = project.characters || [];
  const worldList = project.worldbuilding || [];

  const filteredManuscript = manuscriptList.filter(d => 
    (d.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCharacters = charactersList.filter(c => 
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.alias || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredWorld = worldList.filter(w => 
    (w.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDropDoc = (targetId: string, position: 'before' | 'after') => {
    if (!draggedDocId || draggedDocId === targetId) {
      setDraggedDocId(null);
      setDocDropIndicator(null);
      return;
    }

    const currentList = [...manuscriptList];
    const draggedIndex = currentList.findIndex(d => d.id === draggedDocId);
    if (draggedIndex === -1) return;

    const [draggedItem] = currentList.splice(draggedIndex, 1);
    const targetIndex = currentList.findIndex(d => d.id === targetId);
    if (targetIndex === -1) return;

    const insertIndex = position === 'after' ? targetIndex + 1 : targetIndex;
    currentList.splice(insertIndex, 0, draggedItem);

    onReorderManuscript?.(currentList);
    setDraggedDocId(null);
    setDocDropIndicator(null);
  };

  const handleDropCharOnChar = (targetId: string, position: 'before' | 'after', targetRole: CharacterRole, charIdToMove?: string) => {
    const id = charIdToMove || draggedCharId;
    if (!id || id === targetId) {
      setDraggedCharId(null);
      setCharDropIndicator(null);
      setHoveredRoleGroup(null);
      return;
    }

    const currentList = [...charactersList];
    const draggedIndex = currentList.findIndex(c => c.id === id);
    if (draggedIndex === -1) return;

    const draggedItem = { ...currentList[draggedIndex], role: targetRole };
    currentList.splice(draggedIndex, 1);

    const targetIndex = currentList.findIndex(c => c.id === targetId);
    const insertIndex = targetIndex === -1 
      ? currentList.length 
      : (position === 'after' ? targetIndex + 1 : targetIndex);

    currentList.splice(insertIndex, 0, draggedItem);

    onReorderCharacters?.(currentList);
    setRoleGroupExpanded(prev => ({ ...prev, [targetRole]: true }));
    setDraggedCharId(null);
    setCharDropIndicator(null);
    setHoveredRoleGroup(null);
  };

  const handleDropCharOnGroup = (newRole: CharacterRole, charIdToMove?: string) => {
    const id = charIdToMove || draggedCharId;
    if (!id) return;

    const currentList = [...charactersList];
    const draggedIndex = currentList.findIndex(c => c.id === id);
    if (draggedIndex === -1) return;

    const updatedChar = { ...currentList[draggedIndex], role: newRole };
    currentList.splice(draggedIndex, 1);
    currentList.push(updatedChar);

    onReorderCharacters?.(currentList);
    setRoleGroupExpanded(prev => ({ ...prev, [newRole]: true }));
    setDraggedCharId(null);
    setCharDropIndicator(null);
    setHoveredRoleGroup(null);
  };

  const handleDropWorld = (targetId: string, position: 'before' | 'after') => {
    if (!draggedWorldId || draggedWorldId === targetId) {
      setDraggedWorldId(null);
      setWorldDropIndicator(null);
      return;
    }

    const currentList = [...worldList];
    const draggedIndex = currentList.findIndex(w => w.id === draggedWorldId);
    if (draggedIndex === -1) return;

    const [draggedItem] = currentList.splice(draggedIndex, 1);
    const targetIndex = currentList.findIndex(w => w.id === targetId);
    if (targetIndex === -1) return;

    const insertIndex = position === 'after' ? targetIndex + 1 : targetIndex;
    currentList.splice(insertIndex, 0, draggedItem);

    onReorderWorld?.(currentList);
    setDraggedWorldId(null);
    setWorldDropIndicator(null);
  };

  const projectType = project.settings?.projectType || 'novel';
  const isTtrpg = projectType === 'ttrpg_master';
  const isThesis = projectType === 'academic_thesis';
  const isLetter = projectType === 'letter';

  const manuscriptSectionLabel = 
    isTtrpg ? 'Campagna & sessioni' :
    isThesis ? 'Tesi & capitoli' :
    isLetter ? 'Testo lettera' :
    t('sections.manuscript');

  const addChapterTitle = 
    isTtrpg ? 'Aggiungi sessione' :
    isThesis ? 'Aggiungi capitolo / sezione' :
    isLetter ? 'Aggiungi bozza lettera' :
    t('sidebar.add_chapter');

  const emptyManuscriptText = 
    isTtrpg ? 'Nessuna sessione presente' :
    isThesis ? 'Nessun capitolo presente' :
    isLetter ? 'Nessuna bozza presente' :
    'Nessun capitolo presente';

  const defaultDocTitle = 
    isTtrpg ? 'Nuova sessione' :
    isThesis ? 'Nuovo capitolo' :
    isLetter ? 'Nuova lettera' :
    t('sidebar.untitled_doc');

  const corkboardSectionLabel = 
    isTtrpg ? 'Bacheca scene & incontri' :
    isThesis ? 'Scaletta argomenti & tesi' :
    isLetter ? 'Bozze & versioni' :
    t('sections.corkboard');

  const plotSectionLabel = 
    isTtrpg ? 'Arco campagna & quest' :
    t('sections.plot');

  const ideasSectionLabel = 
    isTtrpg ? 'Loot, tesori & spunti' :
    isThesis ? 'Spunti & dubbi relatore' :
    isLetter ? 'Appunti veloci & idee' :
    t('sections.ideas');

  const notesSectionLabel = 
    isTtrpg ? 'Appunti master & regole' :
    isThesis ? 'Fonti, bibliografia & metodologia' :
    isLetter ? 'Destinatario & allegati' :
    t('sections.notes');

  // Group characters by Role for Submenus
  const charGroups: { key: CharacterRole; label: string; color: string; items: Character[] }[] = [
    {
      key: 'protagonist',
      label: isTtrpg ? 'Party (PG / Eroi)' : 'Protagonisti',
      color: 'text-sky-700 bg-sky-50',
      items: filteredCharacters.filter(c => c.role === 'protagonist')
    },
    {
      key: 'antagonist',
      label: isTtrpg ? 'Antagonisti & boss' : 'Antagonisti',
      color: 'text-fuchsia-700 bg-fuchsia-50',
      items: filteredCharacters.filter(c => c.role === 'antagonist')
    },
    {
      key: 'deuteragonist',
      label: isTtrpg ? 'Co-protagonisti & PNG chiave' : 'Deuteragonisti & co-protagonisti',
      color: 'text-indigo-700 bg-indigo-50',
      items: filteredCharacters.filter(c => c.role === 'deuteragonist')
    },
    {
      key: 'rival',
      label: isTtrpg ? 'Rivali & competitori' : 'Rivali',
      color: 'text-amber-700 bg-amber-50',
      items: filteredCharacters.filter(c => c.role === 'rival')
    },
    {
      key: 'mentor',
      label: isTtrpg ? 'Mentori & PNG guida' : 'Mentori & guide',
      color: 'text-blue-700 bg-blue-50',
      items: filteredCharacters.filter(c => c.role === 'mentor')
    },
    {
      key: 'sidekick',
      label: isTtrpg ? 'Alleati & compagni' : 'Spalle & alleati',
      color: 'text-emerald-700 bg-emerald-50',
      items: filteredCharacters.filter(c => c.role === 'sidekick')
    },
    {
      key: 'love_interest',
      label: isTtrpg ? 'Interessi & legami' : 'Interessi amorosi',
      color: 'text-pink-700 bg-pink-50',
      items: filteredCharacters.filter(c => c.role === 'love_interest')
    },
    {
      key: 'traitor',
      label: isTtrpg ? 'Infiltrati & doppiogiochisti' : 'Traditori & falsi alleati',
      color: 'text-purple-700 bg-purple-50',
      items: filteredCharacters.filter(c => c.role === 'traitor')
    },
    {
      key: 'herald',
      label: isTtrpg ? 'Araldi & mandanti quest' : 'Araldi & messaggeri',
      color: 'text-yellow-700 bg-yellow-50',
      items: filteredCharacters.filter(c => c.role === 'herald')
    },
    {
      key: 'guardian',
      label: isTtrpg ? 'Guardiani & ostacoli' : 'Guardiani & ostacoli',
      color: 'text-stone-700 bg-stone-50',
      items: filteredCharacters.filter(c => c.role === 'guardian')
    },
    {
      key: 'supporting',
      label: isTtrpg ? 'Comparse & PNG secondari' : 'Secondari & comparse',
      color: 'text-paper-600 bg-paper-150',
      items: filteredCharacters.filter(c => c.role === 'supporting' || !c.role)
    }
  ];

  // Daily word goal tracking calculation
  const totalWords = manuscriptList.reduce((acc, doc) => acc + (doc.wordCount || 0), 0);
  const wordsToday = Math.max(0, totalWords - (project.settings?.dailyWordsStart || 0));
  const dailyGoal = project.settings?.dailyWordGoal || 1000;
  const progressPercent = Math.min(100, Math.round((wordsToday / dailyGoal) * 100));
  const isGoalReached = wordsToday >= dailyGoal;

  return (
    <aside className="w-72 border-r border-paper-200 bg-paper-100 flex flex-col h-full select-none shrink-0 transition-all duration-300 z-20">
      {/* Top Sidebar Header & Search */}
      <div className="p-3.5 border-b border-paper-200 space-y-2.5">
        <div className="flex items-center justify-between gap-1">
          {/* Editable Project Title with Switcher icon */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <button
              onClick={onOpenProjectsModal}
              title="Gestisci o cambia progetto"
              className="p-1 rounded-lg text-folia-800 hover:bg-folia-100 hover:text-folia-950 transition-colors shrink-0 cursor-pointer"
            >
              <FolderOpen className="w-4 h-4" />
            </button>

            {isEditingTitle ? (
              <div className="flex items-center gap-1 flex-1">
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTitle();
                    if (e.key === 'Escape') {
                      setTempTitle(project.title || 'Nuovo progetto');
                      setIsEditingTitle(false);
                    }
                  }}
                  className="w-full text-[15px] font-brand font-semibold text-paper-900 bg-white border border-folia-600 rounded px-1.5 py-0.5 focus:outline-hidden"
                  autoFocus
                />
                <button
                  onClick={handleSaveTitle}
                  className="p-1 rounded bg-folia-700 text-white hover:bg-folia-800 cursor-pointer"
                  title="Salva titolo"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div 
                className="flex items-center gap-1.5 flex-1 min-w-0 group cursor-pointer"
                onClick={() => {
                  setTempTitle(project.title || 'Nuovo progetto');
                  setIsEditingTitle(true);
                }}
                title="Fai clic per rinominare il progetto"
              >
                <span className="font-brand font-semibold text-[15px] tracking-tight text-paper-900 truncate">
                  {project.title || 'Nuovo progetto'}
                </span>
                <Pencil className="w-3 h-3 text-paper-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            title={t('sidebar.collapse_sidebar')}
            className="p-1.5 rounded-lg text-paper-400 hover:bg-paper-200 hover:text-paper-800 transition-colors cursor-pointer shrink-0"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-paper-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('app.search')}
            className="w-full pl-8 pr-3 py-1.5 bg-paper-50 border border-paper-250 rounded-lg text-xs text-paper-800 placeholder-paper-400 focus:outline-hidden focus:border-folia-600 focus:ring-1 focus:ring-folia-600 shadow-2xs font-sans"
          />
        </div>
      </div>

      {/* Navigation Tree */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-3 text-[13.5px]">
        {/* 1. MANUSCRIPT SECTION */}
        <div>
          <div 
            onClick={() => {
              setManuscriptExpanded(!manuscriptExpanded);
              onSelectView('editor');
            }}
            className={`flex items-center justify-between px-2.5 py-2 rounded-xl cursor-pointer font-semibold transition-colors group ${
              activeView === 'editor' && !selectedDocId ? 'bg-folia-100 text-folia-900' : 'hover:bg-paper-200 text-paper-800'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {manuscriptExpanded ? <ChevronDown className="w-4 h-4 text-paper-400" /> : <ChevronRight className="w-4 h-4 text-paper-400" />}
              {isThesis ? (
                <GraduationCap className="w-4 h-4 text-blue-700" />
              ) : isLetter ? (
                <Mail className="w-4 h-4 text-purple-700" />
              ) : (
                <BookOpen className="w-4 h-4 text-folia-700" />
              )}
              <span className="truncate">{manuscriptSectionLabel}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddChapter();
              }}
              title={addChapterTitle}
              className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-paper-300 text-paper-600 transition-opacity cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {manuscriptExpanded && (
            <div className="pl-4 pr-1 py-1 space-y-0.5">
              {filteredManuscript.length === 0 ? (
                <p className="text-xs text-paper-400 italic px-2 py-1">{emptyManuscriptText}</p>
              ) : (
                filteredManuscript.map((doc) => (
                  <div
                    key={doc.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', doc.id);
                      e.dataTransfer.effectAllowed = 'move';
                      setDraggedDocId(doc.id);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!draggedDocId || draggedDocId === doc.id) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const midY = rect.top + rect.height / 2;
                      const position = e.clientY < midY ? 'before' : 'after';
                      setDocDropIndicator({ targetId: doc.id, position });
                    }}
                    onDragLeave={() => {
                      if (docDropIndicator?.targetId === doc.id) {
                        setDocDropIndicator(null);
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (docDropIndicator && docDropIndicator.targetId === doc.id) {
                        handleDropDoc(doc.id, docDropIndicator.position);
                      }
                    }}
                    onDragEnd={() => {
                      setDraggedDocId(null);
                      setDocDropIndicator(null);
                    }}
                    onClick={() => {
                      onSelectView('editor');
                      onSelectDoc(doc.id);
                      if (activeView === 'editor' && selectedDocId === doc.id) {
                        window.dispatchEvent(new CustomEvent('folia-scroll-editor-top'));
                      }
                    }}
                    className={`relative flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-grab active:cursor-grabbing transition-all select-none group ${
                      activeView === 'editor' && selectedDocId === doc.id
                        ? 'bg-folia-100/90 text-folia-950 font-medium'
                        : 'hover:bg-paper-200 text-paper-700'
                    } ${draggedDocId === doc.id ? 'opacity-35 scale-[0.98]' : ''}`}
                  >
                    {/* Visual Drop Indicator */}
                    {docDropIndicator?.targetId === doc.id && (
                      <div
                        className={`absolute left-0 right-0 h-0.5 bg-folia-600 z-30 pointer-events-none rounded-full shadow-xs ${
                          docDropIndicator.position === 'before' ? '-top-0.5' : '-bottom-0.5'
                        }`}
                      />
                    )}

                    <div className="flex items-center gap-1.5 min-w-0">
                      <GripVertical className="w-3 h-3 text-paper-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 -ml-1" />
                      <FileText className="w-3.5 h-3.5 text-paper-400 group-hover:text-folia-700 shrink-0" />
                      <span className="truncate text-[13px]">{doc.title || defaultDocTitle}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget({
                          type: 'doc',
                          id: doc.id,
                          title: doc.title || defaultDocTitle
                        });
                      }}
                      title={t('sidebar.delete_item')}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded text-paper-400 hover:text-red-600 hover:bg-paper-300 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 2. CHARACTERS SECTION WITH SUBMENUS (Only for Novel and TTRPG) */}
        {!isThesis && !isLetter && (
          <div>
            <div 
              onClick={() => {
                setCharactersExpanded(!charactersExpanded);
                onSelectView('characters');
              }}
              className={`flex items-center justify-between px-2.5 py-2 rounded-xl cursor-pointer font-semibold transition-colors group ${
                activeView === 'characters' && !selectedCharId ? 'bg-folia-100 text-folia-900' : 'hover:bg-paper-200 text-paper-800'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                {charactersExpanded ? <ChevronDown className="w-4 h-4 text-paper-400" /> : <ChevronRight className="w-4 h-4 text-paper-400" />}
                <Users className="w-4 h-4 text-emerald-600" />
                <span className="truncate">{isTtrpg ? 'Personaggi & party' : t('sections.characters')}</span>
                <span className="text-[11px] text-paper-400 font-normal">({charactersList.length})</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddCharacter();
                }}
                title={isTtrpg ? 'Aggiungi PG o NPC' : t('sidebar.add_character')}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-paper-300 text-paper-600 transition-opacity cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {charactersExpanded && (
              <div className="pl-3 pr-1 py-1 space-y-2">
                {charactersList.length === 0 ? (
                  <p className="text-xs text-paper-400 italic px-2 py-1">{isTtrpg ? 'Nessun PG o NPC creato' : 'Nessun personaggio creato'}</p>
                ) : (
                  charGroups.map(group => {
                    // Stable check: only show categories in activeRoles (layout NEVER shifts during drag)
                    if (!activeRoles.has(group.key)) return null;

                    const hasItems = group.items.length > 0;
                    const isGrpExpanded = roleGroupExpanded[group.key] ?? true;

                    return (
                      <div key={group.key} className="space-y-0.5">
                        {/* Submenu Header (drop target for moving character to this category) */}
                        <div 
                          onClick={() => toggleRoleGroup(group.key)}
                          onDragOver={(e) => {
                            if (draggedCharId) {
                              e.preventDefault();
                              e.stopPropagation();
                              e.dataTransfer.dropEffect = 'move';
                              setHoveredRoleGroup(group.key);
                            }
                          }}
                          onDragLeave={() => {
                            if (hoveredRoleGroup === group.key) {
                              setHoveredRoleGroup(null);
                            }
                          }}
                          onDrop={(e) => {
                            if (draggedCharId) {
                              e.preventDefault();
                              e.stopPropagation();
                              const charId = draggedCharId || e.dataTransfer.getData('text/plain');
                              if (charId) {
                                handleDropCharOnGroup(group.key, charId);
                              }
                            }
                          }}
                          className={`flex items-center justify-between px-2.5 py-1 rounded-lg text-[12px] font-bold cursor-pointer select-none transition-all ${
                            hoveredRoleGroup === group.key 
                              ? 'bg-folia-100/90 text-folia-950 ring-2 ring-folia-500 shadow-xs' 
                              : 'text-paper-700 hover:bg-paper-200'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            {isGrpExpanded ? <ChevronDown className="w-3.5 h-3.5 text-paper-400" /> : <ChevronRight className="w-3.5 h-3.5 text-paper-400" />}
                            <span>{group.label}</span>
                          </div>
                          <span className="text-[10px] text-paper-400 font-normal">({group.items.length})</span>
                        </div>

                        {/* If category is empty and expanded, show a stable dropzone */}
                        {isGrpExpanded && !hasItems && (
                          <div
                            onDragOver={(e) => {
                              if (draggedCharId) {
                                e.preventDefault();
                                e.stopPropagation();
                                e.dataTransfer.dropEffect = 'move';
                                setHoveredRoleGroup(group.key);
                              }
                            }}
                            onDragLeave={() => {
                              if (hoveredRoleGroup === group.key) setHoveredRoleGroup(null);
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const charId = draggedCharId || e.dataTransfer.getData('text/plain');
                              if (charId) {
                                handleDropCharOnGroup(group.key, charId);
                              }
                            }}
                            className={`ml-4 mr-1 my-1 py-1.5 px-2 rounded-lg border border-dashed text-center text-xs transition-all select-none ${
                              hoveredRoleGroup === group.key
                                ? 'border-folia-600 bg-folia-50 text-folia-800 ring-2 ring-folia-400'
                                : 'border-paper-250 text-paper-400 hover:border-folia-500 hover:text-folia-700'
                            }`}
                          >
                            {draggedCharId ? `+ Rilascia per assegnare a ${group.label}` : 'Nessun personaggio'}
                          </div>
                        )}

                        {/* Submenu Character Cards */}
                        {isGrpExpanded && hasItems && (
                          <div className="pl-3 space-y-0.5">
                            {group.items.map((char) => (
                              <div
                                key={char.id}
                                draggable
                                onDragStart={(e) => {
                                  e.dataTransfer.setData('text/plain', char.id);
                                  e.dataTransfer.effectAllowed = 'move';
                                  setDraggedCharId(char.id);
                                }}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (!draggedCharId || draggedCharId === char.id) return;
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  const midY = rect.top + rect.height / 2;
                                  const position = e.clientY < midY ? 'before' : 'after';
                                  setCharDropIndicator({ targetId: char.id, position });
                                }}
                                onDragLeave={() => {
                                  if (charDropIndicator?.targetId === char.id) {
                                    setCharDropIndicator(null);
                                  }
                                }}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const charId = draggedCharId || e.dataTransfer.getData('text/plain');
                                  if (charDropIndicator && charDropIndicator.targetId === char.id && charId) {
                                    handleDropCharOnChar(char.id, charDropIndicator.position, group.key, charId);
                                  }
                                }}
                                onDragEnd={() => {
                                  setDraggedCharId(null);
                                  setCharDropIndicator(null);
                                  setHoveredRoleGroup(null);
                                }}
                                onClick={() => {
                                  onSelectView('characters');
                                  onSelectChar(char.id);
                                }}
                                className={`relative flex items-center justify-between px-2.5 py-1 rounded-lg cursor-grab active:cursor-grabbing transition-all select-none group ${
                                  activeView === 'characters' && selectedCharId === char.id
                                    ? 'bg-folia-100/90 text-folia-950 font-medium'
                                    : 'hover:bg-paper-200 text-paper-700'
                                } ${draggedCharId === char.id ? 'opacity-35 scale-[0.98]' : ''}`}
                              >
                                {/* Drop indicator line */}
                                {charDropIndicator?.targetId === char.id && (
                                  <div
                                    className={`absolute left-0 right-0 h-0.5 bg-folia-600 z-30 pointer-events-none rounded-full shadow-xs ${
                                      charDropIndicator.position === 'before' ? '-top-0.5' : '-bottom-0.5'
                                    }`}
                                  />
                                )}

                                <div className="flex items-center gap-1.5 min-w-0">
                                  <GripVertical className="w-3 h-3 text-paper-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 -ml-1" />
                                  <div className={`w-2 h-2 rounded-full shrink-0 ${getCharacterDotClass(char.role)}`} />
                                  <span className="truncate text-[13px]">{char.name || (isTtrpg ? 'Nuovo PG / NPC' : t('sidebar.untitled_character'))}</span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteTarget({
                                      type: 'char',
                                      id: char.id,
                                      title: char.name || (isTtrpg ? 'Nuovo PG / NPC' : t('sidebar.untitled_character'))
                                    });
                                  }}
                                  title={t('sidebar.delete_item')}
                                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-paper-400 hover:text-red-600 hover:bg-paper-300 transition-all cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

        {/* 3. WORLD BUILDING SECTION (Only for Novel and TTRPG) */}
        {!isThesis && !isLetter && (
          <div>
            <div 
              onClick={() => {
                setWorldExpanded(!worldExpanded);
                onSelectView('world');
              }}
              className={`flex items-center justify-between px-2.5 py-2 rounded-xl cursor-pointer font-semibold transition-colors group ${
                activeView === 'world' && !selectedWorldId ? 'bg-folia-100 text-folia-900' : 'hover:bg-paper-200 text-paper-800'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                {worldExpanded ? <ChevronDown className="w-4 h-4 text-paper-400" /> : <ChevronRight className="w-4 h-4 text-paper-400" />}
                <Globe className="w-4 h-4 text-folia-700" />
                <span className="truncate">{isTtrpg ? 'Mondo & luoghi' : t('sections.world')}</span>
                <span className="text-[11px] text-paper-400 font-normal">({worldList.length})</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddWorldEntry();
                }}
                title={isTtrpg ? 'Aggiungi luogo o dungeon' : t('sidebar.add_location')}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-paper-300 text-paper-600 transition-opacity cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {worldExpanded && (
              <div className="pl-4 pr-1 py-1 space-y-0.5">
                {filteredWorld.length === 0 ? (
                  <p className="text-xs text-paper-400 italic px-2 py-1">{isTtrpg ? 'Nessun luogo o dungeon presente' : 'Nessun luogo o voce presente'}</p>
                ) : (
                  filteredWorld.map((world) => (
                    <div
                      key={world.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', world.id);
                        e.dataTransfer.effectAllowed = 'move';
                        setDraggedWorldId(world.id);
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!draggedWorldId || draggedWorldId === world.id) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const midY = rect.top + rect.height / 2;
                        const position = e.clientY < midY ? 'before' : 'after';
                        setWorldDropIndicator({ targetId: world.id, position });
                      }}
                      onDragLeave={() => {
                        if (worldDropIndicator?.targetId === world.id) {
                          setWorldDropIndicator(null);
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (worldDropIndicator && worldDropIndicator.targetId === world.id) {
                          handleDropWorld(world.id, worldDropIndicator.position);
                        }
                      }}
                      onDragEnd={() => {
                        setDraggedWorldId(null);
                        setWorldDropIndicator(null);
                      }}
                      onClick={() => {
                        onSelectView('world');
                        onSelectWorld(world.id);
                      }}
                      className={`relative flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-grab active:cursor-grabbing transition-all select-none group ${
                        activeView === 'world' && selectedWorldId === world.id
                          ? 'bg-folia-100/90 text-folia-950 font-medium'
                          : 'hover:bg-paper-200 text-paper-700'
                      } ${draggedWorldId === world.id ? 'opacity-35 scale-[0.98]' : ''}`}
                    >
                      {/* Visual Drop Indicator */}
                      {worldDropIndicator?.targetId === world.id && (
                        <div
                          className={`absolute left-0 right-0 h-0.5 bg-folia-600 z-30 pointer-events-none rounded-full shadow-xs ${
                            worldDropIndicator.position === 'before' ? '-top-0.5' : '-bottom-0.5'
                          }`}
                        />
                      )}

                      <div className="flex items-center gap-1.5 min-w-0">
                        <GripVertical className="w-3 h-3 text-paper-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 -ml-1" />
                        <div className="w-2 h-2 rounded-full bg-folia-800 ring-1 ring-folia-900/20 shrink-0" />
                        <span className="truncate text-[13px]">{world.name || (isTtrpg ? 'Nuovo luogo / dungeon' : t('sidebar.untitled_location'))}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget({
                            type: 'world',
                            id: world.id,
                            title: world.name || (isTtrpg ? 'Nuovo luogo / dungeon' : t('sidebar.untitled_location'))
                          });
                        }}
                        title={t('sidebar.delete_item')}
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-paper-400 hover:text-red-600 hover:bg-paper-300 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* 3b. MAPS SECTION (Only for Novel and TTRPG) */}
        {!isThesis && !isLetter && (
          <div>
            <div 
              onClick={() => {
                setMapsExpanded(!mapsExpanded);
                onSelectView('maps');
              }}
              className={`flex items-center justify-between px-2.5 py-2 rounded-xl cursor-pointer font-semibold transition-colors group ${
                activeView === 'maps' && !selectedMapId ? 'bg-folia-100 text-folia-900' : 'hover:bg-paper-200 text-paper-800'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                {mapsExpanded ? <ChevronDown className="w-4 h-4 text-paper-400" /> : <ChevronRight className="w-4 h-4 text-paper-400" />}
                <Compass className="w-4 h-4 text-teal-600" />
                <span className="truncate">Mappe</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectView('maps');
                  onAddMap?.();
                }}
                title="Aggiungi nuova mappa..."
                className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-paper-300 text-paper-600 transition-opacity cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {mapsExpanded && (
              <div className="pl-4 pr-1 py-1 space-y-0.5">
                {(!project.maps || project.maps.length === 0) ? (
                  <p className="text-xs text-paper-400 italic px-2 py-1">Nessuna mappa presente</p>
                ) : (
                  project.maps.map((mapItem) => (
                    <div
                      key={mapItem.id}
                      onClick={() => {
                        onSelectView('maps');
                        onSelectMap?.(mapItem.id);
                      }}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors group ${
                        activeView === 'maps' && selectedMapId === mapItem.id
                          ? 'bg-folia-100/90 text-folia-950 font-medium'
                          : 'hover:bg-paper-200 text-paper-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2 h-2 rounded-full bg-teal-600 ring-1 ring-teal-700/20 shrink-0" />
                        <span className="truncate text-[13px]">{mapItem.title || 'Nuova Mappa'}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget({
                            type: 'map',
                            id: mapItem.id,
                            title: mapItem.title || 'Nuova Mappa'
                          });
                        }}
                        title={t('sidebar.delete_item')}
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-paper-400 hover:text-red-600 hover:bg-paper-300 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* 3c. SESSIONS RECORDINGS (Only for TTRPG Master) */}
        {isTtrpg && (
          <div 
            onClick={() => onSelectView('sessions')}
            className={`flex items-center justify-between px-2.5 py-2 rounded-xl cursor-pointer font-semibold transition-colors ${
              activeView === 'sessions' ? 'bg-folia-100 text-folia-900' : 'hover:bg-paper-200 text-paper-800'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Radio className="w-4 h-4 text-folia-700" />
              <span className="truncate">Sessioni registrate</span>
            </div>
            {(project.sessions || []).length > 0 && (
              <span className="text-[11px] bg-folia-100 text-folia-800 px-1.5 py-0.5 rounded-full font-mono font-medium border border-folia-200">
                {(project.sessions || []).length}
              </span>
            )}
          </div>
        )}

        {/* 4. CORKBOARD VIEW */}
        <div 
          onClick={() => onSelectView('corkboard')}
          className={`flex items-center gap-2 px-2.5 py-2 rounded-xl cursor-pointer font-semibold transition-colors ${
            activeView === 'corkboard' ? 'bg-folia-100 text-folia-900' : 'hover:bg-paper-200 text-paper-800'
          }`}
        >
          <LayoutGrid className="w-4 h-4 text-purple-600" />
          <span>{corkboardSectionLabel}</span>
        </div>

        {/* 5. PLOT OUTLINER (Only for Novel and TTRPG) */}
        {!isThesis && !isLetter && (
          <div 
            onClick={() => onSelectView('plot')}
            className={`flex items-center gap-2 px-2.5 py-2 rounded-xl cursor-pointer font-semibold transition-colors ${
              activeView === 'plot' ? 'bg-folia-100 text-folia-900' : 'hover:bg-paper-200 text-paper-800'
            }`}
          >
            <Layers className="w-4 h-4 text-folia-700" />
            <span>{plotSectionLabel}</span>
          </div>
        )}

        {/* 6. IDEAS BOARD */}
        <div 
          onClick={() => onSelectView('ideas')}
          className={`flex items-center justify-between px-2.5 py-2 rounded-xl cursor-pointer font-semibold transition-colors ${
            activeView === 'ideas' ? 'bg-folia-100 text-folia-900' : 'hover:bg-paper-200 text-paper-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>{ideasSectionLabel}</span>
          </div>
          {(project.ideas || []).length > 0 && (
            <span className="text-[11px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-mono font-medium">
              {(project.ideas || []).length}
            </span>
          )}
        </div>

        {/* 7. RESEARCH NOTES */}
        <div 
          onClick={() => onSelectView('notes')}
          className={`flex items-center justify-between px-2.5 py-2 rounded-xl cursor-pointer font-semibold transition-colors ${
            activeView === 'notes' ? 'bg-folia-100 text-folia-900' : 'hover:bg-paper-200 text-paper-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <StickyNote className="w-4 h-4 text-blue-600" />
            <span>{notesSectionLabel}</span>
          </div>
          {(project.notes || []).length > 0 && (
            <span className="text-[11px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full font-mono font-medium">
              {(project.notes || []).length}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Daily Goal Widget */}
      <div className="p-3.5 border-t border-paper-200 bg-paper-50 space-y-2">
        <div className="flex items-center justify-between text-[12px]">
          <div className="flex items-center gap-1.5 font-bold text-paper-800">
            <Target className="w-4 h-4 text-folia-700" />
            <span>{t('app.daily_goal')}</span>
          </div>

          {/* Editable Goal Target with pencil icon */}
          {isEditingGoal ? (
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={tempGoal}
                onChange={(e) => setTempGoal(e.target.value)}
                onBlur={handleSaveGoal}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveGoal();
                  if (e.key === 'Escape') {
                    setTempGoal(project.settings?.dailyWordGoal?.toString() || '1000');
                    setIsEditingGoal(false);
                  }
                }}
                className="w-16 text-right text-xs bg-white border border-folia-600 rounded px-1 py-0.5 focus:outline-hidden"
                autoFocus
              />
              <button onClick={handleSaveGoal} className="p-0.5 rounded bg-folia-700 text-white hover:bg-folia-800">
                <Check className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => {
                setTempGoal(project.settings?.dailyWordGoal?.toString() || '1000');
                setIsEditingGoal(true);
              }}
              title="Clicca per modificare l'obiettivo giornaliero"
              className="flex items-center gap-1 text-paper-600 hover:text-folia-800 cursor-pointer group"
            >
              <span className="font-semibold text-paper-800 text-[12.5px]">{wordsToday} / {dailyGoal}</span>
              <Pencil className="w-3 h-3 text-paper-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-paper-200 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 rounded-full ${
              isGoalReached 
                ? 'bg-gradient-to-r from-folia-800 via-emerald-600 to-teal-400 shadow-xs' 
                : 'bg-gradient-to-r from-folia-700 to-emerald-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-paper-500">
          <span>{progressPercent}% completato</span>
          {isGoalReached && (
            <span className="text-folia-800 font-semibold flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-folia-700" />
              Raggiunto!
            </span>
          )}
        </div>
      </div>

      {/* Premium Item Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          if (deleteTarget.type === 'doc') onDeleteDoc(deleteTarget.id);
          else if (deleteTarget.type === 'char') onDeleteChar(deleteTarget.id);
          else if (deleteTarget.type === 'world') onDeleteWorld(deleteTarget.id);
          else if (deleteTarget.type === 'map' && onDeleteMap) onDeleteMap(deleteTarget.id);
          setDeleteTarget(null);
        }}
        title={
          deleteTarget?.type === 'doc'
            ? (isTtrpg ? 'Elimina sessione' : 'Elimina capitolo')
            : deleteTarget?.type === 'char'
            ? (isTtrpg ? 'Elimina scheda personaggio/NPC' : 'Elimina scheda personaggio')
            : deleteTarget?.type === 'world'
            ? (isTtrpg ? 'Elimina luogo / dungeon' : 'Elimina voce di worldbuilding')
            : 'Elimina mappa'
        }
        subtitle="Questa azione eliminerà definitivamente l'elemento selezionato"
        message={
          <span>
            Sei sicuro di voler eliminare <strong>"{deleteTarget?.title}"</strong>?
          </span>
        }
        confirmLabel="Elimina definitivamente"
        cancelLabel="Annulla"
        variant="danger"
      />
    </aside>
  );
};
