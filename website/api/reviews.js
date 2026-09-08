const fs = require('fs');
const path = require('path');

let createClient;
try {
  createClient = require('@supabase/supabase-js').createClient;
} catch (e) {}

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (url && key && createClient) {
    return createClient(url, key);
  }
  return null;
}

function getFallbackReviews() {
  try {
    const p1 = path.join(process.cwd(), 'website/data/reviews.json');
    if (fs.existsSync(p1)) return JSON.parse(fs.readFileSync(p1, 'utf-8'));
    const p2 = path.join(__dirname, '../data/reviews.json');
    if (fs.existsSync(p2)) return JSON.parse(fs.readFileSync(p2, 'utf-8'));
  } catch (e) {}
  return [];
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const supabase = getSupabaseClient();

  if (req.method === 'GET') {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('site_reviews')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=60');
          return res.status(200).json(data);
        }
      } catch (e) {}
    }
    return res.status(200).json(getFallbackReviews());
  }

  if (req.method === 'POST') {
    const { name, role, stars, text } = req.body || {};
    if (!name || !text) {
      return res.status(400).json({ error: 'Nome e testo recensione richiesti' });
    }

    const reviewObj = {
      id: Date.now(),
      name: String(name).slice(0, 100),
      role: String(role || 'Scrittore').slice(0, 100),
      stars: Math.min(5, Math.max(1, parseInt(stars, 10) || 5)),
      text: String(text).slice(0, 1000),
      date: 'Oggi'
    };

    if (supabase) {
      try {
        const { error } = await supabase.from('site_reviews').insert([reviewObj]);
        if (!error) {
          return res.status(200).json({ success: true, review: reviewObj });
        }
      } catch (e) {}
    }

    // Fallback: append locally if file system allows
    try {
      const p = path.join(__dirname, '../data/reviews.json');
      const list = getFallbackReviews();
      list.unshift(reviewObj);
      fs.writeFileSync(p, JSON.stringify(list, null, 2), 'utf-8');
    } catch (e) {}

    return res.status(200).json({ success: true, review: reviewObj });
  }

  return res.status(405).json({ error: 'Metodo non consentito' });
};
