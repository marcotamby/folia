import React, { useState } from 'react';
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
  ZoomOut
} from 'lucide-react';
import { Project, Language, ViewMode } from '../../types';
import { SaveStatus } from '../../hooks/useAutosave';
import logoImg from '../../assets/logo.png';

interface TopBarProps {
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
  t: (key: string) => string;
}

export const TopBar: React.FC<TopBarProps> = ({
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
  t
}) => {
  const [isMaximized, setIsMaximized] = useState(false);

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
      setIsMaximized(!isMaximized);
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
      {/* Left: App Logo, "I tuoi progetti" & "Nuovo progetto" */}
      <div className="flex items-center gap-2 no-drag">
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

        <div className="h-4 w-px bg-paper-200" />
        
        {/* I tuoi progetti (Cartella) */}
        <button
          onClick={onOpenProjectsList}
          title="Visualizza e gestisci l'elenco di tutti i tuoi progetti creati (Ctrl O)"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-paper-700 bg-paper-100 hover:bg-paper-200 hover:text-paper-900 transition-colors cursor-pointer border border-paper-250 shadow-2xs"
        >
          <FolderOpen className="w-3.5 h-3.5 text-folia-700" />
          <span>I tuoi progetti</span>
        </button>

        {/* Nuovo progetto (+) */}
        <button
          onClick={onOpenNewProject}
          title="Crea un nuovo progetto (Romanzo o Master D&D)"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-paper-800 bg-paper-100 hover:bg-folia-50 hover:text-folia-900 hover:border-folia-300 transition-colors cursor-pointer border border-paper-250 shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5 text-folia-700" />
          <span>Nuovo progetto</span>
        </button>
      </div>

      {/* Center: Live Statistics & Autosave Timer Status */}
      <div className="flex items-center gap-4 text-xs text-paper-600 no-drag">
        {/* Autosave Status Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-paper-100 rounded-full border border-paper-200 text-[11px] font-medium">
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
        <div className="hidden md:flex items-center gap-3 text-[11px] text-paper-500">
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

      {/* Right: Actions, Zoom, Language & Native Window Controls */}
      <div className="flex items-center gap-1 no-drag">
        {/* Manual Save Button */}
        <button
          onClick={onSaveManual}
          title={`${t('app.save')} (Ctrl S)`}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg text-paper-700 hover:bg-paper-150 hover:text-folia-800 transition-colors"
        >
          <Save className="w-3.5 h-3.5 text-folia-700" />
          <span>{t('app.save')}</span>
        </button>

        {/* Export Button */}
        <button
          onClick={onOpenExport}
          title={t('app.export')}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg text-paper-700 hover:bg-paper-150 hover:text-paper-900 transition-colors"
        >
          <FileDown className="w-3.5 h-3.5 text-paper-600" />
          <span>{t('app.export')}</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          title={t('app.settings')}
          className="p-1.5 rounded-lg text-paper-600 hover:bg-paper-150 hover:text-paper-900 transition-colors"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>

        {/* About App Info */}
        <button
          onClick={onOpenAbout}
          title="Informazioni su Folia"
          className="p-1.5 rounded-lg text-paper-600 hover:bg-paper-150 hover:text-paper-900 transition-colors"
        >
          <Info className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-paper-200 mx-1" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-0.5 px-1 bg-paper-100 rounded-lg border border-paper-250 mr-1 text-xs">
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
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg text-paper-700 hover:bg-paper-150 transition-colors cursor-pointer"
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

        {/* Windows Standard Window Action Buttons */}
        <div className="flex items-center">
          <button
            onClick={handleMinimize}
            className="p-1.5 hover:bg-paper-200 rounded text-paper-600 transition-colors cursor-pointer"
            title="Riduci a icona"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleMaximize}
            className="p-1.5 hover:bg-paper-200 rounded text-paper-600 transition-colors cursor-pointer"
            title={isMaximized ? "Ripristina" : "Ingrandisci"}
          >
            <Square className="w-3 h-3" />
          </button>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-red-500 hover:text-white rounded text-paper-600 transition-colors cursor-pointer"
            title="Chiudi"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
