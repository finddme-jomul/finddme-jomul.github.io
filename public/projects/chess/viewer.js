var Ng=Object.defineProperty;var Bt=(i,e)=>()=>(i&&(e=i(i=0)),e);var Gd=(i,e)=>{for(var t in e)Ng(i,t,{get:e[t],enumerable:!0})};var js,_a=Bt(()=>{js={handled:{pixelRatioCap:2,skyColor:"#ffffff",groundColor:"#a9a39a",hemisphereIntensity:2.2,keyColor:"#ffffff",keyIntensity:2.4,keyPosition:[.15,.25,.4],clayColor:"#d7d2ca",clayRoughness:.88,heightFit:.68,radialFit:1.13,rotationMargin:1.06,cameraDistanceFactor:4,previewScrollVh:180,timing:{turnStart:.58,turnDuration:.42,lookCenterDuration:.15,frontTravelStart:.12,frontTravelDuration:.31,frontStart:.1,frontFadeStart:.42,frontFadeDuration:.12,sheetFadeStart:.07,sheetFadeDuration:.2,hostFadeStart:.32,hostFadeDuration:.15,wireStart:.36,wireDuration:.14,pageClayEnd:.72,pageCoatDuration:.28,photoDuration:.1}},rotational:{pixelRatioCap:2,fov:32,near:.01,far:10,skyColor:"#ffffff",groundColor:"#819092",hemisphereIntensity:2.2,keyColor:"#ffffff",keyIntensity:3,keyPosition:[.15,.3,.2],clayRoughness:.95,fit:1.35,wideFit:1.05},multiple:{pixelRatioCap:1.6,exposure:1.45,fov:32,near:.01,far:10,skyColor:"#ffffff",groundColor:"#c8c7c2",hemisphereIntensity:1.7,keyColor:"#ffffff",pointLights:[[-.3,.35,.5,3.5],[.3,.2,-.2,2.2]]}}});var Qs,xa=Bt(()=>{Qs="#6E6A68"});function to({gallery:i,story:e,isActive:t,onActiveChange:n=()=>{},profile:s,source:r}){let o=[...i.querySelectorAll(".gallery-photo")];if(!o.length)throw new Error("Gallery needs at least one photo");let a=i.querySelector(".gallery-first"),l=matchMedia("(prefers-reduced-motion: reduce)"),c=document.querySelector("#photo-lightbox");if(!a||!c)throw new Error("Gallery structure is incomplete");let u=c.querySelector("img"),d=!1,h=null,f=performance.now(),g=o.map(A=>({photo:A,zoom:1,x:0,y:0,targetZoom:1,targetX:0,targetY:0})),y=(A,v,M)=>Math.max(v,Math.min(M,A));function m(){d=!!t(),i.classList.toggle("gallery-active",d),e.setAttribute("aria-hidden",d?"true":"false"),i.setAttribute("aria-hidden",d?"false":"true"),n(d)}addEventListener("scroll",m,{passive:!0}),addEventListener("resize",m),m();function p(A){let v=Math.min(64,A-f);f=A;let M=h?(h.x/innerWidth-.5)*2:0,b=h?(h.y/innerHeight-.5)*2:0,R=a.getBoundingClientRect();for(let E of g){let P=E.photo,D=P.classList.contains("gallery-photo--process"),V=P.offsetWidth,W=P.offsetHeight,L=R.left+P.offsetLeft+V/2,z=R.top+P.offsetTop+W/2,K=h?h.x-L:1/0,H=h?h.y-z:1/0,te=D?390:s.pointerRadiusPx,N=h&&d&&!l.matches?y(1-Math.hypot(K,H)/te,0,1):0,Y=N*N*(3-2*N),ne=document.activeElement===P,Me=D?.9:s.pointerMaxExtraScale;E.targetZoom=Math.max(1+Me*Y,ne?1.14:1),E.targetX=d&&!l.matches?M*(D?16:-12)+y(K/Math.max(V,1),-1,1)*Y*12:0,E.targetY=d&&!l.matches?b*(D?11:-8)+y(H/Math.max(W,1),-1,1)*Y*10:0,P.classList.toggle("is-near",Y>.12||ne)}let x=l.matches?1:1-Math.exp(-v/s.pointerEaseMs);for(let E of g)E.zoom+=(E.targetZoom-E.zoom)*x,E.x+=(E.targetX-E.x)*x,E.y+=(E.targetY-E.y)*x,E.photo.style.setProperty("--zoom",E.zoom.toFixed(4)),E.photo.style.setProperty("--drift-x",`${E.x.toFixed(2)}px`),E.photo.style.setProperty("--drift-y",`${E.y.toFixed(2)}px`);requestAnimationFrame(p)}a.addEventListener("pointermove",A=>{A.pointerType==="mouse"&&(h={x:A.clientX,y:A.clientY})}),a.addEventListener("pointerleave",()=>{h=null});for(let A of o)A.addEventListener("click",()=>{if(!d)return;let v=A.querySelector("img");u.src=v.currentSrc||v.src,u.alt=v.alt,h=null,c.showModal()});c.querySelector(".lightbox-close").addEventListener("click",()=>c.close()),c.addEventListener("click",A=>{A.target===c&&c.close()}),requestAnimationFrame(p);let T={gallery:i,galleryPhotos:o,photoStates:g,photo:o[0],photoState:g[0],source:r,sync:m};return window.__galleryStudy=T,T}var Jl=Bt(()=>{});var no,jl=Bt(()=>{no={source:"moonGalleryHtml",lastSectionHeightVh:100,photoOnlyScrollVh:0,visibleHeading:!1,visibleCaption:!1,heroMaxWidthPx:540,heroMaxHeightVh:68,mobileHeroMaxHeightVh:54,photoArriveSeconds:.55,pointerRadiusPx:450,pointerMaxExtraScale:.34,pointerEaseMs:85,openOnClick:!0,contentAfterGallery:!1}});function Ug(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Fg(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function xr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function cp(){let i=xr("canvas");return i.style.display="block",i}function mo(...i){let e="THREE."+i.shift();yr?yr("log",e,...i):console.log(e,...i)}function lp(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function qe(...i){i=lp(i);let e="THREE."+i.shift();if(yr)yr("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function Ke(...i){i=lp(i);let e="THREE."+i.shift();if(yr)yr("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function As(...i){let e=i.join(" ");e in Wd||(Wd[e]=!0,qe(...i))}function up(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function Kn(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(nn[i&255]+nn[i>>8&255]+nn[i>>16&255]+nn[i>>24&255]+"-"+nn[e&255]+nn[e>>8&255]+"-"+nn[e>>16&15|64]+nn[e>>24&255]+"-"+nn[t&63|128]+nn[t>>8&255]+"-"+nn[t>>16&255]+nn[t>>24&255]+nn[n&255]+nn[n>>8&255]+nn[n>>16&255]+nn[n>>24&255]).toLowerCase()}function ut(i,e,t){return Math.max(e,Math.min(t,i))}function sh(i,e){return(i%e+e)%e}function Og(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Bg(i,e,t){return i!==e?(t-i)/(e-i):0}function fo(i,e,t){return(1-t)*i+t*e}function zg(i,e,t,n){return fo(i,e,1-Math.exp(-t*n))}function kg(i,e=1){return e-Math.abs(sh(i,e*2)-e)}function Vg(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Hg(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Gg(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Wg(i,e){return i+Math.random()*(e-i)}function Xg(i){return i*(.5-Math.random())}function qg(i){i!==void 0&&(Xd=i);let e=Xd+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Yg(i){return i*ho}function Zg(i){return i*Is}function Kg(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function $g(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Jg(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function jg(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),u=o((e+n)/2),d=r((e-n)/2),h=o((e-n)/2),f=r((n-e)/2),g=o((n-e)/2);switch(s){case"XYX":i.set(a*u,l*d,l*h,a*c);break;case"YZY":i.set(l*h,a*u,l*d,a*c);break;case"ZXZ":i.set(l*d,l*h,a*u,a*c);break;case"XZX":i.set(a*u,l*g,l*f,a*c);break;case"YXY":i.set(l*f,a*u,l*g,a*c);break;case"ZYZ":i.set(l*g,l*f,a*u,a*c);break;default:qe("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Yn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function vt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Qg(){let i={enabled:!0,workingColorSpace:un,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===_t&&(s.r=Ui(s.r),s.g=Ui(s.g),s.b=Ui(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===_t&&(s.r=pr(s.r),s.g=pr(s.g),s.b=pr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Xi?po:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return As("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return As("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[un]:{primaries:e,whitePoint:n,transfer:po,toXYZ:Yd,fromXYZ:Zd,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:St},outputColorSpaceConfig:{drawingBufferColorSpace:St}},[St]:{primaries:e,whitePoint:n,transfer:_t,toXYZ:Yd,fromXYZ:Zd,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:St}}}),i}function Ui(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function pr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}function tu(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?ec.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(qe("Texture: Unable to serialize Texture."),{})}function su(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}function du(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Ts.fromArray(i,r);let a=s.x*Math.abs(Ts.x)+s.y*Math.abs(Ts.y)+s.z*Math.abs(Ts.z),l=e.dot(Ts),c=t.dot(Ts),u=n.dot(Ts);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}function m0(i,e,t,n,s,r,o,a){let l;if(e.side===dn?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===mi,a),l===null)return null;Da.copy(a),Da.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(Da);return c<t.near||c>t.far?null:{distance:c,point:Da.clone(),object:i}}function Na(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,Ca),i.getVertexPosition(l,Ia),i.getVertexPosition(c,Pa);let u=m0(i,e,t,n,Ca,Ia,Pa,of);if(u){let d=new O;as.getBarycoord(of,Ca,Ia,Pa,d),s&&(u.uv=as.getInterpolatedAttribute(s,a,l,c,d,new at)),r&&(u.uv1=as.getInterpolatedAttribute(r,a,l,c,d,new at)),o&&(u.normal=as.getInterpolatedAttribute(o,a,l,c,d,new O),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let h={a,b:l,c,normal:new O,materialIndex:0};as.getNormal(Ca,Ia,Pa,h.normal),u.face=h,u.barycoord=d}return u}function za(i,e,t,n,s,r,o){let a=i.geometry.attributes.position;if(ic.fromBufferAttribute(a,s),sc.fromBufferAttribute(a,r),t.distanceSqToSegment(ic,sc,vu,mf)>n)return;vu.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(vu);if(!(c<e.near||c>e.far))return{distance:c,point:mf.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}function yf(i,e,t,n,s,r,o){let a=Ru.distanceSqToPoint(i);if(a<t){let l=new O;Ru.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}function Bs(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(vf(s))s.isRenderTargetTexture?(qe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(vf(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function on(i){let e={};for(let t=0;t<i.length;t++){let n=Bs(i[t]);for(let s in n)e[s]=n[s]}return e}function vf(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function v0(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function rh(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ot.workingColorSpace}function os(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function qa(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}function b0(i){function e(s,r){return i[s]-i[r]}let t=i.length,n=new Array(t);for(let s=0;s!==t;++s)n[s]=s;return n.sort(e),n}function Sf(i,e,t){let n=i.length,s=new i.constructor(n);for(let r=0,o=0;o!==n;++r){let a=t[r]*e;for(let l=0;l!==e;++l)s[o++]=i[a+l]}return s}function T0(i,e,t,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(e.push(r.time),t.push(...o)),r=i[s++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(e.push(r.time),o.toArray(t,t.length)),r=i[s++];while(r!==void 0);else do o=r[n],o!==void 0&&(e.push(r.time),t.push(o)),r=i[s++];while(r!==void 0)}function pp(i,e,t,n,s){let r=1-i;return r*r*r*e+3*r*r*i*t+3*r*i*i*n+i*i*i*s}function E0(i,e,t,n,s){let r=1-i;return 3*r*r*(t-e)+6*r*i*(n-t)+3*i*i*(s-n)}function w0(i,e,t,n,s){let r=(i-e)/(s-e);for(let o=0;o<8;o++){let a=pp(r,e,t,n,s)-i;if(Math.abs(a)<1e-10)break;let l=E0(r,e,t,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-a/l))}return r}function Mf(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]*=e}function A0(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return zi;case"vector":case"vector2":case"vector3":case"vector4":return us;case"color":return Ro;case"quaternion":return ki;case"bool":case"boolean":return Bi;case"string":return Vi}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function R0(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=A0(i.type);if(i.times===void 0){let n=[],s=[];T0(i.keys,n,s,"value"),i.times=n,i.values=s}let t;return e.parse!==void 0?t=e.parse(i):t=new e(i.name,i.times,i.values,i.interpolation),qa(i.settings)&&(t.settings={inTangents:os(i.settings.inTangents,Float32Array),outTangents:os(i.settings.outTangents,Float32Array)}),t}function bf(i){try{let e=i.slice(i.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}function ch(i,e,t,n){let s=O0(n);switch(t){case Qu:return i*e;case Tc:return i*e/s.components*s.byteLength;case Ec:return i*e/s.components*s.byteLength;case fs:return i*e*2/s.components*s.byteLength;case wc:return i*e*2/s.components*s.byteLength;case eh:return i*e*3/s.components*s.byteLength;case Pn:return i*e*4/s.components*s.byteLength;case Ac:return i*e*4/s.components*s.byteLength;case Oo:case Bo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case zo:case ko:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Cc:case Pc:return Math.max(i,16)*Math.max(e,8)/4;case Rc:case Ic:return Math.max(i,8)*Math.max(e,8)/2;case Lc:case Dc:case Uc:case Fc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Nc:case Vo:case Oc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Bc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case zc:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case kc:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Vc:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Hc:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Gc:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Wc:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Xc:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case qc:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Yc:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Zc:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Kc:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case $c:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Jc:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case jc:case Qc:case el:return Math.ceil(i/4)*Math.ceil(e/4)*16;case tl:case nl:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Ho:case il:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function O0(i){switch(i){case vn:case Ku:return{byteLength:1,components:1};case Nr:case $u:case ni:return{byteLength:2,components:1};case Mc:case bc:return{byteLength:2,components:4};case ti:case Sc:case In:return{byteLength:4,components:1};case Ju:case ju:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}var Rf,Uu,Cf,No,If,Pr,mi,dn,Wt,gi,Lr,Fu,Ou,Bu,Pf,Us,Lf,Df,Nf,Uf,Ff,Of,Bf,zf,zu,ku,kf,Vf,Hf,Gf,Wf,Xf,qf,Yf,Zf,Ya,Za,Ka,mr,$a,Ja,ja,Qa,Vu,Kf,$f,Qn,Hu,Gu,Wu,Uo,Xu,qu,Yu,bu,Jf,Zu,hs,Fs,xc,yc,Fo,cs,Bn,gr,zt,vc,Os,kt,Dr,ei,vn,Ku,$u,Nr,Sc,ti,In,ni,Mc,bc,Ur,Ju,ju,Qu,eh,Pn,ui,ds,Tc,Ec,fs,wc,Ac,Oo,Bo,zo,ko,Rc,Cc,Ic,Pc,Lc,Dc,Nc,Uc,Fc,Vo,Oc,Bc,zc,kc,Vc,Hc,Gc,Wc,Xc,qc,Yc,Zc,Kc,$c,Jc,jc,Qc,el,tl,nl,Ho,il,Rs,Cs,Wa,Tu,Eu,wu,Au,jf,th,Go,Fr,Qf,sl,ep,Xi,St,un,po,_t,Xa,tp,np,ip,sp,rl,rp,op,ol,ap,nh,ih,Zn,_r,Wd,yr,hp,hi,nn,Xd,ho,Is,Sn,at,hn,O,Ql,qd,je,eu,Yd,Zd,ot,er,ec,e0,vr,t0,nu,jt,Mt,tc,gn,go,nc,Qe,tr,Wn,n0,i0,ts,ya,En,Kd,$d,$n,_o,s0,Jd,nr,Ci,va,io,r0,o0,jd,Qd,ef,tf,a0,ir,iu,Rt,At,c0,Sr,dp,ns,Sa,Ge,sn,Fi,Xn,Ii,ru,Pi,sr,rr,nf,ou,au,cu,lu,uu,hu,as,An,Li,qn,Ma,or,ar,cr,is,ss,bs,so,ba,Ta,Ts,Gt,Ea,l0,Nt,xo,yo,Lt,u0,ro,fu,_n,h0,On,pu,lr,wn,oo,Jt,Pt,Mr,ln,br,mu,d0,f0,rn,p0,xn,Di,gu,wa,Aa,Ps,Jn,sf,Es,Ra,rf,Ca,Ia,Pa,_u,La,of,Da,It,ao,af,cf,g0,lf,Ua,xu,uf,yu,vo,Tr,Er,hf,_0,So,Oi,ur,df,Fa,ff,x0,co,lo,Mo,ws,y0,Oa,wr,zn,ic,sc,pf,uo,Ba,vu,mf,Ls,gf,_f,jn,bo,Ar,xf,Ru,ka,Va,To,Eo,ls,rc,wo,Rr,Ao,fp,S0,M0,Rn,oc,Cn,Qt,ac,cc,di,lc,uc,hc,dc,yn,Bi,Ro,zi,fc,ki,Vi,us,Co,li,pc,mp,fi,Ni,Cu,Cr,hr,mc,Io,Ds,Hi,Su,Tf,Ef,Ir,Ha,Ga,ci,Po,rs,wf,Af,Dt,Iu,Lo,Pu,Ns,pi,Lu,Gi,Wi,Mu,Do,dr,fr,gc,_c,oh,C0,ah,I0,P0,L0,D0,N0,U0,F0,Du,Et,SM,Nu,lh=Bt(()=>{Rf=0,Uu=1,Cf=2,No=1,If=2,Pr=3,mi=0,dn=1,Wt=2,gi=0,Lr=1,Fu=2,Ou=3,Bu=4,Pf=5,Us=100,Lf=101,Df=102,Nf=103,Uf=104,Ff=200,Of=201,Bf=202,zf=203,zu=204,ku=205,kf=206,Vf=207,Hf=208,Gf=209,Wf=210,Xf=211,qf=212,Yf=213,Zf=214,Ya=0,Za=1,Ka=2,mr=3,$a=4,Ja=5,ja=6,Qa=7,Vu=0,Kf=1,$f=2,Qn=0,Hu=1,Gu=2,Wu=3,Uo=4,Xu=5,qu=6,Yu=7,bu="attached",Jf="detached",Zu=300,hs=301,Fs=302,xc=303,yc=304,Fo=306,cs=1e3,Bn=1001,gr=1002,zt=1003,vc=1004,Os=1005,kt=1006,Dr=1007,ei=1008,vn=1009,Ku=1010,$u=1011,Nr=1012,Sc=1013,ti=1014,In=1015,ni=1016,Mc=1017,bc=1018,Ur=1020,Ju=35902,ju=35899,Qu=1021,eh=1022,Pn=1023,ui=1026,ds=1027,Tc=1028,Ec=1029,fs=1030,wc=1031,Ac=1033,Oo=33776,Bo=33777,zo=33778,ko=33779,Rc=35840,Cc=35841,Ic=35842,Pc=35843,Lc=36196,Dc=37492,Nc=37496,Uc=37488,Fc=37489,Vo=37490,Oc=37491,Bc=37808,zc=37809,kc=37810,Vc=37811,Hc=37812,Gc=37813,Wc=37814,Xc=37815,qc=37816,Yc=37817,Zc=37818,Kc=37819,$c=37820,Jc=37821,jc=36492,Qc=36494,el=36495,tl=36283,nl=36284,Ho=36285,il=36286,Rs=2300,Cs=2301,Wa=2302,Tu=2303,Eu=2400,wu=2401,Au=2402,jf=2500,th=0,Go=1,Fr=2,Qf=3200,sl=0,ep=1,Xi="",St="srgb",un="srgb-linear",po="linear",_t="srgb",Xa=7680,tp=519,np=512,ip=513,sp=514,rl=515,rp=516,op=517,ol=518,ap=519,nh=35044,ih="300 es",Zn=2e3,_r=2001;Wd={},yr=null;hp={[Ya]:Za,[Ka]:ja,[$a]:Qa,[mr]:Ja,[Za]:Ya,[ja]:Ka,[Qa]:$a,[Ja]:mr},hi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},nn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Xd=1234567,ho=Math.PI/180,Is=180/Math.PI;Sn={DEG2RAD:ho,RAD2DEG:Is,generateUUID:Kn,clamp:ut,euclideanModulo:sh,mapLinear:Og,inverseLerp:Bg,lerp:fo,damp:zg,pingpong:kg,smoothstep:Vg,smootherstep:Hg,randInt:Gg,randFloat:Wg,randFloatSpread:Xg,seededRandom:qg,degToRad:Yg,radToDeg:Zg,isPowerOfTwo:Kg,ceilPowerOfTwo:$g,floorPowerOfTwo:Jg,setQuaternionFromProperEuler:jg,normalize:vt,denormalize:Yn},at=class i{static{i.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ut(this.x,e.x,t.x),this.y=ut(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ut(this.x,e,t),this.y=ut(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ut(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(ut(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},hn=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],u=n[s+2],d=n[s+3],h=r[o+0],f=r[o+1],g=r[o+2],y=r[o+3];if(d!==y||l!==h||c!==f||u!==g){let m=l*h+c*f+u*g+d*y;m<0&&(h=-h,f=-f,g=-g,y=-y,m=-m);let p=1-a;if(m<.9995){let T=Math.acos(m),A=Math.sin(T);p=Math.sin(p*T)/A,a=Math.sin(a*T)/A,l=l*p+h*a,c=c*p+f*a,u=u*p+g*a,d=d*p+y*a}else{l=l*p+h*a,c=c*p+f*a,u=u*p+g*a,d=d*p+y*a;let T=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=T,c*=T,u*=T,d*=T}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],u=n[s+3],d=r[o],h=r[o+1],f=r[o+2],g=r[o+3];return e[t]=a*g+u*d+l*f-c*h,e[t+1]=l*g+u*h+c*d-a*f,e[t+2]=c*g+u*f+a*h-l*d,e[t+3]=u*g-a*d-l*h-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(s/2),d=a(r/2),h=l(n/2),f=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=h*u*d+c*f*g,this._y=c*f*d-h*u*g,this._z=c*u*g+h*f*d,this._w=c*u*d-h*f*g;break;case"YXZ":this._x=h*u*d+c*f*g,this._y=c*f*d-h*u*g,this._z=c*u*g-h*f*d,this._w=c*u*d+h*f*g;break;case"ZXY":this._x=h*u*d-c*f*g,this._y=c*f*d+h*u*g,this._z=c*u*g+h*f*d,this._w=c*u*d-h*f*g;break;case"ZYX":this._x=h*u*d-c*f*g,this._y=c*f*d+h*u*g,this._z=c*u*g-h*f*d,this._w=c*u*d+h*f*g;break;case"YZX":this._x=h*u*d+c*f*g,this._y=c*f*d+h*u*g,this._z=c*u*g-h*f*d,this._w=c*u*d-h*f*g;break;case"XZY":this._x=h*u*d-c*f*g,this._y=c*f*d-h*u*g,this._z=c*u*g+h*f*d,this._w=c*u*d+h*f*g;break;default:qe("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],d=t[10],h=n+a+d;if(h>0){let f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(u-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>d){let f=2*Math.sqrt(1+n-a-d);this._w=(u-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>d){let f=2*Math.sqrt(1+a-n-d);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+u)/f}else{let f=2*Math.sqrt(1+d-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ut(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+o*a+s*c-r*l,this._y=s*u+o*l+r*a-n*c,this._z=r*u+o*c+n*l-s*a,this._w=o*u-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=this.dot(e);a<0&&(n=-n,s=-s,r=-r,o=-o,a=-a);let l=1-t;if(a<.9995){let c=Math.acos(a),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+o*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+o*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},O=class i{static{i.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(qd.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(qd.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),u=2*(a*t-r*s),d=2*(r*n-o*t);return this.x=t+l*c+o*d-a*u,this.y=n+l*u+a*c-r*d,this.z=s+l*d+r*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ut(this.x,e.x,t.x),this.y=ut(this.y,e.y,t.y),this.z=ut(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ut(this.x,e,t),this.y=ut(this.y,e,t),this.z=ut(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ut(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ql.copy(this).projectOnVector(e),this.sub(Ql)}reflect(e){return this.sub(Ql.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(ut(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Ql=new O,qd=new hn,je=class i{static{i.prototype.isMatrix3=!0}constructor(e,t,n,s,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){let u=this.elements;return u[0]=e,u[1]=s,u[2]=a,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],d=n[7],h=n[2],f=n[5],g=n[8],y=s[0],m=s[3],p=s[6],T=s[1],A=s[4],v=s[7],M=s[2],b=s[5],R=s[8];return r[0]=o*y+a*T+l*M,r[3]=o*m+a*A+l*b,r[6]=o*p+a*v+l*R,r[1]=c*y+u*T+d*M,r[4]=c*m+u*A+d*b,r[7]=c*p+u*v+d*R,r[2]=h*y+f*T+g*M,r[5]=h*m+f*A+g*b,r[8]=h*p+f*v+g*R,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-n*r*u+n*a*l+s*r*c-s*o*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],d=u*o-a*c,h=a*l-u*r,f=c*r-o*l,g=t*d+n*h+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/g;return e[0]=d*y,e[1]=(s*c-u*n)*y,e[2]=(a*n-s*o)*y,e[3]=h*y,e[4]=(u*t-s*l)*y,e[5]=(s*r-a*t)*y,e[6]=f*y,e[7]=(n*l-c*t)*y,e[8]=(o*t-n*r)*y,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return As("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(eu.makeScale(e,t)),this}rotate(e){return As("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(eu.makeRotation(-e)),this}translate(e,t){return As("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(eu.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},eu=new je,Yd=new je().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Zd=new je().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);ot=Qg();ec=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{er===void 0&&(er=xr("canvas")),er.width=e.width,er.height=e.height;let s=er.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=er}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=xr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Ui(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Ui(t[n]/255)*255):t[n]=Ui(t[n]);return{data:t,width:e.width,height:e.height}}else return qe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},e0=0,vr=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:e0++}),this.uuid=Kn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(tu(s[o].image)):r.push(tu(s[o]))}else r=tu(s);n.url=r}return t||(e.images[this.uuid]=n),n}};t0=0,nu=new O,jt=class i extends hi{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Bn,s=Bn,r=kt,o=ei,a=Pn,l=vn,c=i.DEFAULT_ANISOTROPY,u=Xi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:t0++}),this.uuid=Kn(),this.name="",this.source=new vr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new at(0,0),this.repeat=new at(1,1),this.center=new at(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new je,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(nu).x}get height(){return this.source.getSize(nu).y}get depth(){return this.source.getSize(nu).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){qe(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){qe(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Zu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case cs:e.x=e.x-Math.floor(e.x);break;case Bn:e.x=e.x<0?0:1;break;case gr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case cs:e.y=e.y-Math.floor(e.y);break;case Bn:e.y=e.y<0?0:1;break;case gr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};jt.DEFAULT_IMAGE=null;jt.DEFAULT_MAPPING=Zu;jt.DEFAULT_ANISOTROPY=1;Mt=class i{static{i.prototype.isVector4=!0}constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],u=l[4],d=l[8],h=l[1],f=l[5],g=l[9],y=l[2],m=l[6],p=l[10];if(Math.abs(u-h)<.01&&Math.abs(d-y)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+y)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let A=(c+1)/2,v=(f+1)/2,M=(p+1)/2,b=(u+h)/4,R=(d+y)/4,x=(g+m)/4;return A>v&&A>M?A<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(A),s=b/n,r=R/n):v>M?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=b/s,r=x/s):M<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(M),n=R/r,s=x/r),this.set(n,s,r,t),this}let T=Math.sqrt((m-g)*(m-g)+(d-y)*(d-y)+(h-u)*(h-u));return Math.abs(T)<.001&&(T=1),this.x=(m-g)/T,this.y=(d-y)/T,this.z=(h-u)/T,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ut(this.x,e.x,t.x),this.y=ut(this.y,e.y,t.y),this.z=ut(this.z,e.z,t.z),this.w=ut(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ut(this.x,e,t),this.y=ut(this.y,e,t),this.z=ut(this.z,e,t),this.w=ut(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(ut(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},tc=class extends hi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:kt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Mt(0,0,e,t),this.scissorTest=!1,this.viewport=new Mt(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:n.depth},r=new jt(s),o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:kt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new vr(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},gn=class extends tc{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},go=class extends jt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=zt,this.minFilter=zt,this.wrapR=Bn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},nc=class extends jt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=zt,this.minFilter=zt,this.wrapR=Bn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},Qe=class i{static{i.prototype.isMatrix4=!0}constructor(e,t,n,s,r,o,a,l,c,u,d,h,f,g,y,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,u,d,h,f,g,y,m)}set(e,t,n,s,r,o,a,l,c,u,d,h,f,g,y,m){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=u,p[10]=d,p[14]=h,p[3]=f,p[7]=g,p[11]=y,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/tr.setFromMatrixColumn(e,0).length(),r=1/tr.setFromMatrixColumn(e,1).length(),o=1/tr.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){let h=o*u,f=o*d,g=a*u,y=a*d;t[0]=l*u,t[4]=-l*d,t[8]=c,t[1]=f+g*c,t[5]=h-y*c,t[9]=-a*l,t[2]=y-h*c,t[6]=g+f*c,t[10]=o*l}else if(e.order==="YXZ"){let h=l*u,f=l*d,g=c*u,y=c*d;t[0]=h+y*a,t[4]=g*a-f,t[8]=o*c,t[1]=o*d,t[5]=o*u,t[9]=-a,t[2]=f*a-g,t[6]=y+h*a,t[10]=o*l}else if(e.order==="ZXY"){let h=l*u,f=l*d,g=c*u,y=c*d;t[0]=h-y*a,t[4]=-o*d,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*u,t[9]=y-h*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let h=o*u,f=o*d,g=a*u,y=a*d;t[0]=l*u,t[4]=g*c-f,t[8]=h*c+y,t[1]=l*d,t[5]=y*c+h,t[9]=f*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let h=o*l,f=o*c,g=a*l,y=a*c;t[0]=l*u,t[4]=y-h*d,t[8]=g*d+f,t[1]=d,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=f*d+g,t[10]=h-y*d}else if(e.order==="XZY"){let h=o*l,f=o*c,g=a*l,y=a*c;t[0]=l*u,t[4]=-d,t[8]=c*u,t[1]=h*d+y,t[5]=o*u,t[9]=f*d-g,t[2]=g*d-f,t[6]=a*u,t[10]=y*d+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(n0,e,i0)}lookAt(e,t,n){let s=this.elements;return En.subVectors(e,t),En.lengthSq()===0&&(En.z=1),En.normalize(),ts.crossVectors(n,En),ts.lengthSq()===0&&(Math.abs(n.z)===1?En.x+=1e-4:En.z+=1e-4,En.normalize(),ts.crossVectors(n,En)),ts.normalize(),ya.crossVectors(En,ts),s[0]=ts.x,s[4]=ya.x,s[8]=En.x,s[1]=ts.y,s[5]=ya.y,s[9]=En.y,s[2]=ts.z,s[6]=ya.z,s[10]=En.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],d=n[5],h=n[9],f=n[13],g=n[2],y=n[6],m=n[10],p=n[14],T=n[3],A=n[7],v=n[11],M=n[15],b=s[0],R=s[4],x=s[8],E=s[12],P=s[1],D=s[5],V=s[9],W=s[13],L=s[2],z=s[6],K=s[10],H=s[14],te=s[3],N=s[7],Y=s[11],ne=s[15];return r[0]=o*b+a*P+l*L+c*te,r[4]=o*R+a*D+l*z+c*N,r[8]=o*x+a*V+l*K+c*Y,r[12]=o*E+a*W+l*H+c*ne,r[1]=u*b+d*P+h*L+f*te,r[5]=u*R+d*D+h*z+f*N,r[9]=u*x+d*V+h*K+f*Y,r[13]=u*E+d*W+h*H+f*ne,r[2]=g*b+y*P+m*L+p*te,r[6]=g*R+y*D+m*z+p*N,r[10]=g*x+y*V+m*K+p*Y,r[14]=g*E+y*W+m*H+p*ne,r[3]=T*b+A*P+v*L+M*te,r[7]=T*R+A*D+v*z+M*N,r[11]=T*x+A*V+v*K+M*Y,r[15]=T*E+A*W+v*H+M*ne,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],d=e[6],h=e[10],f=e[14],g=e[3],y=e[7],m=e[11],p=e[15],T=l*f-c*h,A=a*f-c*d,v=a*h-l*d,M=o*f-c*u,b=o*h-l*u,R=o*d-a*u;return t*(y*T-m*A+p*v)-n*(g*T-m*M+p*b)+s*(g*A-y*M+p*R)-r*(g*v-y*b+m*R)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],o=e[5],a=e[9],l=e[2],c=e[6],u=e[10];return t*(o*u-a*c)-n*(r*u-a*l)+s*(r*c-o*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],d=e[9],h=e[10],f=e[11],g=e[12],y=e[13],m=e[14],p=e[15],T=t*a-n*o,A=t*l-s*o,v=t*c-r*o,M=n*l-s*a,b=n*c-r*a,R=s*c-r*l,x=u*y-d*g,E=u*m-h*g,P=u*p-f*g,D=d*m-h*y,V=d*p-f*y,W=h*p-f*m,L=T*W-A*V+v*D+M*P-b*E+R*x;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let z=1/L;return e[0]=(a*W-l*V+c*D)*z,e[1]=(s*V-n*W-r*D)*z,e[2]=(y*R-m*b+p*M)*z,e[3]=(h*b-d*R-f*M)*z,e[4]=(l*P-o*W-c*E)*z,e[5]=(t*W-s*P+r*E)*z,e[6]=(m*v-g*R-p*A)*z,e[7]=(u*R-h*v+f*A)*z,e[8]=(o*V-a*P+c*x)*z,e[9]=(n*P-t*V-r*x)*z,e[10]=(g*b-y*v+p*T)*z,e[11]=(d*v-u*b-f*T)*z,e[12]=(a*E-o*D-l*x)*z,e[13]=(t*D-n*E+s*x)*z,e[14]=(y*A-g*M-m*T)*z,e[15]=(u*M-d*A+h*T)*z,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,u=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,u*a+n,u*l-s*o,0,c*l-s*a,u*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,u=o+o,d=a+a,h=r*c,f=r*u,g=r*d,y=o*u,m=o*d,p=a*d,T=l*c,A=l*u,v=l*d,M=n.x,b=n.y,R=n.z;return s[0]=(1-(y+p))*M,s[1]=(f+v)*M,s[2]=(g-A)*M,s[3]=0,s[4]=(f-v)*b,s[5]=(1-(h+p))*b,s[6]=(m+T)*b,s[7]=0,s[8]=(g+A)*R,s[9]=(m-T)*R,s[10]=(1-(h+y))*R,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let o=tr.set(s[0],s[1],s[2]).length(),a=tr.set(s[4],s[5],s[6]).length(),l=tr.set(s[8],s[9],s[10]).length();r<0&&(o=-o),Wn.copy(this);let c=1/o,u=1/a,d=1/l;return Wn.elements[0]*=c,Wn.elements[1]*=c,Wn.elements[2]*=c,Wn.elements[4]*=u,Wn.elements[5]*=u,Wn.elements[6]*=u,Wn.elements[8]*=d,Wn.elements[9]*=d,Wn.elements[10]*=d,t.setFromRotationMatrix(Wn),n.x=o,n.y=a,n.z=l,this}makePerspective(e,t,n,s,r,o,a=Zn,l=!1){let c=this.elements,u=2*r/(t-e),d=2*r/(n-s),h=(t+e)/(t-e),f=(n+s)/(n-s),g,y;if(l)g=r/(o-r),y=o*r/(o-r);else if(a===Zn)g=-(o+r)/(o-r),y=-2*o*r/(o-r);else if(a===_r)g=-o/(o-r),y=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=y,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=Zn,l=!1){let c=this.elements,u=2/(t-e),d=2/(n-s),h=-(t+e)/(t-e),f=-(n+s)/(n-s),g,y;if(l)g=1/(o-r),y=o/(o-r);else if(a===Zn)g=-2/(o-r),y=-(o+r)/(o-r);else if(a===_r)g=-1/(o-r),y=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=y,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},tr=new O,Wn=new Qe,n0=new O(0,0,0),i0=new O(1,1,1),ts=new O,ya=new O,En=new O,Kd=new Qe,$d=new hn,$n=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],u=s[9],d=s[2],h=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(ut(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ut(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(ut(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ut(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(ut(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-ut(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:qe("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Kd.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Kd,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return $d.setFromEuler(this),this.setFromQuaternion($d,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};$n.DEFAULT_ORDER="XYZ";_o=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},s0=0,Jd=new O,nr=new hn,Ci=new Qe,va=new O,io=new O,r0=new O,o0=new hn,jd=new O(1,0,0),Qd=new O(0,1,0),ef=new O(0,0,1),tf={type:"added"},a0={type:"removed"},ir={type:"childadded",child:null},iu={type:"childremoved",child:null},Rt=class i extends hi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:s0++}),this.uuid=Kn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new O,t=new $n,n=new hn,s=new O(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Qe},normalMatrix:{value:new je}}),this.matrix=new Qe,this.matrixWorld=new Qe,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new _o,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return nr.setFromAxisAngle(e,t),this.quaternion.multiply(nr),this}rotateOnWorldAxis(e,t){return nr.setFromAxisAngle(e,t),this.quaternion.premultiply(nr),this}rotateX(e){return this.rotateOnAxis(jd,e)}rotateY(e){return this.rotateOnAxis(Qd,e)}rotateZ(e){return this.rotateOnAxis(ef,e)}translateOnAxis(e,t){return Jd.copy(e).applyQuaternion(this.quaternion),this.position.add(Jd.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(jd,e)}translateY(e){return this.translateOnAxis(Qd,e)}translateZ(e){return this.translateOnAxis(ef,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ci.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?va.copy(e):va.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),io.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ci.lookAt(io,va,this.up):Ci.lookAt(va,io,this.up),this.quaternion.setFromRotationMatrix(Ci),s&&(Ci.extractRotation(s.matrixWorld),nr.setFromRotationMatrix(Ci),this.quaternion.premultiply(nr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ke("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(tf),ir.child=e,this.dispatchEvent(ir),ir.child=null):Ke("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(a0),iu.child=e,this.dispatchEvent(iu),iu.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ci.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ci.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ci),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(tf),ir.child=e,this.dispatchEvent(ir),ir.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(io,e,r0),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(io,o0,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),d=o(e.shapes),h=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),h.length>0&&(n.skeletons=h),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){let l=[];for(let c in a){let u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Rt.DEFAULT_UP=new O(0,1,0);Rt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Rt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;At=class extends Rt{constructor(){super(),this.isGroup=!0,this.type="Group"}},c0={type:"move"},Sr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new At,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new At,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new O,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new O),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new At,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new O,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new O,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let y of e.hand.values()){let m=t.getJointPose(y,n),p=this._getHandJoint(c,y);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],h=u.position.distanceTo(d.position),f=.02,g=.005;c.inputState.pinching&&h>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(c0)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new At;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},dp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ns={h:0,s:0,l:0},Sa={h:0,s:0,l:0};Ge=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=St){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ot.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=ot.workingColorSpace){return this.r=e,this.g=t,this.b=n,ot.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=ot.workingColorSpace){if(e=sh(e,1),t=ut(t,0,1),n=ut(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=su(o,r,e+1/3),this.g=su(o,r,e),this.b=su(o,r,e-1/3)}return ot.colorSpaceToWorking(this,s),this}setStyle(e,t=St){function n(r){r!==void 0&&parseFloat(r)<1&&qe("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:qe("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);qe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=St){let n=dp[e.toLowerCase()];return n!==void 0?this.setHex(n,t):qe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ui(e.r),this.g=Ui(e.g),this.b=Ui(e.b),this}copyLinearToSRGB(e){return this.r=pr(e.r),this.g=pr(e.g),this.b=pr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=St){return ot.workingToColorSpace(sn.copy(this),e),Math.round(ut(sn.r*255,0,255))*65536+Math.round(ut(sn.g*255,0,255))*256+Math.round(ut(sn.b*255,0,255))}getHexString(e=St){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ot.workingColorSpace){ot.workingToColorSpace(sn.copy(this),t);let n=sn.r,s=sn.g,r=sn.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,u=(a+o)/2;if(a===o)l=0,c=0;else{let d=o-a;switch(c=u<=.5?d/(o+a):d/(2-o-a),o){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=ot.workingColorSpace){return ot.workingToColorSpace(sn.copy(this),t),e.r=sn.r,e.g=sn.g,e.b=sn.b,e}getStyle(e=St){ot.workingToColorSpace(sn.copy(this),e);let t=sn.r,n=sn.g,s=sn.b;return e!==St?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(ns),this.setHSL(ns.h+e,ns.s+t,ns.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ns),e.getHSL(Sa);let n=fo(ns.h,Sa.h,t),s=fo(ns.s,Sa.s,t),r=fo(ns.l,Sa.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},sn=new Ge;Ge.NAMES=dp;Fi=class extends Rt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new $n,this.environmentIntensity=1,this.environmentRotation=new $n,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Xn=new O,Ii=new O,ru=new O,Pi=new O,sr=new O,rr=new O,nf=new O,ou=new O,au=new O,cu=new O,lu=new Mt,uu=new Mt,hu=new Mt,as=class i{constructor(e=new O,t=new O,n=new O){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Xn.subVectors(e,t),s.cross(Xn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Xn.subVectors(s,t),Ii.subVectors(n,t),ru.subVectors(e,t);let o=Xn.dot(Xn),a=Xn.dot(Ii),l=Xn.dot(ru),c=Ii.dot(Ii),u=Ii.dot(ru),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;let h=1/d,f=(c*l-a*u)*h,g=(o*u-a*l)*h;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Pi)===null?!1:Pi.x>=0&&Pi.y>=0&&Pi.x+Pi.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,Pi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Pi.x),l.addScaledVector(o,Pi.y),l.addScaledVector(a,Pi.z),l)}static getInterpolatedAttribute(e,t,n,s,r,o){return lu.setScalar(0),uu.setScalar(0),hu.setScalar(0),lu.fromBufferAttribute(e,t),uu.fromBufferAttribute(e,n),hu.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(lu,r.x),o.addScaledVector(uu,r.y),o.addScaledVector(hu,r.z),o}static isFrontFacing(e,t,n,s){return Xn.subVectors(n,t),Ii.subVectors(e,t),Xn.cross(Ii).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Xn.subVectors(this.c,this.b),Ii.subVectors(this.a,this.b),Xn.cross(Ii).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;sr.subVectors(s,n),rr.subVectors(r,n),ou.subVectors(e,n);let l=sr.dot(ou),c=rr.dot(ou);if(l<=0&&c<=0)return t.copy(n);au.subVectors(e,s);let u=sr.dot(au),d=rr.dot(au);if(u>=0&&d<=u)return t.copy(s);let h=l*d-u*c;if(h<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(n).addScaledVector(sr,o);cu.subVectors(e,r);let f=sr.dot(cu),g=rr.dot(cu);if(g>=0&&f<=g)return t.copy(r);let y=f*c-l*g;if(y<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(n).addScaledVector(rr,a);let m=u*g-f*d;if(m<=0&&d-u>=0&&f-g>=0)return nf.subVectors(r,s),a=(d-u)/(d-u+(f-g)),t.copy(s).addScaledVector(nf,a);let p=1/(m+y+h);return o=y*p,a=h*p,t.copy(n).addScaledVector(sr,o).addScaledVector(rr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},An=class{constructor(e=new O(1/0,1/0,1/0),t=new O(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(qn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(qn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=qn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,qn):qn.fromBufferAttribute(r,o),qn.applyMatrix4(e.matrixWorld),this.expandByPoint(qn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ma.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ma.copy(n.boundingBox)),Ma.applyMatrix4(e.matrixWorld),this.union(Ma)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,qn),qn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(so),ba.subVectors(this.max,so),or.subVectors(e.a,so),ar.subVectors(e.b,so),cr.subVectors(e.c,so),is.subVectors(ar,or),ss.subVectors(cr,ar),bs.subVectors(or,cr);let t=[0,-is.z,is.y,0,-ss.z,ss.y,0,-bs.z,bs.y,is.z,0,-is.x,ss.z,0,-ss.x,bs.z,0,-bs.x,-is.y,is.x,0,-ss.y,ss.x,0,-bs.y,bs.x,0];return!du(t,or,ar,cr,ba)||(t=[1,0,0,0,1,0,0,0,1],!du(t,or,ar,cr,ba))?!1:(Ta.crossVectors(is,ss),t=[Ta.x,Ta.y,Ta.z],du(t,or,ar,cr,ba))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,qn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(qn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Li[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Li[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Li[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Li[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Li[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Li[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Li[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Li[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Li),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Li=[new O,new O,new O,new O,new O,new O,new O,new O],qn=new O,Ma=new An,or=new O,ar=new O,cr=new O,is=new O,ss=new O,bs=new O,so=new O,ba=new O,Ta=new O,Ts=new O;Gt=new O,Ea=new at,l0=0,Nt=class extends hi{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:l0++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=nh,this.updateRanges=[],this.gpuType=In,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ea.fromBufferAttribute(this,t),Ea.applyMatrix3(e),this.setXY(t,Ea.x,Ea.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.applyMatrix3(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.applyMatrix4(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.applyNormalMatrix(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Gt.fromBufferAttribute(this,t),Gt.transformDirection(e),this.setXYZ(t,Gt.x,Gt.y,Gt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Yn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=vt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Yn(t,this.array)),t}setX(e,t){return this.normalized&&(t=vt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Yn(t,this.array)),t}setY(e,t){return this.normalized&&(t=vt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Yn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=vt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Yn(t,this.array)),t}setW(e,t){return this.normalized&&(t=vt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=vt(t,this.array),n=vt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=vt(t,this.array),n=vt(n,this.array),s=vt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=vt(t,this.array),n=vt(n,this.array),s=vt(s,this.array),r=vt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}},xo=class extends Nt{constructor(e,t,n){super(new Uint16Array(e),t,n)}},yo=class extends Nt{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Lt=class extends Nt{constructor(e,t,n){super(new Float32Array(e),t,n)}},u0=new An,ro=new O,fu=new O,_n=class{constructor(e=new O,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):u0.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ro.subVectors(e,this.center);let t=ro.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(ro,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(fu.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ro.copy(e.center).add(fu)),this.expandByPoint(ro.copy(e.center).sub(fu))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},h0=0,On=new Qe,pu=new Rt,lr=new O,wn=new An,oo=new An,Jt=new O,Pt=class i extends hi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:h0++}),this.uuid=Kn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ug(e)?yo:xo)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new je().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return On.makeRotationFromQuaternion(e),this.applyMatrix4(On),this}rotateX(e){return On.makeRotationX(e),this.applyMatrix4(On),this}rotateY(e){return On.makeRotationY(e),this.applyMatrix4(On),this}rotateZ(e){return On.makeRotationZ(e),this.applyMatrix4(On),this}translate(e,t,n){return On.makeTranslation(e,t,n),this.applyMatrix4(On),this}scale(e,t,n){return On.makeScale(e,t,n),this.applyMatrix4(On),this}lookAt(e){return pu.lookAt(e),pu.updateMatrix(),this.applyMatrix4(pu.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(lr).negate(),this.translate(lr.x,lr.y,lr.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Lt(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&qe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new An);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ke("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new O(-1/0,-1/0,-1/0),new O(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];wn.setFromBufferAttribute(r),this.morphTargetsRelative?(Jt.addVectors(this.boundingBox.min,wn.min),this.boundingBox.expandByPoint(Jt),Jt.addVectors(this.boundingBox.max,wn.max),this.boundingBox.expandByPoint(Jt)):(this.boundingBox.expandByPoint(wn.min),this.boundingBox.expandByPoint(wn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ke('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new _n);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ke("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new O,1/0);return}if(e){let n=this.boundingSphere.center;if(wn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];oo.setFromBufferAttribute(a),this.morphTargetsRelative?(Jt.addVectors(wn.min,oo.min),wn.expandByPoint(Jt),Jt.addVectors(wn.max,oo.max),wn.expandByPoint(Jt)):(wn.expandByPoint(oo.min),wn.expandByPoint(oo.max))}wn.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)Jt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Jt));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Jt.fromBufferAttribute(a,c),l&&(lr.fromBufferAttribute(e,c),Jt.add(lr)),s=Math.max(s,n.distanceToSquared(Jt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ke('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ke("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new Nt(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));let a=[],l=[];for(let x=0;x<n.count;x++)a[x]=new O,l[x]=new O;let c=new O,u=new O,d=new O,h=new at,f=new at,g=new at,y=new O,m=new O;function p(x,E,P){c.fromBufferAttribute(n,x),u.fromBufferAttribute(n,E),d.fromBufferAttribute(n,P),h.fromBufferAttribute(r,x),f.fromBufferAttribute(r,E),g.fromBufferAttribute(r,P),u.sub(c),d.sub(c),f.sub(h),g.sub(h);let D=1/(f.x*g.y-g.x*f.y);isFinite(D)&&(y.copy(u).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(D),m.copy(d).multiplyScalar(f.x).addScaledVector(u,-g.x).multiplyScalar(D),a[x].add(y),a[E].add(y),a[P].add(y),l[x].add(m),l[E].add(m),l[P].add(m))}let T=this.groups;T.length===0&&(T=[{start:0,count:e.count}]);for(let x=0,E=T.length;x<E;++x){let P=T[x],D=P.start,V=P.count;for(let W=D,L=D+V;W<L;W+=3)p(e.getX(W+0),e.getX(W+1),e.getX(W+2))}let A=new O,v=new O,M=new O,b=new O;function R(x){M.fromBufferAttribute(s,x),b.copy(M);let E=a[x];A.copy(E),A.sub(M.multiplyScalar(M.dot(E))).normalize(),v.crossVectors(b,E);let D=v.dot(l[x])<0?-1:1;o.setXYZW(x,A.x,A.y,A.z,D)}for(let x=0,E=T.length;x<E;++x){let P=T[x],D=P.start,V=P.count;for(let W=D,L=D+V;W<L;W+=3)R(e.getX(W+0)),R(e.getX(W+1)),R(e.getX(W+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Nt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,f=n.count;h<f;h++)n.setXYZ(h,0,0,0);let s=new O,r=new O,o=new O,a=new O,l=new O,c=new O,u=new O,d=new O;if(e)for(let h=0,f=e.count;h<f;h+=3){let g=e.getX(h+0),y=e.getX(h+1),m=e.getX(h+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,y),o.fromBufferAttribute(t,m),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,y),c.fromBufferAttribute(n,m),a.add(u),l.add(u),c.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(y,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,f=t.count;h<f;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),o.fromBufferAttribute(t,h+2),u.subVectors(o,r),d.subVectors(s,r),u.cross(d),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Jt.fromBufferAttribute(e,t),Jt.normalize(),e.setXYZ(t,Jt.x,Jt.y,Jt.z)}toNonIndexed(){function e(a,l){let c=a.array,u=a.itemSize,d=a.normalized,h=new c.constructor(l.length*u),f=0,g=0;for(let y=0,m=l.length;y<m;y++){a.isInterleavedBufferAttribute?f=l[y]*a.data.stride+a.offset:f=l[y]*u;for(let p=0;p<u;p++)h[g++]=c[f++]}return new Nt(h,u,d)}if(this.index===null)return qe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=e(l,n);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let u=0,d=c.length;u<d;u++){let h=c[u],f=e(h,n);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let d=0,h=c.length;d<h;d++){let f=c[d];u.push(f.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let u=s[c];this.setAttribute(c,u.clone(t))}let r=e.morphAttributes;for(let c in r){let u=[],d=r[c];for(let h=0,f=d.length;h<f;h++)u.push(d[h].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,u=o.length;c<u;c++){let d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},Mr=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=nh,this.updateRanges=[],this.version=0,this.uuid=Kn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Kn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Kn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},ln=new O,br=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)ln.fromBufferAttribute(this,t),ln.applyMatrix4(e),this.setXYZ(t,ln.x,ln.y,ln.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)ln.fromBufferAttribute(this,t),ln.applyNormalMatrix(e),this.setXYZ(t,ln.x,ln.y,ln.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)ln.fromBufferAttribute(this,t),ln.transformDirection(e),this.setXYZ(t,ln.x,ln.y,ln.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Yn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=vt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=vt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=vt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=vt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=vt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Yn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Yn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Yn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Yn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=vt(t,this.array),n=vt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=vt(t,this.array),n=vt(n,this.array),s=vt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=vt(t,this.array),n=vt(n,this.array),s=vt(s,this.array),r=vt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){mo("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Nt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){mo("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},mu=new O,d0=new O,f0=new je,rn=class{constructor(e=new O(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=mu.subVectors(n,t).cross(d0.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let s=e.delta(mu),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let o=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:t.copy(e.start).addScaledVector(s,o)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||f0.getNormalMatrix(e),s=this.coplanarPoint(mu).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},p0=0,xn=class extends hi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:p0++}),this.uuid=Kn(),this.name="",this.type="Material",this.blending=Lr,this.side=mi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=zu,this.blendDst=ku,this.blendEquation=Us,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ge(0,0,0),this.blendAlpha=0,this.depthFunc=mr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=tp,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Xa,this.stencilZFail=Xa,this.stencilZPass=Xa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){qe(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){qe(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Ge().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new rn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new at().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new at().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Di=new O,gu=new O,wa=new O,Aa=new O,Ps=class{constructor(e=new O,t=new O(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Di)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Di.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Di.copy(this.origin).addScaledVector(this.direction,t),Di.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){gu.copy(e).add(t).multiplyScalar(.5),wa.copy(t).sub(e).normalize(),Aa.copy(this.origin).sub(gu);let r=e.distanceTo(t)*.5,o=-this.direction.dot(wa),a=Aa.dot(this.direction),l=-Aa.dot(wa),c=Aa.lengthSq(),u=Math.abs(1-o*o),d,h,f,g;if(u>0)if(d=o*l-a,h=o*a-l,g=r*u,d>=0)if(h>=-g)if(h<=g){let y=1/u;d*=y,h*=y,f=d*(d+o*h+2*a)+h*(o*d+h+2*l)+c}else h=r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*l)+c;else h=-r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*l)+c;else h<=-g?(d=Math.max(0,-(-o*r+a)),h=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+h*(h+2*l)+c):h<=g?(d=0,h=Math.min(Math.max(-r,-l),r),f=h*(h+2*l)+c):(d=Math.max(0,-(o*r+a)),h=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+h*(h+2*l)+c);else h=o>0?-r:r,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(gu).addScaledVector(wa,h),f}intersectSphere(e,t){if(e.radius<0)return null;Di.subVectors(e.center,this.origin);let n=Di.dot(this.direction),s=Di.dot(Di)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l,c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return c>=0?(n=(e.min.x-h.x)*c,s=(e.max.x-h.x)*c):(n=(e.max.x-h.x)*c,s=(e.min.x-h.x)*c),u>=0?(r=(e.min.y-h.y)*u,o=(e.max.y-h.y)*u):(r=(e.max.y-h.y)*u,o=(e.min.y-h.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(e.min.z-h.z)*d,l=(e.max.z-h.z)*d):(a=(e.max.z-h.z)*d,l=(e.min.z-h.z)*d),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Di)!==null}intersectTriangle(e,t,n,s,r){let o=this.origin,a=this.direction,l=a.x,c=a.y,u=a.z,d=e.x-o.x,h=e.y-o.y,f=e.z-o.z,g=t.x-o.x,y=t.y-o.y,m=t.z-o.z,p=n.x-o.x,T=n.y-o.y,A=n.z-o.z,v=Math.abs(l),M=Math.abs(c),b=Math.abs(u),R,x,E,P,D,V,W,L,z,K,H,te;if(v>=M&&v>=b?(E=l,V=d,z=g,te=p,l>=0?(R=c,x=u,P=h,D=f,W=y,L=m,K=T,H=A):(R=u,x=c,P=f,D=h,W=m,L=y,K=A,H=T)):M>=b?(E=c,V=h,z=y,te=T,c>=0?(R=u,x=l,P=f,D=d,W=m,L=g,K=A,H=p):(R=l,x=u,P=d,D=f,W=g,L=m,K=p,H=A)):(E=u,V=f,z=m,te=A,u>=0?(R=l,x=c,P=d,D=h,W=g,L=y,K=p,H=T):(R=c,x=l,P=h,D=d,W=y,L=g,K=T,H=p)),E===0)return null;let N=R/E,Y=x/E,ne=1/E,Me=P-N*V,Ne=D-Y*V,re=W-N*z,ge=L-Y*z,de=K-N*te,B=H-Y*te,G=de*ge-B*re,ae=Me*B-Ne*de,fe=re*Ne-ge*Me;if(s){if(G<0||ae<0||fe<0)return null}else if((G<0||ae<0||fe<0)&&(G>0||ae>0||fe>0))return null;let ce=G+ae+fe;if(ce===0)return null;let me=ne*(G*V+ae*z+fe*te);return(ce>0?me<0:me>0)?null:this.at(me/ce,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Jn=class extends xn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ge(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new $n,this.combine=Vu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},sf=new Qe,Es=new Ps,Ra=new _n,rf=new O,Ca=new O,Ia=new O,Pa=new O,_u=new O,La=new O,of=new O,Da=new O,It=class extends Rt{constructor(e=new Pt,t=new Jn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){La.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let u=a[l],d=r[l];u!==0&&(_u.fromBufferAttribute(d,e),o?La.addScaledVector(_u,u):La.addScaledVector(_u.sub(t),u))}t.add(La)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ra.copy(n.boundingSphere),Ra.applyMatrix4(r),Es.copy(e.ray).recast(e.near),!(Ra.containsPoint(Es.origin)===!1&&(Es.intersectSphere(Ra,rf)===null||Es.origin.distanceToSquared(rf)>(e.far-e.near)**2))&&(sf.copy(r).invert(),Es.copy(e.ray).applyMatrix4(sf),!(n.boundingBox!==null&&Es.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Es)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,d=r.attributes.normal,h=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,y=h.length;g<y;g++){let m=h[g],p=o[m.materialIndex],T=Math.max(m.start,f.start),A=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let v=T,M=A;v<M;v+=3){let b=a.getX(v),R=a.getX(v+1),x=a.getX(v+2);s=Na(this,p,e,n,c,u,d,b,R,x),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,f.start),y=Math.min(a.count,f.start+f.count);for(let m=g,p=y;m<p;m+=3){let T=a.getX(m),A=a.getX(m+1),v=a.getX(m+2);s=Na(this,o,e,n,c,u,d,T,A,v),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,y=h.length;g<y;g++){let m=h[g],p=o[m.materialIndex],T=Math.max(m.start,f.start),A=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let v=T,M=A;v<M;v+=3){let b=v,R=v+1,x=v+2;s=Na(this,p,e,n,c,u,d,b,R,x),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,f.start),y=Math.min(l.count,f.start+f.count);for(let m=g,p=y;m<p;m+=3){let T=m,A=m+1,v=m+2;s=Na(this,o,e,n,c,u,d,T,A,v),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};ao=new Mt,af=new Mt,cf=new Mt,g0=new Mt,lf=new Qe,Ua=new O,xu=new _n,uf=new Qe,yu=new Ps,vo=class extends It{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=bu,this.bindMatrix=new Qe,this.bindMatrixInverse=new Qe,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new An),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Ua),this.boundingBox.expandByPoint(Ua)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new _n),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Ua),this.boundingSphere.expandByPoint(Ua)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),xu.copy(this.boundingSphere),xu.applyMatrix4(s),e.ray.intersectsSphere(xu)!==!1&&(uf.copy(s).invert(),yu.copy(e.ray).applyMatrix4(uf),!(this.boundingBox!==null&&yu.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,yu)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new Mt,t=this.geometry.attributes.skinWeight;for(let n=0,s=t.count;n<s;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===bu?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Jf?this.bindMatrixInverse.copy(this.bindMatrix).invert():qe("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,s=this.geometry;af.fromBufferAttribute(s.attributes.skinIndex,e),cf.fromBufferAttribute(s.attributes.skinWeight,e),t.isVector4?(ao.copy(t),t.set(0,0,0,0)):(ao.set(...t,1),t.set(0,0,0)),ao.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){let o=cf.getComponent(r);if(o!==0){let a=af.getComponent(r);lf.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(g0.copy(ao).applyMatrix4(lf),o)}}return t.isVector4&&(t.w=ao.w),t.applyMatrix4(this.bindMatrixInverse)}},Tr=class extends Rt{constructor(){super(),this.isBone=!0,this.type="Bone"}},Er=class extends jt{constructor(e=null,t=1,n=1,s,r,o,a,l,c=zt,u=zt,d,h){super(null,o,a,l,c,u,s,r,d,h),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},hf=new Qe,_0=new Qe,So=class i{constructor(e=[],t=[]){this.uuid=Kn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){qe("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new Qe)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new Qe;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,o=e.length;r<o;r++){let a=e[r]?e[r].matrixWorld:_0;hf.multiplyMatrices(a,t[r]),hf.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new i(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new Er(t,e,e,Pn,In);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,s=e.bones.length;n<s;n++){let r=e.bones[n],o=t[r];o===void 0&&(qe("Skeleton: No bone found with UUID:",r),o=new Tr),this.bones.push(o),this.boneInverses.push(new Qe().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let s=0,r=t.length;s<r;s++){let o=t[s];e.bones.push(o.uuid);let a=n[s];e.boneInverses.push(a.toArray())}return e}},Oi=class extends Nt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},ur=new Qe,df=new Qe,Fa=[],ff=new An,x0=new Qe,co=new It,lo=new _n,Mo=class extends It{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Oi(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,x0)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new An),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ur),ff.copy(e.boundingBox).applyMatrix4(ur),this.boundingBox.union(ff)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new _n),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ur),lo.copy(e.boundingSphere).applyMatrix4(ur),this.boundingSphere.union(lo)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(co.geometry=this.geometry,co.material=this.material,co.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),lo.copy(this.boundingSphere),lo.applyMatrix4(n),e.ray.intersectsSphere(lo)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ur),df.multiplyMatrices(n,ur),co.matrixWorld=df,co.raycast(e,Fa);for(let o=0,a=Fa.length;o<a;o++){let l=Fa[o];l.instanceId=r,l.object=this,t.push(l)}Fa.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Oi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Er(new Float32Array(s*this.count),s,this.count,Tc,In));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*e;return r[l]=a,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},ws=new _n,y0=new at(.5,.5),Oa=new O,wr=class{constructor(e=new rn,t=new rn,n=new rn,s=new rn,r=new rn,o=new rn){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Zn,n=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],l=r[2],c=r[3],u=r[4],d=r[5],h=r[6],f=r[7],g=r[8],y=r[9],m=r[10],p=r[11],T=r[12],A=r[13],v=r[14],M=r[15];if(s[0].setComponents(c-o,f-u,p-g,M-T).normalize(),s[1].setComponents(c+o,f+u,p+g,M+T).normalize(),s[2].setComponents(c+a,f+d,p+y,M+A).normalize(),s[3].setComponents(c-a,f-d,p-y,M-A).normalize(),n)s[4].setComponents(l,h,m,v).normalize(),s[5].setComponents(c-l,f-h,p-m,M-v).normalize();else if(s[4].setComponents(c-l,f-h,p-m,M-v).normalize(),t===Zn)s[5].setComponents(c+l,f+h,p+m,M+v).normalize();else if(t===_r)s[5].setComponents(l,h,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ws.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ws.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ws)}intersectsSprite(e){ws.center.set(0,0,0);let t=y0.distanceTo(e.center);return ws.radius=.7071067811865476+t,ws.applyMatrix4(e.matrixWorld),this.intersectsSphere(ws)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Oa.x=s.normal.x>0?e.max.x:e.min.x,Oa.y=s.normal.y>0?e.max.y:e.min.y,Oa.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Oa)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},zn=class extends xn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ge(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},ic=new O,sc=new O,pf=new Qe,uo=new Ps,Ba=new _n,vu=new O,mf=new O,Ls=class extends Rt{constructor(e=new Pt,t=new zn){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)ic.fromBufferAttribute(t,s-1),sc.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=ic.distanceTo(sc);e.setAttribute("lineDistance",new Lt(n,1))}else qe("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ba.copy(n.boundingSphere),Ba.applyMatrix4(s),Ba.radius+=r,e.ray.intersectsSphere(Ba)===!1)return;pf.copy(s).invert(),uo.copy(e.ray).applyMatrix4(pf);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=n.index,h=n.attributes.position;if(u!==null){let f=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let y=f,m=g-1;y<m;y+=c){let p=u.getX(y),T=u.getX(y+1),A=za(this,e,uo,l,p,T,y);A&&t.push(A)}if(this.isLineLoop){let y=u.getX(g-1),m=u.getX(f),p=za(this,e,uo,l,y,m,g-1);p&&t.push(p)}}else{let f=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let y=f,m=g-1;y<m;y+=c){let p=za(this,e,uo,l,y,y+1,y);p&&t.push(p)}if(this.isLineLoop){let y=za(this,e,uo,l,g-1,f,g-1);y&&t.push(y)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};gf=new O,_f=new O,jn=class extends Ls{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)gf.fromBufferAttribute(t,s),_f.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+gf.distanceTo(_f);e.setAttribute("lineDistance",new Lt(n,1))}else qe("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},bo=class extends Ls{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},Ar=class extends xn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ge(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},xf=new Qe,Ru=new Ps,ka=new _n,Va=new O,To=class extends Rt{constructor(e=new Pt,t=new Ar){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ka.copy(n.boundingSphere),ka.applyMatrix4(s),ka.radius+=r,e.ray.intersectsSphere(ka)===!1)return;xf.copy(s).invert(),Ru.copy(e.ray).applyMatrix4(xf);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,d=n.attributes.position;if(c!==null){let h=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let g=h,y=f;g<y;g++){let m=c.getX(g);Va.fromBufferAttribute(d,m),yf(Va,m,l,s,e,t,this)}}else{let h=Math.max(0,o.start),f=Math.min(d.count,o.start+o.count);for(let g=h,y=f;g<y;g++)Va.fromBufferAttribute(d,g),yf(Va,g,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};Eo=class extends jt{constructor(e=[],t=hs,n,s,r,o,a,l,c,u){super(e,t,n,s,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},ls=class extends jt{constructor(e,t,n=ti,s,r,o,a=zt,l=zt,c,u=ui,d=1){if(u!==ui&&u!==ds)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:e,height:t,depth:d};super(h,s,r,o,a,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new vr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},rc=class extends ls{constructor(e,t=ti,n=hs,s,r,o=zt,a=zt,l,c=ui){let u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,n,s,r,o,a,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},wo=class extends jt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Rr=class i extends Pt{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],u=[],d=[],h=0,f=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,s,o,2),g("x","z","y",1,-1,e,n,-t,s,o,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Lt(c,3)),this.setAttribute("normal",new Lt(u,3)),this.setAttribute("uv",new Lt(d,2));function g(y,m,p,T,A,v,M,b,R,x,E){let P=v/R,D=M/x,V=v/2,W=M/2,L=b/2,z=R+1,K=x+1,H=0,te=0,N=new O;for(let Y=0;Y<K;Y++){let ne=Y*D-W;for(let Me=0;Me<z;Me++){let Ne=Me*P-V;N[y]=Ne*T,N[m]=ne*A,N[p]=L,c.push(N.x,N.y,N.z),N[y]=0,N[m]=0,N[p]=b>0?1:-1,u.push(N.x,N.y,N.z),d.push(Me/R),d.push(1-Y/x),H+=1}}for(let Y=0;Y<x;Y++)for(let ne=0;ne<R;ne++){let Me=h+ne+z*Y,Ne=h+ne+z*(Y+1),re=h+(ne+1)+z*(Y+1),ge=h+(ne+1)+z*Y;l.push(Me,Ne,ge),l.push(Ne,re,ge),te+=6}a.addGroup(f,te,E),f+=te,h+=H}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}},Ao=class i extends Pt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,u=l+1,d=e/a,h=t/l,f=[],g=[],y=[],m=[];for(let p=0;p<u;p++){let T=p*h-o;for(let A=0;A<c;A++){let v=A*d-r;g.push(v,-T,0),y.push(0,0,1),m.push(A/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let T=0;T<a;T++){let A=T+c*p,v=T+c*(p+1),M=T+1+c*(p+1),b=T+1+c*p;f.push(A,v,b),f.push(v,M,b)}this.setIndex(f),this.setAttribute("position",new Lt(g,3)),this.setAttribute("normal",new Lt(y,3)),this.setAttribute("uv",new Lt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};fp={clone:Bs,merge:on},S0=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,M0=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Rn=class extends xn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=S0,this.fragmentShader=M0,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Bs(e.uniforms),this.uniformsGroups=v0(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new Ge().setHex(s.value);break;case"v2":this.uniforms[n].value=new at().fromArray(s.value);break;case"v3":this.uniforms[n].value=new O().fromArray(s.value);break;case"v4":this.uniforms[n].value=new Mt().fromArray(s.value);break;case"m3":this.uniforms[n].value=new je().fromArray(s.value);break;case"m4":this.uniforms[n].value=new Qe().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},oc=class extends Rn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Cn=class extends xn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ge(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ge(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=sl,this.normalScale=new at(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new $n,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Qt=class extends Cn{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new at(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ut(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ge(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ge(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ge(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}},ac=class extends xn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Qf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},cc=class extends xn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};di=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];e:{t:{let o;n:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break t}o=t.length;break n}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break t}o=n,n=0;break n}break e}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},lc=class extends di{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Eu,endingEnd:Eu}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case wu:r=e,a=2*t-n;break;case Au:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case wu:o=e,l=2*n-t;break;case Au:o=1,l=n+s[1]-s[0];break;default:o=e-1,l=t}let c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*u,this._offsetNext=o*u}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this._offsetPrev,d=this._offsetNext,h=this._weightPrev,f=this._weightNext,g=(n-t)/(s-t),y=g*g,m=y*g,p=-h*m+2*h*y-h*g,T=(1+h)*m+(-1.5-2*h)*y+(-.5+h)*g+1,A=(-1-f)*m+(1.5+f)*y+.5*g,v=f*m-f*y;for(let M=0;M!==a;++M)r[M]=p*o[u+M]+T*o[c+M]+A*o[l+M]+v*o[d+M];return r}},uc=class extends di{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=(n-t)/(s-t),d=1-u;for(let h=0;h!==a;++h)r[h]=o[c+h]*d+o[l+h]*u;return r}},hc=class extends di{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},dc=class extends di{interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this.inTangents,d=this.outTangents;if(!u||!d){let g=(n-t)/(s-t),y=1-g;for(let m=0;m!==a;++m)r[m]=o[c+m]*y+o[l+m]*g;return r}let h=a*2,f=e-1;for(let g=0;g!==a;++g){let y=o[c+g],m=o[l+g],p=f*h+g*2,T=d[p],A=d[p+1],v=e*h+g*2,M=u[v],b=u[v+1],R=w0(n,t,T,M,s);r[g]=pp(R,y,A,b,m)}return r}};yn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=os(t,this.TimeBufferType),this.values=os(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:os(e.times,Array),values:os(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s),qa(e.settings)&&(n.settings={inTangents:os(e.settings.inTangents,Array),outTangents:os(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new hc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new uc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new lc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new dc(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Rs:t=this.InterpolantFactoryMethodDiscrete;break;case Cs:t=this.InterpolantFactoryMethodLinear;break;case Wa:t=this.InterpolantFactoryMethodSmooth;break;case Tu:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return qe("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Rs;case this.InterpolantFactoryMethodLinear:return Cs;case this.InterpolantFactoryMethodSmooth:return Wa;case this.InterpolantFactoryMethodBezier:return Tu}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e;qa(this.settings)&&(Mf(this.settings.inTangents,e),Mf(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Ke("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(Ke("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){Ke("KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){Ke("KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&Fg(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){Ke("KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Wa,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],u=e[a+1];if(c!==u&&(a!==1||c!==e[0]))if(s)l=!0;else{let d=a*n,h=d-n,f=d+n;for(let g=0;g!==n;++g){let y=t[d+g];if(y!==t[h+g]||y!==t[f+g]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let d=a*n,h=o*n;for(let f=0;f!==n;++f)t[h+f]=t[d+f]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,qa(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};yn.prototype.ValueTypeName="";yn.prototype.TimeBufferType=Float32Array;yn.prototype.ValueBufferType=Float32Array;yn.prototype.DefaultInterpolation=Cs;Bi=class extends yn{constructor(e,t,n){super(e,t,n)}};Bi.prototype.ValueTypeName="bool";Bi.prototype.ValueBufferType=Array;Bi.prototype.DefaultInterpolation=Rs;Bi.prototype.InterpolantFactoryMethodLinear=void 0;Bi.prototype.InterpolantFactoryMethodSmooth=void 0;Ro=class extends yn{constructor(e,t,n,s){super(e,t,n,s)}};Ro.prototype.ValueTypeName="color";zi=class extends yn{constructor(e,t,n,s){super(e,t,n,s)}};zi.prototype.ValueTypeName="number";fc=class extends di{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(s-t),c=e*a;for(let u=c+a;c!==u;c+=4)hn.slerpFlat(r,0,o,c-a,o,c,l);return r}},ki=class extends yn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new fc(this.times,this.values,this.getValueSize(),e)}};ki.prototype.ValueTypeName="quaternion";ki.prototype.InterpolantFactoryMethodSmooth=void 0;Vi=class extends yn{constructor(e,t,n){super(e,t,n)}};Vi.prototype.ValueTypeName="string";Vi.prototype.ValueBufferType=Array;Vi.prototype.DefaultInterpolation=Rs;Vi.prototype.InterpolantFactoryMethodLinear=void 0;Vi.prototype.InterpolantFactoryMethodSmooth=void 0;us=class extends yn{constructor(e,t,n,s){super(e,t,n,s)}};us.prototype.ValueTypeName="vector";Co=class{constructor(e="",t=-1,n=[],s=jf){this.name=e,this.tracks=n,this.duration=t,this.blendMode=s,this.uuid=Kn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,s=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push(R0(n[o]).scale(s));let r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){let t=[],n=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,o=n.length;r!==o;++r)t.push(yn.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(e,t,n,s){let r=t.length,o=[];for(let a=0;a<r;a++){let l=[],c=[];l.push((a+r-1)%r,a,(a+1)%r),c.push(0,1,0);let u=b0(l);l=Sf(l,1,u),c=Sf(c,1,u),!s&&l[0]===0&&(l.push(r),c.push(c[0])),o.push(new zi(".morphTargetInfluences["+t[a].name+"]",l,c).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let s=e;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===t)return n[s];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let s={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,l=e.length;a<l;a++){let c=e[a],u=c.name.match(r);if(u&&u.length>1){let d=u[1],h=s[d];h||(s[d]=h=[]),h.push(c)}}let o=[];for(let a in s)o.push(this.CreateFromMorphTargetSequence(a,s[a],t,n));return o}resetDuration(){let e=this.tracks,t=0;for(let n=0,s=e.length;n!==s;++n){let r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};li={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(bf(i)||(this.files[i]=e))},get:function(i){if(this.enabled!==!1&&!bf(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};pc=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(u){a++,r===!1&&s.onStart!==void 0&&s.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,s.onProgress!==void 0&&s.onProgress(u,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,d){return c.push(u,d),this},this.removeHandler=function(u){let d=c.indexOf(u);return d!==-1&&c.splice(d,2),this},this.getHandler=function(u){for(let d=0,h=c.length;d<h;d+=2){let f=c[d],g=c[d+1];if(f.global&&(f.lastIndex=0),f.test(u))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},mp=new pc,fi=class{constructor(e){this.manager=e!==void 0?e:mp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};fi.DEFAULT_MATERIAL_NAME="__DEFAULT";Ni={},Cu=class extends Error{constructor(e,t){super(e),this.response=t}},Cr=class extends fi{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=li.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(Ni[e]!==void 0){Ni[e].push({onLoad:t,onProgress:n,onError:s});return}Ni[e]=[],Ni[e].push({onLoad:t,onProgress:n,onError:s});let o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&qe("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let u=Ni[e],d=c.body.getReader(),h=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=h?parseInt(h):0,g=f!==0,y=0,m=new ReadableStream({start(p){T();function T(){d.read().then(({done:A,value:v})=>{if(A)p.close();else{y+=v.byteLength;let M=new ProgressEvent("progress",{lengthComputable:g,loaded:y,total:f});for(let b=0,R=u.length;b<R;b++){let x=u[b];x.onProgress&&x.onProgress(M)}p.enqueue(v),T()}},A=>{p.error(A)})}}});return new Response(m)}else throw new Cu(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,a));case"json":return c.json();default:if(a==="")return c.text();{let d=/charset="?([^;"\s]*)"?/i.exec(a),h=d&&d[1]?d[1].toLowerCase():void 0,f=new TextDecoder(h);return c.arrayBuffer().then(g=>f.decode(g))}}}).then(c=>{li.add(`file:${e}`,c);let u=Ni[e];delete Ni[e];for(let d=0,h=u.length;d<h;d++){let f=u[d];f.onLoad&&f.onLoad(c)}}).catch(c=>{let u=Ni[e];if(u===void 0)throw this.manager.itemError(e),c;delete Ni[e];for(let d=0,h=u.length;d<h;d++){let f=u[d];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},hr=new WeakMap,mc=class extends fi{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=li.get(`image:${e}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);else{let d=hr.get(o);d===void 0&&(d=[],hr.set(o,d)),d.push({onLoad:t,onError:s})}return o}let a=xr("img");function l(){u(),t&&t(this);let d=hr.get(this)||[];for(let h=0;h<d.length;h++){let f=d[h];f.onLoad&&f.onLoad(this)}hr.delete(this),r.manager.itemEnd(e)}function c(d){u(),s&&s(d),li.remove(`image:${e}`);let h=hr.get(this)||[];for(let f=0;f<h.length;f++){let g=h[f];g.onError&&g.onError(d)}hr.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function u(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),li.add(`image:${e}`,a),r.manager.itemStart(e),a.src=e,a}},Io=class extends fi{constructor(e){super(e)}load(e,t,n,s){let r=new jt,o=new mc(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}},Ds=class extends Rt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ge(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Hi=class extends Ds{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Rt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ge(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Su=new Qe,Tf=new O,Ef=new O,Ir=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new at(512,512),this.mapType=vn,this.map=null,this.mapPass=null,this.matrix=new Qe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new wr,this._frameExtents=new at(1,1),this._viewportCount=1,this._viewports=[new Mt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Tf.setFromMatrixPosition(e.matrixWorld),t.position.copy(Tf),Ef.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ef),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,s){Su.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Su,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,o=s?s.z/r.x:1,a=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;e.coordinateSystem===_r||e.reversedDepth?t.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,1,0,0,0,0,1):t.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,.5,.5,0,0,0,1),t.multiply(Su)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Ha=new O,Ga=new hn,ci=new O,Po=class extends Rt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Qe,this.projectionMatrix=new Qe,this.projectionMatrixInverse=new Qe,this.coordinateSystem=Zn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Ha,Ga,ci),ci.x===1&&ci.y===1&&ci.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ha,Ga,ci.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Ha,Ga,ci),ci.x===1&&ci.y===1&&ci.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ha,Ga,ci.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},rs=new O,wf=new at,Af=new at,Dt=class extends Po{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Is*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(ho*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Is*2*Math.atan(Math.tan(ho*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){rs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(rs.x,rs.y).multiplyScalar(-e/rs.z),rs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(rs.x,rs.y).multiplyScalar(-e/rs.z)}getViewSize(e,t){return this.getViewBounds(e,wf,Af),t.subVectors(Af,wf)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(ho*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Iu=class extends Ir{constructor(){super(new Dt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=Is*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},Lo=class extends Ds{constructor(e,t,n=0,s=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Rt.DEFAULT_UP),this.updateMatrix(),this.target=new Rt,this.distance=n,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new Iu}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},Pu=class extends Ir{constructor(){super(new Dt(90,1,.5,500)),this.isPointLightShadow=!0}},Ns=class extends Ds{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Pu}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},pi=class extends Po{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Lu=class extends Ir{constructor(){super(new pi(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Gi=class extends Ds{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Rt.DEFAULT_UP),this.updateMatrix(),this.target=new Rt,this.shadow=new Lu}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Wi=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}},Mu=new WeakMap,Do=class extends fi{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&qe("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&qe("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=li.get(`image-bitmap:${e}`);if(o!==void 0){if(r.manager.itemStart(e),o.then){o.then(c=>{Mu.has(o)===!0?(s&&s(Mu.get(o)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(c),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);return}let a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let l=fetch(e,a).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},r.options,{colorSpaceConversion:"none"}))}).then(function(c){return li.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){s&&s(c),Mu.set(l,c),li.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});li.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},dr=-90,fr=1,gc=class extends Rt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Dt(dr,fr,e,t);s.layers=this.layers,this.add(s);let r=new Dt(dr,fr,e,t);r.layers=this.layers,this.add(r);let o=new Dt(dr,fr,e,t);o.layers=this.layers,this.add(o);let a=new Dt(dr,fr,e,t);a.layers=this.layers,this.add(a);let l=new Dt(dr,fr,e,t);l.layers=this.layers,this.add(l);let c=new Dt(dr,fr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===Zn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===_r)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,u]=this.children,d=e.getRenderTarget(),h=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=y,e.setRenderTarget(n,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(d,h,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},_c=class extends Dt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},oh="\\[\\]\\.:\\/",C0=new RegExp("["+oh+"]","g"),ah="[^"+oh+"]",I0="[^"+oh.replace("\\.","")+"]",P0=/((?:WC+[\/:])*)/.source.replace("WC",ah),L0=/(WCOD+)?/.source.replace("WCOD",I0),D0=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",ah),N0=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",ah),U0=new RegExp("^"+P0+L0+D0+N0+"$"),F0=["material","materials","bones","map"],Du=class{constructor(e,t,n){let s=n||Et.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Et=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(C0,"")}static parseTrackName(e){let t=U0.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);F0.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){qe("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Ke("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ke("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ke("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ke("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ke("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Ke("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Ke("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[s];if(o===void 0){let c=t.nodeName;Ke("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Ke("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ke("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Et.Composite=Du;Et.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Et.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Et.prototype.GetterByBindingType=[Et.prototype._getValue_direct,Et.prototype._getValue_array,Et.prototype._getValue_arrayElement,Et.prototype._getValue_toArray];Et.prototype.SetterByBindingTypeAndVersioning=[[Et.prototype._setValue_direct,Et.prototype._setValue_direct_setNeedsUpdate,Et.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Et.prototype._setValue_array,Et.prototype._setValue_array_setNeedsUpdate,Et.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Et.prototype._setValue_arrayElement,Et.prototype._setValue_arrayElement_setNeedsUpdate,Et.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Et.prototype._setValue_fromArray,Et.prototype._setValue_fromArray_setNeedsUpdate,Et.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];SM=new Float32Array(1),Nu=class i{static{i.prototype.isMatrix2=!0}constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?qe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186")});function Op(){let i=null,e=!1,t=null,n=null;function s(r,o){n=i.requestAnimationFrame(s),t(r,o)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function k0(i){let e=new WeakMap;function t(a,l){let c=a.array,u=a.usage,d=c.byteLength,h=i.createBuffer();i.bindBuffer(l,h),i.bufferData(l,c,u),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,l,c){let u=l.array,d=l.updateRanges;if(i.bindBuffer(c,a),d.length===0)i.bufferSubData(c,0,u);else{d.sort((f,g)=>f.start-g.start);let h=0;for(let f=1;f<d.length;f++){let g=d[h],y=d[f];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++h,d[h]=y)}d.length=h+1;for(let f=0,g=d.length;f<g;f++){let y=d[f];i.bufferSubData(c,y.start*u.BYTES_PER_ELEMENT,u,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}function My(i,e,t,n,s,r){let o=new Ge(0),a=s===!0?0:1,l,c,u=null,d=0,h=null;function f(T){let A=T.isScene===!0?T.background:null;if(A&&A.isTexture){let v=T.backgroundBlurriness>0;A=e.get(A,v)}return A}function g(T){let A=!1,v=f(T);v===null?m(o,a):v&&v.isColor&&(m(v,1),A=!0);let M=i.xr.getEnvironmentBlendMode();M==="additive"?t.buffers.color.setClear(0,0,0,1,r):M==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||A)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function y(T,A){let v=f(A);v&&(v.isCubeTexture||v.mapping===Fo)?(c===void 0&&(c=new It(new Rr(1,1,1),new Rn({name:"BackgroundCubeMaterial",uniforms:Bs(xi.backgroundCube.uniforms),vertexShader:xi.backgroundCube.vertexShader,fragmentShader:xi.backgroundCube.fragmentShader,side:dn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(M,b,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=A.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Sy.makeRotationFromEuler(A.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Bp),c.material.toneMapped=ot.getTransfer(v.colorSpace)!==_t,(u!==v||d!==v.version||h!==i.toneMapping)&&(c.material.needsUpdate=!0,u=v,d=v.version,h=i.toneMapping),c.layers.enableAll(),T.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new It(new Ao(2,2),new Rn({name:"BackgroundMaterial",uniforms:Bs(xi.background.uniforms),vertexShader:xi.background.vertexShader,fragmentShader:xi.background.fragmentShader,side:mi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,l.material.toneMapped=ot.getTransfer(v.colorSpace)!==_t,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||d!==v.version||h!==i.toneMapping)&&(l.material.needsUpdate=!0,u=v,d=v.version,h=i.toneMapping),l.layers.enableAll(),T.unshift(l,l.geometry,l.material,0,0,null))}function m(T,A){T.getRGB(al,rh(i)),t.buffers.color.setClear(al.r,al.g,al.b,A,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(T,A=1){o.set(T),a=A,m(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(T){a=T,m(o,a)},render:g,addToRenderList:y,dispose:p}}function by(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=h(null),r=s,o=!1;function a(D,V,W,L,z){let K=!1,H=d(D,L,W,V);r!==H&&(r=H,c(r.object)),K=f(D,L,W,z),K&&g(D,L,W,z),z!==null&&e.update(z,i.ELEMENT_ARRAY_BUFFER),(K||o)&&(o=!1,v(D,V,W,L),z!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(z).buffer))}function l(){return i.createVertexArray()}function c(D){return i.bindVertexArray(D)}function u(D){return i.deleteVertexArray(D)}function d(D,V,W,L){let z=L.wireframe===!0,K=n[V.id];K===void 0&&(K={},n[V.id]=K);let H=D.isInstancedMesh===!0?D.id:0,te=K[H];te===void 0&&(te={},K[H]=te);let N=te[W.id];N===void 0&&(N={},te[W.id]=N);let Y=N[z];return Y===void 0&&(Y=h(l()),N[z]=Y),Y}function h(D){let V=[],W=[],L=[];for(let z=0;z<t;z++)V[z]=0,W[z]=0,L[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:V,enabledAttributes:W,attributeDivisors:L,object:D,attributes:{},index:null}}function f(D,V,W,L){let z=r.attributes,K=V.attributes,H=0,te=W.getAttributes();for(let N in te)if(te[N].location>=0){let ne=z[N],Me=K[N];if(Me===void 0&&(N==="instanceMatrix"&&D.instanceMatrix&&(Me=D.instanceMatrix),N==="instanceColor"&&D.instanceColor&&(Me=D.instanceColor)),ne===void 0||ne.attribute!==Me||Me&&ne.data!==Me.data)return!0;H++}return r.attributesNum!==H||r.index!==L}function g(D,V,W,L){let z={},K=V.attributes,H=0,te=W.getAttributes();for(let N in te)if(te[N].location>=0){let ne=K[N];ne===void 0&&(N==="instanceMatrix"&&D.instanceMatrix&&(ne=D.instanceMatrix),N==="instanceColor"&&D.instanceColor&&(ne=D.instanceColor));let Me={};Me.attribute=ne,ne&&ne.data&&(Me.data=ne.data),z[N]=Me,H++}r.attributes=z,r.attributesNum=H,r.index=L}function y(){let D=r.newAttributes;for(let V=0,W=D.length;V<W;V++)D[V]=0}function m(D){p(D,0)}function p(D,V){let W=r.newAttributes,L=r.enabledAttributes,z=r.attributeDivisors;W[D]=1,L[D]===0&&(i.enableVertexAttribArray(D),L[D]=1),z[D]!==V&&(i.vertexAttribDivisor(D,V),z[D]=V)}function T(){let D=r.newAttributes,V=r.enabledAttributes;for(let W=0,L=V.length;W<L;W++)V[W]!==D[W]&&(i.disableVertexAttribArray(W),V[W]=0)}function A(D,V,W,L,z,K,H){H===!0?i.vertexAttribIPointer(D,V,W,z,K):i.vertexAttribPointer(D,V,W,L,z,K)}function v(D,V,W,L){y();let z=L.attributes,K=W.getAttributes(),H=V.defaultAttributeValues;for(let te in K){let N=K[te];if(N.location>=0){let Y=z[te];if(Y===void 0&&(te==="instanceMatrix"&&D.instanceMatrix&&(Y=D.instanceMatrix),te==="instanceColor"&&D.instanceColor&&(Y=D.instanceColor)),Y!==void 0){let ne=Y.normalized,Me=Y.itemSize,Ne=e.get(Y);if(Ne===void 0)continue;let re=Ne.buffer,ge=Ne.type,de=Ne.bytesPerElement,B=ge===i.INT||ge===i.UNSIGNED_INT||Y.gpuType===Sc;if(Y.isInterleavedBufferAttribute){let G=Y.data,ae=G.stride,fe=Y.offset;if(G.isInstancedInterleavedBuffer){for(let ce=0;ce<N.locationSize;ce++)p(N.location+ce,G.meshPerAttribute);D.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=G.meshPerAttribute*G.count)}else for(let ce=0;ce<N.locationSize;ce++)m(N.location+ce);i.bindBuffer(i.ARRAY_BUFFER,re);for(let ce=0;ce<N.locationSize;ce++)A(N.location+ce,Me/N.locationSize,ge,ne,ae*de,(fe+Me/N.locationSize*ce)*de,B)}else{if(Y.isInstancedBufferAttribute){for(let G=0;G<N.locationSize;G++)p(N.location+G,Y.meshPerAttribute);D.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=Y.meshPerAttribute*Y.count)}else for(let G=0;G<N.locationSize;G++)m(N.location+G);i.bindBuffer(i.ARRAY_BUFFER,re);for(let G=0;G<N.locationSize;G++)A(N.location+G,Me/N.locationSize,ge,ne,Me*de,Me/N.locationSize*G*de,B)}}else if(H!==void 0){let ne=H[te];if(ne!==void 0)switch(ne.length){case 2:i.vertexAttrib2fv(N.location,ne);break;case 3:i.vertexAttrib3fv(N.location,ne);break;case 4:i.vertexAttrib4fv(N.location,ne);break;default:i.vertexAttrib1fv(N.location,ne)}}}}T()}function M(){E();for(let D in n){let V=n[D];for(let W in V){let L=V[W];for(let z in L){let K=L[z];for(let H in K)u(K[H].object),delete K[H];delete L[z]}}delete n[D]}}function b(D){if(n[D.id]===void 0)return;let V=n[D.id];for(let W in V){let L=V[W];for(let z in L){let K=L[z];for(let H in K)u(K[H].object),delete K[H];delete L[z]}}delete n[D.id]}function R(D){for(let V in n){let W=n[V];for(let L in W){let z=W[L];if(z[D.id]===void 0)continue;let K=z[D.id];for(let H in K)u(K[H].object),delete K[H];delete z[D.id]}}}function x(D){for(let V in n){let W=n[V],L=D.isInstancedMesh===!0?D.id:0,z=W[L];if(z!==void 0){for(let K in z){let H=z[K];for(let te in H)u(H[te].object),delete H[te];delete z[K]}delete W[L],Object.keys(W).length===0&&delete n[V]}}}function E(){P(),o=!0,r!==s&&(r=s,c(r.object))}function P(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:E,resetDefaultState:P,dispose:M,releaseStatesOfGeometry:b,releaseStatesOfObject:x,releaseStatesOfProgram:R,initAttributes:y,enableAttribute:m,disableUnusedAttributes:T}}function Ty(i,e,t){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function o(l,c,u){u!==0&&(i.drawArraysInstanced(n,l,c,u),t.update(c,n,u))}function a(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,u);let h=0;for(let f=0;f<u;f++)h+=c[f];t.update(h,n,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function Ey(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let R=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(R){return!(R!==Pn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){let x=R===ni&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==vn&&R!==In&&!x&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",u=l(c);u!==c&&(qe("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let d=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&h===!1&&qe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),T=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),A=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),M=i.getParameter(i.MAX_SAMPLES),b=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:h,maxTextures:f,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:T,maxVaryings:A,maxFragmentUniforms:v,maxSamples:M,samples:b}}function wy(i){let e=this,t=null,n=0,s=!1,r=!1,o=new rn,a=new je,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){let f=d.length!==0||h||n!==0||s;return s=h,n=d.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,h){t=u(d,h,0)},this.setState=function(d,h,f){let g=d.clippingPlanes,y=d.clipIntersection,m=d.clipShadows,p=i.get(d);if(!s||g===null||g.length===0||r&&!m)r?u(null):c();else{let T=r?0:n,A=T*4,v=p.clippingState||null;l.value=v,v=u(g,h,A,f);for(let M=0;M!==A;++M)v[M]=t[M];p.clippingState=v,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=T}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(d,h,f,g){let y=d!==null?d.length:0,m=null;if(y!==0){if(m=l.value,g!==!0||m===null){let p=f+y*4,T=h.matrixWorldInverse;a.getNormalMatrix(T),(m===null||m.length<p)&&(m=new Float32Array(p));for(let A=0,v=f;A!==y;++A,v+=4)o.copy(d[A]).applyMatrix4(T,a),o.normal.toArray(m,v),m[v+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,m}}function Py(i){let e=[],t=[],n=i,s=i-Br+1+Ay;for(let r=0;r<s;r++){let o=Math.pow(2,n);e.push(o);let a=1/(o-2),l=-a,c=1+a,u=[l,l,c,l,c,c,l,l,c,c,l,c],d=6,h=6,f=3,g=new Float32Array(f*h*d),y=new Float32Array(f*h*d);for(let p=0;p<d;p++){let T=p%3*2/3-1,A=p>2?0:-1,v=[T,A,0,T+2/3,A,0,T+2/3,A+1,0,T,A,0,T+2/3,A+1,0,T,A+1,0];g.set(v,f*h*p);for(let M=0;M<h;M++){let b=u[M*2]*2-1,R=u[M*2+1]*2-1;p===0?zs.set(1,R,b):p===1?zs.set(-b,1,-R):p===2?zs.set(-b,R,1):p===3?zs.set(-1,R,-b):p===4?zs.set(-b,-1,R):zs.set(b,R,-1),zs.toArray(y,(p*h+M)*f)}}let m=new Pt;m.setAttribute("position",new Nt(g,f)),m.setAttribute("outputDirection",new Nt(y,f)),t.push(new It(m,null)),n>Br&&n--}return{lodMeshes:t,sizeLods:e}}function _p(i,e,t){let n=new gn(i,e,t);return n.texture.mapping=Fo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Or(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Ly(i,e,t){return new Rn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Cy,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:hl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:gi,depthTest:!1,depthWrite:!1})}function Dy(i,e,t){return new Rn({name:"SphericalGaussianBlur",defines:{SAMPLES:Ry,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:hl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:gi,depthTest:!1,depthWrite:!1})}function xp(){return new Rn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:hl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:gi,depthTest:!1,depthWrite:!1})}function yp(){return new Rn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:hl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:gi,depthTest:!1,depthWrite:!1})}function hl(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}function Ny(i){let e=new WeakMap,t=new WeakMap,n=null;function s(h,f=!1){return h==null?null:f?o(h):r(h)}function r(h){if(h&&h.isTexture){let f=h.mapping;if(f===xc||f===yc)if(e.has(h)){let g=e.get(h).texture;return a(g,h.mapping)}else{let g=h.image;if(g&&g.height>0){let y=new ul(g.height);return y.fromEquirectangularTexture(i,h),e.set(h,y),h.addEventListener("dispose",c),a(y.texture,h.mapping)}else return null}}return h}function o(h){if(h&&h.isTexture){let f=h.mapping,g=f===xc||f===yc,y=f===hs||f===Fs;if(g||y){let m=t.get(h),p=m!==void 0?m.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==p)return n===null&&(n=new ll(i)),m=g?n.fromEquirectangular(h,m):n.fromCubemap(h,m),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),m.texture;if(m!==void 0)return m.texture;{let T=h.image;return g&&T&&T.height>0||y&&T&&l(T)?(n===null&&(n=new ll(i)),m=g?n.fromEquirectangular(h):n.fromCubemap(h),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),h.addEventListener("dispose",u),m.texture):null}}}return h}function a(h,f){return f===xc?h.mapping=hs:f===yc&&(h.mapping=Fs),h}function l(h){let f=0,g=6;for(let y=0;y<g;y++)h[y]!==void 0&&f++;return f===g}function c(h){let f=h.target;f.removeEventListener("dispose",c);let g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function u(h){let f=h.target;f.removeEventListener("dispose",u);let g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function d(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:d}}function Uy(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&As("WebGLRenderer: "+n+" extension not supported."),s}}}function Fy(i,e,t,n){let s={},r=new WeakMap;function o(d){let h=d.target;h.index!==null&&e.remove(h.index);for(let g in h.attributes)e.remove(h.attributes[g]);h.removeEventListener("dispose",o),delete s[h.id];let f=r.get(h);f&&(e.remove(f),r.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function a(d,h){return s[h.id]===!0||(h.addEventListener("dispose",o),s[h.id]=!0,t.memory.geometries++),h}function l(d){let h=d.attributes;for(let f in h)e.update(h[f],i.ARRAY_BUFFER)}function c(d){let h=[],f=d.index,g=d.attributes.position,y=0;if(g===void 0)return;if(f!==null){let T=f.array;y=f.version;for(let A=0,v=T.length;A<v;A+=3){let M=T[A+0],b=T[A+1],R=T[A+2];h.push(M,b,b,R,R,M)}}else{let T=g.array;y=g.version;for(let A=0,v=T.length/3-1;A<v;A+=3){let M=A+0,b=A+1,R=A+2;h.push(M,b,b,R,R,M)}}let m=new(g.count>=65535?yo:xo)(h,1);m.version=y;let p=r.get(d);p&&e.remove(p),r.set(d,m)}function u(d){let h=r.get(d);if(h){let f=d.index;f!==null&&h.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:u}}function Oy(i,e,t){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,h){i.drawElements(n,h,r,d*o),t.update(h,n,1)}function c(d,h,f){f!==0&&(i.drawElementsInstanced(n,h,r,d*o,f),t.update(h,n,f))}function u(d,h,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,r,d,0,f);let y=0;for(let m=0;m<f;m++)y+=h[m];t.update(y,n,1)}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function By(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:Ke("WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function zy(i,e,t){let n=new WeakMap,s=new Mt;function r(o,a,l){let c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=u!==void 0?u.length:0,h=n.get(a);if(h===void 0||h.count!==d){let E=function(){R.dispose(),n.delete(a),a.removeEventListener("dispose",E)};h!==void 0&&h.texture.dispose();let f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,y=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],T=a.morphAttributes.color||[],A=0;f===!0&&(A=1),g===!0&&(A=2),y===!0&&(A=3);let v=a.attributes.position.count*A,M=1;v>e.maxTextureSize&&(M=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);let b=new Float32Array(v*M*4*d),R=new go(b,v,M,d);R.type=In,R.needsUpdate=!0;let x=A*4;for(let P=0;P<d;P++){let D=m[P],V=p[P],W=T[P],L=v*M*4*P;for(let z=0;z<D.count;z++){let K=z*x;f===!0&&(s.fromBufferAttribute(D,z),b[L+K+0]=s.x,b[L+K+1]=s.y,b[L+K+2]=s.z,b[L+K+3]=0),g===!0&&(s.fromBufferAttribute(V,z),b[L+K+4]=s.x,b[L+K+5]=s.y,b[L+K+6]=s.z,b[L+K+7]=0),y===!0&&(s.fromBufferAttribute(W,z),b[L+K+8]=s.x,b[L+K+9]=s.y,b[L+K+10]=s.z,b[L+K+11]=W.itemSize===4?s.w:1)}}h={count:d,texture:R,size:new at(v,M)},n.set(a,h),a.addEventListener("dispose",E)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let f=0;for(let y=0;y<c.length;y++)f+=c[y];let g=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:r}}function ky(i,e,t,n,s){let r=new WeakMap;function o(c){let u=s.render.frame,d=c.geometry,h=e.get(c,d);if(r.get(h)!==u&&(e.update(h),r.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==u&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,u))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==u&&(f.update(),r.set(f,u))}return h}function a(){r=new WeakMap}function l(c){let u=c.target;u.removeEventListener("dispose",l),n.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:o,dispose:a}}function Hy(i,e,t,n,s,r){let o=new gn(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=new Pt;c.setAttribute("position",new Lt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Lt([0,2,0,0,2,0],2));let u=new oc({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new It(c,u),h=new pi(-1,1,1,-1,0,1),f=null,g=null,y=!1,m,p=null,T=[],A=!1;this.setSize=function(v,M){o.setSize(v,M),a!==null&&a.setSize(v,M),l!==null&&l.setSize(v,M);for(let b=0;b<T.length;b++){let R=T[b];R.setSize&&R.setSize(v,M)}},this.setEffects=function(v){T=v,A=T.length>0&&T[0].isRenderPass===!0;let M=o.width,b=o.height;T.length>0&&a===null&&(a=new gn(M,b,{type:ni,depthBuffer:!1,stencilBuffer:!1}),l=new gn(M,b,{type:ni,depthBuffer:!1,stencilBuffer:!1}));for(let R=0;R<T.length;R++){let x=T[R];x.setSize&&x.setSize(M,b)}},this.begin=function(v,M){if(y||v.toneMapping===Qn&&T.length===0)return!1;if(p=M,M!==null){let b=M.width,R=M.height;(o.width!==b||o.height!==R)&&this.setSize(b,R)}return A===!1&&v.setRenderTarget(o),m=v.toneMapping,v.toneMapping=Qn,!0},this.hasRenderPass=function(){return A},this.end=function(v,M){v.toneMapping=m,y=!0;let b=o,R=a;for(let x=0;x<T.length;x++){let E=T[x];E.enabled!==!1&&(E.render(v,R,b,M),E.needsSwap!==!1&&(b=R,R=R===a?l:a))}if(f!==v.outputColorSpace||g!==v.toneMapping){f=v.outputColorSpace,g=v.toneMapping,u.defines={},ot.getTransfer(f)===_t&&(u.defines.SRGB_TRANSFER="");let x=Vy[g];x&&(u.defines[x]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=b.texture,v.setRenderTarget(p),v.render(d,h),p=null,y=!1},this.isCompositing=function(){return y},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),c.dispose(),u.dispose()}}function kr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=vp[s];if(r===void 0&&(r=new Float32Array(s),vp[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function qt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Yt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function dl(i,e){let t=Sp[e];t===void 0&&(t=new Int32Array(e),Sp[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Gy(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Wy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(qt(t,e))return;i.uniform2fv(this.addr,e),Yt(t,e)}}function Xy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(qt(t,e))return;i.uniform3fv(this.addr,e),Yt(t,e)}}function qy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(qt(t,e))return;i.uniform4fv(this.addr,e),Yt(t,e)}}function Yy(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(qt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Yt(t,e)}else{if(qt(t,n))return;Tp.set(n),i.uniformMatrix2fv(this.addr,!1,Tp),Yt(t,n)}}function Zy(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(qt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Yt(t,e)}else{if(qt(t,n))return;bp.set(n),i.uniformMatrix3fv(this.addr,!1,bp),Yt(t,n)}}function Ky(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(qt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Yt(t,e)}else{if(qt(t,n))return;Mp.set(n),i.uniformMatrix4fv(this.addr,!1,Mp),Yt(t,n)}}function $y(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Jy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(qt(t,e))return;i.uniform2iv(this.addr,e),Yt(t,e)}}function jy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(qt(t,e))return;i.uniform3iv(this.addr,e),Yt(t,e)}}function Qy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(qt(t,e))return;i.uniform4iv(this.addr,e),Yt(t,e)}}function ev(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function tv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(qt(t,e))return;i.uniform2uiv(this.addr,e),Yt(t,e)}}function nv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(qt(t,e))return;i.uniform3uiv(this.addr,e),Yt(t,e)}}function iv(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(qt(t,e))return;i.uniform4uiv(this.addr,e),Yt(t,e)}}function sv(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(gh.compareFunction=t.isReversedDepthBuffer()?ol:rl,r=gh):r=zp,t.setTexture2D(e||r,s)}function rv(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Vp,s)}function ov(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Hp,s)}function av(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||kp,s)}function cv(i){switch(i){case 5126:return Gy;case 35664:return Wy;case 35665:return Xy;case 35666:return qy;case 35674:return Yy;case 35675:return Zy;case 35676:return Ky;case 5124:case 35670:return $y;case 35667:case 35671:return Jy;case 35668:case 35672:return jy;case 35669:case 35673:return Qy;case 5125:return ev;case 36294:return tv;case 36295:return nv;case 36296:return iv;case 35678:case 36198:case 36298:case 36306:case 35682:return sv;case 35679:case 36299:case 36307:return rv;case 35680:case 36300:case 36308:case 36293:return ov;case 36289:case 36303:case 36311:case 36292:return av}}function lv(i,e){i.uniform1fv(this.addr,e)}function uv(i,e){let t=kr(e,this.size,2);i.uniform2fv(this.addr,t)}function hv(i,e){let t=kr(e,this.size,3);i.uniform3fv(this.addr,t)}function dv(i,e){let t=kr(e,this.size,4);i.uniform4fv(this.addr,t)}function fv(i,e){let t=kr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function pv(i,e){let t=kr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function mv(i,e){let t=kr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function gv(i,e){i.uniform1iv(this.addr,e)}function _v(i,e){i.uniform2iv(this.addr,e)}function xv(i,e){i.uniform3iv(this.addr,e)}function yv(i,e){i.uniform4iv(this.addr,e)}function vv(i,e){i.uniform1uiv(this.addr,e)}function Sv(i,e){i.uniform2uiv(this.addr,e)}function Mv(i,e){i.uniform3uiv(this.addr,e)}function bv(i,e){i.uniform4uiv(this.addr,e)}function Tv(i,e,t){let n=this.cache,s=e.length,r=dl(t,s);qt(n,r)||(i.uniform1iv(this.addr,r),Yt(n,r));let o;this.type===i.SAMPLER_2D_SHADOW?o=gh:o=zp;for(let a=0;a!==s;++a)t.setTexture2D(e[a]||o,r[a])}function Ev(i,e,t){let n=this.cache,s=e.length,r=dl(t,s);qt(n,r)||(i.uniform1iv(this.addr,r),Yt(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||Vp,r[o])}function wv(i,e,t){let n=this.cache,s=e.length,r=dl(t,s);qt(n,r)||(i.uniform1iv(this.addr,r),Yt(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||Hp,r[o])}function Av(i,e,t){let n=this.cache,s=e.length,r=dl(t,s);qt(n,r)||(i.uniform1iv(this.addr,r),Yt(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||kp,r[o])}function Rv(i){switch(i){case 5126:return lv;case 35664:return uv;case 35665:return hv;case 35666:return dv;case 35674:return fv;case 35675:return pv;case 35676:return mv;case 5124:case 35670:return gv;case 35667:case 35671:return _v;case 35668:case 35672:return xv;case 35669:case 35673:return yv;case 5125:return vv;case 36294:return Sv;case 36295:return Mv;case 36296:return bv;case 35678:case 36198:case 36298:case 36306:case 35682:return Tv;case 35679:case 36299:case 36307:return Ev;case 35680:case 36300:case 36308:case 36293:return wv;case 36289:case 36303:case 36311:case 36292:return Av}}function Ep(i,e){i.seq.push(e),i.map[e.id]=e}function Cv(i,e,t){let n=i.name,s=n.length;for(ph.lastIndex=0;;){let r=ph.exec(n),o=ph.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Ep(t,c===void 0?new _h(a,i,e):new xh(a,i,e));break}else{let d=t.map[a];d===void 0&&(d=new yh(a),Ep(t,d)),t=d}}}function wp(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}function Lv(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}function Dv(i){ot._getMatrix(Ap,ot.workingColorSpace,i);let e=`mat3( ${Ap.elements.map(t=>t.toFixed(4))} )`;switch(ot.getTransfer(i)){case po:return[e,"LinearTransferOETF"];case _t:return[e,"sRGBTransferOETF"];default:return qe("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Rp(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+Lv(i.getShaderSource(e),a)}else return r}function Nv(i,e){let t=Dv(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Fv(i,e){let t=Uv[e];return t===void 0?(qe("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function Ov(){ot.getLuminanceCoefficients(cl);let i=cl.x.toFixed(4),e=cl.y.toFixed(4),t=cl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Bv(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(qo).join(`
`)}function zv(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function kv(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function qo(i){return i!==""}function Cp(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Ip(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}function vh(i){return i.replace(Vv,Gv)}function Gv(i,e){let t=rt[e];if(t===void 0){let n=Hv.get(e);if(n!==void 0)t=rt[n],qe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return vh(t)}function Pp(i){return i.replace(Wv,Xv)}function Xv(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Lp(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Yv(i){return qv[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}function Kv(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":Zv[i.envMapMode]||"ENVMAP_TYPE_CUBE"}function Jv(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":$v[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}function Qv(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":jv[i.combine]||"ENVMAP_BLENDING_NONE"}function eS(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function tS(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=Yv(t),c=Kv(t),u=Jv(t),d=Qv(t),h=eS(t),f=Bv(t),g=zv(r),y=s.createProgram(),m,p,T=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(qo).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(qo).join(`
`),p.length>0&&(p+=`
`)):(m=[Lp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(qo).join(`
`),p=[Lp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Qn?"#define TONE_MAPPING":"",t.toneMapping!==Qn?rt.tonemapping_pars_fragment:"",t.toneMapping!==Qn?Fv("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",rt.colorspace_pars_fragment,Nv("linearToOutputTexel",t.outputColorSpace),Ov(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(qo).join(`
`)),o=vh(o),o=Cp(o,t),o=Ip(o,t),a=vh(a),a=Cp(a,t),a=Ip(a,t),o=Pp(o),a=Pp(a),t.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===ih?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ih?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let A=T+m+o,v=T+p+a,M=wp(s,s.VERTEX_SHADER,A),b=wp(s,s.FRAGMENT_SHADER,v);s.attachShader(y,M),s.attachShader(y,b),t.index0AttributeName!==void 0?s.bindAttribLocation(y,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function R(D){if(i.debug.checkShaderErrors){let V=s.getProgramInfoLog(y)||"",W=s.getShaderInfoLog(M)||"",L=s.getShaderInfoLog(b)||"",z=V.trim(),K=W.trim(),H=L.trim(),te=!0,N=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if(te=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,y,M,b);else{let Y=Rp(s,M,"vertex"),ne=Rp(s,b,"fragment");Ke("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+z+`
`+Y+`
`+ne)}else z!==""?qe("WebGLProgram: Program Info Log:",z):(K===""||H==="")&&(N=!1);N&&(D.diagnostics={runnable:te,programLog:z,vertexShader:{log:K,prefix:m},fragmentShader:{log:H,prefix:p}})}s.deleteShader(M),s.deleteShader(b),x=new zr(s,y),E=kv(s,y)}let x;this.getUniforms=function(){return x===void 0&&R(this),x};let E;this.getAttributes=function(){return E===void 0&&R(this),E};let P=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=s.getProgramParameter(y,Iv)),P},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Pv++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=M,this.fragmentShader=b,this}function iS(i){return i===fs||i===Vo||i===Ho}function sS(i,e,t,n,s,r){let o=new _o,a=new Sh,l=new Set,c=[],u=new Map,d=n.logarithmicDepthBuffer,h=n.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(x){return l.add(x),x===0?"uv":`uv${x}`}function y(x,E,P,D,V,W){let L=D.fog,z=V.geometry,K=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?D.environment:null,H=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,te=e.get(x.envMap||K,H),N=te&&te.mapping===Fo?te.image.height:null,Y=f[x.type];x.precision!==null&&(h=n.getMaxPrecision(x.precision),h!==x.precision&&qe("WebGLProgram.getParameters:",x.precision,"not supported, using",h,"instead."));let ne=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,Me=ne!==void 0?ne.length:0,Ne=0;z.morphAttributes.position!==void 0&&(Ne=1),z.morphAttributes.normal!==void 0&&(Ne=2),z.morphAttributes.color!==void 0&&(Ne=3);let re,ge,de,B;if(Y){let We=xi[Y];re=We.vertexShader,ge=We.fragmentShader}else{re=x.vertexShader,ge=x.fragmentShader;let We=a.getVertexShaderStage(x),Je=a.getFragmentShaderStage(x);a.update(x,We,Je),de=We.id,B=Je.id}let G=i.getRenderTarget(),ae=i.state.buffers.depth.getReversed(),fe=V.isInstancedMesh===!0,ce=V.isBatchedMesh===!0,me=!!x.map,xe=!!x.matcap,we=!!te,oe=!!x.aoMap,Z=!!x.lightMap,se=!!x.bumpMap&&x.wireframe===!1,_e=!!x.normalMap,Ae=!!x.displacementMap,Ye=!!x.emissiveMap,Re=!!x.metalnessMap,He=!!x.roughnessMap,I=x.anisotropy>0,Ze=x.clearcoat>0,Oe=x.dispersion>0,w=x.retroreflectivity>0,_=x.iridescence>0,U=x.sheen>0,k=x.transmission>0,$=I&&!!x.anisotropyMap,ue=Ze&&!!x.clearcoatMap,pe=Ze&&!!x.clearcoatNormalMap,J=Ze&&!!x.clearcoatRoughnessMap,ie=_&&!!x.iridescenceMap,ve=_&&!!x.iridescenceThicknessMap,ze=U&&!!x.sheenColorMap,be=U&&!!x.sheenRoughnessMap,Se=!!x.specularMap,ee=!!x.specularColorMap,Ee=!!x.specularIntensityMap,De=k&&!!x.transmissionMap,C=k&&!!x.thicknessMap,he=!!x.gradientMap,Q=!!x.alphaMap,ye=x.alphaTest>0,Te=!!x.alphaHash,le=!!x.extensions,Pe=Qn;x.toneMapped&&(G===null||G.isXRRenderTarget===!0)&&(Pe=i.toneMapping);let Ue={shaderID:Y,shaderType:x.type,shaderName:x.name,vertexShader:re,fragmentShader:ge,defines:x.defines,customVertexShaderID:de,customFragmentShaderID:B,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:h,batching:ce,batchingColor:ce&&V._colorsTexture!==null,instancing:fe,instancingColor:fe&&V.instanceColor!==null,instancingMorph:fe&&V.morphTexture!==null,outputColorSpace:G===null?i.outputColorSpace:G.isXRRenderTarget===!0?G.texture.colorSpace:ot.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:me,matcap:xe,envMap:we,envMapMode:we&&te.mapping,envMapCubeUVHeight:N,aoMap:oe,lightMap:Z,bumpMap:se,normalMap:_e,displacementMap:Ae,emissiveMap:Ye,normalMapObjectSpace:_e&&x.normalMapType===ep,normalMapTangentSpace:_e&&x.normalMapType===sl,packedNormalMap:_e&&x.normalMapType===sl&&iS(x.normalMap.format),metalnessMap:Re,roughnessMap:He,anisotropy:I,anisotropyMap:$,clearcoat:Ze,clearcoatMap:ue,clearcoatNormalMap:pe,clearcoatRoughnessMap:J,dispersion:Oe,retroreflection:w,iridescence:_,iridescenceMap:ie,iridescenceThicknessMap:ve,sheen:U,sheenColorMap:ze,sheenRoughnessMap:be,specularMap:Se,specularColorMap:ee,specularIntensityMap:Ee,transmission:k,transmissionMap:De,thicknessMap:C,gradientMap:he,opaque:x.transparent===!1&&x.blending===Lr&&x.alphaToCoverage===!1,alphaMap:Q,alphaTest:ye,alphaHash:Te,combine:x.combine,mapUv:me&&g(x.map.channel),aoMapUv:oe&&g(x.aoMap.channel),lightMapUv:Z&&g(x.lightMap.channel),bumpMapUv:se&&g(x.bumpMap.channel),normalMapUv:_e&&g(x.normalMap.channel),displacementMapUv:Ae&&g(x.displacementMap.channel),emissiveMapUv:Ye&&g(x.emissiveMap.channel),metalnessMapUv:Re&&g(x.metalnessMap.channel),roughnessMapUv:He&&g(x.roughnessMap.channel),anisotropyMapUv:$&&g(x.anisotropyMap.channel),clearcoatMapUv:ue&&g(x.clearcoatMap.channel),clearcoatNormalMapUv:pe&&g(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:J&&g(x.clearcoatRoughnessMap.channel),iridescenceMapUv:ie&&g(x.iridescenceMap.channel),iridescenceThicknessMapUv:ve&&g(x.iridescenceThicknessMap.channel),sheenColorMapUv:ze&&g(x.sheenColorMap.channel),sheenRoughnessMapUv:be&&g(x.sheenRoughnessMap.channel),specularMapUv:Se&&g(x.specularMap.channel),specularColorMapUv:ee&&g(x.specularColorMap.channel),specularIntensityMapUv:Ee&&g(x.specularIntensityMap.channel),transmissionMapUv:De&&g(x.transmissionMap.channel),thicknessMapUv:C&&g(x.thicknessMap.channel),alphaMapUv:Q&&g(x.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(_e||I),vertexNormals:!!z.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,pointsUvs:V.isPoints===!0&&!!z.attributes.uv&&(me||Q),fog:!!L,useFog:x.fog===!0,fogExp2:!!L&&L.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||z.attributes.normal===void 0&&_e===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:ae,skinning:V.isSkinnedMesh===!0,hasPositionAttribute:z.attributes.position!==void 0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:Me,morphTextureStride:Ne,numSunLights:E.sun.length,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numSunLightShadows:E.sunShadowMap.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:W.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:Pe,decodeVideoTexture:me&&x.map.isVideoTexture===!0&&ot.getTransfer(x.map.colorSpace)===_t,decodeVideoTextureEmissive:Ye&&x.emissiveMap.isVideoTexture===!0&&ot.getTransfer(x.emissiveMap.colorSpace)===_t,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Wt,flipSided:x.side===dn,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:le&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(le&&x.extensions.multiDraw===!0||ce)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Ue.vertexUv1s=l.has(1),Ue.vertexUv2s=l.has(2),Ue.vertexUv3s=l.has(3),l.clear(),Ue}function m(x){let E=[];if(x.shaderID?E.push(x.shaderID):(E.push(x.customVertexShaderID),E.push(x.customFragmentShaderID)),x.defines!==void 0)for(let P in x.defines)E.push(P),E.push(x.defines[P]);return x.isRawShaderMaterial===!1&&(p(E,x),T(E,x),E.push(i.outputColorSpace)),E.push(x.customProgramCacheKey),E.join()}function p(x,E){x.push(E.precision),x.push(E.outputColorSpace),x.push(E.envMapMode),x.push(E.envMapCubeUVHeight),x.push(E.mapUv),x.push(E.alphaMapUv),x.push(E.lightMapUv),x.push(E.aoMapUv),x.push(E.bumpMapUv),x.push(E.normalMapUv),x.push(E.displacementMapUv),x.push(E.emissiveMapUv),x.push(E.metalnessMapUv),x.push(E.roughnessMapUv),x.push(E.anisotropyMapUv),x.push(E.clearcoatMapUv),x.push(E.clearcoatNormalMapUv),x.push(E.clearcoatRoughnessMapUv),x.push(E.iridescenceMapUv),x.push(E.iridescenceThicknessMapUv),x.push(E.sheenColorMapUv),x.push(E.sheenRoughnessMapUv),x.push(E.specularMapUv),x.push(E.specularColorMapUv),x.push(E.specularIntensityMapUv),x.push(E.transmissionMapUv),x.push(E.thicknessMapUv),x.push(E.combine),x.push(E.fogExp2),x.push(E.sizeAttenuation),x.push(E.morphTargetsCount),x.push(E.morphAttributeCount),x.push(E.numSunLights),x.push(E.numDirLights),x.push(E.numPointLights),x.push(E.numSpotLights),x.push(E.numSpotLightMaps),x.push(E.numHemiLights),x.push(E.numRectAreaLights),x.push(E.numSunLightShadows),x.push(E.numDirLightShadows),x.push(E.numPointLightShadows),x.push(E.numSpotLightShadows),x.push(E.numSpotLightShadowsWithMaps),x.push(E.numLightProbes),x.push(E.shadowMapType),x.push(E.toneMapping),x.push(E.numClippingPlanes),x.push(E.numClipIntersection),x.push(E.depthPacking)}function T(x,E){o.disableAll(),E.instancing&&o.enable(0),E.instancingColor&&o.enable(1),E.instancingMorph&&o.enable(2),E.matcap&&o.enable(3),E.envMap&&o.enable(4),E.normalMapObjectSpace&&o.enable(5),E.normalMapTangentSpace&&o.enable(6),E.clearcoat&&o.enable(7),E.iridescence&&o.enable(8),E.alphaTest&&o.enable(9),E.vertexColors&&o.enable(10),E.vertexAlphas&&o.enable(11),E.vertexUv1s&&o.enable(12),E.vertexUv2s&&o.enable(13),E.vertexUv3s&&o.enable(14),E.vertexTangents&&o.enable(15),E.anisotropy&&o.enable(16),E.alphaHash&&o.enable(17),E.batching&&o.enable(18),E.dispersion&&o.enable(19),E.retroreflection&&o.enable(24),E.batchingColor&&o.enable(20),E.gradientMap&&o.enable(21),E.packedNormalMap&&o.enable(22),E.vertexNormals&&o.enable(23),x.push(o.mask),o.disableAll(),E.fog&&o.enable(0),E.useFog&&o.enable(1),E.flatShading&&o.enable(2),E.logarithmicDepthBuffer&&o.enable(3),E.reversedDepthBuffer&&o.enable(4),E.skinning&&o.enable(5),E.morphTargets&&o.enable(6),E.morphNormals&&o.enable(7),E.morphColors&&o.enable(8),E.premultipliedAlpha&&o.enable(9),E.shadowMapEnabled&&o.enable(10),E.doubleSided&&o.enable(11),E.flipSided&&o.enable(12),E.useDepthPacking&&o.enable(13),E.dithering&&o.enable(14),E.transmission&&o.enable(15),E.sheen&&o.enable(16),E.opaque&&o.enable(17),E.pointsUvs&&o.enable(18),E.decodeVideoTexture&&o.enable(19),E.decodeVideoTextureEmissive&&o.enable(20),E.alphaToCoverage&&o.enable(21),E.numLightProbeGrids>0&&o.enable(22),E.hasPositionAttribute&&o.enable(23),x.push(o.mask)}function A(x){let E=f[x.type],P;if(E){let D=xi[E];P=fp.clone(D.uniforms)}else P=x.uniforms;return P}function v(x,E){let P=u.get(E);return P!==void 0?++P.usedTimes:(P=new tS(i,E,x,s),c.push(P),u.set(E,P)),P}function M(x){if(--x.usedTimes===0){let E=c.indexOf(x);c[E]=c[c.length-1],c.pop(),u.delete(x.cacheKey),x.destroy()}}function b(x){a.remove(x)}function R(){a.dispose()}return{getParameters:y,getProgramCacheKey:m,getUniforms:A,acquireProgram:v,releaseProgram:M,releaseShaderCache:b,programs:c,dispose:R}}function rS(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function oS(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function Dp(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Np(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(h){let f=0;return h.isInstancedMesh&&(f+=2),h.isSkinnedMesh&&(f+=1),f}function a(h,f,g,y,m,p){let T=i[e];return T===void 0?(T={id:h.id,object:h,geometry:f,material:g,materialVariant:o(h),groupOrder:y,renderOrder:h.renderOrder,z:m,group:p},i[e]=T):(T.id=h.id,T.object=h,T.geometry=f,T.material=g,T.materialVariant=o(h),T.groupOrder=y,T.renderOrder=h.renderOrder,T.z=m,T.group=p),e++,T}function l(h,f,g,y,m,p,T){T.reversedDepth===!0&&(m=-m);let A=a(h,f,g,y,m,p);g.transmission>0?n.push(A):g.transparent===!0?s.push(A):t.push(A)}function c(h,f,g,y,m,p){let T=a(h,f,g,y,m,p);g.transmission>0?n.unshift(T):g.transparent===!0?s.unshift(T):t.unshift(T)}function u(h,f){t.length>1&&t.sort(h||oS),n.length>1&&n.sort(f||Dp),s.length>1&&s.sort(f||Dp)}function d(){for(let h=e,f=i.length;h<f;h++){let g=i[h];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:d,sort:u}}function aS(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new Np,i.set(n,[o])):s>=r.length?(o=new Np,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function cS(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new O,color:new Ge};break;case"SpotLight":t={position:new O,direction:new O,color:new Ge,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new O,color:new Ge,distance:0,decay:0};break;case"HemisphereLight":t={direction:new O,skyColor:new Ge,groundColor:new Ge};break;case"RectAreaLight":t={color:new Ge,position:new O,halfWidth:new O,halfHeight:new O};break}return i[e.id]=t,t}}}function lS(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new at};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new at};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new at,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}function hS(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function dS(i){let e=new cS,t=lS(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new O);let s=new O,r=new Qe,o=new Qe;function a(c){let u=0,d=0,h=0;for(let V=0;V<9;V++)n.probe[V].set(0,0,0);let f=0,g=0,y=0,m=0,p=0,T=0,A=0,v=0,M=0,b=0,R=0,x=0,E=0,P=0;c.sort(hS);for(let V=0,W=c.length;V<W;V++){let L=c[V],z=L.color,K=L.intensity,H=L.distance,te=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===fs?te=L.shadow.map.texture:te=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)u+=z.r*K,d+=z.g*K,h+=z.b*K;else if(L.isLightProbe){for(let N=0;N<9;N++)n.probe[N].addScaledVector(L.sh.coefficients[N],K);P++}else if(L.isSunLight){let N=e.get(L);if(N.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let Y=L.shadow,ne=t.get(L);ne.shadowIntensity=Y.intensity,ne.shadowBias=Y.bias,ne.shadowNormalBias=Y.normalBias,ne.shadowRadius=Y.radius,ne.shadowMapSize.copy(Y.mapSize).multiply(Y.getFrameExtents()),n.sunShadow[g]=ne,n.sunShadowMap[g]=te;let Me=Y.getViewportCount();for(let Ne=0;Ne<Me;Ne++)n.sunShadowMatrix[y+Ne]=Y.getMatrix(Ne),n.sunShadowCascade[y+Ne]=Y._cascadeData[Ne];y+=Me,g++}n.sun[f]=N,f++}else if(L.isDirectionalLight){let N=e.get(L);if(N.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let Y=L.shadow,ne=t.get(L);ne.shadowIntensity=Y.intensity,ne.shadowBias=Y.bias,ne.shadowNormalBias=Y.normalBias,ne.shadowRadius=Y.radius,ne.shadowMapSize=Y.mapSize,n.directionalShadow[m]=ne,n.directionalShadowMap[m]=te,n.directionalShadowMatrix[m]=L.shadow.matrix,M++}n.directional[m]=N,m++}else if(L.isSpotLight){let N=e.get(L);N.position.setFromMatrixPosition(L.matrixWorld),N.color.copy(z).multiplyScalar(K),N.distance=H,N.coneCos=Math.cos(L.angle),N.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),N.decay=L.decay,n.spot[T]=N;let Y=L.shadow;if(L.map&&(n.spotLightMap[x]=L.map,x++,Y.updateMatrices(L),L.castShadow&&E++),n.spotLightMatrix[T]=Y.matrix,L.castShadow){let ne=t.get(L);ne.shadowIntensity=Y.intensity,ne.shadowBias=Y.bias,ne.shadowNormalBias=Y.normalBias,ne.shadowRadius=Y.radius,ne.shadowMapSize=Y.mapSize,n.spotShadow[T]=ne,n.spotShadowMap[T]=te,R++}T++}else if(L.isRectAreaLight){let N=e.get(L);N.color.copy(z).multiplyScalar(K),N.halfWidth.set(L.width*.5,0,0),N.halfHeight.set(0,L.height*.5,0),n.rectArea[A]=N,A++}else if(L.isPointLight){let N=e.get(L);if(N.color.copy(L.color).multiplyScalar(L.intensity),N.distance=L.distance,N.decay=L.decay,L.castShadow){let Y=L.shadow,ne=t.get(L);ne.shadowIntensity=Y.intensity,ne.shadowBias=Y.bias,ne.shadowNormalBias=Y.normalBias,ne.shadowRadius=Y.radius,ne.shadowMapSize=Y.mapSize,ne.shadowCameraNear=Y.camera.near,ne.shadowCameraFar=Y.camera.far,n.pointShadow[p]=ne,n.pointShadowMap[p]=te,n.pointShadowMatrix[p]=L.shadow.matrix,b++}n.point[p]=N,p++}else if(L.isHemisphereLight){let N=e.get(L);N.skyColor.copy(L.color).multiplyScalar(K),N.groundColor.copy(L.groundColor).multiplyScalar(K),n.hemi[v]=N,v++}}A>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ce.LTC_FLOAT_1,n.rectAreaLTC2=Ce.LTC_FLOAT_2):(n.rectAreaLTC1=Ce.LTC_HALF_1,n.rectAreaLTC2=Ce.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=h;let D=n.hash;(D.sunLength!==f||D.directionalLength!==m||D.pointLength!==p||D.spotLength!==T||D.rectAreaLength!==A||D.hemiLength!==v||D.numSunShadows!==g||D.numDirectionalShadows!==M||D.numPointShadows!==b||D.numSpotShadows!==R||D.numSpotMaps!==x||D.numLightProbes!==P)&&(n.sun.length=f,n.directional.length=m,n.spot.length=T,n.rectArea.length=A,n.point.length=p,n.hemi.length=v,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=y,n.sunShadowCascade.length=y,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.directionalShadowMatrix.length=M,n.pointShadow.length=b,n.pointShadowMap.length=b,n.pointShadowMatrix.length=b,n.spotShadow.length=R,n.spotShadowMap.length=R,n.spotLightMatrix.length=R+x-E,n.spotLightMap.length=x,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=P,D.sunLength=f,D.directionalLength=m,D.pointLength=p,D.spotLength=T,D.rectAreaLength=A,D.hemiLength=v,D.numSunShadows=g,D.numDirectionalShadows=M,D.numPointShadows=b,D.numSpotShadows=R,D.numSpotMaps=x,D.numLightProbes=P,n.version=uS++)}function l(c,u){let d=0,h=0,f=0,g=0,y=0,m=0,p=u.matrixWorldInverse;for(let T=0,A=c.length;T<A;T++){let v=c[T];if(v.isSunLight){let M=n.sun[d];M.direction.setFromMatrixPosition(v.matrixWorld),M.direction.transformDirection(p),d++}else if(v.isDirectionalLight){let M=n.directional[h];M.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(p),h++}else if(v.isSpotLight){let M=n.spot[g];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(p),M.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(p),g++}else if(v.isRectAreaLight){let M=n.rectArea[y];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(p),o.identity(),r.copy(v.matrixWorld),r.premultiply(p),o.extractRotation(r),M.halfWidth.set(v.width*.5,0,0),M.halfHeight.set(0,v.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),y++}else if(v.isPointLight){let M=n.point[f];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(p),f++}else if(v.isHemisphereLight){let M=n.hemi[m];M.direction.setFromMatrixPosition(v.matrixWorld),M.direction.transformDirection(p),m++}}}return{setup:a,setupView:l,state:n}}function Up(i){let e=new dS(i),t=[],n=[],s=[];function r(h){d.camera=h,t.length=0,n.length=0,s.length=0}function o(h){t.push(h)}function a(h){n.push(h)}function l(h){s.push(h)}function c(){e.setup(t)}function u(h){e.setupView(t,h)}let d={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:d,setupLights:c,setupLightsView:u,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function fS(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new Up(i),e.set(s,[a])):r>=o.length?(a=new Up(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}function xS(i,e,t){let n=new wr,s=new at,r=new at,o=new Mt,a=new ac,l=new cc,c={},u=t.maxTextureSize,d={[mi]:dn,[dn]:mi,[Wt]:Wt},h=new Rn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new at},radius:{value:4}},vertexShader:pS,fragmentShader:mS}),f=h.clone();f.defines.HORIZONTAL_PASS=1;let g=new Pt;g.setAttribute("position",new Nt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new It(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=No;let p=this.type;this.render=function(b,R,x){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||b.length===0)return;this.type===If&&(qe("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=No);let E=i.getRenderTarget(),P=i.getActiveCubeFace(),D=i.getActiveMipmapLevel(),V=i.state;V.setBlending(gi),V.buffers.depth.getReversed()===!0?V.buffers.color.setClear(0,0,0,0):V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);let W=p!==this.type;W&&R.traverse(function(L){L.material&&(Array.isArray(L.material)?L.material.forEach(z=>z.needsUpdate=!0):L.material.needsUpdate=!0)});for(let L=0,z=b.length;L<z;L++){let K=b[L],H=K.shadow;if(H===void 0){qe("WebGLShadowMap:",K,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);let te=H.getFrameExtents();s.multiply(te),r.copy(H.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/te.x),s.x=r.x*te.x,H.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/te.y),s.y=r.y*te.y,H.mapSize.y=r.y));let N=i.state.buffers.depth.getReversed();if(H.camera._reversedDepth=N,H.map===null||W===!0){if(H.map!==null&&(H.map.depthTexture!==null&&(H.map.depthTexture.dispose(),H.map.depthTexture=null),H.map.dispose()),this.type===Pr){if(K.isPointLight){qe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}H.map=new gn(s.x,s.y,{format:fs,type:ni,minFilter:kt,magFilter:kt,generateMipmaps:!1}),H.map.texture.name=K.name+".shadowMap",H.map.depthTexture=new ls(s.x,s.y,In),H.map.depthTexture.name=K.name+".shadowMapDepth",H.map.depthTexture.format=ui,H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=zt,H.map.depthTexture.magFilter=zt}else K.isPointLight?(H.map=new ul(s.x),H.map.depthTexture=new rc(s.x,ti)):(H.map=new gn(s.x,s.y),H.map.depthTexture=new ls(s.x,s.y,ti)),H.map.depthTexture.name=K.name+".shadowMap",H.map.depthTexture.format=ui,this.type===No?(H.map.depthTexture.compareFunction=N?ol:rl,H.map.depthTexture.minFilter=kt,H.map.depthTexture.magFilter=kt):(H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=zt,H.map.depthTexture.magFilter=zt);H.camera.updateProjectionMatrix()}H.map.isWebGLCubeRenderTarget!==!0&&(H.map.width!==s.x||H.map.height!==s.y)&&H.map.setSize(s.x,s.y);let Y=H.map.isWebGLCubeRenderTarget?6:H.getViewportCount();K.isPointLight!==!0&&H.updateMatrices(K,x);for(let ne=0;ne<Y;ne++){let Me=H.getCamera(ne);if(K.isPointLight){let Ne=H.camera,re=H.matrix,ge=K.distance||Ne.far;ge!==Ne.far&&(Ne.far=ge,Ne.updateProjectionMatrix()),Xo.setFromMatrixPosition(K.matrixWorld),Ne.position.copy(Xo),mh.copy(Ne.position),mh.add(gS[ne]),Ne.up.copy(_S[ne]),Ne.lookAt(mh),Ne.updateMatrixWorld(),re.makeTranslation(-Xo.x,-Xo.y,-Xo.z),Fp.multiplyMatrices(Ne.projectionMatrix,Ne.matrixWorldInverse),H._frustum.setFromProjectionMatrix(Fp,Ne.coordinateSystem,Ne.reversedDepth)}if(H.map.isWebGLCubeRenderTarget)i.setRenderTarget(H.map,ne),i.clear();else{ne===0&&(i.setRenderTarget(H.map),i.clear());let Ne=H.getViewport(ne);o.set(r.x*Ne.x,r.y*Ne.y,r.x*Ne.z,r.y*Ne.w),V.viewport(o)}n=H.getFrustum(ne),v(R,x,Me,K,this.type)}H.isPointLightShadow!==!0&&this.type===Pr&&T(H,x),H.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(E,P,D)};function T(b,R){let x=e.update(y);h.defines.VSM_SAMPLES!==b.blurSamples&&(h.defines.VSM_SAMPLES=b.blurSamples,f.defines.VSM_SAMPLES=b.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),b.mapPass===null?b.mapPass=new gn(s.x,s.y,{format:fs,type:ni}):(b.mapPass.width!==b.map.width||b.mapPass.height!==b.map.height)&&b.mapPass.setSize(b.map.width,b.map.height),h.uniforms.shadow_pass.value=b.map.depthTexture,h.uniforms.resolution.value.set(b.map.width,b.map.height),h.uniforms.radius.value=b.radius,i.setRenderTarget(b.mapPass),i.clear(),i.renderBufferDirect(R,null,x,h,y,null),f.uniforms.shadow_pass.value=b.mapPass.texture,f.uniforms.resolution.value.set(b.map.width,b.map.height),f.uniforms.radius.value=b.radius,i.setRenderTarget(b.map),i.clear(),i.renderBufferDirect(R,null,x,f,y,null)}function A(b,R,x,E){let P=null,D=x.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(D!==void 0)P=D;else if(P=x.isPointLight===!0?l:a,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){let V=P.uuid,W=R.uuid,L=c[V];L===void 0&&(L={},c[V]=L);let z=L[W];z===void 0&&(z=P.clone(),L[W]=z,R.addEventListener("dispose",M)),P=z}if(P.visible=R.visible,P.wireframe=R.wireframe,E===Pr?P.side=R.shadowSide!==null?R.shadowSide:R.side:P.side=R.shadowSide!==null?R.shadowSide:d[R.side],P.alphaMap=R.alphaMap,P.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,P.map=R.map,P.clipShadows=R.clipShadows,P.clippingPlanes=R.clippingPlanes,P.clipIntersection=R.clipIntersection,P.displacementMap=R.displacementMap,P.displacementScale=R.displacementScale,P.displacementBias=R.displacementBias,P.wireframeLinewidth=R.wireframeLinewidth,P.linewidth=R.linewidth,x.isPointLight===!0&&P.isMeshDistanceMaterial===!0){let V=i.properties.get(P);V.light=x}return P}function v(b,R,x,E,P){if(b.visible===!1)return;if(b.layers.test(R.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&P===Pr)&&(!b.frustumCulled||b.intersectsFrustum(n))){b.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,b.matrixWorld);let W=e.update(b),L=b.material;if(Array.isArray(L)){let z=W.groups;for(let K=0,H=z.length;K<H;K++){let te=z[K],N=L[te.materialIndex];if(N&&N.visible){let Y=A(b,N,E,P);b.onBeforeShadow(i,b,R,x,W,Y,te),i.renderBufferDirect(x,null,W,Y,b,te),b.onAfterShadow(i,b,R,x,W,Y,te)}}}else if(L.visible){let z=A(b,L,E,P);b.onBeforeShadow(i,b,R,x,W,z,null),i.renderBufferDirect(x,null,W,z,b,null),b.onAfterShadow(i,b,R,x,W,z,null)}}let V=b.children;for(let W=0,L=V.length;W<L;W++)v(V[W],R,x,E,P)}function M(b){b.target.removeEventListener("dispose",M);for(let x in c){let E=c[x],P=b.target.uuid;P in E&&(E[P].dispose(),delete E[P])}}}function yS(i,e){function t(){let C=!1,he=new Mt,Q=null,ye=new Mt(0,0,0,0);return{setMask:function(Te){Q!==Te&&!C&&(i.colorMask(Te,Te,Te,Te),Q=Te)},setLocked:function(Te){C=Te},setClear:function(Te,le,Pe,Ue,We){We===!0&&(Te*=Ue,le*=Ue,Pe*=Ue),he.set(Te,le,Pe,Ue),ye.equals(he)===!1&&(i.clearColor(Te,le,Pe,Ue),ye.copy(he))},reset:function(){C=!1,Q=null,ye.set(-1,0,0,0)}}}function n(){let C=!1,he=!1,Q=null,ye=null,Te=null;return{setReversed:function(le){if(he!==le){let Pe=e.get("EXT_clip_control");le?Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.ZERO_TO_ONE_EXT):Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.NEGATIVE_ONE_TO_ONE_EXT),he=le;let Ue=Te;Te=null,this.setClear(Ue)}},getReversed:function(){return he},setTest:function(le){le?G(i.DEPTH_TEST):ae(i.DEPTH_TEST)},setMask:function(le){Q!==le&&!C&&(i.depthMask(le),Q=le)},setFunc:function(le){if(he&&(le=hp[le]),ye!==le){switch(le){case Ya:i.depthFunc(i.NEVER);break;case Za:i.depthFunc(i.ALWAYS);break;case Ka:i.depthFunc(i.LESS);break;case mr:i.depthFunc(i.LEQUAL);break;case $a:i.depthFunc(i.EQUAL);break;case Ja:i.depthFunc(i.GEQUAL);break;case ja:i.depthFunc(i.GREATER);break;case Qa:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ye=le}},setLocked:function(le){C=le},setClear:function(le){Te!==le&&(Te=le,he&&(le=1-le),i.clearDepth(le))},reset:function(){C=!1,Q=null,ye=null,Te=null,he=!1}}}function s(){let C=!1,he=null,Q=null,ye=null,Te=null,le=null,Pe=null,Ue=null,We=null;return{setTest:function(Je){C||(Je?G(i.STENCIL_TEST):ae(i.STENCIL_TEST))},setMask:function(Je){he!==Je&&!C&&(i.stencilMask(Je),he=Je)},setFunc:function(Je,Un,Tn){(Q!==Je||ye!==Un||Te!==Tn)&&(i.stencilFunc(Je,Un,Tn),Q=Je,ye=Un,Te=Tn)},setOp:function(Je,Un,Tn){(le!==Je||Pe!==Un||Ue!==Tn)&&(i.stencilOp(Je,Un,Tn),le=Je,Pe=Un,Ue=Tn)},setLocked:function(Je){C=Je},setClear:function(Je){We!==Je&&(i.clearStencil(Je),We=Je)},reset:function(){C=!1,he=null,Q=null,ye=null,Te=null,le=null,Pe=null,Ue=null,We=null}}}let r=new t,o=new n,a=new s,l=new WeakMap,c=new WeakMap,u={},d={},h={},f=new WeakMap,g=[],y=null,m=!1,p=null,T=null,A=null,v=null,M=null,b=null,R=null,x=new Ge(0,0,0),E=0,P=!1,D=null,V=null,W=null,L=null,z=null,K=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),H=!1,te=0,N=i.getParameter(i.VERSION);N.indexOf("WebGL")!==-1?(te=parseFloat(/^WebGL (\d)/.exec(N)[1]),H=te>=1):N.indexOf("OpenGL ES")!==-1&&(te=parseFloat(/^OpenGL ES (\d)/.exec(N)[1]),H=te>=2);let Y=null,ne={},Me=i.getParameter(i.SCISSOR_BOX),Ne=i.getParameter(i.VIEWPORT),re=new Mt().fromArray(Me),ge=new Mt().fromArray(Ne);function de(C,he,Q,ye){let Te=new Uint8Array(4),le=i.createTexture();i.bindTexture(C,le),i.texParameteri(C,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(C,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Pe=0;Pe<Q;Pe++)C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY?i.texImage3D(he,0,i.RGBA,1,1,ye,0,i.RGBA,i.UNSIGNED_BYTE,Te):i.texImage2D(he+Pe,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Te);return le}let B={};B[i.TEXTURE_2D]=de(i.TEXTURE_2D,i.TEXTURE_2D,1),B[i.TEXTURE_CUBE_MAP]=de(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),B[i.TEXTURE_2D_ARRAY]=de(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),B[i.TEXTURE_3D]=de(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),G(i.DEPTH_TEST),o.setFunc(mr),se(!1),_e(Uu),G(i.CULL_FACE),oe(gi);function G(C){u[C]!==!0&&(i.enable(C),u[C]=!0)}function ae(C){u[C]!==!1&&(i.disable(C),u[C]=!1)}function fe(C,he){return h[C]!==he?(i.bindFramebuffer(C,he),h[C]=he,C===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=he),C===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=he),!0):!1}function ce(C,he){let Q=g,ye=!1;if(C){Q=f.get(he),Q===void 0&&(Q=[],f.set(he,Q));let Te=C.textures;if(Q.length!==Te.length||Q[0]!==i.COLOR_ATTACHMENT0){for(let le=0,Pe=Te.length;le<Pe;le++)Q[le]=i.COLOR_ATTACHMENT0+le;Q.length=Te.length,ye=!0}}else Q[0]!==i.BACK&&(Q[0]=i.BACK,ye=!0);ye&&i.drawBuffers(Q)}function me(C){return y!==C?(i.useProgram(C),y=C,!0):!1}let xe={[Us]:i.FUNC_ADD,[Lf]:i.FUNC_SUBTRACT,[Df]:i.FUNC_REVERSE_SUBTRACT};xe[Nf]=i.MIN,xe[Uf]=i.MAX;let we={[Ff]:i.ZERO,[Of]:i.ONE,[Bf]:i.SRC_COLOR,[zu]:i.SRC_ALPHA,[Wf]:i.SRC_ALPHA_SATURATE,[Hf]:i.DST_COLOR,[kf]:i.DST_ALPHA,[zf]:i.ONE_MINUS_SRC_COLOR,[ku]:i.ONE_MINUS_SRC_ALPHA,[Gf]:i.ONE_MINUS_DST_COLOR,[Vf]:i.ONE_MINUS_DST_ALPHA,[Xf]:i.CONSTANT_COLOR,[qf]:i.ONE_MINUS_CONSTANT_COLOR,[Yf]:i.CONSTANT_ALPHA,[Zf]:i.ONE_MINUS_CONSTANT_ALPHA};function oe(C,he,Q,ye,Te,le,Pe,Ue,We,Je){if(C===gi){m===!0&&(ae(i.BLEND),m=!1);return}if(m===!1&&(G(i.BLEND),m=!0),C!==Pf){if(C!==p||Je!==P){if((T!==Us||M!==Us)&&(i.blendEquation(i.FUNC_ADD),T=Us,M=Us),Je)switch(C){case Lr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Fu:i.blendFunc(i.ONE,i.ONE);break;case Ou:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Bu:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Ke("WebGLState: Invalid blending: ",C);break}else switch(C){case Lr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Fu:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Ou:Ke("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Bu:Ke("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ke("WebGLState: Invalid blending: ",C);break}A=null,v=null,b=null,R=null,x.set(0,0,0),E=0,p=C,P=Je}return}Te=Te||he,le=le||Q,Pe=Pe||ye,(he!==T||Te!==M)&&(i.blendEquationSeparate(xe[he],xe[Te]),T=he,M=Te),(Q!==A||ye!==v||le!==b||Pe!==R)&&(i.blendFuncSeparate(we[Q],we[ye],we[le],we[Pe]),A=Q,v=ye,b=le,R=Pe),(Ue.equals(x)===!1||We!==E)&&(i.blendColor(Ue.r,Ue.g,Ue.b,We),x.copy(Ue),E=We),p=C,P=!1}function Z(C,he){C.side===Wt?ae(i.CULL_FACE):G(i.CULL_FACE);let Q=C.side===dn;he&&(Q=!Q),se(Q),C.blending===Lr&&C.transparent===!1?oe(gi):oe(C.blending,C.blendEquation,C.blendSrc,C.blendDst,C.blendEquationAlpha,C.blendSrcAlpha,C.blendDstAlpha,C.blendColor,C.blendAlpha,C.premultipliedAlpha),o.setFunc(C.depthFunc),o.setTest(C.depthTest),o.setMask(C.depthWrite),r.setMask(C.colorWrite);let ye=C.stencilWrite;a.setTest(ye),ye&&(a.setMask(C.stencilWriteMask),a.setFunc(C.stencilFunc,C.stencilRef,C.stencilFuncMask),a.setOp(C.stencilFail,C.stencilZFail,C.stencilZPass)),Ye(C.polygonOffset,C.polygonOffsetFactor,C.polygonOffsetUnits),C.alphaToCoverage===!0?G(i.SAMPLE_ALPHA_TO_COVERAGE):ae(i.SAMPLE_ALPHA_TO_COVERAGE)}function se(C){D!==C&&(C?i.frontFace(i.CW):i.frontFace(i.CCW),D=C)}function _e(C){C!==Rf?(G(i.CULL_FACE),C!==V&&(C===Uu?i.cullFace(i.BACK):C===Cf?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ae(i.CULL_FACE),V=C}function Ae(C){C!==W&&(H&&i.lineWidth(C),W=C)}function Ye(C,he,Q){C?(G(i.POLYGON_OFFSET_FILL),(L!==he||z!==Q)&&(L=he,z=Q,o.getReversed()&&(he=-he),i.polygonOffset(he,Q))):ae(i.POLYGON_OFFSET_FILL)}function Re(C){C?G(i.SCISSOR_TEST):ae(i.SCISSOR_TEST)}function He(C){C===void 0&&(C=i.TEXTURE0+K-1),Y!==C&&(i.activeTexture(C),Y=C)}function I(C,he,Q){Q===void 0&&(Y===null?Q=i.TEXTURE0+K-1:Q=Y);let ye=ne[Q];ye===void 0&&(ye={type:void 0,texture:void 0},ne[Q]=ye),(ye.type!==C||ye.texture!==he)&&(Y!==Q&&(i.activeTexture(Q),Y=Q),i.bindTexture(C,he||B[C]),ye.type=C,ye.texture=he)}function Ze(){let C=ne[Y];C!==void 0&&C.type!==void 0&&(i.bindTexture(C.type,null),C.type=void 0,C.texture=void 0)}function Oe(){try{i.compressedTexImage2D(...arguments)}catch(C){Ke("WebGLState:",C)}}function w(){try{i.compressedTexImage3D(...arguments)}catch(C){Ke("WebGLState:",C)}}function _(){try{i.texSubImage2D(...arguments)}catch(C){Ke("WebGLState:",C)}}function U(){try{i.texSubImage3D(...arguments)}catch(C){Ke("WebGLState:",C)}}function k(){try{i.compressedTexSubImage2D(...arguments)}catch(C){Ke("WebGLState:",C)}}function $(){try{i.compressedTexSubImage3D(...arguments)}catch(C){Ke("WebGLState:",C)}}function ue(){try{i.texStorage2D(...arguments)}catch(C){Ke("WebGLState:",C)}}function pe(){try{i.texStorage3D(...arguments)}catch(C){Ke("WebGLState:",C)}}function J(){try{i.texImage2D(...arguments)}catch(C){Ke("WebGLState:",C)}}function ie(){try{i.texImage3D(...arguments)}catch(C){Ke("WebGLState:",C)}}function ve(C){return d[C]!==void 0?d[C]:i.getParameter(C)}function ze(C,he){d[C]!==he&&(i.pixelStorei(C,he),d[C]=he)}function be(C){re.equals(C)===!1&&(i.scissor(C.x,C.y,C.z,C.w),re.copy(C))}function Se(C){ge.equals(C)===!1&&(i.viewport(C.x,C.y,C.z,C.w),ge.copy(C))}function ee(C,he){let Q=c.get(he);Q===void 0&&(Q=new WeakMap,c.set(he,Q));let ye=Q.get(C);ye===void 0&&(ye=i.getUniformBlockIndex(he,C.name),Q.set(C,ye))}function Ee(C,he){let ye=c.get(he).get(C);l.get(he)!==ye&&(i.uniformBlockBinding(he,ye,C.__bindingPointIndex),l.set(he,ye))}function De(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),u={},d={},Y=null,ne={},h={},f=new WeakMap,g=[],y=null,m=!1,p=null,T=null,A=null,v=null,M=null,b=null,R=null,x=new Ge(0,0,0),E=0,P=!1,D=null,V=null,W=null,L=null,z=null,re.set(0,0,i.canvas.width,i.canvas.height),ge.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:G,disable:ae,bindFramebuffer:fe,drawBuffers:ce,useProgram:me,setBlending:oe,setMaterial:Z,setFlipSided:se,setCullFace:_e,setLineWidth:Ae,setPolygonOffset:Ye,setScissorTest:Re,activeTexture:He,bindTexture:I,unbindTexture:Ze,compressedTexImage2D:Oe,compressedTexImage3D:w,texImage2D:J,texImage3D:ie,pixelStorei:ze,getParameter:ve,updateUBOMapping:ee,uniformBlockBinding:Ee,texStorage2D:ue,texStorage3D:pe,texSubImage2D:_,texSubImage3D:U,compressedTexSubImage2D:k,compressedTexSubImage3D:$,scissor:be,viewport:Se,reset:De}}function vS(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new at,u=new WeakMap,d=new Set,h,f=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(w,_){return g?new OffscreenCanvas(w,_):xr("canvas")}function m(w,_,U){let k=1,$=Oe(w);if(($.width>U||$.height>U)&&(k=U/Math.max($.width,$.height)),k<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){let ue=Math.floor(k*$.width),pe=Math.floor(k*$.height);h===void 0&&(h=y(ue,pe));let J=_?y(ue,pe):h;return J.width=ue,J.height=pe,J.getContext("2d").drawImage(w,0,0,ue,pe),qe("WebGLRenderer: Texture has been resized from ("+$.width+"x"+$.height+") to ("+ue+"x"+pe+")."),J}else return"data"in w&&qe("WebGLRenderer: Image in DataTexture is too big ("+$.width+"x"+$.height+")."),w;return w}function p(w){return w.generateMipmaps}function T(w){i.generateMipmap(w)}function A(w){return w.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?i.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(w,_,U,k,$,ue=!1){if(w!==null){if(i[w]!==void 0)return i[w];qe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let pe;k&&(pe=e.get("EXT_texture_norm16"),pe||qe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let J=_;if(_===i.RED&&(U===i.FLOAT&&(J=i.R32F),U===i.HALF_FLOAT&&(J=i.R16F),U===i.UNSIGNED_BYTE&&(J=i.R8),U===i.UNSIGNED_SHORT&&pe&&(J=pe.R16_EXT),U===i.SHORT&&pe&&(J=pe.R16_SNORM_EXT)),_===i.RED_INTEGER&&(U===i.UNSIGNED_BYTE&&(J=i.R8UI),U===i.UNSIGNED_SHORT&&(J=i.R16UI),U===i.UNSIGNED_INT&&(J=i.R32UI),U===i.BYTE&&(J=i.R8I),U===i.SHORT&&(J=i.R16I),U===i.INT&&(J=i.R32I)),_===i.RG&&(U===i.FLOAT&&(J=i.RG32F),U===i.HALF_FLOAT&&(J=i.RG16F),U===i.UNSIGNED_BYTE&&(J=i.RG8),U===i.UNSIGNED_SHORT&&pe&&(J=pe.RG16_EXT),U===i.SHORT&&pe&&(J=pe.RG16_SNORM_EXT)),_===i.RG_INTEGER&&(U===i.UNSIGNED_BYTE&&(J=i.RG8UI),U===i.UNSIGNED_SHORT&&(J=i.RG16UI),U===i.UNSIGNED_INT&&(J=i.RG32UI),U===i.BYTE&&(J=i.RG8I),U===i.SHORT&&(J=i.RG16I),U===i.INT&&(J=i.RG32I)),_===i.RGB_INTEGER&&(U===i.UNSIGNED_BYTE&&(J=i.RGB8UI),U===i.UNSIGNED_SHORT&&(J=i.RGB16UI),U===i.UNSIGNED_INT&&(J=i.RGB32UI),U===i.BYTE&&(J=i.RGB8I),U===i.SHORT&&(J=i.RGB16I),U===i.INT&&(J=i.RGB32I)),_===i.RGBA_INTEGER&&(U===i.UNSIGNED_BYTE&&(J=i.RGBA8UI),U===i.UNSIGNED_SHORT&&(J=i.RGBA16UI),U===i.UNSIGNED_INT&&(J=i.RGBA32UI),U===i.BYTE&&(J=i.RGBA8I),U===i.SHORT&&(J=i.RGBA16I),U===i.INT&&(J=i.RGBA32I)),_===i.RGB&&(U===i.UNSIGNED_SHORT&&pe&&(J=pe.RGB16_EXT),U===i.SHORT&&pe&&(J=pe.RGB16_SNORM_EXT),U===i.UNSIGNED_INT_5_9_9_9_REV&&(J=i.RGB9_E5),U===i.UNSIGNED_INT_10F_11F_11F_REV&&(J=i.R11F_G11F_B10F)),_===i.RGBA){let ie=ue?po:ot.getTransfer($);U===i.FLOAT&&(J=i.RGBA32F),U===i.HALF_FLOAT&&(J=i.RGBA16F),U===i.UNSIGNED_BYTE&&(J=ie===_t?i.SRGB8_ALPHA8:i.RGBA8),U===i.UNSIGNED_SHORT&&pe&&(J=pe.RGBA16_EXT),U===i.SHORT&&pe&&(J=pe.RGBA16_SNORM_EXT),U===i.UNSIGNED_SHORT_4_4_4_4&&(J=i.RGBA4),U===i.UNSIGNED_SHORT_5_5_5_1&&(J=i.RGB5_A1)}return(J===i.R16F||J===i.R32F||J===i.RG16F||J===i.RG32F||J===i.RGBA16F||J===i.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function M(w,_){let U;return w?_===null||_===ti||_===Ur?U=i.DEPTH24_STENCIL8:_===In?U=i.DEPTH32F_STENCIL8:_===Nr&&(U=i.DEPTH24_STENCIL8,qe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===ti||_===Ur?U=i.DEPTH_COMPONENT24:_===In?U=i.DEPTH_COMPONENT32F:_===Nr&&(U=i.DEPTH_COMPONENT16),U}function b(w,_){return p(w)===!0||w.isFramebufferTexture&&w.minFilter!==zt&&w.minFilter!==kt?Math.log2(Math.max(_.width,_.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?_.mipmaps.length:1}function R(w){let _=w.target;_.removeEventListener("dispose",R),E(_),_.isVideoTexture&&u.delete(_),_.isHTMLTexture&&d.delete(_)}function x(w){let _=w.target;_.removeEventListener("dispose",x),D(_)}function E(w){let _=n.get(w);if(_.__webglInit===void 0)return;let U=w.source,k=f.get(U);if(k){let $=k[_.__cacheKey];$.usedTimes--,$.usedTimes===0&&P(w),Object.keys(k).length===0&&f.delete(U)}n.remove(w)}function P(w){let _=n.get(w);i.deleteTexture(_.__webglTexture);let U=w.source,k=f.get(U);delete k[_.__cacheKey],o.memory.textures--}function D(w){let _=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let k=0;k<6;k++){if(Array.isArray(_.__webglFramebuffer[k]))for(let $=0;$<_.__webglFramebuffer[k].length;$++)i.deleteFramebuffer(_.__webglFramebuffer[k][$]);else i.deleteFramebuffer(_.__webglFramebuffer[k]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[k])}else{if(Array.isArray(_.__webglFramebuffer))for(let k=0;k<_.__webglFramebuffer.length;k++)i.deleteFramebuffer(_.__webglFramebuffer[k]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let k=0;k<_.__webglColorRenderbuffer.length;k++)_.__webglColorRenderbuffer[k]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[k]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let U=w.textures;for(let k=0,$=U.length;k<$;k++){let ue=n.get(U[k]);ue.__webglTexture&&(i.deleteTexture(ue.__webglTexture),o.memory.textures--),n.remove(U[k])}n.remove(w)}let V=0;function W(){V=0}function L(){return V}function z(w){V=w}function K(){let w=V;return w>=s.maxTextures&&qe("WebGLTextures: Trying to use "+(w+1)+" texture units while this GPU supports only "+s.maxTextures),V+=1,w}function H(w){let _=[];return _.push(w.wrapS),_.push(w.wrapT),_.push(w.wrapR||0),_.push(w.magFilter),_.push(w.minFilter),_.push(w.anisotropy),_.push(w.internalFormat),_.push(w.format),_.push(w.type),_.push(w.generateMipmaps),_.push(w.premultiplyAlpha),_.push(w.flipY),_.push(w.unpackAlignment),_.push(w.colorSpace),_.join()}function te(w,_){let U=n.get(w);if(w.isVideoTexture&&I(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&U.__version!==w.version){let k=w.image;if(k===null)qe("WebGLRenderer: Texture marked for update but no image data found.");else if(k.complete===!1)qe("WebGLRenderer: Texture marked for update but image is incomplete");else{ae(U,w,_);return}}else w.isExternalTexture&&(U.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,U.__webglTexture,i.TEXTURE0+_)}function N(w,_){let U=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&U.__version!==w.version){ae(U,w,_);return}else w.isExternalTexture&&(U.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,U.__webglTexture,i.TEXTURE0+_)}function Y(w,_){let U=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&U.__version!==w.version){ae(U,w,_);return}t.bindTexture(i.TEXTURE_3D,U.__webglTexture,i.TEXTURE0+_)}function ne(w,_){let U=n.get(w);if(w.isCubeDepthTexture!==!0&&w.version>0&&U.__version!==w.version){fe(U,w,_);return}t.bindTexture(i.TEXTURE_CUBE_MAP,U.__webglTexture,i.TEXTURE0+_)}let Me={[cs]:i.REPEAT,[Bn]:i.CLAMP_TO_EDGE,[gr]:i.MIRRORED_REPEAT},Ne={[zt]:i.NEAREST,[vc]:i.NEAREST_MIPMAP_NEAREST,[Os]:i.NEAREST_MIPMAP_LINEAR,[kt]:i.LINEAR,[Dr]:i.LINEAR_MIPMAP_NEAREST,[ei]:i.LINEAR_MIPMAP_LINEAR},re={[np]:i.NEVER,[ap]:i.ALWAYS,[ip]:i.LESS,[rl]:i.LEQUAL,[sp]:i.EQUAL,[ol]:i.GEQUAL,[rp]:i.GREATER,[op]:i.NOTEQUAL};function ge(w,_){if(_.type===In&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===kt||_.magFilter===Dr||_.magFilter===Os||_.magFilter===ei||_.minFilter===kt||_.minFilter===Dr||_.minFilter===Os||_.minFilter===ei)&&qe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(w,i.TEXTURE_WRAP_S,Me[_.wrapS]),i.texParameteri(w,i.TEXTURE_WRAP_T,Me[_.wrapT]),(w===i.TEXTURE_3D||w===i.TEXTURE_2D_ARRAY)&&i.texParameteri(w,i.TEXTURE_WRAP_R,Me[_.wrapR]),i.texParameteri(w,i.TEXTURE_MAG_FILTER,Ne[_.magFilter]),i.texParameteri(w,i.TEXTURE_MIN_FILTER,Ne[_.minFilter]),_.compareFunction&&(i.texParameteri(w,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(w,i.TEXTURE_COMPARE_FUNC,re[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===zt||_.minFilter!==Os&&_.minFilter!==ei||_.type===In&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){let U=e.get("EXT_texture_filter_anisotropic");i.texParameterf(w,U.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function de(w,_){let U=!1;w.__webglInit===void 0&&(w.__webglInit=!0,_.addEventListener("dispose",R));let k=_.source,$=f.get(k);$===void 0&&($={},f.set(k,$));let ue=H(_);if(ue!==w.__cacheKey){$[ue]===void 0&&($[ue]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,U=!0),$[ue].usedTimes++;let pe=$[w.__cacheKey];pe!==void 0&&($[w.__cacheKey].usedTimes--,pe.usedTimes===0&&P(_)),w.__cacheKey=ue,w.__webglTexture=$[ue].texture}return U}function B(w,_,U){return Math.floor(Math.floor(w/U)/_)}function G(w,_,U,k){let ue=w.updateRanges;if(ue.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,U,k,_.data);else{ue.sort((ze,be)=>ze.start-be.start);let pe=0;for(let ze=1;ze<ue.length;ze++){let be=ue[pe],Se=ue[ze],ee=be.start+be.count,Ee=B(Se.start,_.width,4),De=B(be.start,_.width,4);Se.start<=ee+1&&Ee===De&&B(Se.start+Se.count-1,_.width,4)===Ee?be.count=Math.max(be.count,Se.start+Se.count-be.start):(++pe,ue[pe]=Se)}ue.length=pe+1;let J=t.getParameter(i.UNPACK_ROW_LENGTH),ie=t.getParameter(i.UNPACK_SKIP_PIXELS),ve=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let ze=0,be=ue.length;ze<be;ze++){let Se=ue[ze],ee=Math.floor(Se.start/4),Ee=Math.ceil(Se.count/4),De=ee%_.width,C=Math.floor(ee/_.width),he=Ee,Q=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,De),t.pixelStorei(i.UNPACK_SKIP_ROWS,C),t.texSubImage2D(i.TEXTURE_2D,0,De,C,he,Q,U,k,_.data)}w.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,J),t.pixelStorei(i.UNPACK_SKIP_PIXELS,ie),t.pixelStorei(i.UNPACK_SKIP_ROWS,ve)}}function ae(w,_,U){let k=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(k=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(k=i.TEXTURE_3D);let $=de(w,_),ue=_.source;t.bindTexture(k,w.__webglTexture,i.TEXTURE0+U);let pe=n.get(ue);if(ue.version!==pe.__version||$===!0){if(t.activeTexture(i.TEXTURE0+U),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){let Q=ot.getPrimaries(ot.workingColorSpace),ye=_.colorSpace===Xi?null:ot.getPrimaries(_.colorSpace),Te=_.colorSpace===Xi||Q===ye?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Te)}t.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment);let ie=m(_.image,!1,s.maxTextureSize);ie=Ze(_,ie);let ve=r.convert(_.format,_.colorSpace),ze=r.convert(_.type),be=v(_.internalFormat,ve,ze,_.normalized,_.colorSpace,_.isVideoTexture);ge(k,_);let Se,ee=_.mipmaps,Ee=_.isVideoTexture!==!0,De=pe.__version===void 0||$===!0,C=ue.dataReady,he=b(_,ie);if(_.isDepthTexture)be=M(_.format===ds,_.type),De&&(Ee?t.texStorage2D(i.TEXTURE_2D,1,be,ie.width,ie.height):t.texImage2D(i.TEXTURE_2D,0,be,ie.width,ie.height,0,ve,ze,null));else if(_.isDataTexture)if(ee.length>0){Ee&&De&&t.texStorage2D(i.TEXTURE_2D,he,be,ee[0].width,ee[0].height);for(let Q=0,ye=ee.length;Q<ye;Q++)Se=ee[Q],Ee?C&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,Se.width,Se.height,ve,ze,Se.data):t.texImage2D(i.TEXTURE_2D,Q,be,Se.width,Se.height,0,ve,ze,Se.data);_.generateMipmaps=!1}else Ee?(De&&t.texStorage2D(i.TEXTURE_2D,he,be,ie.width,ie.height),C&&G(_,ie,ve,ze)):t.texImage2D(i.TEXTURE_2D,0,be,ie.width,ie.height,0,ve,ze,ie.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){Ee&&De&&t.texStorage3D(i.TEXTURE_2D_ARRAY,he,be,ee[0].width,ee[0].height,ie.depth);for(let Q=0,ye=ee.length;Q<ye;Q++)if(Se=ee[Q],_.format!==Pn)if(ve!==null)if(Ee){if(C)if(_.layerUpdates.size>0){let Te=ch(Se.width,Se.height,_.format,_.type);for(let le of _.layerUpdates){let Pe=Se.data.subarray(le*Te/Se.data.BYTES_PER_ELEMENT,(le+1)*Te/Se.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,le,Se.width,Se.height,1,ve,Pe)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,0,Se.width,Se.height,ie.depth,ve,Se.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Q,be,Se.width,Se.height,ie.depth,0,Se.data,0,0);else qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ee?C&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,Q,0,0,0,Se.width,Se.height,ie.depth,ve,ze,Se.data):t.texImage3D(i.TEXTURE_2D_ARRAY,Q,be,Se.width,Se.height,ie.depth,0,ve,ze,Se.data);_.layerUpdates.size>0&&_.clearLayerUpdates()}else{Ee&&De&&t.texStorage2D(i.TEXTURE_2D,he,be,ee[0].width,ee[0].height);for(let Q=0,ye=ee.length;Q<ye;Q++)Se=ee[Q],_.format!==Pn?ve!==null?Ee?C&&t.compressedTexSubImage2D(i.TEXTURE_2D,Q,0,0,Se.width,Se.height,ve,Se.data):t.compressedTexImage2D(i.TEXTURE_2D,Q,be,Se.width,Se.height,0,Se.data):qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ee?C&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,Se.width,Se.height,ve,ze,Se.data):t.texImage2D(i.TEXTURE_2D,Q,be,Se.width,Se.height,0,ve,ze,Se.data)}else if(_.isDataArrayTexture)if(Ee){if(De&&t.texStorage3D(i.TEXTURE_2D_ARRAY,he,be,ie.width,ie.height,ie.depth),C)if(_.layerUpdates.size>0){let Q=ch(ie.width,ie.height,_.format,_.type);for(let ye of _.layerUpdates){let Te=ie.data.subarray(ye*Q/ie.data.BYTES_PER_ELEMENT,(ye+1)*Q/ie.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ye,ie.width,ie.height,1,ve,ze,Te)}_.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ie.width,ie.height,ie.depth,ve,ze,ie.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,be,ie.width,ie.height,ie.depth,0,ve,ze,ie.data);else if(_.isData3DTexture)Ee?(De&&t.texStorage3D(i.TEXTURE_3D,he,be,ie.width,ie.height,ie.depth),C&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ie.width,ie.height,ie.depth,ve,ze,ie.data)):t.texImage3D(i.TEXTURE_3D,0,be,ie.width,ie.height,ie.depth,0,ve,ze,ie.data);else if(_.isFramebufferTexture){if(De)if(Ee)t.texStorage2D(i.TEXTURE_2D,he,be,ie.width,ie.height);else{let Q=ie.width,ye=ie.height;for(let Te=0;Te<he;Te++)t.texImage2D(i.TEXTURE_2D,Te,be,Q,ye,0,ve,ze,null),Q>>=1,ye>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in i){let Q=i.canvas;if(Q.hasAttribute("layoutsubtree")||Q.setAttribute("layoutsubtree","true"),ie.parentNode!==Q){Q.appendChild(ie),d.add(_),Q.onpaint=ye=>{let Te=ye.changedElements;for(let le of d)Te.includes(le.image)&&(le.needsUpdate=!0)},Q.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,ie);else{let Te=i.RGBA,le=i.RGBA,Pe=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,Te,le,Pe,ie)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(ee.length>0){if(Ee&&De){let Q=Oe(ee[0]);t.texStorage2D(i.TEXTURE_2D,he,be,Q.width,Q.height)}for(let Q=0,ye=ee.length;Q<ye;Q++)Se=ee[Q],Ee?C&&t.texSubImage2D(i.TEXTURE_2D,Q,0,0,ve,ze,Se):t.texImage2D(i.TEXTURE_2D,Q,be,ve,ze,Se);_.generateMipmaps=!1}else if(Ee){if(De){let Q=Oe(ie);t.texStorage2D(i.TEXTURE_2D,he,be,Q.width,Q.height)}C&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ve,ze,ie)}else t.texImage2D(i.TEXTURE_2D,0,be,ve,ze,ie);p(_)&&T(k),pe.__version=ue.version,_.onUpdate&&_.onUpdate(_)}w.__version=_.version}function fe(w,_,U){if(_.image.length!==6)return;let k=de(w,_),$=_.source;t.bindTexture(i.TEXTURE_CUBE_MAP,w.__webglTexture,i.TEXTURE0+U);let ue=n.get($);if($.version!==ue.__version||k===!0){t.activeTexture(i.TEXTURE0+U);let pe=ot.getPrimaries(ot.workingColorSpace),J=_.colorSpace===Xi?null:ot.getPrimaries(_.colorSpace),ie=_.colorSpace===Xi||pe===J?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ie);let ve=_.isCompressedTexture||_.image[0].isCompressedTexture,ze=_.image[0]&&_.image[0].isDataTexture,be=[];for(let le=0;le<6;le++)!ve&&!ze?be[le]=m(_.image[le],!0,s.maxCubemapSize):be[le]=ze?_.image[le].image:_.image[le],be[le]=Ze(_,be[le]);let Se=be[0],ee=r.convert(_.format,_.colorSpace),Ee=r.convert(_.type),De=v(_.internalFormat,ee,Ee,_.normalized,_.colorSpace),C=_.isVideoTexture!==!0,he=ue.__version===void 0||k===!0,Q=$.dataReady,ye=b(_,Se);ge(i.TEXTURE_CUBE_MAP,_);let Te;if(ve){C&&he&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ye,De,Se.width,Se.height);for(let le=0;le<6;le++){Te=be[le].mipmaps;for(let Pe=0;Pe<Te.length;Pe++){let Ue=Te[Pe];_.format!==Pn?ee!==null?C?Q&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Pe,0,0,Ue.width,Ue.height,ee,Ue.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Pe,De,Ue.width,Ue.height,0,Ue.data):qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):C?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Pe,0,0,Ue.width,Ue.height,ee,Ee,Ue.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Pe,De,Ue.width,Ue.height,0,ee,Ee,Ue.data)}}}else{if(Te=_.mipmaps,C&&he){Te.length>0&&ye++;let le=Oe(be[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ye,De,le.width,le.height)}for(let le=0;le<6;le++)if(ze){C?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,be[le].width,be[le].height,ee,Ee,be[le].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,De,be[le].width,be[le].height,0,ee,Ee,be[le].data);for(let Pe=0;Pe<Te.length;Pe++){let We=Te[Pe].image[le].image;C?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Pe+1,0,0,We.width,We.height,ee,Ee,We.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Pe+1,De,We.width,We.height,0,ee,Ee,We.data)}}else{C?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,ee,Ee,be[le]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,De,ee,Ee,be[le]);for(let Pe=0;Pe<Te.length;Pe++){let Ue=Te[Pe];C?Q&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Pe+1,0,0,ee,Ee,Ue.image[le]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Pe+1,De,ee,Ee,Ue.image[le])}}}p(_)&&T(i.TEXTURE_CUBE_MAP),ue.__version=$.version,_.onUpdate&&_.onUpdate(_)}w.__version=_.version}function ce(w,_,U,k,$,ue){let pe=r.convert(U.format,U.colorSpace),J=r.convert(U.type),ie=v(U.internalFormat,pe,J,U.normalized,U.colorSpace),ve=n.get(_),ze=n.get(U);if(ze.__renderTarget=_,!ve.__hasExternalTextures){let be=Math.max(1,_.width>>ue),Se=Math.max(1,_.height>>ue);$===i.TEXTURE_3D||$===i.TEXTURE_2D_ARRAY?t.texImage3D($,ue,ie,be,Se,_.depth,0,pe,J,null):t.texImage2D($,ue,ie,be,Se,0,pe,J,null)}t.bindFramebuffer(i.FRAMEBUFFER,w),He(_)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,k,$,ze.__webglTexture,0,Re(_)):($===i.TEXTURE_2D||$>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,k,$,ze.__webglTexture,ue),t.bindFramebuffer(i.FRAMEBUFFER,null)}function me(w,_,U){if(i.bindRenderbuffer(i.RENDERBUFFER,w),_.depthBuffer){let k=_.depthTexture,$=k&&k.isDepthTexture?k.type:null,ue=M(_.stencilBuffer,$),pe=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;He(_)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Re(_),ue,_.width,_.height):U?i.renderbufferStorageMultisample(i.RENDERBUFFER,Re(_),ue,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,ue,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,pe,i.RENDERBUFFER,w)}else{let k=_.textures;for(let $=0;$<k.length;$++){let ue=k[$],pe=r.convert(ue.format,ue.colorSpace),J=r.convert(ue.type),ie=v(ue.internalFormat,pe,J,ue.normalized,ue.colorSpace);He(_)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Re(_),ie,_.width,_.height):U?i.renderbufferStorageMultisample(i.RENDERBUFFER,Re(_),ie,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,ie,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function xe(w,_,U){let k=_.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,w),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let $=n.get(_.depthTexture);if($.__renderTarget=_,(!$.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),k){if($.__webglInit===void 0&&($.__webglInit=!0,_.depthTexture.addEventListener("dispose",R)),$.__webglTexture===void 0){$.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),ge(i.TEXTURE_CUBE_MAP,_.depthTexture);let ve=r.convert(_.depthTexture.format),ze=r.convert(_.depthTexture.type),be;_.depthTexture.format===ui?be=i.DEPTH_COMPONENT24:_.depthTexture.format===ds&&(be=i.DEPTH24_STENCIL8);for(let Se=0;Se<6;Se++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Se,0,be,_.width,_.height,0,ve,ze,null)}}else te(_.depthTexture,0);let ue=$.__webglTexture,pe=Re(_),J=k?i.TEXTURE_CUBE_MAP_POSITIVE_X+U:i.TEXTURE_2D,ie=_.depthTexture.format===ds?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(_.depthTexture.format===ui)He(_)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ie,J,ue,0,pe):i.framebufferTexture2D(i.FRAMEBUFFER,ie,J,ue,0);else if(_.depthTexture.format===ds)He(_)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ie,J,ue,0,pe):i.framebufferTexture2D(i.FRAMEBUFFER,ie,J,ue,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function we(w){let _=n.get(w),U=w.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==w.depthTexture){let k=w.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),k){let $=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,k.removeEventListener("dispose",$)};k.addEventListener("dispose",$),_.__depthDisposeCallback=$}_.__boundDepthTexture=k}if(w.depthTexture&&!_.__autoAllocateDepthBuffer)if(U)for(let k=0;k<6;k++)xe(_.__webglFramebuffer[k],w,k);else{let k=w.texture.mipmaps;k&&k.length>0?xe(_.__webglFramebuffer[0],w,0):xe(_.__webglFramebuffer,w,0)}else if(U){_.__webglDepthbuffer=[];for(let k=0;k<6;k++)if(t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[k]),_.__webglDepthbuffer[k]===void 0)_.__webglDepthbuffer[k]=i.createRenderbuffer(),me(_.__webglDepthbuffer[k],w,!1);else{let $=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ue=_.__webglDepthbuffer[k];i.bindRenderbuffer(i.RENDERBUFFER,ue),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,ue)}}else{let k=w.texture.mipmaps;if(k&&k.length>0?t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),me(_.__webglDepthbuffer,w,!1);else{let $=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ue=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ue),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,ue)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function oe(w,_,U){let k=n.get(w);_!==void 0&&ce(k.__webglFramebuffer,w,w.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),U!==void 0&&we(w)}function Z(w){let _=w.texture,U=n.get(w),k=n.get(_);w.addEventListener("dispose",x);let $=w.textures,ue=w.isWebGLCubeRenderTarget===!0,pe=$.length>1;if(pe||(k.__webglTexture===void 0&&(k.__webglTexture=i.createTexture()),k.__version=_.version,o.memory.textures++),ue){U.__webglFramebuffer=[];for(let J=0;J<6;J++)if(_.mipmaps&&_.mipmaps.length>0){U.__webglFramebuffer[J]=[];for(let ie=0;ie<_.mipmaps.length;ie++)U.__webglFramebuffer[J][ie]=i.createFramebuffer()}else U.__webglFramebuffer[J]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){U.__webglFramebuffer=[];for(let J=0;J<_.mipmaps.length;J++)U.__webglFramebuffer[J]=i.createFramebuffer()}else U.__webglFramebuffer=i.createFramebuffer();if(pe)for(let J=0,ie=$.length;J<ie;J++){let ve=n.get($[J]);ve.__webglTexture===void 0&&(ve.__webglTexture=i.createTexture(),o.memory.textures++)}if(w.samples>0&&He(w)===!1){U.__webglMultisampledFramebuffer=i.createFramebuffer(),U.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,U.__webglMultisampledFramebuffer);for(let J=0;J<$.length;J++){let ie=$[J];U.__webglColorRenderbuffer[J]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,U.__webglColorRenderbuffer[J]);let ve=r.convert(ie.format,ie.colorSpace),ze=r.convert(ie.type),be=v(ie.internalFormat,ve,ze,ie.normalized,ie.colorSpace,w.isXRRenderTarget===!0),Se=Re(w);i.renderbufferStorageMultisample(i.RENDERBUFFER,Se,be,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+J,i.RENDERBUFFER,U.__webglColorRenderbuffer[J])}i.bindRenderbuffer(i.RENDERBUFFER,null),w.depthBuffer&&(U.__webglDepthRenderbuffer=i.createRenderbuffer(),me(U.__webglDepthRenderbuffer,w,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ue){t.bindTexture(i.TEXTURE_CUBE_MAP,k.__webglTexture),ge(i.TEXTURE_CUBE_MAP,_);for(let J=0;J<6;J++)if(_.mipmaps&&_.mipmaps.length>0)for(let ie=0;ie<_.mipmaps.length;ie++)ce(U.__webglFramebuffer[J][ie],w,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+J,ie);else ce(U.__webglFramebuffer[J],w,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0);p(_)&&T(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(pe){for(let J=0,ie=$.length;J<ie;J++){let ve=$[J],ze=n.get(ve),be=i.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(be=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(be,ze.__webglTexture),ge(be,ve),ce(U.__webglFramebuffer,w,ve,i.COLOR_ATTACHMENT0+J,be,0),p(ve)&&T(be)}t.unbindTexture()}else{let J=i.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(J=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(J,k.__webglTexture),ge(J,_),_.mipmaps&&_.mipmaps.length>0)for(let ie=0;ie<_.mipmaps.length;ie++)ce(U.__webglFramebuffer[ie],w,_,i.COLOR_ATTACHMENT0,J,ie);else ce(U.__webglFramebuffer,w,_,i.COLOR_ATTACHMENT0,J,0);p(_)&&T(J),t.unbindTexture()}w.depthBuffer&&we(w)}function se(w){let _=w.textures;for(let U=0,k=_.length;U<k;U++){let $=_[U];if(p($)){let ue=A(w),pe=n.get($).__webglTexture;t.bindTexture(ue,pe),T(ue),t.unbindTexture()}}}let _e=[],Ae=[];function Ye(w){if(w.samples>0){if(He(w)===!1){let _=w.textures,U=w.width,k=w.height,$=i.COLOR_BUFFER_BIT,ue=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,pe=n.get(w),J=_.length>1;if(J)for(let ve=0;ve<_.length;ve++)t.bindFramebuffer(i.FRAMEBUFFER,pe.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ve,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,pe.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ve,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,pe.__webglMultisampledFramebuffer);let ie=w.texture.mipmaps;ie&&ie.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,pe.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,pe.__webglFramebuffer);for(let ve=0;ve<_.length;ve++){if(w.resolveDepthBuffer&&(w.depthBuffer&&($|=i.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&($|=i.STENCIL_BUFFER_BIT)),J){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,pe.__webglColorRenderbuffer[ve]);let ze=n.get(_[ve]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ze,0)}i.blitFramebuffer(0,0,U,k,0,0,U,k,$,i.NEAREST),l===!0&&(_e.length=0,Ae.length=0,_e.push(i.COLOR_ATTACHMENT0+ve),w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&(_e.push(ue),Ae.push(ue),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Ae)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,_e))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),J)for(let ve=0;ve<_.length;ve++){t.bindFramebuffer(i.FRAMEBUFFER,pe.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ve,i.RENDERBUFFER,pe.__webglColorRenderbuffer[ve]);let ze=n.get(_[ve]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,pe.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ve,i.TEXTURE_2D,ze,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,pe.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&l){let _=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function Re(w){return Math.min(s.maxSamples,w.samples)}function He(w){let _=n.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function I(w){let _=o.render.frame;u.get(w)!==_&&(u.set(w,_),w.update())}function Ze(w,_){let U=w.colorSpace,k=w.format,$=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||U!==un&&U!==Xi&&(ot.getTransfer(U)===_t?(k!==Pn||$!==vn)&&qe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ke("WebGLTextures: Unsupported texture color space:",U)),_}function Oe(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=K,this.resetTextureUnits=W,this.getTextureUnits=L,this.setTextureUnits=z,this.setTexture2D=te,this.setTexture2DArray=N,this.setTexture3D=Y,this.setTextureCube=ne,this.rebindTextures=oe,this.setupRenderTarget=Z,this.updateRenderTargetMipmap=se,this.updateMultisampleRenderTarget=Ye,this.setupDepthRenderbuffer=we,this.setupFrameBufferTexture=ce,this.useMultisampledRTT=He,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function SS(i,e){function t(n,s=Xi){let r,o=ot.getTransfer(s);if(n===vn)return i.UNSIGNED_BYTE;if(n===Mc)return i.UNSIGNED_SHORT_4_4_4_4;if(n===bc)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Ju)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===ju)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Ku)return i.BYTE;if(n===$u)return i.SHORT;if(n===Nr)return i.UNSIGNED_SHORT;if(n===Sc)return i.INT;if(n===ti)return i.UNSIGNED_INT;if(n===In)return i.FLOAT;if(n===ni)return i.HALF_FLOAT;if(n===Qu)return i.ALPHA;if(n===eh)return i.RGB;if(n===Pn)return i.RGBA;if(n===ui)return i.DEPTH_COMPONENT;if(n===ds)return i.DEPTH_STENCIL;if(n===Tc)return i.RED;if(n===Ec)return i.RED_INTEGER;if(n===fs)return i.RG;if(n===wc)return i.RG_INTEGER;if(n===Ac)return i.RGBA_INTEGER;if(n===Oo||n===Bo||n===zo||n===ko)if(o===_t)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Oo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Bo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===zo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ko)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Oo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Bo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===zo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ko)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Rc||n===Cc||n===Ic||n===Pc)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Rc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Cc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ic)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Pc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Lc||n===Dc||n===Nc||n===Uc||n===Fc||n===Vo||n===Oc)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Lc||n===Dc)return o===_t?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Nc)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Uc)return r.COMPRESSED_R11_EAC;if(n===Fc)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Vo)return r.COMPRESSED_RG11_EAC;if(n===Oc)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Bc||n===zc||n===kc||n===Vc||n===Hc||n===Gc||n===Wc||n===Xc||n===qc||n===Yc||n===Zc||n===Kc||n===$c||n===Jc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Bc)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===zc)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===kc)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Vc)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Hc)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Gc)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Wc)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Xc)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===qc)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Yc)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Zc)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Kc)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===$c)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Jc)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===jc||n===Qc||n===el)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===jc)return o===_t?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Qc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===el)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===tl||n===nl||n===Ho||n===il)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===tl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===nl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ho)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===il)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ur?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}function ES(i,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,rh(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,T,A,v){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(m,p):p.isMeshLambertMaterial?(r(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(m,p),d(m,p)):p.isMeshPhongMaterial?(r(m,p),u(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(m,p),h(m,p),p.isMeshPhysicalMaterial&&f(m,p,v)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),y(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,T,A):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===dn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===dn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let T=e.get(p),A=T.envMap,v=T.envMapRotation;A&&(m.envMap.value=A,m.envMapRotation.value.setFromMatrix4(TS.makeRotationFromEuler(v)).transpose(),A.isCubeTexture&&A.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Gp),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,T,A){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*T,m.scale.value=A*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function h(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,T){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===dn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.retroreflectivity>0&&(m.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=T.texture,m.transmissionSamplerSize.value.set(T.width,T.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function y(m,p){let T=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(T.matrixWorld),m.nearDistance.value=T.shadow.camera.near,m.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function wS(i,e,t,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,M){let b=M.program;n.uniformBlockBinding(v,b)}function c(v,M){let b=s[v.id];b===void 0&&(m(v),b=u(v),s[v.id]=b,v.addEventListener("dispose",T));let R=M.program;n.updateUBOMapping(v,R);let x=e.render.frame;r[v.id]!==x&&(h(v),r[v.id]=x)}function u(v){let M=d();v.__bindingPointIndex=M;let b=i.createBuffer(),R=v.__size,x=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,b),i.bufferData(i.UNIFORM_BUFFER,R,x),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,b),b}function d(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return Ke("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(v){let M=s[v.id],b=v.uniforms,R=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let x=0,E=b.length;x<E;x++){let P=b[x];if(Array.isArray(P))for(let D=0,V=P.length;D<V;D++)f(P[D],x,D,R);else f(P,x,0,R)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(v,M,b,R){if(y(v,M,b,R)===!0){let x=v.__offset,E=v.value;if(Array.isArray(E)){let P=0;for(let D=0;D<E.length;D++){let V=E[D],W=p(V);g(V,v.__data,P),typeof V!="number"&&typeof V!="boolean"&&!V.isMatrix3&&!ArrayBuffer.isView(V)&&(P+=W.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(E,v.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,x,v.__data)}}function g(v,M,b){typeof v=="number"||typeof v=="boolean"?M[0]=v:v.isMatrix3?(M[0]=v.elements[0],M[1]=v.elements[1],M[2]=v.elements[2],M[3]=0,M[4]=v.elements[3],M[5]=v.elements[4],M[6]=v.elements[5],M[7]=0,M[8]=v.elements[6],M[9]=v.elements[7],M[10]=v.elements[8],M[11]=0):ArrayBuffer.isView(v)?M.set(new v.constructor(v.buffer,v.byteOffset,M.length)):v.toArray(M,b)}function y(v,M,b,R){let x=v.value,E=M+"_"+b;if(R[E]===void 0)return typeof x=="number"||typeof x=="boolean"?R[E]=x:ArrayBuffer.isView(x)?R[E]=x.slice():R[E]=x.clone(),!0;{let P=R[E];if(typeof x=="number"||typeof x=="boolean"){if(P!==x)return R[E]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(P.equals(x)===!1)return P.copy(x),!0}}return!1}function m(v){let M=v.uniforms,b=0,R=16;for(let E=0,P=M.length;E<P;E++){let D=Array.isArray(M[E])?M[E]:[M[E]];for(let V=0,W=D.length;V<W;V++){let L=D[V],z=Array.isArray(L.value)?L.value:[L.value];for(let K=0,H=z.length;K<H;K++){let te=z[K],N=p(te),Y=b%R,ne=Y%N.boundary,Me=Y+ne;b+=ne,Me!==0&&R-Me<N.storage&&(b+=R-Me),L.__data=new Float32Array(N.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=b,b+=N.storage}}}let x=b%R;return x>0&&(b+=R-x),v.__size=b,v.__cache={},this}function p(v){let M={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(M.boundary=4,M.storage=4):v.isVector2?(M.boundary=8,M.storage=8):v.isVector3||v.isColor?(M.boundary=16,M.storage=12):v.isVector4?(M.boundary=16,M.storage=16):v.isMatrix3?(M.boundary=48,M.storage=48):v.isMatrix4?(M.boundary=64,M.storage=64):v.isTexture?qe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(M.boundary=16,M.storage=v.byteLength):qe("WebGLRenderer: Unsupported uniform value type.",v),M}function T(v){let M=v.target;M.removeEventListener("dispose",T);let b=o.indexOf(M.__bindingPointIndex);o.splice(b,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function A(){for(let v in s)i.deleteBuffer(s[v]);o=[],s={},r={}}return{bind:l,update:c,dispose:A}}function RS(){return _i===null&&(_i=new Er(AS,16,16,fs,ni),_i.name="DFG_LUT",_i.minFilter=kt,_i.magFilter=kt,_i.wrapS=Bn,_i.wrapT=Bn,_i.generateMipmaps=!1,_i.needsUpdate=!0),_i}var V0,H0,G0,W0,X0,q0,Y0,Z0,K0,$0,J0,j0,Q0,e_,t_,n_,i_,s_,r_,o_,a_,c_,l_,u_,h_,d_,f_,p_,m_,g_,__,x_,y_,v_,S_,M_,b_,T_,E_,w_,A_,R_,C_,I_,P_,L_,D_,N_,U_,F_,O_,B_,z_,k_,V_,H_,G_,W_,X_,q_,Y_,Z_,K_,$_,J_,j_,Q_,ex,tx,nx,ix,sx,rx,ox,ax,cx,lx,ux,hx,dx,fx,px,mx,gx,_x,xx,yx,vx,Sx,Mx,bx,Tx,Ex,wx,Ax,Rx,Cx,Ix,Px,Lx,Dx,Nx,Ux,Fx,Ox,Bx,zx,kx,Vx,Hx,Gx,Wx,Xx,qx,Yx,Zx,Kx,$x,Jx,jx,Qx,ey,ty,ny,iy,sy,ry,oy,ay,cy,ly,uy,hy,dy,fy,py,my,gy,_y,xy,yy,vy,rt,Ce,xi,al,Sy,Bp,Br,Ay,Ry,Cy,Wo,gp,uh,hh,dh,fh,Iy,zs,ll,ul,Vy,zp,gh,kp,Vp,Hp,vp,Sp,Mp,bp,Tp,_h,xh,yh,ph,zr,Iv,Pv,Ap,Uv,cl,Vv,Hv,Wv,qv,Zv,$v,jv,nS,Sh,Mh,uS,pS,mS,gS,_S,Fp,Xo,mh,MS,bS,bh,Th,TS,Gp,AS,_i,ps,yi=Bt(()=>{lh();lh();V0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,H0=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,G0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,W0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,X0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,q0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Y0=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Z0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,K0=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,$0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,J0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,j0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Q0=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,e_=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,t_=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,n_=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,i_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,s_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,r_=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,o_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,a_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,c_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,l_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,u_=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,h_=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,d_=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,f_=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,p_=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,m_=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,g_=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,__="gl_FragColor = linearToOutputTexel( gl_FragColor );",x_=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,y_=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,v_=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,S_=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,M_=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,b_=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,T_=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,E_=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,w_=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,A_=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,R_=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,C_=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,I_=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,P_=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,L_=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,D_=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,N_=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,U_=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,F_=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,O_=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,B_=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,z_=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,k_=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,V_=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,H_=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,G_=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,W_=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,X_=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,q_=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Y_=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Z_=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,K_=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,$_=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,J_=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,j_=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Q_=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ex=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,tx=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,nx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ix=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,sx=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,rx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,ox=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,ax=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,cx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,lx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,ux=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,hx=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,dx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,fx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,px=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,mx=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,gx=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,_x=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,xx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,yx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,vx=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Sx=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Mx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,bx=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Tx=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Ex=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,wx=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Ax=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Rx=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Cx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ix=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Px=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Lx=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Dx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Nx=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ux=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Fx=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Ox=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Bx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,zx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,kx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Vx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Hx=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Gx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Wx=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Xx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,qx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Yx=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Zx=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Kx=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,$x=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Jx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,jx=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qx=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ey=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ty=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,ny=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,iy=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,sy=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ry=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,oy=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ay=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,cy=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,ly=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,uy=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hy=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,dy=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fy=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,py=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,my=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,gy=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,_y=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,xy=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,yy=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,vy=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,rt={alphahash_fragment:V0,alphahash_pars_fragment:H0,alphamap_fragment:G0,alphamap_pars_fragment:W0,alphatest_fragment:X0,alphatest_pars_fragment:q0,aomap_fragment:Y0,aomap_pars_fragment:Z0,batching_pars_vertex:K0,batching_vertex:$0,begin_vertex:J0,beginnormal_vertex:j0,bsdfs:Q0,iridescence_fragment:e_,bumpmap_pars_fragment:t_,clipping_planes_fragment:n_,clipping_planes_pars_fragment:i_,clipping_planes_pars_vertex:s_,clipping_planes_vertex:r_,color_fragment:o_,color_pars_fragment:a_,color_pars_vertex:c_,color_vertex:l_,common:u_,cube_uv_reflection_fragment:h_,defaultnormal_vertex:d_,displacementmap_pars_vertex:f_,displacementmap_vertex:p_,emissivemap_fragment:m_,emissivemap_pars_fragment:g_,colorspace_fragment:__,colorspace_pars_fragment:x_,envmap_fragment:y_,envmap_common_pars_fragment:v_,envmap_pars_fragment:S_,envmap_pars_vertex:M_,envmap_physical_pars_fragment:D_,envmap_vertex:b_,fog_vertex:T_,fog_pars_vertex:E_,fog_fragment:w_,fog_pars_fragment:A_,gradientmap_pars_fragment:R_,lightmap_pars_fragment:C_,lights_lambert_fragment:I_,lights_lambert_pars_fragment:P_,lights_pars_begin:L_,lights_toon_fragment:N_,lights_toon_pars_fragment:U_,lights_phong_fragment:F_,lights_phong_pars_fragment:O_,lights_physical_fragment:B_,lights_physical_pars_fragment:z_,lights_fragment_begin:k_,lights_fragment_maps:V_,lights_fragment_end:H_,lightprobes_pars_fragment:G_,logdepthbuf_fragment:W_,logdepthbuf_pars_fragment:X_,logdepthbuf_pars_vertex:q_,logdepthbuf_vertex:Y_,map_fragment:Z_,map_pars_fragment:K_,map_particle_fragment:$_,map_particle_pars_fragment:J_,metalnessmap_fragment:j_,metalnessmap_pars_fragment:Q_,morphinstance_vertex:ex,morphcolor_vertex:tx,morphnormal_vertex:nx,morphtarget_pars_vertex:ix,morphtarget_vertex:sx,normal_fragment_begin:rx,normal_fragment_maps:ox,normal_pars_fragment:ax,normal_pars_vertex:cx,normal_vertex:lx,normalmap_pars_fragment:ux,clearcoat_normal_fragment_begin:hx,clearcoat_normal_fragment_maps:dx,clearcoat_pars_fragment:fx,iridescence_pars_fragment:px,opaque_fragment:mx,packing:gx,premultiplied_alpha_fragment:_x,project_vertex:xx,dithering_fragment:yx,dithering_pars_fragment:vx,roughnessmap_fragment:Sx,roughnessmap_pars_fragment:Mx,shadowmap_pars_fragment:bx,shadowmap_pars_vertex:Tx,shadowmap_vertex:Ex,shadowmask_pars_fragment:wx,skinbase_vertex:Ax,skinning_pars_vertex:Rx,skinning_vertex:Cx,skinnormal_vertex:Ix,specularmap_fragment:Px,specularmap_pars_fragment:Lx,tonemapping_fragment:Dx,tonemapping_pars_fragment:Nx,transmission_fragment:Ux,transmission_pars_fragment:Fx,uv_pars_fragment:Ox,uv_pars_vertex:Bx,uv_vertex:zx,worldpos_vertex:kx,background_vert:Vx,background_frag:Hx,backgroundCube_vert:Gx,backgroundCube_frag:Wx,cube_vert:Xx,cube_frag:qx,depth_vert:Yx,depth_frag:Zx,distance_vert:Kx,distance_frag:$x,equirect_vert:Jx,equirect_frag:jx,linedashed_vert:Qx,linedashed_frag:ey,meshbasic_vert:ty,meshbasic_frag:ny,meshlambert_vert:iy,meshlambert_frag:sy,meshmatcap_vert:ry,meshmatcap_frag:oy,meshnormal_vert:ay,meshnormal_frag:cy,meshphong_vert:ly,meshphong_frag:uy,meshphysical_vert:hy,meshphysical_frag:dy,meshtoon_vert:fy,meshtoon_frag:py,points_vert:my,points_frag:gy,shadow_vert:_y,shadow_frag:xy,sprite_vert:yy,sprite_frag:vy},Ce={common:{diffuse:{value:new Ge(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new je}},envmap:{envMap:{value:null},envMapRotation:{value:new je},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new je}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new je}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new je},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new je},normalScale:{value:new at(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new je},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new je}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new je}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new je}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ge(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new O},probesMax:{value:new O},probesResolution:{value:new O}},points:{diffuse:{value:new Ge(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0},uvTransform:{value:new je}},sprite:{diffuse:{value:new Ge(16777215)},opacity:{value:1},center:{value:new at(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}}},xi={basic:{uniforms:on([Ce.common,Ce.specularmap,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.fog]),vertexShader:rt.meshbasic_vert,fragmentShader:rt.meshbasic_frag},lambert:{uniforms:on([Ce.common,Ce.specularmap,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.fog,Ce.lights,{emissive:{value:new Ge(0)},envMapIntensity:{value:1}}]),vertexShader:rt.meshlambert_vert,fragmentShader:rt.meshlambert_frag},phong:{uniforms:on([Ce.common,Ce.specularmap,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.fog,Ce.lights,{emissive:{value:new Ge(0)},specular:{value:new Ge(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:rt.meshphong_vert,fragmentShader:rt.meshphong_frag},standard:{uniforms:on([Ce.common,Ce.envmap,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.roughnessmap,Ce.metalnessmap,Ce.fog,Ce.lights,{emissive:{value:new Ge(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:rt.meshphysical_vert,fragmentShader:rt.meshphysical_frag},toon:{uniforms:on([Ce.common,Ce.aomap,Ce.lightmap,Ce.emissivemap,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.gradientmap,Ce.fog,Ce.lights,{emissive:{value:new Ge(0)}}]),vertexShader:rt.meshtoon_vert,fragmentShader:rt.meshtoon_frag},matcap:{uniforms:on([Ce.common,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,Ce.fog,{matcap:{value:null}}]),vertexShader:rt.meshmatcap_vert,fragmentShader:rt.meshmatcap_frag},points:{uniforms:on([Ce.points,Ce.fog]),vertexShader:rt.points_vert,fragmentShader:rt.points_frag},dashed:{uniforms:on([Ce.common,Ce.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:rt.linedashed_vert,fragmentShader:rt.linedashed_frag},depth:{uniforms:on([Ce.common,Ce.displacementmap]),vertexShader:rt.depth_vert,fragmentShader:rt.depth_frag},normal:{uniforms:on([Ce.common,Ce.bumpmap,Ce.normalmap,Ce.displacementmap,{opacity:{value:1}}]),vertexShader:rt.meshnormal_vert,fragmentShader:rt.meshnormal_frag},sprite:{uniforms:on([Ce.sprite,Ce.fog]),vertexShader:rt.sprite_vert,fragmentShader:rt.sprite_frag},background:{uniforms:{uvTransform:{value:new je},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:rt.background_vert,fragmentShader:rt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new je}},vertexShader:rt.backgroundCube_vert,fragmentShader:rt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:rt.cube_vert,fragmentShader:rt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:rt.equirect_vert,fragmentShader:rt.equirect_frag},distance:{uniforms:on([Ce.common,Ce.displacementmap,{referencePosition:{value:new O},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:rt.distance_vert,fragmentShader:rt.distance_frag},shadow:{uniforms:on([Ce.lights,Ce.fog,{color:{value:new Ge(0)},opacity:{value:1}}]),vertexShader:rt.shadow_vert,fragmentShader:rt.shadow_frag}};xi.physical={uniforms:on([xi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new je},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new je},clearcoatNormalScale:{value:new at(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new je},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new je},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new je},sheen:{value:0},sheenColor:{value:new Ge(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new je},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new je},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new je},transmissionSamplerSize:{value:new at},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new je},attenuationDistance:{value:0},attenuationColor:{value:new Ge(0)},specularColor:{value:new Ge(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new je},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new je},anisotropyVector:{value:new at},anisotropyMap:{value:null},anisotropyMapTransform:{value:new je}}]),vertexShader:rt.meshphysical_vert,fragmentShader:rt.meshphysical_frag};al={r:0,b:0,g:0},Sy=new Qe,Bp=new je;Bp.set(-1,0,0,0,1,0,0,0,1);Br=4,Ay=6,Ry=20,Cy=256,Wo=new pi,gp=new Ge,uh=null,hh=0,dh=0,fh=!1,Iy=new O,zs=new O,ll=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:o=256,position:a=Iy}=r;uh=this._renderer.getRenderTarget(),hh=this._renderer.getActiveCubeFace(),dh=this._renderer.getActiveMipmapLevel(),fh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=yp(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=xp(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(uh,hh,dh),this._renderer.xr.enabled=fh,e.scissorTest=!1,Or(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===hs||e.mapping===Fs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),uh=this._renderer.getRenderTarget(),hh=this._renderer.getActiveCubeFace(),dh=this._renderer.getActiveMipmapLevel(),fh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:kt,minFilter:kt,generateMipmaps:!1,type:ni,format:Pn,colorSpace:un,depthBuffer:!1},s=_p(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=_p(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Py(r)),this._blurMaterial=Dy(r,e,t),this._ggxMaterial=Ly(r,e,t)}return s}_compileMaterial(e){let t=new It(new Pt,e);this._renderer.compile(t,Wo)}_sceneToCubeUV(e,t,n,s,r){let l=new Dt(90,1,t,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,f=d.toneMapping;d.getClearColor(gp),d.toneMapping=Qn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new It(new Rr,new Jn({name:"PMREM.Background",side:dn,depthWrite:!1,depthTest:!1})));let y=this._backgroundBox,m=y.material,p=!1,T=e.background;T?T.isColor&&(m.color.copy(T),e.background=null,p=!0):(m.color.copy(gp),p=!0);for(let A=0;A<6;A++){let v=A%3;v===0?(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[A],r.y,r.z)):v===1?(l.up.set(0,0,c[A]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[A],r.z)):(l.up.set(0,c[A],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[A]));let M=this._cubeSize;Or(s,v*M,A>2?M:0,M,M),d.setRenderTarget(s),p&&d.render(y,l),d.render(e,l)}d.toneMapping=f,d.autoClear=h,e.background=T}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===hs||e.mapping===Fs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=yp()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=xp());let r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;let a=r.uniforms;a.envMap.value=e;let l=this._cubeSize;Or(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,Wo)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){let s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[n];a.material=o;let l=o.uniforms,c=n/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),d=Math.sqrt(c*c-u*u),h=c*1.25,f=d*h,{_lodMax:g}=this,y=this._sizeLods[n],m=3*y*(n>g-Br?n-g+Br:0),p=4*(this._cubeSize-y);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=g-t,Or(r,m,p,3*y,2*y),s.setRenderTarget(r),s.render(a,Wo),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-n,Or(e,m,p,3*y,2*y),s.setRenderTarget(e),s.render(a,Wo)}_blur(e,t,n,s){let r=this._pingPongRenderTarget,o=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,n,o),this._blurPass(r,e,n,n,o)}_blurPass(e,t,n,s,r){let o=this._renderer,a=this._blurMaterial,l=this._lodMeshes[s];l.material=a;let c=a.uniforms;c.envMap.value=e.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;let u=this._sizeLods[s],d=3*u*(s>this._lodMax-Br?s-this._lodMax+Br:0),h=4*(this._cubeSize-u);Or(t,d,h,3*u,2*u),o.setRenderTarget(t),o.render(l,Wo)}};ul=class extends gn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Eo(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Rr(5,5,5),r=new Rn({name:"CubemapFromEquirect",uniforms:Bs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:dn,blending:gi});r.uniforms.tEquirect.value=t;let o=new It(s,r),a=t.minFilter;return t.minFilter===ei&&(t.minFilter=kt),new gc(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}};Vy={[Hu]:"LINEAR_TONE_MAPPING",[Gu]:"REINHARD_TONE_MAPPING",[Wu]:"CINEON_TONE_MAPPING",[Uo]:"ACES_FILMIC_TONE_MAPPING",[qu]:"AGX_TONE_MAPPING",[Yu]:"NEUTRAL_TONE_MAPPING",[Xu]:"CUSTOM_TONE_MAPPING"};zp=new jt,gh=new ls(1,1),kp=new go,Vp=new nc,Hp=new Eo,vp=[],Sp=[],Mp=new Float32Array(16),bp=new Float32Array(9),Tp=new Float32Array(4);_h=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=cv(t.type)}},xh=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Rv(t.type)}},yh=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},ph=/(\w+)(\])?(\[|\.)?/g;zr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){let a=e.getActiveUniform(t,o),l=e.getUniformLocation(t,a.name);Cv(a,l,this)}let s=[],r=[];for(let o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};Iv=37297,Pv=0;Ap=new je;Uv={[Hu]:"Linear",[Gu]:"Reinhard",[Wu]:"Cineon",[Uo]:"ACESFilmic",[qu]:"AgX",[Yu]:"Neutral",[Xu]:"Custom"};cl=new O;Vv=/^[ \t]*#include +<([\w\d./]+)>/gm;Hv=new Map;Wv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;qv={[No]:"SHADOWMAP_TYPE_PCF",[Pr]:"SHADOWMAP_TYPE_VSM"};Zv={[hs]:"ENVMAP_TYPE_CUBE",[Fs]:"ENVMAP_TYPE_CUBE",[Fo]:"ENVMAP_TYPE_CUBE_UV"};$v={[Fs]:"ENVMAP_MODE_REFRACTION"};jv={[Vu]:"ENVMAP_BLENDING_MULTIPLY",[Kf]:"ENVMAP_BLENDING_MIX",[$f]:"ENVMAP_BLENDING_ADD"};nS=0,Sh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Mh(e),t.set(e,n)),n}},Mh=class{constructor(e){this.id=nS++,this.code=e,this.usedTimes=0}};uS=0;pS=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,mS=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,gS=[new O(1,0,0),new O(-1,0,0),new O(0,1,0),new O(0,-1,0),new O(0,0,1),new O(0,0,-1)],_S=[new O(0,-1,0),new O(0,-1,0),new O(0,0,1),new O(0,0,-1),new O(0,-1,0),new O(0,-1,0)],Fp=new Qe,Xo=new O,mh=new O;MS=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,bS=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,bh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new wo(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Rn({vertexShader:MS,fragmentShader:bS,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new It(new Ao(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Th=class extends hi{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,d=null,h=null,f=null,g=null,y=typeof XRWebGLBinding<"u",m=new bh,p={},T=t.getContextAttributes(),A=null,v=null,M=[],b=[],R=new at,x=null,E=null,P=new Dt;P.viewport=new Mt;let D=new Dt;D.viewport=new Mt;let V=[P,D],W=new _c,L=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(B){let G=M[B];return G===void 0&&(G=new Sr,M[B]=G),G.getTargetRaySpace()},this.getControllerGrip=function(B){let G=M[B];return G===void 0&&(G=new Sr,M[B]=G),G.getGripSpace()},this.getHand=function(B){let G=M[B];return G===void 0&&(G=new Sr,M[B]=G),G.getHandSpace()};function K(B){let G=b.indexOf(B.inputSource);if(G===-1)return;let ae=M[G];ae!==void 0&&(ae.update(B.inputSource,B.frame,c||o),ae.dispatchEvent({type:B.type,data:B.inputSource}))}function H(){s.removeEventListener("select",K),s.removeEventListener("selectstart",K),s.removeEventListener("selectend",K),s.removeEventListener("squeeze",K),s.removeEventListener("squeezestart",K),s.removeEventListener("squeezeend",K),s.removeEventListener("end",H),s.removeEventListener("inputsourceschange",te);for(let B=0;B<M.length;B++){let G=b[B];G!==null&&(b[B]=null,M[B].disconnect(G))}L=null,z=null,m.reset();for(let B in p)delete p[B];if(e.setRenderTarget(A),f=null,h=null,d=null,s=null,v=null,de.stop(),n.isPresenting=!1,e.setPixelRatio(x),e.setSize(R.width,R.height,!1),E!==null){let B=E.camera;B.fov=E.fov,B.zoom=E.zoom,B.updateProjectionMatrix(),E=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(B){r=B,n.isPresenting===!0&&qe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(B){a=B,n.isPresenting===!0&&qe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(B){c=B},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return d===null&&y&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(B){if(s=B,s!==null){if(A=e.getRenderTarget(),s.addEventListener("select",K),s.addEventListener("selectstart",K),s.addEventListener("selectend",K),s.addEventListener("squeeze",K),s.addEventListener("squeezestart",K),s.addEventListener("squeezeend",K),s.addEventListener("end",H),s.addEventListener("inputsourceschange",te),T.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(R),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let ae=null,fe=null,ce=null;T.depth&&(ce=T.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ae=T.stencil?ds:ui,fe=T.stencil?Ur:ti);let me={colorFormat:t.RGBA8,depthFormat:ce,scaleFactor:r};d=this.getBinding(),h=d.createProjectionLayer(me),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),v=new gn(h.textureWidth,h.textureHeight,{format:Pn,type:vn,depthTexture:new ls(h.textureWidth,h.textureHeight,fe,void 0,void 0,void 0,void 0,void 0,void 0,ae),stencilBuffer:T.stencil,colorSpace:e.outputColorSpace,samples:T.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{let ae={antialias:T.antialias,alpha:!0,depth:T.depth,stencil:T.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,ae),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new gn(f.framebufferWidth,f.framebufferHeight,{format:Pn,type:vn,colorSpace:e.outputColorSpace,stencilBuffer:T.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),de.setContext(s),de.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function te(B){for(let G=0;G<B.removed.length;G++){let ae=B.removed[G],fe=b.indexOf(ae);fe>=0&&(b[fe]=null,M[fe].disconnect(ae))}for(let G=0;G<B.added.length;G++){let ae=B.added[G],fe=b.indexOf(ae);if(fe===-1){for(let me=0;me<M.length;me++)if(me>=b.length){b.push(ae),fe=me;break}else if(b[me]===null){b[me]=ae,fe=me;break}if(fe===-1)break}let ce=M[fe];ce&&ce.connect(ae)}}let N=new O,Y=new O;function ne(B,G,ae){N.setFromMatrixPosition(G.matrixWorld),Y.setFromMatrixPosition(ae.matrixWorld);let fe=N.distanceTo(Y),ce=G.projectionMatrix.elements,me=ae.projectionMatrix.elements,xe=ce[14]/(ce[10]-1),we=ce[14]/(ce[10]+1),oe=(ce[9]+1)/ce[5],Z=(ce[9]-1)/ce[5],se=(ce[8]-1)/ce[0],_e=(me[8]+1)/me[0],Ae=xe*se,Ye=xe*_e,Re=fe/(-se+_e),He=Re*-se;if(G.matrixWorld.decompose(B.position,B.quaternion,B.scale),B.translateX(He),B.translateZ(Re),B.matrixWorld.compose(B.position,B.quaternion,B.scale),B.matrixWorldInverse.copy(B.matrixWorld).invert(),ce[10]===-1)B.projectionMatrix.copy(G.projectionMatrix),B.projectionMatrixInverse.copy(G.projectionMatrixInverse);else{let I=xe+Re,Ze=we+Re,Oe=Ae-He,w=Ye+(fe-He),_=oe*we/Ze*I,U=Z*we/Ze*I;B.projectionMatrix.makePerspective(Oe,w,_,U,I,Ze),B.projectionMatrixInverse.copy(B.projectionMatrix).invert()}}function Me(B,G){G===null?B.matrixWorld.copy(B.matrix):B.matrixWorld.multiplyMatrices(G.matrixWorld,B.matrix),B.matrixWorldInverse.copy(B.matrixWorld).invert()}this.updateCamera=function(B){if(s===null)return;let G=B.near,ae=B.far;m.texture!==null&&(m.depthNear>0&&(G=m.depthNear),m.depthFar>0&&(ae=m.depthFar)),W.near=D.near=P.near=G,W.far=D.far=P.far=ae,(L!==W.near||z!==W.far)&&(s.updateRenderState({depthNear:W.near,depthFar:W.far}),L=W.near,z=W.far),W.layers.mask=B.layers.mask|6,P.layers.mask=W.layers.mask&-5,D.layers.mask=W.layers.mask&-3;let fe=B.parent,ce=W.cameras;Me(W,fe);for(let me=0;me<ce.length;me++)Me(ce[me],fe);ce.length===2?ne(W,P,D):W.projectionMatrix.copy(P.projectionMatrix),E===null&&B.isPerspectiveCamera&&(E={camera:B,fov:B.fov,zoom:B.zoom}),Ne(B,W,fe)};function Ne(B,G,ae){ae===null?B.matrix.copy(G.matrixWorld):(B.matrix.copy(ae.matrixWorld),B.matrix.invert(),B.matrix.multiply(G.matrixWorld)),B.matrix.decompose(B.position,B.quaternion,B.scale),B.updateMatrixWorld(!0),B.projectionMatrix.copy(G.projectionMatrix),B.projectionMatrixInverse.copy(G.projectionMatrixInverse),B.isPerspectiveCamera&&(B.fov=Is*2*Math.atan(1/B.projectionMatrix.elements[5]),B.zoom=1)}this.getCamera=function(){return W},this.getFoveation=function(){if(!(h===null&&f===null))return l},this.setFoveation=function(B){l=B,h!==null&&(h.fixedFoveation=B),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=B)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(W)},this.getCameraTexture=function(B){return p[B]};let re=null;function ge(B,G){if(u=G.getViewerPose(c||o),g=G,u!==null){let ae=u.views;f!==null&&(e.setRenderTargetFramebuffer(v,f.framebuffer),e.setRenderTarget(v));let fe=!1;ae.length!==W.cameras.length&&(W.cameras.length=0,fe=!0);for(let we=0;we<ae.length;we++){let oe=ae[we],Z=null;if(f!==null)Z=f.getViewport(oe);else{let _e=d.getViewSubImage(h,oe);Z=_e.viewport,we===0&&(e.setRenderTargetTextures(v,_e.colorTexture,_e.depthStencilTexture),e.setRenderTarget(v))}let se=V[we];se===void 0&&(se=new Dt,se.layers.enable(we),se.viewport=new Mt,V[we]=se),se.matrix.fromArray(oe.transform.matrix),se.matrix.decompose(se.position,se.quaternion,se.scale),se.projectionMatrix.fromArray(oe.projectionMatrix),se.projectionMatrixInverse.copy(se.projectionMatrix).invert(),se.viewport.set(Z.x,Z.y,Z.width,Z.height),we===0&&(W.matrix.copy(se.matrix),W.matrix.decompose(W.position,W.quaternion,W.scale)),fe===!0&&W.cameras.push(se)}let ce=s.enabledFeatures;if(ce&&ce.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&y){d=n.getBinding();let we=d.getDepthInformation(ae[0]);we&&we.isValid&&we.texture&&m.init(we,s.renderState)}if(ce&&ce.includes("camera-access")&&y){e.state.unbindTexture(),d=n.getBinding();for(let we=0;we<ae.length;we++){let oe=ae[we].camera;if(oe){let Z=p[oe];Z||(Z=new wo,p[oe]=Z);let se=d.getCameraImage(oe);Z.sourceTexture=se}}}}for(let ae=0;ae<M.length;ae++){let fe=b[ae],ce=M[ae];fe!==null&&ce!==void 0&&ce.update(fe,G,c||o)}re&&re(B,G),G.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:G}),g=null}let de=new Op;de.setAnimationLoop(ge),this.setAnimationLoop=function(B){re=B},this.dispose=function(){}}},TS=new Qe,Gp=new je;Gp.set(-1,0,0,0,1,0,0,0,1);AS=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),_i=null;ps=class{constructor(e={}){let{canvas:t=cp(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:h=!1,outputBufferType:f=vn}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=o;let y=f,m=new Set([Ac,wc,Ec]),p=new Set([vn,ti,Nr,Ur,Mc,bc]),T=new Uint32Array(4),A=new Int32Array(4),v=new O,M=null,b=null,R=[],x=[],E=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Qn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let P=this,D=!1,V=null,W=null,L=null,z=null;this._outputColorSpace=St;let K=0,H=0,te=null,N=-1,Y=null,ne=new Mt,Me=new Mt,Ne=null,re=new Ge(0),ge=0,de=t.width,B=t.height,G=1,ae=null,fe=null,ce=new Mt(0,0,de,B),me=new Mt(0,0,de,B),xe=!1,we=new wr,oe=!1,Z=!1,se=new Qe,_e=new O,Ae=new Mt,Ye={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Re=!1;function He(){return te===null?G:1}let I=n;function Ze(S,F){return t.getContext(S,F)}let Oe,w,_,U,k,$,ue,pe,J,ie,ve,ze,be,Se,ee,Ee,De,C,he,Q,ye,Te,le;try{let S={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"186"}`),t.addEventListener("webglcontextlost",We,!1),t.addEventListener("webglcontextrestored",Je,!1),t.addEventListener("webglcontextcreationerror",Un,!1),I===null){let F="webgl2";if(I=Ze(F,S),I===null)throw Ze(F)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Pe()}catch(S){throw t.removeEventListener("webglcontextlost",We,!1),t.removeEventListener("webglcontextrestored",Je,!1),t.removeEventListener("webglcontextcreationerror",Un,!1),Ke("WebGLRenderer: "+S.message),S}function Pe(){Oe=new Uy(I),Oe.init(),ye=new SS(I,Oe),w=new Ey(I,Oe,e,ye),_=new yS(I,Oe),w.reversedDepthBuffer&&h&&_.buffers.depth.setReversed(!0),W=I.createFramebuffer(),L=I.createFramebuffer(),z=I.createFramebuffer(),U=new By(I),k=new rS,$=new vS(I,Oe,_,k,w,ye,U),ue=new Ny(P),pe=new k0(I),Te=new by(I,pe),J=new Fy(I,pe,U,Te),ie=new ky(I,J,pe,Te,U),C=new zy(I,w,$),ee=new wy(k),ve=new sS(P,ue,Oe,w,Te,ee),ze=new ES(P,k),be=new aS,Se=new fS(Oe),De=new My(P,ue,_,ie,g,l),Ee=new xS(P,ie,w),le=new wS(I,U,w,_),he=new Ty(I,Oe,U),Q=new Oy(I,Oe,U),U.programs=ve.programs,P.capabilities=w,P.extensions=Oe,P.properties=k,P.renderLists=be,P.shadowMap=Ee,P.state=_,P.info=U}y!==vn&&(E=new Hy(y,t.width,t.height,a,s,r));let Ue=new Th(P,I);this.xr=Ue,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let S=Oe.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){let S=Oe.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(S){S!==void 0&&(G=S,this.setSize(de,B,!1))},this.getSize=function(S){return S.set(de,B)},this.setSize=function(S,F,j=!0){if(Ue.isPresenting){qe("WebGLRenderer: Can't change size while VR device is presenting.");return}de=S,B=F,t.width=Math.floor(S*G),t.height=Math.floor(F*G),j===!0&&(t.style.width=S+"px",t.style.height=F+"px"),E!==null&&E.setSize(t.width,t.height),this.setViewport(0,0,S,F)},this.getDrawingBufferSize=function(S){return S.set(de*G,B*G).floor()},this.setDrawingBufferSize=function(S,F,j){de=S,B=F,G=j,t.width=Math.floor(S*j),t.height=Math.floor(F*j),this.setViewport(0,0,S,F)},this.setEffects=function(S){if(y===vn){Ke("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(S){for(let F=0;F<S.length;F++)if(S[F].isOutputPass===!0){qe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}E.setEffects(S||[])},this.getCurrentViewport=function(S){return S.copy(ne)},this.getViewport=function(S){return S.copy(ce)},this.setViewport=function(S,F,j,X){S.isVector4?ce.set(S.x,S.y,S.z,S.w):ce.set(S,F,j,X),_.viewport(ne.copy(ce).multiplyScalar(G).round())},this.getScissor=function(S){return S.copy(me)},this.setScissor=function(S,F,j,X){S.isVector4?me.set(S.x,S.y,S.z,S.w):me.set(S,F,j,X),_.scissor(Me.copy(me).multiplyScalar(G).round())},this.getScissorTest=function(){return xe},this.setScissorTest=function(S){_.setScissorTest(xe=S)},this.setOpaqueSort=function(S){ae=S},this.setTransparentSort=function(S){fe=S},this.getClearColor=function(S){return S.copy(De.getClearColor())},this.setClearColor=function(){De.setClearColor(...arguments)},this.getClearAlpha=function(){return De.getClearAlpha()},this.setClearAlpha=function(){De.setClearAlpha(...arguments)},this.clear=function(S=!0,F=!0,j=!0){let X=0;if(S){let q=!1;if(te!==null){let Le=te.texture.format;q=m.has(Le)}if(q){let Le=te.texture.type,Be=p.has(Le),Ie=De.getClearColor(),ke=De.getClearAlpha(),Xe=Ie.r,st=Ie.g,lt=Ie.b;Be?(T[0]=Xe,T[1]=st,T[2]=lt,T[3]=ke,I.clearBufferuiv(I.COLOR,0,T)):(A[0]=Xe,A[1]=st,A[2]=lt,A[3]=ke,I.clearBufferiv(I.COLOR,0,A))}else X|=I.COLOR_BUFFER_BIT}F&&(X|=I.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),j&&(X|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),X!==0&&I.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(S){S.setRenderer(this),V=S},this.dispose=function(){t.removeEventListener("webglcontextlost",We,!1),t.removeEventListener("webglcontextrestored",Je,!1),t.removeEventListener("webglcontextcreationerror",Un,!1),De.dispose(),be.dispose(),Se.dispose(),k.dispose(),ue.dispose(),ie.dispose(),Te.dispose(),le.dispose(),ve.dispose(),Ue.dispose(),Ue.removeEventListener("sessionstart",Nd),Ue.removeEventListener("sessionend",Ud),Ms.stop()};function We(S){S.preventDefault(),mo("WebGLRenderer: Context Lost."),D=!0}function Je(){mo("WebGLRenderer: Context Restored."),D=!1;let S=U.autoReset,F=Ee.enabled,j=Ee.autoUpdate,X=Ee.needsUpdate,q=Ee.type;Pe(),U.autoReset=S,Ee.enabled=F,Ee.autoUpdate=j,Ee.needsUpdate=X,Ee.type=q}function Un(S){Ke("WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function Tn(S){let F=S.target;F.removeEventListener("dispose",Tn),Ag(F)}function Ag(S){Rg(S),k.remove(S)}function Rg(S){let F=k.get(S).programs;F!==void 0&&(F.forEach(function(j){ve.releaseProgram(j)}),S.isShaderMaterial&&ve.releaseShaderCache(S))}this.renderBufferDirect=function(S,F,j,X,q,Le){F===null&&(F=Ye);let Be=q.isMesh&&q.matrixWorld.determinantAffine()<0,Ie=Pg(S,F,j,X,q);_.setMaterial(X,Be);let ke=j.index,Xe=1;if(X.wireframe===!0){if(ke=J.getWireframeAttribute(j),ke===void 0)return;Xe=2}let st=j.drawRange,lt=j.attributes.position,Ve=st.start*Xe,gt=(st.start+st.count)*Xe;Le!==null&&(Ve=Math.max(Ve,Le.start*Xe),gt=Math.min(gt,(Le.start+Le.count)*Xe)),ke!==null?(Ve=Math.max(Ve,0),gt=Math.min(gt,ke.count)):lt!=null&&(Ve=Math.max(Ve,0),gt=Math.min(gt,lt.count));let Ht=gt-Ve;if(Ht<0||Ht===1/0)return;Te.setup(q,X,Ie,j,ke);let Ct,Tt=he;if(ke!==null&&(Ct=pe.get(ke),Tt=Q,Tt.setIndex(Ct)),q.isMesh)X.wireframe===!0?(_.setLineWidth(X.wireframeLinewidth*He()),Tt.setMode(I.LINES)):Tt.setMode(I.TRIANGLES);else if(q.isLine){let tn=X.linewidth;tn===void 0&&(tn=1),_.setLineWidth(tn*He()),q.isLineSegments?Tt.setMode(I.LINES):q.isLineLoop?Tt.setMode(I.LINE_LOOP):Tt.setMode(I.LINE_STRIP)}else q.isPoints?Tt.setMode(I.POINTS):q.isSprite&&Tt.setMode(I.TRIANGLES);if(q.isBatchedMesh)if(Oe.get("WEBGL_multi_draw"))Tt.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{let tn=q._multiDrawStarts,Fe=q._multiDrawCounts,cn=q._multiDrawCount,dt=ke?pe.get(ke).bytesPerElement:1,Fn=k.get(X).currentProgram.getUniforms();for(let ai=0;ai<cn;ai++)Fn.setValue(I,"_gl_DrawID",ai),Tt.render(tn[ai]/dt,Fe[ai])}else if(q.isInstancedMesh)Tt.renderInstances(Ve,Ht,q.count);else if(j.isInstancedBufferGeometry){let tn=j._maxInstanceCount!==void 0?j._maxInstanceCount:1/0,Fe=Math.min(j.instanceCount,tn);Tt.renderInstances(Ve,Ht,Fe)}else Tt.render(Ve,Ht)};function Dd(S,F,j,X){V!==null&&S.isNodeMaterial&&V.setObject(X,S),oe===!0&&ee.setState(S,j,!1),S.transparent===!0&&S.side===Wt&&S.forceSinglePass===!1?(S.side=dn,S.needsUpdate=!0,ga(S,F,X),S.side=mi,S.needsUpdate=!0,ga(S,F,X),S.side=Wt):ga(S,F,X)}this.compile=function(S,F,j=null){j===null&&(j=S),V!==null&&V.renderStart(S,F,j),b=Se.get(j),b.init(F),x.push(b),j.traverseVisible(function(q){q.isLight&&q.layers.test(F.layers)&&(b.pushLight(q),q.castShadow&&b.pushShadow(q))}),S!==j&&S.traverseVisible(function(q){q.isLight&&q.layers.test(F.layers)&&(b.pushLight(q),q.castShadow&&b.pushShadow(q))}),b.setupLights(),V!==null&&V.updateLights(b.state.lightsArray),Z=this.localClippingEnabled,oe=ee.init(this.clippingPlanes,Z),oe===!0&&ee.setGlobalState(this.clippingPlanes,F),V!==null&&Ee.render(b.state.shadowsArray,j,F);let X=new Set;return S.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;let Le=q.material;if(Le)if(Array.isArray(Le))for(let Be=0;Be<Le.length;Be++){let Ie=Le[Be];Dd(Ie,j,F,q),X.add(Ie)}else Dd(Le,j,F,q),X.add(Le)}),b=x.pop(),V!==null&&V.renderEnd(),X},this.compileAsync=function(S,F,j=null){let X=this.compile(S,F,j);return new Promise(q=>{function Le(){if(X.forEach(function(Be){let ke=k.get(Be).currentProgram;(ke===void 0||ke.isReady())&&X.delete(Be)}),X.size===0){q(S);return}setTimeout(Le,10)}Oe.get("KHR_parallel_shader_compile")!==null?Le():setTimeout(Le,10)})};let Kl=null;function Cg(S){Kl&&Kl(S)}function Nd(){Ms.stop()}function Ud(){Ms.start()}let Ms=new Op;Ms.setAnimationLoop(Cg),typeof self<"u"&&Ms.setContext(self),this.setAnimationLoop=function(S){Kl=S,Ue.setAnimationLoop(S),S===null?Ms.stop():Ms.start()},Ue.addEventListener("sessionstart",Nd),Ue.addEventListener("sessionend",Ud),this.render=function(S,F){if(F!==void 0&&F.isCamera!==!0){Ke("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;V!==null&&V.renderStart(S,F);let j=Ue.enabled===!0&&Ue.isPresenting===!0,X=E!==null&&(te===null||j)&&E.begin(P,te);if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),Ue.enabled===!0&&Ue.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(Ue.cameraAutoUpdate===!0&&Ue.updateCamera(F),F=Ue.getCamera()),S.isScene===!0&&S.onBeforeRender(P,S,F,te),b=Se.get(S,x.length),b.init(F),b.state.textureUnits=$.getTextureUnits(),x.push(b),se.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),we.setFromProjectionMatrix(se,Zn,F.reversedDepth),Z=this.localClippingEnabled,oe=ee.init(this.clippingPlanes,Z),M=be.get(S,R.length),M.init(),R.push(M),Ue.enabled===!0&&Ue.isPresenting===!0){let Be=P.xr.getDepthSensingMesh();Be!==null&&$l(Be,F,-1/0,P.sortObjects)}$l(S,F,0,P.sortObjects),M.finish(),V!==null&&V.updateLights(b.state.lightsArray),P.sortObjects===!0&&M.sort(ae,fe),Re=Ue.enabled===!1||Ue.isPresenting===!1||Ue.hasDepthSensing()===!1,Re&&De.addToRenderList(M,S),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),oe===!0&&ee.beginShadows();let q=b.state.shadowsArray;if(Ee.render(q,S,F),oe===!0&&ee.endShadows(),(X&&E.hasRenderPass())===!1){let Be=M.opaque,Ie=M.transmissive;if(b.setupLights(),F.isArrayCamera){let ke=F.cameras;if(Ie.length>0)for(let Xe=0,st=ke.length;Xe<st;Xe++){let lt=ke[Xe];Od(Be,Ie,S,lt)}Re&&De.render(S);for(let Xe=0,st=ke.length;Xe<st;Xe++){let lt=ke[Xe];Fd(M,S,lt,lt.viewport)}}else Ie.length>0&&Od(Be,Ie,S,F),Re&&De.render(S),Fd(M,S,F)}te!==null&&H===0&&($.updateMultisampleRenderTarget(te),$.updateRenderTargetMipmap(te)),X&&E.end(P),S.isScene===!0&&S.onAfterRender(P,S,F),Te.resetDefaultState(),N=-1,Y=null,x.pop(),x.length>0?(b=x[x.length-1],$.setTextureUnits(b.state.textureUnits),oe===!0&&ee.setGlobalState(P.clippingPlanes,b.state.camera)):b=null,R.pop(),R.length>0?M=R[R.length-1]:M=null,V!==null&&V.renderEnd()};function $l(S,F,j,X){if(S.visible===!1)return;if(S.layers.test(F.layers)){if(S.isGroup)j=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(F);else if(S.isLightProbeGrid)b.pushLightProbeGrid(S);else if(S.isLight)b.pushLight(S),S.castShadow&&b.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||S.intersectsFrustum(we)){X&&Ae.setFromMatrixPosition(S.matrixWorld).applyMatrix4(se);let Be=ie.update(S),Ie=S.material;Ie.visible&&M.push(S,Be,Ie,j,Ae.z,null,F)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||S.intersectsFrustum(we))){let Be=ie.update(S),Ie=S.material;if(X&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Ae.copy(S.boundingSphere.center)):(Be.boundingSphere===null&&Be.computeBoundingSphere(),Ae.copy(Be.boundingSphere.center)),Ae.applyMatrix4(S.matrixWorld).applyMatrix4(se)),Array.isArray(Ie)){let ke=Be.groups;for(let Xe=0,st=ke.length;Xe<st;Xe++){let lt=ke[Xe],Ve=Ie[lt.materialIndex];Ve&&Ve.visible&&M.push(S,Be,Ve,j,Ae.z,lt,F)}}else Ie.visible&&M.push(S,Be,Ie,j,Ae.z,null,F)}}let Le=S.children;for(let Be=0,Ie=Le.length;Be<Ie;Be++)$l(Le[Be],F,j,X)}function Fd(S,F,j,X){let{opaque:q,transmissive:Le,transparent:Be}=S;b.setupLightsView(j),oe===!0&&ee.setGlobalState(P.clippingPlanes,j),X&&_.viewport(ne.copy(X)),q.length>0&&ma(q,F,j),Le.length>0&&ma(Le,F,j),Be.length>0&&ma(Be,F,j),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function Od(S,F,j,X){if((j.isScene===!0?j.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[X.id]===void 0){let Ve=Oe.has("EXT_color_buffer_half_float")||Oe.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[X.id]=new gn(1,1,{generateMipmaps:!0,type:Ve?ni:vn,minFilter:ei,samples:Math.max(4,w.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ot.workingColorSpace})}let Le=b.state.transmissionRenderTarget[X.id],Be=X.viewport||ne;Le.setSize(Be.z*P.transmissionResolutionScale,Be.w*P.transmissionResolutionScale);let Ie=P.getRenderTarget(),ke=P.getActiveCubeFace(),Xe=P.getActiveMipmapLevel();P.setRenderTarget(Le),P.getClearColor(re),ge=P.getClearAlpha(),ge<1&&P.setClearColor(16777215,.5),P.clear(),Re&&De.render(j);let st=P.toneMapping;P.toneMapping=Qn;let lt=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),b.setupLightsView(X),oe===!0&&ee.setGlobalState(P.clippingPlanes,X),ma(S,j,X),$.updateMultisampleRenderTarget(Le),$.updateRenderTargetMipmap(Le),Oe.has("WEBGL_multisampled_render_to_texture")===!1){let Ve=!1;for(let gt=0,Ht=F.length;gt<Ht;gt++){let Ct=F[gt],{object:Tt,geometry:tn,material:Fe,group:cn}=Ct;if(Fe.side===Wt&&Tt.layers.test(X.layers)){let dt=Fe.side;Fe.side=dn,Fe.needsUpdate=!0,Bd(Tt,j,X,tn,Fe,cn),Fe.side=dt,Fe.needsUpdate=!0,Ve=!0}}Ve===!0&&($.updateMultisampleRenderTarget(Le),$.updateRenderTargetMipmap(Le))}P.setRenderTarget(Ie,ke,Xe),P.setClearColor(re,ge),lt!==void 0&&(X.viewport=lt),P.toneMapping=st}function ma(S,F,j){let X=F.isScene===!0?F.overrideMaterial:null;for(let q=0,Le=S.length;q<Le;q++){let Be=S[q],{object:Ie,geometry:ke,group:Xe}=Be,st=Be.material;st.allowOverride===!0&&X!==null&&(st=X),Ie.layers.test(j.layers)&&Bd(Ie,F,j,ke,st,Xe)}}function Bd(S,F,j,X,q,Le){V!==null&&q.isNodeMaterial&&V.setObject(S,q),S.onBeforeRender(P,F,j,X,q,Le),S.modelViewMatrix.multiplyMatrices(j.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),q.onBeforeRender(P,F,j,X,S,Le),q.transparent===!0&&q.side===Wt&&q.forceSinglePass===!1?(q.side=dn,q.needsUpdate=!0,P.renderBufferDirect(j,F,X,q,S,Le),q.side=mi,q.needsUpdate=!0,P.renderBufferDirect(j,F,X,q,S,Le),q.side=Wt):P.renderBufferDirect(j,F,X,q,S,Le),S.onAfterRender(P,F,j,X,q,Le)}function ga(S,F,j){F.isScene!==!0&&(F=Ye);let X=k.get(S),q=b.state.lights,Le=b.state.shadowsArray,Be=q.state.version,Ie=ve.getParameters(S,q.state,Le,F,j,b.state.lightProbeGridArray),ke=ve.getProgramCacheKey(Ie),Xe=X.programs;X.environment=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?F.environment:null,X.fog=F.fog;let st=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap;X.envMap=ue.get(S.envMap||X.environment,st),X.envMapRotation=X.environment!==null&&S.envMap===null?F.environmentRotation:S.envMapRotation,Xe===void 0&&(S.addEventListener("dispose",Tn),Xe=new Map,X.programs=Xe);let lt=Xe.get(ke);if(lt!==void 0){if(X.currentProgram===lt&&X.lightsStateVersion===Be)return kd(S,Ie),lt}else Ie.uniforms=ve.getUniforms(S),V!==null&&S.isNodeMaterial&&V.build(S,j,Ie),S.onBeforeCompile(Ie,P),lt=ve.acquireProgram(Ie,ke),Xe.set(ke,lt),X.uniforms=Ie.uniforms;let Ve=X.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Ve.clippingPlanes=ee.uniform),kd(S,Ie),X.needsLights=Dg(S),X.lightsStateVersion=Be,X.needsLights&&(Ve.ambientLightColor.value=q.state.ambient,Ve.lightProbe.value=q.state.probe,Ve.sunLights.value=q.state.sun,Ve.sunLightShadows.value=q.state.sunShadow,Ve.directionalLights.value=q.state.directional,Ve.directionalLightShadows.value=q.state.directionalShadow,Ve.spotLights.value=q.state.spot,Ve.spotLightShadows.value=q.state.spotShadow,Ve.rectAreaLights.value=q.state.rectArea,Ve.ltc_1.value=q.state.rectAreaLTC1,Ve.ltc_2.value=q.state.rectAreaLTC2,Ve.pointLights.value=q.state.point,Ve.pointLightShadows.value=q.state.pointShadow,Ve.hemisphereLights.value=q.state.hemi,Ve.sunShadowMatrix.value=q.state.sunShadowMatrix,Ve.sunShadowCascade.value=q.state.sunShadowCascade,Ve.directionalShadowMatrix.value=q.state.directionalShadowMatrix,Ve.spotLightMatrix.value=q.state.spotLightMatrix,Ve.spotLightMap.value=q.state.spotLightMap,Ve.pointShadowMatrix.value=q.state.pointShadowMatrix),X.lightProbeGrid=b.state.lightProbeGridArray.length>0,X.currentProgram=lt,X.uniformsList=null,lt}function zd(S){if(S.uniformsList===null){let F=S.currentProgram.getUniforms();S.uniformsList=zr.seqWithValue(F.seq,S.uniforms)}return S.uniformsList}function kd(S,F){let j=k.get(S);j.outputColorSpace=F.outputColorSpace,j.batching=F.batching,j.batchingColor=F.batchingColor,j.instancing=F.instancing,j.instancingColor=F.instancingColor,j.instancingMorph=F.instancingMorph,j.skinning=F.skinning,j.morphTargets=F.morphTargets,j.morphNormals=F.morphNormals,j.morphColors=F.morphColors,j.morphTargetsCount=F.morphTargetsCount,j.numClippingPlanes=F.numClippingPlanes,j.numIntersection=F.numClipIntersection,j.vertexAlphas=F.vertexAlphas,j.vertexTangents=F.vertexTangents,j.toneMapping=F.toneMapping}function Ig(S,F){if(S.length===0)return null;if(S.length===1)return S[0].texture!==null?S[0]:null;v.setFromMatrixPosition(F.matrixWorld);for(let j=0,X=S.length;j<X;j++){let q=S[j];if(q.texture!==null&&q.boundingBox.containsPoint(v))return q}return null}function Pg(S,F,j,X,q){F.isScene!==!0&&(F=Ye),$.resetTextureUnits();let Le=F.fog,Be=X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial?F.environment:null,Ie=te===null?P.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:ot.workingColorSpace,ke=X.isMeshStandardMaterial||X.isMeshLambertMaterial&&!X.envMap||X.isMeshPhongMaterial&&!X.envMap,Xe=ue.get(X.envMap||Be,ke),st=X.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,lt=!!j.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Ve=!!j.morphAttributes.position,gt=!!j.morphAttributes.normal,Ht=!!j.morphAttributes.color,Ct=Qn;X.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(Ct=P.toneMapping);let Tt=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,tn=Tt!==void 0?Tt.length:0,Fe=k.get(X),cn=b.state.lights;if(oe===!0&&(Z===!0||S!==Y)){let wt=S===Y&&X.id===N;ee.setState(X,S,wt)}let dt=!1;X.version===Fe.__version?(Fe.needsLights&&Fe.lightsStateVersion!==cn.state.version||Fe.outputColorSpace!==Ie||q.isBatchedMesh&&Fe.batching===!1||!q.isBatchedMesh&&Fe.batching===!0||q.isBatchedMesh&&Fe.batchingColor===!0&&q._colorsTexture===null||q.isBatchedMesh&&Fe.batchingColor===!1&&q._colorsTexture!==null||q.isInstancedMesh&&Fe.instancing===!1||!q.isInstancedMesh&&Fe.instancing===!0||q.isSkinnedMesh&&Fe.skinning===!1||!q.isSkinnedMesh&&Fe.skinning===!0||q.isInstancedMesh&&Fe.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&Fe.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&Fe.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&Fe.instancingMorph===!1&&q.morphTexture!==null||Fe.envMap!==Xe||X.fog===!0&&Fe.fog!==Le||Fe.numClippingPlanes!==void 0&&(Fe.numClippingPlanes!==ee.numPlanes||Fe.numIntersection!==ee.numIntersection)||Fe.vertexAlphas!==st||Fe.vertexTangents!==lt||Fe.morphTargets!==Ve||Fe.morphNormals!==gt||Fe.morphColors!==Ht||Fe.toneMapping!==Ct||Fe.morphTargetsCount!==tn||!!Fe.lightProbeGrid!=b.state.lightProbeGridArray.length>0)&&(dt=!0):(dt=!0,Fe.__version=X.version);let Fn=Fe.currentProgram;dt===!0&&(Fn=ga(X,F,q),V&&X.isNodeMaterial&&V.onUpdateProgram(X,Fn,Fe));let ai=!1,ji=!1,$s=!1,bt=Fn.getUniforms(),Ot=Fe.uniforms;if(_.useProgram(Fn.program)&&(ai=!0,ji=!0,$s=!0),X.id!==N&&(N=X.id,ji=!0),Fe.needsLights){let wt=Ig(b.state.lightProbeGridArray,q);Fe.lightProbeGrid!==wt&&(Fe.lightProbeGrid=wt,ji=!0)}if(ai||Y!==S){_.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),bt.setValue(I,"projectionMatrix",S.projectionMatrix),bt.setValue(I,"viewMatrix",S.matrixWorldInverse);let es=bt.map.cameraPosition;es!==void 0&&es.setValue(I,_e.setFromMatrixPosition(S.matrixWorld)),w.logarithmicDepthBuffer&&bt.setValue(I,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&bt.setValue(I,"isOrthographic",S.isOrthographicCamera===!0),Y!==S&&(Y=S,ji=!0,$s=!0)}if(Fe.needsLights&&(cn.state.sunShadowMap.length>0&&bt.setValue(I,"sunShadowMap",cn.state.sunShadowMap,$),cn.state.directionalShadowMap.length>0&&bt.setValue(I,"directionalShadowMap",cn.state.directionalShadowMap,$),cn.state.spotShadowMap.length>0&&bt.setValue(I,"spotShadowMap",cn.state.spotShadowMap,$),cn.state.pointShadowMap.length>0&&bt.setValue(I,"pointShadowMap",cn.state.pointShadowMap,$)),q.isSkinnedMesh){bt.setOptional(I,q,"bindMatrix"),bt.setOptional(I,q,"bindMatrixInverse");let wt=q.skeleton;wt&&(wt.boneTexture===null&&wt.computeBoneTexture(),bt.setValue(I,"boneTexture",wt.boneTexture,$))}q.isBatchedMesh&&(bt.setOptional(I,q,"batchingTexture"),bt.setValue(I,"batchingTexture",q._matricesTexture,$),bt.setOptional(I,q,"batchingIdTexture"),bt.setValue(I,"batchingIdTexture",q._indirectTexture,$),bt.setOptional(I,q,"batchingColorTexture"),q._colorsTexture!==null&&bt.setValue(I,"batchingColorTexture",q._colorsTexture,$));let Qi=j.morphAttributes;if((Qi.position!==void 0||Qi.normal!==void 0||Qi.color!==void 0)&&C.update(q,j,Fn),(ji||Fe.receiveShadow!==q.receiveShadow)&&(Fe.receiveShadow=q.receiveShadow,bt.setValue(I,"receiveShadow",q.receiveShadow)),(X.isMeshStandardMaterial||X.isMeshLambertMaterial||X.isMeshPhongMaterial)&&X.envMap===null&&F.environment!==null&&(Ot.envMapIntensity.value=F.environmentIntensity),Ot.dfgLUT!==void 0&&(Ot.dfgLUT.value=RS()),ji){if(bt.setValue(I,"toneMappingExposure",P.toneMappingExposure),Fe.needsLights&&Lg(Ot,$s),Le&&X.fog===!0&&ze.refreshFogUniforms(Ot,Le),ze.refreshMaterialUniforms(Ot,X,G,B,b.state.transmissionRenderTarget[S.id]),Fe.needsLights&&Fe.lightProbeGrid){let wt=Fe.lightProbeGrid;Ot.probesSH.value=wt.texture,Ot.probesMin.value.copy(wt.boundingBox.min),Ot.probesMax.value.copy(wt.boundingBox.max),Ot.probesResolution.value.copy(wt.resolution)}zr.upload(I,zd(Fe),Ot,$)}if(X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(zr.upload(I,zd(Fe),Ot,$),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&bt.setValue(I,"center",q.center),bt.setValue(I,"modelViewMatrix",q.modelViewMatrix),bt.setValue(I,"normalMatrix",q.normalMatrix),bt.setValue(I,"modelMatrix",q.matrixWorld),X.uniformsGroups!==void 0){let wt=X.uniformsGroups;for(let es=0,Js=wt.length;es<Js;es++){let Hd=wt[es];le.update(Hd,Fn),le.bind(Hd,Fn)}}return Fn}function Lg(S,F){S.ambientLightColor.needsUpdate=F,S.lightProbe.needsUpdate=F,S.sunLights.needsUpdate=F,S.sunLightShadows.needsUpdate=F,S.directionalLights.needsUpdate=F,S.directionalLightShadows.needsUpdate=F,S.pointLights.needsUpdate=F,S.pointLightShadows.needsUpdate=F,S.spotLights.needsUpdate=F,S.spotLightShadows.needsUpdate=F,S.rectAreaLights.needsUpdate=F,S.hemisphereLights.needsUpdate=F}function Dg(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return K},this.getActiveMipmapLevel=function(){return H},this.getRenderTarget=function(){return te},this.setRenderTargetTextures=function(S,F,j){let X=k.get(S);X.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,X.__autoAllocateDepthBuffer===!1&&(X.__useRenderToTexture=!1),k.get(S.texture).__webglTexture=F,k.get(S.depthTexture).__webglTexture=X.__autoAllocateDepthBuffer?void 0:j,X.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,F){let j=k.get(S);j.__webglFramebuffer=F,j.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(S,F=0,j=0){te=S,K=F,H=j;let X=null,q=!1,Le=!1;if(S){let Ie=k.get(S);if(Ie.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(I.FRAMEBUFFER,Ie.__webglFramebuffer),ne.copy(S.viewport),Me.copy(S.scissor),Ne=S.scissorTest,_.viewport(ne),_.scissor(Me),_.setScissorTest(Ne),N=-1;return}else if(Ie.__webglFramebuffer===void 0)$.setupRenderTarget(S);else if(Ie.__hasExternalTextures)$.rebindTextures(S,k.get(S.texture).__webglTexture,k.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){let st=S.depthTexture;if(Ie.__boundDepthTexture!==st){if(st!==null&&k.has(st)&&(S.width!==st.image.width||S.height!==st.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");$.setupDepthRenderbuffer(S)}}let ke=S.texture;(ke.isData3DTexture||ke.isDataArrayTexture||ke.isCompressedArrayTexture)&&(Le=!0);let Xe=k.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Xe[F])?X=Xe[F][j]:X=Xe[F],q=!0):S.samples>0&&$.useMultisampledRTT(S)===!1?X=k.get(S).__webglMultisampledFramebuffer:Array.isArray(Xe)?X=Xe[j]:X=Xe,ne.copy(S.viewport),Me.copy(S.scissor),Ne=S.scissorTest}else ne.copy(ce).multiplyScalar(G).floor(),Me.copy(me).multiplyScalar(G).floor(),Ne=xe;if(j!==0&&(X=W),_.bindFramebuffer(I.FRAMEBUFFER,X)&&_.drawBuffers(S,X),_.viewport(ne),_.scissor(Me),_.setScissorTest(Ne),q){let Ie=k.get(S.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+F,Ie.__webglTexture,j)}else if(Le){let Ie=F;for(let ke=0;ke<S.textures.length;ke++){let Xe=k.get(S.textures[ke]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+ke,Xe.__webglTexture,j,Ie)}}else if(S!==null&&j!==0){let Ie=k.get(S.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Ie.__webglTexture,j)}N=-1};function Vd(S){let F=k.get(S);return(F.__readFormat!==S.format||F.__readType!==S.type)&&(F.__readFormat=S.format,F.__readType=S.type,F.__formatReadable=w.textureFormatReadable(S.format),F.__typeReadable=w.textureTypeReadable(S.type)),F}this.readRenderTargetPixels=function(S,F,j,X,q,Le,Be,Ie=0){if(!(S&&S.isWebGLRenderTarget)){Ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ke=k.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Be!==void 0&&(ke=ke[Be]),ke){_.bindFramebuffer(I.FRAMEBUFFER,ke);try{let Xe=S.textures[Ie],st=Xe.format,lt=Xe.type;S.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Ie);let Ve=Vd(Xe);if(Ve.__formatReadable===!1){Ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ve.__typeReadable===!1){Ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=S.width-X&&j>=0&&j<=S.height-q&&I.readPixels(F,j,X,q,ye.convert(st),ye.convert(lt),Le)}finally{let Xe=te!==null?k.get(te).__webglFramebuffer:null;_.bindFramebuffer(I.FRAMEBUFFER,Xe)}}},this.readRenderTargetPixelsAsync=async function(S,F,j,X,q,Le,Be,Ie=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ke=k.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Be!==void 0&&(ke=ke[Be]),ke)if(F>=0&&F<=S.width-X&&j>=0&&j<=S.height-q){_.bindFramebuffer(I.FRAMEBUFFER,ke);let Xe=S.textures[Ie],st=Xe.format,lt=Xe.type;S.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Ie);let Ve=Vd(Xe);if(Ve.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ve.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let gt=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,gt),I.bufferData(I.PIXEL_PACK_BUFFER,Le.byteLength,I.STREAM_READ),I.readPixels(F,j,X,q,ye.convert(st),ye.convert(lt),0),I.bindBuffer(I.PIXEL_PACK_BUFFER,null);let Ht=te!==null?k.get(te).__webglFramebuffer:null;_.bindFramebuffer(I.FRAMEBUFFER,Ht);let Ct=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await up(I,Ct,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,gt),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,Le),I.bindBuffer(I.PIXEL_PACK_BUFFER,null),I.deleteBuffer(gt),I.deleteSync(Ct),Le}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,F=null,j=0){let X=Math.pow(2,-j),q=Math.floor(S.image.width*X),Le=Math.floor(S.image.height*X),Be=F!==null?F.x:0,Ie=F!==null?F.y:0;$.setTexture2D(S,0),I.copyTexSubImage2D(I.TEXTURE_2D,j,0,0,Be,Ie,q,Le),_.unbindTexture()},this.copyTextureToTexture=function(S,F,j=null,X=null,q=0,Le=0){let Be,Ie,ke,Xe,st,lt,Ve,gt,Ht,Ct=S.isCompressedTexture?S.mipmaps[Le]:S.image;if(j!==null)Be=j.max.x-j.min.x,Ie=j.max.y-j.min.y,ke=j.isBox3?j.max.z-j.min.z:1,Xe=j.min.x,st=j.min.y,lt=j.isBox3?j.min.z:0;else{let Ot=Math.pow(2,-q);Be=Math.floor(Ct.width*Ot),Ie=Math.floor(Ct.height*Ot),S.isDataArrayTexture?ke=Ct.depth:S.isData3DTexture?ke=Math.floor(Ct.depth*Ot):ke=1,Xe=0,st=0,lt=0}X!==null?(Ve=X.x,gt=X.y,Ht=X.z):(Ve=0,gt=0,Ht=0);let Tt=ye.convert(F.format),tn=ye.convert(F.type),Fe;F.isData3DTexture?($.setTexture3D(F,0),Fe=I.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?($.setTexture2DArray(F,0),Fe=I.TEXTURE_2D_ARRAY):($.setTexture2D(F,0),Fe=I.TEXTURE_2D),_.activeTexture(I.TEXTURE0),_.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,F.flipY),_.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),_.pixelStorei(I.UNPACK_ALIGNMENT,F.unpackAlignment);let cn=_.getParameter(I.UNPACK_ROW_LENGTH),dt=_.getParameter(I.UNPACK_IMAGE_HEIGHT),Fn=_.getParameter(I.UNPACK_SKIP_PIXELS),ai=_.getParameter(I.UNPACK_SKIP_ROWS),ji=_.getParameter(I.UNPACK_SKIP_IMAGES);_.pixelStorei(I.UNPACK_ROW_LENGTH,Ct.width),_.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Ct.height),_.pixelStorei(I.UNPACK_SKIP_PIXELS,Xe),_.pixelStorei(I.UNPACK_SKIP_ROWS,st),_.pixelStorei(I.UNPACK_SKIP_IMAGES,lt);let $s=S.isDataArrayTexture||S.isData3DTexture,bt=F.isDataArrayTexture||F.isData3DTexture;if(S.isDepthTexture){let Ot=k.get(S),Qi=k.get(F),wt=k.get(Ot.__renderTarget),es=k.get(Qi.__renderTarget);_.bindFramebuffer(I.READ_FRAMEBUFFER,wt.__webglFramebuffer),_.bindFramebuffer(I.DRAW_FRAMEBUFFER,es.__webglFramebuffer);for(let Js=0;Js<ke;Js++)$s&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,k.get(S).__webglTexture,q,lt+Js),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,k.get(F).__webglTexture,Le,Ht+Js)),I.blitFramebuffer(Xe,st,Be,Ie,Ve,gt,Be,Ie,I.DEPTH_BUFFER_BIT,I.NEAREST);_.bindFramebuffer(I.READ_FRAMEBUFFER,null),_.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(q!==0||S.isRenderTargetTexture||k.has(S)){let Ot=k.get(S),Qi=k.get(F);_.bindFramebuffer(I.READ_FRAMEBUFFER,L),_.bindFramebuffer(I.DRAW_FRAMEBUFFER,z);for(let wt=0;wt<ke;wt++)$s?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Ot.__webglTexture,q,lt+wt):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Ot.__webglTexture,q),bt?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Qi.__webglTexture,Le,Ht+wt):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Qi.__webglTexture,Le),q!==0?I.blitFramebuffer(Xe,st,Be,Ie,Ve,gt,Be,Ie,I.COLOR_BUFFER_BIT,I.NEAREST):bt?I.copyTexSubImage3D(Fe,Le,Ve,gt,Ht+wt,Xe,st,Be,Ie):I.copyTexSubImage2D(Fe,Le,Ve,gt,Xe,st,Be,Ie);_.bindFramebuffer(I.READ_FRAMEBUFFER,null),_.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else bt?S.isDataTexture||S.isData3DTexture?I.texSubImage3D(Fe,Le,Ve,gt,Ht,Be,Ie,ke,Tt,tn,Ct.data):F.isCompressedArrayTexture?I.compressedTexSubImage3D(Fe,Le,Ve,gt,Ht,Be,Ie,ke,Tt,Ct.data):I.texSubImage3D(Fe,Le,Ve,gt,Ht,Be,Ie,ke,Tt,tn,Ct):S.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,Le,Ve,gt,Be,Ie,Tt,tn,Ct.data):S.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,Le,Ve,gt,Ct.width,Ct.height,Tt,Ct.data):I.texSubImage2D(I.TEXTURE_2D,Le,Ve,gt,Be,Ie,Tt,tn,Ct);_.pixelStorei(I.UNPACK_ROW_LENGTH,cn),_.pixelStorei(I.UNPACK_IMAGE_HEIGHT,dt),_.pixelStorei(I.UNPACK_SKIP_PIXELS,Fn),_.pixelStorei(I.UNPACK_SKIP_ROWS,ai),_.pixelStorei(I.UNPACK_SKIP_IMAGES,ji),Le===0&&F.generateMipmaps&&I.generateMipmap(Fe),_.unbindTexture()},this.initRenderTarget=function(S){k.get(S).__webglFramebuffer===void 0&&$.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?$.setTextureCube(S,0):S.isData3DTexture?$.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?$.setTexture2DArray(S,0):$.setTexture2D(S,0),_.unbindTexture()},this.resetState=function(){K=0,H=0,te=null,_.reset(),Te.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Zn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=ot._getDrawingBufferColorSpace(e),t.unpackColorSpace=ot._getUnpackColorSpace()}}});function Xp(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,l=new Pt,c=0;for(let u=0;u<i.length;++u){let d=i[u],h=0;if(t!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in d.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(d.attributes[f]),h++}if(h!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(a!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in d.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(d.morphAttributes[f])}if(e){let f;if(t)f=d.index.count;else if(d.attributes.position!==void 0)f=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,u),c+=f}}if(t){let u=0,d=[];for(let h=0;h<i.length;++h){let f=i[h].index;for(let g=0;g<f.count;++g)d.push(f.getX(g)+u);u+=i[h].attributes.position.count}l.setIndex(d)}for(let u in r){let d=Wp(r[u]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;l.setAttribute(u,d)}for(let u in o){let d=o[u][0].length;if(d!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[u]=[];for(let h=0;h<d;++h){let f=[];for(let y=0;y<o[u].length;++y)f.push(o[u][y][h]);let g=Wp(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;l.morphAttributes[u].push(g)}}}return l}function Wp(i){let e,t,n,s=-1,r=0;for(let c=0;c<i.length;++c){let u=i[c];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=u.gpuType),s!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.count*t}let o=new e(r),a=new Nt(o,t,n),l=0;for(let c=0;c<i.length;++c){let u=i[c];if(u.isInterleavedBufferAttribute){let d=l/t;for(let h=0,f=u.count;h<f;h++)for(let g=0;g<t;g++){let y=u.getComponent(h,g);a.setComponent(h+d,g,y)}}else o.set(u.array,l);l+=u.count*t}return s!==void 0&&(a.gpuType=s),a}function wh(i,e){if(e===th)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===Fr||e===Go){let t=i.getIndex();if(t===null){let r=[],o=i.getAttribute("position");if(o!==void 0){for(let a=0;a<o.count;a++)r.push(a);i.setIndex(r),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}let n=t.count-2,s=[];if(e===Fr)for(let r=1;r<=n;r++)s.push(t.getX(0)),s.push(t.getX(r)),s.push(t.getX(r+1));else for(let r=0;r<n;r++)r%2===0?(s.push(t.getX(r)),s.push(t.getX(r+1)),s.push(t.getX(r+2))):(s.push(t.getX(r+2)),s.push(t.getX(r+1)),s.push(t.getX(r)));return s.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),i.setIndex(s),i.clearGroups(),i}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}var Ah=Bt(()=>{yi()});function qp(i){let e=new Map,t=new Map,n=i.clone();return Yp(i,n,function(s,r){e.set(r,s),t.set(s,r)}),n.traverse(function(s){if(!s.isSkinnedMesh)return;let r=s,o=e.get(s),a=o.skeleton.bones;r.skeleton=o.skeleton.clone(),r.bindMatrix.copy(o.bindMatrix),r.skeleton.bones=a.map(function(l){return t.get(l)}),r.bind(r.skeleton,r.bindMatrix)}),n}function Yp(i,e,t){t(i,e);for(let n=0;n<i.children.length;n++)Yp(i.children[n],e.children[n],t)}var Zp=Bt(()=>{});function CS(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}function Vt(i,e,t){let n=i.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}function LS(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new Cn({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:mi})),i.DefaultMaterial}function ks(i,e,t){for(let n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function vi(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function DS(i,e,t){let n=!1,s=!1,r=!1;for(let c=0,u=e.length;c<u;c++){let d=e[c];if(d.POSITION!==void 0&&(n=!0),d.NORMAL!==void 0&&(s=!0),d.COLOR_0!==void 0&&(r=!0),n&&s&&r)break}if(!n&&!s&&!r)return Promise.resolve(i);let o=[],a=[],l=[];for(let c=0,u=e.length;c<u;c++){let d=e[c];if(n){let h=d.POSITION!==void 0?t.getDependency("accessor",d.POSITION):i.attributes.position;o.push(h)}if(s){let h=d.NORMAL!==void 0?t.getDependency("accessor",d.NORMAL):i.attributes.normal;a.push(h)}if(r){let h=d.COLOR_0!==void 0?t.getDependency("accessor",d.COLOR_0):i.attributes.color;l.push(h)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l)]).then(function(c){let u=c[0],d=c[1],h=c[2];return n&&(i.morphAttributes.position=u),s&&(i.morphAttributes.normal=d),r&&(i.morphAttributes.color=h),i.morphTargetsRelative=!0,i})}function NS(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,s=t.length;n<s;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function US(i){let e,t=i.extensions&&i.extensions[ct.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Ih(t.attributes):e=i.indices+":"+Ih(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,s=i.targets.length;n<s;n++)e+=":"+Ih(i.targets[n]);return e}function Ih(i){let e="",t=Object.keys(i).sort();for(let n=0,s=t.length;n<s;n++)e+=t[n]+":"+i[t[n]]+";";return e}function ed(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function FS(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}function BS(i,e,t){let n=e.attributes,s=new An;if(n.POSITION!==void 0){let a=t.json.accessors[n.POSITION],l=a.min,c=a.max;if(l!==void 0&&c!==void 0){if(s.set(new O(l[0],l[1],l[2]),new O(c[0],c[1],c[2])),a.normalized){let u=ed(Vr[a.componentType]);s.min.multiplyScalar(u),s.max.multiplyScalar(u)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=e.targets;if(r!==void 0){let a=new O,l=new O;for(let c=0,u=r.length;c<u;c++){let d=r[c];if(d.POSITION!==void 0){let h=t.json.accessors[d.POSITION],f=h.min,g=h.max;if(f!==void 0&&g!==void 0){if(l.setX(Math.max(Math.abs(f[0]),Math.abs(g[0]))),l.setY(Math.max(Math.abs(f[1]),Math.abs(g[1]))),l.setZ(Math.max(Math.abs(f[2]),Math.abs(g[2]))),h.normalized){let y=ed(Vr[h.componentType]);l.multiplyScalar(y)}a.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(a)}i.boundingBox=s;let o=new _n;s.getCenter(o.center),o.radius=s.min.distanceTo(s.max)/2,i.boundingSphere=o}function jp(i,e,t){let n=e.attributes,s=[];function r(o,a){return t.getDependency("accessor",o).then(function(l){i.setAttribute(a,l)})}for(let o in n){let a=Qh[o]||o.toLowerCase();a in i.attributes||s.push(r(n[o],a))}if(e.indices!==void 0&&!i.index){let o=t.getDependency("accessor",e.indices).then(function(a){i.setIndex(a)});s.push(o)}return ot.workingColorSpace!==un&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${ot.workingColorSpace}" not supported.`),vi(i,e),BS(i,e,t),Promise.all(s).then(function(){return e.targets!==void 0?DS(i,e.targets,t):i})}var gs,ct,Ph,Lh,Dh,Nh,Uh,Fh,Oh,Bh,zh,kh,Vh,Hh,Gh,Wh,Xh,qh,fl,Yh,Qp,Yo,Kp,Zh,Kh,$h,Jh,pl,IS,jh,kn,Vr,$p,Jp,Rh,Qh,ms,PS,Ch,OS,td,ml=Bt(()=>{yi();Ah();Zp();gs=class extends fi{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Nh(t)}),this.register(function(t){return new Uh(t)}),this.register(function(t){return new Wh(t)}),this.register(function(t){return new Xh(t)}),this.register(function(t){return new qh(t)}),this.register(function(t){return new Oh(t)}),this.register(function(t){return new Bh(t)}),this.register(function(t){return new zh(t)}),this.register(function(t){return new kh(t)}),this.register(function(t){return new Dh(t)}),this.register(function(t){return new Vh(t)}),this.register(function(t){return new Fh(t)}),this.register(function(t){return new Gh(t)}),this.register(function(t){return new Hh(t)}),this.register(function(t){return new Ph(t)}),this.register(function(t){return new fl(t,ct.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new fl(t,ct.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new Yh(t)})}load(e,t,n,s){let r=this,o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){let c=Wi.extractUrlBase(e);o=Wi.resolveURL(c,this.path)}else o=Wi.extractUrlBase(e);this.manager.itemStart(e);let a=function(c){s?s(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new Cr(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,o,function(u){t(u),r.manager.itemEnd(e)},a)}catch(u){a(u)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,s){let r,o={},a={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===Qp){try{o[ct.KHR_BINARY_GLTF]=new Zh(e)}catch(d){s&&s(d);return}r=JSON.parse(o[ct.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new td(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let u=0;u<this.pluginCallbacks.length;u++){let d=this.pluginCallbacks[u](c);d.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[d.name]=d,o[d.name]=!0}if(r.extensionsUsed)for(let u=0;u<r.extensionsUsed.length;++u){let d=r.extensionsUsed[u],h=r.extensionsRequired||[];switch(d){case ct.KHR_MATERIALS_UNLIT:o[d]=new Lh;break;case ct.KHR_DRACO_MESH_COMPRESSION:o[d]=new Kh(r,this.dracoLoader);break;case ct.KHR_TEXTURE_TRANSFORM:o[d]=new $h;break;case ct.KHR_MESH_QUANTIZATION:o[d]=new Jh;break;default:h.indexOf(d)>=0&&a[d]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+d+'".')}}c.setExtensions(o),c.setPlugins(a),c.parse(n,s)}parseAsync(e,t){let n=this;return new Promise(function(s,r){n.parse(e,t,s,r)})}};ct={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},Ph=class{constructor(e){this.parser=e,this.name=ct.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,s=t.length;n<s;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,s=t.cache.get(n);if(s)return s;let r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e],c,u=new Ge(16777215);l.color!==void 0&&u.setRGB(l.color[0],l.color[1],l.color[2],un);let d=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new Gi(u),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new Ns(u),c.distance=d;break;case"spot":c=new Lo(u),c.distance=d,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),vi(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),s=Promise.resolve(c),t.cache.add(n,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],a=(r.extensions&&r.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(l){return n._getNodeRef(t.cache,a,l)})}},Lh=class{constructor(){this.name=ct.KHR_MATERIALS_UNLIT}getMaterialType(){return Jn}extendParams(e,t,n){let s=[];e.color=new Ge(1,1,1),e.opacity=1;let r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let o=r.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],un),e.opacity=o[3]}r.baseColorTexture!==void 0&&s.push(n.assignTexture(e,"map",r.baseColorTexture,St))}return Promise.all(s)}},Dh=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=Vt(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},Nh=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Vt(this.parser,e,this.name)!==null?Qt:null}extendMaterialParams(e,t){let n=Vt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(s.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let r=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new at(r,r)}return Promise.all(s)}},Uh=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Vt(this.parser,e,this.name)!==null?Qt:null}extendMaterialParams(e,t){let n=Vt(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}},Fh=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Vt(this.parser,e,this.name)!==null?Qt:null}extendMaterialParams(e,t){let n=Vt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(s)}},Oh=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_SHEEN}getMaterialType(e){return Vt(this.parser,e,this.name)!==null?Qt:null}extendMaterialParams(e,t){let n=Vt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];if(t.sheenColor=new Ge(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let r=n.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],un)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,St)),n.sheenRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(s)}},Bh=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Vt(this.parser,e,this.name)!==null?Qt:null}extendMaterialParams(e,t){let n=Vt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&s.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(s)}},zh=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_VOLUME}getMaterialType(e){return Vt(this.parser,e,this.name)!==null?Qt:null}extendMaterialParams(e,t){let n=Vt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let r=n.attenuationColor||[1,1,1];return t.attenuationColor=new Ge().setRGB(r[0],r[1],r[2],un),Promise.all(s)}},kh=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_IOR}getMaterialType(e){return Vt(this.parser,e,this.name)!==null?Qt:null}extendMaterialParams(e,t){let n=Vt(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}},Vh=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Vt(this.parser,e,this.name)!==null?Qt:null}extendMaterialParams(e,t){let n=Vt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));let r=n.specularColorFactor||[1,1,1];return t.specularColor=new Ge().setRGB(r[0],r[1],r[2],un),n.specularColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,St)),Promise.all(s)}},Hh=class{constructor(e){this.parser=e,this.name=ct.EXT_MATERIALS_BUMP}getMaterialType(e){return Vt(this.parser,e,this.name)!==null?Qt:null}extendMaterialParams(e,t){let n=Vt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&s.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(s)}},Gh=class{constructor(e){this.parser=e,this.name=ct.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Vt(this.parser,e,this.name)!==null?Qt:null}extendMaterialParams(e,t){let n=Vt(this.parser,e,this.name);if(n===null)return Promise.resolve();let s=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&s.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(s)}},Wh=class{constructor(e){this.parser=e,this.name=ct.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,s=n.textures[e];if(!s.extensions||!s.extensions[this.name])return null;let r=s.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,o)}},Xh=class{constructor(e){this.parser=e,this.name=ct.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=s.images[o.source],l=n.textureLoader;if(a.uri){let c=n.options.manager.getHandler(a.uri);c!==null&&(l=c)}return n.loadTextureImage(e,o.source,l)}},qh=class{constructor(e){this.parser=e,this.name=ct.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=s.images[o.source],l=n.textureLoader;if(a.uri){let c=n.options.manager.getHandler(a.uri);c!==null&&(l=c)}return n.loadTextureImage(e,o.source,l)}},fl=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let s=n.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(a){let l=s.byteOffset||0,c=s.byteLength||0,u=s.count,d=s.byteStride,h=new Uint8Array(a,l,c);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(u,d,h,s.mode,s.filter).then(function(f){return f.buffer}):o.ready.then(function(){let f=new ArrayBuffer(u*d);return o.decodeGltfBuffer(new Uint8Array(f),u,d,h,s.mode,s.filter),f})})}else return null}},Yh=class{constructor(e){this.name=ct.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let s=t.meshes[n.mesh];for(let c of s.primitives)if(c.mode!==kn.TRIANGLES&&c.mode!==kn.TRIANGLE_STRIP&&c.mode!==kn.TRIANGLE_FAN&&c.mode!==void 0)return null;let o=n.extensions[this.name].attributes,a=[],l={};for(let c in o)a.push(this.parser.getDependency("accessor",o[c]).then(u=>(l[c]=u,l[c])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(c=>{let u=c.pop(),d=u.isGroup?u.children:[u],h=c[0].count,f=[];for(let g of d){let y=new Qe,m=new O,p=new hn,T=new O(1,1,1),A=new Mo(g.geometry,g.material,h);for(let M=0;M<h;M++)l.TRANSLATION&&m.fromBufferAttribute(l.TRANSLATION,M),l.ROTATION&&p.fromBufferAttribute(l.ROTATION,M),l.SCALE&&T.fromBufferAttribute(l.SCALE,M),A.setMatrixAt(M,y.compose(m,p,T));let v=null;for(let M in l)if(M==="_COLOR_0"){let b=l[M];A.instanceColor=new Oi(b.array,b.itemSize,b.normalized)}else if(M!=="TRANSLATION"&&M!=="ROTATION"&&M!=="SCALE"){if(v===null){let R=A.geometry;v=new Pt,v.name=R.name;for(let x in R.attributes)v.setAttribute(x,R.attributes[x]);for(let x in R.morphAttributes)v.morphAttributes[x]=R.morphAttributes[x];R.index!==null&&v.setIndex(R.index),v.morphTargetsRelative=R.morphTargetsRelative;for(let x of R.groups)v.addGroup(x.start,x.count,x.materialIndex);R.boundingBox!==null&&(v.boundingBox=R.boundingBox.clone()),R.boundingSphere!==null&&(v.boundingSphere=R.boundingSphere.clone()),v.drawRange.start=R.drawRange.start,v.drawRange.count=R.drawRange.count,v.userData=Object.assign({},R.userData),A.geometry=v}let b=l[M];v.setAttribute(M,new Oi(b.array,b.itemSize,b.normalized))}Rt.prototype.copy.call(A,g),this.parser.assignFinalMaterial(A),f.push(A)}return u.isGroup?(u.clear(),u.add(...f),u):f[0]}))}},Qp="glTF",Yo=12,Kp={JSON:1313821514,BIN:5130562},Zh=class{constructor(e){this.name=ct.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,Yo),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Qp)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let s=this.header.length-Yo,r=new DataView(e,Yo),o=0;for(;o<s;){let a=r.getUint32(o,!0);o+=4;let l=r.getUint32(o,!0);if(o+=4,l===Kp.JSON){let c=new Uint8Array(e,Yo+o,a);this.content=n.decode(c)}else if(l===Kp.BIN){let c=Yo+o;this.body=e.slice(c,c+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},Kh=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=ct.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},l={},c={};for(let u in o){let d=Qh[u]||u.toLowerCase();a[d]=o[u]}for(let u in e.attributes){let d=Qh[u]||u.toLowerCase();if(o[u]!==void 0){let h=n.accessors[e.attributes[u]],f=Vr[h.componentType];c[d]=f.name,l[d]=h.normalized===!0}}return t.getDependency("bufferView",r).then(function(u){return new Promise(function(d,h){s.decodeDracoFile(u,function(f){for(let g in f.attributes){let y=f.attributes[g],m=l[g];m!==void 0&&(y.normalized=m)}d(f)},a,c,un,h)})})}},$h=class{constructor(){this.name=ct.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){let n=Math.cos(e.rotation),s=Math.sin(e.rotation);e.matrix.set(e.repeat.x*n,e.repeat.y*s,e.offset.x,-e.repeat.x*s,e.repeat.y*n,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}},Jh=class{constructor(){this.name=ct.KHR_MESH_QUANTIZATION}},pl=class extends di{constructor(e,t,n,s){super(e,t,n,s)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let o=0;o!==s;o++)t[o]=n[r+o];return t}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=a*2,c=a*3,u=s-t,d=(n-t)/u,h=d*d,f=h*d,g=e*c,y=g-c,m=-2*f+3*h,p=f-h,T=1-m,A=p-h+d;for(let v=0;v!==a;v++){let M=o[y+v+a],b=o[y+v+l]*u,R=o[g+v+a],x=o[g+v]*u;r[v]=T*M+A*b+m*R+p*x}return r}},IS=new hn,jh=class extends pl{interpolate_(e,t,n,s){let r=super.interpolate_(e,t,n,s);return IS.fromArray(r).normalize().toArray(r),r}},kn={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Vr={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},$p={9728:zt,9729:kt,9984:vc,9985:Dr,9986:Os,9987:ei},Jp={33071:Bn,33648:gr,10497:cs},Rh={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Qh={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},ms={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},PS={CUBICSPLINE:void 0,LINEAR:Cs,STEP:Rs},Ch={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};OS=new Qe,td=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new CS,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,s=-1,r=!1,o=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;let l=a.match(/Version\/(\d+)/);s=n&&l?parseInt(l[1],10):-1,r=a.indexOf("Firefox")>-1,o=r?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&s<17||r&&o<98?this.textureLoader=new Io(this.options.manager):this.textureLoader=new Do(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Cr(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){let a={scene:o[0][s.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:s.asset,parser:n,userData:{}};return ks(r,a,s),vi(a,s),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(a)})).then(function(){for(let l of a.scenes)l.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){let o=t[s].joints;for(let a=0,l=o.length;a<l;a++)e[o[a]].isBone=!0}for(let s=0,r=e.length;s<r;s++){let o=e[s];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let s=n.clone(),r=(o,a)=>{let l=this.associations.get(o);l!=null&&this.associations.set(a,l);for(let[c,u]of o.children.entries())r(u,a.children[c])};return r(n,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let s=e(t[n]);if(s)return s}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let s=0;s<t.length;s++){let r=e(t[s]);r&&n.push(r)}return n}getDependency(e,t){let n=e+":"+t,s=this.cache.get(n);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(n,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,o){return n.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[ct.KHR_BINARY_GLTF].body);let s=this.options;return new Promise(function(r,o){n.load(Wi.resolveURL(t.uri,s.path),r,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let s=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+s)})}loadAccessor(e){let t=this,n=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){let o=Rh[s.type],a=Vr[s.componentType],l=s.normalized===!0,c=new a(s.count*o);return Promise.resolve(new Nt(c,o,l))}let r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(o){let a=o[0],l=Rh[s.type],c=Vr[s.componentType],u=c.BYTES_PER_ELEMENT,d=u*l,h=s.byteOffset||0,f=s.bufferView!==void 0?n.bufferViews[s.bufferView].byteStride:void 0,g=s.normalized===!0,y,m;if(f&&f!==d){let p=Math.floor(h/f),T="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+p+":"+s.count,A=t.cache.get(T);A||(y=new c(a,p*f,s.count*f/u),A=new Mr(y,f/u),t.cache.add(T,A)),m=new br(A,l,h%f/u,g)}else a===null?y=new c(s.count*l):y=new c(a,h,s.count*l),m=new Nt(y,l,g);if(s.sparse!==void 0){let p=Rh.SCALAR,T=Vr[s.sparse.indices.componentType],A=s.sparse.indices.byteOffset||0,v=s.sparse.values.byteOffset||0,M=new T(o[1],A,s.sparse.count*p),b=new c(o[2],v,s.sparse.count*l);a!==null&&(m=new Nt(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let R=0,x=M.length;R<x;R++){let E=M[R];if(m.setX(E,b[R*l]),l>=2&&m.setY(E,b[R*l+1]),l>=3&&m.setZ(E,b[R*l+2]),l>=4&&m.setW(E,b[R*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=g}return m})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,o=t.images[r],a=this.textureLoader;if(o.uri){let l=n.manager.getHandler(o.uri);l!==null&&(a=l)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,n){let s=this,r=this.json,o=r.textures[e],a=r.images[t],l=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[l])return this.textureCache[l];let c=this.loadImageSource(t,n).then(function(u){u.flipY=!1,u.name=o.name||a.name||"",u.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(u.name=a.uri);let h=(r.samplers||{})[o.sampler]||{};return u.magFilter=$p[h.magFilter]||kt,u.minFilter=$p[h.minFilter]||ei,u.wrapS=Jp[h.wrapS]||cs,u.wrapT=Jp[h.wrapT]||cs,u.generateMipmaps=!u.isCompressedTexture&&u.minFilter!==zt&&u.minFilter!==kt,s.associations.set(u,{textures:e}),u}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){let n=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(d=>d.clone());let o=s.images[e],a=self.URL||self.webkitURL,l=o.uri||"",c=!1;if(o.bufferView!==void 0)l=n.getDependency("bufferView",o.bufferView).then(function(d){c=!0;let h=new Blob([d],{type:o.mimeType});return l=a.createObjectURL(h),l});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let u=Promise.resolve(l).then(function(d){return new Promise(function(h,f){let g=h;t.isImageBitmapLoader===!0&&(g=function(y){let m=new jt(y);m.needsUpdate=!0,h(m)}),t.load(Wi.resolveURL(d,r.path),g,void 0,f)})}).then(function(d){return c===!0&&a.revokeObjectURL(l),vi(d,o),d.userData.mimeType=o.mimeType||FS(o.uri),d}).catch(function(d){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),d});return this.sourceCache[e]=u,u}assignTexture(e,t,n,s){let r=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),r.extensions[ct.KHR_TEXTURE_TRANSFORM]){let a=n.extensions!==void 0?n.extensions[ct.KHR_TEXTURE_TRANSFORM]:void 0;if(a){let l=r.associations.get(o);o=r.extensions[ct.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),r.associations.set(o,l)}}return s!==void 0&&(o.colorSpace=s),e[t]=o,o})}assignFinalMaterial(e){let t=e.geometry,n=e.material,s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){let a="PointsMaterial:"+n.uuid,l=this.cache.get(a);l||(l=new Ar,xn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(a,l)),n=l}else if(e.isLine){let a="LineBasicMaterial:"+n.uuid,l=this.cache.get(a);l||(l=new zn,xn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(a,l)),n=l}if(s||r||o){let a="ClonedMaterial:"+n.uuid+":";s&&(a+="derivative-tangents:"),r&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let l=this.cache.get(a);l||(l=n.clone(),r&&(l.vertexColors=!0),o&&(l.flatShading=!0),s&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(a,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return Cn}loadMaterial(e){let t=this,n=this.json,s=this.extensions,r=n.materials[e],o,a={},l=r.extensions||{},c=[];if(l[ct.KHR_MATERIALS_UNLIT]){let d=s[ct.KHR_MATERIALS_UNLIT];o=d.getMaterialType(),c.push(d.extendParams(a,r,t))}else{let d=r.pbrMetallicRoughness||{};if(a.color=new Ge(1,1,1),a.opacity=1,Array.isArray(d.baseColorFactor)){let h=d.baseColorFactor;a.color.setRGB(h[0],h[1],h[2],un),a.opacity=h[3]}d.baseColorTexture!==void 0&&c.push(t.assignTexture(a,"map",d.baseColorTexture,St)),a.metalness=d.metallicFactor!==void 0?d.metallicFactor:1,a.roughness=d.roughnessFactor!==void 0?d.roughnessFactor:1,d.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(a,"metalnessMap",d.metallicRoughnessTexture)),c.push(t.assignTexture(a,"roughnessMap",d.metallicRoughnessTexture))),o=this._invokeOne(function(h){return h.getMaterialType&&h.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(h){return h.extendMaterialParams&&h.extendMaterialParams(e,a)})))}r.doubleSided===!0&&(a.side=Wt);let u=r.alphaMode||Ch.OPAQUE;if(u===Ch.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,u===Ch.MASK&&(a.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&o!==Jn&&(c.push(t.assignTexture(a,"normalMap",r.normalTexture)),a.normalScale=new at(1,1),r.normalTexture.scale!==void 0)){let d=r.normalTexture.scale;a.normalScale.set(d,d)}if(r.occlusionTexture!==void 0&&o!==Jn&&(c.push(t.assignTexture(a,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&o!==Jn){let d=r.emissiveFactor;a.emissive=new Ge().setRGB(d[0],d[1],d[2],un)}return r.emissiveTexture!==void 0&&o!==Jn&&c.push(t.assignTexture(a,"emissiveMap",r.emissiveTexture,St)),Promise.all(c).then(function(){let d=new o(a);return r.name&&(d.name=r.name),vi(d,r),t.associations.set(d,{materials:e}),r.extensions&&ks(s,d,r),d})}createUniqueName(e){let t=Et.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,s=this.primitiveCache;function r(a){return n[ct.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(l){return jp(l,a,t)})}let o=[];for(let a=0,l=e.length;a<l;a++){let c=e[a],u=US(c),d=s[u];if(d)o.push(d.promise);else{let h;c.extensions&&c.extensions[ct.KHR_DRACO_MESH_COMPRESSION]?h=r(c):h=jp(new Pt,c,t),c.mode===kn.TRIANGLE_STRIP?h=h.then(f=>wh(f,Go)):c.mode===kn.TRIANGLE_FAN&&(h=h.then(f=>wh(f,Fr))),s[u]={primitive:c,promise:h},o.push(h)}}return Promise.all(o)}loadMesh(e){let t=this,n=this.json,s=this.extensions,r=n.meshes[e],o=r.primitives,a=[];for(let l=0,c=o.length;l<c;l++){let u=o[l].material===void 0?LS(this.cache):this.getDependency("material",o[l].material);a.push(u)}return a.push(t.loadGeometries(o)),Promise.all(a).then(async function(l){let c=l.slice(0,l.length-1),u=l[l.length-1],d=[];for(let f=0,g=u.length;f<g;f++){let y=u[f],m=o[f],p,T=c[f];if(m.mode===kn.TRIANGLES||m.mode===kn.TRIANGLE_STRIP||m.mode===kn.TRIANGLE_FAN||m.mode===void 0){let A=r.isSkinnedMesh===!0,v=y.hasAttribute("skinIndex")&&y.hasAttribute("skinWeight");A&&v===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),p=A&&v?new vo(y,T):new It(y,T),p.isSkinnedMesh===!0&&p.normalizeSkinWeights()}else if(m.mode===kn.LINES)p=new jn(y,T);else if(m.mode===kn.LINE_STRIP)p=new Ls(y,T);else if(m.mode===kn.LINE_LOOP)p=new bo(y,T);else if(m.mode===kn.POINTS)p=new To(y,T);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(p.geometry.morphAttributes).length>0&&NS(p,r),p.name=t.createUniqueName(r.name||"mesh_"+e),vi(p,r),m.extensions&&ks(s,p,m),t.assignFinalMaterial(p),d.push(p)}for(let f=0,g=d.length;f<g;f++)t.associations.set(d[f],{meshes:e,primitives:f});if(d.length===1)return r.extensions&&ks(s,d[0],r),d[0];let h=new At;r.extensions&&ks(s,h,r),t.associations.set(h,{meshes:e});for(let f=0,g=d.length;f<g;f++)h.add(d[f]);return h})}loadCamera(e){let t,n=this.json.cameras[e],s=n[n.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Dt(Sn.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):n.type==="orthographic"&&(t=new pi(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),vi(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let s=0,r=t.joints.length;s<r;s++)n.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(s){let r=s.pop(),o=s,a=[],l=[];for(let c=0,u=o.length;c<u;c++){let d=o[c];if(d){a.push(d);let h=new Qe;r!==null&&h.fromArray(r.array,c*16),l.push(h)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new So(a,l)})}loadAnimation(e){let t=this.json,n=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,o=[],a=[],l=[],c=[],u=[];for(let d=0,h=s.channels.length;d<h;d++){let f=s.channels[d],g=s.samplers[f.sampler],y=f.target,m=y.node,p=s.parameters!==void 0?s.parameters[g.input]:g.input,T=s.parameters!==void 0?s.parameters[g.output]:g.output;y.node!==void 0&&(o.push(this.getDependency("node",m)),a.push(this.getDependency("accessor",p)),l.push(this.getDependency("accessor",T)),c.push(g),u.push(y))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l),Promise.all(c),Promise.all(u)]).then(function(d){let h=d[0],f=d[1],g=d[2],y=d[3],m=d[4],p=[];for(let A=0,v=h.length;A<v;A++){let M=h[A],b=f[A],R=g[A],x=y[A],E=m[A];if(M===void 0)continue;M.updateMatrix&&M.updateMatrix();let P=n._createAnimationTracks(M,b,R,x,E);if(P)for(let D=0;D<P.length;D++)p.push(P[D])}let T=new Co(r,void 0,p);return vi(T,s),T})}createNodeMesh(e){let t=this.json,n=this,s=t.nodes[e];return s.mesh===void 0?null:n.getDependency("mesh",s.mesh).then(function(r){let o=n._getNodeRef(n.meshCache,s.mesh,r);return s.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let l=0,c=s.weights.length;l<c;l++)a.morphTargetInfluences[l]=s.weights[l]}),o})}loadNode(e){let t=this.json,n=this,s=t.nodes[e],r=n._loadNodeShallow(e),o=[],a=s.children||[];for(let c=0,u=a.length;c<u;c++)o.push(n.getDependency("node",a[c]));let l=s.skin===void 0?Promise.resolve(null):n.getDependency("skin",s.skin);return Promise.all([r,Promise.all(o),l]).then(function(c){let u=c[0],d=c[1],h=c[2];h!==null&&u.traverse(function(f){f.isSkinnedMesh&&f.bind(h,OS)});for(let f=0,g=d.length;f<g;f++)u.add(d[f]);if(u.userData.pivot!==void 0&&d.length>0){let f=u.userData.pivot,g=d[0];u.pivot=new O().fromArray(f),u.position.x-=f[0],u.position.y-=f[1],u.position.z-=f[2],g.position.set(0,0,0),delete u.userData.pivot}return u})}_loadNodeShallow(e){let t=this.json,n=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let r=t.nodes[e],o=r.name?s.createUniqueName(r.name):"",a=[],l=s._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&a.push(l),r.camera!==void 0&&a.push(s.getDependency("camera",r.camera).then(function(c){return s._getNodeRef(s.cameraCache,r.camera,c)})),s._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){a.push(c)}),this.nodeCache[e]=Promise.all(a).then(function(c){let u;if(r.isBone===!0?u=new Tr:c.length>1?u=new At:c.length===1?u=c[0]:u=new Rt,u!==c[0])for(let d=0,h=c.length;d<h;d++)u.add(c[d]);if(r.name&&(u.userData.name=r.name,u.name=o),vi(u,r),r.extensions&&ks(n,u,r),r.matrix!==void 0){let d=new Qe;d.fromArray(r.matrix),u.applyMatrix4(d)}else r.translation!==void 0&&u.position.fromArray(r.translation),r.rotation!==void 0&&u.quaternion.fromArray(r.rotation),r.scale!==void 0&&u.scale.fromArray(r.scale);if(!s.associations.has(u))s.associations.set(u,{});else if(r.mesh!==void 0&&s.meshCache.refs[r.mesh]>1){let d=s.associations.get(u);s.associations.set(u,{...d})}return s.associations.get(u).nodes=e,u}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],s=this,r=new At;n.name&&(r.name=s.createUniqueName(n.name)),vi(r,n),n.extensions&&ks(t,r,n);let o=n.nodes||[],a=[];for(let l=0,c=o.length;l<c;l++)a.push(s.getDependency("node",o[l]));return Promise.all(a).then(function(l){for(let u=0,d=l.length;u<d;u++){let h=l[u];h.parent!==null?r.add(qp(h)):r.add(h)}let c=u=>{let d=new Map;for(let[h,f]of s.associations)(h instanceof xn||h instanceof jt)&&d.set(h,f);return u.traverse(h=>{let f=s.associations.get(h);f!=null&&d.set(h,f)}),d};return s.associations=c(r),r})}_createAnimationTracks(e,t,n,s,r){let o=[],a=e.name?e.name:e.uuid,l=[];function c(f){f.morphTargetInfluences&&l.push(f.name?f.name:f.uuid)}ms[r.path]===ms.weights?(c(e),e.isGroup&&e.children.forEach(c)):l.push(a);let u;switch(ms[r.path]){case ms.weights:u=zi;break;case ms.rotation:u=ki;break;case ms.translation:case ms.scale:u=us;break;default:n.itemSize===1?u=zi:u=us;break}let d=s.interpolation!==void 0?PS[s.interpolation]:Cs,h=this._getArrayFromAccessor(n);for(let f=0,g=l.length;f<g;f++){let y=new u(l[f]+"."+ms[r.path],t.array,h,d);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(y),o.push(y)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=ed(t.constructor),s=new Float32Array(t.length);for(let r=0,o=t.length;r<o;r++)s[r]=t[r]*n;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let s=this instanceof ki?jh:pl;return new s(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}});function uM(i,e,t,n,s){let r=oi(n),o=Math.sin(Math.PI*r),a=1-yt(s);return{zDegrees:(i*(1-.35*r)+e*o)*a,xDegrees:t*o*a}}function eo(i,e,t,n="bottom-up"){let s=n==="bottom-up"?i:1-i;return yt((e-s+t)/t)}function Qm(i,e,t,n=1){return oi((i-e)/(t-e))*n}function Hl(i,e,t,n,s,r,o=.35,a=8){let l=uM(i,e,t,n,0),c=yt(s),u=Math.sign(i)*Math.min(Math.abs(i)*o,a)*(1-yt(r));return{zDegrees:l.zDegrees*(1-c)+u*c,xDegrees:l.xDegrees*(1-c)}}function eg(i,e,t,n=1){let s=.12*Math.sin(9*i+15*e),r=[[t,.68,.82],[t+.49,.36,.66],[t-.43,.34,.72]],o=0;for(let[a,l,c]of r){let u=lM(i,a+s),d=Math.exp(-.5*(u/(l*n))**2),h=yt((e-(1-c)+.09*Math.sin(11*i))/.13);o=Math.max(o,d*h)}return oi(o)}var oi,yt,lM,a1,Gl=Bt(()=>{oi=(i,e=0,t=1)=>Math.min(t,Math.max(e,i)),yt=i=>{let e=oi(i);return e*e*(3-2*e)},lM=(i,e)=>Math.atan2(Math.sin(i-e),Math.cos(i-e));a1=Object.freeze({direction:"bottom-up",spinTurns:1,axisPrecessionTurns:1,axisRetainFraction:.35,maxAxisTiltDegrees:8})});function tg(i,e,t,n,s,r,o,a,l=1){if(i.fixedOrientation)return{bodyY:0,orbitY:0,tiltX:0,tiltZ:0};let c=n.start+n.duration*(s.start+s.duration),u=n.start+n.duration*s.start,d=t.accentGlazeStart===null?t.baseGlazeStart+t.baseGlazeDuration:t.accentGlazeStart+t.accentGlazeDuration,h=yt((r-u)/(c-u)),f=.65*yt((r-t.baseGlazeStart)/(u-t.baseGlazeStart))+.35*h,g=Hl(i.axisTiltDegrees,i.axisDriftZDegrees,i.axisDriftXDegrees,o,a,yt((r-u)/(c-u)),e.axisRetainFraction,e.maxAxisTiltDegrees),y=Math.PI/180;return{bodyY:(360*(o*i.turns+f*e.spinTurns)+(i.spinPhaseDegrees??0)*(1-f))*y,orbitY:(360*(o*i.orbitTurns+f*e.axisPrecessionTurns)+(i.axisPhaseDegrees??0)*(1-f))*y,tiltX:g.xDegrees*y*l,tiltZ:g.zDegrees*y*l}}var ng=Bt(()=>{Gl()});function Wl(i){let e=i.motion.storyHeightVh-100,t=i.cadPresentation?.pages??[],n=t.length?i.motion.timing.sheetFadeStart/t.length:0;function s(o){let a=o*e;return t.forEach((l,c)=>{a+=(l.extraScrollVh??0)*Math.max(0,Math.min(1,(o-c*n)/n))}),a}function r(o){let a=0;for(let l=0;l<t.length;l++){let c=n*e+(t[l].extraScrollVh??0);if(o<=a+c)return l*n+(o-a)/c*n;a+=c}return t.length*n+(o-a)/e}return{toScrollVh:s,fromScrollVh:r}}var Pd=Bt(()=>{});function ig({spec:i,sheet:e,image:t,requestFrame:n}){let s=i.cadPresentation?.pages;if(!s)return null;let r=Wl(i),o=document.createElement("style");o.textContent=`
  .cad-pages-active img{width:calc(100% - 32px)!important;height:calc(100% - 100px)!important;cursor:zoom-in;pointer-events:auto}
  .cad-page-nav{position:absolute;bottom:18px;left:0;right:0;display:flex;gap:8px;justify-content:center;pointer-events:auto}
  .cad-page-nav button,.cad-zoom button{font:inherit;padding:8px 12px;border:1px solid #bbb;background:#fff;color:#383634;border-radius:4px;cursor:pointer}
  .cad-page-nav button[aria-current=true]{background:#383634;color:white}.cad-page-nav button{font-size:13px}
  .cad-zoom{width:96vw;max-width:1920px;height:92vh;max-height:92vh;padding:16px;border:0;border-radius:6px;background:#fff;color:#383634}
  .cad-zoom::backdrop{background:#0009}.cad-zoom header{display:flex;align-items:center;gap:12px;height:48px}.cad-zoom h2{font-size:16px;margin:0;flex:1}.cad-zoom-scroll{overflow:auto;height:calc(100% - 48px)}
  .cad-zoom img{display:block;width:100%;height:100%;object-fit:contain;max-width:none}.cad-zoom[data-zoomed=true] img{width:1800px;height:1000px;object-fit:fill}
  @media(max-width:600px){.cad-page-nav{gap:4px}.cad-page-nav button{padding:7px;font-size:11px}.cad-zoom{padding:8px}.cad-zoom h2{font-size:13px}}
  `,document.head.append(o),e.classList.add("cad-pages-active");let a=document.createElement("nav");a.className="cad-page-nav",a.setAttribute("aria-label","CAD \uB3C4\uBA74 \uC120\uD0DD"),e.append(a);let l=document.createElement("dialog");l.className="cad-zoom",l.id="cad-lightbox",l.setAttribute("aria-label","CAD \uB3C4\uBA74 \uD655\uB300");let c=document.createElement("header"),u=document.createElement("h2"),d=document.createElement("button"),h=document.createElement("button"),f=document.createElement("div"),g=document.createElement("img");d.type=h.type="button",d.textContent="\uB354 \uD06C\uAC8C",h.textContent="\uB2EB\uAE30",f.className="cad-zoom-scroll",c.append(u,d,h),f.append(g),l.append(c,f),document.body.append(l);let y=-1,m,p="",T=s.map((v,M)=>{let b=document.createElement("button");b.type="button",b.textContent=`${M+1}. ${v.title}`,b.onclick=()=>scrollTo(0,r.toScrollVh((M+.25)/s.length*i.motion.timing.sheetFadeStart)*innerHeight/100),a.append(b);let R=new Image;return R.src="./assets/"+v.file,b});function A(){!m||t.tabIndex<0||(u.textContent=m.title,g.src="./assets/"+m.file,g.alt=m.title+" \uD655\uB300 CAD \uB3C4\uBA74",l.dataset.zoomed="false",d.textContent="\uB354 \uD06C\uAC8C",p=document.body.style.overflow,document.body.style.overflow="hidden",l.showModal())}return t.setAttribute("role","button"),t.addEventListener("click",A),t.addEventListener("keydown",v=>{(v.key==="Enter"||v.key===" ")&&(v.preventDefault(),A())}),h.onclick=()=>l.close(),l.addEventListener("close",()=>{document.body.style.overflow=p,t.focus({preventScroll:!0}),n()}),l.addEventListener("click",v=>{if(v.target===l){let M=l.getBoundingClientRect();(v.clientX<M.left||v.clientX>M.right||v.clientY<M.top||v.clientY>M.bottom)&&l.close()}}),d.onclick=()=>{let v=l.dataset.zoomed!=="true";l.dataset.zoomed=String(v),d.textContent=v?"\uD654\uBA74\uC5D0 \uB9DE\uCDA4":"\uB354 \uD06C\uAC8C"},{get entry(){return m},update(v){let M=Math.min(s.length-1,Math.floor(Math.max(0,v)/i.motion.timing.sheetFadeStart*s.length));m=s[M],(y!==M||!t.src.endsWith("/"+m.file))&&(y=M,t.src="./assets/"+m.file,t.alt=m.title+" CAD \uB3C4\uBA74",t.setAttribute("aria-label",m.title+" CAD \uD655\uB300"),T.forEach((R,x)=>R.setAttribute("aria-current",String(M===x))));let b=v<i.motion.timing.sheetFadeStart;a.hidden=!b,a.style.display=b?"flex":"none",t.tabIndex=b?0:-1,t.style.pointerEvents=b?"auto":"none"}}}var sg=Bt(()=>{Pd()});function Xl({spin:i,orbit:e,tilt:t},n){if(!i||!e||!t)throw new Error("Axis rig requires spin, orbit and tilt groups");for(let s of["bodyY","orbitY","tiltX","tiltZ"])if(!Number.isFinite(n[s]))throw new Error(`Invalid axis pose ${s}`);i.rotation.y=n.bodyY,e.rotation.y=n.orbitY,t.rotation.x=n.tiltX,t.rotation.z=n.tiltZ}var p1,rg=Bt(()=>{p1=Object.freeze({right:["z",-1],left:["z",1],forward:["x",1],backward:["x",-1],none:["z",0]})});function og(i){let e=[],n=1/Math.cos(Math.PI/64);for(let{bounds:s}of i){let r=(s.min.x+s.max.x)/2,o=(s.min.z+s.max.z)/2,a=(s.max.x-s.min.x)/2*n;for(let l=0;l<64;l++)for(let c of[s.min.y,s.max.y]){let u=l*2*Math.PI/64;e.push([r+a*Math.cos(u),c,o+a*Math.sin(u)])}}return e}function Ld(i,{centerX:e,centerY:t,aspect:n,fovDegrees:s,elevation:r,azimuth:o,widthFraction:a,heightFraction:l,minDistance:c}){let u=Math.cos(o),d=Math.sin(o),h=Math.cos(r),f=Math.sin(r),g=Math.tan(s*Math.PI/360),y=c;for(let[m,p,T]of i){let A=m-e,v=p-t,M=u*A-d*T,b=-d*f*A+h*v-u*f*T,R=d*h*A+f*v+u*h*T;y=Math.max(y,R+Math.abs(M)/(g*n*a),R+Math.abs(b)/(g*l))}return y*1.005}var ag=Bt(()=>{});function cg(i,e){if(!Array.isArray(i)||i.length===0)throw new Error("Composition needs at least one element");let{fovDegrees:t,aspect:n,widthFraction:s,heightFraction:r,minDistance:o}=e;for(let[p,T,A,v]of[["fovDegrees",t,1,120],["aspect",n,.1,10],["widthFraction",s,.1,.98],["heightFraction",r,.1,.98],["minDistance",o,.01,100]])if(!Number.isFinite(T)||T<A||T>v)throw new Error(`Invalid ${p}`);let a={min:{x:1/0,y:1/0,z:1/0},max:{x:-1/0,y:-1/0,z:-1/0}};for(let p of i){if(!p.bounds||!p.position||!Number.isFinite(p.scale)||p.scale<=0)throw new Error("Missing 3D element bounds/position/scale");for(let T of["x","y","z"]){let A=p.bounds.min[T],v=p.bounds.max[T],M=p.position[T];if(![A,v,M].every(Number.isFinite)||A>v)throw new Error(`Invalid ${T} bounds`);a.min[T]=Math.min(a.min[T],M+A*p.scale),a.max[T]=Math.max(a.max[T],M+v*p.scale)}}let l=(a.min.x+a.max.x)/2,c=(a.min.y+a.max.y)/2,u=Math.tan(t*Math.PI/360),d=(a.max.x-a.min.x)/2,h=(a.max.y-a.min.y)/2,f=a.max.z,g=d/(u*n*s),y=h/(u*r);return{distance:Math.max(o,f+g,f+y),centerX:l,centerY:c,bounds:a,limitingAxis:g>=y?"width":"height"}}var lg=Bt(()=>{});function ug(i,e,t){let n=ql(t);return`#${[1,3,5].map(r=>{let o=parseInt(i.slice(r,r+2),16),a=parseInt(e.slice(r,r+2),16);return Math.round(Math.sqrt(o*o*(1-n)+a*a*n)).toString(16).padStart(2,"0")}).join("")}`}function hg(i,e=hM){let{colors:t,fadeToStudio:n,fadeToPhoto:s,lightText:r}=e,o=ql(i),a=ql((o-n.start)/(n.end-n.start)),l=ql((o-s.start)/(s.end-s.start));return{color:o<s.start?ug(t.cad,t.studio,a):ug(t.studio,t.photo,l),darkText:!(o>=r.start&&o<r.end)}}var hM,ql,dg=Bt(()=>{hM=Object.freeze({colors:{cad:"#ffffff",studio:"#202023",photo:"#f2eee9"},fadeToStudio:{start:.5666666666666667,end:.7666666666666667},fadeToPhoto:{start:.85,end:.9416666666666667},lightText:{start:.6666666666666666,end:.9083333333333333}}),ql=i=>Math.max(0,Math.min(1,i))});function fg(i,e,t){for(let n=1;n<i.length;n++){let[s,r]=i[n-1],[o,a]=i[n];if(r-.001<=t&&t<=a+.001){let l=s+(o-s)*(t-r)/(a-r);return Math.abs(e-l)<.15}}return!1}function Yl(i,e,t,n=null){return i.surface==="planar-xy"?!!n&&e&&n.normalZ>.9999&&Math.abs(n.z-i.planeZMm)<.001&&i.rectanglesMm.some(([s,r,o,a])=>n.x>=s&&n.x<=o&&n.y>=r&&n.y<=a):i.surface==="all"||e&&t>=i.minHeightMm-.001&&t<=i.maxHeightMm+.001}function dM(i){let e=oi(i);return e*e*e*(10+e*(-15+6*e))}function pg(i,e,t,n="lift-place",s=null){let r=oi((t-e.start)/e.duration),o=e.targetPositionMm.map(l=>l/1e3);if(n==="direct-drop")return[o[0],o[1]+e.dropHeightMm/1e3*(1-(s==="soft-spin"?dM(r):yt(r))),o[2]];let a=Math.max(i[1],o[1])+e.liftMm/1e3;if(r<1/3)return[i[0],i[1]+(a-i[1])*yt(r*3),i[2]];if(r<2/3){let l=yt(r*3-1);return[i[0]+(o[0]-i[0])*l,a,i[2]+(o[2]-i[2])*l]}return[o[0],a+(o[1]-a)*yt(r*3-2),o[2]]}function mg(i,e,t,n){let s=[],r=[],o=[],a=(c,u,d)=>{let h=[];for(let f=0;f<c.length;f++){let g=c[f],y=c[(f+1)%c.length],m=p=>d?p[1]<=u:p[1]>=u;if(m(g)&&h.push(g),m(g)!==m(y)){let p=(u-g[1])/(y[1]-g[1]);h.push(g.map((T,A)=>T+(y[A]-T)*p))}}return h},l=(c,u)=>{for(let d=1;d+1<c.length;d++)for(let h of[c[0],c[d],c[d+1]]){s.push(...h.slice(0,3));let f=Math.hypot(...h.slice(3));r.push(...h.slice(3).map(g=>g/f)),o.push(u)}};for(let c=0;c<i.length;c+=9){let u=[0,3,6].map(f=>[...i.slice(c+f,c+f+3),...e.slice(c+f,c+f+3)]),d=Math.min(...u.map(f=>f[1])),h=Math.max(...u.map(f=>f[1]));for(let f=1;f<80;f++){let g=n*f/80;g<=d+1e-9||g>=h-1e-9||(l(a(u,g,!0),t[c/3]),u=a(u,g,!1))}l(u,t[c/3])}return{positions:s,normals:r,exterior:o}}function gg(i,e,t){let n=e.filter(a=>a.surface==="planar-xy");if(!n.length)return{...i,surfaces:null};let s={positions:[],normals:[],exterior:[],surfaces:[]},r=[...new Set(n.flatMap(a=>a.rectanglesMm.flatMap(l=>[l[0],l[2]])))].map(a=>[0,a/1e3-t[0]]);r.push(...[...new Set(n.flatMap(a=>a.rectanglesMm.flatMap(l=>[l[1],l[3]])))].map(a=>[2,-a/1e3-t[2]]));function o(a,l,c,u){let d=[];for(let h=0;h<a.length;h++){let f=a[h],g=a[(h+1)%a.length],y=m=>u*(m[l]-c)>=0;if(y(f)&&d.push(f),y(f)!==y(g)){let m=(c-f[l])/(g[l]-f[l]);d.push(f.map((p,T)=>p+(g[T]-p)*m))}}return d}for(let a=0;a<i.positions.length;a+=9){let l=[0,3,6].map(d=>[...i.positions.slice(a+d,a+d+3),...i.normals.slice(a+d,a+d+3)]),c=[l];if(i.exterior[a/3]&&l.every(d=>d[4]>.9999)&&n.some(d=>l.every(h=>Math.abs((h[1]+t[1])*1e3-d.planeZMm)<.001)))for(let[d,h]of r)c=c.flatMap(f=>Math.min(...f.map(g=>g[d]))<h-1e-10&&Math.max(...f.map(g=>g[d]))>h+1e-10?[o(f,d,h,1),o(f,d,h,-1)]:[f]);for(let d of c)for(let h=1;h+1<d.length;h++){let f=[d[0],d[h],d[h+1]],g=[0,1,2].map(m=>f.reduce((p,T)=>p+T[m],0)/3),y={x:(g[0]+t[0])*1e3,y:-(g[2]+t[2])*1e3,z:(g[1]+t[1])*1e3,normalZ:f.reduce((m,p)=>m+p[4],0)/3};for(let m of f)s.positions.push(...m.slice(0,3)),s.normals.push(...m.slice(3)),s.exterior.push(i.exterior[a/3]),s.surfaces.push(y)}}return s}var _g=Bt(()=>{Gl()});var xg={};Gd(xg,{startMultiple:()=>fM});async function fM(i){let e=document.querySelector("#viewer"),t=document.querySelector("#story"),n=document.querySelector("#cad-sheet"),s=document.querySelector("#cad-sheet-image"),r=i.motion.lighting??{},o=new ps({antialias:!0,alpha:!0});o.setPixelRatio(Math.min(devicePixelRatio,Ri.pixelRatioCap)),o.toneMapping=Uo,o.toneMappingExposure=r.exposure??Ri.exposure,e.appendChild(o.domElement);let a=new Fi,l=new Dt(Ri.fov,1,Ri.near,Ri.far);a.add(new Hi(Ri.skyColor,Ri.groundColor,Ri.hemisphereIntensity));for(let[re,ge,de,B]of Ri.pointLights){let G=new Ns(Ri.keyColor,B*(r.pointLightScale??1));G.position.set(re,ge,de),a.add(G)}let c=i.motion.timing,u=i.motion.layout,d=i.motion.glaze,h=i.assembly,f=h?.mode==="direct-drop",g=h?h.start:c.photoStart,y=i.ending==="photos",m=y?c.photoStart+c.photoDuration:c.photoStart,p=c.cadEnd+(1-c.cadEnd)*m,T=Wl(i),A=T.toScrollVh(p);t.style.height=`${100+A}vh`;let v="",M=!1,b=!1,R=!1,x={frames:0,lastCpuMs:0};function E(){b&&!R&&(R=!0,requestAnimationFrame(ne))}function P(){l.aspect=innerWidth/innerHeight,l.updateProjectionMatrix(),o.setSize(innerWidth,innerHeight);let re=innerWidth>700?"desktop":innerHeight<760?"mobile-short":"mobile";re!==v&&(v=re,s.src="./assets/"+(i.cadPresentation?.pages[0]||i.sheets[re]).file),E()}addEventListener("resize",P),P(),await s.decode();let D=new Map,V=new Map,W=(re,ge)=>(D.has(re)||D.set(re,ge()),D.get(re)),L=await Promise.all(i.parts.map(async re=>{let ge=re.shapeKind==="feature-solid",de=re.geometryAssetId||re.id,B=ge?await W("guide:"+de,()=>fetch(`./assets/${de}/wire-guide.json`).then(ee=>ee.json())):null;if(ge&&B.sourceStepSha256!==re.sourceStepSha256)throw Error("Feature guide source mismatch");let G=ge?null:await fetch(`./assets/${re.id}/outer-profile.json`).then(ee=>{if(!ee.ok)throw Error("Profile failed");return ee.json()}),ae=await W("model:"+de,()=>new gs().loadAsync(`./assets/${de}/model.glb`)),fe=re.surfaceRegions?await W("regions:"+de,()=>fetch(`./assets/${de}/${re.surfaceRegions.file}`).then(ee=>ee.json())):null;if(fe&&fe.sourceGlbSha256!==re.surfaceRegions.sourceGlbSha256)throw Error("Feature surface source mismatch");let ce=[];if(ae.scene.traverse(ee=>{ee.isMesh&&ce.push(ee)}),!ce.length||!ge&&ce.length!==1)throw Error("Missing complete mesh");ae.scene.updateMatrixWorld(!0);let me,xe=[],we=null;if(fe&&fe.primitiveExterior.length!==ce.length)throw Error("Feature surface primitive mismatch");let oe=ge?[(re.boundsMm.minX+re.boundsMm.maxX)/2e3,re.boundsMm.minZ/1e3,-(re.boundsMm.minY+re.boundsMm.maxY)/2e3]:[0,0,0];if(ge){let ee=ce.map((Ee,De)=>{let C=Ee.geometry.clone().applyMatrix4(Ee.matrixWorld);C.index&&(C=C.toNonIndexed());for(let he=0;he<C.attributes.position.count;he++)xe.push(fe?fe.primitiveExterior[De]:!1);for(let he of Object.keys(C.attributes))["position","normal"].includes(he)||C.deleteAttribute(he);return C.attributes.normal||C.computeVertexNormals(),C});if(me=Xp(ee),!me)throw Error("Feature mesh merge failed");me.translate(-oe[0],-oe[1],-oe[2])}else{let ee=ce[0];ee.updateWorldMatrix(!0,!1),me=ee.geometry.clone().applyMatrix4(ee.matrixWorld)}if(ge&&re.coatings&&re.surfaceRegions){let ee=mg(me.attributes.position.array,me.attributes.normal.array,xe,re.dimensionsMm.height/1e3);ee=gg(ee,[...re.coatings.layers.map(Ee=>Ee.region),re.coatings.fired.region],oe),we=ee.surfaces,me.dispose(),me=new Pt,me.setAttribute("position",new Lt(ee.positions,3)),me.setAttribute("normal",new Lt(ee.normals,3)),xe=ee.exterior}me.computeBoundingBox();let Z=re.dimensionsMm.height/1e3;if(Math.abs(me.boundingBox.max.y-me.boundingBox.min.y-Z)>.001)throw Error("CAD/model height drift");let se=new At,_e=new At,Ae=new At,Ye=new At;a.add(se),se.add(_e),_e.add(Ae),Ae.add(Ye),Ye.position.y=-(me.boundingBox.min.y+me.boundingBox.max.y)/2;let Re=re.glazePreview,He=new Ge(Re.clayHex),I=new Ge(Re.baseHex),Ze=new Ge(Re.baseWarmHex||Re.baseHex),Oe=new Ge(Re.accentHex),w=new Ge(Re.accentWarmHex||Re.accentHex),_=JSON.stringify([de,Re,re.coatings,re.accentEnabled,re.accentCenterAngle,re.accentWidthScale]),U=V.get(_)||{values:[],stamp:""},k=me.attributes.position,$=U.values;if(!V.has(_))for(let ee=0;ee<k.count;ee++){let Ee=oi(k.getY(ee)/Z),De=Math.atan2(k.getZ(ee),k.getX(ee));$.push({surface:we?.[ee],fraction:Ee,heightMm:k.getY(ee)*1e3,exterior:ge?re.surfaceRegions?xe[ee]:!0:fg(G,Math.hypot(k.getX(ee),k.getZ(ee))*1e3,k.getY(ee)*1e3),coverage:eg(De,Ee,re.accentCenterAngle,re.accentWidthScale),base:I.clone().lerp(Ze,.2+.09*Math.sin(De*5+Ee*12)),accent:Oe.clone().lerp(w,Re.accentWarmMix||0)})}let ue=U.colours||new Nt(new Float32Array(k.count*3),3);if(U.colours=ue,V.set(_,U),me.setAttribute("color",ue),re.coatings&&!U.palettes){let ee=re.coatings,Ee=new Map,De=C=>(Ee.has(C)||Ee.set(C,new Ge(C).toArray()),Ee.get(C));U.palettes=$.map(C=>{let he=Yl(ee.fired.region,C.exterior,C.heightMm,C.surface)?ee.fired.regionHex:ee.fired.baseHex;return{first:Yl(ee.layers[0].region,C.exterior,C.heightMm,C.surface),second:!!ee.layers[1]&&Yl(ee.layers[1].region,C.exterior,C.heightMm,C.surface),firstRGB:De(ee.layers.length===1?he:ee.layers[0].previewHex),lastRGB:De(he)}})}let pe=new(ge?Qt:Cn)({vertexColors:!0,roughness:.9,side:Wt,transparent:!0,opacity:0,...ge?{clearcoat:Re.clearcoat||0}:{}});r.softPartIds?.includes(re.id)&&(pe.onBeforeCompile=ee=>{ee.uniforms.ceramicDirectLightScale={value:r.softPointLightScale??1},ee.fragmentShader=`uniform float ceramicDirectLightScale;
`+ee.fragmentShader,ee.fragmentShader=ee.fragmentShader.replace("#include <lights_fragment_end>",`#include <lights_fragment_end>
          reflectedLight.directDiffuse *= ceramicDirectLightScale;
          reflectedLight.directSpecular *= ceramicDirectLightScale;
          #ifdef USE_CLEARCOAT
          clearcoatSpecularDirect *= ceramicDirectLightScale;
          #endif`)},pe.customProgramCacheKey=()=>"ceramic-part-direct-light");let J=new It(me,pe);Ye.add(J);let ie=[];if(ge)for(let ee=0;ee<B.positionsYUpMetres.length;ee++)ie.push(B.positionsYUpMetres[ee]-oe[ee%3]);else for(let ee=0;ee<G.length;ee++){let[Ee,De]=G[ee];if(ee%4===0||ee===G.length-1)for(let C=0;C<72;C++){let he=C/72*Math.PI*2,Q=(C+1)/72*Math.PI*2;ie.push(Ee/1e3*Math.cos(he),De/1e3,Ee/1e3*Math.sin(he),Ee/1e3*Math.cos(Q),De/1e3,Ee/1e3*Math.sin(Q))}if(ee)for(let C=0;C<12;C++){let he=C/12*Math.PI*2,[Q,ye]=G[ee-1];ie.push(Q/1e3*Math.cos(he),ye/1e3,Q/1e3*Math.sin(he),Ee/1e3*Math.cos(he),De/1e3,Ee/1e3*Math.sin(he))}}let ve=new zn({color:Qs,transparent:!0,opacity:0,depthWrite:!1}),ze=new Pt;ze.setAttribute("position",new Lt(ie,3)),Ye.add(new jn(ze,ve));function be(ee,Ee){let De=ee.toFixed(4)+":"+Ee.toFixed(4);if(De!==U.stamp){U.stamp=De;for(let C=0;C<$.length;C++){let he=$[C];if(re.coatings){let Q=U.palettes[C],ye=ee>0&&Q.first?eo(he.fraction,ee,c.surfaceSweepWidth):0,Te=Ee>0&&Q.second?eo(he.fraction,Ee,c.surfaceSweepWidth):0,le=He.r+(Q.firstRGB[0]-He.r)*ye,Pe=He.g+(Q.firstRGB[1]-He.g)*ye,Ue=He.b+(Q.firstRGB[2]-He.b)*ye;ue.setXYZ(C,le+(Q.lastRGB[0]-le)*Te,Pe+(Q.lastRGB[1]-Pe)*Te,Ue+(Q.lastRGB[2]-Ue)*Te)}else{let Q=eo(he.fraction,ee,c.surfaceSweepWidth,d.direction),ye=re.accentEnabled?eo(he.fraction,Ee,c.surfaceSweepWidth,d.direction)*he.coverage*Q:0,Te=He.clone().lerp(ge?I:he.base,Q).lerp(he.accent,ye);ue.setXYZ(C,Te.r,Te.g,Te.b)}}ue.needsUpdate=!0}pe.roughness=.9-.57*ee,ge&&(pe.roughness=.9+(Re.roughness-.9)*ee,pe.clearcoat=Re.clearcoat>0?Math.max(1e-8,Re.clearcoat*ee):0),re.coatings&&(pe.roughness=.9+(re.coatings.roughness-.9)*Math.max(ee,Ee))}let Se=document.querySelector(`[data-part="${re.id}"]`);return await Se.querySelector("img").decode(),{id:re.id,part:re,profile:G,feature:ge,height:Z,main:se,orbit:_e,tilt:Ae,spin:Ye,solid:J,geometry:me,material:pe,wireMaterial:ve,wireGeometry:ze,front:Se,paint:be,values:$}})),z=f?L.map(re=>{let ge=h.steps.find(ce=>ce.partId===re.id),de=re.geometry.attributes.position,B=0;for(let ce=0;ce<de.count;ce++)B=Math.max(B,Math.hypot(de.getX(ce),de.getZ(ce)));re.part.motion.varyingDropAxis&&(B+=re.height/2*Math.sin(Sn.degToRad(d.maxAxisTiltDegrees)));let[G,ae,fe]=ge.targetPositionMm.map(ce=>ce/1e3);return{bounds:{min:{x:G-B,y:ae,z:fe-B},max:{x:G+B,y:ae+ge.dropHeightMm/1e3+re.height,z:fe+B}},position:{x:0,y:0,z:0},scale:1}}):null,K=ig({spec:i,sheet:n,image:s,requestFrame:E}),H=new Set,te=new Set;for(let re of L){let ge=re.part.sourcePartId||re.id;H.has(ge)||(H.add(ge),te.add(re.id))}let N=f?L.flatMap((re,ge)=>{if(!re.part.motion.fixedOrientation)return og([z[ge]]);let de=re.geometry.boundingBox,B=h.steps.find(me=>me.partId===re.id),[G,ae,fe]=B.targetPositionMm.map(me=>me/1e3),ce=[];for(let me of[de.min.x,de.max.x])for(let xe of[de.min.z,de.max.z])for(let we of[0,re.height+B.dropHeightMm/1e3])ce.push([G+me,ae+we,fe+xe]);return ce}):null;function Y(re,ge){if(K&&!te.has(re.id)){re.front.style.opacity="0";return}if(ge<c.frontMoveStart||ge>=c.frontFadeStart+c.frontFadeDuration){re.front.style.opacity="0";return}let de=K?.entry||i.sheets[v],B=de.frontBoxes[re.id],G=s.getBoundingClientRect();if(!B){re.front.style.opacity="0";return}let ae=Math.min(G.width/de.pagePx[0],G.height/de.pagePx[1]),fe=de.pagePx[0]*ae,ce=de.pagePx[1]*ae,me={x:G.left+(G.width-fe)/2+fe*B.cx,y:G.top+(G.height-ce)/2+ce*B.cy,w:fe*B.width,h:ce*B.height},xe=1/0,we=-1/0,oe=1/0,Z=-1/0,se=new O,_e=()=>{se.applyMatrix4(re.spin.matrixWorld).project(l);let Ze=(se.x+1)*innerWidth/2,Oe=(1-se.y)*innerHeight/2;xe=Math.min(xe,Ze),we=Math.max(we,Ze),oe=Math.min(oe,Oe),Z=Math.max(Z,Oe)};if(re.feature){let Ze=re.geometry.attributes.position;for(let Oe=0;Oe<Ze.count;Oe++)se.fromBufferAttribute(Ze,Oe),_e()}else for(let[Ze,Oe]of re.profile)for(let w of[-1,1])se.set(w*Ze/1e3,Oe/1e3,0),_e();let Ae=yt((ge-c.frontMoveStart)/c.frontMoveDuration),Ye=me.x+((xe+we)/2-me.x)*Ae,Re=me.y+((oe+Z)/2-me.y)*Ae,He=me.w+(we-xe-me.w)*Ae,I=me.h+(Z-oe-me.h)*Ae;Object.assign(re.front.style,{left:`${Ye-He/2}px`,top:`${Re-I/2}px`,width:`${He}px`,height:`${I}px`,opacity:String(ge>=c.frontMoveStart?1-yt((ge-c.frontFadeStart)/c.frontFadeDuration):0)})}function ne(){R=!1;let re=performance.now(),de=scrollY>=document.documentElement.scrollHeight-innerHeight-1?p:Math.min(p,T.fromScrollVh(scrollY/innerHeight*100)),B=oi((de-c.cadEnd)/(1-c.cadEnd)),G=innerWidth<600;K?.update(de);let ae=[];for(let Z of L){let se=Z.part.motion,_e=yt((B-c.dropStart-se.dropDelay)/(c.dropDuration*(se.dropDurationScale??1))),Ae=yt((B-c.settleStart-se.dropDelay)/c.settleDuration),Ye=G?se.entryXMobile:se.entryXDesktop,Re=h?.steps.find(be=>be.partId===Z.id),He=f?Re.targetPositionMm[0]/1e3:G?se.finalXMobile:se.finalXDesktop,I=f?(Re.targetPositionMm[1]+Re.dropHeightMm)/1e3:0,Ze=f?Re.targetPositionMm[2]/1e3:0;Z.main.position.set(Ye+(He-Ye)*_e,((G?u.mobileEntryY:u.desktopEntryY)+(se.entryYOffset??0))*(1-_e)+(I+Z.height*se.settledScale/2)*_e+Math.sin(_e*Math.PI*3)*u.dropBounceY*(1-_e),(se.entryZ??u.entryZ)*(1-_e)+Ze*_e);let Oe=G?se.cadToWireScaleMobile:se.cadToWireScale;Z.main.scale.setScalar(Oe+(se.settledScale-Oe)*_e);let w=c.accentGlazeStart===null?c.baseGlazeStart+c.baseGlazeDuration:c.accentGlazeStart+c.accentGlazeDuration,_=Hl(se.axisTiltDegrees,se.axisDriftZDegrees,se.axisDriftXDegrees,_e,Ae,yt((B-w)/(g-w)),d.axisRetainFraction,d.maxAxisTiltDegrees),U=yt((de-c.axisFadeStart)/c.axisFadeDuration),k=f&&h.landing==="soft-spin",$=k?h.start+h.duration*(Re.start+Re.duration):g,ue=be=>k?yt((B-c.baseGlazeStart)/($-c.baseGlazeStart))*be:Qm(B,c.baseGlazeStart,$,be),pe=ue(d.spinTurns);Xl(Z,{bodyY:(_e*se.turns+pe)*2*Math.PI,orbitY:(_e*se.orbitTurns+ue(d.axisPrecessionTurns))*2*Math.PI,tiltX:Sn.degToRad(_.xDegrees)*U,tiltZ:Sn.degToRad(_.zDegrees)*U}),se.fixedOrientation?Xl(Z,{bodyY:0,orbitY:0,tiltX:0,tiltZ:0}):f&&se.varyingDropAxis&&Xl(Z,tg(se,d,c,h,Re,B,_e,Ae,U));let J=yt((B-c.clayStart-se.dropDelay)/c.clayDuration),ie=yt((B-c.baseGlazeStart)/c.baseGlazeDuration),ve=c.accentGlazeStart===null?0:yt((B-c.accentGlazeStart)/c.accentGlazeDuration);if(Z.material.opacity=J,Z.material.depthWrite=J>.98,Z.wireMaterial.opacity=(1-J)*yt((de-c.wireFadeStart)/c.wireFadeDuration),Z.material.visible=J>0,Z.wireMaterial.visible=Z.wireMaterial.opacity>0,J>0&&Z.paint(ie,ve),Z.state={drop:_e,clay:J,base:ie,accent:ve,turns:pe},h&&B>=h.start){let be=h.steps.find(he=>he.partId===Z.id),Se=oi((B-h.start)/h.duration),ee=[Z.main.position.x,Z.main.position.y-Z.height/2,Z.main.position.z],[Ee,De,C]=pg(ee,be,Se,h.mode,h.landing);Z.main.position.set(Ee,De+Z.height/2,C),Z.state.assembly=Se}Z.spin.updateWorldMatrix(!0,!1);let ze=Z.geometry.boundingBox.clone().applyMatrix4(Z.spin.matrixWorld);ae.push({bounds:ze,position:{x:0,y:0,z:0},scale:1})}let fe=i.motion.framing,ce=f?Math.min(...L.map(Z=>Z.state.drop)):0,me=f?ae.map((Z,se)=>{let _e={min:{},max:{}};for(let Ae of["min","max"])for(let Ye of["x","y","z"])_e[Ae][Ye]=Z.bounds[Ae][Ye]*(1-ce)+z[se].bounds[Ae][Ye]*ce;return{bounds:_e,position:{x:0,y:0,z:0},scale:1}}):ae,xe=cg(me,{fovDegrees:l.fov,aspect:l.aspect,widthFraction:G?fe.mobileWidthFraction:fe.desktopWidthFraction,heightFraction:G?fe.mobileHeightFraction:fe.desktopHeightFraction,minDistance:fe.minDistance});if(l.position.set(xe.centerX,xe.centerY,xe.distance),l.lookAt(xe.centerX,xe.centerY,0),l.updateMatrixWorld(),i.motion.camera.elevationDegrees){let Z=Sn.degToRad(i.motion.camera.elevationDegrees)*yt((de-c.wireFadeStart)/c.wireFadeDuration),se=xe.distance;for(let _e=0;_e<12;_e++){l.position.set(xe.centerX,xe.centerY+se*Math.sin(Z),se*Math.cos(Z)),l.lookAt(xe.centerX,xe.centerY,0),l.updateMatrixWorld();let Ae=1;for(let Ye of me)for(let Re of[Ye.bounds.min.x,Ye.bounds.max.x])for(let He of[Ye.bounds.min.y,Ye.bounds.max.y])for(let I of[Ye.bounds.min.z,Ye.bounds.max.z]){let Ze=new O(Re,He,I).project(l);Ae=Math.max(Ae,Math.abs(Ze.x)/(G?fe.mobileWidthFraction:fe.desktopWidthFraction),Math.abs(Ze.y)/(G?fe.mobileHeightFraction:fe.desktopHeightFraction))}if(Ae<=1.001)break;se*=Ae*1.01}}if(fe.envelope==="radial-drop"){let Z=xe.centerY+((fe.focusY??xe.centerY)-xe.centerY)*ce,se=yt((de-c.wireFadeStart)/c.wireFadeDuration),_e=Sn.degToRad(i.motion.camera.elevationDegrees||0)*se,Ae=Sn.degToRad(i.motion.camera.azimuthDegrees||0)*se,Ye=Ld(N,{centerX:xe.centerX,centerY:Z,aspect:l.aspect,fovDegrees:l.fov,elevation:_e,azimuth:Ae,widthFraction:G?fe.mobileWidthFraction:fe.desktopWidthFraction,heightFraction:G?fe.mobileHeightFraction:fe.desktopHeightFraction,minDistance:fe.minDistance}),He=l.position.distanceTo(new O(xe.centerX,Z,0))*(1-ce)+Ye*ce;if(ce<1){let I=[];for(let{bounds:Ze}of ae)for(let Oe of[Ze.min.x,Ze.max.x])for(let w of[Ze.min.y,Ze.max.y])for(let _ of[Ze.min.z,Ze.max.z])I.push([Oe,w,_]);He=Math.max(He,Ld(I,{centerX:xe.centerX,centerY:Z,aspect:l.aspect,fovDegrees:l.fov,elevation:_e,azimuth:Ae,widthFraction:G?fe.mobileWidthFraction:fe.desktopWidthFraction,heightFraction:G?fe.mobileHeightFraction:fe.desktopHeightFraction,minDistance:fe.minDistance}))}l.position.set(xe.centerX+He*Math.sin(Ae)*Math.cos(_e),Z+He*Math.sin(_e),He*Math.cos(Ae)*Math.cos(_e)),l.lookAt(xe.centerX,Z,0),l.updateMatrixWorld()}n.style.opacity=String(1-yt((de-c.sheetFadeStart)/c.sheetFadeDuration));for(let Z of L)Y(Z,de);let we=y?yt((B-c.photoStart)/c.photoDuration):0;e.style.opacity=String(1-we),e.setAttribute("aria-hidden",we>=.999?"true":"false");let oe=hg(de,{...i.motion.background,fadeToPhoto:{start:y?c.cadEnd+(1-c.cadEnd)*c.photoStart:2,end:y?p:3}});document.body.style.backgroundColor=oe.color,window.__multiplePage={spec:i,vessels:L,camera:l,progress:de,motionProgress:B,endProgress:p,scrollVhAt:T.toScrollVh,loaded:!0,exit:we,renderStats:x},x.updateCpuMs=performance.now()-re,M||o.render(a,l),x.frames++,x.lastCpuMs=performance.now()-re,x.renderCpuMs=x.lastCpuMs-x.updateCpuMs}y&&to({gallery:document.querySelector("#gallery"),story:t,isActive:()=>scrollY/innerHeight*100>=A-.2,onActiveChange:re=>{M=re,E()},profile:no,source:"multiple-page-review"}),addEventListener("scroll",E,{passive:!0}),s.addEventListener("load",E),await o.compileAsync(a,l),o.render(a,l);let Me=o.getContext(),Ne=Me.fenceSync(Me.SYNC_GPU_COMMANDS_COMPLETE,0);Me.flush(),await new Promise(re=>{let ge=()=>{if(Me.clientWaitSync(Ne,0,0)===Me.TIMEOUT_EXPIRED){setTimeout(ge,16);return}Me.deleteSync(Ne),re()};ge()}),b=!0,ne()}var Ri,yg=Bt(()=>{ng();Pd();sg();_a();xa();yi();Ah();ml();Gl();rg();ag();lg();dg();Jl();jl();_g();Ri=js.multiple});function pM(i){if(!i||!Sg[i.tiltDirection])throw new Error("A reviewed tiltDirection is required");for(let e of["tiltDegrees","bodySpinDegrees","axisPrecessionDegrees"])if(!Number.isFinite(i[e])||i[e]<0||i[e]>1440)throw new Error(`Invalid axis motion ${e}`);if(i.tiltDegrees>90)throw new Error("Axis tilt exceeds supported preview range");if(!i.provenance)throw new Error("Axis motion provenance is required");return i}function Mg(i,e){pM(e);let t=vg(i),n=vg(t/.4),s=n*n*(3-2*n),[r,o]=Sg[e.tiltDirection];return{bodyY:Zl(e.bodySpinDegrees*t),orbitY:Zl(e.axisPrecessionDegrees*t),tiltX:r==="x"?Zl(o*e.tiltDegrees*s):0,tiltZ:r==="z"?Zl(o*e.tiltDegrees*s):0,progress:t,tiltDegrees:e.tiltDegrees*s}}function bg({spin:i,orbit:e,tilt:t},n){if(!i||!e||!t)throw new Error("Axis rig requires spin, orbit and tilt groups");for(let s of["bodyY","orbitY","tiltX","tiltZ"])if(!Number.isFinite(n[s]))throw new Error(`Invalid axis pose ${s}`);i.rotation.y=n.bodyY,e.rotation.y=n.orbitY,t.rotation.x=n.tiltX,t.rotation.z=n.tiltZ}var vg,Zl,Sg,Tg=Bt(()=>{vg=i=>Math.min(1,Math.max(0,i)),Zl=i=>i*Math.PI/180,Sg=Object.freeze({right:["z",-1],left:["z",1],forward:["x",1],backward:["x",-1],none:["z",0]})});var Eg={};Gd(Eg,{startHandled:()=>mM});async function mM(i=null,e=null){let t=js.handled,n=t.timing,s=await fetch("./review-input.json").then(oe=>oe.json()),r=s.shapeKind==="feature-solid"?[(s.boundsMm.minX+s.boundsMm.maxX)/2e3,0,-(s.boundsMm.minY+s.boundsMm.maxY)/2e3]:[0,0,0],o=innerWidth>innerHeight?"desktop":innerHeight<=740?"mobile-short":"mobile",a=document.querySelector("#sheet"),l=document.querySelector("#sheet-image");l.src="./"+s.layouts[o].file,await l.decode();let c=document.querySelector("#front"),u=document.querySelector("#viewer"),d=await new gs().loadAsync("./model.glb"),h=await fetch("./wire-guide.json").then(oe=>oe.json()),f=await fetch("./motion-config.json").then(oe=>oe.json()),g=h.visibility||h.density.handledVisibility;if(s.shapeKind==="feature-solid"?h.sourceStepSha256!==s.sourceSha256.step:h.sourceSha256.handle!==s.sourceSha256.handle||h.sourceSha256.profile!==s.sourceSha256.profile)throw new Error("3D wire guide differs from solid inputs");let y=new ps({antialias:!0,alpha:!0});y.localClippingEnabled=!0,y.setPixelRatio(Math.min(devicePixelRatio,t.pixelRatioCap)),u.appendChild(y.domElement);let m=new Fi,p=new pi,T=new At;m.add(T);let A=new At;T.add(A);let v=new At;A.add(v);let M=new At;v.add(M);let b=new At;M.add(b),m.add(new Hi(t.skyColor,t.groundColor,t.hemisphereIntensity));let R=new Gi(t.keyColor,t.keyIntensity);R.position.set(...t.keyPosition),m.add(R);let x=new Cn({color:t.clayColor,roughness:t.clayRoughness,side:Wt,transparent:!0,opacity:0,depthWrite:!1}),E=new zn({color:Qs,transparent:!0,opacity:0,depthWrite:!1}),P=[],D=[],V=new rn(new O(0,-1,0),-10),W=new rn(new O(0,1,0),10),L=i?new Qt({color:i.surface.glazeHex,roughness:i.surface.roughness,clearcoat:i.surface.clearcoat,side:Wt,clippingPlanes:[V]}):null;if(i&&x.color.set(i.surface.clayHex),d.scene.updateMatrixWorld(!0),d.scene.traverse(oe=>{if(!oe.isMesh)return;let Z=oe.geometry.clone();Z.applyMatrix4(oe.matrixWorld),s.shapeKind==="feature-solid"&&Z.translate(-r[0],0,-r[2]),Z.computeBoundingBox();let se=new It(Z,x);if(b.add(se),P.push(se),L){let _e=new It(Z,L);_e.visible=!1,_e.renderOrder=1,b.add(_e),D.push(_e)}}),!P.length)throw new Error("GLB contains no mesh");let z=new Pt;z.setAttribute("position",new Lt(h.positionsYUpMetres,3)),s.shapeKind==="feature-solid"&&z.translate(-r[0],0,-r[2]);let K=new jn(z,E);M.add(K);let H={...s.boundsMm};if(s.shapeKind==="feature-solid"){let oe=(H.minX+H.maxX)/2,Z=(H.minY+H.maxY)/2;H.minX-=oe,H.maxX-=oe,H.minY-=Z,H.maxY-=Z}let te=new O((H.minX+H.maxX)/2e3,(H.minZ+H.maxZ)/2e3,0);v.position.y=te.y,M.position.y=-te.y;let N=Math.max((H.maxX-H.minX)/1e3,(H.maxZ-H.minZ)/1e3),Y=0;function ne(){y.setSize(innerWidth,innerHeight);let oe=innerWidth/innerHeight,Z=Math.max(Math.abs(H.minX),Math.abs(H.maxX))/1e3;Y=Math.max((H.maxZ-H.minZ)/1e3*t.heightFit,Z*t.radialFit/oe),p.left=-Y*oe,p.right=Y*oe,p.top=Y,p.bottom=-Y,p.near=.001,p.far=10,p.updateProjectionMatrix()}ne(),addEventListener("resize",ne);let Me=new O;function Ne(oe){m.updateMatrixWorld(!0),p.updateMatrixWorld(!0);let Z=0,se=0;for(let Ye of P){let Re=Ye.geometry.boundingBox;for(let He of[Re.min.x,Re.max.x])for(let I of[Re.min.y,Re.max.y])for(let Ze of[Re.min.z,Re.max.z])Me.set(He,I,Ze).applyMatrix4(Ye.matrixWorld),s.shapeKind==="feature-solid"?(Me.applyMatrix4(p.matrixWorldInverse),Z=Math.max(Z,Math.abs(Me.x)),se=Math.max(se,Math.abs(Me.y))):(Z=Math.max(Z,Math.abs(Me.x-oe)),se=Math.max(se,Math.abs(Me.y-te.y)))}let _e=innerWidth/innerHeight,Ae=Math.max(Y,Z*t.rotationMargin/_e,se*t.rotationMargin);p.left=-Ae*_e,p.right=Ae*_e,p.top=Ae,p.bottom=-Ae,p.updateProjectionMatrix()}function re(){p.updateMatrixWorld();let oe=new O(H.minX/1e3,H.maxZ/1e3,0).project(p),Z=new O(H.maxX/1e3,H.minZ/1e3,0).project(p);return{x:(oe.x+1)*innerWidth/2,y:(1-oe.y)*innerHeight/2,width:(Z.x-oe.x)*innerWidth/2,height:(oe.y-Z.y)*innerHeight/2}}function ge(){let oe=l.getBoundingClientRect(),Z=s.layouts[o].frontBox;return{x:oe.x+oe.width*(Z.cx-Z.width/2),y:oe.y+oe.height*(Z.cy-Z.height/2),width:oe.width*Z.width,height:oe.height*Z.height}}let de=oe=>Math.min(1,Math.max(0,oe)),B=(oe,Z,se)=>oe+(Z-oe)*se,G={},ae=i?.ending==="photos",fe=document.querySelector("#story"),ce=ae?1+n.photoDuration:1,me=i?i.motion.storyHeightVh-100:t.previewScrollVh;if(i&&(fe.style.height=`${100+me*ce}vh`),ae){let{installGallery:oe,galleryProfile:Z}=e;oe({gallery:document.querySelector("#gallery"),story:fe,isActive:()=>scrollY/innerHeight*100>=me*ce-.2,profile:Z,source:"handled-page-review"})}let xe=Math.hypot(Math.max(Math.abs(H.minX),Math.abs(H.maxX)),(H.maxZ-H.minZ)/2,Math.max(Math.abs(H.minY),Math.abs(H.maxY)))/1e3*1.01;function we(){let oe=scrollY/(innerHeight*me/100);i&&scrollY>=document.documentElement.scrollHeight-innerHeight-1&&(oe=ce);let Z=de(i?oe/n.pageClayEnd:oe),se=i?de((oe-n.pageClayEnd)/n.pageCoatDuration):0,_e=ae?de((oe-1)/n.photoDuration):0,Ae=de((Z-n.turnStart)/n.turnDuration),Ye=Mg(Ae,f);i&&(Ye.bodyY+=se*Math.PI*2,Ye.orbitY+=se*Math.PI*2,Ye.tiltX*=1-se,Ye.tiltZ*=1-se),bg({spin:M,orbit:T,tilt:A},Ye);let Re=B(te.x,0,de(Ae/n.lookCenterDuration)),He=g.entryView,I=de((Z-He.start)/(He.end-He.start)),Ze=I*I*(3-2*I),Oe=de((Z-g.clayStart)/(g.clayEnd-g.clayStart)),w=He.elevationDegrees*Ze*(He.releaseWithClay?1-Oe:1)+(i?.motion.surfaceElevationDegrees??0)*Oe,_=Sn.degToRad(w);p.position.set(Re,te.y+N*t.cameraDistanceFactor*Math.sin(_),N*t.cameraDistanceFactor*Math.cos(_)),p.lookAt(Re,te.y,0),Ne(Re);let U=ge(),k=re(),$=de((Z-n.frontTravelStart)/n.frontTravelDuration),ue={x:B(U.x,k.x,$),y:B(U.y,k.y,$),width:B(U.width,k.width,$),height:B(U.height,k.height,$)};c.style.left=ue.x+"px",c.style.top=ue.y+"px",c.style.width=ue.width+"px",c.style.height=ue.height+"px",c.style.opacity=String(Z<n.frontStart?0:Z<n.frontFadeStart?1:1-de((Z-n.frontFadeStart)/n.frontFadeDuration)),a.style.opacity=String(1-de((Z-n.sheetFadeStart)/n.sheetFadeDuration)),u.style.opacity=String(de((Z-n.hostFadeStart)/n.hostFadeDuration)*(1-_e)),E.opacity=de((Z-n.wireStart)/n.wireDuration)*(1-de((Z-g.wireFadeStart)/(g.wireFadeEnd-g.wireFadeStart))),x.opacity=de((Z-g.clayStart)/(g.clayEnd-g.clayStart)),x.depthWrite=x.opacity>.98,i&&(V.constant=te.y-xe+2*xe*se,W.constant=-V.constant,x.clippingPlanes=se>0?[W]:null,D.forEach(pe=>pe.visible=se>0),P.forEach(pe=>pe.visible=se<1)),y.render(m,p),G={pageProgress:oe,coat:se,exit:_e,endProgress:ce,progress:Z,layout:o,source:U,target:k,front:ue,bodySpinDegrees:f.bodySpinDegrees*Ae,axisPrecessionDegrees:f.axisPrecessionDegrees*Ae,axisTiltDegrees:Ye.tiltDegrees,lookX:Re,cameraElevationDegrees:w,frontOpacity:Number(c.style.opacity),lineOpacity:E.opacity,clayOpacity:x.opacity},requestAnimationFrame(we)}we(),window.__mugMotion={renderer:y,scene:m,settings:s,motion:f,get state(){return G},meshes:P,model:b,camera:p,wire:K,content:M,orbitRig:T,tiltRig:A,pivot:v,glazeMeshes:D,clip:V,clay:x,glaze:L,pageConfig:i}}var wg=Bt(()=>{_a();xa();yi();ml();Tg()});_a();xa();Jl();jl();yi();ml();var Vn=typeof window<"u",gl=Vn?window:null,_s=Vn?document:null,xt={OBJECT:0,ATTRIBUTE:1,CSS:2,TRANSFORM:3,CSS_VAR:4},nt={NUMBER:0,UNIT:1,COLOR:2,COMPLEX:3},Zt={NONE:0,AUTO:1,FORCE:2},Ut={replace:0,none:1,blend:2},nd=Symbol(),Si=Symbol(),_l=Symbol(),xs=Symbol(),em=Symbol(),tt=1e-11,Zo=1e12,Mi=1e3,Ko=240,bi="",tm="var(",$o=[],xl=(()=>{let i=new Map;return i.set("x","translateX"),i.set("y","translateY"),i.set("z","translateZ"),i})(),Hr=["perspective","translateX","translateY","translateZ","rotate","rotateX","rotateY","rotateZ","scale","scaleX","scaleY","scaleZ","skew","skewX","skewY"],nm=Hr.reduce((i,e)=>({...i,[e]:e+"("}),{}),fn=()=>{},im=i=>i,sm=/\)\s*[-.\d]/,rm=/(^#([\da-f]{3}){1,2}$)|(^#([\da-f]{4}){1,2}$)/i,om=/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i,am=/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i,cm=/hsl\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*\)/i,lm=/hsla\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i,id=/[-+]?\d*\.?\d+(?:e[-+]?\d)?/gi,um=/^([-+]?\d*\.?\d+(?:e[-+]?\d+)?)([a-z]+|%)$/i,hm=/([a-z])([A-Z])/g,dm=/(\*=|\+=|-=)/,fm=/var\(\s*(--[\w-]+)(?:\s*,\s*([^)]+))?\s*\)/;var Gr={id:null,keyframes:null,playbackEase:null,playbackRate:1,frameRate:Ko,loop:0,reversed:!1,alternate:!1,autoplay:!0,persist:!1,duration:Mi,delay:0,loopDelay:0,ease:"out(2)",composition:Ut.replace,modifier:im,onBegin:fn,onBeforeUpdate:fn,onUpdate:fn,onLoop:fn,onPause:fn,onComplete:fn,onRender:fn},Jo={current:null,root:_s},ht={defaults:Gr,precision:4,timeScale:1,tickThreshold:200,editor:null},sd={version:"4.5.0",engine:null};Vn&&(gl.AnimeJS||(gl.AnimeJS=[]),gl.AnimeJS.push(sd));var rd=i=>i.replace(hm,"$1-$2").toLowerCase(),Ln=(i,e)=>i.indexOf(e)===0,qi=Date.now,ys=Array.isArray,Vs=i=>i&&i.constructor===Object,Wr=i=>typeof i=="number"&&!isNaN(i),ii=i=>typeof i=="string",Hn=i=>typeof i=="function",et=i=>typeof i>"u",Ti=i=>et(i)||i===null,yl=i=>Vn&&i instanceof SVGElement,od=i=>rm.test(i),ad=i=>Ln(i,"rgb"),cd=i=>Ln(i,"hsl"),mm=i=>od(i)||(ad(i)||cd(i))&&(i[i.length-1]===")"||!sm.test(i)),jo=i=>!ht.defaults.hasOwnProperty(i),zS=["opacity","rotate","overflow","color"],gm=(i,e)=>{if(zS.includes(e))return!1;if(i.getAttribute(e)||e in i){if(e==="scale"){let t=i.parentNode;return t&&t.tagName==="filter"}return!0}};var Hs=Math.pow,_m=Math.sqrt,xm=Math.sin,ym=Math.cos;var vm=Math.floor,Sm=Math.asin;var Qo=Math.PI,pm=Math.round,Mn=(i,e,t)=>i<e?e:i>t?t:i,mt=(i,e)=>{if(e<0)return i;if(!e)return pm(i);let t=10**e;return pm(i*t)/t};var Xr=(i,e,t)=>t===1?e:t===0?i:i+(e-i)*t,Gs=i=>i===1/0?Zo:i===-1/0?-Zo:i,Yi=i=>i<=tt?tt:Gs(mt(i,11)),Xt=i=>ys(i)?[...i]:i,vl=(i,e)=>{let t={...i};for(let n in e){let s=i[n];t[n]=et(s)?e[n]:s}return t},pt=(i,e,t,n="_prev",s="_next")=>{let r=i._head,o=s;for(t&&(r=i._tail,o=n);r;){let a=r[o];e(r),r=a}},Zi=(i,e,t="_prev",n="_next")=>{let s=e[t],r=e[n];s?s[n]=r:i._head=r,r?r[t]=s:i._tail=s,e[t]=null,e[n]=null},si=(i,e,t,n="_prev",s="_next")=>{let r=i._tail;for(;r&&t&&t(r,e);)r=r[n];let o=r?r[s]:i._head;r?r[s]=e:i._head=e,o?o[n]=e:i._tail=e,e[n]=r,e[s]=o};var Mm=(i,e,t)=>{let n=i.style.transform;if(n){let s=i[xs],r=0,o=n.length,a;for(;r<o;){for(;r<o&&n.charCodeAt(r)===32;)r++;if(r>=o)break;let c=r;for(;r<o&&n.charCodeAt(r)!==40;)r++;if(r>=o)break;let u=n.substring(c,r),d=1,h=r+1,f=-1,g=-1;for(r++;r<o&&d>0;){let m=n.charCodeAt(r);m===40?d++:m===41?d--:m===44&&d===1&&(f===-1?f=r:g===-1&&(g=r)),r++}let y=r-1;u==="translate"||u==="translate3d"?(f===-1?s.translateX=n.substring(h,y).trim():(s.translateX=n.substring(h,f).trim(),g===-1?s.translateY=n.substring(f+1,y).trim():(s.translateY=n.substring(f+1,g).trim(),s.translateZ=n.substring(g+1,y).trim())),a=n.substring(h,y)):u==="scale"||u==="scale3d"?f===-1?s.scale=n.substring(h,y).trim():(s.scaleX=n.substring(h,f).trim(),g===-1?s.scaleY=n.substring(f+1,y).trim():(s.scaleY=n.substring(f+1,g).trim(),s.scaleZ=n.substring(g+1,y).trim())):s[u]=n.substring(h,y)}if(e==="translate3d"&&a)return t&&(t[e]=a),a;let l=s[e];if(!et(l))return t&&(t[e]=l),l}return e==="translate3d"?"0px, 0px, 0px":e==="rotate3d"?"0, 0, 0, 0deg":Ln(e,"scale")?"1":Ln(e,"rotate")||Ln(e,"skew")?"0deg":"0px"},Sl=i=>{let e=bi;for(let t=0,n=Hr.length;t<n;t++){let s=Hr[t],r=i[s];if(r!==void 0){if(s==="translateX"){let o=i.translateY;if(o!==void 0){let a=i.translateZ;a!==void 0?(e+=`translate3d(${r},${o},${a}) `,t+=2):(e+=`translate(${r},${o}) `,t+=1);continue}}if(s==="scaleX"&&i.scale===void 0){let o=i.scaleY;if(o!==void 0){let a=i.scaleZ;a!==void 0?(e+=`scale3d(${r},${o},${a}) `,t+=2):(e+=`scale(${r},${o}) `,t+=1);continue}}e+=`${nm[s]}${r}) `}s==="rotateZ"&&i.rotate3d!==void 0&&(e+=`rotate3d(${i.rotate3d}) `)}return i.matrix!==void 0&&(e+=`matrix(${i.matrix}) `),i.matrix3d!==void 0&&(e+=`matrix3d(${i.matrix3d}) `),e};var kS=()=>!0,ld=class{constructor(e){this.detect=e,this.props={}}registerProperty(e,t,n,s){this.props[e]={get:t,set:n,gate:s||kS}}},ud=class{constructor(e){this.detect=e||null,this.targetAdapters=[],this.propertyResolvers=[]}registerTargetAdapter(e){let t=new ld(e);return this.targetAdapters.push(t),t}registerPropertyResolver(e){this.propertyResolvers.indexOf(e)===-1&&this.propertyResolvers.push(e)}},Ml=[];function bm(i){let e=new ud(i);return Ml.push(e),e}function bl(i,e){if(!i)return null;let t=Ml.length;e:for(let n=0;n<t;n++){let s=Ml[n];if(s.detect&&!s.detect(i))continue;let r=s.targetAdapters;for(let o=0,a=r.length;o<a;o++){let l=r[o];if(l.detect(i)){let c=l.props[e];if(c&&(!c.gate||c.gate(i)))return c;break e}}}for(let n=0;n<t;n++){let s=Ml[n];if(s.detect&&!s.detect(i))continue;let r=s.propertyResolvers;for(let o=0,a=r.length;o<a;o++){let l=r[o](i,e);if(l)return l}}return null}var VS=i=>{let e=om.exec(i)||am.exec(i),t=et(e[4])?1:+e[4];return[+e[1],+e[2],+e[3],t]},HS=i=>{let e=i.length,t=e===4||e===5;return[+("0x"+i[1]+i[t?1:2]),+("0x"+i[t?2:3]+i[t?2:4]),+("0x"+i[t?3:5]+i[t?3:6]),e===5||e===9?+(+("0x"+i[t?4:7]+i[t?4:8])/255).toFixed(3):1]},hd=(i,e,t)=>(t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*(2/3-t)*6:i),GS=i=>{let e=cm.exec(i)||lm.exec(i),t=+e[1]/360,n=+e[2]/100,s=+e[3]/100,r=et(e[4])?1:+e[4],o,a,l;if(n===0)o=a=l=s;else{let c=s<.5?s*(1+n):s+n-s*n,u=2*s-c;o=mt(hd(u,c,t+1/3)*255,0),a=mt(hd(u,c,t)*255,0),l=mt(hd(u,c,t-1/3)*255,0)}return[o,a,l,r]},Tm=i=>ad(i)?VS(i):od(i)?HS(i):cd(i)?GS(i):[0,0,0,1];var Ft=(i,e)=>et(i)?e:i,Em=(i,e)=>{let t=i.match(fm),n=e[Si]?e:document.documentElement,s=getComputedStyle(n)?.getPropertyValue(t[1]);return(!s||s.trim()===bi)&&t[2]&&(s=t[2].trim()),s||0},Ei=(i,e,t,n,s,r)=>{if(Hn(i)){if(!s){let a=i(e,t,n,r);return isNaN(+a)?a||0:+a}let o=()=>{let a=i(e,t,n,r);return isNaN(+a)?a||0:+a};return s.func=o,o()}if(ii(i)&&Ln(i,tm)){if(!s)return Em(i,e);let o=()=>Em(i,e);return s.func=o,o()}return i},dd=(i,e)=>i[Si]?i[_l]&&gm(i,e)?xt.ATTRIBUTE:Hr.includes(e)||xl.get(e)?xt.TRANSFORM:Ln(e,"--")?xt.CSS_VAR:e in i.style?xt.CSS:e in i?xt.OBJECT:xt.ATTRIBUTE:xt.OBJECT,wm=(i,e,t)=>{let n=i.style[e];n&&t&&(t[e]=n);let s=n||getComputedStyle(i[em]||i).getPropertyValue(e);return s==="auto"?"0":s},qr=(i,e,t,n)=>{let s=et(t)?dd(i,e):t,r=bl(i,e);if(r){let o=r.get(i);return o&&n&&(n[e]=o),o??0}if(s===xt.OBJECT){let o=i[e];return o&&n&&(n[e]=o),o||0}if(s===xt.ATTRIBUTE){let o=i.getAttribute(e);return o&&n&&(n[e]=o),o}return s===xt.TRANSFORM?Mm(i,e,n):s===xt.CSS_VAR?wm(i,e,n).trimStart():wm(i,e,n)},Yr=(i,e,t)=>t==="-"?i-e:t==="+"?i+e:i*e,Tl=()=>({t:nt.NUMBER,n:0,u:null,o:null,d:null,s:null}),bn=(i,e)=>{if(e.t=nt.NUMBER,e.n=0,e.u=null,e.o=null,e.d=null,e.s=null,!i)return e;let t=+i;if(!isNaN(t))return e.n=t,e;let n=i;n[1]==="="&&(e.o=n[0],n=n.slice(2));let s=n.includes(" ")?!1:um.exec(n);if(s)return e.t=nt.UNIT,e.n=+s[1],e.u=s[2],e;if(e.o)return e.n=+n,e;if(mm(n))return e.t=nt.COLOR,e.d=Tm(n),e;{let r=n.match(id);return e.t=nt.COMPLEX,e.d=r?r.map(Number):[],e.s=n.split(id)||[],e}},fd=(i,e)=>(e.t=i._valueType,e.n=i._toNumber,e.u=i._unit,e.o=null,e.d=Xt(i._toNumbers),e.s=Xt(i._strings),e),Dn=Tl(),El=(i,e,t)=>{let n=i._modifier,s=i._fromNumbers,r=i._toNumbers,o=i._strings,a=o[0];for(let l=0,c=r.length;l<c;l++){let u=n(mt(Xr(s[l],r[l],e),t)),d=o[l+1];a+=`${d?u+d:u}`,i._numbers[l]=u}return a};var ea=(i,e,t,n,s)=>{let r=i.parent,o=i.duration,a=i.completed,l=i.iterationDuration,c=i.iterationCount,u=i._currentIteration,d=i._loopDelay,h=i._reversed,f=i._alternate,g=i._hasChildren,y=i._delay,m=i._currentTime,p=y+l,T=e-y,A=Mn(m,-y,o),v=Mn(T,-y,o),M=T-m,b=v>0,R=v>=o,x=o<=tt,E=s===Zt.FORCE,P=0,D=T,V=0;if(c>1){let H=l+(R?0:d),te=~~(v/H);i._currentIteration=Mn(te,0,c),R&&i._currentIteration--,P=i._currentIteration%2,D=v-te*H||0}let W=h^(f&&P),L=i._ease,z=R?W?0:o:W?l-D:D;L&&(z=l*L(z/l)||0);let K=(r?r.backwards:T<m)?!W:!!W;if(i._currentTime=T,i._iterationTime=z,i.backwards=K,b&&!i.began?(i.began=!0,!t&&!(r&&(K||!r.began))&&i.onBegin(i)):T<=0&&(i.began=!1),!t&&!g&&b&&i._currentIteration!==u&&i.onLoop(i),E||s===Zt.AUTO&&(e>=(r&&y>0?0:y)&&e<=p||e<=y&&A>y||e>=p&&A!==o)||z>=p&&A!==o||z<=y&&A>0&&!R||e<=A&&A===o&&a||R&&!a&&x){if(b&&(i.computeDeltaTime(A),t||i.onBeforeUpdate(i)),!g){let H=E||(K?M*-1:M)>=ht.tickThreshold,te=mt(i._offset+(r?r._offset:0)+y+z,12),N=i._head,Y,ne,Me,Ne,re=0;for(;N;){let ge=N._composition,de=N._currentTime,B=N._changeDuration,G=N._absoluteStartTime+N._changeDuration,ae=N._nextRep,fe=N._prevRep,ce=ge!==Ut.none,me=fe?fe._absoluteStartTime+fe._changeDuration:0,xe=fe&&fe.parent!==N.parent,we=!ae||ae._isOverridden?G:ae.parent===N.parent?G+ae._delay:ae._absoluteStartTime<ae._absoluteUpdateStartTime?ae._absoluteStartTime:ae._absoluteUpdateStartTime;if((H||(de!==B||te<=we||fe&&!xe&&(!ae||ae.parent!==N.parent))&&(de!==0||te>=N._absoluteStartTime||xe&&!N._hasFromValue&&!fe._isOverridden&&te>=me||ae&&!ae._isOverridden&&ae.parent===N.parent&&ae._currentTime!==0&&z<ae._startTime))&&(!fe||xe||z>=N._startTime)&&(!ce||!N._isOverridden&&(!N._isOverlapped||te<=G)&&(!ae||ae._isOverridden||te<=we)&&(!fe||fe._isOverridden||(xe?te>=N._absoluteStartTime||!N._hasFromValue&&te>=me:te>=me+N._delay)))){let oe=N._currentTime=Mn(z-N._startTime,0,B),Z=N._ease(oe/N._updateDuration),se=N._modifier,_e=N._valueType,Ae=N._tweenType,Ye=Ae===xt.OBJECT,Re=_e===nt.NUMBER,He=Re&&Ye||Z===0||Z===1?-1:ht.precision,I,Ze;if(Re)I=Ze=se(mt(Xr(N._fromNumber,N._toNumber,Z),He));else if(_e===nt.UNIT)Ze=se(mt(Xr(N._fromNumber,N._toNumber,Z),He)),I=`${Ze}${N._unit}`;else if(_e===nt.COLOR){let Oe=N._numbers,w=N._fromNumbers,_=N._toNumbers,U=1-Z,k=w[0],$=w[1],ue=w[2],pe=_[0],J=_[1],ie=_[2];Oe[0]=se(Math.sqrt(k*k*U+pe*pe*Z)),Oe[1]=se(Math.sqrt($*$*U+J*J*Z)),Oe[2]=se(Math.sqrt(ue*ue*U+ie*ie*Z)),Oe[3]=se(Xr(w[3],_[3],Z)),(!N._setter||n)&&(I=`rgba(${mt(Oe[0],0)},${mt(Oe[1],0)},${mt(Oe[2],0)},${Oe[3]})`)}else _e===nt.COMPLEX&&(I=El(N,Z,He));if(ce&&(N._number=Ze),!n&&ge!==Ut.blend){let Oe=N.property;Y=N.target,N._setter?N._setter(Y,Ze,N):Ye?Y[Oe]=I:Ae===xt.ATTRIBUTE?Y.setAttribute(Oe,I):(ne=Y.style,Ae===xt.TRANSFORM?(Y!==Me&&(Me=Y,Ne=Y[xs]),Ne[Oe]=I,re=1):Ae===xt.CSS?ne[Oe]=I:Ae===xt.CSS_VAR&&ne.setProperty(Oe,I)),b&&(V=1)}else N._value=I}else de&&fe&&!xe&&z<N._startTime&&(N._currentTime=0);re&&N._renderTransforms&&(ne.transform=Sl(Ne),re=0),N=N._next}!t&&V&&i.onRender(i)}!t&&b&&i.onUpdate(i)}return r&&x?!t&&(r.began&&!K&&T>0&&!a||K&&T<=tt&&a)&&(i.onComplete(i),i.completed=!K):b&&R?c===1/0?i._startTime+=i.duration:i._currentIteration>=c-1&&(i.paused=!0,!a&&!g&&(i.completed=!0,!t&&!(r&&(K||!r.began))&&(i.onComplete(i),i._resolve(i)))):i.completed=!1,V},wi=(i,e,t,n,s)=>{let r=i._currentIteration;if(ea(i,e,t,n,s),i._hasChildren){let o=i,a=o.backwards,l=n?e:o._iterationTime,c=qi(),u=0,d=!0;if(!n&&o._currentIteration!==r){let h=o.iterationDuration;pt(o,f=>{if(!a)!f.completed&&!f.backwards&&f._currentTime<f.iterationDuration&&ea(f,h,t,1,Zt.FORCE),f.began=!1,f.completed=!1;else{let g=f.duration,y=f._offset+f._delay,m=y+g;!t&&g<=tt&&(!y||m===h)&&f.onComplete(f)}}),t||o.onLoop(o)}pt(o,h=>{let f=mt((l-h._offset)*h._speed,12);if(a&&f>h._delay+h.duration)return;let g=h._fps<o._fps?h.requestTick(c):s;u+=ea(h,f,t,n,g),!h.completed&&d&&(d=!1)},a),!t&&u&&o.onRender(o),(d||a)&&o._currentTime>=o.duration&&(o.paused=!0,o.completed||(o.completed=!0,t||(o.onComplete(o),o._resolve(o))))}};var Am={},wl=(i,e,t)=>{if(t===xt.TRANSFORM){let n=xl.get(i);return n||i}else if(t===xt.CSS||t===xt.ATTRIBUTE&&yl(e)&&i in e.style){let n=Am[i];if(n)return n;{let s=i&&rd(i);return Am[i]=s,s}}else return i},ta=(i,e=!1)=>{if(i._hasChildren)pt(i,t=>ta(t,e),!0);else{let t=i;t.pause(),pt(t,n=>{let s=n.property,r=n.target,o=n._tweenType,a=n._inlineValue,l=Ti(a)||a===bi;if(n._setter){if(!e&&!l){if(bn(a,Dn),Dn.d){let c=Dn.d,u=n._numbers;for(let d=0,h=c.length;d<h;d++)u[d]=c[d]}else n._number=Dn.n;n._setter(n.target,n._number,n)}}else if(o===xt.OBJECT)!e&&!l&&(r[s]=a);else if(r[Si])if(o===xt.ATTRIBUTE)e||(l?r.removeAttribute(s):r.setAttribute(s,a));else{let c=r.style;if(o===xt.TRANSFORM){let u=r[xs];l?delete u[s]:u[s]=a,n._renderTransforms&&(Object.keys(u).length?c.transform=Sl(u):c.removeProperty("transform"))}else l?c.removeProperty(rd(s)):c[s]=a}r[Si]&&t._tail===n&&t.targets.forEach(c=>{c.getAttribute&&c.getAttribute("style")===bi&&c.removeAttribute("style")})})}return i};var Zr=class{constructor(e=0){this.deltaTime=0,this._currentTime=e,this._lastTickTime=e,this._startTime=e,this._lastTime=e,this._frameDuration=Mi/Ko,this._fps=Ko,this._speed=1,this._hasChildren=!1,this._head=null,this._tail=null}get fps(){return this._fps}set fps(e){let t=+e,n=t<tt?tt:t,s=Mi/n;n>Gr.frameRate&&(Gr.frameRate=n),this._fps=n,this._frameDuration=s}get speed(){return this._speed}set speed(e){let t=+e;this._speed=t<tt?tt:t}requestTick(e){let t=this._frameDuration,n=e-this._lastTickTime,s=t*.25,r=s<4?s:4;return n+r<t?Zt.NONE:(this._lastTickTime=n>=t?e-n%t:e,Zt.AUTO)}computeDeltaTime(e){let t=e-this._lastTime;return this.deltaTime=t,this._lastTime=e,t}};var Ki={animation:null,update:fn},Rm=i=>{let e=Ki.animation;return e||(e={duration:tt,computeDeltaTime:fn,_offset:0,_delay:0,_head:null,_tail:null},Ki.animation=e,Ki.update=()=>{i.forEach(t=>{for(let n in t){let s=t[n],r=s._head;if(r){let o=r._valueType,a=o===nt.COMPLEX||o===nt.COLOR?Xt(r._fromNumbers):null,l=r._fromNumber,c=s._tail;for(;c&&c!==r;){if(a)for(let u=0,d=c._numbers.length;u<d;u++)a[u]+=c._numbers[u];else l+=c._number;c=c._prevAdd}r._toNumber=l,r._toNumbers=a}}}),ea(e,1,1,0,Zt.FORCE)}),e};var Cm=Vn?requestAnimationFrame:setImmediate,WS=Vn?cancelAnimationFrame:clearImmediate,pd=class extends Zr{constructor(e){super(e),this.useDefaultMainLoop=!0,this.pauseOnDocumentHidden=!0,this.defaults=Gr,this.paused=!0,this.reqId=0}update(){let e=this._currentTime=qi();if(this.requestTick(e)){this.computeDeltaTime(e);let t=this._speed,n=this._fps,s=this._head;for(;s;){let r=s._next;s.paused?(Zi(this,s),this._hasChildren=!!this._tail,s._running=!1,s.completed&&!s._cancelled&&s.cancel()):wi(s,(e-s._startTime)*s._speed*t,0,0,s._fps<n?s.requestTick(e):Zt.AUTO),s=r}Ki.update()}}wake(){return this.useDefaultMainLoop&&!this.reqId&&(this.requestTick(qi()),this.reqId=Cm(Im)),this}pause(){if(this.reqId)return this.paused=!0,XS()}resume(){if(this.paused)return this.paused=!1,pt(this,e=>e.resetTime()),this.wake()}get speed(){return this._speed*(ht.timeScale===1?1:Mi)}set speed(e){let t=e*ht.timeScale;this._speed!==t&&(this._speed=t,pt(this,n=>n.speed=n._speed))}get timeUnit(){return ht.timeScale===1?"ms":"s"}set timeUnit(e){let n=e==="s",s=n?.001:1;if(ht.timeScale!==s){ht.timeScale=s,ht.tickThreshold=200*s;let r=n?.001:Mi;this.defaults.duration*=r,this._speed*=r}}get precision(){return ht.precision}set precision(e){ht.precision=e}},Kt=(()=>{let i=new pd(qi());return Vn&&(sd.engine=i,_s.addEventListener("visibilitychange",()=>{i.pauseOnDocumentHidden&&(_s.hidden?i.pause():i.resume())})),i})(),Im=()=>{Kt._head?(Kt.reqId=Cm(Im),Kt.update()):Kt.reqId=0},XS=()=>(WS(Kt.reqId),Kt.reqId=0,Kt);var Al={_rep:new WeakMap,_add:new Map},ia=(i,e,t="_rep")=>{let n=Al[t],s=n.get(i);return s||(s={},n.set(i,s)),s[e]?s[e]:s[e]={_head:null,_tail:null}},qS=(i,e)=>i._isOverridden||i._absoluteStartTime>e._absoluteStartTime,na=i=>{i._isOverlapped=1,i._isOverridden=1,i._changeDuration=tt,i._currentTime=tt},Rl=(i,e)=>{let t=i._composition;if(t===Ut.replace){let n=i._absoluteStartTime;si(e,i,qS,"_prevRep","_nextRep");let s=i._prevRep;if(s){let r=s.parent,o=s._absoluteEndTime;if(i.parent.id!==r.id&&r.iterationCount>1&&o+(r.duration-r.iterationDuration)>n){na(s);let c=s._prevRep;for(;c&&c.parent.id===r.id;)na(c),c=c._prevRep}let a=i._absoluteUpdateStartTime;if(o>a){let c=s._startTime,u=o-(c+s._updateDuration),d=mt(a-u-c,12);s._changeDuration=d,s._currentTime=d,s._isOverlapped=1,d<tt&&na(s)}let l=i.parent.parent;if(!l||l!==r.parent){let c=!0;if(pt(r,u=>{u._isOverlapped||(c=!1)}),c){let u=r.parent;if(u){let d=!0;pt(u,h=>{h!==r&&pt(h,f=>{f._isOverlapped||(d=!1)})}),d&&u.cancel()}else r.cancel()}}}}else if(t===Ut.blend){let n=ia(i.target,i.property,"_add"),s=Rm(Al._add),r=n._head;r||(r={...i},r._composition=Ut.replace,r._updateDuration=tt,r._startTime=0,r._numbers=Xt(i._fromNumbers),r._number=0,r._next=null,r._prev=null,si(n,r),si(s,r));let o=i._toNumber;if(i._fromNumber=r._fromNumber-o,i._toNumber=0,i._numbers=Xt(i._fromNumbers),i._number=0,r._fromNumber=o,i._toNumbers.length){let a=Xt(i._toNumbers);a.forEach((l,c)=>{i._fromNumbers[c]=r._fromNumbers[c]-l,i._toNumbers[c]=0}),r._fromNumbers=a}si(n,i,null,"_prevAdd","_nextAdd")}return i},md=i=>{let e=i._composition;if(e!==Ut.none){let t=i.target,n=i.property,o=Al._rep.get(t)[n];if(Zi(o,i,"_prevRep","_nextRep"),e===Ut.blend){let a=Al._add,l=a.get(t);if(!l)return;let c=l[n],u=Ki.animation;Zi(c,i,"_prevAdd","_nextAdd");let d=c._head;if(d&&d===c._tail){Zi(c,d,"_prevAdd","_nextAdd"),Zi(u,d);let h=!0;for(let f in l)if(l[f]._head){h=!1;break}h&&a.delete(t)}}}return i},Pm=(i,e,t)=>{let n=!1;return pt(e,s=>{let r=s.target;if(i.includes(r)){let o=s.property,a=s._tweenType,l=wl(t,r,a);(!l||l&&l===o)&&(s.parent._tail===s&&s._tweenType===xt.TRANSFORM&&s._prev&&s._prev._tweenType===xt.TRANSFORM&&(s._prev._renderTransforms=1),Zi(e,s),md(s),n=!0)}},!0),n},gd=(i,e,t)=>{let n=e||Kt,s;if(n._hasChildren){let r=0;pt(n,o=>{if(!o._hasChildren)if(s=Pm(i,o,t),s&&!o._head)o.cancel(),Zi(n,o);else{let l=o._offset+o._delay+o.duration;l>r&&(r=l)}o._head?gd(i,o,t):o._hasChildren=!1},!0),et(n.iterationDuration)||(n.iterationDuration=r)}else s=Pm(i,n,t);s&&!n._head&&(n._hasChildren=!1,n.cancel&&n.cancel())};var Lm=i=>(i.paused=!0,i.began=!1,i.completed=!1,i),_d=i=>(i._cancelled&&(i._hasChildren?pt(i,_d):pt(i,e=>{e._composition!==Ut.none&&Rl(e,ia(e.target,e.property))}),i._cancelled=0),i),Dm=0,YS=(i,e)=>i._priority>e._priority,Ws=class extends Zr{constructor(e={},t=null,n=0){super(0),++Dm;let{id:s,delay:r,duration:o,reversed:a,alternate:l,loop:c,loopDelay:u,autoplay:d,frameRate:h,playbackRate:f,priority:g,onComplete:y,onLoop:m,onPause:p,onBegin:T,onBeforeUpdate:A,onUpdate:v}=e;Jo.current&&Jo.current.register(this);let M=t?0:Kt._lastTickTime,b=t?t.defaults:ht.defaults,R=Hn(r)||et(r)?b.delay:+r,x=Hn(o)||et(o)?1/0:+o,E=Ft(c,b.loop),P=Ft(u,b.loopDelay),D=E===!0||E===1/0||E<0?1/0:E+1,V=0;t?V=n:(Kt.reqId||Kt.requestTick(qi()),V=(Kt._lastTickTime-Kt._startTime)*ht.timeScale),this.id=et(s)?Dm:s,this.parent=t,this.duration=Gs((x+P)*D-P)||tt,this.backwards=!1,this.paused=!0,this.began=!1,this.completed=!1,this.onBegin=T||b.onBegin,this.onBeforeUpdate=A||b.onBeforeUpdate,this.onUpdate=v||b.onUpdate,this.onLoop=m||b.onLoop,this.onPause=p||b.onPause,this.onComplete=y||b.onComplete,this.iterationDuration=x,this.iterationCount=D,this._autoplay=t?!1:Ft(d,b.autoplay),this._offset=V,this._delay=R,this._loopDelay=P,this._iterationTime=0,this._currentIteration=0,this._resolve=fn,this._running=!1,this._reversed=+Ft(a,b.reversed),this._reverse=this._reversed,this._cancelled=0,this._alternate=Ft(l,b.alternate),this._prev=null,this._next=null,this._lastTickTime=M,this._startTime=M,this._lastTime=M,this._fps=Ft(h,b.frameRate),this._speed=Ft(f,b.playbackRate),this._priority=+Ft(g,1)}get cancelled(){return!!this._cancelled}set cancelled(e){e?this.cancel():this.reset(!0).play()}get currentTime(){return Mn(mt(this._currentTime,ht.precision),-this._delay,this.duration)}set currentTime(e){let t=this.paused;this.pause().seek(+e),t||this.resume()}get iterationCurrentTime(){return Mn(mt(this._iterationTime,ht.precision),0,this.iterationDuration)}set iterationCurrentTime(e){this.currentTime=this.iterationDuration*this._currentIteration+e}get progress(){return Mn(mt(this._currentTime/this.duration,10),0,1)}set progress(e){this.currentTime=this.duration*e}get iterationProgress(){return Mn(mt(this._iterationTime/this.iterationDuration,10),0,1)}set iterationProgress(e){let t=this.iterationDuration;this.currentTime=t*this._currentIteration+t*e}get currentIteration(){return this._currentIteration}set currentIteration(e){this.currentTime=this.iterationDuration*Mn(+e,0,this.iterationCount-1)}get reversed(){return!!this._reversed}set reversed(e){e?this.reverse():this.play()}get speed(){return super.speed}set speed(e){super.speed=e,this.resetTime()}reset(e=!1){return _d(this),this._reversed&&!this._reverse&&(this.reversed=!1),this._iterationTime=this.iterationDuration,wi(this,0,1,~~e,Zt.FORCE),Lm(this),this._hasChildren&&pt(this,Lm),this}init(e=!1){this.fps=this._fps,this.speed=this._speed,!e&&this._hasChildren&&wi(this,this.duration,1,~~e,Zt.FORCE),this.reset(e);let t=this._autoplay;return t===!0?this.resume():t&&!et(t.linked)&&t.link(this),this}resetTime(){let e=1/(this._speed*Kt._speed);return this._startTime=qi()-(this._currentTime+this._delay)*e,this}pause(){return this.paused?this:(this.paused=!0,this.onPause(this),this)}resume(){return this.paused?(this.paused=!1,this.duration<=tt&&!this._hasChildren?wi(this,tt,0,0,Zt.FORCE):(this._running||(si(Kt,this,YS),Kt._hasChildren=!0,this._running=!0),this.resetTime(),this._startTime-=12,Kt.wake()),this):this}restart(){return this.reset().resume()}seek(e,t=0,n=0){_d(this),this.completed=!1;let s=this.paused;return this.paused=!0,wi(this,e+this._delay,~~t,~~n,Zt.AUTO),s?this:this.resume()}alternate(){let e=this._reversed,t=this.iterationCount,n=this.iterationDuration,s=t===1/0?vm(Zo/n):t;return this._reversed=+(this._alternate&&!(s%2)?e:!e),t===1/0?this.iterationProgress=this._reversed?1-this.iterationProgress:this.iterationProgress:this.seek(n*s-this._currentTime),this.resetTime(),this}play(){return this._reversed&&this.alternate(),this.resume()}reverse(){return this._reversed||this.alternate(),this.resume()}cancel(){return this._hasChildren?pt(this,e=>e.cancel(),!0):pt(this,md),this._cancelled=1,this.pause()}stretch(e){let t=this.duration,n=Yi(e);if(t===n)return this;let s=e/t,r=e<=tt;return this.duration=r?tt:n,this.iterationDuration=r?tt:Yi(this.iterationDuration*s),this._offset*=s,this._delay*=s,this._loopDelay*=s,this}revert(){wi(this,0,1,0,Zt.AUTO);let e=this._autoplay;return e&&e.linked&&e.linked===this&&e.revert(),this.cancel()}complete(e=0){return this.seek(this.duration,e).cancel()}then(e=fn){let t=this.then,n=()=>{this.then=null,e(this),this.then=t,this._resolve=fn};return new Promise(s=>(this._resolve=()=>s(n()),this.completed&&this._resolve(),this))}};function Nm(i){let e=ii(i)?Jo.root.querySelectorAll(i):i;if(e instanceof NodeList||e instanceof HTMLCollection)return e}function Cl(i){if(Ti(i))return[];if(!Vn)return ys(i)&&i.flat(1/0)||[i];if(ys(i)){let t=i.flat(1/0),n=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];if(!Ti(o)){let a=Nm(o);if(a)for(let l=0,c=a.length;l<c;l++){let u=a[l];if(!Ti(u)){let d=!1;for(let h=0,f=n.length;h<f;h++)if(n[h]===u){d=!0;break}d||n.push(u)}}else{let l=!1;for(let c=0,u=n.length;c<u;c++)if(n[c]===o){l=!0;break}l||n.push(o)}}}return n}let e=Nm(i);return e?Array.from(e):[i]}function Um(i){let e=Cl(i),t=e.length;for(let n=0;n<t;n++){let s=e[n];if(!s[nd]){s[nd]=!0;let r=yl(s);(s.nodeType||r)&&(s[Si]=!0,s[_l]=r,s[xs]={})}}return e}var xd={deg:1,rad:180/Qo,turn:360},Fm={},yd=(i,e,t,n=!1)=>{let s=e.u,r=e.n;if(e.t===nt.UNIT&&s===t)return e;let o=r+s+t,a=Fm[o];if(!et(a)&&!n)e.n=a;else{let l;if(s in xd)l=r*xd[s]/xd[t];else{let u=i.cloneNode(),d=i.parentNode,h=d&&d!==_s?d:_s.body;h.appendChild(u);let f=u.style;f.width=100+s;let g=u.offsetWidth||100;f.width=100+t;let y=u.offsetWidth||100,m=g/y;h.removeChild(u),l=m*r}e.n=l,Fm[o]=l}return e.t,nt.UNIT,e.u=t,e};var $i=i=>i;var sa=(i=1.68)=>e=>Hs(e,+i),Sd={in:i=>e=>i(e),out:i=>e=>1-i(1-e),inOut:i=>e=>e<.5?i(e*2)/2:1-i(e*-2+2)/2,outIn:i=>e=>e<.5?(1-i(1-e*2))/2:(i(e*2-1)+1)/2},ZS=Qo/2,Om=Qo*2,Bm={[bi]:sa,Quad:sa(2),Cubic:sa(3),Quart:sa(4),Quint:sa(5),Sine:i=>1-ym(i*ZS),Circ:i=>1-_m(1-i*i),Expo:i=>i?Hs(2,10*i-10):0,Bounce:i=>{let e,t=4;for(;i<((e=Hs(2,--t))-1)/11;);return 1/Hs(4,3-t)-7.5625*Hs((e*3-2)/22-i,2)},Back:(i=1.7)=>e=>(+i+1)*e*e*e-+i*e*e,Elastic:(i=1,e=.3)=>{let t=Mn(+i,1,10),n=Mn(+e,tt,2),s=n/Om*Sm(1/t),r=Om/n;return o=>o===0||o===1?o:-t*Hs(2,-10*(1-o))*xm((1-o-s)*r)}},vd=(()=>{let i={linear:$i,none:$i};for(let e in Sd)for(let t in Bm){let n=Bm[t],s=Sd[e];i[e+t]=t===bi||t==="Back"||t==="Elastic"?(r,o)=>s(n(r,o)):s(n)}return i})(),Il={linear:$i,none:$i},KS=i=>{if(Il[i])return Il[i];if(i.indexOf("(")<=-1){let t=Sd[i]||i.includes("Back")||i.includes("Elastic")?vd[i]():vd[i];return t?Il[i]=t:$i}else{let e=i.slice(0,-1).split("("),t=vd[e[0]];return t?Il[i]=t(...e[1].split(",")):$i}},zm=["steps(","irregular(","linear(","cubicBezier("],ra=i=>{if(ii(i)){for(let t=0,n=zm.length;t<n;t++)if(Ln(i,zm[t]))return console.warn(`String syntax for \`ease: "${i}"\` has been removed from the core and replaced by importing and passing the easing function directly: \`ease: ${i}\``),$i}return Hn(i)?i:ii(i)?KS(i):$i};var $e=Tl(),it=Tl(),Kr={},Pl={func:null},Ll={func:null},Dl=[null],$r=[null,null],Nl={to:null},$S=0,km=0,vs,Ai,JS=(i,e)=>{let t={};if(ys(i)){let n=[].concat(...i.map(s=>Object.keys(s))).filter(jo);for(let s=0,r=n.length;s<r;s++){let o=n[s],a=i.map(l=>{let c={};for(let u in l){let d=l[u];jo(u)?u===o&&(c.to=d):c[u]=d}return c});t[o]=a}}else{let n=Ft(e.duration,ht.defaults.duration);Object.keys(i).map(r=>({o:parseFloat(r)/100,p:i[r]})).sort((r,o)=>r.o-o.o).forEach(r=>{let o=r.o,a=r.p;for(let l in a)if(jo(l)){let c=t[l];c||(c=t[l]=[]);let u=o*n,d=c.length,h=c[d-1],f={to:a[l]},g=0;for(let y=0;y<d;y++)g+=c[y].duration;d===1&&(f.from=h.to),a.ease&&(f.ease=a.ease),f.duration=u-(d?g:0),c.push(f)}return r});for(let r in t){let o=t[r],a;for(let l=0,c=o.length;l<c;l++){let u=o[l],d=u.ease;u.ease=a||void 0,a=d}o[0].duration||o.shift()}}return t},Ul=class extends Ws{constructor(e,t,n,s,r=!1,o=0,a){super(t,n,s),this._head,this._tail,++km;let l=Um(e),c=l.length,u=t.keyframes,d=u?vl(JS(u,t),t):t,{id:h,delay:f,duration:g,ease:y,playbackEase:m,modifier:p,composition:T,onRender:A}=d,v=n?n.defaults:ht.defaults,M=Ft(y,v.ease),b=Ft(m,v.playbackEase),R=b?ra(b):null,x=!et(M.ease),E=x?M.ease:Ft(y,R?"linear":v.ease),P=x?M.settlingDuration:Ft(g,v.duration),D=Ft(f,v.delay),V=p||v.modifier,W=et(T)&&c>=Mi?Ut.none:et(T)?v.composition:T,L=this._offset+(n?n._offset:0);x&&(M.parent=this);let z=NaN,K=NaN,H=0,te=0;for(let N=0;N<c;N++){let Y=l[N],ne=o||N,Me=a||l,Ne=NaN,re=NaN;for(let ge in d)if(jo(ge)){let de=dd(Y,ge),B=bl(Y,ge),G=wl(ge,Y,de),ae=d[ge],fe=ys(ae);if(r&&!fe&&($r[0]=ae,$r[1]=ae,ae=$r),fe){let Z=ae.length,se=!Vs(ae[0]);Z===2&&se?(Nl.to=ae,Dl[0]=Nl,vs=Dl):Z>2&&se?(vs=[],ae.forEach((_e,Ae)=>{Ae?Ae===1?($r[1]=_e,vs.push($r)):vs.push(_e):$r[0]=_e})):vs=ae}else Dl[0]=ae,vs=Dl;let ce=null,me=null,xe=NaN,we=0,oe=0;for(let Z=vs.length;oe<Z;oe++){let se=vs[oe];Vs(se)?Ai=se:(Nl.to=se,Ai=Nl),Pl.func=null,Ll.func=null;let _e=Ei(Ft(Ai.composition,W),Y,ne,Me,null,null),Ae=Wr(_e)?_e:Ut[_e];!ce&&Ae!==Ut.none&&(ce=ia(Y,G));let Ye=ce?ce._tail:null,Re=n&&Ye&&Ye.parent.parent===n?Ye:me,He=Ei(Ai.to,Y,ne,Me,Pl,Re),I;Vs(He)&&!et(He.to)?(Ai=He,I=He.to):I=He;let Ze=Ei(Ai.from,Y,ne,Me,Ll,Re),Oe=Ai.ease||E,w=Ei(Oe,Y,ne,Me,null,Re),_=Hn(w)||ii(w)?w:Oe,U=!et(_)&&!et(_.ease),k=U?_.ease:_,$=U?_.settlingDuration:Ei(Ft(Ai.duration,Z>1?Ei(P,Y,ne,Me,null,Re)/Z:P),Y,ne,Me,null,Re),ue=Ei(Ft(Ai.delay,oe?0:D),Y,ne,Me,null,Re),pe=Ai.modifier||V,J=!et(Ze),ie=!et(I),ve=ys(I),ze=ve||J&&ie,be=me?we:0,Se=me?we+ue:ue,ee=mt(L+Se,12),Ee=mt(L+be,12);!te&&(J||ve)&&(te=1);let De=me;if(Ae!==Ut.none){let We=ce._head;for(;We&&We._absoluteStartTime<=ee;)if(We._isOverridden||(De=We),We=We._nextRep,We&&We._absoluteStartTime>=ee)for(;We;)na(We),We=We._nextRep}if(ze){bn(ve?Ei(I[0],Y,ne,Me,Ll,Re):Ze,$e),bn(ve?Ei(I[1],Y,ne,Me,Pl,Re):I,it);let We=qr(Y,G,de,Kr);$e.t===nt.NUMBER&&(De?De._valueType===nt.UNIT&&($e.t=nt.UNIT,$e.u=De._unit):(bn(We,Dn),Dn.t===nt.UNIT&&($e.t=nt.UNIT,$e.u=Dn.u)))}else ie?bn(I,it):me?fd(me,it):bn(n&&De&&De.parent.parent===n?De._value:qr(Y,G,de,Kr),it),J?bn(Ze,$e):me?fd(me,$e):bn(n&&De&&De.parent.parent===n?De._value:qr(Y,G,de,Kr),$e);if($e.o&&($e.n=Yr(De?De._toNumber:bn(qr(Y,G,de,Kr),Dn).n,$e.n,$e.o)),it.o&&(it.n=Yr($e.n,it.n,it.o)),$e.t!==it.t){if($e.t===nt.COMPLEX||it.t===nt.COMPLEX){let We=$e.t===nt.COMPLEX?$e:it,Je=$e.t===nt.COMPLEX?it:$e;Je.t=nt.COMPLEX,Je.s=Xt(We.s),Je.d=We.d.map(()=>Je.n)}else if($e.t===nt.UNIT||it.t===nt.UNIT){let We=$e.t===nt.UNIT?$e:it,Je=$e.t===nt.UNIT?it:$e;Je.t=nt.UNIT,Je.u=We.u}else if($e.t===nt.COLOR||it.t===nt.COLOR){let We=$e.t===nt.COLOR?$e:it,Je=$e.t===nt.COLOR?it:$e;Je.t=nt.COLOR,Je.d=We.d.map(()=>0)}}if($e.u!==it.u){let We=it.u?$e:it;We=yd(Y,We,it.u?it.u:$e.u,!1)}if(it.d&&$e.d&&it.d.length!==$e.d.length){let We=$e.d.length>it.d.length?$e:it,Je=We===$e?it:$e;Je.d=We.d.map((Un,Tn)=>et(Je.d[Tn])?0:Je.d[Tn]),Je.s=Xt(We.s)}let C=mt(+$||tt,12),he=Kr[G];Ti(he)||(Kr[G]=null);let Q=B?B.set:null;we=mt(Se+C,12);let ye=$e.d,Te=it.d,le=it.s,Pe={parent:this,id:$S++,property:G,target:Y,_value:null,_toFunc:Pl.func,_fromFunc:Ll.func,_ease:ra(k),_fromNumbers:ye?Xt(ye):$o,_toNumbers:Te?Xt(Te):$o,_strings:le?Xt(le):$o,_fromNumber:$e.n,_toNumber:it.n,_numbers:ye?Xt(ye):$o,_number:$e.n,_unit:it.u,_modifier:pe,_currentTime:0,_startTime:Se,_delay:+ue,_updateDuration:C,_changeDuration:C,_absoluteStartTime:ee,_absoluteUpdateStartTime:Ee,_absoluteEndTime:mt(L+we,12),_hasFromValue:J||ve?1:0,_tweenType:de,_setter:Q,_valueType:it.t,_composition:Ae,_isOverlapped:0,_isOverridden:0,_renderTransforms:0,_inlineValue:he,_prevRep:null,_nextRep:null,_prevAdd:null,_nextAdd:null,_prev:null,_next:null};Ae!==Ut.none&&Rl(Pe,ce);let Ue=Pe._valueType;if(Ue===nt.COMPLEX)Pe._value=El(Pe,1,-1);else if(Ue===nt.UNIT)Pe._value=`${pe(Pe._toNumber)}${Pe._unit}`;else if(Ue===nt.COLOR){let We=it.d;Pe._value=`rgba(${mt(We[0],0)},${mt(We[1],0)},${mt(We[2],0)},${We[3]})`}else Pe._value=pe(Pe._toNumber);isNaN(xe)&&(xe=Pe._startTime),me=Pe,H++,si(this,Pe)}(isNaN(K)||xe<K)&&(K=xe),(isNaN(z)||we>z)&&(z=we),de===xt.TRANSFORM&&(Ne=H-oe,re=H)}if(!isNaN(Ne)){let ge=0;pt(this,de=>{ge>=Ne&&ge<re&&(de._renderTransforms=1,de._composition===Ut.blend&&pt(Ki.animation,B=>{B.id===de.id&&(B._renderTransforms=1)})),ge++})}}c||console.warn("No target found. Make sure the element you're trying to animate is accessible before creating your animation."),K?(pt(this,N=>{N._startTime-N._delay||(N._delay-=K),N._startTime-=K}),z-=K):K=0,z||(z=tt,this.iterationCount=0),this.targets=l,this.id=et(h)?km:h,this.duration=z===tt?tt:Gs((z+this._loopDelay)*this.iterationCount-this._loopDelay)||tt,this.onRender=A||v.onRender,this._ease=R,this._delay=K,this.iterationDuration=z,!this._autoplay&&te&&this.onRender(this)}stretch(e){let t=this.duration;if(t===Yi(e))return this;let n=e/t;return pt(this,s=>{s._updateDuration=Yi(s._updateDuration*n),s._changeDuration=Yi(s._changeDuration*n),s._currentTime*=n,s._delay*=n,s._startTime*=n,s._absoluteStartTime*=n,s._absoluteUpdateStartTime*=n,s._absoluteEndTime*=n}),super.stretch(e)}refresh(){return pt(this,e=>{let t=e._toFunc,n=e._fromFunc;(t||n)&&(n?(bn(n(),$e),$e.u!==e._unit&&e.target[Si]&&yd(e.target,$e,e._unit,!0),e._fromNumbers=Xt($e.d),e._fromNumber=$e.n):t&&(bn(qr(e.target,e.property,e._tweenType),Dn),e._fromNumbers=Xt(Dn.d),e._fromNumber=Dn.n),t&&(bn(t(),it),e._toNumbers=Xt(it.d),e._strings=Xt(it.s),e._toNumber=it.o?Yr(e._fromNumber,it.n,it.o):it.n))}),this.duration===tt&&this.restart(),this}revert(){return super.revert(),ta(this)}then(e){return super.then(e)}};var jS=(i,e)=>{if(Ln(e,"<")){let t=e[1]==="<",n=i._tail,s=n?n._offset+n._delay:0;return t?s:s+n.duration}},oa=(i,e)=>{let t=i.iterationDuration;if(t===tt&&(t=0),et(e))return t;if(Wr(+e))return+e;let n=e,s=i?i.labels:null,r=!Ti(s),o=jS(i,n),a=!et(o),l=dm.exec(n);if(l){let c=l[0],u=n.split(c),d=r&&u[0]?s[u[0]]:t,h=a?o:r?d:t,f=+u[1];return Yr(h,f,c[0])}else return a?o:r?et(s[n])?t:s[n]:t};function QS(i){return Gs((i.iterationDuration+i._loopDelay)*i.iterationCount-i._loopDelay)||tt}function Md(i,e,t,n,s,r){let a=Wr(i.duration)&&i.duration<=tt?t-tt:t;e.composition&&wi(e,a,1,1,Zt.AUTO);let l=n?new Ul(n,i,e,a,!1,s,r):new Ws(i,e,a);return e.composition&&l.init(!0),si(e,l),pt(e,c=>{let d=c._offset+c._delay+c.duration;d>e.iterationDuration&&(e.iterationDuration=d)}),e.duration=QS(e),e}var Vm=0,Fl=class extends Ws{constructor(e={}){super(e,null,0),++Vm,this.id=et(e.id)?Vm:e.id,this.duration=0,this.labels={};let t=e.defaults,n=ht.defaults;this.defaults=t?vl(t,n):n,this.composition=Ft(e.composition,!0),this.onRender=e.onRender||n.onRender;let s=Ft(e.playbackEase,n.playbackEase);this._ease=s?ra(s):null,this.iterationDuration=0}add(e,t,n){let s=Vs(t),r=Vs(e);if(s||r){if(this._hasChildren=!0,s){let o=t,a=ht.editor&&ht.editor.addTimelineChild,l=n&&n.type==="Stagger"&&ht.editor,c=Hn(n)?n:null;if(c||l){let u=Cl(e),d=this.duration,h=this.iterationDuration,f=o.id,g=0,y=u.length,m=a?a(e,o,this.id,n,y):null,p=c||ht.editor.resolveStagger(n.defaultValue);u.forEach(T=>{let A={...m||o};this.duration=d,this.iterationDuration=h,et(f)||(A.id=f+"-"+g);let v=oa(this,p(T,g,u,null,this));Md(A,this,v,T,g,u),g++})}else{let u=a?a(e,o,this.id,n):o,d=n&&n.type?n.defaultValue:n;Md(u,this,oa(this,d),e)}}else Md(e,this,oa(this,t));return this.composition&&this.init(!0),this}}sync(e,t){if(et(e)||e&&et(e.pause))return this;e.pause();let n=+(e.effect?e.effect.getTiming().duration:e.duration);!et(e)&&!et(e.persist)&&(e.persist=!0);let s=ht.editor,r=s&&s.addTimelineChild;s&&s.addTimelineSync&&(t=s.addTimelineSync(e,t,this.id),s.addTimelineChild=null);let o=this.add(e,{currentTime:[0,n],duration:n,delay:0,ease:"linear",playbackEase:"linear"},t);return s&&(s.addTimelineChild=r),o}set(e,t,n){return et(t)?this:(t.duration=tt,t.composition=Ut.replace,this.add(e,t,n))}call(e,t){return et(e)||e&&!Hn(e)?this:(ht.editor&&ht.editor.addTimelineCall&&(t=ht.editor.addTimelineCall(e,t,this.id)),this.add({duration:0,delay:0,onComplete:()=>e(this)},t))}label(e,t){return et(e)||e&&!ii(e)?this:(ht.editor&&ht.editor.addTimelineLabel&&(t=ht.editor.addTimelineLabel(e,t,this.id)),this.labels[e]=oa(this,t),this)}remove(e,t){return gd(Cl(e),this,t),this}stretch(e){let t=this.duration;if(t===Yi(e))return this;let n=e/t,s=this.labels;pt(this,r=>r.stretch(r.duration*n));for(let r in s)s[r]*=n;return super.stretch(e)}refresh(){return pt(this,e=>{e.refresh&&e.refresh()}),this}revert(){return super.revert(),pt(this,e=>e.revert,!0),ta(this)}then(e){return super.then(e)}},bd=i=>ht.editor?ht.editor.addTimeline(i):new Fl(i).init();var pn=i=>i*Math.PI/180,ri=i=>i*180/Math.PI;var eM=i=>!!(i&&!i.nodeType&&(i.isObject3D||i.isMaterial||i.isTexture||i.isFog||i.isFogExp2||i.isUniformNode||i.isColor||i.isVector2||i.isVector3||i.isVector4||i.isAnimejsInstanceProxy)),Gn=bm(eM);yi();var mn=1/255,wd={X:"x",Y:"y",Z:"z",W:"w"},en=0,aa=1,Td=2,ca=0,Jr=1,Ed=2,ft={kind:0,path:0,base:"",axis:"x"};function Ol(i,e,t,n,s,r,o){if(e!==0){let a=Math.tan(pn(e));i[4]+=i[0]*a,i[5]+=i[1]*a,i[6]+=i[2]*a}if(t!==0){let a=Math.tan(pn(t));i[0]+=i[4]*a,i[1]+=i[5]*a,i[2]+=i[6]*a}if(n!==0){let a=Math.tan(pn(n));i[0]+=i[8]*a,i[1]+=i[9]*a,i[2]+=i[10]*a}(s!==0||r!==0||o!==0)&&(i[12]+=s-(i[0]*s+i[4]*r+i[8]*o),i[13]+=r-(i[1]*s+i[5]*r+i[9]*o),i[14]+=o-(i[2]*s+i[6]*r+i[10]*o))}function qs(i){return i?`#${i.getHexString(St)}`:null}function Ss(i,e){return i?e==="x"||e==="y"?!!(i.isVector2||i.isVector3||i.isVector4):e==="z"?!!(i.isVector3||i.isVector4):!!i.isVector4:!1}function Ad(i,e){let t=i[e];if(t!==void 0){if(t&&t.isColor)return ft.kind=ca,ft.path=en,ft;if(t&&t.isUniformNode){let o=t.value;return o&&o.isColor?(ft.kind=ca,ft.path=Td,ft):typeof o=="number"||typeof o=="boolean"?(ft.kind=Jr,ft.path=Td,ft):null}return typeof t=="number"||typeof t=="boolean"?(ft.kind=Jr,ft.path=en,ft):null}let n=i.uniforms,s=n&&n[e];if(s){let o=s.value;if(o&&o.isColor)return ft.kind=ca,ft.path=aa,ft;if(typeof o=="number")return ft.kind=Jr,ft.path=aa,ft}let r=wd[e[e.length-1]];if(r){let o=e.slice(0,-1);if(Ss(i[o],r))return ft.kind=Ed,ft.path=en,ft.base=o,ft.axis=r,ft;let a=i[o];if(a&&a.isUniformNode&&Ss(a.value,r))return ft.kind=Ed,ft.path=Td,ft.base=o,ft.axis=r,ft;let l=n&&n[o];if(l&&Ss(l.value,r))return ft.kind=Ed,ft.path=aa,ft.base=o,ft.axis=r,ft}return null}function Xs(i,e,t){if(t===en)return i[e];if(t===aa){let s=i.uniforms,r=s&&s[e];return r?r.value:null}let n=i[e];return n?n.value:null}function Hm(i,e,t,n){if(n===en){i[e]=t;return}if(n===aa){let r=i.uniforms,o=r&&r[e];o&&(o.value=t);return}let s=i[e];s&&(s.value=t)}function Ys(i,e,t,n){if(n===void 0&&(n=0),!i)return n;let s=Array.isArray(i)?i[0]:i;if(!s)return n;let r=Xs(s,e,t);return r??n}function jr(i,e,t,n){if(i)if(Array.isArray(i))for(let s=0,r=i.length;s<r;s++)Hm(i[s],e,t,n);else Hm(i,e,t,n)}function la(i,e,t){if(!i)return null;let n=Array.isArray(i)?i[0]:i;return qs(n?Xs(n,e,t):null)}function ua(i,e,t,n){if(!i)return;let s=t[0]*mn,r=t[1]*mn,o=t[2]*mn;if(Array.isArray(i))for(let a=0,l=i.length;a<l;a++){let c=Xs(i[a],e,n);c&&c.setRGB(s,r,o,St)}else{let a=Xs(i,e,n);a&&a.setRGB(s,r,o,St)}}function Gm(i,e,t,n){if(!i)return 0;let s=Array.isArray(i)?i[0]:i,r=s?Xs(s,e,n):null;return r?r[t]:0}function Wm(i,e,t,n,s){if(i)if(Array.isArray(i))for(let r=0,o=i.length;r<o;r++){let a=Xs(i[r],e,s);a&&(a[t]=n)}else{let r=Xs(i,e,s);r&&(r[t]=n)}}var tM=i=>i,nM=i=>i.material,iM=[{},{},{}],sM=[{},{},{}],rM=[{},{},{}],oM=[{},{},{}],aM=[{},{},{}],cM=[{},{},{}],Ym=(i,e,t,n,s,r)=>{let o=e.path;if(e.kind===ca){let u=n[o];return u[i]||(u[i]={get:d=>la(t(d),i,o),set:(d,h,f)=>ua(t(d),i,f._numbers,o)})}if(e.kind===Jr){let u=s[o];return u[i]||(u[i]={get:d=>Ys(t(d),i,o),set:(d,h)=>jr(t(d),i,h,o)})}let a=e.base,l=e.axis,c=r[o];return c[i]||(c[i]={get:u=>Gm(t(u),a,l,o),set:(u,d)=>Wm(t(u),a,l,d,o)})};Gn.registerPropertyResolver((i,e)=>{let t=Ad(i,e);return!t||t.kind===Jr&&t.path===en?null:Ym(e,t,tM,iM,sM,rM)});Gn.registerPropertyResolver((i,e)=>{if(i[e]!==void 0)return null;let t=i.material;if(!t)return null;let n=Array.isArray(t)?t[0]:t;if(!n)return null;let s=Ad(n,e);return s?Ym(e,s,nM,oM,aM,cM):null});var Zm={rotation:1,angle:1},Xm={};Gn.registerPropertyResolver((i,e)=>!Zm[e]||typeof i[e]!="number"?null:Xm[e]||(Xm[e]={get:t=>ri(t[e]),set:(t,n)=>{t[e]=pn(n)}}));var qm={};Gn.registerPropertyResolver((i,e)=>{let t=wd[e[e.length-1]];if(!t)return null;let n=e.slice(0,-1);if(!Zm[n])return null;let s=i[n];return!s||!s.isEuler?null:qm[e]||(qm[e]={get:r=>ri(r[n][t]),set:(r,o)=>{r[n][t]=pn(o)}})});yi();var ha=Gn.registerTargetAdapter(i=>!!(i&&i.isUniformNode));ha.registerProperty("color",i=>qs(i.value),(i,e,t)=>{let n=t._numbers;i.value.setRGB(n[0]*mn,n[1]*mn,n[2]*mn,St)},i=>!!(i.value&&i.value.isColor));ha.registerProperty("x",i=>i.value.x,(i,e)=>{i.value.x=e},i=>Ss(i.value,"x"));ha.registerProperty("y",i=>i.value.y,(i,e)=>{i.value.y=e},i=>Ss(i.value,"y"));ha.registerProperty("z",i=>i.value.z,(i,e)=>{i.value.z=e},i=>Ss(i.value,"z"));ha.registerProperty("w",i=>i.value.w,(i,e)=>{i.value.w=e},i=>Ss(i.value,"w"));yi();var Km=i=>i.isLight?i:i.material,da=Symbol("animejs.skewOrigin"),Rd=Symbol("animejs.opacity");function fa(i,e){if(e===void 0)if(i.material)e=Ys(i.material,"opacity",en,1);else{let n=i[Rd];e=n===void 0?1:n}let t=i.scale;i.visible=!!(e&&t.x&&t.y&&t.z)}function $m(i){let e=i[da];if(e)return e;e=i[da]={skewX:0,skewY:0,skewZ:0,originX:0,originY:0,originZ:0};let t=i.updateMatrix;return i.updateMatrix=function(){t.call(this);let n=this[da];(n.skewX!==0||n.skewY!==0||n.skewZ!==0||n.originX!==0||n.originY!==0||n.originZ!==0)&&Ol(this.matrix.elements,n.skewX,n.skewY,n.skewZ,n.originX,n.originY,n.originZ)},e}var $t=Gn.registerTargetAdapter(i=>i instanceof Rt);$t.registerProperty("x",i=>i.position.x,(i,e)=>{i.position.x=e});$t.registerProperty("y",i=>i.position.y,(i,e)=>{i.position.y=e});$t.registerProperty("z",i=>i.position.z,(i,e)=>{i.position.z=e});$t.registerProperty("rotateX",i=>ri(i.rotation.x),(i,e)=>{i.rotation.x=pn(e)});$t.registerProperty("rotateY",i=>ri(i.rotation.y),(i,e)=>{i.rotation.y=pn(e)});$t.registerProperty("rotateZ",i=>ri(i.rotation.z),(i,e)=>{i.rotation.z=pn(e)});$t.registerProperty("scaleX",i=>i.scale.x,(i,e)=>{i.scale.x=e,fa(i)});$t.registerProperty("scaleY",i=>i.scale.y,(i,e)=>{i.scale.y=e,fa(i)});$t.registerProperty("scaleZ",i=>i.scale.z,(i,e)=>{i.scale.z=e,fa(i)});$t.registerProperty("scale",i=>i.scale.x,(i,e)=>{i.scale.x=e,i.scale.y=e,i.scale.z=e,fa(i)});$t.registerProperty("visible",i=>i.visible,(i,e)=>{i.visible=!!e});$t.registerProperty("opacity",i=>{if(i.material)return Ys(i.material,"opacity",en,1);let e=i[Rd];return e===void 0?1:e},(i,e)=>{i.material?jr(i.material,"opacity",e,en):i[Rd]=e,fa(i,e)},i=>!i.isLight);$t.registerProperty("color",i=>la(Km(i),"color",en),(i,e,t)=>ua(Km(i),"color",t._numbers,en));$t.registerProperty("groundColor",i=>la(i,"groundColor",en),(i,e,t)=>ua(i,"groundColor",t._numbers,en),i=>!!i.groundColor);$t.registerProperty("background",i=>{let e=i.background;return e&&e.isColor?qs(e):"#000000"},(i,e,t)=>{let n=i,s=n.background;(!s||!s.isColor)&&(s=new Ge,n.background=s);let r=t._numbers;s.setRGB(r[0]*mn,r[1]*mn,r[2]*mn,St)},i=>!!i.isScene);var pa=(i,e,t,n)=>{$t.registerProperty(i,s=>s[e](),(s,r)=>{s[t](r)},s=>!!s[n])};pa("volume","getVolume","setVolume","setVolume");pa("refDistance","getRefDistance","setRefDistance","setRefDistance");pa("rolloffFactor","getRolloffFactor","setRolloffFactor","setRefDistance");pa("maxDistance","getMaxDistance","setMaxDistance","setRefDistance");pa("focalLength","getFocalLength","setFocalLength","setFocalLength");var Ji=(i,e)=>{$t.registerProperty(i,t=>t[i],(t,n)=>{t[i]=n,t.updateProjectionMatrix()},e)},Jm=i=>!!i.isPerspectiveCamera,Bl=i=>!!i.isOrthographicCamera;Ji("fov",Jm);Ji("aspect",Jm);Ji("left",Bl);Ji("right",Bl);Ji("top",Bl);Ji("bottom",Bl);var Qr=(i,e)=>{$t.registerProperty(i,t=>{let n=t[da];return n?n[e]:0},(t,n)=>{$m(t)[e]=n})};Qr("skewX","skewX");Qr("skewY","skewY");Qr("skewZ","skewZ");Qr("transformOriginX","originX");Qr("transformOriginY","originY");Qr("transformOriginZ","originZ");$t.registerProperty("transformOrigin",i=>{let e=i[da];return e?`${e.originX} ${e.originY} ${e.originZ}`:"0 0 0"},(i,e,t)=>{let n=$m(i),s=t._numbers;n.originX=s[0],n.originY=s[1],n.originZ=s[2]});var Cd=i=>!!i.isPerspectiveCamera||!!i.isOrthographicCamera;Ji("near",Cd);Ji("far",Cd);Ji("zoom",Cd);yi();var Zs=i=>!!(i._skewX||i._skewY||i._skewZ||i._originX||i._originY||i._originZ),zl=1,kl=2,Vl=4,Ks=8;var Id=class{constructor(e,t){this.isAnimejsInstanceProxy=!0,this.parent=e.mesh,this.id=t,this._position=new O,this._rotation=new $n(0,0,0,"XYZ"),this._scale=new O(1,1,1),this._matrix=new Qe,this._quat=new hn,this._color=new Ge,this._dirty=0,this._skewX=0,this._skewY=0,this._skewZ=0,this._originX=0,this._originY=0,this._originZ=0,this._hasSkewOrigin=!1,this._dirtyList=e.dirtyList;let n=e.mesh;this._hasSetColor="setColorAt"in n,this._hasSetVisible="setVisibleAt"in n,this._hasGetVisible="getVisibleAt"in n,n.getMatrixAt(t,this._matrix),this._matrix.elements[15]===0&&this._matrix.identity(),this._matrix.decompose(this._position,this._quat,this._scale),this._rotation.setFromQuaternion(this._quat,"XYZ"),"getColorAt"in n&&"instanceColor"in n&&n.instanceColor&&n.getColorAt(t,this._color)}_markDirty(e){this._dirty===0&&this._dirtyList.push(this),this._dirty|=e}_flush(){let e=this._dirty;if(!e)return;let t=this._matrix,n=this._position;if(e===zl&&!this._hasSkewOrigin){let s=t.elements;s[12]=n.x,s[13]=n.y,s[14]=n.z}else{let s=this._quat;e&kl&&s.setFromEuler(this._rotation),t.compose(n,s,this._scale),this._hasSkewOrigin&&Ol(t.elements,this._skewX,this._skewY,this._skewZ,this._originX,this._originY,this._originZ)}this.parent.setMatrixAt(this.id,t),this._dirty=0}get x(){return this._position.x}set x(e){this._position.x=e,this._markDirty(zl)}get y(){return this._position.y}set y(e){this._position.y=e,this._markDirty(zl)}get z(){return this._position.z}set z(e){this._position.z=e,this._markDirty(zl)}get rotateX(){return ri(this._rotation.x)}set rotateX(e){this._rotation.x=pn(e),this._markDirty(kl)}get rotateY(){return ri(this._rotation.y)}set rotateY(e){this._rotation.y=pn(e),this._markDirty(kl)}get rotateZ(){return ri(this._rotation.z)}set rotateZ(e){this._rotation.z=pn(e),this._markDirty(kl)}get scaleX(){return this._scale.x}set scaleX(e){this._scale.x=e,this._markDirty(Vl)}get scaleY(){return this._scale.y}set scaleY(e){this._scale.y=e,this._markDirty(Vl)}get scaleZ(){return this._scale.z}set scaleZ(e){this._scale.z=e,this._markDirty(Vl)}get scale(){return this._scale.x}set scale(e){let t=this._scale;t.x=e,t.y=e,t.z=e,this._markDirty(Vl)}get skewX(){return this._skewX}set skewX(e){this._skewX=e,this._hasSkewOrigin=Zs(this),this._markDirty(Ks)}get skewY(){return this._skewY}set skewY(e){this._skewY=e,this._hasSkewOrigin=Zs(this),this._markDirty(Ks)}get skewZ(){return this._skewZ}set skewZ(e){this._skewZ=e,this._hasSkewOrigin=Zs(this),this._markDirty(Ks)}get transformOriginX(){return this._originX}set transformOriginX(e){this._originX=e,this._hasSkewOrigin=Zs(this),this._markDirty(Ks)}get transformOriginY(){return this._originY}set transformOriginY(e){this._originY=e,this._hasSkewOrigin=Zs(this),this._markDirty(Ks)}get transformOriginZ(){return this._originZ}set transformOriginZ(e){this._originZ=e,this._hasSkewOrigin=Zs(this),this._markDirty(Ks)}get opacity(){return Ys(this.parent.material,"opacity",en,1)}set opacity(e){jr(this.parent.material,"opacity",e,en)}get visible(){return this._hasGetVisible?this.parent.getVisibleAt(this.id):!0}set visible(e){this._hasSetVisible&&this.parent.setVisibleAt(this.id,e)}};var jm=Gn.registerTargetAdapter(i=>i instanceof Id);jm.registerProperty("color",i=>qs(i._color),(i,e,t)=>{if(!i._hasSetColor)return;let n=t._numbers;i._color.setRGB(n[0]*mn,n[1]*mn,n[2]*mn,St);let s=i.parent;s.setColorAt(i.id,i._color),s.instanceColor&&(s.instanceColor.needsUpdate=!0)});jm.registerProperty("transformOrigin",i=>`${i._originX} ${i._originY} ${i._originZ}`,(i,e,t)=>{let n=t._numbers;i._originX=n[0],i._originY=n[1],i._originZ=n[2],i._hasSkewOrigin=Zs(i),i._markDirty(Ks)});var Nn=js.rotational,an=await fetch("./assets/project.json").then(async i=>{if(!i.ok)throw new Error(`project settings HTTP ${i.status}`);return i.json()});if(an.compositionMode==="multiple"||an.renderer==="layered-vessels"||an.renderer==="feature-solids"){let{startMultiple:i}=await Promise.resolve().then(()=>(yg(),xg));await i(an)}else if(["handled-vessel","feature-solid"].includes(an.shapeKind)){let{startHandled:i}=await Promise.resolve().then(()=>(wg(),Eg));await i(an,{installGallery:to,galleryProfile:no})}else{let y=function(){let xe=t.clientWidth,we=t.clientHeight;n.setSize(xe,we),r.aspect=xe/we;let oe=Math.tan(Sn.degToRad(r.fov/2)),Z=Math.max(u/(2*oe),d/(2*oe*r.aspect))*Nn.fit;if(h){let se=Math.hypot(d,u)/2,_e=Math.atan(oe*Math.min(1,r.aspect));Z=se/Math.sin(_e)*Nn.wideFit}r.position.set(0,0,Z),r.lookAt(0,0,0),r.updateProjectionMatrix()},ne=function(){return scrollY/innerHeight*100},Me=function(){return ne()/H*1200},B=function(){let xe=re.getBoundingClientRect(),we=an.sheetFrontBox,oe=xe.width*we.width,Z=xe.height*we.height,se=xe.left+xe.width*we.cx-oe/2,_e=xe.top+xe.height*we.cy-Z/2,Ae=Math.min(innerHeight*.67,innerWidth*(innerWidth<=600?.98:1.1));h&&(Ae=Math.min(Ae,innerWidth*.9*Z/oe));let Ye=Ae/Z,Re=innerWidth/2-(se+oe/2),He=innerHeight/2-(_e+Z/2);ge.style.left=`${se}px`,ge.style.top=`${_e}px`,ge.style.width=`${oe}px`,ge.style.height=`${Z}px`,ge.style.transform=`translate(${Re*de.t}px,${He*de.t}px) scale(${1+(Ye-1)*de.t})`},ae=function(){G.seek(Me())},ce=function(){M.depthWrite=M.opacity>.98,E.visible=R.constant>-f+5e-4,B(),fe||n.render(s,r),requestAnimationFrame(ce)},me=function(){let xe=Me();t.setAttribute("aria-hidden",te&&xe>=1080?"true":"false"),window.__transformProgress=Math.max(0,Math.min(1,ne()/Y))},i=await fetch("./assets/outer-profile.json").then(async xe=>{if(!xe.ok)throw new Error(`CAD profile HTTP ${xe.status}`);return xe.json()}),e=await new gs().loadAsync("./assets/model.glb"),t=document.querySelector("#viewer"),n=new ps({antialias:!0,alpha:!0});n.setPixelRatio(Math.min(devicePixelRatio,Nn.pixelRatioCap)),n.localClippingEnabled=!0,t.appendChild(n.domElement);let s=new Fi,r=new Dt(Nn.fov,1,Nn.near,Nn.far);s.add(new Hi(Nn.skyColor,Nn.groundColor,Nn.hemisphereIntensity));let o=new Gi(Nn.keyColor,Nn.keyIntensity);o.position.set(...Nn.keyPosition),s.add(o);let a;if(e.scene.traverse(xe=>{xe.isMesh&&(a=xe)}),!a)throw new Error("GLB contains no mesh");a.updateWorldMatrix(!0,!1);let l=a.geometry.clone();l.applyMatrix4(a.matrixWorld),l.computeBoundingBox();let c=l.boundingBox,u=c.max.y-c.min.y,d=Math.max(c.max.x-c.min.x,c.max.z-c.min.z),h=an.dimensionsMm.maxDiameter>an.dimensionsMm.height,f=h?Math.hypot(d,u)/2*1.01:u/2,g=an.dimensionsMm.height/1e3;if(Math.abs(u-g)>.003)throw new Error("CAD and GLB height disagree");new ResizeObserver(y).observe(t),y();let m=new At;s.add(m);let p=new At;m.add(p);let T=new At;T.position.y=-(c.min.y+c.max.y)/2,p.add(T);let A={right:["rotateZ",-1],left:["rotateZ",1],forward:["rotateX",1],backward:["rotateX",-1],none:["rotateZ",0]},v=A[an.motion.tiltDirection]||A.right,M=new Cn({color:an.clayColor,roughness:Nn.clayRoughness,transparent:!0,opacity:0,depthWrite:!1,side:Wt}),b=new It(l,M);T.add(b);let R=new rn(new O(0,-1,0),-f),x=a.material.clone();x.clippingPlanes=[R],x.polygonOffset=!0,x.polygonOffsetFactor=-2,x.polygonOffsetUnits=-2,x.side=Wt;let E=new It(l,x);E.scale.setScalar(1.003),T.add(E);let P=[],D=72,V=12;for(let[xe,we]of i.filter((oe,Z)=>Z%4===0||Z===i.length-1)){let oe=xe/1e3,Z=we/1e3;if(!(oe<.001))for(let se=0;se<D;se++){let _e=se/D*Math.PI*2,Ae=(se+1)/D*Math.PI*2;P.push(oe*Math.cos(_e),Z,oe*Math.sin(_e),oe*Math.cos(Ae),Z,oe*Math.sin(Ae))}}for(let xe=0;xe<V;xe++){let we=xe/V*Math.PI*2;for(let oe=0;oe<i.length-1;oe++){let[Z,se]=i[oe],[_e,Ae]=i[oe+1];P.push(Z/1e3*Math.cos(we),se/1e3,Z/1e3*Math.sin(we),_e/1e3*Math.cos(we),Ae/1e3,_e/1e3*Math.sin(we))}}let W=new Pt;W.setAttribute("position",new Lt(P,3));let L=new zn({color:Qs,transparent:!0,opacity:0,depthWrite:!1}),z=new jn(W,L);T.add(z);let K=document.querySelector("#story"),H=an.motion.storyHeightVh-100,te=an.ending!=="glaze",Y=H*(te?1080:1e3)/1200;K.style.height=`${100+Y}vh`,window.__photoPacing={original:"moon-jar",photoTransitionVh:0,totalScrollVh:Y,pace:()=>({scrollVh:ne(),timelineTime:Me()})};let Ne=document.querySelector("#cad-sheet"),re=document.querySelector("#cad-sheet-image"),ge=document.querySelector("#cad-main"),de={t:0};await re.decode(),addEventListener("resize",B),B();let G=bd({autoplay:!1,defaults:{ease:"linear"}}).add(ge,{opacity:[0,1],duration:70},100).add(Ne,{opacity:[1,0],duration:100},150).add(de,{t:[0,1],duration:240,ease:"inOutCubic"},260).add(L,{opacity:[0,1],duration:110},360).add(ge,{opacity:[1,0],duration:110},430).add(T,{rotateY:[0,390],duration:500},500).add(m,{rotateY:[0,360],duration:500},500).add(p,{[v[0]]:[0,v[1]*an.motion.tiltDegrees],duration:200,ease:"inOutSine"},500).add(L,{opacity:[1,0],duration:140},620).add(M,{opacity:[0,1],duration:130},620).add(R,{constant:[-f,f],duration:200},780).add("body",{backgroundColor:["#fff","#202023"],duration:240},680);te&&G.add(t,{opacity:[1,0],duration:70},1010).add("body",{backgroundColor:["#202023","#f2eee9"],duration:60},1020),addEventListener("scroll",ae,{passive:!0}),addEventListener("resize",ae),ae();let fe=!1;ce(),addEventListener("scroll",me,{passive:!0}),me(),window.__moonJar={config:an,camera:r,root:T,orbitRig:m,tiltRig:p,wireMaterial:L,clayMaterial:M,clip:R,geometry:l,timeline:G,glbLoaded:!0},te&&to({gallery:document.querySelector("#gallery"),story:K,isActive:()=>ne()>=Y-.2,onActiveChange:xe=>{fe=xe},profile:no,source:"moon-jar-photo-pacing-slow"})}
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)

animejs/dist/modules/core/consts.js:
animejs/dist/modules/core/globals.js:
animejs/dist/modules/core/helpers.js:
animejs/dist/modules/core/transforms.js:
animejs/dist/modules/core/colors.js:
animejs/dist/modules/core/values.js:
animejs/dist/modules/core/render.js:
animejs/dist/modules/core/styles.js:
animejs/dist/modules/core/clock.js:
animejs/dist/modules/core/targets.js:
animejs/dist/modules/core/units.js:
  (**
   * Anime.js - core - ESM
   * @version v4.5.0
   * @license MIT
   * @copyright 2026 - Julian Garnier
   *)

animejs/dist/modules/adapters/registry.js:
animejs/dist/modules/adapters/three/adapter.js:
animejs/dist/modules/adapters/three/helpers.js:
animejs/dist/modules/adapters/three/resolvers.js:
animejs/dist/modules/adapters/three/uniform.js:
animejs/dist/modules/adapters/three/object3d.js:
animejs/dist/modules/adapters/three/instance.js:
animejs/dist/modules/adapters/three/index.js:
  (**
   * Anime.js - adapters - ESM
   * @version v4.5.0
   * @license MIT
   * @copyright 2026 - Julian Garnier
   *)

animejs/dist/modules/animation/additive.js:
animejs/dist/modules/animation/composition.js:
animejs/dist/modules/animation/animation.js:
  (**
   * Anime.js - animation - ESM
   * @version v4.5.0
   * @license MIT
   * @copyright 2026 - Julian Garnier
   *)

animejs/dist/modules/engine/engine.js:
  (**
   * Anime.js - engine - ESM
   * @version v4.5.0
   * @license MIT
   * @copyright 2026 - Julian Garnier
   *)

animejs/dist/modules/timer/timer.js:
  (**
   * Anime.js - timer - ESM
   * @version v4.5.0
   * @license MIT
   * @copyright 2026 - Julian Garnier
   *)

animejs/dist/modules/easings/none.js:
animejs/dist/modules/easings/eases/parser.js:
  (**
   * Anime.js - easings - ESM
   * @version v4.5.0
   * @license MIT
   * @copyright 2026 - Julian Garnier
   *)

animejs/dist/modules/timeline/position.js:
animejs/dist/modules/timeline/timeline.js:
  (**
   * Anime.js - timeline - ESM
   * @version v4.5.0
   * @license MIT
   * @copyright 2026 - Julian Garnier
   *)

animejs/dist/modules/utils/number.js:
  (**
   * Anime.js - utils - ESM
   * @version v4.5.0
   * @license MIT
   * @copyright 2026 - Julian Garnier
   *)

animejs/dist/modules/index.js:
  (**
   * Anime.js - ESM
   * @version v4.5.0
   * @license MIT
   * @copyright 2026 - Julian Garnier
   *)
*/
