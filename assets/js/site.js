/* Praxis Studio — interaction layer. Vanilla, no dependencies (Lenis is optional).
   Rule: content is visible without this file; every effect degrades to a still state. */
(() => {
  'use strict';
  const doc = document.documentElement;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const TZ = 'Asia/Karachi';
  doc.classList.add('js');

  // preloader: once per session, never blocking
  try {
    if (sessionStorage.getItem('px-seen')) doc.classList.add('pl-skip');
    sessionStorage.setItem('px-seen', '1');
  } catch (e) { /* storage blocked: CSS still dismisses it */ }
  const pl = $('.preload');
  const plDelay = pl && !doc.classList.contains('pl-skip') && !RM ? 1350 : 0;
  if (pl) setTimeout(() => pl.remove(), plDelay + 900);

  // ── smooth scroll (optional)
  let lenis = null;
  if (!RM && window.Lenis) {
    try {
      lenis = new window.Lenis({ lerp: 0.11, smoothWheel: true });
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    } catch (e) { lenis = null; }
  }
  const scrollToEl = (el) => { if (lenis) lenis.scrollTo(el, { offset: -100 }); else el.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }); };
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1); const t = id && document.getElementById(id);
    if (!t) return; e.preventDefault(); scrollToEl(t);
    if (t.tabIndex < 0 && !/^(A|BUTTON|INPUT)$/.test(t.tagName)) t.setAttribute('tabindex', '-1');
    t.focus({ preventScroll: true });
  }));

  // ── header: hide on scroll down, show on up; dark mode over dark panels
  const hdr = $('[data-hdr]');
  const darks = $$('.svc-panel, .gallery, .closing, .ftr');
  let lastY = scrollY, ticking = false;
  const onScroll = () => {
    const y = scrollY;
    if (hdr) {
      const menuOpen = doc.classList.contains('menu-open');
      hdr.classList.toggle('is-hidden', !menuOpen && y > 400 && y > lastY + 4);
      if (y < lastY - 4 || y < 400) hdr.classList.remove('is-hidden');
      const probe = 40;
      hdr.classList.toggle('on-dark', darks.some((d) => { const r = d.getBoundingClientRect(); return r.top <= probe && r.bottom >= probe; }));
    }
    lastY = y; ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // ── mobile menu
  const mBtn = $('[data-menu-btn]'), menu = $('[data-menu]');
  if (mBtn && menu) {
    const close = (focus = true) => { menu.hidden = true; menu.classList.remove('is-open'); mBtn.setAttribute('aria-expanded', 'false'); doc.classList.remove('menu-open'); if (lenis) lenis.start(); document.body.style.overflow = ''; if (focus) mBtn.focus(); };
    const open = () => { menu.hidden = false; requestAnimationFrame(() => menu.classList.add('is-open')); mBtn.setAttribute('aria-expanded', 'true'); doc.classList.add('menu-open'); hdr && hdr.classList.remove('is-hidden'); if (lenis) lenis.stop(); document.body.style.overflow = 'hidden'; const f = $('a', menu); f && f.focus(); };
    $$('.menu-links li', menu).forEach((li, i) => li.style.setProperty('--n', i));
    mBtn.addEventListener('click', () => (menu.hidden ? open() : close()));
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) close(); });
    $$('a', menu).forEach((a) => a.addEventListener('click', () => close(false)));
    addEventListener('resize', () => { if (innerWidth > 1100 && !menu.hidden) close(false); });
  }
  // current page in nav
  const here = location.pathname.replace(/index\.html$/, '');
  $$('.nav-i > a').forEach((a) => { const p = new URL(a.href).pathname; if (p !== '/' && here.startsWith(p)) a.setAttribute('aria-current', 'page'); });

  // ── Islamabad clock + open status (Mon–Fri 10:00–19:00 PKT)
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false });
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short', hour: 'numeric', hour12: false });
  const tick = () => {
    const now = new Date();
    const t = fmt.format(now);
    const p = Object.fromEntries(parts.formatToParts(now).map((x) => [x.type, x.value]));
    const h = parseInt(p.hour, 10) % 24; const open = !['Sat', 'Sun'].includes(p.weekday) && h >= 10 && h < 19;
    $$('[data-clock]').forEach((el) => (el.textContent = t));
    $$('[data-clock-big]').forEach((el) => (el.textContent = t));
    $$('[data-open]').forEach((el) => { el.textContent = open ? 'Open' : 'Closed'; el.closest('.clock').classList.toggle('is-closed', !open); });
    const local = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }).format(now);
    const lz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    $$('[data-yourtime]').forEach((el) => { el.textContent = lz === TZ ? 'You are in the same time zone as the studio.' : `It is ${local} where you are.`; });
  };
  tick(); setInterval(tick, 15000);

  // ── enter + reveal
  const enterRoot = () => { $$('[data-enter]').forEach((el, i) => { if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', i); el.classList.add('is-in'); }); };
  setTimeout(enterRoot, plDelay ? plDelay - 150 : 60);
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' }) : null;
  $$('[data-reveal]').forEach((el) => (io ? io.observe(el) : el.classList.add('is-in')));
  setTimeout(() => $$('[data-reveal]').forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < innerHeight) el.classList.add('is-in'); }), 2500);

  // ── accordions (with optional single-open + service visual swap)
  $$('[data-acc]').forEach((acc) => {
    const single = acc.hasAttribute('data-acc-single');
    const vis = acc.hasAttribute('data-svc-acc') ? $('[data-svc-vis]') : null;
    $$('.acc-b', acc).forEach((b) => b.addEventListener('click', () => {
      const on = b.getAttribute('aria-expanded') === 'true';
      if (single) $$('.acc-b', acc).forEach((o) => o !== b && o.setAttribute('aria-expanded', 'false'));
      b.setAttribute('aria-expanded', String(!on));
      if (vis && !on) {
        const item = b.closest('.acc-i'); const img = $('[data-svc-visimg]', vis);
        vis.classList.add('swap');
        setTimeout(() => { img.src = item.dataset.svcImg; $('[data-svc-visname]', vis).textContent = item.dataset.svcName; vis.href = item.dataset.svcHref; vis.classList.remove('swap'); }, 300);
      }
    }));
  });

  // ── testimonials slider
  $$('[data-slider]').forEach((sl) => {
    const slides = $$('[data-slide]', sl); const cnt = $('[data-count]', sl); let i = 0;
    if (slides.length < 2) { $('.testi-ctrl', sl) && ($('.testi-ctrl', sl).hidden = true); return; }
    const go = (n) => {
      slides[i].classList.remove('is-on'); slides[i].hidden = true;
      i = (n + slides.length) % slides.length;
      slides[i].hidden = false; slides[i].classList.add('is-on');
      cnt.textContent = String(i + 1).padStart(2, '0');
    };
    $('[data-prev]', sl).addEventListener('click', () => go(i - 1));
    $('[data-next]', sl).addEventListener('click', () => go(i + 1));
    let sx = null;
    sl.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') sx = e.clientX; });
    sl.addEventListener('pointerup', (e) => { if (sx == null) return; const d = e.clientX - sx; if (Math.abs(d) > 50) go(i + (d < 0 ? 1 : -1)); sx = null; });
  });

  // ── drag rail with momentum (native scroll stays for touch + keyboard)
  $$('[data-drag]').forEach((rail) => {
    const bar = $('[data-rail-bar]');
    const upd = () => { if (!bar) return; const max = rail.scrollWidth - rail.clientWidth; const w = rail.clientWidth / rail.scrollWidth; bar.style.width = (w * 100) + '%'; bar.style.transform = `translateX(${max > 0 ? (rail.scrollLeft / max) * ((1 - w) / w) * 100 : 0}%)`; };
    rail.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
    rail.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); rail.scrollBy({ left: (e.key === 'ArrowRight' ? 1 : -1) * rail.clientWidth * 0.6, behavior: RM ? 'auto' : 'smooth' }); } });
    let down = false, moved = 0, sx = 0, sl = 0, v = 0, lx = 0, lt = 0, raf = 0;
    rail.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse' || e.button !== 0) return; down = true; moved = 0; sx = lx = e.clientX; sl = rail.scrollLeft; lt = performance.now(); v = 0; cancelAnimationFrame(raf); });
    addEventListener('pointermove', (e) => {
      if (!down) return; const dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx));
      if (moved > 6) { rail.classList.add('is-drag'); rail.scrollLeft = sl - dx; }
      const now = performance.now(); v = (e.clientX - lx) / Math.max(1, now - lt); lx = e.clientX; lt = now;
    });
    addEventListener('pointerup', () => {
      if (!down) return; down = false;
      setTimeout(() => rail.classList.remove('is-drag'), 0);
      if (RM) return; let vel = -v * 16;
      const step = () => { vel *= 0.94; rail.scrollLeft += vel; if (Math.abs(vel) > 0.4) raf = requestAnimationFrame(step); };
      raf = requestAnimationFrame(step);
    });
    rail.addEventListener('click', (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
    rail.addEventListener('dragstart', (e) => e.preventDefault());
  });

  // ── work filters (?cat=slug)
  const filters = $('[data-filters]');
  if (filters) {
    const cards = $$('[data-grid] .wcard'); const status = $('[data-filter-status]');
    const apply = (cat, push) => {
      $$('[data-filter]', filters).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === cat)));
      let n = 0; cards.forEach((c) => { const show = cat === 'all' || c.dataset.cat === cat; c.classList.toggle('is-hid', !show); if (show) { n++; c.style.animationDelay = (n * 40) + 'ms'; } });
      status.textContent = `${n} projects shown`;
      if (push) { const u = new URL(location.href); if (cat === 'all') u.searchParams.delete('cat'); else u.searchParams.set('cat', cat); history.replaceState(null, '', u); }
    };
    $$('[data-filter]', filters).forEach((b) => b.addEventListener('click', () => apply(b.dataset.filter, true)));
    const q = new URLSearchParams(location.search).get('cat');
    if (q && $(`[data-filter="${CSS.escape(q)}"]`, filters)) apply(q, false);
  }

  // ── manifesto words light up with scroll
  $$('[data-words]').forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = words.map((w) => `<span class="w" aria-hidden="true">${w.replace(/</g, '&lt;')}</span>`).join(' ');
    const spans = $$('.w', el);
    if (RM) { spans.forEach((s) => s.classList.add('on')); return; }
    const upd = () => { const r = el.getBoundingClientRect(); const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35))); const n = Math.round(p * spans.length); spans.forEach((s, k) => s.classList.toggle('on', k < n)); };
    addEventListener('scroll', () => requestAnimationFrame(upd), { passive: true }); upd();
  });

  // ── big pixel mark: the real logo geometry, built square by square
  const SQ = [[0,0,20],[-15,-15,15],[15,-15,15],[-15,15,15],[15,15,15],[-27.5,-27.5,10],[27.5,-27.5,10],[-27.5,27.5,10],[27.5,27.5,10],[0,-40,10],[0,40,10],[-40,0,10],[40,0,10]];
  $$('[data-bigmark]').forEach((el) => {
    const sp = [[52, -52], [60, -44], [-56, 50]];
    el.innerHTML = `<svg viewBox="-66 -66 132 132">${SQ.map(([x, y, s], k) => `<rect x="${x - s / 2}" y="${y - s / 2}" width="${s}" height="${s}" style="--k:${k}"/>`).join('')}${sp.map(([x, y], k) => `<rect class="sp" x="${x - 4}" y="${y - 4}" width="8" height="8" style="--k:${13 + k}"/>`).join('')}</svg>`;
    if (io) { const o = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { el.classList.add('is-in'); o.disconnect(); } }), { threshold: 0.3 }); o.observe(el); } else el.classList.add('is-in');
  });

  // ── closing pixel field
  $$('[data-pixfield]').forEach((el) => {
    let s = ''; const rows = 9, cols = 12;
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const d = (cols - i) + (rows - j) * 1.1; const r = Math.random(); s += `<i class="${d < 7 && r > 0.25 ? 'on' : d < 11 && r > 0.72 ? 'on' : d < 14 && r > 0.8 ? 'dk' : ''}"></i>`; }
    el.innerHTML = s;
  });

  // ── hero card stack
  const stack = $('[data-stack]');
  if (stack && !RM) {
    const im = $$('img', stack); let k = 0;
    setInterval(() => { if (document.hidden) return; const cur = im[k]; k = (k + 1) % im.length; cur.classList.add('out'); im[k].classList.remove('off', 'out'); setTimeout(() => { cur.classList.remove('out'); cur.classList.add('off'); }, 700); }, 1700);
  }

  // ── count-up stats
  $$('[data-count-to]').forEach((el) => {
    if (RM || !io) return; const to = +el.dataset.countTo; el.textContent = '0';
    const o = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) return; o.disconnect(); let n = 0; const iv = setInterval(() => { n++; el.textContent = n; if (n >= to) clearInterval(iv); }, Math.max(40, 700 / to)); }), { threshold: 0.6 });
    o.observe(el);
  });

  // ── PIXEL ASSEMBLE: images build up from chunky pixels as they scroll in
  const bgOf = (el) => { let n = el.parentElement; while (n) { const c = getComputedStyle(n).backgroundColor; if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return c; n = n.parentElement; } return '#DFE0D0'; };
  if (!RM && io) {
    const pxo = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) return; pxo.unobserve(e.target); assemble(e.target); }), { rootMargin: '0px 0px -8% 0px' });
    $$('[data-px]').forEach((box) => {
      const r = box.getBoundingClientRect(); if (r.top < innerHeight * 0.9 && r.bottom > 0) return; // already on screen: leave it
      const cv = document.createElement('canvas'); cv.className = 'px-cv'; cv.setAttribute('aria-hidden', 'true'); box.appendChild(cv);
      const w = box.clientWidth, h = box.clientHeight; const dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = Math.max(1, w * dpr); cv.height = Math.max(1, h * dpr);
      const ctx = cv.getContext('2d'); ctx.fillStyle = bgOf(box); ctx.fillRect(0, 0, cv.width, cv.height);
      box._pxctx = ctx; pxo.observe(box);
      setTimeout(() => { if (box._pxctx) { cv.remove(); box._pxctx = null; } }, 15000); // safety
    });
    function assemble(box) {
      const ctx = box._pxctx; if (!ctx) return; const cv = ctx.canvas;
      const u = Math.max(18, Math.round(cv.width / 16)); const cols = Math.ceil(cv.width / u), rows = Math.ceil(cv.height / u);
      const cells = []; for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) cells.push([i, j, Math.random() * 0.55 + ((i / cols) * 0.25 + (j / rows) * 0.2)]);
      cells.sort((a, b) => a[2] - b[2]);
      const T = 750, t0 = performance.now(); let done = 0;
      const step = (t) => {
        const p = Math.min(1, (t - t0) / T); const target = Math.floor(p * cells.length);
        for (; done < target; done++) { const [i, j] = cells[done]; ctx.clearRect(i * u, j * u, u, u); if (Math.random() < 0.18 && done < cells.length - 30) { ctx.fillStyle = '#B1FA63'; ctx.fillRect(cells[done + 20][0] * u, cells[done + 20][1] * u, u, u); } }
        if (p < 1) requestAnimationFrame(step); else { cv.remove(); box._pxctx = null; }
      };
      requestAnimationFrame(step);
    }
  }

  // ── PIXEL SNAKE: a trail of pixels roams the hero, dragging the word pills
  const hero = $('[data-hero]'); const snakeCv = $('[data-snake]');
  if (hero && snakeCv) {
    const ctx = snakeCv.getContext('2d'); const pills = $$('.spill', hero);
    let W = 0, H = 0, U = 14, dpr = 1, cols = 0, rows = 0;
    const size = () => { dpr = Math.min(2, devicePixelRatio || 1); W = hero.clientWidth; H = hero.clientHeight; U = W < 640 ? 10 : 14; snakeCv.width = W * dpr; snakeCv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); cols = Math.floor(W / U); rows = Math.floor(H / U); };
    size(); addEventListener('resize', size);
    const LEN = 64; const trail = []; let hx = Math.floor(cols * 0.15), hy = Math.floor(rows * 0.3);
    for (let i = 0; i < LEN; i++) trail.push([hx - i, hy]);
    const PILL_AT = [10, 25, 40, 55];
    let t = Math.random() * 100, ptr = null, last = 0, visible = true, running = false;
    hero.addEventListener('pointermove', (e) => { const r = hero.getBoundingClientRect(); ptr = [(e.clientX - r.left) / U, (e.clientY - r.top) / U]; });
    hero.addEventListener('pointerleave', () => (ptr = null));
    const target = () => { const tx = cols * (0.5 + 0.44 * Math.sin(t * 0.23)); const ty = rows * (0.48 + 0.36 * Math.sin(t * 0.37 + 1.3)); return ptr ? [ptr[0] * 0.7 + tx * 0.3, ptr[1] * 0.7 + ty * 0.3] : [tx, ty]; };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = trail.length - 1; i >= 0; i--) {
        const [x, y] = trail[i]; const a = 1 - i / trail.length;
        ctx.globalAlpha = Math.max(0.12, a);
        ctx.fillStyle = i === 0 ? '#000' : i % 9 === 0 ? '#000' : '#B1FA63';
        const s = i === 0 ? U : U - 2; ctx.fillRect(x * U + (U - s) / 2, y * U + (U - s) / 2, s, s);
      }
      ctx.globalAlpha = 1;
      pills.forEach((p, k) => { const c = trail[Math.min(PILL_AT[k], trail.length - 1)]; p.style.transform = `translate(${c[0] * U + U * 0.6}px, ${c[1] * U - 34}px)`; });
    };
    const stepSnake = () => {
      const [tx, ty] = target(); const dx = tx - hx, dy = ty - hy;
      if (Math.abs(dx) > Math.abs(dy) ? true : Math.abs(dy) < 0.5) hx += Math.sign(dx) || 1; else hy += Math.sign(dy);
      hx = Math.max(0, Math.min(cols - 1, hx)); hy = Math.max(0, Math.min(rows - 1, hy));
      const [px, py] = trail[0]; if (px !== hx || py !== hy) { trail.unshift([hx, hy]); trail.length = LEN; }
    };
    const loop = (now) => {
      if (!visible || document.hidden) { running = false; return; }
      if (now - last > 42) { t += 0.042; stepSnake(); draw(); last = now; }
      requestAnimationFrame(loop);
    };
    hero.classList.add('snake-on');
    if (RM) { for (let i = 0; i < 400; i++) { t += 0.042; stepSnake(); } draw(); }
    else {
      const start = () => { if (!running && visible) { running = true; requestAnimationFrame(loop); } };
      if (io) new IntersectionObserver((es) => { visible = es[0].isIntersecting; start(); }).observe(hero);
      document.addEventListener('visibilitychange', start); start();
    }
  }

  // ── HEADLINE PIXEL BREAK: the hero headline breaks back into pixels as it scrolls away
  const pb = $('[data-pixelbreak]');
  if (pb && !RM && FINE && innerWidth > 900) {
    const setup = () => {
      const C = 12, Rr = 4; const clones = []; const host = pb; const tmp = host.cloneNode(true); tmp.querySelectorAll(".stack img.off").forEach((n) => n.remove()); const html = tmp.innerHTML;
      for (let j = 0; j < Rr; j++) for (let i = 0; i < C; i++) {
        const c = document.createElement('div'); c.className = 'pb-clone d1'; c.setAttribute('aria-hidden', 'true');
        c.innerHTML = html; c.style.clipPath = `inset(${(j / Rr) * 100}% ${100 - ((i + 1) / C) * 100}% ${100 - ((j + 1) / Rr) * 100}% ${(i / C) * 100}%)`;
        c.style.visibility = 'hidden';
        const ang = Math.random() * Math.PI * 2; clones.push({ c, vx: Math.cos(ang) * (60 + Math.random() * 160), vy: -80 - Math.random() * 260, r: (Math.random() - 0.5) * 30, d: Math.random() * 0.35 });
        host.appendChild(c);
      }
      const stackIm = $$('.pb-clone .stack img', host); stackIm.forEach((im) => im.removeAttribute('loading'));
      let active = false;
      const upd = () => {
        const r = hero.getBoundingClientRect(); const p = Math.min(1, Math.max(0, -r.top / (r.height * 0.55)));
        if (p > 0.02) {
          if (!active) { active = true; $$('.hl-line', host).forEach((l) => { if (l.parentElement === host) l.style.visibility = 'hidden'; }); clones.forEach((o) => (o.c.style.visibility = 'visible')); }
          clones.forEach((o) => { const q = Math.max(0, (p - o.d) / (1 - o.d)); const s = Math.round(q * 8) / 8; o.c.style.transform = `translate(${(o.vx * s).toFixed(0)}px, ${(o.vy * s).toFixed(0)}px)`; o.c.style.opacity = String(1 - s); });
        } else if (active) { active = false; clones.forEach((o) => { o.c.style.visibility = 'hidden'; o.c.style.transform = ''; o.c.style.opacity = ''; }); $$('.hl-line', host).forEach((l) => (l.style.visibility = '')); }
      };
      addEventListener('scroll', () => requestAnimationFrame(upd), { passive: true });
    };
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(setup, 1600));
  }

  // ── contact form: validates, then sends to an endpoint if one is set (data-endpoint), otherwise opens a filled email
  const form = $('[data-form]');
  if (form) {
    const st = $('[data-form-status]');
    const fields = { name: ['f-name', 'e-name', (v) => v.trim().length > 1], email: ['f-email', 'e-email', (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())], message: ['f-msg', 'e-msg', (v) => v.trim().length > 9] };
    const check = (k) => { const [id, eid, ok] = fields[k]; const el = document.getElementById(id); const good = ok(el.value); el.setAttribute('aria-invalid', String(!good)); good ? el.removeAttribute('aria-describedby') : el.setAttribute('aria-describedby', eid); document.getElementById(eid).hidden = good; return good; };
    Object.keys(fields).forEach((k) => document.getElementById(fields[k][0]).addEventListener('blur', () => check(k)));
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const bad = Object.keys(fields).filter((k) => !check(k));
      if (bad.length) { document.getElementById(fields[bad[0]][0]).focus(); st.textContent = 'Please fix the highlighted fields.'; return; }
      const fd = new FormData(form); if (fd.get('website')) return; // honeypot
      const svc = fd.getAll('services').join(', ') || 'Not specified';
      const endpoint = form.dataset.endpoint;
      if (endpoint) {
        st.textContent = 'Sending…';
        try { const r = await fetch(endpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } }); if (!r.ok) throw new Error(); form.reset(); st.textContent = 'Thank you. Your message reached the studio; we reply within two working days.'; }
        catch (err) { st.textContent = 'That did not go through. Please write to hello@praxis.studio directly.'; }
        return;
      }
      const body = `Name: ${fd.get('name')}\nEmail: ${fd.get('email')}\nCompany: ${fd.get('company') || '-'}\nServices: ${svc}\nBudget: ${fd.get('budget') || 'Not sure yet'}\n\n${fd.get('message')}`;
      location.href = `mailto:hello@praxis.studio?subject=${encodeURIComponent('New project: ' + (fd.get('company') || fd.get('name')))}&body=${encodeURIComponent(body)}`;
      st.textContent = 'Your email app should now be open with the message ready. If nothing opened, write to hello@praxis.studio.';
    });
  }
})();
