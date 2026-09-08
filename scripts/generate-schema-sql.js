const fs = require('fs');
const path = require('path');

const contentPath = path.resolve('website/data/content.json');
const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

let sql = `-- ============================================================================
-- FOLIA LANDING PAGE — CMS DATABASE SCHEMA
-- Compatible with PostgreSQL, Supabase, MySQL, and SQLite.
-- Allows editing every single element of the showcase website from a database.
-- ============================================================================

CREATE TABLE IF NOT EXISTS site_contents (
  id SERIAL PRIMARY KEY,
  content_key VARCHAR(120) UNIQUE NOT NULL,
  section VARCHAR(60) NOT NULL,
  content_type VARCHAR(20) DEFAULT 'text',
  value_it TEXT NOT NULL,
  value_en TEXT,
  description VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_site_contents_key ON site_contents(content_key);
CREATE INDEX IF NOT EXISTS idx_site_contents_section ON site_contents(section);

-- ============================================================================
-- SEED DATA (Default Texts)
-- ============================================================================

`;

function escapeSql(str) {
  if (typeof str !== 'string') str = JSON.stringify(str);
  return str.replace(/'/g, "''");
}

function traverse(obj, prefix = '', section = '') {
  for (const [key, val] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const currentSection = section || key;
    if (typeof val === 'string') {
      const isHtml = val.includes('<') && val.includes('>');
      const type = isHtml ? 'html' : 'text';
      sql += `INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('${escapeSql(fullKey)}', '${escapeSql(currentSection)}', '${type}', '${escapeSql(val)}', 'Testo per ${escapeSql(fullKey)}')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

`;
    } else if (Array.isArray(val)) {
      sql += `INSERT INTO site_contents (content_key, section, content_type, value_it, description)
VALUES ('${escapeSql(fullKey)}', '${escapeSql(currentSection)}', 'json', '${escapeSql(JSON.stringify(val))}', 'Elenco per ${escapeSql(fullKey)}')
ON CONFLICT (content_key) DO UPDATE SET value_it = EXCLUDED.value_it, updated_at = CURRENT_TIMESTAMP;

`;
    } else if (typeof val === 'object' && val !== null) {
      traverse(val, fullKey, currentSection);
    }
  }
}

traverse(content);

sql += `-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR SUPABASE
-- ============================================================================
ALTER TABLE site_contents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read site_contents" ON site_contents;
CREATE POLICY "Public read site_contents" ON site_contents FOR SELECT USING (true);

DROP POLICY IF EXISTS "Full access with service_role on site_contents" ON site_contents;
CREATE POLICY "Full access with service_role on site_contents" ON site_contents FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================================
-- COMMUNITY REVIEWS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS site_reviews (
  id BIGINT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(100),
  stars INT DEFAULT 5,
  text TEXT NOT NULL,
  date VARCHAR(50) DEFAULT 'Oggi',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE site_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read site_reviews" ON site_reviews;
CREATE POLICY "Public read site_reviews" ON site_reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert site_reviews" ON site_reviews;
CREATE POLICY "Public insert site_reviews" ON site_reviews FOR INSERT WITH CHECK (true);

-- ============================================================================
-- SITE STATS TABLE (DOWNLOAD COUNTER)
-- ============================================================================
CREATE TABLE IF NOT EXISTS site_stats (
  stat_name VARCHAR(50) PRIMARY KEY,
  stat_value BIGINT NOT NULL DEFAULT 1482,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read site_stats" ON site_stats;
CREATE POLICY "Public read site_stats" ON site_stats FOR SELECT USING (true);

DROP POLICY IF EXISTS "Full access on site_stats" ON site_stats;
CREATE POLICY "Full access on site_stats" ON site_stats FOR ALL USING (true);

INSERT INTO site_stats (stat_name, stat_value)
VALUES ('downloads_count', 1482)
ON CONFLICT (stat_name) DO NOTHING;
`;

fs.writeFileSync(path.resolve('website/data/schema.sql'), sql, 'utf8');
console.log('schema.sql generated successfully!');
