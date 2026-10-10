import './style.css';
import { projects } from './projects.js';
import { bindOrbitInput } from './orbit-input.js';
import { mountAsciiCenter } from './ascii-center.js';
import { getCssOrbitLayout } from './css-orbit-layout.js';

const $ = (selector) => document.querySelector(selector);
const section = $('.gallery-section');
const stage = $('.orbit-stage');
const asciiCenter = mountAsciiCenter($('.orbit-center'));
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
let grid = motion.matches;
let angle = 0;
let target = 0;
let raf = 0;
let lastFocus;
const count = projects.length;
let layoutKey;
let layout;
const cards = projects.map((project, index) => {
  const link = document.createElement('a');
  link.className = 'work-card';
  link.href = `#project/${project.id}`;
  link.style.setProperty('--tone', project.tone);
  link.setAttribute('aria-label', `${project.title}, 임시 형태 스터디 보기`);
  link.style.setProperty('--tile-image', `url("${project.image}")`);
  link.innerHTML = `<span class="tile-edge edge-one" aria-hidden="true"></span><span class="tile-edge edge-two" aria-hidden="true"></span><span class="tile-edge edge-three" aria-hidden="true"></span><div class="sheet-art"><span class="sun-spark" aria-hidden="true"></span><img src="${project.image}" alt="${project.name} 도자기 형태의 3D 렌더" width="512" height="640"></div><span class="tile-back" aria-hidden="true"><span class="sun-spark"></span></span>`;
  link.addEventListener('focus', () => {
    if (!grid) {
      const nearest = target + ((((index - target) % count) + count + count / 2) % count - count / 2);
      target = nearest;
      updateTarget();
    }
  });
  $('#cards').append(link);
  return link;
});
// Decorative light catchers share the ring's world coordinates, below the cards.
const lightPatches = cards.map(() => {
  const light = document.createElement('span');
  light.className = 'floor-light';
  light.setAttribute('aria-hidden', 'true');
  $('#cards').prepend(light);
  return light;
});
function updateTarget() {
  if (!raf) raf = requestAnimationFrame(render);
}
function render() {
  raf = 0;
  // Rebase both together so long sessions retain floating-point precision.
  if (Math.abs(angle) > count * 100) {
    const turns = Math.trunc(angle / count) * count;
    angle -= turns;
    target -= turns;
  }
  angle += (target - angle) * (motion.matches ? 1 : 0.12);
  // A shared tilted 3D space handles projection and occlusion for every tile.
  const key = `${count}:${stage.clientWidth}:${stage.clientHeight}:${innerHeight}:${innerWidth}`;
  if (layoutKey !== key) {
    layoutKey = key;
    layout = getCssOrbitLayout({count, width: stage.clientWidth, height: innerHeight, stageHeight: stage.clientHeight, headerHeight: innerWidth <= 700 ? 70 : 88, perspective: innerWidth <= 700 ? 950 : 1500});
  }
  const { radius, size, fit, centerSize } = layout;
  section.style.setProperty('--orbit-fit', fit);
  section.style.setProperty('--center-size', `${centerSize}px`);
  section.dataset.orbitRadius = radius.toFixed(2);
  section.dataset.orbitFit = fit.toFixed(4);
  section.style.setProperty('--tile-size', `${size}px`);
  if (!grid) asciiCenter.render(-angle * Math.PI * 2 / count, centerSize);
  const index = ((Math.round(angle) % count) + count) % count;
  cards.forEach((card, i) => {
    const theta = (i - angle) * Math.PI * 2 / count + Math.PI / 6;
    const x = Math.sin(theta) * radius;
    const z = Math.cos(theta) * radius;
    // Radial planes: tiles turn edge-on at the front/back of the ring.
    const yaw = theta * 180 / Math.PI + 90;
    // A nearly edge-on card otherwise reads as a pole through the centerpiece.
    const edgeT = grid ? 1 : Math.max(0, Math.min(1, (Math.abs(Math.sin(theta)) - .10) / .14));
    card.style.setProperty('--edge-on-visibility', edgeT * edgeT * (3 - 2 * edgeT));
    card.style.transform = grid ? '' : `translate(-50%, -50%) translate3d(${x}px, 0, ${z}px) rotateY(${yaw}deg)`;
    // World-space upper-left light; transform it into each face's local frame.
    // This is a restrained CSS reflection approximation, not optical ray tracing.
    const rotation = grid ? 0 : theta + Math.PI / 2;
    const tilt = grid ? 0 : -20 * Math.PI / 180;
    const lightX = -0.5;
    const localZ = 0.65 * Math.sin(tilt) + 0.57 * Math.cos(tilt);
    const facing = lightX * Math.sin(rotation) + localZ * Math.cos(rotation);
    const across = lightX * Math.cos(rotation) - localZ * Math.sin(rotation);
    card.style.setProperty('--glint-x', `${50 + across * 38}%`);
    card.style.setProperty('--back-glint-x', `${50 - across * 38}%`);
    card.style.setProperty('--front-light', (0.16 + Math.max(0, facing) * 0.55).toFixed(3));
    card.style.setProperty('--back-light', (0.16 + Math.max(0, -facing) * 0.55).toFixed(3));
    // Narrow specular peak: brief glints as a face passes the light/view half-vector.
    const specular = Math.pow(Math.abs(Math.cos(rotation + 0.4)), 24);
    card.style.setProperty('--spark', (0.04 + specular * 0.96).toFixed(3));
    card.style.setProperty('--spark-x', `${30 + across * 24}%`);
    const patch = lightPatches[i];
    patch.style.width = `${size * (0.85 + Math.abs(facing) * 0.65)}px`;
    patch.style.height = `${size * 0.78}px`;
    patch.style.transform = `translate(-50%, -50%) translate3d(${x + size * 0.48}px, ${size * 0.78}px, ${z + size * 0.22}px) rotateX(90deg) rotateZ(${Math.sin(theta) * 30}deg)`;
    patch.style.opacity = (0.35 + Math.abs(facing) * 0.5).toFixed(3);
    card.classList.toggle('is-active', i === index);
  });
  if (Math.abs(target - angle) > 0.001) raf = requestAnimationFrame(render);
}
function setView(value) {
  grid = value;
  document.documentElement.classList.toggle('orbit-mode', !grid);
  window.scrollTo({ top: 0, behavior: 'instant' });
  section.classList.toggle('is-grid', grid);
  $('#orbit-view').setAttribute('aria-pressed', String(!grid));
  $('#grid-view').setAttribute('aria-pressed', String(grid));
  updateTarget();
}
$('#orbit-view').addEventListener('click', () => setView(false));
$('#grid-view').addEventListener('click', () => setView(true));
function step(delta) { target += delta; updateTarget(); }
$('#previous').addEventListener('click', () => step(-1));
$('#next').addEventListener('click', () => step(1));
stage.addEventListener('keydown', (event) => {
  if (!grid && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.preventDefault();
    step(event.key === 'ArrowRight' ? 1 : -1);
    cards[((Math.round(target) % count) + count) % count].focus({ preventScroll: true });
  }
});
bindOrbitInput({
  wheelTarget: section,
  dragTarget: stage,
  enabled: () => !grid && !$('#project-dialog').open,
  onDelta: step,
});
window.addEventListener('resize', updateTarget);
motion.addEventListener('change', () => setView(motion.matches));
const dialog = $('#project-dialog');
function syncProject() {
  const project = projects.find((item) => location.hash === `#project/${item.id}`);
  if (!project) {
    if (dialog.open) dialog.close();
    return;
  }
  $('#project-title').textContent = project.title;
  $('#project-description').textContent = project.description;
  $('#project-image').src = project.image;
  $('#project-image').alt = `${project.name} 임시 기물 렌더`;
  $('.project-image').style.background = project.tone;
  if (!dialog.open) { lastFocus = document.activeElement; dialog.showModal(); }
  document.body.classList.add('modal-open');
}
function closeProject() {
  history.replaceState(null, '', location.pathname + location.search);
  dialog.close();
}
$('.close').addEventListener('click', closeProject);
dialog.addEventListener('cancel', (event) => { event.preventDefault(); closeProject(); });
dialog.addEventListener('click', (event) => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeProject(); } });
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); lastFocus?.focus({ preventScroll: true }); });
window.addEventListener('hashchange', syncProject);
setView(grid);
syncProject();
