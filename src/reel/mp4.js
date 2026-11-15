// Minimal MP4 demuxer (video track → sample table) and muxer (H.264 avcC → fast-start MP4, video only).
// Plain ES module, used by the editor page. No dependencies.

// ---------- demux ----------
const u32 = (d, o) => d.getUint32(o);
const str4 = (d, o) => String.fromCharCode(d.getUint8(o), d.getUint8(o + 1), d.getUint8(o + 2), d.getUint8(o + 3));
const CONTAINERS = new Set(['moov', 'trak', 'mdia', 'minf', 'stbl', 'edts', 'dinf']);

function boxes(d, start, end, cb) {
  let o = start;
  while (o + 8 <= end) {
    let size = u32(d, o); const type = str4(d, o + 4); let hdr = 8;
    if (size === 1) { size = Number(d.getBigUint64(o + 8)); hdr = 16; } else if (size === 0) size = end - o;
    cb(type, o + hdr, o + size);
    o += size;
  }
}

export function demux(buf) {
  const d = new DataView(buf);
  const tracks = [];
  const walk = (s, e, t) => boxes(d, s, e, (type, b, end) => {
    if (type === 'trak') { const tr = {}; tracks.push(tr); walk(b, end, tr); return; }
    if (CONTAINERS.has(type)) { walk(b, end, t); return; }
    if (!t) return;
    const v = d.getUint8(b); let o = b + 4;
    switch (type) {
      case 'mdhd': if (v === 1) { t.timescale = u32(d, o + 16); } else { t.timescale = u32(d, o + 8); } break;
      case 'hdlr': t.handler ??= str4(d, o + 4); break; // first hdlr (mdia); QuickTime files repeat one in minf
      case 'elst': {
        const n = u32(d, o); o += 4; t.edits = [];
        for (let i = 0; i < n; i++) {
          if (v === 1) { t.edits.push({ dur: Number(d.getBigUint64(o)), mt: Number(d.getBigInt64(o + 8)) }); o += 20; }
          else { t.edits.push({ dur: u32(d, o), mt: d.getInt32(o + 4) }); o += 12; }
        }
        break;
      }
      case 'stsd': {
        // first sample entry
        const es = b + 8, esz = u32(d, es), etype = str4(d, es + 4);
        t.format = etype; t.width = d.getUint16(es + 8 + 24); t.height = d.getUint16(es + 8 + 26);
        boxes(d, es + 8 + 78, es + esz, (ct, cb, ce) => {
          if (ct === 'avcC' || ct === 'hvcC') { t.configType = ct; t.description = new Uint8Array(buf.slice(cb, ce)); }
        });
        break;
      }
      case 'stts': { const n = u32(d, o); o += 4; t.stts = []; for (let i = 0; i < n; i++, o += 8) t.stts.push([u32(d, o), u32(d, o + 4)]); break; }
      case 'ctts': { const n = u32(d, o); o += 4; t.ctts = []; for (let i = 0; i < n; i++, o += 8) t.ctts.push([u32(d, o), v === 1 ? d.getInt32(o + 4) : u32(d, o + 4)]); break; }
      case 'stss': { const n = u32(d, o); o += 4; t.stss = new Set(); for (let i = 0; i < n; i++, o += 4) t.stss.add(u32(d, o)); break; }
      case 'stsz': { const fixed = u32(d, o), n = u32(d, o + 4); o += 8; t.sizes = []; for (let i = 0; i < n; i++) { t.sizes.push(fixed || u32(d, o)); if (!fixed) o += 4; } break; }
      case 'stsc': { const n = u32(d, o); o += 4; t.stsc = []; for (let i = 0; i < n; i++, o += 12) t.stsc.push([u32(d, o), u32(d, o + 4)]); break; }
      case 'stco': { const n = u32(d, o); o += 4; t.chunks = []; for (let i = 0; i < n; i++, o += 4) t.chunks.push(u32(d, o)); break; }
      case 'co64': { const n = u32(d, o); o += 4; t.chunks = []; for (let i = 0; i < n; i++, o += 8) t.chunks.push(Number(d.getBigUint64(o))); break; }
    }
  });
  walk(0, buf.byteLength, null);
  const t = tracks.find((x) => x.handler === 'vide');
  if (!t) throw new Error('no video track');
  // sample table
  const n = t.sizes.length, samples = new Array(n);
  let dts = 0, si = 0;
  for (const [count, delta] of t.stts) for (let k = 0; k < count; k++, si++) { samples[si] = { dts }; dts += delta; }
  let ci = 0; if (t.ctts) { for (const [count, off] of t.ctts) for (let k = 0; k < count; k++, ci++) samples[ci].cto = off; }
  si = 0;
  for (let c = 0; c < t.chunks.length; c++) {
    let per = 0; for (const [first, spc] of t.stsc) if (first - 1 <= c) per = spc;
    let off = t.chunks[c];
    for (let k = 0; k < per && si < n; k++, si++) { samples[si].offset = off; samples[si].size = t.sizes[si]; off += t.sizes[si]; }
  }
  const shift = t.edits ? (t.edits.find((e) => e.mt >= 0)?.mt || 0) : 0;
  for (let i = 0; i < n; i++) {
    const s = samples[i];
    s.pts = (s.dts + (s.cto || 0) - shift) / t.timescale;
    s.dur = ((samples[i + 1]?.dts ?? dts) - s.dts) / t.timescale;
    s.key = t.stss ? t.stss.has(i + 1) : true;
  }
  const hex = (x) => x.toString(16).padStart(2, '0');
  const codec = t.configType === 'avcC' ? `avc1.${hex(t.description[1])}${hex(t.description[2])}${hex(t.description[3])}` : 'hvc1';
  const fps = n / (dts / t.timescale);
  return { codec, width: t.width, height: t.height, description: t.description, samples, duration: dts / t.timescale, fps, buf };
}

// ---------- mux ----------
const enc = new TextEncoder();
function box(type, ...parts) {
  const body = parts.flat(Infinity);
  const len = 8 + body.reduce((a, p) => a + p.byteLength, 0);
  const h = new Uint8Array(8); new DataView(h.buffer).setUint32(0, len); h.set(enc.encode(type), 4);
  return [h, ...body];
}
const full = (type, version, flags, ...parts) => box(type, new Uint8Array([version, flags >> 16 & 255, flags >> 8 & 255, flags & 255]), ...parts);
const U32 = (...xs) => { const a = new Uint8Array(xs.length * 4), d = new DataView(a.buffer); xs.forEach((x, i) => d.setUint32(i * 4, x)); return a; };
const U16 = (...xs) => { const a = new Uint8Array(xs.length * 2), d = new DataView(a.buffer); xs.forEach((x, i) => d.setUint16(i * 2, x)); return a; };
const zeros = (n) => new Uint8Array(n);
const MATRIX = U32(0x10000, 0, 0, 0, 0x10000, 0, 0, 0, 0x40000000);
const size = (parts) => parts.flat(Infinity).reduce((a, p) => a + p.byteLength, 0);

// chunks: [{data:Uint8Array, key:boolean}] in decode order (no B-frames), constant frame duration.
export function mux({ width, height, fps, avcC, chunks }) {
  const TS = fps * 1000, DELTA = 1000, N = chunks.length, DUR = N * DELTA;
  const build = (mdatStart) => {
    const offsets = []; let o = mdatStart + 8; for (const c of chunks) { offsets.push(o); o += c.data.byteLength; }
    const keys = chunks.map((c, i) => (c.key ? i + 1 : 0)).filter(Boolean);
    const avc1 = box('avc1', zeros(6), U16(1), zeros(16), U16(width, height), U32(0x480000, 0x480000, 0), U16(1), zeros(32), U16(0x18, 0xffff), box('avcC', avcC));
    const stbl = box('stbl',
      full('stsd', 0, 0, U32(1), avc1),
      full('stts', 0, 0, U32(1, N, DELTA)),
      full('stss', 0, 0, U32(keys.length, ...keys)),
      full('stsc', 0, 0, U32(1, 1, 1, 1)),
      full('stsz', 0, 0, U32(0, N, ...chunks.map((c) => c.data.byteLength))),
      full('stco', 0, 0, U32(N, ...offsets)));
    const minf = box('minf', full('vmhd', 0, 1, zeros(8)), box('dinf', full('dref', 0, 0, U32(1), full('url ', 0, 1))), stbl);
    const mdia = box('mdia', full('mdhd', 0, 0, U32(0, 0, TS, DUR), U16(0x55c4, 0)),
      full('hdlr', 0, 0, U32(0), enc.encode('vide'), zeros(12), enc.encode('Praxis video\0')), minf);
    const tkhd = full('tkhd', 0, 3, U32(0, 0, 1, 0, DUR, 0, 0), U16(0, 0, 0, 0), MATRIX, U32(width << 16, height << 16));
    const mvhd = full('mvhd', 0, 0, U32(0, 0, TS, DUR, 0x10000), U16(0x100, 0), zeros(8), MATRIX, zeros(24), U32(2));
    return box('moov', mvhd, box('trak', tkhd, mdia));
  };
  const ftyp = box('ftyp', enc.encode('isom'), U32(0x200), enc.encode('isomiso2avc1mp41'));
  const moovSize = size(build(0));
  const moov = build(size(ftyp) + moovSize);
  const mdatLen = 8 + chunks.reduce((a, c) => a + c.data.byteLength, 0);
  const mdatHdr = new Uint8Array(8); new DataView(mdatHdr.buffer).setUint32(0, mdatLen); mdatHdr.set(enc.encode('mdat'), 4);
  return new Blob([...ftyp, ...moov.flat(Infinity), mdatHdr, ...chunks.map((c) => c.data)], { type: 'video/mp4' });
}
