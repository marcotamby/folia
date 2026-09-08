import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  ExternalLink,
  Filter
} from 'lucide-react';
import { DocumentComment } from '../../types';

interface CommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  comments: DocumentComment[];
  selectedText?: string;
  defaultAuthor?: string;
  activeCommentId?: string | null;
  onAddComment: (text: string, quotedText?: string) => void;
  onToggleResolveComment: (id: string) => void;
  onDeleteComment: (id: string) => void;
  onJumpToCommentInText?: (comment: DocumentComment) => void;
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  isOpen,
  onClose,
  comments,
  selectedText,
  defaultAuthor = 'Autore',
  activeCommentId,
  onAddComment,
  onToggleResolveComment,
  onDeleteComment,
  onJumpToCommentInText
}) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [filterResolved, setFilterResolved] = useState<'all' | 'open' | 'resolved'>('all');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment(newCommentText.trim(), selectedText || undefined);
    setNewCommentText('');
  };

  const filteredComments = comments.filter(c => {
    if (filterResolved === 'open') return !c.resolved;
    if (filterResolved === 'resolved') return c.resolved;
    return true;
  });

  const openCount = comments.filter(c => !c.resolved).length;

  return (
    <div className="w-80 md:w-88 border-l border-paper-300 bg-paper-50/95 backdrop-blur-md flex flex-col h-full z-20 shrink-0 shadow-lg animate-in slide-in-from-right-4 duration-200 select-none">
      {/* Drawer Header */}
      <div className="p-4 border-b border-paper-200 flex items-center justify-between bg-paper-100/70">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-folia-100 text-folia-800 rounded-lg">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-brand font-bold text-sm text-paper-900">Commenti</h3>
            <p className="text-[11px] text-paper-500">{openCount} in sospeso su {comments.length}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-paper-400 hover:text-paper-700 hover:bg-paper-200 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-paper-200 text-xs bg-paper-50">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setFilterResolved('all')}
            className={`px-2 py-0.5 rounded-md font-medium text-[11px] transition-colors cursor-pointer ${
              filterResolved === 'all' ? 'bg-folia-800 text-white font-semibold' : 'text-paper-600 hover:bg-paper-200'
            }`}
          >
            Tutti ({comments.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterResolved('open')}
            className={`px-2 py-0.5 rounded-md font-medium text-[11px] transition-colors cursor-pointer ${
              filterResolved === 'open' ? 'bg-folia-800 text-white font-semibold' : 'text-paper-600 hover:bg-paper-200'
            }`}
          >
            Aperti ({openCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterResolved('resolved')}
            className={`px-2 py-0.5 rounded-md font-medium text-[11px] transition-colors cursor-pointer ${
              filterResolved === 'resolved' ? 'bg-folia-800 text-white font-semibold' : 'text-paper-600 hover:bg-paper-200'
            }`}
          >
            Risolti ({comments.length - openCount})
          </button>
        </div>
      </div>

      {/* New Comment Composer (at top) */}
      <form onSubmit={handleSubmit} className="p-3 border-b border-paper-200 bg-white/70 space-y-2">
        {selectedText ? (
          <div className="p-2 bg-amber-50/70 border border-amber-200 rounded-lg text-[11px] text-amber-900 leading-snug">
            <span className="font-semibold block text-[10px] uppercase text-amber-700">Testo selezionato:</span>
            <span className="italic line-clamp-2">"{selectedText}"</span>
          </div>
        ) : null}

        <div className="relative">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder={selectedText ? "Scrivi un commento su questo testo..." : "Aggiungi una nota generale al capitolo..."}
            rows={2}
            className="w-full p-2.5 bg-paper-100/80 border border-paper-250 rounded-xl text-xs text-paper-900 placeholder:text-paper-400 focus:outline-hidden focus:bg-white focus:border-folia-600 focus:ring-1 focus:ring-folia-600 font-sans resize-none"
          />
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <span className="text-[10.5px] text-paper-400">Da: <strong>{defaultAuthor}</strong></span>
          <button
            type="submit"
            disabled={!newCommentText.trim()}
            className="flex items-center gap-1.5 px-3 py-1 bg-folia-800 hover:bg-folia-900 disabled:opacity-35 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
          >
            <Send className="w-3 h-3" />
            <span>Invia</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredComments.length > 0 ? (
          filteredComments.map((comment) => (
            <div
              key={comment.id}
              id={`comment-card-${comment.id}`}
              onClick={() => onJumpToCommentInText?.(comment)}
              className={`p-3 rounded-xl border transition-all space-y-2 select-text cursor-pointer ${
                activeCommentId === comment.id
                  ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-300/80 shadow-md'
                  : comment.resolved
                  ? 'bg-paper-100/60 border-paper-200 opacity-60 hover:opacity-90'
                  : 'bg-white border-paper-300 shadow-2xs hover:border-folia-400 hover:shadow-xs'
              }`}
            >
              {/* Header: Author + Date */}
              <div className="flex items-center justify-between text-[11px] select-none">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-folia-100 text-folia-900 font-bold text-[10px] flex items-center justify-center font-sans">
                    {comment.author ? comment.author[0].toUpperCase() : 'A'}
                  </div>
                  <span className="font-semibold text-paper-900">{comment.author}</span>
                </div>
                <span className="text-[10px] text-paper-400">
                  {new Date(comment.createdAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}
                </span>
              </div>

              {/* Quoted Text (if any) */}
              {comment.quotedText && (
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    onJumpToCommentInText?.(comment);
                  }}
                  title="Clicca per evidenziare nel testo"
                  className="p-1.5 bg-paper-100/70 border-l-2 border-folia-600 rounded-r text-[11px] text-paper-700 italic line-clamp-2 cursor-pointer hover:bg-paper-200/60 transition-colors select-none"
                >
                  "{comment.quotedText}"
                </div>
              )}

              {/* Comment Content */}
              <p className="text-xs text-paper-800 leading-relaxed whitespace-pre-wrap font-sans">
                {comment.text}
              </p>

              {/* Footer: Resolve button + Delete */}
              <div className="flex items-center justify-between pt-1 border-t border-paper-150 text-[11px] select-none">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleResolveComment(comment.id);
                  }}
                  className={`flex items-center gap-1 font-medium transition-colors cursor-pointer ${
                    comment.resolved ? 'text-emerald-700 hover:text-emerald-800' : 'text-paper-500 hover:text-paper-900'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${comment.resolved ? 'text-emerald-600' : 'text-paper-400'}`} />
                  <span>{comment.resolved ? 'Risolto' : 'Segna come risolto'}</span>
                </button>

                <div className="flex items-center gap-1">
                  {comment.quotedText && onJumpToCommentInText && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onJumpToCommentInText(comment);
                      }}
                      title="Vai al punto nel testo"
                      className="p-1 text-paper-400 hover:text-folia-800 rounded transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteComment(comment.id);
                    }}
                    title="Elimina commento"
                    className="p-1 text-paper-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-paper-400 space-y-2">
            <MessageSquare className="w-8 h-8 stroke-1 text-paper-300" />
            <p className="text-xs">Nessun commento in questa vista.</p>
            <p className="text-[11px] text-paper-400 max-w-xs">
              Seleziona una porzione di testo nel capitolo per lasciare una nota mirata.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
