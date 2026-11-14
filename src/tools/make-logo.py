# Generates the Praxis logo geometry (src/logo.json) from the Brand Book plates.
# Wordmark letters are outlined from TeX Gyre Heros Bold (a free Helvetica-class grotesk, GUST licence);
# the x is replaced by the plated 4-petal star. Usage: python -I make-logo.py <heros-bold.otf> <out.json>
import sys, json
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
f = TTFont(sys.argv[1]); gs = f.getGlyphSet(); cmap = f.getBestCmap()
XH = f['OS/2'].sxHeight or 532; CH = f['OS/2'].sCapHeight or 718
TRACK = -22  # tight lockup tracking, font units
def star(cx, xh):
    # petal plated in Brand Book plate 2, normalised to x-height 100 (centre at 0,0)
    s = xh / 100.0
    P = [(0,0), (-39,-9.6), (-48.7,-37.8), (-22,-50)]
    out = []
    for sx, sy in [(1,1),(-1,1),(1,-1),(-1,-1)]:
        pts = [(cx + sx*x*s, xh/2 + sy*y*s) for x, y in P]
        out.append(pts)
    return out
def petals_path(petals, flip_h):
    d = ''
    r = 0.08  # outer corner rounding fraction
    for pts in petals:
        (c, a, b, t) = pts
        def lerp(p, q, k): return (p[0]+(q[0]-p[0])*k, p[1]+(q[1]-p[1])*k)
        b1, b2 = lerp(b, a, r*1.6), lerp(b, t, r)
        t1, t2 = lerp(t, b, r), lerp(t, c, r*0.9)
        Y = lambda p: f"{p[0]:.1f} {flip_h - p[1]:.1f}"
        d += f"M{Y(c)}L{Y(a)}L{Y(b1)}Q{Y(b)} {Y(b2)}L{Y(t1)}Q{Y(t)} {Y(t2)}Z"
    return d
def word(text, starpos=None):
    x = 0; d = ''
    for i, ch in enumerate(text):
        if i == starpos:
            w = XH * 0.974 + 30
            d += petals_path(star(x + w/2, XH), 0)
            x += w + TRACK; continue
        g = cmap[ord(ch)]; pen = SVGPathPen(gs)
        gs[g].draw(TransformPen(pen, (1,0,0,-1,x,0)))
        d += pen.getCommands(); x += gs[g].width + TRACK
    return d, x - TRACK
wd, ww = word("Praxis Studio", starpos=3)
# star alone (for bullets/asterisk motif), x-height box
sd = petals_path(star(XH*0.487, XH), 0)
json.dump({"capHeight": CH, "xHeight": XH, "wordWidth": round(ww), "word": wd, "star": sd,
  "starBox": [0, -XH, round(XH*0.974), XH]}, open(sys.argv[2], 'w'))
print(XH, CH, ww)
