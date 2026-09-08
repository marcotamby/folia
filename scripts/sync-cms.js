const fs = require('fs');
const path = require('path');

const contentFile = path.resolve('website/data/content.json');
const htmlFile = path.resolve('website/index.html');

let content = JSON.parse(fs.readFileSync(contentFile, 'utf8'));

content.features.title = "Ogni strumento al suo posto, senza dispersioni.";
content.features.subtitle = "Folia racchiude in un unico ambiente leggero e ordinato tutto ciò che gli scrittori solitamente sono costretti a frammentare tra tre o quattro programmi diversi.";
content.features.f1_title = "Editor & Norme Editoriali";
content.features.f2_title = "Personaggi & Schede D&D 5e";
content.features.f3_title = "Worldbuilding & Mappe con Pin";
content.features.f4_title = "Outliner & 18+ Modelli di Trama";
content.features.f5_title = "Corkboard, Idee & Ricerca";
content.features.f6_title = "Metriche, Focus & Esportazione";

content.privacy.section_label = "Local-First & Privacy";
content.privacy.title = "Le tue storie appartengono solo a te. Senza eccezioni.";

content.support.title = "Un progetto indipendente, nato dalla passione per la narrazione.";

fs.writeFileSync(contentFile, JSON.stringify(content, null, 2), 'utf8');

let html = fs.readFileSync(htmlFile, 'utf8');

const additionalReplacements = [
  ['<h2>Ogni strumento al suo posto, senza dispersioni.</h2>', '<h2 data-content-key="features.title">Ogni strumento al suo posto, senza dispersioni.</h2>'],
  ['<p>\n          Folia racchiude in un unico ambiente leggero e ordinato tutto ciò che gli scrittori solitamente sono costretti', '<p data-content-key="features.subtitle">\n          Folia racchiude in un unico ambiente leggero e ordinato tutto ciò che gli scrittori solitamente sono costretti'],
  ['<h3>Editor &amp; Norme Editoriali</h3>', '<h3 data-content-key="features.f1_title">Editor &amp; Norme Editoriali</h3>'],
  ['<h3>Personaggi &amp; Schede D&amp;D 5e</h3>', '<h3 data-content-key="features.f2_title">Personaggi &amp; Schede D&amp;D 5e</h3>'],
  ['<h3>Worldbuilding &amp; Mappe con Pin</h3>', '<h3 data-content-key="features.f3_title">Worldbuilding &amp; Mappe con Pin</h3>'],
  ['<h3>Outliner &amp; 18+ Modelli di Trama</h3>', '<h3 data-content-key="features.f4_title">Outliner &amp; 18+ Modelli di Trama</h3>'],
  ['<h3>Corkboard, Idee &amp; Ricerca</h3>', '<h3 data-content-key="features.f5_title">Corkboard, Idee &amp; Ricerca</h3>'],
  ['<span class="section-label">Local-First &amp; Privacy</span>', '<span class="section-label" data-content-key="privacy.section_label">Local-First &amp; Privacy</span>'],
  ['<h3>Le tue storie appartengono solo a te. Senza eccezioni.</h3>', '<h3 data-content-key="privacy.title">Le tue storie appartengono solo a te. Senza eccezioni.</h3>'],
  ['<h3>Un progetto indipendente, nato dalla passione per la narrazione.</h3>', '<h3 data-content-key="support.title">Un progetto indipendente, nato dalla passione per la narrazione.</h3>'],
  ['<p>\n          Ho creato Folia perché sentivo la mancanza di uno strumento che unisse il rigore tipografico necessario a noi autori', '<p data-content-html="support.quote">\n          Ho creato Folia perché sentivo la mancanza di uno strumento che unisse il rigore tipografico necessario a noi autori'],
  ['<span>Folia — Creato con dedizione da Marco Tamborrino</span>', '<span data-content-key="footer.copyright">Folia — Creato con dedizione da Marco Tamborrino</span>']
];

for (const [search, replace] of additionalReplacements) {
  if (html.includes(search)) {
    html = html.replace(search, replace);
  } else {
    console.warn('Could not find:', search.substring(0, 30));
  }
}

fs.writeFileSync(htmlFile, html, 'utf8');

// Also re-generate schema.sql so it matches perfectly
const { execSync } = require('child_process');
execSync('node scripts/generate-schema-sql.js', { stdio: 'inherit' });
console.log('All features, privacy, support & schema synced successfully!');
