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
// Lift, translate above the other objects, lower. Pure progress allows reverse scroll.
export function assemblyPosition(start, step, progress, mode='lift-place') {
  const p=clamp((progress-step.start)/step.duration),target=step.targetPositionMm.map(v=>v/1000);
  if(mode==='direct-drop')return [target[0],target[1]+step.dropHeightMm/1000*(1-smooth(p)),target[2]];
  const top=Math.max(start[1],target[1])+step.liftMm/1000;
  if(p<1/3)return [start[0],start[1]+(top-start[1])*smooth(p*3),start[2]];
  if(p<2/3){const t=smooth(p*3-1);return [start[0]+(target[0]-start[0])*t,top,start[2]+(target[2]-start[2])*t];}
  return [target[0],top+(target[1]-top)*smooth(p*3-2),target[2]];
}
