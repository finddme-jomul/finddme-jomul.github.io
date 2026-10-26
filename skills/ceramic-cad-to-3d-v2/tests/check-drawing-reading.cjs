const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const puppeteer=require('/home/pptruser/node_modules/puppeteer');
(async()=>{
 const report=process.env.CERAMIC_REPORT;fs.mkdirSync(report,{recursive:true});
 const browser=await puppeteer.launch({headless:true,executablePath:process.env.CERAMIC_CHROME,args:['--no-sandbox','--disable-dev-shm-usage']});
 const checks=[];
 try{
  for(const [layout,width,height] of [['desktop',1700,1060],['mobile',390,844]]){
   const page=await browser.newPage();await page.setViewport({width,height});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(process.env.CERAMIC_CANDIDATE,{waitUntil:'networkidle0'});
   await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0));
   const count=await page.$$eval('article',es=>es.length);assert(count>0);
   for(let i=0;i<count;i++){
    const article=(await page.$$('article'))[i],region=await article.$('.sheet'),button=await article.$('button');
    const before=await region.evaluate(e=>({width:e.clientWidth,content:e.scrollWidth,height:e.clientHeight,contentHeight:e.scrollHeight}));
    assert(before.contentHeight>before.height);
    if(layout==='mobile')assert(before.content>=1100&&before.width<=390);
    await region.evaluate(e=>{e.scrollLeft=150;e.scrollTop=100;});
    if(layout==='mobile')assert(await region.evaluate(e=>e.scrollLeft>0));
    await button.click();
    assert.equal(await button.evaluate(e=>e.getAttribute('aria-pressed')),'true');
    assert(await region.evaluate(e=>e.scrollWidth<=e.clientWidth+1));
    await button.click();
    assert.equal(await button.evaluate(e=>e.getAttribute('aria-pressed')),'false');
    await article.$eval('summary',e=>e.click());
    assert((await article.$eval('details',e=>e.innerText)).includes('SHA-256'));
    await region.focus();
    await page.keyboard.press('ArrowDown');
    await page.waitForFunction(el=>el.scrollTop>0,{},region);
    checks.push({layout,part:i+1,reading:true,fit:true,keyboard:true,metadata:true});
   }
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   assert.deepEqual(errors,[]);
   await page.evaluate(()=>window.scrollTo(0,0));
   await page.screenshot({path:path.join(report,layout+'.png')});await page.close();
  }
 }finally{await browser.close();}
 fs.writeFileSync(path.join(report,'report.json'),JSON.stringify({status:'passed',checks},null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
