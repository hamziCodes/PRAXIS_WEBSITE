// Praxis Studio — work artwork generator.
// Every project image is composed here as SVG from the project's brand block (colours, mark, type, copy).
// Art direction: warm paper and Bone grounds, black, Inchworm detail, pixel sprinkles, soft real shadows.
const W = 1600, H = 1100;
const BONE = '#DFE0D0', INCH = '#B1FA63', INK = '#000', GUN = '#243837', SNOW = '#FFFFFF';
const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";
const SERIF = "Georgia,'Times New Roman',serif";

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function rng(seed) { let h = 2166136261; for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296; }
const fontOf = (b) => (b.font === 'serif' ? SERIF : SANS);
const T = (x, y, s, fill, txt, o = {}) => `<text x="${x}" y="${y}" font-family="${o.f || SANS}" font-size="${s}" font-weight="${o.w || 700}" fill="${fill}"${o.a ? ` text-anchor="${o.a}"` : ''}${o.ls != null ? ` letter-spacing="${o.ls}"` : ''}${o.op ? ` opacity="${o.op}"` : ''}${o.it ? ' font-style="italic"' : ''}>${esc(txt)}</text>`;
const R = (x, y, w, h, fill, r = 0, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"${extra}/>`;
const SH = 'filter="url(#sh)"';
const svg = (body, bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><defs><filter id="sh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="26" stdDeviation="26" flood-color="#1b1b14" flood-opacity=".22"/></filter><filter id="sh2" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#1b1b14" flood-opacity=".18"/></filter></defs>${R(0, 0, W, H, bg)}${body}</svg>`;

// Praxis pixel sprinkle: a small cluster of squares (the studio's signature, kept quiet)
function pixels(x, y, u, color, rand, n = 7) {
  let s = ''; const cells = new Set();
  let cx = 0, cy = 0;
  for (let i = 0; i < n; i++) { cells.add(cx + ',' + cy); const d = Math.floor(rand() * 4); if (d === 0) cx++; else if (d === 1) cy++; else if (d === 2) cx--; else cy--; }
  for (const c of cells) { const [a, b] = c.split(',').map(Number); s += R(x + a * u, y + b * u, u, u, color); }
  return s;
}
// star-x petal motif (Praxis asterisk), centred at cx,cy, size = height
export function starX(cx, cy, size, fill) {
  const s = size / 100, P = [[0, 0], [-39, -9.6], [-48.7, -37.8], [-22, -50]];
  return [[1, 1], [-1, 1], [1, -1], [-1, -1]].map(([a, b]) => `<path d="M${P.map(([x, y]) => `${(cx + a * x * s).toFixed(1)} ${(cy + b * y * s).toFixed(1)}`).join('L')}Z" fill="${fill}" stroke="${fill}" stroke-width="${(2 * s).toFixed(1)}" stroke-linejoin="round"/>`).join('');
}

// ── Client marks, drawn in a 100×100 box at (x,y) scaled to size
export function mark(type, x, y, size, c, c2, seed = 'x') {
  const k = size / 100; const g = (inner) => `<g transform="translate(${x} ${y}) scale(${k})">${inner}</g>`;
  switch (type) {
    case 'pixel': { const r = rng(seed); let s = ''; for (let j = 0; j < 5; j++) for (let i = 0; i < 3; i++) if (r() > 0.45 || (i === 2 && j === 2)) { s += R(i * 20, j * 20, 20, 20, c); if (i < 2) s += R((4 - i) * 20, j * 20, 20, 20, c); } return g(s); }
    case 'ring': return g(`<circle cx="50" cy="50" r="38" fill="none" stroke="${c}" stroke-width="16"/><circle cx="50" cy="50" r="9" fill="${c2 || c}"/>`);
    case 'arch': return g(`<path d="M10 100V45a40 40 0 0 1 80 0v55z" fill="${c}"/><path d="M34 100V54a16 16 0 0 1 32 0v46z" fill="${c2}"/>`);
    case 'stack': return g(`${R(8, 12, 84, 20, c, 10)}${R(18, 40, 64, 20, c, 10)}${R(30, 68, 40, 20, c, 10)}`);
    case 'leaf': return g(`<path d="M50 96C14 76 8 36 50 4c42 32 36 72 0 92z" fill="${c}"/><path d="M50 22v66" stroke="${c2}" stroke-width="7" stroke-linecap="round"/>`);
    case 'wave': return g([20, 48, 76].map((yy) => `<path d="M6 ${yy}q11-14 22 0t22 0 22 0 22 0" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round"/>`).join(''));
    case 'sun': return g(`<path d="M14 70a36 36 0 0 1 72 0z" fill="${c}"/>${R(4, 80, 92, 9, c, 4)}${[-60, -30, 0, 30, 60].map((a) => `<rect x="47" y="2" width="6" height="18" rx="3" fill="${c}" transform="rotate(${a} 50 70)"/>`).join('')}`);
    case 'grid': return g([0, 1, 2].map((j) => [0, 1, 2].map((i) => ((i + j) % 2 === 0 ? R(i * 34, j * 34, 30, 30, c, 4) : R(i * 34 + 8, j * 34 + 8, 14, 14, c2 || c, 3))).join('')).join(''));
    case 'drop': return g(`<path d="M50 4C36 30 18 48 18 66a32 32 0 0 0 64 0C82 48 64 30 50 4z" fill="${c}"/><path d="M36 66a14 14 0 0 0 14 14" stroke="${c2}" stroke-width="7" fill="none" stroke-linecap="round"/>`);
    case 'bolt': return g(`<path d="M58 2L16 58h28l-6 40 46-58H54z" fill="${c}"/>`);
    case 'key': return g(`<circle cx="50" cy="34" r="30" fill="${c}"/><circle cx="50" cy="32" r="10" fill="${c2}"/>${R(42, 40, 16, 56, c, 4)}${R(58, 74, 16, 9, c, 3)}`);
    case 'peak': return g(`<path d="M2 92L40 30l18 28 12-16 28 50z" fill="${c}"/><path d="M52 14l10 8 10-8" stroke="${c2 || c}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);
    default: return g(R(10, 10, 80, 80, c, 12));
  }
}
// Mark + wordmark lockup. Returns [svg, width]
export function lockup(p, x, y, h, c, c2, align = 'start') {
  const b = p.brand; const name = b.font === 'serif' ? p.name.replace(/ (Festival|Hotels|Clinics|Stores|Home|Home Services|Water Programme|Tourism Board|Bank)$/, '') : p.name.replace(/ (Festival|Hotels|Clinics|Stores|Home Services|Water Programme|Tourism Board|Bank)$/, '');
  const word = b.font === 'serif' ? name : name.toUpperCase();
  const fs = h * 0.78; const ls = b.font === 'serif' ? 0 : fs * 0.02;
  const tw = word.length * fs * (b.font === 'serif' ? 0.52 : 0.64);
  const total = h + h * 0.32 + tw;
  const x0 = align === 'middle' ? x - total / 2 : x;
  return [mark(b.mark, x0, y, h, c, c2, p.slug) + T(x0 + h * 1.32, y + h * 0.82, fs, c, word, { f: fontOf(b), w: b.font === 'serif' ? 400 : 700, ls }), total];
}

// small UI lexicon per project for screens
const UI = {
  'saffa-stores': { t: 'Saffa Rewards', n: '2,450 pts', rows: ['Weekly offers', 'Find a store', 'Your card'] },
  kisima: { t: 'Water card', n: '120 kiosks', rows: ['Register household', 'Nearest kiosk', 'Opening dates'] },
  'costa-lume': { t: 'Winter walks', n: '14 routes', rows: ['Cliff path, 9 km', 'Long stays from €39', 'Plan your week'] },
  kitepay: { t: 'Send to Lahore', n: 'AED 1,500', rows: ['Arrives today, 4:10 pm', 'Fee AED 9', 'Track transfer'] },
  koffa: { t: 'Today\'s roast', n: 'No. 3', rows: ['Washed, Sidamo', 'Natural, Huila', 'House espresso'] },
  'aurel-hotels': { t: 'Aurel Karaköy', n: '7 houses', rows: ['Rooms & suites', 'Breakfast room', 'Book a stay'] },
  'tarazu-bank': { t: 'Balance', n: 'Rs 48,250', rows: ['Send money', 'Pay bills', 'Savings goal'] },
  lowtide: { t: 'Line-up', n: 'Day 2', rows: ['High tide 21:40', 'Main stage', 'Your pass'] },
  'cedarline-clinics': { t: 'Seen today', n: '12 min', rows: ['Next slot 2:40 pm', 'Queen St clinic', 'Book now'] },
  oleum: { t: 'Facial oil', n: '£28', rows: ['Rosehip & neroli', 'Dry, tired skin', 'Add to bag'] },
  ledgerly: { t: 'Today', n: '£412.60', rows: ['Sold £380 cash', 'Paid milk £64', 'All balanced'] },
  'kestrel-hotels': { t: 'Ask Kestrel', n: '24/7', rows: ['Airport transfer?', 'Late check-out', 'Compare rooms'] },
  'thread-and-loom': { t: 'Percale set', n: '$129', rows: ['400 thread count', 'Ships to UK & US', 'Add to cart'] },
  fixwell: { t: 'Plumber, Marina', n: '45 min', rows: ['Same-day visits', 'From AED 250', 'Call now'] },
  velour: { t: 'Drop 01', n: '300 pcs', rows: ['Velvet slip dress', 'Join the list', 'Vote: colour'] },
  'kora-home': { t: 'Opening', n: '3 km', rows: ['Living rooms', 'Delivery in 48 h', 'Get directions'] },
};
const ui = (p) => UI[p.slug] || { t: p.name, n: '24', rows: ['One', 'Two', 'Three'] };

function phoneShape(x, y, w, p, variant = 0) {
  const b = p.brand, u = ui(p), h = w * 2.05, r = w * 0.14, s = w / 360;
  let scr = '';
  const px = x + 14 * s, py = y + 14 * s, pw = w - 28 * s, ph = h - 28 * s;
  if (variant === 0) {
    scr = R(px, py, pw, ph * 0.46, b.bg, r * 0.8) + R(px, py + ph * 0.3, pw, ph * 0.16, b.bg) + lockup(p, px + 26 * s, py + 64 * s, 30 * s, b.ink, b.accent)[0] +
      T(px + 26 * s, py + 200 * s, 22 * s, b.ink, u.t, { w: 400, op: 0.85, f: fontOf(b) }) + T(px + 26 * s, py + 268 * s, 62 * s, b.ink, u.n, { f: fontOf(b), ls: -1 }) +
      u.rows.map((t, i) => R(px + 18 * s, py + ph * 0.5 + i * 92 * s, pw - 36 * s, 76 * s, SNOW, 18 * s) + R(px + 34 * s, py + ph * 0.5 + i * 92 * s + 20 * s, 36 * s, 36 * s, i === 0 ? b.accent : '#ECEBE4', 10 * s) + T(px + 86 * s, py + ph * 0.5 + i * 92 * s + 46 * s, 20 * s, '#1a1a1a', t, { w: 500 })).join('') +
      R(px + 18 * s, py + ph - 96 * s, pw - 36 * s, 64 * s, b.bg, 32 * s) + T(x + w / 2, py + ph - 56 * s, 20 * s, b.ink, u.rows[2], { a: 'middle' });
  } else if (variant === 1) {
    scr = T(px + 26 * s, py + 90 * s, 34 * s, '#111', u.t, { f: fontOf(b) }) + R(px + 18 * s, py + 120 * s, pw - 36 * s, 300 * s, b.bg, 22 * s) + mark(b.mark, px + pw / 2 - 60 * s, py + 210 * s, 120 * s, b.ink, b.accent, p.slug) +
      [0, 1, 2, 3].map((i) => R(px + 18 * s + i * ((pw - 36 * s) / 4), py + 450 * s, (pw - 36 * s) / 4 - 10 * s, 110 * s, i % 2 ? '#ECEBE4' : b.accent, 14 * s)).join('') +
      [0, 1, 2].map((i) => R(px + 18 * s, py + 590 * s + i * 40 * s, (pw - 36 * s) * (0.9 - i * 0.2), 16 * s, '#D9D8CF', 8 * s)).join('');
  } else {
    scr = R(px, py, pw, ph, b.bg, r * 0.8) + `<circle cx="${x + w / 2}" cy="${py + 260 * s}" r="${70 * s}" fill="${b.accent}"/>` + `<path d="M${x + w / 2 - 30 * s} ${py + 262 * s}l22 ${22 * s} 40 -${44 * s}" stroke="${b.bg}" stroke-width="${12 * s}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
      T(x + w / 2, py + 400 * s, 40 * s, b.ink, u.n, { a: 'middle', f: fontOf(b) }) + T(x + w / 2, py + 444 * s, 20 * s, b.ink, u.rows[0], { a: 'middle', w: 400, op: 0.8 }) +
      R(px + 30 * s, py + ph - 110 * s, pw - 60 * s, 64 * s, b.ink, 32 * s) + T(x + w / 2, py + ph - 70 * s, 20 * s, b.bg, 'Done', { a: 'middle' });
  }
  return `<g ${SH}>${R(x, y, w, h, '#111', r)}</g>${R(px, py, pw, ph, b.paper || '#F6F5EF', r * 0.8)}${scr}${R(x + w / 2 - 50 * s, y + 24 * s, 100 * s, 22 * s, '#111', 11 * s)}`;
}

function siteScreen(p, x, y, w, h) {
  const b = p.brand, u = ui(p), s = w / 1200;
  const nav = lockup(p, x + 40 * s, y + 30 * s, 34 * s, '#111', b.accent)[0] + ['Work', 'About', 'Contact'].map((t, i) => T(x + w - 380 * s + i * 120 * s, y + 56 * s, 20 * s, '#111', t, { w: 500 })).join('');
  const heroH = h * 0.62;
  const hero = R(x + 30 * s, y + 100 * s, w - 60 * s, heroH, b.bg, 22 * s) + T(x + 80 * s, y + 100 * s + heroH * 0.42, 74 * s, b.ink, b.tagline.split(' ').slice(0, 3).join(' '), { f: fontOf(b), ls: -2 }) +
    T(x + 80 * s, y + 100 * s + heroH * 0.42 + 84 * s, 74 * s, b.ink, b.tagline.split(' ').slice(3).join(' ') || ' ', { f: fontOf(b), ls: -2 }) +
    R(x + 80 * s, y + 100 * s + heroH - 120 * s, 230 * s, 64 * s, b.accent, 32 * s) + T(x + 195 * s, y + 100 * s + heroH - 79 * s, 22 * s, b.bg === b.accent ? b.ink : (b.font === 'serif' ? b.ink : '#111'), u.rows[2], { a: 'middle' }) +
    mark(b.mark, x + w - 400 * s, y + 100 * s + heroH / 2 - 150 * s, 300 * s, b.accent, b.ink, p.slug);
  const cards = [0, 1, 2].map((i) => R(x + 30 * s + i * ((w - 60 * s) / 3), y + 130 * s + heroH, (w - 60 * s) / 3 - 20 * s, h - heroH - 150 * s, i === 1 ? b.accent : '#ECEBE4', 18 * s) + T(x + 56 * s + i * ((w - 60 * s) / 3), y + 186 * s + heroH, 22 * s, '#111', u.rows[i], { w: 600 })).join('');
  return R(x, y, w, h, b.paper || SNOW) + nav + hero + cards;
}

const K = {
  identity(p, r) {
    const b = p.brand;
    const [lk] = lockup(p, W / 2, H / 2 - 90, 180, b.ink, b.accent, 'middle');
    return svg(lk + T(W / 2, H / 2 + 200, 40, b.ink, b.tagline, { a: 'middle', w: 400, f: fontOf(b), op: 0.85 }) + pixels(110, 120, 26, b.accent, r, 8) + pixels(W - 230, H - 210, 26, INCH, r, 6), b.bg);
  },
  bag(p, r) {
    const b = p.brand; let s = '';
    const roasts = [b.accent, '#9C3D1E', '#3C6E47'];
    [0, 1, 2].forEach((i) => {
      const x = 250 + i * 400, y = 230 + (i === 1 ? -30 : 20), w = 300, h = 600;
      s += `<g ${SH}><path d="M${x} ${y + 40}l14-40h${w - 28}l14 40v${h - 40}a14 14 0 0 1-14 14H${x + 14}a14 14 0 0 1-14-14z" fill="#C9A87C"/></g>`;
      s += R(x, y + 40, w, 10, '#00000018') + R(x + 34, y + 150, w - 68, 300, b.paper, 6) + mark(b.mark, x + w / 2 - 50, y + 180, 100, b.bg, b.accent, p.slug);
      s += T(x + w / 2, y + 340, 40, b.bg, p.name.toUpperCase(), { a: 'middle', ls: 2 }) + R(x + 34, y + 370, w - 68, 54, roasts[i]) + T(x + w / 2, y + 405, 22, SNOW, ['LIGHT', 'MEDIUM', 'DARK'][i] + ' ROAST', { a: 'middle', ls: 3 });
      s += T(x + w / 2, y + 520, 18, '#5b4630', ['Washed, Sidamo', 'Natural, Huila', 'House espresso'][i], { a: 'middle', w: 500 });
    });
    return svg(s + pixels(120, 900, 22, INCH, r, 6), b.paper);
  },
  cups(p, r) {
    const b = p.brand; let s = '';
    const cup = (x, y, sc, c) => `<g transform="translate(${x} ${y}) scale(${sc})"><g ${SH}><path d="M0 0h260l-26 380H26z" fill="${c}"/></g>${R(-12, -34, 284, 42, '#1d1d1d', 10)}<path d="M14 120h232l-10 140H24z" fill="${b.bg}"/>${mark(b.mark, 100, 150, 60, b.accent, b.ink, p.slug)}</g>`;
    s += cup(380, 330, 1.25, b.paper) + cup(860, 420, 1, SNOW);
    s += `<g ${SH}><ellipse cx="1290" cy="820" rx="190" ry="60" fill="${SNOW}"/></g><ellipse cx="1290" cy="770" rx="130" ry="44" fill="${b.paper}"/><ellipse cx="1290" cy="770" rx="104" ry="32" fill="#5a3a22"/><path d="M1260 768c10-12 50-12 60 0" stroke="#e8cfa9" stroke-width="6" fill="none"/>`;
    return svg(s + pixels(140, 140, 24, INCH, r, 7), BONE);
  },
  phone(p, r) { const b = p.brand; return svg(R(860, 0, 740, H, b.bg) + phoneShape(420, 120, 400, p, 0) + mark(b.mark, 1080, 330, 300, b.accent, b.ink, p.slug) + T(1230, 760, 40, b.ink, b.tagline, { a: 'middle', w: 400, f: fontOf(b) }) + pixels(120, 860, 22, INCH, r, 6), BONE); },
  phones(p, r) { const b = p.brand; return svg(phoneShape(230, 160, 340, p, 1) + phoneShape(630, 90, 340, p, 0) + phoneShape(1030, 160, 340, p, 2) + pixels(1440, 120, 22, INCH, r, 6), b.paper === SNOW ? BONE : b.paper); },
  laptop(p, r) {
    const b = p.brand; const x = 260, y = 130, w = 1080, h = 680;
    return svg(`<g ${SH}>${R(x - 20, y - 20, w + 40, h + 40, '#1a1a1a', 26)}</g>` + siteScreen(p, x, y, w, h) + `<path d="M${x - 160} ${y + h + 30}h${w + 320}l-50 46H${x - 110}z" fill="#c9c9c2"/>` + R(x + w / 2 - 90, y + h + 30, 180, 12, '#a9a9a2', 6) + pixels(110, 110, 22, INCH, r, 6), BONE);
  },
  browser(p, r) {
    const b = p.brand; const x = 170, y = 110, w = 1260, h = 860;
    return svg(`<g ${SH}>${R(x, y, w, h, SNOW, 22)}</g>` + R(x, y, w, 54, '#ECEBE4', 22) + R(x, y + 30, w, 24, '#ECEBE4') + [0, 1, 2].map((i) => `<circle cx="${x + 30 + i * 26}" cy="${y + 27}" r="8" fill="#cfcfc6"/>`).join('') + R(x + 130, y + 14, 420, 26, SNOW, 13) + T(x + 150, y + 33, 15, '#777', p.slug.replace(/-/g, '') + '.com', { w: 400 }) + siteScreen(p, x, y + 54, w, h - 54) + pixels(1460, 900, 22, INCH, r, 6), b.bg);
  },
  poster(p, r) {
    const b = p.brand; let s = R(0, 820, W, 280, '#cfcfc2');
    const words = b.tagline.replace(/\.$/, '').split(' ');
    [0, 1, 2].forEach((i) => {
      const x = 170 + i * 440, y = 120, w = 380, h = 560; const bg = [b.bg, b.paper, b.accent][i]; const fg = i === 0 ? b.ink : b.bg === b.paper ? b.ink : b.bg;
      s += `<g ${SH}>${R(x, y, w, h, bg)}</g>`;
      if (i === 0) s += words.map((wd, j) => T(x + 30, y + 110 + j * 74, 72, fg, wd, { f: fontOf(b), ls: -2 })).join('') + lockup(p, x + 30, y + h - 70, 34, fg, b.accent)[0];
      if (i === 1) s += mark(b.mark, x + 70, y + 90, 240, b.bg, b.accent, p.slug) + T(x + w / 2, y + 420, 34, fg, p.name.toUpperCase(), { a: 'middle', ls: 2 }) + T(x + w / 2, y + 470, 20, fg, p.location, { a: 'middle', w: 400 });
      if (i === 2) s += pixels(x + 70, y + 120, 48, fg, r, 10) + T(x + 30, y + h - 60, 40, fg, ui(p).n, { f: fontOf(b) });
    });
    return svg(s + R(0, 818, W, 4, '#00000014'), '#E8E6DA');
  },
  cards(p, r) {
    const b = p.brand; let s = '';
    s += `<g ${SH} transform="rotate(-6 560 560)">${R(260, 220, 600, 800, SNOW, 6)}</g>` + `<g transform="rotate(-6 560 560)">${lockup(p, 320, 280, 40, b.bg, b.accent)[0]}${[0, 1, 2, 3, 4, 5, 6].map((i) => R(320, 420 + i * 34, 380 - (i % 3) * 60, 12, '#e3e2da', 6)).join('')}${R(320, 900, 120, 10, b.accent, 5)}</g>`;
    s += `<g ${SH} transform="rotate(8 1150 520)">${R(930, 330, 520, 300, b.bg, 16)}</g><g transform="rotate(8 1150 520)">${mark(b.mark, 970, 380, 90, b.ink, b.accent, p.slug)}${T(970, 590, 26, b.ink, p.testimonial.name, { w: 600 })}</g>`;
    s += `<g ${SH} transform="rotate(-3 1150 820)">${R(900, 680, 520, 300, b.paper === SNOW ? BONE : b.paper, 16)}</g><g transform="rotate(-3 1150 820)">${lockup(p, 940, 730, 38, b.bg, b.accent)[0]}${T(940, 930, 20, b.bg, 'hello@' + p.slug.replace(/-/g, '') + '.com', { w: 400 })}</g>`;
    return svg(s + pixels(1400, 120, 22, INCH, r, 7), BONE);
  },
  social(p, r) {
    const b = p.brand; let s = ''; const sz = 290, gap = 18, x0 = (W - (sz * 3 + gap * 2)) / 2 - 220, y0 = (H - (sz * 3 + gap * 2)) / 2;
    const words = b.tagline.split(' ');
    for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) {
      const k = j * 3 + i, x = x0 + i * (sz + gap), y = y0 + j * (sz + gap);
      const kind = k % 4; const bg = [b.bg, b.paper, b.accent, '#2b2b27'][kind];
      s += R(x, y, sz, sz, bg, 10);
      if (kind === 0) s += mark(b.mark, x + sz / 2 - 60, y + sz / 2 - 60, 120, b.ink, b.accent, p.slug);
      if (kind === 1) s += T(x + 24, y + sz - 40, 44, b.bg, words[k % words.length], { f: fontOf(b), ls: -1 });
      if (kind === 2) s += T(x + 24, y + 70, 56, b.bg, ui(p).n, { f: fontOf(b), ls: -1 }) + T(x + 24, y + sz - 30, 18, b.bg, ui(p).rows[k % 3], { w: 500 });
      if (kind === 3) s += pixels(x + 70, y + 70, 30, [b.accent, INCH][k % 2], r, 9);
    }
    s += `<g ${SH}>${R(1150, 240, 330, 620, SNOW, 26)}</g>` + `<circle cx="1220" cy="310" r="30" fill="${b.bg}"/>` + mark(b.mark, 1202, 292, 36, b.ink, b.accent, p.slug) + T(1266, 304, 20, '#111', p.slug.replace(/-/g, ''), { w: 700 }) + T(1266, 330, 16, '#777', p.location, { w: 400 }) + R(1170, 360, 290, 290, b.bg, 6) + T(1190, 610, 34, b.ink, b.tagline.split(' ').slice(0, 2).join(' '), { f: fontOf(b) }) + R(1170, 680, 200, 14, '#e3e2da', 7) + R(1170, 708, 250, 14, '#e3e2da', 7) + `<path d="M1186 780c0-14 22-14 22 0 0-14 22-14 22 0 0 18-22 30-22 30s-22-12-22-30z" fill="#e0484f"/>`;
    return svg(s, BONE);
  },
  billboard(p, r) {
    const b = p.brand; let s = R(0, 760, W, 340, '#b7b6aa') + R(0, 900, W, 10, '#e7e6dc');
    s += [[60, 420, 260], [340, 300, 200], [1280, 360, 260]].map(([x, y, w]) => R(x, y, w, 760 - y, '#c9c8bb') + [0, 1, 2, 3, 4].map((k) => R(x + 30, y + 40 + k * 64, w - 60, 28, '#d6d5c9', 4)).join('')).join('');
    s += R(760, 560, 22, 200, '#55554e') + R(860, 560, 22, 200, '#55554e');
    s += `<g ${SH}>${R(520, 200, 640, 380, b.bg, 4)}</g>` + T(560, 330, 76, b.ink, b.tagline.split(' ').slice(0, 2).join(' '), { f: fontOf(b), ls: -2 }) + T(560, 410, 76, b.ink, b.tagline.split(' ').slice(2).join(' ') || ' ', { f: fontOf(b), ls: -2 }) + lockup(p, 560, 480, 52, b.ink, b.accent)[0] + R(1060, 200, 100, 380, b.accent, 0);
    return svg(`<rect width="${W}" height="760" fill="#d9e4e4"/>` + s + pixels(1380, 120, 22, INCH, r, 6), '#d9e4e4');
  },
  deck(p, r) {
    const b = p.brand; const x = 180, y = 160, w = 1240, h = 780;
    let s = `<g ${SH}>${R(x, y, w, h, SNOW, 10)}</g>` + R(x + w / 2 - 1, y, 2, h, '#e5e4dc');
    s += R(x + 50, y + 50, w / 2 - 100, h - 100, b.bg, 6) + T(x + 90, y + 160, 26, b.ink, p.sub, { w: 500, op: 0.9 }) + T(x + 90, y + 270, 64, b.ink, p.name.split(' ')[0], { f: fontOf(b), ls: -2 }) + mark(b.mark, x + 90, y + h - 260, 140, b.accent, b.ink, p.slug);
    const rx = x + w / 2 + 60; s += T(rx, y + 120, 30, '#111', 'What we found', { f: fontOf(b) });
    p.results.slice(0, 3).forEach((t, i) => { s += starX(rx + 14, y + 200 + i * 110, 26, b.bg) + T(rx + 46, y + 210 + i * 110, 21, '#222', t.length > 46 ? t.slice(0, 44) + '…' : t, { w: 400 }); });
    s += [0.5, 0.8, 0.35, 0.95, 0.6].map((v, i) => R(rx + i * 90, y + h - 70 - 220 * v, 60, 220 * v, i === 3 ? b.bg : '#d9d8cf', 4)).join('');
    return svg(s + pixels(90, 940, 22, INCH, r, 6), BONE);
  },
  report(p, r) {
    const b = p.brand; const x = 160, y = 130, w = 1280, h = 840; let s = `<g ${SH}>${R(x, y, w, h, SNOW, 26)}</g>`;
    s += lockup(p, x + 50, y + 44, 36, '#111', b.accent)[0] + T(x + w - 50, y + 74, 18, '#777', 'Monthly report', { a: 'end', w: 400 });
    const m = p.metric || { value: ui(p).n, label: p.results[0] };
    s += R(x + 50, y + 130, 480, 300, b.bg, 18) + T(x + 90, y + 290, 92, b.ink, m.value, { f: fontOf(b), ls: -3 }) + T(x + 90, y + 360, 20, b.ink, m.label.length > 40 ? m.label.slice(0, 40) + '…' : m.label, { w: 400 });
    let d = 'M0 0'; const pts = []; for (let i = 0; i <= 12; i++) pts.push([i * 54, 220 - (i * 14 + r() * 40)]); d = 'M' + pts.map((q) => q.join(' ')).join('L');
    s += `<g transform="translate(${x + 580} ${y + 150})">${[0, 1, 2, 3].map((k) => R(0, k * 70, 650, 1, '#e5e4dc')).join('')}<path d="${d}" fill="none" stroke="${b.bg}" stroke-width="6" stroke-linejoin="round"/><path d="${d}L648 260L0 260z" fill="${b.accent}" opacity=".25"/></g>`;
    s += [0, 1, 2].map((i) => R(x + 50 + i * 400, y + 480, 380, 310, '#F3F2EC', 18) + T(x + 80 + i * 400, y + 530, 18, '#555', ui(p).rows[i], { w: 500 }) + [0.4, 0.7, 0.5, 0.9, 0.65, 0.8].map((v, k) => R(x + 80 + i * 400 + k * 52, y + 760 - 180 * v, 34, 180 * v, k === 3 ? b.bg : '#d6d5cb', 4)).join('')).join('');
    return svg(s, BONE);
  },
  pattern(p, r) {
    const b = p.brand; let s = ''; const u = 200;
    for (let j = 0; j < 6; j++) for (let i = 0; i < 8; i++) { const k = (i + j * 3) % 5; const x = i * u, y = j * u; if (k === 0) s += R(x, y, u, u, b.accent); if (k === 2) s += mark(b.mark, x + 40, y + 40, 120, b.ink, b.accent, p.slug); if (k === 4) s += R(x + 70, y + 70, 60, 60, b.ink); }
    s += pixels(1240, 880, 40, INCH, r, 7);
    return svg(s, b.bg);
  },
  sign(p, r) {
    const b = p.brand; let s = R(0, 0, W, 860, '#cfcabd') + R(0, 860, W, 240, '#9d9a90');
    s += R(220, 160, 1160, 700, '#e9e6dc') + R(220, 160, 1160, 160, b.bg) + lockup(p, 800, 200, 80, b.ink, b.accent, 'middle')[0];
    s += `<path d="M220 320h1160l-40 80H260z" fill="${b.accent}"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M${260 + i * 135} 400l67 -80 68 80z" fill="${i % 2 ? b.accent : b.paper}" opacity=".9"/>`).join('');
    s += R(300, 460, 420, 400, '#3a3a34', 4) + R(316, 476, 388, 384, '#5d6a68') + R(820, 460, 480, 300, '#3a3a34', 4) + R(836, 476, 448, 268, '#6e7b78') + T(1060, 640, 40, b.paper, ui(p).t, { a: 'middle', f: fontOf(b) });
    s += `<g ${SH}>${R(1420, 360, 140, 140, b.bg, 70)}</g>` + mark(b.mark, 1450, 390, 80, b.ink, b.accent, p.slug) + R(1380, 420, 40, 10, '#3a3a34');
    return svg(s + pixels(80, 920, 22, INCH, r, 6), '#cfcabd');
  },
  tote(p, r) {
    const b = p.brand;
    let s = `<path d="M640 330c0-200 320-200 320 0" stroke="#d9cdb4" stroke-width="30" fill="none"/>` + `<g ${SH}>${R(480, 320, 640, 700, '#efe6d2', 8)}</g>` + mark(b.mark, 700, 470, 200, b.bg, b.accent, p.slug) + T(800, 790, 56, b.bg, p.name.split(' ')[0].toUpperCase(), { a: 'middle', ls: 4 }) + T(800, 850, 24, b.bg, b.tagline, { a: 'middle', w: 400, f: fontOf(b) });
    return svg(s + pixels(1250, 200, 26, b.accent, r, 8), BONE);
  },
  bottle(p, r) {
    const b = p.brand; let s = R(0, 820, W, 280, '#d8cdb9');
    const bottle = (x, y, sc, c) => `<g transform="translate(${x} ${y}) scale(${sc})"><g ${SH}>${R(0, 120, 200, 380, c, 30)}</g>${R(60, 40, 80, 90, '#222', 10)}${R(84, -40, 32, 90, '#2b2b2b', 14)}${R(20, 230, 160, 200, b.paper, 6)}${mark(b.mark, 70, 250, 60, b.ink === '#2F3A2F' ? b.ink : b.bg, b.accent, p.slug)}${T(100, 360, 26, '#2F3A2F', p.name.toUpperCase(), { a: 'middle', ls: 3 })}${T(100, 395, 15, '#2F3A2F', 'Rosehip & neroli', { a: 'middle', w: 400 })}</g>`;
    s += bottle(420, 300, 1.05, '#A0703C') + bottle(760, 240, 1.25, '#7d5a2c');
    s += `<g ${SH}><ellipse cx="1240" cy="790" rx="150" ry="40" fill="#cfc4ae"/>${R(1090, 640, 300, 150, b.paper, 20)}</g>${R(1090, 620, 300, 50, b.accent, 16)}` + T(1240, 740, 24, '#2F3A2F', 'BALM', { a: 'middle', ls: 6 });
    return svg(s + pixels(150, 140, 22, INCH, r, 6), b.bg);
  },
  pass(p, r) {
    const b = p.brand; let s = '';
    [[-8, 330, 140, b.accent], [4, 760, 120, b.paper], [12, 1150, 160, INCH]].forEach(([rot, cx, y, c], i) => {
      s += `<g transform="rotate(${rot} ${cx} 560)"><path d="M${cx} 0V${y + 40}" stroke="${b.accent}" stroke-width="24"/><g ${SH}>${R(cx - 170, y, 340, 520, c, 18)}</g>${R(cx - 40, y + 26, 80, 18, '#00000030', 9)}${T(cx, y + 140, 30, b.bg, ['DAY 1', 'DAY 2', 'ARTIST'][i], { a: 'middle', ls: 3 })}${T(cx, y + 250, 92, b.bg, ['FRI', 'SAT', 'ALL'][i], { a: 'middle', ls: -2 })}${mark(b.mark, cx - 50, y + 300, 100, b.bg, b.bg, p.slug)}${T(cx, y + 470, 20, b.bg, 'LOWTIDE', { a: 'middle', ls: 6 })}</g>`;
    });
    s += `<path d="M120 980c300-60 1060-60 1360 0" stroke="${b.accent}" stroke-width="34" fill="none"/>`;
    return svg(s, b.bg);
  },
  chat(p, r) {
    const b = p.brand; const x = 160, y = 110, w = 1280, h = 880; let s = `<g ${SH}>${R(x, y, w, h, SNOW, 22)}</g>` + siteScreen(p, x, y, w * 0.58, h).replace(/<rect x="[^"]+" y="[^"]+" width="[^"]+" height="[^"]+" rx="0" fill="[^"]+"\/>/, '');
    const cx = x + w * 0.6, cw = w * 0.38;
    s += R(cx, y + 30, cw, h - 60, '#F3F2EC', 18) + R(cx, y + 30, cw, 80, b.bg, 18) + R(cx, y + 90, cw, 20, b.bg) + mark(b.mark, cx + 24, y + 50, 40, b.ink, b.accent, p.slug) + T(cx + 80, y + 80, 22, b.ink, ui(p).t, { w: 700 });
    const msgs = p.slug === 'ledgerly' ? [[1, 'Sold £380 cash, paid the milk supplier £64'], [0, 'Got it. Sales £380, purchases £64.'], [0, 'Was the milk on the usual account?'], [1, 'Yes'], [0, 'Done. Today is balanced.']] : [[1, 'Do you have airport transfers?'], [0, 'Yes. A car meets you at arrivals, 45 minutes to the hotel.'], [0, 'Shall I add one to your booking?'], [1, 'Yes, landing at 22:10'], [0, 'Booked. Your driver will hold a sign.']];
    let yy = y + 160; msgs.forEach(([me, t]) => { const tw = Math.min(cw - 80, t.length * 10.5 + 40); const bx = me ? cx + cw - 24 - tw : cx + 24; s += R(bx, yy, tw, 56, me ? b.bg : SNOW, 18) + T(bx + 20, yy + 35, 17, me ? b.ink : '#222', t.length > 44 ? t.slice(0, 43) + '…' : t, { w: 400 }); yy += 76; });
    s += R(cx + 20, y + h - 110, cw - 40, 56, SNOW, 28) + T(cx + 46, y + h - 74, 17, '#999', 'Ask anything', { w: 400 }) + `<circle cx="${cx + cw - 52}" cy="${y + h - 82}" r="20" fill="${b.accent}"/>`;
    return svg(s, BONE);
  },
  search(p, r) {
    const b = p.brand; let s = `<g ${SH}>${R(220, 120, 1160, 860, SNOW, 22)}</g>` + R(270, 170, 700, 60, '#F3F2EC', 30) + T(310, 210, 22, '#333', 'plumber near me dubai marina', { w: 400 });
    s += R(270, 270, 1060, 250, '#F6F7F2', 18) + starX(310, 312, 30, INCH) + T(340, 322, 20, '#111', 'Answer', { w: 700 }) + T(300, 380, 22, '#222', 'Fixwell Home Services offers same-day plumbing in Dubai Marina,', { w: 400 }) + T(300, 416, 22, '#222', 'usually within 45 minutes, from AED 250 per visit.', { w: 400 }) + R(300, 450, 220, 40, SNOW, 20) + T(320, 477, 16, '#555', 'fixwell.ae/plumbing/marina', { w: 400 });
    [0, 1, 2].forEach((i) => { const yy = 570 + i * 130; s += (i === 0 ? mark(b.mark, 270, yy, 34, b.ink, b.bg, p.slug) : '') + T(i === 0 ? 320 : 270, yy + 26, 24, i === 0 ? '#1a3fa8' : '#1a3fa8', ['Fixwell Home Services · Plumber in Dubai Marina', 'Emergency plumbing: what to do first', 'Water heater repair, Marina & JBR'][i], { w: 500 }) + R(270, yy + 50, 900 - i * 120, 14, '#e5e4dc', 7) + R(270, yy + 76, 700 - i * 80, 14, '#e5e4dc', 7); });
    return svg(s + `<g ${SH}>${R(1240, 640, 220, 380, b.bg, 30)}</g>` + T(1350, 820, 46, b.ink, '45', { a: 'middle' }) + T(1350, 860, 20, b.ink, 'min', { a: 'middle', w: 400 }) + pixels(90, 120, 22, INCH, r, 6), BONE);
  },
  radio(p, r) {
    const b = p.brand; let s = `<g ${SH}>${R(200, 160, 760, 780, SNOW, 18)}</g>` + T(250, 240, 20, '#777', 'RADIO :30 — EVENING DRIVE', { w: 500, ls: 2 }) + T(250, 320, 48, '#111', '"Three kilometres.', { f: fontOf(b) }) + T(250, 380, 48, '#111', 'One room. One visit."', { f: fontOf(b) });
    [0, 1, 2, 3, 4, 5].forEach((i) => { s += R(250, 450 + i * 40, 640 - (i % 3) * 80, 14, '#e5e4dc', 7); });
    s += lockup(p, 250, 800, 50, '#111', b.accent)[0];
    let wv = ''; for (let i = 0; i < 70; i++) { const hh = 20 + Math.abs(Math.sin(i * 0.5) * 120 * r()) + r() * 60; wv += R(1040 + i * 7, 550 - hh / 2, 4, hh, i < 40 ? b.bg : '#b9b8ad', 2); }
    s += `<g ${SH}>${R(1010, 330, 540, 440, b.paper, 18)}</g>` + wv + T(1040, 400, 26, '#111', 'FM 101.3 · 18:00', { w: 600 }) + `<circle cx="1080" cy="710" r="34" fill="${b.bg}"/><path d="M1070 694v32l26-16z" fill="${b.ink}"/>`;
    return svg(s, BONE);
  },
  swatch(p, r) {
    const b = p.brand; let s = '';
    const cols = [[b.bg, b.ink], [b.accent, b.bg], [b.paper, b.bg], ['#1a1a1a', '#fff']];
    cols.forEach(([c, t], i) => { s += `<g ${SH}>${R(140 + i * 250, 180, 220, 520, c, 14)}</g>` + T(166 + i * 250, 650, 22, t, c.toUpperCase(), { w: 500 }); });
    s += `<g ${SH}>${R(1150, 180, 320, 520, SNOW, 14)}</g>` + T(1310, 470, 220, '#111', 'Aa', { a: 'middle', f: fontOf(b), w: b.font === 'serif' ? 400 : 700 }) + T(1310, 640, 20, '#555', b.font === 'serif' ? 'Serif display' : 'Grotesk bold', { a: 'middle', w: 400 });
    s += lockup(p, 140, 820, 90, '#111', b.accent)[0] + pixels(1350, 820, 26, INCH, r, 7);
    return svg(s, BONE);
  },
};

// Project hero: the client's identity on its own ground, with the featured application framed beside it
export function heroArt(p) {
  const b = p.brand, r = rng(p.slug + 'hero');
  const inner = artFor(p, p.gallery[0], 0).replace('<svg xmlns="http://www.w3.org/2000/svg" ', '<svg ').replace(/ width="1600" height="1100"/, '');
  const words = b.tagline.replace(/\.$/, '').split(' '); const lines = []; let cur = '';
  words.forEach((w) => { if ((cur + ' ' + w).trim().length > 12 && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }); lines.push(cur + '.');
  const fx = 640, fy = 180, fw = 860, fh = 860 * 1100 / 1600;
  return svg(
    lockup(p, 110, 120, 64, b.ink, b.accent)[0] +
    lines.map((l, k) => T(110, 420 + k * 84, 80, b.ink, l, { f: fontOf(b), w: b.font === 'serif' ? 400 : 700, ls: -2.5 })).join('') +
    T(110, 960, 24, b.ink, p.location, { w: 400, op: 0.75 }) +
    `<clipPath id="hc"><rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" rx="22"/></clipPath><g ${SH}>${R(fx, fy, fw, fh, b.paper, 22)}</g><g clip-path="url(#hc)"><svg x="${fx}" y="${fy}" width="${fw}" height="${fh}" ${inner.slice(5)}</g>` +
    pixels(1420, 90, 22, INCH, r, 6), b.bg);
}

export function artFor(p, kind, i = 0) {
  const r = rng(p.slug + kind + i);
  return (K[kind] || K.identity)(p, r);
}
export const artKinds = Object.keys(K);

// Client logo for the logo wall (single colour, transparent)
export function clientLogoSvg(p, color = '#000') {
  const [g, w] = lockup(p, 0, 0, 60, color, '#DFE0D0');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 ${Math.ceil(w) + 8} 68" width="${Math.ceil(w) + 8}" height="68">${g}</svg>`;
}
