const fs=require('fs'),assert=require('assert/strict'),puppeteer=require('/home/pptruser/node_modules/puppeteer');
(async()=>{
 const b=await puppeteer.launch({headless:true,executablePath:process.env.CERAMIC_CHROME,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});const rows=[];fs.mkdirSync(process.env.CERAMIC_REPORT,{recursive:true});
 try{for(const [name,width,height] of [['wide',1920,900],['mobile',390,844]]){
  const p=await b.newPage();p.setDefaultTimeout(120000);p.setDefaultNavigationTimeout(120000);await p.setViewport({width,height});await p.goto(process.env.CERAMIC_CANDIDATE,{waitUntil:'networkidle0'});await p.waitForFunction(()=>window.__multiplePage?.loaded);
  for(const progress of [.23,.28,.36,.44,.48,.52,.60,.72,.80,.85]){
   await p.evaluate(v=>{const m=window.__multiplePage;scrollTo(0,m.scrollVhAt(Math.min(v,m.endProgress))*innerHeight/100)},progress);
   await p.waitForFunction(v=>Math.abs(window.__multiplePage.progress-Math.min(v,window.__multiplePage.endProgress))<.001,{},progress);
   const result=await p.evaluate(()=>{
    const m=window.__multiplePage,board=m.vessels.find(v=>v.part.motion.fixedOrientation),points=[];
    const box=board.geometry.boundingBox.clone().applyMatrix4(board.spin.matrixWorld);
    // A horizontal foundation cannot hide these points if the camera-to-point segment stays above its top plane.
    for(const v of m.vessels.filter(v=>v!==board)){
     const b=v.geometry.boundingBox;
     for(const f of [.5,.9]){
      const point=v.main.position.clone().set((b.min.x+b.max.x)/2,b.min.y+(b.max.y-b.min.y)*f,(b.min.z+b.max.z)/2).applyMatrix4(v.spin.matrixWorld);
      const below=point.y<=box.max.y,ratio=(box.max.y-m.camera.position.y)/(point.y-m.camera.position.y);
      const hit=m.camera.position.clone().lerp(point,ratio);
      const occluded=ratio>0&&ratio<1&&hit.x>=box.min.x&&hit.x<=box.max.x&&hit.z>=box.min.z&&hit.z<=box.max.z;
      points.push({id:v.id,f,below,occluded});
     }
    }
    return {progress:m.progress,points,boardTilt:[board.tilt.rotation.x,board.tilt.rotation.z],angles:m.vessels.slice(1).map(v=>v.spin.rotation.y),durations:m.vessels.slice(1).map(v=>v.part.motion.dropDurationScale)};
   });
   assert(result.points.every(v=>!v.occluded),name+' board occludes '+JSON.stringify(result.points.filter(v=>v.occluded)));
   assert(result.boardTilt.every(v=>v===0));assert(new Set(result.durations).size>20);
   if(progress===.44)assert(new Set(result.angles.map(v=>v.toFixed(4))).size>20);
   rows.push({viewport:name,...result});
   if([.28,.44,.52,.85].includes(progress))await p.screenshot({path:process.env.CERAMIC_REPORT+'/'+name+'-'+progress+'.png'});
  }
  const trajectory=[];
  for(let i=0;i<=32;i++){
   const time=.63+(.79-.63)*i/32;
   await p.evaluate(t=>{const m=window.__multiplePage,c=m.spec.motion.timing.cadEnd;scrollTo(0,m.scrollVhAt(c+(1-c)*t)*innerHeight/100)},time);
   await p.waitForFunction(t=>Math.abs(window.__multiplePage.motionProgress-t)<.0003,{},time);
   const sample=await p.evaluate(()=>{const m=window.__multiplePage;return {scrollY,progress:m.progress,camera:m.camera.position.toArray(),parts:m.vessels.map(v=>({id:v.id,y:v.main.position.y,screenY:(1-v.main.position.clone().project(m.camera).y)*innerHeight/2,body:v.spin.rotation.y,axis:v.orbit.rotation.y,tilt:v.tilt.rotation.toArray().slice(0,3)}))}});
   if(i){const prev=trajectory[i-1];sample.camera.forEach((v,j)=>assert(Math.abs(v-prev.camera[j])<1e-9,'Landing camera must stay fixed'));sample.parts.forEach((v,j)=>{assert(v.y<=prev.parts[j].y+1e-8,'World re-ascent');assert(v.screenY>=prev.parts[j].screenY-.5,'Screen re-ascent')})}
   trajectory.push(sample);
  }
  for(const previous of [trajectory[24],trajectory[8],trajectory[0]]){
   await p.evaluate(y=>scrollTo(0,y),previous.scrollY);await p.waitForFunction(value=>Math.abs(window.__multiplePage.progress-value)<1e-8,{},previous.progress);
   const restored=await p.evaluate(()=>window.__multiplePage.vessels.map(v=>({id:v.id,y:v.main.position.y,screenY:(1-v.main.position.clone().project(window.__multiplePage.camera).y)*innerHeight/2,body:v.spin.rotation.y,axis:v.orbit.rotation.y,tilt:v.tilt.rotation.toArray().slice(0,3)})));
   assert.deepEqual(restored,previous.parts,'Reverse scroll pose must be deterministic');
  }
  rows.push({viewport:name,trajectory});
  await p.close();console.log('DROP_VISIBILITY_OK',name)
 }}finally{await b.close()}
 fs.writeFileSync(process.env.CERAMIC_REPORT+'/visibility.json',JSON.stringify(rows,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
