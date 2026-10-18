// Supplemental gate for reviewed, centred, top-opening hollow development inputs.
// Expected floor thickness is explicit fixture evidence, not inferred CAD intent.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const puppeteer=require('/home/pptruser/node_modules/puppeteer');
(async()=>{
 const report=process.env.CERAMIC_REPORT, thickness=Number(process.env.CERAMIC_HOLLOW_FLOOR_MM);
 assert(Number.isFinite(thickness)&&thickness>0,'Explicit expected floor thickness required');
 fs.mkdirSync(report,{recursive:true});
 const browser=await puppeteer.launch({headless:true,executablePath:process.env.CERAMIC_CHROME,args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
 const checks=[];
 try{
  for(const [layout,width,height] of [['desktop',1440,900],['mobile',390,844]]){
   const page=await browser.newPage();await page.setViewport({width,height,deviceScaleFactor:1});
   await page.goto(process.env.CERAMIC_CANDIDATE,{waitUntil:'networkidle0'});
   await page.waitForFunction(()=>window.__multiplePage?.loaded||window.__mugMotion?.state?.target);
   const rows=await page.evaluate(async()=>{
    const T=await import('/skills/ceramic-cad-to-3d/node_modules/three/build/three.module.js');
    const multi=window.__multiplePage,single=window.__mugMotion;
    const groups=multi?multi.vessels.map((v,i)=>({id:multi.spec.parts[i].id,geometries:[v.geometry],wire:v.wireGeometry})):[{id:'single',geometries:single.meshes.map(m=>m.geometry),wire:single.wire.geometry}];
    return groups.map(g=>{
     const meshes=g.geometries.map(geometry=>new T.Mesh(geometry,new T.MeshBasicMaterial({side:T.DoubleSide}))),box=new T.Box3();
     meshes.forEach(m=>{m.updateMatrixWorld(true);box.expandByObject(m)});
     const centre=box.getCenter(new T.Vector3()),origin=new T.Vector3(centre.x,box.max.y+.01,centre.z);
     const hits=new T.Raycaster(origin,new T.Vector3(0,-1,0)).intersectObjects(meshes,false);
     if(!hits.length)throw Error('Missing interior floor');
     const floor=hits[0].point.y,normal=hits[0].face.normal.y;
     // An opaque top cap hits maxY; a missing floor hits minY or nothing.
     let innerWire=0;const a=g.wire.attributes.position;
     for(let i=0;i<a.count;i++)if(Math.abs(a.getY(i)-floor)<.0001)innerWire++;
     return {id:g.id,minY:box.min.y,maxY:box.max.y,floorY:floor,floorNormalY:normal,innerWireVertices:innerWire};
    });
   });
   for(const r of rows){assert(Math.abs((r.floorY-r.minY)*1000-thickness)<.15,'Opening/floor lost in rendered geometry');assert(r.maxY-r.floorY>.005);assert(r.floorNormalY>.9,'Inner floor normals inverted');assert(r.innerWireVertices>0,'Missing inner-floor wire guide');}
   await page.evaluate(()=>{const m=window.__multiplePage||window.__mugMotion,c=m.spec||m.pageConfig;scrollTo(0,(c.motion.storyHeightVh-100)*innerHeight/100)});
   await new Promise(r=>setTimeout(r,700));await page.screenshot({path:path.join(report,layout+'-hollow.png')});
   const elevation=await page.evaluate(()=>window.__mugMotion?.state.cameraElevationDegrees??null);
   if(elevation!==null){
    const configured=await page.evaluate(()=>window.__mugMotion.pageConfig.motion.surfaceElevationDegrees??0);
    assert.equal(elevation,configured);
    await page.evaluate(()=>{window.__mugMotion.pageConfig.motion.surfaceElevationDegrees=0});
    await new Promise(r=>setTimeout(r,150));
    assert.equal(await page.evaluate(()=>window.__mugMotion.state.cameraElevationDegrees),0,'Omitted/default elevation must preserve the front finish');
    await page.evaluate(v=>{window.__mugMotion.pageConfig.motion.surfaceElevationDegrees=v},configured);
   }
   checks.push({layout,rows,elevation});await page.close();
  }
 }finally{await browser.close()}
 fs.writeFileSync(path.join(report,'report.json'),JSON.stringify({status:'passed',scope:'centred top-opening rendered mesh, inner floor normals and wire; not arbitrary cavity certification',checks},null,2)+'\n');
})().catch(e=>{console.error(e);process.exitCode=1});
