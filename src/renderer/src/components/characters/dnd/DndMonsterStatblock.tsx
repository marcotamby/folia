import React, { useState } from 'react';
import { 
  Skull, 
  Shield, 
  Heart, 
  Footprints, 
  Eye, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  Flame,
  Zap,
  Crown
} from 'lucide-react';
import { DndMonsterData, DndMonsterAction, DndStats, DndCombatStats } from '../../../types';
import { CustomSelect } from '../../common/CustomSelect';
import { calculateMod, formatMod } from './DndStatsSection';

interface DndMonsterStatblockProps {
  characterName: string;
  monsterData?: DndMonsterData;
  stats?: DndStats;
  combat?: DndCombatStats;
  onUpdateMonsterData: (data: DndMonsterData) => void;
  onUpdateStats: (stats: DndStats) => void;
  onUpdateCombat: (combat: DndCombatStats) => void;
}

const DEFAULT_MONSTER_DATA: DndMonsterData = {
  challengeRating: '3 (700 PE)',
  size: 'Media',
  type: 'Umanoide',
  alignment: 'Neutrale Malvagio',
  damageVulnerabilities: '',
  damageResistances: '',
  damageImmunities: '',
  conditionImmunities: '',
  senses: 'Scurovisione 18m, Percezione passiva 13',
  languages: 'Comune, Goblin',
  actions: [
    {
      id: 'act-1',
      name: 'Multiattacco',
      type: 'action',
      description: 'Il mostro compie due attacchi da mischia o due attacchi a distanza.'
    },
    {
      id: 'act-2',
      name: 'Attacco con Scimitarra',
      type: 'action',
      description: 'Attacco con arma da mischia: +5 al tiro per colpire, portata 1,5 m, un bersaglio. Danno: 6 (1d6 + 3) danni taglienti.'
    }
  ],
  legendaryActionsCount: 3,
  legendaryDescription: 'Il mostro può compiere 3 azioni leggendarie, scelte tra le seguenti, alla fine del turno di un\'altra creatura.'
};

export const DndMonsterStatblock: React.FC<DndMonsterStatblockProps> = ({
  characterName,
  monsterData,
  stats,
  combat,
  onUpdateMonsterData,
  onUpdateStats,
  onUpdateCombat
}) => {
  const currentMonster: DndMonsterData = {
    challengeRating: monsterData?.challengeRating ?? DEFAULT_MONSTER_DATA.challengeRating,
    size: monsterData?.size ?? DEFAULT_MONSTER_DATA.size,
    type: monsterData?.type ?? DEFAULT_MONSTER_DATA.type,
    alignment: monsterData?.alignment ?? DEFAULT_MONSTER_DATA.alignment,
    damageVulnerabilities: monsterData?.damageVulnerabilities ?? '',
    damageResistances: monsterData?.damageResistances ?? '',
    damageImmunities: monsterData?.damageImmunities ?? '',
    conditionImmunities: monsterData?.conditionImmunities ?? '',
    senses: monsterData?.senses ?? DEFAULT_MONSTER_DATA.senses,
    languages: monsterData?.languages ?? DEFAULT_MONSTER_DATA.languages,
    actions: monsterData?.actions || DEFAULT_MONSTER_DATA.actions,
    legendaryActionsCount: monsterData?.legendaryActionsCount ?? 3,
    legendaryDescription: monsterData?.legendaryDescription ?? DEFAULT_MONSTER_DATA.legendaryDescription
  };

  const currentStats = {
    str: stats?.str ?? 10,
    dex: stats?.dex ?? 10,
    con: stats?.con ?? 10,
    int: stats?.int ?? 10,
    wis: stats?.wis ?? 10,
    cha: stats?.cha ?? 10,
    savingThrows: stats?.savingThrows || []
  };

  const currentCombat = {
    armorClass: combat?.armorClass ?? 13,
    maxHp: combat?.maxHp ?? 45,
    currentHp: combat?.currentHp ?? 45,
    speed: combat?.speed ?? '9m (30 ft)'
  };

  // Action modal state
  const [editingAction, setEditingAction] = useState<DndMonsterAction | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  const handleOpenNewAction = (type: 'action' | 'bonus' | 'reaction' | 'legendary' | 'special' = 'action') => {
    setEditingAction({
      id: 'act-' + Date.now(),
      name: '',
      type,
      description: ''
    });
    setIsActionModalOpen(true);
  };

  const handleSaveAction = () => {
    if (!editingAction || !editingAction.name.trim()) return;
    const exists = currentMonster.actions.some(a => a.id === editingAction.id);
    const updated = exists
      ? currentMonster.actions.map(a => a.id === editingAction.id ? editingAction : a)
      : [...currentMonster.actions, editingAction];
    onUpdateMonsterData({ ...currentMonster, actions: updated });
    setIsActionModalOpen(false);
    setEditingAction(null);
  };

  const handleDeleteAction = (id: string) => {
    onUpdateMonsterData({
      ...currentMonster,
      actions: currentMonster.actions.filter(a => a.id !== id)
    });
  };

  // Group actions
  const specialTraits = currentMonster.actions.filter(a => a.type === 'special');
  const regularActions = currentMonster.actions.filter(a => a.type === 'action');
  const bonusActions = currentMonster.actions.filter(a => a.type === 'bonus');
  const reactions = currentMonster.actions.filter(a => a.type === 'reaction');
  const legendaryActions = currentMonster.actions.filter(a => a.type === 'legendary');

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-150">
      {/* Statblock Container - Parchment style border */}
      <div className="bg-[#fdfaf5] rounded-2xl border-4 border-[#b9783f]/60 p-6 md:p-8 shadow-page space-y-5 text-paper-900 font-sans relative">
        {/* Decorative corner tag */}
        <div className="absolute top-3 right-4 flex items-center gap-2">
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-red-100 text-red-900 border border-red-300 font-bold font-mono">
            GS {currentMonster.challengeRating}
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="border-b-2 border-[#b9783f]/40 pb-3">
          <h3 className="text-2xl md:text-3xl font-brand font-bold text-red-950 tracking-tight">
            {characterName || 'Mostro / NPC Boss'}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-xs italic text-paper-600 font-serif mt-0.5">
            <input
              type="text"
              value={currentMonster.size}
              onChange={(e) => onUpdateMonsterData({ ...currentMonster, size: e.target.value as any })}
              placeholder="Taglia (Media, Grande...)"
              className="bg-transparent border-b border-paper-300 w-20 py-0.5 focus:outline-hidden"
            />
            <span>•</span>
            <input
              type="text"
              value={currentMonster.type}
              onChange={(e) => onUpdateMonsterData({ ...currentMonster, type: e.target.value })}
              placeholder="Tipo creatura..."
              className="bg-transparent border-b border-paper-300 w-32 py-0.5 focus:outline-hidden"
            />
            <span>•</span>
            <input
              type="text"
              value={currentMonster.alignment}
              onChange={(e) => onUpdateMonsterData({ ...currentMonster, alignment: e.target.value })}
              placeholder="Allineamento..."
              className="bg-transparent border-b border-paper-300 w-36 py-0.5 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Armor Class, HP & Speed */}
        <div className="space-y-1.5 text-xs border-b-2 border-[#b9783f]/40 pb-3 font-sans">
          <div className="flex items-center gap-2">
            <strong className="text-red-950 min-w-28">Classe Armatura:</strong>
            <input
              type="number"
              value={currentCombat.armorClass}
              onChange={(e) => onUpdateCombat({ ...combat, armorClass: parseInt(e.target.value, 10) || 10, maxHp: currentCombat.maxHp, currentHp: currentCombat.currentHp, speed: currentCombat.speed, hitDice: combat?.hitDice || '1d8' })}
              className="w-16 px-1.5 py-0.5 bg-white border border-paper-300 rounded-md font-mono font-bold text-paper-900"
            />
          </div>

          <div className="flex items-center gap-2">
            <strong className="text-red-950 min-w-28">Punti Ferita (HP):</strong>
            <input
              type="number"
              value={currentCombat.currentHp}
              onChange={(e) => onUpdateCombat({ ...combat, currentHp: parseInt(e.target.value, 10) || 0, maxHp: currentCombat.maxHp, armorClass: currentCombat.armorClass, speed: currentCombat.speed, hitDice: combat?.hitDice || '1d8' })}
              className="w-16 px-1.5 py-0.5 bg-white border border-paper-300 rounded-md font-mono font-bold text-red-900"
            />
            <span className="text-paper-500">/ max</span>
            <input
              type="number"
              value={currentCombat.maxHp}
              onChange={(e) => onUpdateCombat({ ...combat, maxHp: parseInt(e.target.value, 10) || 10, currentHp: currentCombat.currentHp, armorClass: currentCombat.armorClass, speed: currentCombat.speed, hitDice: combat?.hitDice || '1d8' })}
              className="w-16 px-1.5 py-0.5 bg-white border border-paper-300 rounded-md font-mono font-bold text-paper-900"
            />
          </div>

          <div className="flex items-center gap-2">
            <strong className="text-red-950 min-w-28">Velocità:</strong>
            <input
              type="text"
              value={currentCombat.speed}
              onChange={(e) => onUpdateCombat({ ...combat, speed: e.target.value, maxHp: currentCombat.maxHp, currentHp: currentCombat.currentHp, armorClass: currentCombat.armorClass, hitDice: combat?.hitDice || '1d8' })}
              className="w-48 px-1.5 py-0.5 bg-white border border-paper-300 rounded-md font-sans text-paper-900"
            />
          </div>
        </div>

        {/* 6 Core Abilities Strip */}
        <div className="border-b-2 border-[#b9783f]/40 pb-4">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
            {(['str', 'dex', 'con', 'int', 'wis', 'cha'] as const).map(key => {
              const label = key.toUpperCase();
              const score = currentStats[key] ?? 10;
              const mod = calculateMod(score);
              return (
                <div key={key} className="bg-white/80 rounded-xl p-2 border border-paper-250 shadow-2xs">
                  <span className="text-xs font-bold text-red-900 block font-brand">{label}</span>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={score}
                    onChange={(e) => onUpdateStats({ ...currentStats, [key]: parseInt(e.target.value, 10) || 10 })}
                    className="w-12 text-center font-mono font-bold text-xs bg-paper-100 rounded-md py-0.5 my-1"
                  />
                  <span className="text-[11px] font-mono font-bold text-paper-700 block">
                    ({formatMod(mod)})
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resistenze, Immunità, Sensi & Linguaggi */}
        <div className="space-y-2 text-xs border-b-2 border-[#b9783f]/40 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <strong className="text-red-950 sm:min-w-44 shrink-0">Resistenze ai danni:</strong>
            <input
              type="text"
              value={currentMonster.damageResistances || ''}
              onChange={(e) => onUpdateMonsterData({ ...currentMonster, damageResistances: e.target.value })}
              placeholder="es. Fuoco, fulmine, contundente da armi non magiche..."
              className="w-full px-2 py-1 bg-white border border-paper-300 rounded-md text-xs font-sans text-paper-900"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <strong className="text-red-950 sm:min-w-44 shrink-0">Immunità ai danni:</strong>
            <input
              type="text"
              value={currentMonster.damageImmunities || ''}
              onChange={(e) => onUpdateMonsterData({ ...currentMonster, damageImmunities: e.target.value })}
              placeholder="es. Veleno, psichico..."
              className="w-full px-2 py-1 bg-white border border-paper-300 rounded-md text-xs font-sans text-paper-900"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <strong className="text-red-950 sm:min-w-44 shrink-0">Immunità alle condizioni:</strong>
            <input
              type="text"
              value={currentMonster.conditionImmunities || ''}
              onChange={(e) => onUpdateMonsterData({ ...currentMonster, conditionImmunities: e.target.value })}
              placeholder="es. Affascinato, spaventato, avvelenato..."
              className="w-full px-2 py-1 bg-white border border-paper-300 rounded-md text-xs font-sans text-paper-900"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <strong className="text-red-950 sm:min-w-44 shrink-0">Sensi:</strong>
            <input
              type="text"
              value={currentMonster.senses || ''}
              onChange={(e) => onUpdateMonsterData({ ...currentMonster, senses: e.target.value })}
              placeholder="Scurovisione 18m, Percezione passiva 14..."
              className="w-full px-2 py-1 bg-white border border-paper-300 rounded-md text-xs font-sans text-paper-900"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <strong className="text-red-950 sm:min-w-44 shrink-0">Linguaggi:</strong>
            <input
              type="text"
              value={currentMonster.languages || ''}
              onChange={(e) => onUpdateMonsterData({ ...currentMonster, languages: e.target.value })}
              placeholder="Comune, Abissale, Telepatia 36m..."
              className="w-full px-2 py-1 bg-white border border-paper-300 rounded-md text-xs font-sans text-paper-900"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <strong className="text-red-950 sm:min-w-44 shrink-0">Sfida (GS & PE):</strong>
            <input
              type="text"
              value={currentMonster.challengeRating}
              onChange={(e) => onUpdateMonsterData({ ...currentMonster, challengeRating: e.target.value })}
              placeholder="es. 5 (1.800 PE)..."
              className="w-48 px-2 py-1 bg-white border border-paper-300 rounded-md text-xs font-sans text-paper-900 font-bold"
            />
          </div>
        </div>

        {/* Tratti Speciali Passivi */}
        <div className="space-y-3 border-b-2 border-[#b9783f]/40 pb-4">
          <div className="flex items-center justify-between">
            <h4 className="font-brand font-bold text-sm text-red-950 uppercase tracking-wider">
              Tratti Speciali & Capacità Passive
            </h4>
            <button
              type="button"
              onClick={() => handleOpenNewAction('special')}
              className="text-xs text-red-800 hover:text-red-950 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Aggiungi tratto</span>
            </button>
          </div>

          {specialTraits.length === 0 ? (
            <p className="text-xs text-paper-400 italic">Nessun tratto speciale passivo definito.</p>
          ) : (
            <div className="space-y-2">
              {specialTraits.map(trait => (
                <div key={trait.id} className="bg-white/70 p-2.5 rounded-xl border border-paper-200 text-xs flex justify-between gap-2 group">
                  <div>
                    <span className="font-bold italic text-paper-900">{trait.name}. </span>
                    <span className="text-paper-700 leading-relaxed">{trait.description}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      type="button"
                      onClick={() => { setEditingAction(trait); setIsActionModalOpen(true); }}
                      className="p-1 hover:text-folia-800 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAction(trait.id)}
                      className="p-1 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Azioni Standard */}
        <div className="space-y-3 border-b-2 border-[#b9783f]/40 pb-4">
          <div className="flex items-center justify-between">
            <h4 className="font-brand font-bold text-sm text-red-950 uppercase tracking-wider">
              Azioni
            </h4>
            <button
              type="button"
              onClick={() => handleOpenNewAction('action')}
              className="text-xs text-red-800 hover:text-red-950 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Aggiungi azione</span>
            </button>
          </div>

          {regularActions.length === 0 ? (
            <p className="text-xs text-paper-400 italic">Nessuna azione definita.</p>
          ) : (
            <div className="space-y-2">
              {regularActions.map(action => (
                <div key={action.id} className="bg-white/70 p-2.5 rounded-xl border border-paper-200 text-xs flex justify-between gap-2 group">
                  <div>
                    <span className="font-bold italic text-paper-900">{action.name}. </span>
                    <span className="text-paper-700 leading-relaxed">{action.description}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      type="button"
                      onClick={() => { setEditingAction(action); setIsActionModalOpen(true); }}
                      className="p-1 hover:text-folia-800 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAction(action.id)}
                      className="p-1 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Azioni Bonus & Reazioni */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b-2 border-[#b9783f]/40 pb-4">
          {/* Bonus Actions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-brand font-bold text-xs text-red-950 uppercase tracking-wider">
                Azioni Bonus
              </h4>
              <button
                type="button"
                onClick={() => handleOpenNewAction('bonus')}
                className="text-[11px] text-red-800 hover:text-red-950 font-bold flex items-center gap-0.5 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Nuova</span>
              </button>
            </div>
            {bonusActions.map(action => (
              <div key={action.id} className="bg-white/70 p-2 rounded-lg border border-paper-200 text-xs flex justify-between gap-1 group">
                <div>
                  <span className="font-bold italic text-paper-900">{action.name}. </span>
                  <span className="text-paper-600 text-[11px]">{action.description}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteAction(action.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-600 cursor-pointer shrink-0"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Reactions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-brand font-bold text-xs text-red-950 uppercase tracking-wider">
                Reazioni
              </h4>
              <button
                type="button"
                onClick={() => handleOpenNewAction('reaction')}
                className="text-[11px] text-red-800 hover:text-red-950 font-bold flex items-center gap-0.5 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Nuova</span>
              </button>
            </div>
            {reactions.map(action => (
              <div key={action.id} className="bg-white/70 p-2 rounded-lg border border-paper-200 text-xs flex justify-between gap-1 group">
                <div>
                  <span className="font-bold italic text-paper-900">{action.name}. </span>
                  <span className="text-paper-600 text-[11px]">{action.description}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteAction(action.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-600 cursor-pointer shrink-0"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Azioni Leggendarie */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-600" />
              <h4 className="font-brand font-bold text-sm text-red-950 uppercase tracking-wider">
                Azioni Leggendarie ({currentMonster.legendaryActionsCount || 3} per round)
              </h4>
            </div>
            <button
              type="button"
              onClick={() => handleOpenNewAction('legendary')}
              className="text-xs text-red-800 hover:text-red-950 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Aggiungi azione leggendaria</span>
            </button>
          </div>

          <textarea
            rows={2}
            value={currentMonster.legendaryDescription || ''}
            onChange={(e) => onUpdateMonsterData({ ...currentMonster, legendaryDescription: e.target.value })}
            placeholder="Descrizione regole azioni leggendarie..."
            className="w-full p-2 bg-white/70 border border-paper-300 rounded-xl text-xs text-paper-800 resize-none font-sans"
          />

          {legendaryActions.map(action => (
            <div key={action.id} className="bg-white/70 p-2.5 rounded-xl border border-paper-200 text-xs flex justify-between gap-2 group">
              <div>
                <span className="font-bold italic text-paper-900">{action.name}. </span>
                <span className="text-paper-700 leading-relaxed">{action.description}</span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  type="button"
                  onClick={() => { setEditingAction(action); setIsActionModalOpen(true); }}
                  className="p-1 hover:text-folia-800 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteAction(action.id)}
                  className="p-1 hover:text-red-600 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Add/Edit Modal */}
      {isActionModalOpen && editingAction && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in select-none folia-modal-overlay"
          onClick={() => setIsActionModalOpen(false)}
        >
          <div 
            className="bg-paper-50 rounded-2xl shadow-modal border border-paper-300 w-full max-w-lg overflow-hidden flex flex-col p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-paper-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-100 text-red-800 border border-red-200 flex items-center justify-center shrink-0">
                  <Skull className="w-5 h-5 text-red-700" />
                </div>
                <div>
                  <h3 className="font-brand font-bold text-base text-paper-900 leading-tight">
                    {currentMonster.actions.some(a => a.id === editingAction.id) ? 'Modifica Azione' : 'Nuova Azione o Tratto'}
                  </h3>
                  <p className="text-xs text-paper-500">Definisci il nome e gli effetti dell'azione del mostro</p>
                </div>
              </div>
              <button
                onClick={() => setIsActionModalOpen(false)}
                className="p-1 rounded-lg text-paper-400 hover:text-paper-700 hover:bg-paper-150 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-paper-700 uppercase tracking-wider mb-1">
                    Nome dell'azione *
                  </label>
                  <input
                    type="text"
                    autoFocus
                    value={editingAction.name}
                    onChange={(e) => setEditingAction({ ...editingAction, name: e.target.value })}
                    placeholder="es. Morso, Soffio di Fuoco, Fuga Audace..."
                    className="w-full px-3.5 py-2 text-xs bg-white border border-paper-300 rounded-xl text-paper-900 focus:outline-hidden focus:border-folia-600 shadow-2xs font-sans font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-paper-700 uppercase tracking-wider mb-1">
                    Tipo di azione
                  </label>
                  <CustomSelect
                    value={editingAction.type}
                    onChange={(val) => setEditingAction({ ...editingAction, type: val as any })}
                    options={[
                      { value: 'action', label: 'Azione standard' },
                      { value: 'bonus', label: 'Azione bonus' },
                      { value: 'reaction', label: 'Reazione' },
                      { value: 'legendary', label: 'Azione leggendaria' },
                      { value: 'special', label: 'Tratto speciale passivo' }
                    ]}
                    className="w-full"
                    buttonClassName="w-full py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-paper-700 uppercase tracking-wider mb-1">
                  Descrizione dell'effetto & Regole *
                </label>
                <textarea
                  rows={5}
                  value={editingAction.description}
                  onChange={(e) => setEditingAction({ ...editingAction, description: e.target.value })}
                  placeholder="Attacco con arma da mischia: +7 al tiro per colpire, portata 3m, un bersaglio. Danno: 15 (2d10 + 4) danni perforanti..."
                  className="w-full p-3 text-xs bg-white border border-paper-300 rounded-xl text-paper-900 focus:outline-hidden focus:border-folia-600 shadow-2xs font-sans resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-paper-200">
              <button
                type="button"
                onClick={() => setIsActionModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-paper-200 hover:bg-paper-300 text-paper-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                Annulla
              </button>
              <button
                type="button"
                disabled={!editingAction.name.trim()}
                onClick={handleSaveAction}
                className="px-4 py-2 rounded-xl bg-red-800 hover:bg-red-900 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Salva azione
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
