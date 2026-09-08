import React, { useEffect, useState } from 'react';
import { 
  Mic, 
  Square, 
  Play, 
  Volume2, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Settings2, 
  X,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

interface MicrophoneSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartRecording: () => void;
  audioDevices: MediaDeviceInfo[];
  selectedDeviceId: string;
  onSelectDevice: (deviceId: string) => void;
  audioLevel: number;
  isTestingMic: boolean;
  onStartTest: (deviceId?: string) => void;
  onStopTest: () => void;
  onRefreshDevices: () => void;
  isCheckingDevices?: boolean;
  error: string | null;
  onClearError: () => void;
  t?: (key: string) => string;
}

export const MicrophoneSetupModal: React.FC<MicrophoneSetupModalProps> = ({
  isOpen,
  onClose,
  onStartRecording,
  audioDevices,
  selectedDeviceId,
  onSelectDevice,
  audioLevel,
  isTestingMic,
  onStartTest,
  onStopTest,
  onRefreshDevices,
  isCheckingDevices,
  error,
  onClearError,
}) => {
  // Stop mic test if modal closes
  useEffect(() => {
    if (!isOpen && isTestingMic) {
      onStopTest();
    }
  }, [isOpen, isTestingMic, onStopTest]);

  if (!isOpen) return null;

  const hasDevices = audioDevices.length > 0;
  const isPermissionError = error?.toLowerCase().includes('negato') || 
                           error?.toLowerCase().includes('privacy') || 
                           error?.toLowerCase().includes('permission');

  const handleDeviceChange = (newId: string) => {
    onSelectDevice(newId);
    if (isTestingMic) {
      onStartTest(newId);
    }
  };

  const handleConfirmAndRecord = () => {
    onStopTest();
    onClose();
    onStartRecording();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-paper-50 rounded-2xl border border-paper-300 shadow-modal overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-paper-200 flex items-center justify-between bg-paper-100/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-folia-100 border border-folia-200 flex items-center justify-center text-folia-800">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-paper-900 leading-tight">
                Dispositivo di Registrazione & Microfono
              </h2>
              <p className="text-[11px] text-paper-500">
                Verifica che il microfono sia collegato e rilevato prima di registrare
              </p>
            </div>
          </div>
          <button
            onClick={() => { onStopTest(); onClose(); }}
            className="p-1 rounded-lg text-paper-400 hover:text-paper-700 hover:bg-paper-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs overflow-y-auto max-h-[70vh]">
          {/* Diagnostic & Error Alert if any */}
          {error && (
            <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
              isPermissionError 
                ? 'bg-rose-50/90 border-rose-200 text-rose-900'
                : 'bg-amber-50/90 border-amber-200 text-amber-900'
            }`}>
              {isPermissionError ? (
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1.5 flex-1">
                <span className="font-bold block text-xs">
                  {isPermissionError ? 'Accesso al microfono bloccato dal sistema' : 'Attenzione microfono'}
                </span>
                <p className="text-[11px] leading-relaxed text-paper-700">
                  {error}
                </p>
                {isPermissionError && (
                  <div className="pt-1 text-[11px] text-paper-600 space-y-1 bg-white/60 p-2 rounded-lg border border-rose-200/60 font-mono">
                    <div>1. Premi <kbd className="px-1 py-0.5 bg-paper-200 rounded text-[10px] font-sans font-bold">Win + I</kbd> (Impostazioni di Windows)</div>
                    <div>2. Apri <strong>Privacy e sicurezza &gt; Microfono</strong></div>
                    <div>3. Abilita <strong>"Consenti alle app di accedere al microfono"</strong></div>
                  </div>
                )}
                <div className="pt-1 flex gap-2">
                  <button
                    type="button"
                    onClick={() => { onClearError(); onStartTest(); }}
                    className="px-2.5 py-1 bg-white border border-paper-300 rounded-lg text-[11px] font-semibold text-paper-800 hover:bg-paper-100 shadow-2xs cursor-pointer transition-colors"
                  >
                    Riprova autorizzazione
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* No Microphones Found State */}
          {!hasDevices && !error && (
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 text-amber-900 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Nessun microfono rilevato</span>
              </div>
              <p className="text-[11.5px] leading-relaxed text-paper-700">
                Folia non ha rilevato alcun dispositivo di ingresso audio collegato al computer. Assicurati che un microfono, webcam con microfono o cuffie con microfono siano collegati e abilitati su Windows.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={onRefreshDevices}
                  disabled={isCheckingDevices}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCheckingDevices ? 'animate-spin' : ''}`} />
                  <span>Ricarica dispositivi</span>
                </button>
              </div>
            </div>
          )}

          {/* Device Selection & Details */}
          {hasDevices && (
            <div className="space-y-2 bg-paper-100/60 p-3.5 rounded-xl border border-paper-250">
              <div className="flex items-center justify-between">
                <label htmlFor="mic-select" className="font-bold text-paper-800 flex items-center gap-1.5 text-xs">
                  <Settings2 className="w-3.5 h-3.5 text-folia-700" />
                  <span>Microfono in uso</span>
                </label>
                <button
                  type="button"
                  onClick={onRefreshDevices}
                  title="Ricarica elenco dispositivi"
                  className="text-paper-500 hover:text-folia-800 flex items-center gap-1 text-[11px] transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isCheckingDevices ? 'animate-spin' : ''}`} />
                  <span>Aggiorna</span>
                </button>
              </div>

              <CustomSelect
                value={selectedDeviceId}
                onChange={handleDeviceChange}
                options={audioDevices.map((dev, idx) => ({
                  value: dev.deviceId || 'default',
                  label: dev.label || `Microfono ${idx + 1} (${dev.deviceId ? dev.deviceId.substring(0, 8) : 'Predefinito'})`,
                  icon: <Mic className="w-3.5 h-3.5 text-paper-500" />
                }))}
                className="w-full"
                buttonClassName="w-full justify-between py-2 px-3 bg-white"
              />

              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium pt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dispositivo audio collegato e pronto</span>
              </div>
            </div>
          )}

          {/* Live Microphone Test & VU Meter */}
          {hasDevices && (
            <div className="p-3.5 rounded-xl border border-paper-250 bg-paper-100/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-folia-700" />
                  <span className="font-bold text-paper-800 text-xs">Test del segnale vocale (VU Meter)</span>
                </div>
                <button
                  type="button"
                  onClick={isTestingMic ? onStopTest : () => onStartTest()}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                    isTestingMic
                      ? 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                      : 'bg-folia-100 hover:bg-folia-200 text-folia-800'
                  }`}
                >
                  {isTestingMic ? (
                    <>
                      <Square className="w-2.5 h-2.5 fill-current" />
                      <span>Ferma test</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>Testa microfono</span>
                    </>
                  )}
                </button>
              </div>

              {/* VU Meter Visual Bar */}
              <div className="space-y-1.5">
                <div className="w-full h-3.5 bg-paper-200 rounded-full overflow-hidden p-0.5 border border-paper-300">
                  <div
                    className={`h-full rounded-full transition-all duration-75 ${
                      audioLevel > 70 
                        ? 'bg-gradient-to-r from-emerald-500 via-folia-600 to-amber-500' 
                        : audioLevel > 5 
                        ? 'bg-gradient-to-r from-emerald-500 to-folia-600' 
                        : 'bg-paper-300'
                    }`}
                    style={{ width: `${Math.max(3, audioLevel)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10.5px] text-paper-500">
                  <span>Silenzio</span>
                  <span className="font-mono font-semibold text-paper-700">{audioLevel}%</span>
                  <span>Volume ottimale</span>
                </div>
              </div>

              <p className="text-[11px] text-paper-500 italic">
                {isTestingMic 
                  ? 'Parla nel microfono: se la barra si illumina e si muove, la tua sessione verrà registrata con audio perfetto.'
                  : 'Clicca su "Testa microfono" per verificare i livelli prima di avviare.'}
              </p>
            </div>
          )}

          {/* Privacy & File storage note */}
          <div className="text-[10.5px] text-paper-400 leading-normal border-t border-paper-200 pt-3">
            Le registrazioni audio delle sessioni di D&amp;D vengono salvate interamente sul tuo disco locale in <strong className="text-paper-600">Documenti/Folia/Registrazioni</strong>. Nessun dato audio lascia mai il tuo computer.
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-5 py-3.5 border-t border-paper-200 bg-paper-100/60 flex items-center justify-between">
          <button
            type="button"
            onClick={() => { onStopTest(); onClose(); }}
            className="px-3 py-1.5 rounded-xl border border-paper-300 hover:bg-paper-200 text-paper-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            Chiudi
          </button>

          <button
            type="button"
            onClick={handleConfirmAndRecord}
            disabled={!hasDevices}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all ${
              hasDevices
                ? 'bg-folia-700 hover:bg-folia-800 text-white active:scale-95 cursor-pointer'
                : 'bg-paper-300 text-paper-500 cursor-not-allowed opacity-60'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Avvia Registrazione Ora</span>
          </button>
        </div>
      </div>
    </div>
  );
};
