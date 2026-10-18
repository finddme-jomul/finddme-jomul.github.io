import {createCadScroll} from './scene/cad-scroll.mjs';
import {installCadPages} from './scene/cad-pages.mjs';
import {sceneDefaults} from './scene-defaults.mjs';
const defaults=sceneDefaults.multiple;
import {wireColor} from './wire-color.mjs';
// Reviewed multi-part scene; inputs retain CAD IDs, ordered coatings and reviewed motion.
import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {smooth,clamp,continuingAxis,glazeRevealAt,glazeSpinAt,sprayCoverage} from './scene/glaze-motion.mjs';
import {applyAxisPose} from './scene/axis-motion.mjs';
import {fitOrientedPoints,radialEnvelopePoints} from './scene/oriented-framing.mjs';
import {fitComposition} from './scene/composition-framing.mjs';
import {backgroundAt} from './scene/background-transition.mjs';
import {installGallery} from './gallery.js';
import {galleryProfile} from './gallery-config.js';
import {exteriorAt,inRegion,coatingWeights,assemblyPosition,featureCoatingBands,featurePlanarRegions} from './scene/layered-vessels.mjs';

export async function startMultiple(spec) {
  const host=document.querySelector('#viewer'),story=document.querySelector('#story');
  const sheet=document.querySelector('#cad-sheet'),image=document.querySelector('#cad-sheet-image');
  const lighting=spec.motion.lighting??{};
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,defaults.pixelRatioCap));
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=lighting.exposure??defaults.exposure;
  host.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(defaults.fov,1,defaults.near,defaults.far);
  scene.add(new THREE.HemisphereLight(defaults.skyColor,defaults.groundColor,defaults.hemisphereIntensity));
  for(const [x,y,z,power] of defaults.pointLights){const lamp=new THREE.PointLight(defaults.keyColor,power*(lighting.pointLightScale??1));lamp.position.set(x,y,z);scene.add(lamp);}
  const timing=spec.motion.timing,layout=spec.motion.layout,glazeMotion=spec.motion.glaze;
  const assembly=spec.assembly,directDrop=assembly?.mode==='direct-drop',rotationEnd=assembly?assembly.start:timing.photoStart;
  const hasPhotos=spec.ending==='photos';
  const endMotion=hasPhotos?timing.photoStart+timing.photoDuration:timing.photoStart;
  const endProgress=timing.cadEnd+(1-timing.cadEnd)*endMotion;
  const cadScroll=createCadScroll(spec),totalVh=cadScroll.toScrollVh(endProgress);
  story.style.height=`${100+totalVh}vh`;
  let layoutKey='',galleryActive=false,ready=false,frameRequested=false;
  const renderStats={frames:0,lastCpuMs:0};
  function requestFrame(){if(ready&&!frameRequested){frameRequested=true;requestAnimationFrame(frame)}}
  function resize(){
    camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);
    const key=innerWidth>700?'desktop':(innerHeight<760?'mobile-short':'mobile');
    if(key!==layoutKey){layoutKey=key;image.src='./assets/'+(spec.cadPresentation?.pages[0]||spec.sheets[key]).file;}
    requestFrame();
  }
  addEventListener('resize',resize);resize();await image.decode();
  const assetCache=new Map(),paintCache=new Map();
  const cached=(key,load)=>{if(!assetCache.has(key))assetCache.set(key,load());return assetCache.get(key)};
  const vessels=await Promise.all(spec.parts.map(async part=>{
    const feature=part.shapeKind==='feature-solid',assetId=part.geometryAssetId||part.id;
    const guide=feature?await cached('guide:'+assetId,()=>fetch(`./assets/${assetId}/wire-guide.json`).then(r=>r.json())):null;
    if(feature&&guide.sourceStepSha256!==part.sourceStepSha256)throw Error('Feature guide source mismatch');
    const profile=feature?null:await fetch(`./assets/${part.id}/outer-profile.json`).then(r=>{if(!r.ok)throw Error('Profile failed');return r.json()});
    const gltf=await cached('model:'+assetId,()=>new GLTFLoader().loadAsync(`./assets/${assetId}/model.glb`));
    const regions=part.surfaceRegions?await cached('regions:'+assetId,()=>fetch(`./assets/${assetId}/${part.surfaceRegions.file}`).then(r=>r.json())):null;
    if(regions&&regions.sourceGlbSha256!==part.surfaceRegions.sourceGlbSha256)throw Error('Feature surface source mismatch');
    const meshes=[];gltf.scene.traverse(n=>{if(n.isMesh)meshes.push(n)});
    if(!meshes.length||!feature&&meshes.length!==1)throw Error('Missing complete mesh');
    gltf.scene.updateMatrixWorld(true);
    let geometry;let exteriorFlags=[];let surfaces=null;
    if(regions&&regions.primitiveExterior.length!==meshes.length)throw Error('Feature surface primitive mismatch');
    const offset=feature?[(part.boundsMm.minX+part.boundsMm.maxX)/2000,part.boundsMm.minZ/1000,-(part.boundsMm.minY+part.boundsMm.maxY)/2000]:[0,0,0];
    if(feature){
      const pieces=meshes.map((m,index)=>{let g=m.geometry.clone().applyMatrix4(m.matrixWorld);if(g.index)g=g.toNonIndexed();for(let i=0;i<g.attributes.position.count;i++)exteriorFlags.push(regions?regions.primitiveExterior[index]:false);for(const k of Object.keys(g.attributes))if(!['position','normal'].includes(k))g.deleteAttribute(k);if(!g.attributes.normal)g.computeVertexNormals();return g;});
      geometry=mergeGeometries(pieces);if(!geometry)throw Error('Feature mesh merge failed');
      geometry.translate(-offset[0],-offset[1],-offset[2]);
    }else{const original=meshes[0];original.updateWorldMatrix(true,false);geometry=original.geometry.clone().applyMatrix4(original.matrixWorld);}
    if(feature&&part.coatings&&part.surfaceRegions){
      let refined=featureCoatingBands(geometry.attributes.position.array,geometry.attributes.normal.array,exteriorFlags,part.dimensionsMm.height/1000);
      refined=featurePlanarRegions(refined,[...part.coatings.layers.map(l=>l.region),part.coatings.fired.region],offset);surfaces=refined.surfaces;
      geometry.dispose();geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(refined.positions,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(refined.normals,3));exteriorFlags=refined.exterior;
    }
    geometry.computeBoundingBox();
    const height=part.dimensionsMm.height/1000;
    if(Math.abs(geometry.boundingBox.max.y-geometry.boundingBox.min.y-height)>.001)throw Error('CAD/model height drift');
    const main=new THREE.Group(),orbit=new THREE.Group(),tilt=new THREE.Group(),spin=new THREE.Group();
    scene.add(main);main.add(orbit);orbit.add(tilt);tilt.add(spin);spin.position.y=-(geometry.boundingBox.min.y+geometry.boundingBox.max.y)/2;
    const g=part.glazePreview,clay=new THREE.Color(g.clayHex),base=new THREE.Color(g.baseHex),warm=new THREE.Color(g.baseWarmHex||g.baseHex),accent=new THREE.Color(g.accentHex),accentWarm=new THREE.Color(g.accentWarmHex||g.accentHex);
    const paintKey=JSON.stringify([assetId,g,part.coatings,part.accentEnabled,part.accentCenterAngle,part.accentWidthScale]);
    const sharedPaint=paintCache.get(paintKey)||{values:[],stamp:''};
    const positions=geometry.attributes.position,values=sharedPaint.values;
    if(!paintCache.has(paintKey))for(let i=0;i<positions.count;i++){
      const fraction=clamp(positions.getY(i)/height),angle=Math.atan2(positions.getZ(i),positions.getX(i));
      values.push({surface:surfaces?.[i],fraction,heightMm:positions.getY(i)*1000,exterior:feature?(part.surfaceRegions?exteriorFlags[i]:true):exteriorAt(profile,Math.hypot(positions.getX(i),positions.getZ(i))*1000,positions.getY(i)*1000),coverage:sprayCoverage(angle,fraction,part.accentCenterAngle,part.accentWidthScale),base:base.clone().lerp(warm,.2+.09*Math.sin(angle*5+fraction*12)),accent:accent.clone().lerp(accentWarm,g.accentWarmMix||0)});
    }
    const colours=sharedPaint.colours||new THREE.BufferAttribute(new Float32Array(positions.count*3),3);sharedPaint.colours=colours;paintCache.set(paintKey,sharedPaint);geometry.setAttribute('color',colours);
    if(part.coatings&&!sharedPaint.palettes){
      const coat=part.coatings,colors=new Map(),rgb=hex=>{if(!colors.has(hex))colors.set(hex,new THREE.Color(hex).toArray());return colors.get(hex)};
      sharedPaint.palettes=values.map(v=>{const finish=inRegion(coat.fired.region,v.exterior,v.heightMm,v.surface)?coat.fired.regionHex:coat.fired.baseHex;return {first:inRegion(coat.layers[0].region,v.exterior,v.heightMm,v.surface),second:!!coat.layers[1]&&inRegion(coat.layers[1].region,v.exterior,v.heightMm,v.surface),firstRGB:rgb(coat.layers.length===1?finish:coat.layers[0].previewHex),lastRGB:rgb(finish)}});
    }
    const material=new (feature?THREE.MeshPhysicalMaterial:THREE.MeshStandardMaterial)({vertexColors:true,roughness:.9,side:THREE.DoubleSide,transparent:true,opacity:0,...(feature?{clearcoat:g.clearcoat||0}:{})});
    // Optional per-part direct-light reduction; other materials keep the selected lighting exactly.
    if(lighting.softPartIds?.includes(part.id)){
      material.onBeforeCompile=shader=>{
        shader.uniforms.ceramicDirectLightScale={value:lighting.softPointLightScale??1};
        shader.fragmentShader='uniform float ceramicDirectLightScale;\n'+shader.fragmentShader;
        shader.fragmentShader=shader.fragmentShader.replace('#include <lights_fragment_end>',`#include <lights_fragment_end>
          reflectedLight.directDiffuse *= ceramicDirectLightScale;
          reflectedLight.directSpecular *= ceramicDirectLightScale;
          #ifdef USE_CLEARCOAT
          clearcoatSpecularDirect *= ceramicDirectLightScale;
          #endif`);
      };
      material.customProgramCacheKey=()=> 'ceramic-part-direct-light';
    }
    const solid=new THREE.Mesh(geometry,material);spin.add(solid);
    const points=[];
    if(feature){for(let i=0;i<guide.positionsYUpMetres.length;i++)points.push(guide.positionsYUpMetres[i]-offset[i%3]);}
    else for(let j=0;j<profile.length;j++){
      const [r,z]=profile[j];
      if(j%4===0||j===profile.length-1)for(let i=0;i<72;i++){const a=i/72*Math.PI*2,b=(i+1)/72*Math.PI*2;points.push(r/1000*Math.cos(a),z/1000,r/1000*Math.sin(a),r/1000*Math.cos(b),z/1000,r/1000*Math.sin(b));}
      if(j)for(let i=0;i<12;i++){const a=i/12*Math.PI*2,[r0,z0]=profile[j-1];points.push(r0/1000*Math.cos(a),z0/1000,r0/1000*Math.sin(a),r/1000*Math.cos(a),z/1000,r/1000*Math.sin(a));}
    }
    const wireMaterial=new THREE.LineBasicMaterial({color:wireColor,transparent:true,opacity:0,depthWrite:false});
    const wireGeometry=new THREE.BufferGeometry();wireGeometry.setAttribute('position',new THREE.Float32BufferAttribute(points,3));spin.add(new THREE.LineSegments(wireGeometry,wireMaterial));
    function paint(baseP,accentP){
      const stamp=baseP.toFixed(4)+':'+accentP.toFixed(4);
      if(stamp!==sharedPaint.stamp){
        sharedPaint.stamp=stamp;
        for(let i=0;i<values.length;i++){
          const v=values[i];
          if(part.coatings){
            const palette=sharedPaint.palettes[i];
            const first=baseP>0&&palette.first?glazeRevealAt(v.fraction,baseP,timing.surfaceSweepWidth):0;
            const second=accentP>0&&palette.second?glazeRevealAt(v.fraction,accentP,timing.surfaceSweepWidth):0;
            const r=clay.r+(palette.firstRGB[0]-clay.r)*first,g=clay.g+(palette.firstRGB[1]-clay.g)*first,b=clay.b+(palette.firstRGB[2]-clay.b)*first;
            colours.setXYZ(i,r+(palette.lastRGB[0]-r)*second,g+(palette.lastRGB[1]-g)*second,b+(palette.lastRGB[2]-b)*second);
          }else{
            const b=glazeRevealAt(v.fraction,baseP,timing.surfaceSweepWidth,glazeMotion.direction),a=part.accentEnabled?glazeRevealAt(v.fraction,accentP,timing.surfaceSweepWidth,glazeMotion.direction)*v.coverage*b:0;
            const c=clay.clone().lerp(feature?base:v.base,b).lerp(v.accent,a);colours.setXYZ(i,c.r,c.g,c.b);
          }
        }
        colours.needsUpdate=true;
      }
      material.roughness=.9-.57*baseP;
      if(feature){material.roughness=.9+(g.roughness-.9)*baseP;material.clearcoat=g.clearcoat>0?Math.max(1e-8,g.clearcoat*baseP):0;}
      if(part.coatings)material.roughness=.9+(part.coatings.roughness-.9)*Math.max(baseP,accentP);
    }
    const front=document.querySelector(`[data-part="${part.id}"]`);await front.querySelector('img').decode();
    return {id:part.id,part,profile,feature,height,main,orbit,tilt,spin,solid,geometry,material,wireMaterial,wireGeometry,front,paint,values};
  }));
  // Cover every upright yaw and height of the drop with one camera envelope.
  // Fitting only the current moving meshes makes landed pieces appear to rise.
  const dropBounds=directDrop?vessels.map(v=>{
    const step=assembly.steps.find(s=>s.partId===v.id),a=v.geometry.attributes.position;
    let radius=0;for(let i=0;i<a.count;i++)radius=Math.max(radius,Math.hypot(a.getX(i),a.getZ(i)));
    const [x,y,z]=step.targetPositionMm.map(n=>n/1000);
    return {bounds:{min:{x:x-radius,y,z:z-radius},max:{x:x+radius,y:y+step.dropHeightMm/1000+v.height,z:z+radius}},position:{x:0,y:0,z:0},scale:1};
  }):null;
  const cadPages=installCadPages({spec,sheet,image,requestFrame});
  const frontSources=new Set(),frontRepresentatives=new Set();
  for(const v of vessels){const source=v.part.sourcePartId||v.id;if(!frontSources.has(source)){frontSources.add(source);frontRepresentatives.add(v.id)}}
  const radialPoints=directDrop?radialEnvelopePoints(dropBounds):null;
  function frontPlacement(v,p){
    if(cadPages&&!frontRepresentatives.has(v.id)){v.front.style.opacity='0';return;}

    if(p<timing.frontMoveStart||p>=timing.frontFadeStart+timing.frontFadeDuration){v.front.style.opacity='0';return;}
    const entry=cadPages?.entry||spec.sheets[layoutKey],box=entry.frontBoxes[v.id],rect=image.getBoundingClientRect();
    if(!box){v.front.style.opacity='0';return;}
    const scale=Math.min(rect.width/entry.pagePx[0],rect.height/entry.pagePx[1]);
    const sheetW=entry.pagePx[0]*scale,sheetH=entry.pagePx[1]*scale;
    const source={x:rect.left+(rect.width-sheetW)/2+sheetW*box.cx,y:rect.top+(rect.height-sheetH)/2+sheetH*box.cy,w:sheetW*box.width,h:sheetH*box.height};
    let left=Infinity,right=-Infinity,top=Infinity,bottom=-Infinity;
    const q=new THREE.Vector3();
    const include=()=>{q.applyMatrix4(v.spin.matrixWorld).project(camera);const x=(q.x+1)*innerWidth/2,y=(1-q.y)*innerHeight/2;left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y)};
    if(v.feature){const a=v.geometry.attributes.position;for(let i=0;i<a.count;i++){q.fromBufferAttribute(a,i);include()}}
    else for(const [r,z] of v.profile)for(const sign of [-1,1]){q.set(sign*r/1000,z/1000,0);include()}
    const move=smooth((p-timing.frontMoveStart)/timing.frontMoveDuration);
    const x=source.x+((left+right)/2-source.x)*move,y=source.y+((top+bottom)/2-source.y)*move;
    const w=source.w+(right-left-source.w)*move,h=source.h+(bottom-top-source.h)*move;
    Object.assign(v.front.style,{left:`${x-w/2}px`,top:`${y-h/2}px`,width:`${w}px`,height:`${h}px`,opacity:String(p>=timing.frontMoveStart?1-smooth((p-timing.frontFadeStart)/timing.frontFadeDuration):0)});
  }
  function frame(){
    frameRequested=false;const frameStart=performance.now();
    const atEnd=scrollY>=document.documentElement.scrollHeight-innerHeight-1;
    const p=atEnd?endProgress:Math.min(endProgress,cadScroll.fromScrollVh(scrollY/innerHeight*100)),motionP=clamp((p-timing.cadEnd)/(1-timing.cadEnd)),small=innerWidth<600;
    cadPages?.update(p);
    const bounds=[];
    for(const v of vessels){
      const m=v.part.motion,drop=smooth((motionP-timing.dropStart-m.dropDelay)/timing.dropDuration),settle=smooth((motionP-timing.settleStart-m.dropDelay)/timing.settleDuration);
      const initialX=small?m.entryXMobile:m.entryXDesktop,step=assembly?.steps.find(s=>s.partId===v.id);
      const finalX=directDrop?step.targetPositionMm[0]/1000:(small?m.finalXMobile:m.finalXDesktop);
      const hoverY=directDrop?(step.targetPositionMm[1]+step.dropHeightMm)/1000:0,finalZ=directDrop?step.targetPositionMm[2]/1000:0;
      v.main.position.set(initialX+(finalX-initialX)*drop,(small?layout.mobileEntryY:layout.desktopEntryY)*(1-drop)+(hoverY+v.height*m.settledScale/2)*drop+Math.sin(drop*Math.PI*3)*layout.dropBounceY*(1-drop),layout.entryZ*(1-drop)+finalZ*drop);
      const entryScale=small?m.cadToWireScaleMobile:m.cadToWireScale;v.main.scale.setScalar(entryScale+(m.settledScale-entryScale)*drop);
      const lastCoat=timing.accentGlazeStart===null?timing.baseGlazeStart+timing.baseGlazeDuration:timing.accentGlazeStart+timing.accentGlazeDuration;
      const axis=continuingAxis(m.axisTiltDegrees,m.axisDriftZDegrees,m.axisDriftXDegrees,drop,settle,smooth((motionP-lastCoat)/(rotationEnd-lastCoat)),glazeMotion.axisRetainFraction,glazeMotion.maxAxisTiltDegrees);
      const axisFade=smooth((p-timing.axisFadeStart)/timing.axisFadeDuration);
      const softSpin=directDrop&&assembly.landing==='soft-spin';
      const spinEnd=softSpin?assembly.start+assembly.duration*(step.start+step.duration):rotationEnd;
      const spinAt=turns=>softSpin?smooth((motionP-timing.baseGlazeStart)/(spinEnd-timing.baseGlazeStart))*turns:glazeSpinAt(motionP,timing.baseGlazeStart,spinEnd,turns);
      const turns=spinAt(glazeMotion.spinTurns);
      applyAxisPose(v,{bodyY:(drop*m.turns+turns)*2*Math.PI,orbitY:(drop*m.orbitTurns+spinAt(glazeMotion.axisPrecessionTurns))*2*Math.PI,tiltX:THREE.MathUtils.degToRad(axis.xDegrees)*axisFade,tiltZ:THREE.MathUtils.degToRad(axis.zDegrees)*axisFade});
      const clay=smooth((motionP-timing.clayStart-m.dropDelay)/timing.clayDuration),base=smooth((motionP-timing.baseGlazeStart)/timing.baseGlazeDuration),accent=timing.accentGlazeStart===null?0:smooth((motionP-timing.accentGlazeStart)/timing.accentGlazeDuration);
      v.material.opacity=clay;v.material.depthWrite=clay>.98;v.wireMaterial.opacity=(1-clay)*smooth((p-timing.wireFadeStart)/timing.wireFadeDuration);v.material.visible=clay>0;v.wireMaterial.visible=v.wireMaterial.opacity>0;if(clay>0)v.paint(base,accent);v.state={drop,clay,base,accent,turns};
      if(assembly&&motionP>=assembly.start){
        const step=assembly.steps.find(s=>s.partId===v.id),ap=clamp((motionP-assembly.start)/assembly.duration);
        const start=[v.main.position.x,v.main.position.y-v.height/2,v.main.position.z];
        const [x,y,z]=assemblyPosition(start,step,ap,assembly.mode,assembly.landing);v.main.position.set(x,y+v.height/2,z);v.state.assembly=ap;
      }
      v.spin.updateWorldMatrix(true,false);const b=v.geometry.boundingBox.clone().applyMatrix4(v.spin.matrixWorld);
      bounds.push({bounds:b,position:{x:0,y:0,z:0},scale:1});
    }
    const f=spec.motion.framing;
    // Finish camera staging with the initial CAD-to-3D descent, before coating.
    // A late blend after glazing itself lifts pieces even with fixed landing framing.
    const lockCamera=directDrop?Math.min(...vessels.map(v=>v.state.drop)):0;
    const cameraBounds=directDrop?bounds.map((item,i)=>{
      const b={min:{},max:{}};
      for(const edge of ['min','max'])for(const axis of ['x','y','z'])b[edge][axis]=item.bounds[edge][axis]*(1-lockCamera)+dropBounds[i].bounds[edge][axis]*lockCamera;
      return {bounds:b,position:{x:0,y:0,z:0},scale:1};
    }):bounds;
    const fit=fitComposition(cameraBounds,{fovDegrees:camera.fov,aspect:camera.aspect,widthFraction:small?f.mobileWidthFraction:f.desktopWidthFraction,heightFraction:small?f.mobileHeightFraction:f.desktopHeightFraction,minDistance:f.minDistance});
    camera.position.set(fit.centerX,fit.centerY,fit.distance);camera.lookAt(fit.centerX,fit.centerY,0);camera.updateMatrixWorld();
    if(spec.motion.camera.elevationDegrees){
      const elevation=THREE.MathUtils.degToRad(spec.motion.camera.elevationDegrees)*smooth((p-timing.wireFadeStart)/timing.wireFadeDuration);
      let distance=fit.distance;
      for(let attempt=0;attempt<12;attempt++){
        camera.position.set(fit.centerX,fit.centerY+distance*Math.sin(elevation),distance*Math.cos(elevation));camera.lookAt(fit.centerX,fit.centerY,0);camera.updateMatrixWorld();
        let overflow=1;
        for(const item of cameraBounds)for(const x of [item.bounds.min.x,item.bounds.max.x])for(const y of [item.bounds.min.y,item.bounds.max.y])for(const z of [item.bounds.min.z,item.bounds.max.z]){
          const q=new THREE.Vector3(x,y,z).project(camera);overflow=Math.max(overflow,Math.abs(q.x)/(small?f.mobileWidthFraction:f.desktopWidthFraction),Math.abs(q.y)/(small?f.mobileHeightFraction:f.desktopHeightFraction));
        }
        if(overflow<=1.001)break;distance*=overflow*1.01;
      }
    }
    if(f.envelope==='radial-drop'){
      // Fixed full fall envelope: no camera movement from glazing through landing.
      const staging=smooth((p-timing.wireFadeStart)/timing.wireFadeDuration);
      const elevation=THREE.MathUtils.degToRad(spec.motion.camera.elevationDegrees||0)*staging;
      const azimuth=THREE.MathUtils.degToRad(spec.motion.camera.azimuthDegrees||0)*staging;
      const lockedFit=fitOrientedPoints(radialPoints,{centerX:fit.centerX,centerY:fit.centerY,aspect:camera.aspect,fovDegrees:camera.fov,elevation,azimuth,widthFraction:small?f.mobileWidthFraction:f.desktopWidthFraction,heightFraction:small?f.mobileHeightFraction:f.desktopHeightFraction,minDistance:f.minDistance});
      const previousDistance=camera.position.distanceTo(new THREE.Vector3(fit.centerX,fit.centerY,0));
      let distance=previousDistance*(1-lockCamera)+lockedFit*lockCamera;
      if(lockCamera<1){
        const visiblePoints=[];for(const {bounds:b} of bounds)for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z])visiblePoints.push([x,y,z]);
        distance=Math.max(distance,fitOrientedPoints(visiblePoints,{centerX:fit.centerX,centerY:fit.centerY,aspect:camera.aspect,fovDegrees:camera.fov,elevation,azimuth,widthFraction:small?f.mobileWidthFraction:f.desktopWidthFraction,heightFraction:small?f.mobileHeightFraction:f.desktopHeightFraction,minDistance:f.minDistance}));
      }
      camera.position.set(fit.centerX+distance*Math.sin(azimuth)*Math.cos(elevation),fit.centerY+distance*Math.sin(elevation),distance*Math.cos(azimuth)*Math.cos(elevation));
      camera.lookAt(fit.centerX,fit.centerY,0);camera.updateMatrixWorld();
    }
    sheet.style.opacity=String(1-smooth((p-timing.sheetFadeStart)/timing.sheetFadeDuration));
    for(const v of vessels)frontPlacement(v,p);
    const exit=hasPhotos?smooth((motionP-timing.photoStart)/timing.photoDuration):0;
    host.style.opacity=String(1-exit);host.setAttribute('aria-hidden',exit>=.999?'true':'false');
    const background=backgroundAt(p,{...spec.motion.background,fadeToPhoto:{start:hasPhotos?timing.cadEnd+(1-timing.cadEnd)*timing.photoStart:2,end:hasPhotos?endProgress:3}});
    document.body.style.backgroundColor=background.color;
    window.__multiplePage={spec,vessels,camera,progress:p,motionProgress:motionP,endProgress,scrollVhAt:cadScroll.toScrollVh,loaded:true,exit,renderStats};
    renderStats.updateCpuMs=performance.now()-frameStart;
    if(!galleryActive)renderer.render(scene,camera);renderStats.frames++;renderStats.lastCpuMs=performance.now()-frameStart;renderStats.renderCpuMs=renderStats.lastCpuMs-renderStats.updateCpuMs;
  }
  if(hasPhotos)installGallery({gallery:document.querySelector('#gallery'),story,isActive:()=>scrollY/innerHeight*100>=totalVh-.2,onActiveChange:a=>{galleryActive=a;requestFrame()},profile:galleryProfile,source:'multiple-page-review'});
  addEventListener('scroll',requestFrame,{passive:true});image.addEventListener('load',requestFrame);
  await renderer.compileAsync(scene,camera);
  // Upload geometry and warm transparent front/back passes while opacity is zero.
  // Shader compilation alone does not exercise the renderer's two-sided passes.
  renderer.render(scene,camera);
  const gl=renderer.getContext(),fence=gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE,0);gl.flush();
  await new Promise(resolve=>{const poll=()=>{const status=gl.clientWaitSync(fence,0,0);if(status===gl.TIMEOUT_EXPIRED){setTimeout(poll,16);return}gl.deleteSync(fence);resolve()};poll()});
  ready=true;frame();
}
