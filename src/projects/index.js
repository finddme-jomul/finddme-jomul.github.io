import mugCover from './mug-cover.webp';

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

const sourceProjects = [
  portrait_drawing,
  white_vessels,
  table_plates,
  workshop_table,
  clay_vessels,
  drawing_session,
  flower_vase_drawing,
  book_cover,
  plant_pot,
  sudoku_pencil,
  coffee_cup,
  ceramics_display,
];
const featured = [
  [sudoku_pencil, '00', '체스', 'chess'],
  [white_vessels, '01', '달항아리', 'moon-jar'],
  [drawing_session, '02', '머그컵', 'mug'],
  [table_plates, '03', '접시 세 개', 'plates'],
  [plant_pot, '04', '그릇', 'bowls'],
];
const selected = new Set(featured.map(([project]) => project.id));
// Cover moves retain project numbers and destinations; use original sources.
const covers = {
  '00': {cover: sudoku_pencil.cover, coverAlt: sudoku_pencil.assets.photo[0].alt},
  '02': {cover: mugCover, coverAlt: '나무 테이블 위 두 머그컵'},
  '08': {cover: drawing_session.cover, coverAlt: drawing_session.assets.photo[0].alt},
  '09': {cover: book_cover.cover, coverAlt: book_cover.assets.photo[0].alt},
};
export const projects = [
  ...featured.map(([project, number, title, slug]) => ({...project, number, title, href: `/projects/${slug}/`})),
  ...sourceProjects.filter(project => !selected.has(project.id)).map((project, index) => ({
    ...project, number: String(index + 5).padStart(2, '0'), href: `/projects/${project.id}/`,
  })),
].map(project => ({
  ...project,
  ...covers[project.number],
  // Vite's public directory needs the explicit filename for nested HTML pages.
  href: import.meta.env.DEV ? `${project.href}index.html` : project.href,
}));

const numbers = projects.map(project => project.number);
if (numbers.some(number => !/^\d{2,}$/.test(number)) || new Set(numbers).size !== numbers.length) {
  throw new Error('Project numbers must be unique strings of at least two digits.');
}
