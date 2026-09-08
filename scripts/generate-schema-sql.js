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

fs.writeFileSync(path.resolve('website/data/schema.sql'), sql, 'utf8');
console.log('schema.sql generated successfully!');
