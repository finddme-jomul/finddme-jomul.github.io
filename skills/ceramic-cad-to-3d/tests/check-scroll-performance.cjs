const assert=require('node:assert/strict'),fs=require('node:fs'),puppeteer=require('/home/pptruser/node_modules/puppeteer');
(async()=>{
 const browser=await puppeteer.launch({headless:true,executablePath:process.env.CERAMIC_CHROME,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
 try{
  const page=await browser.newPage();page.setDefaultTimeout(120000);page.setDefaultNavigationTimeout(120000);await page.setViewport({width:1280,height:720});
  await page.evaluateOnNewDocument(()=>{window.__frameTimes=[];const raf=window.requestAnimationFrame.bind(window);window.requestAnimationFrame=cb=>raf(t=>{const start=performance.now();cb(t);window.__frameTimes.push(performance.now()-start)})});
  await page.goto(process.env.CERAMIC_CANDIDATE,{waitUntil:'networkidle0'});await page.waitForFunction(()=>window.__multiplePage?.loaded&&(!window.__jomulViewer||window.__jomulViewer.status==='ready'));
  const samples=[];
  const phases=[['collection',.05],['handoff-start',.12],['handoff-middle',.18],['handoff-wire',.24],['handoff-end',.275]];
  const cadEnd=await page.evaluate(()=>window.__multiplePage.spec.motion.timing.cadEnd);
  for(const motion of [.2,.35,.41,.53,.7,.79])phases.push(['motion-'+motion,cadEnd+(1-cadEnd)*motion]);
  for(const [phase,progress] of phases){
   await page.evaluate(p=>{window.__frameTimes=[];const v=window.__multiplePage;let vh=v.scrollVhAt?.(p)??p*(v.spec.motion.storyHeightVh-100);if(window.__projectPacing)vh=window.__projectPacing.toPhysical(vh);scrollTo(0,vh*innerHeight/100)},progress);
   await page.waitForFunction(p=>Math.abs(window.__multiplePage.progress-p)<.001,{},progress);
   await page.$eval('#cad-sheet-image',im=>im.decode());
   await new Promise(r=>setTimeout(r,200));
   samples.push(await page.evaluate(phase=>({phase,cpuMs:window.__frameTimes.slice(),stats:{...window.__multiplePage.renderStats}}),phase));
  }
  await new Promise(r=>setTimeout(r,300));await page.evaluate(()=>window.__frameTimes=[]);await new Promise(r=>setTimeout(r,1000));
  const idle=await page.evaluate(()=>window.__frameTimes.length),output={scope:'1280x720 software WebGL, RAF CPU time (not hardware FPS); wait for completed scroll/image before idle observation',samples,idleCallbacksPerSecond:idle};
  fs.writeFileSync(process.env.CERAMIC_REPORT,JSON.stringify(output,null,2));console.log(JSON.stringify(output));
  if(process.env.CERAMIC_ASSERT_PERF==='1'){
   assert.equal(idle,0,'static scene must not schedule animation frames');assert(samples.every(s=>s.cpuMs.length>0),'every scroll sample must render');
   const budget=Number(process.env.CERAMIC_MAX_FRAME_CPU_MS||100);
   assert(Math.max(...samples.flatMap(s=>s.cpuMs))<budget,`sampled frame CPU exceeds ${budget}ms in software browser`);
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
