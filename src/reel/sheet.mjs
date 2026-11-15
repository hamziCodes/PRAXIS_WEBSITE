// Contact sheets for studying clips / verifying renders.
// Usage: node src/reel/sheet.mjs <out-dir> <step> <cols> <thumbW> <clip-url-path> [<clip-url-path> ...]
//   clip paths are repo-relative, e.g. "briefs/v6/reel-library/Services.mp4". Range: append "@t0-t1".
// Also: node src/reel/sheet.mjs --meta <clip> ...  (prints dimensions / duration)
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import { serve, chrome } from './cdp.mjs';

const args = process.argv.slice(2);
const port = 4410 + Math.floor(Math.random() * 80);
const srv = await serve(port);
const b = await chrome({ width: 800, height: 600 });
const enc = (p) => '/' + p.split('/').map(encodeURIComponent).join('/');
try {
  await b.goto(`http://127.0.0.1:${port}/src/reel/sheet.html`);
  if (args[0] === '--meta') {
    for (const p of args.slice(1)) console.log(p, JSON.stringify(await b.ev(`meta(${JSON.stringify(enc(p))})`)));
  } else {
    const [out, step, cols, tw, ...clips] = args;
    mkdirSync(out, { recursive: true });
    for (const spec of clips) {
      const [p, range] = spec.split('@'); const [t0, t1] = range ? range.split('-').map(Number) : [0, 1e9];
      const r = await b.ev(`sheet(${JSON.stringify(enc(p))}, ${+step}, ${+cols}, ${+tw}, ${t0}, ${t1})`);
      const f = join(out, basename(p).replace(/\.mp4$/i, '') .replace(/\s+/g, '_') + (range ? '_' + range : '') + '.png');
      writeFileSync(f, Buffer.from(r.url.split(',')[1], 'base64'));
      console.log(f, r.w + 'x' + r.h, r.d.toFixed(2) + 's');
    }
  }
} finally { b.close(); srv.close(); }
process.exit(0);
