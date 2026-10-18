import './style.css';
import { projects } from './projects/index.js';
import { bindOrbitInput } from './orbit-input.js';
import { mountAsciiCenter } from './ascii-center.js';
import { advanceCoast } from './orbit-motion.js';
import { getCssOrbitLayout } from './css-orbit-layout.js';

const $ = (selector) => document.querySelector(selector);
const section = $('.gallery-section');
const stage = $('.orbit-stage');
const asciiButton = $('.orbit-center');
const asciiCenter = mountAsciiCenter(asciiButton);
asciiButton.addEventListener('click', () => {
  const colorized = asciiButton.classList.toggle('is-colorized');
  asciiButton.setAttribute('aria-pressed', String(colorized));
  asciiButton.setAttribute('aria-label', colorized ? '석류 ASCII 흑백으로 보기' : '석류 ASCII 색상 보기');
  if (layout) asciiCenter.render(-angle * Math.PI * 2 / count, layout.centerSize);
});
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
let grid = motion.matches;
let angle = 0;
let target = 0;
let raf = 0;
let previousFrame = 0;
let dragging = false;
let velocity = 0;
const orbitProjects = projects.slice(0, 12);
const count = orbitProjects.length;
const mobileComposition = import.meta.env.DEV && new URLSearchParams(location.search).get('orbit-preview') === 'immersive'
  ? 'immersive'
  : 'balanced';
let layoutKey;
let layout;
const cards = orbitProjects.map((project, index) => {
  const link = document.createElement('a');
  link.className = 'work-card';
  link.href = project.href;
  link.style.setProperty('--tone', project.tone);
  link.setAttribute('aria-label', `${project.title} 프로젝트 보기`);
  link.style.setProperty('--tile-image', `url("${project.cover}")`);
  link.innerHTML = `<span class="tile-edge edge-one" aria-hidden="true"></span><span class="tile-edge edge-two" aria-hidden="true"></span><span class="tile-edge edge-three" aria-hidden="true"></span><div class="sheet-art"><span class="sun-spark" aria-hidden="true"></span><img src="${project.cover}" alt="${project.coverAlt || project.assets?.photo?.[0]?.alt || `${project.title} 대표 이미지`}" width="512" height="640"></div><span class="tile-back" aria-hidden="true"><span class="sun-spark"></span></span>`;
  link.addEventListener('focus', () => {
    if (!grid && link.matches(':focus-visible')) {
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
function render(now) {
  raf = 0;
  const elapsed = previousFrame ? Math.min(64, now - previousFrame) : 1000 / 60;
  previousFrame = now;
  const mobile = innerWidth <= 700;
  if (velocity && !dragging && !grid && !motion.matches) {
    const coast = advanceCoast(velocity, elapsed);
    target += coast.distance;
    angle = target;
    velocity = coast.velocity;
  }
  // Rebase both together so long sessions retain floating-point precision.
  if (Math.abs(angle) > count * 100) {
    const turns = Math.trunc(angle / count) * count;
    angle -= turns;
    target -= turns;
  }
  angle += (target - angle) * (motion.matches || dragging ? 1 : 1 - Math.exp(-elapsed / 130));
  // A shared tilted 3D space handles projection and occlusion for every tile.
  const key = `${count}:${stage.clientWidth}:${stage.clientHeight}:${innerHeight}:${innerWidth}`;
  if (layoutKey !== key) {
    layoutKey = key;
    layout = getCssOrbitLayout({count, width: stage.clientWidth, height: innerHeight, stageHeight: stage.clientHeight, headerHeight: innerWidth <= 700 ? 110 : 150, perspective: innerWidth <= 700 ? 950 : 1500, mobileComposition});
    const { size, fit, centerSize } = layout;
    section.style.setProperty('--orbit-fit', fit);
    section.style.setProperty('--center-size', `${centerSize}px`);
    section.dataset.orbitRadius = layout.radius.toFixed(2);
    section.dataset.orbitFit = fit.toFixed(4);
    section.style.setProperty('--tile-size', `${size}px`);
  }
  const { radius, size, centerSize } = layout;
  if (!grid) asciiCenter.render(-angle * Math.PI * 2 / count, centerSize);
  const index = ((Math.round(angle) % count) + count) % count;
  cards.forEach((card, i) => {
    const theta = (i - angle) * Math.PI * 2 / count + Math.PI / 6;
    const x = Math.sin(theta) * radius;
    const z = Math.cos(theta) * radius;
    // Radial planes: tiles turn edge-on at the front/back of the ring.
    const yaw = theta * 180 / Math.PI + 90;
    // A nearly edge-on card otherwise reads as a pole through the centerpiece.
    const edgeT = grid ? 1 : Math.max(0, Math.min(1, (Math.abs(Math.sin(theta)) - (mobile ? .02 : .10)) / (mobile ? .30 : .14)));
    card.style.setProperty('--edge-on-visibility', edgeT * edgeT * (3 - 2 * edgeT));
    // Fully edge-on cards are invisible but could still intercept the centre button.
    card.style.pointerEvents = !grid && edgeT < .05 ? 'none' : '';
    card.style.transform = grid ? '' : `translate(-50%, -50%) translate3d(${x}px, 0, ${z}px) rotateY(${yaw}deg)`;
    // World-space upper-left light; transform it into each face's local frame.
    // This is a restrained CSS reflection approximation, not optical ray tracing.
    const rotation = grid ? 0 : theta + Math.PI / 2;
    const tilt = grid ? 0 : -20 * Math.PI / 180;
    const lightX = -0.5;
    const localZ = 0.65 * Math.sin(tilt) + 0.57 * Math.cos(tilt);
    const facing = lightX * Math.sin(rotation) + localZ * Math.cos(rotation);
    const across = lightX * Math.cos(rotation) - localZ * Math.sin(rotation);
    if (!mobile) {
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
    }
    card.classList.toggle('is-active', i === index);
  });
  if (velocity || Math.abs(target - angle) > 0.001) raf = requestAnimationFrame(render);
  else previousFrame = 0;
}
function setView(value) {
  velocity = 0;
  grid = value;
  document.documentElement.classList.toggle('orbit-mode', !grid);
  window.scrollTo({ top: 0, behavior: 'instant' });
  section.classList.toggle('is-grid', grid);
  updateTarget();
}
function step(delta) { velocity = 0; target += delta; updateTarget(); }
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
  enabled: () => !grid,
  onDelta: step,
  dragButtonSelector: ".orbit-center",
  pixelsPerStep: 120,
  onGrab: () => {
    const moving = Math.abs(velocity) > .0001;
    velocity = 0; target = angle;
    return moving;
  },
  onRelease: speed => {
    // Units are cards/ms; cap extreme event spikes while allowing a long flick.
    velocity = motion.matches ? 0 : Math.max(-.025, Math.min(.025, speed));
    if (Math.abs(velocity) < .0003) velocity = 0;
    updateTarget();
  },
  onDragState: value => { dragging = value; },
});
window.addEventListener('resize', updateTarget);
motion.addEventListener('change', () => setView(motion.matches));
// Preserve old bookmarked hash URLs while using full-page navigation.
const legacy = projects.find(project => location.hash === `#project/${project.id}`);
if (legacy) location.replace(legacy.href);
setView(grid);
