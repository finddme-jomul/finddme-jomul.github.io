const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const puppeteer=require('/home/pptruser/node_modules/puppeteer');
(async()=>{
 const report=process.env.CERAMIC_REPORT;fs.mkdirSync(report,{recursive:true});
 const browser=await puppeteer.launch({headless:true,executablePath:process.env.CERAMIC_CHROME,args:['--no-sandbox','--disable-dev-shm-usage']});
 const checks=[],keyframes=[0,.1,.25,.43,.55,.75,.9,1];
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewport({width:1700,height:1150,deviceScaleFactor:1});
  await page.goto(process.env.CERAMIC_CANDIDATE+'/index.html',{waitUntil:'networkidle0'});
  await page.waitForFunction(()=>window.__drawingMotion?.ready);
  const config=await page.evaluate(async()=>await(await fetch('./motion.json')).json());
  const ids=await page.$$eval('#part option',es=>es.map(e=>e.value));
  for(const [layout,width,height] of [['desktop',1700,1150],['mobile',390,844]]){
   await page.setViewport({width,height,deviceScaleFactor:1});
   await page.waitForFunction(()=>window.__drawingMotion?.ready&&document.querySelector('svg').viewBox.baseVal.width===(innerWidth<=700?900:1700));
   for(const id of ids){
    await page.select('#part',id);await page.waitForFunction(()=>window.__drawingMotion.ready);
    const cameraKeys=config.parts.find(p=>p.id===id).cameraKeys;
    if(cameraKeys)for(const key of cameraKeys){
     const matched=await page.evaluate(key=>{
      const api=window.__drawingMotion;api.setProgress(key.at);
      const svg=document.querySelector('svg'),vb=svg.viewBox.baseVal;
      let cx=vb.width/2,cy=vb.height/2;
      if(key.target!=='sheet'){
       const [kind,value]=key.target.split(':');
       const g=[...svg.querySelectorAll('[data-'+kind+']')].find(e=>e.getAttribute('data-'+kind)===value);
       const box=(g.querySelector('clipPath rect')||g).getBBox();cx=box.x+box.width/2;cy=box.y+box.height/2;
      }
      const m=svg.querySelector('[data-motion-camera]').transform.baseVal.consolidate().matrix;
      return Math.abs(m.a-key.zoom)<1e-5&&Math.abs(m.e-(vb.width/2-cx*key.zoom))<.001&&Math.abs(m.f-(vb.height/2-cy*key.zoom))<.001;
     },key);
     assert(matched,'Camera key target: '+key.target);
    }
    const result=await page.evaluate(()=>{
     const api=window.__drawingMotion;
     api.setProgress(.43);const forward=JSON.stringify(api.snapshot());
     api.setProgress(.99);api.setProgress(.43);
     const reversible=forward===JSON.stringify(api.snapshot()),writes=api.writes;
     api.setProgress(.43);const stable=writes===api.writes;
     api.setProgress(1);return {reversible,stable,finalRestored:api.finalRestored};
    });
    if(!result.finalRestored)console.log(await page.evaluate(async({id,layout})=>{
 const xml=await(await fetch('./'+id+'-'+layout+'.svg')).text(),doc=new DOMParser().parseFromString(xml,'image/svg+xml');
 const tags='path,polyline,line,circle,ellipse,rect,text',a=[...document.querySelector('svg').querySelectorAll(tags)],b=[...doc.querySelectorAll(tags)];
 return a.flatMap((e,i)=>['style','pathLength'].flatMap(k=>e.getAttribute(k)!==b[i]?.getAttribute(k)?[{tag:e.outerHTML.slice(0,250),key:k,expected:b[i]?.getAttribute(k)}]:[])).slice(0,10);
 },{id,layout}));
    assert.deepEqual(result,{reversible:true,stable:true,finalRestored:true});
    const final=await (await page.$('#drawing')).screenshot();
    await page.evaluate(async({id,layout})=>{
     const xml=await(await fetch('./'+id+'-'+layout+'.svg')).text();
     document.querySelector('#drawing').replaceChildren(document.importNode(new DOMParser().parseFromString(xml,'image/svg+xml').documentElement,true));
    },{id,layout});
    const original=await(await page.$('#drawing')).screenshot();assert(final.equals(original),'Final SVG pixel parity: '+id+' '+layout);
    await page.select('#part',id);await page.waitForFunction(()=>window.__drawingMotion.ready);
    for(const progress of keyframes){
     await page.evaluate(p=>window.__drawingMotion.setProgress(p),progress);
     await page.screenshot({path:path.join(report,id+'-'+layout+'-'+progress+'.png')});
    }
    checks.push({id,layout,...result,pixelParity:true,cameraKeys:cameraKeys?.length||0});
   }
  }
  await page.evaluate(()=>{const s=document.querySelector('#seek');s.value='420';s.dispatchEvent(new Event('input'));});
  assert.equal(await page.evaluate(()=>window.__drawingMotion.snapshot().progress),.42);
  await page.click('#play');await page.waitForFunction(()=>window.__drawingMotion.snapshot().progress>.43);
  await page.click('#play');
  const idle=await page.evaluate(()=>({writes:window.__drawingMotion.writes,p:window.__drawingMotion.snapshot().progress}));
  await new Promise(r=>setTimeout(r,250));
  assert.deepEqual(await page.evaluate(()=>({writes:window.__drawingMotion.writes,p:window.__drawingMotion.snapshot().progress})),idle);
  await page.setViewport({width:1700,height:1150});
  await page.waitForFunction(()=>window.__drawingMotion.ready&&document.querySelector('svg').viewBox.baseVal.width===1700);
  assert.equal(await page.evaluate(()=>window.__drawingMotion.snapshot().progress),idle.p);
  for(const [scrollWidth,scrollHeight] of [[1700,1150],[390,844]]){
  await page.setViewport({width:scrollWidth,height:scrollHeight});
  await page.waitForFunction(()=>window.__drawingMotion.ready&&document.querySelector('svg').viewBox.baseVal.width===(innerWidth<=700?900:1700));
  await page.click('#scroll-mode');
  async function scrollToProgress(p){
   await page.evaluate(p=>{const e=document.scrollingElement;e.scrollTop=(e.scrollHeight-e.clientHeight)*p;},p);
   await page.waitForFunction(p=>{const e=document.scrollingElement;const actual=e.scrollTop/(e.scrollHeight-e.clientHeight);return Math.abs(actual-p)<.002&&Math.abs(window.__drawingMotion.snapshot().progress-actual)<1e-12;},{},p);
  }
  await scrollToProgress(.43);
  const scrollForward=await page.evaluate(()=>JSON.stringify(window.__drawingMotion.snapshot()));
  await scrollToProgress(1);assert(await page.evaluate(()=>window.__drawingMotion.finalRestored));
  await scrollToProgress(.43);
  assert(await page.evaluate(expected=>JSON.stringify(window.__drawingMotion.snapshot())===expected,scrollForward),'Scroll forward/reverse frame equivalence');
  assert.equal(await page.$eval('#play',e=>e.disabled),true);
  await scrollToProgress(0);
  await page.click('#scroll-mode');
  }
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
  await page.waitForFunction(()=>window.__drawingMotion.ready&&document.querySelector('#play').disabled&&window.__drawingMotion.finalRestored);
  assert.equal(await page.evaluate(()=>window.__drawingMotion.setProgress(.2)),1);
  assert.equal(await page.evaluate(()=>window.__drawingMotion.playing),false);
  assert.deepEqual(errors,[]);
 }finally{await browser.close();}
 fs.writeFileSync(path.join(report,'report.json'),JSON.stringify({status:'passed',checks,keyframes,controls:true,scrollForwardReverse:true,responsiveProgress:true,reducedMotion:true,scope:'Standalone CAD motion; no page handoff or visual adoption'},null,2)+'\n');
})().catch(e=>{console.error(e);process.exitCode=1});
