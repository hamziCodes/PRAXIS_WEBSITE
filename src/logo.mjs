// THE LOGO COMPONENT — one place for the Praxis logo.
// Every page inlines the symbols below once (sprite) and references them with <use href="#px-...">.
// To swap in official artwork later: replace MARK / WORD path data here (or point to new files) and rebuild.
// Geometry: Brand Book plate 1 (mark) and plates 2–3 (wordmark with the 4-petal star-x).
import { readFileSync } from 'node:fs';
const L = JSON.parse(readFileSync(new URL('./logo.json', import.meta.url), 'utf8'));

// Mark: centre square, four diagonal unit squares forming the X, eight satellites one step out (viewBox -45 -45 90 90)
const sq = (cx, cy, s) => `M${cx - s / 2} ${cy - s / 2}h${s}v${s}h-${s}z`;
export const MARK_PATH = [
  sq(0, 0, 20),
  ...[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b]) => sq(a * 15, b * 15, 15)),
  ...[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b]) => sq(a * 27.5, b * 27.5, 10)),
  ...[[0, -1], [0, 1], [-1, 0], [1, 0]].map(([a, b]) => sq(a * 40, b * 40, 10)),
].join('');

export const WORD_PATH = L.word;
export const STAR_PATH = L.star;
const CAP = L.capHeight; // 729
const WW = L.wordWidth;
const TOP = -745, HGT = 760; // wordmark box incl. overshoot
// Lockup: mark height = cap height, gap = 0.3 cap
const GAP = Math.round(CAP * 0.3);
const LW = CAP + GAP + WW;
export const sizes = { wordRatio: (WW + 20) / HGT, lockupRatio: (LW + 20) / HGT };

export const sprite = `<svg width="0" height="0" class="sr" aria-hidden="true" focusable="false"><defs>
<symbol id="px-mark" viewBox="-45 -45 90 90"><path d="${MARK_PATH}"/></symbol>
<symbol id="px-word" viewBox="-10 ${TOP} ${WW + 20} ${HGT}"><path d="${WORD_PATH}"/></symbol>
<symbol id="px-lockup" viewBox="-10 ${TOP} ${LW + 20} ${HGT}"><g transform="translate(${CAP / 2} ${-CAP / 2}) scale(${CAP / 90})"><path d="${MARK_PATH}"/></g><g transform="translate(${CAP + GAP} 0)"><path d="${WORD_PATH}"/></g></symbol>
<symbol id="px-star" viewBox="${L.starBox.join(' ')}"><path d="${STAR_PATH}"/></symbol>
<symbol id="i-arrow" viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"/></symbol>
<symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 4v16M4 12h16" fill="none" stroke="currentColor" stroke-width="2.2"/></symbol>
</defs></svg>`;

// Standalone production SVG files (written to /assets/logo/)
export const files = {
  'praxis-mark.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-45 -45 90 90"><path d="${MARK_PATH}"/></svg>`,
  'praxis-wordmark.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 ${TOP} ${WW + 20} ${HGT}"><path d="${WORD_PATH}"/></svg>`,
  'praxis-lockup.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 ${TOP} ${LW + 20} ${HGT}"><g transform="translate(${CAP / 2} ${-CAP / 2}) scale(${CAP / 90})"><path d="${MARK_PATH}"/></g><g transform="translate(${CAP + GAP} 0)"><path d="${WORD_PATH}"/></g></svg>`,
  'praxis-lockup-bone.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 ${TOP} ${LW + 20} ${HGT}" fill="#DFE0D0"><g transform="translate(${CAP / 2} ${-CAP / 2}) scale(${CAP / 90})"><path d="${MARK_PATH}"/></g><g transform="translate(${CAP + GAP} 0)"><path d="${WORD_PATH}"/></g></svg>`,
  'praxis-star-x.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${L.starBox.join(' ')}"><path d="${STAR_PATH}"/></svg>`,
};
// Favicon: mark on Bone, tested at 16px (satellites stay distinct at 2px+)
export const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 100 100"><rect x="-50" y="-50" width="100" height="100" rx="18" fill="#000"/><path d="${MARK_PATH}" fill="#B1FA63"/></svg>`;

export const use = (id, cls, label) => `<svg class="${cls}"${label ? ` role="img" aria-label="${label}"` : ' aria-hidden="true" focusable="false"'}><use href="#${id}"/></svg>`;
