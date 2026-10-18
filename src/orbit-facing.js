// Front-half cards open toward the viewer; the rear keeps the radial arrangement.
// Equivalent 180-degree planes let both sides of the ring open symmetrically.
export function orbitFacing(theta) {
  const position = Math.atan2(Math.sin(theta), Math.cos(theta));
  const radial = position + (position < 0 ? Math.PI / 2 : -Math.PI / 2);
  const depth = Math.max(0, Math.cos(position));
  // Half-strength opening, with a narrow smooth handover at the front centre.
  // Keep the centre continuous instead of snapping between equivalent faces.
  const frontHandover = Math.exp(-Math.pow(position / .22, 2));
  const openness = depth * depth * (3 - 2 * depth) * (.5 + .5 * frontHandover);
  const fan = -position * .3;
  return radial * (1 - openness) + fan * openness;
}
