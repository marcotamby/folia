import React from 'react';
import { X, FileText, AlignLeft, BookOpen, Clock, Layers } from 'lucide-react';

export interface TextStats {
  words: number;
  charsWithSpaces: number;
  charsNoSpaces: number;
  paragraphs: number;
  pages: number;
  cartelle: number;
  readingTimeMinutes: number;
}

export interface SelectionStats {
  hasSelection: boolean;
  words: number;
  charsWithSpaces: number;
  charsNoSpaces: number;
  paragraphs: number;
}

interface WordCountModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  stats: TextStats;
  selectionStats: SelectionStats;
  projectWords?: number;
  projectChars?: number;
  projectCartelle?: number;
}

const formatReadingTime = (minutes: number): string => {
  if (minutes < 60) {
    return `~${minutes} ${minutes === 1 ? 'min' : 'min'}`;
  }
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  return remMinutes > 0 ? `~${hours}h ${remMinutes}m` : `~${hours}h`;
};

export const WordCountModal: React.FC<WordCountModalProps> = ({
  isOpen,
  onClose,
  documentTitle,
  stats,
  selectionStats,
  projectWords = 0,
  projectChars = 0,
  projectCartelle = 0,
}) => {
  if (!isOpen) return null;

  const effectiveCartelle = projectCartelle > 0 
    ? projectCartelle 
    : (projectChars > 0 ? (projectChars / 1800) : 0);

  const projectReadingMinutes = projectWords > 0 ? Math.max(1, Math.ceil(projectWords / 220)) : 0;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in folia-modal-overlay"
      onClick={onClose}
    >
      <div 
        className="bg-paper-50 rounded-2xl shadow-2xl border border-paper-250 w-full max-w-2xl overflow-hidden flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-paper-200 bg-paper-100/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-folia-100 text-folia-800 border border-folia-200/60 shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-paper-900 leading-tight">
                Conteggio parole e caratteri
              </h3>
              <p className="text-xs text-paper-500 truncate max-w-xs">
                {documentTitle || 'Capitolo corrente'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-paper-400 hover:text-paper-700 hover:bg-paper-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Main Comparison Table (like Word & Google Docs) */}
          <div className="bg-white rounded-xl border border-paper-200 shadow-2xs overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-paper-100/60 border-b border-paper-200 text-[11px] font-semibold text-paper-500 uppercase tracking-wider">
                  <th className="py-2.5 px-4">Statistica</th>
                  {selectionStats.hasSelection && (
                    <th className="py-2.5 px-4 text-folia-800 font-bold">Selezione</th>
                  )}
                  <th className="py-2.5 px-4 text-paper-700">Capitolo intero</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-150 text-sm">
                <tr>
                  <td className="py-2.5 px-4 font-medium text-paper-600 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-paper-400" />
                    <span>Pagine</span>
                  </td>
                  {selectionStats.hasSelection && (
                    <td className="py-2.5 px-4 text-paper-400 italic text-xs">—</td>
                  )}
                  <td className="py-2.5 px-4 font-bold text-paper-900">
                    {stats.pages}
                  </td>
                </tr>

                <tr className="bg-paper-50/50">
                  <td className="py-2.5 px-4 font-medium text-paper-600 flex items-center gap-2">
                    <AlignLeft className="w-4 h-4 text-paper-400" />
                    <span>Parole</span>
                  </td>
                  {selectionStats.hasSelection && (
                    <td className="py-2.5 px-4 font-bold text-folia-800">
                      {selectionStats.words.toLocaleString()}
                    </td>
                  )}
                  <td className="py-2.5 px-4 font-bold text-paper-900">
                    {stats.words.toLocaleString()}
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-4 font-medium text-paper-600">
                    <span className="font-semibold text-paper-800">Caratteri (spazi inclusi / battute)</span>
                  </td>
                  {selectionStats.hasSelection && (
                    <td className="py-2.5 px-4 font-bold text-folia-800">
                      {selectionStats.charsWithSpaces.toLocaleString()}
                    </td>
                  )}
                  <td className="py-2.5 px-4 font-bold text-paper-900">
                    {stats.charsWithSpaces.toLocaleString()}
                  </td>
                </tr>

                <tr className="bg-paper-50/50">
                  <td className="py-2.5 px-4 font-medium text-paper-600">
                    <span>Caratteri (spazi esclusi)</span>
                  </td>
                  {selectionStats.hasSelection && (
                    <td className="py-2.5 px-4 font-bold text-folia-800">
                      {selectionStats.charsNoSpaces.toLocaleString()}
                    </td>
                  )}
                  <td className="py-2.5 px-4 font-bold text-paper-900">
                    {stats.charsNoSpaces.toLocaleString()}
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-4 font-medium text-paper-600">
                    <span>Paragrafi</span>
                  </td>
                  {selectionStats.hasSelection && (
                    <td className="py-2.5 px-4 font-bold text-folia-800">
                      {selectionStats.paragraphs.toLocaleString()}
                    </td>
                  )}
                  <td className="py-2.5 px-4 font-bold text-paper-900">
                    {stats.paragraphs.toLocaleString()}
                  </td>
                </tr>

                <tr className="bg-folia-50/40">
                  <td className="py-2.5 px-4 font-semibold text-folia-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-folia-700" />
                    <span>Cartelle editoriali (1.800 battute)</span>
                  </td>
                  {selectionStats.hasSelection && (
                    <td className="py-2.5 px-4 font-bold text-folia-800">
                      {(selectionStats.charsWithSpaces / 1800).toFixed(1)}
                    </td>
                  )}
                  <td className="py-2.5 px-4 font-bold text-folia-950">
                    {stats.cartelle.toFixed(1)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-paper-100/70 rounded-xl border border-paper-200 flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-folia-100 text-folia-800 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-paper-500 font-medium truncate">Tempo di lettura stimato</p>
                <div className="flex items-center gap-x-2 gap-y-0.5 text-sm font-bold text-paper-900 flex-wrap">
                  <span title="Capitolo corrente" className="whitespace-nowrap">
                    {formatReadingTime(stats.readingTimeMinutes)} <span className="text-xs font-normal text-paper-500">(cap.)</span>
                  </span>
                  {projectReadingMinutes > 0 && (
                    <>
                      <span className="text-paper-300 font-normal select-none">•</span>
                      <span title="Intero progetto" className="text-folia-900 whitespace-nowrap">
                        {formatReadingTime(projectReadingMinutes)} <span className="text-xs font-normal text-paper-500">(progetto)</span>
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-paper-100/70 rounded-xl border border-paper-200 flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-paper-200 text-paper-700 shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-paper-500 font-medium truncate">Totale intero progetto</p>
                <p className="text-sm font-bold text-paper-900 whitespace-nowrap" title={`${projectWords.toLocaleString()} parole (${effectiveCartelle.toFixed(1)} cart.)`}>
                  {projectWords.toLocaleString()} parole <span className="text-xs font-medium text-paper-500">({effectiveCartelle.toFixed(1)} cart.)</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-paper-100/50 border-t border-paper-200 flex items-center justify-between">
          <span className="text-[11px] text-paper-500 italic">
            Scorciatoia rapida: <kbd className="px-1.5 py-0.5 bg-white border border-paper-250 rounded font-mono text-[10px] text-paper-700 shadow-2xs">Ctrl + Shift + C</kbd>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-folia-800 hover:bg-folia-900 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
