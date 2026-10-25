// Deterministic, reversible collection of earlier CAD fronts; no extra 3D scene.
const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
export function sheetFront(entry,id,rect){
 const b=entry?.frontBoxes[id];if(!b)return null;
 const scale=Math.min(rect.width/entry.pagePx[0],rect.height/entry.pagePx[1]);
 const w=entry.pagePx[0]*scale,h=entry.pagePx[1]*scale;
 return {x:rect.left+(rect.width-w)/2+w*b.cx,y:rect.top+(rect.height-h)/2+h*b.cy,w:w*b.width,h:h*b.height};
}
export function retainedFront(spec,id,p,rect,viewport){
 const pages=spec.cadPresentation.pages,t=spec.motion.timing;
 const sourceId=spec.parts.find(part=>part.id===id)?.sourcePartId||id;
 const allowed=spec.cadPresentation.handoffPartIds;
 if(allowed&&!allowed.includes(sourceId))return null;
 const index=pages.findIndex(page=>page.frontBoxes[id]);if(index<0)return null;
 const source=sheetFront(pages[index],id,rect);
 if(index===pages.length-1)return p<t.frontMoveStart?null:{source,opacity:1,retaining:false,stage:'moving'};
 const previous=pages.slice(0,-1).flatMap(page=>page.partIds).filter(pid=>!allowed||allowed.includes(pid)),slot=previous.indexOf(sourceId);
 const cell=(viewport.width-32)/previous.length;
 const scale=Math.min((cell-12)/source.w,58/source.h,1);
 const tray={x:16+(slot+.5)*cell,y:44,w:source.w*scale,h:source.h*scale};
 if(p>=t.frontMoveStart)return {source:tray,opacity:1,retaining:false,stage:'moving'};
 const span=t.sheetFadeStart/pages.length,start=(index+.80)*span,end=(index+1)*span;
 if(p<=start)return null;
 const at=smooth((p-start)/(end-start));
 return {source:Object.fromEntries(['x','y','w','h'].map(k=>[k,source[k]+(tray[k]-source[k])*at])),opacity:smooth((p-start)/(span*.04)),retaining:true,stage:p>=end?'retained':'collecting'};
}
