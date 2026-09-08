import { PlotAct, PlotTemplateType } from '../types';

export interface PlotTemplateInfo {
  id: PlotTemplateType;
  name: string;
  description: string;
  category: 'novel' | 'dnd' | 'all';
  createActs: () => PlotAct[];
}

export const PLOT_TEMPLATES: PlotTemplateInfo[] = [
  {
    id: 'three_act',
    name: 'Struttura Classica in 3 Atti',
    description: "La struttura narrativa classica dell'occidente: Impostazione, Sviluppo & Crisi, Risoluzione.",
    category: 'novel',
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
    category: 'novel',
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
    category: 'novel',
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
    category: 'novel',
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
    category: 'novel',
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
    id: 'freytag',
    name: 'Piramide di Freytag (Dramma in 5 Atti)',
    description: 'La celebre architettura teatrale e romanzesca in 5 atti: Esposizione, Azione Crescente, Climax, Azione Calante e Catastrofe/Risoluzione.',
    category: 'novel',
    createActs: () => [
      {
        id: 'act-fry-1',
        title: 'Atto 1: Esposizione & Incidente Scatenante',
        subtitle: "Presentazione del mondo, dei conflitti latenti e rottura dell'equilibrio",
        beats: [
          { id: 'fry-1', actId: 'act-fry-1', title: '1. Stato Iniziale & Contesto', description: '', guideline: 'Il mondo, i protagonisti, i desideri profondi e le crepe della situazione di partenza.', order: 0 },
          { id: 'fry-2', actId: 'act-fry-1', title: '2. Forza Motrice (Inciting Incident)', description: '', guideline: "L'evento scatenante che innesca il conflitto e rende inevitabile l'azione.", order: 1 }
        ]
      },
      {
        id: 'act-fry-2',
        title: 'Atto 2: Azione Crescente & Complicazioni (Rising Action)',
        subtitle: 'Una serie di ostacoli e crisi parziali aumentano costantemente la posta in gioco',
        beats: [
          { id: 'fry-3', actId: 'act-fry-2', title: '3. Primi Ostacoli & Reazioni', description: '', guideline: 'Il protagonista tenta soluzioni ordinarie ma le forze antagoniste resistono.', order: 0 },
          { id: 'fry-4', actId: 'act-fry-2', title: '4. Complicazione & Impegno Irrevocabile', description: '', guideline: 'La posta in gioco si alza e non è più possibile tornare indietro.', order: 1 }
        ]
      },
      {
        id: 'act-fry-3',
        title: 'Atto 3: Il Climax (Punto Culminante)',
        subtitle: "Il punto di non ritorno dove la fortuna dell'eroe cambia irrevocabilmente",
        beats: [
          { id: 'fry-5', actId: 'act-fry-3', title: '5. La Crisi Suprema & Ribaltamento (Peripeteia)', description: '', guideline: 'Il momento di massima tensione: la scelta fondamentale che deciderà trionfo o rovina.', order: 0 }
        ]
      },
      {
        id: 'act-fry-4',
        title: 'Atto 4: Azione Calante & Falsa Tregua (Falling Action)',
        subtitle: "Le conseguenze ineluttabili del climax e l'ultimo momento di speranza/sospensione",
        beats: [
          { id: 'fry-6', actId: 'act-fry-4', title: '6. Conseguenze del Climax & Spirale', description: '', guideline: 'Le forze messe in moto dal climax precipitano verso l\'epilogo.', order: 0 },
          { id: 'fry-7', actId: 'act-fry-4', title: '7. Momento di Ultima Sospensione', description: '', guideline: 'Un breve istante in cui sembra possibile una via di scampo alternativa prima della resa finale.', order: 1 }
        ]
      },
      {
        id: 'act-fry-5',
        title: 'Atto 5: Risoluzione / Catastrofe (Dénouement)',
        subtitle: 'Lo scioglimento definitivo del dramma, la purificazione e il nuovo ordine',
        beats: [
          { id: 'fry-8', actId: 'act-fry-5', title: '8. La Catastrofe / Risoluzione Finale', description: '', guideline: "Il destino dell'eroe si compie (tragico o trionfale) e il mistero/conflitto si estingue.", order: 0 },
          { id: 'fry-9', actId: 'act-fry-5', title: "9. Ristabilimento dell'Equilibrio", description: '', guideline: 'Il mondo dopo la tempesta: riflessione morale e nuovo ordine permanente.', order: 1 }
        ]
      }
    ]
  },
  {
    id: 'fichtean',
    name: 'Curva Fichteana (Crisi & Climax a Onde)',
    description: 'Struttura dinamica a onde di tensione crescente: inizia in medias res e sviluppa una serie di crisi concatenate fino alla Crisi Suprema.',
    category: 'novel',
    createActs: () => [
      {
        id: 'act-fich-1',
        title: 'Fase 1: In Medias Res & Prima Crisi',
        subtitle: 'Nessuna lunga introduzione: la storia si apre nel bel mezzo del problema',
        beats: [
          { id: 'fich-1', actId: 'act-fich-1', title: '1. Apertura in Piena Azione', description: '', guideline: 'Il lettore viene catapultato direttamente in una situazione tesa ed urgente.', order: 0 },
          { id: 'fich-2', actId: 'act-fich-1', title: '2. Prima Crisi & Informazioni Chiave', description: '', guideline: 'Risolvendo o fuggendo dalla prima crisi emergono i retroscena indispensabili.', order: 1 }
        ]
      },
      {
        id: 'act-fich-2',
        title: 'Fase 2: Serie di Crisi & Escalation (Rising Crises)',
        subtitle: 'Onde successive di tensione: ogni crisi è più difficile e personale della precedente',
        beats: [
          { id: 'fich-3', actId: 'act-fich-2', title: '3. Seconda Crisi (Ostacolo Fisico / Materiale)', description: '', guideline: 'Una nuova minaccia mette alla prova le risorse pratiche dei protagonisti.', order: 0 },
          { id: 'fich-4', actId: 'act-fich-2', title: '4. Respiro Temporaneo & Nuova Complicazione', description: '', guideline: 'Breve momento di tregua in cui si rivela un problema ancora più grave.', order: 1 },
          { id: 'fich-5', actId: 'act-fich-2', title: '5. Terza Crisi (Tradimento o Minaccia Personale)', description: '', guideline: 'Il conflitto colpisce gli affetti o la fiducia del protagonista.', order: 2 },
          { id: 'fich-6', actId: 'act-fich-2', title: '6. Quarta Crisi (Tutto Sembra Perduto)', description: '', guideline: "La sconfitta parziale più pesante che spinge i personaggi sull'orlo del baratro.", order: 3 }
        ]
      },
      {
        id: 'act-fich-3',
        title: 'Fase 3: La Crisi Suprema (Major Climax)',
        subtitle: 'Tutti i fili delle crisi precedenti esplodono contemporaneamente',
        beats: [
          { id: 'fich-7', actId: 'act-fich-3', title: '7. Il Confronto Decisivo', description: '', guideline: 'Lo scontro inevitabile che richiede il superamento definitivo del proprio limite.', order: 0 }
        ]
      },
      {
        id: 'act-fich-4',
        title: 'Fase 4: Azione Discendente & Risoluzione',
        subtitle: "Il ritorno alla calma e l'impatto trasformativo sul protagonista",
        beats: [
          { id: 'fich-8', actId: 'act-fich-4', title: '8. Conseguenze Immediate & Riconciliazione', description: '', guideline: 'Le risposte alle domande aperte e il commiato tra i personaggi.', order: 0 },
          { id: 'fich-9', actId: 'act-fich-4', title: '9. Il Nuovo Equilibrio Raggiunto', description: '', guideline: "L'immagine finale che dimostra la trasformazione irrevocabile avvenuta.", order: 1 }
        ]
      }
    ]
  },
  {
    id: 'seven_point',
    name: 'Struttura a 7 Punti (Dan Wells)',
    description: 'Metodo progressivo in 7 tappe ideale per pianificare a ritroso dal finale al punto di partenza.',
    category: 'novel',
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
    id: 'snowflake',
    name: 'Metodo Snowflake (Randy Ingermanson)',
    description: 'La celebre tecnica di progettazione frattale: da una singola frase a una mappa completa di scene, personaggi e sottotrame.',
    category: 'novel',
    createActs: () => [
      {
        id: 'act-snw-1',
        title: 'Livello 1: La Premessa & I Tre Disastri',
        subtitle: 'La frase fondante, il paragrafo riassuntivo e i tre punti di svolta capitali',
        beats: [
          { id: 'snw-1', actId: 'act-snw-1', title: "1. La Frase d'Impatto (One-Sentence Summary)", description: '', guideline: 'Chi è il protagonista, cosa vuole, qual è il conflitto e cosa rischia.', order: 0 },
          { id: 'snw-2', actId: 'act-snw-1', title: '2. Il Primo Disastro (Fine Atto 1)', description: '', guideline: 'Il tentativo iniziale del protagonista fallisce e lo costringe a impegnarsi a fondo.', order: 1 },
          { id: 'snw-3', actId: 'act-snw-1', title: '3. Il Secondo Disastro (Midpoint)', description: '', guideline: 'Una nuova complicazione ribalta la situazione; il protagonista passa all\'attacco.', order: 2 },
          { id: 'snw-4', actId: 'act-snw-1', title: '4. Il Terzo Disastro (Crisi Finale)', description: '', guideline: 'Il piano crolla e le circostanze sembrano disperate prima della resa dei conti.', order: 3 }
        ]
      },
      {
        id: 'act-snw-2',
        title: 'Livello 2: Profili dei Personaggi & Motivazioni',
        subtitle: 'Gli archi evolutivi di protagonisti, alleati e antagonisti',
        beats: [
          { id: 'snw-5', actId: 'act-snw-2', title: "5. L'Arco del Protagonista (Obiettivo, Bugia & Verità)", description: '', guideline: 'Cosa desidera, quale convinzione errata lo limita e quale verità deve comprendere.', order: 0 },
          { id: 'snw-6', actId: 'act-snw-2', title: "6. L'Antagonista & Le Forze d'Opposizione", description: '', guideline: 'Le motivazioni coerenti dell\'avversario e perché crede di essere nel giusto.', order: 1 },
          { id: 'snw-7', actId: 'act-snw-2', title: '7. Personaggi Secondari & Sottotrame Chiave', description: '', guideline: 'Come le vite dei comprimari riflettono e arricchiscono il tema centrale.', order: 2 }
        ]
      },
      {
        id: 'act-snw-3',
        title: 'Livello 3: Sinossi Operativa a Scene',
        subtitle: 'La sequenza frattale di tutte le scene divise in Azione e Reazione',
        beats: [
          { id: 'snw-8', actId: 'act-snw-3', title: '8. Sequenza delle Scene Proattive (Obiettivo - Conflitto - Disastro)', description: '', guideline: 'Le scene in cui i personaggi agiscono e subiscono battute d\'arresto.', order: 0 },
          { id: 'snw-9', actId: 'act-snw-3', title: '9. Sequenza delle Scene Reattive (Reazione - Dilemma - Decisione)', description: '', guideline: 'Le scene intime di rielaborazione emotiva e nuova pianificazione.', order: 1 }
        ]
      },
      {
        id: 'act-snw-4',
        title: 'Livello 4: Climax & Risoluzione Frattale',
        subtitle: 'La convergenza di tutti gli archi narrativi nella stesura finale',
        beats: [
          { id: 'snw-10', actId: 'act-snw-4', title: '10. Climax Corale & Risoluzione dei Fili', description: '', guideline: 'Tutti gli archi secondari e la trama principale giungono a compimento.', order: 0 },
          { id: 'snw-11', actId: 'act-snw-4', title: '11. Risonanza Finale', description: '', guideline: 'L\'ultima nota tematica che lascia un\'impressione duratura nel lettore.', order: 1 }
        ]
      }
    ]
  },
  {
    id: 'romance_beats',
    name: "Struttura Romance & Romanzo d'Amore",
    description: "La scansione classica degli archi d'amore: Meet Cute, Primi Battibecchi, Avvicinamento, Grande Rottura e Gran Gesto.",
    category: 'novel',
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
    category: 'novel',
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
    id: 'thriller_beats',
    name: 'Struttura Thriller & Countdown ad Alta Tensione',
    description: "Pacing serrato, orologio biologico/temporale che scorre, paranoia, false piste e scontro all'ultimo secondo.",
    category: 'novel',
    createActs: () => [
      {
        id: 'act-thr-1',
        title: "Atto 1: L'Innesco & L'Orologio che Scorre (Countdown)",
        subtitle: 'La minaccia esplode e il tempo per sventarla è contato',
        beats: [
          { id: 'thr-1', actId: 'act-thr-1', title: '1. Il Lampo di Minaccia Iniziale', description: '', guideline: 'Un delitto, un rapimento o una falla di sicurezza scuote la normalità.', order: 0 },
          { id: 'thr-2', actId: 'act-thr-1', title: '2. Il Protagonista Coinvolto & Il Timer', description: '', guideline: 'Il protagonista viene attirato nella rete e si stabilisce il limite di tempo inderogabile.', order: 1 },
          { id: 'thr-3', actId: 'act-thr-1', title: '3. Nessun Aiuto Esterno (Isolamento)', description: '', guideline: "Le autorità non credono, sono corrotte o impossibilitate ad agire; l'eroe è solo.", order: 2 }
        ]
      },
      {
        id: 'act-thr-2',
        title: 'Atto 2: La Caccia, La Paranoia & Il Contro-Attacco',
        subtitle: "Indagini sotto tiro: la caccia si fa disperata e l'antagonista anticipa ogni mossa",
        beats: [
          { id: 'thr-4', actId: 'act-thr-2', title: '4. Prima Pista & Conflitto Diretto', description: '', guideline: 'Il protagonista ottiene un primo vantaggio, pagando un prezzo alto.', order: 0 },
          { id: 'thr-5', actId: 'act-thr-2', title: '5. La Falsa Pista / Midpoint Esplosivo', description: '', guideline: 'Ciò che sembrava la soluzione si rivela una trappola orchestrata dal vero nemico.', order: 1 },
          { id: 'thr-6', actId: 'act-thr-2', title: '6. Il Protagonista Diventa la Preda', description: '', guideline: 'I ruoli si ribaltano: il protagonista deve fuggire e difendersi mentre indaga.', order: 2 }
        ]
      },
      {
        id: 'act-thr-3',
        title: 'Atto 3: Il Tradimento & Il Punto di Rottura',
        subtitle: "L'alleato più fidato vacilla e ogni speranza sembra svanire",
        beats: [
          { id: 'thr-7', actId: 'act-thr-3', title: '7. Il Tradimento Inaspettato', description: '', guideline: 'Una rivelazione sconcertante fa crollare ogni certezza su chi fidarsi.', order: 0 },
          { id: 'thr-8', actId: 'act-thr-3', title: '8. Momento di Buio Totale & Intuizione Finale', description: '', guideline: 'Catturato o braccato, il protagonista scopre il punto debole nel piano del cattivo.', order: 1 }
        ]
      },
      {
        id: 'act-thr-4',
        title: 'Atto 4: Countdown Finale & Resa dei Conti',
        subtitle: "Gli ultimi minuti prima dell'esplosione o della catastrofe",
        beats: [
          { id: 'thr-9', actId: 'act-thr-4', title: '9. Corsa Contro i Secondi (The Climax)', description: '', guideline: 'Azione frenetica per raggiungere il luogo della minaccia prima che scada il tempo.', order: 0 },
          { id: 'thr-10', actId: 'act-thr-4', title: '10. Duello Finale Faccia a Faccia', description: '', guideline: "Confronto brutale e risolutivo con l'antagonista principale.", order: 1 },
          { id: 'thr-11', actId: 'act-thr-4', title: '11. Decompressione & Sollievo', description: '', guideline: 'Il timer si ferma, il pericolo rientra e le conseguenze psicologiche emergono.', order: 2 }
        ]
      }
    ]
  },
  {
    id: 'fantasy_epic',
    name: 'Arco Epico High Fantasy (World, Lore & Guerra per il Fato)',
    description: 'La grande narrazione corale fantasy: antiche profezie, la compagnia errante, regni caduti e la guerra per la salvezza del mondo.',
    category: 'novel',
    createActs: () => [
      {
        id: 'act-epi-1',
        title: "Atto 1: L'Ombra sui Confini & La Chiamata del Destino",
        subtitle: 'Dalla vita remota ai primi presagi del Male Antico che si risveglia',
        beats: [
          { id: 'epi-1', actId: 'act-epi-1', title: '1. Vita nei Feudi & Prime Avvisaglie', description: '', guideline: 'La serenità apparente di un borgo o di un giovane ignaro del proprio retaggio.', order: 0 },
          { id: 'epi-2', actId: 'act-epi-1', title: "2. L'Ombra Colpisce (L'Attacco Inatteso)", description: '', guideline: 'Mostri antichi o un emissario oscuro distruggono la pace; fuga obbligata.', order: 1 },
          { id: 'epi-3', actId: 'act-epi-1', title: "3. Raduno dei Primi Alleati & Il Manufatto", description: '', guideline: "Incontro con una guida saggia e scoperta dell'oggetto, segreto o potere ancestrale.", order: 2 }
        ]
      },
      {
        id: 'act-epi-2',
        title: 'Atto 2: Il Lungo Viaggio & Le Corti Divise',
        subtitle: 'Attraversamento di regni mitici, pericoli arcani e tentativi di unire popoli rivali',
        beats: [
          { id: 'epi-4', actId: 'act-epi-2', title: '4. La Compagnia si Compone', description: '', guideline: 'Eroi di stirpi e culture diverse si uniscono nonostante vecchi rancori.', order: 0 },
          { id: 'epi-5', actId: 'act-epi-2', title: '5. Attraversamento delle Terre Proibite', description: '', guideline: 'Montagne infestate, rovine millenarie o foreste incantate mettono a dura prova il gruppo.', order: 1 },
          { id: 'epi-6', actId: 'act-epi-2', title: '6. Il Consiglio dei Regni (Diplomazia & Diffidenza)', description: '', guideline: "Re ed elfi esitano a scendere in guerra: l'orgoglio divide i popoli liberi.", order: 2 }
        ]
      },
      {
        id: 'act-epi-3',
        title: 'Atto 3: La Frattura & La Caduta delle Difese',
        subtitle: 'La compagnia si divide, una grande roccaforte crolla e il prezzo si fa straziante',
        beats: [
          { id: 'epi-7', actId: 'act-epi-3', title: '7. La Morte o Scomparsa del Mentore', description: '', guideline: "La figura guida cade, lasciando gli eroi soli di fronte a una responsabilità immensa.", order: 0 },
          { id: 'epi-8', actId: 'act-epi-3', title: '8. Sentieri Separati (Trame Parallele)', description: '', guideline: "Il gruppo si divide: chi cerca l'arma sacra, chi guida un esercito disperato.", order: 1 },
          { id: 'epi-9', actId: 'act-epi-3', title: "9. L'Ora Più Cupa: L'Assedio alle Mura", description: '', guideline: "L'orda nemica soverchiante sembra inarrestabile; le speranze sono al minimo storico.", order: 2 }
        ]
      },
      {
        id: 'act-epi-4',
        title: 'Atto 4: La Battaglia per il Fato del Mondo & La Nuova Era',
        subtitle: 'Il compimento della profezia, la vittoria pagata col sangue e la partenza',
        beats: [
          { id: 'epi-10', actId: 'act-epi-4', title: "10. L'Arrivo Inaspettato dei Rinforzi", description: '', guideline: "Un'antica promessa viene onorata e le forze alleate ribaltano la marea dello scontro.", order: 0 },
          { id: 'epi-11', actId: 'act-epi-4', title: '11. Il Duello nel Cuore delle Tenebre', description: '', guideline: "Il protagonista affronta l'Entità Oscura o distrugge la fonte del suo potere.", order: 1 },
          { id: 'epi-12', actId: 'act-epi-4', title: "12. L'Incoronazione, Le Cicatrici & La Nuova Era", description: '', guideline: 'Il mondo è salvo ma per sempre mutato: celebrazione, memoria dei caduti e nuovo inizio.', order: 2 }
        ]
      }
    ]
  },
  {
    id: 'dnd_campaign',
    name: 'Arco di Campagna D&D (Tier 1-4, Livelli 1-20)',
    description: 'Struttura epica completa in 4 Tier: da Eroi Locali di borgo a Campioni del Multiverso.',
    category: 'dnd',
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
    name: 'Dungeon a 5 Stanze (Johnn Four)',
    description: 'Il leggendario schema per creare dungeon dinamici ed equilibrati: Guardiani, Puzzle, Twist, Boss Fight e Ricompensa.',
    category: 'dnd',
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
    description: 'Struttura perfetta per sessioni singole o introduttive: Incidente iniziale, Viaggio e Climax con Boss.',
    category: 'dnd',
    createActs: () => [
      {
        id: 'act-os-1',
        title: "Fase 1: L'Aggancio (Hook) & Partenza",
        subtitle: "Minuti 0-45: Ingaggio rapido e avvio dell'azione",
        beats: [{ id: 'os-1', actId: 'act-os-1', title: "1. Incidente d'Apertura & Richiesta d'Aiuto", description: '', guideline: 'La sessione parte in medias res con una minaccia immediata o un NPC disperato.', order: 0 }]
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
    id: 'dnd_sandbox',
    name: 'Campagna Sandbox & Hexcrawl (Esplorazione Libera)',
    description: 'Struttura aperta stile West Marches: Hub di partenza (locanda/borgo), bacheca taglie, esagoni selvaggi inesplorati e fazioni dinamiche.',
    category: 'dnd',
    createActs: () => [
      {
        id: 'act-sb-1',
        title: 'Atto 1: Hub di Partenza & Voci della Taverna',
        subtitle: 'Il borgo sicuro, i PNG alleati e le prime dicerie d\'avventura',
        beats: [
          { id: 'sb-1', actId: 'act-sb-1', title: '1. Il Rifugio Sicuro & I PNG Chiave', description: '', guideline: 'La locanda, il fabbro, il magistrato o la gilda che offrono riposo e rifornimenti.', order: 0 },
          { id: 'sb-2', actId: 'act-sb-1', title: '2. Bacheca Taglie & Dicerie (Rumor Mill)', description: '', guideline: '3-5 dicerie su rovine misteriose, mostri nei boschi o carovane scomparse.', order: 1 },
          { id: 'sb-3', actId: 'act-sb-1', title: '3. La Mappa Regionale Inesplorata', description: '', guideline: 'I PG scelgono liberamente quale esagono o rotta esplorare per primi.', order: 2 }
        ]
      },
      {
        id: 'act-sb-2',
        title: 'Atto 2: Esplorazione delle Terre Selvagge (Wilderness)',
        subtitle: 'Sopravvivenza, incontri casuali e scoperta di siti dimenticati',
        beats: [
          { id: 'sb-4', actId: 'act-sb-2', title: '4. Pericoli Ambientali & Sopravvivenza', description: '', guideline: 'Gestione delle razioni, guadi insidiosi o tempeste magiche.', order: 0 },
          { id: 'sb-5', actId: 'act-sb-2', title: '5. Incontri Casuali & Pattuglie Territoriali', description: '', guideline: 'Predatori selvaggi, predoni o viandanti con informazioni cruciali.', order: 1 },
          { id: 'sb-6', actId: 'act-sb-2', title: '6. Scoperta di un Punto d\'Interesse', description: '', guideline: 'Un tempio crollato, una miniera abbandonata o una tomba antica.', order: 2 }
        ]
      },
      {
        id: 'act-sb-3',
        title: 'Atto 3: Il Megadungeon / Minaccia Regionale',
        subtitle: 'La spedizione nel cuore del pericolo scoperto durante i viaggi',
        beats: [
          { id: 'sb-7', actId: 'act-sb-3', title: '7. Discesa nel Complesso Sotterraneo', description: '', guideline: 'Mappe a più livelli con ecologia sotterranea, trappole e segreti antichi.', order: 0 },
          { id: 'sb-8', actId: 'act-sb-3', title: '8. Scontro col Guardiano & Bottino Leggendario', description: '', guideline: 'Il signore del dungeon e gli oggetti magici che cambiano il destino del party.', order: 1 }
        ]
      },
      {
        id: 'act-sb-4',
        title: 'Atto 4: Fazioni in Movimento & Frontiera Espansa',
        subtitle: 'Le conseguenze delle scelte del party sul territorio circostante',
        beats: [
          { id: 'sb-9', actId: 'act-sb-4', title: '9. Le Fazioni Reagiscono alle Gesta del Party', description: '', guideline: 'Gilde e lord locali prendono posizione; i territori liberati fioriscono o attraggono nuovi pericoli.', order: 0 },
          { id: 'sb-10', actId: 'act-sb-4', title: '10. Fondazione Roccaforte o Nuova Mappa', description: '', guideline: 'I PG stabiliscono un avamposto o sbloccano terre ancora più remote.', order: 1 }
        ]
      }
    ]
  },
  {
    id: 'dnd_bbeg',
    name: 'Arco della Minaccia del BBEG (Escalation del Cattivo)',
    description: 'Struttura a Fronti di Pericolo basata sui piani del Big Bad Evil Guy: presagi, complotti che avanzano e resa dei conti apocalittica.',
    category: 'dnd',
    createActs: () => [
      {
        id: 'act-bb-1',
        title: 'Fase 1: Presagi Oscuri & I Cultisti della Trama',
        subtitle: 'I servi del cattivo agiscono nell\'ombra; primi indizi della cospirazione',
        beats: [
          { id: 'bb-1', actId: 'act-bb-1', title: '1. Segnali Insoliti & Creature Fuori Controllo', description: '', guideline: 'Anomalie magiche, rapimenti inspiegabili o simboli esoterici lasciati sui luoghi dei crimini.', order: 0 },
          { id: 'bb-2', actId: 'act-bb-1', title: '2. Intercettazione della Cellula Minore', description: '', guideline: 'I PG sgominano i mercenari o cultisti e scoprono l\'esistenza di un mandante oscuro (BBEG).', order: 1 }
        ]
      },
      {
        id: 'act-bb-2',
        title: 'Fase 2: Il Piano Avanza (Grim Portents)',
        subtitle: 'Il nemico compie i primi passi del suo empio disegno; la posta in gioco si alza',
        beats: [
          { id: 'bb-3', actId: 'act-bb-2', title: '3. Furto dell\'Artefatto o Conquista Strategica', description: '', guideline: 'Il cattivo ottiene una risorsa chiave prima che i PG possano fermarlo.', order: 0 },
          { id: 'bb-4', actId: 'act-bb-2', title: '4. Scontro col Luogotenente del BBEG', description: '', guideline: 'Battaglia contro il braccio destro del nemico per ottenere informazioni vitali.', order: 1 },
          { id: 'bb-5', actId: 'act-bb-2', title: '5. Dilemma Morale o Corsa Contro il Tempo', description: '', guideline: 'Salvare degli innocenti o impedire che il BBEG raggiunga il suo prossimo obiettivo.', order: 2 }
        ]
      },
      {
        id: 'act-bb-3',
        title: 'Fase 3: Il Cataclisma ha Inizio',
        subtitle: 'Il rituale è scattato o l\'armata del male assedia le terre libere',
        beats: [
          { id: 'bb-6', actId: 'act-bb-3', title: '6. Il Reame Sotto Assedio', description: '', guideline: 'Città in fiamme, cielo oscurato o fessure planari che si spalancano.', order: 0 },
          { id: 'bb-7', actId: 'act-bb-3', title: '7. La Corsa per la Debolezza Arcana del BBEG', description: '', guideline: 'Spedizione disperata per trovare l\'unico incantesimo, reliquia o punto debole del boss.', order: 1 }
        ]
      },
      {
        id: 'act-bb-4',
        title: 'Fase 4: La Resa dei Conti Finale (Showdown)',
        subtitle: 'Infiltrazione nella roccaforte maledetta e duello leggendario',
        beats: [
          { id: 'bb-8', actId: 'act-bb-4', title: '8. Assalto al Sanctum Sanctorum', description: '', guideline: 'Superamento delle difese supreme e delle guardie scelte del castello nemico.', order: 0 },
          { id: 'bb-9', actId: 'act-bb-4', title: '9. Duello Epico Multistadio col BBEG', description: '', guideline: 'Scontro leggendario in più fasi, trasformazioni e poteri cataclismatici.', order: 1 },
          { id: 'bb-10', actId: 'act-bb-4', title: '10. Salvezza del Mondo o Nuovo Ordine', description: '', guideline: 'Le conseguenze cosmiche della vittoria e l\'eredità lasciata dal party.', order: 2 }
        ]
      }
    ]
  },
  {
    id: 'dnd_urban_intrigue',
    name: 'Intrigo Urbano & Guerra di Fazioni (Cospirazioni & Gilde)',
    description: 'Campagna incentrata sulla politica cittadina, crimine organizzato, balli aristocratici, gilde di ladri e colpi di stato.',
    category: 'dnd',
    createActs: () => [
      {
        id: 'act-ui-1',
        title: 'Fase 1: Benvenuti nella Metropoli & La Scintilla',
        subtitle: 'La città tentacolare e l\'evento che rompe la fragile pace tra le fazioni',
        beats: [
          { id: 'ui-1', actId: 'act-ui-1', title: '1. Arrivo nella Metropoli & Tensioni Sociali', description: '', guideline: 'La guardia cittadina severa, i mendicanti, i mercanti e le casate nobiliari.', order: 0 },
          { id: 'ui-2', actId: 'act-ui-1', title: '2. Il Delitto Eccellente o Furto di Stato', description: '', guideline: 'Un omicidio politico o il furto dei sigilli ducali innesca il caos.', order: 1 }
        ]
      },
      {
        id: 'act-ui-2',
        title: 'Fase 2: Ragnatela di Gilde & Informatori',
        subtitle: 'Indagini tra bassifondi, covi di contrabbandieri e salotti della nobiltà',
        beats: [
          { id: 'ui-3', actId: 'act-ui-2', title: '3. Discesa nelle Fogne / Gilda dei Ladri', description: '', guideline: 'Contrattazioni con il boss malavitoso, pedinamenti e ricettatori.', order: 0 },
          { id: 'ui-4', actId: 'act-ui-2', title: '4. Il Gran Ballo in Maschera / Salotti Nobili', description: '', guideline: 'Infiltrazione mondana per origliare segreti tra senatori, patrizi e spie.', order: 1 },
          { id: 'ui-5', actId: 'act-ui-2', title: '5. Il Doppio Gioco & Tradimento Inatteso', description: '', guideline: 'Il patrono che ha ingaggiato i PG si rivela complice o vittima designata.', order: 2 }
        ]
      },
      {
        id: 'act-ui-3',
        title: 'Fase 3: La Città sull\'Orlo della Guerra Civile',
        subtitle: 'Le fazioni scendono in strada; congiura per rovesciare il governo',
        beats: [
          { id: 'ui-6', actId: 'act-ui-3', title: '6. Rivolta nelle Strade & Mercenari Fuori Controllo', description: '', guideline: 'Barricate nei quartieri, incendi dolosi e magistrati corrotti.', order: 0 },
          { id: 'ui-7', actId: 'act-ui-3', title: '7. Corsa Contro il Colpo di Stato', description: '', guideline: 'I PG scoprono il piano per avvelenare il consiglio durante la parata solenne.', order: 1 }
        ]
      },
      {
        id: 'act-ui-4',
        title: 'Fase 4: Resa dei Conti nei Palazzi del Potere',
        subtitle: 'Inseguimento all\'ultimo respiro e smascheramento dei cospiratori',
        beats: [
          { id: 'ui-8', actId: 'act-ui-4', title: '8. Duello sui Tetti & Corsa alle Prove Chiave', description: '', guideline: 'Inseguimento acrobatico sopra i tetti o nelle cripte del parlamento.', order: 0 },
          { id: 'ui-9', actId: 'act-ui-4', title: '9. Giudizio Finale & Nuovo Equilibrio Cittadino', description: '', guideline: 'I cospiratori vengono smascherati pubblicamente e il party riceve titoli o onori.', order: 1 }
        ]
      }
    ]
  },
  {
    id: 'custom',
    name: 'Struttura Libera & Personalizzata',
    description: 'Inizia con un foglio completamente vuoto e costruisci la tua struttura da zero.',
    category: 'all',
    createActs: () => [
      {
        id: 'act-custom-1',
        title: 'Fase 1',
        subtitle: 'Descrizione della prima parte della tua avventura o storia',
        beats: [
          { id: 'beat-custom-1', actId: 'act-custom-1', title: 'Punto di Svolta 1', description: '', guideline: 'Descrivi cosa accade in questo momento...', order: 0 }
        ]
      }
    ]
  }
];
