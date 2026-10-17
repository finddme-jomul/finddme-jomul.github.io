import {smooth,clamp,glazeRevealAt} from './glaze-motion.mjs';

// Surface identity comes from the CAD profile, not camera-facing normals.
export function exteriorAt(profile, radiusMm, heightMm) {
  for(let i=1;i<profile.length;i++) {
    const [ra,za]=profile[i-1],[rb,zb]=profile[i];
    if(za-.001<=heightMm&&heightMm<=zb+.001) {
      const r=ra+(rb-ra)*(heightMm-za)/(zb-za);
      return Math.abs(radiusMm-r)<.15;
    }
  }
  return false;
}
export function inRegion(region, exterior, heightMm) {
  return region.surface==='all'||(exterior&&heightMm>=region.minHeightMm-.001&&heightMm<=region.maxHeightMm+.001);
}
export function coatingWeights(spec, exterior, heightMm, height, first, second, sweep) {
  const fraction=clamp(heightMm/height);
  return [first,second].map((p,i)=>p<=0?0:inRegion(spec.layers[i].region,exterior,heightMm)?glazeRevealAt(fraction,p,sweep):0);
}
export function landingEase(value){const t=clamp(value);return t*t*t*(10+t*(-15+6*t));}
// Lift, translate above the other objects, lower. Pure progress allows reverse scroll.
export function assemblyPosition(start, step, progress, mode='lift-place', landing=null) {
  const p=clamp((progress-step.start)/step.duration),target=step.targetPositionMm.map(v=>v/1000);
  if(mode==='direct-drop')return [target[0],target[1]+step.dropHeightMm/1000*(1-(landing==='soft-spin'?landingEase(p):smooth(p))),target[2]];
  const top=Math.max(start[1],target[1])+step.liftMm/1000;
  if(p<1/3)return [start[0],start[1]+(top-start[1])*smooth(p*3),start[2]];
  if(p<2/3){const t=smooth(p*3-1);return [start[0]+(target[0]-start[0])*t,top,start[2]+(target[2]-start[2])*t];}
  return [target[0],top+(target[1]-top)*smooth(p*3-2),target[2]];
}

// Bound colour interpolation to <= 1/80 of height on coarse feature faces.
// Geometry remains on the original triangles; CAD wire geometry is untouched.
export function featureCoatingBands(positions,normals,flags,height){
  const out=[],normalOut=[],exterior=[];
  const clip=(poly,y,below)=>{
    const result=[];
    for(let i=0;i<poly.length;i++){
      const a=poly[i],b=poly[(i+1)%poly.length],inside=v=>below?v[1]<=y:v[1]>=y;
      if(inside(a))result.push(a);
      if(inside(a)!==inside(b)){const t=(y-a[1])/(b[1]-a[1]);result.push(a.map((v,j)=>v+(b[j]-v)*t));}
    }return result;
  };
  const emit=(poly,flag)=>{for(let i=1;i+1<poly.length;i++)for(const v of [poly[0],poly[i],poly[i+1]]){out.push(...v.slice(0,3));const n=Math.hypot(...v.slice(3));normalOut.push(...v.slice(3).map(x=>x/n));exterior.push(flag)}};
  for(let i=0;i<positions.length;i+=9){
    let poly=[0,3,6].map(j=>[...positions.slice(i+j,i+j+3),...normals.slice(i+j,i+j+3)]);
    const lo=Math.min(...poly.map(v=>v[1])),hi=Math.max(...poly.map(v=>v[1]));
    for(let k=1;k<80;k++){const y=height*k/80;if(y<=lo+1e-9||y>=hi-1e-9)continue;emit(clip(poly,y,true),flags[i/3]);poly=clip(poly,y,false);}
    emit(poly,flags[i/3]);
  }
  return {positions:out,normals:normalOut,exterior};
}
