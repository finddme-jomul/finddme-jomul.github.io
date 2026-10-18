const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const puppeteer=require('/home/pptruser/node_modules/puppeteer');
(async()=>{
 const report=process.env.CERAMIC_REPORT;fs.mkdirSync(report,{recursive:true});
 const base=process.env.CERAMIC_CANDIDATE.replace(/\/$/,'');
 const manifest=await fetch(base+'/drawing-manifest.json').then(r=>r.json());
 const browser=await puppeteer.launch({headless:true,executablePath:process.env.CERAMIC_CHROME,args:['--no-sandbox','--disable-dev-shm-usage']});
 const checks=[];
 try{
  for(const [layout,width,height] of [['desktop',1440,900],['short',1280,720],['mobile',390,844],['mobile-short',390,700]]){
   const page=await browser.newPage();await page.setViewport({width,height});
   const response=await fetch(base+'/'+manifest.layouts[layout].file);assert(response.ok,`SVG HTTP ${response.status}`);
   await page.setContent(await response.text());
   const result=await page.evaluate(()=>{
    const svg=document.querySelector('svg'),b=svg.viewBox.baseVal;
    return {parserError:!!document.querySelector('parsererror'),parts:[...document.querySelectorAll('[data-part]')].map(g=>({id:g.dataset.part,views:g.querySelectorAll('[data-view]').length})),
      outside:[...document.querySelectorAll('text,polyline')].filter(e=>{const a=e.getBBox();return a.x<-.1||a.y<-.1||a.x+a.width>b.width+.1||a.y+a.height>b.height+.1}).map(e=>e.textContent||'polyline')};
   });
   assert(!result.parserError);assert.deepEqual(result.parts.map(p=>p.id),manifest.parts.map(p=>p.id));
   assert(result.parts.every(p=>p.views===6));assert.deepEqual(result.outside,[]);
   await page.screenshot({path:path.join(report,layout+'.png'),fullPage:true});checks.push({layout,...result});await page.close();
  }
  fs.writeFileSync(path.join(report,'report.json'),JSON.stringify({status:'passed',scope:'Static SVG view completeness and canvas bounds; not motion or visual adoption',checks},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
