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
VALUES ('hero.desc', 'hero', 'html', 'Dalla prima scintilla d''ispirazione all''ultima pagina impaginata. Folia combina un editor conforme alle <strong>norme editoriali</strong> (cartelle da 1800 battute, formato romanzo 14x21, caporali e sillabazione) con strumenti di worldbuilding, <strong>mappe geografiche con pin</strong>, outliner con oltre 18 strutture narrative e supporto per schede personaggi e mostri D&amp;D. Attualmente scaricabile gratuitamente, salvato in locale sul tuo computer, senza cloud obbligatori né costi nascosti.', 'Testo per hero.desc')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('hero.cta_download', 'hero', 'text', 'Scarica gratis per Windows (v1.0.1)', 'Testo per hero.cta_download')
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
VALUES ('niches.section_label', 'niches', 'text', 'Fatto su misura', 'Testo per niches.section_label')
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
VALUES ('features.f1_desc', 'features', 'text', 'Cartelle editoriali da 1.800 battute calcolate in tempo reale. Formato romanzo 14x21 cm, caporali (« »), em-dash (—), rientro prima riga e sillabazione conforme agli standard delle case editrici italiane.', 'Testo per features.f1_desc')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f2_title', 'features', 'text', 'Personaggi & Schede D&D 5e', 'Testo per features.f2_title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f2_desc', 'features', 'text', 'Organizza in categorie ordinate luoghi, fazioni, sistemi magici, religioni ed ere storiche. Il testo del tuo manoscritto si collega automaticamente alle schede di lore con comode anteprime al passaggio del mouse.', 'Testo per features.f2_desc')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f3_title', 'features', 'text', 'Worldbuilding & Mappe con Pin', 'Testo per features.f3_title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f3_desc', 'features', 'text', 'Dalla psicologia profonda (bisogno, obiettivo, difetto fatale) alle schede statistiche complete per D&D 5e e statblock dei mostri per i Game Master: caratteristiche, CA, PF, slot incantesimi e attacchi.', 'Testo per features.f3_desc')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f4_title', 'features', 'text', 'Outliner & 18+ Modelli di Trama', 'Testo per features.f4_title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f4_desc', 'features', 'text', 'Save the Cat!, Story Circle di Dan Harmon, Mystery Beats, Viaggio dell''Eroe, Snowflake Method, Five Room Dungeon e molti altri. Struttura ogni beat con conteggio parole raccomandato e note di svolta.', 'Testo per features.f4_desc')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f5_title', 'features', 'text', 'Corkboard, Idee & Ricerca', 'Testo per features.f5_title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f5_desc', 'features', 'text', 'Visualizza i capitoli come schede su un pannello di sughero. Assegna stati di avanzamento (Bozza, In stesura, Da rivedere, Completato) con codici colore e riorganizza la sequenza degli eventi trascinando le card.', 'Testo per features.f5_desc')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f6_title', 'features', 'text', 'Metriche, Focus & Esportazione', 'Testo per features.f6_title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('features.f6_desc', 'features', 'text', 'Monitora le sessioni di scrittura, fissa obiettivi giornalieri con barre di progresso discrete e stima i minuti di lettura. Esporta poi l''opera finita in DOCX Word formattato, PDF per la stampa, Markdown o testo semplice.', 'Testo per features.f6_desc')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('privacy.section_label', 'privacy', 'text', 'Local-First & Privacy', 'Testo per privacy.section_label')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('privacy.title', 'privacy', 'text', 'Le tue storie appartengono solo a te. Senza eccezioni.', 'Testo per privacy.title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('privacy.desc', 'privacy', 'text', 'Oggi molti software costringono gli autori a caricare i propri testi su server remoti, a sottoscrivere abbonamenti a vita o a rischiare che i propri manoscritti vengano scandagliati da algoritmi di intelligenza artificiale. Con Folia i file di progetto (.folia) risiedono unicamente sul tuo disco rigido: zero tracciamento, zero cloud obbligatorio, 100% di proprietà intellettuale protetta.', 'Testo per privacy.desc')
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
VALUES ('privacy.file_spec', 'privacy', 'text', 'Formato Aperto: File .folia archiviati in locale sul tuo computer', 'Testo per privacy.file_spec')
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
VALUES ('support.cta_kofi', 'support', 'text', 'Supporta Marco su Ko-fi (ko-fi.com/marcotamby) ↗', 'Testo per support.cta_kofi')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('download.section_label', 'download', 'text', 'Centro Download', 'Testo per download.section_label')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('download.title', 'download', 'text', 'Scarica Folia per Windows', 'Testo per download.title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('download.subtitle', 'download', 'text', 'Disponibile al momento per sistemi Windows (64-bit). Gratuito in questa fase di sviluppo e perfezionamento.', 'Testo per download.subtitle')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('download.card_title', 'download', 'text', 'Folia 1.0.1 per Windows', 'Testo per download.card_title')
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
VALUES ('faq.section_label', 'faq', 'text', 'Domande Frequenti', 'Testo per faq.section_label')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('faq.title', 'faq', 'text', 'Tutto quello che c''è da sapere su Folia.', 'Testo per faq.title')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('faq.items', 'faq', 'json', '[{"q":"Folia è gratuito?","a":"Sì, attualmente Folia è completamente gratuito da scaricare e utilizzare. Non ci sono canoni mensili né funzioni bloccate dietro paywall. Chi lo desidera può sostenere il progetto e il tempo dedicato allo sviluppo tramite una donazione libera su Ko-fi."},{"q":"Perché è così importante il calcolo delle \"Cartelle Editoriali da 1800 battute\"?","a":"In Italia, l''editoria professionale (case editrici, concorsi, agenzie letterarie, traduttori ed editor) misura la lunghezza di un testo in \"cartelle editoriali standard\" (30 righe per 60 battute per riga = 1.800 battute spazi inclusi). I normali elaboratori di testo calcolano solo parole o pagine generiche; Folia calcola esattamente il numero di cartelle editoriali in tempo reale."},{"q":"Dove vengono salvati i miei testi e i dati del mio mondo?","a":"Tutti i tuoi progetti vengono salvati in locale sul disco rigido del tuo computer come singoli file con estensione .folia. Puoi salvarli nella tua cartella Documenti, su una chiavetta USB o sincronizzarli autonomamente con il tuo servizio cloud preferito (Dropbox, Google Drive, OneDrive, Nextcloud)."},{"q":"Folia funziona completamente offline?","a":"Sì, al 100%. Folia non richiede alcuna connessione internet per aprirsi, scrivere, salvare o esportare i tuoi testi. Puoi portarlo in treno, in baita o in qualunque luogo privo di rete."},{"q":"Come funzionano le schede personaggio D&D 5e?","a":"In Folia puoi arricchire la scheda di qualsiasi personaggio con statistiche complete da gioco di ruolo (punteggi di caratteristica FOR, DES, COS, INT, SAG, CAR, modificatori, CA, PF, armi, incantesimi e dadi vita), oltre a poter creare schede per Boss e Mostri con Grado di Sfida (CR) e azioni leggendarie. È l''ideale per chi scrive fantasy con radici nei GDR o per Game Master che preparano le loro avventure."},{"q":"In quali formati posso esportare il mio romanzo?","a":"Puoi esportare in formato Microsoft Word (.docx) con stili editoriali corretti e note a piè di pagina native, in PDF impaginato pronto per la stampa o la condivisione, in formato Markdown (.md) e in testo semplice (.txt)."},{"q":"Quali sono i requisiti di sistema per Windows?","a":"Folia è compatibile con Windows 10 e Windows 11 a 64 bit. È un''applicazione Electron ottimizzata, leggera e veloce nell''avvio."},{"q":"Come posso sostenere lo sviluppo di Folia?","a":"Puoi sostenere il progetto offrendo un caffè o una donazione libera tramite la pagina ufficiale di Ko-fi di Marco Tamborrino. Ogni contributo aiuta a dedicare tempo allo sviluppo e all''introduzione di nuove funzionalità."}]', 'Elenco per faq.items')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('footer.brand_desc', 'footer', 'text', 'La suite desktop per la scrittura di romanzi, il worldbuilding approfondito e le campagne di gioco di ruolo. Local-first, indipendente e attualmente gratuita.', 'Testo per footer.brand_desc')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('footer.link_github', 'footer', 'text', 'GitHub', 'Testo per footer.link_github')
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
VALUES ('downloads_count', 1482)
ON CONFLICT (stat_name) DO NOTHING;


