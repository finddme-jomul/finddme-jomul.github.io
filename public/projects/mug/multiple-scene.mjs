// Two-part scene mode; inputs retain CAD IDs, ordered coatings and reviewed motion.
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {smooth,clamp,continuingAxis,glazeRevealAt,glazeSpinAt,sprayCoverage} from './scene/glaze-motion.mjs';
import {applyAxisPose} from './scene/axis-motion.mjs';
import {fitComposition} from './scene/composition-framing.mjs';
import {backgroundAt} from './scene/background-transition.mjs';
import {installGallery} from './gallery.js';
import {galleryProfile} from './gallery-config.js';

export async function startMultiple(spec) {
  const host=document.querySelector('#viewer'),story=document.querySelector('#story');
  const sheet=document.querySelector('#cad-sheet'),image=document.querySelector('#cad-sheet-image');
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.45;
  host.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(32,1,.01,10);
  scene.add(new THREE.HemisphereLight(0xffffff,0xc8c7c2,1.7));
  for(const [x,y,z,power] of [[-.3,.35,.5,3.5],[.3,.2,-.2,2.2]]){const lamp=new THREE.PointLight(0xffffff,power);lamp.position.set(x,y,z);scene.add(lamp);}
  const timing=spec.motion.timing,layout=spec.motion.layout,glazeMotion=spec.motion.glaze;
  const hasPhotos=spec.ending==='photos';
  const endMotion=hasPhotos?timing.photoStart+timing.photoDuration:timing.photoStart;
  const endProgress=timing.cadEnd+(1-timing.cadEnd)*endMotion;
  const baseVh=spec.motion.storyHeightVh-100,totalVh=baseVh*endProgress;
  story.style.height=`${100+totalVh}vh`;
  let layoutKey='',galleryActive=false;
  function resize(){
    camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);
    const key=innerWidth>700?'desktop':(innerHeight<760?'mobile-short':'mobile');
    if(key!==layoutKey){layoutKey=key;image.src='./assets/'+spec.sheets[key].file;}
  }
  addEventListener('resize',resize);resize();await image.decode();
  const vessels=await Promise.all(spec.parts.map(async part=>{
    const profile=await fetch(`./assets/${part.id}/outer-profile.json`).then(r=>{if(!r.ok)throw Error('Profile failed');return r.json()});
    const gltf=await new GLTFLoader().loadAsync(`./assets/${part.id}/model.glb`);
    const meshes=[];gltf.scene.traverse(n=>{if(n.isMesh)meshes.push(n)});
    if(meshes.length!==1)throw Error('Surface exporter must supply one complete mesh per vessel');
    const original=meshes[0];original.updateWorldMatrix(true,false);
    const geometry=original.geometry.clone().applyMatrix4(original.matrixWorld);geometry.computeBoundingBox();
    const height=part.dimensionsMm.height/1000;
    if(Math.abs(geometry.boundingBox.max.y-geometry.boundingBox.min.y-height)>.001)throw Error('CAD/model height drift');
    const main=new THREE.Group(),orbit=new THREE.Group(),tilt=new THREE.Group(),spin=new THREE.Group();
    scene.add(main);main.add(orbit);orbit.add(tilt);tilt.add(spin);spin.position.y=-(geometry.boundingBox.min.y+geometry.boundingBox.max.y)/2;
    const g=part.glazePreview,clay=new THREE.Color(g.clayHex),base=new THREE.Color(g.baseHex),warm=new THREE.Color(g.baseWarmHex||g.baseHex),accent=new THREE.Color(g.accentHex),accentWarm=new THREE.Color(g.accentWarmHex||g.accentHex);
    const positions=geometry.attributes.position,values=[];
    for(let i=0;i<positions.count;i++){
      const fraction=clamp(positions.getY(i)/height),angle=Math.atan2(positions.getZ(i),positions.getX(i));
      values.push({fraction,coverage:sprayCoverage(angle,fraction,part.accentCenterAngle,part.accentWidthScale),base:base.clone().lerp(warm,.2+.09*Math.sin(angle*5+fraction*12)),accent:accent.clone().lerp(accentWarm,g.accentWarmMix||0)});
    }
    const colours=new THREE.BufferAttribute(new Float32Array(positions.count*3),3);geometry.setAttribute('color',colours);
    const material=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.9,side:THREE.DoubleSide,transparent:true,opacity:0});
    const solid=new THREE.Mesh(geometry,material);spin.add(solid);
    const points=[];
    for(let j=0;j<profile.length;j++){
      const [r,z]=profile[j];
      if(j%4===0||j===profile.length-1)for(let i=0;i<72;i++){const a=i/72*Math.PI*2,b=(i+1)/72*Math.PI*2;points.push(r/1000*Math.cos(a),z/1000,r/1000*Math.sin(a),r/1000*Math.cos(b),z/1000,r/1000*Math.sin(b));}
      if(j)for(let i=0;i<12;i++){const a=i/12*Math.PI*2,[r0,z0]=profile[j-1];points.push(r0/1000*Math.cos(a),z0/1000,r0/1000*Math.sin(a),r/1000*Math.cos(a),z/1000,r/1000*Math.sin(a));}
    }
    const wireMaterial=new THREE.LineBasicMaterial({color:0x56636b,transparent:true,opacity:0,depthWrite:false});
    const wireGeometry=new THREE.BufferGeometry();wireGeometry.setAttribute('position',new THREE.Float32BufferAttribute(points,3));spin.add(new THREE.LineSegments(wireGeometry,wireMaterial));
    let lastPaint='';
    function paint(baseP,accentP){
      const stamp=baseP.toFixed(4)+':'+accentP.toFixed(4);if(stamp===lastPaint)return;lastPaint=stamp;
      for(let i=0;i<values.length;i++){
        const v=values[i],b=glazeRevealAt(v.fraction,baseP,timing.surfaceSweepWidth,glazeMotion.direction),a=part.accentEnabled?glazeRevealAt(v.fraction,accentP,timing.surfaceSweepWidth,glazeMotion.direction)*v.coverage*b:0;
        const c=clay.clone().lerp(v.base,b).lerp(v.accent,a);colours.setXYZ(i,c.r,c.g,c.b);
      }
      colours.needsUpdate=true;material.roughness=.9-.57*baseP;
    }
    const front=document.querySelector(`[data-part="${part.id}"]`);await front.querySelector('img').decode();
    return {id:part.id,part,profile,height,main,orbit,tilt,spin,solid,geometry,material,wireMaterial,front,paint};
  }));
  function frontPlacement(v,p){
    const entry=spec.sheets[layoutKey],box=entry.frontBoxes[v.id],rect=image.getBoundingClientRect();
    const scale=Math.min(rect.width/entry.pagePx[0],rect.height/entry.pagePx[1]);
    const sheetW=entry.pagePx[0]*scale,sheetH=entry.pagePx[1]*scale;
    const source={x:rect.left+(rect.width-sheetW)/2+sheetW*box.cx,y:rect.top+(rect.height-sheetH)/2+sheetH*box.cy,w:sheetW*box.width,h:sheetH*box.height};
    let left=Infinity,right=-Infinity,top=Infinity,bottom=-Infinity;
    for(const [r,z] of v.profile)for(const sign of [-1,1]){
      const q=new THREE.Vector3(sign*r/1000,z/1000,0).applyMatrix4(v.spin.matrixWorld).project(camera);
      const x=(q.x+1)*innerWidth/2,y=(1-q.y)*innerHeight/2;left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
    }
    const move=smooth((p-timing.frontMoveStart)/timing.frontMoveDuration);
    const x=source.x+((left+right)/2-source.x)*move,y=source.y+((top+bottom)/2-source.y)*move;
    const w=source.w+(right-left-source.w)*move,h=source.h+(bottom-top-source.h)*move;
    Object.assign(v.front.style,{left:`${x-w/2}px`,top:`${y-h/2}px`,width:`${w}px`,height:`${h}px`,opacity:String(p>=timing.frontMoveStart?1-smooth((p-timing.frontFadeStart)/timing.frontFadeDuration):0)});
  }
  function frame(){
    const atEnd=scrollY>=document.documentElement.scrollHeight-innerHeight-1;
    const p=atEnd?endProgress:Math.min(endProgress,scrollY/innerHeight*100/baseVh),motionP=clamp((p-timing.cadEnd)/(1-timing.cadEnd)),small=innerWidth<600;
    const bounds=[];
    for(const v of vessels){
      const m=v.part.motion,drop=smooth((motionP-timing.dropStart-m.dropDelay)/timing.dropDuration),settle=smooth((motionP-timing.settleStart-m.dropDelay)/timing.settleDuration);
      const initialX=small?m.entryXMobile:m.entryXDesktop,finalX=small?m.finalXMobile:m.finalXDesktop;
      v.main.position.set(initialX+(finalX-initialX)*drop,(small?layout.mobileEntryY:layout.desktopEntryY)*(1-drop)+v.height*m.settledScale/2*drop+Math.sin(drop*Math.PI*3)*layout.dropBounceY*(1-drop),layout.entryZ*(1-drop));
      const entryScale=small?m.cadToWireScaleMobile:m.cadToWireScale;v.main.scale.setScalar(entryScale+(m.settledScale-entryScale)*drop);
      const lastCoat=timing.accentGlazeStart===null?timing.baseGlazeStart+timing.baseGlazeDuration:timing.accentGlazeStart+timing.accentGlazeDuration;
      const axis=continuingAxis(m.axisTiltDegrees,m.axisDriftZDegrees,m.axisDriftXDegrees,drop,settle,smooth((motionP-lastCoat)/(timing.photoStart-lastCoat)),glazeMotion.axisRetainFraction,glazeMotion.maxAxisTiltDegrees);
      const axisFade=smooth((p-timing.axisFadeStart)/timing.axisFadeDuration);
      const turns=glazeSpinAt(motionP,timing.baseGlazeStart,timing.photoStart,glazeMotion.spinTurns);
      applyAxisPose(v,{bodyY:(drop*m.turns+turns)*2*Math.PI,orbitY:(drop*m.orbitTurns+glazeSpinAt(motionP,timing.baseGlazeStart,timing.photoStart,glazeMotion.axisPrecessionTurns))*2*Math.PI,tiltX:THREE.MathUtils.degToRad(axis.xDegrees)*axisFade,tiltZ:THREE.MathUtils.degToRad(axis.zDegrees)*axisFade});
      const clay=smooth((motionP-timing.clayStart-m.dropDelay)/timing.clayDuration),base=smooth((motionP-timing.baseGlazeStart)/timing.baseGlazeDuration),accent=timing.accentGlazeStart===null?0:smooth((motionP-timing.accentGlazeStart)/timing.accentGlazeDuration);
      v.material.opacity=clay;v.material.depthWrite=clay>.98;v.wireMaterial.opacity=(1-clay)*smooth((p-timing.wireFadeStart)/timing.wireFadeDuration);v.paint(base,accent);v.state={drop,clay,base,accent,turns};
      v.spin.updateWorldMatrix(true,false);const b=v.geometry.boundingBox.clone().applyMatrix4(v.spin.matrixWorld);
      bounds.push({bounds:b,position:{x:0,y:0,z:0},scale:1});
    }
    const f=spec.motion.framing;
    const fit=fitComposition(bounds,{fovDegrees:camera.fov,aspect:camera.aspect,widthFraction:small?f.mobileWidthFraction:f.desktopWidthFraction,heightFraction:small?f.mobileHeightFraction:f.desktopHeightFraction,minDistance:f.minDistance});
    camera.position.set(fit.centerX,fit.centerY,fit.distance);camera.lookAt(fit.centerX,fit.centerY,0);camera.updateMatrixWorld();
    sheet.style.opacity=String(1-smooth((p-timing.sheetFadeStart)/timing.sheetFadeDuration));
    for(const v of vessels)frontPlacement(v,p);
    const exit=hasPhotos?smooth((motionP-timing.photoStart)/timing.photoDuration):0;
    host.style.opacity=String(1-exit);host.setAttribute('aria-hidden',exit>=.999?'true':'false');
    const background=backgroundAt(p,{...spec.motion.background,fadeToPhoto:{start:hasPhotos?timing.cadEnd+(1-timing.cadEnd)*timing.photoStart:2,end:hasPhotos?endProgress:3}});
    document.body.style.backgroundColor=background.color;
    window.__multiplePage={spec,vessels,camera,progress:p,motionProgress:motionP,endProgress,loaded:true,exit};
    if(!galleryActive)renderer.render(scene,camera);requestAnimationFrame(frame);
  }
  if(hasPhotos)installGallery({gallery:document.querySelector('#gallery'),story,isActive:()=>scrollY/innerHeight*100>=totalVh-.2,onActiveChange:a=>{galleryActive=a},profile:galleryProfile,source:'multiple-page-review'});
  frame();
}
