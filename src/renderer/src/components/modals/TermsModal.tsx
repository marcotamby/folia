import React, { useState } from 'react';
import { ShieldCheck, FileText, Check, Lock } from 'lucide-react';
import { Language } from '../../types';
import { Checkbox } from '../common/Checkbox';

interface TermsModalProps {
  isOpen: boolean;
  onAccept: () => void;
  lang: Language;
  t: (key: string) => string;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onAccept, lang, t }) => {
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  if (!isOpen) return null;

  const isIt = lang === 'it';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in select-none">
      <div 
        className="bg-paper-50 rounded-2xl shadow-modal border border-paper-300 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Green Folia Gradient */}
        <div className="p-6 bg-linear-to-b from-folia-50 to-paper-50 border-b border-paper-200 text-center">
          <div className="w-14 h-14 mx-auto mb-3 bg-white rounded-2xl shadow-md border border-folia-200 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-folia-700" />
          </div>
          <h2 className="font-brand font-bold text-2xl text-paper-900">{t('terms_modal.title')}</h2>
          <p className="text-xs text-paper-600 mt-1 max-w-sm mx-auto font-sans">{t('terms_modal.subtitle')}</p>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="bg-paper-100 p-4 rounded-xl border border-paper-200 text-xs text-paper-700 leading-relaxed flex items-start gap-3">
            <Lock className="w-4 h-4 text-folia-700 shrink-0 mt-0.5" />
            <div>
              <strong>{isIt ? '100% locale & riservato:' : '100% Local & Private:'}</strong>{' '}
              {t('terms_modal.intro')}
            </div>
          </div>

          {showFullText ? (
            <div className="p-4 bg-paper-150 rounded-xl border border-paper-200 text-[11px] text-paper-600 font-mono max-h-48 overflow-y-auto space-y-2 whitespace-pre-line">
              {isIt ? (
                `TERMINI E CONDIZIONI & PRIVACY POLICY FOLIA:
1. Proprietà intellettuale: Ogni manoscritto, scheda o testo creato con Folia appartiene al 100% all'autore. Nessun dato viene trasmesso a server esterni.
2. Architettura locale: L'applicazione salva i file esclusivamente sul disco rigido locale del tuo computer.
3. Salvataggio automatico: Il sistema esegue un salvataggio automatico programmato ogni 2 minuti.
4. Privacy GDPR: Nessuna telemetria invasiva né raccolta di dati profilanti.
5. Licenza: Concessione d'uso personale non esclusiva.`
              ) : (
                `FOLIA TERMS OF SERVICE & PRIVACY POLICY:
1. Intellectual Property: Every manuscript and note created with Folia belongs 100% to the author. No text is uploaded to external clouds.
2. Local-First: The application writes files solely to your local storage drive.
3. Autosave: Automated background save occurs every 2 minutes.
4. Privacy: Zero tracking, no telemetry, complete compliance with privacy best practices.
5. License: Personal, non-exclusive license.`
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowFullText(true)}
              className="text-xs text-folia-700 hover:text-folia-800 font-medium flex items-center gap-1.5 underline decoration-folia-400 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              {t('terms_modal.view_full_terms')}
            </button>
          )}

          {/* Checkboxes */}
          <div className="flex flex-col space-y-3 pt-2">
            <Checkbox
              align="start"
              checked={agreeTerms}
              onChange={setAgreeTerms}
              label={
                <span className="text-xs font-medium text-paper-800 group-hover:text-paper-900">
                  {t('terms_modal.agree_terms')} <span className="text-red-500">*</span>
                </span>
              }
            />

            <Checkbox
              align="start"
              checked={agreePrivacy}
              onChange={setAgreePrivacy}
              label={
                <span className="text-xs font-medium text-paper-800 group-hover:text-paper-900">
                  {t('terms_modal.agree_privacy')} <span className="text-red-500">*</span>
                </span>
              }
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-paper-200 bg-paper-100 flex items-center justify-end">
          <button
            onClick={onAccept}
            disabled={!agreeTerms || !agreePrivacy}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs transition-all shadow-xs ${
              agreeTerms && agreePrivacy
                ? 'bg-folia-700 hover:bg-folia-800 text-white cursor-pointer hover:shadow-md'
                : 'bg-paper-300 text-paper-500 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            {t('terms_modal.continue_btn')}
          </button>
        </div>
      </div>
    </div>
  );
};
