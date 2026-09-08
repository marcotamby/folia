const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve('website/index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const replacements = [
  // Title
  ['<title>Folia — Suite di Scrittura, Worldbuilding & Narrazione</title>', '<title data-content-key="meta.title">Folia — Suite di Scrittura, Worldbuilding & Narrazione</title>'],
  // Nav
  ['<span class="nav-title">Folia</span>', '<span class="nav-title" data-content-key="nav.brand_name">Folia</span>'],
  ['<li><a href="#nicchie" class="nav-link">Per chi è</a></li>', '<li><a href="#nicchie" class="nav-link" data-content-key="nav.link_niches">Per chi è</a></li>'],
  ['<li><a href="#anteprima" class="nav-link">Applicazione</a></li>', '<li><a href="#anteprima" class="nav-link" data-content-key="nav.link_app">Applicazione</a></li>'],
  ['<li><a href="#features" class="nav-link">Funzionalità</a></li>', '<li><a href="#features" class="nav-link" data-content-key="nav.link_features">Funzionalità</a></li>'],
  ['<li><a href="#privacy" class="nav-link">Local-first</a></li>', '<li><a href="#privacy" class="nav-link" data-content-key="nav.link_privacy">Local-first</a></li>'],
  ['<li><a href="#supporta" class="nav-link">Sostieni</a></li>', '<li><a href="#supporta" class="nav-link" data-content-key="nav.link_support">Sostieni</a></li>'],
  ['<li><a href="#download" class="nav-link">Download</a></li>', '<li><a href="#download" class="nav-link" data-content-key="nav.link_download">Download</a></li>'],
  ['<li><a href="#faq" class="nav-link">FAQ</a></li>', '<li><a href="#faq" class="nav-link" data-content-key="nav.link_faq">FAQ</a></li>'],
  ['<span>Ko-fi</span>\n        </a>', '<span data-content-key="nav.btn_kofi">Ko-fi</span>\n        </a>'],
  ['<span>Scarica</span>\n        </a>', '<span data-content-key="nav.btn_download">Scarica</span>\n        </a>'],
  // Hero
  ['<h1 class="hero-title">', '<h1 class="hero-title" data-content-html="hero.title">'],
  ['<p class="hero-desc">', '<p class="hero-desc" data-content-html="hero.desc">'],
  ['<span>Scarica gratis per Windows (v1.0.1)</span>', '<span data-content-key="hero.cta_download">Scarica gratis per Windows (v1.0.1)</span>'],
  ['<span>Sostieni su Ko-fi ↗</span>', '<span data-content-key="hero.cta_kofi">Sostieni su Ko-fi ↗</span>'],
  ['<span>100% Offline &amp; Privato</span>', '<span data-content-key="hero.badge_offline">100% Offline &amp; Privato</span>'],
  ['<span>Cartelle editoriali 1800 battute</span>', '<span data-content-key="hero.badge_cartelle">Cartelle editoriali 1800 battute</span>'],
  ['<span>Mappe geografiche con pin</span>', '<span data-content-key="hero.badge_maps">Mappe geografiche con pin</span>'],
  ['<span>Attualmente gratuito</span>', '<span data-content-key="hero.badge_free">Attualmente gratuito</span>'],
  // Niches
  ['<span class="section-label">Fatto su misura</span>', '<span class="section-label" data-content-key="niches.section_label">Fatto su misura</span>'],
  ['<h2>Progettato per le reali esigenze di chi narra.</h2>', '<h2 data-content-key="niches.title">Progettato per le reali esigenze di chi narra.</h2>'],
  ['<p>\n          Gli elaboratori di testo generici ignorano le peculiarità del mondo letterario e ludico.', '<p data-content-key="niches.subtitle">\n          Gli elaboratori di testo generici ignorano le peculiarità del mondo letterario e ludico.'],
  // Features
  ['<span class="section-label">Panoramica Completa</span>', '<span class="section-label" data-content-key="features.section_label">Panoramica Completa</span>'],
  ['<h2>Tutto ciò che serve per dare forma a un\'opera completa.</h2>', '<h2 data-content-key="features.title">Tutto ciò che serve per dare forma a un\'opera completa.</h2>'],
  ['<p>Dalla primissima bozza all\'impaginazione finale, senza dover passare per cinque programmi diversi.</p>', '<p data-content-key="features.subtitle">Dalla primissima bozza all\'impaginazione finale, senza dover passare per cinque programmi diversi.</p>'],
  // Feature cards
  ['<h3>Norme Editoriali &amp; Tipografia Italiana</h3>', '<h3 data-content-key="features.f1_title">Norme Editoriali &amp; Tipografia Italiana</h3>'],
  ['<h3>Bibbia di Worldbuilding &amp; Lore</h3>', '<h3 data-content-key="features.f2_title">Bibbia di Worldbuilding &amp; Lore</h3>'],
  ['<h3>Schede Personaggi &amp; D&amp;D 5e</h3>', '<h3 data-content-key="features.f3_title">Schede Personaggi &amp; D&amp;D 5e</h3>'],
  ['<h3>Outliner con 18+ Modelli di Trama</h3>', '<h3 data-content-key="features.f4_title">Outliner con 18+ Modelli di Trama</h3>'],
  ['<h3>Bacheca Visiva Corkboard &amp; Note</h3>', '<h3 data-content-key="features.f5_title">Bacheca Visiva Corkboard &amp; Note</h3>'],
  ['<h3>Metriche, Focus &amp; Esportazione</h3>', '<h3 data-content-key="features.f6_title">Metriche, Focus &amp; Esportazione</h3>'],
  // Privacy
  ['<span class="section-label">Privacy &amp; Architettura</span>', '<span class="section-label" data-content-key="privacy.section_label">Privacy &amp; Architettura</span>'],
  ['<h2>Le tue storie appartengono solo a te. Senza eccezioni.</h2>', '<h2 data-content-key="privacy.title">Le tue storie appartengono solo a te. Senza eccezioni.</h2>'],
  // Support
  ['<span class="section-label">Sviluppo Indipendente</span>', '<span class="section-label" data-content-key="support.section_label">Sviluppo Indipendente</span>'],
  ['<h2>Un progetto indipendente, nato dalla passione per la narrazione.</h2>', '<h2 data-content-key="support.title">Un progetto indipendente, nato dalla passione per la narrazione.</h2>'],
  ['<p class="quote-body">', '<p class="quote-body" data-content-key="support.quote">'],
  ['<div class="author-name">Marco Tamborrino</div>', '<div class="author-name" data-content-key="support.author_name">Marco Tamborrino</div>'],
  ['<div class="author-role">Autore &amp; Sviluppatore di Folia</div>', '<div class="author-role" data-content-key="support.author_role">Autore &amp; Sviluppatore di Folia</div>'],
  ['<span>Supporta Marco su Ko-fi (ko-fi.com/marcotamby) ↗</span>', '<span data-content-key="support.cta_kofi">Supporta Marco su Ko-fi (ko-fi.com/marcotamby) ↗</span>'],
  // Download
  ['<span class="section-label">Centro Download</span>', '<span class="section-label" data-content-key="download.section_label">Centro Download</span>'],
  ['<h2>Scarica Folia per Windows</h2>', '<h2 data-content-key="download.title">Scarica Folia per Windows</h2>'],
  ['<p>Disponibile al momento per sistemi Windows (64-bit). Gratuito in questa fase di sviluppo e perfezionamento.</p>', '<p data-content-key="download.subtitle">Disponibile al momento per sistemi Windows (64-bit). Gratuito in questa fase di sviluppo e perfezionamento.</p>'],
  ['<h4>Folia 1.0.1 per Windows</h4>', '<h4 data-content-key="download.card_title">Folia 1.0.1 per Windows</h4>'],
  ['<div class="dl-meta">Pacchetto Setup Ufficiale (.exe) • 64-bit</div>', '<div class="dl-meta" data-content-key="download.card_meta">Pacchetto Setup Ufficiale (.exe) • 64-bit</div>'],
  ['<span>Scarica Folia per Windows (Setup .exe)</span>', '<span data-content-key="download.cta_download">Scarica Folia per Windows (Setup .exe)</span>'],
  ['<p class="dl-note-clean">', '<p class="dl-note-clean" data-content-html="download.note_bottom">'],
  // FAQ
  ['<span class="section-label">Domande Frequenti</span>', '<span class="section-label" data-content-key="faq.section_label">Domande Frequenti</span>'],
  ['<h2>Tutto quello che c\'è da sapere su Folia.</h2>', '<h2 data-content-key="faq.title">Tutto quello che c\'è da sapere su Folia.</h2>'],
  // Scripts
  ['<script src="app.js"></script>', '<script src="app.js"></script>\n  <script src="content-manager.js" defer></script>']
];

let count = 0;
for (const [search, replace] of replacements) {
  if (html.includes(search)) {
    html = html.replace(search, replace);
    count++;
  } else {
    console.warn('Match not found for:', search.substring(0, 40));
  }
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log(`Successfully annotated ${count}/${replacements.length} elements in index.html!`);
