// Detect a dropped second coat or frozen body/axis during either coating phase.
const fs=require('node:fs'),assert=require('node:assert/strict');
const puppeteer=require('/home/pptruser/node_modules/puppeteer');
(async()=>{
 const browser=await puppeteer.launch({headless:true,executablePath:process.env.CERAMIC_CHROME,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
 const samples=[];
 try{
  const page=await browser.newPage();await page.setViewport({width:1440,height:900});
  await page.goto(process.env.CERAMIC_CANDIDATE,{waitUntil:'networkidle0'});await page.waitForFunction(()=>window.__multiplePage?.loaded);
  for(const motion of [.6,.68,.71,.82,.89]){
   await page.evaluate(t=>{const m=window.__multiplePage.spec.motion,p=m.timing.cadEnd+(1-m.timing.cadEnd)*t;scrollTo(0,p*(m.storyHeightVh-100)*innerHeight/100)},motion);
   await page.waitForFunction(t=>Math.abs(window.__multiplePage.motionProgress-t)<.001,{},motion);
   samples.push(await page.evaluate(()=>window.__multiplePage.vessels.map(v=>({id:v.id,base:v.state.base,accent:v.state.accent,body:v.spin.rotation.y,axis:v.orbit.rotation.y,colours:Array.from(v.geometry.attributes.color.array)}))));
  }
  for(let part=0;part<2;part++){
   for(let step=1;step<samples.length;step++){
    const a=samples[step-1][part],b=samples[step][part];assert(b.body>a.body&&b.axis>a.axis,'rotation froze during coating');
   }
   const a=samples[2][part],b=samples[4][part];assert.equal(a.base,1);assert.equal(b.base,1);assert.equal(a.accent,0);assert(b.accent>.99);
   const changed=b.colours.reduce((n,value,i)=>n+(Math.abs(value-a.colours[i])>.001?1:0),0);
   assert(changed>100,'second coat did not change the mesh colours');
   b.changedChannels=changed;
  }
 }finally{await browser.close();}
 for(const row of samples)for(const part of row)delete part.colours;
 fs.mkdirSync(process.env.CERAMIC_REPORT,{recursive:true});fs.writeFileSync(process.env.CERAMIC_REPORT+'/report.json',JSON.stringify({status:'passed',samples},null,2)+'\n');
 console.log('MULTIPLE_MATERIAL_OK');
})().catch(e=>{console.error(e);process.exit(1)});
