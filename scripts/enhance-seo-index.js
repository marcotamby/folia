const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../website/index.html');
const contentJsonPath = path.join(__dirname, '../website/data/content.json');

let html = fs.readFileSync(indexPath, 'utf8');
const contentJson = JSON.parse(fs.readFileSync(contentJsonPath, 'utf8'));

// Helper to strip HTML tags for clean schema.org text
function stripHtml(str) {
  if (!str) return '';
  return str.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
}

// Build FAQ schema array
const faqItems = [];
for (let i = 1; i <= 11; i++) {
  const q = contentJson.faq['q' + i];
  const a = contentJson.faq['a' + i];
  if (q && a) {
    faqItems.push({
      "@type": "Question",
      "name": stripHtml(q),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": stripHtml(a)
      }
    });
  }
}

// Complete JSON-LD @graph definition
const schemaData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://folia-suite.com/#website",
      "url": "https://folia-suite.com/",
      "name": "Folia",
      "description": "Suite di Scrittura, Worldbuilding & Narrazione per Windows",
      "inLanguage": "it-IT",
      "publisher": {
        "@id": "https://folia-suite.com/#organization"
      }
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://folia-suite.com/#software",
      "name": "Folia",
      "headline": "L'ambiente di scrittura per chi dà vita a nuove storie",
      "applicationCategory": "AuthoringTool",
      "applicationSubCategory": "WordProcessor, Worldbuilding & Campaign Manager",
      "operatingSystem": "Windows 10, Windows 11",
      "softwareVersion": "1.0.8",
      "price": "0",
      "priceCurrency": "EUR",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "category": "Free Software"
      },
      "downloadUrl": "https://folia-suite.com/Folia-Installer-Setup-1.0.8.exe",
      "fileSize": "94.6MB",
      "author": {
        "@type": "Person",
        "name": "Marco Tamborrino",
        "url": "https://ko-fi.com/marcotamby"
      },
      "image": "https://folia-suite.com/assets/og-image.png",
      "screenshot": [
        "https://folia-suite.com/assets/screenshots/editor_real.png",
        "https://folia-suite.com/assets/screenshots/mappe_real.png",
        "https://folia-suite.com/assets/screenshots/personaggi_real.png",
        "https://folia-suite.com/assets/screenshots/dnd_real.png"
      ],
      "featureList": [
        "Cartelle Editoriali Standard da 1800 battute tipografiche (30 righe x 60 battute)",
        "Formato romanzo reale 14x21 cm e simulazione su carta",
        "Mappe geografiche interattive con pin e collegamenti lore",
        "Outliner narrativo con 18+ strutture (Save the Cat, Viaggio dell'Eroe)",
        "Schede psicologiche e drammaturgiche dei personaggi",
        "Modulo D&D 5e con schede personaggio, boss/mostri e Schermo Master",
        "Wiki-interlinking automatico nel manoscritto",
        "Esportazione in Microsoft Word (.docx), PDF impaginato, Markdown (.md), TXT",
        "Architettura 100% Local-First e privacy offline senza invio cloud"
      ]
    },
    {
      "@type": "Organization",
      "@id": "https://folia-suite.com/#organization",
      "name": "Folia",
      "url": "https://folia-suite.com/",
      "logo": "https://folia-suite.com/assets/logo.png",
      "email": "info@folia-suite.com",
      "founder": {
        "@type": "Person",
        "name": "Marco Tamborrino"
      },
      "sameAs": [
        "https://ko-fi.com/marcotamby",
        "https://github.com/marcotamby/folia-releases"
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://folia-suite.com/#faq",
      "mainEntity": faqItems
    }
  ]
};

const jsonLdScript = `  <!-- Structured Data / JSON-LD for Google Rich Results, Bing & Generative AI -->\n  <script type="application/ld+json">\n${JSON.stringify(schemaData, null, 2).split('\n').map(l => '  ' + l).join('\n')}\n  </script>`;

// Upgraded Head Block
const newHeadTags = `  <title data-content-key="meta.title">Folia — Suite di Scrittura per Romanzi, Worldbuilding &amp; D&amp;D (Gratuito)</title>
  <meta name="description" content="Folia è l'ambiente desktop gratuito e offline per romanzieri, worldbuilder e Game Master. Cartelle editoriali da 1800 battute, mappe interattive con pin, schede D&amp;D 5e e privacy assoluta.">
  <meta name="keywords" content="software scrittura romanzi, programma per scrivere libri, cartella editoriale 1800 battute, worldbuilding software italiano, mappe fantasy con pin, schede dnd 5e, software master gdr, alternativa scrivener gratis, outliner narrativo, scrittura offline privacy, folia suite">
  <meta name="author" content="Marco Tamborrino">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="https://folia-suite.com/">
  <meta name="theme-color" content="#12241c">

  <!-- Favicon & Touch Icons -->
  <link rel="icon" type="image/png" href="assets/logo.png">
  <link rel="apple-touch-icon" href="assets/logo.png">

  <!-- Search Engine Verification Tags (Compila con il tuo codice proprietario) -->
  <!-- <meta name="google-site-verification" content="INSERISCI_QUI_CODICE_GOOGLE_SEARCH_CONSOLE" /> -->
  <!-- <meta name="msvalidate.01" content="INSERISCI_QUI_CODICE_BING_WEBMASTER" /> -->

  <!-- Open Graph / Facebook / WhatsApp / LinkedIn -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://folia-suite.com/">
  <meta property="og:site_name" content="Folia">
  <meta property="og:locale" content="it_IT">
  <meta property="og:title" content="Folia — Suite di Scrittura per Romanzi, Worldbuilding &amp; D&amp;D">
  <meta property="og:description" content="L'ambiente di scrittura per chi dà vita a nuove storie. Cartelle da 1800 battute, mappe con pin, outliner con 18+ template, schede D&amp;D 5e. 100% Offline e Gratuito.">
  <meta property="og:image" content="https://folia-suite.com/assets/og-image.png">
  <meta property="og:image:secure_url" content="https://folia-suite.com/assets/og-image.png">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Folia — Suite di Scrittura, Worldbuilding e Narrazione">

  <!-- Twitter / X Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="https://folia-suite.com/">
  <meta name="twitter:title" content="Folia — Suite di Scrittura, Worldbuilding &amp; D&amp;D">
  <meta name="twitter:description" content="Cartelle editoriali da 1800 battute, mappe geografiche con pin, schede D&amp;D 5e e privacy offline assoluta. Scarica gratis per Windows.">
  <meta name="twitter:image" content="https://folia-suite.com/assets/og-image.png">
  <meta name="twitter:image:alt" content="Folia — Suite di Scrittura e Worldbuilding">

${jsonLdScript}`;

// Replace original head tags
const headRegex = /<title data-content-key="meta\.title">[\s\S]*?<link rel="icon" type="image\/png" href="assets\/logo\.png">/;
if (headRegex.test(html)) {
  html = html.replace(headRegex, newHeadTags);
  console.log('Successfully replaced <head> tags with complete SEO/GEO metadata and JSON-LD graph.');
} else {
  console.error('Could not find target head tags to replace!');
  process.exit(1);
}

// Add loading="lazy" and decoding="async" to large screenshot images
html = html.replace(
  '<img src="assets/screenshots/editor_real.png" alt="Folia — Schermata reale Manoscritto con Wiki-Popup del personaggio" class="sc-full-img">',
  '<img src="assets/screenshots/editor_real.png" alt="Folia — Schermata reale Manoscritto con Wiki-Popup del personaggio" class="sc-full-img" loading="lazy" decoding="async">'
);
html = html.replace(
  '<img src="assets/screenshots/personaggi_real.png" alt="Folia — Schermata reale Scheda Personaggio con psicologia profonda e tratti narrativi" class="sc-full-img">',
  '<img src="assets/screenshots/personaggi_real.png" alt="Folia — Schermata reale Scheda Personaggio con psicologia profonda e tratti narrativi" class="sc-full-img" loading="lazy" decoding="async">'
);
html = html.replace(
  '<img src="assets/screenshots/dnd_real.png" alt="Folia — Schermata reale Schede D&D 5e con Party, Classi, Schermo Master e Statistiche" class="sc-full-img">',
  '<img src="assets/screenshots/dnd_real.png" alt="Folia — Schermata reale Schede D&D 5e con Party, Classi, Schermo Master e Statistiche" class="sc-full-img" loading="lazy" decoding="async">'
);
html = html.replace(
  '<img src="assets/screenshots/mappe_real.png" alt="Folia — Schermata reale Mappe geografiche interattive con segnaposti e dettagli luogo" class="sc-full-img">',
  '<img src="assets/screenshots/mappe_real.png" alt="Folia — Schermata reale Mappe geografiche interattive con segnaposti e dettagli luogo" class="sc-full-img" loading="lazy" decoding="async">'
);

// Wrap main section in <main id="main-content">
if (!html.includes('<main id="main-content">')) {
  html = html.replace(
    '<!-- Hero Section (Clean & Literary) -->',
    '<main id="main-content">\n  <!-- Hero Section (Clean & Literary) -->'
  );
  html = html.replace(
    '<!-- Clean Minimal Footer -->',
    '</main>\n\n  <!-- Clean Minimal Footer -->'
  );
  console.log('Successfully wrapped main content in <main id="main-content"> semantic tag.');
}

// Update nav logo alt tag for extra clarity
html = html.replace(/<img src="assets\/logo\.png" alt="Folia" class="nav-logo">/g, '<img src="assets/logo.png" alt="Folia — Suite di Scrittura &amp; Worldbuilding" class="nav-logo">');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('index.html updated successfully with all SEO/GEO enhancements!');
