"""The opt-in varying-axis direct-drop rig, in degrees, shared with CAD checking."""
import math
from assembly_geometry import smooth

def pose(m,g,timing,assembly,step,t,drop=1,settle=1,axis_fade=1):
    if m.get('fixedOrientation'):return (0,0,0,0)
    end=assembly['start']+assembly['duration']*(step['start']+step['duration'])
    landing_start=assembly['start']+assembly['duration']*step['start']
    last=timing['baseGlazeStart']+timing['baseGlazeDuration'] if timing['accentGlazeStart'] is None else timing['accentGlazeStart']+timing['accentGlazeDuration']
    spin=.65*smooth((t-timing['baseGlazeStart'])/(landing_start-timing['baseGlazeStart']))+.35*smooth((t-landing_start)/(end-landing_start))
    release=smooth((t-landing_start)/(end-landing_start));settled=smooth(settle)
    start=m['axisTiltDegrees'];retained=math.copysign(min(abs(start)*g['axisRetainFraction'],g['maxAxisTiltDegrees']),start)*(1-smooth(release)) if start else 0
    z=((start*(1-.35*drop)+m['axisDriftZDegrees']*math.sin(math.pi*drop))*(1-settled)+retained*settled)*axis_fade
    x=m['axisDriftXDegrees']*math.sin(math.pi*drop)*(1-settled)*axis_fade
    return (360*(drop*m['turns']+spin*g['spinTurns'])+m.get('spinPhaseDegrees',0)*(1-spin),360*(drop*m['orbitTurns']+spin*g['axisPrecessionTurns'])+m.get('axisPhaseDegrees',0)*(1-spin),x,z)

def transform(x,y,z,angles):
    body,orbit,tx,tz=map(math.radians,angles)
    def rz(x,y,z,a):return (x*math.cos(a)-y*math.sin(a),x*math.sin(a)+y*math.cos(a),z)
    x,y,z=rz(x,y,z,body)
    x,z=x*math.cos(tz)-z*math.sin(tz),x*math.sin(tz)+z*math.cos(tz)
    y,z=y*math.cos(tx)-z*math.sin(tx),y*math.sin(tx)+z*math.cos(tx)
    return rz(x,y,z,orbit)
