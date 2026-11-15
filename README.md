<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/logo/praxis-lockup-bone.svg">
    <img src="assets/logo/praxis-lockup.svg" alt="Praxis Studio" width="420">
  </picture>
</p>

<h3 align="center">Theory made real.</h3>

<p align="center">
  The website of <strong>Praxis Studio</strong>, a design-first studio in Islamabad for strategy, brand, web and campaigns.<br>
  Three people · four service areas · sixteen projects · clients in ten countries.
</p>

<p align="center">
  <img alt="Static HTML" src="https://img.shields.io/badge/build-static%20HTML-000000?style=flat-square">
  <img alt="Zero runtime dependencies" src="https://img.shields.io/badge/runtime%20deps-0-B1FA63?style=flat-square&labelColor=000000">
  <img alt="Strict CSP" src="https://img.shields.io/badge/CSP-strict%2C%20no%20third%20parties-243837?style=flat-square">
  <img alt="Pages" src="https://img.shields.io/badge/pages-31-DFE0D0?style=flat-square&labelColor=000000">
</p>

<p align="center">
  <img src=".github/readme/01-reel.jpg" alt="Praxis Studio home page: the studio trailer playing full-bleed" width="100%">
</p>

---

## What this site is

Praxis Studio is a new, three-person studio: **Syed M. Hamza Sultan, Laiba Hamid and Muhammad Shahzaib**. The same people who sit in the first meeting design the identity, build the site and read the campaign numbers. This website is the studio's shop window, and it has four jobs:

- **Say what the studio does,** in plain words: strategy & consulting, brand & creative, web & digital, campaigns & media.
- **Prove it with work.** Sixteen full case studies, four per service. Each one opens full-screen on the work, then the client's question, then gives the challenge, solution, results, a headline metric, a gallery and a client testimonial.
- **Show how the studio thinks,** through a journal and a 48-term glossary written in the studio's own voice.
- **Make starting easy:** a live Islamabad clock with open/closed status, one email address everywhere (hello@praxis.studio) and a short project form.

The homepage follows the journey Appa walked on the reference sites: a full-bleed studio trailer that opens in pixels, a black stage, five major works one at a time, the services formation, and the speak-line. Everything sits in the Praxis brand: Bone and black, a single Inchworm accent, Neue Montreal, and the pixel as the graphic signature.

---

## Signature moments

| Moment | What it does |
|---|---|
| **The studio trailer** | A 32-second, 16:9 film cut from Appa's motion library (`src/reel/`, edited frame by frame in the browser and encoded to H.264). It opens in pixels: square tiles open from the centre out, a few flashing brand colours on the way. |
| **Menu on scroll** | The header waits off-screen over the opening frame and slides in the moment you move. |
| **Five major works** | KOFFA, LEDGERLY, VELOUR, Kitepay and LOWTIDE as wide rectangles, one per screen: client name on one side, what was done on the other, nothing on the image. Straight at rest, a slight tilt under the cursor. |
| **The melt** | Black runs to Bone as Services arrives, driven by scroll position. |
| **Living icons** | Uncommon's four animated line icons, played by a 6 KB dependency-free Lottie player in one colour. Swap the JSON files and nothing else changes. |
| **The Work index** | OuiWill's model: the active client's work fills the screen, the names scroll in large type, and the case study opens on the same picture. A List View toggle gives the editorial grid. |
| **Live studio clock** | Islamabad time with OPEN / CLOSED status. |

---

## Screenshots

<table>
  <tr>
    <td width="50%"><img src=".github/readme/02-stage.jpg" alt="The black stage: Theory made real"></td>
    <td width="50%"><img src=".github/readme/03-works.jpg" alt="A major work as a wide rectangle, name and credits on the side"></td>
  </tr>
  <tr>
    <td><img src=".github/readme/04-services.jpg" alt="Services: numbered columns with single-line animated icons"></td>
    <td><img src=".github/readme/05-closing.jpg" alt="Closing: We speak English, Arabic and Design at Praxis."></td>
  </tr>
  <tr>
    <td><img src=".github/readme/06-work-index.jpg" alt="Work index: client names over the active work, full-screen"></td>
    <td><img src=".github/readme/07-list-view.jpg" alt="List View: the editorial grid with service chips"></td>
  </tr>
  <tr>
    <td><img src=".github/readme/08-case-cover.jpg" alt="Aurel Hotels case study opening full-screen on the work"></td>
    <td><img src=".github/readme/09-case-gallery.jpg" alt="LOWTIDE case study gallery"></td>
  </tr>
  <tr>
    <td><img src=".github/readme/10-services-page.jpg" alt="Services: one page, four areas, big and bold"></td>
    <td><img src=".github/readme/11-about.jpg" alt="About: manifesto-led, restrained, studio first"></td>
  </tr>
</table>

<p align="center">
  <img src=".github/readme/m1-home.jpg" alt="Mobile home: works" width="23%">
  <img src=".github/readme/m2-work-index.jpg" alt="Mobile work index" width="23%">
  <img src=".github/readme/m3-case.jpg" alt="Mobile case study cover" width="23%">
  <img src=".github/readme/m4-services.jpg" alt="Mobile services page" width="23%">
</p>

---

## The portfolio

Sixteen client worlds, each with its own visual formula: packaging still lifes, devices on real counters, a fly-posted festival wall, a Lahore shopfront at dusk. Every image is designed and composed piece by piece in HTML/CSS/SVG (sources in `src/imagery/`), rendered with headless Chrome, and grounded in the case study it illustrates. No stock photos, no one-shot AI images.

<table>
  <tr>
    <td><a href="work/koffa/"><img src="assets/img/work/koffa/hero.webp" alt="KOFFA"></a><br><sub><b>KOFFA</b> · Visual identity</sub></td>
    <td><a href="work/ledgerly/"><img src="assets/img/work/ledgerly/hero.webp" alt="LEDGERLY"></a><br><sub><b>LEDGERLY</b> · Web &amp; mobile app</sub></td>
    <td><a href="work/velour/"><img src="assets/img/work/velour/hero.webp" alt="VELOUR"></a><br><sub><b>VELOUR</b> · Social media launch</sub></td>
    <td><a href="work/lowtide/"><img src="assets/img/work/lowtide/hero.webp" alt="LOWTIDE Festival"></a><br><sub><b>LOWTIDE</b> · Festival print</sub></td>
  </tr>
  <tr>
    <td><a href="work/tarazu-bank/"><img src="assets/img/work/tarazu-bank/hero.webp" alt="Tarazu Bank"></a><br><sub><b>Tarazu Bank</b> · UX/UI</sub></td>
    <td><a href="work/aurel-hotels/"><img src="assets/img/work/aurel-hotels/hero.webp" alt="Aurel Hotels"></a><br><sub><b>Aurel Hotels</b> · Brand guidelines</sub></td>
    <td><a href="work/oleum/"><img src="assets/img/work/oleum/hero.webp" alt="Oleum"></a><br><sub><b>Oleum</b> · E-commerce</sub></td>
    <td><a href="work/cedarline-clinics/"><img src="assets/img/work/cedarline-clinics/hero.webp" alt="Cedarline Clinics"></a><br><sub><b>Cedarline</b> · Website redesign</sub></td>
  </tr>
  <tr>
    <td><a href="work/kestrel-hotels/"><img src="assets/img/work/kestrel-hotels/hero.webp" alt="Kestrel Hotels"></a><br><sub><b>Kestrel Hotels</b> · AI concierge</sub></td>
    <td><a href="work/thread-and-loom/"><img src="assets/img/work/thread-and-loom/hero.webp" alt="Thread and Loom"></a><br><sub><b>Thread &amp; Loom</b> · Google &amp; social ads</sub></td>
    <td><a href="work/fixwell/"><img src="assets/img/work/fixwell/hero.webp" alt="Fixwell"></a><br><sub><b>Fixwell</b> · SEO + AEO</sub></td>
    <td><a href="work/kora-home/"><img src="assets/img/work/kora-home/hero.webp" alt="Kora Home"></a><br><sub><b>Kora Home</b> · Media buying</sub></td>
  </tr>
  <tr>
    <td><a href="work/saffa-stores/"><img src="assets/img/work/saffa-stores/hero.webp" alt="Saffa Stores"></a><br><sub><b>Saffa Stores</b> · Audit</sub></td>
    <td><a href="work/kisima/"><img src="assets/img/work/kisima/hero.webp" alt="Kisima Water Programme"></a><br><sub><b>Kisima</b> · Communication strategy</sub></td>
    <td><a href="work/costa-lume/"><img src="assets/img/work/costa-lume/hero.webp" alt="Costa Lume"></a><br><sub><b>Costa Lume</b> · Media plan</sub></td>
    <td><a href="work/kitepay/"><img src="assets/img/work/kitepay/hero.webp" alt="Kitepay"></a><br><sub><b>Kitepay</b> · Brand platform</sub></td>
  </tr>
</table>

---

## Brand system

<p align="center"><img src=".github/readme/palette.svg" alt="Praxis palette: Bone, Black, Inchworm, Gunmetal, Bright Snow, American Silver, Orange, Pale Violet" width="100%"></p>

| Role | Choice |
|---|---|
| **Logo** | Pixel starburst mark plus a wordmark whose **x is a chunky 4-petal star**. Traced from the brand plates and shipped as one reusable SVG component. |
| **Main type** | Neue Montreal (self-hosted, Light to Bold), with TeX Gyre Heros as the fallback. |
| **Pixel labels** | Handjet, also used for tags, labels and small display. |
| **Accent word** | Handjet, the pixel face, for the one accent word in a big headline. No serif anywhere. |
| **Colour rules** | Light Bone pages, black text, Inchworm as the single accent. Gunmetal only for galleries and closing panels. Orange and Pale Violet only as sparks inside imagery. Never more than two accents on one screen. |

---

## Stack

| Layer | What's used | Why |
|---|---|---|
| **Pages** | Hand-written semantic HTML5, generated by a zero-dependency Node script (`src/build.mjs`) | Fast, cacheable, works on any host, and content lives in plain data files |
| **Styles** | One CSS file with design tokens in custom properties. Fluid `clamp()` type, CSS Grid, `:has()`, `backdrop-filter` | No framework weight, one system |
| **Motion** | Vanilla JavaScript: `IntersectionObserver`, `requestAnimationFrame`, Canvas 2D for the pixel-open, scroll-linked colour mixing for the melt, a small in-house Lottie player for the icons, cross-document View Transitions into case studies | Every effect is progressive: content is fully visible without JS, and reduced motion gets still frames |
| **Smooth scroll** | [Lenis](https://github.com/darkroomengineering/lenis), self-hosted and optional | If it fails to load, native scrolling takes over |
| **Imagery** | 80 designed compositions (`src/imagery/<slug>/*.html`) rendered to WebP by `src/tools/render.mjs`; a portrait version of every hero for phones | Real design detail, one formula per project, re-renderable |
| **Trailer** | `src/reel/`: a browser-based editor that composes each frame on canvas, encodes H.264 with WebCodecs and writes the MP4 itself; cut list in `src/reel/EDL.md` | No ffmpeg, frame-accurate, re-cuttable in about 70 s |
| **Logo** | Python + fontTools outline the wordmark; the star-x and mark are drawn from plate measurements | Production vector, identical everywhere |
| **Fonts** | Self-hosted woff2, subset with fontTools | No third-party font requests |
| **SEO** | Canonicals, Open Graph, `sitemap.xml`, JSON-LD (Organization, Article, DefinedTermSet) | Ready for search engines and answer engines |
| **Security** | Strict Content-Security-Policy on every page, `_headers` with HSTS, `frame-ancestors`, nosniff and Permissions-Policy | No inline scripts, no third-party hosts |
| **Hosting** | Any static host: Netlify, Cloudflare Pages, Vercel, GitHub Pages | Point it at the repo root; no build step on the server |

**Quality bar:**
- Responsive from 320px up. The header pill never wraps.
- Full keyboard support and visible focus rings.
- `prefers-reduced-motion` respected everywhere.
- A preloader that dismisses itself even if every script fails.

---

## Run it locally

```bash
git clone https://github.com/hamziCodes/PRAXIS_WEBSITE.git
cd PRAXIS_WEBSITE
node src/tools/serve.mjs        # http://localhost:4321
```

Edit content, then rebuild (Node 20+):

```bash
node src/build.mjs
```

## Project structure

```
index.html  services/  work/  about/  journal/  glossary/  contact/  404.html
assets/
  css/site.css            design tokens + all styles
  js/site.js              interactions and motion
  js/lottie-lite.js       the one-colour Lottie player for the service icons
  icons/<service>.json    the four service icons (swap files, nothing else)
  video/                  the studio trailer (1080p, 720p, poster)
  img/work/<slug>/        hero.webp, hero-p.webp (portrait), 01–03.webp
  fonts/  logo/           self-hosted fonts, logo SVGs
src/
  data/projects.mjs       the 16 portfolio projects (one self-contained block each)
  data/services.mjs       the four services
  data/journal.mjs        articles, FAQ, glossary
  imagery/<slug>/         the designed sources of every project image
  reel/                   the trailer editor, MP4 muxer and cut list (EDL.md)
  tools/render.mjs        HTML composition → image (headless Chrome)
  logo.mjs  build.mjs
briefs/                   the rework briefs (v5, v6)
docs/                     the original brand brief package
```

**To change a project:** edit its block in `src/data/projects.mjs` and rebuild. Its case page, cards, logo-wall entry and testimonial all update together. To change its imagery, edit `src/imagery/<slug>/*.html` and re-render with `node src/tools/render.mjs`, or drop real photography into `assets/img/work/<slug>/` under the same names. More detail is in [DELIVERY-NOTES.md](DELIVERY-NOTES.md).

---

<p align="center">
  <img src="favicon.svg" width="40" alt=""><br>
  <strong>Praxis Studio</strong> · Islamabad, Pakistan · working worldwide<br>
  <a href="mailto:hello@praxis.studio">hello@praxis.studio</a>
</p>

---

## Iteration 2 — homepage rework (designer audit, 2026-11-14)

**Claude: that iteration's task was in [briefs/Praxis-Claude-Rework-Pack-v5-2026-11-14.md](briefs/Praxis-Claude-Rework-Pack-v5-2026-11-14.md).** Part 2 of that file is the complete prompt: the homepage is rebuilt to four sections (hero → services → work → contact) with a black hero and pixel work-reveal, a black-to-white scroll transition, animated service icons, and an OuiWill-style work index. Read `docs/` first, implement in `src/`, rebuild with `node src/build.mjs`. `docs/` stays untouched.

---

## Iteration 3 — v6 rework (Appa's walkthrough, 2026-11-15) — done

Built from [briefs/v6/Praxis-Game-Plan-FINAL-2026-11-15.md](briefs/v6/Praxis-Game-Plan-FINAL-2026-11-15.md) and the amended v6 report: homepage reel → works → services → contact; Neue Montreal sitewide; Services as one page; the OuiWill-model Work page with List View; designed imagery for all 16 projects; the studio trailer; Uncommon's Lottie icons. What changed and every judgment call: [DELIVERY-NOTES.md](DELIVERY-NOTES.md). Branch `version-2` is the frozen pre-rework site. `docs/` stays untouched.
