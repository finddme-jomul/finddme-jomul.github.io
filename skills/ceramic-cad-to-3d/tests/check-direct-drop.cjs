// Sample the complete descent, including camera-induced apparent movement.
const fs=require('node:fs'),assert=require('node:assert/strict');
const puppeteer=require('/home/pptruser/node_modules/puppeteer');
(async()=>{
 const browser=await puppeteer.launch({headless:true,executablePath:process.env.CERAMIC_CHROME,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
 fs.mkdirSync(process.env.CERAMIC_REPORT,{recursive:true});
 const results=[];
 try{
  for(const [layout,width,height] of [['desktop',1440,900],['short',1280,720],['mobile',390,844],['mobile-short',390,700]]){
   const page=await browser.newPage();page.setDefaultTimeout(120000);page.setDefaultNavigationTimeout(120000);await page.setViewport({width,height});
   await page.goto(process.env.CERAMIC_CANDIDATE,{waitUntil:'networkidle0'});
   await page.waitForFunction(()=>window.__multiplePage?.loaded);
   if(process.env.CERAMIC_ASSERT_SOURCE_FRONTS==='1'){
    await page.evaluate(()=>scrollTo(0,.18*(window.__multiplePage.spec.motion.storyHeightVh-100)*innerHeight/100));
    await page.waitForFunction(()=>Math.abs(window.__multiplePage.progress-.18)<.001);
    const fronts=await page.evaluate(()=>window.__multiplePage.vessels.filter(v=>Number(v.front.style.opacity)>.01).map(v=>v.part.sourcePartId||v.id));
    assert(fronts.length>0,'CAD handoff must show fronts');assert.equal(fronts.length,new Set(fronts).size,'One CAD front per source');
    await page.screenshot({path:process.env.CERAMIC_REPORT+'/'+layout+'-fronts.png'});
   }
   const info=await page.evaluate(()=>({assembly:window.__multiplePage.spec.assembly,timing:window.__multiplePage.spec.motion.timing,workload:window.__multiplePage.vessels.reduce((a,v)=>({instances:a.instances+1,triangles:a.triangles+(v.geometry.index?.count||v.geometry.attributes.position.count)/3,wireSegments:a.wireSegments+v.wireGeometry.attributes.position.count/2}),{instances:0,triangles:0,wireSegments:0})}));
   const {assembly,timing}=info;
   const begin=timing.accentGlazeStart===null?timing.baseGlazeStart+timing.baseGlazeDuration:timing.accentGlazeStart+timing.accentGlazeDuration;
   const samples=[];
   for(let i=0;i<=100;i++){
    const t=begin+(assembly.start+assembly.duration-begin)*i/100;
    await page.evaluate(t=>{const m=window.__multiplePage,s=m.spec.motion;scrollTo(0,(s.timing.cadEnd+(1-s.timing.cadEnd)*t)*(s.storyHeightVh-100)*innerHeight/100);},t);
    await page.waitForFunction(t=>Math.abs(window.__multiplePage.motionProgress-t)<.0003,{},t);
    samples.push(await page.evaluate(()=>{const m=window.__multiplePage;return {scrollY,t:m.motionProgress,camera:m.camera.position.toArray(),parts:m.vessels.map(v=>{const q=v.main.position.clone().project(m.camera);return {id:v.id,y:v.main.position.y,screenY:(1-q.y)*innerHeight/2,drop:v.state.drop,assembly:v.state.assembly};})};}));
   }
   await page.screenshot({path:process.env.CERAMIC_REPORT+'/'+layout+'-landed.png'});
   // Returning to an earlier scroll position must restore the same camera/pose.
   for(const previous of samples.filter((_,i)=>i%10===0).reverse()){
    await page.evaluate(y=>scrollTo(0,y),previous.scrollY);
    await page.waitForFunction(t=>Math.abs(window.__multiplePage.motionProgress-t)<1e-8,{},previous.t);
    const restored=await page.evaluate(()=>{const m=window.__multiplePage;return m.vessels.map(v=>{const q=v.main.position.clone().project(m.camera);return (1-q.y)*innerHeight/2;});});
    restored.forEach((y,i)=>assert(Math.abs(y-previous.parts[i].screenY)<1,'Reverse scroll must restore screen position'));
   }
   results.push({layout,assembly,begin,workload:info.workload,samples});await page.close();
  }
  fs.mkdirSync(process.env.CERAMIC_REPORT,{recursive:true});
  fs.writeFileSync(process.env.CERAMIC_REPORT+'/trajectory.json',JSON.stringify(results,null,2));
  if(process.env.CERAMIC_ASSERT_DESCENT==='1')for(const row of results){
   for(let i=1;i<row.samples.length;i++){
    const a=row.samples[i-1],b=row.samples[i];
    if(a.t<row.begin-.002)continue;
    for(let j=0;j<b.parts.length;j++){
     assert(b.parts[j].y<=a.parts[j].y+1e-6,'World-space rise during direct drop');
     assert(b.parts[j].screenY>=a.parts[j].screenY-0.5,'Screen-space rise during direct drop: '+row.layout+' '+b.parts[j].id);
    }
   }
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
