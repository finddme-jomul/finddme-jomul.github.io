// A circumscribed radial envelope covers every yaw without fitting empty AABB corners.
export function radialEnvelopePoints(items){
  const points=[],segments=64,padding=1/Math.cos(Math.PI/segments);
  for(const {bounds:b} of items){
    const x=(b.min.x+b.max.x)/2,z=(b.min.z+b.max.z)/2,r=(b.max.x-b.min.x)/2*padding;
    for(let i=0;i<segments;i++)for(const y of [b.min.y,b.max.y]){const a=i*2*Math.PI/segments;points.push([x+r*Math.cos(a),y,z+r*Math.sin(a)])}
  }
  return points;
}
export function fitOrientedPoints(points,{centerX,centerY,aspect,fovDegrees,elevation,azimuth,widthFraction,heightFraction,minDistance}){
  const ca=Math.cos(azimuth),sa=Math.sin(azimuth),ce=Math.cos(elevation),se=Math.sin(elevation),tan=Math.tan(fovDegrees*Math.PI/360);
  let distance=minDistance;
  for(const [px,py,z] of points){const x=px-centerX,y=py-centerY,right=ca*x-sa*z,up=-sa*se*x+ce*y-ca*se*z,depth=sa*ce*x+se*y+ca*ce*z;
    distance=Math.max(distance,depth+Math.abs(right)/(tan*aspect*widthFraction),depth+Math.abs(up)/(tan*heightFraction));
  }
  return distance*1.005;
}
