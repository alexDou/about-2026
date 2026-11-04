const $ = (selector) => document.querySelector(selector);
const NS = 'http://www.w3.org/2000/svg';
const palettes = {
  dusk: { name: 'Dusk', colors: ['#b395f8', '#ef92bd', '#f9b880'] },
  tidal: { name: 'Tidal', colors: ['#5ddccb', '#69baf7', '#ad9df8'] },
  citrus: { name: 'Citrus', colors: ['#d6ec8c', '#fbc76b', '#fa9471'] },
  mono: { name: 'Moonlight', colors: ['#f2edf9', '#b5b5d1', '#7b7b9a'] },
};
const presets = {
  afterglow: { name: 'Afterglow', petals: 7, weave: 32, spread: 65, palette: 'dusk' },
  orbit: { name: 'Orbit', petals: 3, weave: 24, spread: 85, palette: 'tidal' },
  bloom: { name: 'Bloom', petals: 12, weave: 44, spread: 40, palette: 'citrus' },
  ripple: { name: 'Ripple', petals: 5, weave: 48, spread: 20, palette: 'mono' },
};
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const state = { ...presets.afterglow, speed: 25, paused: reducedMotion.matches, experiment: 1, phase: 0 };
let paths = [];
let frame;
let lastTime;
let toastTimer;

function pathData(layer, phase) {
  const d = [];
  const count = 540;
  const offset = layer / state.weave;
  const base = 165 + offset * 28;
  const amplitude = state.spread * 1.45;
  const twist = offset * Math.PI * 2 + phase;
  for (let i = 0; i <= count; i++) {
    const t = i / count * Math.PI * 2;
    const r = base + amplitude * Math.cos(state.petals * t + twist);
    const angle = t + .22 * Math.sin(state.petals * t - twist);
    d.push(`${i ? 'L' : 'M'}${(r * Math.cos(angle)).toFixed(2)},${(r * Math.sin(angle)).toFixed(2)}`);
  }
  return `${d.join(' ')} Z`;
}

function draw() {
  for (let i = 0; i < paths.length; i++) {
    const d = pathData(i, state.phase);
    paths[i][0].setAttribute('d', d);
    paths[i][1].setAttribute('d', d);
  }
}

function rebuild() {
  $('#lines').replaceChildren();
  $('#glow-lines').replaceChildren();
  paths = [];
  const colors = palettes[state.palette].colors;
  for (let i = 0; i < state.weave; i++) {
    const pair = [];
    for (const group of ['#lines', '#glow-lines']) {
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('stroke', colors[Math.floor(i / state.weave * colors.length)]);
      path.setAttribute('opacity', '.75');
      $(group).append(path);
      pair.push(path);
    }
    paths.push(pair);
  }
  draw();
}

function syncControls() {
  for (const key of ['petals', 'weave', 'spread', 'speed']) {
    const input = $(`#${key}`);
    input.value = state[key];
    input.style.setProperty('--progress', `${(state[key] - Number(input.min)) / (Number(input.max) - Number(input.min)) * 100}%`);
    $(`#${key}-value`).value = key === 'speed' ? (state.speed === 0 ? 'Still' : state.speed < 35 ? 'Slow' : state.speed < 70 ? 'Easy' : 'Fast') : state[key];
  }
  document.querySelectorAll('[data-palette]').forEach(button => {
    const selected = button.dataset.palette === state.palette;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  $('#palette-name').textContent = palettes[state.palette].name;
  $('#drawing-name').textContent = state.name;
  $('#experiment-number').textContent = String(state.experiment).padStart(3, '0');
  syncMotion();
}

function syncMotion() {
  const still = state.paused || state.speed === 0;
  $('.stage').classList.toggle('paused', still);
  $('#motion-status').textContent = still ? 'Still life' : 'In motion';
  $('#pause').setAttribute('aria-pressed', String(state.paused));
  $('#pause-text').textContent = state.paused ? 'Resume motion' : 'Pause motion';
  $('#pause-icon').textContent = state.paused ? '▷' : 'Ⅱ';
  cancelAnimationFrame(frame);
  lastTime = undefined;
  if (!still && !document.hidden) frame = requestAnimationFrame(animate);
}

function animate(time) {
  if (lastTime !== undefined && time - lastTime < 32) {
    frame = requestAnimationFrame(animate);
    return;
  }
  const delta = lastTime === undefined ? 0 : Math.min(time - lastTime, 80);
  lastTime = time;
  state.phase += delta / 1000 * state.speed / 150;
  draw();
  frame = requestAnimationFrame(animate);
}

function clearPreset() {
  document.querySelectorAll('[data-preset]').forEach(button => {
    button.classList.remove('active');
    button.setAttribute('aria-pressed', 'false');
  });
}

document.querySelectorAll('[data-preset]').forEach(button => button.addEventListener('click', () => {
  Object.assign(state, presets[button.dataset.preset], { phase: 0 });
  clearPreset();
  button.classList.add('active');
  button.setAttribute('aria-pressed', 'true');
  syncControls();
  rebuild();
}));

for (const key of ['petals', 'weave', 'spread', 'speed']) {
  $(`#${key}`).addEventListener('input', event => {
    state[key] = Number(event.target.value);
    if (key !== 'speed') { clearPreset(); state.name = 'Your happy accident'; }
    syncControls();
    rebuild();
  });
}

document.querySelectorAll('[data-palette]').forEach(button => button.addEventListener('click', () => {
  state.palette = button.dataset.palette;
  clearPreset();
  syncControls();
  rebuild();
}));

$('#pause').addEventListener('click', () => { state.paused = !state.paused; syncMotion(); });
$('#shuffle').addEventListener('click', () => {
  state.petals = 3 + Math.floor(Math.random() * 16);
  state.weave = 16 + Math.floor(Math.random() * 40);
  state.spread = 20 + Math.floor(Math.random() * 71);
  state.palette = Object.keys(palettes)[Math.floor(Math.random() * 4)];
  state.name = 'Your happy accident';
  state.experiment++;
  state.phase = 0;
  clearPreset();
  syncControls();
  rebuild();
});

$('#export').addEventListener('click', () => {
  const svg = $('#drawing').cloneNode(true);
  svg.setAttribute('xmlns', NS);
  svg.setAttribute('width', '1200');
  svg.setAttribute('height', '1200');
  svg.removeAttribute('id');
  const background = document.createElementNS(NS, 'rect');
  for (const [name, value] of Object.entries({ x: -400, y: -400, width: 800, height: 800, fill: '#111118' })) background.setAttribute(name, value);
  svg.insertBefore(background, svg.firstChild);
  svg.querySelectorAll('path').forEach(path => {
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', '.8');
    path.setAttribute('stroke-linejoin', 'round');
  });
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `loop-lab-${String(state.experiment).padStart(3, '0')}.svg`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  $('#toast').textContent = 'Your loop, ready to keep.';
  $('#toast').classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 2600);
});

document.addEventListener('visibilitychange', syncMotion);
reducedMotion.addEventListener('change', event => { state.paused = event.matches; syncMotion(); });
syncControls();
rebuild();

