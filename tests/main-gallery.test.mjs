import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readProjects } from '../scripts/project-catalogue.mjs';
import { extractGallery } from '../scripts/main-gallery.mjs';
test('only final gallery photos, relative URLs and no duplicated lightbox/CAD assets', () => {
 const html = `<section id="story"><img src="cad.svg"></section><section class="gallery" id="gallery"><img src="./assets/a.webp" alt="A"><img src="./assets/a.webp"><img src='/photos/b.webp' alt='B'></section><dialog><img src="other.webp"></dialog>`;
 assert.deepEqual(extractGallery(html, 'sample'), [{src:'/projects/sample/assets/a.webp',alt:'A'},{src:'/photos/b.webp',alt:'B'}]);
});
test('real project gallery counts and provisional page', () => {
 for (const [slug,count] of [['chess',3],['moon-jar',2],['mug',2],['plates',1],['bowls',1],['portrait-drawing',0]]) {
  assert.equal(extractGallery(readFileSync(readProjects().find(r => r.metadata.slug === slug).page + '/index.html','utf8'),slug).length,count);
 }
});
