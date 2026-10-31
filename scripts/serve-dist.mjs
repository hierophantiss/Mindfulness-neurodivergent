// Serves the built site (dist/) the way Cloudflare Pages does, for the
// end-to-end checks: /el/practice → dist/el/practice.html, unknown → 404.html.
// Usage: node scripts/serve-dist.mjs [port]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('dist');
const PORT = Number(process.argv[2] || 4173);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
  '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.pdf': 'application/pdf', '.epub': 'application/epub+zip',
};

const isFile = (p) => { try { return fs.statSync(p).isFile(); } catch { return false; } };

http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0].split('#')[0]);
  const clean = url.replace(/\/+$/, '') || '/';
  let file = path.join(ROOT, clean === '/' ? 'index.html' : clean);
  if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  let status = 200;
  if (!isFile(file)) {
    if (isFile(file + '.html')) file += '.html';
    else if (isFile(path.join(file, 'index.html'))) file = path.join(file, 'index.html');
    else { file = path.join(ROOT, '404.html'); status = 404; }
  }
  res.writeHead(status, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`serving dist on http://localhost:${PORT}`));
