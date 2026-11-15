// Minimal headless-Chrome driver over the DevTools Protocol (no dependencies).
// Also runs a tiny static server for the repo root (Range requests, so <video> can seek)
// plus a POST /__out endpoint the editor page uses to ship rendered bytes back to Node.
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { createReadStream, statSync, mkdirSync, openSync, writeSync, closeSync } from 'node:fs';
import { join, extname, normalize, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(join(fileURLToPath(new URL('.', import.meta.url)), '..', '..'));
const T = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.otf': 'font/otf', '.json': 'application/json', '.css': 'text/css' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Output sinks: the page POSTs /__out?name=<id>&off=<byteOffset> with raw bytes; Node writes them into the file registered for <id>.
const sinks = new Map();
export function sink(name, file) { mkdirSync(dirname(file), { recursive: true }); sinks.set(name, openSync(file, 'w')); }
export function closeSink(name) { const fd = sinks.get(name); if (fd != null) closeSync(fd); sinks.delete(name); }

export function serve(port) {
  const srv = createServer((req, res) => {
    const u = new URL(req.url, 'http://x');
    if (req.method === 'POST' && u.pathname === '/__out') {
      const chunks = []; req.on('data', (c) => chunks.push(c));
      req.on('end', () => {
        const buf = Buffer.concat(chunks), fd = sinks.get(u.searchParams.get('name'));
        if (fd == null) { res.writeHead(404).end(); return; }
        writeSync(fd, buf, 0, buf.length, +u.searchParams.get('off'));
        res.writeHead(200, { 'Content-Type': 'text/plain' }).end('ok');
      });
      return;
    }
    const f = join(ROOT, normalize(decodeURIComponent(u.pathname)));
    if (!f.startsWith(ROOT)) { res.writeHead(403).end(); return; }
    let s; try { s = statSync(f); if (s.isDirectory()) throw 0; } catch { res.writeHead(404).end(); return; }
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
  });
  return new Promise((r) => srv.listen(port, '127.0.0.1', () => r(srv)));
}

export async function chrome({ width = 1920, height = 1080 } = {}) {
  const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  const port = 9300 + Math.floor(Math.random() * 600);
  const ch = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${process.env.TEMP || '/tmp'}/px-reel-${port}`,
    '--hide-scrollbars', '--no-first-run', '--autoplay-policy=no-user-gesture-required', '--force-color-profile=srgb',
    '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', 'about:blank'], { stdio: 'ignore' });
  let target;
  for (let k = 0; k < 80 && !target; k++) { try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); } catch {} if (!target) await sleep(250); }
  const ws = new WebSocket(target.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
  let id = 0; const pending = new Map();
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pending.has(d.id)) { pending.get(d.id)(d.result || d); pending.delete(d.id); }
    else if (d.method === 'Runtime.consoleAPICalled') console.log('  [page]', d.params.args.map((a) => a.value ?? a.description).join(' '));
    else if (d.method === 'Runtime.exceptionThrown') console.log('  [page error]', d.params.exceptionDetails?.exception?.description || d.params.exceptionDetails?.text);
  };
  const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (e) => {
    const r = await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result?.value;
  };
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
  const goto = async (url) => {
    await send('Page.navigate', { url });
    for (let i = 0; i < 200; i++) { await sleep(50); try { if (await ev('document.readyState') === 'complete') break; } catch {} }
  };
  return { send, ev, goto, close: () => { try { ws.close(); } catch {} ch.kill(); } };
}
