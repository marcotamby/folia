import React from 'react';
import { 
  Users, 
  Shield, 
  Heart, 
  Eye, 
  Dices, 
  Footprints, 
  Plus, 
  Minus, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { Character, DndCombatStats } from '../../../types';
import { calculateMod, formatMod } from './DndStatsSection';

interface DndPartyOverviewProps {
  characters: Character[];
  onSelectCharacter: (charId: string) => void;
  onUpdateCharacter: (char: Character) => void;
  onClose: () => void;
}

export const DndPartyOverview: React.FC<DndPartyOverviewProps> = ({
  characters,
  onSelectCharacter,
  onUpdateCharacter,
  onClose
}) => {
  // Party members are protagonists, or all characters if none are explicitly protagonists
  const partyMembers = characters.filter(c => c.role === 'protagonist');
  const displayList = partyMembers.length > 0 ? partyMembers : characters;

  const handleAdjustHp = (char: Character, amount: number) => {
    const currentCombat: DndCombatStats = char.dndData?.combat || {
      armorClass: 10,
      maxHp: 10,
      currentHp: 10,
      speed: '9m (30 ft)',
      hitDice: '1d8'
    };

    const newHp = Math.max(0, Math.min(currentCombat.maxHp + (currentCombat.tempHp || 0), currentCombat.currentHp + amount));
    const updatedCombat = { ...currentCombat, currentHp: newHp };

    onUpdateCharacter({
      ...char,
      dndData: {
        ...char.dndData,
        combat: updatedCombat
      },
      updatedAt: new Date().toISOString()
    });
  };

  const handleToggleInspiration = (char: Character) => {
    const currentCombat: DndCombatStats = char.dndData?.combat || {
      armorClass: 10,
      maxHp: 10,
      currentHp: 10,
      speed: '9m (30 ft)',
      hitDice: '1d8'
    };

    const updatedCombat = { ...currentCombat, inspiration: !currentCombat.inspiration };

    onUpdateCharacter({
      ...char,
      dndData: {
        ...char.dndData,
        combat: updatedCombat
      },
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="flex-1 h-full bg-paper-150 overflow-y-auto p-6 md:p-10 select-none animate-in fade-in duration-150">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="bg-paper-50 rounded-2xl border border-paper-250 p-6 shadow-page flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center shrink-0 shadow-xs">
              <Users className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-brand font-bold text-paper-900">
                  Schermo del Master • Riepilogo Party
                </h2>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  {displayList.length} Eroi
                </span>
              </div>
              <p className="text-xs text-paper-500 mt-0.5">
                Monitora contemporaneamente salute, CA, percezione passiva e ispirazione di tutti i PG durante la sessione
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-paper-200 hover:bg-paper-300 text-paper-800 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            Torna alla scheda singola
          </button>
        </div>

        {/* Party Grid */}
        {displayList.length === 0 ? (
          <div className="bg-paper-50 rounded-2xl border border-paper-250 p-12 text-center shadow-page space-y-3">
            <Users className="w-12 h-12 text-paper-300 mx-auto" />
            <h4 className="font-brand font-bold text-lg text-paper-800">
              Nessun personaggio nel party
            </h4>
            <p className="text-xs text-paper-500 max-w-sm mx-auto">
              Crea delle schede personaggio e assegna loro il ruolo "Party (PG / Eroi)" per monitorarli insieme in questa dashboard.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayList.map(char => {
              const combat = char.dndData?.combat;
              const stats = char.dndData?.stats;
              const spellcasting = char.dndData?.spellcasting;

              const maxHp = combat?.maxHp ?? 10;
              const currentHp = combat?.currentHp ?? 10;
              const tempHp = combat?.tempHp ?? 0;
              const ac = combat?.armorClass ?? 10;
              const speed = combat?.speed ?? '9m';
              const inspiration = combat?.inspiration ?? false;
              const conditions = combat?.conditions || [];

              const wisMod = calculateMod(stats?.wis ?? 10);
              const intMod = calculateMod(stats?.int ?? 10);
              const numericLevel = parseInt((char.archetype || '1').replace(/\D/g, ''), 10) || 1;
              const profBonus = combat?.proficiencyBonus ?? (Math.floor((numericLevel - 1) / 4) + 2);

              const passivePerc = combat?.passivePerception ?? (10 + wisMod);

              const hpPercent = maxHp > 0 ? Math.min(100, Math.max(0, Math.round((currentHp / maxHp) * 100))) : 0;

              return (
                <div 
                  key={char.id}
                  className="bg-paper-50 rounded-2xl border border-paper-250 p-5 shadow-page space-y-4 flex flex-col justify-between hover:border-folia-400 transition-all group"
                >
                  {/* Top Profile Header */}
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-amber-100/80 border border-amber-200 flex items-center justify-center text-amber-900 font-brand font-bold text-xl shrink-0 overflow-hidden shadow-xs">
                      {char.imageUrl ? (
                        <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{char.name?.charAt(0) || 'P'}</span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-brand font-bold text-base text-paper-900 truncate group-hover:text-folia-950">
                          {char.name || 'Senza nome'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => handleToggleInspiration(char)}
                          title={inspiration ? 'Ispirazione attiva (clicca per rimuovere)' : 'Assegna Ispirazione DM'}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            inspiration
                              ? 'text-amber-800 bg-amber-200 border border-amber-300 shadow-2xs'
                              : 'text-paper-300 hover:text-amber-600'
                          }`}
                        >
                          <Dices className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-xs text-paper-600 font-medium truncate">
                        {[char.dndRace, char.dndClass].filter(Boolean).join(' ') || 'Avventuriero'}
                      </div>

                      <div className="text-[11px] text-paper-400 font-mono truncate">
                        {char.archetype ? `Livello: ${char.archetype}` : 'Livello 1'}
                        {char.dndAlignment && ` • ${char.dndAlignment}`}
                      </div>
                    </div>
                  </div>

                  {/* HP Bar & Quick Adjust */}
                  <div className="bg-white rounded-xl p-3 border border-paper-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-mono font-bold">
                        <Heart className="w-3.5 h-3.5 text-red-600" />
                        <span className={hpPercent <= 20 ? 'text-red-700' : 'text-paper-900'}>
                          {currentHp} / {maxHp} PF
                        </span>
                        {tempHp > 0 && (
                          <span className="text-blue-800 text-[10px]">(+{tempHp})</span>
                        )}
                      </div>

                      {/* Quick damage / heal buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleAdjustHp(char, -5)}
                          className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded border border-red-200 cursor-pointer"
                        >
                          -5
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdjustHp(char, -1)}
                          className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded border border-red-200 cursor-pointer"
                        >
                          -1
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdjustHp(char, 1)}
                          className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 cursor-pointer"
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdjustHp(char, 5)}
                          className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 cursor-pointer"
                        >
                          +5
                        </button>
                      </div>
                    </div>

                    <div className="w-full h-2 bg-paper-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          hpPercent > 50 ? 'bg-emerald-500' :
                          hpPercent > 20 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${hpPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Core Combat Stats Row: AC, Perception, Speed, Spell DC */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-paper-100/80 p-2 rounded-xl border border-paper-200 shadow-2xs">
                      <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-paper-500 uppercase">
                        <Shield className="w-3 h-3 text-amber-700" />
                        <span>CA</span>
                      </div>
                      <span className="text-base font-bold font-mono text-paper-900 block mt-0.5">
                        {ac}
                      </span>
                    </div>

                    <div className="bg-paper-100/80 p-2 rounded-xl border border-paper-200 shadow-2xs">
                      <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-paper-500 uppercase">
                        <Eye className="w-3 h-3 text-purple-700" />
                        <span>Perc.</span>
                      </div>
                      <span className="text-base font-bold font-mono text-paper-900 block mt-0.5">
                        {passivePerc}
                      </span>
                    </div>

                    <div className="bg-paper-100/80 p-2 rounded-xl border border-paper-200 shadow-2xs">
                      <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-paper-500 uppercase">
                        <Footprints className="w-3 h-3 text-emerald-700" />
                        <span>Mov.</span>
                      </div>
                      <span className="text-xs font-bold font-sans text-paper-900 block mt-1 truncate">
                        {speed}
                      </span>
                    </div>
                  </div>

                  {/* Active Conditions */}
                  {conditions.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {conditions.map(c => (
                        <span key={c} className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 font-medium">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* View Detailed Sheet Button */}
                  <button
                    type="button"
                    onClick={() => onSelectCharacter(char.id)}
                    className="w-full py-2 px-3 rounded-xl bg-folia-50 hover:bg-folia-100 text-folia-900 border border-folia-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs group-hover:bg-folia-700 group-hover:text-white"
                  >
                    <span>Apri scheda dettagliata</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
