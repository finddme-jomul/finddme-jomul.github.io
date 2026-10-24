import './main-v2.css';
import { createProjectOverlay } from './project-overlay.js';
const projectOverlay = createProjectOverlay();
import { projects } from './projects/index.js';
import { projectNames } from './project-display.js';
import galleryPhotos from 'virtual:main-gallery';

const gallery = document.querySelector('#v2-gallery');
const titleTrack = document.querySelector('#v2-title-track');
const collapse = document.querySelector('.v2-collapse');
const entries = [];
const frames = [];
let activeIndex = -1;
let frame = 0;

function updateCurrent() {
  frame = 0;
  const center = innerHeight / 2;
  let nearest = 0;
  let distance = Infinity;
  entries.forEach(({ element }, index) => {
    const rect = element.getBoundingClientRect();
    const d = center < rect.top ? rect.top - center : center > rect.bottom ? center - rect.bottom : 0;
    if (d < distance) { nearest = index; distance = d; }
  });
  if (!entries.length) return;
  if (nearest !== activeIndex) {
    activeIndex = nearest;
    entries.forEach(({ titleLink }, index) => {
      titleLink.classList.toggle('is-current', index === nearest);
      titleLink.setAttribute('aria-label', `${entries[index].project.title} ${index === nearest ? '상세 보기' : '프로젝트로 이동'}`);
      if (index === nearest) titleLink.setAttribute('aria-current', 'true');
      else titleLink.removeAttribute('aria-current');
    });
  }
  // Focusing a partly clipped link can scroll its overflow container.
  titleTrack.parentElement.scrollLeft = 0;
  const title = entries[nearest].titleLink;
  // Align with the actual image column, excluding the browser scrollbar.
  const imageRect = entries[nearest].button.getBoundingClientRect();
  const captionRect = titleTrack.parentElement.getBoundingClientRect();
  const imageCenter = imageRect.left + imageRect.width / 2;
  titleTrack.style.transform = `translateX(${imageCenter - captionRect.left - title.offsetLeft - title.offsetWidth / 2}px)`;
}
function scheduleCurrent() { if (!frame) frame = requestAnimationFrame(updateCurrent); }
function centerImage(element) {
  const rect = element.getBoundingClientRect();
  window.scrollTo({
    top: scrollY + rect.top + rect.height / 2 - innerHeight / 2,
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
  });
}
function setOpen(entry, open) {
  entry.element.classList.toggle('is-open', open);
  entry.button.setAttribute('aria-expanded', String(open));
  entry.button.setAttribute('aria-label', `${entry.project.title} 이미지 ${open ? '접기' : '펼치기'}`);
  collapse.disabled = !frames.some(({ element }) => element.classList.contains('is-open'));
  scheduleCurrent();
}

for (const source of projects) {
  const projectIndex = entries.length;
  const project = { ...source, title: projectNames[source.number] || source.title };
  const element = document.createElement('article');
  element.className = 'v2-work';
  element.setAttribute('aria-label', project.title);
  const slug = project.href.split('/')[2];
  const photos = [{ src: project.cover, alt: project.coverAlt || project.assets?.photo?.[0]?.alt || project.title }, ...(galleryPhotos[slug] || [])];
  const projectFrames = [];
  photos.forEach((photo, index) => {
    const frameElement = document.createElement('div');
    frameElement.className = 'v2-frame' + (index ? ' v2-supporting' : '');
    const button = document.createElement('button');
    button.className = 'v2-image-button';
    button.type = 'button';
    if (index) button.setAttribute('aria-expanded', 'false');
    else button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-label', index ? `${project.title} 이미지 펼치기` : `${project.title} 상세 보기`);
    const img = document.createElement('img');
    img.alt = photo.alt;
    img.decoding = 'async';
    // Keep image geometry stable before interaction; the catalogue is a small set.
    const sizeImage = () => {
      if (!img.naturalWidth) return;
      frameElement.style.setProperty('--v2-ratio', img.naturalWidth / img.naturalHeight);
      img.width = img.naturalWidth;
      img.height = img.naturalHeight;
      fitExpandedImage();
      scheduleCurrent();
    };
    const fitExpandedImage = () => {
      if (!img.naturalWidth) return;
      const ratio = img.naturalWidth / img.naturalHeight;
      // Portrait photos remain fully visible; never stretch them into book spreads.
      frameElement.style.setProperty('--v2-expanded-width', `${Math.min(1100, innerHeight * .82 * ratio, img.naturalWidth)}px`);
    };
    img.addEventListener('load', sizeImage);
    img.addEventListener('error', () => frameElement.classList.add('is-missing'));
    img.src = photo.src;
    if (img.complete) sizeImage();
    button.append(img);
    frameElement.append(button);
    element.append(frameElement);
    const frameEntry = { project, element: frameElement, button, fitExpandedImage };
    frames.push(frameEntry);
    projectFrames.push(frameEntry);
    button.addEventListener('click', () => {
      if (activeIndex !== projectIndex) {
        centerImage(frameElement);
        return;
      }
      if (index === 0) projectOverlay.open(project, button);
      else setOpen(frameEntry, !frameElement.classList.contains('is-open'));
    });
    button.addEventListener('focus', () => {
      if (!projectOverlay.isRestoring && button.matches(':focus-visible')) button.scrollIntoView({ block: 'center', behavior: 'instant' });
      scheduleCurrent();
    });
  });
  const titleLink = document.createElement('a');
  titleLink.className = 'v2-project-title';
  titleLink.href = project.href;
  titleLink.setAttribute('aria-label', `${project.title} 상세 보기`);
  const number = document.createElement('span');
  number.className = 'v2-number';
  number.textContent = `PROJECT ${project.number}`;
  const title = document.createElement('span');
  title.className = 'v2-title';
  title.textContent = project.title;
  titleLink.append(number, title);
  titleTrack.append(titleLink);
  gallery.append(element);
  const entry = { project, element, button: projectFrames[0].button, titleLink };
  titleLink.addEventListener('click', event => {
    // Keep modified clicks available for opening the actual project in a new tab.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (activeIndex !== projectIndex) centerImage(projectFrames[0].element);
    else projectOverlay.open(project, titleLink);
  });
  titleLink.addEventListener('focus', () => {
    scheduleCurrent();
    if (!projectOverlay.isRestoring && titleLink.matches(':focus-visible')) {
      const rect = element.getBoundingClientRect();
      window.scrollTo({ top: scrollY + rect.top + rect.height / 2 - innerHeight / 2, behavior: 'instant' });
      scheduleCurrent();
    }
  });
  entries.push(entry);

}
function closeAll() {
  // The fixed collapse control disappears when disabled; preserve keyboard focus.
  const focused = document.activeElement;
  const target = entries.find(e => e.element.contains(focused)) || entries[Math.max(0, activeIndex)];
  frames.filter(entry => entry.element.classList.contains('v2-supporting')).forEach(entry => setOpen(entry, false));
  if (focused === collapse) target?.button.focus({ preventScroll: true });
}
collapse.addEventListener('click', closeAll);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !projectOverlay.isOpen && !event.defaultPrevented) closeAll();
});
window.addEventListener('scroll', scheduleCurrent, { passive: true });
window.addEventListener('resize', () => {
  frames.forEach(entry => entry.fitExpandedImage());
  scheduleCurrent();
});
const observer = new ResizeObserver(scheduleCurrent);
entries.forEach(({ element }) => observer.observe(element));
updateCurrent();
document.fonts.ready.then(scheduleCurrent);
