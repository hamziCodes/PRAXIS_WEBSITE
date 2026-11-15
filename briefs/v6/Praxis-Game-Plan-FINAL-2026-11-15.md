# Praxis Studio — The Game Plan (final)

**For:** the Claude building the site, via the PRAXIS_WEBSITE repo.
**From:** Hamzi + Kai, 2026-11-15. **Status: awaiting Hamzi's double-check — this document is the approval gate.**
**Base document:** *Praxis Rework Report v6 (amended)* — Appa's walkthrough, the change list C1–C19, the reference breakdown, the phases. This plan does not replace it. It closes the three asset questions the report left open, and it corrects three things after Hamzi reviewed Kai's first placeholder assets tonight.

**Reading rule (unchanged, vision-first):** the vision in the report governs. Where a mechanic in this plan and a better idea inside the brand system disagree, the better idea wins — flag it in the report-back. The hard lines do not move: `docs/` untouched, brand system fixed, homepage = four sections, no people's names, no serif accents (Handjet does accents), vanilla stack, the speak-line verbatim.

---

## 1. What changed tonight — the three corrections

1. **The project covers Kai designed are inspiration, not the work.** They set the colour, the name, the tagline and the level of finish for each project — nothing more. The real portfolio imagery gets *created* during the build, per §3 of this plan. (Hamzi's words: he did not ask for generated work to be put on the website; the covers are really good as inspiration — bring them into realism.)
2. **The service icons are Uncommon's own icons, pulled from their site.** Appa's call. They are animated Lottie files — which is exactly why the formation feels alive on their page. Use them as-is until Appa draws Praxis's own; then swap files, nothing else changes. §4.
3. **The reel is stitched from a library, not from one folder dump.** Kai pulled all 24 of Appa's Drive videos, watched every one, and selected 19 into a **Reel Library** with notes on what each clip shows and how to use it. Claude stitches the placeholder hero reel from that library, to the measured spec in §5. Kai's own first stitch (already built) is the pacing reference, not the final cut.

Everything else in the v6 report stands as written.

## 2. The site build — carried from the report (compact)

Homepage order: **Hero → Works → Services → Contact.**

- **C1–C4 · Hero.** Appa's reel (placeholder per §5) opens **in pixels** — a pixelated open, not a rectangle reveal — settles to a whole black stage; the menu appears on scroll.
- **C5–C8 · Homepage works.** 4–5 major works only (default five: KOFFA, LEDGERLY, VELOUR + the two strongest covers; Appa confirms). Each a **wide rectangle**, one at a time on scroll; work visual in the middle; **client name + everything done for them on the side — no text on the image**; straight at rest, the **slight iVentions tilt** on hover (Video 7 defines it — nothing bigger).
- **C9 · Rest of the landing page stays** — speak-line, footer, brand system.
- **C10–C12 · Services formation.** Uncommon's, exactly: numbered columns 001–004, hairline dividers, icons single-line in feel, **no colour fills**, placed exactly like the reference. Praxis's four services unchanged: Strategy & consulting / Brand & creative / Web & digital / Campaigns & media. Icons per §4.
- **C13–C16 · Work page, OuiWill-style.** Immersive full-screen index as default: active client's work fills the screen, client names as a **plain text list**, active name highlighted, scrolling swaps highlight + background; click a name → its work; scroll down → the full case study opens in flow (existing case-study content carries over). **List View toggle exactly like OuiWill's**: editorial grid, image + name + service pill chips. The current filter-pills + card-grid opening is removed.
- **C17–C19 · Services page.** Icon tiles **removed**; the extra pages that open off Services **deleted** — Services stays one page; everything else stays (big headline treatment, the four areas, their copy, the colour highlight behaviour, the "Word from our clients" block — Appa marked it *"perfect"*).
- **§2.1 · Type.** **Neue Montreal** replaces Helvetica Neue as the primary sans, sitewide, self-hosted from the files supplied (8 OTFs). Handjet unchanged, accents/labels only.
- **§2.2 · Space.** A spacing pass at Uncommon's scale — generous empty space around everything, on the homepage, Services and Work pages. The current site is crowded; this is a headline instruction, not polish.

## 3. Work imagery — realism, created per project (NEW — read carefully)

The 16 projects need full-screen visuals for the Work page index (C13) and strong visuals on the homepage rectangles (C5). Kai's 16 designed covers (in the pack, `briefs/v6/covers/` (PNGs in the hand-off bundle; HTML sources in `briefs/v6/covers-source/`)) are the **inspiration board**: each one fixes that project's palette, name treatment, tagline and finish level.

**What to create:** for each project, a realistic, rendered visual world — the way Appa's own videos present work: real product UI on devices, packaging, spaces, campaign imagery, interfaces with real detail. Styles may mix per project — glassmorphism, minimalism, maximum realism, pixelisation where the brand calls for it — the way real studio portfolios mix them. Immersive and literary in detail: the viewer should be able to lean in.

**How to create it — designed, not generated (Hamzi, explicit):** nothing hard-coded and no one-shot AI imagery ("AI slop") shipped as portfolio work. Build each visual the way a studio does: real design elements composed with intent — genuine product UI drawn properly, typography, renders and mockups assembled piece by piece, and information extracted from the web (the project's industry, real products, real places, reference photography) to ground every piece in something true. If a generated element is used at all, it is raw material inside a designed composition, never the finished visual.

**The failure mode, named so it is not shipped:** a flat single-colour page with text and a small logo mark, repeated project after project with only the name and colours changed. (In Kai's inspiration set, Kisima and Oleum land close to this — same mark, same layout family. As inspiration that is fine; as the website's work imagery it is exactly what Hamzi rejected.) **No two projects may share the same visual formula.** Coffee looks like coffee, banking looks like banking, a festival looks like a festival.

Per-project starting points (palette/tagline from the covers; worlds from the case-study text in `src/data/projects.mjs`):
KOFFA — letterpress coffee packaging, kraft bags, café signage · LEDGERLY — the bookkeeping app on phones, chat-style UI, shop counters · VELOUR — fashion campaign, garments in motion · SAFFA — street retail, price tags, loyalty cards · KISIMA — water programme, kiosks, jerrycans, trust · COSTA LUME — Algarve coast out of season · KITEPAY — fintech app, cards, Dubai light · AUREL — hotel interiors, brass and wine tones · TARAZU — banking app onboarding · LOWTIDE — festival print, programmes people frame · CEDARLINE — clinic booking, calm healthcare · OLEUM — oil bottles, honest labels, London light · KESTREL — hotel above the city · THREAD & LOOM — woven textiles, cotton country · FIXWELL — home services, tools, vans · KORA HOME — furniture showroom, one-visit rooms.

## 4. Icons — Uncommon's exact files (NEW)

In the pack: `briefs/v6/icons/uncommon/` — the four animated **Lottie** icons pulled from uncommondesign.group, plus their morphing decorative file. Map them by formation position, exactly as they sit on Uncommon's page:

| Praxis column | Uncommon file |
|---|---|
| 001 Strategy & consulting | Design_Sprints_833e63857e.lottie |
| 002 Brand & creative | Strategic_Design_4ba2455ad5.lottie |
| 003 Web & digital | Design_Direction_dacd3b1243.lottie |
| 004 Campaigns & media | Discovery_Workshops_f2948cd431.lottie |

Play them the way Uncommon does — subtle, constant, single-colour line work; no fills, no colour. When Appa supplies Praxis's own icons, the swap is files-only. Kai's four hand-drawn SVGs are also in the pack (`briefs/v6/icons/`) as a fallback if Lottie causes any trouble — do not use both sets.

## 5. The reel — stitch from the library, to spec (NEW)

**Library:** `briefs/v6/reel-library/` — 19 of Appa's 24 Drive videos, selected and annotated (the folder's README is the manifest: what each clip shows, sizes, suggested use, and the 5 exclusions with reasons). Canonical source, if any file is missing: her Drive folder — https://drive.google.com/drive/folders/13fARo0TDQZlfenUsNhp3eUJFTcjYoI5q

**The job:** stitch a clean placeholder hero reel from the Primary list. It sits in the hero (C1) until Appa's own reel replaces it — the swap must need zero site changes.

**Spec — measured from the reference sites' actual files tonight, not guessed:**
- **16:9, edited in a 1920×1080 timeline** (a 2560×1440 master is welcome for the fullscreen moment — Uncommon serves exactly that step-up)
- H.264 MP4, ~3.5–5 Mbps; **25–40 seconds** (Uncommon's loop: 40s at 3.6 Mbps, 19 MB; iVentions' showreel: 47s at 3.7 Mbps)
- **Full-bleed composition** — real picture in every corner. Her clips are mostly vertical/4:5: blurred-fill sides (as in Kai's reference stitch) are acceptable for a placeholder, native 16:9 segments from *With subtitles with changes* are gold where they fit — mind its burned-in subtitles
- Keep anything important in the **centre ~60%** — phones crop the sides (object-fit: cover)
- **Clean cuts or pixel-dissolves** between clips; dark → light rhythm; start on the offer (the Services card stack literally lists what the studio does), end calm
- Silent (heroes autoplay muted), autoplay + loop + playsinline, **poster frame** supplied as a 1920×1080 JPG
- Kai's reference stitch (25s, in the pack at `briefs/v6/reel/hero-reel-placeholder.mp4` + poster) sets the pacing and the clip order — improve on it, don't restart from zero

## 6. Assets & logistics

**Repo layout (branch `main`, folder `briefs/v6/`):** this plan and the amended v6 report (MD in the repo; PDFs in the hand-off bundle, same names) · the Reel Library manifest · the four Uncommon icons (extracted Lottie JSON in the repo; original `.lottie` files in the bundle) + Kai's SVG fallbacks · the 16 covers' HTML sources (`briefs/v6/covers-source/`) so the inspiration board can be re-rendered and iterated · `briefs/v6/README.md` indexes everything, binaries included.
**Snapshot:** branch **`version-2`** holds the site exactly as it was before this rework (created from main on 2026-11-15). All new work lands on `main`.
**Hand-off bundle (binaries — they cannot pass through Kai's GitHub route):** the two PDFs, the 16 cover PNGs + contact sheet, the 8 Neue Montreal OTFs, the `.lottie` originals, the reference reel + poster, and 17 of the 19 library videos — in a folder tree identical to the repo paths, ready to drop into a clone and push. **Two videos are Drive-only, permanently:** *2nd Video.mp4* (341 MB) and *With subtitles with changes.mp4* (139 MB) exceed GitHub's 100 MB per-file limit; the Drive folder (§5) is their home, and the manifest links them.
**References:** OuiWill (ouiwill.com/work, /about) · Uncommon (uncommondesign.group) · iVentions (iventions.com/about) — full breakdown in the report, §4.

## 7. Open items — unchanged, none block the build

1. **About page** — Hamzi's flag: no faces, no big names; OuiWill's About is the liked reference; he and Appa discuss. Don't touch About on this pass.
2. **Homepage 4–5 works** — default five named in C5; Appa confirms.
3. **"Islamabad" by the clock** — stays, unless Hamzi says otherwise.
4. **Neue Montreal web licence** — a studio-side check before public launch (the font is commercial; files supplied by Appa).

## 8. Phases

- **Phase 0** — assets in hand: this pack + the video/font hand-off (§6).
- **Phase 1** — foundation: Neue Montreal sitewide · spacing system · Services-page quick wins (C17, C18).
- **Phase 2** — homepage: hero + reel (§5) · works (C5–C8, imagery per §3) · services formation (C10–C12, icons per §4) · contact.
- **Phase 3** — Work page: immersive index + List View (C13–C16), imagery per §3.
- **Phase 4** — QA: 1440px + 390px, reduced-motion and no-JS fallbacks, build passes, live sighting, judgment calls flagged per the reading rule.

## 9. The prompt (Hamzi sends this with the repo link)

> Pull the PRAXIS_WEBSITE repo. In the root you will find the v6 pack: start with `Praxis-Game-Plan-FINAL-2026-11-15.md` — it is the governing document — then the amended v6 report it builds on, then `docs/` (never overwrite `docs/`). Build the site in the repo root on the existing vanilla stack. The plan's reading rule applies throughout: vision first, mechanics are best-guesses, the hard lines (brand system, four homepage sections, no names, no serif, speak-line verbatim) do not move. Three things in the plan are new since the report and matter most: (1) the 16 covers are inspiration only — create the portfolio visuals by designing and composing real elements (genuine UI, typography, web-researched references and photography), per project, no repeated formula, no one-shot AI imagery; (2) the service icons are Uncommon's own Lottie files, included — use them exactly as their site does until Praxis's own arrive; (3) stitch the placeholder hero reel from the Reel Library to the measured spec in §5 — the library videos are in Appa's Drive folder linked in the plan (and the library README), the fonts come with the hand-off. Work phase by phase (plan §8), sight the result at desktop and phone widths before reporting, and flag every judgment call in your report-back.
