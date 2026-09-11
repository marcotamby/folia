// Folia — Instant Search Engine Indexing via IndexNow Protocol
// Notifies Bing, Yandex, Seznam, Naver about website updates immediately.

const https = require('https');

const HOST = process.env.FOLIA_HOST || 'folia-suite.com';
const KEY = 'b5ef0b1098527fdfd98cd70e37fe7659';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const URL_LIST = [
  `https://${HOST}/`,
  `https://${HOST}/privacy`
];

const payload = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: URL_LIST
});

const options = {
  hostname: 'api.indexnow.org',
  port: 443,
  path: '/IndexNow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload)
  }
};

console.log(`[IndexNow] Sending indexing ping for ${HOST}...`);
console.log(`[IndexNow] URLs to index:`, URL_LIST);

const req = https.request(options, (res) => {
  let responseBody = '';
  res.on('data', (chunk) => {
    responseBody += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 202) {
      console.log(`[IndexNow] Success! Status: ${res.statusCode} (URL successfully submitted for immediate crawl)`);
    } else {
      console.log(`[IndexNow] Response status: ${res.statusCode}`);
      if (responseBody) console.log(`[IndexNow] Body:`, responseBody);
    }
  });
});

req.on('error', (err) => {
  console.error('[IndexNow] Request failed:', err.message);
});

req.write(payload);
req.end();
