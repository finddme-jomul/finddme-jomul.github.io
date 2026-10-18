import './style.css';
import './list.css';
import { projects } from './projects/index.js';

const list = document.querySelector('#project-list');
document.querySelector('#project-count').textContent = `${projects.length} projects`;
for (const project of projects) {
  const link = document.createElement('a');
  link.className = 'catalogue-card';
  link.href = project.href;
  link.setAttribute('aria-label', `${project.title} 프로젝트 보기`);

  const frame = document.createElement('span');
  frame.className = 'catalogue-image';
  const photo = document.createElement('img');
  photo.src = project.cover;
  photo.alt = project.coverAlt || project.assets?.photo?.[0]?.alt || `${project.title} 대표 이미지`;
  photo.loading = 'lazy';
  frame.append(photo);

  const number = document.createElement('span');
  number.className = 'catalogue-number';
  number.textContent = project.number;
  const title = document.createElement('span');
  title.className = 'catalogue-title';
  title.textContent = project.title;
  link.append(frame, number, title);
  list.append(link);
}
