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
  placement?: 'top' | 'bottom';
  onNavigate: (type: 'character' | 'world', id: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

interface SummaryItem {
  label: string;
  value: string;
}

const getCharacterSummaryItems = (c: Character | null): SummaryItem[] => {
  if (!c) return [];
  const items: SummaryItem[] = [];
  if (c.goal?.trim()) items.push({ label: 'Obiettivo', value: c.goal.trim() });
  if (c.physicalDesc?.trim()) items.push({ label: 'Aspetto fisico', value: c.physicalDesc.trim() });
  if (c.occupation?.trim()) items.push({ label: 'Occupazione', value: c.occupation.trim() });
  if (c.psychology?.trim()) items.push({ label: 'Psicologia', value: c.psychology.trim() });
  if (c.flaw?.trim()) items.push({ label: 'Punto debole', value: c.flaw.trim() });
  if (c.strength?.trim()) items.push({ label: 'Punto di forza', value: c.strength.trim() });
  if (c.need?.trim()) items.push({ label: 'Bisogno interiore', value: c.need.trim() });
  if (c.archetype?.trim()) items.push({ label: 'Archetipo', value: c.archetype.trim() });
  if (c.age?.trim()) items.push({ label: 'Età', value: c.age.trim() });
  if (c.dndClass || c.dndRace) {
    const dnd = [c.dndRace, c.dndClass].filter(Boolean).join(' ');
    if (dnd.trim()) items.push({ label: 'Razza / Classe', value: dnd.trim() });
  }
  return items;
};

const getCharacterRoleInfo = (role?: string) => {
  switch (role) {
    case 'protagonist':
      return {
        label: 'Protagonista',
        dotClass: 'bg-[#0284c7] ring-1 ring-[#0369a1]/35',
        badgeClass: 'bg-sky-50 text-sky-900 border-sky-200/80',
        badgeDot: 'bg-[#0284c7]',
        bulletDot: 'bg-[#0284c7]',
        avatarClass: 'bg-sky-50 text-sky-800 border-sky-200/80',
        avatarIcon: 'text-sky-700'
      };
    case 'antagonist':
      return {
        label: 'Antagonista',
        dotClass: 'bg-[#a21caf] ring-1 ring-[#86198f]/35',
        badgeClass: 'bg-fuchsia-50 text-fuchsia-950 border-fuchsia-200/80',
        badgeDot: 'bg-[#a21caf]',
        bulletDot: 'bg-[#a21caf]',
        avatarClass: 'bg-fuchsia-50 text-fuchsia-900 border-fuchsia-200/80',
        avatarIcon: 'text-fuchsia-800'
      };
    case 'deuteragonist':
      return {
        label: 'Deuteragonista',
        dotClass: 'bg-emerald-500 ring-1 ring-emerald-600/20',
        badgeClass: 'bg-folia-50 text-folia-800 border-folia-200',
        badgeDot: 'bg-folia-600',
        bulletDot: 'bg-folia-600',
        avatarClass: 'bg-folia-100 text-folia-800 border-folia-200',
        avatarIcon: 'text-folia-700'
      };
    case 'rival':
      return {
        label: 'Rivale',
        dotClass: 'bg-emerald-500 ring-1 ring-emerald-600/20',
        badgeClass: 'bg-folia-50 text-folia-800 border-folia-200',
        badgeDot: 'bg-folia-600',
        bulletDot: 'bg-folia-600',
        avatarClass: 'bg-folia-100 text-folia-800 border-folia-200',
        avatarIcon: 'text-folia-700'
      };
    case 'mentor':
      return {
        label: 'Mentore',
        dotClass: 'bg-emerald-500 ring-1 ring-emerald-600/20',
        badgeClass: 'bg-folia-50 text-folia-800 border-folia-200',
        badgeDot: 'bg-folia-600',
        bulletDot: 'bg-folia-600',
        avatarClass: 'bg-folia-100 text-folia-800 border-folia-200',
        avatarIcon: 'text-folia-700'
      };
    case 'sidekick':
      return {
        label: 'Spalla / alleato',
        dotClass: 'bg-emerald-500 ring-1 ring-emerald-600/20',
        badgeClass: 'bg-folia-50 text-folia-800 border-folia-200',
        badgeDot: 'bg-folia-600',
        bulletDot: 'bg-folia-600',
        avatarClass: 'bg-folia-100 text-folia-800 border-folia-200',
        avatarIcon: 'text-folia-700'
      };
    case 'love_interest':
      return {
        label: 'Interesse amoroso',
        dotClass: 'bg-emerald-500 ring-1 ring-emerald-600/20',
        badgeClass: 'bg-folia-50 text-folia-800 border-folia-200',
        badgeDot: 'bg-folia-600',
        bulletDot: 'bg-folia-600',
        avatarClass: 'bg-folia-100 text-folia-800 border-folia-200',
        avatarIcon: 'text-folia-700'
      };
    case 'traitor':
      return {
        label: 'Traditore / Falso alleato',
        dotClass: 'bg-emerald-500 ring-1 ring-emerald-600/20',
        badgeClass: 'bg-folia-50 text-folia-800 border-folia-200',
        badgeDot: 'bg-folia-600',
        bulletDot: 'bg-folia-600',
        avatarClass: 'bg-folia-100 text-folia-800 border-folia-200',
        avatarIcon: 'text-folia-700'
      };
    case 'herald':
      return {
        label: 'Araldo / Messaggero',
        dotClass: 'bg-emerald-500 ring-1 ring-emerald-600/20',
        badgeClass: 'bg-folia-50 text-folia-800 border-folia-200',
        badgeDot: 'bg-folia-600',
        bulletDot: 'bg-folia-600',
        avatarClass: 'bg-folia-100 text-folia-800 border-folia-200',
        avatarIcon: 'text-folia-700'
      };
    case 'guardian':
      return {
        label: 'Guardiano / Ostacolo',
        dotClass: 'bg-emerald-500 ring-1 ring-emerald-600/20',
        badgeClass: 'bg-folia-50 text-folia-800 border-folia-200',
        badgeDot: 'bg-folia-600',
        bulletDot: 'bg-folia-600',
        avatarClass: 'bg-folia-100 text-folia-800 border-folia-200',
        avatarIcon: 'text-folia-700'
      };
    case 'supporting':
      return {
        label: 'Personaggio secondario',
        dotClass: 'bg-emerald-500 ring-1 ring-emerald-600/20',
        badgeClass: 'bg-folia-50 text-folia-800 border-folia-200',
        badgeDot: 'bg-folia-600',
        bulletDot: 'bg-folia-600',
        avatarClass: 'bg-folia-100 text-folia-800 border-folia-200',
        avatarIcon: 'text-folia-700'
      };
    default:
      return {
        label: role || 'Personaggio',
        dotClass: 'bg-emerald-500 ring-1 ring-emerald-600/20',
        badgeClass: 'bg-folia-50 text-folia-800 border-folia-200',
        badgeDot: 'bg-folia-600',
        bulletDot: 'bg-folia-600',
        avatarClass: 'bg-folia-100 text-folia-800 border-folia-200',
        avatarIcon: 'text-folia-700'
      };
  }
};

const getWorldSummaryItems = (w: WorldEntry | null): SummaryItem[] => {
  if (!w) return [];
  const items: SummaryItem[] = [];
  if (w.atmosphere?.trim()) items.push({ label: 'Atmosfera', value: w.atmosphere.trim() });
  if (w.inhabitants?.trim()) items.push({ label: 'Abitanti', value: w.inhabitants.trim() });
  if (w.rules?.trim()) items.push({ label: 'Regole', value: w.rules.trim() });
  if (w.secrets?.trim()) items.push({ label: 'Segreti', value: w.secrets.trim() });
  if (w.description?.trim()) items.push({ label: 'Descrizione', value: w.description.trim() });
  return items;
};

export const InterlinkHoverCard: React.FC<InterlinkHoverCardProps> = ({
  entity,
  character,
  worldEntry,
  position,
  placement = 'bottom',
  onNavigate,
  onMouseEnter,
  onMouseLeave
}) => {
  if (!entity || !position) return null;

  const isCharacter = entity.type === 'character';
  const charSummaryItems = getCharacterSummaryItems(character);
  const worldSummaryItems = getWorldSummaryItems(worldEntry);
  const roleInfo = getCharacterRoleInfo(character?.role);

  // Clamping X so it never clips outside the viewport
  const clampedX = Math.min(Math.max(170, position.x), window.innerWidth - 170);
  const roundedX = Math.round(clampedX);
  const roundedY = Math.round(position.y);
  const isBottom = placement === 'bottom';

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        top: isBottom ? `${roundedY + 8}px` : `${roundedY - 8}px`,
        left: `${roundedX}px`,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
      }}
      className={`fixed z-50 transform -translate-x-1/2 ${
        isBottom ? 'mt-2' : '-translate-y-full mb-2'
      } w-80 bg-white rounded-2xl border border-paper-300 shadow-xl p-3.5 text-xs select-none animate-in fade-in duration-100 antialiased folia-interlink-card`}
    >
      {/* Safe hover bridge between text and card */}
      <div 
        className={`absolute left-0 right-0 h-4 pointer-events-auto ${
          isBottom ? '-top-4' : '-bottom-4'
        }`} 
      />
      {isCharacter ? (
        <div className="space-y-2.5">
          {/* Top: Avatar/Icon + Role Badge */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-9 h-9 rounded-xl overflow-hidden border flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs ${character?.imageUrl ? 'border-paper-250 bg-paper-100' : roleInfo.avatarClass}`}>
                {character?.imageUrl ? (
                  <img
                    src={character.imageUrl}
                    alt={character.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className={`w-4 h-4 ${roleInfo.avatarIcon}`} />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${roleInfo.dotClass}`} />
                  <h4 className="font-brand font-bold text-sm text-paper-950 leading-tight truncate">
                    {character?.name || entity.name}
                  </h4>
                </div>
                {character?.alias && (
                  <span className="text-[10px] text-paper-600 font-sans truncate block">"{character.alias}"</span>
                )}
              </div>
            </div>

            {character?.role && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 capitalize ml-1 ${roleInfo.badgeClass}`}>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${roleInfo.badgeDot}`} />
                <span>{roleInfo.label}</span>
              </span>
            )}
          </div>

          {/* Bullet Points Summary */}
          {charSummaryItems.length > 0 ? (
            <div className="bg-[#F9F8F5] p-2.5 rounded-xl border border-paper-250 space-y-1.5">
              <ul className="space-y-1.5">
                {charSummaryItems.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-[11px] text-paper-800 leading-snug">
                    <span className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${roleInfo.bulletDot}`} />
                    <div className="line-clamp-2 min-w-0">
                      <span className="font-semibold text-paper-950">{item.label}:</span>{' '}
                      <span className="text-paper-700">{item.value}</span>
                    </div>
                  </li>
                ))}
              </ul>

              {charSummaryItems.length > 3 && (
                <div className="pt-1 border-t border-paper-200/70 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onNavigate('character', entity.id)}
                    className="text-[10.5px] font-medium text-folia-700 hover:text-folia-900 hover:underline inline-flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>... altro ({charSummaryItems.length - 3} dettagli)</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-[11px] text-paper-500 italic bg-[#F9F8F5] p-2 rounded-lg border border-paper-200">
              Scheda personaggio collegata
            </p>
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
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                {worldEntry?.imageUrl ? (
                  <img
                    src={worldEntry.imageUrl}
                    alt={worldEntry.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Compass className="w-4 h-4 text-amber-700" />
                )}
              </div>
              <div className="min-w-0">
                <h4 className="font-brand font-bold text-sm text-paper-950 leading-tight truncate">
                  {worldEntry?.name || entity.name}
                </h4>
                <span className="text-[10px] text-paper-600 font-sans truncate block">
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

          {/* Bullet Points Summary for World */}
          {worldSummaryItems.length > 0 ? (
            <div className="bg-[#F9F8F5] p-2.5 rounded-xl border border-paper-250 space-y-1.5">
              <ul className="space-y-1.5">
                {worldSummaryItems.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-[11px] text-paper-800 leading-snug">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1 shrink-0" />
                    <div className="line-clamp-2 min-w-0">
                      <span className="font-semibold text-paper-950">{item.label}:</span>{' '}
                      <span className="text-paper-700">{item.value}</span>
                    </div>
                  </li>
                ))}
              </ul>

              {worldSummaryItems.length > 3 && (
                <div className="pt-1 border-t border-paper-200/70 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onNavigate('world', entity.id)}
                    className="text-[10.5px] font-medium text-amber-700 hover:text-amber-900 hover:underline inline-flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>... altro ({worldSummaryItems.length - 3} dettagli)</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-[11px] text-paper-500 italic bg-[#F9F8F5] p-2 rounded-lg border border-paper-200">
              Scheda ambientazione collegata
            </p>
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
      {isBottom ? (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-px border-solid border-b-white border-b-8 border-x-transparent border-x-8 border-t-0 filter drop-shadow-xs" />
      ) : (
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-solid border-t-white border-t-8 border-x-transparent border-x-8 border-b-0 filter drop-shadow-xs" />
      )}
    </div>
  );
};
