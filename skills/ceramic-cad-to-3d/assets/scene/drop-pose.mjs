import {smooth,continuingAxis} from './glaze-motion.mjs';
// Input-driven variation; no frame-time random numbers and exact upright landing.
export function dropPose(m,g,timing,assembly,step,t,drop,settle,axisFade=1){
  if(m.fixedOrientation)return {bodyY:0,orbitY:0,tiltX:0,tiltZ:0};
  const end=assembly.start+assembly.duration*(step.start+step.duration);
  const releaseEnd=assembly.start+assembly.duration*(step.start+step.duration*.7);
  const last=timing.accentGlazeStart===null?timing.baseGlazeStart+timing.baseGlazeDuration:timing.accentGlazeStart+timing.accentGlazeDuration;
  const spin=smooth((t-timing.baseGlazeStart)/(end-timing.baseGlazeStart));
  const axis=continuingAxis(m.axisTiltDegrees,m.axisDriftZDegrees,m.axisDriftXDegrees,drop,settle,smooth((t-last)/(releaseEnd-last)),g.axisRetainFraction,g.maxAxisTiltDegrees);
  const rad=Math.PI/180;
  return {bodyY:(360*(drop*m.turns+spin*g.spinTurns)+(m.spinPhaseDegrees??0)*(1-spin))*rad,
    orbitY:(360*(drop*m.orbitTurns+spin*g.axisPrecessionTurns)+(m.axisPhaseDegrees??0)*(1-spin))*rad,
    tiltX:axis.xDegrees*rad*axisFade,tiltZ:axis.zDegrees*rad*axisFade};
}
