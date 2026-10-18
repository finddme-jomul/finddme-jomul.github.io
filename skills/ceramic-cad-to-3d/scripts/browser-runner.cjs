// Runs the pinned local server and browser checker in one network-isolated container.
const {spawn}=require('node:child_process');
const fs=require('node:fs');
const config=JSON.parse(fs.readFileSync('/ceramic-skill/environment.json'));
const puppeteer=require('/home/pptruser/node_modules/puppeteer');
(async()=>{
 if(process.versions.node!==config.node)throw Error('Node version mismatch');
 if(require('/home/pptruser/node_modules/puppeteer/package.json').version!==config.puppeteer)throw Error('Puppeteer version mismatch');
 process.env.CERAMIC_CHROME=await puppeteer.executablePath();
 const probe=await puppeteer.launch({executablePath:process.env.CERAMIC_CHROME,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{if(!(await probe.version()).endsWith(config.chrome))throw Error('Chrome version mismatch');}finally{await probe.close();}
 const server=spawn(process.execPath,['/ceramic-skill/node_modules/vite/bin/vite.js','--config','/ceramic-skill/scripts/vite-review.config.mjs','--configLoader','native'],{cwd:'/workspace',stdio:['ignore','ignore','inherit']});
 try{
  let ready=false;
  for(let i=0;i<100;i++){
   if(server.exitCode!==null)throw Error('Review server exited');
   try{await fetch('http://127.0.0.1:5173/');ready=true;break;}catch{}
   await new Promise(r=>setTimeout(r,100));
  }
  if(!ready)throw Error('Review server did not start');
  const checker=spawn(process.execPath,[process.argv[2]],{cwd:'/workspace',env:process.env,stdio:'inherit'});
  const code=await new Promise((resolve,reject)=>{checker.on('error',reject);checker.on('exit',(code)=>resolve(code??1));});
  if(code)throw Error(`Browser check failed (${code})`);
 }finally{server.kill();}
})().catch(error=>{console.error(error);process.exitCode=1;});
