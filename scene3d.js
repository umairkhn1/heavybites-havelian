/* ============================================================
   HEAVYBITES HAVELIAN — 3D hero
   A procedurally built pizza, slowly turning, lit warm.
   No models or textures to download: everything is geometry.
   Fails soft: if WebGL or the CDN is unavailable, the poster
   image in index.html stays visible.
   ============================================================ */
import * as THREE from 'three';

const canvas = document.getElementById('scene');
const stage = document.getElementById('stage');
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function supportsWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) { return false; }
}

if (canvas && stage && supportsWebGL()) {
  try { init(); } catch (err) { console.warn('3D hero unavailable:', err); }
}

function init() {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 4.1, 6.6);
  camera.lookAt(0, 0.1, 0);

  /* ---------- lighting ---------- */
  scene.add(new THREE.AmbientLight(0xfff2dd, 0.55));

  const key = new THREE.DirectionalLight(0xfff0d2, 2.1);
  key.position.set(4, 7, 4);
  scene.add(key);

  const amber = new THREE.PointLight(0xffb03a, 42, 18, 2);
  amber.position.set(-3.4, 2.4, 2.6);
  scene.add(amber);

  const ember = new THREE.PointLight(0xff4a24, 26, 16, 2);
  ember.position.set(3.2, 1.6, -2.4);
  scene.add(ember);

  const rim = new THREE.PointLight(0x8fb8ff, 10, 14, 2);
  rim.position.set(0, 3.2, -5);
  scene.add(rim);

  /* ---------- materials ---------- */
  const mat = (color, roughness = 0.85, metalness = 0) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness });

  const doughMat = mat(0xe0a25c, 0.92);
  const crustMat = mat(0xc07a33, 0.88);
  const sauceMat = mat(0x9e2216, 0.75);
  const cheeseMat = mat(0xf2c04c, 0.62);
  const pepMat = mat(0xbf2f1d, 0.55);
  const boardMat = mat(0x161210, 0.96);

  /* ---------- pizza group ---------- */
  const pizza = new THREE.Group();
  pizza.rotation.x = 0.16;
  scene.add(pizza);

  // serving board
  const board = new THREE.Mesh(new THREE.CylinderGeometry(2.62, 2.62, 0.14, 64), boardMat);
  board.position.y = -0.32;
  pizza.add(board);

  // dough base
  const base = new THREE.Mesh(new THREE.CylinderGeometry(2.16, 2.1, 0.26, 72), doughMat);
  pizza.add(base);

  // crust ring
  const crust = new THREE.Mesh(new THREE.TorusGeometry(2.14, 0.26, 18, 84), crustMat);
  crust.rotation.x = Math.PI / 2;
  crust.position.y = 0.08;
  pizza.add(crust);

  // sauce
  const sauce = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 0.07, 64), sauceMat);
  sauce.position.y = 0.17;
  pizza.add(sauce);

  // cheese
  const cheese = new THREE.Mesh(new THREE.CylinderGeometry(1.94, 1.96, 0.13, 64), cheeseMat);
  cheese.position.y = 0.24;
  pizza.add(cheese);

  // melted cheese blobs around the edge
  const blobGeo = new THREE.SphereGeometry(0.17, 16, 12);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + 0.4;
    const r = 1.72 + Math.random() * 0.14;
    const blob = new THREE.Mesh(blobGeo, cheeseMat);
    blob.position.set(Math.cos(a) * r, 0.28, Math.sin(a) * r);
    blob.scale.set(1, 0.55 + Math.random() * 0.25, 1);
    pizza.add(blob);
  }

  // pepperoni
  const pepGeo = new THREE.CylinderGeometry(0.27, 0.27, 0.06, 24);
  const spots = [
    [0.0, 0.0], [0.95, 0.55], [-0.85, 0.75], [0.75, -0.95], [-0.7, -0.85],
    [1.35, 0.05], [-1.3, -0.15], [0.15, 1.3], [-0.2, -1.35], [1.1, -0.45]
  ];
  spots.forEach(([x, z], i) => {
    const p = new THREE.Mesh(pepGeo, pepMat);
    p.position.set(x, 0.32 + (i % 3) * 0.004, z);
    p.rotation.y = i * 0.7;
    pizza.add(p);
  });

  // herb flecks
  const herbGeo = new THREE.SphereGeometry(0.055, 8, 6);
  const herbMat = mat(0x3f6b32, 0.9);
  for (let i = 0; i < 22; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * 1.75;
    const h = new THREE.Mesh(herbGeo, herbMat);
    h.position.set(Math.cos(a) * r, 0.315, Math.sin(a) * r);
    h.scale.set(1, 0.4, 1);
    pizza.add(h);
  }

  // thin gold orbit ring for depth
  const orbit = new THREE.Mesh(
    new THREE.TorusGeometry(3.0, 0.008, 8, 128),
    new THREE.MeshBasicMaterial({ color: 0xf2c14e, transparent: true, opacity: 0.5 })
  );
  orbit.rotation.x = Math.PI / 2;
  orbit.position.y = -0.18;
  pizza.add(orbit);

  /* ---------- steam particles ---------- */
  const COUNT = 130;
  const pos = new Float32Array(COUNT * 3);
  const speed = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * 1.9;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = 0.4 + Math.random() * 3.2;
    pos[i * 3 + 2] = Math.sin(a) * r;
    speed[i] = 0.18 + Math.random() * 0.34;
  }
  const steamGeo = new THREE.BufferGeometry();
  steamGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const steam = new THREE.Points(steamGeo, new THREE.PointsMaterial({
    color: 0xffe6bd, size: 0.055, transparent: true, opacity: 0.5,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
  }));
  scene.add(steam);

  /* ---------- sizing ---------- */
  function resize() {
    const w = stage.clientWidth || 1;
    const h = stage.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage);
  else window.addEventListener('resize', resize);

  /* ---------- pointer parallax ---------- */
  const pointer = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  window.addEventListener('pointermove', e => {
    target.x = (e.clientX / window.innerWidth - 0.5) * 2;
    target.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  /* ---------- render loop ---------- */
  let visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0.02 }).observe(stage);
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) visible = false; });

  let first = true;
  const clock = new THREE.Clock();

  function frame() {
    requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!visible) { first = false; return; }

    const t = clock.elapsedTime;
    if (!REDUCED) {
      pizza.rotation.y += dt * 0.22;
      pizza.position.y = Math.sin(t * 0.9) * 0.06;
      orbit.rotation.z -= dt * 0.5;

      const arr = steamGeo.attributes.position.array;
      for (let i = 0; i < COUNT; i++) {
        arr[i * 3 + 1] += speed[i] * dt;
        if (arr[i * 3 + 1] > 4.2) arr[i * 3 + 1] = 0.35;
      }
      steamGeo.attributes.position.needsUpdate = true;
    }

    pointer.x += (target.x - pointer.x) * 0.05;
    pointer.y += (target.y - pointer.y) * 0.05;
    camera.position.x = pointer.x * 0.55;
    camera.position.y = 4.1 - pointer.y * 0.35;
    camera.lookAt(0, 0.15, 0);

    renderer.render(scene, camera);

    if (first) { first = false; document.documentElement.classList.add('has3d'); }
  }
  frame();
}
