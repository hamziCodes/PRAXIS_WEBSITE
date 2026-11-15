// Render the Praxis trailer (cut defined in src/reel/edl.js) with headless Chrome + WebCodecs. No dependencies, no ffmpeg.
// Usage:
//   node src/reel/render.mjs info
//   node src/reel/render.mjs preview <out.png> <t1> <t2> ...      composed frames as a contact sheet
//   node src/reel/render.mjs still <out.jpg|png> <t> [w h]          one composed frame
//   node src/reel/render.mjs encode <out.mp4> [w h bitrate]         full trailer (default 1920 1080 4500000)
//   node src/reel/render.mjs all                                    1080p + 720p + poster into assets/video/
import { writeFileSync, mkdirSync, statSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { serve, chrome, sink, closeSink, ROOT } from './cdp.mjs';

const [cmd, ...a] = process.argv.slice(2);
const port = 4400 + Math.floor(Math.random() * 90);
const srv = await serve(port);
const b = await chrome();
const dataUrlTo = (f, u) => { mkdirSync(dirname(resolve(f)), { recursive: true }); writeFileSync(f, Buffer.from(u.split(',')[1], 'base64')); console.log('wrote', f); };
async function encode(out, w = 1920, h = 1080, br = 4500000) {
  const name = 'v' + w; sink(name, resolve(out));
  const r = await b.ev(`encode({w:${w},h:${h},bitrate:${br},name:${JSON.stringify(name)}})`); closeSink(name);
  // flag 1–3 frame luma spikes (flash frames) that a cut would hide from a contact sheet
  const L = r.luma; delete r.luma; const flags = [];
  for (let k = 1; k < L.length - 1; k++) for (let n = 1; n <= 3 && k + n < L.length; n++) {
    const a = L[k - 1], z = L[k + n], mid = L.slice(k, k + n), dev = Math.max(...mid.map((v) => Math.min(Math.abs(v - a), Math.abs(v - z))));
    if (dev > 25 && Math.abs(a - z) < 12) flags.push(`${(k / 30).toFixed(2)}s(${n}f, Δ${dev.toFixed(0)})`);
  }
  console.log('luma spikes:', flags.length ? flags.join(' ') : 'none');
  const bytes = statSync(out).size; console.log('wrote', out, JSON.stringify(r), (bytes / 1048576).toFixed(2) + ' MB', ((bytes * 8) / (r.frames / 30) / 1e6).toFixed(2) + ' Mbps');
}
let code = 0;
try {
  await b.goto(`http://127.0.0.1:${port}/src/reel/editor.html`);
  for (let i = 0; i < 100 && !(await b.ev('!!window.__ready')); i++) await new Promise((r) => setTimeout(r, 100));
  if (cmd === 'info') console.log(JSON.stringify(await b.ev('info()'), null, 1));
  else if (cmd === 'preview') dataUrlTo(a[0], await b.ev(`preview(${JSON.stringify(a.slice(1).map(Number))})`));
  else if (cmd === 'still') dataUrlTo(a[0], await b.ev(`still(${+a[1]}, ${+(a[2] || 1920)}, ${+(a[3] || 1080)}, ${JSON.stringify(a[0].endsWith('.png') ? 'image/png' : 'image/jpeg')}, 0.9)`));
  else if (cmd === 'encode') await encode(a[0], +(a[1] || 1920), +(a[2] || 1080), +(a[3] || 4500000));
  else if (cmd === 'all') {
    const V = join(ROOT, 'assets', 'video'); mkdirSync(V, { recursive: true });
    const POSTER_T = +(process.env.POSTER_T || 13.4);
    dataUrlTo(join(V, 'praxis-trailer-poster.jpg'), await b.ev(`still(${POSTER_T}, 1920, 1080, 'image/jpeg', 0.88)`));
    await encode(join(V, 'praxis-trailer.mp4'), 1920, 1080, 4500000);
    await encode(join(V, 'praxis-trailer-720.mp4'), 1280, 720, 2000000);
  } else console.log('commands: info | preview | still | encode | all');
} catch (e) { console.error('render failed:', e.message); code = 1; } finally { b.close(); srv.close(); }
process.exit(code);
