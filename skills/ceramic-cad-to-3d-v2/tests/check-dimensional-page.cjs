const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const puppeteer=require('/home/pptruser/node_modules/puppeteer');
(async()=>{
 const report=process.env.CERAMIC_REPORT;fs.mkdirSync(report,{recursive:true});
 const browser=await puppeteer.launch({headless:true,executablePath:process.env.CERAMIC_CHROME,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
 const checks=[];
 try{
  for(const [layout,width,height] of [['desktop',1440,900],['mobile',390,844]]){
   const page=await browser.newPage(),errors=[];page.setDefaultNavigationTimeout(120000);page.setDefaultTimeout(120000);page.on('pageerror',e=>errors.push(e.message));
   await page.setViewport({width,height});await page.goto(process.env.CERAMIC_CANDIDATE,{waitUntil:'networkidle0'});
   await page.waitForFunction(()=>window.__dimensionalPage?.state&&window.__jomulViewer?.status==='ready');
   async function seek(fraction){
    await page.evaluate(f=>{
     const d=window.__dimensionalPage,p=d.bridge.end*f;
     let y;
     if(window.__multiplePage)y=window.__multiplePage.scrollVhAt(p)*innerHeight/100;
     else {const config=window.__mugMotion?.pageConfig||window.__moonJar.config;y=d.toScrollYForLegacyVh(p*(config.motion.storyHeightVh-100));}
     scrollTo(0,y);
    },fraction);
    await page.waitForFunction(f=>Math.abs(window.__dimensionalPage.state.progress-Math.min(f,1))<.005,{},fraction);
    await new Promise(r=>setTimeout(r,100));
   }
   for(const f of [0,.25,.55,1,1.5]){
    await seek(f);
    if(f>=1)assert(await page.evaluate(()=>window.__dimensionalPage.finalRestored));
    if(f===1.5){
     const instanceCheck=await page.evaluate(()=>{
      const spec=window.__multiplePage?.spec;if(!spec)return null;
      const fronts=[...document.querySelectorAll('.cad-main')].filter(e=>Number(getComputedStyle(e).opacity)>.01);
      const sources=fronts.map(e=>{const part=spec.parts.find(p=>p.id===e.dataset.part);return part.sourcePartId||part.id});
      return {count:spec.parts.length,frontCount:document.querySelectorAll('.cad-main').length,sources,unique:[...new Set(sources)].length};
     });
     if(instanceCheck){assert.equal(instanceCheck.count,instanceCheck.frontCount);assert.equal(instanceCheck.sources.length,instanceCheck.unique,'Only one visible front per source');}
    }
    await page.screenshot({path:path.join(report,layout+'-'+f+'.png')});
   }
   await seek(.55);
   const forward=await page.evaluate(()=>JSON.stringify(window.__dimensionalPage.state));
   await seek(2);await seek(.55);
   assert(await page.evaluate(s=>JSON.stringify(window.__dimensionalPage.state)===s,forward),'Reverse drawing state');
   const count=await page.evaluate(()=> (window.__mugMotion||window.__multiplePage||window.__moonJar).renderStats.frames);
   await new Promise(r=>setTimeout(r,200));
   assert.equal(await page.evaluate(()=> (window.__mugMotion||window.__multiplePage||window.__moonJar).renderStats.frames),count);
   await seek(0);
   assert.equal(await page.$eval('.drawing-reader-link',e=>e.hidden),false);
   await page.click('.drawing-reader-link');await page.waitForSelector('.sheet');
   assert(await page.$('dl'));
   assert.deepEqual(errors,[]);checks.push({layout,reverse:true,idle:true,reader:true,endpoint:true});await page.close();
  }
 }finally{await browser.close();}
 fs.writeFileSync(path.join(report,'report.json'),JSON.stringify({status:'passed',checks,scope:'Dimensional drawing intro and link; full scene technical checks are separate'},null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
