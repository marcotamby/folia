const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

const text = `================================================================================
                    FOLIA - SUITE DI SCRITTURA DIGITALE
             TERMINI E CONDIZIONI D'USO E INFORMATIVA SULLA PRIVACY
================================================================================

Benvenuto in Folia, l'ambiente di scrittura e narrazione progettato per autori,
romanzieri, sceneggiatori e creativi.

Prima di procedere con l'installazione e l'utilizzo di Folia, ti invitiamo a 
leggere attentamente i seguenti termini e condizioni e l'informativa sulla privacy.

1. NATURA DEL SOFTWARE E ARCHITETTURA LOCAL-FIRST
- Folia è un'applicazione desktop "local-first". Tutti i tuoi manoscritti, schede
  personaggi, ambientazioni, appunti, trame e idee vengono memorizzati esclusivamente
  in locale sul tuo computer.
- Folia non carica i tuoi testi letterari o i tuoi dati creativi su server esterni
  non autorizzati. La proprietà intellettuale di ogni testo creato appartiene al 100%
  all'autore.

2. SALVATAGGIO AUTOMATICO E SICUREZZA DEI DATI
- L'applicazione include una funzionalità di salvataggio automatico programmato ogni
  2 minuti per prevenire perdite accidentali di lavoro.
- Si raccomanda comunque all'utente di effettuare copie di backup periodiche dei propri
  file di progetto (.folia) su supporti esterni o cloud personali.

3. LICENZA D'USO
- Con l'installazione, ti viene concessa una licenza d'uso personale, non esclusiva
  e non trasferibile per l'utilizzo dell'applicazione.
- Non è consentito decompilare, disassemblare o commercializzare il software senza
  espressa autorizzazione.

4. INFORMATIVA SULLA PRIVACY (GDPR COMPLIANT)
- Nessun dato personale o contenuto creativo viene raccolto, tracciato o venduto a terzi.
- L'applicazione non include strumenti di telemetria invasiva o profilazione utente.
- Eventuali preferenze dell'applicazione (lingua, impostazioni editor, margini, font)
  sono conservate unicamente sul dispositivo locale.

5. LIMITAZIONE DI RESPONSABILITÀ
- Il software è fornito "così com'è" (AS IS). Benché siano stati adottati i massimi
  standard di qualità e affidabilità, gli sviluppatori non possono essere ritenuti
  responsabili per danni diretti o indiretti derivanti dall'uso del software o da
  mancati backup da parte dell'utente.

Spuntando la casella di accettazione e proseguendo nell'installazione, dichiari di
aver letto, compreso e accettato integralmente i presenti termini e l'informativa privacy.
================================================================================
`;

const licensePath = path.resolve(__dirname, '../installer/license_it.txt');
const encodedBuffer = iconv.encode(text, 'windows-1252');
fs.writeFileSync(licensePath, encodedBuffer);

console.log('Successfully wrote license_it.txt in Windows-1252 encoding. Size:', encodedBuffer.length);
