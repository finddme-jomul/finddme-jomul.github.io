import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createTimeline } from 'animejs';
import 'animejs/adapters/three';

const config = await fetch('./assets/project.json').then(async response => {
  if (!response.ok) throw new Error(`project settings HTTP ${response.status}`);
  return response.json();
});
const profile = await fetch('./assets/outer-profile.json').then(async response => {
  if (!response.ok) throw new Error(`CAD profile HTTP ${response.status}`);
  return response.json();
});
const gltf = await new GLTFLoader().loadAsync('./assets/model.glb');
const host = document.querySelector('#viewer');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.localClippingEnabled = true;
host.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, 1, .01, 10);
scene.add(new THREE.HemisphereLight(0xffffff, 0x819092, 2.2));
const key = new THREE.DirectionalLight(0xffffff, 3.0);
key.position.set(.15, .3, .2);
scene.add(key);
let original;
gltf.scene.traverse(object => { if (object.isMesh) original = object; });
if (!original) throw new Error('GLB contains no mesh');
original.updateWorldMatrix(true, false);
const geometry = original.geometry.clone();
geometry.applyMatrix4(original.matrixWorld);
geometry.computeBoundingBox();
const bounds = geometry.boundingBox;
const modelHeight = bounds.max.y - bounds.min.y;
const modelWidth = Math.max(bounds.max.x - bounds.min.x, bounds.max.z - bounds.min.z);
const targetHeight = config.dimensionsMm.height / 1000;
if (Math.abs(modelHeight - targetHeight) > .003) throw new Error('CAD and GLB height disagree');
function resize() {
  const w = host.clientWidth, h = host.clientHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  const tangent = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  camera.position.set(0, 0, Math.max(modelHeight / (2 * tangent), modelWidth / (2 * tangent * camera.aspect)) * 1.35);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(host);
resize();
const orbitRig = new THREE.Group(); scene.add(orbitRig);
const tiltRig = new THREE.Group(); orbitRig.add(tiltRig);
const root = new THREE.Group(); root.position.y = -(bounds.min.y + bounds.max.y) / 2; tiltRig.add(root);
const tiltChoices = {right: ['rotateZ', -1], left: ['rotateZ', 1], forward: ['rotateX', 1], backward: ['rotateX', -1], none: ['rotateZ', 0]};
const chosen = tiltChoices[config.motion.tiltDirection] || tiltChoices.right;
const clayMaterial = new THREE.MeshStandardMaterial({
  color: config.clayColor, roughness: .95, transparent: true, opacity: 0,
  depthWrite: false, side: THREE.DoubleSide
});
const clay = new THREE.Mesh(geometry, clayMaterial); root.add(clay);
const clip = new THREE.Plane(new THREE.Vector3(0, -1, 0), -modelHeight / 2);
const glazeMaterial = original.material.clone();
glazeMaterial.clippingPlanes = [clip];
glazeMaterial.polygonOffset = true;
glazeMaterial.polygonOffsetFactor = -2;
glazeMaterial.polygonOffsetUnits = -2;
glazeMaterial.side = THREE.DoubleSide;
const glaze = new THREE.Mesh(geometry, glazeMaterial);
glaze.scale.setScalar(1.003); root.add(glaze);

// Rings and meridians come from the exact outer profile exported by CAD.
const points = [];
const ringCount = 72, meridianCount = 12;
for (const [rmm, zmm] of profile.filter((_, index) => index % 4 === 0 || index === profile.length - 1)) {
  const r = rmm / 1000, y = zmm / 1000;
  if (r < .001) continue;
  for (let i = 0; i < ringCount; i++) {
    const a = i / ringCount * Math.PI * 2, b = (i + 1) / ringCount * Math.PI * 2;
    points.push(r * Math.cos(a), y, r * Math.sin(a), r * Math.cos(b), y, r * Math.sin(b));
  }
}
for (let k = 0; k < meridianCount; k++) {
  const a = k / meridianCount * Math.PI * 2;
  for (let j = 0; j < profile.length - 1; j++) {
    const [r1, y1] = profile[j], [r2, y2] = profile[j + 1];
    points.push(r1 / 1000 * Math.cos(a), y1 / 1000, r1 / 1000 * Math.sin(a),
                r2 / 1000 * Math.cos(a), y2 / 1000, r2 / 1000 * Math.sin(a));
  }
}
const wireGeometry = new THREE.BufferGeometry();
wireGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
const wireMaterial = new THREE.LineBasicMaterial({color: 0x6e6a68, transparent: true, opacity: 0, depthWrite: false});
const wire = new THREE.LineSegments(wireGeometry, wireMaterial); root.add(wire);
const story = document.querySelector('#story');
// The final gallery owns the photographs; there is no photo-only scroll scene.
const baselineScrollVh = config.motion.storyHeightVh - 100;
const hasPhotos = config.ending !== 'glaze';
const finalSceneT = hasPhotos ? 1080 : 1000;
const totalScrollVh = baselineScrollVh * finalSceneT / 1200;
story.style.height = `${100 + totalScrollVh}vh`;
function scrollVh() { return scrollY / innerHeight * 100; }
function pacedTime() { return scrollVh() / baselineScrollVh * 1200; }
window.__photoPacing = {original:'moon-jar',photoTransitionVh:0,totalScrollVh,pace:()=>({scrollVh:scrollVh(),timelineTime:pacedTime()})};
const cadSheet = document.querySelector('#cad-sheet');
const cadImage = document.querySelector('#cad-sheet-image');
const cadMain = document.querySelector('#cad-main');
const mainMotion = {t: 0};
await cadImage.decode();
function placeCadMain() {
  const image = cadImage.getBoundingClientRect();
  const box = config.sheetFrontBox;
  const width = image.width * box.width, height = image.height * box.height;
  const left = image.left + image.width * box.cx - width / 2;
  const top = image.top + image.height * box.cy - height / 2;
  const finalHeight = Math.min(innerHeight * .67, innerWidth * (innerWidth <= 600 ? .98 : 1.1));
  const scale = finalHeight / height;
  const dx = innerWidth / 2 - (left + width / 2), dy = innerHeight / 2 - (top + height / 2);
  cadMain.style.left = `${left}px`; cadMain.style.top = `${top}px`;
  cadMain.style.width = `${width}px`; cadMain.style.height = `${height}px`;
  cadMain.style.transform = `translate(${dx * mainMotion.t}px,${dy * mainMotion.t}px) scale(${1 + (scale - 1) * mainMotion.t})`;
}
addEventListener('resize', placeCadMain);
placeCadMain();
const timeline = createTimeline({autoplay: false, defaults: {ease: 'linear'}})
  .add(cadMain, {opacity: [0, 1], duration: 70}, 100)
  .add(cadSheet, {opacity: [1, 0], duration: 100}, 150)
  .add(mainMotion, {t: [0, 1], duration: 240, ease: 'inOutCubic'}, 260)
  .add(wireMaterial, {opacity: [0, 1], duration: 110}, 360)
  .add(cadMain, {opacity: [1, 0], duration: 110}, 430)
  .add(root, {rotateY: [0, 390], duration: 500}, 500)
  .add(orbitRig, {rotateY: [0, 360], duration: 500}, 500)
  .add(tiltRig, {[chosen[0]]: [0, chosen[1] * config.motion.tiltDegrees], duration: 200, ease: 'inOutSine'}, 500)
  .add(wireMaterial, {opacity: [1, 0], duration: 140}, 620)
  .add(clayMaterial, {opacity: [0, 1], duration: 130}, 620)
  .add(clip, {constant: [-modelHeight / 2, modelHeight / 2], duration: 200}, 780)
  .add('body', {backgroundColor: ['#fff', '#202023'], duration: 240}, 680)
;
if (hasPhotos) timeline
  .add(host, {opacity: [1, 0], duration: 70}, 1010)
  .add('body', {backgroundColor: ['#202023', '#f2eee9'], duration: 60}, 1020);
function syncTimeline() {
  timeline.seek(pacedTime());
}
addEventListener('scroll', syncTimeline, {passive: true});
addEventListener('resize', syncTimeline);
syncTimeline();
let galleryActive = false;
function frame() {
  clayMaterial.depthWrite = clayMaterial.opacity > .98;
  glaze.visible = clip.constant > -modelHeight / 2 + .0005;
  placeCadMain();
  if (!galleryActive) renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
frame();
function updateSceneState() {
  const q = pacedTime();
  host.setAttribute('aria-hidden', hasPhotos && q >= 1080 ? 'true' : 'false');
  window.__transformProgress = Math.max(0, Math.min(1, scrollVh() / totalScrollVh));
}
addEventListener('scroll', updateSceneState, {passive: true});
updateSceneState();
window.__moonJar = {config, root, orbitRig, tiltRig, wireMaterial, clayMaterial, clip, geometry, timeline, glbLoaded: true};

import { installGallery } from './gallery.js';
import { galleryProfile } from './gallery-config.js';
if (hasPhotos) installGallery({
  gallery:document.querySelector('#gallery'),
  story,
  isActive:()=>scrollVh()>=totalScrollVh-.2,
  onActiveChange:active=>{galleryActive=active},
  profile:galleryProfile,
  source:'moon-jar-photo-pacing-slow'
});
