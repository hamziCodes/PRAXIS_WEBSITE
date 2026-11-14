# Praxis Studio website: delivery notes

The site is static HTML, CSS and JavaScript in the repo root, ready to host at praxis.studio. It has no runtime dependencies and makes no third-party requests: fonts, scripts and images are all served from the site's own domain. `docs/` is the brief package and was not changed.

## Structure

```
index.html                    Home
services/                     Services index, plus 4 service pages
work/                         Work index (filter by service, ?cat=slug), plus 16 project pages
about/  journal/  glossary/  contact/  404.html
assets/css/site.css           All styles. Design tokens are at the top (:root)
assets/js/site.js             Every interaction (vanilla JS)
assets/js/vendor/lenis.min.js Smooth scroll, self-hosted and optional
assets/fonts/                 Handjet, Instrument Serif Italic, TeX Gyre Heros (all subset to woff2)
assets/logo/                  Production logo SVGs
assets/img/work/<slug>/       Project hero and gallery artwork (generated)
assets/img/clients/<slug>.svg Client logos (generated)
src/                          The source the pages are built from (not served to visitors)
  data/projects.mjs           The 16 project blocks
  data/services.mjs           The 4 services
  data/journal.mjs            Articles, home FAQ, glossary
  art.mjs                     Artwork generator (client logos and project images)
  logo.mjs + logo.json        The logo component
  build.mjs                   Templates; writes every page
_headers                      Security and cache headers (Netlify / Cloudflare Pages)
sitemap.xml, robots.txt, site.webmanifest, favicon.svg
```

**To rebuild after an edit:** `node src/build.mjs` (Node 20 or newer). **To preview:** `node src/tools/serve.mjs`, then open http://localhost:4321.

## Editing or replacing a project

Each project is one self-contained block in `src/data/projects.mjs`: name, question, meta, challenge, solution, deliverables, results, metric, client brand, testimonial and gallery list.

- **To edit a project:** change the text in its block and rebuild. The project's page, its work cards, the logo wall and the testimonial slider all update together.
- **To replace a project:** overwrite the whole block and give it a new unique `slug`. Keep `service` set to one of the four service slugs, so the project lands in the right category.
- **To use real images:** put the files in `assets/img/work/<slug>/` and add `images: ['hero.jpg', '01.jpg', …]` to the block. The first file is the hero and the rest form the gallery. Generated artwork is only used when `images` is missing.
- **To change the client's look:** edit `brand`. Its colours, logo style (`mark`: pixel, ring, arch, stack, leaf, wave, sun, grid, drop, bolt, key or peak) and typeface (`sans` or `serif`) feed that project's logo and images.
- **To choose the home page projects:** edit the `featured` list in `home()` in `src/build.mjs`. The third item in the list is shown as the metric card.

## The logo component

- **Mark:** traced from Brand Book plate 1. A 20-unit centre square, four 15-unit squares on the diagonals that overlap its corners to form the X, four 10-unit satellites touching those squares, and four 10-unit satellites on the axes one step further out. The viewBox is −45 to 45.
- **Wordmark:** "Praxis Studio", outlined from TeX Gyre Heros Bold, a free Helvetica-class grotesk (GUST licence), so it renders identically everywhere. The x is the 4-petal star from plate 2. Each petal is a thick wedge measured off the plate: x-height tall, sitting on the baseline, with slightly rounded outer corners. `src/tools/make-logo.py` regenerates the outlines.
- **One component:** `src/logo.mjs` holds the paths. Every page inlines one SVG sprite (`#px-mark`, `#px-word`, `#px-lockup`, `#px-star`) and uses it through `<use>`. To swap in Laiba's official files, replace the path data in `src/logo.mjs` (or `logo.json`) and rebuild. Standalone files are in `assets/logo/`.
- **Lockup:** mark left, wordmark right, mark height equal to cap height. The star-x on its own is the site's bullet and asterisk motif.

## Decisions made for you

1. **Serif: Instrument Serif Italic.** Its narrow, sharp italic sits well against Helvetica's mass and reads clearly as one display word. It appears only as a single word inside big headlines, never in titles or body text.
2. **Helvetica Neue with a matching fallback.** Visitors who have Helvetica Neue (Mac, iPhone) get it. Everyone else, including most Windows and Android users in Pakistan, gets TeX Gyre Heros, a free Helvetica clone, instead of Arial. That keeps the brand looking the same on every device.
3. **Service star colours:** Strategy uses Inchworm, Brand uses Pale Violet, Web uses Orange, Campaigns uses Bright Snow. To respect the two-accent rule, these stars only appear on black tiles and dark panels, and only the open service's star is coloured. Everywhere else the star is black.
4. **Bitwip anatomy, in Praxis order.** The home page follows the same sequence: pill header, hero with live clock, scroll-lit statement, about plus stats, dark services accordion with a visual that swaps, work drag carousel with a metric card, client logo wall, testimonial slider, people, studio, journal, FAQ, closing panel and giant-wordmark footer. Case pages follow Bitwip's template: question headline, meta column, challenge / solution / results, metric, dark staggered gallery, testimonial, then previous and next.
5. **Signatures.**
   - The pixel snake: a grid-snapped trail that roams the hero, drags the BRANDING / UIUX / MOTION / SEO pills, and chases the cursor.
   - The pixel assemble: images build up from chunky pixels as they scroll in.
   - The pixel break: the hero headline breaks into drifting blocks as you scroll away. This runs on desktop only.
   - The trifecta: giant names with an Inchworm sweep on hover.
   - The big pixel mark: drawn from the logo's real geometry.
6. **Studio hours: Monday to Friday, 10:00 to 19:00 Pakistan time.** These drive the live OPEN / CLOSED status. Change them in `assets/js/site.js` (search for "Mon–Fri").
7. **Client countries:** Pakistan, Kenya, Portugal, UAE, Türkiye, Sri Lanka, Canada, UK, Malaysia and Qatar. That is ten, matching "Sixteen clients, ten countries" on the home page. The site-wide stats stay at 3 people, 16 projects and 4 service areas.
8. **No street address.** The brief gives Islamabad only, so the site says Islamabad, Pakistan and invents nothing more.
9. **No social links.** No accounts were supplied, so none were invented.
10. **Contact form.** It validates every field. By default, sending opens the visitor's email app with a message to hello@praxis.studio already filled in. To receive submissions directly instead, set `data-endpoint` on the form in `contact/` (via `build.mjs`) to any form service's URL; the script then posts to it and confirms only after a real send. A honeypot field blocks simple spam bots.
11. **Portfolio imagery is generated as SVG.** No stock photos and no AI photos of people. Every image is composed from the client's own brand (logo, colours, type, copy) in the Praxis art direction: Bone and paper grounds, soft shadows, Inchworm pixel details. Each project has a hero plus 8 or 9 gallery images, covering packaging, app screens, sites, posters, stationery, billboards, social grids, strategy documents, dashboards, signage, merch and more. Real photography can replace any set later, project by project.
12. **Two Bitwip pages left out, on purpose.** Bitwip's per-office pages and its CSR pages describe things Praxis does not have. The single studio section and the Islamabad clock cover that role honestly.
13. **The preloader can never trap a visitor.** It runs on the home page only, once per session, and dismisses itself in pure CSS after about 1.3 seconds even if every script fails. With reduced motion it never shows.

## Robustness, accessibility and security

- **Without JavaScript, or if a script fails,** all content is visible. Reveals, the snake, the pixel effects and the carousel momentum are layered on top of a complete page.
- **With `prefers-reduced-motion`,** everything sits still and stays visible, and the snake draws once, frozen.
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
