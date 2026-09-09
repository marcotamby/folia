import React, { useState, useEffect } from 'react';
import { ArrowDownCircle, CheckCircle2, RefreshCw, X, AlertCircle } from 'lucide-react';

interface UpdateState {
  status: 'idle' | 'checking' | 'available' | 'downloading' | 'downloaded' | 'error' | 'up-to-date';
  version?: string;
  percent?: number;
  error?: string;
}

export const UpdateNotification: React.FC = () => {
  const [update, setUpdate] = useState<UpdateState>({ status: 'idle' });
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const folia = (window as any).foliaAPI;
    if (!folia?.onUpdateStatus) return;

    const unsubscribe = folia.onUpdateStatus((data: any) => {
      if (!data) return;
      if (data.status === 'checking') {
        // Quiet check, do not show popup
      } else if (data.status === 'available') {
        setUpdate({
          status: 'available',
          version: data.version
        });
        setIsDismissed(false);
      } else if (data.status === 'downloading') {
        setUpdate(prev => ({
          ...prev,
          status: 'downloading',
          percent: data.percent ?? 0
        }));
        setIsDismissed(false);
      } else if (data.status === 'downloaded') {
        setUpdate({
          status: 'downloaded',
          version: data.version
        });
        setIsDismissed(false);
      } else if (data.status === 'error') {
        setUpdate(prev => {
          if (prev.status === 'downloading' || prev.status === 'available') {
            return { status: 'error', error: data.error };
          }
          return prev;
        });
      }
    });

    return () => unsubscribe();
  }, []);

  if (isDismissed || update.status === 'idle' || update.status === 'up-to-date') {
    return null;
  }

  const handleRestart = () => {
    const folia = (window as any).foliaAPI;
    if (folia?.quitAndInstallUpdate) {
      folia.quitAndInstallUpdate();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="bg-paper-50 rounded-2xl shadow-xl border border-paper-300 p-4 relative overflow-hidden">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-folia-500 to-folia-700" />

        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-3 right-3 p-1 rounded-lg text-paper-400 hover:text-paper-700 hover:bg-paper-150 transition-colors cursor-pointer"
          title="Nascondi"
        >
          <X className="w-4 h-4" />
        </button>

        {update.status === 'downloaded' ? (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-green-100 text-green-700 shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="pr-4">
                <h4 className="font-semibold text-sm text-paper-900">
                  Folia {update.version ? `v${update.version}` : ''} è pronto!
                </h4>
                <p className="text-xs text-paper-600 mt-0.5">
                  L'aggiornamento è stato scaricato. Riavvia ora per applicare le novità o continua a scrivere (si aggiornerà alla chiusura).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleRestart}
                className="flex-1 px-3 py-2 bg-folia-700 hover:bg-folia-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Riavvia e aggiorna</span>
              </button>
              <button
                onClick={() => setIsDismissed(true)}
                className="px-3 py-2 bg-paper-150 hover:bg-paper-200 text-paper-700 text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                Più tardi
              </button>
            </div>
          </div>
        ) : update.status === 'downloading' || update.status === 'available' ? (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-folia-100 text-folia-700 shrink-0">
                <ArrowDownCircle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-semibold text-xs text-paper-900">
                    Nuovo aggiornamento disponibile {update.version ? `(v${update.version})` : ''}
                  </h4>
                </div>
                <p className="text-[11px] text-paper-500">
                  Download in background in corso...
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="w-full bg-paper-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-folia-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${Math.max(5, update.percent || 0)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-paper-400 font-mono">
                <span>Scaricamento file</span>
                <span>{update.percent ? `${update.percent}%` : 'Avvio...'}</span>
              </div>
            </div>
          </div>
        ) : update.status === 'error' ? (
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <p className="text-xs text-paper-600">
              Non è stato possibile completare il download automatico.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
