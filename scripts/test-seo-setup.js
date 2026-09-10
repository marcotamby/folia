const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('=== VERIFICA COMPLETA SETUP SEO, GEO & INDICIZZAZIONE FOLIA ===\n');

let errors = 0;

function check(label, condition, details = '') {
  if (condition) {
    console.log(`[PASS] ${label}`);
  } else {
    console.error(`[FAIL] ${label} - ${details}`);
    errors++;
  }
}

// 1. Robots.txt
const robotsPath = path.join(__dirname, '../website/robots.txt');
const robotsExist = fs.existsSync(robotsPath);
check('robots.txt esiste', robotsExist);
if (robotsExist) {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  check('robots.txt contiene Sitemap URL', robots.includes('Sitemap: https://folia-suite.com/sitemap.xml'));
  check('robots.txt consente bot AI (GPTBot, PerplexityBot, ClaudeBot)', 
    robots.includes('User-agent: GPTBot') && robots.includes('User-agent: PerplexityBot') && robots.includes('User-agent: ClaudeBot')
  );
}

// 2. Sitemap.xml
const sitemapPath = path.join(__dirname, '../website/sitemap.xml');
const sitemapExist = fs.existsSync(sitemapPath);
check('sitemap.xml esiste', sitemapExist);
if (sitemapExist) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  check('sitemap.xml contiene loc', sitemap.includes('<loc>https://folia-suite.com/</loc>'));
  check('sitemap.xml include Google Image tags', sitemap.includes('<image:image>') && sitemap.includes('editor_real.png'));
}

// 3. GEO Standards (llms.txt, llms-full.txt)
const llmsPath = path.join(__dirname, '../website/llms.txt');
const llmsFullPath = path.join(__dirname, '../website/llms-full.txt');
check('llms.txt esiste', fs.existsSync(llmsPath));
check('llms-full.txt esiste', fs.existsSync(llmsFullPath));
if (fs.existsSync(llmsPath)) {
  const llms = fs.readFileSync(llmsPath, 'utf8');
  check('llms.txt include sezioni e link di download', llms.includes('Folia-Installer-Setup') && llms.includes('## Funzionalità Chiave'));
}

// 4. Open Graph Image
const ogImagePath = path.join(__dirname, '../website/assets/og-image.png');
const ogImageExist = fs.existsSync(ogImagePath);
check('assets/og-image.png esiste', ogImageExist);
if (ogImageExist) {
  const stat = fs.statSync(ogImagePath);
  check('assets/og-image.png ha dimensione valida (> 50KB)', stat.size > 50000, `Dimensione: ${stat.size} bytes`);
}

// 5. IndexNow Key
const key = 'b5ef0b1098527fdfd98cd70e37fe7659';
const keyFilePath = path.join(__dirname, `../website/${key}.txt`);
check('IndexNow key file esiste', fs.existsSync(keyFilePath));

// 6. index.html checks
const indexPath = path.join(__dirname, '../website/index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf8');
check('index.html include tag canonical', indexHtml.includes('<link rel="canonical" href="https://folia-suite.com/">'));
check('index.html include meta robots', indexHtml.includes('<meta name="robots" content="index, follow'));
check('index.html include Open Graph image (1200x630)', indexHtml.includes('<meta property="og:image" content="https://folia-suite.com/assets/og-image.png">'));
check('index.html include Twitter Card summary_large_image', indexHtml.includes('<meta name="twitter:card" content="summary_large_image">'));
check('index.html include <main id="main-content">', indexHtml.includes('<main id="main-content">'));
check('index.html include loading="lazy" sugli screenshot', indexHtml.includes('loading="lazy" decoding="async"'));

// 7. Schema.org JSON-LD parsing
const jsonLdMatch = indexHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
check('index.html include script JSON-LD', !!jsonLdMatch);
if (jsonLdMatch) {
  try {
    const parsed = JSON.parse(jsonLdMatch[1]);
    check('JSON-LD è JSON valido', true);
    const graph = parsed['@graph'] || [];
    const types = graph.map(g => g['@type']);
    check('JSON-LD contiene WebSite', types.includes('WebSite'));
    check('JSON-LD contiene SoftwareApplication', types.includes('SoftwareApplication'));
    check('JSON-LD contiene Organization', types.includes('Organization'));
    check('JSON-LD contiene FAQPage', types.includes('FAQPage'));
    
    const faq = graph.find(g => g['@type'] === 'FAQPage');
    check('FAQPage include 11 domande', faq && faq.mainEntity && faq.mainEntity.length === 11, `Trovate: ${faq ? faq.mainEntity.length : 0}`);
  } catch (e) {
    check('JSON-LD parsing', false, e.message);
  }
}

// 8. Test HTTP Server
console.log('\n--- Test HTTP Local Server ---');
process.env.PORT = '3899';
require('./serve-website.js');

setTimeout(() => {
  const routes = [
    { url: '/', mime: 'text/html' },
    { url: '/robots.txt', mime: 'text/plain' },
    { url: '/sitemap.xml', mime: 'application/xml' },
    { url: '/llms.txt', mime: 'text/plain' },
    { url: '/llms-full.txt', mime: 'text/plain' },
    { url: '/assets/og-image.png', mime: 'image/png' },
    { url: `/${key}.txt`, mime: 'text/plain' }
  ];

  let pending = routes.length;

  routes.forEach(r => {
    http.get(`http://localhost:3899${r.url}`, (res) => {
      const is200 = res.statusCode === 200;
      const contentType = res.headers['content-type'] || '';
      const matchesMime = contentType.includes(r.mime);
      check(`HTTP 200 & MIME per ${r.url}`, is200 && matchesMime, `Status: ${res.statusCode}, Content-Type: ${contentType}`);
      
      res.resume();
      pending--;
      if (pending === 0) {
        console.log('\n===============================================');
        if (errors === 0) {
          console.log('TUTTI I TEST SUPERATI CON SUCCESSO! (0 errori)');
        } else {
          console.error(`ATTENZIONE: ${errors} test falliti.`);
        }
        console.log('===============================================');
        process.exit(errors === 0 ? 0 : 1);
      }
    }).on('error', (err) => {
      check(`Connessione HTTP per ${r.url}`, false, err.message);
      pending--;
      if (pending === 0) process.exit(1);
    });
  });
}, 500);
