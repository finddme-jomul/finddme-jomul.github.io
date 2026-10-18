import test from 'node:test';
import assert from 'node:assert/strict';
import { bindOrbitInput } from '../src/orbit-input.js';
function setup(kind = 'center') {
  class Surface extends EventTarget {
    classList = { add() {}, remove() {} };
    setPointerCapture() {} hasPointerCapture() { return false; }
  }
  const surface = new Surface(), deltas = [], states = [];
  const target = { closest(selector) {
    if (selector === 'button') return kind === 'center' || kind === 'button' ? this : null;
    if (selector === '.orbit-center') return kind === 'center' ? this : null;
    if (selector === 'input, select, textarea') return kind === 'input' ? this : null;
    return null;
  }};
  bindOrbitInput({ wheelTarget: surface, dragTarget: surface, enabled: () => true,
    dragButtonSelector: '.orbit-center', onDelta: d => deltas.push(d), onDragState: d => states.push(d) });
  function fire(type, x = 0, y = 0, detail = 1) {
    const event = new Event(type, { cancelable: true });
    for (const [key, value] of Object.entries({ target, clientX: x, clientY: y, pointerId: 1,
      pointerType: 'touch', button: 0, isPrimary: true, detail })) Object.defineProperty(event, key, { value });
    surface.dispatchEvent(event); return event;
  }
  return { fire, deltas, states };
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
  assert.deepEqual(s.deltas,[-.5]);s.fire('pointercancel');s.fire('pointermove',180,12);assert.equal(s.deltas.length,1);
});
test('unrelated buttons and form controls remain excluded', () => {
  for(const kind of ['button','input']) {const s=setup(kind);s.fire('pointerdown');s.fire('pointermove',90,0);assert.deepEqual(s.deltas,[]);}
});
