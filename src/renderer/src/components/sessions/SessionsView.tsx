import React, { useState, useMemo } from 'react';
import { 
  Radio, 
  Search, 
  Plus, 
  Trash2, 
  FolderOpen, 
  BookOpen, 
  Calendar, 
  Clock, 
  HardDrive, 
  Bookmark, 
  Edit3, 
  Edit2,
  Check, 
  Mic, 
  Square, 
  Pause, 
  Play, 
  Sparkles,
  Settings2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { Project, SessionRecording, SessionMarker } from '../../types';
import { AudioPlayer, formatDuration } from './AudioPlayer';
import { ConfirmModal } from '../common/ConfirmModal';
import { MarkerEditModal } from './MarkerEditModal';

interface SessionsViewProps {
  project: Project;
  onUpdateSession: (session: SessionRecording) => void;
  onDeleteSession: (sessionId: string) => void;
  onCreateSessionChapter: (session: SessionRecording) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
  onAddLiveMarker: (label?: string) => void;
  isRecording: boolean;
  isPaused: boolean;
  recordingSeconds: number;
  audioLevel: number;
  selectedSessionId: string | null;
  onSelectSession: (sessionId: string | null) => void;
  audioDevices?: MediaDeviceInfo[];
  selectedDeviceId?: string;
  onOpenMicSetup?: () => void;
  t: (key: string) => string;
}

const formatBytes = (bytes?: number): string => {
  if (!bytes || bytes <= 0) return '0 KB';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const SessionsView: React.FC<SessionsViewProps> = ({
  project,
  onUpdateSession,
  onDeleteSession,
  onCreateSessionChapter,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onResumeRecording,
  onAddLiveMarker,
  isRecording,
  isPaused,
  recordingSeconds,
  audioLevel,
  selectedSessionId,
  onSelectSession,
  audioDevices = [],
  selectedDeviceId,
  onOpenMicSetup,
  t
}) => {
  const sessions = project.sessions || [];
  const [searchQuery, setSearchQuery] = useState('');
  const [sessionToDelete, setSessionToDelete] = useState<SessionRecording | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editingMarker, setEditingMarker] = useState<SessionMarker | null>(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const currentMicLabel = useMemo(() => {
    if (!audioDevices || audioDevices.length === 0) return null;
    const match = audioDevices.find(d => d.deviceId === selectedDeviceId);
    if (match && match.label) return match.label;
    if (audioDevices[0]?.label) return audioDevices[0].label;
    return 'Microfono collegato';
  }, [audioDevices, selectedDeviceId]);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // Filtered and sorted sessions (newest first)
  const filteredSessions = useMemo(() => {
    return sessions
      .filter(s => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          s.title.toLowerCase().includes(q) ||
          (s.summary && s.summary.toLowerCase().includes(q)) ||
          s.markers.some(m => m.label.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [sessions, searchQuery]);

  // Selected session object
  const activeSession = useMemo(() => {
    if (!selectedSessionId && filteredSessions.length > 0) {
      return filteredSessions[0];
    }
    return sessions.find(s => s.id === selectedSessionId) || null;
  }, [selectedSessionId, filteredSessions, sessions]);

  // Handle title edit
  const handleStartEditTitle = () => {
    if (activeSession) {
      setEditedTitle(activeSession.title);
      setIsEditingTitle(true);
    }
  };

  const handleSaveTitle = () => {
    if (activeSession && editedTitle.trim()) {
      onUpdateSession({
        ...activeSession,
        title: editedTitle.trim(),
        updatedAt: new Date().toISOString()
      });
    }
    setIsEditingTitle(false);
  };

  // Handle summary update
  const handleSummaryChange = (newSummary: string) => {
    if (activeSession) {
      onUpdateSession({
        ...activeSession,
        summary: newSummary,
        updatedAt: new Date().toISOString()
      });
    }
  };

  // Add marker from player
  const handleAddMarkerAtCurrentTime = (seconds: number) => {
    const newMarker: SessionMarker = {
      id: 'marker-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: Math.round(seconds),
      label: '',
      notes: ''
    };
    setEditingMarker(newMarker);
  };

  const handleSaveMarker = (updatedMarker: SessionMarker) => {
    if (activeSession) {
      const exists = activeSession.markers.some(m => m.id === updatedMarker.id);
      let updatedMarkers: SessionMarker[];
      if (exists) {
        updatedMarkers = activeSession.markers.map(m => m.id === updatedMarker.id ? updatedMarker : m);
      } else {
        updatedMarkers = [...activeSession.markers, updatedMarker];
      }
      updatedMarkers.sort((a, b) => a.timestamp - b.timestamp);
      onUpdateSession({
        ...activeSession,
        markers: updatedMarkers,
        updatedAt: new Date().toISOString()
      });
      setEditingMarker(null);
      showToast(t('sessions.marker_added') || 'Segnalibro salvato!');
    }
  };

  // Delete marker
  const handleDeleteMarker = (markerId: string) => {
    if (activeSession) {
      const updated = activeSession.markers.filter(m => m.id !== markerId);
      onUpdateSession({
        ...activeSession,
        markers: updated,
        updatedAt: new Date().toISOString()
      });
    }
  };

  // Open file in explorer
  const handleShowInFolder = () => {
    if (activeSession?.audioFilePath && (window as any).foliaAPI?.showItemInFolder) {
      (window as any).foliaAPI.showItemInFolder(activeSession.audioFilePath);
    }
  };

  // Delete session confirm
  const handleConfirmDeleteSession = () => {
    if (sessionToDelete) {
      onDeleteSession(sessionToDelete.id);
      setSessionToDelete(null);
      if (activeSession?.id === sessionToDelete.id) {
        onSelectSession(null);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-paper-150 text-paper-900 select-none">
      {/* Toast */}
      {feedbackToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-folia-900 text-folia-50 px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 text-xs border border-folia-700 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-folia-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="h-16 px-6 border-b border-paper-300 bg-paper-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-folia-100 border border-folia-300 flex items-center justify-center text-folia-700 shadow-2xs">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-paper-900 leading-tight">
              {t('sessions.title') || 'Registrazioni Sessioni'}
            </h1>
            <p className="text-xs text-paper-500">
              {t('sessions.subtitle') || 'Archivio audio, segnalibri temporali e diario di campagna'}
            </p>
          </div>
        </div>

        {/* Live Recording Widget or New Recording Button */}
        <div className="flex items-center gap-3">
          {isRecording ? (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-1.5 shadow-sm">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                <span className="font-mono font-bold text-red-700 text-xs">
                  REC {formatDuration(recordingSeconds)}
                </span>
              </div>

              {/* Dynamic visualizer dots */}
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-red-100/70 rounded">
                <div 
                  className="w-1 bg-red-600 rounded-full transition-all duration-75"
                  style={{ height: `${Math.max(4, Math.min(14, audioLevel / 7))}px` }}
                />
                <div 
                  className="w-1 bg-red-600 rounded-full transition-all duration-75"
                  style={{ height: `${Math.max(4, Math.min(14, audioLevel / 5))}px` }}
                />
                <div 
                  className="w-1 bg-red-600 rounded-full transition-all duration-75"
                  style={{ height: `${Math.max(4, Math.min(14, audioLevel / 8))}px` }}
                />
              </div>

              {/* Quick Bookmark button */}
              <button
                onClick={() => onAddLiveMarker()}
                title="Aggiungi segnalibro adesso"
                className="p-1 rounded hover:bg-red-200 text-red-700 transition-colors cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 fill-red-600 text-red-700" />
              </button>

              {/* Pause/Resume */}
              <button
                onClick={isPaused ? onResumeRecording : onPauseRecording}
                title={isPaused ? 'Riprendi' : 'Pausa'}
                className="p-1 rounded hover:bg-red-200 text-red-700 transition-colors cursor-pointer"
              >
                {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
              </button>

              {/* Stop and save */}
              <button
                onClick={onStopRecording}
                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow-xs transition-colors cursor-pointer ml-1"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>{t('sessions.stop_save') || 'Termina & Salva'}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {onOpenMicSetup && (
                <button
                  type="button"
                  onClick={onOpenMicSetup}
                  title="Verifica microfono, seleziona dispositivo e testa il volume"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                    currentMicLabel
                      ? 'bg-paper-100/90 border-paper-300 hover:border-folia-400 text-paper-700 hover:text-paper-900 shadow-2xs'
                      : 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
                  }`}
                >
                  {currentMicLabel ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                      <Mic className="w-3.5 h-3.5 text-folia-700 shrink-0" />
                      <span className="truncate max-w-[140px] text-[11px] font-semibold">{currentMicLabel}</span>
                      <Settings2 className="w-3 h-3 text-paper-400 shrink-0 ml-0.5" />
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="text-[11px] font-semibold">Nessun microfono rilevato</span>
                      <Settings2 className="w-3 h-3 text-amber-600 shrink-0 ml-0.5" />
                    </>
                  )}
                </button>
              )}

              <button
                onClick={onStartRecording}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-folia-700 hover:bg-folia-800 text-white font-semibold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>{t('sessions.record_btn') || 'Registra sessione'}</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content: Two Columns */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Sessions List */}
        <aside className="w-80 border-r border-paper-300 bg-paper-100 flex flex-col shrink-0">
          {/* Search box */}
          <div className="p-3 border-b border-paper-200">
            <div className="relative">
              <Search className="w-4 h-4 text-paper-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('sessions.search_placeholder') || 'Cerca tra le sessioni...'}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-paper-50 border border-paper-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-folia-600 text-paper-900 placeholder:text-paper-400"
              />
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredSessions.length === 0 ? (
              <div className="p-6 text-center text-paper-400 text-xs italic">
                {sessions.length === 0 
                  ? (t('sessions.no_sessions') || 'Nessuna sessione registrata') 
                  : 'Nessun risultato per la ricerca'}
              </div>
            ) : (
              filteredSessions.map((sess) => {
                const isSelected = activeSession?.id === sess.id;
                const formattedDate = new Date(sess.createdAt).toLocaleDateString('it-IT', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                });

                return (
                  <div
                    key={sess.id}
                    onClick={() => onSelectSession(sess.id)}
                    className={`group relative p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-folia-50 border-folia-300 ring-1 ring-folia-600/30 shadow-xs' 
                        : 'bg-paper-50 border-paper-200 hover:border-paper-300 hover:bg-paper-150'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-xs text-paper-900 truncate leading-snug">
                        {sess.title || (t('sessions.new_recording_title') || 'Nuova Sessione')}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSessionToDelete(sess);
                        }}
                        title="Elimina sessione"
                        className="opacity-0 group-hover:opacity-100 p-1 text-paper-400 hover:text-red-600 hover:bg-paper-200 rounded transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="mt-1 flex items-center gap-3 text-[11px] text-paper-500 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-paper-400" />
                        {formattedDate}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-paper-700">
                        <Clock className="w-3 h-3 text-paper-400" />
                        {formatDuration(sess.duration)}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-paper-400 border-t border-paper-100 pt-1.5">
                      <span>{formatBytes(sess.fileSizeBytes)}</span>
                      {sess.markers && sess.markers.length > 0 && (
                        <span className="flex items-center gap-0.5 text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-medium">
                          <Bookmark className="w-2.5 h-2.5 fill-amber-500 text-amber-600" />
                          {sess.markers.length} {sess.markers.length === 1 ? 'segnalibro' : 'segnalibri'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Column: Selected Session Detail */}
        <main className="flex-1 flex flex-col h-full overflow-y-auto bg-paper-150 p-6 space-y-5">
          {!activeSession ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-paper-400">
              <div className="w-16 h-16 rounded-2xl bg-paper-200/80 border border-paper-300 flex items-center justify-center text-paper-500 mb-4 shadow-inner">
                <Radio className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="text-sm font-semibold text-paper-700 mb-1">
                {t('sessions.no_sessions') || 'Nessuna sessione selezionata'}
              </h3>
              <p className="text-xs text-paper-500 max-w-sm mb-6">
                {t('sessions.no_sessions_desc') || 'Avvia una registrazione o seleziona una sessione dalla barra laterale per riascoltare l\'audio e visualizzare i punti chiave.'}
              </p>
              {!isRecording && (
                <button
                  onClick={onStartRecording}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-folia-700 hover:bg-folia-800 text-white font-semibold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Mic className="w-4 h-4" />
                  <span>{t('sessions.record_btn') || 'Registra sessione'}</span>
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Header of selected session */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-paper-300">
                {/* Title */}
                <div className="flex-1 min-w-0">
                  {isEditingTitle ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                        autoFocus
                        className="text-lg font-bold text-paper-900 bg-paper-50 border border-folia-600 rounded-lg px-2 py-1 w-full max-w-md focus:outline-none"
                      />
                      <button
                        onClick={handleSaveTitle}
                        className="p-1.5 rounded-lg bg-folia-700 text-white hover:bg-folia-800 cursor-pointer shadow-xs"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group">
                      <h2 className="text-lg font-bold text-paper-900 truncate">
                        {activeSession.title}
                      </h2>
                      <button
                        onClick={handleStartEditTitle}
                        title="Modifica titolo"
                        className="opacity-0 group-hover:opacity-100 p-1 text-paper-400 hover:text-paper-700 rounded transition-opacity cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-paper-500 font-mono mt-1">
                    <span>{new Date(activeSession.createdAt).toLocaleString('it-IT')}</span>
                    <span>•</span>
                    <span>Durata: {formatDuration(activeSession.duration)}</span>
                    <span>•</span>
                    <span>{formatBytes(activeSession.fileSizeBytes)}</span>
                  </div>
                </div>

                {/* Top Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Export as Chapter */}
                  <button
                    onClick={() => {
                      onCreateSessionChapter(activeSession);
                      showToast(t('sessions.export_success') || 'Sessione esportata nel Manoscritto!');
                    }}
                    title="Crea un capitolo o scena nel manoscritto con i contenuti di questa sessione"
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-folia-100 text-folia-900 hover:bg-folia-200 border border-folia-300 transition-colors shadow-2xs cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-folia-700" />
                    <span>{t('sessions.export_to_manuscript') || 'Crea capitolo'}</span>
                  </button>

                  {/* Show in folder */}
                  <button
                    onClick={handleShowInFolder}
                    title="Apri la cartella del file audio in Esplora File"
                    className="p-2 rounded-xl text-paper-600 hover:text-paper-900 bg-paper-50 hover:bg-paper-200 border border-paper-300 transition-colors shadow-2xs cursor-pointer"
                  >
                    <FolderOpen className="w-4 h-4" />
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => setSessionToDelete(activeSession)}
                    title="Elimina registrazione"
                    className="p-2 rounded-xl text-paper-400 hover:text-red-600 bg-paper-50 hover:bg-red-50 border border-paper-300 hover:border-red-200 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Audio Player Card */}
              <AudioPlayer
                audioFilePath={activeSession.audioFilePath}
                duration={activeSession.duration}
                markers={activeSession.markers}
                onAddMarkerAtCurrentTime={handleAddMarkerAtCurrentTime}
                selectedMarkerId={selectedMarkerId}
              />

              {/* Bottom Split: Segnalibri (Timeline) & Diario / Note */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 flex-1 min-h-[360px]">
                {/* 1. Timeline dei Segnalibri */}
                <div className="bg-paper-50 border border-paper-300 rounded-2xl p-4 flex flex-col shadow-xs">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-paper-200">
                    <div className="flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-amber-600 fill-amber-500" />
                      <h3 className="text-xs font-bold text-paper-900 uppercase tracking-wider">
                        {t('sessions.markers_title') || 'Segnalibri & Momenti Salienti'}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-paper-400">
                      {activeSession.markers.length} {activeSession.markers.length === 1 ? 'punto' : 'punti'}
                    </span>
                  </div>

                  {/* List of markers */}
                  <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                    {activeSession.markers.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-paper-400 text-xs italic">
                        Nessun segnalibro salvato. Premi "+ Segnalibro" nel player durante l'ascolto per marcare e appuntare un secondo chiave.
                      </div>
                    ) : (
                      activeSession.markers.map((marker) => {
                        return (
                          <div
                            key={marker.id}
                            onClick={() => {
                              setSelectedMarkerId(marker.id);
                              if ((window as any)._foliaPlayerSeek) {
                                (window as any)._foliaPlayerSeek(marker.timestamp);
                              }
                            }}
                            className={`flex items-start justify-between p-2.5 rounded-xl border transition-all cursor-pointer group ${
                              selectedMarkerId === marker.id 
                                ? 'bg-amber-50 border-amber-300 shadow-2xs' 
                                : 'bg-paper-100 border-paper-200 hover:bg-paper-150 hover:border-paper-300'
                            }`}
                          >
                            <div className="flex items-start gap-2.5 min-w-0 flex-1 mr-2">
                              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200 shrink-0 mt-0.5">
                                {formatDuration(marker.timestamp)}
                              </span>
                              <div className="min-w-0 flex-1">
                                <span className="text-xs font-semibold text-paper-900 block truncate">
                                  {marker.label}
                                </span>
                                {marker.notes && (
                                  <p className="text-[11px] text-paper-500 line-clamp-2 mt-0.5 font-normal select-text">
                                    {marker.notes}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0 mt-0.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingMarker(marker);
                                }}
                                title="Modifica segnalibro e appunti"
                                className="opacity-0 group-hover:opacity-100 p-1 text-paper-400 hover:text-folia-800 hover:bg-paper-200 rounded-lg transition-all cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteMarker(marker.id);
                                }}
                                title="Rimuovi segnalibro"
                                className="opacity-0 group-hover:opacity-100 p-1 text-paper-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* 2. Diario / Appunti di Sessione */}
                <div className="bg-paper-50 border border-paper-300 rounded-2xl p-4 flex flex-col shadow-xs">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-paper-200">
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-folia-700" />
                      <h3 className="text-xs font-bold text-paper-900 uppercase tracking-wider">
                        {t('sessions.notes_title') || 'Diario & Appunti di Sessione'}
                      </h3>
                    </div>
                  </div>

                  <textarea
                    value={activeSession.summary || ''}
                    onChange={(e) => handleSummaryChange(e.target.value)}
                    placeholder={t('sessions.notes_placeholder') || 'Annota qui il riassunto della sessione, decisioni chiave, bottino distribuito o eventi salienti...'}
                    className="flex-1 w-full p-3 text-xs leading-relaxed bg-paper-100 border border-paper-300 rounded-xl resize-none text-paper-900 placeholder:text-paper-400 focus:outline-none focus:ring-1 focus:ring-folia-600 font-sans select-text"
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!sessionToDelete}
        onClose={() => setSessionToDelete(null)}
        onConfirm={handleConfirmDeleteSession}
        title={t('sessions.delete_confirm_title') || 'Eliminare questa registrazione?'}
        subtitle="Questa azione rimuoverà il file audio dal disco"
        message={
          <p className="text-xs text-paper-600 leading-relaxed">
            Sei sicuro di voler eliminare la registrazione{' '}
            <strong className="text-paper-900">{sessionToDelete?.title}</strong>? I file audio e i relativi segnalibri andranno persi.
          </p>
        }
        confirmLabel={t('sessions.delete_session') || 'Elimina sessione'}
        variant="danger"
      />

      {/* Marker Note & Detail Edit Modal */}
      <MarkerEditModal
        isOpen={editingMarker !== null}
        marker={editingMarker}
        isLive={false}
        onSave={handleSaveMarker}
        onDelete={(id) => {
          handleDeleteMarker(id);
          setEditingMarker(null);
        }}
        onClose={() => setEditingMarker(null)}
        t={t}
      />
    </div>
  );
};
