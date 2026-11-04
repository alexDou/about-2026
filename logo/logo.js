// Animated "a" logo: two Loop Lab–style weaves (the O and the curved line).
// Weave math adapted from Loop Lab's pathData() (../script.js).
// Exposes window.Logo so the tuning panel (panel.js) can change parameters live.
(() => {
  const NS = 'http://www.w3.org/2000/svg';

  // ---- configuration (edit defaults here) -----------------------------------
  const DEFAULTS = {
    ring: {
      petals: 14,      // waves around the O
      weave: 46,       // number of lines
      spread: 16,      // wave amplitude (Loop Lab "Spread")
      wobble: .22,     // sideways sway of each wave
      speed: 25,       // Loop Lab "Motion"
      thickness: 61,   // band width of the O (source px; original logo = 61)
    },
    line: {
      wavelength: 38,  // px between waves along the line (38 ≈ same spacing as the O)
      weave: 46,
      spread: 16,
      wobble: .22,
      speed: 25,
      thickness: 61,   // band width of the curved line
    },
  };

  // ---- fixed geometry (source image px) -------------------------------------
  const O = { cx: 306, cy: 306, rMid: 84.5 };
  // Curved line centerline: M190,159.5 H407 A45.5 → 452.5,205 V346 A44.5 → 497,390.5 H544
  const SEGMENTS = [
    { type: 'line', x0: 190, y0: 159.5, x1: 407, y1: 159.5 },
    { type: 'arc', cx: 407, cy: 205, r: 45.5, a0: -Math.PI / 2, a1: 0 },
    { type: 'line', x0: 452.5, y0: 205, x1: 452.5, y1: 346 },
    { type: 'arc', cx: 497, cy: 346, r: 44.5, a0: Math.PI, a1: Math.PI / 2 },
    { type: 'line', x0: 497, y0: 390.5, x1: 544, y1: 390.5 },
  ];
  for (const s of SEGMENTS) {
    s.len = s.type === 'line' ? Math.hypot(s.x1 - s.x0, s.y1 - s.y0) : Math.abs(s.a1 - s.a0) * s.r;
  }
  const LINE_LEN = SEGMENTS.reduce((sum, s) => sum + s.len, 0);

  const params = JSON.parse(JSON.stringify(DEFAULTS));

  // Point + unit tangent on the centerline at arc length s (extrapolates past both ends).
  function centerline(s) {
    let rest = Math.max(0, Math.min(s, LINE_LEN));
    for (const seg of SEGMENTS) {
      if (rest <= seg.len || seg === SEGMENTS[SEGMENTS.length - 1]) {
        let x, y, tx, ty;
        if (seg.type === 'line') {
          tx = (seg.x1 - seg.x0) / seg.len; ty = (seg.y1 - seg.y0) / seg.len;
          x = seg.x0 + tx * rest; y = seg.y0 + ty * rest;
        } else {
          const dir = Math.sign(seg.a1 - seg.a0);
          const a = seg.a0 + dir * rest / seg.r;
          x = seg.cx + seg.r * Math.cos(a); y = seg.cy + seg.r * Math.sin(a);
          tx = -Math.sin(a) * dir; ty = Math.cos(a) * dir;
        }
        const over = s < 0 ? s : s > LINE_LEN ? s - LINE_LEN : 0;
        return { x: x + tx * over, y: y + ty * over, tx, ty };
      }
      rest -= seg.len;
    }
  }

  // Loop Lab radius band: base 165..193 ± spread*1.45 → mapped onto the band thickness.
  const band = (cfg) => {
    const amp = cfg.spread * 1.45;
    return { amp, lo: 165 - amp, hi: 193 + amp };
  };

  // ---- O: Loop Lab rosette, radius remapped into the ring -------------------
  function ringPath(cfg, layer, phase) {
    const { amp, lo, hi } = band(cfg);
    const rIn = O.rMid - cfg.thickness / 2;
    const count = 540;
    const offset = layer / cfg.weave;
    const base = 165 + offset * 28;
    const twist = offset * Math.PI * 2 + phase;
    const d = [];
    for (let i = 0; i <= count; i++) {
      const t = i / count * Math.PI * 2;
      const r0 = base + amp * Math.cos(cfg.petals * t + twist);
      const r = rIn + (r0 - lo) / (hi - lo) * cfg.thickness;
      const angle = t + cfg.wobble * Math.sin(cfg.petals * t - twist);
      d.push(`${i ? 'L' : 'M'}${(O.cx + r * Math.cos(angle)).toFixed(2)},${(O.cy + r * Math.sin(angle)).toFixed(2)}`);
    }
    return d.join('') + 'Z';
  }

  // ---- curved line: the same weave unrolled along the centerline ------------
  function linePath(cfg, layer, phase) {
    const { amp, lo, hi } = band(cfg);
    const k = 2 * Math.PI / cfg.wavelength;
    const sway = cfg.wobble * O.rMid * .5;
    // sample past both ends far enough to fill the round caps; the clip trims the rest
    const PAD = cfg.thickness / 2 + sway + 6;
    const offset = layer / cfg.weave;
    const base = 165 + offset * 28;
    const twist = offset * Math.PI * 2 + phase;
    const d = [];
    let first = true;
    for (let u = -PAD; u <= LINE_LEN + PAD; u += 1.2) {
      const s = u + sway * Math.sin(k * u - twist);
      const r0 = base + amp * Math.cos(k * u + twist);
      const n = (r0 - lo) / (hi - lo) * cfg.thickness - cfg.thickness / 2;
      const p = centerline(s);
      d.push(`${first ? 'M' : 'L'}${(p.x - p.ty * n).toFixed(2)},${(p.y + p.tx * n).toFixed(2)}`);
      first = false;
    }
    return d.join('');
  }

  // ---- clip shapes -----------------------------------------------------------
  const circle = (r) => `M${O.cx - r},${O.cy}a${r},${r} 0 1 0 ${2 * r},0a${r},${r} 0 1 0 ${-2 * r},0Z`;

  function lineOutline(half) {
    const left = [], right = [];
    for (let s = 0; s <= LINE_LEN; s += 1) {
      const p = centerline(s);
      left.push([p.x - p.ty * half, p.y + p.tx * half]);
      right.push([p.x + p.ty * half, p.y - p.tx * half]);
    }
    // Left edge forward → half-circle cap at the end → right edge back → half-circle cap at the start.
    const pt = ([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`;
    const cap = (to) => `A${half},${half} 0 0 0 ${pt(to)}`;
    right.reverse();
    return 'M' + pt(left[0]) + left.slice(1).map((p) => 'L' + pt(p)).join('')
      + cap(right[0]) + right.slice(1).map((p) => 'L' + pt(p)).join('')
      + cap(left[0]) + 'Z';
  }

  // ---- build + animate -------------------------------------------------------
  const svg = document.getElementById('logo');
  if (!svg) return;

  function updateClips() {
    const t = params.ring.thickness / 2;
    document.getElementById('clip-ring-shape').setAttribute('d', circle(O.rMid + t) + circle(Math.max(1, O.rMid - t)));
    document.getElementById('clip-line-shape').setAttribute('d', lineOutline(params.line.thickness / 2));
  }

  function build(groupId, cfg) {
    const group = document.getElementById(groupId);
    group.replaceChildren();
    const paths = [];
    for (let i = 0; i < cfg.weave; i++) {
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('class', `w${1 + Math.floor(i / cfg.weave * 3)}`);
      group.append(path);
      paths.push(path);
    }
    return paths;
  }

  const parts = [
    { key: 'ring', group: 'ring-lines', fn: ringPath, phase: 0, paths: [] },
    { key: 'line', group: 'line-lines', fn: linePath, phase: 0, paths: [] },
  ];

  function rebuild() {
    for (const part of parts) part.paths = build(part.group, params[part.key]);
    updateClips();
    draw();
  }

  function draw() {
    for (const part of parts) {
      const cfg = params[part.key];
      part.paths.forEach((path, i) => path.setAttribute('d', part.fn(cfg, i, part.phase)));
    }
  }

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame, last, paused = false;
  function animate(time) {
    if (last !== undefined && time - last < 32) { frame = requestAnimationFrame(animate); return; }
    const dt = last === undefined ? 0 : Math.min(time - last, 80);
    last = time;
    for (const part of parts) part.phase += dt / 1000 * params[part.key].speed / 150;
    draw();
    frame = requestAnimationFrame(animate);
  }
  function sync() {
    cancelAnimationFrame(frame);
    last = undefined;
    if (!paused && !reduced.matches && !document.hidden) frame = requestAnimationFrame(animate);
  }

  // Public API for panel.js
  window.Logo = {
    DEFAULTS,
    params,
    set(part, key, value) {
      params[part][key] = value;
      if (key === 'weave') rebuild();
      else if (key === 'thickness') { updateClips(); draw(); }
      else draw();
    },
    setAll(next) {
      for (const part of ['ring', 'line']) Object.assign(params[part], next[part] || {});
      rebuild();
    },
    pause(value) { paused = value; sync(); },
    get paused() { return paused; },
  };

  rebuild();
  sync();
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
})();
