import json, os
A = "/home/hatch/workspace/goals/vertex-studio-rebrand/files/praxis-v6-assets"
FONTS = "/home/hatch/workspace/goals/vertex-studio-rebrand/files/praxis-v6-report-assets/fonts"
projects = json.load(open(f"{A}/projects.json"))
SVC = {"strategy-consulting":"Strategy & Consulting","brand-creative":"Brand & Creative","web-digital":"Web & Digital","campaigns-media":"Campaigns & Media"}

def mark_svg(mark, accent):
    s = f'fill="none" stroke="{accent}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"'
    inner = {
    "grid": ''.join(f'<rect x="{20+c*60}" y="{20+r*60}" width="40" height="40"/>' for r in range(3) for c in range(3)) + f'<rect x="80" y="80" width="40" height="40" fill="{accent}" stroke="none"/>',
    "drop": '<path d="M100 18 C100 18 52 88 52 122 a48 48 0 0 0 96 0 C148 88 100 18 100 18 Z"/><path d="M72 128 a28 28 0 0 0 20 26"/>',
    "sun": '<path d="M28 138 A72 72 0 0 1 172 138"/><path d="M8 138h184"/><path d="M100 40V18M52 62 38 46M148 62l14-16M28 100H8M172 100h20"/>',
    "bolt": '<path d="M112 12 L52 112 h32 L78 188 L152 82 h-34 Z"/>',
    "stack": '<rect x="42" y="128" width="116" height="46" rx="8"/><rect x="42" y="76" width="116" height="46" rx="8"/><rect x="42" y="24" width="116" height="46" rx="8"/>',
    "arch": '<path d="M42 182 V104 A58 58 0 0 1 158 104 V182"/><path d="M70 182 V112 A30 30 0 0 1 130 112 V182"/><path d="M24 182h152"/>',
    "key": '<circle cx="72" cy="100" r="40"/><path d="M112 100h76M164 100v26M188 100v34"/>',
    "wave": '<path d="M8 62 Q33 36 58 62 T108 62 T158 62 T208 62"/><path d="M8 104 Q33 78 58 104 T108 104 T158 104 T208 104"/><path d="M8 146 Q33 120 58 146 T108 146 T158 146 T208 146"/>',
    "leaf": '<path d="M100 184 C42 142 34 62 100 16 C166 62 158 142 100 184 Z"/><path d="M100 168 V44"/>',
    "pixel": ''.join(f'<rect x="{x}" y="{y}" width="{w}" height="{w}" fill="{accent}" stroke="none"/>' for x,y,w in [(20,20,34),(66,20,22),(20,66,22),(100,44,30),(142,20,18),(54,100,26),(100,100,18),(142,86,26),(20,130,18),(86,142,30),(140,140,20),(54,54,12)]),
    "peak": '<path d="M12 172 L72 58 L104 112 L126 72 L188 172 Z"/><circle cx="156" cy="36" r="12"/>',
    "ring": f'<circle cx="100" cy="100" r="66"/><circle cx="100" cy="100" r="36"/><circle cx="100" cy="34" r="7" fill="{accent}" stroke="none"/>',
    }[mark]
    return f'<svg viewBox="0 0 200 200" {s}>{inner}</svg>'

def pixels(color, seed, n=14, sq=26):
    import random
    rnd = random.Random(seed)
    cells = [(rnd.randint(0,5), rnd.randint(0,3)) for _ in range(n)]
    parts = []
    for (cx, cy) in cells:
        o = rnd.choice([0.25, 0.45, 0.7, 1.0])
        parts.append(f'<div style="position:absolute;left:{cx*sq}px;top:{cy*sq}px;width:{sq}px;height:{sq}px;background:{color};opacity:{o}"></div>')
    return f'<div style="position:relative;width:{6*sq}px;height:{4*sq}px">{"".join(parts)}</div>'

def name_size(name):
    L = len(name.replace(" ",""))
    if L <= 6: return 310
    if L <= 9: return 250
    if L <= 13: return 205
    return 165

os.makedirs(f"{A}/covers_html", exist_ok=True)
for i, p in enumerate(projects):
    layout = i % 4
    bg, ink, acc = p["bg"], p["ink"], p["accent"]
    serif = "Georgia, 'Times New Roman', serif" if p["font"] == "serif" else "'Neue Montreal', sans-serif"
    ns = name_size(p["name"])
    _w = p["name"].split(" ")
    if len(p["name"]) > 12 and len(_w) >= 2:
        _m = (len(_w)+1)//2
        name_html = " ".join(_w[:_m]) + "<br>" + " ".join(_w[_m:])
    else:
        name_html = p["name"]
    services = " · ".join(SVC[s] for s in p["services"])
    mark = mark_svg(p["mark"], acc)
    idx = f"{i+1:02d}"
    css = f"""
@font-face {{ font-family:'Neue Montreal'; src:url('file://{FONTS}/NeueMontreal-Regular.otf'); font-weight:400; }}
@font-face {{ font-family:'Neue Montreal'; src:url('file://{FONTS}/NeueMontreal-Medium.otf'); font-weight:500; }}
@font-face {{ font-family:'Neue Montreal'; src:url('file://{FONTS}/NeueMontreal-Bold.otf'); font-weight:700; }}
@font-face {{ font-family:'Neue Montreal'; src:url('file://{FONTS}/NeueMontreal-Italic.otf'); font-style:italic; }}
* {{ margin:0; padding:0; box-sizing:border-box; }}
body {{ width:1920px; height:1080px; background:{bg}; color:{ink}; font-family:'Neue Montreal', sans-serif; overflow:hidden; position:relative; }}
.meta {{ position:absolute; top:56px; left:72px; right:72px; display:flex; justify-content:space-between; font-size:21px; letter-spacing:0.32em; font-weight:500; opacity:0.85; }}
.foot {{ position:absolute; bottom:52px; left:72px; right:72px; display:flex; justify-content:space-between; font-size:21px; letter-spacing:0.26em; font-weight:500; opacity:0.85; border-top:2px solid {ink}33; padding-top:26px; }}
h1 {{ font-family:{serif}; font-weight:700; font-size:{ns}px; line-height:0.98; letter-spacing:-0.015em; }}
.tag {{ font-style:italic; font-size:52px; color:{acc}; margin-top:30px; font-weight:400; }}
.mark svg {{ width:100%; height:100%; }}
"""
    if layout == 0:
        body = f"""<div class="mark" style="position:absolute;right:110px;top:250px;width:520px;height:520px">{mark}</div>
<div style="position:absolute;right:72px;top:120px">{pixels(acc, i+3)}</div>
<div style="position:absolute;left:72px;bottom:150px;max-width:1250px"><h1>{name_html}</h1><div class="tag">{p['tagline']}</div></div>"""
    elif layout == 1:
        body = f"""<div style="position:absolute;left:72px;top:150px;max-width:1300px"><h1>{name_html}</h1><div class="tag">{p['tagline']}</div></div>
<div class="mark" style="position:absolute;right:120px;bottom:140px;width:470px;height:470px">{mark}</div>
<div style="position:absolute;left:72px;bottom:150px">{pixels(acc, i+7)}</div>"""
    elif layout == 2:
        l2size = 148 if len(p["name"]) > 14 else ns
        body = f"""<div class="mark" style="position:absolute;left:50%;top:110px;transform:translateX(-50%);width:280px;height:280px">{mark}</div>
<div style="position:absolute;left:0;right:0;top:430px;text-align:center"><h1 style="font-size:{l2size}px">{name_html}</h1><div class="tag">{p['tagline']}</div></div>
<div style="position:absolute;left:72px;top:120px">{pixels(ink, i+11, 9)}</div>
<div style="position:absolute;right:72px;bottom:150px">{pixels(acc, i+13, 9)}</div>"""
    else:
        body = f"""<div style="position:absolute;right:-40px;top:60px;font-family:{serif};font-weight:700;font-size:880px;line-height:1;color:{ink};opacity:0.07">{p['name'][0]}</div>
<div class="mark" style="position:absolute;left:72px;top:170px;width:300px;height:300px">{mark}</div>
<div style="position:absolute;left:72px;top:480px;max-width:1400px"><h1 style="font-size:{int(ns*0.82) if '<br>' in name_html else ns}px">{name_html}</h1><div class="tag">{p['tagline']}</div></div>
<div style="position:absolute;right:72px;bottom:150px">{pixels(acc, i+17)}</div>"""
    html = f"""<!doctype html><html><head><meta charset="utf-8"><style>{css}</style></head><body>
<div class="meta"><div>PRAXIS STUDIO</div><div>{idx} / 16</div></div>
{body}
<div class="foot"><div>{p['industry'].upper()} — {p['location'].upper()}</div><div>{services.upper()}</div></div>
</body></html>"""
    open(f"{A}/covers_html/{p['slug']}.html","w").write(html)
print("generated", len(projects))
