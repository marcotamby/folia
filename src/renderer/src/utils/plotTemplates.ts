import { PlotAct, PlotTemplateType } from '../types';

export interface PlotTemplateInfo {
  id: PlotTemplateType;
  name: string;
  description: string;
  createActs: () => PlotAct[];
}

export const PLOT_TEMPLATES: PlotTemplateInfo[] = [
  {
    id: 'three_act',
    name: 'Struttura Classica in 3 Atti',
    description: "La struttura narrativa classica dell'occidente: Impostazione, Sviluppo & Crisi, Risoluzione.",
    createActs: () => [
      {
        id: 'act-1',
        title: 'Atto 1: Impostazione & Chiamata',
        subtitle: "Presentazione del mondo ordinario, del protagonista e dell'incidente scatenante",
        beats: [
          { id: 'beat-1', actId: 'act-1', title: 'Stato Iniziale & Mondo Ordinario', description: '', guideline: 'La vita del protagonista prima che tutto cambi.', order: 0 },
          { id: 'beat-2', actId: 'act-1', title: 'Incidente Scatenante', description: '', guideline: "L'evento che rompe l'equilibrio e forza l'azione.", order: 1 },
          { id: 'beat-3', actId: 'act-1', title: 'Primo Punto di Svolta (Varco della Soglia)', description: '', guideline: 'Il protagonista compie una scelta irrevocabile ed entra nel vivo della storia.', order: 2 }
        ]
      },
      {
        id: 'act-2',
        title: 'Atto 2: Prove, Conflitti & Crisi Centrale',
        subtitle: 'Ostacoli crescenti, posta in gioco che si alza e il punto di svolta a metà storia',
        beats: [
          { id: 'beat-4', actId: 'act-2', title: 'Azione Crescente & Primi Ostacoli', description: '', guideline: 'Il protagonista affronta le prime sfide e trova alleati/rivali.', order: 0 },
          { id: 'beat-5', actId: 'act-2', title: 'Punto Centrale (Midpoint)', description: '', guideline: 'Una rivelazione fondamentale o una vittoria/sconfitta che cambia la strategia.', order: 1 },
          { id: 'beat-6', actId: 'act-2', title: 'Il Momento Più Buio (All Hope is Lost)', description: '', guideline: 'Sembra che ogni speranza sia perduta; il piano originale fallisce miseramente.', order: 2 }
        ]
      },
      {
        id: 'act-3',
        title: 'Atto 3: Climax & Risoluzione',
        subtitle: 'Il confronto decisivo e il nuovo equilibrio',
        beats: [
          { id: 'beat-7', actId: 'act-3', title: "L'Ultima Intuizione & Riorganizzazione", description: '', guideline: 'Il protagonista capisce cosa serve davvero per vincere.', order: 0 },
          { id: 'beat-8', actId: 'act-3', title: 'Climax & Confronto Finale', description: '', guideline: 'La battaglia, la resa dei conti o la scelta morale suprema.', order: 1 },
          { id: 'beat-9', actId: 'act-3', title: 'Risoluzione & Nuovo Equilibrio', description: '', guideline: 'Le conseguenze del climax e il mondo dopo la trasformazione.', order: 2 }
        ]
      }
    ]
  },
  {
    id: 'hero_journey',
    name: "Il Viaggio dell'Eroe (Joseph Campbell / Vogler)",
    description: "Il celebre archetipo mitologico in 12 fasi universali, ideale per romanzi d'avventura, fantasy e crescita personale.",
    createActs: () => [
      {
        id: 'act-hj-1',
        title: 'Fase 1: La Partenza (Mondo Ordinario)',
        subtitle: 'Dalla vita quotidiana alla decisione di partire',
        beats: [
          { id: 'beat-hj-1', actId: 'act-hj-1', title: '1. Il Mondo Ordinario', description: '', guideline: "L'ambiente iniziale e i limiti del protagonista.", order: 0 },
          { id: 'beat-hj-2', actId: 'act-hj-1', title: "2. La Chiamata all'Avventura", description: '', guideline: "Una sfida o minaccia richiede l'intervento dell'eroe.", order: 1 },
          { id: 'beat-hj-3', actId: 'act-hj-1', title: '3. Il Rifiuto della Chiamata', description: '', guideline: "Dubbi, paure o doveri trattengono l'eroe.", order: 2 },
          { id: 'beat-hj-4', actId: 'act-hj-1', title: "4. L'Incontro col Mentore", description: '', guideline: 'Un maestro offre consigli, armi o saggezza.', order: 3 },
          { id: 'beat-hj-5', actId: 'act-hj-1', title: '5. Il Varco della Prima Soglia', description: '', guideline: "L'ingresso definitivo nel Mondo Straordinario.", order: 4 }
        ]
      },
      {
        id: 'act-hj-2',
        title: "Fase 2: L'Iniziazione (Mondo Straordinario)",
        subtitle: 'Prove, alleanze e la discesa nel punto più profondo',
        beats: [
          { id: 'beat-hj-6', actId: 'act-hj-2', title: '6. Prove, Nemici e Alleati', description: '', guideline: "L'esplorazione delle regole del nuovo mondo.", order: 0 },
          { id: 'beat-hj-7', actId: 'act-hj-2', title: '7. Avvicinamento alla Caverna Più Recondita', description: '', guideline: 'I preparativi per la sfida centrale.', order: 1 },
          { id: 'beat-hj-8', actId: 'act-hj-2', title: '8. La Prova Suprema', description: '', guideline: "L'incontro con la morte o con la paura più grande.", order: 2 },
          { id: 'beat-hj-9', actId: 'act-hj-2', title: "9. La Ricompensa (L'Elisir o la Spada)", description: '', guideline: "L'eroe conquista il tesoro, la verità o il potere.", order: 3 }
        ]
      },
      {
        id: 'act-hj-3',
        title: 'Fase 3: Il Ritorno & La Rinascita',
        subtitle: "La via del ritorno, la prova finale e l'elisir per il mondo",
        beats: [
          { id: 'beat-hj-10', actId: 'act-hj-3', title: '10. La Via del Ritorno', description: '', guideline: "L'urgenza di riportare la ricompensa a casa.", order: 0 },
          { id: 'beat-hj-11', actId: 'act-hj-3', title: '11. La Resurrezione', description: '', guideline: "L'ultimo e definitivo test di purificazione.", order: 1 },
          { id: 'beat-hj-12', actId: 'act-hj-3', title: "12. Ritorno con l'Elisir", description: '', guideline: "L'eroe torna a casa trasformato, portando salvezza.", order: 2 }
        ]
      }
    ]
  },
  {
    id: 'save_the_cat',
    name: 'Salva il Gatto! (Save the Cat! Beat Sheet)',
    description: 'La celebre griglia a 15 beat di Blake Snyder, usata nei migliori romanzi moderni e sceneggiature.',
    createActs: () => [
      {
        id: 'act-stc-1',
        title: 'Atto 1 (0% - 25%)',
        subtitle: "Dall'immagine iniziale al salto nell'Atto 2",
        beats: [
          { id: 'stc-1', actId: 'act-stc-1', title: '1. Immagine Iniziale', description: '', guideline: 'Istantanea visiva dello status quo del protagonista prima del cambiamento.', order: 0 },
          { id: 'stc-2', actId: 'act-stc-1', title: '2. Enunciazione del Tema', description: '', guideline: 'Qualcuno menziona la lezione di vita che il protagonista dovrà imparare.', order: 1 },
          { id: 'stc-3', actId: 'act-stc-1', title: '3. Setup (Presentazione)', description: '', guideline: 'Presentazione del mondo, dei difetti e delle relazioni del protagonista.', order: 2 },
          { id: 'stc-4', actId: 'act-stc-1', title: '4. Il Catalizzatore', description: '', guideline: "L'evento di rottura che distrugge lo status quo.", order: 3 },
          { id: 'stc-5', actId: 'act-stc-1', title: '5. Dibattito & Esitazione', description: '', guideline: "Il protagonista è tentato di rifiutare o cerca un'altra via.", order: 4 },
          { id: 'stc-6', actId: 'act-stc-1', title: "6. Ingresso nell'Atto 2", description: '', guideline: 'Scelta attiva e irrevocabile di iniziare il viaggio.', order: 5 }
        ]
      },
      {
        id: 'act-stc-2',
        title: 'Atto 2 (25% - 75%)',
        subtitle: 'Divertirsi con il concept, punto centrale e notte oscura',
        beats: [
          { id: 'stc-7', actId: 'act-stc-2', title: '7. Trama B (Relazione / Amore / Amicizia)', description: '', guideline: 'Una sottotrama incentrata sulle relazioni personali o insegnamenti morali.', order: 0 },
          { id: 'stc-8', actId: 'act-stc-2', title: '8. Giochi e Divertimento (Fun & Games)', description: '', guideline: 'La promessa della premessa: scene iconiche del genere.', order: 1 },
          { id: 'stc-9', actId: 'act-stc-2', title: '9. Midpoint (Punto di Metà)', description: '', guideline: 'Falsa vittoria o falsa sconfitta; la posta in gioco raddoppia.', order: 2 },
          { id: 'stc-10', actId: 'act-stc-2', title: '10. I Nemici Stringono il Cerchio', description: '', guideline: 'Le forze antagoniste colpiscono duramente; tensioni interne al gruppo.', order: 3 },
          { id: 'stc-11', actId: 'act-stc-2', title: '11. Tutto è Perduto (All Is Lost)', description: '', guideline: "Il momento più nero: morte simbolica o reale di una certezza.", order: 4 },
          { id: 'stc-12', actId: 'act-stc-2', title: "12. Notte Oscura dell'Anima", description: '', guideline: 'Il protagonista tocca il fondo e trova la vera motivazione interiore.', order: 5 }
        ]
      },
      {
        id: 'act-stc-3',
        title: 'Atto 3 (75% - 100%)',
        subtitle: 'Il piano rinnovato, il climax e la trasformazione',
        beats: [
          { id: 'stc-13', actId: 'act-stc-3', title: "13. Ingresso nell'Atto 3", description: '', guideline: "Un'idea brillante per risolvere la situazione grazie alla lezione appresa.", order: 0 },
          { id: 'stc-14', actId: 'act-stc-3', title: '14. Finale / Climax', description: '', guideline: 'Esecuzione del nuovo piano, confronto finale e vittoria autentica.', order: 1 },
          { id: 'stc-15', actId: 'act-stc-3', title: '15. Immagine Finale', description: '', guideline: 'Specchio della prima scena che mostra la trasformazione irreversibile del protagonista.', order: 2 }
        ]
      }
    ]
  },
  {
    id: 'kishotenketsu',
    name: 'Kishōtenketsu (Struttura Narrativa Orientale)',
    description: 'La celebre struttura in 4 fasi tipica della narrativa asiatica (Giappone/Cina): Introduzione, Sviluppo, Colpo di Scena (Twist) e Risoluzione senza conflitto diretto obbligatorio.',
    createActs: () => [
      {
        id: 'act-ki-1',
        title: 'Ki (起) - Introduzione',
        subtitle: 'Presentazione dei personaggi, della situazione iniziale e del tono',
        beats: [
          { id: 'ki-1', actId: 'act-ki-1', title: '1. Introduzione del Mondo & Figure', description: '', guideline: 'Impostazione calma e naturale della scena quotidiana.', order: 0 }
        ]
      },
      {
        id: 'act-sho-2',
        title: 'Shō (承) - Sviluppo & Prosecuzione',
        subtitle: 'Espansione naturale della situazione senza rotture brusche',
        beats: [
          { id: 'sho-1', actId: 'act-sho-2', title: '2. Approfondimento dei Dettagli', description: '', guideline: 'Si segue il corso degli eventi arricchendo sfumature e relazioni.', order: 0 }
        ]
      },
      {
        id: 'act-ten-3',
        title: 'Ten (転) - La Svolta Imprevista (Twist)',
        subtitle: 'Un elemento totalmente inaspettato o slegato viene introdotto',
        beats: [
          { id: 'ten-1', actId: 'act-ten-3', title: '3. Il Colpo di Scena / Nuovo Angolo', description: '', guideline: 'Un fatto spiazzante cambia radicalmente il significato di ciò che è accaduto prima.', order: 0 }
        ]
      },
      {
        id: 'act-ketsu-4',
        title: 'Ketsu (結) - Conclusione & Sintesi',
        subtitle: 'I fili si collegano creando una sintesi armoniosa ed emozionante',
        beats: [
          { id: 'ketsu-1', actId: 'act-ketsu-4', title: '4. La Riconnessione & Riflessione', description: '', guideline: 'Gli eventi precedenti e la svolta trovano il loro perfetto equilibrio finale.', order: 0 }
        ]
      }
    ]
  },
  {
    id: 'dan_harmon',
    name: "Story Circle di Dan Harmon (Il Cerchio delle 8 Fasi)",
    description: "La versione semplificata e potentissima del viaggio dell'eroe in 8 passi, usata in Rick & Morty, Community e narrativa moderna.",
    createActs: () => [
      {
        id: 'act-dh-1',
        title: 'Fase 1: Zona di Comfort & Desiderio',
        subtitle: 'Passi 1 e 2: Il mondo conosciuto',
        beats: [
          { id: 'dh-1', actId: 'act-dh-1', title: '1. Tu (Zona di Comfort)', description: '', guideline: 'Un personaggio si trova nella sua solita routine.', order: 0 },
          { id: 'dh-2', actId: 'act-dh-1', title: '2. Desiderio (Bisogno / Need)', description: '', guideline: 'Ma vuole qualcosa che non ha o avverte una mancanza.', order: 1 }
        ]
      },
      {
        id: 'act-dh-2',
        title: "Fase 2: Ingresso nell'Ignoto & Adattamento",
        subtitle: 'Passi 3 e 4: Il mondo sconosciuto',
        beats: [
          { id: 'dh-3', actId: 'act-dh-2', title: '3. Andare (Go / La Soglia)', description: '', guideline: 'Entra in una situazione sconosciuta e non familiare.', order: 0 },
          { id: 'dh-4', actId: 'act-dh-2', title: '4. Ricerca & Adattamento (Search)', description: '', guideline: 'Si adatta alle nuove regole e affronta ostacoli per cercare ciò che vuole.', order: 1 }
        ]
      },
      {
        id: 'act-dh-3',
        title: 'Fase 3: Ottenimento & Prezzo Pagato',
        subtitle: 'Passi 5 e 6: La prova e le conseguenze',
        beats: [
          { id: 'dh-5', actId: 'act-dh-3', title: '5. Trovare (Find / Conquista)', description: '', guideline: 'Ottiene ciò che desiderava.', order: 0 },
          { id: 'dh-6', actId: 'act-dh-3', title: '6. Pagare il Prezzo (Take / Pay)', description: '', guideline: 'Ma deve pagare un prezzo altissimo per averlo preso.', order: 1 }
        ]
      },
      {
        id: 'act-dh-4',
        title: 'Fase 4: Ritorno & Cambiamento',
        subtitle: 'Passi 7 e 8: Ritorno a casa trasformati',
        beats: [
          { id: 'dh-7', actId: 'act-dh-4', title: '7. Ritorno (Return)', description: '', guideline: 'Torna al punto di partenza nel suo mondo familiare.', order: 0 },
          { id: 'dh-8', actId: 'act-dh-4', title: '8. Cambiato (Changed)', description: '', guideline: 'Avendo subito un cambiamento profondo e irreversibile.', order: 1 }
        ]
      }
    ]
  },
  {
    id: 'seven_point',
    name: 'Struttura a 7 Punti (Dan Wells)',
    description: 'Metodo progressivo in 7 tappe ideale per pianificare a ritroso dal finale al punto di partenza.',
    createActs: () => [
      {
        id: 'act-7p-1',
        title: 'Atto 1: Impostazione & Prima Spinta',
        subtitle: 'Dallo stato iniziale al punto di non ritorno',
        beats: [
          { id: 'p7-1', actId: 'act-7p-1', title: '1. Hook (Aggancio Iniziale)', description: '', guideline: "Lo stato opposto rispetto al finale (es. l'eroe è debole o disilluso).", order: 0 },
          { id: 'p7-2', actId: 'act-7p-1', title: '2. Primo Punto di Trama (Plot Turn 1)', description: '', guideline: "L'evento che mette in moto la storia e spinge il protagonista all'azione.", order: 1 }
        ]
      },
      {
        id: 'act-7p-2',
        title: 'Atto 2: Pressione, Metà Storia & Sconfitta Apparente',
        subtitle: 'Le forze avverse si fanno sentire',
        beats: [
          { id: 'p7-3', actId: 'act-7p-2', title: '3. Primo Punto di Pressione (Pinch 1)', description: '', guideline: "L'antagonista mostra la sua vera forza; si alza la posta in gioco.", order: 0 },
          { id: 'p7-4', actId: 'act-7p-2', title: '4. Midpoint (Passaggio da Reattivo a Proattivo)', description: '', guideline: "Il protagonista smette di difendersi e decide di attaccare attivamente.", order: 1 },
          { id: 'p7-5', actId: 'act-7p-2', title: '5. Secondo Punto di Pressione (Pinch 2)', description: '', guideline: "Sembra tutto perduto; il piano fallisce e le conseguenze sono devastanti.", order: 2 }
        ]
      },
      {
        id: 'act-7p-3',
        title: 'Atto 3: Risoluzione Finale',
        subtitle: "L'arma finale e la vittoria",
        beats: [
          { id: 'p7-6', actId: 'act-7p-3', title: '6. Secondo Punto di Trama (Plot Turn 2)', description: '', guideline: "La rivelazione o l'arma finale che rende possibile la vittoria.", order: 0 },
          { id: 'p7-7', actId: 'act-7p-3', title: '7. Risoluzione (Resolution)', description: '', guideline: 'Lo stato finale in cui il protagonista ha completato la sua evoluzione.', order: 1 }
        ]
      }
    ]
  },
  {
    id: 'romance_beats',
    name: "Struttura Romance & Romanzo d'Amore",
    description: "La scansione classica degli archi d'amore: Meet Cute, Primi Battibecchi, Avvicinamento, Grande Rottura e Gran Gesto.",
    createActs: () => [
      {
        id: 'act-rom-1',
        title: "Fase 1: L'Incontro & L'Attrazione",
        subtitle: 'Dalla vita separata al primo incontro memorabile',
        beats: [
          { id: 'rom-1', actId: 'act-rom-1', title: '1. I Due Mondi Separati', description: '', guideline: 'Presentazione delle vite dei due protagonisti e dei loro blocchi emotivi.', order: 0 },
          { id: 'rom-2', actId: 'act-rom-1', title: "2. L'Incontro Fatale (Meet Cute)", description: '', guideline: 'Il primo incontro: scintille, equivoci o antipatia iniziale.', order: 1 },
          { id: 'rom-3', actId: 'act-rom-1', title: '3. La Vicinanza Forzata', description: '', guideline: 'Un motivo esterno costringe i due a collaborare o passare del tempo insieme.', order: 2 }
        ]
      },
      {
        id: 'act-rom-2',
        title: 'Fase 2: Avvicinamento & Vulnerabilità',
        subtitle: 'Le barriere cadono ma i dubbi restano',
        beats: [
          { id: 'rom-4', actId: 'act-rom-2', title: '4. Il Primo Momento di Vulnerabilità', description: '', guideline: 'Uno dei due confida un segreto o una ferita del passato.', order: 0 },
          { id: 'rom-5', actId: 'act-rom-2', title: '5. Il Primo Bacio / La Scintilla Esplicita', description: '', guideline: "L'attrazione diventa innegabile e reciproca.", order: 1 },
          { id: 'rom-6', actId: 'act-rom-2', title: '6. La Grande Rottura (The Breakup)', description: '', guideline: 'Una bugia svelata, un malinteso o la paura di soffrire separa i due.', order: 2 }
        ]
      },
      {
        id: 'act-rom-3',
        title: 'Fase 3: Il Gran Gesto & Il Lieto Fine',
        subtitle: "La dichiarazione d'amore e il nuovo inizio",
        beats: [
          { id: 'rom-7', actId: 'act-rom-3', title: '7. La Presa di Coscienza', description: '', guideline: "Capiscono che la vita senza l'altro è insopportabile.", order: 0 },
          { id: 'rom-8', actId: 'act-rom-3', title: '8. Il Gran Gesto (The Grand Gesture)', description: '', guideline: "Dichiarazione pubblica o sacrificio personale per riconquistare l'altro.", order: 1 },
          { id: 'rom-9', actId: 'act-rom-3', title: '9. Vissero Felici e Contenti (HEA / HFN)', description: '', guideline: "L'unione definitiva e lo sguardo al futuro insieme.", order: 2 }
        ]
      }
    ]
  },
  {
    id: 'mystery_beats',
    name: 'Giallo & Investigazione (Mystery / Thriller)',
    description: 'La griglia classica per romanzi investigativi: Crimine, Indagine, False Piste, Pericolo e Rivelazione.',
    createActs: () => [
      {
        id: 'act-my-1',
        title: "Fase 1: Il Crimine & L'Enigma",
        subtitle: 'La scoperta del crimine e i primi indizi',
        beats: [
          { id: 'my-1', actId: 'act-my-1', title: "1. Il Delitto / L'Evento Scatenante", description: '', guideline: 'La scena del crimine o la scomparsa che avvia il caso.', order: 0 },
          { id: 'my-2', actId: 'act-my-1', title: "2. L'Investigatore & La Chiamata", description: '', guideline: "Ingresso dell'investigatore e primi rilievi sul campo.", order: 1 },
          { id: 'my-3', actId: 'act-my-1', title: '3. La Rosa dei Sospettati & Primi Interrogatori', description: '', guideline: "Presentazione delle persone d'interesse con moventi apparenti.", order: 2 }
        ]
      },
      {
        id: 'act-my-2',
        title: 'Fase 2: False Piste & Complicazioni',
        subtitle: 'Depistaggi, alibi e la seconda rivelazione',
        beats: [
          { id: 'my-4', actId: 'act-my-2', title: '4. False Piste (Red Herrings)', description: '', guideline: "Un indizio fuorviante porta l'indagine in una direzione errata.", order: 0 },
          { id: 'my-5', actId: 'act-my-2', title: '5. La Svolta Centrale / Il Secondo Crimine', description: '', guideline: 'Un secondo evento scuote le certezze o un alibi crolla inaspettatamente.', order: 1 },
          { id: 'my-6', actId: 'act-my-2', title: '6. Il Pericolo Personale', description: '', guideline: "L'investigatore diventa il bersaglio o viene messo all'angolo.", order: 2 }
        ]
      },
      {
        id: 'act-my-3',
        title: 'Fase 3: La Rivelazione & La Giustizia',
        subtitle: 'La deduzione brillante e la resa dei conti',
        beats: [
          { id: 'my-7', actId: 'act-my-3', title: "7. L'Indizio Trascurato & Il Quadro Completo", description: '', guideline: 'Il dettaglio apparentemente insignificante che svela il vero movente.', order: 0 },
          { id: 'my-8', actId: 'act-my-3', title: "8. La Resa dei Conti / L'Interrogatorio Finale", description: '', guideline: 'La trappola scatta e il colpevole viene smascherato.', order: 1 },
          { id: 'my-9', actId: 'act-my-3', title: '9. Epilogo & Conseguenze Morali', description: '', guideline: "La verità viene ristabilita e l'investigatore fa i conti con l'esperienza.", order: 2 }
        ]
      }
    ]
  },
  {
    id: 'dnd_campaign',
    name: 'Arco di Campagna D&D / GdR (Tier 1-4)',
    description: 'Struttura epica a 4 Tier di gioco.',
    createActs: () => [
      {
        id: 'act-dnd-1',
        title: 'Tier 1: Eroi Locali (Livelli 1-4)',
        subtitle: 'La formazione del Party, le prime missioni locali e la scoperta della minaccia sotterranea',
        beats: [
          { id: 'dnd-1', actId: 'act-dnd-1', title: '1. Incontro Iniziale & Prima Quest Locale', description: '', guideline: 'Come si incontrano i PG e la prima avventura.', order: 0 },
          { id: 'dnd-2', actId: 'act-dnd-1', title: '2. Il Primo Dungeon & Il Segnale di Pericolo', description: '', guideline: "La risoluzione della minaccia locale rivela legami con un male più grande.", order: 1 },
          { id: 'dnd-3', actId: 'act-dnd-1', title: '3. Reputazione Conquistata & Salto di Livello', description: '', guideline: 'I PG diventano famosi nella regione e ottengono il supporto dei signori locali.', order: 2 }
        ]
      },
      {
        id: 'act-dnd-2',
        title: 'Tier 2: Eroi del Reame (Livelli 5-10)',
        subtitle: 'La minaccia si espande a livello regionale',
        beats: [
          { id: 'dnd-4', actId: 'act-dnd-2', title: '4. Crisi Politica o Guerra Incombente', description: '', guideline: 'Le fazioni si muovono e i PG devono scegliere alleati e sventare complotti.', order: 0 },
          { id: 'dnd-5', actId: 'act-dnd-2', title: "5. La Ricerca dell'Artefatto / Informazione Chiave", description: '', guideline: 'Spedizione in terre selvagge, rovine proibite o fortezze nemiche.', order: 1 },
          { id: 'dnd-6', actId: 'act-dnd-2', title: '6. Il Generale del Nemico / Mid-Boss', description: '', guideline: 'Scontro culminante contro il braccio destro del cattivo principale.', order: 2 }
        ]
      },
      {
        id: 'act-dnd-3',
        title: 'Tier 3: Maestri del Mondo (Livelli 11-16)',
        subtitle: 'I PG governano roccaforti e affrontano cataclismi planetari',
        beats: [
          { id: 'dnd-7', actId: 'act-dnd-3', title: '7. Minaccia Planare o Risveglio Antico', description: '', guideline: "Un male cosmico o un drago leggendario minaccia l'esistenza del regno.", order: 0 },
          { id: 'dnd-8', actId: 'act-dnd-3', title: '8. Viaggio Astrale / Alleanze Sovrannaturali', description: '', guideline: 'I PG contrattano con divinità o draghi antichi per ottenere poteri supremi.', order: 1 }
        ]
      },
      {
        id: 'act-dnd-4',
        title: 'Tier 4: Campioni del Multiverso (Livelli 17-20)',
        subtitle: "Il destino dell'intero universo si decide nella resa dei conti finale",
        beats: [
          { id: 'dnd-9', actId: 'act-dnd-4', title: "9. L'Assalto alla Fortezza del Big Bad Boss (BBEG)", description: '', guideline: 'I PG usano magie di 9° livello per lo scontro supremo.', order: 0 },
          { id: 'dnd-10', actId: 'act-dnd-4', title: '10. Epilogo Leggendario & Ascensione del Party', description: '', guideline: 'Come il mondo ricorda le gesta del party e dove si ritirano gli eroi.', order: 1 }
        ]
      }
    ]
  },
  {
    id: 'five_room_dungeon',
    name: 'Struttura Dungeon a 5 Stanze (Johnn Four)',
    description: 'Il celebre schema di design per avventure e dungeon GdR.',
    createActs: () => [
      {
        id: 'act-frd-1',
        title: 'Stanza 1: Ingresso con Guardiani',
        subtitle: 'La prima barriera che mette alla prova la determinazione e le risorse dei PG',
        beats: [{ id: 'frd-1', actId: 'act-frd-1', title: '1. Ingresso & Prima Sfida Tattica', description: '', guideline: "Sentinelle, trappole d'allarme o mostri di ronda all'entrata.", order: 0 }]
      },
      {
        id: 'act-frd-2',
        title: 'Stanza 2: Puzzle, Enigma o Sfida di Ruolo',
        subtitle: 'Una prova che non può essere risolta solo con la spada',
        beats: [{ id: 'frd-2', actId: 'act-frd-2', title: '2. Enigma Meccanico, Spirito Inquieto o Dilemma', description: '', guideline: "I PG devono usare intelligenza, abilità sociali o incantesimi d'utilità.", order: 0 }]
      },
      {
        id: 'act-frd-3',
        title: "Stanza 3: Battuta d'Arresto o Colpo di Scena",
        subtitle: 'La situazione si complica; una rivelazione ribalta le aspettative',
        beats: [{ id: 'frd-3', actId: 'act-frd-3', title: '3. Tradimento, Trappola Mortale o Nuova Verità', description: '', guideline: "L'obiettivo non è quello che sembrava, o il nemico ha teso un agguato.", order: 0 }]
      },
      {
        id: 'act-frd-4',
        title: 'Stanza 4: Scontro al Vertice (Boss Fight)',
        subtitle: "Il climax dell'avventura con il nemico principale nella sua tana",
        beats: [{ id: 'frd-4', actId: 'act-frd-4', title: '4. La Battaglia Finale & Ambiente Interattivo', description: '', guideline: 'Boss con azioni leggendarie, trappole ambientali e terreno dinamico.', order: 0 }]
      },
      {
        id: 'act-frd-5',
        title: 'Stanza 5: Ricompensa & Aggancio per il Futuro',
        subtitle: "Il bottino meritato e l'indizio per la prossima avventura",
        beats: [{ id: 'frd-5', actId: 'act-frd-5', title: '5. Tesoro (Loot), Riconoscenza & Nuovo Spunto di Trama', description: '', guideline: 'Oggetti magici, lettere compromettenti o la chiave per un nuovo mistero.', order: 0 }]
      }
    ]
  },
  {
    id: 'dnd_oneshot',
    name: 'Avventura One-Shot (Sessione Singola 3-4 Ore)',
    description: 'Struttura perfetta per sessioni singole da completare in una sola serata.',
    createActs: () => [
      {
        id: 'act-os-1',
        title: "Fase 1: L'Aggancio (Hook) & Partenza",
        subtitle: "Minuti 0-45: Ingaggio rapido e avvio dell'azione",
        beats: [{ id: 'os-1', actId: 'act-os-1', title: "1. Incidente d'Apertura & Richiesta d'Aiuto", description: '', guideline: 'La sessione parte in medias res con una minaccia immediata o un PNG disperato.', order: 0 }]
      },
      {
        id: 'act-os-2',
        title: 'Fase 2: Il Viaggio & Primo Scontro',
        subtitle: 'Minuti 45-120: Esplorazione e ostacoli sul cammino',
        beats: [{ id: 'os-2', actId: 'act-os-2', title: '2. Incontro Lungo la Strada / Indizi', description: '', guideline: 'Breve combattimento o enigma per testare le capacità del party.', order: 0 }]
      },
      {
        id: 'act-os-3',
        title: 'Fase 3: Il Covo del Pericolo & Climax',
        subtitle: 'Minuti 120-210: Il cuore della tana e la battaglia finale',
        beats: [
          { id: 'os-3', actId: 'act-os-3', title: '3. Infiltrazione & Resa dei Conti col Boss', description: '', guideline: 'Tensione al massimo, risorse al limite e trionfo finale.', order: 0 },
          { id: 'os-4', actId: 'act-os-3', title: '4. Conclusione & Ricompense', description: '', guideline: 'Celebrazione del party e fine della storia.', order: 1 }
        ]
      }
    ]
  },
  {
    id: 'custom',
    name: 'Struttura Libera & Personalizzata',
    description: 'Inizia con un foglio completamente vuoto e costruisci la tua struttura personalizzata.',
    createActs: () => [
      {
        id: 'act-custom-1',
        title: 'Sezione 1',
        subtitle: 'Descrizione della prima parte della tua storia',
        beats: [
          { id: 'beat-custom-1', actId: 'act-custom-1', title: 'Punto di Trama 1', description: '', guideline: 'Descrivi cosa accade in questa fase...', order: 0 }
        ]
      }
    ]
  }
];
