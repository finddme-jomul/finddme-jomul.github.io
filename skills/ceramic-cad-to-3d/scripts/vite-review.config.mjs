import {defineConfig} from '../node_modules/vite/dist/node/index.js';
export default defineConfig({
 appType:'mpa',
 plugins:[{name:'ceramic-review-host',configureServer(server){server.middlewares.use('/__ceramic_review_host__',(_req,res)=>{res.setHeader('Content-Type','text/html');res.end('<!doctype html><html><head><title>Viewer test host</title></head><body></body></html>')})}}],
 root:'/workspace', cacheDir:'/tmp/ceramic-vite-cache',
 optimizeDeps:{noDiscovery:true,entries:[]},
 resolve:{alias:[
  {find:/^animejs$/,replacement:'/ceramic-skill/node_modules/animejs/dist/modules/index.js'},
  {find:'animejs/adapters/three',replacement:'/ceramic-skill/node_modules/animejs/dist/modules/adapters/three/index.js'},
  {find:/^three$/,replacement:'/ceramic-skill/node_modules/three/build/three.module.js'},
  {find:'three/addons',replacement:'/ceramic-skill/node_modules/three/examples/jsm'},
 ]},
 server:{hmr:false,watch:null,host:'127.0.0.1',port:5173,strictPort:true,fs:{allow:['/workspace','/ceramic-skill']}},
});
