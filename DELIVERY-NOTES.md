# Praxis Studio website: delivery notes

The site is static HTML, CSS and JavaScript in the repo root, ready to host at praxis.studio. It has no runtime dependencies and makes no third-party requests: fonts, scripts and images are all served from the site's own domain. `docs/` is the brief package and was not changed.

## Structure

```
index.html                    Home
services/                     Services: one page, four areas (#strategy-consulting, #brand-creative, …)
work/                         Work index (immersive + List View), plus 16 project pages
about/  journal/  glossary/  contact/  404.html
assets/css/site.css           All styles. Design tokens are at the top (:root)
assets/js/site.js             Every interaction (vanilla JS)
assets/js/lottie-lite.js      One-colour Lottie player for the service icons
assets/icons/<service>.json   The four service icons (Uncommon's, until Praxis's own arrive)
assets/video/                 The studio trailer: praxis-trailer.mp4 (1080p), -720.mp4, -poster.jpg
assets/js/vendor/lenis.min.js Smooth scroll, self-hosted and optional
assets/fonts/                 Neue Montreal, Handjet and TeX Gyre Heros (subset to woff2)
assets/logo/                  Production logo SVGs
assets/img/work/<slug>/       Designed project imagery: hero.webp, hero-p.webp (portrait), 01–03.webp
assets/img/clients/<slug>.svg Client logos (generated)
src/                          The source the pages are built from (not served to visitors)
  data/projects.mjs           The 16 project blocks
  data/services.mjs           The 4 services
  data/journal.mjs            Articles, home FAQ, glossary
  imagery/<slug>/*.html       The designed source of every project image (render with tools/render.mjs)
  reel/                       The trailer editor, MP4 muxer and cut list (EDL.md)
  art.mjs                     Client logo generator
  logo.mjs + logo.json        The logo component
  build.mjs                   Templates; writes every page
_headers                      Security and cache headers (Netlify / Cloudflare Pages)
vercel.json, _redirects       Old service sub-page URLs → /services/#<area>
sitemap.xml, robots.txt, site.webmanifest, favicon.svg
```

**To rebuild after an edit:** `node src/build.mjs` (Node 20 or newer). **To preview:** `node src/tools/serve.mjs`, then open http://localhost:4321.

## Editing or replacing a project

Each project is one self-contained block in `src/data/projects.mjs`: name, question, meta, challenge, solution, deliverables, results, metric, client brand, testimonial and gallery list.

- **To edit a project:** change the text in its block and rebuild. The project's page, its work cards, the logo wall and the testimonial slider all update together.
- **To replace a project:** overwrite the whole block and give it a new unique `slug`. Keep `service` set to one of the four service slugs, so the project lands in the right category.
- **To change a project's imagery:** edit `src/imagery/<slug>/<name>.html` and re-render, e.g. `node src/tools/render.mjs src/imagery/koffa/hero.html assets/img/work/koffa/hero.webp 2400 1350 84` (hero 2400×1350, hero-p 1080×1920, 01/03 1600×2000, 02 2400×1350). Real photography can replace any file under the same name. The build picks the set up automatically.
- **To change the client's look:** edit `brand`. Its colours, logo style (`mark`: pixel, ring, arch, stack, leaf, wave, sun, grid, drop, bolt, key or peak) and typeface (`sans` or `serif`) feed that project's logo and images.
- **To choose the home page works:** edit `FEATURED` in `src/build.mjs` (default: KOFFA, LEDGERLY, VELOUR, Kitepay, LOWTIDE). `credits` on each project block is the list shown beside the work.

## The logo component

- **Mark:** traced from Brand Book plate 1. A 20-unit centre square, four 15-unit squares on the diagonals that overlap its corners to form the X, four 10-unit satellites touching those squares, and four 10-unit satellites on the axes one step further out. The viewBox is −45 to 45.
- **Wordmark:** "Praxis Studio", outlined from TeX Gyre Heros Bold, a free Helvetica-class grotesk (GUST licence), so it renders identically everywhere. The x is the 4-petal star from plate 2. Each petal is a thick wedge measured off the plate: x-height tall, sitting on the baseline, with slightly rounded outer corners. `src/tools/make-logo.py` regenerates the outlines.
- **One component:** `src/logo.mjs` holds the paths. Every page inlines one SVG sprite (`#px-mark`, `#px-word`, `#px-lockup`, `#px-star`) and uses it through `<use>`. To swap in Laiba's official files, replace the path data in `src/logo.mjs` (or `logo.json`) and rebuild. Standalone files are in `assets/logo/`.
- **Lockup:** mark left, wordmark right, mark height equal to cap height. The star-x on its own is the site's bullet and asterisk motif.

## Decisions made for you

1. **No serif (v5).** Accent words in headlines are set in Handjet, the brand pixel face. Instrument Serif was removed site-wide after the designer audit.
2. **Neue Montreal (v6).** Appa's font, self-hosted from the supplied files and subset to woff2. TeX Gyre Heros stays as the fallback. Handjet stays the pixel accent.
3. **Service star colours:** Strategy uses Inchworm, Brand uses Pale Violet, Web uses Orange, Campaigns uses Bright Snow. To respect the two-accent rule, these stars only appear on black tiles and dark panels, and only the open service's star is coloured. Everywhere else the star is black.
4. **Homepage (v6): four sections.** Trailer → black stage with five major works → services → the speak-line, then the footer. Case pages open full-screen on the work, then follow the editorial template: question headline, meta column, challenge / solution / results, metric, gallery, testimonial, then previous and next.
5. **Signatures.**
   - The pixel open (v6): the trailer opens through square pixels from the centre out.
   - The melt: black runs to Bone as Services arrives.
   - The tilt: work rectangles sit straight and tilt slightly under the cursor.
   - The pixel assemble: images build up from chunky pixels as they scroll in (inner pages).
6. **Studio hours: Monday to Friday, 10:00 to 19:00 Pakistan time.** These drive the live OPEN / CLOSED status. Change them in `assets/js/site.js` (search for "Mon–Fri").
7. **Client countries:** Pakistan, Kenya, Portugal, UAE, Türkiye, Sri Lanka, Canada, UK, Malaysia and Qatar. That is ten, matching "Sixteen clients, ten countries" on the home page. The site-wide stats stay at 3 people, 16 projects and 4 service areas.
8. **No street address.** The brief gives Islamabad only, so the site says Islamabad, Pakistan and invents nothing more.
9. **No social links.** No accounts were supplied, so none were invented.
10. **Contact form.** It validates every field. By default, sending opens the visitor's email app with a message to hello@praxis.studio already filled in. To receive submissions directly instead, set `data-endpoint` on the form in `contact/` (via `build.mjs`) to any form service's URL; the script then posts to it and confirms only after a real send. A honeypot field blocks simple spam bots.
11. **Portfolio imagery is designed, not generated (v6).** Each project has five images built piece by piece in HTML/CSS/SVG and rendered with headless Chrome: a 16:9 hero, a portrait hero for phones, and three gallery shots. Every project has its own visual formula (still life, devices on a counter, fly-posted wall, shopfront, flow board, landscape in situ…). No stock photos, no one-shot AI images. Real photography can replace any file later.
12. **Two Bitwip pages left out, on purpose.** Bitwip's per-office pages and its CSR pages describe things Praxis does not have. The single studio section and the Islamabad clock cover that role honestly.
13. **The preloader can never trap a visitor.** It runs on the home page only, once per session, and dismisses itself in pure CSS after about 1.3 seconds even if every script fails. With reduced motion it never shows.

## Robustness, accessibility and security

- **Without JavaScript, or if a script fails,** all content is visible. Reveals, the hero reveal, the melt, the pixel effects and the carousel momentum are layered on top of a complete page.
- **With `prefers-reduced-motion`,** everything sits still and stays visible, and the hero shows its first project, still.
- **Mobile:** the header pill holds the logo, Contact and a menu button, and it does not wrap or overflow at 390px or 320px. The full-screen menu traps Escape and returns focus to the button.
- **Keyboard and screen readers:**
  - A skip link comes first.
  - Accordions use `aria-expanded` and labelled regions.
  - The carousel scrolls with the arrow keys.
  - Filter buttons use `aria-pressed`, and the slider and form have live regions.
  - Focus rings are visible on every surface.
- **Security:**
  - Pages carry a strict Content-Security-Policy as a `<meta>` tag: only same-origin scripts, no inline scripts, no third-party hosts.
  - `_headers` adds HSTS, frame-ancestors, nosniff, Permissions-Policy and others on hosts that support it.
  - Form input is never written into the page as HTML.
- **SEO:**
  - Every page has a canonical URL, a description and Open Graph tags.
  - Structured data covers the organisation, the articles and the glossary terms.
  - `sitemap.xml` is in place, and `robots.txt` keeps `docs/` and `src/` out of the index.

## Hosting

- **Any static host works** (Netlify, Cloudflare Pages, Vercel, GitHub Pages). Point it at the repo root; there is no build step on the host because the built pages are committed.
- **Deploy at the domain root (praxis.studio).** Pages use relative links, so they also work under a sub-path, but `404.html` uses root links.

## v5 homepage rework (designer audit, 14 Nov 2026)

The homepage is now four sections: a black hero, services, the work index, and the speak-line closing. The brief is in `briefs/`.
- **Motion on hover:** set `motion: 'assets/video/<file>.mp4'` on a project block to play a muted, looping video in the homepage work index on hover, or inline on tap. Without it, the cover artwork pixel-dissolves in.
- **Note under a row:** set `note` on a project block (for example, an NDA line) to show it under that row.
- **Accents:** per-item accents rotate through the brand palette (`ACCENTS` in `src/build.mjs`).

## v6 rework (Appa's walkthrough, 15–16 Nov 2026)

Governed by `briefs/v6/Praxis-Game-Plan-FINAL-2026-11-15.md`. Branch `version-2` is the site before this rework.

**Built.**
- **Phase 1:** Neue Montreal sitewide; one spacing system (`--sec`, `--sec-s`, `--sp-1…6`); Services is one page (icons off, the four sub-pages deleted and redirected).
- **Phase 2:** homepage trailer with pixel-open, menu on scroll, black stage, five works with side credits and hover tilt, Uncommon's services formation with the Lottie icons, the speak-line.
- **Phase 3:** the OuiWill-model Work index with List View; case studies open full-screen on the work; the About page adjusted per §7.1.
- **Production:** imagery for all 16 projects (80 files) and the 32-second trailer.

**Swaps that need no code.**
- **Reel:** replace the three files in `assets/video/`, keeping the names.
- **Icons:** replace `assets/icons/<service>.json` with Appa's own Lottie files. Kai's SVG fallbacks are in `briefs/v6/icons/` and are not used.
- **Homepage works:** edit `FEATURED`.

**Before public launch:**
- confirm the Neue Montreal web licence (§7.4);
- confirm the five homepage works (§7.2).
