import React, { useState } from 'react';
import { 
  Shield, 
  Heart, 
  Zap, 
  Footprints, 
  Eye, 
  Dices, 
  Skull, 
  Check, 
  X,
  AlertCircle
} from 'lucide-react';
import { DndAbility, DndStats, DndCombatStats } from '../../../types';

interface DndStatsSectionProps {
  stats?: DndStats;
  combat?: DndCombatStats;
  characterLevel?: string;
  featuresAndTraits?: string;
  onUpdateStats: (newStats: DndStats) => void;
  onUpdateCombat: (newCombat: DndCombatStats) => void;
  onUpdateFeatures: (newFeatures: string) => void;
}

const ABILITY_INFO: { key: DndAbility; label: string; full: string }[] = [
  { key: 'str', label: 'FOR', full: 'Forza' },
  { key: 'dex', label: 'DES', full: 'Destrezza' },
  { key: 'con', label: 'COS', full: 'Costituzione' },
  { key: 'int', label: 'INT', full: 'Intelligenza' },
  { key: 'wis', label: 'SAG', full: 'Saggezza' },
  { key: 'cha', label: 'CAR', full: 'Carisma' }
];

export const DND_CONDITIONS = [
  'Accecato',
  'Affascinato',
  'Assordato',
  'Avvelenato',
  'Incapacitato',
  'Invisibile',
  'Paralizzato',
  'Pietrificato',
  'Privo di sensi',
  'Spaventato',
  'Stordito',
  'Trattenuto',
  'A terra',
  'Esausto',
  'Concentrazione'
];

export const calculateMod = (score: number = 10): number => {
  return Math.floor((score - 10) / 2);
};

export const formatMod = (mod: number): string => {
  return mod >= 0 ? `+${mod}` : `${mod}`;
};

export const DndStatsSection: React.FC<DndStatsSectionProps> = ({
  stats,
  combat,
  characterLevel = '1',
  featuresAndTraits = '',
  onUpdateStats,
  onUpdateCombat,
  onUpdateFeatures
}) => {
  const [isConditionModalOpen, setIsConditionModalOpen] = useState(false);

  // Safe defaults
  const currentStats: DndStats = {
    str: stats?.str ?? 10,
    dex: stats?.dex ?? 10,
    con: stats?.con ?? 10,
    int: stats?.int ?? 10,
    wis: stats?.wis ?? 10,
    cha: stats?.cha ?? 10,
    savingThrows: stats?.savingThrows || []
  };

  // Derive level numeric
  const numericLevel = parseInt(characterLevel.replace(/\D/g, ''), 10) || 1;
  const defaultProfBonus = Math.floor((numericLevel - 1) / 4) + 2;

  const currentCombat: DndCombatStats = {
    armorClass: combat?.armorClass ?? 10,
    maxHp: combat?.maxHp ?? 10,
    currentHp: combat?.currentHp ?? 10,
    tempHp: combat?.tempHp ?? 0,
    speed: combat?.speed ?? '9m (30 ft)',
    hitDice: combat?.hitDice ?? `${numericLevel}d8`,
    proficiencyBonus: combat?.proficiencyBonus ?? defaultProfBonus,
    passivePerception: combat?.passivePerception ?? (10 + calculateMod(currentStats.wis)),
    passiveInvestigation: combat?.passiveInvestigation ?? (10 + calculateMod(currentStats.int)),
    passiveInsight: combat?.passiveInsight ?? (10 + calculateMod(currentStats.wis)),
    inspiration: combat?.inspiration ?? false,
    deathSaves: combat?.deathSaves || { successes: 0, failures: 0 },
    conditions: combat?.conditions || []
  };

  const profBonus = currentCombat.proficiencyBonus ?? defaultProfBonus;

  const handleStatChange = (ability: DndAbility, value: number) => {
    const clamped = Math.max(1, Math.min(30, isNaN(value) ? 10 : value));
    const updated = { ...currentStats, [ability]: clamped };
    onUpdateStats(updated);

    // If wisdom changed, update default passive perception if not manually overridden
    if (ability === 'wis' && combat?.passivePerception === undefined) {
      const isProf = updated.savingThrows?.includes('wis');
      onUpdateCombat({
        ...currentCombat,
        passivePerception: 10 + calculateMod(clamped) + (isProf ? profBonus : 0)
      });
    }
  };

  const toggleSavingThrow = (ability: DndAbility) => {
    const saves = currentStats.savingThrows || [];
    const exists = saves.includes(ability);
    const updatedSaves = exists 
      ? saves.filter(a => a !== ability)
      : [...saves, ability];
    onUpdateStats({ ...currentStats, savingThrows: updatedSaves });
  };

  const handleHpChange = (amount: number) => {
    const newHp = Math.max(0, Math.min(currentCombat.maxHp + (currentCombat.tempHp || 0), currentCombat.currentHp + amount));
    onUpdateCombat({ ...currentCombat, currentHp: newHp });
  };

  const toggleCondition = (cond: string) => {
    const current = currentCombat.conditions || [];
    const updated = current.includes(cond)
      ? current.filter(c => c !== cond)
      : [...current, cond];
    onUpdateCombat({ ...currentCombat, conditions: updated });
  };

  const toggleDeathSave = (type: 'successes' | 'failures', index: number) => {
    const curVal = currentCombat.deathSaves?.[type] || 0;
    const newVal = curVal === index + 1 ? index : index + 1;
    onUpdateCombat({
      ...currentCombat,
      deathSaves: {
        successes: type === 'successes' ? newVal : (currentCombat.deathSaves?.successes || 0),
        failures: type === 'failures' ? newVal : (currentCombat.deathSaves?.failures || 0)
      }
    });
  };

  const hpPercent = currentCombat.maxHp > 0 
    ? Math.min(100, Math.max(0, Math.round((currentCombat.currentHp / currentCombat.maxHp) * 100)))
    : 0;

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-150">
      {/* 1. Core Vital Banner: HP, AC, Speed, Initiative, Inspiration */}
      <div className="bg-paper-50 rounded-2xl border border-paper-250 p-5 md:p-6 shadow-page space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-paper-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 border border-red-200 flex items-center justify-center shrink-0 shadow-2xs">
              <Heart className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h4 className="font-brand font-bold text-base text-paper-900 leading-tight">
                Parametri Vitali & Combattimento
              </h4>
              <p className="text-xs text-paper-500">
                Punti ferita, classe armatura e risolutezza al tavolo
              </p>
            </div>
          </div>

          {/* DM Inspiration & Proficiency Bonus */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onUpdateCombat({ ...currentCombat, inspiration: !currentCombat.inspiration })}
              title="Ispirazione del Dungeon Master"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                currentCombat.inspiration
                  ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-300'
                  : 'bg-paper-100 text-paper-500 border-paper-250 hover:bg-paper-200'
              }`}
            >
              <Dices className={`w-4 h-4 ${currentCombat.inspiration ? 'text-amber-700' : 'text-paper-400'}`} />
              <span>{currentCombat.inspiration ? 'Ispirazione attiva' : 'Nessuna ispirazione'}</span>
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-paper-100 rounded-xl border border-paper-250 text-xs font-bold text-paper-800 shadow-2xs">
              <span className="text-paper-500 font-normal">Competenza:</span>
              <span className="font-mono text-folia-800">+{profBonus}</span>
            </div>
          </div>
        </div>

        {/* Vital stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {/* Armor Class */}
          <div className="bg-paper-100/80 rounded-xl p-3 border border-paper-200 flex flex-col items-center justify-center text-center shadow-2xs relative">
            <div className="flex items-center gap-1.5 text-xs font-bold text-paper-600 uppercase tracking-wider mb-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-700" />
              <span>CA</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  const cur = currentCombat.armorClass ?? 10;
                  onUpdateCombat({ ...currentCombat, armorClass: Math.max(1, cur - 1) });
                }}
                className="w-5 h-6 rounded-md bg-white hover:bg-paper-200 border border-paper-250 text-paper-700 flex items-center justify-center font-bold text-xs shadow-2xs cursor-pointer"
              >
                -
              </button>
              <input
                type="number"
                value={currentCombat.armorClass}
                onChange={(e) => onUpdateCombat({ ...currentCombat, armorClass: parseInt(e.target.value, 10) || 10 })}
                className="w-12 text-center text-xl font-bold font-mono text-paper-900 bg-white border border-paper-250 rounded-md py-0.5 focus:outline-hidden focus:border-folia-600 shadow-2xs"
              />
              <button
                type="button"
                onClick={() => {
                  const cur = currentCombat.armorClass ?? 10;
                  onUpdateCombat({ ...currentCombat, armorClass: cur + 1 });
                }}
                className="w-5 h-6 rounded-md bg-white hover:bg-paper-200 border border-paper-250 text-paper-700 flex items-center justify-center font-bold text-xs shadow-2xs cursor-pointer"
              >
                +
              </button>
            </div>
            <span className="text-[10px] text-paper-400 mt-1 font-sans">Classe Armatura</span>
          </div>

          {/* Speed */}
          <div className="bg-paper-100/80 rounded-xl p-3 border border-paper-200 flex flex-col items-center justify-center text-center shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-paper-600 uppercase tracking-wider mb-1.5">
              <Footprints className="w-3.5 h-3.5 text-emerald-700" />
              <span>Velocità</span>
            </div>
            <input
              type="text"
              value={currentCombat.speed}
              onChange={(e) => onUpdateCombat({ ...currentCombat, speed: e.target.value })}
              className="w-24 text-center text-sm font-bold font-sans text-paper-900 bg-white border border-paper-250 rounded-lg py-1.5 focus:outline-hidden focus:border-folia-600 shadow-2xs"
            />
            <span className="text-[10px] text-paper-400 mt-1 font-sans">Movimento</span>
          </div>

          {/* Initiative (Editable with + and - buttons) */}
          <div className="bg-paper-100/80 rounded-xl p-3 border border-paper-200 flex flex-col items-center justify-center text-center shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-paper-600 uppercase tracking-wider mb-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Iniziativa</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  const cur = currentCombat.initiativeBonus ?? 0;
                  onUpdateCombat({ ...currentCombat, initiativeBonus: cur - 1 });
                }}
                className="w-5 h-6 rounded-md bg-white hover:bg-paper-200 border border-paper-250 text-paper-700 flex items-center justify-center font-bold text-xs shadow-2xs cursor-pointer"
              >
                -
              </button>
              <input
                type="text"
                value={formatMod(calculateMod(currentStats.dex) + (currentCombat.initiativeBonus || 0))}
                onChange={(e) => {
                  const val = parseInt(e.target.value.replace('+', ''), 10);
                  if (!isNaN(val)) {
                    const bonus = val - calculateMod(currentStats.dex);
                    onUpdateCombat({ ...currentCombat, initiativeBonus: bonus });
                  }
                }}
                className="w-12 text-center text-xl font-bold font-mono text-paper-900 bg-white border border-paper-250 rounded-md py-0.5 focus:outline-hidden focus:border-folia-600 shadow-2xs"
              />
              <button
                type="button"
                onClick={() => {
                  const cur = currentCombat.initiativeBonus ?? 0;
                  onUpdateCombat({ ...currentCombat, initiativeBonus: cur + 1 });
                }}
                className="w-5 h-6 rounded-md bg-white hover:bg-paper-200 border border-paper-250 text-paper-700 flex items-center justify-center font-bold text-xs shadow-2xs cursor-pointer"
              >
                +
              </button>
            </div>
            <span className="text-[10px] text-paper-400 mt-1 font-sans">Modificatore</span>
          </div>

          {/* Hit Dice */}
          <div className="bg-paper-100/80 rounded-xl p-3 border border-paper-200 flex flex-col items-center justify-center text-center shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-paper-600 uppercase tracking-wider mb-1.5">
              <Heart className="w-3.5 h-3.5 text-red-600" />
              <span>Dadi Vita</span>
            </div>
            <input
              type="text"
              value={currentCombat.hitDice}
              onChange={(e) => onUpdateCombat({ ...currentCombat, hitDice: e.target.value })}
              className="w-20 text-center text-sm font-bold font-sans text-paper-900 bg-white border border-paper-250 rounded-lg py-1.5 focus:outline-hidden focus:border-folia-600 shadow-2xs"
            />
            <span className="text-[10px] text-paper-400 mt-1 font-sans">Rimanenti</span>
          </div>

          {/* Passive Perception with + and - buttons */}
          <div className="bg-paper-100/80 rounded-xl p-3 border border-paper-200 flex flex-col items-center justify-center text-center shadow-2xs col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-paper-600 uppercase tracking-wider mb-1.5">
              <Eye className="w-3.5 h-3.5 text-purple-700" />
              <span>Percezione</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  const cur = currentCombat.passivePerception ?? 10;
                  onUpdateCombat({ ...currentCombat, passivePerception: Math.max(1, cur - 1) });
                }}
                className="w-5 h-6 rounded-md bg-white hover:bg-paper-200 border border-paper-250 text-paper-700 flex items-center justify-center font-bold text-xs shadow-2xs cursor-pointer"
              >
                -
              </button>
              <input
                type="number"
                value={currentCombat.passivePerception}
                onChange={(e) => onUpdateCombat({ ...currentCombat, passivePerception: parseInt(e.target.value, 10) || 10 })}
                className="w-12 text-center text-xl font-bold font-mono text-paper-900 bg-white border border-paper-250 rounded-md py-0.5 focus:outline-hidden focus:border-folia-600 shadow-2xs"
              />
              <button
                type="button"
                onClick={() => {
                  const cur = currentCombat.passivePerception ?? 10;
                  onUpdateCombat({ ...currentCombat, passivePerception: cur + 1 });
                }}
                className="w-5 h-6 rounded-md bg-white hover:bg-paper-200 border border-paper-250 text-paper-700 flex items-center justify-center font-bold text-xs shadow-2xs cursor-pointer"
              >
                +
              </button>
            </div>
            <span className="text-[10px] text-paper-400 mt-1 font-sans">Passiva</span>
          </div>
        </div>

        {/* Hit Points Box & Bar */}
        <div className="bg-white rounded-xl p-4 border border-paper-200 shadow-2xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-paper-700 uppercase tracking-wider">Punti Ferita (HP)</span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                hpPercent > 50 ? 'bg-emerald-100 text-emerald-800' :
                hpPercent > 20 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
              }`}>
                {currentCombat.currentHp} / {currentCombat.maxHp} PF ({hpPercent}%)
              </span>
              {(currentCombat.tempHp || 0) > 0 && (
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  +{currentCombat.tempHp} Temp
                </span>
              )}
            </div>

            {/* Quick adjust buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleHpChange(-5)}
                className="px-2 py-1 text-xs font-bold font-mono text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer"
              >
                -5
              </button>
              <button
                type="button"
                onClick={() => handleHpChange(-1)}
                className="px-2 py-1 text-xs font-bold font-mono text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer"
              >
                -1
              </button>
              <button
                type="button"
                onClick={() => handleHpChange(1)}
                className="px-2 py-1 text-xs font-bold font-mono text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
              >
                +1
              </button>
              <button
                type="button"
                onClick={() => handleHpChange(5)}
                className="px-2 py-1 text-xs font-bold font-mono text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
              >
                +5
              </button>
            </div>
          </div>

          {/* Visual Health Bar */}
          <div className="w-full h-3 bg-paper-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className={`h-full transition-all duration-300 rounded-full ${
                hpPercent > 50 ? 'bg-emerald-500' :
                hpPercent > 20 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>

          {/* HP Edit Inputs */}
          <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
            <div className="flex items-center gap-2">
              <span className="text-paper-500">HP Attuali:</span>
              <input
                type="number"
                value={currentCombat.currentHp}
                onChange={(e) => onUpdateCombat({ ...currentCombat, currentHp: parseInt(e.target.value, 10) || 0 })}
                className="w-16 px-2 py-1 border border-paper-250 rounded-lg text-center font-mono font-bold text-paper-900"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-paper-500">HP Massimi:</span>
              <input
                type="number"
                value={currentCombat.maxHp}
                onChange={(e) => onUpdateCombat({ ...currentCombat, maxHp: parseInt(e.target.value, 10) || 1 })}
                className="w-16 px-2 py-1 border border-paper-250 rounded-lg text-center font-mono font-bold text-paper-900"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-paper-500">HP Temporanei:</span>
              <input
                type="number"
                value={currentCombat.tempHp || 0}
                onChange={(e) => onUpdateCombat({ ...currentCombat, tempHp: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                className="w-16 px-2 py-1 border border-paper-250 rounded-lg text-center font-mono font-bold text-blue-900 bg-blue-50/50"
              />
            </div>
          </div>
        </div>

        {/* Death Saves & Conditions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Death Saves */}
          <div className="bg-paper-100/70 rounded-xl p-3.5 border border-paper-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-paper-700 uppercase tracking-wider">
              <Skull className="w-3.5 h-3.5 text-paper-600" />
              <span>Tiri Salvezza contro la Morte</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-emerald-800 font-medium">Successi:</span>
                <div className="flex items-center gap-2">
                  {[0, 1, 2].map(idx => (
                    <button
                      key={`succ-${idx}`}
                      type="button"
                      onClick={() => toggleDeathSave('successes', idx)}
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                        (currentCombat.deathSaves?.successes || 0) > idx
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                          : 'border-paper-300 bg-white hover:border-emerald-500'
                      }`}
                    >
                      {(currentCombat.deathSaves?.successes || 0) > idx && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-red-800 font-medium">Fallimenti:</span>
                <div className="flex items-center gap-2">
                  {[0, 1, 2].map(idx => (
                    <button
                      key={`fail-${idx}`}
                      type="button"
                      onClick={() => toggleDeathSave('failures', idx)}
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                        (currentCombat.deathSaves?.failures || 0) > idx
                          ? 'bg-red-600 border-red-600 text-white shadow-2xs'
                          : 'border-paper-300 bg-white hover:border-red-500'
                      }`}
                    >
                      {(currentCombat.deathSaves?.failures || 0) > idx && <X className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Active Conditions */}
          <div className="bg-paper-100/70 rounded-xl p-3.5 border border-paper-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-paper-700 uppercase tracking-wider">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                <span>Condizioni attive ({currentCombat.conditions?.length || 0})</span>
              </div>
              <button
                type="button"
                onClick={() => setIsConditionModalOpen(true)}
                className="text-[11px] font-bold text-folia-800 hover:text-folia-950 underline cursor-pointer"
              >
                Gestisci
              </button>
            </div>

            {(currentCombat.conditions || []).length === 0 ? (
              <p className="text-xs text-paper-400 italic py-1">Nessuna condizione attiva (in salute).</p>
            ) : (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {currentCombat.conditions?.map(cond => (
                  <span 
                    key={cond}
                    className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-amber-100/90 text-amber-900 border border-amber-300 font-medium shadow-2xs"
                  >
                    <span>{cond}</span>
                    <button
                      type="button"
                      onClick={() => toggleCondition(cond)}
                      className="hover:text-red-700 cursor-pointer"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. The 6 Core Ability Scores with Modifiers & Saving Throws */}
      <div className="bg-paper-50 rounded-2xl border border-paper-250 p-5 md:p-6 shadow-page space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-brand font-bold text-base text-paper-900 leading-tight">
              Punteggi di Caratteristica & Tiri Salvezza
            </h4>
            <p className="text-xs text-paper-500">
              Modificatori calcolati automaticamente (punteggio - 10 / 2)
            </p>
          </div>
          <span className="text-[11px] text-paper-400 font-mono">D&D 5ª Edizione</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {ABILITY_INFO.map(({ key, label, full }) => {
            const score = currentStats[key] ?? 10;
            const mod = calculateMod(score);
            const isProficientSave = (currentStats.savingThrows || []).includes(key);
            const saveBonus = mod + (isProficientSave ? profBonus : 0);

            return (
              <div 
                key={key}
                className="bg-white rounded-2xl border border-paper-200 p-3 flex flex-col items-center text-center shadow-2xs space-y-2 hover:border-paper-300 transition-colors"
              >
                {/* Title */}
                <div className="text-center">
                  <span className="text-xs font-bold text-paper-800 tracking-wider block">{label}</span>
                  <span className="text-[10px] text-paper-400 block -mt-0.5">{full}</span>
                </div>

                {/* Big Modifier Badge */}
                <div className="w-14 h-11 rounded-xl bg-amber-50 border-2 border-amber-200/80 flex items-center justify-center text-amber-950 font-mono font-bold text-xl shadow-xs">
                  {formatMod(mod)}
                </div>

                {/* Score Input */}
                <div className="flex items-center justify-center gap-1 w-full">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={score}
                    onChange={(e) => handleStatChange(key, parseInt(e.target.value, 10))}
                    className="w-12 text-center text-xs font-bold font-mono text-paper-700 bg-paper-100/70 border border-paper-250 rounded-md py-1 focus:outline-hidden focus:border-folia-600"
                  />
                </div>

                {/* Saving throw button */}
                <button
                  type="button"
                  onClick={() => toggleSavingThrow(key)}
                  title={`Tiro salvezza ${full}: ${formatMod(saveBonus)} ${isProficientSave ? '(Competente)' : ''}`}
                  className={`w-full py-1 px-1.5 rounded-lg border text-[10px] font-bold flex items-center justify-between transition-all cursor-pointer ${
                    isProficientSave 
                      ? 'bg-folia-100 text-folia-950 border-folia-300 shadow-2xs'
                      : 'bg-paper-50 text-paper-500 border-paper-200 hover:bg-paper-100'
                  }`}
                >
                  <span className="truncate">TS</span>
                  <span className="font-mono">{formatMod(saveBonus)}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Class Features, Traits & Feats */}
      <div className="bg-paper-50 rounded-2xl border border-paper-250 p-5 md:p-6 shadow-page space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-brand font-bold text-base text-paper-900 leading-tight">
              Privilegi di Classe, Talenti & Tratti Razziali
            </h4>
            <p className="text-xs text-paper-500">
              Capacità speciali, resistenze passive e privilegi ottenuti ai livelli di classe
            </p>
          </div>
        </div>

        <textarea
          rows={5}
          value={featuresAndTraits}
          onChange={(e) => onUpdateFeatures(e.target.value)}
          placeholder="es. Scurovisione (18m), Azione Impetuosa (1 uso per riposo breve), Secondo Fiato (1d10 + livello), Stile di combattimento: Duellare..."
          className="w-full p-3.5 bg-white rounded-xl border border-paper-200 focus:outline-hidden focus:border-folia-600 text-xs text-paper-800 resize-none font-sans leading-relaxed shadow-2xs"
        />
      </div>

      {/* Conditions Modal */}
      {isConditionModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in select-none folia-modal-overlay"
          onClick={() => setIsConditionModalOpen(false)}
        >
          <div 
            className="bg-paper-50 rounded-2xl shadow-modal border border-paper-300 w-full max-w-md overflow-hidden flex flex-col p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-paper-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-brand font-bold text-base text-paper-900 leading-tight">
                    Condizioni D&D 5e
                  </h3>
                  <p className="text-xs text-paper-500">Seleziona o rimuovi gli stati del personaggio</p>
                </div>
              </div>
              <button
                onClick={() => setIsConditionModalOpen(false)}
                className="p-1 rounded-lg text-paper-400 hover:text-paper-700 hover:bg-paper-150 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
              {DND_CONDITIONS.map(cond => {
                const isActive = (currentCombat.conditions || []).includes(cond);
                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => toggleCondition(cond)}
                    className={`flex items-center justify-between p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-100/80 border-amber-400 text-amber-950 shadow-2xs font-bold'
                        : 'bg-white border-paper-250 text-paper-700 hover:bg-paper-100'
                    }`}
                  >
                    <span>{cond}</span>
                    {isActive ? <Check className="w-3.5 h-3.5 text-amber-700" /> : null}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-2 border-t border-paper-200">
              <button
                type="button"
                onClick={() => setIsConditionModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-folia-800 hover:bg-folia-900 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
