// Praxis trailer — frame-accurate compositor + WebCodecs encoder.
// Sources are demuxed in-page (mp4.js) and decoded sequentially with VideoDecoder, so every output frame
// gets the exact source frame for its timestamp, independent of real time. The cut itself lives in edl.js.
import { demux, mux } from './mp4.js';
import { EDL, FPS, W, H } from './edl.js';

// ---------- sources ----------
const LIB = '/briefs/v6/reel-library/';
const clips = new Map();
async function clip(name) {
  if (!clips.has(name)) clips.set(name, fetch(LIB + encodeURIComponent(name) + '.mp4').then((r) => r.arrayBuffer()).then(demux));
  return clips.get(name);
}

// Sequential decoder for one clip; frameAt(t) returns the VideoFrame on screen at source time t (monotonic access is cheap).
class Stream {
  constructor(c) { this.c = c; this.q = []; this.dec = null; }
  reset(t) {
    if (this.dec) { try { this.dec.close(); } catch {} }
    this.q.forEach((f) => f.close()); this.q = [];
    const s = this.c.samples;
    // start from the last keyframe (in decode order) whose pts <= t
    let k = 0; for (let i = 0; i < s.length; i++) if (s[i].key && s[i].pts <= t + 1e-3) k = i;
    this.next = k; this.ended = false; this.wake = null;
    this.dec = new VideoDecoder({
      output: (f) => { this.q.push(f); this.q.sort((a, b) => a.timestamp - b.timestamp); this.wake?.(); },
      error: (e) => { console.log('decode error', this.c.codec, e.message); this.ended = true; this.wake?.(); },
    });
    this.dec.configure({ codec: this.c.codec, description: this.c.description, codedWidth: this.c.width, codedHeight: this.c.height });
    this.dec.addEventListener('dequeue', () => this.wake?.());
    this.t = t;
  }
  feed() {
    const s = this.c.samples, buf = this.c.buf;
    while (this.next < s.length && this.dec.decodeQueueSize < 6 && this.q.length < 6) {
      const x = s[this.next++];
      this.dec.decode(new EncodedVideoChunk({ type: x.key ? 'key' : 'delta', timestamp: Math.round(x.pts * 1e6), duration: Math.round(x.dur * 1e6), data: new Uint8Array(buf, x.offset, x.size) }));
    }
    if (this.next >= s.length && !this.flushing) { this.flushing = true; this.dec.flush().then(() => { this.ended = true; this.wake?.(); }).catch(() => { this.ended = true; this.wake?.(); }); }
  }
  async frameAt(t) {
    t = Math.max(0, Math.min(t, this.c.duration - 0.5 / this.c.fps));
    if (!this.dec || t < this.t - 1e-4 || (this.q.length && t * 1e6 < this.q[0].timestamp - 1e3) || t > this.t + 2.5) { this.flushing = false; this.reset(t); }
    this.t = t;
    const T = t * 1e6 + 500;
    for (;;) {
      while (this.q.length >= 2 && this.q[1].timestamp <= T) this.q.shift().close();
      if ((this.q.length >= 2) || (this.q.length && this.ended)) return this.q[0];
      if (this.ended) return null;
      const p = new Promise((r) => (this.wake = r));
      this.feed();
      await Promise.race([p, new Promise((r) => setTimeout(r, 50))]);
    }
  }
  close() { this.q.forEach((f) => f.close()); this.q = []; try { this.dec?.close(); } catch {} this.dec = null; }
}

import { mk, ease, tileMask, drawMask } from './fx.js';

// ---------- compositor ----------
const streams = new Map(); // key: shotIndex:layerIndex
async function frameFor(si, li, layer, srcT) {
  const key = si + ':' + li;
  if (!streams.has(key)) streams.set(key, new Stream(await clip(layer.clip)));
  return streams.get(key).frameAt(srcT);
}
function retire(t) {
  for (const [key, s] of streams) {
    const si = +key.split(':')[0], sh = EDL[si], nx = EDL[si + 1];
    const end = sh.start + sh.dur + (nx?.tin?.dur || 0) + 0.1;
    if (t > end || t < sh.start - 0.2) { s.close(); streams.delete(key); }
  }
}

const pool = [];
const scratch = () => pool.pop() || mk(W, H);
const release = (c) => pool.push(c);

// cover-fit a source region into a panel, with zoom about a focus point
function drawVideo(g, fr, L, lt, dur) {
  const sw0 = fr.displayWidth, sh0 = fr.displayHeight;
  const R = L.src || [0, 0, sw0, sh0];
  const sx = sw0 / (L.srcW || sw0); // allow src rects authored at nominal size
  const [rx, ry, rw, rh] = [R[0] * sx, R[1] * sx, R[2] * sx, R[3] * sx];
  const [bx, by, bw, bh] = L.box;
  const k = dur > 0 ? Math.min(1, Math.max(0, lt / dur)) : 0;
  const z = L.zoom ? L.zoom[0] + (L.zoom[1] - L.zoom[0]) * (L.zoomEase ? ease(k) : k) : 1;
  const f = L.focus ? [L.focus[0] + ((L.focus2 || L.focus)[0] - L.focus[0]) * k, L.focus[1] + ((L.focus2 || L.focus)[1] - L.focus[1]) * k] : [0.5, 0.5];
  const s = Math.max(bw / rw, bh / rh) * z;
  const vw = bw / s, vh = bh / s;
  let cx = rx + f[0] * rw, cy = ry + f[1] * rh;
  cx = Math.min(rx + rw - vw / 2, Math.max(rx + vw / 2, cx));
  cy = Math.min(ry + rh - vh / 2, Math.max(ry + vh / 2, cy));
  g.drawImage(fr, cx - vw / 2, cy - vh / 2, vw, vh, bx, by, bw, bh);
}

async function renderShot(g, si, t) {
  const sh = EDL[si], lt = t - sh.start;
  g.save(); g.fillStyle = sh.bg || '#000'; g.fillRect(0, 0, W, H);
  for (let li = 0; li < (sh.layers || []).length; li++) {
    const L = sh.layers[li];
    if (L.from != null && lt < L.from) continue;
    if (L.until != null && lt >= L.until) continue;
    let target = g, tmp = null;
    if (L.reveal) { // draw into a scratch canvas, then mask with tiles
      const p = (lt - (L.reveal.at || 0)) / L.reveal.dur;
      if (p <= 0) continue;
      if (p < 1) { tmp = scratch(); target = tmp[1]; target.clearRect(0, 0, W, H); }
    }
    if (L.clip) {
      const fr = await frameFor(si, li, L, Math.min(L.out ?? Infinity, L.in + (lt - (L.from || 0)) * (L.rate || 1))); // out: freeze (e.g. under a dissolve)
      if (fr) { target.save(); target.beginPath(); target.rect(...L.box); target.clip(); drawVideo(target, fr, L, lt - (L.from || 0), sh.dur); target.restore(); }
    } else if (L.fill) { target.fillStyle = L.fill; target.fillRect(...L.box); }
    else if (L.draw) { await L.draw(target, lt, sh); }
    if (tmp) {
      const p = (lt - (L.reveal.at || 0)) / L.reveal.dur;
      const m = tileMask(null, L.reveal.box || L.box || [0, 0, W, H], L.reveal.tile || 40, ease(p), L.reveal);
      const [mc, mg] = scratch(); mg.clearRect(0, 0, W, H); drawMask(mg, m, '#fff');
      target.globalCompositeOperation = 'destination-in'; target.drawImage(mc, 0, 0); target.globalCompositeOperation = 'source-over';
      g.drawImage(tmp[0], 0, 0);
      if (L.reveal.accent) { g.fillStyle = L.reveal.accent; for (const [i, j] of m.edge) g.fillRect(m.x0 + i * m.tile, m.y0 + j * m.tile, m.tile, m.tile); }
      release(tmp); release([mc, mg]);
    }
  }
  if (sh.after) await sh.after(g, lt, sh);
  g.restore();
}

export async function compose(g, t) {
  let si = 0; for (let i = 0; i < EDL.length; i++) if (EDL[i].start <= t + 1e-6) si = i;
  const sh = EDL[si], tin = sh.tin;
  if (si > 0 && tin && tin.type === 'pixel' && t < sh.start + tin.dur) {
    const p = ease((t - sh.start) / tin.dur);
    await renderShot(g, si - 1, t);
    const [bc, bg] = scratch(); await renderShot(bg, si, t);
    const m = tileMask(null, [0, 0, W, H], tin.tile || 60, p, tin);
    const [mc, mg] = scratch(); mg.clearRect(0, 0, W, H); drawMask(mg, m, '#fff');
    bg.globalCompositeOperation = 'destination-in'; bg.drawImage(mc, 0, 0); bg.globalCompositeOperation = 'source-over';
    g.drawImage(bc, 0, 0);
    if (tin.accent) { g.fillStyle = tin.accent; for (const [i, j] of m.edge) g.fillRect(i * m.tile, j * m.tile, m.tile, m.tile); }
    release([bc, bg]); release([mc, mg]);
  } else {
    await renderShot(g, si, t);
  }
  retire(t);
}

export const TOTAL = EDL[EDL.length - 1].start + EDL[EDL.length - 1].dur;

// ---------- entry points (called from render.mjs over CDP) ----------
const [main, mainG] = mk(W, H);
async function ready() { await document.fonts.ready; for (const f of ['300 80px "Neue Montreal"', '400 80px "Neue Montreal"', '500 80px "Neue Montreal"', '400 40px "Handjet"']) await document.fonts.load(f); }

// contact sheet of composed frames
window.preview = async (times, tw = 480) => {
  await ready();
  const th = Math.round(tw * H / W), cols = Math.min(4, times.length), rows = Math.ceil(times.length / cols), lab = 20;
  const [c, g] = mk(cols * (tw + 4) + 4, rows * (th + lab + 4) + 4); g.fillStyle = '#333'; g.fillRect(0, 0, c.width, c.height);
  g.font = '15px monospace'; g.textBaseline = 'top';
  const order = times.map((t, i) => [t, i]).sort((a, b) => a[0] - b[0]);
  for (const [t, i] of order) {
    await compose(mainG, t);
    const x = 4 + (i % cols) * (tw + 4), y = 4 + Math.floor(i / cols) * (th + lab + 4);
    g.drawImage(main, x, y + lab, tw, th); g.fillStyle = '#ff0'; g.fillText(t.toFixed(2) + 's', x + 2, y + 2);
  }
  for (const s of streams.values()) s.close(); streams.clear();
  return c.toDataURL('image/png');
};
window.still = async (t, w = W, h = H, type = 'image/jpeg', q = 0.92) => {
  await ready(); await compose(mainG, t);
  for (const s of streams.values()) s.close(); streams.clear();
  const [c, g] = mk(w, h); g.imageSmoothingQuality = 'high'; g.drawImage(main, 0, 0, w, h);
  return c.toDataURL(type, q);
};
window.info = async () => { const out = {}; for (const n of new Set(EDL.flatMap((s) => (s.layers || []).filter((l) => l.clip).map((l) => l.clip)))) { const c = await clip(n); out[n] = { codec: c.codec, w: c.width, h: c.height, fps: +c.fps.toFixed(3), dur: +c.duration.toFixed(2) }; } return { total: TOTAL, clips: out }; };

window.encode = async ({ w = W, h = H, bitrate = 4500000, name = 'out', t0 = 0, t1 = TOTAL } = {}) => {
  await ready();
  const base = { width: w, height: h, bitrate, framerate: FPS, avc: { format: 'avc' }, latencyMode: 'quality', bitrateMode: 'variable' };
  let cfg = null;
  for (const codec of ['avc1.640028', 'avc1.4d0028', 'avc1.42e028']) for (const hw of ['prefer-hardware', 'no-preference']) {
    if (cfg) break; const c = { ...base, codec, hardwareAcceleration: hw };
    try { if ((await VideoEncoder.isConfigSupported(c)).supported) cfg = c; } catch {}
  }
  const chunks = []; let avcC = null, err = null;
  const encd = new VideoEncoder({
    output: (ch, md) => { if (md?.decoderConfig?.description) avcC = new Uint8Array(md.decoderConfig.description); const d = new Uint8Array(ch.byteLength); ch.copyTo(d); chunks.push({ data: d, key: ch.type === 'key' }); },
    error: (e) => { err = e; },
  });
  encd.configure(cfg);
  const [oc, og] = mk(w, h); og.imageSmoothingQuality = 'high';
  const [lc, lg] = mk(32, 18); const luma = []; // per-frame mean luma, to catch flash frames / glitches in the sources
  const N = Math.round((t1 - t0) * FPS); const tStart = performance.now();
  for (let k = 0; k < N; k++) {
    const t = t0 + k / FPS;
    await compose(mainG, t);
    og.drawImage(main, 0, 0, w, h);
    lg.drawImage(main, 0, 0, 32, 18); const px = lg.getImageData(0, 0, 32, 18).data; let s = 0; for (let i = 0; i < px.length; i += 4) s += 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]; luma.push(+(s / 576).toFixed(1));
    const vf = new VideoFrame(oc, { timestamp: Math.round(k * 1e6 / FPS), duration: Math.round(1e6 / FPS) });
    encd.encode(vf, { keyFrame: k % (FPS * 2) === 0 }); vf.close();
    while (encd.encodeQueueSize > 4) await new Promise((r) => setTimeout(r, 2));
    if (err) throw err;
    if (k % 60 === 0) console.log(`${name} frame ${k}/${N} ${((performance.now() - tStart) / 1000).toFixed(0)}s`);
  }
  await encd.flush(); encd.close();
  for (const s of streams.values()) s.close(); streams.clear();
  if (!avcC) throw new Error('no avcC');
  const blob = mux({ width: w, height: h, fps: FPS, avcC, chunks });
  const res = await fetch(`/__out?name=${name}&off=0`, { method: 'POST', body: blob });
  if (!res.ok) throw new Error('upload failed');
  return { luma, bytes: blob.size, frames: N, codec: cfg.codec, hw: cfg.hardwareAcceleration, avcProfile: avcC[1], secs: (performance.now() - tStart) / 1000 };
};
window.__ready = true;
