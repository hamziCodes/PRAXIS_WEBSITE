// Praxis Studio — static site build. Run: node src/build.mjs
// Reads src/data/*, writes the full site into the repo root. Never touches docs/.
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { services, serviceBySlug } from './data/services.mjs';
import { projects } from './data/projects.mjs';
import { articles, faqHome, glossary } from './data/journal.mjs';
import { artFor, heroArt, clientLogoSvg, esc } from './art.mjs';
import { sprite, files as logoFiles, favicon, use } from './logo.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://praxis.studio';
const EMAIL = 'hello@praxis.studio';
const YEAR = 2026;
const out = (p, s) => { const f = join(ROOT, p); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, s); };

// clean generated folders (never docs/)
for (const d of ['services', 'work', 'about', 'journal', 'contact', 'glossary', 'assets/img', 'assets/logo']) rmSync(join(ROOT, d), { recursive: true, force: true });

// ───────── helpers
const svcName = (s) => serviceBySlug[s].name;
const arrow = '<span class="btn-ico" aria-hidden="true"><svg><use href="#i-arrow"/></svg></span>';
const star = (cls = '') => `<svg class="star ${cls}" aria-hidden="true" focusable="false"><use href="#px-star"/></svg>`;
const btn = (href, label, cls = 'btn-ink') => `<a class="btn ${cls}" href="${href}"><span>${label}</span>${arrow}</a>`;
const link = (href, label) => `<a class="ulink" href="${href}">${label}<svg aria-hidden="true"><use href="#i-arrow"/></svg></a>`;
const sf = (w) => `<em class="sf">${w}</em>`; // the one serif display word
const fmtDate = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const pad = (n) => String(n).padStart(2, '0');
const imgs = (p) => {
  const base = `assets/img/work/${p.slug}/`;
  if (p.images) return { hero: base + p.images[0], gallery: p.images.slice(1).map((f) => base + f) };
  return { hero: base + 'hero.svg', gallery: p.gallery.map((_, i) => `${base}${pad(i + 1)}.svg`) };
};
const KIND_ALT = { identity: 'identity', bag: 'coffee bags in three roasts', cups: 'takeaway cups and a cup on its saucer', phone: 'app screen', phones: 'three app screens', laptop: 'website on a laptop', browser: 'website in a browser', poster: 'poster series on a wall', cards: 'stationery and business cards', social: 'social media grid and post', billboard: 'billboard on the street', deck: 'strategy document spread', report: 'results dashboard', pattern: 'brand pattern', sign: 'storefront signage', tote: 'tote bag', bottle: 'bottles and balm', pass: 'festival passes and wristband', chat: 'assistant conversation on the website', search: 'search answer and results', radio: 'radio script and spot', swatch: 'colour palette and typeface' };
const alt = (p, k) => `${p.name}: ${KIND_ALT[k] || 'project visual'}`;
const tags = (p) => `<ul class="tags"><li>${esc(p.sub)}</li><li>${esc(p.location)}</li><li class="tag-svc">${star('s-' + p.service)}${esc(svcName(p.service))}</li></ul>`;
const clock = (cls = '') => `<span class="clock ${cls}"><span class="dot" data-open-dot></span><span data-open>Open</span><span class="clock-t" data-clock>--:--</span></span>`;

// ───────── layout
function page({ depth, path, title, desc, body, cls = '', preload = false, ld = '' }) {
  const R = depth === -1 ? '/' : depth === 0 ? './' : '../'.repeat(depth);
  const fullTitle = title ? `${title} | Praxis Studio` : 'Praxis Studio — Theory made real.';
  const canonical = SITE + path;
  const navItem = (href, label, sub) => `<li class="nav-i${sub ? ' has-sub' : ''}"><a href="${R}${href}">${label}</a>${sub ? `<div class="nav-sub"><ul>${sub}</ul></div>` : ''}</li>`;
  const svcSub = services.map((s) => `<li><a href="${R}services/${s.slug}/">${star('s-' + s.slug)}${s.name}</a></li>`).join('') + `<li class="sub-all"><a href="${R}services/">All services</a></li>`;
  const workSub = services.map((s) => `<li><a href="${R}work/?cat=${s.slug}">${star('s-' + s.slug)}${s.name}</a></li>`).join('') + `<li class="sub-all"><a href="${R}work/">All work</a></li>`;
  const b = body.replace(/\{R\}/g, R);
  return `<!doctype html>
<html lang="en" class="${cls}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; form-action 'self' mailto:; base-uri 'self'; object-src 'none'">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Praxis Studio">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${SITE}/assets/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#DFE0D0">
<link rel="icon" href="${R}favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${R}assets/apple-touch-icon.png">
<link rel="manifest" href="${R}site.webmanifest">
<link rel="preload" href="${R}assets/fonts/handjet.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${R}assets/fonts/instrument-serif-italic.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${R}assets/css/site.css">
<script src="${R}assets/js/vendor/lenis.min.js" defer></script>
<script src="${R}assets/js/site.js" defer></script>${ld}
</head>
<body>
${sprite}
<a class="skip" href="#main">Skip to content</a>
${preload ? `<div class="preload" aria-hidden="true"><svg class="pl-mark" viewBox="-45 -45 90 90">${[[0,0,20],[-15,-15,15],[15,-15,15],[-15,15,15],[15,15,15],[-27.5,-27.5,10],[27.5,-27.5,10],[-27.5,27.5,10],[27.5,27.5,10],[0,-40,10],[0,40,10],[-40,0,10],[40,0,10]].map(([x,y,s],i)=>`<rect x="${x-s/2}" y="${y-s/2}" width="${s}" height="${s}" style="--i:${i}"/>`).join('')}</svg></div>` : ''}
<header class="hdr" data-hdr>
  <nav class="pill" aria-label="Main">
    <a class="pill-logo" href="${R}">${use('px-lockup', 'logo', 'Praxis Studio, home')}</a>
    <ul class="pill-links">
      ${navItem('services/', 'Services', svcSub)}
      ${navItem('work/', 'Work', workSub)}
      ${navItem('about/', 'About')}
      ${navItem('journal/', 'Journal')}
    </ul>
    <a class="btn btn-inch btn-sm pill-cta" href="${R}contact/"><span>Contact</span>${arrow}</a>
    <button class="pill-menu" type="button" aria-expanded="false" aria-controls="menu" data-menu-btn><span class="bars" aria-hidden="true"></span><span class="sr">Menu</span></button>
  </nav>
</header>
<div class="menu" id="menu" data-menu hidden>
  <nav aria-label="Mobile">
    <ul class="menu-links">
      <li><a href="${R}services/">Services</a></li><li><a href="${R}work/">Work</a></li><li><a href="${R}about/">About</a></li><li><a href="${R}journal/">Journal</a></li><li><a href="${R}glossary/">Glossary</a></li><li><a href="${R}contact/">Contact</a></li>
    </ul>
    <div class="menu-foot"><a href="mailto:${EMAIL}">${EMAIL}</a>${clock()}</div>
  </nav>
</div>
<main id="main">
${b}
</main>
${footer(R)}
</body>
</html>`;
}

function closing(R, headline = `Ready to make it ${sf('real')}?`) {
  return `<section class="closing" aria-labelledby="close-h">
  <div class="wrap closing-in">
    <h2 class="d2" id="close-h" data-reveal>${headline}</h2>
    <p class="lead">Tell us what you are trying to do and by when. We reply within two working days.</p>
    <div class="closing-cta"><a class="mail-xl" href="mailto:${EMAIL}">${EMAIL}</a>${btn('{R}contact/', 'Start a project', 'btn-inch')}</div>
  </div>
  <div class="closing-px" aria-hidden="true" data-pixfield></div>
</section>`;
}

function footer(R) {
  return `<footer class="ftr">
  <div class="wrap">
    <div class="ftr-grid">
      <div class="ftr-col ftr-studio">
        <p class="ftr-tag">Theory made real.</p>
        <a class="ftr-mail" href="mailto:${EMAIL}">${EMAIL}</a>
        <p class="ftr-city">Islamabad, Pakistan ${clock('clock-ftr')}</p>
      </div>
      <nav class="ftr-col" aria-label="Services"><h2 class="tag">Services</h2><ul>${services.map((s) => `<li><a href="${R}services/${s.slug}/">${s.name}</a></li>`).join('')}</ul></nav>
      <nav class="ftr-col" aria-label="Studio"><h2 class="tag">Studio</h2><ul><li><a href="${R}work/">Work</a></li><li><a href="${R}about/">About</a></li><li><a href="${R}journal/">Journal</a></li><li><a href="${R}glossary/">Glossary</a></li><li><a href="${R}contact/">Contact</a></li></ul></nav>
    </div>
    <a class="ftr-word" href="${R}" aria-label="Praxis Studio, home">${use('px-word', 'ftr-word-svg')}</a>
    <div class="ftr-base"><span>© ${YEAR} Praxis Studio</span><span>Hamza · Laiba · Shahzaib</span><a href="#main" data-top>Back to top</a></div>
  </div>
</footer>`;
}

// ───────── shared blocks
function workCard(p, R, opts = {}) {
  const i = imgs(p);
  return `<article class="wcard${opts.cls ? ' ' + opts.cls : ''}" data-cat="${p.service}">
  <a class="wcard-a" href="${R}work/${p.slug}/" aria-label="${esc(p.name)}: view case study">
    <div class="wcard-img" data-px><img src="${R}${i.hero}" alt="${esc(alt(p, 'identity'))}" loading="lazy" width="1600" height="1100"></div>
    ${tags(p)}
    <h3 class="wcard-name">${esc(p.name)}</h3>
    <p class="wcard-q">${esc(p.question)}</p>
    <span class="ulink" aria-hidden="true">View case study<svg><use href="#i-arrow"/></svg></span>
  </a>
</article>`;
}
function metricCard(p, R) {
  return `<article class="wcard mcard">
  <a class="wcard-a" href="${R}work/${p.slug}/">
    <p class="mcard-client">${esc(p.name)}</p>
    <ul class="tags tags-dark"><li>${esc(p.sub)}</li><li>${esc(p.location)}</li></ul>
    <p class="mcard-v">${esc(p.metric.value)}</p>
    <p class="mcard-l">${esc(p.metric.label)}</p>
    ${p.metric.note ? `<p class="mcard-n">${esc(p.metric.note)}</p>` : ''}
    <span class="ulink">Read the case study<svg aria-hidden="true"><use href="#i-arrow"/></svg></span>
  </a>
</article>`;
}
function testimonials(R, list, title = `Word from our ${sf('clients')}`) {
  return `<section class="testi" aria-labelledby="testi-h">
  <div class="wrap">
    <div class="testi-head"><h2 class="d2" id="testi-h" data-reveal>${title}</h2></div>
    <div class="testi-slider" data-slider aria-roledescription="carousel" aria-label="Client testimonials">
      ${list.map((p, i) => `<figure class="testi-slide${i === 0 ? ' is-on' : ''}" data-slide aria-roledescription="slide" aria-label="${i + 1} of ${list.length}"${i ? ' hidden' : ''}>
        <img class="testi-logo" src="${R}assets/img/clients/${p.slug}.svg" alt="${esc(p.name)} logo" width="200" height="40">
        <blockquote><p>“${esc(p.testimonial.quote)}”</p></blockquote>
        <figcaption><strong>${esc(p.testimonial.name)}</strong><span>${esc(p.testimonial.role)}, ${esc(p.name)}</span><a class="ulink" href="${R}work/${p.slug}/">View case study<svg aria-hidden="true"><use href="#i-arrow"/></svg></a></figcaption>
      </figure>`).join('')}
      <div class="testi-ctrl">
        <button class="rbtn" type="button" data-prev aria-label="Previous testimonial"><svg class="flip" aria-hidden="true"><use href="#i-arrow"/></svg></button>
        <button class="rbtn" type="button" data-next aria-label="Next testimonial"><svg aria-hidden="true"><use href="#i-arrow"/></svg></button>
        <span class="testi-count tag" aria-live="polite"><span data-count>01</span> / ${pad(list.length)}</span>
      </div>
    </div>
  </div>
</section>`;
}
function faq(list, id = 'faq', title = `Got ${sf('questions')}?`, R = '{R}') {
  return `<section class="faq" aria-labelledby="${id}-h">
  <div class="wrap faq-in">
    <div class="faq-side"><h2 class="d2" id="${id}-h" data-reveal>${title}</h2><p class="lead">The questions we hear most often. Anything else, just ask.</p>${btn(R + 'contact/', 'Contact us')}</div>
    <div class="acc" data-acc>
      ${list.map(([q, a], i) => `<div class="acc-i"><h3><button type="button" class="acc-b" aria-expanded="false" aria-controls="${id}-${i}" id="${id}-b${i}"><span>${esc(q)}</span><span class="acc-ico" aria-hidden="true"><svg><use href="#i-plus"/></svg></span></button></h3><div class="acc-p" id="${id}-${i}" role="region" aria-labelledby="${id}-b${i}"><div><p>${esc(a)}</p></div></div></div>`).join('')}
    </div>
  </div>
</section>`;
}
function studio(R) {
  return `<section class="studio" aria-labelledby="studio-h">
  <div class="wrap studio-in">
    <div><h2 class="d2" id="studio-h" data-reveal>In Islamabad, on ${sf('your')} time.</h2>
    <p class="lead">We work with clients in ten countries. Calls happen in your hours, files arrive in your morning.</p></div>
    <div class="office">
      <p class="tag">The studio</p>
      <p class="office-city">Islamabad<span>Pakistan</span></p>
      <p class="office-time" data-clock-big>--:--</p>
      <p class="office-st">${clock('clock-office')}<span class="office-h">Mon–Fri, 10:00–19:00 PKT</span></p>
      <p class="office-you" data-yourtime></p>
      <a class="ulink" href="mailto:${EMAIL}">${EMAIL}<svg aria-hidden="true"><use href="#i-arrow"/></svg></a>
    </div>
  </div>
</section>`;
}
function articleCard(a, R) {
  return `<article class="acard"><a href="${R}journal/${a.slug}/"><p class="tag">${a.read} min read · ${fmtDate(a.date)}</p><h3>${esc(a.title)}</h3><p>${esc(a.dek)}</p><span class="ulink" aria-hidden="true">Read<svg><use href="#i-arrow"/></svg></span></a></article>`;
}

// ───────── HOME
function home() {
  const R = './';
  const featured = ['koffa', 'ledgerly', 'thread-and-loom', 'velour', 'cedarline-clinics', 'kitepay'].map((s) => projects.find((p) => p.slug === s));
  const stack = ['koffa', 'velour', 'ledgerly', 'lowtide', 'oleum'].map((s) => projects.find((p) => p.slug === s));
  const body = `
<section class="hero" data-hero aria-labelledby="hero-h">
  <canvas class="snake" data-snake aria-hidden="true"></canvas>
  <div class="snake-pills" aria-hidden="true"><span class="spill">Branding</span><span class="spill">UIUX</span><span class="spill">Motion</span><span class="spill">SEO</span></div>
  <div class="wrap hero-in">
    <p class="hero-pre" data-enter>The design-first studio for strategy, brand, web and campaigns.</p>
    <h1 class="d1 hero-h" id="hero-h" data-pixelbreak data-enter><span class="hl-line">Theory <span class="stack" data-stack aria-hidden="true">${stack.map((p, i) => `<img src="${R}${imgs(p).hero}" alt="" width="1600" height="1100"${i ? ' class="off"' : ''}>`).join('')}</span></span> <span class="hl-line"><span class="hl">made</span> ${sf('real.')}</span></h1>
    <div class="hero-foot" data-enter>
      <p class="hero-loc"><span class="tag">Islamabad</span>${clock()}</p>
      <p class="hero-sum">Three people. Four service areas. Sixteen projects you can open and read.</p>
      ${btn(R + 'work/', 'See the work')}
    </div>
  </div>
</section>

<section class="manifesto" aria-label="About Praxis">
  <div class="wrap mani-in">
    <p class="mani-text" data-words>Praxis is the step after theory. We think a problem through, then we make the answer: the strategy, the identity, the website and the campaign, built by the same three people from the first call to the last file.</p>
    <div class="mani-px" aria-hidden="true" data-bigmark></div>
  </div>
</section>

<section class="about-strip" aria-labelledby="about-h">
  <div class="wrap about-in">
    <div>
      <h2 class="d2" id="about-h" data-reveal>We believe in work you can ${sf('point')} at.</h2>
      <p class="lead">A new studio, and proud of it. No account layers, no hand-offs, no decks that never ship. You talk to the people doing the work, and the work goes live.</p>
      ${link(R + 'about/', 'About the studio')}
    </div>
    <dl class="stats">
      <div><dt class="tag">People</dt><dd data-count-to="3">3</dd></div>
      <div><dt class="tag">Projects</dt><dd data-count-to="16">16</dd></div>
      <div><dt class="tag">Service areas</dt><dd data-count-to="4">4</dd></div>
    </dl>
  </div>
</section>

<section class="svc-panel" aria-labelledby="svc-h">
  <div class="wrap">
    <h2 class="d2" id="svc-h" data-reveal>Our ${sf('services')}.</h2>
    <div class="svc-grid">
      <div class="acc acc-svc" data-acc data-acc-single data-svc-acc>
        ${services.map((s, i) => {
          const p = projects.find((x) => x.service === s.slug);
          return `<div class="acc-i" style="--sc:${s.color}" data-svc-img="${R}${imgs(p).hero}" data-svc-name="${esc(p.name)}" data-svc-href="${R}work/${p.slug}/">
          <h3><button type="button" class="acc-b" aria-expanded="${i === 0}" aria-controls="svc-${i}" id="svc-b${i}">${star('svc-star')}<span>${s.name}</span><span class="acc-ico" aria-hidden="true"><svg><use href="#i-plus"/></svg></span></button></h3>
          <div class="acc-p" id="svc-${i}" role="region" aria-labelledby="svc-b${i}"><div>
            <p class="svc-subs">${s.subs.map(([n]) => `<span>${n}</span>`).join('<i aria-hidden="true">/</i>')}</p>
            <p class="svc-line">${s.line}</p>${link(R + 'services/' + s.slug + '/', 'Explore ' + s.name.toLowerCase())}
          </div></div></div>`;
        }).join('')}
      </div>
      <a class="svc-vis" href="${R}work/${projects[0].slug}/" data-svc-vis>
        <img src="${R}${imgs(projects.find((x) => x.service === services[0].slug)).hero}" alt="" width="1600" height="1100" data-svc-visimg>
        <span class="svc-vis-tag tag" data-svc-visname>${esc(projects[0].name)}</span>
      </a>
    </div>
  </div>
</section>

<section class="work-rail" aria-labelledby="wr-h">
  <div class="wrap wr-in">
    <div class="wr-side">
      <h2 class="d2" id="wr-h" data-reveal>Work they ${sf('trusted')} us with.</h2>
      <p class="lead">Sixteen clients in ten countries, from a coffee roaster in Lahore to a bank in Karachi and a festival in Colombo.</p>
      ${link(R + 'work/', 'View all our work')}
    </div>
    <div class="rail" data-drag tabindex="0" aria-label="Featured projects, scroll or drag sideways">
      <div class="rail-track">
        ${featured.slice(0, 2).map((p) => workCard(p, R)).join('')}
        ${metricCard(featured[2], R)}
        ${featured.slice(3).map((p) => workCard(p, R)).join('')}
        <a class="rail-end" href="${R}work/"><span class="d3">All our work</span><span class="rbtn rbtn-inch" aria-hidden="true"><svg><use href="#i-arrow"/></svg></span></a>
      </div>
    </div>
    <div class="rail-bar" aria-hidden="true"><span data-rail-bar></span></div>
  </div>
</section>

<section class="clients" aria-labelledby="cl-h">
  <div class="wrap">
    <h2 class="d3" id="cl-h">Sixteen clients, ten countries</h2>
    <ul class="logo-wall">${projects.map((p) => `<li><a href="${R}work/${p.slug}/"><img src="${R}assets/img/clients/${p.slug}.svg" alt="${esc(p.name)}" width="200" height="40"></a></li>`).join('')}</ul>
  </div>
</section>

${testimonials(R, projects)}

<section class="people" aria-labelledby="people-h">
  <div class="wrap">
    <h2 class="d2" id="people-h" data-reveal>The people behind the ${sf('work')}.</h2>
    <ul class="names">${['Hamza', 'Laiba', 'Shahzaib'].map((n) => `<li><span class="name">${n}</span></li>`).join('')}</ul>
  </div>
</section>

${studio(R)}

<section class="journal-strip" aria-labelledby="js-h">
  <div class="wrap">
    <div class="js-head"><h2 class="d2" id="js-h" data-reveal>Notes from the ${sf('studio')}.</h2>${link(R + 'journal/', 'All articles')}</div>
    <div class="acards">${articles.map((a) => articleCard(a, R)).join('')}</div>
  </div>
</section>

${faq(faqHome)}
${closing(R)}`;
  const ld = `\n<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'Praxis Studio', slogan: 'Theory made real.', url: SITE, email: EMAIL, logo: SITE + '/assets/logo/praxis-lockup.svg', address: { '@type': 'PostalAddress', addressLocality: 'Islamabad', addressCountry: 'PK' }, founder: ['Hamza', 'Laiba', 'Shahzaib'].map((n) => ({ '@type': 'Person', name: n })) })}</script>`;
  out('index.html', page({ depth: 0, path: '/', title: '', desc: 'Praxis Studio is a design-first studio in Islamabad for strategy, brand, web and campaigns. Theory made real.', body, cls: 'is-home', preload: true, ld }));
}

// ───────── SERVICES
function servicesIndex() {
  const R = '../';
  const body = `
<section class="phero" aria-labelledby="ph">
  <div class="wrap">
    <h1 class="d1 phero-h" id="ph" data-enter>Four ways we make it ${sf('real.')}</h1>
    <p class="lead phero-lead" data-enter>Strategy, brand, web and campaigns. Use one, or let them work together: the same three people carry the thinking into the making.</p>
  </div>
</section>
<section class="svc-list" aria-label="Services">
  <div class="wrap">
    ${services.map((s, i) => `<a class="svc-row" href="${R}services/${s.slug}/" style="--sc:${s.color}">
      <span class="svc-tile" aria-hidden="true">${star('svc-star')}</span>
      <span class="svc-row-main"><span class="svc-row-n tag">${pad(i + 1)}</span><span class="d3 svc-row-t">${s.name}</span><span class="svc-row-l">${esc(s.intro)}</span></span>
      <span class="svc-row-subs">${s.subs.map(([n]) => `<span>${n}</span>`).join('')}</span>
      <span class="rbtn" aria-hidden="true"><svg><use href="#i-arrow"/></svg></span>
    </a>`).join('')}
  </div>
</section>
<section class="how" aria-labelledby="how-h">
  <div class="wrap how-in">
    <h2 class="d2" id="how-h" data-reveal>One team, ${sf('start')} to finish.</h2>
    <div class="how-cols">
      <p>Most projects cross service lines. A rebrand needs a website. A website needs traffic. Traffic needs a strategy that knows what it is for.</p>
      <p>Because the same three people handle all four, nothing gets lost between agencies. The strategy is written by someone who will design it, and the campaign is run by someone who built the site it points to.</p>
    </div>
  </div>
</section>
${testimonials(R, projects.filter((_, i) => i % 2 === 0))}
${closing(R)}`;
  out('services/index.html', page({ depth: 1, path: '/services/', title: 'Services', desc: 'Strategy & consulting, brand & creative, web & digital, campaigns & media. Four service areas from Praxis Studio.', body }));
}

function servicePage(s, idx) {
  const R = '../../';
  const list = projects.filter((p) => p.service === s.slug);
  const prev = services[(idx + services.length - 1) % services.length], next = services[(idx + 1) % services.length];
  const body = `
<section class="phero svc-hero" aria-labelledby="ph" style="--sc:${s.color}">
  <div class="wrap svc-hero-in">
    <span class="svc-tile svc-tile-xl" aria-hidden="true" data-enter>${star('svc-star')}</span>
    <div>
      <h1 class="d1 phero-h" id="ph" data-enter>${s.name}</h1>
      <p class="lead phero-lead" data-enter>${esc(s.intro)}</p>
    </div>
  </div>
</section>
<section class="svc-lead" aria-labelledby="sl-h">
  <div class="wrap svc-lead-in">
    <h2 class="d2" id="sl-h" data-reveal>${esc(s.lead)}</h2>
    <div class="prose">${s.body.map((t) => `<p>${esc(t)}</p>`).join('')}</div>
  </div>
</section>
<section class="svc-subs-sec" aria-labelledby="ss-h">
  <div class="wrap">
    <h2 class="sr" id="ss-h">What ${s.name.toLowerCase()} covers</h2>
    <div class="acc acc-big" data-acc data-acc-single>
      ${s.subs.map(([n, d], i) => `<div class="acc-i"><h3><button type="button" class="acc-b" aria-expanded="${i === 0}" aria-controls="sub-${i}" id="sub-b${i}">${star('s-' + s.slug)}<span>${n}</span><span class="acc-ico" aria-hidden="true"><svg><use href="#i-plus"/></svg></span></button></h3><div class="acc-p" id="sub-${i}" role="region" aria-labelledby="sub-b${i}"><div><p>${esc(d)}</p></div></div></div>`).join('')}
    </div>
  </div>
</section>
<section class="svc-work" aria-labelledby="sw-h">
  <div class="wrap">
    <div class="js-head"><h2 class="d2" id="sw-h" data-reveal>${s.short} work, ${sf('made')} real.</h2>${link(R + 'work/?cat=' + s.slug, 'All ' + s.name.toLowerCase() + ' work')}</div>
    <div class="wgrid">${list.map((p) => workCard(p, R)).join('')}</div>
  </div>
</section>
<section class="method" aria-labelledby="m-h">
  <div class="wrap">
    <h2 class="d2" id="m-h" data-reveal>One method, five ${sf('steps')}.</h2>
    <ol class="steps">${s.method.map(([t, d], i) => `<li><span class="tag">Step ${i + 1}</span><h3>${t}</h3><p>${esc(d)}</p></li>`).join('')}</ol>
  </div>
</section>
${testimonials(R, list, `Word from our ${sf('clients')}`)}
${faq(s.faq, 'sfaq', `Got ${sf('questions')}?`, R)}
<nav class="pn" aria-label="Other services">
  <div class="wrap pn-in">
    <a class="pn-a" href="${R}services/${prev.slug}/" rel="prev"><span class="tag">Previous service</span><span class="d3">${prev.name}</span><span class="pn-l">${prev.line}</span></a>
    <a class="pn-a pn-next" href="${R}services/${next.slug}/" rel="next"><span class="tag">Next service</span><span class="d3">${next.name}</span><span class="pn-l">${next.line}</span></a>
  </div>
</nav>
${closing(R)}`;
  out(`services/${s.slug}/index.html`, page({ depth: 2, path: `/services/${s.slug}/`, title: s.name, desc: s.intro, body }));
}

// ───────── WORK
function workIndex() {
  const R = '../';
  const body = `
<section class="phero" aria-labelledby="ph">
  <div class="wrap">
    <h1 class="d1 phero-h" id="ph" data-enter>Sixteen projects, ${sf('made')} real.</h1>
    <p class="lead phero-lead" data-enter>Every project starts with the client's question. Here is how we answered each one.</p>
    <div class="filters" role="group" aria-label="Filter by service" data-filters>
      <button type="button" class="fbtn" aria-pressed="true" data-filter="all">All <span>${projects.length}</span></button>
      ${services.map((s) => `<button type="button" class="fbtn" aria-pressed="false" data-filter="${s.slug}">${star('s-' + s.slug)}${s.name} <span>${projects.filter((p) => p.service === s.slug).length}</span></button>`).join('')}
    </div>
  </div>
</section>
<section class="work-all" aria-label="All projects">
  <div class="wrap"><div class="wgrid" data-grid>${projects.map((p) => workCard(p, R)).join('')}</div><p class="sr" aria-live="polite" data-filter-status></p></div>
</section>
${closing(R)}`;
  out('work/index.html', page({ depth: 1, path: '/work/', title: 'Work', desc: 'Sixteen projects across strategy, brand, web and campaigns, each built around the client\'s question.', body }));
}

function projectPage(p, idx) {
  const R = '../../';
  const i = imgs(p), b = p.brand;
  const prev = projects[(idx + projects.length - 1) % projects.length], next = projects[(idx + 1) % projects.length];
  const pal = [b.bg, b.accent, b.paper, b.ink].filter((c, k, a) => a.indexOf(c) === k);
  const body = `
<article class="proj">
<header class="proj-hero">
  <div class="wrap">
    <p class="proj-name" data-enter><span>${esc(p.name)}</span></p>
    <div class="proj-top">
      <div>
        ${tags(p)}
        <h1 class="d2 proj-q" data-enter>${esc(p.question)}</h1>
        <p class="lead">${esc(p.summary)}</p>
      </div>
      <dl class="meta" data-enter>
        <div><dt class="tag">Client</dt><dd>${esc(p.name)}</dd></div>
        <div><dt class="tag">Industry</dt><dd>${esc(p.industry)}</dd></div>
        <div><dt class="tag">Services</dt><dd>${p.services.map((s) => `<a href="${R}services/${s}/">${svcName(s)}</a>`).join('<br>')}</dd></div>
        <div><dt class="tag">Location</dt><dd>${esc(p.location)}</dd></div>
        <div class="meta-brand"><dt class="tag">Identity</dt><dd><img src="${R}assets/img/clients/${p.slug}.svg" alt="${esc(p.name)} logo" width="200" height="40"><span class="pal">${pal.map((c) => `<span style="background:${c}" title="${c}"></span>`).join('')}</span></dd></div>
      </dl>
    </div>
    <div class="proj-visual" data-px><img src="${R}${i.hero}" alt="${esc(alt(p, 'identity'))}" width="1600" height="1100" fetchpriority="high"></div>
  </div>
</header>
<section class="proj-body" aria-label="Case study">
  <div class="wrap">
    <div class="cs"><h2 class="tag cs-h">The challenge</h2><div class="prose"><p>${esc(p.challenge)}</p></div></div>
    <div class="cs"><h2 class="tag cs-h">The solution</h2><div class="prose"><p>${esc(p.solution)}</p><p>The project included:</p><ul class="xlist">${p.deliverables.map((d) => `<li>${star()}<span>${esc(d)};</span></li>`).join('').replace(/;<\/span><\/li>$/, '.</span></li>')}</ul></div></div>
    <div class="cs"><h2 class="tag cs-h">The results</h2><div class="prose"><ul class="xlist">${p.results.map((d) => `<li>${star()}<span>${esc(d)}</span></li>`).join('')}</ul></div></div>
    ${p.metric ? `<div class="metric" data-reveal><p class="metric-v">${esc(p.metric.value)}</p><p class="metric-l">${esc(p.metric.label)}</p>${p.metric.note ? `<p class="metric-n">${esc(p.metric.note)}</p>` : ''}</div>` : ''}
  </div>
</section>
<section class="gallery" aria-labelledby="g-h">
  <div class="wrap">
    <h2 class="d3" id="g-h">Gallery</h2>
    <div class="gal">${i.gallery.map((src, k) => `<figure class="gal-i" data-px><img src="${R}${src}" alt="${esc(alt(p, p.gallery ? p.gallery[k] : ''))}" width="1600" height="1100" loading="lazy"></figure>`).join('')}</div>
  </div>
</section>
<section class="proj-quote" aria-label="Client testimonial">
  <div class="wrap">
    <figure>
      <img class="testi-logo" src="${R}assets/img/clients/${p.slug}.svg" alt="${esc(p.name)} logo" width="200" height="40">
      <blockquote><p>“${esc(p.testimonial.quote)}”</p></blockquote>
      <figcaption><strong>${esc(p.testimonial.name)}</strong><span>${esc(p.testimonial.role)}, ${esc(p.name)}</span></figcaption>
    </figure>
  </div>
</section>
</article>
<nav class="pn" aria-label="More projects">
  <div class="wrap pn-in">
    <a class="pn-a" href="${R}work/${prev.slug}/" rel="prev"><span class="tag">Previous project</span><span class="d3">${esc(prev.name)}</span><span class="pn-l">${esc(prev.location)} · ${svcName(prev.service)}</span></a>
    <a class="pn-a pn-next" href="${R}work/${next.slug}/" rel="next"><span class="tag">Next project</span><span class="d3">${esc(next.name)}</span><span class="pn-l">${esc(next.location)} · ${svcName(next.service)}</span></a>
  </div>
</nav>
${closing(R, `Ready to take your project ${sf('further')}?`)}`;
  out(`work/${p.slug}/index.html`, page({ depth: 2, path: `/work/${p.slug}/`, title: `${p.name}: ${p.sub}`, desc: `${p.question} ${p.summary}`, body }));
  // artwork
  if (!p.images) {
    out(`assets/img/work/${p.slug}/hero.svg`, heroArt(p));
    p.gallery.forEach((k, n) => out(`assets/img/work/${p.slug}/${pad(n + 1)}.svg`, artFor(p, k, n)));
  }
  out(`assets/img/clients/${p.slug}.svg`, clientLogoSvg(p));
}

// ───────── ABOUT
function about() {
  const R = '../';
  const principles = [
    ['Evidence first', 'We read the numbers, talk to the customers and walk the street before we recommend anything.'],
    ['One direction', 'We commit to a position and argue for it. You get a recommendation, not a menu.'],
    ['Made, not described', 'Every idea is shown on the real thing: the bag, the screen, the billboard. Then it ships.'],
    ['Measured', 'We agree what success looks like at the start, and we check it at the end.'],
  ];
  const body = `
<section class="phero" aria-labelledby="ph">
  <div class="wrap">
    <h1 class="d1 phero-h" id="ph" data-enter>A studio of ${sf('three.')}</h1>
    <p class="lead phero-lead" data-enter>Praxis is a new, design-first studio in Islamabad. We work with clients worldwide on strategy, brand, web and campaigns, and we do all of it ourselves.</p>
  </div>
</section>
<section class="manifesto" aria-label="What Praxis means">
  <div class="wrap mani-in">
    <p class="mani-text" data-words>Praxis is the old word for the moment an idea becomes an act. Theory made real. It is the name of the studio and the way we work: think it through, then make it, then check that it worked.</p>
    <div class="mani-px" aria-hidden="true" data-bigmark></div>
  </div>
</section>
<section class="people people-about" aria-labelledby="people-h">
  <div class="wrap">
    <h2 class="d2" id="people-h" data-reveal>The people behind the ${sf('work')}.</h2>
    <ul class="names">${['Hamza', 'Laiba', 'Shahzaib'].map((n) => `<li><span class="name">${n}</span></li>`).join('')}</ul>
    <p class="lead people-note">Strategy, design, web and growth, shared between three people who sit in your first meeting and deliver your last file.</p>
  </div>
</section>
<section class="principles" aria-labelledby="pr-h">
  <div class="wrap">
    <h2 class="d2" id="pr-h" data-reveal>How we ${sf('work')}.</h2>
    <ol class="steps steps-4">${principles.map(([t, d], i) => `<li><span class="tag">${pad(i + 1)}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}</ol>
  </div>
</section>
<section class="about-strip" aria-label="Studio in numbers">
  <div class="wrap about-in">
    <div><h2 class="d2" data-reveal>Small on ${sf('purpose')}.</h2><p class="lead">Three people means fewer projects, more attention, and no one between you and the work. It is a choice we intend to keep.</p>${link(R + 'work/', 'See the work')}</div>
    <dl class="stats"><div><dt class="tag">People</dt><dd>3</dd></div><div><dt class="tag">Projects</dt><dd>16</dd></div><div><dt class="tag">Service areas</dt><dd>4</dd></div></dl>
  </div>
</section>
${studio(R)}
${closing(R)}`;
  out('about/index.html', page({ depth: 1, path: '/about/', title: 'About', desc: 'Praxis is a design-first studio of three in Islamabad: Hamza, Laiba and Shahzaib. Theory made real.', body }));
}

// ───────── JOURNAL
function journalIndex() {
  const R = '../';
  const body = `
<section class="phero" aria-labelledby="ph">
  <div class="wrap">
    <h1 class="d1 phero-h" id="ph" data-enter>Notes from the ${sf('studio.')}</h1>
    <p class="lead phero-lead" data-enter>What we learn on projects, written down plainly. Brand, web, search and the work in between.</p>
  </div>
</section>
<section class="journal-list" aria-label="Articles">
  <div class="wrap">
    <div class="acards acards-lg">${articles.map((a) => articleCard(a, R)).join('')}
      <article class="acard acard-gl"><a href="${R}glossary/"><p class="tag">Reference · ${glossary.length} terms</p><h3>The glossary</h3><p>Every term we use, from A/B test to wordmark, explained in a sentence or two.</p><span class="ulink" aria-hidden="true">Open the glossary<svg><use href="#i-arrow"/></svg></span></a></article>
    </div>
  </div>
</section>
${closing(R)}`;
  out('journal/index.html', page({ depth: 1, path: '/journal/', title: 'Journal', desc: 'Articles from Praxis Studio on brand, web, search and campaigns.', body }));
}
function article(a, idx) {
  const R = '../../';
  const others = articles.filter((x) => x !== a);
  const blocks = a.body.map(([t, c]) => t === 'p' ? `<p>${esc(c)}</p>` : t === 'h2' ? `<h2>${esc(c)}</h2>` : t === 'ul' ? `<ul class="xlist">${c.map((x) => `<li>${star()}<span>${esc(x)}</span></li>`).join('')}</ul>` : `<blockquote class="pull"><p>${esc(c)}</p></blockquote>`).join('\n');
  const body = `
<article class="art">
  <header class="art-head">
    <div class="wrap art-wrap">
      <p class="tag" data-enter><a href="${R}journal/">Journal</a> · ${a.tag} · ${a.read} min read</p>
      <h1 class="d2" data-enter>${esc(a.title)}</h1>
      <p class="lead" data-enter>${esc(a.dek)}</p>
      <p class="art-meta"><time datetime="${a.date}">${fmtDate(a.date)}</time> · Praxis Studio</p>
    </div>
  </header>
  <div class="wrap art-wrap prose art-body">${blocks}</div>
</article>
<section class="journal-strip" aria-labelledby="more-h">
  <div class="wrap">
    <div class="js-head"><h2 class="d3" id="more-h">Keep reading</h2>${link(R + 'journal/', 'All articles')}</div>
    <div class="acards">${others.map((x) => articleCard(x, R)).join('')}</div>
  </div>
</section>
${closing(R)}`;
  const ld = `\n<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.dek, datePublished: a.date, author: { '@type': 'Organization', name: 'Praxis Studio' }, publisher: { '@type': 'Organization', name: 'Praxis Studio' } })}</script>`;
  out(`journal/${a.slug}/index.html`, page({ depth: 2, path: `/journal/${a.slug}/`, title: a.title, desc: a.dek, body, ld }));
}

// ───────── GLOSSARY
function glossaryPage() {
  const R = '../';
  const sorted = [...glossary].sort((x, y) => x[0].localeCompare(y[0], 'en', { sensitivity: 'base' }));
  const groups = {}; sorted.forEach(([t, d]) => { const L = t[0].toUpperCase(); (groups[L] ||= []).push([t, d]); });
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const body = `
<section class="phero" aria-labelledby="ph">
  <div class="wrap">
    <h1 class="d1 phero-h" id="ph" data-enter>The ${sf('glossary.')}</h1>
    <p class="lead phero-lead" data-enter>${sorted.length} terms from strategy, brand, web and campaigns, explained the way we would explain them across a table.</p>
    <nav class="az" aria-label="Glossary letters"><ul>${letters.map((L) => groups[L] ? `<li><a href="#g-${L}">${L}</a></li>` : `<li><span aria-disabled="true">${L}</span></li>`).join('')}</ul></nav>
  </div>
</section>
<section class="gloss" aria-label="Terms">
  <div class="wrap">
    ${Object.entries(groups).map(([L, list]) => `<div class="gl-g" id="g-${L}"><h2 class="gl-l">${L}</h2><dl>${list.map(([t, d]) => `<div class="gl-t"><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join('')}</dl></div>`).join('')}
  </div>
</section>
${closing(R)}`;
  const ld = `\n<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'DefinedTermSet', name: 'Praxis Studio glossary', hasDefinedTerm: sorted.map(([t, d]) => ({ '@type': 'DefinedTerm', name: t, description: d })) })}</script>`;
  out('glossary/index.html', page({ depth: 1, path: '/glossary/', title: 'Glossary', desc: `The Praxis Studio glossary: ${sorted.length} marketing, brand, web and media terms explained plainly.`, body, ld }));
}

// ───────── CONTACT
function contact() {
  const R = '../';
  const body = `
<section class="phero contact-hero" aria-labelledby="ph">
  <div class="wrap">
    <h1 class="d1 phero-h" id="ph" data-enter>Let's make it ${sf('real.')}</h1>
    <p class="lead phero-lead" data-enter>Tell us what you are trying to do, for whom and by when. We reply within two working days, from Islamabad, in your time zone.</p>
    <a class="mail-xl" href="mailto:${EMAIL}" data-enter>${EMAIL}</a>
  </div>
</section>
<section class="contact" aria-labelledby="cf-h">
  <div class="wrap contact-in">
    <form class="cform" data-form novalidate data-endpoint="">
      <h2 class="d3" id="cf-h">Start a project</h2>
      <div class="f2">
        <div class="field"><label for="f-name">Your name</label><input id="f-name" name="name" autocomplete="name" required maxlength="120"><p class="err" id="e-name" hidden>Please tell us your name.</p></div>
        <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required maxlength="200"><p class="err" id="e-email" hidden>Please enter an email we can reply to.</p></div>
      </div>
      <div class="field"><label for="f-company">Company <span class="opt">(optional)</span></label><input id="f-company" name="company" autocomplete="organization" maxlength="160"></div>
      <fieldset class="field"><legend>What do you need?</legend><div class="chips">${services.map((s) => `<label class="chip"><input type="checkbox" name="services" value="${s.name}"><span>${star('s-' + s.slug)}${s.name}</span></label>`).join('')}</div></fieldset>
      <div class="field"><label for="f-budget">Budget</label><select id="f-budget" name="budget"><option value="">Not sure yet</option><option>Under $5,000</option><option>$5,000 – $15,000</option><option>$15,000 – $40,000</option><option>Over $40,000</option></select></div>
      <div class="field"><label for="f-msg">Your project</label><textarea id="f-msg" name="message" rows="6" required maxlength="4000"></textarea><p class="err" id="e-msg" hidden>A sentence or two about the project, please.</p></div>
      <div class="hp" aria-hidden="true"><label for="f-web">Leave this empty</label><input id="f-web" name="website" tabindex="-1" autocomplete="off"></div>
      <div class="form-foot"><button class="btn btn-inch" type="submit"><span>Send to the studio</span>${arrow}</button><p class="form-note">Sending opens your email app with everything filled in.</p></div>
      <p class="form-status" role="status" aria-live="polite" data-form-status></p>
    </form>
    <aside class="office office-side" aria-label="Studio details">
      <p class="tag">The studio</p>
      <p class="office-city">Islamabad<span>Pakistan</span></p>
      <p class="office-time" data-clock-big>--:--</p>
      <p class="office-st">${clock('clock-office')}<span class="office-h">Mon–Fri, 10:00–19:00 PKT</span></p>
      <p class="office-you" data-yourtime></p>
      <a class="ulink" href="mailto:${EMAIL}">${EMAIL}<svg aria-hidden="true"><use href="#i-arrow"/></svg></a>
    </aside>
  </div>
</section>
${faq(faqHome.slice(1, 5), 'cfaq', `Before you ${sf('write')}`, R)}`;
  out('contact/index.html', page({ depth: 1, path: '/contact/', title: 'Contact', desc: 'Start a project with Praxis Studio. Write to hello@praxis.studio.', body }));
}

function notFound() {
  const body = `
<section class="phero nf" aria-labelledby="ph">
  <div class="wrap">
    <h1 class="d1 phero-h" id="ph">This page is still ${sf('theory.')}</h1>
    <p class="lead phero-lead">The link may be old, or the page never made it out of the sketchbook.</p>
    <div class="nf-links">${btn('/', 'Back to the home page')}${link('/work/', 'See the work')}</div>
  </div>
</section>`;
  out('404.html', page({ depth: -1, path: '/404', title: 'Page not found', desc: 'Page not found.', body }));
}

// ───────── RUN
home(); servicesIndex(); services.forEach(servicePage); workIndex(); projects.forEach(projectPage); about(); journalIndex(); articles.forEach(article); glossaryPage(); contact(); notFound();
for (const [f, s] of Object.entries(logoFiles)) out('assets/logo/' + f, s);
out('favicon.svg', favicon);
out('site.webmanifest', JSON.stringify({ name: 'Praxis Studio', short_name: 'Praxis', start_url: '/', display: 'browser', background_color: '#DFE0D0', theme_color: '#DFE0D0', icons: [{ src: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' }, { src: '/assets/apple-touch-icon.png', type: 'image/png', sizes: '180x180' }] }, null, 2));
const urls = ['/', '/services/', ...services.map((s) => `/services/${s.slug}/`), '/work/', ...projects.map((p) => `/work/${p.slug}/`), '/about/', '/journal/', ...articles.map((a) => `/journal/${a.slug}/`), '/glossary/', '/contact/'];
out('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join('\n')}\n</urlset>\n`);
out('robots.txt', `User-agent: *\nAllow: /\nDisallow: /docs/\nDisallow: /src/\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`Built ${urls.length + 1} pages.`);
