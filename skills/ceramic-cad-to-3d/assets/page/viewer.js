import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clamp, smooth, angularDistance, driftingAxis, glazeRevealAt, glazeSpinAt, continuingAxis, MOON_JAR_GLAZE_MOTION } from './glaze-motion.mjs';
import {applyAxisPose} from './axis-motion.mjs';
import { fitComposition } from './composition-framing.mjs';
import { backgroundAt } from './background-transition.mjs';
import { installGallery } from './gallery.js';
import { galleryProfile } from './gallery-config.js';

// Explicit scene-review accent preview; not an adopted material recipe.
function sprayCoverage(angle, heightFraction, centerAngle, widthScale = 1) {
  const wave = .12 * Math.sin(9 * angle + 15 * heightFraction);
  const streams = [
    [centerAngle, .68, .82],
    [centerAngle + .49, .36, .66],
    [centerAngle - .43, .34, .72]
  ];
  let coverage = 0;
  for (const [center, width, reach] of streams) {
    const distance = angularDistance(angle, center + wave);
    const lateral = Math.exp(-.5 * (distance / (width * widthScale)) ** 2);
    const downward = smooth((heightFraction - (1 - reach) + .09 * Math.sin(11 * angle)) / .13);
    coverage = Math.max(coverage, lateral * downward);
  }
  return clamp(coverage);
}

const host = document.querySelector('#scene');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.45;
host.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, innerWidth / innerHeight, .01, 10);
scene.add(new THREE.HemisphereLight(0xffffff, 0xc8c7c2, 1.7));
for (const [x, y, z, power] of [[-.3,.35,.5,3.5],[.3,.2,-.2,2.2]]) {
  const lamp = new THREE.PointLight(0xffffff, power); lamp.position.set(x,y,z); scene.add(lamp);
}
const spec = await fetch('./assets/scene.json').then(r => r.json());
if (![2,3].includes(spec.schemaVersion)) throw new Error('Full page needs a reviewed photo-role config');
const ids = spec.parts.map(part => part.id);
const timing = spec.motion.timing, layout = spec.motion.layout, cameraSettings = spec.motion.camera;
const glazeMotion=spec.motion.glaze??MOON_JAR_GLAZE_MOTION;
const pageProfile=await fetch('./assets/page-profile.json').then(r=>r.json());
if(pageProfile.page.cadSheetFit!=='contain-entire-sheet-at-viewport-maximum' ||
   ['visibleNarration','visibleBadge','visibleHeader','visibleFooter'].some(key=>pageProfile.page[key]!==false))
  throw new Error('Accepted page profile is required');
const photos=spec.finalPhotos;
if(!Array.isArray(photos)) throw new Error('Generated photo roles are required');
const hasPhotos=photos.length>0;
const baselineScrollVh=spec.motion.storyHeightVh-100;
const photoStartP=timing.cadEnd+(1-timing.cadEnd)*timing.photoStart;
const photoStartVh=baselineScrollVh*photoStartP;
const story=document.querySelector('#story');
story.style.height=`${spec.motion.storyHeightVh}vh`;
const gallery=document.querySelector('#gallery');
if(Boolean(gallery)!==hasPhotos) throw new Error('Gallery DOM disagrees with reviewed photo inputs');
if(hasPhotos) installGallery({gallery,story,isActive:()=>scrollY/innerHeight*100>=baselineScrollVh-.2,
  profile:galleryProfile,source:'skill-page-review'});
window.__fullPageContract={mode:spec.mode,photoCount:photos.length,photoStartVh,
  sceneExitStartVh:hasPhotos?photoStartVh:null,galleryStartVh:hasPhotos?baselineScrollVh:null,
  totalScrollVh:baselineScrollVh};
camera.fov=cameraSettings.fov;camera.updateProjectionMatrix();
const sheets=await fetch('./assets/sheets-manifest.json').then(r=>r.json());
const sheetMeta=await fetch('./assets/common-sheet-manifest.json').then(r=>r.json());
if(sheets.schemaVersion!==2 || ids.some(id=>!sheets.parts.some(part=>part.id===id)) ||
   ids.some(id=>!sheetMeta.parts.some(part=>part.id===id)))
  throw new Error('CAD sheet part IDs disagree with the scene');
const sheetById=new Map(sheets.parts.map(part=>[part.id,part]));
const cadIntro=document.querySelector('#cad-intro');
cadIntro.setAttribute('aria-label',`${spec.display.header} CAD technical sheet`);
const frontHost=document.querySelector('#cad-fronts');
const sharedSheet=document.createElement('img');
sharedSheet.className='cad-sheet';sharedSheet.alt=`${spec.display.header} CAD technical sheet`;
cadIntro.appendChild(sharedSheet);
const layoutKey=()=>innerWidth<600?(innerHeight<=740?'mobile-short':'mobile'):(innerHeight<=740?'short':'desktop');
function placeSheet(){
  const chosen=layoutKey(),meta=sheetMeta.layouts[chosen];
  const wanted=`./assets/${meta.file}`;
  if(sharedSheet.getAttribute('src')!==wanted){
    sharedSheet.onload=placeSheet;sharedSheet.src=wanted;return;
  }
  const scale=Math.min(innerWidth/meta.pagePx[0],innerHeight/meta.pagePx[1]);
  const width=meta.pagePx[0]*scale,height=meta.pagePx[1]*scale;
  Object.assign(sharedSheet.style,{width:`${width}px`,height:`${height}px`,
    left:`${(innerWidth-width)/2}px`,top:`${(innerHeight-height)/2}px`});
}
placeSheet();
for(const id of ids){
  const front=document.createElement('img');front.className='cad-front';front.dataset.part=id;
  front.alt='';front.setAttribute('aria-hidden','true');
  front.src=`./assets/${sheetById.get(id).front}`;frontHost.appendChild(front);
}
await Promise.all([...document.querySelectorAll('.cad-front')].map(img=>img.decode()));
await sharedSheet.decode();

const THREEColor = hex => new THREE.Color(hex);

function prepareSurface(glb, part, height, centerAngle, widthScale) {
  const clay = THREEColor(part.glazePreview.clayHex);
  const base = THREEColor(part.glazePreview.baseHex);
  const warm = THREEColor(part.glazePreview.baseWarmHex || part.glazePreview.baseHex);
  const accent = THREEColor(part.glazePreview.accentHex);
  const accentWarm = THREEColor(part.glazePreview.accentWarmHex || part.glazePreview.accentHex);
  const accentWarmMix = part.glazePreview.accentWarmMix || 0;
  const meshes = [];
  glb.scene.traverse(node => {
    if (!node.isMesh) return;
    node.geometry = node.geometry.clone();
    const positions = node.geometry.getAttribute('position');
    const colors = new Float32Array(positions.count * 3);
    const values = [];
    for (let i=0;i<positions.count;i++) {
      const x=positions.getX(i), y=positions.getY(i), z=positions.getZ(i);
      const fraction=clamp(y / height);
      const angle=Math.atan2(z,x);
      const warmTint=.2+.09*Math.sin(angle*5+fraction*12);
      values.push({fraction,coverage:sprayCoverage(angle,fraction,centerAngle,widthScale),baseR:base.r+(warm.r-base.r)*warmTint,baseG:base.g+(warm.g-base.g)*warmTint,baseB:base.b+(warm.b-base.b)*warmTint,accentR:accent.r+(accentWarm.r-accent.r)*accentWarmMix,accentG:accent.g+(accentWarm.g-accent.g)*accentWarmMix,accentB:accent.b+(accentWarm.b-accent.b)*accentWarmMix});
    }
    const attribute = new THREE.BufferAttribute(colors,3).setUsage(THREE.DynamicDrawUsage);
    node.geometry.setAttribute('color',attribute);
    node.material = new THREE.MeshStandardMaterial({ color:0xffffff, vertexColors:true, roughness:.9, side:THREE.DoubleSide, transparent:true, opacity:0 });
    meshes.push({ node, attribute, values });
  });
  return {
    update(baseProgress, accentProgress) {
      for (const {node,attribute,values} of meshes) {
        const array=attribute.array;
        for (let i=0;i<values.length;i++) {
          const {fraction,coverage,baseR,baseG,baseB,accentR,accentG,accentB}=values[i];
          const baseSweep=glazeRevealAt(fraction,baseProgress,timing.surfaceSweepWidth,glazeMotion.direction);
          const secondSweep=part.accentEnabled ? glazeRevealAt(fraction,accentProgress,timing.surfaceSweepWidth,glazeMotion.direction) : 0;
          const amount=coverage*secondSweep*baseSweep;
          const r=clay.r+(baseR-clay.r)*baseSweep;
          const g=clay.g+(baseG-clay.g)*baseSweep;
          const b=clay.b+(baseB-clay.b)*baseSweep;
          array[i*3]=r+(accentR-r)*amount;
          array[i*3+1]=g+(accentG-g)*amount;
          array[i*3+2]=b+(accentB-b)*amount;
        }
        attribute.needsUpdate=true;
        node.material.roughness=.9-.57*baseProgress;
      }
    }
  };
}

const vessels = await Promise.all(ids.map(async id => {
  const part=spec.parts.find(p=>p.id===id);
  const [profile, glb]=await Promise.all([
    fetch(`./assets/${id}/outer-profile.json`).then(r=>r.json()),
    new GLTFLoader().loadAsync(`./assets/${id}/model.glb`)
  ]);
  const height=profile.at(-1)[1]/1000;
  const cadWidth=sheetById.get(id).boundsMm.width/1000;
  const bounds=new THREE.Box3().setFromObject(glb.scene);
  const glbSize=new THREE.Vector3();bounds.getSize(glbSize);
  if(Math.abs(glbSize.y-height)>.004 || Math.abs(Math.max(glbSize.x,glbSize.z)-cadWidth)>.004)
    throw new Error(`${id}: GLB/CAD dimensions disagree`);
  const main=new THREE.Group(), orbit=new THREE.Group(), tilt=new THREE.Group(), spin=new THREE.Group();
  main.add(orbit);orbit.add(tilt);tilt.add(spin);scene.add(main);
  glb.scene.updateMatrixWorld(true);
  const baked=new THREE.Group();
  glb.scene.traverse(node=>{if(node.isMesh){const geometry=node.geometry.clone();geometry.applyMatrix4(node.matrixWorld);baked.add(new THREE.Mesh(geometry,node.material));}});
  glb.scene=baked;
  const surface=prepareSurface(glb,part,height,part.accentCenterAngle,part.accentWidthScale);
  glb.scene.position.y=-height/2;
  spin.add(glb.scene);
  const wire=new THREE.Group();
  const guide=await fetch(`./assets/${id}/wire-guide.json`).then(r=>r.json());
  const geometry=new THREE.BufferGeometry();
  const positions=guide.positionsYUpMetres.map((v,i)=>i%3===1?v-height/2:v);
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  wire.add(new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:0x65747a,transparent:true,opacity:.75})));
  spin.add(wire);
  return {id,part,height,modelBounds:{min:{x:bounds.min.x,y:bounds.min.y,z:bounds.min.z},max:{x:bounds.max.x,y:bounds.max.y,z:bounds.max.z}},main,orbit,tilt,spin,solid:glb.scene,wire,surface,lastPaint:-1};
}));
function compositionTarget(small){
  const framing=spec.motion.framing;
  if(!framing.enabled)return {distance:small?cameraSettings.mobileStartZ+cameraSettings.mobileFocusDeltaZ:cameraSettings.desktopStartZ+cameraSettings.desktopFocusDeltaZ,centerX:0,centerY:cameraSettings.lookAtY};
  return fitComposition(vessels.map(v=>({
    bounds:v.modelBounds,
    position:{x:small?v.part.motion.finalXMobile:v.part.motion.finalXDesktop,y:0,z:0},
    scale:v.part.motion.settledScale
  })),{
    fovDegrees:camera.fov,aspect:camera.aspect,
    widthFraction:small?framing.mobileWidthFraction:framing.desktopWidthFraction,
    heightFraction:small?framing.mobileHeightFraction:framing.desktopHeightFraction,
    minDistance:framing.minDistance
  });
}
function transformedBounds(v){
  v.main.updateMatrixWorld(true);
  const b=v.modelBounds,world=[];
  for(const x of [b.min.x,b.max.x])for(const y of [b.min.y-v.height/2,b.max.y-v.height/2])
    for(const z of [b.min.z,b.max.z])world.push(v.spin.localToWorld(new THREE.Vector3(x,y,z)));
  const box=new THREE.Box3().setFromPoints(world);
  return {box,world};
}
function currentFit(small, singleFraming=null){
  const framing=spec.motion.framing;
  const items=vessels.map(v=>{
    const {box}=transformedBounds(v);
    return {bounds:{min:{x:box.min.x,y:box.min.y,z:box.min.z},
                    max:{x:box.max.x,y:box.max.y,z:box.max.z}},
            position:{x:0,y:0,z:0},scale:1};
  });
  const fraction=singleFraming?.viewportFraction;
  return fitComposition(items,{fovDegrees:camera.fov,aspect:camera.aspect,
    widthFraction:fraction??(small?framing.mobileWidthFraction:framing.desktopWidthFraction),
    heightFraction:fraction??(small?framing.mobileHeightFraction:framing.desktopHeightFraction),
    minDistance:singleFraming?.method==='transformed-mesh-bounds' ? 0.01 : framing.minDistance});
}
function frame(){
  const scrollVh=scrollY/innerHeight*100;
  const p=clamp(scrollVh/baselineScrollVh);
  const motionP=clamp((p-timing.cadEnd)/(1-timing.cadEnd));
  const small=innerWidth<600;
  const backdrop=backgroundAt(p,spec.motion.background);
  document.body.style.backgroundColor=backdrop.color;
  document.body.style.color=backdrop.darkText?'#383634':'#e8ded4';
  document.body.classList.toggle('dark-scene',!backdrop.darkText);
  vessels.forEach(v=>{
    const motion=v.part.motion, delay=motion.dropDelay;
    const drop=smooth((motionP-timing.dropStart-delay)/timing.dropDuration);
    const clayReveal=smooth((motionP-timing.clayStart-delay)/timing.clayDuration);
    const baseGlaze=smooth((motionP-timing.baseGlazeStart)/timing.baseGlazeDuration);
    const accentGlaze=timing.accentGlazeStart === null ? 0 : smooth((motionP-timing.accentGlazeStart)/timing.accentGlazeDuration);
    const settle=smooth((motionP-timing.settleStart-delay)/timing.settleDuration);
    const initialX=small?motion.entryXMobile:motion.entryXDesktop;
    const finalX=small?motion.finalXMobile:motion.finalXDesktop;
    v.main.position.set(initialX+(finalX-initialX)*drop,(small?layout.mobileEntryY:layout.desktopEntryY)*(1-drop)+v.height*motion.settledScale/2*drop+Math.sin(drop*Math.PI*3)*layout.dropBounceY*(1-drop),layout.entryZ*(1-drop));
    // Enlarge the same CAD-derived wire at handoff, then settle to true model size.
    const entryScale=small?motion.cadToWireScaleMobile:motion.cadToWireScale;
    v.main.scale.setScalar(entryScale+(motion.settledScale-entryScale)*drop);
    const lastCoatEnd=timing.accentGlazeStart===null?timing.baseGlazeStart+timing.baseGlazeDuration:timing.accentGlazeStart+timing.accentGlazeDuration;
    const axisRelease=smooth((motionP-lastCoatEnd)/(timing.photoStart-lastCoatEnd));
    const axis=continuingAxis(motion.axisTiltDegrees,motion.axisDriftZDegrees,motion.axisDriftXDegrees,drop,settle,axisRelease,glazeMotion.axisRetainFraction,glazeMotion.maxAxisTiltDegrees);
    const axisFade=smooth((p-timing.axisFadeStart)/timing.axisFadeDuration);
    const glazeTurns=glazeSpinAt(motionP,timing.baseGlazeStart,timing.photoStart,glazeMotion.spinTurns);
    v.glazeTurns=glazeTurns;v.baseGlazeProgress=baseGlaze;v.accentGlazeProgress=accentGlaze;
    // Wire, clay and glaze share the same spin/tilt/orbit transform.
    applyAxisPose({spin:v.spin,orbit:v.orbit,tilt:v.tilt},{
      bodyY:(drop*motion.turns+glazeTurns)*Math.PI*2,
      orbitY:(drop*motion.orbitTurns+glazeSpinAt(motionP,timing.baseGlazeStart,timing.photoStart,glazeMotion.axisPrecessionTurns))*Math.PI*2,
      tiltZ:THREE.MathUtils.degToRad(axis.zDegrees)*axisFade,
      tiltX:THREE.MathUtils.degToRad(axis.xDegrees)*axisFade
    });
    v.solid.visible=clayReveal>.005;
    v.solid.traverse(node=>{if(node.isMesh){node.material.opacity=clayReveal;}});
    v.wire.visible=clayReveal<.995;
    v.wire.traverse(node=>{if(node.material)node.material.opacity=(1-clayReveal)*(node.material.userData.baseOpacity??.75)*smooth((p-timing.wireFadeStart)/timing.wireFadeDuration);});
    if(Math.abs(v.lastPaint-(baseGlaze+accentGlaze))>.001){v.surface.update(baseGlaze,accentGlaze);v.lastPaint=baseGlaze+accentGlaze;}
    v.main.visible=!hasPhotos||motionP<.995;
  });
  const focus=smooth((motionP-timing.cameraFocusStart)/timing.cameraFocusDuration);
  const startZ=small?cameraSettings.mobileStartZ:cameraSettings.desktopStartZ;
  const target=compositionTarget(small), targetZ=target.distance;
  const singleFraming=spec.mode==='single'?spec.motion.singleFraming:null;
  if(singleFraming && (singleFraming.sourceBaseline!=='moonGalleryJs' ||
     singleFraming.method!=='transformed-mesh-bounds'))
    throw new Error('Selected single-vessel presentation profile is required');
  const moving=singleFraming?currentFit(small,singleFraming):spec.mode==='multiple'?currentFit(small):null;
  const aimX=singleFraming?moving.centerX:moving?moving.centerX*(1-focus)+target.centerX*focus:target.centerX*focus;
  const aimY=singleFraming?moving.centerY:moving?moving.centerY*(1-focus)+target.centerY*focus:cameraSettings.lookAtY+(target.centerY-cameraSettings.lookAtY)*focus;
  const baseZ=startZ+(targetZ-startZ)*focus;
  const cameraZ=singleFraming?moving.distance: moving?Math.max(baseZ,moving.distance*1.06):baseZ;
  camera.position.set(aimX,singleFraming?aimY:cameraSettings.y+(aimY-cameraSettings.lookAtY)*focus,cameraZ);
  camera.lookAt(aimX,aimY,0);
  camera.updateMatrixWorld();
  const sceneExit=hasPhotos?smooth((p-photoStartP)/(1-photoStartP)):0;
  renderer.domElement.style.opacity=1-sceneExit;

  // Sheet frontBox is generated with the CAD profile. Move each detached SVG
  // to the projected front plane of its own GLB before revealing 3D wire.
  camera.updateMatrixWorld();
  cadIntro.style.opacity = 1 - smooth((p-timing.sheetFadeStart)/timing.sheetFadeDuration);
  cadIntro.style.visibility = p < timing.sheetFadeStart+timing.sheetFadeDuration+.01 ? 'visible' : 'hidden';
  for (const v of vessels) {
    const meta=sheetById.get(v.id), sheet=sharedSheet;
    const front=document.querySelector(`.cad-front[data-part="${v.id}"]`);
    const rect=sheet.getBoundingClientRect(), box=sheetMeta.layouts[layoutKey()].frontBoxes[v.id];
    const sourceX=rect.left+rect.width*box.cx, sourceY=rect.top+rect.height*box.cy;
    const sourceW=rect.width*box.width, sourceH=rect.height*box.height;
    // Project points through the scaled 3D hierarchy so the SVG meets the wire at its actual size.
    const center=v.spin.localToWorld(new THREE.Vector3(0,0,0)).project(camera);
    const left=v.spin.localToWorld(new THREE.Vector3(-meta.boundsMm.width/2000,0,0)).project(camera);
    const right=v.spin.localToWorld(new THREE.Vector3(meta.boundsMm.width/2000,0,0)).project(camera);
    const top=v.spin.localToWorld(new THREE.Vector3(0,v.height/2,0)).project(camera);
    const bottom=v.spin.localToWorld(new THREE.Vector3(0,-v.height/2,0)).project(camera);
    const targetX=(center.x+1)*innerWidth/2, targetY=(1-center.y)*innerHeight/2;
    const targetW=(right.x-left.x)*innerWidth/2, targetH=(top.y-bottom.y)*innerHeight/2;
    const t=smooth((p-timing.frontMoveStart)/timing.frontMoveDuration), opacity=1-smooth((p-timing.frontFadeStart)/timing.frontFadeDuration);
    front.style.left=`${sourceX}px`;front.style.top=`${sourceY}px`;
    front.style.width=`${sourceW}px`;front.style.height=`${sourceH}px`;
    front.style.opacity=opacity;
    front.style.visibility=p<timing.frontFadeStart+timing.frontFadeDuration+.01?'visible':'hidden';
    front.style.transform=`translate(-50%,-50%) translate(${(targetX-sourceX)*t}px,${(targetY-sourceY)*t}px) scale(${1+(targetW/sourceW-1)*t},${1+(targetH/sourceH-1)*t})`;
  }
  window.__fullPageDebug={progress:p,scrollVh,sceneExit,photoCount:photos.length,
    galleryActive:Boolean(gallery?.classList.contains('gallery-active')),
    sheetLayout:layoutKey(),backgroundColor:backdrop.color,cameraZ,
    parts:vessels.map(v=>{
      const points=transformedBounds(v).world.map(point=>point.project(camera));
      return {id:v.id,bodyTurns:v.spin.rotation.y/(Math.PI*2),axisTurns:v.orbit.rotation.y/(Math.PI*2),
        clay:v.solid.visible,baseGlazeProgress:v.baseGlazeProgress,accentGlazeProgress:v.accentGlazeProgress,
        screenBounds:{left:Math.min(...points.map(point=>(point.x+1)*innerWidth/2)),
          right:Math.max(...points.map(point=>(point.x+1)*innerWidth/2)),
          top:Math.min(...points.map(point=>(1-point.y)*innerHeight/2)),
          bottom:Math.max(...points.map(point=>(1-point.y)*innerHeight/2))}};
    })};
  renderer.render(scene,camera);
  requestAnimationFrame(frame);
}
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);placeSheet();});
frame();
