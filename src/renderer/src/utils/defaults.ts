import { Project, ProjectType, ManuscriptItem, PlotAct, ResearchNote, IdeaNote } from '../types';

export const createDefaultProject = (
  lang: 'it' | 'en' = 'it', 
  customTitle?: string,
  projectType: ProjectType = 'novel'
): Project => {
  const isIt = lang === 'it';
  const todayStr = new Date().toISOString().split('T')[0];
  const nowISO = new Date().toISOString();

  let defaultTitle = customTitle || (isIt ? 'Nuovo progetto' : 'New project');
  let manuscript: ManuscriptItem[] = [];
  let plotActs: PlotAct[] = [];
  let notes: ResearchNote[] = [];
  let ideas: IdeaNote[] = [];
  let totalWordGoal = 50000;
  let pageFormat: 'a4' | 'novel' | 'cartella' | 'letter' | 'continuous' = 'a4';
  let fontFamily: any = 'Garamond';
  let showPageNumbers = false;

  if (projectType === 'ttrpg_master') {
    if (!customTitle) defaultTitle = isIt ? 'Nuova campagna D&D' : 'New D&D Campaign';
    totalWordGoal = 30000;
    manuscript = [
      {
        id: 'doc-sess1',
        title: isIt ? 'Sessione 1: L\'inizio dell\'avventura' : 'Session 1: Adventure Begins',
        type: 'chapter',
        synopsis: isIt ? 'Incontro iniziale del party e prima quest locale.' : 'Initial party encounter and first quest.',
        status: 'draft',
        color: '#F59E0B',
        parentId: null,
        order: 0,
        wordCount: 0,
        content: '',
        createdAt: nowISO,
        updatedAt: nowISO
      }
    ];
    plotActs = [
      {
        id: 'act-dnd-1',
        title: isIt ? 'Tier 1: Eroi Locali (Livelli 1-4)' : 'Tier 1: Local Heroes (Levels 1-4)',
        subtitle: isIt ? 'La formazione del party, prime quest locali e pericolo sotterraneo' : 'Party formation, first local quests and underground threat',
        beats: [
          {
            id: 'dnd-b1',
            actId: 'act-dnd-1',
            title: isIt ? '1. Incontro iniziale & aggancio quest' : '1. Initial encounter & quest hook',
            description: '',
            guideline: isIt ? 'Come si incontrano i PG e la prima missione locale.' : 'How the PCs meet and the first quest.',
            order: 0
          }
        ]
      }
    ];
    notes = [
      {
        id: 'note-rules-1',
        title: isIt ? 'Regole della casa (Homebrew)' : 'House Rules (Homebrew)',
        content: isIt ? 'Regole speciali della campagna, varianti di riposo, critici e gestione del party.' : 'Special campaign rules, rest variants, criticals, and party management.',
        tags: [isIt ? 'regole' : 'rules', 'homebrew'],
        createdAt: nowISO,
        updatedAt: nowISO
      }
    ];
    ideas = [
      {
        id: 'idea-loot-1',
        text: isIt ? 'Oggetto magico raro da far trovare nel primo dungeon.' : 'Rare magic item to find in the first dungeon.',
        tag: 'world',
        color: '#FEF08A',
        createdAt: nowISO
      }
    ];
  } else if (projectType === 'academic_thesis') {
    if (!customTitle) defaultTitle = isIt ? 'Tesi di laurea' : 'Academic Thesis';
    totalWordGoal = 35000;
    pageFormat = 'a4';
    fontFamily = 'Times New Roman';
    showPageNumbers = true;
    manuscript = [
      {
        id: 'doc-frontespizio',
        title: isIt ? 'Frontespizio & dedica' : 'Title Page & Dedication',
        type: 'chapter',
        synopsis: isIt ? 'Intestazione ateneo, corso di laurea, relatore, correlatore e candidato.' : 'University header, course, advisor, co-advisor and candidate.',
        status: 'draft',
        color: '#3B82F6',
        parentId: null,
        order: 0,
        wordCount: 0,
        content: '',
        createdAt: nowISO,
        updatedAt: nowISO
      },
      {
        id: 'doc-intro',
        title: isIt ? 'Introduzione generale' : 'Introduction',
        type: 'chapter',
        synopsis: isIt ? 'Contesto della ricerca, motivazioni, obiettivi e struttura dell\'elaborato.' : 'Research context, motivations, objectives and thesis structure.',
        status: 'draft',
        color: '#60A5FA',
        parentId: null,
        order: 1,
        wordCount: 0,
        content: '',
        createdAt: nowISO,
        updatedAt: nowISO
      },
      {
        id: 'doc-cap1',
        title: isIt ? 'Capitolo 1: Quadro teorico & stato dell\'arte' : 'Chapter 1: Theoretical Framework',
        type: 'chapter',
        synopsis: isIt ? 'Revisione della letteratura scientifica e modelli teorici di riferimento.' : 'Literature review and theoretical models.',
        status: 'draft',
        color: '#10B981',
        parentId: null,
        order: 2,
        wordCount: 0,
        content: '',
        createdAt: nowISO,
        updatedAt: nowISO
      },
      {
        id: 'doc-cap2',
        title: isIt ? 'Capitolo 2: Metodologia della ricerca' : 'Chapter 2: Research Methodology',
        type: 'chapter',
        synopsis: isIt ? 'Descrizione del metodo di indagine, raccolta dati, campioni o corpus testuale.' : 'Methodology description, data collection, sample or textual corpus.',
        status: 'draft',
        color: '#10B981',
        parentId: null,
        order: 3,
        wordCount: 0,
        content: '',
        createdAt: nowISO,
        updatedAt: nowISO
      },
      {
        id: 'doc-cap3',
        title: isIt ? 'Capitolo 3: Analisi dei dati & discussione dei risultati' : 'Chapter 3: Data Analysis & Discussion',
        type: 'chapter',
        synopsis: isIt ? 'Presentazione dei risultati emersi, grafici, analisi critica e confronto.' : 'Results presentation, charts, critical analysis and comparison.',
        status: 'draft',
        color: '#10B981',
        parentId: null,
        order: 4,
        wordCount: 0,
        content: '',
        createdAt: nowISO,
        updatedAt: nowISO
      },
      {
        id: 'doc-conclusioni',
        title: isIt ? 'Conclusioni & sviluppi futuri' : 'Conclusions & Future Work',
        type: 'chapter',
        synopsis: isIt ? 'Sintesi dei contributi, limiti dell\'indagine e prospettive aperte.' : 'Contribution summary, limitations, and future outlook.',
        status: 'draft',
        color: '#8B5CF6',
        parentId: null,
        order: 5,
        wordCount: 0,
        content: '',
        createdAt: nowISO,
        updatedAt: nowISO
      },
      {
        id: 'doc-bibliografia',
        title: isIt ? 'Bibliografia & sitografia' : 'Bibliography & References',
        type: 'chapter',
        synopsis: isIt ? 'Riferimenti bibliografici completi in formato standard (APA, Chicago, MLA).' : 'Complete references in standard format (APA, Chicago, MLA).',
        status: 'draft',
        color: '#6B7280',
        parentId: null,
        order: 6,
        wordCount: 0,
        content: '',
        createdAt: nowISO,
        updatedAt: nowISO
      }
    ];
    notes = [
      {
        id: 'note-biblio-1',
        title: isIt ? 'Fonti primarie & articoli scientifici' : 'Primary Sources & Academic Papers',
        content: isIt ? 'Annotazioni e citazioni chiave estratte dai testi di riferimento per la tesi.' : 'Key notes and citations extracted from reference papers.',
        tags: [isIt ? 'bibliografia' : 'bibliography', isIt ? 'citazioni' : 'citations'],
        createdAt: nowISO,
        updatedAt: nowISO
      }
    ];
    ideas = [
      {
        id: 'idea-thesis-1',
        text: isIt ? 'Domanda di ricerca da discutere al prossimo incontro col relatore.' : 'Research question to discuss at next meeting with thesis advisor.',
        tag: 'research',
        color: '#BAE6FD',
        createdAt: nowISO
      }
    ];
  } else if (projectType === 'letter') {
    if (!customTitle) defaultTitle = isIt ? 'Lettera formale' : 'Formal Letter';
    totalWordGoal = 1000;
    pageFormat = 'a4';
    fontFamily = 'Garamond';
    showPageNumbers = false;
    manuscript = [
      {
        id: 'doc-letter-1',
        title: isIt ? 'Lettera - Prima stesura' : 'Letter - First Draft',
        type: 'chapter',
        synopsis: isIt ? 'Testo principale della lettera con formule di apertura e chiusura.' : 'Main letter text with opening and closing salutations.',
        status: 'draft',
        color: '#8B5CF6',
        parentId: null,
        order: 0,
        wordCount: 0,
        content: '',
        createdAt: nowISO,
        updatedAt: nowISO
      }
    ];
    notes = [
      {
        id: 'note-destinatario',
        title: isIt ? 'Dati destinatario & recapiti' : 'Recipient Details',
        content: isIt ? 'Destinatario: \nEnte / Società: \nIndirizzo: \nOggetto formale: \nData di invio: ' : 'Recipient: \nOrganization: \nAddress: \nSubject: \nDate: ',
        tags: [isIt ? 'destinatario' : 'recipient', isIt ? 'recapiti' : 'contacts'],
        createdAt: nowISO,
        updatedAt: nowISO
      }
    ];
    ideas = [
      {
        id: 'idea-letter-1',
        text: isIt ? 'Allegati da includere nella busta o via email.' : 'Attachments to include in the envelope or via email.',
        tag: 'research',
        color: '#E9D5FF',
        createdAt: nowISO
      }
    ];
  } else {
    // novel
    manuscript = [
      {
        id: 'doc-ch1',
        title: isIt ? 'Capitolo 1' : 'Chapter 1',
        type: 'chapter',
        synopsis: '',
        status: 'draft',
        color: '#4ADE80',
        parentId: null,
        order: 0,
        wordCount: 0,
        content: '',
        createdAt: nowISO,
        updatedAt: nowISO
      }
    ];
    plotActs = [
      {
        id: 'act-1',
        title: isIt ? 'Atto 1: Introduzione & incidente scatenante' : 'Act 1: Hook & inciting incident',
        subtitle: isIt ? 'L\'inizio del viaggio e la chiamata all\'avventura' : 'The departure and the call to adventure',
        beats: []
      },
      {
        id: 'act-2',
        title: isIt ? 'Atto 2: Prove, conflitti & crisi centrale' : 'Act 2: Trials & midpoint crisis',
        subtitle: isIt ? 'Conflitti crescenti, rivelazioni e il momento più buio' : 'Escalating stakes and revelations',
        beats: []
      },
      {
        id: 'act-3',
        title: isIt ? 'Atto 3: Climax & risoluzione' : 'Act 3: Climax & resolution',
        subtitle: isIt ? 'Il confronto finale e il nuovo equilibrio' : 'Final confrontation and new equilibrium',
        beats: []
      }
    ];
  }

  return {
    id: 'folia-proj-' + Date.now(),
    title: defaultTitle,
    author: '',
    createdAt: nowISO,
    updatedAt: nowISO,
    settings: {
      language: lang,
      projectType,
      fontFamily,
      fontSize: 12,
      lineHeight: 1.7,
      pageFormat,
      pageMargins: 'normal',
      firstLineIndent: 1.0,
      paragraphSpacing: 'normal',
      hyphenation: false,
      spellcheck: true,
      showPageNumbers,
      dailyWordGoal: 1000,
      dailyGoalDate: todayStr,
      dailyWordsStart: 0,
      totalWordGoal,
      zoomLevel: 100,
      autosaveIntervalSeconds: 120, // 2 minutes
      termsAccepted: false
    },
    manuscript,
    characters: [],
    worldbuilding: [],
    maps: [],
    plotActs,
    ideas,
    notes,
    trash: []
  };
};
