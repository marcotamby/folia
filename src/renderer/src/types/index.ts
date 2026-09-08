export type Language = 'it' | 'en';

export type ViewMode = 'editor' | 'characters' | 'world' | 'maps' | 'plot' | 'corkboard' | 'ideas' | 'notes' | 'trash' | 'sessions';

export type PageFormat = 'a4' | 'novel' | 'cartella' | 'letter' | 'continuous';
export type PageMargins = 'normal' | 'narrow' | 'wide' | 'custom';
export interface CustomPageMargins {
  top: number;
  bottom: number;
  left: number;
  right: number;
}
export type ParagraphSpacing = 'none' | 'tight' | 'normal' | 'relaxed';

export type FontFamily = 
  // Grandi classici letterari & editoriali (Serif)
  | 'Garamond'
  | 'Times New Roman'
  | 'Georgia'
  | 'Baskerville'
  | 'Palatino'
  | 'Book Antiqua'
  | 'Lora'
  | 'Merriweather'
  | 'Spectral'
  | 'Crimson Pro'
  | 'Cormorant Garamond'
  | 'Libre Caslon Text'
  | 'Cinzel'
  | 'Playfair Display'
  // Moderni, puliti & saggi (Sans-Serif)
  | 'Plus Jakarta Sans'
  | 'Inter'
  | 'Outfit'
  | 'Montserrat'
  | 'Raleway'
  | 'Arial'
  | 'Verdana'
  | 'Calibri'
  // Macchina da scrivere, bozze & sceneggiatura (Monospace)
  | 'Courier New'
  | 'Courier Prime'
  | 'JetBrains Mono'
  | 'Consolas';

export type PageNumberPosition = 'bottom-right' | 'bottom-center' | 'bottom-left' | 'top-right' | 'top-center' | 'top-left' | 'none';
export type PageNumberFormat = 'simple' | 'page_x_of_y' | 'dashes';

export type CardStatus = 'idea' | 'draft' | 'revised' | 'done';

export type CharacterRole = 
  | 'protagonist' 
  | 'antagonist' 
  | 'deuteragonist'
  | 'rival'
  | 'mentor' 
  | 'sidekick' 
  | 'love_interest' 
  | 'traitor'
  | 'herald'
  | 'guardian'
  | 'supporting';

export interface Footnote {
  id: string;
  number: number;
  content: string;
}

export interface DocumentComment {
  id: string;
  from?: number;
  to?: number;
  quotedText: string;
  text: string;
  author: string;
  createdAt: string;
  resolved: boolean;
}

export interface ManuscriptItem {
  id: string;
  title: string;
  type: 'chapter' | 'scene' | 'folder';
  content: string;
  synopsis?: string;
  status?: CardStatus;
  color?: string;
  parentId?: string | null;
  order: number;
  wordCount?: number;
  titleFontSize?: number;
  titleAlignment?: 'left' | 'center' | 'right' | 'justify';
  footnotes?: Footnote[];
  comments?: DocumentComment[];
  createdAt: string;
  updatedAt: string;
}

export interface CharacterTrait {
  id: string;
  label: string;
  value: string;
}

export interface CharacterRelation {
  id: string;
  targetCharacterId: string;
  targetCharacterName: string;
  relationType: string;
  notes?: string;
}

export type DndAbility = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export interface DndStats {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
  savingThrows?: DndAbility[];
}

export interface DndCombatStats {
  armorClass: number;
  maxHp: number;
  currentHp: number;
  tempHp?: number;
  speed: string;
  initiativeBonus?: number;
  hitDice: string;
  proficiencyBonus?: number;
  passivePerception?: number;
  passiveInvestigation?: number;
  passiveInsight?: number;
  inspiration?: boolean;
  deathSaves?: {
    successes: number;
    failures: number;
  };
  conditions?: string[];
}

export interface DndWeapon {
  id: string;
  name: string;
  attackBonus: string;
  damage: string;
  damageType: string;
  range?: string;
  notes?: string;
}

export interface DndEquipmentItem {
  id: string;
  name: string;
  quantity: number;
  weight?: string;
  attunement?: boolean;
  isAttuned?: boolean;
  rarity?: 'comune' | 'non comune' | 'raro' | 'molto raro' | 'leggendario' | 'artefatto';
  description?: string;
}

export interface DndCurrency {
  cp: number;
  sp: number;
  ep: number;
  gp: number;
  pp: number;
}

export interface DndSpellSlot {
  level: number;
  total: number;
  used: number;
}

export interface DndSpell {
  id: string;
  name: string;
  level: number;
  school?: string;
  castingTime?: string;
  range?: string;
  duration?: string;
  components?: string;
  concentration?: boolean;
  ritual?: boolean;
  prepared?: boolean;
  description?: string;
}

export interface DndSpellcasting {
  ability: 'int' | 'wis' | 'cha';
  spellSaveDc?: number;
  spellAttackBonus?: number;
  slots: DndSpellSlot[];
  spells: DndSpell[];
}

export interface DndMonsterAction {
  id: string;
  name: string;
  type: 'action' | 'bonus' | 'reaction' | 'legendary' | 'special';
  description: string;
}

export interface DndMonsterData {
  challengeRating: string;
  size: 'Minuscola' | 'Piccola' | 'Media' | 'Grande' | 'Enorme' | 'Mastodontica';
  type: string;
  alignment: string;
  damageVulnerabilities?: string;
  damageResistances?: string;
  damageImmunities?: string;
  conditionImmunities?: string;
  senses?: string;
  languages?: string;
  actions: DndMonsterAction[];
  legendaryActionsCount?: number;
  legendaryDescription?: string;
}

export interface DndCharacterData {
  isMonster?: boolean;
  stats?: DndStats;
  combat?: DndCombatStats;
  weapons?: DndWeapon[];
  equipment?: DndEquipmentItem[];
  currency?: DndCurrency;
  spellcasting?: DndSpellcasting;
  monsterData?: DndMonsterData;
  featuresAndTraits?: string;
}

export interface Character {
  id: string;
  name: string;
  alias: string;
  role: CharacterRole;
  archetype: string;
  age: string;
  occupation: string;
  dndClass?: string;
  dndRace?: string;
  dndAlignment?: string;
  goal: string;
  need: string;
  flaw: string;
  strength: string;
  physicalDesc: string;
  psychology: string;
  backstory: string;
  arc: string;
  traits: CharacterTrait[];
  relationships: CharacterRelation[];
  freeNotes: string;
  imageUrl?: string;
  dndData?: DndCharacterData;
  createdAt: string;
  updatedAt: string;
}

export type WorldCategory = 'location' | 'faction' | 'magic' | 'culture' | 'religion' | 'item' | 'history' | 'city';

export interface WorldEntry {
  id: string;
  name: string;
  category: WorldCategory;
  atmosphere: string;
  inhabitants: string;
  rules: string;
  secrets: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type MapPinIcon = 'pin' | 'castle' | 'mountain' | 'city' | 'dungeon' | 'star' | 'ship' | 'flag';

export interface MapPin {
  id: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  label: string;
  description?: string;
  worldEntryId?: string;
  color?: string;
  icon?: MapPinIcon;
}

export interface MapEntry {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  pins: MapPin[];
  createdAt: string;
  updatedAt: string;
  zoom?: number;
  pan?: { x: number; y: number };
  pinScale?: number;
}

export interface PlotBeat {
  id: string;
  actId: string;
  title: string;
  titleSuggestion?: string;
  description: string;
  guideline?: string;
  order: number;
  linkedSceneId?: string;
}

export type PlotTemplateType = 
  | 'three_act'
  | 'hero_journey'
  | 'save_the_cat'
  | 'kishotenketsu'
  | 'dan_harmon'
  | 'freytag'
  | 'fichtean'
  | 'seven_point'
  | 'snowflake'
  | 'romance_beats'
  | 'mystery_beats'
  | 'thriller_beats'
  | 'fantasy_epic'
  | 'dnd_campaign'
  | 'five_room_dungeon'
  | 'dnd_oneshot'
  | 'dnd_sandbox'
  | 'dnd_bbeg'
  | 'dnd_urban_intrigue'
  | 'custom';

export interface PlotAct {
  id: string;
  title: string;
  subtitle: string;
  beats: PlotBeat[];
}

export interface IdeaNote {
  id: string;
  text: string;
  tag: 'dialogue' | 'plot_twist' | 'scene' | 'world' | 'research';
  color: string;
  createdAt: string;
}

export interface ResearchNote {
  id: string;
  title: string;
  content: string;
  placeholder?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TrashItem {
  id: string;
  originalType: 'manuscript' | 'character' | 'world' | 'idea' | 'note' | 'map';
  data: any;
  deletedAt: string;
}

export type ProjectType = 'novel' | 'ttrpg_master' | 'academic_thesis' | 'letter';

export interface ProjectSettings {
  language: Language;
  projectType?: ProjectType; // 'novel' (default) | 'ttrpg_master' | 'academic_thesis' | 'letter'
  customDndClasses?: string[];
  customDndRaces?: string[];
  fontFamily: FontFamily;
  headingFontFamily?: FontFamily;
  fontSize: number;
  titleFontSize?: number;
  titleAlignment?: 'left' | 'center' | 'right' | 'justify';
  lineHeight: number;
  pageFormat: PageFormat;
  pageMargins: PageMargins;
  customMargins?: CustomPageMargins;
  customMarginCm?: number;
  firstLineIndent: number;
  paragraphSpacing: ParagraphSpacing;
  hyphenation: boolean;
  spellcheck?: boolean;
  showPageNumbers?: boolean;
  pageNumberPosition?: PageNumberPosition;
  pageNumberFormat?: PageNumberFormat;
  dailyWordGoal: number;
  dailyGoalDate: string; // YYYY-MM-DD
  dailyWordsStart: number; // Manuscript words at day start
  totalWordGoal: number;
  zoomLevel: number; // 75 to 200 (%)
  autosaveIntervalSeconds: number;
  customDictionary?: string[];
  termsAccepted: boolean;
  termsAcceptedAt?: string;
}

export interface SessionMarker {
  id: string;
  timestamp: number; // in seconds
  label: string;
  notes?: string;
}

export interface SessionRecording {
  id: string;
  title: string;
  date: string; // ISO string
  duration: number; // in seconds
  audioFilePath: string; // absolute or relative path to file on disk
  fileSizeBytes?: number;
  markers: SessionMarker[];
  summary: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  author: string;
  filePath?: string;
  createdAt: string;
  updatedAt: string;
  manuscript: ManuscriptItem[];
  characters: Character[];
  worldbuilding: WorldEntry[];
  maps?: MapEntry[];
  plotActs: PlotAct[];
  ideas: IdeaNote[];
  notes: ResearchNote[];
  trash: TrashItem[];
  sessions?: SessionRecording[];
  settings: ProjectSettings;
}
