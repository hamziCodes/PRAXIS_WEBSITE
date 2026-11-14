# Praxis Studio — Website Rework Pack v5 (2026-11-14)

**What this is:** the designer's audit of the live site (praxisstudio.vercel.app, iteration 1), digested into (1) a checklist of every change asked, (2) one complete prompt for Claude to implement the changes in the PRAXIS_WEBSITE repo, and (3) the points that were unclear in the audit, with the default used for each. Nothing has been added to the prompt that the audit did not ask for.

---

## Part 1 — The audit, digested

Source: designer's review, relayed 14 Nov 2026 — voice notes, the current-site screenshot, and three reference screenshots, plus two reference sites: uncommondesign.group and ouiwill.com.

**Overall verdict:** iteration 1 is a successful first build. The homepage direction below replaces the current homepage treatment. The pixel language stays — it is the brand — but the page has to become more interactive, more grand, more revealing, and fun to stay on. The current hero reads flat; the eye would not stay on it.

- **A1 — Homepage is four sections, nothing more.** Landing (hero) → Services → Work → Contact. Nothing else on the homepage: no journal, no articles, no FAQ, no testimonials block, no manifesto block. Small, concise, to the point. *(→ Prompt §1)*
- **A2 — No people section.** No "people behind the work", no Hamza / Laiba / Shahzaib names on the homepage. It does not matter to the visitor. *(→ Prompt §1)*
- **A3 — Hero opens on black.** The landing starts with a black interface so the design and the colours pop on it. The current light hero is replaced. *(→ Prompt §2)*
- **A4 — Tagline first, then reveal the work.** The hero starts with the tagline that defines the brand, and then the site reveals the work itself — imagery opening and closing, a grand, smooth, enjoyable reveal motion, in the pixel language (reference: the CAMER Studio shot, where a photograph's edges break into pixel steps). Not a copy of any reference — the same spirit, inside the pixel design range. *(→ Prompt §2)*
- **A5 — Black melts to white on scroll.** As the visitor scrolls from the hero into Services and Work, the whole page transitions from black to white/light, the way Uncommon's site does. *(→ Prompt §3)*
- **A6 — Services come straight after the hero.** A visitor who came for services sees them immediately. Layout follows Uncommon's services row: numbered columns (001–004) with a thin line icon per service — and the icons are in constant animation, which is the part to copy in spirit. Praxis keeps its own services and its own icons. *(→ Prompt §4)*
- **A7 — Work is displayed OuiWill-style.** Each project sits by its brand name with the tags of what was done for it (Brand Strategy, Animation, Art Direction, Website Experience), so a client can see how a brand was built. When the cursor goes onto a project, a small animation / motion / video for that project plays. The mock-ups and visuals should feel alive and changing, so the work inspires the client and feels reachable. *(→ Prompt §5)*
- **A8 — Motion assets come later.** The real motion/video pieces for projects will be provided by the studio when the work content is handed over. The site must be built so those drop in without redesign. *(→ Prompt §5)*
- **A9 — A pixel interaction in the Work section too.** The pixelated thing the brand is built on should have an interactive moment inside Work, not only in the hero. *(→ Prompt §5)*
- **A10 — No italic serif accent words.** The italic serif styling used on accent words in the current site ("real.", "hello"-style words) is out — it reads ChatGPT-generated. The accent job goes to a pixelated font instead (Handjet, already the brand's pixel face). *(→ Prompt §6)*
- **A11 — More colours.** Do not stay on two colours. Use the colours the brand already has across the page (per-item accents). *(→ Prompt §6)*
- **A12 — Closing line in Uncommon's footer spirit.** Uncommon ends with "We speak English, Spanish and Design…" The Praxis version: we speak English, we speak Arabic, and Design, at Praxis — plus a reach-out invitation. *(→ Prompt §7)*
- **A13 — The live-clock detail stays liked.** The "Islamabad — live time" element is liked. Whether the word Islamabad stays next to it is undecided (see Part 3). *(→ Prompt §2, default noted)*

---

## Part 2 — The prompt for Claude

Copy everything between the lines into Claude, in the PRAXIS_WEBSITE repo session.

---

You are reworking the Praxis Studio website in this repo (github.com/hamziCodes/PRAXIS_WEBSITE). The site is already built and live at praxisstudio.vercel.app; this is iteration 2 of the HOMEPAGE, driven by the designer's audit. Read `docs/01-BRAND-BOOK-v5.pdf` and the files under `docs/` first — the brand system there (palette, logo, Handjet pixel font, Helvetica Neue) is fixed and does not change. Edit in `src/`, run the project build (`node src/build.mjs`), and never overwrite anything under `docs/`.

Implement exactly the changes below. Do not add sections, features, pages or copy that this prompt does not ask for, and do not remove or rewrite anything it does not mention. Where this prompt gives copy word for word, use it word for word. Everything else — all existing text, services data (`src/data/services.mjs`) and project data (`src/data/projects.mjs`) — stays as it is unless a change below says otherwise. The stack stays dependency-free vanilla HTML/CSS/JS, like the current build: no new libraries or frameworks.

### §1 — Homepage structure: four sections, nothing else

Rebuild the homepage to contain exactly these four sections, in this order:

1. Hero (landing)
2. Services
3. Work
4. Contact (the closing section + footer, §7)

Remove these blocks from the homepage entirely (they exist today): the manifesto block ("We believe in work you can point at"), the testimonials block ("Word from our clients"), the people block ("The people behind the work" — the names Hamza, Laiba, Shahzaib must not appear on the homepage), the "In Islamabad, on your time" block, and the FAQ block ("Got questions?"). This removal is homepage-only: the About, Services, Work, Journal and other pages keep their content as it is. Shared header and footer stay, restyled only where §2/§3 require it.

### §2 — Hero: black, tagline first, then the work reveals itself

- The hero is full-viewport and BLACK (true black background, Bone text). Design and colour must pop against the black.
- Keep the floating pill header; on the hero it renders in its dark form (translucent black pill, Bone text). Keep the green Contact pill.
- Keep the strap line as it is: "The design-first studio for strategy, brand, web and campaigns."
- The headline stays the brand tagline, set huge: "Theory made real." Treatment: "Theory" in bold Helvetica; "made" in black on the Inchworm highlight block (as today); "real." in the Handjet pixel font — the serif italic treatment is gone everywhere (see §6).
- THE REVEAL — the centrepiece. Under/beside the headline sits a wide media stage showing the studio's work. On load, and then cycling every ~4 seconds, the stage performs an opening/closing reveal: a grid of chunky square tiles (the brand's pixels) covers the image; the tiles flip away in a staggered wave so the image opens up; before the next image, the tiles close over and open again on the new one. The stage's frame edge itself is pixel-stepped — the picture's corners eat into the background in pixel steps, like a photograph dissolving into pixels at its edges (the audit's CAMER reference). Cycle the hero artwork of the first three projects in the work data. Each reveal also flashes the project name as a small Handjet label on the stage. This replaces the current pixel-snake animation in the hero — remove the snake.
- The motion must feel grand and smooth, not busy: one wave, one image at a time, generous pauses. Performance: pre-load the three images; the animation runs on transform/opacity only.
- Bottom status bar of the hero, as today: city + live clock + OPEN/CLOSED dot, and the text "Four service areas. Sixteen projects you can open and read." plus the "See the work" button. Keep the word "Islamabad" in the status bar as it is today.
- Mobile: the stage goes full-width under the headline; the reveal wave runs in fewer, larger tiles; everything readable, nothing overflowing.

### §3 — The black-to-white scroll transition

As the visitor scrolls out of the hero into Services, the page background transitions smoothly from black to Bone/white, driven by scroll progress (not a sudden cut, not a timed fade): the dark hero gives way and Services and Work sit on the light background, in the spirit of uncommondesign.group. Implement with scroll-linked CSS/JS in the existing vanilla stack. The pill header switches from its dark form to its light form as the transition completes. Text colours invert accordingly so contrast is correct at every point of the transition.

### §4 — Services: straight after the hero, numbered columns, living icons

- Services is the first section after the hero, on the light background.
- Layout follows the audit's Uncommon reference: a row of numbered columns divided by hairlines — number at the top (001, 002, 003…), then the icon, then the service-area name in bold Helvetica, then its one-line description. Build one column per service area in `src/data/services.mjs`, using that data's names, taglines and deliverable lists — do not invent or drop services. Each column links to the same services-page destination it links to today.
- Each column gets ONE thin-line SVG icon, drawn for what that area does, in that column's accent colour (see §6). Every icon is in CONSTANT, gentle animation — strokes drawing and redrawing, nodes pulsing, elements rotating slowly — subtle and continuous, the way the reference's icons live on the page. Animate with CSS keyframes on the SVG (stroke-dashoffset, transform, opacity). Pause an icon's animation when it is off-screen (IntersectionObserver) and honour `prefers-reduced-motion` by leaving icons static and complete.
- No accordion in this section anymore, and no serif words: the section heading is "Our services." with "services" as the Handjet accent if an accent is used.

### §5 — Work: the OuiWill treatment — tags, hover motion, a pixel moment

- Work follows Services on the light background. Heading: "Work they trusted us with." — keep this copy, with the accent word set in Handjet, not serif.
- Present the projects as an index of large rows, one per project in `src/data/projects.mjs`, all 16 of them. Each row shows: the project/brand name in large bold Helvetica; and that project's service tags — the disciplines recorded for it in the project data (e.g. Brand Strategy, Animation, Art Direction, Website Experience) — set small beside or under the name, so a visitor can read how each brand was built. If a project has no services recorded in its data, show none for that row; do not invent tags.
- Hover behaviour (desktop): when the cursor is on a row, a preview panel appears and follows the cursor, playing that project's motion piece. Build a `motion` field into the project data: when a project has a motion video, the panel plays it (muted, looped, playsinline); when it does not — which is most projects today — the panel shows the project's cover artwork performing the pixel-dissolve: chunky tiles assemble into the image on hover-in and dissolve back out on hover-out. The real motion assets arrive later from the studio and must drop into the `motion` field with no other code change.
- One consistent accent per project row, from the full palette, used for its tags and its hover state (§6).
- Pixel interaction: besides the dissolve, give the section one more pixel moment — the section's top divider is a row of pixel blocks that assemble on scroll-in, and hovering a row scatters a brief burst of small pixel squares in that project's accent colour around the row's edge. Keep it tasteful: one burst, under a second.
- Touch devices: tapping a row expands the same preview inline under the row (no hover-only content).
- Keep the "View all our work" link and each row's link to its case-study page exactly as they behave today, including the "Demo project — client work is under NDA" note where the data carries it.

### §6 — Typography and colour rules (whole homepage)

- The italic serif font is REMOVED from the homepage: no serif italic accent words anywhere ("real.", "services.", "trusted." or any other). Wherever an accent word is used in a headline, it is set in the Handjet pixel font instead. Body and headings stay Helvetica Neue (the existing stack). Handjet is used only for accent words, labels and small display — never for body text or whole headlines.
- Use the brand's full colour set across the homepage, not just Bone + Inchworm: Bone #DFE0D0, Bright Snow #FFFFFF, Black #000000, Inchworm #B1FA63, Gunmetal #243837, Orange #FE7733, Pale Violet #B2A1FF, American Silver #D1D1D1. Assign accents per item: each service column and each project row gets its own accent from that set, rotating through it. Accent colours are for icons, tags, highlights and hover states — body text stays black on light / Bone on black.

### §7 — Closing: the speak line, then the footer

- After Work, the closing section sits on Gunmetal/black (the page's one dark closing moment). Its main line, word for word: "We speak English, Arabic and Design at Praxis." — set large, with "Design" as the Handjet accent.
- Under it, a reach-out line and the existing contact route: a "Start a project" button that behaves exactly like today's contact CTA (contact page / hello@praxis.studio). Keep the existing closing copy "Tell us what you are trying to do and by when. We reply within two working days." as the supporting line.
- The footer below stays as it is (link columns, the giant PRAXIS wordmark with the star-x, the bottom bar), with any serif styling removed per §6.

### §8 — Robustness

- Every animation degrades gracefully: if JavaScript fails or is off, the hero shows the first project image statically with its pixel-stepped frame, icons render complete and still, and all text and links work. Honour `prefers-reduced-motion` the same way.
- No layout shift from the animations; the page must not jump as images cycle.
- Check desktop (1440px) and mobile (390px) widths for every section before finishing: no overflow, no wrapped wordmark in the header pill, no text over images.

### Definition of done

The build (`node src/build.mjs`) passes; the homepage contains exactly the four sections in order; no person's name appears on the homepage; no serif italic appears on the homepage; the hero is black with the cycling pixel reveal; the scroll transition reaches the light background by Services; every service icon animates; every work row shows its tags and its hover/tap preview; the closing section carries the speak line word for word. Report what you changed section by section against this prompt, and flag anything in this prompt you could not implement as specified instead of improvising around it.

---

## Part 3 — Unclear in the audit, and the default used

These go to Hamzi/Appa — the prompt above already uses the default in **bold**, so it can run as-is; each is a one-line change if the answer differs.

1. **Hero reference name garbled.** One voice note names a reference for the tagline-first hero ("Blacksight"?) that could not be identified. Default used: the CAMER pixel-edge photograph + Uncommon's "We design for impact. See for yourself." opening, which were clear. If a specific site was meant, send the link and it gets added to §2.
2. **"Islamabad" next to the live clock — undecided.** The designer likes the live-time detail and is unsure about the Islamabad wording. Default used: keep "Islamabad" (it is already on the live hero). Removing it later is one word in §2.
3. **When the real motion assets arrive — garbled in the note** ("in like two ___"). Default used: the site ships now with the pixel-dissolve as the hover mechanic, and real videos drop into a `motion` field in the project data later, no redesign (§5).
4. **Closing line wording.** The exact words of the Uncommon adaptation were partly garbled. Default used (§7): "We speak English, Arabic and Design at Praxis." — one line to change if Appa wants different words.
5. **The pixel snake.** The audit never names the hero's current pixel snake; it asks for "something opening or closing that shows off our work" instead, and judges the current hero flat. Default used: the snake is removed and the work reveal replaces it as the hero's motion (§2). If the snake should stay alongside, say so.
6. ** Scope of "nothing more".** Read as a HOMEPAGE rule: the About / Services / Work / Journal pages keep their content; only the homepage is rebuilt to four sections, plus the no-serif rule, which is one shared style. If whole pages (e.g. Journal) should also be deleted from the site, that is a separate instruction.
