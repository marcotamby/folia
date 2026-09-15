// Folia Content Manager — Dynamic CMS Binding & Live In-Browser Editor
(function () {
  let siteContent = null;
  let isEditMode = false;
  let bubbleEl = null;

  // Helper to get nested value by key path ("hero.title" -> obj.hero.title)
  function getNestedValue(obj, path) {
    if (!obj || !path) return null;
    const parts = path.split('.');
    let current = obj;
    for (const part of parts) {
      if (current === undefined || current === null) return null;
      current = current[part];
    }
    return current;
  }

  // Helper to set nested value by key path
  function setNestedValue(obj, path, value) {
    const parts = path.split('.');
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part] || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part];
    }
    current[parts[parts.length - 1]] = value;
  }

  // Clean and sanitize HTML for safe bold/italic/links storage
  function cleanHtml(html) {
    if (!html) return '';
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Strip unsafe elements
    const disallowed = temp.querySelectorAll('script, style, iframe, object, embed, form, input, button');
    disallowed.forEach((n) => n.remove());

    // Allowed tags: strong, b, em, i, u, s, br, a, span
    const allowedTags = ['STRONG', 'B', 'EM', 'I', 'U', 'S', 'BR', 'A', 'SPAN'];
    const allElements = temp.querySelectorAll('*');
    allElements.forEach((el) => {
      if (!allowedTags.includes(el.tagName)) {
        const textNode = document.createTextNode(el.textContent);
        el.replaceWith(textNode);
      } else {
        // Strip unnecessary styles/classes from pasted text
        const attrs = Array.from(el.attributes);
        attrs.forEach((attr) => {
          if (el.tagName === 'A' && ['href', 'target', 'rel'].includes(attr.name)) {
            // keep safe link attributes
          } else {
            el.removeAttribute(attr.name);
          }
        });

        // Normalize <b> to <strong> and <i> to <em>
        if (el.tagName === 'B') {
          const strong = document.createElement('strong');
          strong.innerHTML = el.innerHTML;
          el.replaceWith(strong);
        } else if (el.tagName === 'I') {
          const em = document.createElement('em');
          em.innerHTML = el.innerHTML;
          el.replaceWith(em);
        }
      }
    });

    let result = temp.innerHTML.trim();
    // Remove trailing <br> often left behind by contenteditable
    result = result.replace(/(<br\s*\/?>)+$/i, '').trim();
    return result;
  }

  // Load content from API or JSON fallback
  async function loadContent() {
    try {
      // First try /api/content
      const response = await fetch('/api/content');
      if (response.ok) {
        siteContent = await response.json();
      } else {
        // Fallback to local data/content.json file
        const fileResp = await fetch('data/content.json');
        if (fileResp.ok) {
          siteContent = await fileResp.json();
        }
      }
    } catch (e) {
      console.warn('Could not fetch dynamic content, trying data/content.json...', e);
      try {
        const fileResp = await fetch('data/content.json');
        if (fileResp.ok) {
          siteContent = await fileResp.json();
        }
      } catch (err) {
        console.warn('Content fallback failed, using static HTML defaults.');
      }
    }

    if (siteContent) {
      applyContent(siteContent);
    }
  }

  // Apply content to DOM elements (supports both plain text and bold/italic HTML)
  function applyContent(data) {
    document.querySelectorAll('[data-content-key], [data-content-html]').forEach((el) => {
      const key = el.getAttribute('data-content-key') || el.getAttribute('data-content-html');
      if (key && (
        key.includes('footer.a_') || 
        key.includes('link_github') || 
        key.startsWith('sections.footer.') || 
        key.startsWith('auto.footer.')
      )) {
        return;
      }
      let val = getNestedValue(data, key);
      if (val !== null && typeof val === 'string') {
        if (key === 'hero.cta_download' || key === 'download.card_title') {
          val = val.replace(/1\.0\.[12345]/g, '1.0.6');
        }
        if (el.tagName === 'TITLE') {
          // Strip any HTML tags for browser window title
          el.textContent = val.replace(/<[^>]+>/g, '');
        } else {
          el.innerHTML = val;
        }

        // If this element is or is inside a mailto link, keep href updated
        const parentMailLink = el.closest('a[href^="mailto:"]') || (el.tagName === 'A' && el.getAttribute('href')?.startsWith('mailto:') ? el : null);
        if (parentMailLink && val.includes('@')) {
          const cleanEmail = val.replace(/<[^>]+>/g, '').trim();
          parentMailLink.setAttribute('href', `mailto:${cleanEmail}`);
        }
      }
    });
  }

  // Check if edit mode is active
  function checkEditMode() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('edit') === 'true' || window.location.hash === '#edit') {
      enableEditMode();
    }
  }

  // Formatting helper
  function formatSelection(cmd) {
    document.execCommand(cmd, false, null);
    updateToolbarStates();
  }

  // Update active state of toolbar buttons based on current selection
  function updateToolbarStates() {
    const isBold = document.queryCommandState('bold');
    const isItalic = document.queryCommandState('italic');

    const barBold = document.getElementById('cms-tool-bold');
    const barItalic = document.getElementById('cms-tool-italic');
    if (barBold) barBold.classList.toggle('active', isBold);
    if (barItalic) barItalic.classList.toggle('active', isItalic);

    if (bubbleEl) {
      const bubbleBold = bubbleEl.querySelector('[data-cmd="bold"]');
      const bubbleItalic = bubbleEl.querySelector('[data-cmd="italic"]');
      if (bubbleBold) bubbleBold.classList.toggle('active', isBold);
      if (bubbleItalic) bubbleItalic.classList.toggle('active', isItalic);
    }
  }

  // Create floating bubble toolbar for instant bold/italic selection
  function initFloatingBubble() {
    bubbleEl = document.createElement('div');
    bubbleEl.id = 'folia-cms-bubble';
    bubbleEl.innerHTML = `
      <button type="button" class="cms-bubble-btn" data-cmd="bold" title="Grassetto (Ctrl+B)"><strong>B</strong></button>
      <button type="button" class="cms-bubble-btn" data-cmd="italic" title="Corsivo (Ctrl+I)"><em>I</em></button>
      <div class="cms-bubble-sep"></div>
      <button type="button" class="cms-bubble-btn" data-cmd="removeFormat" title="Rimuovi formattazione">✕</button>
    `;

    // Prevent mousedown from clearing text selection
    bubbleEl.querySelectorAll('.cms-bubble-btn').forEach((btn) => {
      btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const cmd = btn.getAttribute('data-cmd');
        formatSelection(cmd);
      });
    });

    document.body.appendChild(bubbleEl);

    // Listen to selection changes to position the bubble
    function handleSelection() {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
        hideBubble();
        return;
      }

      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;
      const editableParent = (container.nodeType === Node.ELEMENT_NODE ? container : container.parentElement).closest('.cms-editable');

      if (!editableParent) {
        hideBubble();
        return;
      }

      const rect = range.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        hideBubble();
        return;
      }

      // Position bubble above the selection
      const bubbleWidth = 110;
      const bubbleHeight = 40;
      let top = rect.top + window.scrollY - bubbleHeight - 8;
      let left = rect.left + window.scrollX + (rect.width / 2);

      // If too close to top, show below selection
      if (rect.top < 60) {
        top = rect.bottom + window.scrollY + 8;
        bubbleEl.classList.add('bubble-below');
      } else {
        bubbleEl.classList.remove('bubble-below');
      }

      bubbleEl.style.top = `${top}px`;
      bubbleEl.style.left = `${left}px`;
      bubbleEl.style.transform = 'translateX(-50%)';
      bubbleEl.style.display = 'flex';

      updateToolbarStates();
    }

    function hideBubble() {
      if (bubbleEl) {
        bubbleEl.style.display = 'none';
      }
    }

    document.addEventListener('mouseup', () => {
      setTimeout(handleSelection, 10);
    });

    document.addEventListener('keyup', (e) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyB', 'KeyI'].includes(e.code)) {
        setTimeout(handleSelection, 10);
      }
    });

    document.addEventListener('selectionchange', () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        hideBubble();
      }
    });
  }

  // Enable visual inline editor
  function enableEditMode() {
    isEditMode = true;
    document.body.classList.add('folia-cms-edit-mode');

    // Create CMS admin top bar with Bold, Italic and Save buttons
    const bar = document.createElement('div');
    bar.id = 'folia-cms-bar';
    bar.innerHTML = `
      <div class="cms-bar-wrap">
        <div class="cms-bar-left">
          <span class="cms-pulse"></span>
          <strong>Modalità Modifica DB Attiva</strong>
          <span class="cms-hint">— Clicca sui testi per modificarli, seleziona per grassetto o corsivo</span>
        </div>

        <div class="cms-bar-tools">
          <button type="button" id="cms-tool-bold" class="cms-tool-btn" title="Grassetto (Ctrl+B)"><strong>B</strong></button>
          <button type="button" id="cms-tool-italic" class="cms-tool-btn" title="Corsivo (Ctrl+I)"><em>I</em></button>
          <button type="button" id="cms-tool-clear" class="cms-tool-btn" title="Rimuovi stile">✕</button>
        </div>

        <div class="cms-bar-right">
          <button id="cms-btn-reset" class="cms-btn cms-btn-sec">Ripristina</button>
          <button id="cms-btn-save" class="cms-btn cms-btn-prim">💾 Salva nel DB</button>
          <button id="cms-btn-exit" class="cms-btn cms-btn-close" title="Chiudi modalità modifica">✕</button>
        </div>
      </div>
    `;
    document.body.prepend(bar);

    // Setup Top Bar Formatting Handlers (prevent mousedown from blurring selection)
    const btnBold = document.getElementById('cms-tool-bold');
    const btnItalic = document.getElementById('cms-tool-italic');
    const btnClear = document.getElementById('cms-tool-clear');

    [
      { btn: btnBold, cmd: 'bold' },
      { btn: btnItalic, cmd: 'italic' },
      { btn: btnClear, cmd: 'removeFormat' }
    ].forEach(({ btn, cmd }) => {
      if (btn) {
        btn.addEventListener('mousedown', (e) => {
          e.preventDefault();
          formatSelection(cmd);
        });
      }
    });

    // Make all content keys editable
    const editableElements = document.querySelectorAll('[data-content-key], [data-content-html]');
    editableElements.forEach((el) => {
      // Don't make <title> editable in body
      if (el.tagName === 'TITLE') return;
      el.setAttribute('contenteditable', 'true');
      el.classList.add('cms-editable');
    });

    // Support keyboard shortcuts Ctrl+B and Ctrl+I inside editable fields
    document.addEventListener('keydown', (e) => {
      if (!isEditMode) return;
      const activeEl = document.activeElement;
      if (!activeEl || !activeEl.classList.contains('cms-editable')) return;

      if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        formatSelection('bold');
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'i' || e.key === 'I')) {
        e.preventDefault();
        formatSelection('italic');
      }
    });

    // Initialize floating bubble for selections
    initFloatingBubble();

    // Handle Save
    document.getElementById('cms-btn-save').addEventListener('click', async () => {
      const saveBtn = document.getElementById('cms-btn-save');
      saveBtn.textContent = 'Salvataggio in corso...';
      saveBtn.disabled = true;

      // Collect all edited values, preserving semantic bold/italic tags
      editableElements.forEach((el) => {
        const textKey = el.getAttribute('data-content-key');
        const htmlKey = el.getAttribute('data-content-html');
        const targetKey = textKey || htmlKey;

        if (targetKey) {
          if (el.tagName === 'TITLE') {
            setNestedValue(siteContent, targetKey, el.textContent.trim());
          } else {
            const cleaned = cleanHtml(el.innerHTML);
            setNestedValue(siteContent, targetKey, cleaned);
          }
        }
      });

      let adminPassword = localStorage.getItem('folia_cms_admin_pwd') || '';

      const doSave = async (pwd) => {
        const headers = { 'Content-Type': 'application/json' };
        if (pwd) {
          headers['Authorization'] = `Bearer ${pwd}`;
          headers['x-admin-password'] = pwd;
        }

        return await fetch('/api/content', {
          method: 'POST',
          headers,
          body: JSON.stringify(siteContent)
        });
      };

      try {
        let res = await doSave(adminPassword);

        // If unauthorized (401), ask user for password
        if (res.status === 401) {
          const inputPwd = prompt('Inserisci la password amministratore (CMS_ADMIN_PASSWORD):');
          if (inputPwd) {
            adminPassword = inputPwd.trim();
            localStorage.setItem('folia_cms_admin_pwd', adminPassword);
            res = await doSave(adminPassword);
          }
        }

        const data = await res.json().catch(() => ({}));

        if (res.ok && data.success) {
          showToast(data.message || '✓ Modifiche salvate con successo nel DB!');
        } else {
          showToast(`⚠️ ${data.error || 'Salvataggio fallito via API.'}`);
        }
      } catch (err) {
        console.error(err);
        showToast('⚠️ Errore di rete durante il salvataggio.');
      } finally {
        saveBtn.textContent = '💾 Salva nel DB';
        saveBtn.disabled = false;
      }
    });

    // Handle Reset
    document.getElementById('cms-btn-reset').addEventListener('click', () => {
      if (confirm('Vuoi ripristinare i testi originali ricaricando la pagina?')) {
        window.location.reload();
      }
    });

    // Handle Exit
    document.getElementById('cms-btn-exit').addEventListener('click', () => {
      const url = new URL(window.location);
      url.searchParams.delete('edit');
      url.hash = '';
      window.location.href = url.toString();
    });
  }

  function showToast(msg) {
    let toast = document.getElementById('folia-cms-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'folia-cms-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 4000);
  }

  // Automatically ensure every single text element on the page is editable and tracked
  function autoAnnotateTextElements() {
    const textSelectors = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'blockquote',
      '.section-label', '.niche-pill-badge', '.dl-badge', '.dl-meta',
      '.quote-body', '.author-name', '.author-role', '.faq-text-body',
      '.faq-btn span', '.niche-header-title h3', '.niche-header-title p',
      '.niche-feat-col h4 span', '.niche-bullets li', '.dl-specs-list li',
      '.sc-hl-box strong', '.sc-hl-box p', '.nav-links a', '.nav-actions a span',
      '.footer-left span', '.reviews-cta-card h3',
      '.reviews-cta-card p', '.reviews-cta-badge', '.niche-tab-btn span'
    ].join(', ');

    const secCounters = {};

    document.querySelectorAll(textSelectors).forEach((el) => {
      // Ignore CMS tools, toasts, modals internal UI, forms, and elements that already have keys
      if (el.closest('#folia-cms-bar, #folia-cms-bubble, #folia-cms-toast, form, script, style, svg')) return;
      if (el.hasAttribute('data-content-key') || el.hasAttribute('data-content-html')) return;
      if (!el.textContent || !el.textContent.trim()) return;

      const container = el.closest('section[id], header, footer, [id]') || document.body;
      const secName = container.id || (el.closest('header') ? 'nav' : el.closest('footer') ? 'footer' : 'page');
      const tag = el.tagName.toLowerCase();

      if (!secCounters[secName]) secCounters[secName] = 0;
      secCounters[secName]++;

      const autoKey = `auto.${secName}.${tag}_${secCounters[secName]}`;
      el.setAttribute('data-content-html', autoKey);
    });
  }

  function init() {
    autoAnnotateTextElements();
    loadContent();
    checkEditMode();
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
