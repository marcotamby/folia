// Folia Content Manager — Dynamic CMS Binding & Live In-Browser Editor
(function () {
  let siteContent = null;
  let isEditMode = false;

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

  // Apply content to DOM elements
  function applyContent(data) {
    // 1. Text elements
    document.querySelectorAll('[data-content-key]').forEach((el) => {
      const key = el.getAttribute('data-content-key');
      const val = getNestedValue(data, key);
      if (val !== null && typeof val === 'string') {
        el.innerText = val;
      }
    });

    // 2. HTML elements
    document.querySelectorAll('[data-content-html]').forEach((el) => {
      const key = el.getAttribute('data-content-html');
      const val = getNestedValue(data, key);
      if (val !== null && typeof val === 'string') {
        el.innerHTML = val;
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

  // Enable visual inline editor
  function enableEditMode() {
    isEditMode = true;
    document.body.classList.add('folia-cms-edit-mode');

    // Create CMS admin top bar
    const bar = document.createElement('div');
    bar.id = 'folia-cms-bar';
    bar.innerHTML = `
      <div class="cms-bar-wrap">
        <div class="cms-bar-left">
          <span class="cms-pulse"></span>
          <strong>Modalità Modifica DB Attiva</strong>
          <span class="cms-hint">— Clicca su qualsiasi testo per modificarlo inline</span>
        </div>
        <div class="cms-bar-right">
          <button id="cms-btn-reset" class="cms-btn cms-btn-sec">Ripristina</button>
          <button id="cms-btn-save" class="cms-btn cms-btn-prim">💾 Salva nel DB</button>
          <button id="cms-btn-exit" class="cms-btn cms-btn-close" title="Chiudi modalità modifica">✕</button>
        </div>
      </div>
    `;
    document.body.prepend(bar);

    // Make all content keys editable
    const editableElements = document.querySelectorAll('[data-content-key], [data-content-html]');
    editableElements.forEach((el) => {
      el.setAttribute('contenteditable', 'true');
      el.classList.add('cms-editable');
    });

    // Handle Save
    document.getElementById('cms-btn-save').addEventListener('click', async () => {
      const saveBtn = document.getElementById('cms-btn-save');
      saveBtn.textContent = 'Salvataggio in corso...';
      saveBtn.disabled = true;

      // Collect all edited values
      editableElements.forEach((el) => {
        const textKey = el.getAttribute('data-content-key');
        const htmlKey = el.getAttribute('data-content-html');
        if (textKey) {
          setNestedValue(siteContent, textKey, el.innerText.trim());
        } else if (htmlKey) {
          setNestedValue(siteContent, htmlKey, el.innerHTML.trim());
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
          showToast(data.message || '✓ Modifiche salvate con successo nel DB Supabase!');
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

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadContent();
      checkEditMode();
    });
  } else {
    loadContent();
    checkEditMode();
  }
})();
