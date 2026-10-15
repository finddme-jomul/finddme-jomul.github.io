#!/usr/bin/env node
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const puppeteer=require('/home/pptruser/node_modules/puppeteer');
const output=process.env.JOMUL_MOTION_OUTPUT||'/workspace/.poc/mug-moon-motion-study/browser-review';
const base=process.env.JOMUL_MOTION_BASE||'http://127.0.0.1:5173/.poc/mug-moon-motion-study/index.html';
const cases=[['desktop',1440,900],['short',1280,600],['mobile',390,844],['mobile-short',390,700]];
const points=[['sheet',0],['handoff',.43],['wire',.56],['quarter',.685],['half',.79],['full',1]];

(async()=>{
  fs.mkdirSync(output,{recursive:true});
  const browser=await puppeteer.launch({
    headless:true,executablePath:'/browser/chrome/linux-152.0.7977.54/chrome-linux64/chrome',
    args:['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage',
          '--enable-webgl','--use-gl=angle','--use-angle=swiftshader']
  });
  const inputPath=process.env.JOMUL_MOTION_INPUT||'/workspace/.poc/mug-moon-motion-study/review-input.json';
  const input=JSON.parse(fs.readFileSync(inputPath));
  const motion=JSON.parse(fs.readFileSync(inputPath.replace('review-input.json','motion-config.json')));
  const report={schemaVersion:1,status:'reviewed-provisional',sourceSha256:input.sourceSha256,glbSha256:input.glbSha256,cases:[]};
  try {
    for (const [layout,width,height] of cases) {
      const page=await browser.newPage(),errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.setViewport({width,height,deviceScaleFactor:1});
      const response=await page.goto(base,{waitUntil:'networkidle0'});
      assert([200,304].includes(response.status()));
      await page.waitForFunction(()=>!!window.__mugMotion?.state?.target);
      const results=[];
      for (const [name,progress] of points) {
        await page.evaluate(p=>scrollTo(0,innerHeight*1.8*p),progress);
        await new Promise(resolve=>setTimeout(resolve,400));
        const state=await page.evaluate(()=>{
          const root=window.__mugMotion,state=root.state;
          const wireVertices=root.wire.geometry.attributes.position.count;
          const p=new root.camera.position.constructor();
          const model=root.model,camera=root.camera;
          model.updateMatrixWorld(true);camera.updateMatrixWorld();
          let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
          for(const mesh of root.meshes) {
            const a=mesh.geometry.attributes.position;
            for(let i=0;i<a.count;i++) {
              p.fromBufferAttribute(a,i).applyMatrix4(model.matrixWorld).project(camera);
              const x=(p.x+1)*innerWidth/2,y=(1-p.y)*innerHeight/2;
              minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);
            }
          }
          const meshBox={x:minX,y:minY,width:maxX-minX,height:maxY-minY};
          const sheetRect=document.querySelector('#sheet-image').getBoundingClientRect();
          return {...state,meshBox,wireVertices,viewport:[innerWidth,innerHeight],
                  scrollWidth:document.documentElement.scrollWidth,
                  sheetRect:{x:sheetRect.x,y:sheetRect.y,width:sheetRect.width,height:sheetRect.height}};
        });
        assert(state.scrollWidth<=width+1,'horizontal overflow');
        assert(state.wireVertices>500&&state.wireVertices<6000,'CAD guide expected, not raw mesh triangle edges');
        assert(state.meshBox.x>=-1&&state.meshBox.y>=-1&&
               state.meshBox.x+state.meshBox.width<=width+1&&
               state.meshBox.y+state.meshBox.height<=height+1,'mesh clipped '+JSON.stringify({layout,name,meshBox:state.meshBox,viewport:state.viewport,target:state.target}));
        if(name==='handoff') {
          const frontError=Math.max(...Object.keys(state.front).map(k=>Math.abs(state.front[k]-state.meshBox[k])));
          const targetError=Math.max(...Object.keys(state.target).map(k=>Math.abs(state.target[k]-state.meshBox[k])));
          assert(frontError<1.5,'CAD front to GLB boundary mismatch '+frontError);
          assert(targetError<1.5,'manifest to GLB boundary mismatch '+targetError);
          assert(state.frontOpacity>.8&&state.lineOpacity>.4);
          state.frontErrorPx=frontError;state.targetErrorPx=targetError;
        }
        if(name==='wire')assert(state.lineOpacity>.8&&state.frontOpacity<.1);
        if(name==='quarter')assert(Math.abs(state.axisPrecessionDegrees-motion.axisPrecessionDegrees*.25)<1&&state.axisTiltDegrees>0);
        if(name==='half')assert(Math.abs(state.axisPrecessionDegrees-motion.axisPrecessionDegrees*.5)<1);
        if(name==='full')assert(Math.abs(state.bodySpinDegrees-motion.bodySpinDegrees)<.3&&Math.abs(state.axisPrecessionDegrees-motion.axisPrecessionDegrees)<.3&&Math.abs(state.axisTiltDegrees-motion.tiltDegrees)<.1,
          'full motion '+JSON.stringify({layout,progress:state.progress,body:state.bodySpinDegrees,axis:state.axisPrecessionDegrees,tilt:state.axisTiltDegrees}));
        await page.screenshot({path:path.join(output,layout+'-'+name+'.png')});
        results.push({name,...state});
      }
      assert.deepEqual(errors,[]);
      report.cases.push({layout,viewport:[width,height],results,errors});
      await page.close();
      console.log('MUG_BROWSER_CASE_OK',layout);
    }
    fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2)+'\n');
    console.log('JOMUL_MUG_MOTION_BROWSER_OK',output);
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exit(1)});
