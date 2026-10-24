const fs=require('node:fs'),assert=require('node:assert/strict'),puppeteer=require('/home/pptruser/node_modules/puppeteer');
(async()=>{const b=await puppeteer.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});const checks=[];fs.mkdirSync(process.env.CERAMIC_REPORT,{recursive:true});try{
 for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844]]){
 const page=await b.newPage();await page.setViewport({width,height});page.setDefaultTimeout(120000);const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.error(e.message)});
 await page.goto(process.env.CERAMIC_CANDIDATE,{waitUntil:'networkidle0',timeout:120000});await page.waitForFunction(()=>window.__multiplePage?.loaded&&(!window.__jomulViewer||window.__jomulViewer.status==='ready'));
 const timing=await page.evaluate(()=>{const s=window.__multiplePage.spec,t=s.motion.timing,c=s.cadPresentation,base=s.motion.storyHeightVh-100;return{start:c.collectionStartFraction??.8,extra:c.handoffExtraScrollVh??0,span:t.sheetFadeStart/c.pages.length,from:t.frontMoveStart,to:t.frontFadeStart+t.frontFadeDuration,base}});
 if(timing.extra){const distance=await page.evaluate(({from,to})=>window.__multiplePage.scrollVhAt(to)-window.__multiplePage.scrollVhAt(from),timing);assert(Math.abs(distance-((timing.to-timing.from)*timing.base+timing.extra))<1e-6)}
 const phases=[['second',(1+timing.start/2)*timing.span,0],['third',.09,3],['moving',.16,6],['wire',.29,0],['reverse',.09,3]];
 if(timing.start<.8)phases.splice(1,0,['collection-early',(1+timing.start+.1)*timing.span,3],['collection-late',1.95*timing.span,3]);
 for(const [phase,p,expected] of phases){
  await page.evaluate(p=>{let vh=window.__multiplePage.scrollVhAt(p);if(window.__projectPacing)vh=window.__projectPacing.toPhysical(vh);scrollTo(0,vh*innerHeight/100)},p);
  await page.waitForFunction(p=>Math.abs(window.__multiplePage.progress-p)<.002,{},p);
  const rows=await page.$$eval('.cad-main',els=>els.filter(el=>Number(el.style.opacity)>.1).map(el=>({id:el.dataset.part,stage:el.dataset.handoffStage,rect:{x:el.getBoundingClientRect().x,y:el.getBoundingClientRect().y,width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height}})));
  assert.equal(rows.length,expected,phase+' representative count');
  if(phase.startsWith('collection-'))assert(rows.every(r=>r.stage==='collecting'));
  if(phase==='moving')assert(rows.every(r=>r.stage==='moving'));
  if(phase==='third'||phase==='reverse')assert(rows.every(r=>r.stage==='retained'&&r.rect.y>=0&&r.rect.y+r.rect.height<85));
  await page.screenshot({path:process.env.CERAMIC_REPORT+'/'+name+'-'+phase+'.png'});checks.push({name,phase,rows});
 }
 assert.deepEqual(errors,[]);await page.close();
 }
}finally{await b.close()}
fs.writeFileSync(process.env.CERAMIC_REPORT+'/report.json',JSON.stringify({status:'passed',checks},null,2));console.log('CAD_FOLLOWTHROUGH_OK',checks.length)})().catch(e=>{console.error(e);process.exit(1)});
