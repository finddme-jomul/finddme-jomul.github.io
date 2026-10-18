// Exponential friction integrated over elapsed time, independent of refresh rate.
export function advanceCoast(velocity, elapsed) {
  const decay = Math.exp(-elapsed / 420);
  const next = velocity * decay;
  return { distance: velocity * 420 * (1 - decay), velocity: Math.abs(next) < .0001 ? 0 : next };
}
