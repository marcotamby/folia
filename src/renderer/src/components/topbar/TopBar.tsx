import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Clock, 
  FileDown, 
  Settings as SettingsIcon, 
  Maximize2, 
  Minimize2, 
  Minus, 
  Plus,
  Square, 
  X, 
  BookOpen, 
  Globe,
  FolderOpen,
  Info,
  CheckCircle2,
  HardDrive,
  ZoomIn,
  ZoomOut,
  Mic,
  Bookmark,
  Play,
  Pause,
  Radio,
  AlertTriangle
} from 'lucide-react';
import { Project, Language, ViewMode } from '../../types';
import { SaveStatus } from '../../hooks/useAutosave';
import { formatDuration } from '../sessions/AudioPlayer';
import logoImg from '../../assets/logo.png';

interface TopBarProps {
  isWelcome?: boolean;
  project: Project;
  saveStatus: SaveStatus;
  lastSavedTime: Date | null;
  secondsRemaining: number;
  wordCount: number;
  charCount: number;
  zoomLevel: number;
  onChangeZoom: (level: number) => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
  onSaveManual: () => void;
  onOpenProjectsList: () => void;
  onOpenNewProject: () => void;
  onOpenExport: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  onToggleLanguage: () => void;
  onRequestClose?: () => void;
  isTtrpg?: boolean;
  recorder?: {
    isRecording: boolean;
    isPaused: boolean;
    recordingSeconds: number;
    audioLevel: number;
    onStartRecording: () => void;
    onStopRecording: () => void;
    onPauseRecording: () => void;
    onResumeRecording: () => void;
    onAddLiveMarker: (label?: string) => void;
    onOpenSessionsView: () => void;
    hasMicrophone?: boolean;
    onOpenMicSetup?: () => void;
  };
  t: (key: string) => string;
}

export const TopBar: React.FC<TopBarProps> = ({
  isWelcome = false,
  project,
  saveStatus,
  lastSavedTime,
  secondsRemaining,
  wordCount,
  charCount,
  zoomLevel = 100,
  onChangeZoom,
  isFocusMode,
  onToggleFocusMode,
  onSaveManual,
  onOpenProjectsList,
  onOpenNewProject,
  onOpenExport,
  onOpenSettings,
  onOpenAbout,
  onToggleLanguage,
  onRequestClose,
  isTtrpg = false,
  recorder,
  t
}) => {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if ((window as any).foliaAPI?.isWindowMaximized) {
      (window as any).foliaAPI.isWindowMaximized().then((maximized: boolean) => {
        setIsMaximized(maximized);
      }).catch(() => {});
    }
    if ((window as any).foliaAPI?.onWindowMaximizedChange) {
      const unsubscribe = (window as any).foliaAPI.onWindowMaximizedChange((maximized: boolean) => {
        setIsMaximized(maximized);
      });
      return () => unsubscribe();
    }
  }, []);

  // Standard Italian publishing cartella is 1,800 characters
  const cartelleCount = (charCount / 1800).toFixed(1);
  const readMins = Math.max(1, Math.ceil(wordCount / 220));

  // Format seconds to mm:ss
  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleMinimize = () => {
    if ((window as any).foliaAPI?.minimizeWindow) {
      (window as any).foliaAPI.minimizeWindow();
    }
  };

  const handleMaximize = () => {
    if ((window as any).foliaAPI?.maximizeWindow) {
      (window as any).foliaAPI.maximizeWindow();
    }
  };

  const handleClose = () => {
    if (onRequestClose) {
      onRequestClose();
    } else if ((window as any).foliaAPI?.closeWindow) {
      (window as any).foliaAPI.closeWindow();
    }
  };

  return (
    <header className="h-11 border-b border-paper-200 bg-paper-50 flex items-center justify-between px-3 select-none app-drag-region z-30 shrink-0">
      {/* Left: App Logo, Projects, Save & Export */}
      <div className="flex items-center gap-1.5 no-drag shrink-0">
        <div className="flex items-center gap-2 pr-1">
          {/* Folia Leaf Icon with hover tooltip */}
          <img 
            src={logoImg} 
            alt="Folia Logo"
            onClick={onOpenAbout}
            title="Informazioni su Folia"
            className="w-6 h-6 rounded-lg object-contain cursor-pointer hover:opacity-90 transition-opacity shadow-2xs"
          />
          <span className="font-brand font-bold text-sm tracking-tight text-folia-950">Folia</span>
        </div>

        {!isWelcome && (
          <>
            <div className="h-4 w-px bg-paper-200" />
            
            {/* I tuoi progetti (Cartella) */}
            <button
              onClick={onOpenProjectsList}
              title="Visualizza e gestisci l'elenco di tutti i tuoi progetti creati (Ctrl O)"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-paper-700 bg-paper-100 hover:bg-paper-200 hover:text-paper-900 transition-colors cursor-pointer border border-paper-250 shadow-2xs"
            >
              <FolderOpen className="w-3.5 h-3.5 text-folia-700" />
              <span className="hidden sm:inline">I tuoi progetti</span>
            </button>

            {/* Nuovo progetto (+) */}
            <button
              onClick={onOpenNewProject}
              title="Crea un nuovo progetto (Romanzo o Master D&D)"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-paper-800 bg-paper-100 hover:bg-folia-50 hover:text-folia-900 hover:border-folia-300 transition-colors cursor-pointer border border-paper-250 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-folia-700" />
              <span className="hidden md:inline">Nuovo progetto</span>
            </button>

            <div className="h-4 w-px bg-paper-200 mx-0.5" />

            {/* Manual Save Button */}
            <button
              onClick={onSaveManual}
              title={`${t('app.save')} (Ctrl S)`}
              className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-lg text-paper-700 hover:bg-paper-150 hover:text-folia-800 transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-folia-700" />
              <span className="hidden lg:inline">{t('app.save')}</span>
            </button>

            {/* Export Button */}
            <button
              onClick={onOpenExport}
              title={t('app.export')}
              className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-lg text-paper-700 hover:bg-paper-150 hover:text-paper-900 transition-colors cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-paper-600" />
              <span className="hidden lg:inline">{t('app.export')}</span>
            </button>
          </>
        )}
      </div>

      {/* Center: Live Statistics & Autosave Timer Status (hidden on Welcome screen) */}
      {!isWelcome ? (
        <div className="flex items-center gap-2.5 text-xs text-paper-600 no-drag shrink min-w-0 overflow-hidden mx-2">
          {/* Autosave Status Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-paper-100 rounded-full border border-paper-200 text-[11px] font-medium shrink-0">
            {saveStatus === 'saved' && (
              <>
                <CheckCircle2 className="w-3 h-3 text-folia-700" />
                <span className="text-paper-700">Autosave {formatCountdown(secondsRemaining)}</span>
              </>
            )}
            {saveStatus === 'saving' && (
              <>
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span className="text-amber-700 font-semibold">{t('app.saving')}</span>
              </>
            )}
            {saveStatus === 'unsaved' && (
              <>
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-paper-600">Salvataggio tra {formatCountdown(secondsRemaining)}</span>
              </>
            )}
          </div>

          {/* Live Word, Cartelle & Reading Time Stats */}
          <div className="hidden xl:flex items-center gap-2.5 text-[11px] text-paper-500 shrink-0">
            <span>
              <strong className="text-paper-800 font-semibold">{wordCount.toLocaleString()}</strong> {t('app.words')}
            </span>
            <span className="text-paper-300">•</span>
            <span>
              <strong className="text-paper-800 font-semibold">{cartelleCount}</strong> {t('app.cartelle')}
            </span>
            <span className="text-paper-300">•</span>
            <span>
              <strong className="text-paper-800 font-semibold">{readMins}</strong> {t('app.reading_time')}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex-1" />
      )}

      {/* Right: D&D Recorder, Utility Tools & Native Window Controls */}
      <div className="flex items-center gap-1 no-drag shrink-0">
        {/* D&D Campaign Audio Recorder (Exclusive for ttrpg_master) */}
        {!isWelcome && isTtrpg && recorder && (
          <div className="flex items-center mr-1">
            {recorder.isRecording ? (
              <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-2.5 py-0.5 shadow-2xs animate-in fade-in">
                <div 
                  onClick={recorder.onOpenSessionsView}
                  className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity mr-1"
                  title="Visualizza sessioni registrate"
                >
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  <span className="font-mono font-bold text-red-700 text-xs">
                    REC {formatDuration(recorder.recordingSeconds)}
                  </span>
                </div>

                {/* Dynamic VU meter indicator */}
                <div className="hidden sm:flex items-center gap-0.5 px-1 py-0.5 bg-red-100 rounded">
                  <div 
                    className="w-0.5 bg-red-600 rounded-full transition-all duration-75"
                    style={{ height: `${Math.max(3, Math.min(10, recorder.audioLevel / 10))}px` }}
                  />
                  <div 
                    className="w-0.5 bg-red-600 rounded-full transition-all duration-75"
                    style={{ height: `${Math.max(3, Math.min(10, recorder.audioLevel / 7))}px` }}
                  />
                </div>

                {/* Quick Bookmark button */}
                <button
                  onClick={() => recorder.onAddLiveMarker()}
                  title="Aggiungi segnalibro al secondo attuale"
                  className="p-1 rounded-full hover:bg-red-200 text-red-700 transition-colors cursor-pointer"
                >
                  <Bookmark className="w-3 h-3 fill-red-600 text-red-700" />
                </button>

                {/* Pause / Resume */}
                <button
                  onClick={recorder.isPaused ? recorder.onResumeRecording : recorder.onPauseRecording}
                  title={recorder.isPaused ? 'Riprendi' : 'Pausa'}
                  className="p-1 rounded-full hover:bg-red-200 text-red-700 transition-colors cursor-pointer"
                >
                  {recorder.isPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3 fill-current" />}
                </button>

                {/* Stop & Save */}
                <button
                  onClick={recorder.onStopRecording}
                  title="Termina e salva registrazione"
                  className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs transition-colors cursor-pointer ml-0.5"
                >
                  <Square className="w-2.5 h-2.5 fill-current" />
                  <span>Salva</span>
                </button>
              </div>
            ) : (
              <button
                onClick={recorder.onOpenMicSetup || recorder.onStartRecording}
                title={recorder.hasMicrophone === false ? "Nessun microfono rilevato. Clicca per verificare i dispositivi." : "Avvia registrazione audio della sessione di gioco"}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors shadow-2xs cursor-pointer ${
                  recorder.hasMicrophone === false
                    ? 'text-amber-800 bg-amber-50 hover:bg-amber-100 border-amber-300'
                    : 'text-folia-800 bg-folia-100 hover:bg-folia-200 hover:text-folia-950 border-folia-300'
                }`}
              >
                {recorder.hasMicrophone === false ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span className="hidden sm:inline">Nessun microfono</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5 text-folia-700" />
                    <span className="hidden sm:inline">Registra sessione</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          title={t('app.settings')}
          className="p-1.5 rounded-lg text-paper-600 hover:bg-paper-150 hover:text-paper-900 transition-colors cursor-pointer"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>

        {/* About App Info */}
        <button
          onClick={onOpenAbout}
          title="Informazioni su Folia"
          className="hidden sm:block p-1.5 rounded-lg text-paper-600 hover:bg-paper-150 hover:text-paper-900 transition-colors cursor-pointer"
        >
          <Info className="w-4 h-4" />
        </button>

        {/* Zoom Controls */}
        <div className="hidden md:flex items-center gap-0.5 px-1 bg-paper-100 rounded-lg border border-paper-250 text-xs">
          <button
            onClick={() => onChangeZoom(Math.max(75, zoomLevel - 10))}
            title="Riduci zoom (Ctrl -)"
            className="p-1 rounded hover:bg-paper-200 text-paper-600 transition-colors cursor-pointer"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            onClick={() => onChangeZoom(100)}
            title="Reimposta zoom al 100% (Ctrl 0)"
            className="px-1.5 py-0.5 text-[11px] font-semibold text-paper-700 hover:text-folia-800 cursor-pointer"
          >
            {zoomLevel}%
          </button>
          <button
            onClick={() => onChangeZoom(Math.min(200, zoomLevel + 10))}
            title="Aumenta zoom (Ctrl +)"
            className="p-1 rounded hover:bg-paper-200 text-paper-600 transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Language switch */}
        <button
          onClick={onToggleLanguage}
          title={`Cambia lingua (Attuale: ${(project.settings?.language || 'it').toUpperCase()})`}
          className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-lg text-paper-700 hover:bg-paper-150 transition-colors cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-paper-500" />
          <span className="uppercase text-[11px]">{project.settings?.language || 'it'}</span>
        </button>

        {/* Focus Mode */}
        <button
          onClick={onToggleFocusMode}
          title={isFocusMode ? t('app.exit_focus') : t('app.focus_mode')}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isFocusMode 
              ? 'bg-folia-100 text-folia-800' 
              : 'text-paper-600 hover:bg-paper-150 hover:text-paper-900'
          }`}
        >
          {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        <div className="h-4 w-px bg-paper-200 mx-1" />

        {/* Windows Standard Window Action Buttons (Always pinned to top-right corner) */}
        <div className="flex items-center h-11 -my-1 -mr-3 ml-1">
          <button
            onClick={handleMinimize}
            className="w-10 h-11 flex items-center justify-center hover:bg-paper-200 text-paper-600 hover:text-paper-900 transition-colors cursor-pointer"
            title="Riduci a icona"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleMaximize}
            className="w-10 h-11 flex items-center justify-center hover:bg-paper-200 text-paper-600 hover:text-paper-900 transition-colors cursor-pointer"
            title={isMaximized ? "Ripristina giù" : "Ingrandisci"}
          >
            {isMaximized ? (
              <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 5.5V3h7.5v7.5H8" />
                <rect x="5.5" y="5.5" width="7.5" height="7.5" rx="0.5" />
              </svg>
            ) : (
              <Square className="w-3 h-3" />
            )}
          </button>
          <button
            onClick={handleClose}
            className="w-11 h-11 flex items-center justify-center hover:bg-red-500 hover:text-white text-paper-600 transition-colors cursor-pointer"
            title="Chiudi"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
