import source from './assets/orbit-ascii.txt?raw';
import palette from './assets/orbit-ascii-colors.json';

const VIEW_TILT = -.18;
const CAMERA_DISTANCE = 300;
// The full and compact text layouts occupy nearly the same square frame.
// Keep the 3D glyph positions in that frame at every angle; only the natural
// horizontal silhouette should narrow as the fruit turns.
const GLYPH_FRAME_HEIGHT = 91.6;
const GLYPH_X_SCALE = 1.24;
// Preserve source luminance, with one soft highlight beneath the crown.
const luminance = hex => {
  const value = Number.parseInt(hex.slice(1), 16);
  return .2126 * (value >> 16) + .7152 * ((value >> 8) & 255) + .0722 * (value & 255);
};
const crownHighlight = (x, y) => Math.max(0, 1 - ((x - 71) / 11) ** 2 - ((y - 17.5) / 6.5) ** 2);
const grayscale = hex => Math.round(28 + luminance(hex) * .78);
const frontMonochrome = (hex, x, y) => Math.round(luminance(hex) * .5 + 65 * crownHighlight(x, y));
export function mountAsciiCenter(element) {
  const text = source.replace(/\r\n/g, '\n');
  const rows = text.split('\n');
  element.style.setProperty('--ascii-columns', palette.columns);
  element.style.setProperty('--ascii-compact-columns', Math.ceil(palette.columns / 2));
  const makePre = (step, className) => {
    const pre = document.createElement('pre');
    pre.className = className;
    pre.setAttribute('aria-hidden', 'true');
    const renderRows = [];
    for (let y = 0; y < rows.length; y += step) {
      const cells = [];
      for (let x = 0; x < palette.columns; x += step) {
        const candidates = [];
        for (let dy = 0; dy < step; dy++) for (let dx = 0; dx < step; dx++) {
          const character = rows[y + dy]?.[x + dx];
          if (character?.trim()) candidates.push({character, color: palette.colors[y + dy]?.[x + dx], x: x + dx, y: y + dy});
        }
        cells.push(candidates[0] || {character: ' ', color: null});
      }
      renderRows.push(cells);
    }
    renderRows.forEach((cells, y) => {
      let run = '', color, mono;
      const flush = () => {
        if (!run) return;
        if (!color) pre.append(document.createTextNode(run));
        else {
          const span = document.createElement('span');
          span.style.color = color;
          span.style.setProperty('--ascii-mono', `rgb(${mono} ${mono} ${mono})`);
          span.textContent = run;
          pre.append(span);
        }
        run = '';
      };
      cells.forEach(({character, color: nextColor, x, y}) => {
        const nextMono = nextColor ? frontMonochrome(nextColor, x, y) : null;
        if (nextColor !== color || nextMono !== mono) { flush(); color = nextColor; mono = nextMono; }
        run += character;
      });
      flush();
      if (y < renderRows.length - 1) pre.append(document.createTextNode('\n'));
    });
    return pre;
  };
  const pre = makePre(1, 'ascii-source');
  const compactPre = makePre(2, 'ascii-compact');
  element.replaceChildren(pre, compactPre);
  // Build one continuous depth field from the actual cutout. Empty areas remain
  // empty, including finger occlusion. Narrow crown regions naturally stay shallow.
  const width = palette.columns, height = palette.rows;
  const occupied = (x, y) => Boolean(rows[y]?.[x]?.trim());
  const boundary = [];
  for (let y = -1; y <= height; y++) for (let x = -1; x <= width; x++) {
    if (!occupied(x, y) && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => occupied(x + dx, y + dy))) {
      boundary.push([x, y / .6]);
    }
  }
  const distances = Array.from({length: height}, () => Array(width).fill(0));
  let maxDistance = 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (!occupied(x, y)) continue;
    let squared = Infinity;
    for (const [bx, by] of boundary) squared = Math.min(squared, (x - bx) ** 2 + (y / .6 - by) ** 2);
    const distance = Math.max(0, Math.sqrt(squared) - 1);
    distances[y][x] = distance;
    maxDistance = Math.max(maxDistance, distance);
  }
  const field = distances.map((row, y) => row.map(d => {
    // Occluded lower lobes keep their original outline but need their own volume.
    // Zero depth remains zero, so no pixels are added to the cutout.
    const t = Math.max(0, Math.min(1, (y - 28) / 12));
    const lowerVolume = 1 + .4 * t * t * (3 - 2 * t);
    return lowerVolume * 1.12 * Math.sqrt(Math.max(0, 2 * maxDistance * d - d * d));
  }));
  const depthAt = (x, y) => {
    const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
    const read = (a, b) => field[b]?.[a] || 0;
    return (read(ix, iy) * (1 - fx) + read(ix + 1, iy) * fx) * (1 - fy)
      + (read(ix, iy + 1) * (1 - fx) + read(ix + 1, iy + 1) * fx) * fy;
  };
  const points = [];
  const noise = seed => { const n = Math.sin(seed * 12.9898) * 43758.5453; return n - Math.floor(n); };
  rows.forEach((row, rowIndex) => {
    const columns = [...row].flatMap((c, i) => c.trim() ? [i] : []);
    if (!columns.length) return;
    const middle = (columns[0] + columns.at(-1)) / 2;
    const radius = (columns.at(-1) - columns[0] + 1) / 2;
    for (const column of columns) {
      const color = palette.colors[rowIndex]?.[column] || '#ff7c50';
      const gray = grayscale(color);
      // Surface-fixed staggered samples, rather than latitude rings. They rotate
      // with the fruit and never acquire a fresh random offset during animation.
      for (let sample = 0; sample < 4; sample++) {
        const seed = (rowIndex * width + column) * 4 + sample;
        const x = column + (sample % 2 - .5) * .5 + (noise(seed + 1) - .5) * .4;
        const y = rowIndex + (Math.floor(sample / 2) - .5) * .5 + (noise(seed + 619) - .5) * .4;
        const depth = depthAt(x, y);
        const dx = (depthAt(x + .4, y) - depthAt(x - .4, y)) / .8;
        const dy = (depthAt(x, y + .24) - depthAt(x, y - .24)) / .8;
        for (const side of [1, -1]) {
          const originalX = x - (width - 1) / 2;
          const originalY = (y - (height - 1) / 2) / .6;
          // Retain the established front projection while changing depth only.
          const u = Math.max(-1, Math.min(1, (x - middle) / radius));
          const seamT = Math.min(1, depth / 6);
          const seamBlend = seamT * seamT * (3 - 2 * seamT);
          // Front/back rays must meet at the SAME boundary, not two offset edges.
          const originalZ = radius * .72 * Math.sqrt(1 - u * u) * side * seamBlend;
          const ct = Math.cos(VIEW_TILT), st = Math.sin(VIEW_TILT);
          const cameraY = originalY * ct - originalZ * st;
          const cameraZ = originalY * st + originalZ * ct;
          const expandedZ = originalY * st + depth * side * ct;
          const scale = (CAMERA_DISTANCE - expandedZ) / (CAMERA_DISTANCE - cameraZ);
          const length = Math.hypot(dx, dy, 1);
          points.push({
            x: originalX * scale,
            y: cameraY * scale * ct + expandedZ * st,
            z: -cameraY * scale * st + expandedZ * ct,
            nx: -dx / length, ny: -dy / length, nz: side / length,
            offsetY: 0, character: row[column], color, gray, crown: crownHighlight(column, rowIndex),
          });
        }
      }
    }
  });
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  const context = canvas.getContext('2d');
  if (!context) return { render() {} };
  element.append(canvas);
  element.classList.add('has-ascii-volume');
  let previousAngle, previousSize, previousDpr, previousColorized;
  return {
    render(angle, size) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const colorized = element.classList.contains('is-colorized');
      if (angle === previousAngle && size === previousSize && dpr === previousDpr && colorized === previousColorized) return;
      previousAngle = angle; previousSize = size; previousDpr = dpr; previousColorized = colorized;
      // At the original front view, show the exact source characters rather than
      // the staggered 3D surface samples. Blend into the volume as it turns.
      const frontAngle = Math.abs(Math.atan2(Math.sin(angle), Math.cos(angle)));
      const frontWeight = Math.pow(Math.max(0, 1 - frontAngle / (Math.PI / 6)), 1.5);
      pre.style.opacity = String(frontWeight);
      compactPre.style.opacity = String(frontWeight);
      canvas.style.opacity = String(1 - frontWeight);
      const pixels = Math.max(1, Math.round(size * dpr));
      if (canvas.width !== pixels || canvas.height !== pixels) { canvas.width = pixels; canvas.height = pixels; }
      context.setTransform(pixels / 100, 0, 0, pixels / 100, 0, 0);
      context.clearRect(0, 0, 100, 100);
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      const cosine = Math.cos(angle), sine = Math.sin(angle);
      const ct = Math.cos(VIEW_TILT), st = Math.sin(VIEW_TILT);
      const visible = [];
      for (const point of points) {
        const x = point.x * cosine + point.z * sine;
        const z = -point.x * sine + point.z * cosine;
        const normalX = point.nx * cosine + point.nz * sine;
        const rotatedNormalZ = -point.nx * sine + point.nz * cosine;
        const normalY = point.ny * ct - rotatedNormalZ * st;
        const normalZ = point.ny * st + rotatedNormalZ * ct;
        if (normalZ < .04) continue;
        const y = point.y * ct - z * st;
        const cameraZ = point.y * st + z * ct;
        const perspective = CAMERA_DISTANCE / (CAMERA_DISTANCE - cameraZ);
        visible.push({point, x, y, z: cameraZ, perspective, normalX, normalY, normalZ});
      }
      // Re-rasterize the visible 3D surface into aligned character cells.
      // Fixed rows and columns read as ASCII art from every angle; no new random
      // positions or letters are generated during animation.
      const columns = window.innerWidth <= 700 ? Math.ceil(width / 2) : width;
      const lines = window.innerWidth <= 700 ? Math.ceil(height / 2) : height;
      const cellWidth = 100 / columns;
      const cellHeight = GLYPH_FRAME_HEIGHT / lines;
      const glyphSize = cellHeight * .88;
      context.font = `400 ${glyphSize}px "Courier New", monospace`;
      let minY = Infinity, maxY = -Infinity;
      for (const item of visible) {
        item.screenX = 50 + item.x * item.perspective;
        item.screenY = 50 + item.y * item.perspective;
        minY = Math.min(minY, item.screenY);
        maxY = Math.max(maxY, item.screenY);
      }
      const yCenter = (minY + maxY) / 2;
      const yScale = (GLYPH_FRAME_HEIGHT - glyphSize) / Math.max(1, maxY - minY);
      const top = (100 - GLYPH_FRAME_HEIGHT) / 2;
      const grid = new Array(columns * lines);
      visible.sort((a, b) => b.z - a.z);
      for (const item of visible) {
        const x = 50 + (item.screenX - 50) * GLYPH_X_SCALE;
        const y = 50 + (item.screenY - yCenter) * yScale;
        const column = Math.floor(x / cellWidth);
        const row = Math.floor((y - top) / cellHeight);
        if (column < 0 || column >= columns || row < 0 || row >= lines) continue;
        const index = row * columns + column;
        if (!grid[index]) grid[index] = {item, hits: 0};
        grid[index].hits++;
      }
      // Close isolated one-cell holes while keeping the source cutout's larger
      // gaps and irregular lower outline open.
      const filled = grid.slice();
      for (let row = 1; row < lines - 1; row++) for (let column = 1; column < columns - 1; column++) {
        const index = row * columns + column;
        if (grid[index]) continue;
        const neighbours = [grid[index - 1], grid[index + 1], grid[index - columns], grid[index + columns]].filter(Boolean);
        if (neighbours.length >= 3) filled[index] = neighbours.reduce((best, cell) => cell.hits > best.hits ? cell : best);
      }
      const ramp = ['+', 'x', 'X', '8', '0', 'S', '#', '@'];
      for (let row = 0; row < lines; row++) for (let column = 0; column < columns; column++) {
        const cell = filled[row * columns + column];
        if (!cell) continue;
        const {point, normalX, normalY, normalZ} = cell.item;
        // A fixed upper-left light reveals the rounded side and back surfaces.
        // Keep the color version's established glyph density and colors intact.
        const colorShade = Math.max(0, Math.min(1, .45 * normalZ + .25 * (1 - row / lines) + .3 * point.gray / 255));
        const light = Math.max(0, -.56 * normalX - .58 * normalY + .59 * normalZ);
        const sourceTone = Math.max(0, Math.min(1, (point.gray - 28) / 200));
        const monoShade = Math.max(0, Math.min(1, .05 + .7 * light + .25 * sourceTone + .28 * point.crown));
        const shade = colorized ? colorShade : monoShade;
        const character = ramp[Math.min(ramp.length - 1, Math.floor((1 - shade) * ramp.length))];
        const mono = Math.round(32 + monoShade * 145);
        context.fillStyle = colorized ? point.color : `rgb(${mono} ${mono} ${mono})`;
        context.fillText(character, (column + .5) * cellWidth, top + (row + .5) * cellHeight);
      }
      context.globalAlpha = 1;
      element.dataset.rotation = String(angle);
    },
  };
}
