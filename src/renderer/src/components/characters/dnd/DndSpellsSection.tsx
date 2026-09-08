import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  Check, 
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { DndSpellcasting, DndSpell, DndSpellSlot, DndStats, DndCombatStats } from '../../../types';
import { CustomSelect } from '../../common/CustomSelect';
import { calculateMod, formatMod } from './DndStatsSection';

interface DndSpellsSectionProps {
  spellcasting?: DndSpellcasting;
  stats?: DndStats;
  combat?: DndCombatStats;
  characterLevel?: string;
  onUpdateSpellcasting: (spellcasting: DndSpellcasting) => void;
}

const DEFAULT_SLOTS: DndSpellSlot[] = [
  { level: 1, total: 2, used: 0 },
  { level: 2, total: 0, used: 0 },
  { level: 3, total: 0, used: 0 },
  { level: 4, total: 0, used: 0 },
  { level: 5, total: 0, used: 0 },
  { level: 6, total: 0, used: 0 },
  { level: 7, total: 0, used: 0 },
  { level: 8, total: 0, used: 0 },
  { level: 9, total: 0, used: 0 }
];

export const DndSpellsSection: React.FC<DndSpellsSectionProps> = ({
  spellcasting,
  stats,
  combat,
  characterLevel = '1',
  onUpdateSpellcasting
}) => {
  const currentStats = {
    str: stats?.str ?? 10,
    dex: stats?.dex ?? 10,
    con: stats?.con ?? 10,
    int: stats?.int ?? 10,
    wis: stats?.wis ?? 10,
    cha: stats?.cha ?? 10
  };

  const numericLevel = parseInt(characterLevel.replace(/\D/g, ''), 10) || 1;
  const profBonus = combat?.proficiencyBonus ?? (Math.floor((numericLevel - 1) / 4) + 2);

  const currentAbility = spellcasting?.ability || 'int';
  const abilityMod = calculateMod(currentStats[currentAbility]);

  // Derived spell save DC & attack bonus
  const autoSaveDc = 8 + profBonus + abilityMod;
  const autoAttackBonus = profBonus + abilityMod;

  const currentSlots = spellcasting?.slots && spellcasting.slots.length > 0
    ? spellcasting.slots
    : DEFAULT_SLOTS;

  const currentSpells = spellcasting?.spells || [];

  // Spell modal state
  const [editingSpell, setEditingSpell] = useState<DndSpell | null>(null);
  const [isSpellModalOpen, setIsSpellModalOpen] = useState(false);

  const handleAbilityChange = (newAbility: 'int' | 'wis' | 'cha') => {
    onUpdateSpellcasting({
      ...spellcasting,
      ability: newAbility,
      slots: currentSlots,
      spells: currentSpells
    });
  };

  const handleSlotTotalChange = (level: number, total: number) => {
    const clampedTotal = Math.max(0, Math.min(9, isNaN(total) ? 0 : total));
    const updated = currentSlots.map(s => {
      if (s.level === level) {
        return { ...s, total: clampedTotal, used: Math.min(s.used, clampedTotal) };
      }
      return s;
    });
    onUpdateSpellcasting({
      ...spellcasting,
      ability: currentAbility,
      slots: updated,
      spells: currentSpells
    });
  };

  const toggleSlotUsed = (level: number, slotIndex: number) => {
    const updated = currentSlots.map(s => {
      if (s.level === level) {
        const newUsed = s.used === slotIndex + 1 ? slotIndex : slotIndex + 1;
        return { ...s, used: newUsed };
      }
      return s;
    });
    onUpdateSpellcasting({
      ...spellcasting,
      ability: currentAbility,
      slots: updated,
      spells: currentSpells
    });
  };

  const handleLongRestSlots = () => {
    const resetSlots = currentSlots.map(s => ({ ...s, used: 0 }));
    onUpdateSpellcasting({
      ...spellcasting,
      ability: currentAbility,
      slots: resetSlots,
      spells: currentSpells
    });
  };

  // Spell CRUD
  const handleOpenNewSpell = (defaultLevel: number = 0) => {
    setEditingSpell({
      id: 'spl-' + Date.now(),
      name: '',
      level: defaultLevel,
      school: 'Invocazione',
      castingTime: '1 azione',
      range: '18 metri (60 ft)',
      duration: 'Istantanea',
      components: 'V, S',
      concentration: false,
      ritual: false,
      prepared: true,
      description: ''
    });
    setIsSpellModalOpen(true);
  };

  const handleSaveSpell = () => {
    if (!editingSpell || !editingSpell.name.trim()) return;
    const exists = currentSpells.some(s => s.id === editingSpell.id);
    const updated = exists
      ? currentSpells.map(s => s.id === editingSpell.id ? editingSpell : s)
      : [...currentSpells, editingSpell];
    onUpdateSpellcasting({
      ...spellcasting,
      ability: currentAbility,
      slots: currentSlots,
      spells: updated
    });
    setIsSpellModalOpen(false);
    setEditingSpell(null);
  };

  const handleDeleteSpell = (id: string) => {
    onUpdateSpellcasting({
      ...spellcasting,
      ability: currentAbility,
      slots: currentSlots,
      spells: currentSpells.filter(s => s.id !== id)
    });
  };

  const toggleSpellPrepared = (spell: DndSpell) => {
    const updated = currentSpells.map(s => s.id === spell.id ? { ...s, prepared: !s.prepared } : s);
    onUpdateSpellcasting({
      ...spellcasting,
      ability: currentAbility,
      slots: currentSlots,
      spells: updated
    });
  };

  // Group spells by level
  const cantrips = currentSpells.filter(s => s.level === 0);
  const leveledSpells = currentSpells.filter(s => s.level > 0);

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-150">
      {/* 1. Spellcasting Header: Ability, DC, Attack Bonus */}
      <div className="bg-paper-50 rounded-2xl border border-paper-250 p-5 md:p-6 shadow-page space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-paper-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 border border-purple-200 flex items-center justify-center shrink-0 shadow-2xs">
              <BookOpen className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <h4 className="font-brand font-bold text-base text-paper-900 leading-tight">
                Parametri di Lancio Incantesimi
              </h4>
              <p className="text-xs text-paper-500">
                Caratteristica magica chiave, classe difficoltà e bonus attacco
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLongRestSlots}
              title="Ripristina tutti gli slot incantesimo consumati"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-paper-700 bg-paper-100 hover:bg-paper-200 rounded-xl border border-paper-250 shadow-2xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-paper-600" />
              <span>Riposo Lungo (Recupera Slot)</span>
            </button>
          </div>
        </div>

        {/* Ability selection & DCs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-3.5 border border-paper-200 shadow-2xs space-y-1.5">
            <label className="text-[11px] font-bold text-paper-600 uppercase tracking-wider block">
              Caratteristica Magica
            </label>
            <CustomSelect
              value={currentAbility}
              onChange={(val) => handleAbilityChange(val as any)}
              options={[
                { value: 'int', label: 'Intelligenza (Mago, Artefice)' },
                { value: 'wis', label: 'Saggezza (Chierico, Druido, Ranger)' },
                { value: 'cha', label: 'Carisma (Bardo, Paladino, Stregone, Warlock)' }
              ]}
              className="w-full"
              buttonClassName="w-full py-2 text-xs"
            />
          </div>

          <div className="bg-white rounded-xl p-3.5 border border-paper-200 shadow-2xs flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-bold text-paper-600 uppercase tracking-wider block mb-1">
              CD Salvezza Incantesimi
            </span>
            <span className="text-2xl font-mono font-bold text-purple-900">
              {autoSaveDc}
            </span>
            <span className="text-[10px] text-paper-400 mt-0.5">8 + {profBonus} comp. + {formatMod(abilityMod)} mod.</span>
          </div>

          <div className="bg-white rounded-xl p-3.5 border border-paper-200 shadow-2xs flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-bold text-paper-600 uppercase tracking-wider block mb-1">
              Bonus Attacco Incantesimi
            </span>
            <span className="text-2xl font-mono font-bold text-folia-900">
              {formatMod(autoAttackBonus)}
            </span>
            <span className="text-[10px] text-paper-400 mt-0.5">+{profBonus} comp. + {formatMod(abilityMod)} mod.</span>
          </div>
        </div>
      </div>

      {/* 2. Spell Slots Grid (1 - 9) */}
      <div className="bg-paper-50 rounded-2xl border border-paper-250 p-5 md:p-6 shadow-page space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-brand font-bold text-base text-paper-900 leading-tight">
              Slot Incantesimi per Livello
            </h4>
            <p className="text-xs text-paper-500">
              Spunta le caselle per tracciare gli slot usati durante la sessione
            </p>
          </div>
          <span className="text-xs text-paper-400 font-mono">Livelli 1-9</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentSlots.map(slot => (
            <div 
              key={`slot-${slot.level}`}
              className="bg-white rounded-xl border border-paper-200 p-3 shadow-2xs space-y-2 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="font-brand font-bold text-xs text-paper-900">
                  {slot.level}° Livello
                </span>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-paper-400 text-[11px]">Totali:</span>
                  <input
                    type="number"
                    min="0"
                    max="9"
                    value={slot.total}
                    onChange={(e) => handleSlotTotalChange(slot.level, parseInt(e.target.value, 10))}
                    className="w-10 text-center font-mono font-bold text-xs bg-paper-100/80 border border-paper-250 rounded-md py-0.5"
                  />
                </div>
              </div>

              {/* Slot check pills */}
              {slot.total > 0 ? (
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {Array.from({ length: slot.total }).map((_, idx) => {
                    const isUsed = slot.used > idx;
                    return (
                      <button
                        key={`check-${slot.level}-${idx}`}
                        type="button"
                        onClick={() => toggleSlotUsed(slot.level, idx)}
                        title={isUsed ? `Slot ${idx + 1} usato (clicca per liberare)` : `Slot ${idx + 1} disponibile (clicca per spendere)`}
                        className={`w-7 h-7 rounded-lg border text-xs font-mono font-bold flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
                          isUsed
                            ? 'bg-paper-200 border-paper-300 text-paper-400 line-through opacity-75'
                            : 'bg-purple-100 border-purple-400 text-purple-900 hover:scale-105'
                        }`}
                      >
                        {isUsed ? <X className="w-3.5 h-3.5 text-paper-500" /> : idx + 1}
                      </button>
                    );
                  })}
                  <span className="text-[10px] text-paper-400 ml-auto font-mono">
                    {slot.total - slot.used} liberi
                  </span>
                </div>
              ) : (
                <p className="text-[11px] text-paper-300 italic">Nessuno slot a questo livello.</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Spells List (Cantrips + Leveled Spells) */}
      <div className="bg-paper-50 rounded-2xl border border-paper-250 p-5 md:p-6 shadow-page space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center shrink-0 shadow-2xs">
              <BookOpen className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h4 className="font-brand font-bold text-base text-paper-900 leading-tight">
                Libro degli Incantesimi & Trucchetti
              </h4>
              <p className="text-xs text-paper-500">
                {currentSpells.length} incantesimi registrati nel grimorio
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleOpenNewSpell(0)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-folia-800 bg-folia-50 hover:bg-folia-100 rounded-xl transition-colors border border-folia-200 shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Aggiungi incantesimo</span>
          </button>
        </div>

        {/* Cantrips (Level 0) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-paper-200">
            <span className="font-brand font-bold text-xs uppercase tracking-wider text-amber-900">
              Trucchetti (Livello 0 - Lancio a volontà)
            </span>
            <span className="text-[11px] text-paper-400">{cantrips.length} trucchetti</span>
          </div>

          {cantrips.length === 0 ? (
            <p className="text-xs text-paper-400 italic py-2">Nessun trucchetto registrato.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {cantrips.map(spl => (
                <div 
                  key={spl.id}
                  className="bg-white rounded-xl border border-paper-200 p-3 shadow-2xs space-y-1.5 hover:border-paper-300 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-xs text-paper-900 block">{spl.name}</span>
                      <span className="text-[10px] text-paper-400">{spl.school} • {spl.castingTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSpell({ ...spl });
                          setIsSpellModalOpen(true);
                        }}
                        className="p-1 rounded-lg text-paper-400 hover:text-folia-800 hover:bg-paper-100 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSpell(spl.id)}
                        className="p-1 rounded-lg text-paper-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-paper-600 pt-0.5 border-t border-paper-100">
                    <span>Gittata: {spl.range}</span>
                    <span>• Durata: {spl.duration}</span>
                  </div>

                  {spl.description && (
                    <p className="text-[11px] text-paper-500 line-clamp-2">{spl.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Leveled Spells */}
        <div className="space-y-2 pt-3">
          <div className="flex items-center justify-between pb-1 border-b border-paper-200">
            <span className="font-brand font-bold text-xs uppercase tracking-wider text-purple-900">
              Incantesimi di Livello (1° - 9°)
            </span>
            <span className="text-[11px] text-paper-400">{leveledSpells.length} incantesimi</span>
          </div>

          {leveledSpells.length === 0 ? (
            <p className="text-xs text-paper-400 italic py-2">Nessun incantesimo di livello registrato.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {leveledSpells.map(spl => (
                <div 
                  key={spl.id}
                  className={`bg-white rounded-xl border p-3 shadow-2xs space-y-1.5 hover:border-paper-300 transition-all flex flex-col justify-between ${
                    spl.prepared ? 'border-purple-300 bg-purple-50/20' : 'border-paper-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <button
                        type="button"
                        onClick={() => toggleSpellPrepared(spl)}
                        title={spl.prepared ? 'Incantesimo preparato (clicca per rimuovere preparazione)' : 'Non preparato (clicca per preparare)'}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 transition-all cursor-pointer ${
                          spl.prepared
                            ? 'bg-purple-600 border-purple-600 text-white shadow-2xs'
                            : 'border-paper-300 bg-white hover:border-purple-400'
                        }`}
                      >
                        {spl.prepared && <Check className="w-3 h-3" />}
                      </button>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs text-paper-900">{spl.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-purple-100 text-purple-900 font-mono font-semibold">
                            {spl.level}° liv.
                          </span>
                          {spl.concentration && (
                            <span className="text-[9px] px-1 py-0.2 rounded-md bg-amber-100 text-amber-900 font-bold" title="Richiede concentrazione">
                              C
                            </span>
                          )}
                          {spl.ritual && (
                            <span className="text-[9px] px-1 py-0.2 rounded-md bg-blue-100 text-blue-900 font-bold" title="Lanciabile come rituale">
                              R
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-paper-400">{spl.school} • {spl.castingTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSpell({ ...spl });
                          setIsSpellModalOpen(true);
                        }}
                        className="p-1 rounded-lg text-paper-400 hover:text-folia-800 hover:bg-paper-100 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSpell(spl.id)}
                        className="p-1 rounded-lg text-paper-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-paper-600 pt-0.5 border-t border-paper-100">
                    <span>Gittata: {spl.range}</span>
                    <span>• Durata: {spl.duration}</span>
                  </div>

                  {spl.description && (
                    <p className="text-[11px] text-paper-500 line-clamp-2">{spl.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Spell Add/Edit Modal */}
      {isSpellModalOpen && editingSpell && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in select-none folia-modal-overlay"
          onClick={() => setIsSpellModalOpen(false)}
        >
          <div 
            className="bg-paper-50 rounded-2xl shadow-modal border border-paper-300 w-full max-w-lg overflow-hidden flex flex-col p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-paper-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 border border-purple-200 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <h3 className="font-brand font-bold text-base text-paper-900 leading-tight">
                    {currentSpells.some(s => s.id === editingSpell.id) ? 'Modifica Incantesimo' : 'Nuovo Incantesimo'}
                  </h3>
                  <p className="text-xs text-paper-500">Definisci livello, tempo di lancio e dettagli dell'incantesimo</p>
                </div>
              </div>
              <button
                onClick={() => setIsSpellModalOpen(false)}
                className="p-1 rounded-lg text-paper-400 hover:text-paper-700 hover:bg-paper-150 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-paper-700 uppercase tracking-wider mb-1">
                  Nome dell'incantesimo *
                </label>
                <input
                  type="text"
                  autoFocus
                  value={editingSpell.name}
                  onChange={(e) => setEditingSpell({ ...editingSpell, name: e.target.value })}
                  placeholder="es. Palla di Fuoco, Scudo, Cura Ferite, Passo Velato..."
                  className="w-full px-3.5 py-2 text-xs bg-white border border-paper-300 rounded-xl text-paper-900 focus:outline-hidden focus:border-folia-600 shadow-2xs font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-paper-700 uppercase tracking-wider mb-1">
                    Livello
                  </label>
                  <CustomSelect
                    value={String(editingSpell.level)}
                    onChange={(val) => setEditingSpell({ ...editingSpell, level: parseInt(val, 10) || 0 })}
                    options={[
                      { value: '0', label: 'Trucchetto (Livello 0)' },
                      { value: '1', label: '1° Livello' },
                      { value: '2', label: '2° Livello' },
                      { value: '3', label: '3° Livello' },
                      { value: '4', label: '4° Livello' },
                      { value: '5', label: '5° Livello' },
                      { value: '6', label: '6° Livello' },
                      { value: '7', label: '7° Livello' },
                      { value: '8', label: '8° Livello' },
                      { value: '9', label: '9° Livello' }
                    ]}
                    className="w-full"
                    buttonClassName="w-full py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-paper-700 uppercase tracking-wider mb-1">
                    Scuola di Magia
                  </label>
                  <CustomSelect
                    value={editingSpell.school || 'Invocazione'}
                    onChange={(val) => setEditingSpell({ ...editingSpell, school: val })}
                    options={[
                      { value: 'Abiurazione', label: 'Abiurazione' },
                      { value: 'Ammaliamento', label: 'Ammaliamento' },
                      { value: 'Divinazione', label: 'Divinazione' },
                      { value: 'Evocazione', label: 'Evocazione' },
                      { value: 'Illusione', label: 'Illusione' },
                      { value: 'Invocazione', label: 'Invocazione' },
                      { value: 'Necromanzia', label: 'Necromanzia' },
                      { value: 'Trasmutazione', label: 'Trasmutazione' }
                    ]}
                    className="w-full"
                    buttonClassName="w-full py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-paper-700 uppercase tracking-wider mb-1">
                    Tempo di Lancio
                  </label>
                  <input
                    type="text"
                    value={editingSpell.castingTime || ''}
                    onChange={(e) => setEditingSpell({ ...editingSpell, castingTime: e.target.value })}
                    placeholder="1 azione, 1 azione bonus, 1 reazione..."
                    className="w-full px-3.5 py-2 text-xs bg-white border border-paper-300 rounded-xl text-paper-900 focus:outline-hidden focus:border-folia-600 shadow-2xs font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-paper-700 uppercase tracking-wider mb-1">
                    Gittata
                  </label>
                  <input
                    type="text"
                    value={editingSpell.range || ''}
                    onChange={(e) => setEditingSpell({ ...editingSpell, range: e.target.value })}
                    placeholder="Contatto, 18m, 36m, Sé..."
                    className="w-full px-3.5 py-2 text-xs bg-white border border-paper-300 rounded-xl text-paper-900 focus:outline-hidden focus:border-folia-600 shadow-2xs font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-paper-700 uppercase tracking-wider mb-1">
                    Durata
                  </label>
                  <input
                    type="text"
                    value={editingSpell.duration || ''}
                    onChange={(e) => setEditingSpell({ ...editingSpell, duration: e.target.value })}
                    placeholder="Istantanea, 1 minuto, 1 ora..."
                    className="w-full px-3.5 py-2 text-xs bg-white border border-paper-300 rounded-xl text-paper-900 focus:outline-hidden focus:border-folia-600 shadow-2xs font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-paper-700 uppercase tracking-wider mb-1">
                    Componenti
                  </label>
                  <input
                    type="text"
                    value={editingSpell.components || ''}
                    onChange={(e) => setEditingSpell({ ...editingSpell, components: e.target.value })}
                    placeholder="V, S, M (polvere di zolfo)..."
                    className="w-full px-3.5 py-2 text-xs bg-white border border-paper-300 rounded-xl text-paper-900 focus:outline-hidden focus:border-folia-600 shadow-2xs font-sans"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => setEditingSpell({ ...editingSpell, concentration: !editingSpell.concentration })}
                  className="flex items-center gap-2 text-xs font-semibold text-paper-800 cursor-pointer select-none group"
                >
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                    editingSpell.concentration
                      ? 'bg-folia-800 border-folia-800 text-white shadow-2xs'
                      : 'bg-white border-paper-300 group-hover:border-paper-400'
                  }`}>
                    {editingSpell.concentration && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>Concentrazione (C)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditingSpell({ ...editingSpell, ritual: !editingSpell.ritual })}
                  className="flex items-center gap-2 text-xs font-semibold text-paper-800 cursor-pointer select-none group"
                >
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                    editingSpell.ritual
                      ? 'bg-folia-800 border-folia-800 text-white shadow-2xs'
                      : 'bg-white border-paper-300 group-hover:border-paper-400'
                  }`}>
                    {editingSpell.ritual && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>Rituale (R)</span>
                </button>

                {editingSpell.level > 0 && (
                  <button
                    type="button"
                    onClick={() => setEditingSpell({ ...editingSpell, prepared: !editingSpell.prepared })}
                    className="flex items-center gap-2 text-xs font-semibold text-paper-800 cursor-pointer select-none group"
                  >
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                      editingSpell.prepared
                        ? 'bg-folia-800 border-folia-800 text-white shadow-2xs'
                        : 'bg-white border-paper-300 group-hover:border-folia-400'
                    }`}>
                      {editingSpell.prepared && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>Preparato oggi</span>
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-paper-700 uppercase tracking-wider mb-1">
                  Descrizione & Effetto
                </label>
                <textarea
                  rows={4}
                  value={editingSpell.description || ''}
                  onChange={(e) => setEditingSpell({ ...editingSpell, description: e.target.value })}
                  placeholder="Descrizione dell'effetto magico, danni inflitti, tiri salvezza richiesti e aumenti a livelli superiori..."
                  className="w-full p-2.5 text-xs bg-white border border-paper-300 rounded-xl text-paper-900 focus:outline-hidden focus:border-folia-600 shadow-2xs font-sans resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-paper-200">
              <button
                type="button"
                onClick={() => setIsSpellModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-paper-200 hover:bg-paper-300 text-paper-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                Annulla
              </button>
              <button
                type="button"
                disabled={!editingSpell.name.trim()}
                onClick={handleSaveSpell}
                className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Salva incantesimo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
