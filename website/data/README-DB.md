# Folia — Architettura Gestione Testi e Database (CMS Ready)

Questo sistema è stato progettato affinché, quando il sito vetrina di Folia sarà pubblicato online su un server o hosting (Vercel, Netlify, VPS, Supabase, Cloudflare, ecc.), tu possa **modificare qualsiasi testo di qualsiasi sezione direttamente dal database o da un pannello di controllo**, senza dover modificare manualmente il codice HTML.

---

## 1. Come è strutturato il sistema

1. **Dizionario Chiavi (`website/data/content.json`)**:
   - Contiene la mappa gerarchica completa di tutti i testi del sito (Hero, Nicchie, Funzionalità, Privacy, Supporto, Centro Download, FAQ, Footer).
   - Esempio di chiave: `hero.title`, `hero.desc`, `download.cta_download`, `features.f1_title`.

2. **Schema del Database (`website/data/schema.sql`)**:
   - Include la tabella `site_contents` compatibile con **PostgreSQL**, **Supabase**, **MySQL** e **SQLite**.
   - Include già tutte le query `INSERT ... ON CONFLICT DO UPDATE` per popolare il database con tutti i testi predefiniti.

3. **Data-Binding nel Frontend (`website/content-manager.js`)**:
   - Ogni elemento della pagina possiede un attributo `data-content-key="chiave"` o `data-content-html="chiave"`.
   - All'apertura della pagina, lo script interroga l'endpoint `/api/content` (o carica `content.json`) e aggiorna istantaneamente tutti gli elementi.
   - **Zero sfarfallio e SEO perfetta**: l'HTML originale include già i testi predefiniti, quindi i motori di ricerca indicizzano subito il sito anche senza eseguire JavaScript.

4. **Endpoint API (`scripts/serve-website.js`)**:
   - `GET /api/content`: restituisce l'intero dizionario di testi.
   - `POST /api/content`: riceve gli aggiornamenti e li salva nel database / file JSON.

---

## 2. Modalità "Modifica Diretta nel Browser" (?edit=true)

Abbiamo integrato un mini-editor visivo per testare la modifica in tempo reale:
1. Apri il sito aggiungendo `?edit=true`, ad esempio:
   👉 **`http://localhost:3000/?edit=true`**
2. Vedrai comparire in alto una barra con il pulsante **"💾 Salva Modifiche nel DB"**.
3. Clicca su qualsiasi titolo o paragrafo della pagina e modificalo direttamente con la tastiera!
4. Clicca su **"Salva Modifiche nel DB"**: le modifiche verranno inviate all'API e salvate.

---

## 3. Come collegare un Database reale online (es. Supabase o PostgreSQL)

Quando metterai il sito online su un server con database:

### Opzione A: Supabase (Consigliata, gratuita e istantanea)
1. Crea un progetto gratuito su [Supabase](https://supabase.com).
2. Nel **SQL Editor** di Supabase, incolla ed esegui il file `website/data/schema.sql`.
3. Inserisci nel backend (o in una Serverless Function API) la query di lettura:
   ```javascript
   import { createClient } from '@supabase/supabase-js';
   const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

   // Endpoint GET /api/content
   const { data } = await supabase.from('site_contents').select('content_key, value_it');
   // Converti le righe in oggetto chiave-valore e restituisci il JSON
   ```

### Opzione B: Node.js + SQLite / PostgreSQL
1. Esegui `schema.sql` sul tuo database relazionale.
2. In `scripts/serve-website.js` (o Express / Fastify / Nest), collega il client `pg` o `better-sqlite3`.
3. Ad ogni `GET /api/content` esegui: `SELECT content_key, value_it FROM site_contents`.

### Opzione C: File JSON su Hosting Statico (GitHub Pages / Netlify / Vercel)
Se preferisci un hosting statico senza database SQL attivo:
- Il frontend carica direttamente `data/content.json`.
- Per cambiare un testo, basta modificare `content.json` e fare push!
