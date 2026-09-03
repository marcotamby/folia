import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Project, ViewMode, ManuscriptItem, Character, WorldEntry, CardStatus, PageFormat, PageMargins, FontFamily, ParagraphSpacing, PlotAct, ProjectType, MapEntry } from './types';
import { createDefaultProject } from './utils/defaults';
import { useI18n } from './hooks/useI18n';
import { useAutosave } from './hooks/useAutosave';
import { TopBar } from './components/topbar/TopBar';
import { Sidebar } from './components/sidebar/Sidebar';
import { RichEditor } from './components/editor/RichEditor';
import { CharacterEditor } from './components/characters/CharacterEditor';
import { WorldEditor } from './components/world/WorldEditor';
import { InteractiveMapEditor } from './components/maps/InteractiveMapEditor';
import { CorkboardView } from './components/corkboard/CorkboardView';
import { PlotOutliner } from './components/plot/PlotOutliner';
import { IdeasBoard } from './components/ideas/IdeasBoard';
import { NotesEditor } from './components/notes/NotesEditor';
import { SpecialCharsModal } from './components/modals/SpecialCharsModal';
import { TermsModal } from './components/modals/TermsModal';
import { ExportModal } from './components/modals/ExportModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { AboutModal } from './components/modals/AboutModal';
import { ProjectsModal, ProjectSummary } from './components/modals/ProjectsModal';
import { CreateProjectModal } from './components/modals/CreateProjectModal';
import { UnsavedChangesModal } from './components/modals/UnsavedChangesModal';
import { WelcomeScreen } from './components/welcome/WelcomeScreen';
import { PLOT_TEMPLATES } from './utils/plotTemplates';
import { CheckCircle2, Save } from 'lucide-react';

const STORAGE_ACTIVE_KEY = 'folia_active_project_id';
const STORAGE_PROJECT_PREFIX = 'folia_proj_';
const STORAGE_INDEX_KEY = 'folia_projects_index';

// Pre-calculate known template beats and guidelines for data migration
const knownTemplateBeats = new Map<string, { title: string; guideline: string }>();
const allTemplateGuidelines = new Set<string>();

for (const tmpl of PLOT_TEMPLATES) {
  for (const act of tmpl.createActs()) {
    for (const b of act.beats) {
      if (b.id) {
        knownTemplateBeats.set(b.id, { title: b.title, guideline: b.guideline || '' });
      }
      if (b.guideline && b.guideline.trim()) {
        allTemplateGuidelines.add(b.guideline.trim());
      }
    }
  }
}

const ensureProjectIntegrity = (raw: any): Project => {
  const defaultProj = createDefaultProject('it');
  if (!raw || typeof raw !== 'object') return defaultProj;

  // Migrate plotActs: ensure beat titles are preserved as defined dark text,
  // and placeholder guidelines are kept in 'guideline', while description is only user text.
  const migratedPlotActs = (Array.isArray(raw.plotActs) ? raw.plotActs : []).map((act: any) => ({
    ...act,
    beats: Array.isArray(act.beats) ? act.beats.map((beat: any) => {
      let title = (beat.title !== undefined && beat.title !== null) ? String(beat.title) : '';
      let description = (beat.description !== undefined && beat.description !== null) ? String(beat.description) : '';
      let guideline = (beat.guideline !== undefined && beat.guideline !== null) ? String(beat.guideline) : '';
      const titleSuggestion = beat.titleSuggestion ? String(beat.titleSuggestion) : '';

      // 1. If titleSuggestion was set (from previous temporary migration) and title is empty, restore title
      if (!title.trim() && titleSuggestion.trim()) {
        title = titleSuggestion.trim();
      }

      // 2. Check against known template beats by ID
      const known = knownTemplateBeats.get(beat.id);
      if (known) {
        if (!title.trim()) {
          title = known.title;
        }
        if (!guideline.trim()) {
          guideline = known.guideline;
        }
        // If description matches known guideline, it was template text stored as content -> clear description
        if (description && known.guideline && description.trim() === known.guideline.trim()) {
          description = '';
        }
      }

      // 3. If description matches current guideline, clear description (guideline belongs in placeholder)
      if (description && guideline && description.trim() === guideline.trim()) {
        description = '';
      }

      // 4. If description matches ANY known template guideline, ensure guideline is set and clear description
      if (description && allTemplateGuidelines.has(description.trim())) {
        if (!guideline.trim()) {
          guideline = description.trim();
        }
        description = '';
      }

      return {
        ...beat,
        title,
        titleSuggestion: undefined,
        description,
        guideline
      };
    }) : []
  }));

  return {
    ...defaultProj,
    ...raw,
    id: raw.id || defaultProj.id,
    title: raw.title || 'Nuovo progetto',
    author: raw.author || '',
    settings: {
      ...defaultProj.settings,
      ...(raw.settings || {})
    },
    manuscript: Array.isArray(raw.manuscript) && raw.manuscript.length > 0 ? raw.manuscript : defaultProj.manuscript,
    characters: Array.isArray(raw.characters) ? raw.characters : [],
    worldbuilding: Array.isArray(raw.worldbuilding) ? raw.worldbuilding : [],
    maps: Array.isArray(raw.maps) ? raw.maps : [],
    plotActs: migratedPlotActs.length > 0 ? migratedPlotActs : defaultProj.plotActs,
    ideas: Array.isArray(raw.ideas) ? raw.ideas : [],
    notes: Array.isArray(raw.notes) ? raw.notes : [],
    trash: Array.isArray(raw.trash) ? raw.trash : []
  };
};

export default function App() {
  // Load projects index from localStorage or initialize with current
  const [projectsIndex, setProjectsIndex] = useState<ProjectSummary[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_INDEX_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading projects index:', e);
    }
    return [];
  });

  const [project, setProject] = useState<Project>(() => {
    try {
      const activeId = localStorage.getItem(STORAGE_ACTIVE_KEY);
      if (activeId) {
        const saved = localStorage.getItem(STORAGE_PROJECT_PREFIX + activeId);
        if (saved) return ensureProjectIntegrity(JSON.parse(saved));
      }

      // Fallback to legacy v3 storage
      const legacy = localStorage.getItem('folia_project_v3');
      if (legacy) {
        const parsed = JSON.parse(legacy);
        if (parsed) {
          const intact = ensureProjectIntegrity(parsed);
          localStorage.setItem(STORAGE_PROJECT_PREFIX + intact.id, JSON.stringify(intact));
          localStorage.setItem(STORAGE_ACTIVE_KEY, intact.id);
          return intact;
        }
      }
    } catch (e) {
      console.error('Error in project state initialization:', e);
    }

    const defaultProj = createDefaultProject('it');
    try {
      localStorage.setItem(STORAGE_PROJECT_PREFIX + defaultProj.id, JSON.stringify(defaultProj));
      localStorage.setItem(STORAGE_ACTIVE_KEY, defaultProj.id);
    } catch (e) {}
    return defaultProj;
  });

  const { lang, setLang, t } = useI18n(project.settings?.language || 'it');
  const [activeView, setActiveView] = useState<ViewMode>('editor');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(
    project.manuscript && project.manuscript.length > 0 ? project.manuscript[0].id : null
  );
  const [selectedCharId, setSelectedCharId] = useState<string | null>(
    project.characters && project.characters.length > 0 ? project.characters[0].id : null
  );
  const [selectedWorldId, setSelectedWorldId] = useState<string | null>(
    project.worldbuilding && project.worldbuilding.length > 0 ? project.worldbuilding[0].id : null
  );
  const [selectedMapId, setSelectedMapId] = useState<string | null>(
    project.maps && project.maps.length > 0 ? project.maps[0].id : null
  );

  // Show welcome screen on every launch (like Word/Pages), 
  // unless a specific project was opened via file association
  const [showWelcome, setShowWelcome] = useState<boolean>(true);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Zoom state (applied safely to main workspace to prevent TopBar clipping)
  const zoomLevel = project.settings?.zoomLevel || 100;

  const handleUpdateZoom = (level: number) => {
    const clamped = Math.max(75, Math.min(200, level));
    setProject(p => ({ ...p, settings: { ...p.settings, zoomLevel: clamped } }));
  };

  // Modals state
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isSpecialCharsOpen, setIsSpecialCharsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(() => {
    return localStorage.getItem('folia_terms_accepted') !== 'true';
  });
  const [isUnsavedChangesOpen, setIsUnsavedChangesOpen] = useState(false);

  // Project type helpers
  const projectType = project.settings?.projectType || 'novel';
  const isTtrpg = projectType === 'ttrpg_master';
  const isThesis = projectType === 'academic_thesis';
  const isLetter = projectType === 'letter';

  // Sync current project into projectsIndex
  const syncCurrentToProjectsIndex = useCallback((proj: Project) => {
    const totalW = (proj.manuscript || []).reduce((acc, d) => acc + (d.wordCount || 0), 0);
    const summary: ProjectSummary = {
      id: proj.id,
      title: proj.title || 'Nuovo progetto',
      author: proj.author || '',
      wordCount: totalW,
      chapterCount: (proj.manuscript || []).length,
      characterCount: (proj.characters || []).length,
      updatedAt: proj.updatedAt || new Date().toISOString(),
      filePath: proj.filePath
    };

    setProjectsIndex(prev => {
      const filtered = prev.filter(p => p.id !== proj.id);
      const updated = [summary, ...filtered];
      try {
        localStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving index:', e);
      }
      return updated;
    });
  }, []);

  useEffect(() => {
    syncCurrentToProjectsIndex(project);
  }, [project.id, project.title, project.author, project.manuscript?.length, project.characters?.length]);

  // Synchronize spellchecker custom dictionary with Electron
  useEffect(() => {
    const customWords = project.settings?.customDictionary || [];
    if (customWords.length > 0 && (window as any).foliaAPI?.loadCustomDictionary) {
      (window as any).foliaAPI.loadCustomDictionary(customWords);
    }
  }, [project.id]);

  useEffect(() => {
    if ((window as any).foliaAPI?.onWordAddedToSpellchecker) {
      const cleanup = (window as any).foliaAPI.onWordAddedToSpellchecker((word: string) => {
        setProject(prev => {
          const currentWords = prev.settings?.customDictionary || [];
          if (currentWords.includes(word)) return prev;
          return {
            ...prev,
            settings: {
              ...prev.settings,
              customDictionary: [...currentWords, word]
            }
          };
        });
        markDirty();
      });
      return cleanup;
    }
  }, []);

  // Check and handle daily goal date reset (startup & periodic interval check for midnight rollover)
  useEffect(() => {
    const checkDateReset = () => {
      const todayStr = new Date().toISOString().split('T')[0];
      if (project.settings?.dailyGoalDate !== todayStr) {
        const currentTotal = (project.manuscript || []).reduce((acc, doc) => acc + (doc.wordCount || 0), 0);
        setProject(prev => ({
          ...prev,
          settings: {
            ...prev.settings,
            dailyGoalDate: todayStr,
            dailyWordsStart: currentTotal
          }
        }));
      }
    };

    checkDateReset();
    const timer = setInterval(checkDateReset, 30000); // Check every 30s
    return () => clearInterval(timer);
  }, [project.settings?.dailyGoalDate, project.manuscript]);

  // Global Keyboard Shortcuts (Esc for focus, Ctrl+, Ctrl-, Ctrl0 for zoom, Ctrl+S for save)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocusMode) {
        setIsFocusMode(false);
      }
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's' || e.key === 'S') {
          e.preventDefault();
          handleSaveProjectAs();
        } else if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          handleUpdateZoom(zoomLevel + 10);
        } else if (e.key === '-' || e.key === '_') {
          e.preventDefault();
          handleUpdateZoom(zoomLevel - 10);
        } else if (e.key === '0') {
          e.preventDefault();
          handleUpdateZoom(100);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode, zoomLevel, project]);

  // Reset activeView if current project type does not support characters/world/plot
  useEffect(() => {
    const pt = project.settings?.projectType || 'novel';
    if ((pt === 'academic_thesis' || pt === 'letter') && ['characters', 'world', 'plot'].includes(activeView)) {
      setActiveView('editor');
    }
  }, [project.settings?.projectType, activeView]);

  // Auto-detect system language on startup if not already saved
  useEffect(() => {
    const checkSystemLang = async () => {
      if ((window as any).foliaAPI?.getSystemLanguage && !localStorage.getItem(STORAGE_ACTIVE_KEY)) {
        try {
          const sysLang = await (window as any).foliaAPI.getSystemLanguage();
          if (sysLang === 'en' || sysLang === 'it') {
            setLang(sysLang);
            setProject(prev => ({
              ...prev,
              settings: { ...prev.settings, language: sysLang }
            }));
          }
        } catch (e) {
          console.error('Error detecting system language:', e);
        }
      }
    };
    checkSystemLang();
  }, [setLang]);

  // Save project handler for local storage & filesystem
  const handleSaveProject = useCallback(async (projToSave: Project) => {
    try {
      // If project has been deleted from index, never resurrect it
      const indexRaw = localStorage.getItem(STORAGE_INDEX_KEY);
      if (indexRaw) {
        try {
          const list = JSON.parse(indexRaw);
          if (Array.isArray(list) && list.length > 0 && !list.some((p: any) => p.id === projToSave.id)) {
            return;
          }
        } catch (_) {}
      }

      localStorage.setItem(STORAGE_PROJECT_PREFIX + projToSave.id, JSON.stringify(projToSave));
      localStorage.setItem(STORAGE_ACTIVE_KEY, projToSave.id);
      syncCurrentToProjectsIndex(projToSave);

      if (projToSave.filePath && (window as any).foliaAPI?.saveProjectDirect) {
        await (window as any).foliaAPI.saveProjectDirect(projToSave.filePath, projToSave);
      }
    } catch (e) {
      console.error('Failed to save project:', e);
      throw e;
    }
  }, [syncCurrentToProjectsIndex]);

  // Autosave hook (every 2 minutes = 120s)
  const {
    saveStatus,
    lastSavedTime,
    secondsRemaining,
    performSave,
    markDirty,
    clearDirty,
    isDirty
  } = useAutosave({
    project,
    onSave: handleSaveProject,
    intervalSeconds: 120
  });

  // Intercept application close and check for unsaved changes
  const handleRequestClose = useCallback(() => {
    if (isDirty || saveStatus === 'unsaved') {
      setIsUnsavedChangesOpen(true);
    } else {
      if ((window as any).foliaAPI?.forceCloseWindow) {
        (window as any).foliaAPI.forceCloseWindow();
      } else if ((window as any).foliaAPI?.closeWindow) {
        (window as any).foliaAPI.closeWindow();
      }
    }
  }, [isDirty, saveStatus]);

  useEffect(() => {
    if ((window as any).foliaAPI?.onAppCloseRequested) {
      const unsubscribe = (window as any).foliaAPI.onAppCloseRequested(() => {
        handleRequestClose();
      });
      return () => unsubscribe();
    }
  }, [handleRequestClose]);

  const handleSaveAndExit = async () => {
    try {
      await performSave();
      setIsUnsavedChangesOpen(false);
      if ((window as any).foliaAPI?.forceCloseWindow) {
        (window as any).foliaAPI.forceCloseWindow();
      }
    } catch (e) {
      console.error('Error saving before exit:', e);
      if ((window as any).foliaAPI?.forceCloseWindow) {
        (window as any).foliaAPI.forceCloseWindow();
      }
    }
  };

  const handleDiscardAndExit = () => {
    setIsUnsavedChangesOpen(false);
    if ((window as any).foliaAPI?.forceCloseWindow) {
      (window as any).foliaAPI.forceCloseWindow();
    }
  };

  // Calculate live word & character count across manuscript
  const totalStats = useMemo(() => {
    let words = 0;
    let chars = 0;
    (project.manuscript || []).forEach(doc => {
      words += (doc.wordCount || 0);
      const textLen = (doc.content || '').replace(/<[^>]+>/g, '').length;
      chars += textLen;
    });
    return { words, chars };
  }, [project.manuscript]);

  // Current active document
  const currentDoc = useMemo(() => {
    return (project.manuscript || []).find(d => d.id === selectedDocId) || null;
  }, [project.manuscript, selectedDocId]);

  // Current active character
  const currentChar = useMemo(() => {
    return (project.characters || []).find(c => c.id === selectedCharId) || null;
  }, [project.characters, selectedCharId]);

  // Current active world entry
  const currentWorld = useMemo(() => {
    return (project.worldbuilding || []).find(w => w.id === selectedWorldId) || null;
  }, [project.worldbuilding, selectedWorldId]);

  // Current active map
  const currentMap = useMemo(() => {
    if (!project.maps || project.maps.length === 0) return null;
    return project.maps.find(m => m.id === selectedMapId) || project.maps[0] || null;
  }, [project.maps, selectedMapId]);

  // Multi-Project Switching & Management
  const handleSelectProject = (id: string) => {
    setShowWelcome(false);
    if (id === project.id) return;
    performSave();

    const raw = localStorage.getItem(STORAGE_PROJECT_PREFIX + id);
    if (raw) {
      try {
        const loaded: Project = ensureProjectIntegrity(JSON.parse(raw));
        setProject(loaded);
        localStorage.setItem(STORAGE_PROJECT_PREFIX + id, JSON.stringify(loaded));
        localStorage.setItem(STORAGE_ACTIVE_KEY, id);
        setSelectedDocId(loaded.manuscript.length > 0 ? loaded.manuscript[0].id : null);
        setSelectedCharId(loaded.characters.length > 0 ? loaded.characters[0].id : null);
        setSelectedWorldId(loaded.worldbuilding.length > 0 ? loaded.worldbuilding[0].id : null);
        setSelectedMapId(loaded.maps && loaded.maps.length > 0 ? loaded.maps[0].id : null);
        setActiveView('editor');
      } catch (e) {
        console.error('Error switching project:', e);
      }
    }
  };

  const handleCreateNewProject = (title: string, author: string, type: ProjectType = 'novel') => {
    performSave();
    const newProj = createDefaultProject(lang, title, type);
    newProj.author = author;
    localStorage.setItem(STORAGE_PROJECT_PREFIX + newProj.id, JSON.stringify(newProj));
    localStorage.setItem(STORAGE_ACTIVE_KEY, newProj.id);
    setProject(newProj);
    setSelectedDocId(newProj.manuscript.length > 0 ? newProj.manuscript[0].id : null);
    setSelectedCharId(null);
    setSelectedWorldId(null);
    setActiveView('editor');
    setShowWelcome(false);
    syncCurrentToProjectsIndex(newProj);
  };

  const handleRenameProject = (id: string, newTitle: string) => {
    if (id === project.id) {
      setProject(p => {
        const updated = { ...p, title: newTitle, updatedAt: new Date().toISOString() };
        localStorage.setItem(STORAGE_PROJECT_PREFIX + updated.id, JSON.stringify(updated));
        syncCurrentToProjectsIndex(updated);
        return updated;
      });
      markDirty();
    } else {
      const raw = localStorage.getItem(STORAGE_PROJECT_PREFIX + id);
      if (raw) {
        try {
          const parsed = ensureProjectIntegrity(JSON.parse(raw));
          parsed.title = newTitle;
          parsed.updatedAt = new Date().toISOString();
          localStorage.setItem(STORAGE_PROJECT_PREFIX + id, JSON.stringify(parsed));
          syncCurrentToProjectsIndex(parsed);
        } catch (e) {
          console.error('Error renaming inactive project:', e);
        }
      }
    }
  };

  const handleDuplicateProject = (id: string) => {
    const raw = id === project.id 
      ? JSON.stringify(project) 
      : localStorage.getItem(STORAGE_PROJECT_PREFIX + id);

    if (raw) {
      try {
        const parsed: Project = ensureProjectIntegrity(JSON.parse(raw));
        const cloned: Project = {
          ...parsed,
          id: 'folia-proj-' + Date.now(),
          title: `${parsed.title} (copia)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          filePath: undefined
        };
        localStorage.setItem(STORAGE_PROJECT_PREFIX + cloned.id, JSON.stringify(cloned));
        syncCurrentToProjectsIndex(cloned);
      } catch (e) {
        console.error('Error duplicating project:', e);
      }
    }
  };

  const handleDeleteProject = (id: string) => {
    localStorage.removeItem(STORAGE_PROJECT_PREFIX + id);
    const remaining = projectsIndex.filter(p => p.id !== id);
    setProjectsIndex(remaining);
    localStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify(remaining));

    if (id === project.id) {
      clearDirty();
      if (remaining.length > 0) {
        const nextId = remaining[0].id;
        const raw = localStorage.getItem(STORAGE_PROJECT_PREFIX + nextId);
        if (raw) {
          try {
            const loaded: Project = ensureProjectIntegrity(JSON.parse(raw));
            setProject(loaded);
            localStorage.setItem(STORAGE_ACTIVE_KEY, nextId);
            setSelectedDocId(loaded.manuscript.length > 0 ? loaded.manuscript[0].id : null);
            setSelectedCharId(loaded.characters.length > 0 ? loaded.characters[0].id : null);
            setSelectedWorldId(loaded.worldbuilding.length > 0 ? loaded.worldbuilding[0].id : null);
            setSelectedMapId(loaded.maps && loaded.maps.length > 0 ? loaded.maps[0].id : null);
            setActiveView('editor');
          } catch (e) {
            console.error('Error switching project after deletion:', e);
          }
        }
      } else {
        const newProj = createDefaultProject(lang);
        localStorage.setItem(STORAGE_PROJECT_PREFIX + newProj.id, JSON.stringify(newProj));
        localStorage.setItem(STORAGE_ACTIVE_KEY, newProj.id);
        setProject(newProj);
        setSelectedDocId(newProj.manuscript.length > 0 ? newProj.manuscript[0].id : null);
        setSelectedCharId(null);
        setSelectedWorldId(null);
        setSelectedMapId(null);
        setActiveView('editor');
        syncCurrentToProjectsIndex(newProj);
      }
    }
  };

  const handleBrowseFromFile = async () => {
    if ((window as any).foliaAPI?.openProjectDialog) {
      try {
        const res = await (window as any).foliaAPI.openProjectDialog();
        if (res && res.data && res.data.id) {
          const loaded: Project = ensureProjectIntegrity(res.data);
          loaded.filePath = res.filePath;
          localStorage.setItem(STORAGE_PROJECT_PREFIX + loaded.id, JSON.stringify(loaded));
          localStorage.setItem(STORAGE_ACTIVE_KEY, loaded.id);
          setProject(loaded);
          setSelectedDocId(loaded.manuscript.length > 0 ? loaded.manuscript[0].id : null);
          setSelectedCharId(loaded.characters.length > 0 ? loaded.characters[0].id : null);
          setSelectedWorldId(loaded.worldbuilding.length > 0 ? loaded.worldbuilding[0].id : null);
          setSelectedMapId(loaded.maps && loaded.maps.length > 0 ? loaded.maps[0].id : null);
          syncCurrentToProjectsIndex(loaded);
          setIsProjectsOpen(false);
          setShowWelcome(false);
          setActiveView('editor');
          setSaveToast(`Progetto caricato da: ${res.filePath}`);
          setTimeout(() => setSaveToast(null), 3500);
        }
      } catch (e) {
        console.error('Error opening project file:', e);
      }
    }
  };

  // Mutations
  const updateDocumentContent = (content: string, wordCount: number) => {
    if (!selectedDocId) return;
    setProject(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      manuscript: (prev.manuscript || []).map(doc => 
        doc.id === selectedDocId ? { ...doc, content, wordCount, updatedAt: new Date().toISOString() } : doc
      )
    }));
    markDirty();
  };

  const updateDocumentTitle = (title: string) => {
    if (!selectedDocId) return;
    setProject(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      manuscript: (prev.manuscript || []).map(doc => 
        doc.id === selectedDocId ? { ...doc, title, updatedAt: new Date().toISOString() } : doc
      )
    }));
    markDirty();
  };

  const updateDocumentSynopsis = (synopsis: string) => {
    if (!selectedDocId) return;
    setProject(prev => ({
      ...prev,
      manuscript: (prev.manuscript || []).map(doc => 
        doc.id === selectedDocId ? { ...doc, synopsis } : doc
      )
    }));
    markDirty();
  };

  const updateDocStatus = (id: string, status: CardStatus) => {
    setProject(prev => ({
      ...prev,
      manuscript: (prev.manuscript || []).map(doc => 
        doc.id === id ? { ...doc, status } : doc
      )
    }));
    markDirty();
  };

  const addChapter = () => {
    const newDoc: ManuscriptItem = {
      id: 'doc-' + Date.now(),
      title: `${lang === 'it' ? 'Capitolo' : 'Chapter'} ${(project.manuscript || []).length + 1}`,
      type: 'chapter',
      content: '',
      synopsis: '',
      status: 'draft',
      order: (project.manuscript || []).length,
      wordCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProject(prev => ({
      ...prev,
      manuscript: [...(prev.manuscript || []), newDoc]
    }));
    setSelectedDocId(newDoc.id);
    setActiveView('editor');
    markDirty();
  };

  const deleteChapter = (id: string) => {
    const remaining = (project.manuscript || []).filter(d => d.id !== id);
    setProject(prev => ({ ...prev, manuscript: remaining }));
    if (selectedDocId === id) {
      setSelectedDocId(remaining.length > 0 ? remaining[0].id : null);
    }
    markDirty();
  };

  const addCharacter = () => {
    const newChar: Character = {
      id: 'char-' + Date.now(),
      name: lang === 'it' ? 'Nuovo personaggio' : 'New character',
      alias: '',
      role: 'protagonist',
      archetype: '',
      age: '',
      occupation: '',
      goal: '',
      need: '',
      flaw: '',
      strength: '',
      physicalDesc: '',
      psychology: '',
      backstory: '',
      arc: '',
      traits: [],
      relationships: [],
      freeNotes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProject(prev => ({
      ...prev,
      characters: [...(prev.characters || []), newChar]
    }));
    setSelectedCharId(newChar.id);
    setActiveView('characters');
    markDirty();
  };

  const updateCharacter = (updated: Character) => {
    setProject(prev => ({
      ...prev,
      characters: (prev.characters || []).map(c => c.id === updated.id ? updated : c)
    }));
    markDirty();
  };

  const deleteCharacter = (id: string) => {
    const remaining = (project.characters || []).filter(c => c.id !== id);
    setProject(prev => ({ ...prev, characters: remaining }));
    if (selectedCharId === id) {
      setSelectedCharId(remaining.length > 0 ? remaining[0].id : null);
    }
    markDirty();
  };

  const addWorldEntry = () => {
    const newEntry: WorldEntry = {
      id: 'world-' + Date.now(),
      name: lang === 'it' ? 'Nuovo luogo / voce' : 'New place / lore',
      category: 'location',
      atmosphere: '',
      inhabitants: '',
      rules: '',
      secrets: '',
      description: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProject(prev => ({
      ...prev,
      worldbuilding: [...(prev.worldbuilding || []), newEntry]
    }));
    setSelectedWorldId(newEntry.id);
    setActiveView('world');
    markDirty();
  };

  const updateWorldEntry = (updated: WorldEntry) => {
    setProject(prev => ({
      ...prev,
      worldbuilding: (prev.worldbuilding || []).map(w => w.id === updated.id ? updated : w)
    }));
    markDirty();
  };

  const deleteWorldEntry = (id: string) => {
    const remaining = (project.worldbuilding || []).filter(w => w.id !== id);
    setProject(prev => ({ ...prev, worldbuilding: remaining }));
    if (selectedWorldId === id) {
      setSelectedWorldId(remaining.length > 0 ? remaining[0].id : null);
    }
    markDirty();
  };

  const addMap = () => {
    const newMap: MapEntry = {
      id: 'map-' + Date.now(),
      title: lang === 'it' ? 'Nuova Mappa' : 'New Map',
      description: '',
      imageUrl: '',
      pins: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProject(prev => ({
      ...prev,
      maps: [...(prev.maps || []), newMap]
    }));
    setSelectedMapId(newMap.id);
    setActiveView('maps');
    markDirty();
  };

  const updateMap = (updatedMap: MapEntry) => {
    setProject(prev => ({
      ...prev,
      maps: (prev.maps || []).map(m => m.id === updatedMap.id ? updatedMap : m)
    }));
    markDirty();
  };

  const deleteMap = (id: string) => {
    const remaining = (project.maps || []).filter(m => m.id !== id);
    const mapToDelete = (project.maps || []).find(m => m.id === id);
    setProject(prev => ({
      ...prev,
      maps: remaining,
      trash: mapToDelete ? [...(prev.trash || []), {
        id: 'trash-' + Date.now(),
        originalType: 'map',
        data: mapToDelete,
        deletedAt: new Date().toISOString()
      }] : (prev.trash || [])
    }));
    if (selectedMapId === id) {
      setSelectedMapId(remaining.length > 0 ? remaining[0].id : null);
    }
    markDirty();
  };

  // Custom Save Dialog to save ANYWHERE on the PC
  const handleSaveProjectAs = async () => {
    // If the project already has a file path, we just perform a normal save and clear the dirty flag
    if (project.filePath && (window as any).foliaAPI?.saveProjectDirect) {
      performSave();
      setSaveToast('Progetto salvato con successo');
      setTimeout(() => setSaveToast(null), 3000);
      return;
    }

    // Otherwise, we show the Save As dialog
    if ((window as any).foliaAPI?.saveProjectDialog) {
      try {
        const res = await (window as any).foliaAPI.saveProjectDialog(project.title || 'Manoscritto', project);
        if (res && !res.canceled && res.filePath) {
          setProject(p => {
            const updated = { ...p, filePath: res.filePath, updatedAt: new Date().toISOString() };
            localStorage.setItem(STORAGE_PROJECT_PREFIX + updated.id, JSON.stringify(updated));
            syncCurrentToProjectsIndex(updated);
            return updated;
          });
          clearDirty();
          setSaveToast(`Progetto salvato con successo in: ${res.filePath}`);
          setTimeout(() => setSaveToast(null), 4000);
        }
      } catch (e) {
        console.error('Error saving project as:', e);
      }
    } else {
      performSave();
      setSaveToast('Progetto salvato localmente con successo');
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  const handleAcceptTerms = () => {
    localStorage.setItem('folia_terms_accepted', 'true');
    setProject(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        termsAccepted: true,
        termsAcceptedAt: new Date().toISOString()
      }
    }));
    setIsTermsOpen(false);
    markDirty();
  };

  const handleInsertSpecialChar = (char: string) => {
    if ((window as any)._insertCharToEditor) {
      (window as any)._insertCharToEditor(char);
    }
  };

  const handleToggleLanguage = () => {
    const nextLang = lang === 'it' ? 'en' : 'it';
    setLang(nextLang);
    setProject(p => ({ ...p, settings: { ...p.settings, language: nextLang } }));
    markDirty();
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-paper-100 text-paper-900 antialiased font-sans relative">
      {/* Toast Notification Banner */}
      {saveToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-paper-900 text-paper-50 px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 text-xs animate-in fade-in slide-in-from-top-2 duration-200 border border-paper-700">
          <CheckCircle2 className="w-4 h-4 text-folia-400 shrink-0" />
          <span className="font-medium truncate max-w-md">{saveToast}</span>
        </div>
      )}

      {/* Top Header Bar with Zoom & Project Switcher */}
      <TopBar
        project={project}
        saveStatus={saveStatus}
        lastSavedTime={lastSavedTime}
        secondsRemaining={secondsRemaining}
        wordCount={totalStats.words}
        charCount={totalStats.chars}
        zoomLevel={zoomLevel}
        onChangeZoom={handleUpdateZoom}
        isFocusMode={isFocusMode}
        onToggleFocusMode={() => setIsFocusMode(!isFocusMode)}
        onSaveManual={handleSaveProjectAs}
        onOpenProjectsList={() => setIsProjectsOpen(true)}
        onOpenNewProject={() => setIsCreateProjectOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onToggleLanguage={handleToggleLanguage}
        onRequestClose={handleRequestClose}
        t={t}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Welcome Screen on first launch */}
        {showWelcome ? (
          <WelcomeScreen
            recentProjects={projectsIndex.map(p => ({ ...p, updatedAt: (p as any).updatedAt }))}
            currentProjectTitle={project.title}
            hasExistingProject={projectsIndex.length > 0}
            onContinue={() => setShowWelcome(false)}
            onOpenNewProject={() => { setShowWelcome(false); setIsCreateProjectOpen(true); }}
            onOpenProjectsList={() => { setShowWelcome(false); setIsProjectsOpen(true); }}
            onSelectProject={(id) => { setShowWelcome(false); handleSelectProject(id); }}
            onBrowseFromFile={() => { setShowWelcome(false); handleBrowseFromFile(); }}
            t={t}
          />
        ) : (
          <>
        {/* Left Sidebar with Project Renaming & Switcher */}
        {!isFocusMode && (
          <Sidebar
            project={project}
            activeView={activeView}
            selectedDocId={selectedDocId}
            selectedCharId={selectedCharId}
            selectedWorldId={selectedWorldId}
            selectedMapId={selectedMapId}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            onSelectView={(view) => setActiveView(view)}
            onSelectDoc={(id) => setSelectedDocId(id)}
            onSelectChar={(id) => setSelectedCharId(id)}
            onSelectWorld={(id) => setSelectedWorldId(id)}
            onSelectMap={(id) => setSelectedMapId(id)}
            onAddChapter={addChapter}
            onAddCharacter={addCharacter}
            onAddWorldEntry={addWorldEntry}
            onAddMap={addMap}
            onDeleteDoc={deleteChapter}
            onDeleteChar={deleteCharacter}
            onDeleteWorld={deleteWorldEntry}
            onDeleteMap={deleteMap}
            onUpdateDailyGoal={(goal) => {
              setProject(p => ({ ...p, settings: { ...p.settings, dailyWordGoal: goal } }));
              markDirty();
            }}
            onUpdateProjectTitle={(newTitle) => handleRenameProject(project.id, newTitle)}
            onOpenProjectsModal={() => setIsProjectsOpen(true)}
            t={t}
          />
        )}

        {/* View Switcher Container with Safe Workspace Zoom */}
        <main 
          className="flex-1 flex flex-col h-full overflow-hidden bg-paper-150 transition-all origin-top-left"
          style={{ zoom: `${zoomLevel}%` }}
        >
          {activeView === 'editor' && (
            <RichEditor
              document={currentDoc}
              characters={project.characters || []}
              worldbuilding={project.worldbuilding || []}
              onNavigateToCharacter={(id) => {
                setSelectedCharId(id);
                setActiveView('characters');
              }}
              onNavigateToWorld={(id) => {
                setSelectedWorldId(id);
                setActiveView('world');
              }}
              onUpdateContent={updateDocumentContent}
              onUpdateTitle={updateDocumentTitle}
              onUpdateSynopsis={updateDocumentSynopsis}
              fontFamily={project.settings?.fontFamily || 'Garamond'}
              onChangeFontFamily={(f) => setProject(p => ({ ...p, settings: { ...p.settings, fontFamily: f } }))}
              headingFontFamily={project.settings?.headingFontFamily || 'Plus Jakarta Sans'}
              onChangeHeadingFontFamily={(f) => setProject(p => ({ ...p, settings: { ...p.settings, headingFontFamily: f } }))}
              pageFormat={project.settings?.pageFormat || 'a4'}
              onChangePageFormat={(fmt) => setProject(p => ({ ...p, settings: { ...p.settings, pageFormat: fmt } }))}
              pageMargins={project.settings?.pageMargins || 'normal'}
              onChangePageMargins={(m) => setProject(p => ({ ...p, settings: { ...p.settings, pageMargins: m } }))}
              fontSize={project.settings?.fontSize || 12}
              titleFontSize={currentDoc?.titleFontSize || project.settings?.titleFontSize || 26}
              onChangeFontSize={(sz) => {
                setProject(p => ({ ...p, settings: { ...p.settings, fontSize: sz } }));
                markDirty();
              }}
              onChangeTitleFontSize={(sz) => {
                if (!selectedDocId) return;
                setProject(prev => ({
                  ...prev,
                  updatedAt: new Date().toISOString(),
                  manuscript: (prev.manuscript || []).map(doc =>
                    doc.id === selectedDocId ? { ...doc, titleFontSize: sz, updatedAt: new Date().toISOString() } : doc
                  )
                }));
                markDirty();
              }}
              onUpdateFootnotes={(footnotes) => {
                if (!selectedDocId) return;
                setProject(prev => ({
                  ...prev,
                  updatedAt: new Date().toISOString(),
                  manuscript: (prev.manuscript || []).map(doc =>
                    doc.id === selectedDocId ? { ...doc, footnotes, updatedAt: new Date().toISOString() } : doc
                  )
                }));
                markDirty();
              }}
              onUpdateComments={(comments) => {
                if (!selectedDocId) return;
                setProject(prev => ({
                  ...prev,
                  updatedAt: new Date().toISOString(),
                  manuscript: (prev.manuscript || []).map(doc =>
                    doc.id === selectedDocId ? { ...doc, comments, updatedAt: new Date().toISOString() } : doc
                  )
                }));
                markDirty();
              }}
              defaultAuthor={project.author || 'Autore'}
              lineHeight={project.settings?.lineHeight || 1.7}
              firstLineIndent={project.settings?.firstLineIndent ?? 1.0}
              onChangeFirstLineIndent={(indent) => setProject(p => ({ ...p, settings: { ...p.settings, firstLineIndent: indent } }))}
              paragraphSpacing={project.settings?.paragraphSpacing ?? 'normal'}
              onChangeParagraphSpacing={(sp) => setProject(p => ({ ...p, settings: { ...p.settings, paragraphSpacing: sp } }))}
              hyphenation={project.settings?.hyphenation ?? false}
              onToggleHyphenation={() => setProject(p => ({ ...p, settings: { ...p.settings, hyphenation: !p.settings.hyphenation } }))}
              spellcheck={project.settings?.spellcheck ?? true}
              onToggleSpellcheck={() => setProject(p => ({ ...p, settings: { ...p.settings, spellcheck: !(p.settings.spellcheck ?? true) } }))}
              showPageNumbers={project.settings?.showPageNumbers ?? false}
              onTogglePageNumbers={() => setProject(p => ({ ...p, settings: { ...p.settings, showPageNumbers: !(p.settings.showPageNumbers ?? false) } }))}
              pageNumberPosition={project.settings?.pageNumberPosition || 'bottom-right'}
              onChangePageNumberPosition={(pos) => setProject(p => ({ ...p, settings: { ...p.settings, pageNumberPosition: pos } }))}
              pageNumberFormat={project.settings?.pageNumberFormat || 'simple'}
              onChangePageNumberFormat={(fmt) => setProject(p => ({ ...p, settings: { ...p.settings, pageNumberFormat: fmt } }))}
              isFocusMode={isFocusMode}
              onExitFocusMode={() => setIsFocusMode(false)}
              onOpenSpecialChars={() => setIsSpecialCharsOpen(true)}
              t={t}
            />
          )}

          {activeView === 'characters' && (
            <CharacterEditor
              character={currentChar}
              allCharacters={project.characters || []}
              onUpdateCharacter={updateCharacter}
              onDeleteCharacter={deleteCharacter}
              isTtrpg={isTtrpg}
              customDndClasses={project.settings?.customDndClasses || []}
              customDndRaces={project.settings?.customDndRaces || []}
              onAddCustomDndClass={(newCls) => {
                const current = project.settings?.customDndClasses || [];
                if (!current.includes(newCls)) {
                  setProject(p => ({
                    ...p,
                    settings: {
                      ...p.settings,
                      customDndClasses: [...(p.settings?.customDndClasses || []), newCls]
                    }
                  }));
                  markDirty();
                }
              }}
              onAddCustomDndRace={(newRace) => {
                const current = project.settings?.customDndRaces || [];
                if (!current.includes(newRace)) {
                  setProject(p => ({
                    ...p,
                    settings: {
                      ...p.settings,
                      customDndRaces: [...(p.settings?.customDndRaces || []), newRace]
                    }
                  }));
                  markDirty();
                }
              }}
              t={t}
            />
          )}

          {activeView === 'world' && (
            <WorldEditor
              entry={currentWorld}
              onUpdateEntry={updateWorldEntry}
              onDeleteEntry={deleteWorldEntry}
              t={t}
            />
          )}

          {activeView === 'maps' && (
            <InteractiveMapEditor
              map={currentMap}
              allMaps={project.maps || []}
              worldEntries={project.worldbuilding || []}
              onUpdateMap={updateMap}
              onDeleteMap={deleteMap}
              onAddMap={addMap}
              onNavigateToWorld={(worldId) => {
                setSelectedWorldId(worldId);
                setActiveView('world');
              }}
              t={t}
            />
          )}

          {activeView === 'corkboard' && (
            <CorkboardView
              project={project}
              onSelectDoc={(id) => {
                setSelectedDocId(id);
                setActiveView('editor');
              }}
              onAddChapter={addChapter}
              onUpdateDocSynopsis={(id, syn) => {
                setProject(p => ({
                  ...p,
                  manuscript: (p.manuscript || []).map(d => d.id === id ? { ...d, synopsis: syn } : d)
                }));
                markDirty();
              }}
              onUpdateDocStatus={updateDocStatus}
              onUpdateDocTitle={(id, title) => {
                setProject(p => ({
                  ...p,
                  manuscript: (p.manuscript || []).map(d => d.id === id ? { ...d, title } : d)
                }));
                markDirty();
              }}
              onDeleteDoc={deleteChapter}
              t={t}
            />
          )}

          {activeView === 'plot' && (
            <PlotOutliner
              project={project}
              onUpdatePlotActs={(acts: PlotAct[]) => {
                setProject(p => ({ ...p, plotActs: acts }));
                markDirty();
              }}
              t={t}
            />
          )}

          {activeView === 'ideas' && (
            <IdeasBoard
              project={project}
              onUpdateIdeas={(ideas) => {
                setProject(p => ({ ...p, ideas }));
                markDirty();
              }}
              t={t}
            />
          )}

          {activeView === 'notes' && (
            <NotesEditor
              project={project}
              onUpdateNotes={(notes) => {
                setProject(p => ({ ...p, notes }));
                markDirty();
              }}
              t={t}
            />
          )}
        </main>
        </>
        )}
      </div>

      {/* Projects Management & Switcher Modal (I tuoi progetti) */}
      <ProjectsModal
        isOpen={isProjectsOpen}
        onClose={() => setIsProjectsOpen(false)}
        currentProjectId={project.id}
        projectsList={projectsIndex}
        onSelectProject={handleSelectProject}
        onOpenCreateProject={() => setIsCreateProjectOpen(true)}
        onRenameProject={handleRenameProject}
        onDuplicateProject={handleDuplicateProject}
        onDeleteProject={handleDeleteProject}
        onBrowseFromFile={handleBrowseFromFile}
        t={t}
      />

      {/* Dedicated Create New Project Modal (Nuovo progetto) */}
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onCreateProject={handleCreateNewProject}
        t={t}
      />

      {/* Special Characters Modal */}
      <SpecialCharsModal
        isOpen={isSpecialCharsOpen}
        onClose={() => setIsSpecialCharsOpen(false)}
        onInsertChar={handleInsertSpecialChar}
        t={t}
      />

      {/* First Launch Terms & Privacy Modal */}
      <TermsModal
        isOpen={isTermsOpen}
        onAccept={handleAcceptTerms}
        lang={lang}
        t={t}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        project={project}
        t={t}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        project={project}
        onUpdateSettings={(newSettings) => {
          setProject(p => ({ ...p, settings: { ...p.settings, ...newSettings } }));
          markDirty();
        }}
        onLanguageChange={(newLang) => setLang(newLang)}
        t={t}
      />

      {/* About Info & Copyright Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        t={t}
      />

      {/* Premium Unsaved Changes Confirmation Modal on App Exit */}
      <UnsavedChangesModal
        isOpen={isUnsavedChangesOpen}
        onClose={() => setIsUnsavedChangesOpen(false)}
        onSaveAndExit={handleSaveAndExit}
        onDiscardAndExit={handleDiscardAndExit}
        projectTitle={project.title}
      />
    </div>
  );
}
