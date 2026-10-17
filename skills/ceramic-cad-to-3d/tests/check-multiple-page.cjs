const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const puppeteer=require('/home/pptruser/node_modules/puppeteer');
(async()=>{
 const report=process.env.CERAMIC_REPORT;fs.mkdirSync(report,{recursive:true});
 const browser=await puppeteer.launch({headless:true,executablePath:process.env.CERAMIC_CHROME,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
 const checks=[];
 try{
  for(const [layout,width,height] of [['desktop',1440,900],['short',1280,720],['mobile',390,844],['mobile-short',390,700]]){
   const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.setViewport({width,height,deviceScaleFactor:1});await page.goto(process.env.CERAMIC_CANDIDATE,{waitUntil:'networkidle0'});
   await page.waitForFunction(()=>window.__multiplePage?.loaded);
   const info=await page.evaluate(()=>({end:window.__multiplePage.endProgress,cad:window.__multiplePage.spec.motion.timing.cadEnd,photos:window.__multiplePage.spec.ending==='photos'}));
   const mp=n=>info.cad+(1-info.cad)*n;
   let step=0;
   for(const p of [0,.12,.23,mp(.2),mp(.4),mp(.6),mp(.68),mp(.77),mp(.86),mp(.925),info.end,mp(.6)]){
    await page.evaluate(p=>scrollTo(0,p*(window.__multiplePage.spec.motion.storyHeightVh-100)*innerHeight/100),p);
    await page.waitForFunction(p=>Math.abs(window.__multiplePage.progress-p)<.002,{},p);await new Promise(r=>setTimeout(r,step===10?1800:120));
    const state=await page.evaluate(()=>{
     const m=window.__multiplePage;
     return {progress:m.progress,exit:m.exit,gallery:document.querySelector('#gallery')?.classList.contains('gallery-active')??false,
      atBottom:Math.abs(scrollY+innerHeight-document.documentElement.scrollHeight)<2,
      images:[...document.querySelectorAll('.gallery-photo img')].map(i=>i.complete&&i.naturalWidth>0),
      parts:m.vessels.map(v=>{
       const a=v.geometry.attributes.position,e=v.spin.matrixWorld.elements,c=m.camera;
       let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
       for(let i=0;i<a.count;i++){
        const q=a.count&&v.solid.position.clone().set(a.getX(i),a.getY(i),a.getZ(i)).applyMatrix4(v.spin.matrixWorld).project(c);
        minX=Math.min(minX,q.x);maxX=Math.max(maxX,q.x);minY=Math.min(minY,q.y);maxY=Math.max(maxY,q.y);
       }
       const colours=v.geometry.attributes.color.array;
       return {id:v.id,...v.state,minX,maxX,minY,maxY,body:v.spin.rotation.y,axis:v.orbit.rotation.y,tiltX:v.tilt.rotation.x,tiltZ:v.tilt.rotation.z,x:v.main.position.x,height:v.geometry.boundingBox.max.y-v.geometry.boundingBox.min.y,expectedHeight:v.part.dimensionsMm.height/1000,colourFinite:Array.from(colours).every(Number.isFinite),frontLoaded:v.front.querySelector('img').complete};
      })};
    });
    assert.equal(state.parts.length,2);assert(state.parts[0].id!==state.parts[1].id);
    for(const v of state.parts){assert(v.minX>=-1.001&&v.maxX<=1.001&&v.minY>=-1.001&&v.maxY<=1.001,`${layout}/${step}/${v.id}: clipped`);assert(Math.abs(v.height-v.expectedHeight)<.001);assert(v.colourFinite&&v.frontLoaded);}
    if(step===6)for(const v of state.parts){assert(v.base>.8);assert.equal(v.accent,0);}
    if(step===8)for(const v of state.parts){assert(v.base>.999);assert(v.accent>.5);assert(v.body>2*Math.PI&&v.axis>2*Math.PI,'both rotations continue during glaze');}
    if(step===10){
     assert.equal(state.gallery,info.photos);assert.equal(state.exit,info.photos?1:0);assert(state.atBottom);
     assert(state.parts[0].x<state.parts[1].x);assert(state.parts[0].maxX<state.parts[1].minX,'settled parts overlap');
     for(const v of state.parts){assert(v.base>.999&&v.accent>.999);assert(Math.abs(v.tiltX)<.001&&Math.abs(v.tiltZ)<.001);assert(v.body>=4*Math.PI-.001&&v.axis>=4*Math.PI-.001);}
     if(info.photos){assert(state.images.length>0&&state.images.every(Boolean));await page.click('.gallery-photo');await page.waitForFunction(()=>document.querySelector('dialog').open);await page.keyboard.press('Escape');}
     else assert.equal(await page.$('dialog'),null);
    }
    if(step===11){assert(!state.gallery);assert(state.exit<.001);}
    await page.screenshot({path:path.join(report,`${layout}-${step}.png`)});checks.push({layout,step:step++,state});
   }
   assert.deepEqual(errors,[]);await page.close();console.log('MULTIPLE_PAGE_OK',layout);
  }
 }finally{await browser.close();}
 fs.writeFileSync(path.join(report,'report.json'),JSON.stringify({status:'passed',scope:'two-part-technical-review-not-selected-pixel-parity',checks},null,2)+'\n');
})().catch(e=>{console.error(e);process.exit(1)});
