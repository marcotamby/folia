import React, { useState } from 'react';
import { 
  Swords, 
  Coins, 
  Package, 
  Link2, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  Check, 
  CircleDot
} from 'lucide-react';
import { DndWeapon, DndEquipmentItem, DndCurrency } from '../../../types';
import { CustomSelect } from '../../common/CustomSelect';

interface DndEquipmentSectionProps {
  weapons?: DndWeapon[];
  equipment?: DndEquipmentItem[];
  currency?: DndCurrency;
  onUpdateWeapons: (weapons: DndWeapon[]) => void;
  onUpdateEquipment: (equipment: DndEquipmentItem[]) => void;
  onUpdateCurrency: (currency: DndCurrency) => void;
}

const RARITY_COLORS: Record<string, string> = {
  'comune': 'bg-paper-200 text-paper-700 border-paper-300',
  'non comune': 'bg-emerald-100 text-emerald-800 border-emerald-300',
  'raro': 'bg-blue-100 text-blue-800 border-blue-300',
  'molto raro': 'bg-purple-100 text-purple-800 border-purple-300',
  'leggendario': 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
  'artefatto': 'bg-rose-100 text-rose-900 border-rose-300 font-bold animate-pulse'
};

export const DndEquipmentSection: React.FC<DndEquipmentSectionProps> = ({
  weapons = [],
  equipment = [],
  currency,
  onUpdateWeapons,
  onUpdateEquipment,
  onUpdateCurrency
}) => {
  const currentCurrency: DndCurrency = {
    cp: currency?.cp ?? 0,
    sp: currency?.sp ?? 0,
    ep: currency?.ep ?? 0,
    gp: currency?.gp ?? 0,
    pp: currency?.pp ?? 0
  };

  // Weapon Modal State
  const [editingWeapon, setEditingWeapon] = useState<DndWeapon | null>(null);
  const [isWeaponModalOpen, setIsWeaponModalOpen] = useState(false);

  // Equipment Item Modal State
  const [editingItem, setEditingItem] = useState<DndEquipmentItem | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  // Attuned count
  const attunedCount = equipment.filter(i => i.isAttuned).length;

  // Currency handler
  const handleCurrencyChange = (coin: keyof DndCurrency, val: number) => {
    onUpdateCurrency({
      ...currentCurrency,
      [coin]: Math.max(0, isNaN(val) ? 0 : val)
    });
  };

  // Weapon handlers
  const handleOpenNewWeapon = () => {
    setEditingWeapon({
      id: 'wep-' + Date.now(),
      name: '',
      attackBonus: '+5',
      damage: '1d8 + 3',
      damageType: 'Tagliente',
      range: 'Mischia',
      notes: ''
    });
    setIsWeaponModalOpen(true);
  };

  const handleSaveWeapon = () => {
    if (!editingWeapon || !editingWeapon.name.trim()) return;
    const exists = weapons.some(w => w.id === editingWeapon.id);
    const updated = exists
      ? weapons.map(w => w.id === editingWeapon.id ? editingWeapon : w)
      : [...weapons, editingWeapon];
    onUpdateWeapons(updated);
    setIsWeaponModalOpen(false);
    setEditingWeapon(null);
  };

  const handleDeleteWeapon = (id: string) => {
    onUpdateWeapons(weapons.filter(w => w.id !== id));
  };

  // Equipment handlers
  const handleOpenNewItem = () => {
    setEditingItem({
      id: 'item-' + Date.now(),
      name: '',
      quantity: 1,
      weight: '0.5 kg',
      rarity: 'comune',
      attunement: false,
      isAttuned: false,
      description: ''
    });
    setIsItemModalOpen(true);
  };

  const handleSaveItem = () => {
    if (!editingItem || !editingItem.name.trim()) return;
    const exists = equipment.some(i => i.id === editingItem.id);
    const updated = exists
      ? equipment.map(i => i.id === editingItem.id ? editingItem : i)
      : [...equipment, editingItem];
    onUpdateEquipment(updated);
    setIsItemModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    onUpdateEquipment(equipment.filter(i => i.id !== id));
  };

  const toggleAttunement = (item: DndEquipmentItem) => {
    if (!item.isAttuned && attunedCount >= 3) {
      alert('Tutti e 3 gli slot di sintonizzazione sono già occupati!');
      return;
    }
    const updated = equipment.map(i => i.id === item.id ? { ...i, isAttuned: !i.isAttuned } : i);
    onUpdateEquipment(updated);
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-150">
      {/* 1. Weapons & Attacks Table */}
      <div className="bg-paper-50 rounded-2xl border border-paper-250 p-5 md:p-6 shadow-page space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center shrink-0 shadow-2xs">
              <Swords className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h4 className="font-brand font-bold text-base text-paper-900 leading-tight">
                Armi & Attacchi Rapidi
              </h4>
              <p className="text-xs text-paper-500">
                Bonus al tiro per colpire (TxC), dadi di danno e gittata
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenNewWeapon}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-folia-800 bg-folia-50 hover:bg-folia-100 rounded-xl transition-colors border border-folia-200 shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Aggiungi arma</span>
          </button>
        </div>

        {weapons.length === 0 ? (
          <p className="text-xs text-paper-400 italic py-3 text-center bg-paper-100/60 rounded-xl border border-dashed border-paper-250">
            Nessuna arma o attacco registrato. Clicca su "Aggiungi arma" per inserire spade, archi o incantesimi d'attacco.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {weapons.map(wep => (
              <div 
                key={wep.id}
                className="bg-white rounded-xl border border-paper-200 p-3.5 shadow-2xs space-y-2 flex flex-col justify-between hover:border-paper-300 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-bold text-sm text-paper-900 block truncate">{wep.name}</span>
                    <span className="text-[11px] text-paper-500 block">{wep.range || 'Mischia'}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingWeapon({ ...wep });
                        setIsWeaponModalOpen(true);
                      }}
                      className="p-1 rounded-lg text-paper-400 hover:text-folia-800 hover:bg-paper-100 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteWeapon(wep.id)}
                      className="p-1 rounded-lg text-paper-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-paper-100 text-xs">
                  <div className="bg-paper-100/70 p-1.5 rounded-lg text-center">
                    <span className="text-[10px] text-paper-400 block uppercase font-sans">Attacco (TxC)</span>
                    <span className="font-mono font-bold text-folia-900 text-sm">{wep.attackBonus || '+0'}</span>
                  </div>
                  <div className="bg-paper-100/70 p-1.5 rounded-lg text-center">
                    <span className="text-[10px] text-paper-400 block uppercase font-sans">Danno & Tipo</span>
                    <span className="font-mono font-bold text-amber-900 text-xs truncate block">
                      {wep.damage} <span className="font-sans font-normal text-[10px] text-paper-600">({wep.damageType})</span>
                    </span>
                  </div>
                </div>

                {wep.notes && (
                  <p className="text-[11px] text-paper-500 italic truncate pt-1">{wep.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Attunement & Currency Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attunement Tracker (3 Slots in 5e) */}
        <div className="bg-paper-50 rounded-2xl border border-paper-250 p-5 shadow-page space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-purple-600" />
              <h5 className="font-brand font-bold text-sm text-paper-900">
                Sintonizzazione Magica
              </h5>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900">
              {attunedCount} / 3 slot
            </span>
          </div>

          <div className="flex items-center justify-center gap-4 py-2">
            {[0, 1, 2].map((idx) => {
              const isFilled = attunedCount > idx;
              return (
                <div 
                  key={`attune-${idx}`}
                  className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all shadow-xs ${
                    isFilled 
                      ? 'bg-purple-100 border-purple-500 text-purple-700 ring-2 ring-purple-300' 
                      : 'bg-paper-100 border-paper-300 text-paper-300'
                  }`}
                >
                  <CircleDot className={`w-6 h-6 ${isFilled ? 'text-purple-600 animate-pulse' : ''}`} />
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-paper-400 text-center">
            In D&D 5e ogni personaggio può sintonizzarsi con un massimo di 3 oggetti magici potenti contemporaneamente.
          </p>
        </div>

        {/* Currency Coins */}
        <div className="bg-paper-50 rounded-2xl border border-paper-250 p-5 shadow-page space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-600" />
            <h5 className="font-brand font-bold text-sm text-paper-900">
              Borsa delle Monete & Tesoro
            </h5>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {/* Rame CP */}
            <div className="bg-amber-900/10 border border-amber-900/20 rounded-xl p-2.5 text-center shadow-2xs">
              <span className="text-[10px] font-bold text-amber-900 uppercase block mb-1">MR (Rame)</span>
              <input
                type="number"
                min="0"
                value={currentCurrency.cp}
                onChange={(e) => handleCurrencyChange('cp', parseInt(e.target.value, 10))}
                className="w-full text-center text-sm font-bold font-mono text-amber-950 bg-white/80 border border-amber-900/20 rounded-lg py-1 focus:outline-hidden"
              />
            </div>

            {/* Argento SP */}
            <div className="bg-slate-200/60 border border-slate-300 rounded-xl p-2.5 text-center shadow-2xs">
              <span className="text-[10px] font-bold text-slate-700 uppercase block mb-1">MA (Argento)</span>
              <input
                type="number"
                min="0"
                value={currentCurrency.sp}
                onChange={(e) => handleCurrencyChange('sp', parseInt(e.target.value, 10))}
                className="w-full text-center text-sm font-bold font-mono text-slate-900 bg-white/80 border border-slate-300 rounded-lg py-1 focus:outline-hidden"
              />
            </div>

            {/* Electrum EP */}
            <div className="bg-teal-100/50 border border-teal-200 rounded-xl p-2.5 text-center shadow-2xs">
              <span className="text-[10px] font-bold text-teal-800 uppercase block mb-1">ME (Electrum)</span>
              <input
                type="number"
                min="0"
                value={currentCurrency.ep}
                onChange={(e) => handleCurrencyChange('ep', parseInt(e.target.value, 10))}
                className="w-full text-center text-sm font-bold font-mono text-teal-950 bg-white/80 border border-teal-200 rounded-lg py-1 focus:outline-hidden"
              />
            </div>

            {/* Oro GP */}
            <div className="bg-amber-200/60 border border-amber-400 rounded-xl p-2.5 text-center shadow-2xs">
              <span className="text-[10px] font-bold text-amber-900 uppercase block mb-1">MO (Oro)</span>
              <input
                type="number"
                min="0"
                value={currentCurrency.gp}
                onChange={(e) => handleCurrencyChange('gp', parseInt(e.target.value, 10))}
                className="w-full text-center text-sm font-bold font-mono text-amber-950 bg-white/90 border border-amber-400 rounded-lg py-1 focus:outline-hidden"
              />
            </div>

            {/* Platino PP */}
            <div className="bg-purple-100/60 border border-purple-300 rounded-xl p-2.5 text-center shadow-2xs col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-purple-900 uppercase block mb-1">MP (Platino)</span>
              <input
                type="number"
                min="0"
                value={currentCurrency.pp}
                onChange={(e) => handleCurrencyChange('pp', parseInt(e.target.value, 10))}
                className="w-full text-center text-sm font-bold font-mono text-purple-950 bg-white/80 border border-purple-300 rounded-lg py-1 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Inventory Items & Magic Gear */}
      <div className="bg-paper-50 rounded-2xl border border-paper-250 p-5 md:p-6 shadow-page space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 border border-purple-200 flex items-center justify-center shrink-0 shadow-2xs">
              <Package className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <h4 className="font-brand font-bold text-base text-paper-900 leading-tight">
                Inventario, Equipaggiamento & Oggetti Magici
              </h4>
              <p className="text-xs text-paper-500">
                Pacco da esplorazione, pozioni, pergamene, armature e artefatti
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenNewItem}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-800 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors border border-purple-200 shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Aggiungi oggetto</span>
          </button>
        </div>

        {equipment.length === 0 ? (
          <p className="text-xs text-paper-400 italic py-3 text-center bg-paper-100/60 rounded-xl border border-dashed border-paper-250">
            Nessun oggetto nell'inventario. Aggiungi pozioni, provviste, armature o artefatti magici.
          </p>
        ) : (
          <div className="space-y-2">
            {equipment.map(item => (
              <div 
                key={item.id}
                className="bg-white rounded-xl border border-paper-200 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-paper-300 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-paper-100 border border-paper-200 flex items-center justify-center text-xs font-mono font-bold text-paper-800 shrink-0">
                    x{item.quantity || 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-paper-900">{item.name}</span>
                      {item.rarity && item.rarity !== 'comune' && (
                        <span className={`text-[10px] px-2 py-0.2 rounded-md border uppercase font-medium ${RARITY_COLORS[item.rarity] || ''}`}>
                          {item.rarity}
                        </span>
                      )}
                      {item.attunement && (
                        <button
                          type="button"
                          onClick={() => toggleAttunement(item)}
                          className={`text-[10px] px-2 py-0.2 rounded-md border font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                            item.isAttuned
                              ? 'bg-purple-600 text-white border-purple-700 shadow-2xs'
                              : 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100'
                          }`}
                        >
                          <Link2 className="w-2.5 h-2.5" />
                          <span>{item.isAttuned ? 'Sintonizzato' : 'Richiede sintonia'}</span>
                        </button>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-[11px] text-paper-500 truncate mt-0.5">{item.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-paper-100">
                  {item.weight && (
                    <span className="text-[11px] font-mono text-paper-400">{item.weight}</span>
                  )}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem({ ...item });
                        setIsItemModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-paper-400 hover:text-folia-800 hover:bg-paper-100 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 rounded-lg text-paper-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weapon Modal */}
      {isWeaponModalOpen && editingWeapon && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in select-none folia-modal-overlay"
          onClick={() => setIsWeaponModalOpen(false)}
        >
          <div 
            className="bg-paper-50 rounded-2xl shadow-modal border border-paper-300 w-full max-w-lg overflow-hidden flex flex-col p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-paper-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center shrink-0">
                  <Swords className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-brand font-bold text-base text-paper-900 leading-tight">
                    {weapons.some(w => w.id === editingWeapon.id) ? 'Modifica Arma' : 'Nuova Arma o Attacco'}
                  </h3>
                  <p className="text-xs text-paper-500">Definisci i parametri di combattimento dell'attacco</p>
                </div>
              </div>
              <button
                onClick={() => setIsWeaponModalOpen(false)}
                className="p-1 rounded-lg text-paper-400 hover:text-paper-700 hover:bg-paper-150 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-paper-700 uppercase tracking-wider mb-1">
                  Nome dell'arma / attacco *
                </label>
                <input
                  type="text"
                  autoFocus
                  value={editingWeapon.name}
                  onChange={(e) => setEditingWeapon({ ...editingWeapon, name: e.target.value })}
                  placeholder="es. Spada lunga +1, Arco lungo elfico, Dardo incantato..."
                  className="w-full px-3.5 py-2 text-xs bg-white border border-paper-300 rounded-xl text-paper-900 focus:outline-hidden focus:border-folia-600 shadow-2xs font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-paper-700 uppercase tracking-wider mb-1">
                    Bonus Attacco (TxC)
                  </label>
                  <input
                    type="text"
                    value={editingWeapon.attackBonus}
                    onChange={(e) => setEditingWeapon({ ...editingWeapon, attackBonus: e.target.value })}
                    placeholder="es. +5, +7..."
                    className="w-full px-3.5 py-2 text-xs bg-white border border-paper-300 rounded-xl text-paper-900 focus:outline-hidden focus:border-folia-600 shadow-2xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-paper-700 uppercase tracking-wider mb-1">
                    Formula Danno
                  </label>
                  <input
                    type="text"
                    value={editingWeapon.damage}
                    onChange={(e) => setEditingWeapon({ ...editingWeapon, damage: e.target.value })}
                    placeholder="es. 1d8+3, 2d6..."
                    className="w-full px-3.5 py-2 text-xs bg-white border border-paper-300 rounded-xl text-paper-900 focus:outline-hidden focus:border-folia-600 shadow-2xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-paper-700 uppercase tracking-wider mb-1">
                    Tipo di Danno
                  </label>
                  <input
                    type="text"
                    value={editingWeapon.damageType}
                    onChange={(e) => setEditingWeapon({ ...editingWeapon, damageType: e.target.value })}
                    placeholder="Tagliente, Perforante, Fuoco..."
                    className="w-full px-3.5 py-2 text-xs bg-white border border-paper-300 rounded-xl text-paper-900 focus:outline-hidden focus:border-folia-600 shadow-2xs font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-paper-700 uppercase tracking-wider mb-1">
                    Gittata
                  </label>
                  <input
                    type="text"
                    value={editingWeapon.range || ''}
                    onChange={(e) => setEditingWeapon({ ...editingWeapon, range: e.target.value })}
                    placeholder="Mischia, 45m (150ft)..."
                    className="w-full px-3.5 py-2 text-xs bg-white border border-paper-300 rounded-xl text-paper-900 focus:outline-hidden focus:border-folia-600 shadow-2xs font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-paper-700 uppercase tracking-wider mb-1">
                  Proprietà & Note speciali
                </label>
                <input
                  type="text"
                  value={editingWeapon.notes || ''}
                  onChange={(e) => setEditingWeapon({ ...editingWeapon, notes: e.target.value })}
                  placeholder="es. Versatile (1d10), Finesse, Magica..."
                  className="w-full px-3.5 py-2 text-xs bg-white border border-paper-300 rounded-xl text-paper-900 focus:outline-hidden focus:border-folia-600 shadow-2xs font-sans"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-paper-200">
              <button
                type="button"
                onClick={() => setIsWeaponModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-paper-200 hover:bg-paper-300 text-paper-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                Annulla
              </button>
              <button
                type="button"
                disabled={!editingWeapon.name.trim()}
                onClick={handleSaveWeapon}
                className="px-4 py-2 rounded-xl bg-folia-800 hover:bg-folia-900 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Salva arma
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Equipment Item Modal */}
      {isItemModalOpen && editingItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in select-none folia-modal-overlay"
          onClick={() => setIsItemModalOpen(false)}
        >
          <div 
            className="bg-paper-50 rounded-2xl shadow-modal border border-paper-300 w-full max-w-md overflow-hidden flex flex-col p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-paper-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 border border-purple-200 flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <h3 className="font-brand font-bold text-base text-paper-900 leading-tight">
                    {equipment.some(i => i.id === editingItem.id) ? 'Modifica Oggetto' : 'Nuovo Oggetto'}
                  </h3>
                  <p className="text-xs text-paper-500">Aggiungi o modifica oggetto nell'equipaggiamento</p>
                </div>
              </div>
              <button
                onClick={() => setIsItemModalOpen(false)}
                className="p-1 rounded-lg text-paper-400 hover:text-paper-700 hover:bg-paper-150 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-paper-700 uppercase tracking-wider mb-1">
                  Nome dell'oggetto *
                </label>
                <input
                  type="text"
                  autoFocus
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="es. Pozione di Guarigione Maggiore, Anello di Protezione..."
                  className="w-full px-3.5 py-2 text-xs bg-white border border-paper-300 rounded-xl text-paper-900 focus:outline-hidden focus:border-folia-600 shadow-2xs font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-paper-700 uppercase tracking-wider mb-1">
                    Quantità
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingItem.quantity}
                    onChange={(e) => setEditingItem({ ...editingItem, quantity: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-paper-300 rounded-xl text-paper-900 focus:outline-hidden focus:border-folia-600 shadow-2xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-paper-700 uppercase tracking-wider mb-1">
                    Peso
                  </label>
                  <input
                    type="text"
                    value={editingItem.weight || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, weight: e.target.value })}
                    placeholder="es. 0.5 kg, 2 lb..."
                    className="w-full px-3.5 py-2 text-xs bg-white border border-paper-300 rounded-xl text-paper-900 focus:outline-hidden focus:border-folia-600 shadow-2xs font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-paper-700 uppercase tracking-wider mb-1">
                  Rarità
                </label>
                <CustomSelect
                  value={editingItem.rarity || 'comune'}
                  onChange={(val) => setEditingItem({ ...editingItem, rarity: val as any })}
                  options={[
                    { value: 'comune', label: 'Comune' },
                    { value: 'non comune', label: 'Non comune (Verde)' },
                    { value: 'raro', label: 'Raro (Blu)' },
                    { value: 'molto raro', label: 'Molto raro (Viola)' },
                    { value: 'leggendario', label: 'Leggendario (Oro)' },
                    { value: 'artefatto', label: 'Artefatto (Rosso)' }
                  ]}
                  className="w-full"
                  buttonClassName="w-full py-2"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const nextAttunement = !editingItem.attunement;
                    setEditingItem({
                      ...editingItem,
                      attunement: nextAttunement,
                      isAttuned: nextAttunement ? editingItem.isAttuned : false
                    });
                  }}
                  className="flex items-center gap-2 text-xs font-semibold text-paper-800 cursor-pointer select-none group"
                >
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                    editingItem.attunement
                      ? 'bg-folia-800 border-folia-800 text-white shadow-2xs'
                      : 'bg-white border-paper-300 group-hover:border-paper-400'
                  }`}>
                    {editingItem.attunement && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>Richiede sintonizzazione</span>
                </button>

                {editingItem.attunement && (
                  <button
                    type="button"
                    onClick={() => setEditingItem({ ...editingItem, isAttuned: !editingItem.isAttuned })}
                    className="flex items-center gap-2 text-xs font-semibold text-paper-800 cursor-pointer select-none group"
                  >
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                      editingItem.isAttuned
                        ? 'bg-folia-800 border-folia-800 text-white shadow-2xs'
                        : 'bg-white border-paper-300 group-hover:border-folia-400'
                    }`}>
                      {editingItem.isAttuned && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>Attualmente sintonizzato</span>
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-paper-700 uppercase tracking-wider mb-1">
                  Descrizione o proprietà
                </label>
                <textarea
                  rows={3}
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Proprietà magiche, cariche, effetto o note..."
                  className="w-full p-2.5 text-xs bg-white border border-paper-300 rounded-xl text-paper-900 focus:outline-hidden focus:border-folia-600 shadow-2xs font-sans resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-paper-200">
              <button
                type="button"
                onClick={() => setIsItemModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-paper-200 hover:bg-paper-300 text-paper-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                Annulla
              </button>
              <button
                type="button"
                disabled={!editingItem.name.trim()}
                onClick={handleSaveItem}
                className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Salva oggetto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
