const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const puppeteer=require('/home/pptruser/node_modules/puppeteer');
(async()=>{
 const report=process.env.CERAMIC_REPORT;fs.mkdirSync(report,{recursive:true});
 const browser=await puppeteer.launch({headless:true,executablePath:process.env.CERAMIC_CHROME,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
 const checks=[];
 try{
  for(const [layout,width,height] of [['desktop',1440,900],['short',1280,720],['mobile',390,844],['mobile-short',390,700]]){
   const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.setViewport({width,height,deviceScaleFactor:1});await page.goto(process.env.CERAMIC_CANDIDATE,{waitUntil:'networkidle0'});
   await page.waitForFunction(()=>window.__moonJar?.glbLoaded&&window.__photoPacing);await page.mouse.move(width-1,height-1);
   const hasPhotos=await page.evaluate(()=>window.__moonJar.config.ending!=='glaze');
   let step=0;
   for(const time of (hasPhotos?[0,150,360,430,540,650,750,850,970,1040,1080,850]:[0,150,360,430,540,650,750,850,970,990,1000,850])){
    await page.evaluate(t=>scrollTo(0,t/1200*(window.__moonJar.config.motion.storyHeightVh-100)*innerHeight/100),time);
    await page.waitForFunction(t=>Math.abs(window.__photoPacing.pace().timelineTime-t)<1&&Math.abs(window.__moonJar.timeline.currentTime-window.__photoPacing.pace().timelineTime)<1,{},time);
    await new Promise(r=>setTimeout(r,time===1080?2200:150));
    const state=await page.evaluate(()=>{
     const m=window.__moonJar,b=m.geometry.boundingBox;
     m.root.updateWorldMatrix(true,false);const e=m.root.matrixWorld.elements,a=m.geometry.attributes.position.array;
     const h=b.max.y-b.min.y,w=Math.max(b.max.x-b.min.x,b.max.z-b.min.z),aspect=innerWidth/innerHeight,tan=Math.tan(32*Math.PI/360),distance=Math.max(h/(2*tan),w/(2*tan*aspect))*1.35;
     let maxX=0,maxY=0;
     for(let i=0;i<a.length;i+=3){const x=a[i],y=a[i+1],z=a[i+2];const X=e[0]*x+e[4]*y+e[8]*z+e[12],Y=e[1]*x+e[5]*y+e[9]*z+e[13],Z=e[2]*x+e[6]*y+e[10]*z+e[14];maxX=Math.max(maxX,Math.abs(X/(distance-Z)/tan/aspect));maxY=Math.max(maxY,Math.abs(Y/(distance-Z)/tan));}
     const box=document.querySelector('#cad-main').getBoundingClientRect();
     return {height:h,maxX,maxY,body:m.root.rotation.y,axis:m.orbitRig.rotation.y,clay:m.clayMaterial.opacity,wire:m.wireMaterial.opacity,glaze:m.clip.constant,
      ending:m.config.ending,hostOpacity:Number(getComputedStyle(document.querySelector('#viewer')).opacity),hostHidden:document.querySelector('#viewer').getAttribute('aria-hidden'),atBottom:Math.abs(scrollY+innerHeight-document.documentElement.scrollHeight)<2,gallery:document.querySelector('#gallery')?.classList.contains('gallery-active')??false,images:[...document.querySelectorAll('.gallery-photo img')].map(i=>({loaded:i.complete&&i.naturalWidth>0,src:i.getAttribute('src')})),front:{width:box.width,height:box.height,left:box.left,right:box.right,top:box.top,bottom:box.bottom},dims:m.config.dimensionsMm};
    });
    assert(Math.abs(state.height-state.dims.height/1000)<.0001,'CAD/model height');
    assert(state.maxX<=1.001&&state.maxY<=1.001,`${layout}/${time} clipped model: ${state.maxX}/${state.maxY}`);
    assert(state.front.width>0&&state.front.height>0);
    if(time>=540)assert(state.front.left>=-1&&state.front.right<=width+1&&state.front.top>=-1&&state.front.bottom<=height+1,'centred CAD front clipped');
    assert((hasPhotos?state.images.length>0:state.images.length===0)&&state.images.every(i=>i.loaded&&!/actual-photo|process-photo/.test(i.src)),'new photo inputs');
    assert.equal(state.gallery,hasPhotos&&time===1080,'gallery handoff/reverse');
    if(!hasPhotos&&time===1000){assert(state.atBottom,'glaze ending must be actual page end');assert.equal(state.hostHidden,'false');assert.equal(state.hostOpacity,1);assert(state.glaze>=state.height/2-.00001,'fully glazed ending');assert(Math.abs(state.body-390*Math.PI/180)<.001);assert(Math.abs(state.axis-2*Math.PI)<.001);assert.equal(await page.$('dialog'),null);}
    if(time===750){assert(state.clay>.99);assert(Math.abs(state.wire-1/14)<.005,'selected wire fade ends at 760, not 750');}
    if(time===970){assert(state.body>6);assert(state.axis>5);assert(state.glaze>0);}
    if(time===1080){await page.click('.gallery-photo');await page.waitForFunction(()=>document.querySelector('dialog').open);await page.keyboard.press('Escape');}
    await page.screenshot({path:path.join(report,`${layout}-${step}.png`)});
    checks.push({layout,time,step:step++,state});
   }
   assert.deepEqual(errors,[]);await page.close();console.log('NEW_PAGE_CHECK_OK',layout);
  }
 }finally{await browser.close();}
 fs.writeFileSync(path.join(report,'report.json'),JSON.stringify({status:'passed',scope:'new-single-input-technical-review-not-visual-adoption',checks},null,2)+'\n');
})().catch(e=>{console.error(e);process.exit(1)});
