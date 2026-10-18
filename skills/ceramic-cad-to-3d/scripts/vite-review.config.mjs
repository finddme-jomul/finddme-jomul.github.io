import {defineConfig} from '../node_modules/vite/dist/node/index.js';
export default defineConfig({
 root:'/workspace', cacheDir:'/tmp/ceramic-vite-cache',
 optimizeDeps:{noDiscovery:true},
 resolve:{alias:[
  {find:/^animejs$/,replacement:'/ceramic-skill/node_modules/animejs/dist/modules/index.js'},
  {find:'animejs/adapters/three',replacement:'/ceramic-skill/node_modules/animejs/dist/modules/adapters/three/index.js'},
  {find:/^three$/,replacement:'/ceramic-skill/node_modules/three/build/three.module.js'},
  {find:'three/addons',replacement:'/ceramic-skill/node_modules/three/examples/jsm'},
 ]},
 server:{host:'127.0.0.1',port:5173,strictPort:true,fs:{allow:['/workspace','/ceramic-skill']}},
});
