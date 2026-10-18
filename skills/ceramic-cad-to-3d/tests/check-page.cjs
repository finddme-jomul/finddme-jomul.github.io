const fs=require('fs');
const path=require('path');
const puppeteer=require('/home/pptruser/node_modules/puppeteer');

(async()=>{
  const base=process.env.JOMUL_PAGE_BASE,output=process.env.JOMUL_PAGE_OUTPUT;
  if(!base||!output)throw Error('Page base URL and output are required');
  fs.mkdirSync(output,{recursive:true});
  const browser=await puppeteer.launch({headless:true,executablePath:process.env.CERAMIC_CHROME || await puppeteer.executablePath(),args:['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
  const allLayouts=[['desktop',1440,900],['short',1280,720],['mobile',390,844],['mobile-short',390,700]];
  const layouts=process.env.JOMUL_PAGE_LAYOUT_FILTER?allLayouts.filter(item=>item[0]===process.env.JOMUL_PAGE_LAYOUT_FILTER):allLayouts;
  const info=await fetch(`${base}/page-manifest.json`).then(r=>r.json());
  const profile=await fetch(`${base}/assets/page-profile.json`).then(r=>r.json());
  const fixtures=[['review',info.mode,info.partCount,info.photoCount]];
  const cases=[];
  try{
    for(const [name,mode,partCount,photoCount] of fixtures){
      for(const [layout,width,height] of layouts){
        const page=await browser.newPage();await page.setCacheEnabled(false);
        await page.setViewport({width,height,deviceScaleFactor:1});
        const errors=[];page.on('pageerror',error=>errors.push(String(error)));
        const response=await page.goto(`${base}/index.html`,{waitUntil:'networkidle0',timeout:60000});
        if(!response?.ok())throw Error(`${name}/${layout} HTTP ${response?.status()}`);
        try { await page.waitForFunction('Boolean(window.__fullPageDebug)',{timeout:60000}); } catch(e) { throw Error(`${e} errors=${errors.join('; ')}`); }
        const states=[];
        for(const [stage,fraction] of [['cad',0],['wire',.29],['clay',.52],['glaze',.88],['exit',.975],['final',1]]){
          await page.evaluate(f=>{const max=document.documentElement.scrollHeight-innerHeight;scrollTo(0,max*f)},fraction);
          await page.waitForFunction(f=>Math.abs(window.__fullPageDebug?.progress-f)<.012,{timeout:15000},fraction);
          await new Promise(resolve=>setTimeout(resolve,stage==='final'&&photoCount?750:100));
          const state=await page.evaluate(()=>{
            const d=window.__fullPageDebug,c=window.__fullPageContract;
            const sheet=document.querySelector('.cad-sheet');const rect=sheet.getBoundingClientRect();
            const photos=[...document.querySelectorAll('.gallery-photo img')];
            return {progress:d.progress,sceneExit:d.sceneExit,galleryActive:d.galleryActive,
              sheetLayout:d.sheetLayout,sheet:{left:rect.left,top:rect.top,right:rect.right,bottom:rect.bottom,loaded:sheet.complete&&sheet.naturalWidth>0},
              partCount:d.parts.length,parts:d.parts,photoCount:d.photoCount,
              galleryCount:photos.length,photosLoaded:photos.every(img=>img.complete&&img.naturalWidth>0),
              hasGallery:Boolean(document.querySelector('#gallery')),
              text:document.body.innerText.trim(),horizontalOverflow:document.documentElement.scrollWidth-innerWidth,
              documentHeight:document.documentElement.scrollHeight,viewportHeight:innerHeight,
              canvasOpacity:Number(getComputedStyle(document.querySelector('#scene canvas')).opacity),
              galleryStartVh:c.galleryStartVh};
          });
          if(state.partCount!==partCount||state.photoCount!==photoCount||state.galleryCount!==photoCount||state.hasGallery!==Boolean(photoCount))throw Error(`${name}/${layout}/${stage} composition ${JSON.stringify(state)}`);
          if(state.text||state.horizontalOverflow>1||!state.sheet.loaded||!state.photosLoaded)throw Error(`${name}/${layout}/${stage} content ${JSON.stringify(state)}`);
          if(state.sheet.left<-.5||state.sheet.top<-.5||state.sheet.right>width+.5||state.sheet.bottom>height+.5)throw Error(`${name}/${layout}/${stage} sheet clipped`);
          if(Math.abs(state.documentHeight-height*info.sourceScene.motion.storyHeightVh/100)>2)throw Error(`${name}/${layout}/${stage} unexpected page length ${state.documentHeight}`);
          if(['wire','clay','glaze'].includes(stage)&&state.parts.some(part=>part.screenBounds.left<-2||part.screenBounds.right>width+2||part.screenBounds.top<-2||part.screenBounds.bottom>height+2))throw Error(`${name}/${layout}/${stage} 3D clipped ${JSON.stringify(state.parts.map(part=>part.screenBounds))}`);
          if(mode==='single'&&stage==='wire'&&state.parts.some(part=>(part.screenBounds.bottom-part.screenBounds.top)/height<profile.motion.singleFraming.minimumWireHeightFraction[layout]))throw Error(`${name}/${layout}/${stage} approved single 3D is too small`);
          if(stage==='cad'&&state.sceneExit>.001)throw Error(`${name}/${layout} scene exits early`);
          if(stage==='glaze'&&state.parts.some(part=>part.baseGlazeProgress<.9))throw Error(`${name}/${layout} base glaze not reached ${JSON.stringify(state)} errors=${errors.join(";")}`);
          if(stage==='exit'&&photoCount&&!(state.sceneExit>.1&&state.sceneExit<1))throw Error(`${name}/${layout} missing scene exit`);
          if(stage==='final'&&(state.galleryActive!==Boolean(photoCount)||Math.abs(state.sceneExit-(photoCount?1:0))>.001))throw Error(`${name}/${layout} final handoff ${JSON.stringify(state)}`);
          if(stage==='final'&&photoCount&&state.canvasOpacity>.01)throw Error(`${name}/${layout} 3D overlaps gallery`);
          const screenshot=`${name}-${layout}-${stage}.png`;
          if(['cad','wire','glaze','exit','final'].includes(stage))await page.screenshot({path:path.join(output,screenshot)});
          states.push({stage,...state,screenshot});
        }
        const clay=states.find(s=>s.stage==='clay'),glaze=states.find(s=>s.stage==='glaze');
        if(glaze.parts.some((p,i)=>p.bodyTurns<=clay.parts[i].bodyTurns||p.axisTurns<=clay.parts[i].axisTurns))throw Error('Body/axis rotation stopped during glaze');
        if(photoCount){
          await page.locator('.gallery-photo').click();
          if(!await page.$eval('#photo-lightbox',el=>el.open))throw Error(`${name}/${layout} lightbox failed`);
          await page.keyboard.press('Escape');
          if(await page.$eval('#photo-lightbox',el=>el.open))throw Error(`${name}/${layout} Escape failed`);
        }
        await page.evaluate(()=>scrollTo(0,(document.documentElement.scrollHeight-innerHeight)*.88));
        await page.waitForFunction(()=>Math.abs(window.__fullPageDebug?.progress-.88)<.012,{timeout:15000});
        const reverse=await page.evaluate(()=>({exit:window.__fullPageDebug.sceneExit,
          galleryActive:window.__fullPageDebug.galleryActive,
          canvasOpacity:Number(getComputedStyle(document.querySelector('#scene canvas')).opacity)}));
        if(reverse.galleryActive||reverse.exit>.001||reverse.canvasOpacity<.99)throw Error(`${name}/${layout} reverse scroll failed ${JSON.stringify(reverse)}`);
        await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight-innerHeight));
        await page.waitForFunction(()=>window.__fullPageDebug?.progress>.99,{timeout:15000});
        if(photoCount&&!await page.$eval('#gallery',el=>el.classList.contains('gallery-active')))
          throw Error(`${name}/${layout} gallery did not return after reverse scroll`);
        if(errors.length)throw Error(`${name}/${layout} page errors ${errors.join('; ')}`);
        cases.push({name,mode,layout,width,height,partCount,photoCount,states});
        await page.close();
        process.stdout.write(`JOMUL_FULL_PAGE_CASE_OK ${name}/${layout}\n`);
      }
    }
  }finally{await browser.close()}
  fs.writeFileSync(path.join(output,'report.json'),JSON.stringify({schemaVersion:1,status:'passed',scope:'rotational-full-page-review-not-visual-adoption',cases},null,2)+'\n');
})().catch(error=>{console.error(error);process.exit(1)});
