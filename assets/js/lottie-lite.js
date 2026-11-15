/* Praxis — lottie-lite: a small Lottie (Bodymovin JSON) player for single-colour line icons.
   Supports what the service icons use: precomps (with time remap), shape layers, groups, animated paths,
   strokes and fills, keyframed transforms (incl. spatial beziers), parenting, null layers, alpha / inverted-alpha
   track mattes. Everything is drawn in ONE colour — the canvas's CSS `color` — so icons stay plain line work.
   Usage: <canvas data-lottie="path/to/icon.json"></canvas>. Swap an icon by replacing its JSON file. */
(() => {
  'use strict';
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── keyframes
  const bez = (x1, y1, x2, y2) => {
    const A = (a, b) => 1 - 3 * b + 3 * a, B = (a, b) => 3 * b - 6 * a, C = (a) => 3 * a;
    const f = (t, a, b) => ((A(a, b) * t + B(a, b)) * t + C(a)) * t;
    const d = (t, a, b) => 3 * A(a, b) * t * t + 2 * B(a, b) * t + C(a);
    return (x) => {
      if (x <= 0 || x >= 1) return x;
      let t = x;
      for (let i = 0; i < 8; i++) { const s = d(t, x1, x2); if (Math.abs(s) < 1e-6) break; t -= (f(t, x1, x2) - x) / s; }
      if (t < 0 || t > 1) { let lo = 0, hi = 1; t = x; for (let i = 0; i < 30; i++) { const v = f(t, x1, x2); if (Math.abs(v - x) < 1e-5) break; if (v < x) lo = t; else hi = t; t = (lo + hi) / 2; } }
      return f(t, y1, y2);
    };
  };
  const first = (v) => (Array.isArray(v) ? v[0] : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const lerpV = (a, b, t) => (Array.isArray(a) ? a.map((v, i) => lerpV(v, b[i], t)) : typeof a === 'number' ? lerp(a, b, t) : lerpShape(a, b, t));
  const lerpShape = (a, b, t) => ({ c: a.c, v: lerpV(a.v, b.v, t), i: lerpV(a.i, b.i, t), o: lerpV(a.o, b.o, t) });
  const unwrap = (s) => (Array.isArray(s) && s.length === 1 && s[0] && typeof s[0] === 'object' && !Array.isArray(s[0]) ? s[0] : s);
  function val(p, f) {
    if (!p) return undefined;
    if (!p.a) return p.k;
    const k = p.k;
    if (f <= k[0].t) return unwrap(k[0].s);
    for (let n = 0; n < k.length - 1; n++) {
      const a = k[n], b = k[n + 1];
      if (f >= b.t) continue;
      const s0 = unwrap(a.s), s1 = unwrap(b.s !== undefined ? b.s : a.e);
      if (a.h === 1) return s0;
      const e = a.__e || (a.__e = a.o && a.i ? bez(first(a.o.x), first(a.o.y), first(a.i.x), first(a.i.y)) : (x) => x);
      const t = e((f - a.t) / (b.t - a.t));
      if (a.to && a.ti && Array.isArray(s0)) { // spatial bezier (motion path)
        const c1 = s0.map((v, i) => v + (a.to[i] || 0)), c2 = s1.map((v, i) => v + (a.ti[i] || 0)), u = 1 - t;
        return s0.map((v, i) => u * u * u * v + 3 * u * u * t * c1[i] + 3 * u * t * t * c2[i] + t * t * t * s1[i]);
      }
      return lerpV(s0, s1, t);
    }
    const L = k[k.length - 1]; return unwrap(L.s !== undefined ? L.s : k[k.length - 2].e);
  }

  // ── transforms (2D affine as [a,b,c,d,e,f])
  const mul = (m, n) => [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]];
  function trMatrix(t, f) {
    if (!t) return [1, 0, 0, 1, 0, 0];
    const a = val(t.a, f) || [0, 0], s = val(t.s, f) || [100, 100];
    let p = t.p && t.p.s ? [val(t.p.x, f), val(t.p.y, f)] : val(t.p, f) || [0, 0];
    const r = ((val(t.r, f) ?? val(t.rz, f)) || 0) * Math.PI / 180;
    const cos = Math.cos(r), sin = Math.sin(r), sx = s[0] / 100, sy = s[1] / 100;
    // T(p) · R(r) · S(s) · T(-a)
    const m = [cos * sx, sin * sx, -sin * sy, cos * sy, 0, 0];
    m[4] = p[0] - (m[0] * a[0] + m[2] * a[1]); m[5] = p[1] - (m[1] * a[0] + m[3] * a[1]);
    return m;
  }
  const opac = (t, f) => (t && t.o ? val(t.o, f) / 100 : 1);

  // ── shapes
  function tracePath(ctx, sh) {
    const v = sh.v, i = sh.i, o = sh.o; if (!v || !v.length) return;
    ctx.moveTo(v[0][0], v[0][1]);
    for (let n = 1; n < v.length; n++) ctx.bezierCurveTo(v[n - 1][0] + o[n - 1][0], v[n - 1][1] + o[n - 1][1], v[n][0] + i[n][0], v[n][1] + i[n][1], v[n][0], v[n][1]);
    if (sh.c) { const L = v.length - 1; ctx.bezierCurveTo(v[L][0] + o[L][0], v[L][1] + o[L][1], v[0][0] + i[0][0], v[0][1] + i[0][1], v[0][0], v[0][1]); ctx.closePath(); }
  }
  function drawItems(ctx, items, f, m, alpha, R) {
    const tr = items.find((x) => x.ty === 'tr');
    const gm = tr ? mul(m, trMatrix(tr, f)) : m, ga = alpha * opac(tr, f);
    if (ga <= 0.001) return;
    const paths = items.filter((x) => x.ty === 'sh' || x.ty === 'rc' || x.ty === 'el');
    for (let n = items.length - 1; n >= 0; n--) { const it = items[n]; if (it.ty === 'gr' && !it.hd) drawItems(ctx, it.it, f, gm, ga, R); }
    const styles = items.filter((x) => (x.ty === 'st' || x.ty === 'fl') && !x.hd);
    if (!paths.length || !styles.length) return;
    ctx.save(); ctx.setTransform(R.base[0] * gm[0] + R.base[2] * gm[1], R.base[1] * gm[0] + R.base[3] * gm[1], R.base[0] * gm[2] + R.base[2] * gm[3], R.base[1] * gm[2] + R.base[3] * gm[3], R.base[0] * gm[4] + R.base[2] * gm[5] + R.base[4], R.base[1] * gm[4] + R.base[3] * gm[5] + R.base[5]);
    ctx.beginPath();
    for (const p of paths) {
      if (p.ty === 'sh') tracePath(ctx, val(p.ks, f));
      else if (p.ty === 'rc') { const s = val(p.s, f), c = val(p.p, f); ctx.rect(c[0] - s[0] / 2, c[1] - s[1] / 2, s[0], s[1]); }
      else if (p.ty === 'el') { const s = val(p.s, f), c = val(p.p, f); ctx.moveTo(c[0] + s[0] / 2, c[1]); ctx.ellipse(c[0], c[1], s[0] / 2, s[1] / 2, 0, 0, Math.PI * 2); }
    }
    const scale = Math.sqrt(Math.abs(gm[0] * gm[3] - gm[1] * gm[2])) * R.scale || 1;
    for (const st of styles) {
      const o = ga * (val(st.o, f) ?? 100) / 100; if (o <= 0.001) continue;
      ctx.globalAlpha = Math.min(1, o);
      if (st.ty === 'fl') { ctx.fillStyle = R.color; ctx.fill(st.r === 2 ? 'evenodd' : 'nonzero'); }
      else {
        ctx.strokeStyle = R.color; ctx.lineCap = ['butt', 'butt', 'round', 'square'][st.lc || 2]; ctx.lineJoin = ['miter', 'miter', 'round', 'bevel'][st.lj || 2];
        ctx.lineWidth = Math.max(val(st.w, f), R.minStroke / scale); ctx.stroke();
      }
    }
    ctx.restore();
  }

  // ── layers
  function layerMatrix(L, byInd, f) {
    let m = trMatrix(L.ks, f), p = L.parent != null ? byInd.get(L.parent) : null, guard = 0;
    while (p && guard++ < 32) { m = mul(trMatrix(p.ks, f), m); p = p.parent != null ? byInd.get(p.parent) : null; }
    return m;
  }
  function drawLayer(ctx, L, byInd, comps, f, m0, alpha, R) {
    if (L.hd || f < L.ip || f >= L.op || L.ty === 3) return;
    const m = mul(m0, layerMatrix(L, byInd, f)), a = alpha * opac(L.ks, f);
    if (a <= 0.001) return;
    if (L.ty === 4) drawItems(ctx, L.shapes || [], f, m, a, R);
    else if (L.ty === 0) {
      const comp = comps.get(L.refId); if (!comp) return;
      let lf = (f - (L.st || 0)) / (L.sr || 1);
      if (L.tm) lf = val(L.tm, f) * R.fr;
      drawComp(ctx, comp, lf, m, a, R);
    }
  }
  function drawComp(ctx, layers, f, m, alpha, R) {
    const byInd = layers.__ind || (layers.__ind = new Map(layers.map((l) => [l.ind, l])));
    for (let n = layers.length - 1; n >= 0; n--) {
      const L = layers[n];
      if (L.td) continue; // matte sources are drawn only through the layer they mask
      const matte = L.tt && n > 0 && layers[n - 1].td ? layers[n - 1] : null;
      if (!matte) { drawLayer(ctx, L, byInd, R.comps, f, m, alpha, R); continue; }
      const A = R.buf(0), B = R.buf(1);
      A.clearRect(0, 0, A.canvas.width, A.canvas.height); B.clearRect(0, 0, B.canvas.width, B.canvas.height);
      drawLayer(A, L, byInd, R.comps, f, m, alpha, R);
      drawLayer(B, { ...matte, td: 0 }, byInd, R.comps, f, m, 1, R);
      A.save(); A.setTransform(1, 0, 0, 1, 0, 0); A.globalAlpha = 1;
      A.globalCompositeOperation = L.tt === 2 ? 'destination-out' : 'destination-in';
      A.drawImage(B.canvas, 0, 0); A.restore();
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.drawImage(A.canvas, 0, 0); ctx.restore();
    }
  }

  // ── player
  function play(cv, data) {
    const ctx = cv.getContext('2d'); if (!ctx) return;
    const comps = new Map((data.assets || []).filter((a) => a.layers).map((a) => [a.id, a.layers]));
    const bufs = [];
    const R = { comps, fr: data.fr, minStroke: +(cv.dataset.stroke || 1.4), color: '#000', base: [1, 0, 0, 1, 0, 0], scale: 1,
      buf: (i) => { const c = bufs[i] || (bufs[i] = document.createElement('canvas').getContext('2d')); if (c.canvas.width !== cv.width || c.canvas.height !== cv.height) { c.canvas.width = cv.width; c.canvas.height = cv.height; } return c; } };
    const total = data.op - data.ip;
    let raf = 0, on = false, t0 = 0, last = -1;
    const size = () => {
      const dpr = Math.min(2, devicePixelRatio || 1), w = cv.clientWidth || 96, h = cv.clientHeight || w;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      const k = Math.min(cv.width / data.w, cv.height / data.h);
      R.base = [k, 0, 0, k, (cv.width - data.w * k) / 2, (cv.height - data.h * k) / 2]; R.scale = k / dpr; last = -1;
    };
    const draw = (f) => {
      R.color = getComputedStyle(cv).color || '#000';
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
      drawComp(ctx, data.layers, f, [1, 0, 0, 1, 0, 0], 1, R);
    };
    const tick = (now) => {
      if (!t0) t0 = now;
      const f = data.ip + (((now - t0) / 1000) * data.fr) % total;
      if (Math.floor(f) !== last) { last = Math.floor(f); draw(f); }
      raf = requestAnimationFrame(tick);
    };
    cv.__draw = draw; cv.__data = data; // for the test sheet (src/tools/lottie-sheet.html)
    size();
    const still = Math.round(data.ip + total * +(cv.dataset.still || 0.5));
    draw(still);
    cv.classList.add('is-ready');
    if (RM || 'static' in cv.dataset) return;
    const start = () => { if (!on) { on = true; t0 = 0; raf = requestAnimationFrame(tick); } };
    const stop = () => { on = false; cancelAnimationFrame(raf); };
    if ('IntersectionObserver' in window) new IntersectionObserver((es) => (es[0].isIntersecting ? start() : stop())).observe(cv); else start();
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    addEventListener('resize', () => { size(); if (!on) draw(still); });
  }
  document.querySelectorAll('canvas[data-lottie]').forEach((cv) => {
    fetch(cv.dataset.lottie).then((r) => (r.ok ? r.json() : Promise.reject(r.status))).then((d) => play(cv, d)).catch(() => cv.classList.add('is-failed'));
  });
})();
