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
      const overDark = darks.some((d) => { const r = d.getBoundingClientRect(); return r.top <= probe && r.bottom >= probe; });
      const heroDark = doc.classList.contains('is-home') && (window.__pxMelt == null ? scrollY < innerHeight * 0.6 : window.__pxMelt < 0.5);
      hdr.classList.toggle('on-dark', overDark || heroDark);
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

  // ═════ HOMEPAGE v5 ═════
  const PAL = ['#B1FA63', '#FE7733', '#B2A1FF', '#FFFFFF', '#243837', '#D1D1D1'];
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  // ── THE MELT: the page runs from black to Bone as the hero scrolls away (scroll-linked, not timed)
  const hx = $('[data-hero]');
  if (hx && doc.classList.contains('is-home')) {
    doc.classList.add('js-melt');
    const melt = () => {
      const h = hx.offsetHeight; const raw = (scrollY - h * 0.3) / (h * 0.62);
      const t = Math.min(1, Math.max(0, raw)); const m = t * t * (3 - 2 * t); // smoothstep: passes the grey middle quickly
      doc.style.setProperty('--m', m.toFixed(3)); window.__pxMelt = m;
    };
    addEventListener('scroll', () => requestAnimationFrame(melt), { passive: true }); addEventListener('resize', melt); melt();
  }

  // ── THE REVEAL: tiles close over the work in a wave, the image changes, tiles open again
  const stage = $('[data-rv]');
  if (stage) {
    const tilesEl = $('[data-rv-tiles]', stage); const label = $('[data-rv-label]', stage);
    const im = $$('.rv-img', stage); let cur = 0, timer = 0, visible = true, busy = false;
    const small = innerWidth < 640; const C = small ? 6 : 10, Rw = small ? 4 : 7;
    tilesEl.style.setProperty('--c', C); tilesEl.style.setProperty('--r', Rw);
    let html = ''; for (let j = 0; j < Rw; j++) for (let i = 0; i < C; i++) html += `<i style="--d:${(i + j) * 34}ms;--d2:${(C - 1 - i + Rw - 1 - j) * 34}ms"></i>`;
    tilesEl.innerHTML = html; const tiles = $$('i', tilesEl);
    const span = (C + Rw) * 34 + 420;
    const paint = () => tiles.forEach((t) => t.style.setProperty('--t', Math.random() < 0.55 ? '#000' : pick(PAL)));
    if (RM) { tilesEl.hidden = true; }
    else {
      // start covered, then open: the first image reveals itself on load
      paint(); tilesEl.classList.add('instant', 'closed'); void tilesEl.offsetWidth; tilesEl.classList.remove('instant');
      setTimeout(() => tilesEl.classList.remove('closed'), plDelay ? plDelay + 250 : 450);
      const cycle = () => {
        if (!visible || document.hidden || busy) { timer = setTimeout(cycle, 1200); return; }
        busy = true; paint(); label.classList.add('out'); tilesEl.classList.add('closed');
        setTimeout(() => {
          im[cur].classList.remove('on'); cur = (cur + 1) % im.length; im[cur].classList.add('on');
          label.textContent = im[cur].dataset.name;
          setTimeout(() => { tilesEl.classList.remove('closed'); label.classList.remove('out'); }, 160);
          setTimeout(() => { busy = false; timer = setTimeout(cycle, 4000); }, span + 200);
        }, span);
      };
      timer = setTimeout(cycle, 4000 + (plDelay || 0));
      if (io) new IntersectionObserver((es) => { visible = es[0].isIntersecting; }).observe(stage);
    }
  }

  // ── LIVING ICONS: run only while the services row is on screen
  $$('[data-icons]').forEach((row) => {
    if (!io) { row.classList.add('is-live'); return; }
    new IntersectionObserver((es) => row.classList.toggle('is-live', es[0].isIntersecting)).observe(row);
  });

  // ── PIXEL RULE: the work section's divider assembles from blocks on scroll-in
  $$('[data-pxrule]').forEach((el) => {
    const n = Math.max(24, Math.round(el.clientWidth / 15)); el.style.setProperty('--n', n); let s = '';
    for (let i = 0; i < n; i++) { const c = Math.random() < 0.16 ? ` class="c" style="--c:${pick(PAL.slice(0, 3))};--d:${Math.round(Math.random() * 600)}ms"` : ` style="--d:${Math.round(Math.random() * 600)}ms"`; s += `<i${c}></i>`; }
    el.innerHTML = s;
    if (io) { const o = new IntersectionObserver((es) => { if (es[0].isIntersecting) { el.classList.add('is-in'); o.disconnect(); } }, { threshold: 0.5 }); o.observe(el); } else el.classList.add('is-in');
  });

  // ── WORK INDEX: cursor preview (pixel-dissolve or motion), pixel burst, tap-to-expand on touch
  const list = $('[data-worklist]');
  if (list) {
    const peek = $('[data-peek]'), media = $('[data-peek-media]'), ptiles = $('[data-peek-tiles]');
    let ph = ''; for (let k = 0; k < 48; k++) ph += `<i style="--d:${Math.round(Math.random() * 260)}ms"></i>`; ptiles.innerHTML = ph;
    const pt = $$('i', ptiles);
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, active = null;
    const follow = () => { x += (tx - x) * 0.16; y += (ty - y) * 0.16; peek.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`; raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(follow) : 0; };
    const place = (e) => { tx = e.clientX + 28; ty = e.clientY - peek.offsetHeight / 2; if (tx + peek.offsetWidth > innerWidth - 12) tx = e.clientX - peek.offsetWidth - 28; if (!raf) raf = requestAnimationFrame(follow); };
    const burst = (row, color) => {
      if (RM) return; const w = row.offsetWidth, h = row.offsetHeight;
      for (let k = 0; k < 12; k++) {
        const b = document.createElement('i'); b.className = 'burst'; b.style.background = color;
        const edge = Math.random() < 0.5; const bx = edge ? Math.random() * w : (Math.random() < 0.5 ? 0 : w - 8); const by = edge ? (Math.random() < 0.5 ? 0 : h - 8) : Math.random() * h;
        b.style.left = bx + 'px'; b.style.top = by + 'px'; row.appendChild(b);
        const dx = (bx / w - 0.5) * 60 + (Math.random() - 0.5) * 40, dy = (by / h - 0.5) * 60 + (Math.random() - 0.5) * 30;
        b.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(${Math.round(dx / 8) * 8}px, ${Math.round(dy / 8) * 8}px) scale(.4)`, opacity: 0 }], { duration: 650 + Math.random() * 250, easing: 'steps(6)' }).onfinish = () => b.remove();
      }
    };
    const accentOf = (row) => getComputedStyle(row).getPropertyValue('--a').trim();
    $$('[data-row]', list).forEach((a) => {
      const row = a.closest('.wrow');
      a.addEventListener('mouseenter', (e) => {
        if (!FINE) return;
        active = a; const col = accentOf(row);
        media.innerHTML = a.dataset.motion ? `<video src="${a.dataset.motion}" muted loop playsinline autoplay></video>` : `<img src="${a.dataset.img}" alt="">`;
        pt.forEach((t) => t.style.setProperty('--t', Math.random() < 0.5 ? col : '#000'));
        peek.classList.remove('open'); peek.classList.add('on'); place(e); x = tx; y = ty;
        requestAnimationFrame(() => requestAnimationFrame(() => { if (active === a) peek.classList.add('open'); }));
        burst(row, col);
      });
      a.addEventListener('mousemove', place);
      a.addEventListener('mouseleave', () => { if (active !== a) return; active = null; peek.classList.remove('open'); setTimeout(() => { if (!active) { peek.classList.remove('on'); media.innerHTML = ''; } }, 360); });
      // touch: the first tap opens the preview inline under the row; the link inside goes to the case study
      a.addEventListener('click', (e) => {
        if (FINE) return;
        const prev = $('.wrow-prev', row); if (!prev || row.classList.contains('is-open')) return;
        e.preventDefault();
        $$('.wrow.is-open', list).forEach((o) => { o.classList.remove('is-open'); $('.wrow-prev', o).hidden = true; $('video', o) && $('video', o).pause(); });
        row.classList.add('is-open'); prev.hidden = false; burst(row, accentOf(row));
        const v = $('video', prev); if (v && !RM) v.play().catch(() => {});
      });
    });
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
