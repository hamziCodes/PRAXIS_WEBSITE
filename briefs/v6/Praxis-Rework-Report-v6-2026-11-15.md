# Praxis Studio — Website Rework Report v6 (2026-11-15)

**What this is:** everything from Appa's second walkthrough — seven screen videos, Hamzi's voice note, the font files she sent, and the four reference links — pieced together into one report: what she said, the full change list, the build phases, and the reference material behind each change, with screenshots from her own videos.

**How it relates to v5:** the v5 pack (in the PRAXIS_WEBSITE repo, head `d824919`) still stands where this report does not touch it — the vision-first reading rule, the brand hard lines, the four-section homepage, the speak-line, the no-serif rule. Where v6 and v5 conflict, **v6 wins**, and every conflict is listed in §5 so nothing changes silently.

**Sources used, all of them:**
- 7 videos from Appa (transcribed in full; digest in §1, transcripts in the appendix)
- Hamzi's voice note (see §1.8 — it adds one open item of his own: the About page)
- `Neue_Montreal.zip` — the new font, sent by Appa (inventory in §2.1)
- Reference links sent by Hamzi: ouiwill.com/work, ouiwill.com/about, uncommondesign.group, iventions.com/about (studied live 15 Nov 2026; breakdown in §4)
- The current live site, praxisstudio.vercel.app, as filmed in the videos
- The v5 rework pack (re-read in full before writing this)

Screenshots in this report are frames from Appa's videos — they show exactly what she was pointing at when she said it.

---

## 1. What Appa said — video by video

### 1.1 Video 1 (1m 30s, English) — the landing page sequence, on Uncommon's site

She walks through uncommondesign.group and describes the Praxis landing page as the same journey:

- The landing page opens with **a whole motion-reel video** — she will make the reel herself. Not a static image.
- She does **not** want it to open the way the current hero artwork opens (a rectangle). She wants it to **open in a pixel way** — "pixelated open" — the pixels themselves open.
- Then it goes down to **a whole black screen**. As you scroll, **the menu appears on top**.
- Scrolling further, the top works appear **in a rectangle — not a square** — one work at a time. With each work, **the name appears, with everything we did for them** listed with it.
- Scroll again: another work. Another. Then the page goes to **Services**.
- On Services she points at the **breathing space** — "there is so much space over here, this is breathing space, I need that breathing space." She says the empty space is **lacking in our own website**.
- The service **icons must be exactly like Uncommon's formation**: small, **single line, no colour added, plain and simple, placed exactly like this**. She will give the icons herself.

![Current Praxis hero, as filmed at the start of Video 1 — black screen, tagline, pixel artwork on the right.](praxis-v6-report-assets/fig/fig01_current_hero.png)

![Uncommon's hero mid-scroll — the giant type collage the reel opening leads into on their site.](praxis-v6-report-assets/fig/fig02_uncommon_hero.png)

![The whole black screen stage: "We design for impact. See for yourself." — menu at top, the first work rising from the bottom.](praxis-v6-report-assets/fig/fig03_uncommon_black_stage.png)

![One work, full rectangle: "kismet" — name bottom-left, the services done for them in small caps bottom-right.](praxis-v6-report-assets/fig/fig04_uncommon_work_kismet.png)

### 1.2 Video 2 (47s, Urdu) — the homepage Work section, on our own site

Filmed on the current Praxis homepage work list ("Work they trusted us with" — the name rows with the pixel hover preview). Her instructions:

- The work piece sits **straight — not crooked/tilted by default** ("yeh cheez tedhi nahi hogi, cheez seedhi hogi").
- **In the middle is our work itself** (the image/mockup), in **a rectangle**.
- As you scroll, **no text comes on top of the work**. The **client's name comes on the side**, and with it a **description of what we did** — brand strategy, the website we built, whatever was done, all listed.
- Only **four to five works** appear here — **the major works**. Not the whole list ("yeh bilkul achha nahi lag raha" — the full list as it stands does not look good).
- When the **cursor comes onto a work, it tilts slightly** and moves a little ("halka sa tilt move karega").

![The current homepage Work section she is reviewing — name rows, tags on the right, pixel hover preview.](praxis-v6-report-assets/fig/fig07_current_work_home.png)

### 1.3 Video 3 (19s, Urdu) — the rest of the landing page

- **Everything else on the landing page stays as it is.** The only changes are the ones she has named, plus the font (below).
- **More space between things** — right now there is no space between things at all ("bilkul space nahi hai cheezon mein"); the spacing is part of the change.
- **Font changes are coming** — she will specify them (and did: the Neue Montreal files, §2.1).
- "This part is fine" — the closing/work-list end she was looking at needs no other change. Then she moves to the Work page.

![End of the current work list running into the dark closing band — the part she marked fine as-is.](praxis-v6-report-assets/fig/fig08_current_closing.png)

### 1.4 Video 4 (31s, Urdu) — the Services page

Filmed on praxisstudio.vercel.app/services/ ("Four ways we make it real."):

- The Services page itself is **right as it is** ("yeh cheez sahi hai") and **stays as-it-is**, with the font change applied.
- **Remove the icons** — the icon tiles next to each service ("is mein tum yeh icons hata do").
- Keep it **big and bold** — the large service headings stay.
- **Remove the extra pages that open off this page** — the separate pages that open from Services are cut entirely ("yeh pooray extra pages minus kar do"). Services stays one page — the services are all explained on the page itself: "we don't need another page for it."
- The service **highlight** — the way an item lights up in a colour as you move across it — stays as it behaves now.
- The **"Word from our clients"** block gets her clearest verdict in the whole walkthrough: "This is perfect. This is perfect." It stays untouched.

![The current Services page — headline, "01 Strategy & consulting" and the green icon tile she wants removed.](praxis-v6-report-assets/fig/fig09_current_services_page.png)

### 1.5 Video 5 (42s, Urdu) — the Work page, on OuiWill's model

- On the Work page too, the card treatment goes: **just plain text** — the client names as text, not a card grid.
- When the Work page opens, it does **not** open the way ours opens now. It opens the OuiWill way: **full-screen**, the active client's **mockup/work fills the screen behind**, and the **client's name is highlighted in the list of clients**.
- Click a name — e.g. Rivian on OuiWill — that word highlights and **all of that client's work highlights** with it.
- **Scroll down and the full case study opens** for that client, in the same flow.

![The current Work page she is replacing — "Sixteen projects made real.", filter pills, image cards.](praxis-v6-report-assets/fig/fig10_current_work_page.png)

![OuiWill's work index as filmed in Video 6 — client names in large type over the active project's full-screen image (Oura).](praxis-v6-report-assets/fig/fig11_ouiwill_index.png)

### 1.6 Video 6 (16s, Urdu) — the Work page's second view

- The Work page also keeps OuiWill's **List View option**: one view is the full-screen style, the other is the list style — **"exactly like this, exactly"** as OuiWill does it.

### 1.7 Video 7 (9s, Urdu + English) — the tilt, defined on iVentions

Filmed on iventions.com/about, cursor on one of the big numbered cards:

- "Is square pe aap ka cursor gaya to iska halka sa is tarah tilt hua. **This was the tilt I was talking about.** You get it?"
- So the tilt from Video 2 = the **slight hover tilt on iVentions' cards**. Straight at rest, a small tilt under the cursor. That is the whole mechanic — nothing bigger.

![iVentions' numbered value cards ("1 — For people, always." / "2 — Creativity with a point!") — the tilt example.](praxis-v6-report-assets/fig/fig12_iventions_tilt.png)

### 1.8 Hamzi's voice note (23s, Urdu/English)

Recovered on a second, closer transcription pass (the first pass garbled it, and the first version of this report misread the unsure point as the font — corrected here). What Hamzi actually says: he is **not sure about the About page right now**; he **doesn't like such big names** and he **doesn't want faces on the About page**; he **really likes how OuiWill's About is done** and wants ours looked at against it; and the two of them **will discuss the About** between themselves. The website work otherwise goes **according to her instructions**. So: the font stands as Appa's instruction with no open flag, and the About page becomes an open item (§6.1) — it is not one of the surfaces Appa's videos cover, and nothing in §§3.1–3.5 depends on it.

---

## 2. Global changes

### 2.1 The font — Neue Montreal (supplied)

Appa sent the font family herself. The zip contains 8 OpenType files (Pangram Pangram, dated 2018):

| File | Weight/style |
|---|---|
| NeueMontreal-Light.otf | Light |
| NeueMontreal-LightItalic.otf | Light Italic |
| NeueMontreal-Regular.otf | Regular |
| NeueMontreal-Italic.otf | Italic |
| NeueMontreal-Medium.otf | Medium |
| NeueMontreal-MediumItalic.otf | Medium Italic |
| NeueMontreal-Bold.otf | Bold |
| NeueMontreal-BoldItalic.otf | Bold Italic |

- Neue Montreal becomes the site's **primary sans** — the grotesque workhorse role Helvetica Neue holds today (headings + body). It is the same class of typeface Uncommon's site is set in, which is the point: the reference look is carried by the type.
- **Handjet stays** as the pixel accent face (accent words, labels) — nothing Appa said touches it, and the pixel language is still the brand.
- Self-host the files in the repo and load with `@font-face`, like the current stack — no new libraries, no external font CDN.
- One housekeeping line: Neue Montreal is a commercial font. Before public launch, confirm the licence held covers web embedding (same open-check family as the Praxis trademark clearance already on the list).

### 2.2 Breathing space — a spacing pass everywhere she pointed

The single most repeated instruction across the videos: **space**. Uncommon's pages hold huge empty areas around every element; ours are packed. The change is a deliberate spacing pass on the homepage first (hero → work → services), then the same air on the Services and Work pages: bigger section gaps, fewer elements per screen, nothing touching.

![The reference for the spacing: one image strip, one pill, one headline — a screen mostly empty.](praxis-v6-report-assets/fig/fig06_uncommon_space.png)

---

## 3. The change list

### 3.1 Homepage — Hero (replaces the current hero treatment)

- **C1 — Motion reel opens the site.** The hero is a full-screen **motion-reel video** (Appa is making the reel). It replaces the current pixel-mosaic artwork as the hero's centre.
- **C2 — The reel opens in pixels.** The opening is **pixelated** — the picture opens through the brand's pixel language, not as a plain rectangle fade/slide. (This is the v5 pixel reveal, aimed at the reel: tiles/pixels open the image.)
- **C3 — Then a whole black screen.** After the open, the hero settles to the **full black stage** (tagline on black, as the brand already does) — the reel/black sequence is the landing moment.
- **C4 — Menu appears on scroll.** The header/menu is not sitting on the opening frame; it **appears as the visitor starts scrolling**, the way it does on Uncommon.

### 3.2 Homepage — Work (the top works, Uncommon formation)

- **C5 — Four to five major works only.** The homepage work section shows **4–5 major works**, not all sixteen. (The full set lives on the Work page, §3.4.) Which five: the studio's pick — the generated flagships (KOFFA, LEDGERLY, VELOUR) are the natural candidates; Appa confirms.
- **C6 — One work per screen, in a rectangle.** Each work is a **wide rectangle** (not square, not a row in a list), shown one at a time as you scroll, in the middle of the screen.
- **C7 — Name and credits on the side, never on the image.** The **client name** sits beside the work, with the **description of everything done for them** (brand strategy, website, etc.) listed with it — Uncommon's kismet layout: name one side, services in small type the other side. No text overlays the work itself.
- **C8 — Straight at rest, tilt on hover.** Each rectangle sits **straight**; when the cursor lands on it, it **tilts slightly** (the iVentions mechanic, §1.7). Touch devices: no tilt, the tap goes through to the case study.
- **C9 — Order on the page:** Hero → **Works** → **Services** → Contact. Note the order she walked: after the hero's black stage come the works, *then* services. (v5 had Services straight after the hero — see §5.)

### 3.3 Homepage — Services (Uncommon formation, exactly)

- **C10 — Numbered columns, hairlines, air.** The services row follows Uncommon's formation: number (001–004), icon, name, one line of description, hairline dividers, and the breathing space of §2.2 around all of it.
- **C11 — Icons: single line, no colour, supplied by Appa.** The icons are **thin single-line drawings in one colour (black on light)** — no accent colours, no fills. Appa provides the icon artwork; the build places them **exactly in the Uncommon formation** (icon size and position relative to number, name and line, as filmed). For reference, Uncommon's own four: a wandering path (Design Sprints), three circles (UX and UI Design), a 3-D arrow block (Design Direction), connected nodes (Discovery Workshops) — Praxis keeps its own four services and its own drawings, in that formation.
- **C12 — Praxis services stay Praxis services.** Strategy & consulting / Brand & creative / Web & digital / Campaigns & media, from `src/data/services.mjs`, unchanged as content.

![Uncommon's services row — the exact formation for C10–C11: 001 Design Sprints, 002 UX and UI Design, 003 Design Direction, 004 Discovery Workshops, single-line icons, hairlines, air.](praxis-v6-report-assets/fig/fig05_uncommon_services.png)

### 3.4 The Work page (OuiWill model — new in v6)

- **C13 — Opens as the immersive index.** Full-screen: the active client's work/mockup fills the screen; the **client names are a plain-text list** over it; the **active name is highlighted**, the rest quiet. Scrolling the list moves the highlight and swaps the background to that client's work. (OuiWill's mechanics, verified live — §4.1.)
- **C14 — Click a name → its work highlights; scroll down → the case study opens.** Selecting a client highlights that name and its work; continuing to scroll opens the **full case study** in the same flow. The existing case-study pages/content carry over — this changes how you arrive, not what the studies say.
- **C15 — List View toggle, exactly like OuiWill's.** A second view: the editorial list/grid — large image, project name, and the services as small chips. Both views ship; the immersive index is the default.
- **C16 — No filter pills, no card grid as the opening.** The current "Sixteen projects made real." opening (filter pills + image cards) is replaced by C13–C15.

### 3.5 The Services page

- **C17 — Remove the service icons.** The icon tiles beside each service area come off the page.
- **C18 — Remove the extra pages.** The separate pages that open off the Services page are deleted; Services is **one page**. (Links elsewhere that pointed at those pages point at the Services page instead.)
- **C19 — Everything else on the page stays** — the big headline treatment, the four areas, their copy, the colour highlight on the items, and the "Word from our clients" block (marked "perfect" by Appa) — with Neue Montreal applied (§2.1).

### 3.6 What does NOT change

- The rest of the landing page beyond §§3.1–3.3 stays as built (Video 3, explicit).
- The closing speak-line — "We speak English, Arabic and Design at Praxis." — stands (v5 §7), as does the footer.
- The brand system (palette, logo, Handjet) stands. No people's names on the homepage stands.
- Case-study content, journal and other pages keep their content; only the Services sub-pages are removed (C18).

---

## 4. The references, broken down

### 4.1 OuiWill — ouiwill.com/work and ouiwill.com/about (studied live, 15 Nov 2026)

**/work** is the model for our Work page (C13–C15):
- Default view is a **full-screen index**, not a grid: the active project's photograph fills the screen, and the **project names scroll vertically in very large type** over it, looping. The name at the centre is solid/active; names above and below fade with distance. Scrolling moves the active project and **crossfades the background** to that project's image. A small counter (01–08) sits bottom-left with a **"Full view"** pill.
- **Full view** flips to the **List view**: white page, "Selected Work" heading, an editorial grid (two columns, then a full-width card, then pairs). Each card: large image, project name in large type, and the **services as small pill chips** beside the name. No years, no filters.
- Their index holds 8 clients (Oura, Rivian, Pebble, Hyperframe, Artsa.ai, Moodytiger, Fuse, Moxion) — a short, major-works list, which is the same instinct as C5.

**/about** — reference for presentation habits, where they fit Praxis:
- Opens with **scroll-driven value scenes**: one huge word per screen ("Clarity", "Conviction", "Follow-through") with small images drifting around it and testimonial cards inside the collage — no separate testimonials block.
- A **manifesto statement** revealed by scroll, then an **industries list** beside a changing image, a **client logo marquee**, and **services as four numbered groups** with giant faint numerals.
- Team is shown as **four people only**, greyscale portraits, name + role above each photo.
- Footer carries **live clocks for their two cities** (San Diego, Paris) — the same detail family as our Islamabad live clock, which stays.

### 4.2 Uncommon — uncommondesign.group (the homepage model)

- Hero: "We specialise in crafting digital experiences that elevate your business", a featured project, then the black stage — **"We design for impact. See for yourself."** — from which the works rise one at a time (Video 1).
- Work items sit as **full rectangles on the dark ground**, name bottom-left, services in small caps bottom-right ("UX/UI DESIGN · ART DIRECTION · DESIGN SYSTEM" on the kismet piece).
- A headline block with **extreme breathing space**: "Design that delivers uncommonly good results" with a two-line paragraph and two small pills — a whole screen, mostly empty (fig06).
- Services in the **numbered single-line-icon columns** of §3.3, closing with "Communication, collaboration and clarity are key. We do not leave them to chance." and the footer line our speak-line adapts: "We speak English, Spanish and Design…"

### 4.3 iVentions — iventions.com/about (the tilt + values-card reference)

- The page Hamzi linked opens "The global event agency behind powerful brand moments and events" with a showreel, a mindset statement, then **"What we're made of"**: big numbered cards and stat blocks (270+ projects delivered, 90% loyal clients, 22 team nationalities, 31 countries reached), each with an image and one line of copy.
- The detail Appa took from it is specific: **the numbered cards tilt slightly under the cursor** (Video 7). That tilt — nothing more — is what transfers to the Praxis work rectangles (C8). The numbered-card pattern itself is documented here in case the About page wants it later; Appa did not ask for it on this pass.

### 4.4 Our own site — as filmed (the starting point)

- Hero: black, pill header, strap line, "Theory made real." with the pixel word, pixel-mosaic artwork right, status bar with Islamabad clock (fig01).
- Homepage work: the name-row index with right-side tags and a pixel-dissolve hover preview (fig07) — replaced by §§3.2/3.4 treatment.
- Services page: "Four ways we make it real.", numbered areas with icon tiles (fig09) — icons out per C17.
- Work page: "Sixteen projects made real.", filter pills, image cards (fig10) — replaced per §3.4.

---

## 5. Where v6 changes v5 (read this before building)

| # | v5 said | v6 says (Appa, this round) |
|---|---|---|
| 1 | Services straight after the hero; Work after Services | **Works come after the hero, then Services** (Video 1's walk order) |
| 2 | Service icons drawn in each column's **accent colour**, in constant animation | Icons **single-line, no colour**, plain; **Appa supplies the artwork**; formation copied exactly (C11) |
| 3 | Homepage Work = index rows of **all 16 projects** with tags + cursor-following hover preview | Homepage = **4–5 major works as full rectangles**, name + credits on the side, tilt on hover; the 16-project index moves to the **Work page** as the OuiWill immersive index + List View (C5–C8, C13–C15) |
| 4 | Hero = cycling stills under a pixel-tile flip reveal | Hero = **Appa's motion reel**, opening **in pixels**, settling to the black stage; menu appears on scroll (C1–C4) |
| 5 | Typeface: **Helvetica Neue** workhorse | **Neue Montreal** workhorse (files supplied); Handjet unchanged (§2.1) |
| 6 | Scope: **homepage only**; other pages untouched | Scope extends: **Services page** (icons out, extra pages removed) and **Work page** (rebuilt) are in; the rest still untouched |
| 7 | Full palette accents across service columns and work rows | Palette accents stay for highlights/tags where v5 put them, **except the service icons**, which are colourless now (row 2) |

Everything else in v5 — the reading rule (§0), the four-section homepage, black hero, black-to-light scroll behaviour, speak-line, no names, no serif, vanilla stack, robustness rules — carries over unchanged.

---

## 6. Open points (defaults used, one line each to change)

1. **The About page — Hamzi's flag.** From his voice note (§1.8): he is not sure about the About page yet, doesn't like big names, and doesn't want faces on it; OuiWill's About is the reference he likes; he and Appa will discuss it. It blocks nothing in this report — the About page is not rebuilt on this pass — but the no-faces line should be settled before anyone touches that page.
2. **The reel.** Appa is making the motion reel herself. Until it lands, the hero builds with a placeholder (the strongest project visual, pixel-open applied) so Phases 1–2 are not blocked. Needed from her: the reel file (MP4/WebM), a poster frame, and its length/loop point.
3. **The service icons.** Appa provides the four icon drawings (SVG preferred). Until they land, the columns build with simple single-line placeholder SVGs in the same formation.
4. **Which 4–5 works lead the homepage.** Default: KOFFA, LEDGERLY, VELOUR plus the two strongest remaining covers. Appa confirms or swaps.
5. **Video 4's tail — resolved.** The first transcription garbled the end of Video 4; a second pass recovered it in full (the colour highlight stays; "we don't need another page for it"; "Word from our clients" — "this is perfect"). It is folded into §1.4 and C19. Nothing from the seven videos remains unrecovered.
6. **"Islamabad" by the clock** — v5's open point, still open, default unchanged: the word stays.
7. **Full-screen images for the Work page.** The immersive index (C13) puts each client's work on a full screen. The current project covers were made for cards; any that are too small or wrong-shaped for full-screen need a bigger version from the studio. A per-project check, not a redesign — flagged so it is checked in Phase 0, not discovered in Phase 3.

---

## 7. Build phases

**Phase 0 — Assets and decisions (Appa / Hamzi, no code)**
Reel delivered (or placeholder agreed) · four service icons delivered as SVG · homepage's 4–5 works confirmed · full-screen-grade images confirmed for the Work page index (§6.7). *Done when: every asset the build needs is in the repo or explicitly placeholdered.*

**Phase 1 — Foundation (code)**
Neue Montreal self-hosted (`@font-face`, Light/Regular/Medium/Bold + italics) and swapped in as the primary sans sitewide; Handjet untouched · the spacing system: section rhythm and breathing-room scale defined once and applied to homepage, Services and Work pages · Services page quick wins: icons removed (C17), extra service pages removed and their links redirected (C18). *Done when: the site builds, reads in Neue Montreal everywhere, and the Services page is one clean page.*

**Phase 2 — Homepage (code)**
Hero: reel slot with the pixel-open, settling to the black stage; menu appears on scroll (C1–C4) · Works: 4–5 rectangles, side name + credits, straight at rest, iVentions tilt on hover (C5–C8) · Services: Uncommon formation columns with Appa's icons (C10–C12) · black-to-light scroll behaviour from v5 kept through the new order (Works → Services). *Done when: the landing page runs the full Video-1 journey end to end on desktop and mobile.*

**Phase 3 — Work page (code)**
Immersive index: plain-text client list over the active client's full-screen work, scroll-driven highlight + background swap (C13) · selection flows into the existing case studies (C14) · List View toggle with image + name + service chips (C15) · old filter-pill opening removed (C16). *Done when: all 16 projects are reachable in both views and every case study opens from both.*

**Phase 4 — QA and polish (code + review)**
Desktop 1440px and mobile 390px pass on every changed page · `prefers-reduced-motion`: reel becomes a still frame with the pixel-open skipped, tilt off, index still fully navigable · no-JS fallbacks hold · build (`node src/build.mjs`) passes · live sighting on the deployed URL, desktop + mobile, before calling it done · report back section by section, flagging every judgment call, per the vision-first rule. *Done when: the live site matches this report and Appa's videos, checked on screen, not assumed.*

---

## Appendix — transcripts (basis of §1)

**Video 1 (English, verbatim):** "Okay, for the landing page I don't want this — say it's going to be like this — it's going to be a whole motion reel video I will make, and then as you scroll you see how this opens. I don't want it to open like that, I want it to open in a pixel way, like the pixels that we have — it can open in a pixel way, not in a rectangle, like pixelated open — and then it goes down to this whole black screen, and as you scroll down the menu on top appears. And then you scroll down and then, not in a square, in a rectangle, there are some of our works, like the most top works, and it's going to be like this — the name is going to appear with all of the things we did for them. And you scroll down again, this appears — another work, this appears — another work. And then you scroll down and then it goes to services, and this service appears. Okay also see, there is so much space over here, there is a breathing space over here — so I need that breathing space. I want the icons to be exactly like this — as in, I will give you the icons — but the formation of icons, when we are small, single line, no colour added, like plain and simple, and placed exactly like this. And again, if you scroll down, this empty space over here, which is lacking in our own website…"

**Video 2 (Urdu, faithful rendering):** "Okay, this work section of ours, the portfolio section — it is not going to be like this, it is going to be like this. The thing will not be crooked, the thing will be straight. As the arrow/cursor comes, a slight tilt will come into it. In the middle will be our work. And as you scroll, text will not come on top of it; on the side the client's name will come, and here the description will come — that we made the brand strategy, made the website, what we made, all those things. Like this, four or five of our works will come — the major, major works will come, rather than [all of them disclosed] — this is not looking good at all. But these crooked lines written here — these will come on the side, here the name will come, this will be a rectangle, straight. And here, when the cursor comes slightly, it will tilt-move slightly."

**Video 3 (Urdu, faithful rendering):** "The rest, on the landing page, everything will stay as it is — just some font changes, which I will tell you. The rest of the things will stay like this, but more space — the things I have told you, those changes will happen. In fact we have no space at all between things; the rest stays as it is. This part is fine. Now I go to the next one, the Work [page]."

**Video 4 (Urdu, faithful rendering; tail recovered on a second pass):** "Okay, first of all the Services [page] — this thing is right. I will tell you the font changes. Now this is going to be as-it-is, okay — in this, remove these icons. Okay — just big, big [headings], Strategy & Consulting — in this, this font will come, and this thing stands out. These extra pages that are opening — minus all these extra pages. We don't want that. Just this thing will be there — the way this is highlighted, it is being highlighted by some colour. All these things are explained [here]. So we don't need another page for it. Words from a client — this is perfect, this is perfect."

**Video 5 (Urdu, faithful rendering):** "Okay, now this Work page — in this too, remove the [cards/images], just plain text will be there. Okay, and when the Work page opens, it will not open like this — it will be like this. Okay — you clicked on Work; the way this [OuiWill page] is, full-screen behind, the mockup there is — the mockup will be there, and that word will be highlighted in the list of clients. Then in this, you click on Rivian — that word is highlighted, and all its work is highlighted. Then as you scroll down, in front of you your full case study opens — Rivian's — in the same way."

**Video 6 (Urdu, faithful rendering):** "Okay, in Work, one thing will come like this, but there is another option there — List View. In that, one [view] comes like full-screens, one comes like this too — the way it is given here. Exactly like this. Exactly."

**Video 7 (Urdu + English, verbatim where English):** "So an example of this is — on this square, when your cursor went, it tilted slightly like this. This was the tilt I was talking about. You get it?"

**Hamzi's voice note (Urdu/English, recovered on a second pass):** "I'm not sure about the About page right now. I'm not sure about it. I think it's fine, but the thing is that I don't like such big names. So I'm gonna send you this website — we will discuss its About, so do it according to it. I don't want faces on the About. I really like how [OuiWill's] About is, so according to that, just look at the things." Treated as §6.1 — an About-page item, not a change to any of Appa's instructions.

---

*Report compiled by Kai, 15 Nov 2026, from the seven videos, the voice note, the font files, the four reference links (checked live the same day) and the v5 pack. Screenshots are frames from Appa's videos.*
