import React, { useState } from 'react';
import { 
  User, 
  Target, 
  Heart, 
  Flame, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Link2, 
  BookOpen, 
  Eye, 
  Brain, 
  Layers, 
  AlertTriangle,
  X,
  SlidersHorizontal,
  Shield,
  Maximize2,
  Camera,
  Swords,
  Skull,
  Users
} from 'lucide-react';
import { 
  Character, 
  CharacterTrait, 
  CharacterRole, 
  CharacterRelation,
  DndCharacterData,
  DndStats,
  DndCombatStats,
  DndWeapon,
  DndEquipmentItem,
  DndCurrency,
  DndSpellcasting,
  DndMonsterData
} from '../../types';
import { CustomSelect } from '../common/CustomSelect';
import { ConfirmModal } from '../common/ConfirmModal';
import { FocusTextModal } from '../common/FocusTextModal';
import { ImageUploadModal } from '../modals/ImageUploadModal';
import { ImageLightboxModal } from '../modals/ImageLightboxModal';
import { DndStatsSection } from './dnd/DndStatsSection';
import { DndEquipmentSection } from './dnd/DndEquipmentSection';
import { DndSpellsSection } from './dnd/DndSpellsSection';
import { DndMonsterStatblock } from './dnd/DndMonsterStatblock';
import { DndPartyOverview } from './dnd/DndPartyOverview';

interface CharacterEditorProps {
  character: Character | null;
  allCharacters: Character[];
  onUpdateCharacter: (char: Character) => void;
  onDeleteCharacter: (id: string) => void;
  onSelectCharacter?: (id: string) => void;
  isTtrpg?: boolean;
  customDndClasses?: string[];
  customDndRaces?: string[];
  onAddCustomDndClass?: (className: string) => void;
  onAddCustomDndRace?: (raceName: string) => void;
  t: (key: string) => string;
}

export const CharacterEditor: React.FC<CharacterEditorProps> = ({
  character,
  allCharacters,
  onUpdateCharacter,
  onDeleteCharacter,
  onSelectCharacter,
  isTtrpg = false,
  customDndClasses = [],
  customDndRaces = [],
  onAddCustomDndClass,
  onAddCustomDndRace,
  t
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [addOptionType, setAddOptionType] = useState<'class' | 'race' | null>(null);
  const [newOptionValue, setNewOptionValue] = useState('');
  const [expandedBox, setExpandedBox] = useState<{
    field: keyof Character;
    title: string;
    icon: React.ReactNode;
    placeholder?: string;
  } | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [selectedTargetCharId, setSelectedTargetCharId] = useState<string>('');
  const [relationTypeInput, setRelationTypeInput] = useState<string>('');

  // D&D 5e Tab Navigation & Master Screen
  const [dndTab, setDndTab] = useState<'narrative' | 'stats' | 'equipment' | 'spells' | 'monster'>('narrative');
  const [showPartyOverview, setShowPartyOverview] = useState(false);

  // If DM Screen / Party Overview is requested, render it
  if (isTtrpg && showPartyOverview) {
    return (
      <DndPartyOverview
        characters={allCharacters}
        onSelectCharacter={(id) => {
          if (onSelectCharacter) onSelectCharacter(id);
          setShowPartyOverview(false);
        }}
        onUpdateCharacter={onUpdateCharacter}
        onClose={() => setShowPartyOverview(false)}
      />
    );
  }

  if (!character) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-paper-150 p-8 text-center select-none">
        <div className="w-16 h-16 rounded-2xl bg-paper-200 border border-paper-300 flex items-center justify-center text-paper-400 mb-4">
          <User className="w-8 h-8 text-amber-600" />
        </div>
        <h3 className="font-brand text-xl font-semibold text-paper-800 mb-1">
          {isTtrpg ? 'Nessun PG o NPC selezionato' : 'Nessun personaggio selezionato'}
        </h3>
        <p className="text-xs text-paper-500 max-w-xs mb-4">
          {isTtrpg 
            ? 'Seleziona o crea una scheda personaggio per definire classe, razza, motivazioni e legami del party.'
            : 'Seleziona o crea una scheda personaggio per definire motivazioni, aspetto e relazioni.'}
        </p>
        {isTtrpg && allCharacters.length > 0 && (
          <button
            type="button"
            onClick={() => setShowPartyOverview(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Apri Schermo del Master (Riepilogo Party)</span>
          </button>
        )}
      </div>
    );
  }

  const handleChange = (field: keyof Character, value: any) => {
    onUpdateCharacter({
      ...character,
      [field]: value,
      updatedAt: new Date().toISOString()
    });
  };

  const handleUpdateDndData = (partial: Partial<DndCharacterData>) => {
    const currentDnd = character.dndData || {};
    onUpdateCharacter({
      ...character,
      dndData: {
        ...currentDnd,
        ...partial
      },
      updatedAt: new Date().toISOString()
    });
  };

  const handleAddTrait = () => {
    const newTrait: CharacterTrait = {
      id: 'trait-' + Date.now(),
      label: isTtrpg ? 'Statistica / Talento' : 'Nuovo tratto',
      value: isTtrpg ? '+3' : '7/10'
    };
    handleChange('traits', [...(character.traits || []), newTrait]);
  };

  const handleUpdateTrait = (id: string, label: string, value: string) => {
    const updated = (character.traits || []).map(t => t.id === id ? { ...t, label, value } : t);
    handleChange('traits', updated);
  };

  const handleDeleteTrait = (id: string) => {
    handleChange('traits', (character.traits || []).filter(t => t.id !== id));
  };

  const otherCharacters = allCharacters.filter(c => c.id !== character.id);

  const handleOpenLinkModal = () => {
    if (otherCharacters.length === 0) return;
    const existingTargetIds = new Set((character.relationships || []).map(r => r.targetCharacterId));
    const unlinked = otherCharacters.find(c => !existingTargetIds.has(c.id));
    const defaultChar = unlinked || otherCharacters[0];
    setSelectedTargetCharId(defaultChar.id);
    setRelationTypeInput(isTtrpg ? 'Compagno di party' : 'Alleato');
    setIsLinkModalOpen(true);
  };

  const handleConfirmAddRelation = () => {
    const target = allCharacters.find(c => c.id === selectedTargetCharId);
    if (!target) return;

    const newRel: CharacterRelation = {
      id: 'rel-' + Date.now(),
      targetCharacterId: target.id,
      targetCharacterName: target.name,
      relationType: relationTypeInput.trim() || (isTtrpg ? 'Compagno di party' : 'Alleato')
    };
    handleChange('relationships', [...(character.relationships || []), newRel]);
    setIsLinkModalOpen(false);
    setSelectedTargetCharId('');
    setRelationTypeInput('');
  };

  const handleDeleteRelation = (id: string) => {
    handleChange('relationships', (character.relationships || []).filter(r => r.id !== id));
  };

  // D&D standard classes and races
  const defaultClasses = [
    'Artefice',
    'Barbaro',
    'Bardo',
    'Chierico',
    'Druido',
    'Guerriero',
    'Ladro',
    'Mago',
    'Monaco',
    'Paladino',
    'Ranger',
    'Stregone',
    'Warlock',
    'NPC / Mostro'
  ];

  const defaultRaces = [
    'Umano',
    'Elfo',
    'Nano',
    'Halfling',
    'Dragonide',
    'Gnomo',
    'Mezzelfo',
    'Mezzorco',
    'Tiefling',
    'Aasimar',
    'Goliath',
    'Tabaxi',
    'Genasi',
    'Coboldo',
    'Goblin',
    'Orco'
  ];

  const allClassNames = Array.from(new Set([
    ...defaultClasses,
    ...customDndClasses,
    ...(character.dndClass ? [character.dndClass] : [])
  ]));

  const allRaceNames = Array.from(new Set([
    ...defaultRaces,
    ...customDndRaces,
    ...(character.dndRace ? [character.dndRace] : [])
  ]));

  const classOptions = allClassNames.map(c => ({ value: c, label: c }));
  const raceOptions = allRaceNames.map(r => ({ value: r, label: r }));

  const alignmentOptions = [
    { value: 'Legale Buono', label: 'Legale Buono (LB)' },
    { value: 'Neutrale Buono', label: 'Neutrale Buono (NB)' },
    { value: 'Caotico Buono', label: 'Caotico Buono (CB)' },
    { value: 'Legale Neutrale', label: 'Legale Neutrale (LN)' },
    { value: 'Neutrale', label: 'Neutrale Puro (N)' },
    { value: 'Caotico Neutrale', label: 'Caotico Neutrale (CN)' },
    { value: 'Legale Malvagio', label: 'Legale Malvagio (LM)' },
    { value: 'Neutrale Malvagio', label: 'Neutrale Malvagio (NM)' },
    { value: 'Caotico Malvagio', label: 'Caotico Malvagio (CM)' },
    { value: 'Senza allineamento', label: 'Senza allineamento' }
  ];

  const roleOptions: { value: CharacterRole; label: string }[] = isTtrpg ? [
    { value: 'protagonist', label: 'PG (Personaggio giocante / Eroe)' },
    { value: 'antagonist', label: 'Boss / Nemico principale' },
    { value: 'deuteragonist', label: 'PNG Chiave / Co-protagonista' },
    { value: 'rival', label: 'Rivale / Competitore del party' },
    { value: 'mentor', label: 'PNG Guida / Mentore' },
    { value: 'sidekick', label: 'Alleato / Compagno fidato' },
    { value: 'love_interest', label: 'Interesse sentimentale / Legame' },
    { value: 'traitor', label: 'Infiltrato / Spia / Falso alleato' },
    { value: 'herald', label: 'Araldo / Mandante di quest' },
    { value: 'guardian', label: 'Guardiano / Ostacolo' },
    { value: 'supporting', label: 'PNG secondario / Comparsa' }
  ] : [
    { value: 'protagonist', label: 'Protagonista' },
    { value: 'antagonist', label: 'Antagonista' },
    { value: 'deuteragonist', label: 'Deuteragonista / Co-protagonista' },
    { value: 'rival', label: 'Rivale' },
    { value: 'mentor', label: 'Mentore / Guida' },
    { value: 'sidekick', label: 'Spalla / Alleato fidato' },
    { value: 'love_interest', label: 'Interesse amoroso' },
    { value: 'traitor', label: 'Traditore / Falso alleato' },
    { value: 'herald', label: 'Araldo / Messaggero' },
    { value: 'guardian', label: 'Guardiano / Ostacolo' },
    { value: 'supporting', label: 'Personaggio secondario / Comparsa' }
  ];

  const getRoleLabel = (role: CharacterRole) => {
    const found = roleOptions.find(r => r.value === role);
    return found ? found.label : role;
  };

  const handleConfirmAddOption = () => {
    const val = newOptionValue.trim();
    if (!val) return;
    if (addOptionType === 'class') {
      if (onAddCustomDndClass) onAddCustomDndClass(val);
      handleChange('dndClass', val);
    } else if (addOptionType === 'race') {
      if (onAddCustomDndRace) onAddCustomDndRace(val);
      handleChange('dndRace', val);
    }
    setAddOptionType(null);
    setNewOptionValue('');
  };

  return (
    <div className="flex-1 h-full bg-paper-150 overflow-y-auto p-6 md:p-10 select-none">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Profile Card */}
        <div className="bg-paper-50 rounded-2xl border border-paper-250 p-6 md:p-8 shadow-page">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-paper-200">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-16 md:w-20 shrink-0 flex flex-col items-center gap-1.5">
                <div 
                  onClick={() => {
                    if (character.imageUrl) {
                      setIsLightboxOpen(true);
                    } else {
                      setIsImageModalOpen(true);
                    }
                  }}
                  title={character.imageUrl ? "Clicca per ingrandire il ritratto" : "Clicca per aggiungere il ritratto del personaggio"}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-amber-100/70 border-2 border-amber-200/80 hover:border-folia-600 flex items-center justify-center text-amber-800 text-2xl font-bold font-brand shadow-xs relative group cursor-pointer transition-all overflow-hidden"
                >
                  {character.imageUrl ? (
                    <img
                      src={character.imageUrl}
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{character.name.charAt(0) || 'P'}</span>
                  )}
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-150">
                    {character.imageUrl ? (
                      <>
                        <Maximize2 className="w-5 h-5 mb-0.5" />
                        <span className="text-[10px] font-sans font-bold">Ingrandisci</span>
                      </>
                    ) : (
                      <>
                        <Camera className="w-5 h-5 mb-0.5" />
                        <span className="text-[10px] font-sans font-bold">Aggiungi</span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(true)}
                  className="text-xs font-medium text-paper-500 hover:text-folia-800 hover:underline cursor-pointer transition-colors pt-0.5"
                  title={character.imageUrl ? "Modifica o rimuovi ritratto" : "Carica ritratto"}
                >
                  {character.imageUrl ? 'Modifica' : '+ Foto'}
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={character.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder={isTtrpg ? 'Nome del PG o NPC' : t('characters.name')}
                  className="text-2xl md:text-3xl font-brand font-bold text-paper-900 bg-transparent border-none focus:outline-hidden focus:ring-1 focus:ring-folia-600 rounded-lg px-1 w-full placeholder-paper-300"
                />
                <input
                  type="text"
                  value={character.alias}
                  onChange={(e) => handleChange('alias', e.target.value)}
                  placeholder={isTtrpg ? 'Titolo / soprannome / grado...' : 'Soprannome / alias / titolo...'}
                  className="text-sm text-paper-600 font-sans bg-transparent border-none focus:outline-hidden px-1 block w-full mt-1 placeholder-paper-400"
                />

                {isTtrpg && (character.dndClass || character.dndRace || character.dndAlignment) && (
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {character.dndClass && (
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 font-semibold shadow-2xs">
                        {character.dndClass}
                      </span>
                    )}
                    {character.dndRace && (
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 font-semibold shadow-2xs">
                        {character.dndRace}
                      </span>
                    )}
                    {character.dndAlignment && (
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200 font-semibold shadow-2xs">
                        {character.dndAlignment}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isTtrpg && (
                <button
                  type="button"
                  onClick={() => setShowPartyOverview(true)}
                  title="Apri Schermo del Master (Riepilogo del Party)"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100/80 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                >
                  <Users className="w-3.5 h-3.5 text-amber-700" />
                  <span className="hidden sm:inline">Schermo Master</span>
                </button>
              )}
              <button
                onClick={() => setShowDeleteConfirm(true)}
                title={isTtrpg ? 'Elimina PG o NPC' : 'Elimina personaggio'}
                className="p-2 rounded-xl text-paper-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Core Archetype & Demographics Grid */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${isTtrpg ? 'lg:grid-cols-4' : 'md:grid-cols-4'} gap-4 pt-6`}>
            {/* 1. Ruolo */}
            <div className="space-y-1.5">
              <div className="h-6 flex items-center justify-between">
                <label className="text-[11px] font-bold text-paper-600 uppercase tracking-wider truncate block">
                  {isTtrpg ? 'Ruolo party / trama' : 'Ruolo nella storia'}
                </label>
              </div>
              <CustomSelect
                value={character.role || 'protagonist'}
                onChange={(val) => handleChange('role', val)}
                options={roleOptions}
                className="w-full"
                buttonClassName="w-full py-2"
              />
            </div>

            {/* D&D Specific Fields - Row 1 */}
            {isTtrpg && (
              <>
                {/* 2. Classe D&D */}
                <div className="space-y-1.5">
                  <div className="h-6 flex items-center justify-between">
                    <label className="text-[11px] font-bold text-paper-600 uppercase tracking-wider truncate block">
                      Classe D&D
                    </label>
                    <button
                      type="button"
                      onClick={() => setAddOptionType('class')}
                      title="Aggiungi classe personalizzata..."
                      className="p-0.5 px-1.5 rounded-md text-folia-800 hover:bg-folia-100 hover:text-folia-950 transition-colors cursor-pointer flex items-center gap-0.5 text-[10px] font-bold"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Nuova</span>
                    </button>
                  </div>
                  <CustomSelect
                    value={character.dndClass || ''}
                    onChange={(val) => handleChange('dndClass', val)}
                    options={classOptions}
                    placeholder="Seleziona classe..."
                    className="w-full"
                    buttonClassName="w-full py-2"
                  />
                </div>

                {/* 3. Razza D&D */}
                <div className="space-y-1.5">
                  <div className="h-6 flex items-center justify-between">
                    <label className="text-[11px] font-bold text-paper-600 uppercase tracking-wider truncate block">
                      Razza D&D
                    </label>
                    <button
                      type="button"
                      onClick={() => setAddOptionType('race')}
                      title="Aggiungi razza personalizzata..."
                      className="p-0.5 px-1.5 rounded-md text-folia-800 hover:bg-folia-100 hover:text-folia-950 transition-colors cursor-pointer flex items-center gap-0.5 text-[10px] font-bold"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Nuova</span>
                    </button>
                  </div>
                  <CustomSelect
                    value={character.dndRace || ''}
                    onChange={(val) => handleChange('dndRace', val)}
                    options={raceOptions}
                    placeholder="Seleziona razza..."
                    className="w-full"
                    buttonClassName="w-full py-2"
                  />
                </div>

                {/* 4. Allineamento D&D */}
                <div className="space-y-1.5">
                  <div className="h-6 flex items-center justify-between">
                    <label className="text-[11px] font-bold text-paper-600 uppercase tracking-wider truncate block">
                      Allineamento D&D
                    </label>
                  </div>
                  <CustomSelect
                    value={character.dndAlignment || ''}
                    onChange={(val) => handleChange('dndAlignment', val)}
                    options={alignmentOptions}
                    placeholder="Seleziona allineamento..."
                    className="w-full"
                    buttonClassName="w-full py-2"
                  />
                </div>
              </>
            )}

            {/* Row 2: Livello / Archetipo */}
            <div className="space-y-1.5">
              <div className="h-6 flex items-center justify-between">
                <label className="text-[11px] font-bold text-paper-600 uppercase tracking-wider truncate block">
                  {isTtrpg ? 'Livello / GS' : 'Archetipo'}
                </label>
              </div>
              <input
                type="text"
                value={isTtrpg ? (character.archetype || '') : (character.archetype || '')}
                onChange={(e) => handleChange('archetype', e.target.value)}
                placeholder={isTtrpg ? 'es. Livello 3, GS 5...' : 'es. Eroe riluttante, Trickster...'}
                className="w-full px-3 py-2 bg-white border border-paper-250 rounded-xl text-xs text-paper-900 focus:outline-hidden focus:border-folia-600 shadow-2xs font-sans"
              />
            </div>

            {/* Età */}
            <div className="space-y-1.5">
              <div className="h-6 flex items-center justify-between">
                <label className="text-[11px] font-bold text-paper-600 uppercase tracking-wider truncate block">
                  Età
                </label>
              </div>
              <input
                type="text"
                value={character.age || ''}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder={isTtrpg ? 'es. 120 anni (elfo)' : 'es. 28 anni'}
                className="w-full px-3 py-2 bg-white border border-paper-250 rounded-xl text-xs text-paper-900 focus:outline-hidden focus:border-folia-600 shadow-2xs font-sans"
              />
            </div>

            {/* Occupazione / Background */}
            <div className="space-y-1.5">
              <div className="h-6 flex items-center justify-between">
                <label className="text-[11px] font-bold text-paper-600 uppercase tracking-wider truncate block">
                  {isTtrpg ? 'Background / fazione' : 'Occupazione / professione'}
                </label>
              </div>
              <input
                type="text"
                value={character.occupation || ''}
                onChange={(e) => handleChange('occupation', e.target.value)}
                placeholder={isTtrpg ? 'es. Nobile, Arpista, Eremita...' : 'es. Cartografa, Cavaliere...'}
                className="w-full px-3 py-2 bg-white border border-paper-250 rounded-xl text-xs text-paper-900 focus:outline-hidden focus:border-folia-600 shadow-2xs font-sans"
              />
            </div>

            {/* Sottoclasse D&D (solo in modalità D&D per completare la seconda riga in modo bilanciato) */}
            {isTtrpg && (
              <div className="space-y-1.5">
                <div className="h-6 flex items-center justify-between">
                  <label className="text-[11px] font-bold text-paper-600 uppercase tracking-wider truncate block">
                    Sottoclasse / specializzazione
                  </label>
                </div>
                <input
                  type="text"
                  value={character.psychology || ''}
                  onChange={(e) => handleChange('psychology', e.target.value)}
                  placeholder="es. Guerriero Campione, Circolo Luna..."
                  className="w-full px-3 py-2 bg-white border border-paper-250 rounded-xl text-xs text-paper-900 focus:outline-hidden focus:border-folia-600 shadow-2xs font-sans"
                />
              </div>
            )}
          </div>
        </div>

        {/* D&D 5e Navigation Tabs */}
        {isTtrpg && (
          <div className="flex items-center gap-1.5 p-1.5 bg-paper-100/90 rounded-2xl border border-paper-250 shadow-2xs overflow-x-auto">
            <button
              type="button"
              onClick={() => setDndTab('narrative')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                dndTab === 'narrative'
                  ? 'bg-white text-paper-950 shadow-xs border border-paper-200'
                  : 'text-paper-600 hover:text-paper-900 hover:bg-paper-200/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              <span>Narrazione & Biografia</span>
            </button>

            <button
              type="button"
              onClick={() => setDndTab('stats')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                dndTab === 'stats'
                  ? 'bg-white text-paper-950 shadow-xs border border-paper-200'
                  : 'text-paper-600 hover:text-paper-900 hover:bg-paper-200/60'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-red-600" />
              <span>Statistiche & Combattimento</span>
            </button>

            <button
              type="button"
              onClick={() => setDndTab('equipment')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                dndTab === 'equipment'
                  ? 'bg-white text-paper-950 shadow-xs border border-paper-200'
                  : 'text-paper-600 hover:text-paper-900 hover:bg-paper-200/60'
              }`}
            >
              <Swords className="w-3.5 h-3.5 text-amber-700" />
              <span>Attacchi & Equipaggiamento</span>
            </button>

            <button
              type="button"
              onClick={() => setDndTab('spells')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                dndTab === 'spells'
                  ? 'bg-white text-paper-950 shadow-xs border border-paper-200'
                  : 'text-paper-600 hover:text-paper-900 hover:bg-paper-200/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-600" />
              <span>Incantesimi</span>
            </button>

            <button
              type="button"
              onClick={() => setDndTab('monster')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                dndTab === 'monster'
                  ? 'bg-red-900 text-white shadow-xs'
                  : 'text-paper-600 hover:text-paper-900 hover:bg-paper-200/60'
              }`}
            >
              <Skull className="w-3.5 h-3.5 text-red-500" />
              <span>Statblock Mostro / Boss</span>
            </button>
          </div>
        )}

        {(!isTtrpg || dndTab === 'narrative') && (
          <>

        {/* Story Engine: Goal & Need (The Core Conflict) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Want / External Goal */}
          <div className="bg-paper-50 rounded-2xl border border-paper-250 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs text-folia-800 uppercase tracking-wider">
                <Target className="w-4 h-4 text-folia-700" />
                <span>{isTtrpg ? 'Obiettivo quest (Cosa vuole ottenere?)' : 'Obiettivo principale (cosa vuole?)'}</span>
              </div>
              <button
                type="button"
                onClick={() => setExpandedBox({
                  field: 'goal',
                  title: isTtrpg ? 'Obiettivo quest' : 'Obiettivo principale',
                  icon: <Target className="w-5 h-5 text-folia-700" />,
                  placeholder: isTtrpg ? 'La motivazione visibile nella campagna o la quest che sta perseguendo.' : 'Cosa vuole ottenere a livello esterno e visibile nella storia?'
                })}
                title="Ingrandisci e metti in primo piano"
                className="p-1 rounded-lg text-paper-400 hover:text-folia-800 hover:bg-paper-200/80 transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <textarea
              value={character.goal || ''}
              onChange={(e) => handleChange('goal', e.target.value)}
              placeholder={isTtrpg ? 'La motivazione visibile nella campagna o la quest che sta perseguendo.' : 'Cosa vuole ottenere a livello esterno e visibile nella storia?'}
              rows={3}
              className="w-full p-3.5 bg-paper-100/60 rounded-xl border border-paper-200 focus:outline-hidden focus:bg-white focus:border-folia-600 text-sm text-paper-800 resize-none font-sans leading-relaxed"
            />
          </div>

          {/* Need / Internal Arc */}
          <div className="bg-paper-50 rounded-2xl border border-paper-250 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs text-purple-800 uppercase tracking-wider">
                <Heart className="w-4 h-4 text-purple-700" />
                <span>{isTtrpg ? 'Legame / motivazione profonda' : 'Bisogno interiore (cosa gli serve davvero?)'}</span>
              </div>
              <button
                type="button"
                onClick={() => setExpandedBox({
                  field: 'need',
                  title: isTtrpg ? 'Legame & motivazione profonda' : 'Bisogno interiore',
                  icon: <Heart className="w-5 h-5 text-purple-700" />,
                  placeholder: isTtrpg ? 'Ciò che tiene legato il personaggio ai compagni o la sua ferita passata.' : 'Di cosa ha realmente bisogno sul piano emotivo o spirituale per maturare?'
                })}
                title="Ingrandisci e metti in primo piano"
                className="p-1 rounded-lg text-paper-400 hover:text-purple-800 hover:bg-paper-200/80 transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <textarea
              value={character.need || ''}
              onChange={(e) => handleChange('need', e.target.value)}
              placeholder={isTtrpg ? 'Ciò che tiene legato il personaggio ai compagni o la sua ferita passata.' : 'Di cosa ha realmente bisogno sul piano emotivo o spirituale per maturare?'}
              rows={3}
              className="w-full p-3.5 bg-paper-100/60 rounded-xl border border-paper-200 focus:outline-hidden focus:bg-white focus:border-folia-600 text-sm text-paper-800 resize-none font-sans leading-relaxed"
            />
          </div>
        </div>

        {/* Flaw & Strength */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fatal Flaw / Lie */}
          <div className="bg-paper-50 rounded-2xl border border-paper-250 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs text-rose-800 uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>{isTtrpg ? 'Difetto / Vulnerabilità' : 'Difetto fatale / vulnerabilità'}</span>
              </div>
              <button
                type="button"
                onClick={() => setExpandedBox({
                  field: 'flaw',
                  title: isTtrpg ? 'Difetto & vulnerabilità' : 'Difetto fatale',
                  icon: <ShieldAlert className="w-5 h-5 text-rose-600" />,
                  placeholder: isTtrpg ? 'Debolezza tattica, ossessione o difetto di personalità.' : 'Qual è il suo punto debole fatale, paura radicata o errore cognitivo?'
                })}
                title="Ingrandisci e metti in primo piano"
                className="p-1 rounded-lg text-paper-400 hover:text-rose-800 hover:bg-paper-200/80 transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <textarea
              value={character.flaw || ''}
              onChange={(e) => handleChange('flaw', e.target.value)}
              placeholder={isTtrpg ? 'Debolezza tattica, ossessione o difetto di personalità.' : 'Qual è il suo punto debole fatale, paura radicata o errore cognitivo?'}
              rows={3}
              className="w-full p-3.5 bg-paper-100/60 rounded-xl border border-paper-200 focus:outline-hidden focus:bg-white focus:border-folia-600 text-sm text-paper-800 resize-none font-sans leading-relaxed"
            />
          </div>

          {/* Core Strength */}
          <div className="bg-paper-50 rounded-2xl border border-paper-250 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs text-emerald-800 uppercase tracking-wider">
                <Flame className="w-4 h-4 text-emerald-600" />
                <span>{isTtrpg ? 'Punto di forza / Abilità chiave' : 'Punto di forza principale'}</span>
              </div>
              <button
                type="button"
                onClick={() => setExpandedBox({
                  field: 'strength',
                  title: isTtrpg ? 'Punto di forza & abilità chiave' : 'Punto di forza principale',
                  icon: <Flame className="w-5 h-5 text-emerald-600" />,
                  placeholder: isTtrpg ? 'La caratteristica vincente, incantesimo distintivo o abilità marziale.' : 'Qual è la sua migliore virtù, talento naturale o abilità?'
                })}
                title="Ingrandisci e metti in primo piano"
                className="p-1 rounded-lg text-paper-400 hover:text-emerald-800 hover:bg-paper-200/80 transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <textarea
              value={character.strength || ''}
              onChange={(e) => handleChange('strength', e.target.value)}
              placeholder={isTtrpg ? 'La caratteristica vincente, incantesimo distintivo o abilità marziale.' : 'Qual è la sua migliore virtù, talento naturale o abilità?'}
              rows={3}
              className="w-full p-3.5 bg-paper-100/60 rounded-xl border border-paper-200 focus:outline-hidden focus:bg-white focus:border-folia-600 text-sm text-paper-800 resize-none font-sans leading-relaxed"
            />
          </div>
        </div>

        {/* Physical Description & Psychology */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-paper-50 rounded-2xl border border-paper-250 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs text-paper-700 uppercase tracking-wider">
                <Eye className="w-4 h-4 text-paper-600" />
                <span>Aspetto fisico & segni particolari</span>
              </div>
              <button
                type="button"
                onClick={() => setExpandedBox({
                  field: 'physicalDesc',
                  title: 'Aspetto fisico & segni particolari',
                  icon: <Eye className="w-5 h-5 text-paper-600" />,
                  placeholder: isTtrpg ? 'Equipaggiamento visibile, cicatrici, armatura o portamento...' : 'Altezza, corporatura, sguardo, abbigliamento tipico, cicatrici...'
                })}
                title="Ingrandisci e metti in primo piano"
                className="p-1 rounded-lg text-paper-400 hover:text-paper-900 hover:bg-paper-200/80 transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <textarea
              value={character.physicalDesc || ''}
              onChange={(e) => handleChange('physicalDesc', e.target.value)}
              placeholder={isTtrpg ? 'Equipaggiamento visibile, cicatrici, armatura o portamento...' : 'Altezza, corporatura, sguardo, abbigliamento tipico, cicatrici...'}
              rows={4}
              className="w-full p-3.5 bg-paper-100/60 rounded-xl border border-paper-200 focus:outline-hidden focus:bg-white focus:border-folia-600 text-sm text-paper-800 resize-none font-sans leading-relaxed"
            />
          </div>

          <div className="bg-paper-50 rounded-2xl border border-paper-250 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs text-paper-700 uppercase tracking-wider">
                <Brain className="w-4 h-4 text-paper-600" />
                <span>Psicologia & modo di parlare</span>
              </div>
              <button
                type="button"
                onClick={() => setExpandedBox({
                  field: 'psychology',
                  title: 'Psicologia & modo di parlare',
                  icon: <Brain className="w-5 h-5 text-paper-600" />,
                  placeholder: isTtrpg ? 'Voce, tic verbali, ideali e allineamento morale...' : 'Temperamento, tono di voce, intercalari, reazione allo stress...'
                })}
                title="Ingrandisci e metti in primo piano"
                className="p-1 rounded-lg text-paper-400 hover:text-paper-900 hover:bg-paper-200/80 transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <textarea
              value={character.psychology || ''}
              onChange={(e) => handleChange('psychology', e.target.value)}
              placeholder={isTtrpg ? 'Voce, tic verbali, ideali e allineamento morale...' : 'Temperamento, tono di voce, intercalari, reazione allo stress...'}
              rows={4}
              className="w-full p-3.5 bg-paper-100/60 rounded-xl border border-paper-200 focus:outline-hidden focus:bg-white focus:border-folia-600 text-sm text-paper-800 resize-none font-sans leading-relaxed"
            />
          </div>
        </div>

        {/* Backstory & Arc */}
        <div className="bg-paper-50 rounded-2xl border border-paper-250 p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xs text-paper-700 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-paper-600" />
              <span>{isTtrpg ? 'Background & segreti del passato' : 'Passato & evoluzione (backstory)'}</span>
            </div>
            <button
              type="button"
              onClick={() => setExpandedBox({
                field: 'backstory',
                title: isTtrpg ? 'Background & segreti del passato' : 'Passato & evoluzione (backstory)',
                icon: <Layers className="w-5 h-5 text-paper-600" />,
                placeholder: isTtrpg ? 'Origini del PG, mentori del passato, crimini o debiti contratti...' : 'Da dove viene? Quale evento ha segnato la sua vita prima dell\'inizio della storia?'
              })}
              title="Ingrandisci e metti in primo piano"
              className="p-1 rounded-lg text-paper-400 hover:text-paper-900 hover:bg-paper-200/80 transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <textarea
            value={character.backstory || ''}
            onChange={(e) => handleChange('backstory', e.target.value)}
            placeholder={isTtrpg ? 'Origini del PG, mentori del passato, crimini o debiti contratti...' : 'Da dove viene? Quale evento ha segnato la sua vita prima dell\'inizio della storia?'}
            rows={4}
            className="w-full p-3.5 bg-paper-100/60 rounded-xl border border-paper-200 focus:outline-hidden focus:bg-white focus:border-folia-600 text-sm text-paper-800 resize-none font-sans leading-relaxed"
          />
        </div>

        {/* Dynamic Trait Sliders / Stats */}
        <div className="bg-paper-50 rounded-2xl border border-paper-250 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xs text-paper-700 uppercase tracking-wider">
              <SlidersHorizontal className="w-4 h-4 text-amber-600" />
              <span>{isTtrpg ? 'Statistiche & tratti del personaggio' : 'Tratti distintivi & parametri'}</span>
            </div>
            <button
              onClick={handleAddTrait}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-folia-800 bg-folia-50 hover:bg-folia-100 rounded-lg transition-colors border border-folia-200 shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Aggiungi parametro</span>
            </button>
          </div>

          {(character.traits || []).length === 0 ? (
            <p className="text-xs text-paper-400 italic py-2">
              {isTtrpg 
                ? 'Nessun parametro aggiunto. Aggiungi statistiche (es. Forza, Saggezza, CA) o talenti.'
                : 'Nessun parametro aggiunto. Aggiungi parametri personalizzati (es. Coraggio, Astuzia, Empatia).'}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(character.traits || []).map((trait) => (
                <div key={trait.id} className="flex items-center gap-2 bg-paper-100/80 p-2.5 rounded-xl border border-paper-200">
                  <input
                    type="text"
                    value={trait.label}
                    onChange={(e) => handleUpdateTrait(trait.id, e.target.value, trait.value)}
                    placeholder="Nome tratto..."
                    className="text-xs font-medium text-paper-800 bg-transparent border-none focus:outline-hidden flex-1"
                  />
                  <input
                    type="text"
                    value={trait.value}
                    onChange={(e) => handleUpdateTrait(trait.id, trait.label, e.target.value)}
                    placeholder="Valore..."
                    className="w-16 text-xs text-right font-mono font-bold text-folia-800 bg-transparent border-none focus:outline-hidden"
                  />
                  <button
                    onClick={() => handleDeleteTrait(trait.id)}
                    className="p-1 text-paper-400 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Character Relationships */}
        <div className="bg-paper-50 rounded-2xl border border-paper-250 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xs text-paper-700 uppercase tracking-wider">
              <Link2 className="w-4 h-4 text-purple-600" />
              <span>{isTtrpg ? 'Legami nel party & relazioni con NPC' : 'Rete di relazioni con altri personaggi'}</span>
            </div>
            {otherCharacters.length > 0 && (
              <button
                onClick={handleOpenLinkModal}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-800 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200 shadow-2xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Collega personaggio</span>
              </button>
            )}
          </div>

          {(character.relationships || []).length === 0 ? (
            <p className="text-xs text-paper-400 italic py-2">
              {otherCharacters.length === 0 
                ? 'Crea almeno un altro personaggio per stabilire legami, rivalità o parentele.'
                : 'Nessun legame definito. Clicca su "Collega personaggio" per specificare alleanze o rivalità.'}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(character.relationships || []).map((rel) => {
                const targetChar = allCharacters.find(c => c.id === rel.targetCharacterId);
                const displayName = targetChar ? targetChar.name : rel.targetCharacterName;
                return (
                  <div key={rel.id} className="flex items-center gap-3 p-3 bg-paper-100/80 rounded-xl border border-paper-200">
                    <div className="w-9 h-9 rounded-xl bg-purple-100/80 border border-purple-200 flex items-center justify-center text-purple-800 font-brand font-bold text-xs shrink-0 overflow-hidden shadow-2xs">
                      {targetChar?.imageUrl ? (
                        <img src={targetChar.imageUrl} alt={displayName} className="w-full h-full object-cover" />
                      ) : (
                        displayName.charAt(0) || 'P'
                      )}
                    </div>

                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                      <div className="font-bold text-xs text-paper-900 truncate leading-snug">
                        {displayName}
                      </div>
                      <input
                        type="text"
                        value={rel.relationType}
                        onChange={(e) => {
                          const updated = (character.relationships || []).map(r => r.id === rel.id ? { ...r, relationType: e.target.value } : r);
                          handleChange('relationships', updated);
                        }}
                        placeholder="Tipo di legame (es. alleato, rivale)..."
                        className="text-xs font-medium text-purple-700 placeholder-paper-400 bg-transparent border-none focus:outline-hidden p-0 w-full leading-snug mt-0.5"
                      />
                    </div>

                    <button
                      onClick={() => handleDeleteRelation(rel.id)}
                      title="Elimina collegamento"
                      className="p-1.5 rounded-lg text-paper-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        </>
        )}

        {/* D&D Stats Section */}
        {isTtrpg && dndTab === 'stats' && (
          <DndStatsSection
            stats={character.dndData?.stats}
            combat={character.dndData?.combat}
            characterLevel={character.archetype}
            featuresAndTraits={character.dndData?.featuresAndTraits}
            onUpdateStats={(stats) => handleUpdateDndData({ stats })}
            onUpdateCombat={(combat) => handleUpdateDndData({ combat })}
            onUpdateFeatures={(featuresAndTraits) => handleUpdateDndData({ featuresAndTraits })}
          />
        )}

        {/* D&D Equipment & Weapons Section */}
        {isTtrpg && dndTab === 'equipment' && (
          <DndEquipmentSection
            weapons={character.dndData?.weapons}
            equipment={character.dndData?.equipment}
            currency={character.dndData?.currency}
            onUpdateWeapons={(weapons) => handleUpdateDndData({ weapons })}
            onUpdateEquipment={(equipment) => handleUpdateDndData({ equipment })}
            onUpdateCurrency={(currency) => handleUpdateDndData({ currency })}
          />
        )}

        {/* D&D Spells Section */}
        {isTtrpg && dndTab === 'spells' && (
          <DndSpellsSection
            spellcasting={character.dndData?.spellcasting}
            stats={character.dndData?.stats}
            combat={character.dndData?.combat}
            characterLevel={character.archetype}
            onUpdateSpellcasting={(spellcasting) => handleUpdateDndData({ spellcasting })}
          />
        )}

        {/* D&D Monster Statblock Section */}
        {isTtrpg && dndTab === 'monster' && (
          <DndMonsterStatblock
            characterName={character.name}
            monsterData={character.dndData?.monsterData}
            stats={character.dndData?.stats}
            combat={character.dndData?.combat}
            onUpdateMonsterData={(monsterData) => handleUpdateDndData({ monsterData })}
            onUpdateStats={(stats) => handleUpdateDndData({ stats })}
            onUpdateCombat={(combat) => handleUpdateDndData({ combat })}
          />
        )}
      </div>

      {/* Modal Collega Personaggio */}
      {isLinkModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in select-none folia-modal-overlay"
          onClick={() => setIsLinkModalOpen(false)}
        >
          <div 
            className="bg-paper-50 rounded-2xl shadow-modal border border-paper-300 w-full max-w-md overflow-hidden flex flex-col p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 border border-purple-200 flex items-center justify-center shrink-0 shadow-2xs">
                  <Link2 className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <h3 className="font-brand font-bold text-base text-paper-900 leading-snug">
                    Collega un personaggio
                  </h3>
                  <p className="text-xs text-paper-500">
                    Scegli con quale personaggio creare un legame
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsLinkModalOpen(false)}
                className="p-1.5 rounded-lg text-paper-400 hover:text-paper-700 hover:bg-paper-150 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List of Characters to choose from */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-paper-700 uppercase tracking-wider">
                Seleziona personaggio
              </label>
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {otherCharacters.map((c) => {
                  const isSelected = selectedTargetCharId === c.id;
                  const isAlreadyLinked = (character.relationships || []).some(r => r.targetCharacterId === c.id);
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedTargetCharId(c.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-purple-500 bg-purple-50/80 shadow-2xs' 
                          : 'border-paper-200 bg-white hover:bg-paper-100/70 hover:border-paper-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 font-brand font-bold text-sm shrink-0 overflow-hidden">
                          {c.imageUrl ? (
                            <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                          ) : (
                            c.name.charAt(0) || 'P'
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-paper-900 truncate flex items-center gap-1.5">
                            <span>{c.name || 'Senza nome'}</span>
                            {isAlreadyLinked && (
                              <span className="text-[10px] font-normal text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded-sm">
                                Già collegato
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-paper-500 truncate">
                            {isTtrpg && (c.dndClass || c.dndRace) 
                              ? `${c.dndRace || ''} ${c.dndClass || ''}`.trim()
                              : getRoleLabel(c.role)}
                          </div>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-purple-600 bg-purple-600' : 'border-paper-300'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Relationship Type */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-paper-700 uppercase tracking-wider">
                Tipo di legame o relazione
              </label>
              
              <div className="flex flex-wrap gap-1.5">
                {(isTtrpg ? [
                  'Compagno di party', 'Alleato', 'Rivale', 'Mentore', 'Nemesi', 'Debitore', 'Fratello'
                ] : [
                  'Alleato', 'Rivale', 'Mentore', 'Amico fidato', 'Nemesi', 'Interesse amoroso', 'Fratello'
                ]).map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setRelationTypeInput(suggestion)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      relationTypeInput === suggestion
                        ? 'bg-purple-600 text-white border-purple-600 font-medium'
                        : 'bg-paper-100 text-paper-700 border-paper-250 hover:bg-paper-200'
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={relationTypeInput}
                onChange={(e) => setRelationTypeInput(e.target.value)}
                placeholder="es. Migliore amico d'infanzia, Rivalità d'onore..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConfirmAddRelation();
                  if (e.key === 'Escape') setIsLinkModalOpen(false);
                }}
                className="w-full px-3.5 py-2 text-sm bg-white border border-paper-300 rounded-xl text-paper-900 placeholder-paper-400 focus:outline-hidden focus:border-purple-600 focus:ring-1 focus:ring-purple-600 shadow-2xs font-sans"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-paper-200">
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-paper-200 hover:bg-paper-300 text-paper-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                Annulla
              </button>
              <button
                type="button"
                disabled={!selectedTargetCharId}
                onClick={handleConfirmAddRelation}
                className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Collega personaggio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Aggiungi Classe o Razza Personalizzata */}
      {addOptionType && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in select-none folia-modal-overlay"
          onClick={() => setAddOptionType(null)}
        >
          <div 
            className="bg-paper-50 rounded-2xl shadow-modal border border-paper-300 w-full max-w-sm overflow-hidden flex flex-col p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-folia-100 text-folia-800 border border-folia-200 flex items-center justify-center shrink-0 shadow-2xs">
                  <Plus className="w-5 h-5 text-folia-800" />
                </div>
                <div>
                  <h3 className="font-brand font-bold text-base text-paper-900 leading-snug">
                    {addOptionType === 'class' ? 'Nuova classe D&D' : 'Nuova razza D&D'}
                  </h3>
                  <p className="text-xs text-paper-500">Salva nell'elenco della campagna</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setAddOptionType(null);
                  setNewOptionValue('');
                }}
                className="p-1 rounded-lg text-paper-400 hover:text-paper-700 hover:bg-paper-150 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-paper-700 uppercase tracking-wider mb-1.5">
                {addOptionType === 'class' ? 'Nome della classe' : 'Nome della razza'}
              </label>
              <input
                type="text"
                autoFocus
                value={newOptionValue}
                onChange={(e) => setNewOptionValue(e.target.value)}
                placeholder={addOptionType === 'class' ? 'es. Cavaliere Mistico, Blood Hunter...' : 'es. Cangiante, Forgiato, Yuan-ti...'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConfirmAddOption();
                  if (e.key === 'Escape') {
                    setAddOptionType(null);
                    setNewOptionValue('');
                  }
                }}
                className="w-full px-3.5 py-2 text-sm bg-white border border-paper-300 rounded-xl text-paper-900 placeholder-paper-400 focus:outline-hidden focus:border-folia-600 focus:ring-1 focus:ring-folia-600 shadow-2xs font-sans"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setAddOptionType(null);
                  setNewOptionValue('');
                }}
                className="px-3.5 py-2 rounded-xl bg-paper-200 hover:bg-paper-300 text-paper-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={handleConfirmAddOption}
                className="px-4 py-2 rounded-xl bg-folia-700 hover:bg-folia-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Aggiungi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDeleteCharacter(character.id);
          setShowDeleteConfirm(false);
        }}
        title={isTtrpg ? 'Elimina PG o NPC' : 'Elimina scheda personaggio'}
        subtitle="Questa azione non può essere annullata"
        message={
          <span>
            Sei sicuro di voler eliminare la scheda di <strong>"{character.name || (isTtrpg ? 'Nuovo PG / NPC' : 'Nuovo personaggio')}"</strong>?
          </span>
        }
        confirmLabel="Elimina definitivamente"
        cancelLabel="Annulla"
        variant="danger"
      />

      {/* Expanded Focus Text Modal */}
      {expandedBox && (
        <FocusTextModal
          isOpen={!!expandedBox}
          onClose={() => setExpandedBox(null)}
          title={expandedBox.title}
          subtitle={`Scheda di ${character.name || (isTtrpg ? 'Nuovo PG / NPC' : 'Nuovo personaggio')}`}
          icon={expandedBox.icon}
          value={(character[expandedBox.field] as string) || ''}
          onChange={(val) => handleChange(expandedBox.field, val)}
          placeholder={expandedBox.placeholder}
        />
      )}

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        title={`Ritratto di ${character.name || 'Personaggio'}`}
        currentImage={character.imageUrl}
        onSaveImage={(url) => handleChange('imageUrl', url)}
        onRemoveImage={() => handleChange('imageUrl', undefined)}
      />

      {/* Image Lightbox Modal */}
      <ImageLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        src={character.imageUrl}
        alt={character.name}
        title={character.name}
        subtitle={character.alias || (isTtrpg ? (character.dndClass || 'Personaggio D&D') : 'Ritratto Personaggio')}
        onEdit={() => setIsImageModalOpen(true)}
      />
    </div>
  );
};
