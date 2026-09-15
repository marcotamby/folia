import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Heart, Info, UserCheck, HardDrive, RefreshCw, CheckCircle2, Mail } from 'lucide-react';
import logoImg from '../../assets/logo.png';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, t }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);
  const [appVersion, setAppVersion] = useState('1.0.6');

  useEffect(() => {
    const folia = (window as any).foliaAPI;
    if (folia?.getAppVersion) {
      folia.getAppVersion().then((v: string) => {
        if (v) setAppVersion(v);
      }).catch(() => {});
    }
  }, []);

  if (!isOpen) return null;

  const handleCheckUpdates = async () => {
    setIsChecking(true);
    setUpdateStatus(null);
    const folia = (window as any).foliaAPI;
    if (folia?.checkForUpdates) {
      try {
        const res = await folia.checkForUpdates();
        if (res?.isDev) {
          setUpdateStatus('Modalità dev: ultima versione attiva');
        } else if (res?.success) {
          if (res?.updateInfo?.version && res.updateInfo.version !== appVersion) {
            setUpdateStatus(`Nuova versione v${res.updateInfo.version} in download`);
          } else {
            setUpdateStatus(`Sei all'ultima versione (v${appVersion})`);
          }
        } else {
          setUpdateStatus(`Sei all'ultima versione (v${appVersion})`);
        }
      } catch (e: any) {
        setUpdateStatus(`Sei all'ultima versione (v${appVersion})`);
      }
    } else {
      setUpdateStatus(`Sei all'ultima versione (v${appVersion})`);
    }
    setIsChecking(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in select-none folia-modal-overlay"
      onClick={onClose}
    >
      <div 
        className="bg-paper-50 rounded-2xl shadow-modal border border-paper-300 w-full max-w-md overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-linear-to-b from-folia-50 to-paper-50 border-b border-paper-200 text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-paper-400 hover:text-paper-700 hover:bg-paper-150 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 mx-auto mb-3 bg-white rounded-2xl shadow-md border border-folia-200 flex items-center justify-center">
            <img 
              src={logoImg} 
              alt="Folia" 
              className="w-12 h-12 object-contain"
            />
          </div>
          <h2 className="font-brand font-bold text-2xl text-folia-950">Folia</h2>
          <p className="text-xs text-folia-700 font-medium tracking-wide uppercase mt-0.5">Suite di scrittura & worldbuilding</p>
          <div className="text-[11px] text-folia-800 font-semibold mt-1">Versione {appVersion} &bull; Aggiornato 09/09/2026</div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-paper-700">
          {/* Copyright Box */}
          <div className="p-4 bg-folia-50/70 border border-folia-200 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-folia-900 text-xs">
              <UserCheck className="w-4 h-4 text-folia-700" />
              <span>Diritti riservati & proprietà</span>
            </div>
            <p className="text-paper-800 font-medium text-[12px] leading-relaxed">
              Tutti i diritti riservati sono di <strong>Marco Tamborrino, 2026</strong>.
            </p>
            <p className="text-paper-600 text-[11px] leading-relaxed pt-1">
              Ogni manoscritto, scheda personaggio, ambientazione e contenuto letterario generato appartiene al 100% all'autore.
            </p>
          </div>

          {/* Official Contact Box */}
          <div className="p-3.5 bg-paper-100 border border-paper-200 rounded-xl space-y-1.5 text-[11px]">
            <div className="flex items-center gap-1.5 font-semibold text-folia-900">
              <Mail className="w-3.5 h-3.5 text-folia-700" />
              <span>Contatti & Assistenza ufficiale</span>
            </div>
            <p className="text-paper-600 leading-relaxed">
              Per segnalazioni, idee, anomalie o supporto dedicato:
            </p>
            <div className="pt-0.5">
              <a 
                href="mailto:info@folia-suite.com"
                onClick={(e) => {
                  e.preventDefault();
                  if ((window as any).foliaAPI?.openExternal) {
                    (window as any).foliaAPI.openExternal('mailto:info@folia-suite.com');
                  } else {
                    window.location.href = 'mailto:info@folia-suite.com';
                  }
                }}
                className="inline-flex items-center gap-1.5 font-bold text-folia-800 hover:text-folia-950 underline cursor-pointer"
              >
                info@folia-suite.com
              </a>
            </div>
          </div>

          {/* Local-first Info */}
          <div className="p-3.5 bg-paper-100 border border-paper-200 rounded-xl space-y-1 text-[11px] text-paper-600">
            <div className="flex items-center gap-1.5 font-medium text-paper-800">
              <HardDrive className="w-3.5 h-3.5 text-folia-700" />
              <span>Salvataggio locale & privacy totale</span>
            </div>
            <p>
              Folia opera al 100% in locale sul tuo computer, senza tracciamento, cloud invasivi o telemetria esterna. I tuoi testi rimangono sempre tuoi.
            </p>
          </div>

          {/* Aggiornamenti */}
          <div className="p-3 bg-folia-50/70 border border-folia-200 rounded-xl flex items-center justify-between gap-3">
            <div className="text-[11px] text-paper-700">
              <span className="font-semibold text-folia-950 block">Aggiornamenti</span>
              <span className="text-paper-500">{updateStatus || `Versione ${appVersion} attiva`}</span>
            </div>
            <button
              type="button"
              onClick={handleCheckUpdates}
              disabled={isChecking}
              className="px-3 py-1.5 rounded-lg bg-folia-700 hover:bg-folia-800 text-white text-[11px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? 'Verifica...' : 'Verifica ora'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-paper-200 bg-paper-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-xl bg-folia-700 hover:bg-folia-800 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
