const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const puppeteer=require('/home/pptruser/node_modules/puppeteer');
(async()=>{
 const report=process.env.CERAMIC_REPORT;fs.mkdirSync(report,{recursive:true});
 const browser=await puppeteer.launch({headless:true,executablePath:process.env.CERAMIC_CHROME,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
 const checks=[],assemblyChecks=[];
 try{
  for(const [layout,width,height] of [['desktop',1440,900],['short',1280,720],['mobile',390,844],['mobile-short',390,700]]){
   const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.setViewport({width,height,deviceScaleFactor:1});await page.goto(process.env.CERAMIC_CANDIDATE,{waitUntil:'networkidle0'});
   await page.waitForFunction(()=>window.__multiplePage?.loaded);
   const info=await page.evaluate(()=>({ids:window.__multiplePage.spec.parts.map(p=>p.id),end:window.__multiplePage.endProgress,cad:window.__multiplePage.spec.motion.timing.cadEnd,photos:window.__multiplePage.spec.ending==='photos',feature:window.__multiplePage.spec.renderer==='feature-solids',layered:window.__multiplePage.spec.renderer==='layered-vessels',timing:window.__multiplePage.spec.motion.timing,assembly:window.__multiplePage.spec.assembly}));
   assert(info.ids.length>=(info.layered?1:2));assert.equal(new Set(info.ids).size,info.ids.length);
   const mp=n=>info.cad+(1-info.cad)*n;
   let step=0;
   const t=info.timing;
   const points=info.feature?[0,.12,.23,mp(.12),mp(.27),mp(t.baseGlazeStart+.01),mp(t.baseGlazeStart+t.baseGlazeDuration+.001),mp(t.baseGlazeStart+t.baseGlazeDuration/2),mp(t.baseGlazeStart+t.baseGlazeDuration+.005),mp(info.assembly?info.assembly.start+info.assembly.duration*.55:t.photoStart-.005),info.end,mp(.15)]:info.layered?[0,.12,.23,mp(.2),mp(.4),mp(t.baseGlazeStart+.01),mp(t.baseGlazeStart+t.baseGlazeDuration+.001),mp(t.accentGlazeStart+t.accentGlazeDuration/2),mp(t.accentGlazeStart+t.accentGlazeDuration+.001),mp(info.assembly?info.assembly.start+info.assembly.duration*.55:t.photoStart-.005),info.end,mp(t.baseGlazeStart+.01)]:[0,.12,.23,mp(.2),mp(.4),mp(.6),mp(.68),mp(.77),mp(.86),mp(.925),info.end,mp(.6)];
   for(const p of points){
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
       let materialCheck=null;
       if(v.part.coatings&&(v.state.accent>.999||v.state.base>.999&&v.state.accent===0)){
         const coat=v.part.coatings,linear=h=>{const n=parseInt(h,16)/255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4};
         let maxError=0,inside=0,outside=0;
         for(let i=0;i<v.values.length;i++){
           const q=v.values[i],region=coat.fired.region,hit=q.exterior&&q.heightMm>=region.minHeightMm-.001&&q.heightMm<=region.maxHeightMm+.001;
           if(q.exterior)outside++;else inside++;
           let color;
           if(v.state.accent>.999)color=hit?coat.fired.regionHex:coat.fired.baseHex;
           else {const r=coat.layers[0].region;const coated=r.surface==='all'||q.exterior&&q.heightMm>=r.minHeightMm-.001&&q.heightMm<=r.maxHeightMm+.001;color=coated?coat.layers[0].previewHex:v.part.glazePreview.clayHex;}
           for(let c=0;c<3;c++)maxError=Math.max(maxError,Math.abs(colours[i*3+c]-linear(color.slice(1+c*2,3+c*2))));
         }
         materialCheck={maxError,inside,outside};
       }
       if(v.feature&&v.state.base>.999){const linear=h=>{const n=parseInt(h,16)/255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4};let maxError=0;for(let i=0;i<colours.length;i++)maxError=Math.max(maxError,Math.abs(colours[i]-linear(v.part.glazePreview.baseHex.slice(1+i%3*2,3+i%3*2))));materialCheck={maxError,feature:true};}
       return {wireVertices:v.wireGeometry?.attributes.position.count??0,wireOpacity:v.wireMaterial.opacity,roughness:v.material.roughness,clearcoat:v.material.clearcoat,id:v.id,...v.state,minX,maxX,minY,maxY,body:v.spin.rotation.y,axis:v.orbit.rotation.y,tiltX:v.tilt.rotation.x,tiltZ:v.tilt.rotation.z,x:v.main.position.x,footPositionMm:[v.main.position.x*1000,(v.main.position.y-v.height/2)*1000,v.main.position.z*1000],materialCheck,height:v.geometry.boundingBox.max.y-v.geometry.boundingBox.min.y,expectedHeight:v.part.dimensionsMm.height/1000,colourFinite:Array.from(colours).every(Number.isFinite),frontLoaded:v.front.querySelector('img').complete};
      })};
    });
    assert.deepEqual(state.parts.map(p=>p.id),info.ids);
    for(const v of state.parts){assert(v.minX>=-1.001&&v.maxX<=1.001&&v.minY>=-1.001&&v.maxY<=1.001,`${layout}/${step}/${v.id}: clipped`);assert(Math.abs(v.height-v.expectedHeight)<.001);assert(v.colourFinite&&v.frontLoaded);}
    for(const v of state.parts)if(v.materialCheck){assert(v.materialCheck.maxError<.00002,`${layout}/${step}/${v.id}: material region/order mismatch ${v.materialCheck.maxError}`);if(!v.materialCheck.feature)assert(v.materialCheck.inside>0&&v.materialCheck.outside>0);}
    if(info.feature)for(const v of state.parts){assert(v.wireVertices>0);if(v.base>.999){const g=await page.evaluate(id=>window.__multiplePage.spec.parts.find(p=>p.id===id).glazePreview,v.id);assert(Math.abs(v.roughness-g.roughness)<1e-8&&Math.abs(v.clearcoat-g.clearcoat)<1e-8);}}
    if(info.feature&&step===3)for(const v of state.parts)assert(v.wireOpacity>.99&&v.clay===0,'feature pure wire must remain visible');
    if(step===6)for(const v of state.parts){assert(v.base>.8);assert.equal(v.accent,0);}
    if(info.assembly?.mode==='direct-drop'&&step===8)for(const v of state.parts){const s=info.assembly.steps.find(s=>s.partId===v.id);const expected=[s.targetPositionMm[0],s.targetPositionMm[1]+s.dropHeightMm,s.targetPositionMm[2]];expected.forEach((n,i)=>assert(Math.abs(n-v.footPositionMm[i])<.001,'parts must wait above destinations, not on a floor lineup'));}
    if(step===8)for(const v of state.parts){assert(v.base>.999);assert(info.feature?v.accent===0:v.accent>.5);assert(v.body>2*Math.PI&&v.axis>2*Math.PI,'both rotations continue during glaze');}
    if(step===10){
     assert.equal(state.gallery,info.photos);assert.equal(state.exit,info.photos?1:0);assert(state.atBottom);
     if(info.assembly){for(const v of state.parts){const target=info.assembly.steps.find(s=>s.partId===v.id).targetPositionMm;target.forEach((n,i)=>assert(Math.abs(n-v.footPositionMm[i])<.001,'assembly target mismatch'));}}
     else for(let i=1;i<state.parts.length;i++){assert(state.parts[i-1].x<state.parts[i].x);assert(state.parts[i-1].maxX<state.parts[i].minX,'settled parts overlap');}
     for(const v of state.parts){assert(v.base>.999&&(info.feature?v.accent===0:v.accent>.999));assert(Math.abs(v.tiltX)<.001&&Math.abs(v.tiltZ)<.001);assert(v.body>=4*Math.PI-.001&&v.axis>=4*Math.PI-.001);}
     if(info.photos){assert(state.images.length>0&&state.images.every(Boolean));await page.click('.gallery-photo');await page.waitForFunction(()=>document.querySelector('dialog').open);await page.keyboard.press('Escape');}
     else assert.equal(await page.$('dialog'),null);
    }
    if(step===11){assert(!state.gallery);assert(state.exit<.001);}
    await page.screenshot({path:path.join(report,`${layout}-${step}.png`)});checks.push({layout,step:step++,state});
   }
   if(info.assembly){
    const poses=info.assembly.steps.flatMap(s=>[s.start+s.duration/6,s.start+s.duration/2,s.start+s.duration*5/6]);
    poses.push(.55,1,.55);
    let reverseReference;
    for(const ap of poses){
     const progress=mp(info.assembly.start+info.assembly.duration*ap);
     await page.evaluate(p=>scrollTo(0,p*(window.__multiplePage.spec.motion.storyHeightVh-100)*innerHeight/100),progress);
     await page.waitForFunction(p=>Math.abs(window.__multiplePage.progress-p)<.002,{},progress);
     const result=await page.evaluate(()=>window.__multiplePage.vessels.map(v=>{
      const camera=window.__multiplePage.camera,a=v.geometry.attributes.position;let clipped=false;
      for(let i=0;i<a.count;i++){const q=v.main.position.clone().set(a.getX(i),a.getY(i),a.getZ(i)).applyMatrix4(v.spin.matrixWorld).project(camera);if(Math.abs(q.x)>1.001||Math.abs(q.y)>1.001)clipped=true;}
      return {id:v.id,position:v.main.position.toArray(),body:v.spin.rotation.y,axis:v.orbit.rotation.y,height:v.height,assemblyProgress:v.state.assembly,clipped};
     }));
     assert(result.every(p=>!p.clipped),'assembly motion clipped');
     if(info.assembly.mode==='direct-drop')for(const v of result){const s=info.assembly.steps.find(s=>s.partId===v.id),t=Math.max(0,Math.min(1,(v.assemblyProgress-s.start)/s.duration)),ease=info.assembly.landing==='soft-spin'?t*t*t*(10+t*(-15+6*t)):t*t*(3-2*t);const expected=[s.targetPositionMm[0]/1000,(s.targetPositionMm[1]+s.dropHeightMm*(1-ease))/1000+v.height/2,s.targetPositionMm[2]/1000];expected.forEach((n,i)=>assert(Math.abs(n-v.position[i])<1e-6,'direct drop order/trajectory mismatch'));if(info.assembly.landing==='soft-spin'){const input=await page.evaluate(id=>({part:window.__multiplePage.spec.parts.find(p=>p.id===id),glaze:window.__multiplePage.spec.motion.glaze}),v.id);const now=info.assembly.start+info.assembly.duration*v.assemblyProgress,end=info.assembly.start+info.assembly.duration*(s.start+s.duration),q=Math.max(0,Math.min(1,(now-info.timing.baseGlazeStart)/(end-info.timing.baseGlazeStart))),f=q*q*(3-2*q);assert(Math.abs(v.body-(input.part.motion.turns+f*input.glaze.spinTurns)*2*Math.PI)<1e-6,'body must keep rotating until landing');assert(Math.abs(v.axis-(input.part.motion.orbitTurns+f*input.glaze.axisPrecessionTurns)*2*Math.PI)<1e-6,'axis yaw must continue until landing');}}
     if(ap===.55){if(reverseReference)assert.deepEqual(result,reverseReference,'assembly reverse scroll drift');else reverseReference=result;}
     assemblyChecks.push({layout,progress:ap,parts:result});
    }
   }
   assert.deepEqual(errors,[]);await page.close();console.log('MULTIPLE_PAGE_OK',layout);
  }
 }finally{await browser.close();}
 fs.writeFileSync(path.join(report,'report.json'),JSON.stringify({status:'passed',scope:'multiple-technical-review-not-selected-pixel-parity',checks,assemblyChecks},null,2)+'\n');
})().catch(e=>{console.error(e);process.exit(1)});
