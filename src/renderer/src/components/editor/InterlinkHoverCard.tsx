import React from 'react';
import { Users, Compass, ArrowRight, User, MapPin, Shield, Bookmark } from 'lucide-react';
import { Character, WorldEntry } from '../../types';

interface InterlinkHoverCardProps {
  entity: {
    type: 'character' | 'world';
    id: string;
    name: string;
  } | null;
  character: Character | null;
  worldEntry: WorldEntry | null;
  position: { x: number; y: number } | null;
  onNavigate: (type: 'character' | 'world', id: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const InterlinkHoverCard: React.FC<InterlinkHoverCardProps> = ({
  entity,
  character,
  worldEntry,
  position,
  onNavigate,
  onMouseEnter,
  onMouseLeave
}) => {
  if (!entity || !position) return null;

  const isCharacter = entity.type === 'character';

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
      className="fixed z-50 transform -translate-x-1/2 -translate-y-full mb-2 w-72 bg-white/95 backdrop-blur-md rounded-2xl border border-paper-300 shadow-modal p-4 text-xs select-none animate-in fade-in zoom-in-95 duration-150"
    >
      {isCharacter ? (
        <div className="space-y-2.5">
          {/* Top: Avatar/Icon + Role Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-folia-100 text-folia-800 border border-folia-200 flex items-center justify-center font-bold text-sm">
                <User className="w-4 h-4 text-folia-700" />
              </div>
              <div>
                <h4 className="font-brand font-bold text-sm text-paper-900 leading-tight">
                  {character?.name || entity.name}
                </h4>
                {character?.alias && (
                  <span className="text-[10px] text-paper-500 font-sans">"{character.alias}"</span>
                )}
              </div>
            </div>

            {character?.role && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-folia-50 text-folia-800 border border-folia-200 capitalize">
                {character.role === 'protagonist' ? 'Protagonista' :
                 character.role === 'antagonist' ? 'Antagonista' :
                 character.role === 'mentor' ? 'Mentore' :
                 character.role === 'sidekick' ? 'Spalla / alleato' :
                 character.role === 'love_interest' ? 'Interesse amoroso' : 'Personaggio secondario'}
              </span>
            )}
          </div>

          {/* Snippet Goal / Description */}
          {character?.goal ? (
            <p className="text-[11px] text-paper-600 line-clamp-2 leading-relaxed bg-paper-100/70 p-2 rounded-lg border border-paper-200">
              <span className="font-semibold text-paper-800">Obiettivo:</span> {character.goal}
            </p>
          ) : character?.archetype ? (
            <p className="text-[11px] text-paper-600 line-clamp-2 leading-relaxed bg-paper-100/70 p-2 rounded-lg border border-paper-200">
              <span className="font-semibold text-paper-800">Archetipo:</span> {character.archetype}
            </p>
          ) : (
            <p className="text-[11px] text-paper-400 italic">Scheda personaggio collegata</p>
          )}

          {/* Action Button */}
          <button
            onClick={() => onNavigate('character', entity.id)}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-folia-700 hover:bg-folia-800 text-white font-medium text-xs transition-colors shadow-2xs cursor-pointer group"
          >
            <span>Apri scheda personaggio</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {/* World Entry Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center font-bold text-sm">
                <Compass className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <h4 className="font-brand font-bold text-sm text-paper-900 leading-tight">
                  {worldEntry?.name || entity.name}
                </h4>
                <span className="text-[10px] text-paper-500 font-sans">
                  {worldEntry?.category === 'location' ? 'Luogo / geografia' :
                   worldEntry?.category === 'city' ? 'Città / insediamento' :
                   worldEntry?.category === 'faction' ? 'Fazione / ordine' :
                   worldEntry?.category === 'magic' ? 'Magia / tecnologia' :
                   worldEntry?.category === 'religion' ? 'Religione / culto' :
                   worldEntry?.category === 'item' ? 'Oggetto / reliquia' : 'Ambientazione'}
                </span>
              </div>
            </div>
          </div>

          {/* Snippet Atmosphere or Description */}
          {worldEntry?.atmosphere ? (
            <p className="text-[11px] text-paper-600 line-clamp-2 leading-relaxed bg-paper-100/70 p-2 rounded-lg border border-paper-200">
              <span className="font-semibold text-paper-800">Atmosfera:</span> {worldEntry.atmosphere}
            </p>
          ) : worldEntry?.secrets ? (
            <p className="text-[11px] text-paper-600 line-clamp-2 leading-relaxed bg-paper-100/70 p-2 rounded-lg border border-paper-200">
              <span className="font-semibold text-paper-800">Segreti:</span> {worldEntry.secrets}
            </p>
          ) : (
            <p className="text-[11px] text-paper-400 italic">Scheda ambientazione collegata</p>
          )}

          {/* Action Button */}
          <button
            onClick={() => onNavigate('world', entity.id)}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-medium text-xs transition-colors shadow-2xs cursor-pointer group"
          >
            <span>Apri scheda ambientazione</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}

      {/* Pointer arrow */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-solid border-t-white border-t-8 border-x-transparent border-x-8 border-b-0 filter drop-shadow-xs" />
    </div>
  );
};
