// Render real SVG text in the pinned browser; verify sheets, dimensions and text bounds.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const puppeteer=require('/home/pptruser/node_modules/puppeteer');
(async()=>{
 const report=process.env.CERAMIC_REPORT;fs.mkdirSync(report,{recursive:true});
 const browser=await puppeteer.launch({headless:true,executablePath:process.env.CERAMIC_CHROME,args:['--no-sandbox','--disable-dev-shm-usage']});
 const checks=[];
 try{
  const manifest=await (await fetch(process.env.CERAMIC_CANDIDATE+'/drawing-manifest.json')).json();
  for(const [layout,width,height] of [['desktop',1700,1060],['mobile',390,844]]){
   for(const part of manifest.parts){
    const page=await browser.newPage();await page.setViewport({width,height,deviceScaleFactor:1});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(process.env.CERAMIC_CANDIDATE+'/'+part.id+'-'+layout+'.svg',{waitUntil:'networkidle0'});
    await page.evaluate(()=>document.fonts.ready);
    const measured=await page.evaluate(()=>{
     const svg=document.querySelector('svg'),v=svg.viewBox.baseVal;
     const outside=[...svg.querySelectorAll('text')].filter(e=>{const b=e.getBBox();return b.x<0||b.y<0||b.x+b.width>v.width||b.y+b.height>v.height}).map(e=>e.textContent);
     return {outside,views:svg.querySelectorAll('[data-view]').length,details:svg.querySelectorAll('[data-detail]').length,hatch:svg.querySelectorAll('[fill="url(#dd-hatch)"]').length};
    });
    assert.equal(errors.length,0);assert.deepEqual(measured.outside,[]);assert.equal(measured.views,5);assert(measured.details>0);assert(measured.hatch>0);
    await page.screenshot({path:path.join(report,part.id+'-'+layout+'.png'),fullPage:true});
    checks.push({id:part.id,layout,...measured});await page.close();
   }
  }
 }finally{await browser.close()}
 fs.writeFileSync(path.join(report,'report.json'),JSON.stringify({status:'passed',scope:'Drawing SVGs; not full-page handoff or visual adoption',checks},null,2)+'\n');
})().catch(e=>{console.error(e);process.exitCode=1});
