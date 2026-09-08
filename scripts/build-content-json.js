const fs = require('fs');
const path = require('path');

const dataDir = path.resolve(__dirname, '../website/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const content = {
  meta: {
    title: "Folia — Suite di Scrittura, Worldbuilding & Narrazione",
    description: "Folia è l'ambiente di scrittura desktop per romanzieri, autori fantasy e Game Master. Formato romanzo 14x21, cartelle da 1800 battute, worldbuilding, mappe con pin e schede D&D 5e. 100% Locale e attualmente gratuito."
  },
  nav: {
    brand_name: "Folia",
    link_niches: "Per chi è",
    link_app: "Applicazione",
    link_features: "Funzionalità",
    link_privacy: "Local-first",
    link_support: "Sostieni",
    link_download: "Download",
    link_faq: "FAQ",
    btn_kofi: "Ko-fi",
    btn_download: "Scarica"
  },
  hero: {
    title: "L'ambiente di scrittura per chi <em>dà vita a nuove storie</em>.",
    desc: "Dalla prima scintilla d'ispirazione all'ultima pagina impaginata. Folia combina un editor conforme alle <strong>norme editoriali</strong> (cartelle da 1800 battute, formato romanzo 14x21, caporali e sillabazione) con strumenti di worldbuilding, <strong>mappe geografiche con pin</strong>, outliner con oltre 18 strutture narrative e supporto per schede personaggi e mostri D&amp;D. Attualmente scaricabile gratuitamente, salvato in locale sul tuo computer, senza cloud obbligatori né costi nascosti.",
    cta_download: "Scarica gratis per Windows (v1.0.1)",
    cta_kofi: "Sostieni su Ko-fi ↗",
    badge_offline: "100% Offline & Privato",
    badge_cartelle: "Cartelle editoriali 1800 battute",
    badge_maps: "Mappe geografiche con pin",
    badge_free: "Attualmente gratuito"
  },
  niches: {
    section_label: "Fatto su misura",
    title: "Progettato per le reali esigenze di chi narra.",
    subtitle: "Gli elaboratori di testo generici ignorano le peculiarità del mondo letterario e ludico. Seleziona la tua area di scrittura per scoprire gli strumenti creati per te.",
    tabs: {
      novel: "Romanzieri & Autori",
      fantasy: "Fantasy & Worldbuilding",
      ttrpg: "Game Master & GDR (D&D 5e)",
      thriller: "Gialli, Thriller & Sceneggiatura",
      indie: "Self-Publisher & Indipendenti"
    },
    novel: {
      badge: "Romanzieri Tradizionali & Narrativa",
      title: "Dalla prima bozza alla consegna a case editrici, agenzie e concorsi letterari.",
      subtitle: "Tutto ciò che serve per impaginare e revisionare secondo i rigidi standard dell'editoria italiana."
    },
    fantasy: {
      badge: "Fantasy & Worldbuilding",
      title: "Costruisci universi complessi senza smarrire nessun dettaglio tra centinaia di fogli sparsi.",
      subtitle: "Il raccordo organico tra la geografia, le fazioni, la magia e i capitoli del tuo manoscritto."
    },
    ttrpg: {
      badge: "Game Master & Giochi di Ruolo (D&D 5e / TTRPG)",
      title: "Prepara e gestisci le tue campagne con la precisione di un manuale ufficiale.",
      subtitle: "Niente più decine di schede cartacee sparse: le statistiche di eroi e boss vivono accanto ai tuoi appunti di sessione."
    },
    thriller: {
      badge: "Gialli, Thriller & Sceneggiatura",
      title: "Incastra indizi, moventi e colpi di scena con rigore millimetrico.",
      subtitle: "Quando ogni dettaglio deve tornare, la visualizzazione a schede e l'outliner a beat diventano indispensabili."
    },
    indie: {
      badge: "Self-Publisher & Autori Indipendenti",
      title: "Piena autonomia creativa, zero costi ricorrenti e massima velocità di pubblicazione.",
      subtitle: "Costruito per chi cura l'intero ciclo del libro: dall'idea iniziale alla pubblicazione su Amazon KDP e store digitali."
    }
  },
  preview: {
    section_label: "L'Interfaccia Autentica",
    title: "Niente distrazioni. Ogni strumento al posto giusto.",
    subtitle: "Naviga la barra laterale di Folia per esplorare le sezioni reali dell'applicazione: editor tipografico, schede personaggio con strip D&D 5e, mappe con pin georeferenziati, bacheca corkboard e outliner strutturale.",
    project_title: "Cronache dell'Ombra",
    save_status: "Salvato",
    metrics: "14.850 parole • 8,2 cartelle • 59m lettura"
  },
  features: {
    section_label: "Panoramica Completa",
    title: "Tutto ciò che serve per dare forma a un'opera completa.",
    subtitle: "Dalla primissima bozza all'impaginazione finale, senza dover passare per cinque programmi diversi.",
    f1_title: "Norme Editoriali & Tipografia Italiana",
    f1_desc: "Cartelle editoriali da 1.800 battute calcolate in tempo reale. Formato romanzo 14x21 cm, caporali (« »), em-dash (—), rientro prima riga e sillabazione conforme agli standard delle case editrici italiane.",
    f2_title: "Bibbia di Worldbuilding & Lore",
    f2_desc: "Organizza in categorie ordinate luoghi, fazioni, sistemi magici, religioni ed ere storiche. Il testo del tuo manoscritto si collega automaticamente alle schede di lore con comode anteprime al passaggio del mouse.",
    f3_title: "Schede Personaggi & D&D 5e",
    f3_desc: "Dalla psicologia profonda (bisogno, obiettivo, difetto fatale) alle schede statistiche complete per D&D 5e e statblock dei mostri per i Game Master: caratteristiche, CA, PF, slot incantesimi e attacchi.",
    f4_title: "Outliner con 18+ Modelli di Trama",
    f4_desc: "Save the Cat!, Story Circle di Dan Harmon, Mystery Beats, Viaggio dell'Eroe, Snowflake Method, Five Room Dungeon e molti altri. Struttura ogni beat con conteggio parole raccomandato e note di svolta.",
    f5_title: "Bacheca Visiva Corkboard & Note",
    f5_desc: "Visualizza i capitoli come schede su un pannello di sughero. Assegna stati di avanzamento (Bozza, In stesura, Da rivedere, Completato) con codici colore e riorganizza la sequenza degli eventi trascinando le card.",
    f6_title: "Metriche, Focus & Esportazione",
    f6_desc: "Monitora le sessioni di scrittura, fissa obiettivi giornalieri con barre di progresso discrete e stima i minuti di lettura. Esporta poi l'opera finita in DOCX Word formattato, PDF per la stampa, Markdown o testo semplice."
  },
  privacy: {
    section_label: "Privacy & Architettura",
    title: "Le tue storie appartengono solo a te. Senza eccezioni.",
    desc: "Oggi molti software costringono gli autori a caricare i propri testi su server remoti, a sottoscrivere abbonamenti a vita o a rischiare che i propri manoscritti vengano scandagliati da algoritmi di intelligenza artificiale. Con Folia i file di progetto (.folia) risiedono unicamente sul tuo disco rigido: zero tracciamento, zero cloud obbligatorio, 100% di proprietà intellettuale protetta.",
    bullet1: "Funzionamento 100% offline, ovunque ti trovi",
    bullet2: "Nessun canone mensile obbligatorio",
    bullet3: "Nessuna IA addestrata sulle tue creazioni letterarie",
    file_spec: "Formato Aperto: File .folia archiviati in locale sul tuo computer"
  },
  support: {
    section_label: "Sviluppo Indipendente",
    title: "Un progetto indipendente, nato dalla passione per la narrazione.",
    quote: "Ho creato Folia perché sentivo la mancanza di uno strumento che unisse il rigore tipografico necessario a noi autori alla ricchezza di worldbuilding di cui hanno bisogno romanzieri fantasy, saggisti, giallisti e Game Master, senza costringere nessuno a pagare abbonamenti mensili per continuare ad accedere ai propri testi. Folia è attualmente gratuito da scaricare e utilizzare. Se il programma ti aiuta a scrivere il tuo romanzo, a preparare le tue sessioni di gioco o vuoi sostenere lo sviluppo delle prossime versioni, puoi offrirmi un caffè su Ko-fi: ogni piccolo contributo è una spinta enorme!",
    author_name: "Marco Tamborrino",
    author_role: "Autore & Sviluppatore di Folia",
    cta_kofi: "Supporta Marco su Ko-fi (ko-fi.com/marcotamby) ↗"
  },
  download: {
    section_label: "Centro Download",
    title: "Scarica Folia per Windows",
    subtitle: "Disponibile al momento per sistemi Windows (64-bit). Gratuito in questa fase di sviluppo e perfezionamento.",
    card_title: "Folia 1.0.1 per Windows",
    card_meta: "Pacchetto Setup Ufficiale (.exe) • 64-bit",
    spec1: "Installer Setup guidato (.exe) con installazione rapida",
    spec2: "Piena compatibilità con Windows 10 e Windows 11 (x64)",
    spec3: "Associazione file automatica con i progetti .folia",
    spec4: "100% offline, archiviazione locale su disco e massima privacy",
    cta_download: "Scarica Folia per Windows (Setup .exe)",
    note_security: "Download diretto • Nessun account o abbonamento richiesto",
    note_bottom: "Folia è attualmente in sviluppo e perfezionamento continuo. Puoi già scaricare e testare l'installer per Windows, oppure sostenere il progetto con una libera donazione su Ko-fi per aiutarmi a dedicare sempre più tempo alla cura di Folia!"
  },
  faq: {
    section_label: "Domande Frequenti",
    title: "Tutto quello che c'è da sapere su Folia.",
    items: [
      {
        q: "Folia è gratuito?",
        a: "Sì, attualmente Folia è completamente gratuito da scaricare e utilizzare. Non ci sono canoni mensili né funzioni bloccate dietro paywall. Chi lo desidera può sostenere il progetto e il tempo dedicato allo sviluppo tramite una donazione libera su Ko-fi."
      },
      {
        q: "Perché è così importante il calcolo delle \"Cartelle Editoriali da 1800 battute\"?",
        a: "In Italia, l'editoria professionale (case editrici, concorsi, agenzie letterarie, traduttori ed editor) misura la lunghezza di un testo in \"cartelle editoriali standard\" (30 righe per 60 battute per riga = 1.800 battute spazi inclusi). I normali elaboratori di testo calcolano solo parole o pagine generiche; Folia calcola esattamente il numero di cartelle editoriali in tempo reale."
      },
      {
        q: "Dove vengono salvati i miei testi e i dati del mio mondo?",
        a: "Tutti i tuoi progetti vengono salvati in locale sul disco rigido del tuo computer come singoli file con estensione .folia. Puoi salvarli nella tua cartella Documenti, su una chiavetta USB o sincronizzarli autonomamente con il tuo servizio cloud preferito (Dropbox, Google Drive, OneDrive, Nextcloud)."
      },
      {
        q: "Folia funziona completamente offline?",
        a: "Sì, al 100%. Folia non richiede alcuna connessione internet per aprirsi, scrivere, salvare o esportare i tuoi testi. Puoi portarlo in treno, in baita o in qualunque luogo privo di rete."
      },
      {
        q: "Come funzionano le schede personaggio D&D 5e?",
        a: "In Folia puoi arricchire la scheda di qualsiasi personaggio con statistiche complete da gioco di ruolo (punteggi di caratteristica FOR, DES, COS, INT, SAG, CAR, modificatori, CA, PF, armi, incantesimi e dadi vita), oltre a poter creare schede per Boss e Mostri con Grado di Sfida (CR) e azioni leggendarie. È l'ideale per chi scrive fantasy con radici nei GDR o per Game Master che preparano le loro avventure."
      },
      {
        q: "In quali formati posso esportare il mio romanzo?",
        a: "Puoi esportare in formato Microsoft Word (.docx) con stili editoriali corretti e note a piè di pagina native, in PDF impaginato pronto per la stampa o la condivisione, in formato Markdown (.md) e in testo semplice (.txt)."
      },
      {
        q: "Quali sono i requisiti di sistema per Windows?",
        a: "Folia è compatibile con Windows 10 e Windows 11 a 64 bit. È un'applicazione Electron ottimizzata, leggera e veloce nell'avvio."
      },
      {
        q: "Come posso sostenere lo sviluppo di Folia?",
        a: "Puoi sostenere il progetto offrendo un caffè o una donazione libera tramite la pagina ufficiale di Ko-fi di Marco Tamborrino. Ogni contributo aiuta a dedicare tempo allo sviluppo e all'introduzione di nuove funzionalità."
      }
    ]
  },
  footer: {
    brand_desc: "La suite desktop per la scrittura di romanzi, il worldbuilding approfondito e le campagne di gioco di ruolo. Local-first, indipendente e attualmente gratuita.",
    link_github: "GitHub",
    copyright: "© 2026 Folia. Creato con passione da Marco Tamborrino. Tutti i diritti riservati."
  }
};

fs.writeFileSync(path.join(dataDir, 'content.json'), JSON.stringify(content, null, 2), 'utf-8');
console.log('content.json created successfully at:', path.join(dataDir, 'content.json'));
