const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const puppeteer=require('/home/pptruser/node_modules/puppeteer');
(async()=>{
 const report=process.env.CERAMIC_REPORT;fs.mkdirSync(report,{recursive:true});
 const browser=await puppeteer.launch({headless:true,executablePath:process.env.CERAMIC_CHROME,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
 const checks=[];
 try{
  for(const [layout,width,height] of [['desktop',1440,900],['short',1280,600],['mobile',390,844],['mobile-short',390,700]]){
   const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.setViewport({width,height,deviceScaleFactor:1});await page.goto(process.env.CERAMIC_CANDIDATE,{waitUntil:'networkidle0'});
   await page.waitForFunction(()=>window.__mugMotion?.state?.target);
   const guide=await page.evaluate(()=>fetch('./wire-guide.json').then(r=>r.json()));
   assert.equal(guide.density.bodyProfileStride,4);assert.equal(guide.density.bodyMeridians,12);assert.equal(guide.density.bodyRingSegments,72);
   const info=await page.evaluate(()=>({end:window.__mugMotion.state.endProgress,photos:window.__mugMotion.pageConfig.ending==='photos'}));
   let step=0;
   for(const p of [0,.43*.72,.56*.72,.685*.72,.79*.72,.895*.72,.72,.79,.9,1,info.end,.79*.72]){
    await page.evaluate(p=>scrollTo(0,p*(window.__mugMotion.pageConfig.motion.storyHeightVh-100)*innerHeight/100),p);
    await page.waitForFunction(p=>Math.abs(window.__mugMotion.state.pageProgress-p)<.002,{},p);await new Promise(r=>setTimeout(r,step===10?1800:120));
    const state=await page.evaluate(()=>{
     const m=window.__mugMotion,q=m.camera.position.clone();let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity,uncoated=0,vertices=0;
     for(const mesh of m.meshes){const a=mesh.geometry.attributes.position;vertices+=a.count;
      for(let i=0;i<a.count;i++){
       q.fromBufferAttribute(a,i).applyMatrix4(mesh.matrixWorld);if(q.y>m.clip.constant+1e-6)uncoated++;
       q.project(m.camera);minX=Math.min(minX,q.x);maxX=Math.max(maxX,q.x);minY=Math.min(minY,q.y);maxY=Math.max(maxY,q.y);
      }
     }
     const wirePoints=[0,36,72].map(i=>q.clone().fromBufferAttribute(m.wire.geometry.attributes.position,i).applyMatrix4(m.wire.matrixWorld).project(m.camera));
     const [a,b,c]=wirePoints;const projectedRingArea=Math.abs((b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x));
     return {...m.state,projectedRingArea,minX,maxX,minY,maxY,uncoated,vertices,meshCount:m.meshes.length,coatedMeshCount:m.glazeMeshes.length,
      body:m.content.rotation.y,axis:m.orbitRig.rotation.y,tiltX:m.tiltRig.rotation.x,tiltZ:m.tiltRig.rotation.z,
      clayVisible:m.meshes.some(v=>v.visible),glazeVisible:m.glazeMeshes.every(v=>v.visible),
      gallery:document.querySelector('#gallery')?.classList.contains('gallery-active')??false,
      atBottom:Math.abs(scrollY+innerHeight-document.documentElement.scrollHeight)<2,
      images:[...document.querySelectorAll('.gallery-photo img')].map(i=>i.complete&&i.naturalWidth>0),
      frontLoaded:document.querySelector('#front img').complete,wireVertices:m.wire.geometry.attributes.position.count,
      expectedBody:m.motion.bodySpinDegrees*Math.PI/180,expectedAxis:m.motion.axisPrecessionDegrees*Math.PI/180};
    });
    assert(state.meshCount>0&&state.coatedMeshCount===state.meshCount&&state.vertices>0);
    assert(state.minX>=-1.001&&state.maxX<=1.001&&state.minY>=-1.001&&state.maxY<=1.001,`${layout}/${step}: handle clipped`);
    assert(state.frontLoaded&&state.wireVertices>500&&state.wireVertices<50000);
    if(step===1){const box={x:(state.minX+1)*width/2,y:(1-state.maxY)*height/2,width:(state.maxX-state.minX)*width/2,height:(state.maxY-state.minY)*height/2};assert(Math.max(...Object.keys(box).map(k=>Math.abs(box[k]-state.front[k])))<1.5,'front/complete solid mismatch');}
    if(step===2)assert(state.lineOpacity>.8);
    if(step===3||step===4){assert(state.lineOpacity>.99&&state.clayOpacity===0,'Pure wire must survive quarter and half turns');assert(state.axisTiltDegrees>5);assert(state.axisPrecessionDegrees>80&&state.bodySpinDegrees>90);}
    if(step===3)assert(state.projectedRingArea>.001,'Turning CAD ring must project as a curved ellipse, not an edge-on line');
    if(step===6){assert.equal(state.coat,0);assert(Math.abs(state.body-state.expectedBody)<.02);}
    if(step===8){assert(state.coat>.5&&state.coat<1);assert(state.uncoated>0&&state.uncoated<state.vertices);assert(state.body>state.expectedBody&&state.axis>state.expectedAxis);}
    if(step===8){
     const visiblePixels=await page.evaluate(()=>{
      const m=window.__mugMotion,canvas=document.createElement('canvas');canvas.width=m.renderer.domElement.width;canvas.height=m.renderer.domElement.height;
      const c=canvas.getContext('2d');m.renderer.render(m.scene,m.camera);c.drawImage(m.renderer.domElement,0,0);const coated=c.getImageData(0,0,canvas.width,canvas.height).data;
      m.wire.visible=false;m.renderer.render(m.scene,m.camera);c.clearRect(0,0,canvas.width,canvas.height);c.drawImage(m.renderer.domElement,0,0);const noWire=c.getImageData(0,0,canvas.width,canvas.height).data;
      for(let i=0;i<coated.length;i++)if(coated[i]!==noWire[i])throw Error('Invisible wire changes coating pixels');m.wire.visible=true;
      m.glazeMeshes.forEach(v=>v.visible=false);m.renderer.render(m.scene,m.camera);c.clearRect(0,0,canvas.width,canvas.height);c.drawImage(m.renderer.domElement,0,0);const bare=c.getImageData(0,0,canvas.width,canvas.height).data;
      m.glazeMeshes.forEach(v=>v.visible=true);m.renderer.render(m.scene,m.camera);
      let count=0;for(let i=3;i<coated.length;i+=4)if(coated[i]>bare[i]+40)count++;return count;
     });
     assert(visiblePixels>1000,'glaze is occluded by clay in actual canvas');state.visibleGlazePixels=visiblePixels;
    }
    if(step===9||step===10){assert.equal(state.coat,1);assert.equal(state.uncoated,0);assert(!state.clayVisible&&state.glazeVisible);assert(Math.abs(state.body-state.expectedBody-Math.PI*2)<1e-6&&Math.abs(state.axis-state.expectedAxis-Math.PI*2)<1e-6);assert(Math.abs(state.tiltX)+Math.abs(state.tiltZ)<1e-6);}
    if(step===10){assert.equal(state.gallery,info.photos);assert.equal(state.exit,info.photos?1:0);assert(state.atBottom);if(info.photos){assert(state.images.length>0&&state.images.every(Boolean));await page.click('.gallery-photo');await page.waitForFunction(()=>document.querySelector('dialog').open);await page.keyboard.press('Escape');}else assert.equal(await page.$('dialog'),null);}
    if(step===11)assert(!state.gallery&&state.coat===0&&state.clayVisible);
    await page.screenshot({path:path.join(report,`${layout}-${step}.png`)});checks.push({layout,step:step++,state});
   }
   assert.deepEqual(errors,[]);await page.close();console.log('HANDLED_PAGE_OK',layout);
  }
 }finally{await browser.close();}
 fs.writeFileSync(path.join(report,'report.json'),JSON.stringify({status:'passed',scope:'handled-whole-solid-technical-review-not-visual-adoption',checks},null,2)+'\n');
})().catch(e=>{console.error(e);process.exit(1)});
