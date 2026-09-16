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
    name: 'Struttura classica in 3 atti',
    description: "La struttura narrativa classica dell'occidente: impostazione, sviluppo e crisi, risoluzione.",
    category: 'novel',
    createActs: () => [
      {
        id: 'act-1',
        title: 'Atto 1: impostazione e chiamata',
        subtitle: "Presentazione del mondo ordinario, del protagonista e dell'incidente scatenante",
        beats: [
          { id: 'beat-1', actId: 'act-1', title: 'Stato iniziale e mondo ordinario', description: '', guideline: 'La vita del protagonista prima che tutto cambi.', order: 0 },
          { id: 'beat-2', actId: 'act-1', title: 'Incidente scatenante', description: '', guideline: "L'evento che rompe l'equilibrio e forza l'azione.", order: 1 },
          { id: 'beat-3', actId: 'act-1', title: 'Primo punto di svolta (varco della soglia)', description: '', guideline: 'Il protagonista compie una scelta irrevocabile ed entra nel vivo della storia.', order: 2 }
        ]
      },
      {
        id: 'act-2',
        title: 'Atto 2: prove, conflitti e crisi centrale',
        subtitle: 'Ostacoli crescenti, posta in gioco che si alza e il punto di svolta a metà storia',
        beats: [
          { id: 'beat-4', actId: 'act-2', title: 'Azione crescente e primi ostacoli', description: '', guideline: 'Il protagonista affronta le prime sfide e trova alleati/rivali.', order: 0 },
          { id: 'beat-5', actId: 'act-2', title: 'Punto centrale (midpoint)', description: '', guideline: 'Una rivelazione fondamentale o una vittoria/sconfitta che cambia la strategia.', order: 1 },
          { id: 'beat-6', actId: 'act-2', title: 'Il momento più buio (all hope is lost)', description: '', guideline: 'Sembra che ogni speranza sia perduta; il piano originale fallisce miseramente.', order: 2 }
        ]
      },
      {
        id: 'act-3',
        title: 'Atto 3: climax e risoluzione',
        subtitle: 'Il confronto decisivo e il nuovo equilibrio',
        beats: [
          { id: 'beat-7', actId: 'act-3', title: "L'ultima intuizione e riorganizzazione", description: '', guideline: 'Il protagonista capisce cosa serve davvero per vincere.', order: 0 },
          { id: 'beat-8', actId: 'act-3', title: 'Climax e confronto finale', description: '', guideline: 'La battaglia, la resa dei conti o la scelta morale suprema.', order: 1 },
          { id: 'beat-9', actId: 'act-3', title: 'Risoluzione e nuovo equilibrio', description: '', guideline: 'Le conseguenze del climax e il mondo dopo la trasformazione.', order: 2 }
        ]
      }
    ]
  },
  {
    id: 'hero_journey',
    name: "Il viaggio dell'eroe (Joseph Campbell / Vogler)",
    description: "Il celebre archetipo mitologico in 12 fasi universali, ideale per romanzi d'avventura, fantasy e crescita personale.",
    category: 'novel',
    createActs: () => [
      {
        id: 'act-hj-1',
        title: 'Fase 1: la partenza (mondo ordinario)',
        subtitle: 'Dalla vita quotidiana alla decisione di partire',
        beats: [
          { id: 'beat-hj-1', actId: 'act-hj-1', title: '1. Il mondo ordinario', description: '', guideline: "L'ambiente iniziale e i limiti del protagonista.", order: 0 },
          { id: 'beat-hj-2', actId: 'act-hj-1', title: "2. La chiamata all'avventura", description: '', guideline: "Una sfida o minaccia richiede l'intervento dell'eroe.", order: 1 },
          { id: 'beat-hj-3', actId: 'act-hj-1', title: '3. Il rifiuto della chiamata', description: '', guideline: "Dubbi, paure o doveri trattengono l'eroe.", order: 2 },
          { id: 'beat-hj-4', actId: 'act-hj-1', title: "4. L'incontro col mentore", description: '', guideline: 'Un maestro offre consigli, armi o saggezza.', order: 3 },
          { id: 'beat-hj-5', actId: 'act-hj-1', title: '5. Il varco della prima soglia', description: '', guideline: "L'ingresso definitivo nel Mondo Straordinario.", order: 4 }
        ]
      },
      {
        id: 'act-hj-2',
        title: "Fase 2: l'iniziazione (mondo straordinario)",
        subtitle: 'Prove, alleanze e la discesa nel punto più profondo',
        beats: [
          { id: 'beat-hj-6', actId: 'act-hj-2', title: '6. Prove, nemici e alleati', description: '', guideline: "L'esplorazione delle regole del nuovo mondo.", order: 0 },
          { id: 'beat-hj-7', actId: 'act-hj-2', title: '7. Avvicinamento alla caverna più recondita', description: '', guideline: 'I preparativi per la sfida centrale.', order: 1 },
          { id: 'beat-hj-8', actId: 'act-hj-2', title: '8. La prova suprema', description: '', guideline: "L'incontro con la morte o con la paura più grande.", order: 2 },
          { id: 'beat-hj-9', actId: 'act-hj-2', title: "9. La ricompensa (l'elisir o la spada)", description: '', guideline: "L'eroe conquista il tesoro, la verità o il potere.", order: 3 }
        ]
      },
      {
        id: 'act-hj-3',
        title: 'Fase 3: il ritorno e la rinascita',
        subtitle: "La via del ritorno, la prova finale e l'elisir per il mondo",
        beats: [
          { id: 'beat-hj-10', actId: 'act-hj-3', title: '10. La via del ritorno', description: '', guideline: "L'urgenza di riportare la ricompensa a casa.", order: 0 },
          { id: 'beat-hj-11', actId: 'act-hj-3', title: '11. La resurrezione', description: '', guideline: "L'ultimo e definitivo test di purificazione.", order: 1 },
          { id: 'beat-hj-12', actId: 'act-hj-3', title: "12. Ritorno con l'elisir", description: '', guideline: "L'eroe torna a casa trasformato, portando salvezza.", order: 2 }
        ]
      }
    ]
  },
  {
    id: 'save_the_cat',
    name: 'Salva il gatto! (Save the Cat! Beat Sheet)',
    description: 'La celebre griglia a 15 beat di Blake Snyder, usata nei migliori romanzi moderni e sceneggiature.',
    category: 'novel',
    createActs: () => [
      {
        id: 'act-stc-1',
        title: 'Atto 1 (0% - 25%)',
        subtitle: "Dall'immagine iniziale al salto nell'Atto 2",
        beats: [
          { id: 'stc-1', actId: 'act-stc-1', title: '1. Immagine iniziale', description: '', guideline: 'Istantanea visiva dello status quo del protagonista prima del cambiamento.', order: 0 },
          { id: 'stc-2', actId: 'act-stc-1', title: '2. Enunciazione del tema', description: '', guideline: 'Qualcuno menziona la lezione di vita che il protagonista dovrà imparare.', order: 1 },
          { id: 'stc-3', actId: 'act-stc-1', title: '3. Setup (presentazione)', description: '', guideline: 'Presentazione del mondo, dei difetti e delle relazioni del protagonista.', order: 2 },
          { id: 'stc-4', actId: 'act-stc-1', title: '4. Il catalizzatore', description: '', guideline: "L'evento di rottura che distrugge lo status quo.", order: 3 },
          { id: 'stc-5', actId: 'act-stc-1', title: '5. Dibattito ed esitazione', description: '', guideline: "Il protagonista è tentato di rifiutare o cerca un'altra via.", order: 4 },
          { id: 'stc-6', actId: 'act-stc-1', title: "6. Ingresso nell'atto 2", description: '', guideline: 'Scelta attiva e irrevocabile di iniziare il viaggio.', order: 5 }
        ]
      },
      {
        id: 'act-stc-2',
        title: 'Atto 2 (25% - 75%)',
        subtitle: 'Divertirsi con il concept, punto centrale e notte oscura',
        beats: [
          { id: 'stc-7', actId: 'act-stc-2', title: '7. Trama B (relazione / amore / amicizia)', description: '', guideline: 'Una sottotrama incentrata sulle relazioni personali o insegnamenti morali.', order: 0 },
          { id: 'stc-8', actId: 'act-stc-2', title: '8. Giochi e divertimento (fun & games)', description: '', guideline: 'La promessa della premessa: scene iconiche del genere.', order: 1 },
          { id: 'stc-9', actId: 'act-stc-2', title: '9. Midpoint (punto di metà)', description: '', guideline: 'Falsa vittoria o falsa sconfitta; la posta in gioco raddoppia.', order: 2 },
          { id: 'stc-10', actId: 'act-stc-2', title: '10. I nemici stringono il cerchio', description: '', guideline: 'Le forze antagoniste colpiscono duramente; tensioni interne al gruppo.', order: 3 },
          { id: 'stc-11', actId: 'act-stc-2', title: '11. Tutto è perduto (all is lost)', description: '', guideline: "Il momento più nero: morte simbolica o reale di una certezza.", order: 4 },
          { id: 'stc-12', actId: 'act-stc-2', title: "12. Notte oscura dell'anima", description: '', guideline: 'Il protagonista tocca il fondo e trova la vera motivazione interiore.', order: 5 }
        ]
      },
      {
        id: 'act-stc-3',
        title: 'Atto 3 (75% - 100%)',
        subtitle: 'Il piano rinnovato, il climax e la trasformazione',
        beats: [
          { id: 'stc-13', actId: 'act-stc-3', title: "13. Ingresso nell'atto 3", description: '', guideline: "Un'idea brillante per risolvere la situazione grazie alla lezione appresa.", order: 0 },
          { id: 'stc-14', actId: 'act-stc-3', title: '14. Finale / climax', description: '', guideline: 'Esecuzione del nuovo piano, confronto finale e vittoria autentica.', order: 1 },
          { id: 'stc-15', actId: 'act-stc-3', title: '15. Immagine finale', description: '', guideline: 'Specchio della prima scena che mostra la trasformazione irreversibile del protagonista.', order: 2 }
        ]
      }
    ]
  },
  {
    id: 'kishotenketsu',
    name: 'Kishōtenketsu (struttura narrativa orientale)',
    description: 'La celebre struttura in 4 fasi tipica della narrativa asiatica (Giappone/Cina): introduzione, sviluppo, colpo di scena (twist) e risoluzione senza conflitto diretto obbligatorio.',
    category: 'novel',
    createActs: () => [
      {
        id: 'act-ki-1',
        title: 'Ki (起) - Introduzione',
        subtitle: 'Presentazione dei personaggi, della situazione iniziale e del tono',
        beats: [
          { id: 'ki-1', actId: 'act-ki-1', title: '1. Introduzione del mondo e figure', description: '', guideline: 'Impostazione calma e naturale della scena quotidiana.', order: 0 }
        ]
      },
      {
        id: 'act-sho-2',
        title: 'Shō (承) - Sviluppo e prosecuzione',
        subtitle: 'Espansione naturale della situazione senza rotture brusche',
        beats: [
          { id: 'sho-1', actId: 'act-sho-2', title: '2. Approfondimento dei dettagli', description: '', guideline: 'Si segue il corso degli eventi arricchendo sfumature e relazioni.', order: 0 }
        ]
      },
      {
        id: 'act-ten-3',
        title: 'Ten (転) - La svolta imprevista (twist)',
        subtitle: 'Un elemento totalmente inaspettato o slegato viene introdotto',
        beats: [
          { id: 'ten-1', actId: 'act-ten-3', title: '3. Il colpo di scena / nuovo angolo', description: '', guideline: 'Un fatto spiazzante cambia radicalmente il significato di ciò che è accaduto prima.', order: 0 }
        ]
      },
      {
        id: 'act-ketsu-4',
        title: 'Ketsu (結) - Conclusione e sintesi',
        subtitle: 'I fili si collegano creando una sintesi armoniosa ed emozionante',
        beats: [
          { id: 'ketsu-1', actId: 'act-ketsu-4', title: '4. La riconnessione e riflessione', description: '', guideline: 'Gli eventi precedenti e la svolta trovano il loro perfetto equilibrio finale.', order: 0 }
        ]
      }
    ]
  },
  {
    id: 'dan_harmon',
    name: 'Story Circle di Dan Harmon (il cerchio delle 8 fasi)',
    description: "La versione semplificata e potentissima del viaggio dell'eroe in 8 passi, usata in Rick & Morty, Community e narrativa moderna.",
    category: 'novel',
    createActs: () => [
      {
        id: 'act-dh-1',
        title: 'Fase 1: zona di comfort e desiderio',
        subtitle: 'Passi 1 e 2: il mondo conosciuto',
        beats: [
          { id: 'dh-1', actId: 'act-dh-1', title: '1. Tu (zona di comfort)', description: '', guideline: 'Un personaggio si trova nella sua solita routine.', order: 0 },
          { id: 'dh-2', actId: 'act-dh-1', title: '2. Desiderio (bisogno / need)', description: '', guideline: 'Ma vuole qualcosa che non ha o avverte una mancanza.', order: 1 }
        ]
      },
      {
        id: 'act-dh-2',
        title: "Fase 2: ingresso nell'ignoto e adattamento",
        subtitle: 'Passi 3 e 4: il mondo sconosciuto',
        beats: [
          { id: 'dh-3', actId: 'act-dh-2', title: '3. Andare (go / la soglia)', description: '', guideline: 'Entra in una situazione sconosciuta e non familiare.', order: 0 },
          { id: 'dh-4', actId: 'act-dh-2', title: '4. Ricerca e adattamento (search)', description: '', guideline: 'Si adatta alle nuove regole e affronta ostacoli per cercare ciò che vuole.', order: 1 }
        ]
      },
      {
        id: 'act-dh-3',
        title: 'Fase 3: ottenimento e prezzo pagato',
        subtitle: 'Passi 5 e 6: la prova e le conseguenze',
        beats: [
          { id: 'dh-5', actId: 'act-dh-3', title: '5. Trovare (find / conquista)', description: '', guideline: 'Ottiene ciò che desiderava.', order: 0 },
          { id: 'dh-6', actId: 'act-dh-3', title: '6. Pagare il prezzo (take / pay)', description: '', guideline: 'Ma deve pagare un prezzo altissimo per averlo preso.', order: 1 }
        ]
      },
      {
        id: 'act-dh-4',
        title: 'Fase 4: ritorno e cambiamento',
        subtitle: 'Passi 7 e 8: ritorno a casa trasformati',
        beats: [
          { id: 'dh-7', actId: 'act-dh-4', title: '7. Ritorno (return)', description: '', guideline: 'Torna al punto di partenza nel suo mondo familiare.', order: 0 },
          { id: 'dh-8', actId: 'act-dh-4', title: '8. Cambiato (changed)', description: '', guideline: 'Avendo subito un cambiamento profondo e irreversibile.', order: 1 }
        ]
      }
    ]
  },
  {
    id: 'freytag',
    name: 'Piramide di Freytag (dramma in 5 atti)',
    description: 'La celebre architettura teatrale e romanzesca in 5 atti: esposizione, azione crescente, climax, azione calante e catastrofe/risoluzione.',
    category: 'novel',
    createActs: () => [
      {
        id: 'act-fry-1',
        title: 'Atto 1: esposizione e incidente scatenante',
        subtitle: "Presentazione del mondo, dei conflitti latenti e rottura dell'equilibrio",
        beats: [
          { id: 'fry-1', actId: 'act-fry-1', title: '1. Stato iniziale e contesto', description: '', guideline: 'Il mondo, i protagonisti, i desideri profondi e le crepe della situazione di partenza.', order: 0 },
          { id: 'fry-2', actId: 'act-fry-1', title: '2. Forza motrice (inciting incident)', description: '', guideline: "L'evento scatenante che innesca il conflitto e rende inevitabile l'azione.", order: 1 }
        ]
      },
      {
        id: 'act-fry-2',
        title: 'Atto 2: azione crescente e complicazioni (rising action)',
        subtitle: 'Una serie di ostacoli e crisi parziali aumentano costantemente la posta in gioco',
        beats: [
          { id: 'fry-3', actId: 'act-fry-2', title: '3. Primi ostacoli e reazioni', description: '', guideline: 'Il protagonista tenta soluzioni ordinarie ma le forze antagoniste resistono.', order: 0 },
          { id: 'fry-4', actId: 'act-fry-2', title: '4. Complicazione e impegno irrevocabile', description: '', guideline: 'La posta in gioco si alza e non è più possibile tornare indietro.', order: 1 }
        ]
      },
      {
        id: 'act-fry-3',
        title: 'Atto 3: il climax (punto culminante)',
        subtitle: "Il punto di non ritorno dove la fortuna dell'eroe cambia irrevocabilmente",
        beats: [
          { id: 'fry-5', actId: 'act-fry-3', title: '5. La crisi suprema e ribaltamento (peripeteia)', description: '', guideline: 'Il momento di massima tensione: la scelta fondamentale che deciderà trionfo o rovina.', order: 0 }
        ]
      },
      {
        id: 'act-fry-4',
        title: 'Atto 4: azione calante e falsa tregua (falling action)',
        subtitle: "Le conseguenze ineluttabili del climax e l'ultimo momento di speranza/sospensione",
        beats: [
          { id: 'fry-6', actId: 'act-fry-4', title: '6. Conseguenze del climax e spirale', description: '', guideline: 'Le forze messe in moto dal climax precipitano verso l\'epilogo.', order: 0 },
          { id: 'fry-7', actId: 'act-fry-4', title: '7. Momento di ultima sospensione', description: '', guideline: 'Un breve istante in cui sembra possibile una via di scampo alternativa prima della resa finale.', order: 1 }
        ]
      },
      {
        id: 'act-fry-5',
        title: 'Atto 5: risoluzione / catastrofe (dénouement)',
        subtitle: 'Lo scioglimento definitivo del dramma, la purificazione e il nuovo ordine',
        beats: [
          { id: 'fry-8', actId: 'act-fry-5', title: '8. La catastrofe / risoluzione finale', description: '', guideline: "Il destino dell'eroe si compie (tragico o trionfale) e il mistero/conflitto si estingue.", order: 0 },
          { id: 'fry-9', actId: 'act-fry-5', title: "9. Ristabilimento dell'equilibrio", description: '', guideline: 'Il mondo dopo la tempesta: riflessione morale e nuovo ordine permanente.', order: 1 }
        ]
      }
    ]
  },
  {
    id: 'fichtean',
    name: 'Curva fichteana (crisi e climax a onde)',
    description: 'Struttura dinamica a onde di tensione crescente: inizia in medias res e sviluppa una serie di crisi concatenate fino alla crisi suprema.',
    category: 'novel',
    createActs: () => [
      {
        id: 'act-fich-1',
        title: 'Fase 1: in medias res e prima crisi',
        subtitle: 'Nessuna lunga introduzione: la storia si apre nel bel mezzo del problema',
        beats: [
          { id: 'fich-1', actId: 'act-fich-1', title: '1. Apertura in piena azione', description: '', guideline: 'Il lettore viene catapultato direttamente in una situazione tesa ed urgente.', order: 0 },
          { id: 'fich-2', actId: 'act-fich-1', title: '2. Prima crisi e informazioni chiave', description: '', guideline: 'Risolvendo o fuggendo dalla prima crisi emergono i retroscena indispensabili.', order: 1 }
        ]
      },
      {
        id: 'act-fich-2',
        title: 'Fase 2: serie di crisi ed escalation (rising crises)',
        subtitle: 'Onde successive di tensione: ogni crisi è più difficile e personale della precedente',
        beats: [
          { id: 'fich-3', actId: 'act-fich-2', title: '3. Seconda crisi (ostacolo fisico / materiale)', description: '', guideline: 'Una nuova minaccia mette alla prova le risorse pratiche dei protagonisti.', order: 0 },
          { id: 'fich-4', actId: 'act-fich-2', title: '4. Respiro temporaneo e nuova complicazione', description: '', guideline: 'Breve momento di tregua in cui si rivela un problema ancora più grave.', order: 1 },
          { id: 'fich-5', actId: 'act-fich-2', title: '5. Terza crisi (tradimento o minaccia personale)', description: '', guideline: 'Il conflitto colpisce gli affetti o la fiducia del protagonista.', order: 2 },
          { id: 'fich-6', actId: 'act-fich-2', title: '6. Quarta crisi (tutto sembra perduto)', description: '', guideline: "La sconfitta parziale più pesante che spinge i personaggi sull'orlo del baratro.", order: 3 }
        ]
      },
      {
        id: 'act-fich-3',
        title: 'Fase 3: la crisi suprema (major climax)',
        subtitle: 'Tutti i fili delle crisi precedenti esplodono contemporaneamente',
        beats: [
          { id: 'fich-7', actId: 'act-fich-3', title: '7. Il confronto decisivo', description: '', guideline: 'Lo scontro inevitabile che richiede il superamento definitivo del proprio limite.', order: 0 }
        ]
      },
      {
        id: 'act-fich-4',
        title: 'Fase 4: azione discendente e risoluzione',
        subtitle: "Il ritorno alla calma e l'impatto trasformativo sul protagonista",
        beats: [
          { id: 'fich-8', actId: 'act-fich-4', title: '8. Conseguenze immediate e riconciliazione', description: '', guideline: 'Le risposte alle domande aperte e il commiato tra i personaggi.', order: 0 },
          { id: 'fich-9', actId: 'act-fich-4', title: '9. Il nuovo equilibrio raggiunto', description: '', guideline: "L'immagine finale che dimostra la trasformazione irrevocabile avvenuta.", order: 1 }
        ]
      }
    ]
  },
  {
    id: 'seven_point',
    name: 'Struttura a 7 punti (Dan Wells)',
    description: 'Metodo progressivo in 7 tappe ideale per pianificare a ritroso dal finale al punto di partenza.',
    category: 'novel',
    createActs: () => [
      {
        id: 'act-7p-1',
        title: 'Atto 1: impostazione e prima spinta',
        subtitle: 'Dallo stato iniziale al punto di non ritorno',
        beats: [
          { id: 'p7-1', actId: 'act-7p-1', title: '1. Hook (aggancio iniziale)', description: '', guideline: "Lo stato opposto rispetto al finale (es. l'eroe è debole o disilluso).", order: 0 },
          { id: 'p7-2', actId: 'act-7p-1', title: '2. Primo punto di trama (plot turn 1)', description: '', guideline: "L'evento che mette in moto la storia e spinge il protagonista all'azione.", order: 1 }
        ]
      },
      {
        id: 'act-7p-2',
        title: 'Atto 2: pressione, metà storia e sconfitta apparente',
        subtitle: 'Le forze avverse si fanno sentire',
        beats: [
          { id: 'p7-3', actId: 'act-7p-2', title: '3. Primo punto di pressione (pinch 1)', description: '', guideline: "L'antagonista mostra la sua vera forza; si alza la posta in gioco.", order: 0 },
          { id: 'p7-4', actId: 'act-7p-2', title: '4. Midpoint (passaggio da reattivo a proattivo)', description: '', guideline: "Il protagonista smette di difendersi e decide di attaccare attivamente.", order: 1 },
          { id: 'p7-5', actId: 'act-7p-2', title: '5. Secondo punto di pressione (pinch 2)', description: '', guideline: "Sembra tutto perduto; il piano fallisce e le conseguenze sono devastanti.", order: 2 }
        ]
      },
      {
        id: 'act-7p-3',
        title: 'Atto 3: risoluzione finale',
        subtitle: "L'arma finale e la vittoria",
        beats: [
          { id: 'p7-6', actId: 'act-7p-3', title: '6. Secondo punto di trama (plot turn 2)', description: '', guideline: "La rivelazione o l'arma finale che rende possibile la vittoria.", order: 0 },
          { id: 'p7-7', actId: 'act-7p-3', title: '7. Risoluzione (resolution)', description: '', guideline: 'Lo stato finale in cui il protagonista ha completato la sua evoluzione.', order: 1 }
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
        title: 'Livello 1: la premessa e i tre disastri',
        subtitle: 'La frase fondante, il paragrafo riassuntivo e i tre punti di svolta capitali',
        beats: [
          { id: 'snw-1', actId: 'act-snw-1', title: "1. La frase d'impatto (one-sentence summary)", description: '', guideline: 'Chi è il protagonista, cosa vuole, qual è il conflitto e cosa rischia.', order: 0 },
          { id: 'snw-2', actId: 'act-snw-1', title: '2. Il primo disastro (fine atto 1)', description: '', guideline: 'Il tentativo iniziale del protagonista fallisce e lo costringe a impegnarsi a fondo.', order: 1 },
          { id: 'snw-3', actId: 'act-snw-1', title: '3. Il secondo disastro (midpoint)', description: '', guideline: 'Una nuova complicazione ribalta la situazione; il protagonista passa all\'attacco.', order: 2 },
          { id: 'snw-4', actId: 'act-snw-1', title: '4. Il terzo disastro (crisi finale)', description: '', guideline: 'Il piano crolla e le circostanze sembrano disperate prima della resa dei conti.', order: 3 }
        ]
      },
      {
        id: 'act-snw-2',
        title: 'Livello 2: profili dei personaggi e motivazioni',
        subtitle: 'Gli archi evolutivi di protagonisti, alleati e antagonisti',
        beats: [
          { id: 'snw-5', actId: 'act-snw-2', title: "5. L'arco del protagonista (obiettivo, bugia e verità)", description: '', guideline: 'Cosa desidera, quale convinzione errata lo limita e quale verità deve comprendere.', order: 0 },
          { id: 'snw-6', actId: 'act-snw-2', title: "6. L'antagonista e le forze d'opposizione", description: '', guideline: 'Le motivazioni coerenti dell\'avversario e perché crede di essere nel giusto.', order: 1 },
          { id: 'snw-7', actId: 'act-snw-2', title: '7. Personaggi secondari e sottotrame chiave', description: '', guideline: 'Come le vite dei comprimari riflettono e arricchiscono il tema centrale.', order: 2 }
        ]
      },
      {
        id: 'act-snw-3',
        title: 'Livello 3: sinossi operativa a scene',
        subtitle: 'La sequenza frattale di tutte le scene divise in azione e reazione',
        beats: [
          { id: 'snw-8', actId: 'act-snw-3', title: '8. Sequenza delle scene proattive (obiettivo - conflitto - disastro)', description: '', guideline: 'Le scene in cui i personaggi agiscono e subiscono battute d\'arresto.', order: 0 },
          { id: 'snw-9', actId: 'act-snw-3', title: '9. Sequenza delle scene reattive (reazione - dilemma - decisione)', description: '', guideline: 'Le scene intime di rielaborazione emotiva e nuova pianificazione.', order: 1 }
        ]
      },
      {
        id: 'act-snw-4',
        title: 'Livello 4: climax e risoluzione frattale',
        subtitle: 'La convergenza di tutti gli archi narrativi nella stesura finale',
        beats: [
          { id: 'snw-10', actId: 'act-snw-4', title: '10. Climax corale e risoluzione dei fili', description: '', guideline: 'Tutti gli archi secondari e la trama principale giungono a compimento.', order: 0 },
          { id: 'snw-11', actId: 'act-snw-4', title: '11. Risonanza finale', description: '', guideline: 'L\'ultima nota tematica che lascia un\'impressione duratura nel lettore.', order: 1 }
        ]
      }
    ]
  },
  {
    id: 'romance_beats',
    name: "Struttura romance e romanzo d'amore",
    description: "La scansione classica degli archi d'amore: meet cute, primi battibecchi, avvicinamento, grande rottura e gran gesto.",
    category: 'novel',
    createActs: () => [
      {
        id: 'act-rom-1',
        title: "Fase 1: l'incontro e l'attrazione",
        subtitle: 'Dalla vita separata al primo incontro memorabile',
        beats: [
          { id: 'rom-1', actId: 'act-rom-1', title: '1. I due mondi separati', description: '', guideline: 'Presentazione delle vite dei due protagonisti e dei loro blocchi emotivi.', order: 0 },
          { id: 'rom-2', actId: 'act-rom-1', title: "2. L'incontro fatale (meet cute)", description: '', guideline: 'Il primo incontro: scintille, equivoci o antipatia iniziale.', order: 1 },
          { id: 'rom-3', actId: 'act-rom-1', title: '3. La vicinanza forzata', description: '', guideline: 'Un motivo esterno costringe i due a collaborare o passare del tempo insieme.', order: 2 }
        ]
      },
      {
        id: 'act-rom-2',
        title: 'Fase 2: avvicinamento e vulnerabilità',
        subtitle: 'Le barriere cadono ma i dubbi restano',
        beats: [
          { id: 'rom-4', actId: 'act-rom-2', title: '4. Il primo momento di vulnerabilità', description: '', guideline: 'Uno dei due confida un segreto o una ferita del passato.', order: 0 },
          { id: 'rom-5', actId: 'act-rom-2', title: '5. Il primo bacio / la scintilla esplicita', description: '', guideline: "L'attrazione diventa innegabile e reciproca.", order: 1 },
          { id: 'rom-6', actId: 'act-rom-2', title: '6. La grande rottura (the breakup)', description: '', guideline: 'Una bugia svelata, un malinteso o la paura di soffrire separa i due.', order: 2 }
        ]
      },
      {
        id: 'act-rom-3',
        title: 'Fase 3: il gran gesto e il lieto fine',
        subtitle: "La dichiarazione d'amore e il nuovo inizio",
        beats: [
          { id: 'rom-7', actId: 'act-rom-3', title: '7. La presa di coscienza', description: '', guideline: "Capiscono che la vita senza l'altro è insopportabile.", order: 0 },
          { id: 'rom-8', actId: 'act-rom-3', title: '8. Il gran gesto (the grand gesture)', description: '', guideline: "Dichiarazione pubblica o sacrificio personale per riconquistare l'altro.", order: 1 },
          { id: 'rom-9', actId: 'act-rom-3', title: '9. Vissero felici e contenti (HEA / HFN)', description: '', guideline: "L'unione definitiva e lo sguardo al futuro insieme.", order: 2 }
        ]
      }
    ]
  },
  {
    id: 'mystery_beats',
    name: 'Giallo e investigazione (mystery / thriller)',
    description: 'La griglia classica per romanzi investigativi: crimine, indagine, false piste, pericolo e rivelazione.',
    category: 'novel',
    createActs: () => [
      {
        id: 'act-my-1',
        title: "Fase 1: il crimine e l'enigma",
        subtitle: 'La scoperta del crimine e i primi indizi',
        beats: [
          { id: 'my-1', actId: 'act-my-1', title: "1. Il delitto / l'evento scatenante", description: '', guideline: 'La scena del crimine o la scomparsa che avvia il caso.', order: 0 },
          { id: 'my-2', actId: 'act-my-1', title: "2. L'investigatore e la chiamata", description: '', guideline: "Ingresso dell'investigatore e primi rilievi sul campo.", order: 1 },
          { id: 'my-3', actId: 'act-my-1', title: '3. La rosa dei sospettati e primi interrogatori', description: '', guideline: "Presentazione delle persone d'interesse con moventi apparenti.", order: 2 }
        ]
      },
      {
        id: 'act-my-2',
        title: 'Fase 2: false piste e complicazioni',
        subtitle: 'Depistaggi, alibi e la seconda rivelazione',
        beats: [
          { id: 'my-4', actId: 'act-my-2', title: '4. False piste (red herrings)', description: '', guideline: "Un indizio fuorviante porta l'indagine in una direzione errata.", order: 0 },
          { id: 'my-5', actId: 'act-my-2', title: '5. La svolta centrale / il secondo crimine', description: '', guideline: 'Un secondo evento scuote le certezze o un alibi crolla inaspettatamente.', order: 1 },
          { id: 'my-6', actId: 'act-my-2', title: '6. Il pericolo personale', description: '', guideline: "L'investigatore diventa il bersaglio o viene messo all'angolo.", order: 2 }
        ]
      },
      {
        id: 'act-my-3',
        title: 'Fase 3: la rivelazione e la giustizia',
        subtitle: 'La deduzione brillante e la resa dei conti',
        beats: [
          { id: 'my-7', actId: 'act-my-3', title: "7. L'indizio trascurato e il quadro completo", description: '', guideline: 'Il dettaglio apparentemente insignificante che svela il vero movente.', order: 0 },
          { id: 'my-8', actId: 'act-my-3', title: "8. La resa dei conti / l'interrogatorio finale", description: '', guideline: 'La trappola scatta e il colpevole viene smascherato.', order: 1 },
          { id: 'my-9', actId: 'act-my-3', title: '9. Epilogo e conseguenze morali', description: '', guideline: "La verità viene ristabilita e l'investigatore fa i conti con l'esperienza.", order: 2 }
        ]
      }
    ]
  },
  {
    id: 'thriller_beats',
    name: 'Struttura thriller e countdown ad alta tensione',
    description: "Pacing serrato, orologio biologico/temporale che scorre, paranoia, false piste e scontro all'ultimo secondo.",
    category: 'novel',
    createActs: () => [
      {
        id: 'act-thr-1',
        title: "Atto 1: l'innesco e l'orologio che scorre (countdown)",
        subtitle: 'La minaccia esplode e il tempo per sventarla è contato',
        beats: [
          { id: 'thr-1', actId: 'act-thr-1', title: '1. Il lampo di minaccia iniziale', description: '', guideline: 'Un delitto, un rapimento o una falla di sicurezza scuote la normalità.', order: 0 },
          { id: 'thr-2', actId: 'act-thr-1', title: '2. Il protagonista coinvolto e il timer', description: '', guideline: 'Il protagonista viene attirato nella rete e si stabilisce il limite di tempo inderogabile.', order: 1 },
          { id: 'thr-3', actId: 'act-thr-1', title: '3. Nessun aiuto esterno (isolamento)', description: '', guideline: "Le autorità non credono, sono corrotte o impossibilitate ad agire; l'eroe è solo.", order: 2 }
        ]
      },
      {
        id: 'act-thr-2',
        title: 'Atto 2: la caccia, la paranoia e il contro-attacco',
        subtitle: "Indagini sotto tiro: la caccia si fa disperata e l'antagonista anticipa ogni mossa",
        beats: [
          { id: 'thr-4', actId: 'act-thr-2', title: '4. Prima pista e conflitto diretto', description: '', guideline: 'Il protagonista ottiene un primo vantaggio, pagando un prezzo alto.', order: 0 },
          { id: 'thr-5', actId: 'act-thr-2', title: '5. La falsa pista / midpoint esplosivo', description: '', guideline: 'Ciò che sembrava la soluzione si rivela una trappola orchestrata dal vero nemico.', order: 1 },
          { id: 'thr-6', actId: 'act-thr-2', title: '6. Il protagonista diventa la preda', description: '', guideline: 'I ruoli si ribaltano: il protagonista deve fuggire e difendersi mentre indaga.', order: 2 }
        ]
      },
      {
        id: 'act-thr-3',
        title: 'Atto 3: il tradimento e il punto di rottura',
        subtitle: "L'alleato più fidato vacilla e ogni speranza sembra svanire",
        beats: [
          { id: 'thr-7', actId: 'act-thr-3', title: '7. Il tradimento inaspettato', description: '', guideline: 'Una rivelazione sconcertante fa crollare ogni certezza su chi fidarsi.', order: 0 },
          { id: 'thr-8', actId: 'act-thr-3', title: '8. Momento di buio totale e intuizione finale', description: '', guideline: 'Catturato o braccato, il protagonista scopre il punto debole nel piano del cattivo.', order: 1 }
        ]
      },
      {
        id: 'act-thr-4',
        title: 'Atto 4: countdown finale e resa dei conti',
        subtitle: "Gli ultimi minuti prima dell'esplosione o della catastrofe",
        beats: [
          { id: 'thr-9', actId: 'act-thr-4', title: '9. Corsa contro i secondi (the climax)', description: '', guideline: 'Azione frenetica per raggiungere il luogo della minaccia prima che scada il tempo.', order: 0 },
          { id: 'thr-10', actId: 'act-thr-4', title: '10. Duello finale faccia a faccia', description: '', guideline: "Confronto brutale e risolutivo con l'antagonista principale.", order: 1 },
          { id: 'thr-11', actId: 'act-thr-4', title: '11. Decompressione e sollievo', description: '', guideline: 'Il timer si ferma, il pericolo rientra e le conseguenze psicologiche emergono.', order: 2 }
        ]
      }
    ]
  },
  {
    id: 'fantasy_epic',
    name: 'Arco epico high fantasy (world, lore e guerra per il fato)',
    description: 'La grande narrazione corale fantasy: antiche profezie, la compagnia errante, regni caduti e la guerra per la salvezza del mondo.',
    category: 'novel',
    createActs: () => [
      {
        id: 'act-epi-1',
        title: "Atto 1: l'ombra sui confini e la chiamata del destino",
        subtitle: 'Dalla vita remota ai primi presagi del Male Antico che si risveglia',
        beats: [
          { id: 'epi-1', actId: 'act-epi-1', title: '1. Vita nei feudi e prime avvisaglie', description: '', guideline: 'La serenità apparente di un borgo o di un giovane ignaro del proprio retaggio.', order: 0 },
          { id: 'epi-2', actId: 'act-epi-1', title: "2. L'ombra colpisce (l'attacco inatteso)", description: '', guideline: 'Mostri antichi o un emissario oscuro distruggono la pace; fuga obbligata.', order: 1 },
          { id: 'epi-3', actId: 'act-epi-1', title: "3. Raduno dei primi alleati e il manufatto", description: '', guideline: "Incontro con una guida saggia e scoperta dell'oggetto, segreto o potere ancestrale.", order: 2 }
        ]
      },
      {
        id: 'act-epi-2',
        title: 'Atto 2: il lungo viaggio e le corti divise',
        subtitle: 'Attraversamento di regni mitici, pericoli arcani e tentativi di unire popoli rivali',
        beats: [
          { id: 'epi-4', actId: 'act-epi-2', title: '4. La compagnia si compone', description: '', guideline: 'Eroi di stirpi e culture diverse si uniscono nonostante vecchi rancori.', order: 0 },
          { id: 'epi-5', actId: 'act-epi-2', title: '5. Attraversamento delle terre proibite', description: '', guideline: 'Montagne infestate, rovine millenarie o foreste incantate mettono a dura prova il gruppo.', order: 1 },
          { id: 'epi-6', actId: 'act-epi-2', title: '6. Il consiglio dei regni (diplomazia e diffidenza)', description: '', guideline: "Re ed elfi esitano a scendere in guerra: l'orgoglio divide i popoli liberi.", order: 2 }
        ]
      },
      {
        id: 'act-epi-3',
        title: 'Atto 3: la frattura e la caduta delle difese',
        subtitle: 'La compagnia si divide, una grande roccaforte crolla e il prezzo si fa straziante',
        beats: [
          { id: 'epi-7', actId: 'act-epi-3', title: '7. La morte o scomparsa del mentore', description: '', guideline: "La figura guida cade, lasciando gli eroi soli di fronte a una responsabilità immensa.", order: 0 },
          { id: 'epi-8', actId: 'act-epi-3', title: '8. Sentieri separati (trame parallele)', description: '', guideline: "Il gruppo si divide: chi cerca l'arma sacra, chi guida un esercito disperato.", order: 1 },
          { id: 'epi-9', actId: 'act-epi-3', title: "9. L'ora più cupa: l'assedio alle mura", description: '', guideline: "L'orda nemica soverchiante sembra inarrestabile; le speranze sono al minimo storico.", order: 2 }
        ]
      },
      {
        id: 'act-epi-4',
        title: 'Atto 4: la battaglia per il fato del mondo e la nuova era',
        subtitle: 'Il compimento della profezia, la vittoria pagata col sangue e la partenza',
        beats: [
          { id: 'epi-10', actId: 'act-epi-4', title: "10. L'arrivo inaspettato dei rinforzi", description: '', guideline: "Un'antica promessa viene onorata e le forze alleate ribaltano la marea dello scontro.", order: 0 },
          { id: 'epi-11', actId: 'act-epi-4', title: '11. Il duello nel cuore delle tenebre', description: '', guideline: "Il protagonista affronta l'Entità Oscura o distrugge la fonte del suo potere.", order: 1 },
          { id: 'epi-12', actId: 'act-epi-4', title: "12. L'incoronazione, le cicatrici e la nuova era", description: '', guideline: 'Il mondo è salvo ma per sempre mutato: celebrazione, memoria dei caduti e nuovo inizio.', order: 2 }
        ]
      }
    ]
  },
  {
    id: 'dnd_campaign',
    name: 'Arco di campagna D&D (tier 1-4, livelli 1-20)',
    description: 'Struttura epica completa in 4 tier: da eroi locali di borgo a campioni del multiverso.',
    category: 'dnd',
    createActs: () => [
      {
        id: 'act-dnd-1',
        title: 'Tier 1: eroi locali (livelli 1-4)',
        subtitle: 'La formazione del party, le prime missioni locali e la scoperta della minaccia sotterranea',
        beats: [
          { id: 'dnd-1', actId: 'act-dnd-1', title: '1. Incontro iniziale e prima quest locale', description: '', guideline: 'Come si incontrano i PG e la prima avventura.', order: 0 },
          { id: 'dnd-2', actId: 'act-dnd-1', title: '2. Il primo dungeon e il segnale di pericolo', description: '', guideline: "La risoluzione della minaccia locale rivela legami con un male più grande.", order: 1 },
          { id: 'dnd-3', actId: 'act-dnd-1', title: '3. Reputazione conquistata e salto di livello', description: '', guideline: 'I PG diventano famosi nella regione e ottengono il supporto dei signori locali.', order: 2 }
        ]
      },
      {
        id: 'act-dnd-2',
        title: 'Tier 2: eroi del reame (livelli 5-10)',
        subtitle: 'La minaccia si espande a livello regionale',
        beats: [
          { id: 'dnd-4', actId: 'act-dnd-2', title: '4. Crisi politica o guerra incombente', description: '', guideline: 'Le fazioni si muovono e i PG devono scegliere alleati e sventare complotti.', order: 0 },
          { id: 'dnd-5', actId: 'act-dnd-2', title: "5. La ricerca dell'artefatto / informazione chiave", description: '', guideline: 'Spedizione in terre selvagge, rovine proibite o fortezze nemiche.', order: 1 },
          { id: 'dnd-6', actId: 'act-dnd-2', title: '6. Il generale del nemico / mid-boss', description: '', guideline: 'Scontro culminante contro il braccio destro del cattivo principale.', order: 2 }
        ]
      },
      {
        id: 'act-dnd-3',
        title: 'Tier 3: maestri del mondo (livelli 11-16)',
        subtitle: 'I PG governano roccaforti e affrontano cataclismi planetari',
        beats: [
          { id: 'dnd-7', actId: 'act-dnd-3', title: '7. Minaccia planare o risveglio antico', description: '', guideline: "Un male cosmico o un drago leggendario minaccia l'esistenza del regno.", order: 0 },
          { id: 'dnd-8', actId: 'act-dnd-3', title: '8. Viaggio astrale / alleanze sovrannaturali', description: '', guideline: 'I PG contrattano con divinità o draghi antichi per ottenere poteri supremi.', order: 1 }
        ]
      },
      {
        id: 'act-dnd-4',
        title: 'Tier 4: campioni del multiverso (livelli 17-20)',
        subtitle: "Il destino dell'intero universo si decide nella resa dei conti finale",
        beats: [
          { id: 'dnd-9', actId: 'act-dnd-4', title: "9. L'assalto alla fortezza del big bad boss (BBEG)", description: '', guideline: 'I PG usano magie di 9° livello per lo scontro supremo.', order: 0 },
          { id: 'dnd-10', actId: 'act-dnd-4', title: '10. Epilogo leggendario e ascensione del party', description: '', guideline: 'Come il mondo ricorda le gesta del party e dove si ritirano gli eroi.', order: 1 }
        ]
      }
    ]
  },
  {
    id: 'five_room_dungeon',
    name: 'Dungeon a 5 stanze (Johnn Four)',
    description: 'Il leggendario schema per creare dungeon dinamici ed equilibrati: guardiani, puzzle, twist, boss fight e ricompensa.',
    category: 'dnd',
    createActs: () => [
      {
        id: 'act-frd-1',
        title: 'Stanza 1: ingresso con guardiani',
        subtitle: 'La prima barriera che mette alla prova la determinazione e le risorse dei PG',
        beats: [{ id: 'frd-1', actId: 'act-frd-1', title: '1. Ingresso e prima sfida tattica', description: '', guideline: "Sentinelle, trappole d'allarme o mostri di ronda all'entrata.", order: 0 }]
      },
      {
        id: 'act-frd-2',
        title: 'Stanza 2: puzzle, enigma o sfida di ruolo',
        subtitle: 'Una prova che non può essere risolta solo con la spada',
        beats: [{ id: 'frd-2', actId: 'act-frd-2', title: '2. Enigma meccanico, spirito inquieto o dilemma', description: '', guideline: "I PG devono usare intelligenza, abilità sociali o incantesimi d'utilità.", order: 0 }]
      },
      {
        id: 'act-frd-3',
        title: "Stanza 3: battuta d'arresto o colpo di scena",
        subtitle: 'La situazione si complica; una rivelazione ribalta le aspettative',
        beats: [{ id: 'frd-3', actId: 'act-frd-3', title: '3. Tradimento, trappola mortale o nuova verità', description: '', guideline: "L'obiettivo non è quello che sembrava, o il nemico ha teso un agguato.", order: 0 }]
      },
      {
        id: 'act-frd-4',
        title: 'Stanza 4: scontro al vertice (boss fight)',
        subtitle: "Il climax dell'avventura con il nemico principale nella sua tana",
        beats: [{ id: 'frd-4', actId: 'act-frd-4', title: '4. La battaglia finale e ambiente interattivo', description: '', guideline: 'Boss con azioni leggendarie, trappole ambientali e terreno dinamico.', order: 0 }]
      },
      {
        id: 'act-frd-5',
        title: 'Stanza 5: ricompensa e aggancio per il futuro',
        subtitle: "Il bottino meritato e l'indizio per la prossima avventura",
        beats: [{ id: 'frd-5', actId: 'act-frd-5', title: '5. Tesoro (loot), riconoscenza e nuovo spunto di trama', description: '', guideline: 'Oggetti magici, lettere compromettenti o la chiave per un nuovo mistero.', order: 0 }]
      }
    ]
  },
  {
    id: 'dnd_oneshot',
    name: 'Avventura one-shot (sessione singola 3-4 ore)',
    description: 'Struttura perfetta per sessioni singole o introduttive: incidente iniziale, viaggio e climax con boss.',
    category: 'dnd',
    createActs: () => [
      {
        id: 'act-os-1',
        title: "Fase 1: l'aggancio (hook) e partenza",
        subtitle: "Minuti 0-45: ingaggio rapido e avvio dell'azione",
        beats: [{ id: 'os-1', actId: 'act-os-1', title: "1. Incidente d'apertura e richiesta d'aiuto", description: '', guideline: 'La sessione parte in medias res con una minaccia immediata o un NPC disperato.', order: 0 }]
      },
      {
        id: 'act-os-2',
        title: 'Fase 2: il viaggio e primo scontro',
        subtitle: 'Minuti 45-120: esplorazione e ostacoli sul cammino',
        beats: [{ id: 'os-2', actId: 'act-os-2', title: '2. Incontro lungo la strada / indizi', description: '', guideline: 'Breve combattimento o enigma per testare le capacità del party.', order: 0 }]
      },
      {
        id: 'act-os-3',
        title: 'Fase 3: il covo del pericolo e climax',
        subtitle: 'Minuti 120-210: il cuore della tana e la battaglia finale',
        beats: [
          { id: 'os-3', actId: 'act-os-3', title: '3. Infiltrazione e resa dei conti col boss', description: '', guideline: 'Tensione al massimo, risorse al limite e trionfo finale.', order: 0 },
          { id: 'os-4', actId: 'act-os-3', title: '4. Conclusione e ricompense', description: '', guideline: 'Celebrazione del party e fine della storia.', order: 1 }
        ]
      }
    ]
  },
  {
    id: 'dnd_sandbox',
    name: 'Campagna sandbox & hexcrawl (esplorazione libera)',
    description: 'Struttura aperta stile West Marches: hub di partenza (locanda/borgo), bacheca taglie, esagoni selvaggi inesplorati e fazioni dinamiche.',
    category: 'dnd',
    createActs: () => [
      {
        id: 'act-sb-1',
        title: 'Atto 1: hub di partenza e voci della taverna',
        subtitle: "Il borgo sicuro, i PNG alleati e le prime dicerie d'avventura",
        beats: [
          { id: 'sb-1', actId: 'act-sb-1', title: '1. Il rifugio sicuro e i PNG chiave', description: '', guideline: 'La locanda, il fabbro, il magistrato o la gilda che offrono riposo e rifornimenti.', order: 0 },
          { id: 'sb-2', actId: 'act-sb-1', title: '2. Bacheca taglie e dicerie (rumor mill)', description: '', guideline: '3-5 dicerie su rovine misteriose, mostri nei boschi o carovane scomparse.', order: 1 },
          { id: 'sb-3', actId: 'act-sb-1', title: '3. La mappa regionale inesplorata', description: '', guideline: 'I PG scelgono liberamente quale esagono o rotta esplorare per primi.', order: 2 }
        ]
      },
      {
        id: 'act-sb-2',
        title: 'Atto 2: esplorazione delle terre selvagge (wilderness)',
        subtitle: 'Sopravvivenza, incontri casuali e scoperta di siti dimenticati',
        beats: [
          { id: 'sb-4', actId: 'act-sb-2', title: '4. Pericoli ambientali e sopravvivenza', description: '', guideline: 'Gestione delle razioni, guadi insidiosi o tempeste magiche.', order: 0 },
          { id: 'sb-5', actId: 'act-sb-2', title: '5. Incontri casuali e pattuglie territoriali', description: '', guideline: 'Predatori selvaggi, predoni o viandanti con informazioni cruciali.', order: 1 },
          { id: 'sb-6', actId: 'act-sb-2', title: "6. Scoperta di un punto d'interesse", description: '', guideline: 'Un tempio crollato, una miniera abbandonata o una tomba antica.', order: 2 }
        ]
      },
      {
        id: 'act-sb-3',
        title: 'Atto 3: il megadungeon / minaccia regionale',
        subtitle: 'La spedizione nel cuore del pericolo scoperto durante i viaggi',
        beats: [
          { id: 'sb-7', actId: 'act-sb-3', title: '7. Discesa nel complesso sotterraneo', description: '', guideline: 'Mappe a più livelli con ecologia sotterranea, trappole e segreti antichi.', order: 0 },
          { id: 'sb-8', actId: 'act-sb-3', title: '8. Scontro col guardiano e bottino leggendario', description: '', guideline: 'Il signore del dungeon e gli oggetti magici che cambiano il destino del party.', order: 1 }
        ]
      },
      {
        id: 'act-sb-4',
        title: 'Atto 4: fazioni in movimento e frontiera espansa',
        subtitle: 'Le conseguenze delle scelte del party sul territorio circostante',
        beats: [
          { id: 'sb-9', actId: 'act-sb-4', title: '9. Le fazioni reagiscono alle gesta del party', description: '', guideline: 'Gilde e lord locali prendono posizione; i territori liberati fioriscono o attraggono nuovi pericoli.', order: 0 },
          { id: 'sb-10', actId: 'act-sb-4', title: '10. Fondazione roccaforte o nuova mappa', description: '', guideline: 'I PG stabiliscono un avamposto o sbloccano terre ancora più remote.', order: 1 }
        ]
      }
    ]
  },
  {
    id: 'dnd_bbeg',
    name: 'Arco della minaccia del BBEG (escalation del cattivo)',
    description: 'Struttura a fronti di pericolo basata sui piani del Big Bad Evil Guy: presagi, complotti che avanzano e resa dei conti apocalittica.',
    category: 'dnd',
    createActs: () => [
      {
        id: 'act-bb-1',
        title: 'Fase 1: presagi oscuri e i cultisti della trama',
        subtitle: "I servi del cattivo agiscono nell'ombra; primi indizi della cospirazione",
        beats: [
          { id: 'bb-1', actId: 'act-bb-1', title: '1. Segnali insoliti e creature fuori controllo', description: '', guideline: 'Anomalie magiche, rapimenti inspiegabili o simboli esoterici lasciati sui luoghi dei crimini.', order: 0 },
          { id: 'bb-2', actId: 'act-bb-1', title: '2. Intercettazione della cellula minore', description: '', guideline: "I PG sgominano i mercenari o cultisti e scoprono l'esistenza di un mandante oscuro (BBEG).", order: 1 }
        ]
      },
      {
        id: 'act-bb-2',
        title: 'Fase 2: il piano avanza (grim portents)',
        subtitle: 'Il nemico compie i primi passi del suo empio disegno; la posta in gioco si alza',
        beats: [
          { id: 'bb-3', actId: 'act-bb-2', title: "3. Furto dell'artefatto o conquista strategica", description: '', guideline: 'Il cattivo ottiene una risorsa chiave prima che i PG possano fermarlo.', order: 0 },
          { id: 'bb-4', actId: 'act-bb-2', title: '4. Scontro col luogotenente del BBEG', description: '', guideline: 'Battaglia contro il braccio destro del nemico per ottenere informazioni vitali.', order: 1 },
          { id: 'bb-5', actId: 'act-bb-2', title: '5. Dilemma morale o corsa contro il tempo', description: '', guideline: 'Salvare degli innocenti o impedire che il BBEG raggiunga il suo prossimo obiettivo.', order: 2 }
        ]
      },
      {
        id: 'act-bb-3',
        title: 'Fase 3: il cataclisma ha inizio',
        subtitle: "Il rituale è scattato o l'armata del male assedia le terre libere",
        beats: [
          { id: 'bb-6', actId: 'act-bb-3', title: '6. Il reame sotto assedio', description: '', guideline: 'Città in fiamme, cielo oscurato o fessure planari che si spalancano.', order: 0 },
          { id: 'bb-7', actId: 'act-bb-3', title: '7. La corsa per la debolezza arcana del BBEG', description: '', guideline: "Spedizione disperata per trovare l'unico incantesimo, reliquia o punto debole del boss.", order: 1 }
        ]
      },
      {
        id: 'act-bb-4',
        title: 'Fase 4: la resa dei conti finale (showdown)',
        subtitle: 'Infiltrazione nella roccaforte maledetta e duello leggendario',
        beats: [
          { id: 'bb-8', actId: 'act-bb-4', title: '8. Assalto al Sanctum Sanctorum', description: '', guideline: 'Superamento delle difese supreme e delle guardie scelte del castello nemico.', order: 0 },
          { id: 'bb-9', actId: 'act-bb-4', title: '9. Duello epico multistadio col BBEG', description: '', guideline: 'Scontro leggendario in più fasi, trasformazioni e poteri cataclismatici.', order: 1 },
          { id: 'bb-10', actId: 'act-bb-4', title: '10. Salvezza del mondo o nuovo ordine', description: '', guideline: "Le conseguenze cosmiche della vittoria e l'eredità lasciata dal party.", order: 2 }
        ]
      }
    ]
  },
  {
    id: 'dnd_urban_intrigue',
    name: 'Intrigo urbano e guerra di fazioni (cospirazioni e gilde)',
    description: 'Campagna incentrata sulla politica cittadina, crimine organizzato, balli aristocratici, gilde di ladri e colpi di stato.',
    category: 'dnd',
    createActs: () => [
      {
        id: 'act-ui-1',
        title: 'Fase 1: benvenuti nella metropoli e la scintilla',
        subtitle: "La città tentacolare e l'evento che rompe la fragile pace tra le fazioni",
        beats: [
          { id: 'ui-1', actId: 'act-ui-1', title: '1. Arrivo nella metropoli e tensioni sociali', description: '', guideline: 'La guardia cittadina severa, i mendicanti, i mercanti e le casate nobiliari.', order: 0 },
          { id: 'ui-2', actId: 'act-ui-1', title: '2. Il delitto eccellente o furto di stato', description: '', guideline: 'Un omicidio politico o il furto dei sigilli ducali innesca il caos.', order: 1 }
        ]
      },
      {
        id: 'act-ui-2',
        title: 'Fase 2: ragnatela di gilde e informatori',
        subtitle: 'Indagini tra bassifondi, covi di contrabbandieri e salotti della nobiltà',
        beats: [
          { id: 'ui-3', actId: 'act-ui-2', title: '3. Discesa nelle fogne / gilda dei ladri', description: '', guideline: 'Contrattazioni con il boss malavitoso, pedinamenti e ricettatori.', order: 0 },
          { id: 'ui-4', actId: 'act-ui-2', title: '4. Il gran ballo in maschera / salotti nobili', description: '', guideline: 'Infiltrazione mondana per origliare segreti tra senatori, patrizi e spie.', order: 1 },
          { id: 'ui-5', actId: 'act-ui-2', title: '5. Il doppio gioco e tradimento inatteso', description: '', guideline: 'Il patrono che ha ingaggiato i PG si rivela complice o vittima designata.', order: 2 }
        ]
      },
      {
        id: 'act-ui-3',
        title: "Fase 3: la città sull'orlo della guerra civile",
        subtitle: 'Le fazioni scendono in strada; congiura per rovesciare il governo',
        beats: [
          { id: 'ui-6', actId: 'act-ui-3', title: '6. Rivolta nelle strade e mercenari fuori controllo', description: '', guideline: 'Barricate nei quartieri, incendi dolosi e magistrati corrotti.', order: 0 },
          { id: 'ui-7', actId: 'act-ui-3', title: '7. Corsa contro il colpo di stato', description: '', guideline: 'I PG scoprono il piano per avvelenare il consiglio durante la parata solenne.', order: 1 }
        ]
      },
      {
        id: 'act-ui-4',
        title: 'Fase 4: resa dei conti nei palazzi del potere',
        subtitle: "Inseguimento all'ultimo respiro e smascheramento dei cospiratori",
        beats: [
          { id: 'ui-8', actId: 'act-ui-4', title: '8. Duello sui tetti e corsa alle prove chiave', description: '', guideline: 'Inseguimento acrobatico sopra i tetti o nelle cripte del parlamento.', order: 0 },
          { id: 'ui-9', actId: 'act-ui-4', title: '9. Giudizio finale e nuovo equilibrio cittadino', description: '', guideline: 'I cospiratori vengono smascherati pubblicamente e il party riceve titoli o onori.', order: 1 }
        ]
      }
    ]
  },
  {
    id: 'custom',
    name: 'Struttura libera e personalizzata',
    description: 'Inizia con un foglio completamente vuoto e costruisci la tua struttura da zero.',
    category: 'all',
    createActs: () => [
      {
        id: 'act-custom-1',
        title: 'Fase 1',
        subtitle: 'Descrizione della prima parte della tua avventura o storia',
        beats: [
          { id: 'beat-custom-1', actId: 'act-custom-1', title: 'Punto di svolta 1', description: '', guideline: 'Descrivi cosa accade in questo momento...', order: 0 }
        ]
      }
    ]
  }
];
