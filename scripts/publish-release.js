const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

function getGitHubToken() {
  try {
    const creds = execSync('git credential fill', {
      input: 'protocol=https\nhost=github.com\n',
      encoding: 'utf-8'
    });
    const match = creds.match(/password=(.+)/);
    if (match && match[1]) {
      return match[1].trim();
    }
  } catch (err) {
    console.error('Failed to extract git credential:', err.message);
  }
  return process.env.GH_TOKEN || process.env.GITHUB_TOKEN || null;
}

function request(url, options, bodyData) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port || 443,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Folia-Release-Publisher',
        ...options.headers
      }
    };

    const req = https.request(reqOptions, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: buffer
        });
      });
    });

    req.on('error', reject);

    if (bodyData) {
      if (Buffer.isBuffer(bodyData) || typeof bodyData === 'string') {
        req.write(bodyData);
        req.end();
      } else if (typeof bodyData.pipe === 'function') {
        bodyData.pipe(req);
      }
    } else {
      req.end();
    }
  });
}

async function uploadAsset(uploadUrlTemplate, token, filePath, contentType) {
  const fileName = path.basename(filePath);
  const uploadUrl = uploadUrlTemplate.replace(/\{.*\}/, `?name=${encodeURIComponent(fileName)}`);
  const fileSize = fs.statSync(filePath).size;
  console.log(`Uploading ${fileName} (${(fileSize / (1024 * 1024)).toFixed(2)} MB)...`);

  const fileStream = fs.createReadStream(filePath);
  const res = await request(uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': contentType || 'application/octet-stream',
      'Content-Length': fileSize
    }
  }, fileStream);

  if (res.statusCode >= 200 && res.statusCode < 300) {
    console.log(`✓ Uploaded ${fileName} successfully!`);
    return JSON.parse(res.data.toString('utf-8'));
  } else {
    throw new Error(`Upload ${fileName} failed with HTTP ${res.statusCode}: ${res.data.toString('utf-8')}`);
  }
}

async function run() {
  const token = getGitHubToken();
  if (!token) {
    console.error('ERROR: No GitHub token found');
    process.exit(1);
  }

  const owner = 'marcotamby';
  const repo = 'folia';
  const tag = 'v1.0.2';

  console.log(`Creating GitHub Release ${tag} for ${owner}/${repo}...`);

  // Check if release already exists
  let release = null;
  const checkRes = await request(`https://api.github.com/repos/${owner}/${repo}/releases/tags/${tag}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (checkRes.statusCode === 200) {
    console.log(`Release ${tag} already exists, will upload assets.`);
    release = JSON.parse(checkRes.data.toString('utf-8'));
  } else {
    const createBody = JSON.stringify({
      tag_name: tag,
      target_commitish: 'main',
      name: `Folia v1.0.2`,
      body: `## Folia v1.0.2\n\n### Novità e Miglioramenti\n- 🔄 **Aggiornamento automatico**: Integrazione di \`electron-updater\` con notifiche in-app e download in background quando è disponibile una nuova versione.\n- ⚙️ **Controllo aggiornamenti nelle Impostazioni**: Possibilità di attivare o disattivare gli aggiornamenti automatici e pulsante per la verifica manuale immediata.\n- 🪟 **Icone finestra Windows**: Sistemata e allineata l'icona nativa di *Ripristina giù / Ingrandisci* per seguire perfettamente lo standard di Windows 10 e 11.\n- 🚀 **Performance & Pulizia**: Ottimizzazione del bundle di produzione e compatibilità dell'installer.`,
      draft: false,
      prerelease: false
    });

    const createRes = await request(`https://api.github.com/repos/${owner}/${repo}/releases`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      }
    }, createBody);

    if (createRes.statusCode !== 201) {
      throw new Error(`Failed to create release: HTTP ${createRes.statusCode} ${createRes.data.toString('utf-8')}`);
    }

    release = JSON.parse(createRes.data.toString('utf-8'));
    console.log(`✓ Release created: ${release.html_url}`);
  }

  const uploadUrl = release.upload_url;

  // If release already has assets, check and delete existing ones to overwrite cleanly
  if (Array.isArray(release.assets) && release.assets.length > 0) {
    for (const a of release.assets) {
      console.log(`Removing previous asset ${a.name}...`);
      await request(`https://api.github.com/repos/${owner}/${repo}/releases/assets/${a.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }).catch(() => {});
    }
  }

  // Assets to upload
  const assets = [
    { path: path.join(__dirname, '../release/latest.yml'), type: 'text/yaml' },
    { path: path.join(__dirname, '../release/Folia-Installer-Setup-1.0.2.exe.blockmap'), type: 'application/octet-stream' },
    { path: path.join(__dirname, '../release/Folia-Installer-Setup-1.0.2.exe'), type: 'application/vnd.microsoft.portable-executable' }
  ];

  for (const asset of assets) {
    if (fs.existsSync(asset.path)) {
      await uploadAsset(uploadUrl, token, asset.path, asset.type);
    } else {
      console.warn(`File not found: ${asset.path}`);
    }
  }

  console.log('\n🎉 Release v1.0.2 and all assets uploaded successfully!');
  console.log(`URL: ${release.html_url}`);
}

run().catch(err => {
  console.error('Release failed:', err);
  process.exit(1);
});
