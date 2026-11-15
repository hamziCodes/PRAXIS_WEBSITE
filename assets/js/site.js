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
  const darks = $$('.svc-panel, .gallery, .closing, .ftr, .wx, .proj-cover');
  let lastY = scrollY, ticking = false;
  const onScroll = () => {
    const y = scrollY;
    if (hdr) {
      const menuOpen = doc.classList.contains('menu-open');
      hdr.classList.toggle('is-hidden', !menuOpen && y > 400 && y > lastY + 4);
      if (y < lastY - 4 || y < 400) hdr.classList.remove('is-hidden');
      const probe = 40;
      const overDark = darks.some((d) => { const r = d.getBoundingClientRect(); return r.top <= probe && r.bottom >= probe; });
      const heroDark = doc.classList.contains('is-home') && (window.__pxMelt == null || window.__pxMelt < 0.5);
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

  // ── WORK INDEX (C13–C15): scroll moves the highlight and swaps the full-screen work; List View toggle
  const wx = $('[data-wx]');
  if (wx) {
    const links = $$('[data-wx-i]', wx), bgs = $$('[data-wx-bg]', wx), names = $('[data-wx-names]', wx), count = $('[data-wx-count]', wx);
    const n = links.length; let cur = -1;
    const load = (k) => { const b = bgs[k]; if (!b || b._ok) return; b._ok = true; $$('[data-srcset]', b).forEach((s) => { s.srcset = s.dataset.srcset; }); $$('img[data-src]', b).forEach((im) => { im.src = im.dataset.src; }); };
    const set = (k) => {
      if (k === cur) return; cur = k;
      for (let d = -2; d <= 2; d++) load(k + d);
      links.forEach((a, i) => { const li = a.parentElement; li.classList.toggle('on', i === k); li.style.setProperty('--d', Math.abs(i - k)); });
      bgs.forEach((b, i) => { b.classList.toggle('on', i === k); const im = $('img', b); if (im) im.style.viewTransitionName = i === k ? 'work-cover' : 'none'; });
      names.style.setProperty('--a', k); count.textContent = String(k + 1).padStart(2, '0');
    };
    const span = () => Math.max(1, wx.offsetHeight - innerHeight);
    const onS = () => { if (doc.classList.contains('wx-list')) return; const p = Math.min(0.9999, Math.max(0, -wx.getBoundingClientRect().top / span())); set(Math.floor(p * n)); };
    addEventListener('scroll', () => requestAnimationFrame(onS), { passive: true }); addEventListener('resize', onS);
    const jump = (i) => { const y = wx.offsetTop + ((i + 0.5) / n) * span(); if (lenis) lenis.scrollTo(y, { immediate: true }); else scrollTo(0, y); };
    links.forEach((a, i) => {
      a.addEventListener('focus', () => { jump(i); set(i); });
      if (FINE) a.addEventListener('pointerenter', () => set(i));
      a.addEventListener('click', () => set(i)); // the picture the visitor chose carries over into the case study
    });
    set(0);
    const view = (v, push) => {
      doc.classList.toggle('wx-list', v === 'list');
      if (push) history.replaceState(null, '', v === 'list' ? '#list' : location.pathname);
      if (lenis) lenis.scrollTo(0, { immediate: true }); else scrollTo(0, 0);
      if (v !== 'list') onS();
    };
    $$('[data-view]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); e.stopImmediatePropagation(); view(a.dataset.view, true); }));
    if (location.hash === '#list') view('list', false);
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

  // ═════ HOMEPAGE v6 ═════
  const PAL = ['#B1FA63', '#FE7733', '#B2A1FF', '#FFFFFF'];
  const isHome = doc.classList.contains('is-home');

  // ── MENU ON SCROLL (C4): the header waits off-screen over the opening frame
  if (isHome && hdr) {
    const top = () => hdr.classList.toggle('at-top', scrollY < 40 && !doc.classList.contains('menu-open'));
    addEventListener('scroll', top, { passive: true }); top();
  }

  // ── THE REEL (C1–C3): plays muted (never with reduced motion), opens in pixels, dims into the black stage
  const reel = $('[data-reel]');
  if (reel) {
    const v = $('[data-reel-v]', reel), btn = $('[data-reel-btn]', reel), lbl = $('[data-reel-label]', reel), cv = $('[data-reel-px]', reel);
    let userPaused = RM, inView = true;
    const setBtn = () => { const paused = v.paused; btn.setAttribute('aria-pressed', String(paused)); lbl.textContent = paused ? 'Play' : 'Pause'; };
    const tryPlay = () => { if (userPaused || !inView || document.hidden) return; const p = v.play(); if (p && p.catch) p.catch(() => setBtn()); };
    v.addEventListener('play', setBtn); v.addEventListener('pause', setBtn);
    btn.addEventListener('click', () => { if (v.paused) { userPaused = false; inView = true; tryPlay(); } else { userPaused = true; v.pause(); } });
    if (io) new IntersectionObserver((es) => { inView = es[0].isIntersecting; if (inView) tryPlay(); else v.pause(); }, { threshold: 0.05 }).observe(reel);
    document.addEventListener('visibilitychange', () => (document.hidden ? v.pause() : tryPlay()));
    if (RM) { cv.remove(); setBtn(); }
    else {
      v.preload = 'auto';
      // pixel open: the frame starts as a black field of square pixels; they open from the centre out,
      // a few flashing brand colours on their way, until the whole picture is there.
      const ctx = cv.getContext('2d');
      const dpr = Math.min(2, devicePixelRatio || 1);
      const W = (cv.width = Math.round(reel.clientWidth * dpr)), H = (cv.height = Math.round(reel.clientHeight * dpr));
      const u = Math.ceil(Math.max(W, H) / (innerWidth < 760 ? 14 : 26));
      const cols = Math.ceil(W / u), rows = Math.ceil(H / u), cx = cols / 2, cy = rows / 2, maxd = Math.hypot(cx, cy);
      const cells = [];
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const d = Math.hypot(i + 0.5 - cx, j + 0.5 - cy) / maxd;
        cells.push({ i, j, t: d * 0.62 + Math.random() * 0.38, c: Math.random() < 0.16 ? pick(PAL) : null });
      }
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
      const T = 1500;
      const open = () => {
        const t0 = performance.now();
        const step = (now) => {
          const p = Math.min(1, (now - t0) / T);
          ctx.clearRect(0, 0, W, H);
          for (const c of cells) {
            if (p >= c.t) continue; // open
            const near = c.t - p;
            ctx.fillStyle = c.c && near < 0.09 ? c.c : '#000'; // a brand colour flashes just before the pixel opens
            ctx.fillRect(c.i * u, c.j * u, u + 1, u + 1);
          }
          if (p < 1) requestAnimationFrame(step); else cv.remove();
        };
        requestAnimationFrame(step);
      };
      // The trailer's first second is its own fade up from black (the loop seam). On first play, start just past it,
      // wait until the picture can actually play, and only then open the pixels, so they never open onto black.
      let opened = false; const go = () => { if (opened) return; opened = true; setTimeout(open, 60); };
      v.addEventListener('loadedmetadata', () => { try { if (v.currentTime < 1) v.currentTime = 1.1; } catch (e) { /* not seekable yet */ } }, { once: true });
      v.addEventListener('canplay', tryPlay, { once: true });
      v.addEventListener('playing', go, { once: true });
      setTimeout(go, 3200); // slow connection: open onto the poster frame instead
      v.load();
    }
    // scroll-linked dim: the reel recedes as the black stage arrives
    const rp = () => { const r = Math.min(1, Math.max(0, scrollY / (reel.offsetHeight || 1))); reel.style.setProperty('--rp', r.toFixed(3)); };
    addEventListener('scroll', () => requestAnimationFrame(rp), { passive: true }); rp();
  }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  // ── MAJOR WORKS (C6–C8): one at a time on scroll; straight at rest, a slight tilt under the cursor
  $$('.work').forEach((w) => {
    if (!io || RM) { w.classList.add('is-in'); return; }
    const o = new IntersectionObserver((es) => { if (es[0].isIntersecting) { w.classList.add('is-in'); o.disconnect(); } }, { threshold: 0.18 });
    o.observe(w);
  });
  if (FINE && !RM) $$('[data-tilt]').forEach((el) => {
    const host = el.closest('a') || el;
    let tx = 0, ty = 0, x = 0, y = 0, ts = 1, s = 1, raf = 0;
    const loop = () => {
      x += (tx - x) * 0.12; y += (ty - y) * 0.12; s += (ts - s) * 0.12;
      el.style.setProperty('--rx', `${y.toFixed(2)}deg`); el.style.setProperty('--ry', `${x.toFixed(2)}deg`); el.style.setProperty('--ts', s.toFixed(4));
      raf = Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(ts - s) > 0.01 ? requestAnimationFrame(loop) : 0;
    };
    host.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect(); const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      tx = px * 5; ty = -py * 4; ts = 1.012; if (!raf) raf = requestAnimationFrame(loop);
    });
    host.addEventListener('pointerleave', () => { tx = 0; ty = 0; ts = 1; if (!raf) raf = requestAnimationFrame(loop); });
  });

  // ── THE MELT: black runs to Bone as Services arrives (scroll-linked, not timed)
  const sv = $('#services');
  if (isHome && sv) {
    doc.classList.add('js-melt');
    const melt = () => {
      const top = sv.getBoundingClientRect().top; const raw = (innerHeight * 0.95 - top) / (innerHeight * 0.6);
      const t = Math.min(1, Math.max(0, raw)); const m = t * t * (3 - 2 * t);
      doc.style.setProperty('--m', m.toFixed(3)); window.__pxMelt = m;
    };
    addEventListener('scroll', () => requestAnimationFrame(melt), { passive: true }); addEventListener('resize', melt); melt();
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
