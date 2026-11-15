// Render an HTML composition to an image with headless Chrome (no dependencies).
// Usage: node src/tools/render.mjs <file.html or http(s) URL> <out.webp|out.jpg|out.png> <width> <height> [quality=86]
// The page is loaded from disk at width×height (CSS px, scale 1). Fonts and images are awaited.
// The page may set window.__ready = false and flip it to true when it has finished drawing.
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

const [src, out, w, h, q = '86'] = process.argv.slice(2);
if (!src || !out || !w || !h) { console.error('usage: render.mjs <file.html> <out> <w> <h> [quality]'); process.exit(1); }
const W = +w, H = +h, fmt = out.endsWith('.png') ? 'png' : out.endsWith('.jpg') ? 'jpeg' : 'webp';
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const port = 9300 + Math.floor(Math.random() * 600);
const ch = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${process.env.TEMP || '/tmp'}/px-render-${port}`,
  '--hide-scrollbars', '--no-first-run', '--allow-file-access-from-files', '--force-color-profile=srgb', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws, id = 0; const pending = new Map();
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (e) => (await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true })).result?.value;
let code = 0;
try {
  let target;
  for (let k = 0; k < 60 && !target; k++) { try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); } catch {} if (!target) await sleep(250); }
  ws = new WebSocket(target.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d.result || d); pending.delete(d.id); } };
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: /^https?:/.test(src) ? src : pathToFileURL(resolve(src)).href });
  await sleep(400);
  await ev(`(async()=>{for(let i=0;i<100&&document.readyState!=='complete';i++)await new Promise(r=>setTimeout(r,50));await document.fonts.ready;
    await Promise.all([...document.images].map(im=>im.complete?0:new Promise(r=>{im.onload=im.onerror=r})));
    for(let i=0;i<200&&window.__ready===false;i++)await new Promise(r=>setTimeout(r,50));await new Promise(r=>setTimeout(r,250));return 1})()`);
  const r = await send('Page.captureScreenshot', { format: fmt, ...(fmt === 'png' ? {} : { quality: +q }), clip: { x: 0, y: 0, width: W, height: H, scale: 1 }, captureBeyondViewport: false });
  mkdirSync(dirname(resolve(out)), { recursive: true });
  writeFileSync(out, Buffer.from(r.data, 'base64'));
  console.log(`ok ${out} ${W}x${H} ${(r.data.length * 0.75 / 1024).toFixed(0)}KB`);
} catch (e) { console.error('render failed', e); code = 1; } finally { ch.kill(); }
process.exit(code);
