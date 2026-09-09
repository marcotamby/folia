-- ============================================================================
-- FOLIA LANDING PAGE — CMS DATABASE SCHEMA
-- Compatible with PostgreSQL, Supabase, MySQL, and SQLite.
-- Allows editing every single element of the showcase website from a database.
-- ============================================================================

CREATE TABLE IF NOT EXISTS site_contents (
  id SERIAL PRIMARY KEY,
  content_key VARCHAR(120) UNIQUE NOT NULL,
  section VARCHAR(60) NOT NULL,
  content_type VARCHAR(20) DEFAULT 'text',
  value_it TEXT NOT NULL,
  value_en TEXT,
  description VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_site_contents_key ON site_contents(content_key);
CREATE INDEX IF NOT EXISTS idx_site_contents_section ON site_contents(section);

-- ============================================================================
-- SEED DATA (Default Texts)
-- ============================================================================

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('meta.title', 'meta', 'text', 'Folia — Suite di Scrittura, Worldbuilding & Narrazione', 'Testo per meta.title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('meta.description', 'meta', 'text', 'Folia è l''ambiente di scrittura desktop per romanzieri, autori fantasy e Game Master. Formato romanzo 14x21, cartelle da 1800 battute, worldbuilding, mappe con pin e schede D&D 5e. 100% Locale e attualmente gratuito.', 'Testo per meta.description')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('nav.brand_name', 'nav', 'text', 'Folia', 'Testo per nav.brand_name')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('nav.link_niches', 'nav', 'text', 'Per chi è', 'Testo per nav.link_niches')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('nav.link_app', 'nav', 'text', 'Applicazione', 'Testo per nav.link_app')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('nav.link_features', 'nav', 'text', 'Funzionalità', 'Testo per nav.link_features')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('nav.link_privacy', 'nav', 'text', 'Local-first', 'Testo per nav.link_privacy')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('nav.link_support', 'nav', 'text', 'Sostieni', 'Testo per nav.link_support')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('nav.link_download', 'nav', 'text', 'Download', 'Testo per nav.link_download')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('nav.link_faq', 'nav', 'text', 'FAQ', 'Testo per nav.link_faq')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('nav.btn_kofi', 'nav', 'text', 'Ko-fi', 'Testo per nav.btn_kofi')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('nav.btn_download', 'nav', 'text', 'Scarica', 'Testo per nav.btn_download')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('hero.title', 'hero', 'html', 'L''ambiente di scrittura per chi <em>dà vita a nuove storie</em>.', 'Testo per hero.title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('hero.desc', 'hero', 'html', 'Dalla prima scintilla d''ispirazione fino all''ultima pagina del tuo libro. Folia combina un editor conforme alle <strong>norme editoriali</strong> (cartelle da 1800 battute, formato romanzo 14x21, caporali e sillabazione) con strumenti di worldbuilding, <strong>mappe geografiche con pin</strong>, outliner con oltre 18 strutture narrative e supporto per schede personaggi e mostri D&amp;D. Attualmente scaricabile gratuitamente, salvato in locale sul tuo computer, senza cloud obbligatori né costi nascosti.', 'Testo per hero.desc')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('hero.cta_download', 'hero', 'text', 'Scarica gratis per Windows (v1.0.3)', 'Testo per hero.cta_download')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('hero.cta_kofi', 'hero', 'text', 'Sostieni su Ko-fi ↗', 'Testo per hero.cta_kofi')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('hero.badge_offline', 'hero', 'text', '100% Offline & Privato', 'Testo per hero.badge_offline')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('hero.badge_cartelle', 'hero', 'text', 'Cartelle editoriali 1800 battute', 'Testo per hero.badge_cartelle')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('hero.badge_maps', 'hero', 'text', 'Mappe geografiche con pin', 'Testo per hero.badge_maps')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('hero.badge_free', 'hero', 'text', 'Attualmente gratuito', 'Testo per hero.badge_free')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('niches.section_label', 'niches', 'text', 'FATTO SU MISURA', 'Testo per niches.section_label')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('niches.title', 'niches', 'text', 'Progettato per le reali esigenze di chi narra.', 'Testo per niches.title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('niches.subtitle', 'niches', 'text', 'Gli elaboratori di testo generici ignorano le peculiarità del mondo letterario e ludico. Seleziona la tua area di scrittura per scoprire gli strumenti creati per te.', 'Testo per niches.subtitle')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('niches.tabs.novel', 'niches', 'text', 'Romanzieri & Autori', 'Testo per niches.tabs.novel')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('niches.tabs.fantasy', 'niches', 'text', 'Fantasy & Worldbuilding', 'Testo per niches.tabs.fantasy')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('niches.tabs.ttrpg', 'niches', 'text', 'Game Master & GDR (D&D 5e)', 'Testo per niches.tabs.ttrpg')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('niches.tabs.thriller', 'niches', 'text', 'Gialli, Thriller & Sceneggiatura', 'Testo per niches.tabs.thriller')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('niches.tabs.indie', 'niches', 'text', 'Self-Publisher & Indipendenti', 'Testo per niches.tabs.indie')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('niches.novel.badge', 'niches', 'text', 'Romanzieri Tradizionali & Narrativa', 'Testo per niches.novel.badge')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('niches.novel.title', 'niches', 'text', 'Dalla prima bozza alla consegna a case editrici, agenzie e concorsi letterari.', 'Testo per niches.novel.title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('niches.novel.subtitle', 'niches', 'text', 'Tutto ciò che serve per impaginare e revisionare secondo i rigidi standard dell''editoria italiana.', 'Testo per niches.novel.subtitle')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('niches.fantasy.badge', 'niches', 'text', 'Fantasy & Worldbuilding', 'Testo per niches.fantasy.badge')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('niches.fantasy.title', 'niches', 'text', 'Costruisci universi complessi senza smarrire nessun dettaglio tra centinaia di fogli sparsi.', 'Testo per niches.fantasy.title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('niches.fantasy.subtitle', 'niches', 'text', 'Il raccordo organico tra la geografia, le fazioni, la magia e i capitoli del tuo manoscritto.', 'Testo per niches.fantasy.subtitle')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('niches.ttrpg.badge', 'niches', 'text', 'Game Master & Giochi di Ruolo (D&D 5e / TTRPG)', 'Testo per niches.ttrpg.badge')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('niches.ttrpg.title', 'niches', 'text', 'Prepara e gestisci le tue campagne con la precisione di un manuale ufficiale.', 'Testo per niches.ttrpg.title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('niches.ttrpg.subtitle', 'niches', 'text', 'Niente più decine di schede cartacee sparse: le statistiche di eroi e boss vivono accanto ai tuoi appunti di sessione.', 'Testo per niches.ttrpg.subtitle')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('niches.thriller.badge', 'niches', 'text', 'Gialli, Thriller & Sceneggiatura', 'Testo per niches.thriller.badge')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('niches.thriller.title', 'niches', 'text', 'Incastra indizi, moventi e colpi di scena con rigore millimetrico.', 'Testo per niches.thriller.title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('niches.thriller.subtitle', 'niches', 'text', 'Quando ogni dettaglio deve tornare, la visualizzazione a schede e l''outliner a beat diventano indispensabili.', 'Testo per niches.thriller.subtitle')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('niches.indie.badge', 'niches', 'text', 'Self-Publisher & Autori Indipendenti', 'Testo per niches.indie.badge')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('niches.indie.title', 'niches', 'text', 'Piena autonomia creativa, zero costi ricorrenti e massima velocità di pubblicazione.', 'Testo per niches.indie.title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('niches.indie.subtitle', 'niches', 'text', 'Costruito per chi cura l''intero ciclo del libro: dall''idea iniziale alla pubblicazione su Amazon KDP e store digitali.', 'Testo per niches.indie.subtitle')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('preview.section_label', 'preview', 'text', 'L''Interfaccia Autentica', 'Testo per preview.section_label')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('preview.title', 'preview', 'text', 'Niente distrazioni. Ogni strumento al posto giusto.', 'Testo per preview.title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('preview.subtitle', 'preview', 'text', 'Naviga la barra laterale di Folia per esplorare le sezioni reali dell''applicazione: editor tipografico, schede personaggio con strip D&D 5e, mappe con pin georeferenziati, bacheca corkboard e outliner strutturale.', 'Testo per preview.subtitle')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('preview.project_title', 'preview', 'text', 'Cronache dell''Ombra', 'Testo per preview.project_title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('preview.save_status', 'preview', 'text', 'Salvato', 'Testo per preview.save_status')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('preview.metrics', 'preview', 'text', '14.850 parole • 8,2 cartelle • 59m lettura', 'Testo per preview.metrics')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.section_label', 'features', 'text', 'Panoramica Completa', 'Testo per features.section_label')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.title', 'features', 'text', 'Ogni strumento al suo posto, senza dispersioni.', 'Testo per features.title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.subtitle', 'features', 'text', 'Folia racchiude in un unico ambiente leggero e ordinato tutto ciò che gli scrittori solitamente sono costretti a frammentare tra tre o quattro programmi diversi.', 'Testo per features.subtitle')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f1_title', 'features', 'text', 'Editor & Norme Editoriali', 'Testo per features.f1_title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f1_desc', 'features', 'html', 'Scrivi senza impazzire con le impostazioni: hai già le <strong>cartelle editoriali da 1800 battute</strong> calcolate in tempo reale, il formato pagina identico ai libri stampati, le note a piè di pagina e i dialoghi con le virgolette giuste (« »).', 'Testo per features.f1_desc')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f1_b1', 'features', 'text', 'Commenti a margine e revisioni risolvibili', 'Testo per features.f1_b1')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f1_b2', 'features', 'text', 'Trova e sostituisci avanzato', 'Testo per features.f1_b2')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f2_title', 'features', 'text', 'Personaggi & Schede D&D', 'Testo per features.f2_title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f2_desc', 'features', 'text', 'Dai spessore a protagonisti e antagonisti: cosa vogliono, cosa temono e i loro difetti. E se giochi a D&D, trovi le schede dei personaggi e dei mostri già pronte con caratteristiche, dadi vita e incantesimi.', 'Testo per features.f2_desc')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f2_b1', 'features', 'text', 'Archetipi drammatici ed evoluzione dell''arco', 'Testo per features.f2_b1')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f2_b2', 'features', 'text', 'Supporto razze e classi homebrew personalizzate', 'Testo per features.f2_b2')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f3_title', 'features', 'text', 'Worldbuilding & Mappe con Pin', 'Testo per features.f3_title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f3_desc', 'features', 'text', 'Carica le immagini dei tuoi regni o delle tue città, piazza i segnalini sui luoghi importanti e collegali alle tue note. Mentre scrivi il manoscritto, basta passare con il mouse sul nome di un posto per rivederne i dettagli.', 'Testo per features.f3_desc')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f3_b1', 'features', 'text', 'Wiki-linking istantaneo al passaggio del mouse', 'Testo per features.f3_b1')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f3_b2', 'features', 'text', 'Zoom, pan ed esplorazione fluida della mappa', 'Testo per features.f3_b2')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f4_title', 'features', 'text', 'Metti in ordine capitoli e scene', 'Testo per features.f4_title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f4_desc', 'features', 'text', 'Non restare bloccato davanti alla pagina bianca: trovi schemi semplici da seguire (come il Viaggio dell''Eroe, la struttura del giallo o i modelli per dungeon) per organizzare l''intreccio passo dopo passo.', 'Testo per features.f4_desc')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f4_b1', 'features', 'text', 'Beat narrativi con linee guida drammaturgiche', 'Testo per features.f4_b1')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f4_b2', 'features', 'text', 'Collegamento diretto tra snodi e scene dell''editor', 'Testo per features.f4_b2')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f5_title', 'features', 'text', 'Bacheca visiva per le tue idee', 'Testo per features.f5_title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f5_desc', 'features', 'text', 'Sposta le scene come se fossero foglietti su un tavolo per trovare l''ordine perfetto. E hai sempre a portata di mano un blocco per catturare al volo battute di dialogo o intuizioni prima di dimenticarle.', 'Testo per features.f5_desc')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f5_b1', 'features', 'text', 'Etichette di colore personalizzate per POV e sottotrame', 'Testo per features.f5_b1')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f5_b2', 'features', 'text', 'Archivio note veloci sempre accessibile', 'Testo per features.f5_b2')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f6_title', 'features', 'text', 'Scrivi senza distrazioni ed esporta facile', 'Testo per features.f6_title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f6_desc', 'features', 'text', 'Attiva la modalità a tutto schermo per concentrarti solo sulle parole, fissa un obiettivo di battute al giorno e, quando hai finito, esporta il libro in Word (DOCX) pronto per gli editor o in PDF impaginato.', 'Testo per features.f6_desc')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f6_b1', 'features', 'text', 'Opzione per esportare schede e appendici del mondo', 'Testo per features.f6_b1')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f6_b2', 'features', 'text', 'Nessun lock-in: i file rimangono sul tuo PC', 'Testo per features.f6_b2')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('privacy.section_label', 'privacy', 'text', 'LOCAL-FIRST & PRIVACY', 'Testo per privacy.section_label')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('privacy.title', 'privacy', 'text', 'Le tue storie appartengono solo a te. Senza eccezioni.', 'Testo per privacy.title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('privacy.desc', 'privacy', 'html', 'Oggi molti software costringono gli autori a caricare i propri testi su server remoti, a sottoscrivere abbonamenti a vita o a rischiare che i propri manoscritti vengano scandagliati da algoritmi di intelligenza artificiale. Con Folia i file di progetto (<code>.folia</code>) risiedono unicamente sul tuo disco rigido: <strong>zero tracciamento, zero cloud obbligatorio, 100% di proprietà intellettuale protetta</strong>.', 'Testo per privacy.desc')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('privacy.bullet1', 'privacy', 'text', 'Funzionamento 100% offline, ovunque ti trovi', 'Testo per privacy.bullet1')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('privacy.bullet2', 'privacy', 'text', 'Nessun canone mensile obbligatorio', 'Testo per privacy.bullet2')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('privacy.bullet3', 'privacy', 'text', 'Nessuna IA addestrata sulle tue creazioni letterarie', 'Testo per privacy.bullet3')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('privacy.spec1', 'privacy', 'text', 'Cartella locale: Documenti/Folia/Romanzo.folia', 'Testo per privacy.spec1')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('privacy.spec2', 'privacy', 'text', 'Pacchetti scambiati via web: 0 byte (offline)', 'Testo per privacy.spec2')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('privacy.spec3', 'privacy', 'text', 'Backup automatico di sicurezza: ogni 2 minuti', 'Testo per privacy.spec3')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('privacy.spec4', 'privacy', 'text', 'Proprietà dei testi: 100% dell''Autore', 'Testo per privacy.spec4')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('support.section_label', 'support', 'text', 'Sviluppo Indipendente', 'Testo per support.section_label')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('support.title', 'support', 'text', 'Un progetto indipendente, nato dalla passione per la narrazione.', 'Testo per support.title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('support.quote', 'support', 'text', 'Ho creato Folia perché sentivo la mancanza di uno strumento che unisse il rigore tipografico necessario a noi autori alla ricchezza di worldbuilding di cui hanno bisogno romanzieri fantasy, saggisti, giallisti e Game Master, senza costringere nessuno a pagare abbonamenti mensili per continuare ad accedere ai propri testi. Folia è attualmente gratuito da scaricare e utilizzare. Se il programma ti aiuta a scrivere il tuo romanzo, a preparare le tue sessioni di gioco o vuoi sostenere lo sviluppo delle prossime versioni, puoi offrirmi un caffè su Ko-fi: ogni piccolo contributo è una spinta enorme!', 'Testo per support.quote')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('support.author_name', 'support', 'text', 'Marco Tamborrino', 'Testo per support.author_name')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('support.author_role', 'support', 'text', 'Autore & Sviluppatore di Folia', 'Testo per support.author_role')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('support.cta_kofi', 'support', 'text', 'Supporta Marco', 'Testo per support.cta_kofi')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('download.section_label', 'download', 'text', 'CENTRO DOWNLOAD', 'Testo per download.section_label')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('download.title', 'download', 'text', 'Scarica Folia per Windows', 'Testo per download.title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('download.subtitle', 'download', 'text', 'Disponibile al momento per sistemi Windows (64-bit). Gratuito in questa fase di sviluppo e perfezionamento.', 'Testo per download.subtitle')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('download.card_title', 'download', 'text', 'Folia 1.0.3 per Windows', 'Testo per download.card_title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('download.card_meta', 'download', 'text', 'Pacchetto Setup Ufficiale (.exe) • 64-bit', 'Testo per download.card_meta')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('download.spec1', 'download', 'text', 'Installer Setup guidato (.exe) con installazione rapida', 'Testo per download.spec1')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('download.spec2', 'download', 'text', 'Piena compatibilità con Windows 10 e Windows 11 (x64)', 'Testo per download.spec2')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('download.spec3', 'download', 'text', 'Associazione file automatica con i progetti .folia', 'Testo per download.spec3')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('download.spec4', 'download', 'text', '100% offline, archiviazione locale su disco e massima privacy', 'Testo per download.spec4')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('download.cta_download', 'download', 'text', 'Scarica Folia per Windows (Setup .exe)', 'Testo per download.cta_download')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('download.note_security', 'download', 'text', 'Download diretto • Nessun account o abbonamento richiesto', 'Testo per download.note_security')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('download.note_bottom', 'download', 'text', 'Folia è attualmente in sviluppo e perfezionamento continuo. Puoi già scaricare e testare l''installer per Windows, oppure sostenere il progetto con una libera donazione su Ko-fi per aiutarmi a dedicare sempre più tempo alla cura di Folia!', 'Testo per download.note_bottom')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('faq.section_label', 'faq', 'text', 'DOMANDE FREQUENTI', 'Testo per faq.section_label')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('faq.title', 'faq', 'text', 'Tutto quello che c''è da sapere su Folia.', 'Testo per faq.title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('faq.q1', 'faq', 'text', 'Folia è gratuito? Ci sono costi nascosti o limitazioni al numero di capitoli?', 'Testo per faq.q1')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('faq.a1', 'faq', 'html', 'Sì, attualmente Folia è <strong>completamente gratuito</strong> da scaricare e utilizzare sul tuo PC Windows. Non ci sono canoni mensili, non esistono limitazioni al numero di progetti, capitoli o parole scritte, e nessuna funzione essenziale è bloccata dietro paywall. Folia nasce come progetto indipendente creato da Marco Tamborrino: chi desidera sostenere il lavoro e il tempo dedicato allo sviluppo delle nuove versioni può offrire un caffè con una donazione libera su <a href="https://ko-fi.com/marcotamby" target="_blank" rel="noopener noreferrer" style="color: var(--brand-green); text-decoration: underline;">Ko-fi</a>.', 'Testo per faq.a1')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('faq.q2', 'faq', 'text', 'Perché è così importante il calcolo delle "Cartelle Editoriali da 1800 battute"?', 'Testo per faq.q2')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('faq.a2', 'faq', 'html', 'Nell''editoria italiana ed europea (case editrici, concorsi letterari, agenzie di rappresentanza, traduttori ed editor), la lunghezza effettiva di un''opera non si misura a pagine generiche né a parole (che variano per lunghezza), ma in <strong>cartelle editoriali standard</strong> (esattamente 30 righe per 60 battute a riga = 1.800 battute spazi inclusi). I normali elaboratori di testo costringono l''autore a fare calcoli a mente o a contare i caratteri con calcolatrici esterne; Folia calcola le cartelle editoriali istantaneamente e con precisione tipografica riga per riga durante la digitazione, affiancandole al conteggio delle parole e alla stima del tempo di lettura.', 'Testo per faq.a2')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('faq.q3', 'faq', 'text', 'Privacy e Local-First: dove vengono salvati i miei testi? Rischiano di finire in modelli IA?', 'Testo per faq.q3')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('faq.a3', 'faq', 'html', 'Con Folia hai la <strong>garanzia assoluta di privacy e sovranità sui tuoi testi</strong>. L''applicazione adotta l''architettura <em>Local-First</em>: ogni progetto viene salvato direttamente e unicamente sul disco rigido del tuo computer come file <code>.folia</code> (un formato aperto e leggero contenente manoscritto, schede, immagini e note). Folia funziona al 100% offline, senza bisogno di connessione a internet né di login. Nessun testo viene mai inviato a server esterni, nessuno analizza le tue bozze e i tuoi scritti non verranno <strong>mai utilizzati per addestrare modelli di intelligenza artificiale</strong>. Sei libero di salvare i tuoi file dove preferisci: su chiavetta USB, hard disk esterno o nella tua cartella cloud preferita (Dropbox, Google Drive, OneDrive, Nextcloud).', 'Testo per faq.a3')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('faq.q4', 'faq', 'text', 'Come funzionano le Mappe Geografiche Interattive e i segnaposti (pin)?', 'Testo per faq.q4')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('faq.a4', 'faq', 'html', 'Puoi importare qualsiasi immagine di mappa ad alta risoluzione: pergamene disegnate a mano, mappe geografiche o mappe create con software specializzati come <em>Inkarnate</em>, <em>Wonderdraft</em>, <em>Photoshop</em> o <em>Dungeon Alchemist</em>. Folia ti permette di navigare la mappa con zoom fluido dal 25% al 300% e pan millimetrico, posizionando <strong>segnaposti georeferenziati</strong> con icone tematiche (città, capitali, fortezze, monti, porti, templi o dungeon) e colori personalizzati. Cliccando su un pin si apre istantaneamente il pannello <em>Dettagli Luogo</em>, collegato direttamente alla scheda di worldbuilding corrispondente: una vera e propria atlante viva del tuo universo narrativo.', 'Testo per faq.a4')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('faq.q5', 'faq', 'text', 'Posso usare Folia per giocare di ruolo o fare il Game Master (D&D 5e e altri TTRPG)?', 'Testo per faq.q5')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('faq.a5', 'faq', 'html', 'Assolutamente sì! Folia include una modalità GDR nativa specificamente pensata per Master e giocatori di <strong>Dungeons &amp; Dragons 5e e giochi di ruolo da tavolo</strong>. Puoi compilare schede personaggio con tutti i parametri di gioco ufficiali: caratteristiche (FOR, DES, COS, INT, SAG, CAR), modificatori, tiri salvezza, Classe Armatura (CA), Punti Ferita (PF), dadi vita, armi, equipaggiamento e slot incantesimi. Per i Game Master, Folia supporta schede Boss e Mostri con Grado di Sfida (CR), tratti speciali e azioni leggendarie, oltre al pulsante rapido <em>Schermo Master</em> per consultare al volo le statistiche del Party durante la sessione senza sfogliare decine di fogli sparsi.', 'Testo per faq.a5')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('faq.q6', 'faq', 'text', 'Come funziona il Wiki-Interlinking automatico e i popup contestuali mentre scrivo?', 'Testo per faq.q6')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('faq.a6', 'faq', 'html', 'Mentre redigi i capitoli nell''editor, Folia indicizza automaticamente in background tutti i nomi dei tuoi personaggi, luoghi, fazioni, reliquie magiche ed eventi storici creati nel modulo di worldbuilding. Passando semplicemente con il mouse su un nome o inserendo un richiamo wiki, compare una scheda riassuntiva fluttuante che ti ricorda l''età del personaggio, il suo obiettivo, il suo difetto fatale o le coordinate geografiche di una città. Non dovrai mai più interrompere il flusso creativo per andare a cercare un dettaglio annotato cento pagine prima.', 'Testo per faq.a6')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('faq.q7', 'faq', 'text', 'In quali formati posso esportare o impaginare la mia opera (.docx, PDF, Markdown)?', 'Testo per faq.q7')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('faq.a7', 'faq', 'html', 'Folia supporta esportazioni versatili e prive di lock-in pensate per le reali necessità di pubblicazione: <strong>Microsoft Word (.docx)</strong> pronto per la revisione con editor o per l''invio alle case editrici, con formattazione dei paragrafi corretta, stili di capitolo e note a piè di pagina native; <strong>PDF impaginato</strong> nel classico formato romanzo (14x21 cm o A5) pronto per la stampa o la condivisione con i lettori beta; formato <strong>Markdown (.md)</strong> ideale per la massima interoperabilità con Obsidian, Notion e piattaforme web; e testo semplice <strong>(.txt)</strong>. Puoi anche scegliere se esportare l''intero manoscritto oppure includere appendici con l''enciclopedia del mondo e le schede dei personaggi.', 'Testo per faq.a7')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('faq.q8', 'faq', 'text', 'Quali sono le oltre 18 strutture narrative e i template di trama inclusi nell''Outliner?', 'Testo per faq.q8')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('faq.a8', 'faq', 'html', 'L''Outliner strutturale di Folia ti guida passo dopo passo attraverso i principali modelli di storytelling della letteratura e della drammaturgia mondiale. Include, tra gli altri: il <em>Viaggio dell''Eroe</em> di Campbell e Vogler, lo schema a beat <em>Save the Cat!</em> di Blake Snyder, la classica <em>Struttura in Tre Atti</em>, il <em>Cerchio delle Storie</em> di Dan Harmon, la <em>Piramide di Freytag</em>, la <em>Struttura in Sette Punti</em> di Dan Wells, il modello investigativo per Gialli e Whodunnit (con tracciamento di indizi, alibi e false piste), template per il Romance, la <em>Curva Fichteana</em> e il modello <em>5-Room Dungeon</em> per sessioni GDR. Ogni beat narrativo offre suggerimenti concreti per la stesura e si collega direttamente alle scene del manoscritto.', 'Testo per faq.a8')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('faq.q9', 'faq', 'text', 'Come funzionano le schede psicologiche dei personaggi?', 'Testo per faq.q9')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('faq.a9', 'faq', 'html', 'Le schede personaggio di Folia vanno molto oltre la semplice descrizione anagrafica o fisica: sono strutturate secondo i principi della drammaturgia moderna per creare figure tridimensionali e indimenticabili. Troverai sezioni dedicate a <strong>Obiettivo Principale</strong> (cosa desidera coscientemente il personaggio?), <strong>Bisogno Interiore</strong> (cosa deve comprendere per maturare?), <strong>Difetto Fatale e Vulnerabilità</strong> (la ferita emotiva che lo ostacola), Voce e registro linguistico, Archetipo drammatico e relazioni reciproche. Man mano che la storia evolve, puoi annotare le tappe dell''arco di trasformazione di protagonisti e antagonisti.', 'Testo per faq.a9')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('faq.q10', 'faq', 'text', 'Quali sono i requisiti di sistema per Windows e arriveranno versioni per Mac e Linux?', 'Testo per faq.q10')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('faq.a10', 'faq', 'html', 'Attualmente Folia è disponibile come pacchetto installer ufficiale (.exe a 64-bit) compatibile con <strong>Windows 10 e Windows 11</strong>. L''applicazione è estremamente reattiva, occupa poche centinaia di megabyte sul disco rigido e richiede requisiti minimi standard (4 GB di RAM e processore x64 dual-core o superiore). Le versioni native per <strong>macOS</strong> (sia Apple Silicon M1/M2/M3/M4 che processori Intel) e per <strong>Linux</strong> sono pianificate nella roadmap di sviluppo del progetto e verranno rilasciate nelle prossime iterazioni.', 'Testo per faq.a10')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('faq.q11', 'faq', 'text', 'Come posso mettermi in contatto per suggerimenti, segnalare bug o proporre nuove funzioni?', 'Testo per faq.q11')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('faq.a11', 'faq', 'html', 'Il dialogo costante con chi scrive e narra è l''anima di Folia! Puoi inviare i tuoi commenti, segnalare eventuali anomalie o suggerire nuove funzionalità direttamente attraverso il pulsante <strong>"Lascia una recensione"</strong> presente su questo sito, oppure scrivendo all''indirizzo email ufficiale <a href="mailto:info@folia-suite.com" style="color: var(--brand-green); font-weight: 600; text-decoration: underline;">info@folia-suite.com</a> o sulla pagina <a href="https://ko-fi.com/marcotamby" target="_blank" rel="noopener noreferrer" style="color: var(--brand-green); text-decoration: underline;">Ko-fi</a>. Ogni singolo messaggio viene letto e preso in considerazione per i futuri aggiornamenti!', 'Testo per faq.a11')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('footer.brand_desc', 'footer', 'text', 'La suite desktop per la scrittura di romanzi, il worldbuilding approfondito e le campagne di gioco di ruolo. Local-first, indipendente e attualmente gratuita.', 'Testo per footer.brand_desc')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('footer.link_contact', 'footer', 'text', 'info@folia-suite.com', 'Testo per footer.link_contact')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('footer.copyright', 'footer', 'text', '© 2026 Folia. Creato con passione da Marco Tamborrino. Tutti i diritti riservati.', 'Testo per footer.copyright')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR SUPABASE
-- ============================================================================
ALTER TABLE site_contents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read site_contents" ON site_contents;
CREATE POLICY "Public read site_contents" ON site_contents FOR SELECT USING (true);

DROP POLICY IF EXISTS "Full access with service_role on site_contents" ON site_contents;
CREATE POLICY "Full access with service_role on site_contents" ON site_contents FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================================
-- COMMUNITY REVIEWS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS site_reviews (
  id BIGINT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(100),
  stars INT DEFAULT 5,
  text TEXT NOT NULL,
  date VARCHAR(50) DEFAULT 'Oggi',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE site_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read site_reviews" ON site_reviews;
CREATE POLICY "Public read site_reviews" ON site_reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert site_reviews" ON site_reviews;
CREATE POLICY "Public insert site_reviews" ON site_reviews FOR INSERT WITH CHECK (true);

-- ============================================================================
-- SITE STATS TABLE (DOWNLOAD COUNTER)
-- ============================================================================
CREATE TABLE IF NOT EXISTS site_stats (
  stat_name VARCHAR(50) PRIMARY KEY,
  stat_value BIGINT NOT NULL DEFAULT 1482,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read site_stats" ON site_stats;
CREATE POLICY "Public read site_stats" ON site_stats FOR SELECT USING (true);

DROP POLICY IF EXISTS "Full access on site_stats" ON site_stats;
CREATE POLICY "Full access on site_stats" ON site_stats FOR ALL USING (true);

INSERT INTO site_stats (stat_name, stat_value)
VALUES ('downloads_count', 0)
ON CONFLICT (stat_name) DO NOTHING;
