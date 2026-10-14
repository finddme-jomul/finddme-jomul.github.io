// One card per photo project. Stable project numbers control orbit and list order.
import { project as portrait_drawing } from './00-portrait-drawing/project.js';
import { project as white_vessels } from './01-white-vessels/project.js';
import { project as table_plates } from './02-table-plates/project.js';
import { project as workshop_table } from './03-workshop-table/project.js';
import { project as clay_vessels } from './04-clay-vessels/project.js';
import { project as drawing_session } from './05-drawing-session/project.js';
import { project as book_cover } from './06-book-cover/project.js';
import { project as plant_pot } from './07-plant-pot/project.js';
import { project as sudoku_pencil } from './08-sudoku-pencil/project.js';
import { project as coffee_cup } from './09-coffee-cup/project.js';
import { project as ceramics_display } from './10-ceramics-display/project.js';
import { project as flower_vase_drawing } from './11-flower-vase-drawing/project.js';

export const projects = [
  portrait_drawing,
  white_vessels,
  table_plates,
  workshop_table,
  clay_vessels,
  drawing_session,
  book_cover,
  plant_pot,
  sudoku_pencil,
  coffee_cup,
  ceramics_display,
  flower_vase_drawing,
].sort((a, b) => Number(a.number) - Number(b.number));

const numbers = projects.map(project => project.number);
if (numbers.some(number => !/^\d{2,}$/.test(number)) || new Set(numbers).size !== numbers.length) {
  throw new Error('Project numbers must be unique strings of at least two digits.');
}
