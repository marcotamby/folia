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
  Sparkles,
  Shield,
  Maximize2,
  Camera
} from 'lucide-react';
import { Character, CharacterTrait, CharacterRole, CharacterRelation } from '../../types';
import { CustomSelect } from '../common/CustomSelect';
import { ConfirmModal } from '../common/ConfirmModal';
import { FocusTextModal } from '../common/FocusTextModal';
import { ImageUploadModal } from '../modals/ImageUploadModal';

interface CharacterEditorProps {
  character: Character | null;
  allCharacters: Character[];
  onUpdateCharacter: (char: Character) => void;
  onDeleteCharacter: (id: string) => void;
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

  if (!character) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-paper-150 p-8 text-center select-none">
        <div className="w-16 h-16 rounded-2xl bg-paper-200 border border-paper-300 flex items-center justify-center text-paper-400 mb-4">
          <User className="w-8 h-8 text-amber-600" />
        </div>
        <h3 className="font-brand text-xl font-semibold text-paper-800 mb-1">
          {isTtrpg ? 'Nessun PG o PNG selezionato' : 'Nessun personaggio selezionato'}
        </h3>
        <p className="text-xs text-paper-500 max-w-xs">
          {isTtrpg 
            ? 'Seleziona o crea una scheda personaggio per definire classe, razza, motivazioni e legami del party.'
            : 'Seleziona o crea una scheda personaggio per definire motivazioni, aspetto e relazioni.'}
        </p>
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

  const handleAddRelation = () => {
    const other = allCharacters.find(c => c.id !== character.id);
    if (!other) return;

    const newRel: CharacterRelation = {
      id: 'rel-' + Date.now(),
      targetCharacterId: other.id,
      targetCharacterName: other.name,
      relationType: isTtrpg ? 'Compagno di party' : 'Alleato'
    };
    handleChange('relationships', [...(character.relationships || []), newRel]);
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
    'PNG / Mostro'
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

  const roleOptions = isTtrpg ? [
    { value: 'protagonist', label: 'PG (Personaggio giocante)' },
    { value: 'antagonist', label: 'Boss / Nemico principale' },
    { value: 'mentor', label: 'PNG Guida / Mentore' },
    { value: 'sidekick', label: 'Alleato / PNG chiave' },
    { value: 'love_interest', label: 'Interesse / PNG legato' },
    { value: 'supporting', label: 'PNG secondario / comparsa' }
  ] : [
    { value: 'protagonist', label: 'Protagonista' },
    { value: 'antagonist', label: 'Antagonista' },
    { value: 'mentor', label: 'Mentore / guida' },
    { value: 'sidekick', label: 'Spalla / alleato' },
    { value: 'love_interest', label: 'Interesse amoroso' },
    { value: 'supporting', label: 'Secondario / comparsa' }
  ];

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
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div 
                  onClick={() => setIsImageModalOpen(true)}
                  title="Clicca per aggiungere o cambiare il ritratto del personaggio"
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
                    <Camera className="w-5 h-5 mb-0.5" />
                    <span className="text-[9px] font-sans font-bold">Cambia</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(true)}
                  className="text-[11px] font-sans font-medium text-folia-700 hover:text-folia-950 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Camera className="w-3 h-3" />
                  <span>{character.imageUrl ? 'Modifica' : '+ Foto'}</span>
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={character.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder={isTtrpg ? 'Nome del PG o PNG' : t('characters.name')}
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
              <button
                onClick={() => setShowDeleteConfirm(true)}
                title={isTtrpg ? 'Elimina PG o PNG' : 'Elimina personaggio'}
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
              <Sparkles className="w-4 h-4 text-amber-600" />
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
                    className="p-1 text-paper-400 hover:text-red-600 transition-colors"
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
              <span>{isTtrpg ? 'Legami nel party & relazioni con PNG' : 'Rete di relazioni con altri personaggi'}</span>
            </div>
            {allCharacters.length > 1 && (
              <button
                onClick={handleAddRelation}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-800 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200 shadow-2xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Collega personaggio</span>
              </button>
            )}
          </div>

          {(character.relationships || []).length === 0 ? (
            <p className="text-xs text-paper-400 italic py-2">
              {allCharacters.length <= 1 
                ? 'Crea almeno un altro personaggio per stabilire legami, rivalità o parentele.'
                : 'Nessun legame definito. Clicca su "Collega personaggio" per specificare alleanze o rivalità.'}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(character.relationships || []).map((rel) => (
                <div key={rel.id} className="flex items-center justify-between p-3 bg-paper-100/80 rounded-xl border border-paper-200">
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="font-semibold text-xs text-paper-900 truncate">{rel.targetCharacterName}</div>
                    <input
                      type="text"
                      value={rel.relationType}
                      onChange={(e) => {
                        const updated = (character.relationships || []).map(r => r.id === rel.id ? { ...r, relationType: e.target.value } : r);
                        handleChange('relationships', updated);
                      }}
                      placeholder="Tipo di legame (es. rivali, fratelli)..."
                      className="text-[11px] text-paper-600 bg-transparent border-none focus:outline-hidden p-0 w-full"
                    />
                  </div>
                  <button
                    onClick={() => handleDeleteRelation(rel.id)}
                    className="p-1 rounded text-paper-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Aggiungi Classe o Razza Personalizzata */}
      {addOptionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in select-none">
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
        title={isTtrpg ? 'Elimina PG o PNG' : 'Elimina scheda personaggio'}
        subtitle="Questa azione non può essere annullata"
        message={
          <span>
            Sei sicuro di voler eliminare la scheda di <strong>"{character.name || (isTtrpg ? 'Nuovo PG / PNG' : 'Nuovo personaggio')}"</strong>?
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
          subtitle={`Scheda di ${character.name || (isTtrpg ? 'Nuovo PG / PNG' : 'Nuovo personaggio')}`}
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
    </div>
  );
};
