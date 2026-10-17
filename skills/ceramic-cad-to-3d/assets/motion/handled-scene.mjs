import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {moonAxisPose,applyAxisPose} from './axis-motion.mjs';

export async function startHandled(pageConfig=null,galleryRuntime=null) {
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
renderer.localClippingEnabled=true;
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
const glazeMeshes=[];
const clip=new THREE.Plane(new THREE.Vector3(0,-1,0),-10);
const clayClip=new THREE.Plane(new THREE.Vector3(0,1,0),10);
const glaze=pageConfig?new THREE.MeshPhysicalMaterial({color:pageConfig.surface.glazeHex,roughness:pageConfig.surface.roughness,clearcoat:pageConfig.surface.clearcoat,side:THREE.DoubleSide,clippingPlanes:[clip]}):null;
if(pageConfig)clay.color.set(pageConfig.surface.clayHex);
gltf.scene.updateMatrixWorld(true);
gltf.scene.traverse(object => {
  if (!object.isMesh) return;
  const geometry = object.geometry.clone();
  geometry.applyMatrix4(object.matrixWorld);
  geometry.computeBoundingBox();
  const mesh = new THREE.Mesh(geometry,clay);
  model.add(mesh);
  meshes.push(mesh);
  if(glaze){const coated=new THREE.Mesh(geometry,glaze);coated.visible=false;coated.renderOrder=1;model.add(coated);glazeMeshes.push(coated);}
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
const hasPhotos=pageConfig?.ending==='photos';
const story=document.querySelector('#story');
const endProgress=hasPhotos?1.1:1;
const baseVh=pageConfig?pageConfig.motion.storyHeightVh-100:180;
if(pageConfig)story.style.height=`${100+baseVh*endProgress}vh`;
if(hasPhotos){
  const {installGallery,galleryProfile}=galleryRuntime;
  installGallery({gallery:document.querySelector('#gallery'),story,isActive:()=>scrollY/innerHeight*100>=baseVh*endProgress-.2,profile:galleryProfile,source:'handled-page-review'});
}
// A world-space bottom-up boundary must cover the full rotating handle as well as the body.
const coatRadius=Math.hypot(Math.max(Math.abs(b.minX),Math.abs(b.maxX)),(b.maxZ-b.minZ)/2,Math.max(Math.abs(b.minY),Math.abs(b.maxY)))/1000*1.01;
function render() {
  let pageProgress=scrollY/(innerHeight*baseVh/100);
  if(pageConfig&&scrollY>=document.documentElement.scrollHeight-innerHeight-1)pageProgress=endProgress;
  const progress=pageConfig?clamp(pageProgress/.72):clamp(pageProgress);
  const coat=pageConfig?clamp((pageProgress-.72)/.28):0;
  const exit=hasPhotos?clamp((pageProgress-1)/.1):0;
  const turn=clamp((progress-.58)/.42);
  const pose=moonAxisPose(turn,motion);
  if(pageConfig){
    pose.bodyY+=coat*Math.PI*2;pose.orbitY+=coat*Math.PI*2;
    pose.tiltX*=1-coat;pose.tiltZ*=1-coat;
  }
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
  host.style.opacity=String(clamp((progress-.32)/.15)*(1-exit));
  line.opacity=clamp((progress-.36)/.14)*(1-clamp((progress-.59)/.12));
  clay.opacity=clamp((progress-.52)/.18);
  clay.depthWrite=clay.opacity>.98;
  if(pageConfig){
    clip.constant=centre.y-coatRadius+2*coatRadius*coat;
    clayClip.constant=-clip.constant;
    clay.clippingPlanes=coat>0?[clayClip]:null;
    glazeMeshes.forEach(m=>m.visible=coat>0);
    meshes.forEach(m=>m.visible=coat<1);
  }
  renderer.render(scene,camera);
  latest={pageProgress,coat,exit,endProgress,progress,layout,source,target,front:box,bodySpinDegrees:motion.bodySpinDegrees*turn,
          axisPrecessionDegrees:motion.axisPrecessionDegrees*turn,
          axisTiltDegrees:pose.tiltDegrees,lookX,
          frontOpacity:Number(front.style.opacity),lineOpacity:line.opacity};
  requestAnimationFrame(render);
}
render();
window.__mugMotion={renderer,scene,settings,motion,get state(){return latest},meshes,model,camera,wire,content,orbitRig,tiltRig,pivot,glazeMeshes,clip,clay,glaze,pageConfig};
}
