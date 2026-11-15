// Shared drawing helpers: canvases, easing, square-tile (pixel) masks.
export const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); return [c, g]; };
export const hash = (i, j, s = 0) => { let h = (i * 374761393 + j * 668265263 + s * 2147483647) | 0; h = (h ^ (h >>> 13)) * 1274126177 | 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
export const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const easeOut = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(1 - x, 3));

// Tile mask: a tile is "on" when progress passes its threshold. Threshold mixes a per-tile random value with a direction ramp,
// so the dissolve reads as square pixels sweeping across (stepped edge), not a uniform fade.
export function tileMask(g, box, tile, p, { dir = 'lr', mix = 0.55, seed = 1, accent = null, band = 0.05 } = {}) {
  const [x0, y0, w, h] = box; const cols = Math.ceil(w / tile), rows = Math.ceil(h / tile);
  const on = [], edge = [];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const r = hash(i, j, seed);
    const ramp = dir === 'lr' ? i / cols : dir === 'rl' ? 1 - i / cols : dir === 'tb' ? j / rows : dir === 'bt' ? 1 - j / rows
      : dir === 'c' ? Math.hypot((i + 0.5) / cols - 0.5, ((j + 0.5) / rows - 0.5) * rows / cols) * 1.6 : r;
    const thr = (1 - mix) * ramp + mix * r; // 0..1
    const q = p * (1 + band) ; // make sure p=1 covers everything
    if (thr < q - band) on.push([i, j]); else if (thr < q) edge.push([i, j]);
  }
  return { on, edge, cols, rows, x0, y0, tile };
}
export function drawMask(g, m, color = '#fff', edgeColor = null) {
  g.fillStyle = color;
  for (const [i, j] of m.on) g.fillRect(m.x0 + i * m.tile, m.y0 + j * m.tile, m.tile, m.tile);
  if (edgeColor !== false) { g.fillStyle = edgeColor || color; for (const [i, j] of m.edge) g.fillRect(m.x0 + i * m.tile, m.y0 + j * m.tile, m.tile, m.tile); }
}

