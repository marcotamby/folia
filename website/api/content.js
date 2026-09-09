const fs = require('fs');
const path = require('path');

let createClient;
try {
  createClient = require('@supabase/supabase-js').createClient;
} catch (e) {
  // @supabase/supabase-js may not be available in all local test environments
}

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (url && key && createClient) {
    return createClient(url, key);
  }
  return null;
}

function setNestedValue(obj, keyPath, val) {
  const parts = keyPath.split('.');
  let curr = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (!curr[p] || typeof curr[p] !== 'object') {
      curr[p] = {};
    }
    curr = curr[p];
  }
  curr[parts[parts.length - 1]] = val;
}

function flattenObject(obj, prefix = '') {
  let result = {};
  for (const [key, val] of Object.entries(obj)) {
    if (key === '_admin_password') continue;
    const pathKey = prefix ? `${prefix}.${key}` : key;
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      Object.assign(result, flattenObject(val, pathKey));
    } else if (typeof val === 'string' || typeof val === 'number') {
      result[pathKey] = String(val);
    }
  }
  return result;
}

function getFallbackContent() {
  try {
    const localPath = path.join(process.cwd(), 'website/data/content.json');
    if (fs.existsSync(localPath)) {
      return JSON.parse(fs.readFileSync(localPath, 'utf-8'));
    }
    const relativePath = path.join(__dirname, '../data/content.json');
    if (fs.existsSync(relativePath)) {
      return JSON.parse(fs.readFileSync(relativePath, 'utf-8'));
    }
  } catch (err) {
    console.error('Fallback read error:', err);
  }
  return {};
}

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-password');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabase = getSupabaseClient();

  // ----------------------------------------------------
  // GET: Fetch all contents
  // ----------------------------------------------------
  if (req.method === 'GET') {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('site_contents')
          .select('content_key, value_it');

        if (!error && data && data.length > 0) {
          const contentTree = {};
          for (const row of data) {
            let val = row.value_it;
            if (row.content_key === 'hero.cta_download' && typeof val === 'string' && (val.includes('1.0.1') || val.includes('1.0.2'))) {
              val = val.replace(/v?1\.0\.[12]/g, 'v1.0.3');
              supabase.from('site_contents').update({ value_it: val }).eq('content_key', 'hero.cta_download').then(() => {}).catch(() => {});
            }
            if (row.content_key === 'download.card_title' && typeof val === 'string' && (val.includes('1.0.1') || val.includes('1.0.2'))) {
              val = val.replace(/1\.0\.[12]/g, '1.0.3');
              supabase.from('site_contents').update({ value_it: val }).eq('content_key', 'download.card_title').then(() => {}).catch(() => {});
            }
            setNestedValue(contentTree, row.content_key, val);
          }
          res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=30');
          return res.status(200).json(contentTree);
        } else if (error) {
          console.warn('Supabase select warning:', error.message);
        }
      } catch (err) {
        console.warn('Supabase connection error:', err.message);
      }
    }

    // Fallback to static JSON file
    const fallback = getFallbackContent();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json(fallback);
  }

  // ----------------------------------------------------
  // POST: Update contents
  // ----------------------------------------------------
  if (req.method === 'POST') {
    const adminPassword = process.env.CMS_ADMIN_PASSWORD;

    // Check authorization if password is set in environment
    if (adminPassword) {
      const authHeader = req.headers['authorization'] || '';
      const customHeader = req.headers['x-admin-password'] || '';
      const token = authHeader.replace(/^Bearer\s+/i, '').trim() || customHeader.trim();
      const bodyPassword = req.body && req.body._admin_password;

      if (token !== adminPassword && bodyPassword !== adminPassword) {
        return res.status(401).json({
          success: false,
          error: 'Password amministratore errata o non fornita.'
        });
      }
    }

    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ success: false, error: 'Payload non valido' });
    }

    const flatMap = flattenObject(payload);
    const rows = Object.entries(flatMap).map(([key, val]) => ({
      content_key: key,
      value_it: val,
      section: key.split('.')[0] || 'general',
      updated_at: new Date().toISOString()
    }));

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('site_contents')
          .upsert(rows, { onConflict: 'content_key' });

        if (error) {
          console.error('Supabase upsert error:', error);
          return res.status(500).json({ success: false, error: error.message });
        }

        return res.status(200).json({
          success: true,
          message: `Salvate con successo ${rows.length} voci nel database Supabase!`,
          count: rows.length
        });
      } catch (err) {
        console.error('Supabase write error:', err);
        return res.status(500).json({ success: false, error: err.message });
      }
    } else {
      // Local fallback saving if running in standalone Node.js environment
      try {
        const localPath = path.join(__dirname, '../data/content.json');
        if (fs.existsSync(localPath)) {
          fs.writeFileSync(localPath, JSON.stringify(payload, null, 2), 'utf-8');
          return res.status(200).json({
            success: true,
            message: 'Modifiche salvate in data/content.json (Supabase non configurato).'
          });
        }
      } catch (fErr) {
        console.warn('Local write failed:', fErr.message);
      }

      return res.status(500).json({
        success: false,
        error: 'Database Supabase non configurato (imposta SUPABASE_URL e SUPABASE_KEY nelle variabili di ambiente).'
      });
    }
  }

  return res.status(405).json({ error: 'Metodo non consentito' });
};
