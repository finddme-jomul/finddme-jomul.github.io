const fs=require('node:fs'),assert=require('node:assert/strict'),puppeteer=require('/home/pptruser/node_modules/puppeteer');
(async()=>{const browser=await puppeteer.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});try{
 const page=await browser.newPage();await page.setViewport({width:1800,height:1000});fs.mkdirSync(process.env.CERAMIC_REPORT,{recursive:true});
 for(const id of ['board','pawn-knight-bishop','rook-queen-king']){
  await page.goto(process.env.CERAMIC_CANDIDATE+'/assets/cad-group-'+id+'.svg',{waitUntil:'networkidle0'});
  const result=await page.evaluate(()=>({text:document.documentElement.textContent,overflow:[...document.querySelectorAll('text')].filter(t=>{const r=t.getBBox();return r.x<0||r.y<0||r.x+r.width>1800||r.y+r.height>1000}).map(t=>t.textContent)}));
  assert(result.text.includes('CLAY  백토'));assert(result.text.includes('투명유약'));assert(result.text.includes('갈색유약'));assert.deepEqual(result.overflow,[]);
  await page.screenshot({path:process.env.CERAMIC_REPORT+'/'+id+'.png'});
 }
 if(process.env.CERAMIC_PAGE){
  for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844]]){
   const errors=[];const p=await browser.newPage();p.on('pageerror',e=>errors.push(e.message));await p.setViewport({width,height});p.setDefaultTimeout(120000);
   await p.goto(process.env.CERAMIC_PAGE,{waitUntil:'networkidle0',timeout:120000});await p.waitForFunction(()=>window.__multiplePage?.loaded);
   for(let i=0;i<3;i++){
    await p.evaluate(i=>{const m=window.__multiplePage;let vh=m.scrollVhAt((i+.25)/3*m.spec.motion.timing.sheetFadeStart);if(window.__projectPacing)vh=window.__projectPacing.toPhysical(vh);scrollTo(0,vh*innerHeight/100)},i);await p.waitForFunction(i=>document.querySelectorAll('.cad-page-nav button')[i].getAttribute('aria-current')==='true',{},i);
    await p.$eval('#cad-sheet-image',im=>im.decode());await p.screenshot({path:process.env.CERAMIC_REPORT+`/${name}-${i}.png`});
    await p.click('#cad-sheet-image');assert(await p.$eval('#cad-lightbox',d=>d.open));await p.keyboard.press('Escape');await p.waitForFunction(()=>!document.querySelector('#cad-lightbox').open);
   }
   assert.deepEqual(errors,[]);await p.close();
  }
 }
 console.log('CAD_PRODUCTION_OK 3 sheets; page checks',Boolean(process.env.CERAMIC_PAGE));
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
