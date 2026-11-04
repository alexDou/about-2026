// Tuning panel — temporary. Delete panel.css + panel.js and their two tags in index.html when done.
(() => {
  const Logo = window.Logo;
  if (!Logo) return;
  const root = document.documentElement;
  const STORE = 'logo-tune-v1';

  const PALETTES = {
    Moonlight: ['#f2edf9', '#b5b5d1', '#7b7b9a'],
    Dusk: ['#b395f8', '#ef92bd', '#f9b880'],
    Tidal: ['#5ddccb', '#69baf7', '#ad9df8'],
    Citrus: ['#d6ec8c', '#fbc76b', '#fa9471'],
  };

  // Shape sliders (JS params)
  const SHAPE = {
    ring: [
      ['petals', 'Petals', 3, 40, 1],
      ['weave', 'Weave (lines)', 4, 100, 1],
      ['spread', 'Spread', 0, 90, 1],
      ['wobble', 'Wobble', 0, .8, .01],
      ['speed', 'Motion', 0, 100, 1],
      ['thickness', 'Width of O', 10, 160, 1],
    ],
    line: [
      ['wavelength', 'Wavelength (px)', 8, 160, 1],
      ['weave', 'Weave (lines)', 4, 100, 1],
      ['spread', 'Spread', 0, 90, 1],
      ['wobble', 'Wobble', 0, .8, .01],
      ['speed', 'Motion', 0, 100, 1],
      ['thickness', 'Width of line', 10, 88, 1],
    ],
  };

  // Style sliders (CSS vars)
  const STYLE = [
    ['--ring-width', 'O stroke width', .1, 3, .05, ''],
    ['--ring-opacity', 'O opacity', .05, 1, .01, ''],
    ['--line-width', 'Line stroke width', .1, 3, .05, ''],
    ['--line-opacity', 'Line opacity', .05, 1, .01, ''],
    ['--glow-opacity', 'Glow opacity', 0, 1, .01, ''],
    ['--logo-max', 'Max logo size', 200, 1000, 10, 'px'],
  ];
  const COLOR_VARS = ['--ring-1', '--ring-2', '--ring-3', '--line-1', '--line-2', '--line-3', '--page'];

  const blur = document.querySelector('#logo-glow feGaussianBlur');

  const css = {
    '--ring-width': .8, '--ring-opacity': .75, '--line-width': .8, '--line-opacity': .75,
    '--glow-opacity': .3, '--logo-max': 560,
    '--ring-1': PALETTES.Moonlight[0], '--ring-2': PALETTES.Moonlight[1], '--ring-3': PALETTES.Moonlight[2],
    '--line-1': PALETTES.Moonlight[0], '--line-2': PALETTES.Moonlight[1], '--line-3': PALETTES.Moonlight[2],
    '--page': '#16161f', glowBlur: 1.6,
  };
  const CSS_DEFAULTS = { ...css };

  // ---- DOM --------------------------------------------------------------------
  const el = (tag, props = {}, kids = []) => {
    const n = Object.assign(document.createElement(tag), props);
    n.append(...kids);
    return n;
  };
  const inputs = {}; // id -> {input, output, fmt}

  function slider(id, label, min, max, step, onInput, fmt = (v) => v) {
    const output = el('output');
    const input = el('input', { type: 'range', min, max, step });
    input.addEventListener('input', () => { const v = Number(input.value); output.value = fmt(v); onInput(v); save(); });
    inputs[id] = { input, output, fmt };
    return [el('label', {}, [label, output]), input];
  }

  const panel = el('aside', { className: 'tune', ariaLabel: 'Logo tuning' });
  const toggle = el('button', { className: 'tune-toggle', textContent: 'Tune' });
  toggle.addEventListener('click', () => { document.body.classList.toggle('tune-open'); save(); });

  for (const part of ['ring', 'line']) {
    panel.append(el('h2', { textContent: part === 'ring' ? 'O' : 'Curved line' }));
    for (const [key, label, min, max, step] of SHAPE[part]) {
      panel.append(...slider(`${part}.${key}`, label, min, max, step, (v) => Logo.set(part, key, v)));
    }
  }

  panel.append(el('h2', { textContent: 'Style' }));
  for (const [name, label, min, max, step, unit] of STYLE) {
    panel.append(...slider(name, label, min, max, step, (v) => { css[name] = v; applyCss(); }, (v) => v + unit));
  }
  panel.append(...slider('glowBlur', 'Glow blur', 0, 8, .1, (v) => { css.glowBlur = v; applyCss(); }));

  panel.append(el('h2', { textContent: 'Colors' }));
  const paletteRow = el('div', { className: 'row' });
  for (const [name, cols] of Object.entries(PALETTES)) {
    const b = el('button', { className: 'btn', textContent: name, title: `Apply ${name} to both parts` });
    b.addEventListener('click', () => { setPalette('ring', cols); setPalette('line', cols); });
    paletteRow.append(b);
  }
  panel.append(paletteRow);
  const colorInputs = {};
  for (const part of ['ring', 'line']) {
    const row = el('div', { className: 'row' }, [el('span', { textContent: part === 'ring' ? 'O' : 'Line' })]);
    for (let i = 1; i <= 3; i++) {
      const name = `--${part}-${i}`;
      const c = el('input', { type: 'color' });
      c.addEventListener('input', () => { css[name] = c.value; applyCss(); save(); });
      colorInputs[name] = c;
      row.append(c);
    }
    panel.append(row);
  }
  const bgInput = el('input', { type: 'color' });
  bgInput.addEventListener('input', () => { css['--page'] = bgInput.value; applyCss(); save(); });
  colorInputs['--page'] = bgInput;
  panel.append(el('div', { className: 'row' }, [el('span', { textContent: 'Page' }), bgInput]));

  const pauseBtn = el('button', { className: 'btn', textContent: 'Pause' });
  pauseBtn.addEventListener('click', () => { Logo.pause(!Logo.paused); pauseBtn.textContent = Logo.paused ? 'Play' : 'Pause'; });
  const resetBtn = el('button', { className: 'btn', textContent: 'Reset all' });
  resetBtn.addEventListener('click', () => { Logo.setAll(JSON.parse(JSON.stringify(Logo.DEFAULTS))); Object.assign(css, CSS_DEFAULTS); applyCss(); syncInputs(); save(); });
  const copyBtn = el('button', { className: 'btn primary', textContent: 'Copy settings' });
  const out = el('textarea', { readOnly: true, spellcheck: false });
  copyBtn.addEventListener('click', async () => {
    out.value = exportText();
    out.select();
    try { await navigator.clipboard.writeText(out.value); copyBtn.textContent = 'Copied ✓'; }
    catch { copyBtn.textContent = 'Select + copy below'; }
    setTimeout(() => (copyBtn.textContent = 'Copy settings'), 1800);
  });
  const randomBtn = el('button', { className: 'btn', textContent: 'Surprise me' });
  randomBtn.addEventListener('click', () => {
    const r = (a, b, step = 1) => Math.round((a + Math.random() * (b - a)) / step) * step;
    Logo.setAll({
      ring: { petals: r(5, 24), weave: r(16, 60), spread: r(5, 60), wobble: r(0, .4, .01) },
      line: { wavelength: r(20, 90), weave: r(16, 60), spread: r(5, 60), wobble: r(0, .4, .01) },
    });
    syncInputs(); save();
  });
  panel.append(
    el('div', { className: 'actions' }, [pauseBtn, randomBtn, resetBtn, copyBtn]),
    out,
    el('p', { className: 'hint', textContent: 'Settings persist in this browser. Copy settings → paste them to me and I bake them in as defaults.' }),
  );

  document.body.append(panel, toggle);

  // ---- state ------------------------------------------------------------------
  function setPalette(part, cols) {
    cols.forEach((c, i) => (css[`--${part}-${i + 1}`] = c));
    applyCss(); syncInputs(); save();
  }

  function applyCss() {
    for (const [k, v] of Object.entries(css)) {
      if (k.startsWith('--')) root.style.setProperty(k, k === '--logo-max' ? `${v}px` : String(v));
    }
    blur.setAttribute('stdDeviation', css.glowBlur);
  }

  function syncInputs() {
    for (const [id, { input, output, fmt }] of Object.entries(inputs)) {
      const [part, key] = id.split('.');
      const v = key !== undefined && Logo.params[part] ? Logo.params[part][key] : css[id];
      input.value = v;
      output.value = fmt(v);
    }
    for (const [name, c] of Object.entries(colorInputs)) c.value = css[name];
  }

  function exportText() {
    const fmt = (o) => JSON.stringify(o).replace(/"(\w+)":/g, '$1: ').replace(/,/g, ', ');
    const cssLines = Object.entries(css).filter(([k]) => k.startsWith('--'))
      .map(([k, v]) => `  ${k}: ${k === '--logo-max' ? v + 'px' : v};`).join('\n');
    return `// logo.js DEFAULTS\nring: ${fmt(Logo.params.ring)},\nline: ${fmt(Logo.params.line)},\n\n/* logo.css :root */\n${cssLines}\n/* glow stdDeviation */ ${css.glowBlur}`;
  }

  function save() {
    try {
      localStorage.setItem(STORE, JSON.stringify({ params: Logo.params, css, open: document.body.classList.contains('tune-open') }));
    } catch {}
  }

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE));
      if (!saved) return true;
      Logo.setAll(saved.params);
      Object.assign(css, saved.css);
      return saved.open;
    } catch { return true; }
  }

  const open = load();
  document.body.classList.toggle('tune-open', open !== false);
  applyCss();
  syncInputs();
  addEventListener('keydown', (e) => { if (e.key === 't' && !/input|textarea/i.test(e.target.tagName)) toggle.click(); });
})();
