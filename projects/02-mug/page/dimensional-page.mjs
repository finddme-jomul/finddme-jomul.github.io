import {createMotion} from './drawing-motion.mjs';
export function drawingPace(config,base,unitScale=1){
 const bridge=config?.drawingBridge,extra=bridge?.extraScrollVh||0,end=(bridge?.end||0)*base/unitScale;
 return {extra,from(v){return extra&&v<end+extra?v*end/(end+extra):v-extra;},
 to(v){return extra&&v<end?v*(end+extra)/end:v+extra;}};
}
export async function installDimensionalPage({config,image,sheet,requestFrame}){
 if(!config?.drawingBridge)return null;
 const bridge=config.drawingBridge;
 const overlay=document.createElement('div');
 overlay.style.cssText='position:fixed;pointer-events:none;overflow:hidden;visibility:hidden';
 sheet.append(overlay);
 image.style.visibility='hidden';
 let motion,url='',generation=0;
 async function load(){
  const next=image.currentSrc||image.src;if(next===url)return;url=next;const token=++generation;
  overlay.style.visibility='hidden';
  const response=await fetch(next);if(!response.ok)throw Error('Dimensional SVG failed');
  const xml=new DOMParser().parseFromString(await response.text(),'image/svg+xml');
  if(token!==generation)return;
  const svg=document.importNode(xml.documentElement,true);overlay.replaceChildren(svg);
  svg.style.cssText='display:block;width:100%;height:100%';
  await document.fonts.ready;
  if(token!==generation)return;
  motion=createMotion(svg,1,matchMedia('(prefers-reduced-motion:reduce)').matches,bridge.cameraKeys);
  overlay.style.visibility='visible';requestFrame();
 }
 function update(progress){
  if(!motion)return;
  const r=image.getBoundingClientRect(),svg=overlay.querySelector('svg'),v=svg.viewBox.baseVal;
  const scale=Math.min(r.width/v.width,r.height/v.height);
  const w=v.width*scale,h=v.height*scale;
  Object.assign(overlay.style,{left:(r.left+(r.width-w)/2)+'px',top:(r.top+(r.height-h)/2)+'px',width:w+'px',height:h+'px'});
  motion.render(Math.max(0,Math.min(1,progress/bridge.end)));
  const link=document.querySelector('.drawing-reader-link');
  if(link)link.hidden=progress>bridge.end;
 }
 image.addEventListener('load',()=>load().catch(e=>window.__jomulViewerLifecycle?.fail(e)));
 await load();
 const api={update,get state(){return motion?.snapshot()},get finalRestored(){return motion?.finalRestored},bridge};
 window.__dimensionalPage=api;
 return api;
}
