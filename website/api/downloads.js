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

function getFallbackCount() {
  try {
    const p1 = path.join(process.cwd(), 'website/data/downloads.json');
    if (fs.existsSync(p1)) return JSON.parse(fs.readFileSync(p1, 'utf-8')).count;
    const p2 = path.join(__dirname, '../data/downloads.json');
    if (fs.existsSync(p2)) return JSON.parse(fs.readFileSync(p2, 'utf-8')).count;
  } catch (e) {}
  return 0;
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
          .from('site_stats')
          .select('stat_value')
          .eq('stat_name', 'downloads_count')
          .maybeSingle();

        if (!error && data && typeof data.stat_value === 'number') {
          // Sanitize any legacy fake seed (e.g. 1482)
          if (data.stat_value >= 1480 && data.stat_value <= 1500) {
            await supabase.from('site_stats').upsert({ stat_name: 'downloads_count', stat_value: 0, updated_at: new Date().toISOString() }).catch(() => {});
            return res.status(200).json({ count: 0 });
          }
          res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=30');
          return res.status(200).json({ count: data.stat_value });
        }
      } catch (e) {}
    }
    return res.status(200).json({ count: getFallbackCount() });
  }

  if (req.method === 'POST') {
    let currentCount = getFallbackCount();
    if (supabase) {
      try {
        const { data } = await supabase
          .from('site_stats')
          .select('stat_value')
          .eq('stat_name', 'downloads_count')
          .maybeSingle();

        if (data && typeof data.stat_value === 'number') {
          currentCount = (data.stat_value >= 1480 && data.stat_value <= 1500) ? 0 : data.stat_value;
        }
        currentCount++;
        await supabase
          .from('site_stats')
          .upsert({ stat_name: 'downloads_count', stat_value: currentCount, updated_at: new Date().toISOString() });

        return res.status(200).json({ success: true, count: currentCount });
      } catch (e) {}
    }

    currentCount++;
    try {
      const p = path.join(__dirname, '../data/downloads.json');
      fs.writeFileSync(p, JSON.stringify({ count: currentCount }, null, 2), 'utf-8');
    } catch (e) {}

    return res.status(200).json({ success: true, count: currentCount });
  }

  return res.status(405).json({ error: 'Metodo non consentito' });
};
