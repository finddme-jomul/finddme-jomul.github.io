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
export function inRegion(region, exterior, heightMm, surface=null) {
  if(region.surface==='planar-xy')return !!surface&&exterior&&surface.normalZ>.9999&&Math.abs(surface.z-region.planeZMm)<.001&&region.rectanglesMm.some(([x0,y0,x1,y1])=>surface.x>=x0&&surface.x<=x1&&surface.y>=y0&&surface.y<=y1);
  return region.surface==='all'||(exterior&&heightMm>=region.minHeightMm-.001&&heightMm<=region.maxHeightMm+.001);
}
export function coatingWeights(spec, exterior, heightMm, height, first, second, sweep, surface=null) {
  const fraction=clamp(heightMm/height);
  return [first,second].map((p,i)=>p<=0?0:inRegion(spec.layers[i].region,exterior,heightMm,surface)?glazeRevealAt(fraction,p,sweep):0);
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

// Split planar faces at every mask boundary. Each emitted triangle owns its
// centroid classification, so adjacent colors never interpolate across a boundary.
// Offset restores original CAD XY/Z from the centered Y-up render mesh.
export function featurePlanarRegions(mesh, regions, offset){
  const masks=regions.filter(r=>r.surface==='planar-xy');
  if(!masks.length)return {...mesh,surfaces:null};
  const out={positions:[],normals:[],exterior:[],surfaces:[]};
  const planes=[...new Set(masks.flatMap(r=>r.rectanglesMm.flatMap(v=>[v[0],v[2]])))].map(x=>[0,x/1000-offset[0]]);
  planes.push(...[...new Set(masks.flatMap(r=>r.rectanglesMm.flatMap(v=>[v[1],v[3]])))].map(y=>[2,-y/1000-offset[2]]));
  function clip(poly,axis,cut,side){
    const result=[];
    for(let i=0;i<poly.length;i++){
      const a=poly[i],b=poly[(i+1)%poly.length],inside=v=>side*(v[axis]-cut)>=0;
      if(inside(a))result.push(a);
      if(inside(a)!==inside(b)){const t=(cut-a[axis])/(b[axis]-a[axis]);result.push(a.map((v,j)=>v+(b[j]-v)*t));}
    }return result;
  }
  for(let i=0;i<mesh.positions.length;i+=9){
    const tri=[0,3,6].map(j=>[...mesh.positions.slice(i+j,i+j+3),...mesh.normals.slice(i+j,i+j+3)]);
    let polys=[tri];
    const eligible=mesh.exterior[i/3]&&tri.every(v=>v[4]>.9999)&&masks.some(r=>tri.every(v=>Math.abs((v[1]+offset[1])*1000-r.planeZMm)<.001));
    if(eligible)for(const [axis,cut] of planes)polys=polys.flatMap(poly=>Math.min(...poly.map(v=>v[axis]))<cut-1e-10&&Math.max(...poly.map(v=>v[axis]))>cut+1e-10?[clip(poly,axis,cut,1),clip(poly,axis,cut,-1)]:[poly]);
    for(const poly of polys)for(let k=1;k+1<poly.length;k++){
      const vertices=[poly[0],poly[k],poly[k+1]],center=[0,1,2].map(j=>vertices.reduce((sum,v)=>sum+v[j],0)/3);
      const surface={x:(center[0]+offset[0])*1000,y:-(center[2]+offset[2])*1000,z:(center[1]+offset[1])*1000,normalZ:vertices.reduce((sum,v)=>sum+v[4],0)/3};
      for(const v of vertices){out.positions.push(...v.slice(0,3));out.normals.push(...v.slice(3));out.exterior.push(mesh.exterior[i/3]);out.surfaces.push(surface);}
    }
  }return out;
}
