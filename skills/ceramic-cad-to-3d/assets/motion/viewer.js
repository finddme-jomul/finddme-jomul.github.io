import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {moonAxisPose,applyAxisPose} from './axis-motion.mjs';

const settings = await fetch('./review-input.json').then(r => r.json());
const layout = innerWidth > innerHeight ? 'desktop' : innerHeight <= 740 ? 'mobile-short' : 'mobile';
const sheet = document.querySelector('#sheet');
const image = document.querySelector('#sheet-image');
image.src = './' + settings.layouts[layout].file;
await image.decode();
const front = document.querySelector('#front');
const host = document.querySelector('#viewer');
const gltf = await new GLTFLoader().loadAsync('./model.glb');
const wireGuide = await fetch('./wire-guide.json').then(r => r.json());
const motion = await fetch('./motion-config.json').then(r => r.json());
if (wireGuide.sourceSha256.handle !== settings.sourceSha256.handle ||
    wireGuide.sourceSha256.profile !== settings.sourceSha256.profile)
  throw new Error('3D wire guide differs from solid inputs');
const renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
host.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera();
const orbitRig = new THREE.Group(); scene.add(orbitRig);
const tiltRig = new THREE.Group(); orbitRig.add(tiltRig);
const pivot = new THREE.Group(); tiltRig.add(pivot);
const content = new THREE.Group(); pivot.add(content);
const model = new THREE.Group(); content.add(model);
scene.add(new THREE.HemisphereLight(0xffffff,0xa9a39a,2.2));
const keyLight=new THREE.DirectionalLight(0xffffff,2.4);keyLight.position.set(.15,.25,.4);scene.add(keyLight);
const clay = new THREE.MeshStandardMaterial({color:0xd7d2ca,roughness:.88,side:THREE.DoubleSide,transparent:true,opacity:0,depthWrite:false});
const line = new THREE.LineBasicMaterial({color:0x55514e,transparent:true,opacity:0});
const meshes = [];
gltf.scene.updateMatrixWorld(true);
gltf.scene.traverse(object => {
  if (!object.isMesh) return;
  const geometry = object.geometry.clone();
  geometry.applyMatrix4(object.matrixWorld);
  geometry.computeBoundingBox();
  const mesh = new THREE.Mesh(geometry,clay);
  model.add(mesh);
  meshes.push(mesh);
});
if (!meshes.length) throw new Error('GLB contains no mesh');
const guideGeometry = new THREE.BufferGeometry();
guideGeometry.setAttribute('position',new THREE.Float32BufferAttribute(wireGuide.positionsYUpMetres,3));
const wire = new THREE.LineSegments(guideGeometry,line);content.add(wire);
const b = settings.boundsMm;
const centre = new THREE.Vector3((b.minX+b.maxX)/2000,(b.minZ+b.maxZ)/2000,0);
// The mug rotates around the vessel axis x=0, not the handle-weighted bounding-box centre.
pivot.position.y=centre.y;
content.position.y=-centre.y;
const extent = Math.max((b.maxX-b.minX)/1000,(b.maxZ-b.minZ)/1000);
let baseHalf=0;
function resize() {
  renderer.setSize(innerWidth,innerHeight);
  const aspect=innerWidth/innerHeight;
  const radial=Math.max(Math.abs(b.minX),Math.abs(b.maxX))/1000;
  baseHalf=Math.max((b.maxZ-b.minZ)/1000*.68,radial*1.13/aspect);
  camera.left=-baseHalf*aspect;camera.right=baseHalf*aspect;camera.top=baseHalf;camera.bottom=-baseHalf;
  camera.near=.001;camera.far=10;camera.updateProjectionMatrix();
}
resize();
addEventListener('resize',resize);
const corner=new THREE.Vector3();
function fitRotatingSolid(lookX) {
  // Fit actual transformed mesh bounds, including an asymmetric handle and chosen tilt.
  scene.updateMatrixWorld(true);
  let xRadius=0,yRadius=0;
  for(const mesh of meshes){
    const box=mesh.geometry.boundingBox;
    for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){
      corner.set(x,y,z).applyMatrix4(mesh.matrixWorld);
      xRadius=Math.max(xRadius,Math.abs(corner.x-lookX));
      yRadius=Math.max(yRadius,Math.abs(corner.y-centre.y));
    }
  }
  const aspect=innerWidth/innerHeight;
  const half=Math.max(baseHalf,xRadius*1.06/aspect,yRadius*1.06);
  camera.left=-half*aspect;camera.right=half*aspect;camera.top=half;camera.bottom=-half;
  camera.updateProjectionMatrix();
}

function targetBounds() {
  camera.updateMatrixWorld();
  const a=new THREE.Vector3(b.minX/1000,b.maxZ/1000,0).project(camera);
  const z=new THREE.Vector3(b.maxX/1000,b.minZ/1000,0).project(camera);
  return {x:(a.x+1)*innerWidth/2,y:(1-a.y)*innerHeight/2,
          width:(z.x-a.x)*innerWidth/2,height:(a.y-z.y)*innerHeight/2};
}
function sourceBounds() {
  const r=image.getBoundingClientRect(),f=settings.layouts[layout].frontBox;
  return {x:r.x+r.width*(f.cx-f.width/2),y:r.y+r.height*(f.cy-f.height/2),
          width:r.width*f.width,height:r.height*f.height};
}
const clamp=t=>Math.min(1,Math.max(0,t));
const mix=(a,b,t)=>a+(b-a)*t;
let latest={};
function render() {
  const progress=clamp(scrollY/(innerHeight*1.8));
  const turn=clamp((progress-.58)/.42);
  const pose=moonAxisPose(turn,motion);
  applyAxisPose({spin:content,orbit:orbitRig,tilt:tiltRig},pose);
  const lookX=mix(centre.x,0,clamp(turn/.15));
  camera.position.set(lookX,centre.y,extent*4);
  camera.lookAt(lookX,centre.y,0);
  fitRotatingSolid(lookX);
  const source=sourceBounds(),target=targetBounds();
  const t=clamp((progress-.12)/.31);
  const box={x:mix(source.x,target.x,t),y:mix(source.y,target.y,t),
             width:mix(source.width,target.width,t),height:mix(source.height,target.height,t)};
  front.style.left=box.x+'px';front.style.top=box.y+'px';
  front.style.width=box.width+'px';front.style.height=box.height+'px';
  front.style.opacity=String(progress<.10?0:progress<.42?1:1-clamp((progress-.42)/.12));
  sheet.style.opacity=String(1-clamp((progress-.07)/.2));
  host.style.opacity=String(clamp((progress-.32)/.15));
  line.opacity=clamp((progress-.36)/.14)*(1-clamp((progress-.59)/.12));
  clay.opacity=clamp((progress-.52)/.18);
  clay.depthWrite=clay.opacity>.98;
  renderer.render(scene,camera);
  latest={progress,layout,source,target,front:box,bodySpinDegrees:motion.bodySpinDegrees*turn,
          axisPrecessionDegrees:motion.axisPrecessionDegrees*turn,
          axisTiltDegrees:pose.tiltDegrees,lookX,
          frontOpacity:Number(front.style.opacity),lineOpacity:line.opacity};
  requestAnimationFrame(render);
}
render();
window.__mugMotion={settings,motion,get state(){return latest},meshes,model,camera,wire,content,orbitRig,tiltRig,pivot};
