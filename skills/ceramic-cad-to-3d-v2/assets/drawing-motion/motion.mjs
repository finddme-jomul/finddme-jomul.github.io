// Adapted from enesozturk/dimensional-drawing, Copyright (c) 2026 Enes Ozturk, MIT.
// See vendor-license.txt and provenance in the packaged skill.
export const clamp = x => Math.max(0, Math.min(1, x));
export const segment = (t,a,b) => clamp((t-a)/(b-a));
export const ease = x => x<.5 ? 4*x*x*x : 1-Math.pow(-2*x+2,3)/2;
export const out = x => 1-Math.pow(1-x,3);
export const lerp = (a,b,p) => a+(b-a)*p;
export const logZoom = (a,b,p) => Math.exp(lerp(Math.log(a),Math.log(b),p));

export function createMotion(svg, duration, reduced=false, cameraKeys=null) {
  const ns='http://www.w3.org/2000/svg', originals=svg.innerHTML;
  const vb=svg.viewBox.baseVal, W=vb.width, H=vb.height;
  if(!(W>0&&H>0))throw Error('Invalid drawing viewBox');
  function sheetBounds(element){
    const box=element.getBBox();let matrix=new DOMMatrix();
    for(let node=element;node&&node!==svg;node=node.parentElement){
      const local=node.transform?.baseVal.consolidate()?.matrix;
      if(local)matrix=new DOMMatrix([local.a,local.b,local.c,local.d,local.e,local.f]).multiply(matrix);
    }
    const pts=[[box.x,box.y],[box.x+box.width,box.y],[box.x,box.y+box.height],[box.x+box.width,box.y+box.height]].map(([x,y])=>new DOMPoint(x,y).matrixTransform(matrix));
    const x=Math.min(...pts.map(p=>p.x)),y=Math.min(...pts.map(p=>p.y));
    return {x,y,width:Math.max(...pts.map(p=>p.x))-x,height:Math.max(...pts.map(p=>p.y))-y};
  }
  const principal=[...svg.querySelectorAll('[data-view="front"],[data-view="plan"]')]
    .map(e=>e.querySelector('[data-geometry]')||e)
    .map(sheetBounds).sort((a,b)=>b.width*b.height-a.width*a.height)[0];
  if(!principal)throw Error('Drawing has no principal view');
  const z=Math.min(2.4,Math.max(1,Math.min(W/(principal.width*1.3),H/(principal.height*1.3))));
  const focus=[principal.x+principal.width/2,principal.y+principal.height/2];
  // Resolve targets before wrapping; detail geometry is clipped, so use the clip rectangle.
  const keys=cameraKeys?.map(key=>{
    if(key.target==='sheet')return {...key,cx:W/2,cy:H/2};
    const [kind,value]=key.target.split(':');
    const group=[...svg.querySelectorAll(kind==='detail'?'[data-detail]':'[data-view]')]
      .find(e=>e.getAttribute('data-'+kind)===value);
    if(!group)throw Error('Missing camera target '+key.target);
    const rect=group.querySelector('clipPath rect'),box=sheetBounds(rect||group);
    return {...key,cx:box.x+box.width/2,cy:box.y+box.height/2};
  });
  const camera=document.createElementNS(ns,'g');camera.dataset.motionCamera='';
  for(const child of [...svg.children])if(!['defs','style','title','desc'].includes(child.localName))camera.append(child);
  svg.append(camera);
  const counters=new Map();
  const elements=[...camera.querySelectorAll('path,polyline,line,circle,ellipse,rect,text')]
    .filter(e=>!e.closest('defs,clipPath,marker,pattern')&&!(e.localName==='rect'&&!e.closest('[data-part]')));
  const registry=elements.map(e=>{
    const cs=getComputedStyle(e), tag=e.localName;
    const fade=tag==='text'||cs.strokeDasharray!=='none'||cs.stroke==='none'||e.getAttribute('fill')?.startsWith('url(');
    const detail=e.closest('[data-detail]');const view=e.closest('[data-view]')?.dataset.view;
    let phase = detail?.dataset.detail === 'B' ? .55 : detail?.dataset.detail === 'A' ? .45 : (view === 'front' || view === 'plan') ? 0 : view ? .24 : .36;
    if(keys){
      const target=detail?'detail:'+detail.dataset.detail:view?'view:'+view:null;
      const visit=keys.find(k=>k.target===target);
      if(visit)phase=Math.min(phase,Math.max(0,visit.at-.28));
    }
    if(tag==='text')phase+=.16;
    else if(e.matches('.dim,.ext,.lead'))phase+=.12;
    else if(fade)phase+=.07;
    const key=phase.toFixed(2),i=counters.get(key)||0;counters.set(key,i+1);
    const attrs=Object.fromEntries(['style','pathLength'].map(k=>[k,e.getAttribute(k)]));
    return {e,fade,start:phase+Math.min(i*.002,.08),end:Math.min(.98,phase+.25+Math.min(i*.002,.08)),attrs,last:null};
  });
  let progress=0,writes=0;
  const restore=(e,attrs)=>{for(const [k,v] of Object.entries(attrs))v===null?e.removeAttribute(k):e.setAttribute(k,v);};
  function render(seconds){
    if(!Number.isFinite(seconds))throw Error('Time must be finite');
    progress=reduced?1:clamp(seconds/duration);
    const p=ease(segment(progress,.08,.80));
    let zoom=logZoom(z,1,p),cx=lerp(focus[0],W/2,p),cy=lerp(focus[1],H/2,p);
    if(keys){
      const i=Math.max(1,keys.findIndex(k=>k.at>=progress));
      const a=keys[i-1],b=keys[i],u=ease(segment(progress,a.at,b.at));
      zoom=logZoom(a.zoom,b.zoom,u);cx=lerp(a.cx,b.cx,u);cy=lerp(a.cy,b.cy,u);
    }
    const transform=`translate(${W/2-cx*zoom} ${H/2-cy*zoom}) scale(${zoom})`;
    if(camera.getAttribute('transform')!==transform){camera.setAttribute('transform',transform);writes++;}
    for(const it of registry){
      const v=Math.round(segment(progress,it.start,it.end)*400)/400;
      if(v===it.last)continue;it.last=v;writes++;
      restore(it.e,it.attrs);
      if(v===1)continue;
      const base=it.attrs.style ? it.attrs.style+';' : '';
      if(it.fade){it.e.setAttribute('style',base+'opacity:'+out(v));continue;}
      it.e.setAttribute('pathLength','1');
      it.e.setAttribute('style',base+'opacity:'+Math.min(1,v*6)+';stroke-dasharray:1 2;stroke-dashoffset:'+(1-ease(v))+';fill-opacity:'+out(segment(v,.55,1)));
    }
    return progress;
  }
  function snapshot(){return {progress,camera:camera.getAttribute('transform'),elements:registry.map(it=>({style:it.e.getAttribute('style'),pathLength:it.e.getAttribute('pathLength')}))};}
  render(0);
  return {render,snapshot,get progress(){return progress;},get writes(){return writes;},
    get finalRestored(){return registry.every(it=>Object.entries(it.attrs).every(([k,v])=>it.e.getAttribute(k)===v));},
    destroy(){svg.innerHTML=originals;}};
}
