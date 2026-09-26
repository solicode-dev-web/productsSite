/* frontend/js/three-scene.js - Three.js 3D Engine for BeautyHub */

let heroScene, heroCamera, heroRenderer, heroBottleGroup, heroParticles;
let quickviewScene, quickviewCamera, quickviewRenderer, quickviewBottleGroup;

// Mouse Tracking state for Hero
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

function initThreeJS() {
  initHero3D();
  window.addEventListener('resize', onWindowResize);
  document.addEventListener('mousemove', onMouseMove);
}

// 1. HERO REAL 3D SCENE (Multi-Product Luxury WebGL Composition)
function initHero3D() {
  const container = document.getElementById('hero-3d-canvas-container');
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  // Scene
  heroScene = new THREE.Scene();

  // Camera
  heroCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  heroCamera.position.set(0, 0, 8.5);

  // Renderer
  heroRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  heroRenderer.setSize(width, height);
  heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  heroRenderer.shadowMap.enabled = true;
  heroRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Clear previous canvas
  container.innerHTML = '';
  container.appendChild(heroRenderer.domElement);

  // Lighting Studio (Rose Gold & Warm Champagne)
  const ambientLight = new THREE.AmbientLight(0xfff1f2, 0.8);
  heroScene.add(ambientLight);

  const spotRose = new THREE.SpotLight(0xf472b6, 3.5);
  spotRose.position.set(5, 8, 6);
  spotRose.angle = Math.PI / 4;
  spotRose.penumbra = 0.8;
  heroScene.add(spotRose);

  const spotGold = new THREE.SpotLight(0xf59e0b, 2.5);
  spotGold.position.set(-6, 5, 4);
  spotGold.angle = Math.PI / 3;
  spotGold.penumbra = 0.9;
  heroScene.add(spotGold);

  const rimLight = new THREE.PointLight(0xfb7185, 2.5, 12);
  rimLight.position.set(0, -3, -4);
  heroScene.add(rimLight);

  // Create Master 3D Product Group
  heroBottleGroup = new THREE.Group();

  // Material System
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.9,
    roughness: 0.12,
    envMapIntensity: 1.5
  });

  const roseGoldMat = new THREE.MeshStandardMaterial({
    color: 0xfb7185,
    metalness: 0.85,
    roughness: 0.15
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.88,
    opacity: 1,
    transparent: true,
    roughness: 0.08,
    ior: 1.52,
    reflectivity: 0.9,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05
  });

  const liquidMat = new THREE.MeshStandardMaterial({
    color: 0xf472b6,
    roughness: 0.2,
    metalness: 0.2,
    emissive: 0xbe123c,
    emissiveIntensity: 0.25
  });

  // --- OBJECT 1: Main Serum Bottle (Center) ---
  const bottleGroup = new THREE.Group();
  
  const bodyGeo = new THREE.CylinderGeometry(0.85, 0.85, 2.5, 32);
  const bodyMesh = new THREE.Mesh(bodyGeo, glassMat);
  bottleGroup.add(bodyMesh);

  const liquidGeo = new THREE.CylinderGeometry(0.78, 0.78, 1.9, 32);
  const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
  liquidMesh.position.y = -0.2;
  bottleGroup.add(liquidMesh);

  const shoulderGeo = new THREE.CylinderGeometry(0.55, 0.85, 0.3, 32);
  const shoulderMesh = new THREE.Mesh(shoulderGeo, roseGoldMat);
  shoulderMesh.position.y = 1.4;
  bottleGroup.add(shoulderMesh);

  const capGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.85, 32);
  const capMesh = new THREE.Mesh(capGeo, goldMat);
  capMesh.position.y = 1.95;
  bottleGroup.add(capMesh);

  const dropperGeo = new THREE.SphereGeometry(0.32, 32, 16);
  const dropperMat = new THREE.MeshStandardMaterial({ color: 0x221424, roughness: 0.7 });
  const dropperMesh = new THREE.Mesh(dropperGeo, dropperMat);
  dropperMesh.position.y = 2.4;
  bottleGroup.add(dropperMesh);

  bottleGroup.position.set(0, 0.2, 0);
  heroBottleGroup.add(bottleGroup);

  // --- OBJECT 2: Luxury Skincare Jar (Left Side) ---
  const jarGroup = new THREE.Group();
  const jarGeo = new THREE.CylinderGeometry(0.75, 0.7, 0.9, 32);
  const jarMesh = new THREE.Mesh(jarGeo, glassMat);
  jarGroup.add(jarMesh);

  const jarCreamGeo = new THREE.CylinderGeometry(0.68, 0.65, 0.65, 32);
  const jarCreamMat = new THREE.MeshStandardMaterial({ color: 0xfff1f2, roughness: 0.4 });
  const jarCreamMesh = new THREE.Mesh(jarCreamGeo, jarCreamMat);
  jarCreamMesh.position.y = -0.05;
  jarGroup.add(jarCreamMesh);

  const jarCapGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.3, 32);
  const jarCapMesh = new THREE.Mesh(jarCapGeo, roseGoldMat);
  jarCapMesh.position.y = 0.55;
  jarGroup.add(jarCapMesh);

  jarGroup.position.set(-1.8, -0.6, 0.4);
  jarGroup.rotation.y = 0.3;
  heroBottleGroup.add(jarGroup);

  // --- OBJECT 3: Luxury Lipstick Tube (Right Side) ---
  const lipstickGroup = new THREE.Group();
  const lipBaseGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.4, 32);
  const lipBaseMesh = new THREE.Mesh(lipBaseGeo, goldMat);
  lipstickGroup.add(lipBaseMesh);

  const lipBulletGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.6, 32);
  const lipBulletMat = new THREE.MeshStandardMaterial({ color: 0xbe123c, roughness: 0.3 });
  const lipBulletMesh = new THREE.Mesh(lipBulletGeo, lipBulletMat);
  lipBulletMesh.position.y = 0.8;
  lipBulletMesh.rotation.z = -0.15;
  lipstickGroup.add(lipBulletMesh);

  lipstickGroup.position.set(1.7, -0.5, 0.5);
  lipstickGroup.rotation.z = -0.2;
  heroBottleGroup.add(lipstickGroup);

  // --- OBJECT 4: Floating Luxury Gold Torus Rings ---
  const ringGeo = new THREE.TorusGeometry(2.4, 0.03, 16, 100);
  const ringMesh = new THREE.Mesh(ringGeo, goldMat);
  ringMesh.rotation.x = Math.PI / 3;
  heroBottleGroup.add(ringMesh);

  const ringGeo2 = new THREE.TorusGeometry(1.6, 0.02, 16, 100);
  const ringMesh2 = new THREE.Mesh(ringGeo2, roseGoldMat);
  ringMesh2.rotation.y = Math.PI / 4;
  heroBottleGroup.add(ringMesh2);

  // --- OBJECT 5: Pedestal Platform ---
  const pedestalGeo = new THREE.CylinderGeometry(2.2, 2.5, 0.3, 64);
  const pedestalMat = new THREE.MeshStandardMaterial({
    color: 0x1d0e22,
    metalness: 0.6,
    roughness: 0.25
  });
  const pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMat);
  pedestalMesh.position.y = -1.6;
  heroBottleGroup.add(pedestalMesh);

  heroScene.add(heroBottleGroup);

  // Floating Particles Cloud
  const particlesCount = 150;
  const pGeometry = new THREE.BufferGeometry();
  const pPositions = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i += 3) {
    pPositions[i] = (Math.random() - 0.5) * 12;
    pPositions[i + 1] = (Math.random() - 0.5) * 9;
    pPositions[i + 2] = (Math.random() - 0.5) * 8;
  }

  pGeometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));

  const pMaterial = new THREE.PointsMaterial({
    color: 0xfb7185,
    size: 0.07,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });

  heroParticles = new THREE.Points(pGeometry, pMaterial);
  heroScene.add(heroParticles);

  animateHero();
}

function onMouseMove(event) {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function animateHero() {
  requestAnimationFrame(animateHero);

  if (heroBottleGroup) {
    targetX = mouseX * 0.4;
    targetY = mouseY * 0.25;

    heroBottleGroup.rotation.y += 0.006;
    heroBottleGroup.rotation.x += (targetY - heroBottleGroup.rotation.x) * 0.04;
    heroBottleGroup.rotation.z += (-targetX - heroBottleGroup.rotation.z) * 0.04;

    heroBottleGroup.position.y = Math.sin(Date.now() * 0.0012) * 0.12;
  }

  if (heroParticles) {
    heroParticles.rotation.y -= 0.0015;
    heroParticles.rotation.x += 0.0004;
  }

  if (heroRenderer && heroScene && heroCamera) {
    heroRenderer.render(heroScene, heroCamera);
  }
}

// 2. QUICK VIEW 3D BOTTLE VIEWER
function initQuickView3D(containerId, categorySlug = 'skincare') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const width = container.clientWidth || 380;
  const height = container.clientHeight || 380;

  quickviewScene = new THREE.Scene();
  quickviewCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  quickviewCamera.position.set(0, 0, 7);

  quickviewRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  quickviewRenderer.setSize(width, height);
  quickviewRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  container.innerHTML = '';
  container.appendChild(quickviewRenderer.domElement);

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.8);
  quickviewScene.add(ambient);

  const spot = new THREE.SpotLight(0xfb7185, 2.5);
  spot.position.set(4, 6, 4);
  quickviewScene.add(spot);

  const rim = new THREE.PointLight(0xf59e0b, 2);
  rim.position.set(-4, -2, -3);
  quickviewScene.add(rim);

  let liquidColor = 0xf472b6;
  if (categorySlug === 'makeup') liquidColor = 0xfb7185;
  if (categorySlug === 'parfum') liquidColor = 0xd97706;

  quickviewBottleGroup = new THREE.Group();

  const bodyGeo = new THREE.CylinderGeometry(1.0, 1.0, 2.4, 32);
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.9,
    roughness: 0.05,
    ior: 1.5,
    transparent: true,
    opacity: 0.95
  });
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  quickviewBottleGroup.add(bodyMesh);

  const liquidGeo = new THREE.CylinderGeometry(0.92, 0.92, 2.0, 32);
  const liquidMat = new THREE.MeshStandardMaterial({
    color: liquidColor,
    roughness: 0.3,
    metalness: 0.2
  });
  const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
  liquidMesh.position.y = -0.15;
  quickviewBottleGroup.add(liquidMesh);

  const capGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.9, 32);
  const capMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.95,
    roughness: 0.1
  });
  const capMesh = new THREE.Mesh(capGeo, capMat);
  capMesh.position.y = 1.6;
  quickviewBottleGroup.add(capMesh);

  quickviewScene.add(quickviewBottleGroup);

  animateQuickView();
}

function animateQuickView() {
  if (quickviewRenderer && quickviewScene && quickviewCamera) {
    requestAnimationFrame(animateQuickView);

    if (quickviewBottleGroup) {
      quickviewBottleGroup.rotation.y += 0.015;
    }

    quickviewRenderer.render(quickviewScene, quickviewCamera);
  }
}

function onWindowResize() {
  if (heroCamera && heroRenderer) {
    const container = document.getElementById('hero-3d-canvas-container');
    if (container) {
      const width = container.clientWidth;
      const height = container.clientHeight;
      heroCamera.aspect = width / height;
      heroCamera.updateProjectionMatrix();
      heroRenderer.setSize(width, height);
    }
  }
}
