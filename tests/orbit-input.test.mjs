import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceCoast } from '../src/orbit-motion.js';
import { bindOrbitInput } from '../src/orbit-input.js';
function setup(kind = 'center') {
  class Surface extends EventTarget {
    classList = { add() {}, remove() {} };
    setPointerCapture() {} hasPointerCapture() { return false; }
  }
  const surface = new Surface(), deltas = [], states = [], releases = [];
  const target = { closest(selector) {
    if (selector === 'button') return kind === 'center' || kind === 'button' ? this : null;
    if (selector === '.orbit-center') return kind === 'center' ? this : null;
    if (selector === 'input, select, textarea') return kind === 'input' ? this : null;
    return null;
  }};
  bindOrbitInput({ wheelTarget: surface, dragTarget: surface, enabled: () => true,
    dragButtonSelector: '.orbit-center', onDelta: d => deltas.push(d), onDragState: d => states.push(d), onRelease: v => releases.push(v) });
  let time = 0;
  function fire(type, x = 0, y = 0, detail = 1, elapsed = 16) {
    time += elapsed;
    const event = new Event(type, { cancelable: true });
    for (const [key, value] of Object.entries({ target, clientX: x, clientY: y, pointerId: 1,
      timeStamp: time, pointerType: 'touch', button: 0, isPrimary: true, detail })) Object.defineProperty(event, key, { value });
    surface.dispatchEvent(event); return event;
  }
  return { fire, deltas, states, releases };
}
test('center drag rotates and suppresses accidental click, but preserves keyboard click', () => {
  const s=setup();s.fire('pointerdown');s.fire('pointermove',90,0);s.fire('pointerup',90,0);
  assert.deepEqual(s.deltas,[-.5]);assert.deepEqual(s.states,[true,false]);
  assert.equal(s.fire('click').defaultPrevented,true);
  assert.equal(s.fire('click',0,0,0).defaultPrevented,false);
});
test('center tap remains clickable', () => {
  const s=setup();s.fire('pointerdown');s.fire('pointerup');assert.equal(s.fire('click').defaultPrevented,false);
});
test('initial vertical jitter does not lock out horizontal swipe', () => {
  const s=setup();s.fire('pointerdown');s.fire('pointermove',1,12);s.fire('pointermove',90,12);
  assert.equal(s.deltas.length,2);assert.ok(s.deltas[1]<-.4);s.fire('pointercancel');s.fire('pointermove',180,12);assert.equal(s.deltas.length,2);assert.equal(s.releases.at(-1),0);
});
test('unrelated buttons and form controls remain excluded', () => {
  for(const kind of ['button','input']) {const s=setup(kind);s.fire('pointerdown');s.fire('pointermove',90,0);assert.deepEqual(s.deltas,[]);}
});

test('fast release has more momentum than a slow swipe; held release stops', () => {
  function flick(dt, pause=0) { const s=setup();s.fire('pointerdown');s.fire('pointermove',30,0,1,dt);s.fire('pointermove',60,0,1,dt);s.fire('pointerup',60,0,1,pause);return s.releases[0]; }
  assert.ok(Math.abs(flick(16)) > Math.abs(flick(45)));
  assert.equal(flick(16,120),0);
});
test('vertical swipes and reversal produce corresponding release direction', () => {
  const s=setup();s.fire('pointerdown');s.fire('pointermove',0,40);s.fire('pointermove',0,80);s.fire('pointerup',0,80);
  assert.ok(s.releases[0]<0);
  const b=setup();b.fire('pointerdown');b.fire('pointermove',-50,0);b.fire('pointerup',-50,0);assert.ok(b.releases[0]>0);
});
test('coasting distance is refresh-rate independent and comes to rest', () => {
  const simulate = dt => {let v=.01,d=0;for(let t=0;t<1000;t+=dt){const n=advanceCoast(v,Math.min(dt,1000-t));v=n.velocity;d+=n.distance;}return d;};
  assert.ok(Math.abs(simulate(1000/60)-simulate(1000/120))<1e-9);
  let v=.02;for(let i=0;i<400;i++)v=advanceCoast(v,16).velocity;assert.equal(v,0);
});
