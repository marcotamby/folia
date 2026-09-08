const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve('website/index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const startMarker = '<section class="container" id="anteprima">';
const endMarker = '<!-- Complete Features Breakdown (6 Pillars) -->';

const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found!');
  process.exit(1);
}

const sliderSection = `<section class="container" id="anteprima">
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

      <!-- Elegant Desktop Slider Window -->
      <div class="folia-slider-window">
        
        <!-- Slider Topbar -->
        <div class="slider-window-topbar">
          <div class="sc-window-dots">
            <span class="topbar-dot dot-close"></span>
            <span class="topbar-dot dot-min"></span>
            <span class="topbar-dot dot-max"></span>
          </div>

          <!-- Active Slide Title & Counter -->
          <div class="slider-title-center">
            <span class="slider-title-text" id="slider-title-display">1. Manoscritto &amp; Wiki-Popup</span>
            <span class="slider-counter-pill" id="slider-counter-display">1 / 4</span>
          </div>

          <!-- Topbar Navigation Arrows -->
          <div class="slider-topbar-controls">
            <button class="slider-nav-btn" id="slider-btn-prev" title="Schermata precedente (Freccia Sinistra)" aria-label="Precedente">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button class="slider-nav-btn" id="slider-btn-next" title="Schermata successiva (Freccia Destra)" aria-label="Successiva">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>

        <!-- Slider Viewport (Overflow Hidden) -->
        <div class="slider-viewport" id="slider-viewport">
          
          <!-- Floating side navigation arrows -->
          <button class="slider-floating-arrow arrow-prev" id="float-btn-prev" aria-label="Precedente" title="Precedente">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <button class="slider-floating-arrow arrow-next" id="float-btn-next" aria-label="Successiva" title="Successiva">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>

          <!-- Sliding Track -->
          <div class="slider-track" id="slider-track">

            <!-- SLIDE 1: MANOSCRITTO -->
            <div class="slider-slide" data-slide="0" data-title="1. Manoscritto &amp; Wiki-Popup">
              <div class="sc-image-card" onclick="openFoliaLightbox('assets/screenshots/editor_real.png')">
                <img src="assets/screenshots/editor_real.png" alt="Folia — Schermata reale Manoscritto con Wiki-Popup del personaggio" class="sc-full-img">
                <div class="sc-hover-overlay">
                  <span class="sc-zoom-btn">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                    <span>Clicca per ingrandire ad altissima risoluzione</span>
                  </span>
                </div>
              </div>
              <div class="sc-feature-highlights">
                <div class="sc-hl-box">
                  <div class="sc-hl-num">1</div>
                  <div>
                    <strong>Wiki-Interlinking Istantaneo</strong>
                    <p>Passando il mouse sul nome di qualsiasi personaggio (es. <em>Luke</em> o <em>Lord Douglas</em>), Folia apre un popup con obiettivo, aspetto, ruolo e pulsante <em>Apri scheda</em>.</p>
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

            <!-- SLIDE 2: PERSONAGGIO -->
            <div class="slider-slide" data-slide="1" data-title="2. Scheda Personaggio (Psicologia &amp; Tratti)">
              <div class="sc-image-card" onclick="openFoliaLightbox('assets/screenshots/personaggi_real.png')">
                <img src="assets/screenshots/personaggi_real.png" alt="Folia — Schermata reale Scheda Personaggio con psicologia profonda e tratti narrativi" class="sc-full-img">
                <div class="sc-hover-overlay">
                  <span class="sc-zoom-btn">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                    <span>Clicca per ingrandire ad altissima risoluzione</span>
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

            <!-- SLIDE 3: D&D 5E -->
            <div class="slider-slide" data-slide="2" data-title="3. Schede D&amp;D 5e &amp; Party GDR">
              <div class="sc-image-card" onclick="openFoliaLightbox('assets/screenshots/dnd_real.png')">
                <img src="assets/screenshots/dnd_real.png" alt="Folia — Schermata reale Schede D&D 5e con Party, Classi, Schermo Master e Statistiche" class="sc-full-img">
                <div class="sc-hover-overlay">
                  <span class="sc-zoom-btn">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                    <span>Clicca per ingrandire ad altissima risoluzione</span>
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
                    <strong>Pulsante \"Schermo Master\"</strong>
                    <p>Modalità rapida per il Game Master per consultare le schede degli eroi e i tiri salvezza durante la sessione senza perdere il filo del gioco.</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- SLIDE 4: MAPPE -->
            <div class="slider-slide" data-slide="3" data-title="4. Mappe Geografiche &amp; Segnaposti">
              <div class="sc-image-card" onclick="openFoliaLightbox('assets/screenshots/mappe_real.png')">
                <img src="assets/screenshots/mappe_real.png" alt="Folia — Schermata reale Mappe geografiche interattive con segnaposti e dettagli luogo" class="sc-full-img">
                <div class="sc-hover-overlay">
                  <span class="sc-zoom-btn">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                    <span>Clicca per ingrandire ad altissima risoluzione</span>
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

        <!-- Slider Bottom Indicator Pills -->
        <div class="slider-pagination-pills">
          <button class="slider-pill-dot active" data-gotoslide="0">
            <span class="pill-dot-circle"></span>
            <span>1. Manoscritto &amp; Wiki-Popup</span>
          </button>
          <button class="slider-pill-dot" data-gotoslide="1">
            <span class="pill-dot-circle"></span>
            <span>2. Scheda Personaggio</span>
          </button>
          <button class="slider-pill-dot" data-gotoslide="2">
            <span class="pill-dot-circle"></span>
            <span>3. D&amp;D 5e &amp; Party</span>
          </button>
          <button class="slider-pill-dot" data-gotoslide="3">
            <span class="pill-dot-circle"></span>
            <span>4. Mappe &amp; Segnaposti</span>
          </button>
        </div>

      </div>
    </div>
  </section>

  `;

html = html.substring(0, startIndex) + sliderSection + html.substring(endIndex);

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Successfully installed the elegant slider in index.html!');
