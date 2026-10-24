import './main-v2.css';
import { createProjectOverlay } from './project-overlay.js';
// A fresh visit/reload starts with the first cover under the fixed title.
// Overlay closing still restores its saved position; bfcache history stays intact.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo({ top: 0, behavior: 'instant' });
window.addEventListener('pageshow', event => {
  if (!event.persisted) window.scrollTo({ top: 0, behavior: 'instant' });
});
const projectOverlay = createProjectOverlay();
import { projects } from './projects/index.js';
import { projectNames } from './project-display.js';
import galleryPhotos from 'virtual:main-gallery';

const gallery = document.querySelector('#v2-gallery');
const titleTrack = document.querySelector('#v2-title-track');
const entries = [];
let activeIndex = -1;
let frame = 0;

function updateCurrent() {
  frame = 0;
  const center = innerHeight / 2;
  // Move the image column, not the fixed title ribbon. Use the actual cover
  // height so first-load alignment also works on mobile and for non-square art.
  const firstCover = entries[0]?.button.getBoundingClientRect();
  if (firstCover) {
    const offset = `${Math.max(0, center - firstCover.height / 2)}px`;
    const main = gallery.closest('main');
    if (main.style.getPropertyValue('--v2-start-offset') !== offset) main.style.setProperty('--v2-start-offset', offset);
  }
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
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-label', `${project.title} 상세 보기`);
    const img = document.createElement('img');
    img.alt = photo.alt;
    img.decoding = 'async';
    // Keep image geometry stable before interaction; the catalogue is a small set.
    const sizeImage = () => {
      if (!img.naturalWidth) return;
      frameElement.style.setProperty('--v2-ratio', img.naturalWidth / img.naturalHeight);
      img.width = img.naturalWidth;
      img.height = img.naturalHeight;
      scheduleCurrent();
    };
    img.addEventListener('load', sizeImage);
    img.addEventListener('error', () => frameElement.classList.add('is-missing'));
    img.src = photo.src;
    if (img.complete) sizeImage();
    button.append(img);
    frameElement.append(button);
    element.append(frameElement);
    const frameEntry = { project, element: frameElement, button };
    projectFrames.push(frameEntry);
    button.addEventListener('click', () => {
      if (activeIndex !== projectIndex) {
        centerImage(frameElement);
        return;
      }
      projectOverlay.open(project, button);
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
window.addEventListener('scroll', scheduleCurrent, { passive: true });
window.addEventListener('resize', scheduleCurrent);
const observer = new ResizeObserver(scheduleCurrent);
entries.forEach(({ element }) => observer.observe(element));
updateCurrent();
document.fonts.ready.then(scheduleCurrent);
