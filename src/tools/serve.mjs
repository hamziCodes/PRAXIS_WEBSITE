// Tiny local preview server: node src/tools/serve.mjs [port]
// Serves the repo root. Supports Range requests so <video> can seek.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..');
const T = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4', '.webm': 'video/webm', '.woff2': 'font/woff2', '.otf': 'font/otf',
  '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json' };
const port = +process.argv[2] || 4321;
createServer(async (req, res) => {
  const p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
  let f = join(ROOT, p);
  if (!f.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  try {
    let s = await stat(f);
    if (s.isDirectory()) { f = join(f, 'index.html'); s = await stat(f); }
    const type = T[extname(f).toLowerCase()] || 'application/octet-stream';
    const m = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
    if (m) {
      const start = m[1] ? +m[1] : s.size - +m[2], end = m[1] && m[2] ? Math.min(+m[2], s.size - 1) : s.size - 1;
      if (start >= s.size || start > end) { res.writeHead(416, { 'Content-Range': `bytes */${s.size}` }).end(); return; }
      res.writeHead(206, { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Content-Range': `bytes ${start}-${end}/${s.size}`, 'Content-Length': end - start + 1 });
      createReadStream(f, { start, end }).pipe(res);
    } else {
      res.writeHead(200, { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Content-Length': s.size });
      createReadStream(f).pipe(res);
    }
  } catch { res.writeHead(404, { 'Content-Type': T['.html'] }).end(await readFile(join(ROOT, '404.html'))); }
}).listen(port, () => console.log('http://localhost:' + port));
