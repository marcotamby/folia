const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve('website/index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Target section to replace: from <section class="container" id="anteprima"> to </section> before features
const startMarker = '<section class="container" id="anteprima">';
const endMarker = '<!-- Complete Features Breakdown (6 Pillars) -->';

const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found!');
  process.exit(1);
}

const replacementSection = `<section class="container" id="anteprima">
    <div class="app-mockup-wrapper">
      <div class="sc-header-flex">
        <div>
          <span class="section-label" data-content-key="preview.section_label">Interfaccia Reale al 100%</span>
          <h3 class="sc-main-heading" data-content-key="preview.title">Folia in azione: catturato direttamente dal programma</h3>
        </div>
        <div class="sc-badge-live">
          <span class="sc-live-dot"></span>
          <span>4 Schermate Ufficiali v1.0.1</span>
        </div>
      </div>

      <div class="folia-screenshot-window">
        <!-- Top window bar with real tabs -->
        <div class="sc-window-topbar">
          <div class="sc-window-dots">
            <span class="topbar-dot dot-close"></span>
            <span class="topbar-dot dot-min"></span>
            <span class="topbar-dot dot-max"></span>
          </div>

          <div class="sc-tabs-nav">
            <button class="sc-tab-btn active" data-sctab="editor">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              <span>1. Manoscritto &amp; Wiki-Popup</span>
            </button>

            <button class="sc-tab-btn" data-sctab="chars">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
              <span>2. Scheda Personaggio</span>
            </button>

            <button class="sc-tab-btn" data-sctab="dnd">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 8h.01"></path><path d="M8 8h.01"></path><path d="M8 16h.01"></path><path d="M16 16h.01"></path><path d="M12 12h.01"></path></svg>
              <span>3. Schede D&amp;D 5e &amp; Party</span>
            </button>

            <button class="sc-tab-btn" data-sctab="maps">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
              <span>4. Mappe &amp; Segnaposti</span>
            </button>
          </div>

          <div class="sc-topbar-right">
            <span class="sc-zoom-hint">🔍 Clicca per ingrandire</span>
          </div>
        </div>

        <!-- Content Panes -->
        <div class="sc-panes-wrapper">

          <!-- 1. VISTA MANOSCRITTO & WIKI-POPUP -->
          <div class="sc-pane active" id="sc-pane-editor">
            <div class="sc-image-card" onclick="openFoliaLightbox('assets/screenshots/editor_real.png')">
              <img src="assets/screenshots/editor_real.png" alt="Folia — Schermata reale Manoscritto con Wiki-Popup del personaggio" class="sc-full-img">
              <div class="sc-hover-overlay">
                <span class="sc-zoom-btn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                  <span>Clicca per ingrandire a schermo intero</span>
                </span>
              </div>
            </div>

            <div class="sc-feature-highlights">
              <div class="sc-hl-box">
                <div class="sc-hl-num">1</div>
                <div>
                  <strong>Wiki-Interlinking Istantaneo</strong>
                  <p>Passando il mouse sul nome di qualsiasi personaggio (es. <em>Luke</em> o <em>Lord Douglas</em>), appare subito il popup con obiettivo, aspetto, ruolo e pulsante <em>Apri scheda</em>.</p>
                </div>
              </div>
              <div class="sc-hl-box">
                <div class="sc-hl-num">2</div>
                <div>
                  <strong>Calcolo Cartelle Editoriali</strong>
                  <p>In tempo reale a colpo d'occhio: <em>49.7 cartelle (1800 battute)</em>, <em>14.910 parole</em>, sillabazione automatica, caporali e rientro a 1.0 cm.</p>
                </div>
              </div>
              <div class="sc-hl-box">
                <div class="sc-hl-num">3</div>
                <div>
                  <strong>Albero Manoscritto &amp; Ruoli</strong>
                  <p>A sinistra l'albero capitoli del progetto (<em>La stazione sul mare</em>) e la categorizzazione per ruoli: Protagonisti, Antagonisti, Mentori, Spalle e Comparse.</p>
                </div>
              </div>
              <div class="sc-hl-box">
                <div class="sc-hl-num">4</div>
                <div>
                  <strong>Barra Tipografica da Libro</strong>
                  <p>Carattere <em>EB Garamond 14pt</em>, controllo ortografico, interruzioni di pagina, commenti a margine e obiettivo giornaliero con barra di avanzamento.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. VISTA SCHEDA PERSONAGGIO -->
          <div class="sc-pane" id="sc-pane-chars">
            <div class="sc-image-card" onclick="openFoliaLightbox('assets/screenshots/personaggi_real.png')">
              <img src="assets/screenshots/personaggi_real.png" alt="Folia — Schermata reale Scheda Personaggio con psicologia profonda e tratti narrativi" class="sc-full-img">
              <div class="sc-hover-overlay">
                <span class="sc-zoom-btn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                  <span>Clicca per ingrandire a schermo intero</span>
                </span>
              </div>
            </div>

            <div class="sc-feature-highlights">
              <div class="sc-hl-box">
                <div class="sc-hl-num">1</div>
                <div>
                  <strong>Psicologia Profonda del Personaggio</strong>
                  <p>Campi strutturati per <em>Obiettivo Principale (Cosa vuole?)</em>, <em>Bisogno Interiore (Cosa gli serve davvero?)</em> e <em>Difetto Fatale / Vulnerabilità</em>.</p>
                </div>
              </div>
              <div class="sc-hl-box">
                <div class="sc-hl-num">2</div>
                <div>
                  <strong>Identità, Ruolo &amp; Archetipo</strong>
                  <p>Ruolo nella narrazione (<em>Protagonista</em>), archetipo drammatico, età (12 anni), occupazione (<em>Studente</em>) e ritratto avatar personalizzato.</p>
                </div>
              </div>
              <div class="sc-hl-box">
                <div class="sc-hl-num">3</div>
                <div>
                  <strong>Caratterizzazione &amp; Voce</strong>
                  <p>Sezioni dedicate a <em>Punto di forza principale</em>, <em>Aspetto fisico &amp; segni particolari</em> e <em>Psicologia &amp; modo di parlare</em>.</p>
                </div>
              </div>
              <div class="sc-hl-box">
                <div class="sc-hl-num">4</div>
                <div>
                  <strong>Sincronizzazione Automatica</strong>
                  <p>Ogni dettaglio compilato si riflette istantaneamente nei wiki-popup che compaiono mentre scrivi nel manoscritto del romanzo.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. VISTA SCHEDA D&D 5E -->
          <div class="sc-pane" id="sc-pane-dnd">
            <div class="sc-image-card" onclick="openFoliaLightbox('assets/screenshots/dnd_real.png')">
              <img src="assets/screenshots/dnd_real.png" alt="Folia — Schermata reale Schede D&D 5e con Party, Classi, Schermo Master e Statistiche" class="sc-full-img">
              <div class="sc-hover-overlay">
                <span class="sc-zoom-btn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                  <span>Clicca per ingrandire a schermo intero</span>
                </span>
              </div>
            </div>

            <div class="sc-feature-highlights">
              <div class="sc-hl-box">
                <div class="sc-hl-num">1</div>
                <div>
                  <strong>Campagne D&amp;D &amp; TTRPG Complete</strong>
                  <p>Progetti dedicati per GDR con gestione <em>Party (PG / Eroi)</em>, <em>Antagonisti &amp; Boss</em>, <em>PNG guida</em>, sessioni audio registrate e bacheca incontri.</p>
                </div>
              </div>
              <div class="sc-hl-box">
                <div class="sc-hl-num">2</div>
                <div>
                  <strong>Regole Ufficiali D&amp;D 5e Integrate</strong>
                  <p>Classe (<em>Guerriero</em>), Razza (<em>Umano</em>), Allineamento (<em>Neutrale Buono</em>), Livello/GS, Sottoclasse e Background con supporto per classi homebrew.</p>
                </div>
              </div>
              <div class="sc-hl-box">
                <div class="sc-hl-num">3</div>
                <div>
                  <strong>Combattimento, Attacchi &amp; Incantesimi</strong>
                  <p>Sotto-sezioni dedicate per <em>Statistiche &amp; Combattimento</em>, <em>Attacchi &amp; Equipaggiamento</em>, <em>Incantesimi</em> e <em>Statblock Mostro/Boss</em>.</p>
                </div>
              </div>
              <div class="sc-hl-box">
                <div class="sc-hl-num">4</div>
                <div>
                  <strong>Pulsante "Schermo Master"</strong>
                  <p>Modalità rapida per il Game Master per consultare le schede degli eroi e i tiri salvezza durante la sessione senza perdere il filo del gioco.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 4. VISTA MAPPE & SEGNAPOSTI -->
          <div class="sc-pane" id="sc-pane-maps">
            <div class="sc-image-card" onclick="openFoliaLightbox('assets/screenshots/mappe_real.png')">
              <img src="assets/screenshots/mappe_real.png" alt="Folia — Schermata reale Mappe geografiche interattive con segnaposti e dettagli luogo" class="sc-full-img">
              <div class="sc-hover-overlay">
                <span class="sc-zoom-btn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                  <span>Clicca per ingrandire a schermo intero</span>
                </span>
              </div>
            </div>

            <div class="sc-feature-highlights">
              <div class="sc-hl-box">
                <div class="sc-hl-num">1</div>
                <div>
                  <strong>Mappe ad Alta Risoluzione</strong>
                  <p>Carica mappe fantasy, pergamene o illustrazioni ad alta definizione con zoom millimetrico da 25% a 300% e pan fluido.</p>
                </div>
              </div>
              <div class="sc-hl-box">
                <div class="sc-hl-num">2</div>
                <div>
                  <strong>Segnaposti Georeferenziati</strong>
                  <p>Posiziona pin con icone tematiche (es. <em>Porto/Mare</em>, monti, torri, castelli), colori personalizzati e dimensione regolabile.</p>
                </div>
              </div>
              <div class="sc-hl-box">
                <div class="sc-hl-num">3</div>
                <div>
                  <strong>Collegamento alla Scheda Lore</strong>
                  <p>Il popup <em>Dettagli Luogo</em> connette direttamente il pin geografico alla relativa scheda di worldbuilding (<em>La stazione</em>).</p>
                </div>
              </div>
              <div class="sc-hl-box">
                <div class="sc-hl-num">4</div>
                <div>
                  <strong>Pannello Luoghi Segnati</strong>
                  <p>Cassetto laterale destro con tutti i punti d'interesse della mappa, coordinate geografiche precise e ricerca rapida.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>

  `;

html = html.substring(0, startIndex) + replacementSection + html.substring(endIndex);

// Add Lightbox modal right before </body> if not present
if (!html.includes('id="folia-lightbox"')) {
  const lightboxHtml = `
  <!-- High-Res Lightbox Modal for Real Screenshots -->
  <div id="folia-lightbox" onclick="closeFoliaLightbox(event)">
    <button class="lightbox-close-btn" onclick="closeFoliaLightbox(event)" title="Chiudi (Esc)">✕</button>
    <img id="lightbox-target-img" src="" alt="Folia Schermata Ingrandita">
  </div>
`;
  html = html.replace('</body>', lightboxHtml + '</body>');
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Successfully updated index.html with the 4 real Folia screenshots and lightbox!');
