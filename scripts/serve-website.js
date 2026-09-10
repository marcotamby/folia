const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const WEBSITE_DIR = path.resolve(__dirname, '../website');
const ROOT_DIR = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.exe': 'application/octet-stream'
};

const server = http.createServer((req, res) => {
  let reqUrl = decodeURI(req.url.split('?')[0]);

  // Handle Live Download Counter API (/api/downloads)
  if (reqUrl === '/api/downloads') {
    const dlFilePath = path.join(WEBSITE_DIR, 'data/downloads.json');
    if (req.method === 'GET') {
      fs.readFile(dlFilePath, 'utf-8', (err, data) => {
        const count = (!err && data) ? JSON.parse(data).count : 0;
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-cache' });
        res.end(JSON.stringify({ count }));
      });
      return;
    }
    if (req.method === 'POST') {
      fs.readFile(dlFilePath, 'utf-8', (err, data) => {
        let count = (!err && data) ? JSON.parse(data).count : 0;
        count++;
        fs.writeFile(dlFilePath, JSON.stringify({ count }, null, 2), 'utf-8', () => {
          console.log('[Download Counter] New download tracked! Total:', count);
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-cache' });
          res.end(JSON.stringify({ success: true, count }));
        });
      });
      return;
    }
  }

  // Handle Community Reviews API (/api/reviews)
  if (reqUrl === '/api/reviews') {
    const revFilePath = path.join(WEBSITE_DIR, 'data/reviews.json');
    if (req.method === 'GET') {
      fs.readFile(revFilePath, 'utf-8', (err, data) => {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-cache' });
        res.end(data || '[]');
      });
      return;
    }
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          const newReview = JSON.parse(body);
          fs.readFile(revFilePath, 'utf-8', (err, data) => {
            let reviews = (!err && data) ? JSON.parse(data) : [];
            newReview.id = Date.now();
            newReview.date = 'Poco fa';
            reviews.unshift(newReview);
            fs.writeFile(revFilePath, JSON.stringify(reviews, null, 2), 'utf-8', () => {
              console.log('[Reviews API] New review published by:', newReview.name);
              res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
              res.end(JSON.stringify({ success: true, review: newReview }));
            });
          });
        } catch(e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid review payload' }));
        }
      });
      return;
    }
  }

  // Handle Dynamic CMS API Endpoint (/api/content)
  if (reqUrl === '/api/content') {
    const contentFilePath = path.join(WEBSITE_DIR, 'data/content.json');

    if (req.method === 'GET') {
      fs.readFile(contentFilePath, 'utf-8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to read content file' }));
          return;
        }
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache'
        });
        res.end(data);
      });
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          fs.writeFile(contentFilePath, JSON.stringify(parsed, null, 2), 'utf-8', writeErr => {
            if (writeErr) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: writeErr.message }));
              return;
            }
            console.log('[CMS API] Updated content saved successfully to database/content.json');
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: true, message: 'Content updated successfully' }));
          });
        } catch (parseErr) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
        }
      });
      return;
    }
  }

  if (reqUrl === '/') {
    reqUrl = '/index.html';
  }

  let filePath;
  // Handle requests pointing to installer .exe
  if (reqUrl.endsWith('.exe')) {
    filePath = path.join(ROOT_DIR, path.basename(reqUrl));
  } else {
    filePath = path.join(WEBSITE_DIR, reqUrl);
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Folia Website is running at: http://localhost:${PORT}`);
});
