import React, { useState } from 'react';
import { X, FileDown, FileText, Printer, CheckCircle, FileCode, BookOpen } from 'lucide-react';
import { Project } from '../../types';
import { compileManuscript, compileToWordDocument, generateEpub } from '../../utils/export';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  t: (key: string) => string;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, project, t }) => {
  const [format, setFormat] = useState<'pdf' | 'docx' | 'epub' | 'markdown' | 'txt'>('pdf');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exporting, setExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setExporting(true);
    setExportSuccess(false);

    try {
      const { text, markdown } = compileManuscript(project, includeMetadata);

      if (format === 'pdf') {
        if ((window as any).foliaAPI?.printToPDF) {
          await (window as any).foliaAPI.printToPDF();
        } else {
          window.print();
        }
        setExportSuccess(true);
      } else if (format === 'docx') {
        const wordDoc = compileToWordDocument(project, includeMetadata);
        if ((window as any).foliaAPI?.exportDocument) {
          const res = await (window as any).foliaAPI.exportDocument('docx', project.title, wordDoc);
          if (res?.success) setExportSuccess(true);
        } else {
          downloadBlob(wordDoc, `${project.title}.doc`, 'application/msword');
          setExportSuccess(true);
        }
      } else if (format === 'epub') {
        const epubData = await generateEpub(project, includeMetadata);
        let binary = '';
        const len = epubData.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(epubData[i]);
        }
        const base64Epub = window.btoa(binary);

        if ((window as any).foliaAPI?.exportDocument) {
          const res = await (window as any).foliaAPI.exportDocument('epub', project.title, `base64:${base64Epub}`);
          if (res?.success) setExportSuccess(true);
        } else {
          const blob = new Blob([epubData], { type: 'application/epub+zip' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${project.title}.epub`;
          a.click();
          URL.revokeObjectURL(url);
          setExportSuccess(true);
        }
      } else if (format === 'markdown') {
        if ((window as any).foliaAPI?.exportDocument) {
          const res = await (window as any).foliaAPI.exportDocument('markdown', project.title, markdown);
          if (res?.success) setExportSuccess(true);
        } else {
          downloadBlob(markdown, `${project.title}.md`, 'text/markdown');
          setExportSuccess(true);
        }
      } else if (format === 'txt') {
        if ((window as any).foliaAPI?.exportDocument) {
          const res = await (window as any).foliaAPI.exportDocument('txt', project.title, text);
          if (res?.success) setExportSuccess(true);
        } else {
          downloadBlob(text, `${project.title}.txt`, 'text/plain');
          setExportSuccess(true);
        }
      }
    } catch (e) {
      console.error('Export error:', e);
    } finally {
      setExporting(false);
    }
  };

  const downloadBlob = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4 animate-in fade-in">
      <div 
        className="bg-paper-50 rounded-2xl shadow-modal border border-paper-300 w-full max-w-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-paper-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-folia-100 text-folia-800 rounded-xl">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-brand font-semibold text-lg text-paper-900">{t('export_modal.title')}</h3>
              <p className="text-xs text-paper-500">{project.title}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-paper-400 hover:text-paper-700 hover:bg-paper-150 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-paper-700 uppercase tracking-wider mb-2.5">
              {t('export_modal.format')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  format === 'pdf'
                    ? 'border-folia-600 bg-folia-50/70 text-folia-900 shadow-xs ring-1 ring-folia-600'
                    : 'border-paper-200 bg-paper-50 hover:bg-paper-100 text-paper-700'
                }`}
              >
                <Printer className="w-5 h-5 text-folia-700 shrink-0" />
                <div>
                  <div className="text-xs font-semibold">{t('export_modal.pdf')}</div>
                  <div className="text-[10px] text-paper-500">Impaginato pronto stampa</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat('docx')}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  format === 'docx'
                    ? 'border-folia-600 bg-folia-50/70 text-folia-900 shadow-xs ring-1 ring-folia-600'
                    : 'border-paper-200 bg-paper-50 hover:bg-paper-100 text-paper-700'
                }`}
              >
                <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <div className="text-xs font-semibold">{t('export_modal.docx')}</div>
                  <div className="text-[10px] text-paper-500">Compatibile Word & Pages</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat('epub')}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  format === 'epub'
                    ? 'border-folia-600 bg-folia-50/70 text-folia-900 shadow-xs ring-1 ring-folia-600'
                    : 'border-paper-200 bg-paper-50 hover:bg-paper-100 text-paper-700'
                }`}
              >
                <BookOpen className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <div className="text-xs font-semibold">E-Book EPUB (.epub)</div>
                  <div className="text-[10px] text-paper-500">Kindle, Kobo, Apple Books</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat('markdown')}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  format === 'markdown'
                    ? 'border-folia-600 bg-folia-50/70 text-folia-900 shadow-xs ring-1 ring-folia-600'
                    : 'border-paper-200 bg-paper-50 hover:bg-paper-100 text-paper-700'
                }`}
              >
                <FileCode className="w-5 h-5 text-folia-700 shrink-0" />
                <div>
                  <div className="text-xs font-semibold">{t('export_modal.markdown')}</div>
                  <div className="text-[10px] text-paper-500">Per Obsidian, Notion, Web</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat('txt')}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  format === 'txt'
                    ? 'border-folia-600 bg-folia-50/70 text-folia-900 shadow-xs ring-1 ring-folia-600'
                    : 'border-paper-200 bg-paper-50 hover:bg-paper-100 text-paper-700'
                }`}
              >
                <FileText className="w-5 h-5 text-paper-500 shrink-0" />
                <div>
                  <div className="text-xs font-semibold">{t('export_modal.txt')}</div>
                  <div className="text-[10px] text-paper-500">Testo puro senza formattazione</div>
                </div>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-paper-200">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-paper-700 font-medium select-none">
              <input
                type="checkbox"
                checked={includeMetadata}
                onChange={(e) => setIncludeMetadata(e.target.checked)}
                className="h-4 w-4 rounded-md border-paper-300 text-folia-700 focus:ring-folia-600"
              />
              <span>{t('export_modal.include_characters')}</span>
            </label>
          </div>

          {exportSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-xs text-green-800 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
              <span>{t('export_modal.success')}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-paper-200 bg-paper-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-paper-600 hover:bg-paper-200 transition-colors"
          >
            Annulla
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-folia-700 hover:bg-folia-800 text-white text-xs font-medium shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            {t('export_modal.export_btn')}
          </button>
        </div>
      </div>
    </div>
  );
};
