// THE CUT — Praxis Studio trailer. Edit this file to re-cut; editor.js renders it (see EDL.md for the readable cut list).
// Timeline: 1920×1080 logical px, 30 fps. Each shot: start/dur (s), optional tin (transition in), layers drawn in order.
// Video layer: { clip, in (source s), out (optional: freeze at this source time), box [x,y,w,h] on the timeline, src [x,y,w,h] source region to cover-fit (source px),
//                focus [fx,fy] 0..1 within src, zoom [z0,z1] over the shot, reveal {at,dur,tile,dir} pixel-in from black }
import { tileMask, drawMask, ease, easeOut, mk } from './fx.js';

export const FPS = 30, W = 1920, H = 1080;
const INK = '#000000', BONE = '#DFE0D0', INCH = '#B1FA63';
const NM = '"Neue Montreal", Helvetica, Arial, sans-serif', PIX = '"Handjet", ui-monospace, monospace';

// --- type helpers ---
function text(g, s, x, y, { size = 64, weight = 500, color = BONE, align = 'left', ls = -0.02, font = NM, base = 'alphabetic' } = {}) {
  g.font = `${weight} ${size}px ${font}`; g.fillStyle = color; g.textAlign = align; g.textBaseline = base;
  g.letterSpacing = `${(ls * size).toFixed(2)}px`; g.fillText(s, x, y); g.letterSpacing = '0px';
}
// pixel-reveal anything drawn by fn inside box: tiles switch on in a stepped sweep
function pixelIn(g, box, p, tile, fn, opt = {}) {
  if (p <= 0) return; if (p >= 1) { fn(g); return; }
  const [c, cg] = mk(W, H); fn(cg);
  const m = tileMask(null, box, tile, ease(p), { dir: 'lr', mix: 0.5, ...opt });
  const [mc, mg] = mk(W, H); drawMask(mg, m, '#fff');
  cg.globalCompositeOperation = 'destination-in'; cg.drawImage(mc, 0, 0);
  g.drawImage(c, 0, 0);
  if (opt.accent) { g.fillStyle = opt.accent; for (const [i, j] of m.edge) g.fillRect(m.x0 + i * tile, m.y0 + j * tile, tile, tile); }
}
const pixelOut = (g, box, p, tile, fn, opt) => pixelIn(g, box, 1 - p, tile, fn, { dir: 'rl', ...opt });

// Praxis mark (Brand Book plate 1) drawn as squares, viewBox -45..45
const MARK = [[0, 0, 20], ...[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b]) => [a * 15, b * 15, 15]),
  ...[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b]) => [a * 27.5, b * 27.5, 10]), ...[[0, -1], [0, 1], [-1, 0], [1, 0]].map(([a, b]) => [a * 40, b * 40, 10])];
function mark(g, cx, cy, size, color, k = 1) { // k: 0..1 builds the mark square by square (centre out)
  const s = size / 90; g.fillStyle = color;
  MARK.forEach(([x, y, w], i) => { if (i / MARK.length < k) g.fillRect(cx + (x - w / 2) * s, cy + (y - w / 2) * s, w * s, w * s); });
}
let lockup = null;
const lockupImg = () => lockup || (lockup = new Promise((r) => { const im = new Image(); im.onload = () => r(im); im.src = '/assets/logo/praxis-lockup-bone.svg'; }));

// ============================== THE CUT ==============================
let t = 0; const at = (d) => { const s = t; t += d; return s; };
export const EDL = [];
const shot = (dur, o) => { EDL.push({ start: at(dur), dur, ...o }); };

// 01 — THE OFFER. Services card stack, contained on black (its own ground), footer cropped. Pixels in from black (loop seam).
shot(5.6, {
  name: 'offer',
  layers: [
    { clip: 'Services', in: 0.0, box: [400, 0, 1120, 1080], src: [0, 110, 1080, 1041], zoom: [1.0, 1.05], focus: [0.5, 0.5],
      reveal: { at: 0, dur: 0.7, tile: 40, dir: 'c', mix: 0.45 } },
    { draw: (g, lt) => { // edge feather so the clip's black melts into the frame's black
      for (const [x, d] of [[400, 1], [1520, -1]]) { const gr = g.createLinearGradient(x, 0, x + d * 60, 0); gr.addColorStop(0, '#000'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(Math.min(x, x + d * 60), 0, 60, 1080); }
      const gb = g.createLinearGradient(0, 1080, 0, 1000); gb.addColorStop(0, '#000'); gb.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gb; g.fillRect(0, 1000, 1920, 80);
    } },
    { draw: (g, lt) => pixelIn(g, [96, 960, 560, 60], (lt - 0.6) / 0.5, 6, (c) => text(c, 'PRAXIS STUDIO / WHAT WE DO', 100, 1000, { size: 36, weight: 500, font: PIX, color: BONE, ls: 0.06 })) },
  ],
});

// 02 — TITLE. "Theory made real." on black; pixel-dissolve in with an Inchworm scan edge.
shot(2.6, {
  name: 'title', tin: { type: 'pixel', dur: 0.6, tile: 60, dir: 'lr', mix: 0.5, accent: INCH, band: 0.012 },
  layers: [{ draw: (g, lt) => {
    const y = 590;
    pixelIn(g, [380, 400, 1160, 260], (lt - 0.15) / 0.55, 20, (c) => {
      c.font = `500 150px ${NM}`; c.letterSpacing = '-4.5px';
      const a = 'Theory made ', b = 'real.'; const wa = c.measureText(a).width, wb = c.measureText(b).width; c.letterSpacing = '0px';
      const x0 = 960 - (wa + wb) / 2;
      text(c, a, x0, y, { size: 150, color: BONE, ls: -0.03 }); text(c, b, x0 + wa, y, { size: 150, color: INCH, ls: -0.03 });
    }, { dir: 'lr' });
    pixelIn(g, [700, 660, 520, 60], (lt - 0.55) / 0.4, 6, (c) => text(c, 'PRAXIS STUDIO · ISLAMABAD', 960, 700, { size: 36, font: PIX, align: 'center', color: BONE, ls: 0.08 }));
  } }],
});

// 03 — BRAND & CREATIVE (dark). Asymmetric diptych: Evolabs tablet film (wide, holds the centre) | Horizon case-study montage.
//      Both 4:5 with their footers cropped. Evolabs in at 4.75 s: skips the big client wordmark and a 2-frame black glitch at 4.60.
shot(3.6, {
  name: 'diptych-dark', tin: { type: 'pixel', dur: 0.5, tile: 60, dir: 'lr', mix: 0.4 },
  layers: [
    { clip: 'Evolabs Website', in: 4.75, box: [0, 0, 1100, 1080], src: [0, 0, 1080, 1215], zoom: [1.0, 1.06], focus: [0.5, 0.5] },
    { clip: 'Horizon evolabs', in: 2.1, box: [1108, 0, 812, 1080], src: [0, 0, 1080, 1215], zoom: [1.06, 1.0], focus: [0.5, 0.5] },
  ],
});

// 04 — PRODUCT DESIGN (dark). Triptych of vertical UI films; panels pixel in left → right.
shot(4.0, {
  name: 'triptych-dark',
  layers: [
    { clip: '4th video', in: 3.0, box: [0, 0, 634, 1080], focus: [0.5, 0.42], zoom: [1.0, 1.04], reveal: { at: 0.0, dur: 0.45, tile: 40, dir: 'lr' } },
    { clip: 'Calendar 2', in: 4.0, box: [643, 0, 634, 1080], focus: [0.5, 0.45], zoom: [1.0, 1.04], reveal: { at: 0.12, dur: 0.45, tile: 40, dir: 'lr' } },
    { clip: 'Boards', in: 5.0, box: [1286, 0, 634, 1080], focus: [0.5, 0.42], zoom: [1.0, 1.04], reveal: { at: 0.24, dur: 0.45, tile: 40, dir: 'lr' } },
  ],
});

// 05 — FULL FRAME, the turn to light. Shamel Budget 4K: 16:9 band through the laptop in its pink ring (downscaled, native-sharp).
shot(3.4, {
  name: 'budget-full', tin: { type: 'pixel', dur: 0.6, tile: 60, dir: 'c', mix: 0.45 },
  layers: [{ clip: 'Shamel Budget', in: 10.3, box: [0, 0, 1920, 1080], focus: [0.5, 0.5], zoom: [1.0, 1.05] }],
});

// 06 — PRODUCT DEPTH (light). Pastel triptych.
shot(4.2, {
  name: 'triptych-light', tin: { type: 'pixel', dur: 0.5, tile: 60, dir: 'lr', mix: 0.4 },
  layers: [
    { clip: 'Shamel All in One', in: 11.7, box: [0, 0, 634, 1080], focus: [0.5, 0.45], zoom: [1.0, 1.04] },
    { clip: 'Shamel Studio-Glinda', in: 9.1, box: [643, 0, 634, 1080], focus: [0.5, 0.4], zoom: [1.0, 1.04] },
    { clip: 'Link Props', in: 6.0, box: [1286, 0, 634, 1080], focus: [0.5, 0.45], zoom: [1.0, 1.04] },
  ],
  bg: '#000',
});

// 07 — WHAT WE DO, calm. Bone matte with the four services (pixel-in line by line) beside the Horizon map; stepped pixel edge.
const SERV = ['Strategy & consulting', 'Brand & creative', 'Web & digital', 'Campaigns & media'];
shot(4.4, {
  name: 'services-map', tin: { type: 'pixel', dur: 0.6, tile: 60, dir: 'lr', mix: 0.4 },
  layers: [
    { clip: 'Map Animation', in: 0.45, out: 4.85, box: [1220, 0, 700, 1080], src: [0, 470, 1080, 1020], focus: [0.56, 0.5], zoom: [1.02, 1.08] },
    { draw: (g, lt) => {
      // Bone matte with a stepped (pixel staircase) right edge that drifts slowly
      const T = 24, rows = Math.ceil(1080 / T);
      g.fillStyle = BONE; g.fillRect(0, 0, 1220, 1080);
      for (let j = 0; j < rows; j++) { const k = Math.round(1.5 + 1.5 * Math.sin(j * 0.45 + lt * 1.1)); g.fillRect(1220, j * T, k * T, T); }
      pixelIn(g, [400, 276, 600, 60], (lt - 0.2) / 0.4, 6, (c) => text(c, 'WHAT WE DO', 424, 318, { size: 36, font: PIX, color: INK, ls: 0.08 }));
      SERV.forEach((s, i) => {
        const y = 446 + i * 106;
        pixelIn(g, [400, y - 80, 800, 106], (lt - 0.35 - i * 0.22) / 0.5, 12, (c) => {
          text(c, '0' + (i + 1), 424, y, { size: 36, font: PIX, color: '#4E4F47', ls: 0.04 });
          text(c, s, 492, y, { size: 74, weight: 500, color: INK, ls: -0.03 });
        });
      });
    } },
  ],
});

// 08 — SIGN-OFF. Lockup on black, pixels in; then pixels out to black (the loop seam).
shot(3.4, {
  name: 'lockup', tin: { type: 'pixel', dur: 0.6, tile: 60, dir: 'lr', mix: 0.4 },
  layers: [{ draw: async (g, lt, sh) => {
    const im = await lockupImg(); const w = 860, h = w * 760 / 7095, x = 960 - w / 2, y = 540 - h / 2 - 20;
    const draw = (c) => { c.drawImage(im, x, y, w, h); text(c, 'Theory made real.', 960, y + h + 92, { size: 44, weight: 400, align: 'center', color: BONE, ls: -0.01 }); };
    const pin = (lt - 0.3) / 0.6, pout = (lt - (sh.dur - 0.75)) / 0.6;
    if (pout > 0) pixelOut(g, [x - 20, y - 20, w + 40, h + 160], pout, 16, draw); else pixelIn(g, [x - 20, y - 20, w + 40, h + 160], pin, 16, draw);
  } }],
});

// 09 — black hold, flows back into the opening reveal.
shot(0.5, { name: 'black', layers: [] });
