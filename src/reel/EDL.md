# Praxis Studio trailer: cut list (EDL)

Output: `assets/video/praxis-trailer.mp4` (1920×1080, 30 fps, H.264 High, about 4.0 Mbps, 31.7 s, video only, moov first),
`assets/video/praxis-trailer-720.mp4` (1280×720, about 1.8 Mbps), `assets/video/praxis-trailer-poster.jpg` (frame at 13.4 s).
The cut is defined in code in `edl.js`. This file is the readable version of it. Sources are in `briefs/v6/reel-library/`.

Timecodes are output seconds. Source in/out are seconds in the source clip. "+0.5 under dissolve" means the outgoing shot keeps playing under the next shot's pixel dissolve.

| # | Out TC | Shot | Clip(s): source in → out | Treatment |
|---|---|---|---|---|
| 1 | 0.0–5.6 | **The offer** | Services 0.00 → 5.60 (+0.6 under dissolve) | 4:5 clip on its own black ground, centred in a 1120×1080 box (source y 110–1151, which crops the evolabs footer). Slow 1.00→1.05 push. Pixels in from black at the centre (40 px tiles, 0.7 s), which is the loop seam. Handjet label "PRAXIS STUDIO / WHAT WE DO" bottom left. |
| 2 | 5.6–8.2 | **Title** | none | Pixel dissolve in (60 px tiles, left→right, 0.6 s, a thin Inchworm scan edge). "Theory made real." in Neue Montreal Medium 150 px, Bone, with "real." in Inchworm. Pixel-in type, plus the Handjet label "PRAXIS STUDIO · ISLAMABAD". |
| 3 | 8.2–11.8 | **Brand & creative (dark)** | Evolabs Website 4.75 → 8.35 · Horizon evolabs 2.10 → 5.70 | Pixel dissolve in. Asymmetric diptych with an 8 px black gutter: Evolabs is 1100 wide and holds the centre, Horizon is 812 wide. Both are 4:5 with the footer cropped (source y 0–1215). Counter-zooms. The in-point skips the big client wordmark and a 2-frame black glitch in the source at 4.60. |
| 4 | 11.8–15.8 | **Product design (dark)** | 4th video 3.0 → 7.0 · Calendar 2 4.0 → 8.0 · Boards 5.0 → 9.0 (+0.6) | Hard cut to black, then a triptych of 634×1080 panels with 9 px gutters. The panels pixel in left→right, staggered by 0.12 s. Push 1.00→1.04. Calendar 2 takes the phone-safe centre. |
| 5 | 15.8–19.2 | **Full frame, the turn to light** | Shamel Budget (4K) 10.30 → 13.70 (+0.5) | Centre-out pixel dissolve. A native 16:9 band (2168×1219) of the 2168×3840 master, downscaled, so it stays sharp. The laptop swings into the pink ring, and the ring expands at the cut. |
| 6 | 19.2–23.4 | **Product depth (light)** | Shamel All in One 11.7 → 15.9 · Shamel Studio-Glinda 9.1 → 13.3 · Link Props 6.0 → 10.2 (+0.6) | Pixel dissolve in. Pastel triptych. Glinda's "new project" type sits in the centre panel. |
| 7 | 23.4–27.8 | **What we do (calm)** | Map Animation 0.45 → 4.85 (frozen under the dissolve) | Pixel dissolve in. A Bone (#DFE0D0) matte, 1220 wide, with a stepped pixel edge that drifts slowly. Handjet label "WHAT WE DO", then the four services pixel in line by line (Neue Montreal Medium 74 px, Handjet numerals 01–04). The map panel is 700 wide (source y 470–1490, which crops the client logo and copy) and the pins drop in. |
| 8 | 27.8–31.2 | **Sign-off** | none | Pixel dissolve to black. The Praxis lockup (Bone, `assets/logo/praxis-lockup-bone.svg`) and "Theory made real." pixel in, hold, then pixel out to black. |
| 9 | 31.2–31.7 | **Black** | none | Black hold that flows into shot 1's reveal from black. |

Rhythm: dark (1–4) → light (5–7) → black (8–9). The cut opens on the offer, ends calm on black, and loops without a seam.
Brand: black #000, Bone #DFE0D0 (site token `--bone`), Inchworm #B1FA63 (used only for the title accent and its scan edge), Neue Montreal for titles, Handjet for small labels.
Phone crop: titles, the services list and the centre panel of every triptych sit inside the centre 60% (x 384–1536).

## Re-cutting

```
node src/reel/render.mjs preview <out.png> 3 9.5 14 ...   # composed frames as a contact sheet (seconds)
node src/reel/render.mjs still <out.jpg> 13.4             # one composed frame at 1920×1080
node src/reel/render.mjs encode <out.mp4> [w h bitrate]   # full render
node src/reel/render.mjs all                              # 1080p + 720p + poster → assets/video/ (POSTER_T=13.4 by default)
node src/reel/sheet.mjs <dir> <step> <cols> <thumbW> "briefs/v6/reel-library/Boards.mp4@5-9"   # study a source clip or check a render
```

How it works: headless Chrome is driven over CDP (`cdp.mjs`, which also serves the repo and takes the uploaded MP4 bytes). `editor.js` demuxes each source in the page (`mp4.js`) and decodes it sequentially with WebCodecs `VideoDecoder`, so every output frame gets the exact source frame for its time. It composites on a 1920×1080 canvas using the square-tile masks in `fx.js`, encodes with `VideoEncoder` (avc1.640028, keyframe every 2 s) and muxes a fast-start MP4 (`mp4.js`). The encode also logs a per-frame luma check for 1–3 frame flashes ("luma spikes"). No ffmpeg or other dependencies are needed.
