// Group exactly identical coating inputs, without quantizing height or colour.
// Float64 keeps the original arithmetic; conversion to Float32 happens only
// when copying the final result into the original vertex-colour buffer.
export function createCoatingColors(values, palettes, clay) {
  const lookup = new Map(), groups = [], indices = new Uint32Array(values.length);
  for (let i = 0; i < values.length; i++) {
    const p = palettes[i], level = values[i].level;
    const key = JSON.stringify([level, Boolean(p.first), Boolean(p.second), p.firstRGB, p.lastRGB]);
    let group = lookup.get(key);
    if (group === undefined) {
      group = groups.length;
      lookup.set(key, group);
      groups.push({level, ...p});
    }
    indices[i] = group * 3;
  }
  const colors = new Float64Array(groups.length * 3);
  return {
    groupCount: groups.length,
    vertexCount: values.length,
    update(target, baseReveal, accentReveal, baseP, accentP) {
      for (let i = 0; i < groups.length; i++) {
        const p = groups[i];
        const first = baseP > 0 && p.first ? baseReveal[p.level] : 0;
        const second = accentP > 0 && p.second ? accentReveal[p.level] : 0;
        const r = clay.r + (p.firstRGB[0] - clay.r) * first;
        const g = clay.g + (p.firstRGB[1] - clay.g) * first;
        const b = clay.b + (p.firstRGB[2] - clay.b) * first;
        const j = i * 3;
        colors[j] = r + (p.lastRGB[0] - r) * second;
        colors[j + 1] = g + (p.lastRGB[1] - g) * second;
        colors[j + 2] = b + (p.lastRGB[2] - b) * second;
      }
      for (let i = 0, j = 0; i < indices.length; i++, j += 3) {
        const k = indices[i];
        target[j] = colors[k]; target[j + 1] = colors[k + 1]; target[j + 2] = colors[k + 2];
      }
    }
  };
}
