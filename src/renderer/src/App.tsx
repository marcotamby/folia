import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Project, ViewMode, ManuscriptItem, Character, WorldEntry, CardStatus, PageFormat, PageMargins, FontFamily, ParagraphSpacing, PlotAct, ProjectType, MapEntry, SessionRecording, SessionMarker } from './types';
import { createDefaultProject } from './utils/defaults';
import { useI18n } from './hooks/useI18n';
import { useAutosave } from './hooks/useAutosave';
import { useAudioRecorder } from './hooks/useAudioRecorder';
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
import { SessionsView } from './components/sessions/SessionsView';
import { formatDuration } from './components/sessions/AudioPlayer';
import { SpecialCharsModal } from './components/modals/SpecialCharsModal';
import { TermsModal } from './components/modals/TermsModal';
import { ExportModal } from './components/modals/ExportModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { AboutModal } from './components/modals/AboutModal';
import { ProjectsModal, ProjectSummary } from './components/modals/ProjectsModal';
import { CreateProjectModal } from './components/modals/CreateProjectModal';
import { UnsavedChangesModal } from './components/modals/UnsavedChangesModal';
import { MicrophoneSetupModal } from './components/sessions/MicrophoneSetupModal';
import { MarkerEditModal } from './components/sessions/MarkerEditModal';
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

  const defaultNotePlaceholders = new Set([
    'Regole speciali della campagna, varianti di riposo, critici e gestione del party.',
    'Special campaign rules, rest variants, criticals, and party management.',
    'Annotazioni e citazioni chiave estratte dai testi di riferimento per la tesi.',
    'Key notes and citations extracted from reference papers.'
  ]);

  const defaultSynopses = new Set([
    'Incontro iniziale del party e prima quest locale.',
    'Initial party encounter and first quest.',
    'Intestazione ateneo, corso di laurea, relatore, correlatore e candidato.',
    'University header, course, advisor, co-advisor and candidate.',
    'Contesto della ricerca, motivazioni, obiettivi e struttura dell\'elaborato.',
    'Research context, motivations, objectives and thesis structure.',
    'Revisione della letteratura scientifica e modelli teorici di riferimento.',
    'Literature review and theoretical models.',
    'Descrizione del metodo di indagine, raccolta dati, campioni o corpus testuale.',
    'Methodology description, data collection, sample or textual corpus.',
    'Presentazione dei risultati emersi, grafici, analisi critica e confronto.',
    'Results presentation, charts, critical analysis and comparison.',
    'Sintesi dei contributi, limiti dell\'indagine e prospettive aperte.',
    'Contribution summary, limitations, and future outlook.',
    'Riferimenti bibliografici completi in formato standard (APA, Chicago, MLA).',
    'Complete references in standard format (APA, Chicago, MLA).',
    'Testo principale della lettera con formule di apertura e chiusura.',
    'Main letter text with opening and closing salutations.'
  ]);

  const migratedNotes = (Array.isArray(raw.notes) ? raw.notes : []).map((n: any) => {
    let content = typeof n.content === 'string' ? n.content : '';
    let placeholder = typeof n.placeholder === 'string' ? n.placeholder : '';
    const trimmed = content.trim();

    if (
      defaultNotePlaceholders.has(trimmed) ||
      trimmed.startsWith('Destinatario: \nEnte / Società:') ||
      trimmed.startsWith('Destinatario:\nEnte / Società:') ||
      trimmed.startsWith('Recipient: \nOrganization:') ||
      trimmed.startsWith('Recipient:\nOrganization:')
    ) {
      if (!placeholder) {
        placeholder = trimmed.endsWith('...') ? trimmed : `${trimmed}...`;
      }
      content = '';
    }

    return {
      ...n,
      content,
      placeholder: placeholder || undefined
    };
  });

  const migratedManuscript = (Array.isArray(raw.manuscript) && raw.manuscript.length > 0 ? raw.manuscript : defaultProj.manuscript).map((doc: any) => {
    let synopsis = typeof doc.synopsis === 'string' ? doc.synopsis : '';
    if (synopsis && defaultSynopses.has(synopsis.trim())) {
      synopsis = '';
    }
    return {
      ...doc,
      synopsis
    };
  });

  const migratedIdeas = (Array.isArray(raw.ideas) ? raw.ideas : []).filter((idea: any) => {
    const trimmed = typeof idea.text === 'string' ? idea.text.trim() : '';
    return !(
      trimmed === 'Oggetto magico raro da far trovare nel primo dungeon.' ||
      trimmed === 'Rare magic item to find in the first dungeon.' ||
      trimmed === 'Domanda di ricerca da discutere al prossimo incontro col relatore.' ||
      trimmed === 'Research question to discuss at next meeting with thesis advisor.' ||
      trimmed === 'Allegati da includere nella busta o via email.' ||
      trimmed === 'Attachments to include in the envelope or via email.'
    );
  });

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
    manuscript: migratedManuscript,
    characters: Array.isArray(raw.characters) ? raw.characters : [],
    worldbuilding: Array.isArray(raw.worldbuilding) ? raw.worldbuilding : [],
    maps: Array.isArray(raw.maps) ? raw.maps.map((m: any, idx: number) => ({
      id: m?.id || `map-${Date.now()}-${idx}`,
      title: m?.title || 'Nuova Mappa',
      description: m?.description || '',
      imageUrl: m?.imageUrl || '',
      pins: Array.isArray(m?.pins) ? m.pins : [],
      createdAt: m?.createdAt || new Date().toISOString(),
      updatedAt: m?.updatedAt || new Date().toISOString()
    })) : [],
    plotActs: migratedPlotActs.length > 0 ? migratedPlotActs : defaultProj.plotActs,
    ideas: migratedIdeas,
    notes: migratedNotes,
    trash: Array.isArray(raw.trash) ? raw.trash : [],
    sessions: Array.isArray(raw.sessions) ? raw.sessions : []
  };
};

interface ViewErrorBoundaryProps {
  children: React.ReactNode;
  activeView: string;
  onResetToEditor: () => void;
}

interface ViewErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ViewErrorBoundary extends React.Component<ViewErrorBoundaryProps, ViewErrorBoundaryState> {
  constructor(props: ViewErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('ViewErrorBoundary caught an error in view:', this.props.activeView, error, errorInfo);
  }

  componentDidUpdate(prevProps: ViewErrorBoundaryProps) {
    if (prevProps.activeView !== this.props.activeView && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-paper-100 select-none">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center mb-4 text-xl font-bold">
            !
          </div>
          <h3 className="font-brand text-lg font-bold text-paper-900 mb-1">
            Si è verificato un problema in questa sezione
          </h3>
          <p className="text-xs text-paper-500 max-w-md mb-4 leading-relaxed">
            I tuoi progetti e i tuoi testi sono al sicuro. Puoi riprovare o tornare alla scrittura del manoscritto.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-paper-200 hover:bg-paper-300 text-paper-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Riprova
            </button>
            <button
              type="button"
              onClick={this.props.onResetToEditor}
              className="px-4 py-2 bg-folia-800 hover:bg-folia-900 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              Torna al testo
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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

  // Check if a project file was passed via CLI / file association synchronously
  const cliInitialFile = (window as any).foliaAPI?.initialFile;
  const hasCliFile = Boolean(cliInitialFile && cliInitialFile.data && cliInitialFile.data.id);

  const [project, setProject] = useState<Project>(() => {
    // 1. If opened via file association (double click on .folia file), use it immediately!
    if (hasCliFile) {
      try {
        const loaded = ensureProjectIntegrity(cliInitialFile.data);
        loaded.filePath = cliInitialFile.filePath;
        localStorage.setItem(STORAGE_PROJECT_PREFIX + loaded.id, JSON.stringify(loaded));
        localStorage.setItem(STORAGE_ACTIVE_KEY, loaded.id);
        return loaded;
      } catch (e) {
        console.error('Error initializing project from cliInitialFile:', e);
      }
    }

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
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    project.sessions && project.sessions.length > 0 ? project.sessions[0].id : null
  );

  // Project type helpers
  const projectType = project.settings?.projectType || 'novel';
  const isTtrpg = projectType === 'ttrpg_master';
  const isThesis = projectType === 'academic_thesis';
  const isLetter = projectType === 'letter';

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
  const [isMicSetupOpen, setIsMicSetupOpen] = useState(false);
  const [liveMarkerToEdit, setLiveMarkerToEdit] = useState<SessionMarker | null>(null);

  // Audio recording is ONLY initialized if the user is in a D&D campaign project
  // and actively inside the sessions view or configuring recording. Never on app start or for standard books.
  const isAudioEnabled = isTtrpg && (activeView === 'sessions' || isMicSetupOpen);
  const recorder = useAudioRecorder(isAudioEnabled);

  const handleAddLiveMarkerWithModal = useCallback((defaultLabel?: string) => {
    if (recorder.isRecording) {
      const newMarker = recorder.addMarker(defaultLabel || 'Segnalibro');
      setLiveMarkerToEdit(newMarker);
    }
  }, [recorder]);

  const handleStartRecordingFlow = useCallback(async () => {
    const devices = recorder.audioDevices.length > 0 ? recorder.audioDevices : await recorder.refreshDevices();
    if (devices.length === 0 || recorder.error) {
      setIsMicSetupOpen(true);
      return;
    }
    const res = await recorder.startRecording();
    if (!res.success) {
      setIsMicSetupOpen(true);
    }
  }, [recorder]);

  // If a project file was opened via file association (double click in Explorer), 
  // skip welcome screen completely to avoid any visual flicker!
  const [showWelcome, setShowWelcome] = useState<boolean>(!hasCliFile);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Zoom state (applied safely to main workspace to prevent TopBar clipping)
  const zoomLevel = project.settings?.zoomLevel || 100;

  const handleUpdateZoom = (level: number) => {
    const clamped = Math.max(75, Math.min(200, level));
    setProject(p => ({ ...p, settings: { ...p.settings, zoomLevel: clamped } }));
  };

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
    // 1. Initial file opened at launch (CLI args / double-click in Explorer)
    const loadInitialProject = async () => {
      if ((window as any).foliaAPI?.getInitialFile) {
        try {
          const res = await (window as any).foliaAPI.getInitialFile();
          if (res && res.data && res.data.id) {
            const loaded: Project = ensureProjectIntegrity(res.data);
            loaded.filePath = res.filePath;
            localStorage.setItem(STORAGE_PROJECT_PREFIX + loaded.id, JSON.stringify(loaded));
            localStorage.setItem(STORAGE_ACTIVE_KEY, loaded.id);
            setProject(loaded);
            setSelectedDocId(loaded.manuscript && loaded.manuscript.length > 0 ? loaded.manuscript[0].id : null);
            setSelectedCharId(loaded.characters && loaded.characters.length > 0 ? loaded.characters[0].id : null);
            setSelectedWorldId(loaded.worldbuilding && loaded.worldbuilding.length > 0 ? loaded.worldbuilding[0].id : null);
            setSelectedMapId(loaded.maps && loaded.maps.length > 0 ? loaded.maps[0].id : null);
            syncCurrentToProjectsIndex(loaded);
            setShowWelcome(false);
            setActiveView('editor');
            setIsProjectsOpen(false);
            setSaveToast(`Progetto aperto: ${loaded.title || res.filePath}`);
            setTimeout(() => setSaveToast(null), 3000);
          }
        } catch (e) {
          console.error('Error loading initial file from CLI:', e);
        }
      }
    };

    loadInitialProject();

    // 2. File opened while Folia is already running
    if ((window as any).foliaAPI?.onOpenFile) {
      const unsubscribe = (window as any).foliaAPI.onOpenFile((res: { filePath: string; data: any }) => {
        if (res && res.data && res.data.id) {
          const loaded: Project = ensureProjectIntegrity(res.data);
          loaded.filePath = res.filePath;
          localStorage.setItem(STORAGE_PROJECT_PREFIX + loaded.id, JSON.stringify(loaded));
          localStorage.setItem(STORAGE_ACTIVE_KEY, loaded.id);
          setProject(loaded);
          setSelectedDocId(loaded.manuscript && loaded.manuscript.length > 0 ? loaded.manuscript[0].id : null);
          setSelectedCharId(loaded.characters && loaded.characters.length > 0 ? loaded.characters[0].id : null);
          setSelectedWorldId(loaded.worldbuilding && loaded.worldbuilding.length > 0 ? loaded.worldbuilding[0].id : null);
          setSelectedMapId(loaded.maps && loaded.maps.length > 0 ? loaded.maps[0].id : null);
          syncCurrentToProjectsIndex(loaded);
          setShowWelcome(false);
          setActiveView('editor');
          setIsProjectsOpen(false);
          setSaveToast(`Progetto aperto: ${loaded.title || res.filePath}`);
          setTimeout(() => setSaveToast(null), 3000);
        }
      });
      return () => unsubscribe();
    }
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
      let docWords = doc.wordCount;
      // If doc has content but wordCount is 0 or missing, calculate it
      if ((!docWords || docWords === 0) && doc.content) {
        const textOnly = doc.content
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/&nbsp;/gi, ' ')
          .trim();
        docWords = textOnly ? textOnly.split(/\s+/).filter(Boolean).length : 0;
      }
      words += (docWords || 0);

      const textLen = (doc.content || '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/gi, ' ')
        .length;
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
      name: isTtrpg 
        ? (lang === 'it' ? 'Nuovo PG' : 'New PC') 
        : (lang === 'it' ? 'Nuovo personaggio' : 'New character'),
      alias: '',
      role: 'protagonist',
      archetype: isTtrpg ? 'Livello 1' : '',
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
      dndClass: isTtrpg ? 'Guerriero' : undefined,
      dndRace: isTtrpg ? 'Umano' : undefined,
      dndAlignment: isTtrpg ? 'Neutrale Buono' : undefined,
      dndData: isTtrpg ? {
        stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10, savingThrows: [] },
        combat: {
          armorClass: 10,
          maxHp: 10,
          currentHp: 10,
          tempHp: 0,
          speed: '9m (30 ft)',
          hitDice: '1d8',
          proficiencyBonus: 2,
          passivePerception: 10,
          inspiration: false,
          conditions: []
        },
        weapons: [],
        equipment: [],
        currency: { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 }
      } : undefined,
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

  const reorderManuscript = (newManuscript: ManuscriptItem[]) => {
    setProject(prev => ({
      ...prev,
      manuscript: newManuscript.map((doc, idx) => ({ ...doc, order: idx }))
    }));
    markDirty();
  };

  const reorderCharacters = (newCharacters: Character[]) => {
    setProject(prev => ({
      ...prev,
      characters: newCharacters
    }));
    markDirty();
  };

  const reorderWorld = (newWorld: WorldEntry[]) => {
    setProject(prev => ({
      ...prev,
      worldbuilding: newWorld
    }));
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

  // D&D Campaign Sessions Handlers
  const handleStopRecordingAndSave = async () => {
    const sessionNumber = (project.sessions || []).length + 1;
    const defaultTitle = `Sessione ${sessionNumber}`;
    const result = await recorder.stopRecording(project.title, defaultTitle);
    if (result) {
      const now = new Date().toISOString();
      const newSession: SessionRecording = {
        id: 'sess-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        title: defaultTitle,
        date: now,
        duration: result.duration,
        audioFilePath: result.filePath,
        fileSizeBytes: result.fileSizeBytes,
        markers: result.markers,
        summary: '',
        createdAt: now,
        updatedAt: now
      };

      setProject(prev => ({
        ...prev,
        updatedAt: now,
        sessions: [newSession, ...(prev.sessions || [])]
      }));
      setSelectedSessionId(newSession.id);
      setActiveView('sessions');
      markDirty();
      setSaveToast('Registrazione salvata con successo!');
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  const handleUpdateSession = (updatedSession: SessionRecording) => {
    setProject(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      sessions: (prev.sessions || []).map(s => s.id === updatedSession.id ? updatedSession : s)
    }));
    markDirty();
  };

  const handleDeleteSession = async (sessionId: string) => {
    const toDelete = (project.sessions || []).find(s => s.id === sessionId);
    if (toDelete && (window as any).foliaAPI?.deleteAudioRecording) {
      try {
        await (window as any).foliaAPI.deleteAudioRecording(toDelete.audioFilePath);
      } catch (e) {}
    }
    setProject(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      sessions: (prev.sessions || []).filter(s => s.id !== sessionId)
    }));
    if (selectedSessionId === sessionId) {
      setSelectedSessionId(null);
    }
    markDirty();
    setSaveToast('Sessione eliminata');
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleCreateSessionChapter = (session: SessionRecording) => {
    const formattedMarkers = session.markers && session.markers.length > 0
      ? `<h3>Momenti salienti & segnalibri</h3><ul>` +
        session.markers.map(m => `<li><strong>[${formatDuration(m.timestamp)}]</strong> ${m.label}${m.notes ? ` — <em>${m.notes}</em>` : ''}</li>`).join('') +
        `</ul>`
      : '';

    const summaryContent = session.summary && session.summary.trim()
      ? `<p>${session.summary.replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br/>')}</p>`
      : '<p><em>Nessun appunto registrato per questa sessione.</em></p>';

    const chapterContent = `<h2>Diario della Sessione: ${session.title}</h2>
<p><strong>Data:</strong> ${new Date(session.createdAt).toLocaleDateString('it-IT')} | <strong>Durata audio:</strong> ${formatDuration(session.duration)}</p>
<hr/>
${summaryContent}
${formattedMarkers}`;

    const newDocId = 'doc-' + Date.now();
    const newDoc: ManuscriptItem = {
      id: newDocId,
      title: session.title,
      type: 'chapter',
      content: chapterContent,
      synopsis: session.summary ? session.summary.slice(0, 150) + '...' : `Sessione del ${new Date(session.createdAt).toLocaleDateString('it-IT')}`,
      status: 'draft',
      color: '#15803D',
      parentId: null,
      order: (project.manuscript || []).length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProject(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      manuscript: [...(prev.manuscript || []), newDoc]
    }));
    setSelectedDocId(newDocId);
    setActiveView('editor');
    markDirty();
    setSaveToast('Sessione aggiunta al Manoscritto!');
    setTimeout(() => setSaveToast(null), 3000);
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

  const currentSidebarWidth = (showWelcome || isFocusMode) ? '0px' : isSidebarCollapsed ? '56px' : '288px';

  return (
    <div 
      className="flex flex-col h-screen w-screen overflow-hidden bg-paper-100 text-paper-900 antialiased font-sans relative"
      style={{ '--sidebar-width': currentSidebarWidth } as React.CSSProperties}
    >
      {/* Toast Notification Banner */}
      {saveToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-paper-900 text-paper-50 px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 text-xs animate-in fade-in slide-in-from-top-2 duration-200 border border-paper-700">
          <CheckCircle2 className="w-4 h-4 text-folia-400 shrink-0" />
          <span className="font-medium truncate max-w-md">{saveToast}</span>
        </div>
      )}

      {/* Top Header Bar with Zoom & Project Switcher */}
      <TopBar
        isWelcome={showWelcome}
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
        isTtrpg={isTtrpg}
        recorder={{
          isRecording: recorder.isRecording,
          isPaused: recorder.isPaused,
          recordingSeconds: recorder.recordingSeconds,
          audioLevel: recorder.audioLevel,
          onStartRecording: handleStartRecordingFlow,
          onStopRecording: handleStopRecordingAndSave,
          onPauseRecording: recorder.pauseRecording,
          onResumeRecording: recorder.resumeRecording,
          onAddLiveMarker: handleAddLiveMarkerWithModal,
          onOpenSessionsView: () => setActiveView('sessions'),
          hasMicrophone: recorder.audioDevices.length > 0,
          onOpenMicSetup: () => setIsMicSetupOpen(true)
        }}
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
            onReorderManuscript={reorderManuscript}
            onReorderCharacters={reorderCharacters}
            onReorderWorld={reorderWorld}
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
          <ViewErrorBoundary activeView={activeView} onResetToEditor={() => setActiveView('editor')}>
          {activeView === 'editor' && (
            <RichEditor
              document={currentDoc}
              characters={project.characters || []}
              worldbuilding={project.worldbuilding || []}
              projectWords={totalStats.words}
              projectChars={totalStats.chars}
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
              onChangeFontFamily={(f) => {
                setProject(p => ({ ...p, settings: { ...p.settings, fontFamily: f } }));
                markDirty();
              }}
              headingFontFamily={project.settings?.headingFontFamily || 'Plus Jakarta Sans'}
              onChangeHeadingFontFamily={(f) => {
                setProject(p => ({ ...p, settings: { ...p.settings, headingFontFamily: f } }));
                markDirty();
              }}
              pageFormat={project.settings?.pageFormat || 'a4'}
              onChangePageFormat={(fmt) => {
                let defaultMargin: PageMargins = 'normal';
                if (fmt === 'cartella') {
                  defaultMargin = 'wide'; // Standard canonico 3.0 cm per cartella editoriale
                } else if (fmt === 'novel') {
                  defaultMargin = 'normal';
                } else if (fmt === 'a4') {
                  defaultMargin = 'normal';
                } else if (fmt === 'letter') {
                  defaultMargin = 'normal';
                }
                setProject(p => ({
                  ...p,
                  settings: {
                    ...p.settings,
                    pageFormat: fmt,
                    pageMargins: defaultMargin,
                  }
                }));
                markDirty();
              }}
              pageMargins={project.settings?.pageMargins || 'normal'}
              onChangePageMargins={(m) => {
                setProject(p => ({ ...p, settings: { ...p.settings, pageMargins: m } }));
                markDirty();
              }}
              customMargins={project.settings?.customMargins}
              onChangeCustomMargins={(cm) => {
                setProject(p => ({
                  ...p,
                  settings: {
                    ...p.settings,
                    customMargins: cm,
                    pageMargins: 'custom'
                  }
                }));
                markDirty();
              }}
              fontSize={project.settings?.fontSize || 12}
              titleFontSize={currentDoc?.titleFontSize || project.settings?.titleFontSize || 26}
              titleAlignment={currentDoc?.titleAlignment || project.settings?.titleAlignment || 'left'}
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
              onChangeTitleAlignment={(align) => {
                if (!selectedDocId) return;
                setProject(prev => ({
                  ...prev,
                  updatedAt: new Date().toISOString(),
                  settings: { ...prev.settings, titleAlignment: align },
                  manuscript: (prev.manuscript || []).map(doc =>
                    doc.id === selectedDocId ? { ...doc, titleAlignment: align, updatedAt: new Date().toISOString() } : doc
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
              onToggleHyphenation={() => {
                setProject(p => ({ ...p, settings: { ...p.settings, hyphenation: !p.settings.hyphenation } }));
                markDirty();
              }}
              spellcheck={project.settings?.spellcheck ?? true}
              onToggleSpellcheck={() => setProject(p => ({ ...p, settings: { ...p.settings, spellcheck: !(p.settings.spellcheck ?? true) } }))}
              showPageNumbers={project.settings?.showPageNumbers ?? false}
              onTogglePageNumbers={() => {
                setProject(p => ({ ...p, settings: { ...p.settings, showPageNumbers: !(p.settings.showPageNumbers ?? false) } }));
                markDirty();
              }}
              pageNumberPosition={project.settings?.pageNumberPosition || 'bottom-right'}
              onChangePageNumberPosition={(pos) => {
                setProject(p => ({ ...p, settings: { ...p.settings, pageNumberPosition: pos } }));
                markDirty();
              }}
              pageNumberFormat={project.settings?.pageNumberFormat || 'simple'}
              onChangePageNumberFormat={(fmt) => {
                setProject(p => ({ ...p, settings: { ...p.settings, pageNumberFormat: fmt } }));
                markDirty();
              }}
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
              onSelectCharacter={(id) => setSelectedCharId(id)}
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

          {activeView === 'sessions' && isTtrpg && (
            <SessionsView
              project={project}
              onUpdateSession={handleUpdateSession}
              onDeleteSession={handleDeleteSession}
              onCreateSessionChapter={handleCreateSessionChapter}
              onStartRecording={handleStartRecordingFlow}
              onStopRecording={handleStopRecordingAndSave}
              onPauseRecording={recorder.pauseRecording}
              onResumeRecording={recorder.resumeRecording}
              onAddLiveMarker={handleAddLiveMarkerWithModal}
              isRecording={recorder.isRecording}
              isPaused={recorder.isPaused}
              recordingSeconds={recorder.recordingSeconds}
              audioLevel={recorder.audioLevel}
              selectedSessionId={selectedSessionId}
              onSelectSession={(id) => setSelectedSessionId(id)}
              audioDevices={recorder.audioDevices}
              selectedDeviceId={recorder.selectedDeviceId}
              onOpenMicSetup={() => setIsMicSetupOpen(true)}
              t={t}
            />
          )}
          </ViewErrorBoundary>
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

      {/* Microphone Configuration & Live Test Modal */}
      <MicrophoneSetupModal
        isOpen={isMicSetupOpen}
        onClose={() => setIsMicSetupOpen(false)}
        onStartRecording={async () => {
          const res = await recorder.startRecording();
          if (!res.success) {
            setIsMicSetupOpen(true);
          }
        }}
        audioDevices={recorder.audioDevices}
        selectedDeviceId={recorder.selectedDeviceId}
        onSelectDevice={recorder.setSelectedDeviceId}
        audioLevel={recorder.audioLevel}
        isTestingMic={recorder.isTestingMic}
        onStartTest={recorder.startMicTest}
        onStopTest={recorder.stopMicTest}
        onRefreshDevices={recorder.refreshDevices}
        isCheckingDevices={recorder.isCheckingDevices}
        error={recorder.error}
        onClearError={recorder.clearError}
        t={t}
      />

      {/* Live Marker Note Capture Modal */}
      <MarkerEditModal
        isOpen={liveMarkerToEdit !== null}
        marker={liveMarkerToEdit}
        isLive={true}
        onSave={(updated) => {
          recorder.updateMarker(updated.id, { label: updated.label, notes: updated.notes });
          setLiveMarkerToEdit(null);
        }}
        onDelete={(id) => {
          recorder.deleteMarker(id);
          setLiveMarkerToEdit(null);
        }}
        onClose={() => setLiveMarkerToEdit(null)}
        t={t}
      />
    </div>
  );
}
