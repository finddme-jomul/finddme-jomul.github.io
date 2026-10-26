import {createMotion,clamp} from './motion.mjs';
const config=await (await fetch('./motion.json')).json();
const host=document.querySelector('#drawing'),select=document.querySelector('#part'),seek=document.querySelector('#seek'),button=document.querySelector('#play'),status=document.querySelector('#status');
const mobile=matchMedia('(max-width:700px)'),reduce=matchMedia('(prefers-reduced-motion:reduce)');
for(const part of config.parts){const option=document.createElement('option');option.value=part.id;option.textContent=part.id.replaceAll('-',' ');select.append(option);}
const scrollToggle=document.querySelector('#scroll-mode');
let scrollFrame=null;
function scrollProgress(){const root=document.scrollingElement;const span=root.scrollHeight-root.clientHeight;return span>0?clamp(root.scrollTop/span):0;}
function scrollRender(){scrollFrame=null;if(scrollToggle.checked&&motion&&window.__drawingMotion.ready)render(scrollProgress()*config.durationSeconds);}
function scheduleScroll(){if(scrollToggle.checked&&scrollFrame===null)scrollFrame=requestAnimationFrame(scrollRender);}
function scrollMode(){
 pause();document.body.classList.toggle('scroll-mode',scrollToggle.checked);
 button.disabled=scrollToggle.checked||reduce.matches;
 if(scrollToggle.checked)scheduleScroll();
 else if(scrollFrame!==null){cancelAnimationFrame(scrollFrame);scrollFrame=null;}
}
scrollToggle.addEventListener('change',scrollMode);
window.addEventListener('scroll',scheduleScroll,{passive:true});
window.addEventListener('resize',scheduleScroll);
let motion,frame=null,start=0,playing=false,token=0;
function pause(){playing=false;if(frame!==null)cancelAnimationFrame(frame);frame=null;button.textContent='Play';}
function render(t){if(!motion)return;const p=motion.render(t);seek.value=String(Math.round(p*1000));status.textContent=`${(p*config.durationSeconds).toFixed(1)} / ${config.durationSeconds}s`;return p;}
function tick(now){frame=null;if(!playing)return;const p=render((now-start)/1000);if(p>=1)pause();else frame=requestAnimationFrame(tick);}
async function load(){
 const request=++token,p=motion?.progress||0;pause();button.disabled=true;
 const part=config.parts.find(p=>p.id===select.value),layout=mobile.matches?'mobile':'desktop';
 const response=await fetch(part[layout]);if(!response.ok)throw Error('Drawing failed to load');const xml=await response.text();
 if(request!==token)return;
 const doc=new DOMParser().parseFromString(xml,'image/svg+xml');if(doc.querySelector('parsererror'))throw Error('Invalid SVG');
 const svg=document.importNode(doc.documentElement,true);host.replaceChildren(svg);
 await document.fonts.ready;if(request!==token)return;
 motion=createMotion(svg,config.durationSeconds,reduce.matches,part.cameraKeys);render(p*config.durationSeconds);
 document.querySelector('#read').href='./reading.html#'+encodeURIComponent(part.id);
 button.disabled=reduce.matches||scrollToggle.checked;window.__drawingMotion.ready=true;
 scrollToggle.disabled=reduce.matches;scheduleScroll();
}
window.__drawingMotion={ready:false,render(t){pause();return render(t);},setProgress(p){if(!Number.isFinite(p))throw Error('Progress must be finite');pause();return render(clamp(p)*config.durationSeconds);},
 snapshot(){return motion.snapshot();},get finalRestored(){return motion.finalRestored;},get writes(){return motion.writes;},get playing(){return playing;},get duration(){return config.durationSeconds;}};
button.addEventListener('click',()=>{if(playing){pause();return;}if(reduce.matches||scrollToggle.checked)return;const p=motion.progress>=1?0:motion.progress;start=performance.now()-p*config.durationSeconds*1000;playing=true;button.textContent='Pause';frame=requestAnimationFrame(tick);});
seek.addEventListener('input',()=>{
 const p=Number(seek.value)/1000;
 if(scrollToggle.checked){const root=document.scrollingElement;root.scrollTop=p*(root.scrollHeight-root.clientHeight);}
 window.__drawingMotion.setProgress(p);
});
function reload(){window.__drawingMotion.ready=false;load().catch(fail);}
function fail(error){pause();status.textContent=error.message;button.disabled=true;window.__drawingMotion.error=error.message;}
select.addEventListener('change',reload);mobile.addEventListener('change',reload);reduce.addEventListener('change',reload);
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
load().catch(fail);
