import './style.css';
import './glass-study.css';
import * as THREE from 'three';
import { bindOrbitInput } from './orbit-input.js';

const host = document.querySelector('#study-stage');
const message = document.querySelector('#study-message');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let renderer;
let disposed = false;
let raf = 0;
let angle = -0.34;
let target = angle;
let frameCount = 0;
const resources = [];
let cleanup = () => { disposed = true; cancelAnimationFrame(raf); for (const resource of resources) resource.dispose(); renderer?.dispose(); };
const keep = (resource) => (resources.push(resource), resource);
const width = 2.5, height = 2.5, thickness = 0.12;
const cardCenter = new THREE.Vector3(0, 1.8, 0);
const lightDirection = new THREE.Vector3(-3, 6, 4).normalize();
const rayDirection = lightDirection.clone().negate();

try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.3 : 1.6));
  // Keep the UI cream and transmitted cream in the same display transform.
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.transmissionResolutionScale = 0.65;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.prepend(renderer.domElement);
  start().catch(fallback);
} catch (error) {
  fallback(error);
}

function fallback(error) {
  cleanup();
  cancelAnimationFrame(raf);
  raf = 0;
  host.classList.remove('is-ready');
  message.hidden = false;
  message.textContent = '이 환경에서는 유리 미리보기를 표시할 수 없습니다. 컬렉션에서 작품을 확인해주세요.';
  console.warn('Glass study unavailable:', error.message);
  if (renderer) renderer.domElement.hidden = true;
}

async function start() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#F7F3E8');
  const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 60);
  camera.position.set(0, 3.5, 8.5);
  camera.lookAt(0, 1.2, 0);

  // A window lives in the reflection environment only: the page stays cream.
  const environment = new THREE.Scene();
  environment.background = new THREE.Color(0.52, 0.5, 0.45);
  const paneGeometry = new THREE.PlaneGeometry(1.2, 1.8);
  const paneMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(5, 4.7, 4.1), side: THREE.DoubleSide });
  const windowGroup = new THREE.Group();
  for (const x of [-0.65, 0.65]) for (const y of [-0.95, 0.95]) {
    const pane = new THREE.Mesh(paneGeometry, paneMaterial);
    pane.position.set(x, y, 0);
    windowGroup.add(pane);
  }
  windowGroup.position.copy(lightDirection).multiplyScalar(5);
  windowGroup.lookAt(0, 1.5, 0);
  environment.add(windowGroup);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environmentTarget = keep(pmrem.fromScene(environment, 0.025, 0.1, 30));
  scene.environment = environmentTarget.texture;
  paneGeometry.dispose(); paneMaterial.dispose(); pmrem.dispose();
  const sun = new THREE.DirectionalLight('#fff6de', 2.7);
  sun.position.copy(lightDirection).multiplyScalar(8);
  scene.add(sun);
  scene.add(new THREE.HemisphereLight('#fffdf5', '#d3c8ae', 0.8));

  const floor = new THREE.Mesh(keep(new THREE.PlaneGeometry(100, 100)), keep(new THREE.MeshBasicMaterial({ color: '#F7F3E8', toneMapped: false })));
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const shape = new THREE.Shape();
  const r = 0.2, x = -width / 2, y = -height / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y); shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + height - r); shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  shape.lineTo(x + r, y + height); shape.quadraticCurveTo(x, y + height, x, y + height - r);
  shape.lineTo(x, y + r); shape.quadraticCurveTo(x, y, x + r, y);
  const geometry = keep(new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.035, bevelSegments: 4, curveSegments: 12, steps: 1 }));
  geometry.center();
  const glass = keep(new THREE.MeshPhysicalMaterial({
    color: '#ffffff', metalness: 0, roughness: 0.085, transmission: 1,
    thickness: 0.19, ior: 1.46, envMapIntensity: 1.1,
    attenuationColor: '#fff8df', attenuationDistance: 4,
  }));
  const group = new THREE.Group();
  group.position.copy(cardCenter);
  group.add(new THREE.Mesh(geometry, glass));
  scene.add(group);

  // Existing PNGs stay unchanged. Separate front/back prints avoid mirrored text/content.
  try {
    const texture = await new THREE.TextureLoader().loadAsync('/vessels/moon.png');
    if (disposed) { texture.dispose(); return; }
    keep(texture); texture.colorSpace = THREE.SRGBColorSpace;
    const artGeometry = keep(new THREE.PlaneGeometry(1.75, 2.18));
    const artMaterial = keep(new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: 0.015, depthWrite: false, toneMapped: false }));
    for (const side of [-1, 1]) {
      const art = new THREE.Mesh(artGeometry, artMaterial);
      art.position.z = side * 0.101;
      if (side < 0) art.rotation.y = Math.PI;
      group.add(art);
    }
  } catch (error) { fallback(error); return; }

  // Light-space footprint: project the card corners onto a shared ground plane.
  // The shader approximates edge concentration; it does NOT trace physical caustics.
  const projectionGeometry = keep(new THREE.PlaneGeometry(1, 1));
  const projectionMaterial = keep(new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
    uniforms: { strength: { value: 0.65 } },
    vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `varying vec2 vUv; uniform float strength;
      void main(){
        vec2 p=abs(vUv-.5); vec2 q=p-vec2(.40,.39);
        float d=length(max(q,0.))+min(max(q.x,q.y),0.)-.055;
        float rim=exp(-pow(d/.017,2.));
        float halo=exp(-pow(d/.060,2.));
        float inside=1.-smoothstep(-.035,.015,d);
        float edgeBias=.35+.65*smoothstep(.05,.9,vUv.x*.55+(1.-vUv.y)*.45);
        float alpha=(rim*.85+halo*.13+inside*.12)*strength*edgeBias;
        vec3 col=mix(vec3(1.,.88,.58),vec3(1.,.995,.955),clamp(rim+inside,0.,1.));
        gl_FragColor=vec4(col,alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    toneMapped: false,
  }));
  const projectedLight = new THREE.Mesh(projectionGeometry, projectionMaterial);
  projectedLight.frustumCulled = false;
  scene.add(projectedLight);
  const shadowMaterial = keep(new THREE.ShaderMaterial({ transparent: true, depthWrite: false,
    vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: 'varying vec2 vUv;void main(){float a=exp(-dot((vUv-.5)*4.,(vUv-.5)*4.))*.075;gl_FragColor=vec4(.37,.32,.22,a);}',
  }));
  const shadow = new THREE.Mesh(keep(new THREE.PlaneGeometry(4, 2.2)), shadowMaterial);
  shadow.rotation.x = -Math.PI / 2; shadow.position.set(.35, .002, -.3); scene.add(shadow);

  const normal = new THREE.Vector3();
  const corner = new THREE.Vector3();
  const localCorners = [[-width/2,height/2],[width/2,height/2],[-width/2,-height/2],[width/2,-height/2]];
  function draw() {
    raf = 0;
    if (disposed || document.hidden) return;
    angle += (target - angle) * (reduced.matches ? 1 : .13);
    if (Math.abs(angle) > Math.PI * 200) { const shift = Math.trunc(angle / (Math.PI*2))*Math.PI*2; angle -= shift; target -= shift; }
    group.rotation.y = angle;
    group.updateMatrixWorld(true);
    normal.set(0,0,1).applyQuaternion(group.quaternion);
    const incidence = Math.abs(normal.dot(lightDirection));
    projectionMaterial.uniforms.strength.value = .30 + incidence * .65;
    const positions = projectionGeometry.attributes.position;
    // A parallel slab's exiting rays are parallel to incident rays; lateral shift
    // and bevel focusing are stylized here. The world-space light stays fixed.
    localCorners.forEach(([cx,cy], i) => {
      corner.set(cx,cy,0).applyMatrix4(group.matrixWorld);
      const distance = (0.008 - corner.y) / rayDirection.y;
      corner.addScaledVector(rayDirection, distance);
      positions.setXYZ(i, corner.x, .008, corner.z);
    });
    positions.needsUpdate = true;
    renderer.render(scene,camera);
    host.dataset.frames = String(++frameCount);
    host.dataset.angle = angle.toFixed(5);
    if (Math.abs(target-angle) > .0001) raf = requestAnimationFrame(draw);
  }
  function requestDraw() { if (!raf && !disposed) raf=requestAnimationFrame(draw); }
  function resize() {
    const w=host.clientWidth,h=host.clientHeight;
    if (!w || !h) return;
    camera.aspect=w/h;
    camera.position.set(0,3.5,w/h < .8 ? 12.5 : 8.5);
    camera.lookAt(0,1.2,0); camera.updateProjectionMatrix();
    renderer.setSize(w,h,false); requestDraw();
  }
  const rotate = (delta) => { target += delta; requestDraw(); };
  const unbind=bindOrbitInput({wheelTarget:host,dragTarget:host,enabled:()=>!disposed,onDelta:rotate});
  const abort=new AbortController();
  const opts={signal:abort.signal};
  document.querySelector('#study-prev').addEventListener('click',()=>rotate(-Math.PI/6),opts);
  document.querySelector('#study-next').addEventListener('click',()=>rotate(Math.PI/6),opts);
  host.addEventListener('keydown',(e)=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();rotate(e.key==='ArrowRight'?Math.PI/6:-Math.PI/6);}},opts);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else requestDraw();},opts);
  renderer.domElement.addEventListener('webglcontextlost',(e)=>{e.preventDefault();fallback(new Error('WebGL context lost'));},opts);
  const observer=new ResizeObserver(resize);observer.observe(host);
  message.hidden=true;host.classList.add('is-ready');resize();
  const dispose=()=>{disposed=true;cancelAnimationFrame(raf);unbind();abort.abort();observer.disconnect();for(const r of resources)r.dispose();renderer.dispose();};
  cleanup = dispose;
  window.addEventListener('pagehide',e=>{if(!e.persisted)dispose();},opts);
  if(import.meta.hot)import.meta.hot.dispose(dispose);
}
