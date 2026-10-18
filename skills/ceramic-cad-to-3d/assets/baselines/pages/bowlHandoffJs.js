import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clamp, smooth, sprayCoverage, driftingAxis, glazeRevealAt, glazeSpinAt, continuingAxis, MOON_JAR_GLAZE_MOTION } from './glaze-motion.mjs';
import { fitComposition } from './composition-framing.mjs';
import { backgroundAt } from './background-transition.mjs';

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
if (spec.schemaVersion !== 1) throw new Error('Unsupported configured scene');
const ids = spec.parts.map(part => part.id);
const timing = spec.motion.timing, layout = spec.motion.layout, cameraSettings = spec.motion.camera;
const glazeMotion=spec.motion.glaze??MOON_JAR_GLAZE_MOTION;
camera.fov=cameraSettings.fov;camera.updateProjectionMatrix();
const photoTransitionVh=80, photoHoldVh=80;
const baselineScrollVh=spec.motion.storyHeightVh-100;
const photoStartP=timing.cadEnd+(1-timing.cadEnd)*timing.photoStart;
const photoStartVh=baselineScrollVh*photoStartP;
const totalScrollVh=photoStartVh+photoTransitionVh+photoHoldVh;
document.querySelector('main').style.height=`${100+totalScrollVh}vh`;
window.__photoPacing={original:'bowl-set-configured',photoStartVh,photoTransitionVh,photoHoldVh,totalScrollVh,pace:()=>({scrollVh:scrollY/innerHeight*100,photoBlend:smooth((scrollY/innerHeight*100-photoStartVh)/photoTransitionVh)})};
document.querySelector('#project-header').textContent = spec.display.header;
document.querySelector('#project-badge').textContent = spec.display.badge;
const sheets = await fetch('./assets/sheets-manifest.json').then(r => r.json());
if (sheets.schemaVersion !== 2 || ids.some(id => !sheets.parts.some(part => part.id === id))) throw new Error('CAD sheet part IDs disagree with the scene');
const sheetById = new Map(sheets.parts.map(part => [part.id, part]));
const cadIntro = document.querySelector('#cad-intro');
cadIntro.classList.toggle('single', spec.mode === 'single');
cadIntro.setAttribute('aria-label', `${spec.display.header} CAD 시안 도면`);
const frontHost = document.querySelector('#cad-fronts');
for (const id of ids) {
  const part=spec.parts.find(item => item.id === id);
  const sheet=document.createElement('img');
  sheet.className='cad-sheet';sheet.dataset.part=id;sheet.alt=`${part.label} CAD 시안`;
  sheet.src=`./assets/${sheetById.get(id).sheet}`;cadIntro.appendChild(sheet);
  const front=document.createElement('img');
  front.className='cad-front';front.dataset.part=id;front.alt='';front.setAttribute('aria-hidden','true');
  front.src=`./assets/${sheetById.get(id).front}`;frontHost.appendChild(front);
}
await Promise.all([...document.querySelectorAll('.cad-sheet,.cad-front')].map(img => img.decode()));
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
  const surface=prepareSurface(glb,part,height,part.accentCenterAngle,part.accentWidthScale);
  glb.scene.position.y=-height/2;
  spin.add(glb.scene);
  const wire=new THREE.Group();
  for(const [r,z] of profile.filter((_,i)=>i%12===0)){
    const points=Array.from({length:97},(_,i)=>{
      const a=i*Math.PI*2/96;return new THREE.Vector3(Math.cos(a)*r/1000,z/1000-height/2,Math.sin(a)*r/1000);
    });
    wire.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:0x65747a,transparent:true,opacity:.75})));
  }
  for(let angle=0;angle<8;angle++){
    const a=angle*Math.PI/4;
    const points=profile.filter((_,i)=>i%3===0).map(([r,z])=>new THREE.Vector3(Math.cos(a)*r/1000,z/1000-height/2,Math.sin(a)*r/1000));
    const reference=angle===0;
    const material=new THREE.LineBasicMaterial({color:reference?0x36484e:0x8b989c,transparent:true,opacity:reference?.92:.5});
    material.userData.baseOpacity=reference?.92:.5;
    wire.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),material));
  }
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
const title=document.querySelector('#title'),detail=document.querySelector('#detail'),progressBar=document.querySelector('#progress'),actual=document.querySelector('#actual');
if (spec.photo.available) {actual.src='./assets/actual-photo.webp';actual.alt=spec.photo.alt;} else actual.hidden=true;
actual.style.top=`${layout.photoTopPercent}%`;
function frame(){
  const scrollVh=scrollY/innerHeight*100;
  const p=clamp(scrollVh<=photoStartVh?scrollVh/baselineScrollVh:photoStartP+(1-photoStartP)*clamp((scrollVh-photoStartVh)/photoTransitionVh));
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
    v.tilt.rotation.z=THREE.MathUtils.degToRad(axis.zDegrees)*smooth((p-timing.axisFadeStart)/timing.axisFadeDuration);
    v.tilt.rotation.x=THREE.MathUtils.degToRad(axis.xDegrees)*smooth((p-timing.axisFadeStart)/timing.axisFadeDuration);
    const glazeTurns=glazeSpinAt(motionP,timing.baseGlazeStart,timing.photoStart,glazeMotion.spinTurns);
    v.spin.rotation.y=(drop*motion.turns+glazeTurns)*Math.PI*2;
    v.glazeTurns=glazeTurns;v.baseGlazeProgress=baseGlaze;v.accentGlazeProgress=accentGlaze;
    // A tilted axis must precess to make a full turn legible on an axially symmetric bowl.
    v.orbit.rotation.y=(drop*motion.orbitTurns+glazeSpinAt(motionP,timing.baseGlazeStart,timing.photoStart,glazeMotion.axisPrecessionTurns))*Math.PI*2;
    v.solid.visible=clayReveal>.005;
    v.solid.traverse(node=>{if(node.isMesh){node.material.opacity=clayReveal;}});
    v.wire.visible=clayReveal<.995;
    v.wire.traverse(node=>{if(node.material)node.material.opacity=(1-clayReveal)*(node.material.userData.baseOpacity??.75)*smooth((p-timing.wireFadeStart)/timing.wireFadeDuration);});
    if(Math.abs(v.lastPaint-(baseGlaze+accentGlaze))>.001){v.surface.update(baseGlaze,accentGlaze);v.lastPaint=baseGlaze+accentGlaze;}
    v.main.visible=motionP<.995;
  });
  const focus=smooth((motionP-timing.cameraFocusStart)/timing.cameraFocusDuration);
  const startZ=small?cameraSettings.mobileStartZ:cameraSettings.desktopStartZ;
  const target=compositionTarget(small), targetZ=target.distance;
  const aimX=target.centerX*focus, aimY=cameraSettings.lookAtY+(target.centerY-cameraSettings.lookAtY)*focus;
  camera.position.set(aimX,cameraSettings.y+(target.centerY-cameraSettings.lookAtY)*focus,startZ+(targetZ-startZ)*focus);
  camera.lookAt(aimX,aimY,0);
  const copy=spec.display;
  if(p<timing.cadEnd){title.textContent=copy.cadTitle;detail.textContent=copy.cadDetail;}
  else if(motionP<timing.clayStart){title.textContent=copy.fallTitle;detail.textContent=copy.fallDetail;}
  else if(motionP<timing.baseGlazeStart){title.textContent=copy.clayTitle;detail.textContent=copy.clayDetail;}
  else if(timing.accentGlazeStart!==null && motionP>=timing.accentGlazeStart && motionP<timing.photoStart){title.textContent=copy.accentTitle;detail.textContent=copy.accentDetail;}
  else if(motionP<timing.photoStart){title.textContent=copy.baseTitle;detail.textContent=copy.baseDetail;}
  else {title.textContent=copy.photoTitle;detail.textContent=copy.photoDetail;}
  const photoBlend=spec.photo.available ? smooth((scrollVh-photoStartVh)/photoTransitionVh) : 0;
  actual.style.opacity=photoBlend;
  actual.style.transform=`translate(-50%,-50%) scale(${layout.photoScaleStart+(1-layout.photoScaleStart)*photoBlend})`;
  for(const v of vessels) v.main.visible=photoBlend<.999;
  // Comparison only: as in the moon-jar scene, clear the 3D before the photo enters.
  // Keep the 80vh photo transition, its opacity curve, and all earlier stage timing.
  const sceneExit=smooth((scrollVh-(photoStartVh-40))/40);
  renderer.domElement.style.opacity=1-sceneExit;

  // Sheet frontBox is generated with the CAD profile. Move each detached SVG
  // to the projected front plane of its own GLB before revealing 3D wire.
  camera.updateMatrixWorld();
  cadIntro.style.opacity = 1 - smooth((p-timing.sheetFadeStart)/timing.sheetFadeDuration);
  cadIntro.style.visibility = p < timing.sheetFadeStart+timing.sheetFadeDuration+.01 ? 'visible' : 'hidden';
  for (const v of vessels) {
    const meta=sheetById.get(v.id), sheet=document.querySelector(`.cad-sheet[data-part="${v.id}"]`);
    const front=document.querySelector(`.cad-front[data-part="${v.id}"]`);
    const rect=sheet.getBoundingClientRect(), box=meta.frontBox;
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
  window.__configuredDebug={progress:p,backgroundColor:backdrop.color,darkText:backdrop.darkText,cameraZ:camera.position.z,targetZ,framingBounds:target.bounds||null,parts:vessels.map(v=>({id:v.id,spinTurns:v.spin.rotation.y/(Math.PI*2),orbitTurns:v.orbit.rotation.y/(Math.PI*2),glazeTurns:v.glazeTurns,baseGlazeProgress:v.baseGlazeProgress,accentGlazeProgress:v.accentGlazeProgress,scale:v.main.scale.x,tiltZ:v.tilt.rotation.z,tiltX:v.tilt.rotation.x}))};
  progressBar.style.width=`${clamp(scrollVh/totalScrollVh)*100}%`;
  renderer.render(scene,camera);
  requestAnimationFrame(frame);
}
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
frame();
