/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// The Tai Chi figure in 3D (three.js): the same person as the 2D hero, in a
// green hoodie with a hood that holds no face but a small universe. Every pose
// comes from taiChiPose (the movements set from Theodoros's videos); here it is
// taken into depth. Loaded only on the practice page, when the device can draw
// it (see TaiChiFigure).

import * as THREE from 'three';
import {
  type Pt, type PoseMemo, taiChiPose,
  FIGURE_H, UPPER_ARM, FOREARM, SHOULDER_Y, SHOULDER_HALF, HEART_Y, HEM_Y, KNEE_Y,
} from './taiChiPose';

export interface TaiChi3DState {
  bf: number;
  isRising: boolean;
  movementType: string;
  idle: boolean;
}

export interface TaiChi3D {
  setState(s: TaiChi3DState): void;
  dispose(): void;
}

const FOOT_X = 6.5;
// 108 units of the 2D picture = 1.80 m; the soles (2D y = 290) on y = 0.
const SCALE = 1.8 / FIGURE_H;
const to3DX = (x2: number) => (x2 - 200) * SCALE;
const to3DY = (y2: number) => (290 - y2) * SCALE;
const smc = (x: number) => { const c = Math.min(1, Math.max(0, x)); return c * c * (3 - 2 * c); };

/**
 * Draws the figure into `mount` (it fills it). `onTrouble` is called if the
 * device cannot keep up (too few frames) or loses the drawing context, so the
 * page can go back to the 2D figure.
 */
export function createTaiChi3D(mount: HTMLElement, onTrouble: () => void): TaiChi3D {
  type SweptLimb = ReturnType<typeof createSweptLimbMesh>;
  let state: TaiChi3DState = { bf: 1, isRising: true, movementType: '5-5', idle: true };

  // Lighter on a phone: on a sharp screen (2× and more) the pixels are fine
  // enough without antialiasing, and 1.5× is drawn instead of 2× or 3×.
  const dpr = window.devicePixelRatio || 1;
  const renderer = new THREE.WebGLRenderer({ antialias: dpr < 2, powerPreference: 'default', alpha: true, premultipliedAlpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.setPixelRatio(Math.min(dpr, 1.5));
  renderer.setSize(Math.max(1, mount.clientWidth), Math.max(1, mount.clientHeight));
  renderer.domElement.style.display = 'block';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  mount.appendChild(renderer.domElement);
  const onLost = (e: Event) => { e.preventDefault(); onTrouble(); };
  renderer.domElement.addEventListener('webglcontextlost', onLost);

  const scene = new THREE.Scene();
  // No background of its own: it stands on the 2D picture's earth and sky.

  // A soft studio light to reflect (made here, no files).
  {
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x0b1020);
    const top = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), new THREE.MeshBasicMaterial({ color: 0xf0d397, side: THREE.DoubleSide }));
    top.position.set(0, 4, 2); top.lookAt(0, 0, 0); envScene.add(top);
    const side = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), new THREE.MeshBasicMaterial({ color: 0xc9bdf0, side: THREE.DoubleSide }));
    side.position.set(-4, 2, -2); side.lookAt(0, 0, 0); envScene.add(side);
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(envScene, 0.04).texture;
    pmrem.dispose();
    for (const m of [top, side]) { m.geometry.dispose(); (m.material as THREE.Material).dispose(); }
  }

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
  const HALF_FOV = Math.tan((19 * Math.PI) / 180);
  function fitCamera() {
    const w = Math.max(1, mount.clientWidth), h = Math.max(1, mount.clientHeight);
    const aspect = w / h;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    // The whole figure, from the feet to the raised palms, and the arms out at level.
    // The figure stands where the 2D one does: soles at 87% of the height of
    // the (square) picture, 1.8 m tall over 62% of it; the camera looks level.
    const k = 0.69 * Math.min(1, aspect);   // screen half-heights per metre
    camDist = 1 / (k * HALF_FOV);
    camY = 0.749 / 0.69;
    placeCamera();
  }
  // The camera stands in front; for the bow it moves round a little to the
  // side (still, not turning), so the fold at the hips can be seen.
  let camDist = 4;
  let camY = 1.08;
  let camYaw = 0;
  function placeCamera() {
    camera.position.set(Math.sin(camYaw) * camDist, camY, Math.cos(camYaw) * camDist);
    camera.lookAt(0, camY, 0);
  }
  fitCamera();

  scene.add(new THREE.HemisphereLight(0xc9bdf0, 0x161426, 1.35));
  const keyLight = new THREE.DirectionalLight(0xfff1d6, 1.25);
  keyLight.position.set(1.6, 3.4, 3.0); scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xc9bdf0, 0.7);
  fillLight.position.set(-2.2, 2.0, 2.2); scene.add(fillLight);
  const rimLight = new THREE.DirectionalLight(0xf0d397, 0.95);
  rimLight.position.set(-1.5, 2.8, -2.6); scene.add(rimLight);
  const floorGlowLight = new THREE.PointLight(0xf0d397, 0.75, 3.2);
  floorGlowLight.position.set(0, 0.14, 0.18); scene.add(floorGlowLight);

  // ── Materials (Green Hoodie + Covered Hood + Soft Gold Rim & Lavender Accents) ──
  function applySoftGoldRim(material: THREE.MeshStandardMaterial, strength: number) {
    material.customProgramCacheKey = () => 'gold-rim-' + strength;
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uGoldRimStrength = { value: strength };
      shader.fragmentShader =
        'uniform float uGoldRimStrength;\n' +
        shader.fragmentShader.replace(
          '#include <dithering_fragment>',
          [
            'vec3 rimViewDir = normalize( vViewPosition );',
            'float rimDot = clamp( abs( dot( normalize( normal ), rimViewDir ) ), 0.0, 1.0 );',
            'float rimMask = smoothstep( 0.44, 0.94, 1.0 - rimDot );',
            'gl_FragColor.rgb += vec3( 0.941, 0.827, 0.592 ) * rimMask * uGoldRimStrength;',
            '#include <dithering_fragment>'
          ].join('\n')
        );
    };
    return material;
  }

  const hoodieMat = applySoftGoldRim(new THREE.MeshStandardMaterial({
    color: 0x3b4d3f, // green hoodie from TaiChiHero.tsx (#36463a / #425547)
    roughness: 0.76,
    metalness: 0.03
  }), 0.34);

  const hoodiePocketMat = applySoftGoldRim(new THREE.MeshStandardMaterial({
    color: 0x2e3c31,
    roughness: 0.84,
    metalness: 0.02
  }), 0.20);

  const hoodOuterMat = applySoftGoldRim(new THREE.MeshStandardMaterial({
    color: 0x3f5243,
    roughness: 0.74,
    metalness: 0.03,
    side: THREE.DoubleSide
  }), 0.42);

  const hoodInnerMat = new THREE.MeshStandardMaterial({
    color: 0x1d261f,
    roughness: 0.94,
    metalness: 0.01,
    side: THREE.DoubleSide
  });

  const pantsMat = applySoftGoldRim(new THREE.MeshStandardMaterial({
    color: 0x2a372d, // green joggers from TaiChiHero.tsx
    roughness: 0.82,
    metalness: 0.02
  }), 0.28);

  const cuffMat = applySoftGoldRim(new THREE.MeshStandardMaterial({
    color: 0x1b241d,
    roughness: 0.90,
    metalness: 0.02
  }), 0.22);

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xe0a96f,
    roughness: 0.64,
    metalness: 0.0
  });

  const skinShadowMat = new THREE.MeshStandardMaterial({
    color: 0xc88e58,
    roughness: 0.68,
    metalness: 0.0
  });

  const hoodVoidMat = new THREE.MeshStandardMaterial({
    color: 0x05060a,
    roughness: 1.0,
    metalness: 0.0
  });

  // The universe inside the hood: deep space, a faint nebula in the app's
  // gold and lavender, small stars and a few brighter ones. It drifts
  // slowly and brightens a little with the inhale.
  const cosmosTex = (() => {
    const W = 512, H = 256;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d')!;
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    ctx.fillStyle = '#070816';
    ctx.fillRect(0, 0, W, H);
    const cloud = (x: number, y: number, r: number, col: string, a: number) => {
      for (const dx of [-W, 0, W]) {
        const g = ctx.createRadialGradient(x + dx, y, 0, x + dx, y, r);
        g.addColorStop(0, col.replace('A', String(a)));
        g.addColorStop(1, col.replace('A', '0'));
        ctx.fillStyle = g;
        ctx.fillRect(x + dx - r, y - r, r * 2, r * 2);
      }
    };
    for (let i = 0; i < 14; i++) {
      const lav = i % 3 !== 0;
      cloud(rnd() * W, H * (0.25 + rnd() * 0.5), 30 + rnd() * 70,
        lav ? 'rgba(130,112,205,A)' : 'rgba(240,211,151,A)', lav ? 0.20 + rnd() * 0.12 : 0.10 + rnd() * 0.08);
    }
    for (let i = 0; i < 260; i++) {
      const x = rnd() * W, y = rnd() * H, b = rnd();
      const r = b > 0.93 ? 2.0 : b > 0.7 ? 1.4 : 1.0;
      ctx.fillStyle = b > 0.9 && rnd() > 0.5 ? `rgba(240,211,151,${0.7 + 0.3 * b})` : `rgba(230,226,255,${0.55 + 0.45 * b})`;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    for (let i = 0; i < 12; i++) {
      const x = rnd() * W, y = H * (0.2 + rnd() * 0.6);
      const g = ctx.createRadialGradient(x, y, 0, x, y, 6);
      g.addColorStop(0, 'rgba(255,246,225,0.95)');
      g.addColorStop(0.25, 'rgba(240,211,151,0.45)');
      g.addColorStop(1, 'rgba(240,211,151,0)');
      ctx.fillStyle = g; ctx.fillRect(x - 6, y - 6, 12, 12);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.anisotropy = 4;
    return tex;
  })();
  const cosmosMat = new THREE.MeshBasicMaterial({ map: cosmosTex, toneMapped: false });

  const goldRimMat = new THREE.MeshStandardMaterial({
    color: 0xf0d397,
    emissive: 0x453615,
    emissiveIntensity: 0.45,
    roughness: 0.42,
    metalness: 0.35
  });

  // ── Build 3D Figure from Simple Shapes (Capsules, Spheres, Cylinders) ──
  const figureGroup = new THREE.Group();
  scene.add(figureGroup);

  // Upper Body Group (shifts horizontally with bodyShift & turns smoothly around Y)
  const upperGroup = new THREE.Group();
  figureGroup.add(upperGroup);

  // Torso: Smooth Sculpted Hoodie Silhouette (LatheGeometry, zero sharp rims)
  const torsoBaseY = to3DY(HEM_Y); // ≈ 0.833m
  const torsoProfile = new THREE.SplineCurve([
    new THREE.Vector2(0.005, 0.000),
    new THREE.Vector2(0.168, 0.008),
    new THREE.Vector2(0.184, 0.042),
    new THREE.Vector2(0.172, 0.175),
    new THREE.Vector2(0.186, 0.360),
    new THREE.Vector2(0.205, 0.505),
    new THREE.Vector2(0.194, 0.578),
    new THREE.Vector2(0.148, 0.625),
    new THREE.Vector2(0.104, 0.654),
    new THREE.Vector2(0.005, 0.660)
  ]);
  const torsoMesh = new THREE.Mesh(
    new THREE.LatheGeometry(torsoProfile.getPoints(24), 22),
    hoodieMat
  );
  torsoMesh.position.set(0, torsoBaseY, 0);
  torsoMesh.scale.set(1.0, 1.0, 0.67);
  upperGroup.add(torsoMesh);

  // Soft ribbed hoodie hem band hugging the lower torso
  const hemBand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.183, 0.177, 0.044, 20),
    pantsMat
  );
  hemBand.position.set(0, torsoBaseY + 0.024, 0);
  hemBand.scale.set(1.0, 1.0, 0.675);
  upperGroup.add(hemBand);

  // Subtle contoured kangaroo pocket
  const pocket = new THREE.Mesh(
    new THREE.CylinderGeometry(0.182, 0.186, 0.145, 16, 1, false, -Math.PI * 0.26, Math.PI * 0.52),
    hoodiePocketMat
  );
  pocket.position.set(0, torsoBaseY + 0.122, 0.008);
  pocket.scale.set(1.0, 1.0, 0.685);
  upperGroup.add(pocket);

  // Rainbow Infinity Symbol on Heart (from TaiChiHero.tsx)
  const infinityGroup = new THREE.Group();
  infinityGroup.position.set(0, to3DY(HEART_Y), 0.132);
  upperGroup.add(infinityGroup);

  const infinityCurve = (() => {
    const pts: THREE.Vector3[] = [];
    const s = 0.056;
    for (let i = 0; i <= 40; i++) {
      const u = (i / 40) * Math.PI * 2;
      const sn = Math.sin(u), cs = Math.cos(u);
      const d = 1 + sn * sn;
      pts.push(new THREE.Vector3((s * Math.SQRT2 * cs) / d, (s * Math.SQRT2 * sn * cs) / d, 0));
    }
    return new THREE.CatmullRomCurve3(pts, true);
  })();

  const infinityGeo = new THREE.TubeGeometry(infinityCurve, 36, 0.0065, 6, true);
  // Apply rainbow vertex colors matching #ec4899 -> #8b5cf6 -> #3b82f6 -> #10b981 -> #f59e0b
  (function colorInfinity() {
    const pos = infinityGeo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const stops = [
      new THREE.Color(0xec4899),
      new THREE.Color(0x8b5cf6),
      new THREE.Color(0x3b82f6),
      new THREE.Color(0x10b981),
      new THREE.Color(0xf59e0b)
    ];
    const tmp = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const t = THREE.MathUtils.clamp((pos.getX(i) + 0.08) / 0.16, 0, 1) * (stops.length - 1);
      const idx = Math.floor(t);
      const next = Math.min(stops.length - 1, idx + 1);
      tmp.copy(stops[idx]).lerp(stops[next], t - idx);
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }
    infinityGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  })();

  const infinityMesh = new THREE.Mesh(
    infinityGeo,
    new THREE.MeshBasicMaterial({ vertexColors: true })
  );
  infinityGroup.add(infinityMesh);

  const infinityAura = new THREE.Mesh(
    new THREE.TubeGeometry(infinityCurve, 28, 0.013, 6, true),
    new THREE.MeshBasicMaterial({ color: 0xf0d397, transparent: true, opacity: 0.25 })
  );
  infinityGroup.add(infinityAura);

  // ── Draped Green Hood Collar, Bare Neck & Peaceful Face (matching reference) ──
  const collarY = to3DY(SHOULDER_Y) + 0.025;
  const hoodCollar = new THREE.Mesh(
    new THREE.TorusGeometry(0.104, 0.036, 12, 24, Math.PI * 1.56),
    hoodOuterMat
  );
  hoodCollar.rotation.x = Math.PI / 2;
  hoodCollar.rotation.z = Math.PI * 0.72; // open V-neck toward +Z front
  hoodCollar.position.set(0, collarY, -0.004);
  hoodCollar.scale.set(1.06, 0.94, 0.84);
  upperGroup.add(hoodCollar);

  const neckMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.044, 0.052, 0.095, 16),
    hoodVoidMat
  );
  neckMesh.position.set(0, collarY + 0.028, 0.012);
  upperGroup.add(neckMesh);

  const headGroup = new THREE.Group();
  const headCenterY = collarY + 0.145;
  headGroup.position.set(0, headCenterY, 0.0);
  upperGroup.add(headGroup);

  // No face: the universe inside the hood (cosmosMat)
  const headSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.112, 32, 24),
    cosmosMat
  );
  headSphere.scale.set(0.92, 1.08, 0.94);
  headSphere.position.set(0, -0.004, -0.004);
  headGroup.add(headSphere);

  // Deep draped green hood framing the face cleanly toward +Z
  const hoodOuter = new THREE.Mesh(
    new THREE.SphereGeometry(0.146, 24, 18, Math.PI * 0.78, Math.PI * 1.44, 0, Math.PI * 0.92),
    hoodOuterMat
  );
  hoodOuter.rotation.x = 0.08;
  hoodOuter.scale.set(1.04, 1.16, 1.12);
  hoodOuter.position.set(0, 0.006, -0.004);
  headGroup.add(hoodOuter);

  // Plush rolled green hood edge framing the face opening
  const hoodRimOuter = new THREE.Mesh(
    new THREE.TorusGeometry(0.114, 0.024, 12, 28),
    hoodOuterMat
  );
  hoodRimOuter.position.set(0, -0.002, 0.062);
  hoodRimOuter.rotation.x = 0.10;
  hoodRimOuter.scale.set(0.95, 1.12, 1.05);
  headGroup.add(hoodRimOuter);

  // Dark inner hood shadow band above the forehead & along the inner rim
  const hoodRimInner = new THREE.Mesh(
    new THREE.TorusGeometry(0.100, 0.018, 10, 24),
    hoodInnerMat
  );
  hoodRimInner.position.set(0, -0.001, 0.056);
  hoodRimInner.rotation.x = 0.10;
  hoodRimInner.scale.set(0.92, 1.09, 1.0);
  headGroup.add(hoodRimInner);

  // Delicate soft-gold edge highlight tracing the hood opening
  const hoodGoldRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.125, 0.0028, 6, 32),
    goldRimMat
  );
  hoodGoldRim.position.set(0, -0.002, 0.062);
  hoodGoldRim.rotation.x = 0.10;
  hoodGoldRim.scale.set(0.95, 1.12, 1.0);
  headGroup.add(hoodGoldRim);

  // ── Continuous Swept Limb Builder (Zero Playmobil Ball Joints, 0 GC) ──
  function createSweptLimbMesh(rings: number, radSegs: number, radii: Float32Array, material: THREE.Material) {
    const vertCount = rings * radSegs;
    const pos = new Float32Array(vertCount * 3);
    const norm = new Float32Array(vertCount * 3);
    const indices: number[] = [];
    for (let i = 0; i < rings - 1; i++) {
      const rowA = i * radSegs;
      const rowB = (i + 1) * radSegs;
      for (let j = 0; j < radSegs; j++) {
        const jNext = (j + 1) % radSegs;
        const a = rowA + j;
        const b = rowB + j;
        const c = rowB + jNext;
        const d = rowA + jNext;
        indices.push(a, d, b);
        indices.push(d, c, b);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(norm, 3));
    geo.setIndex(indices);

    const cosTable = new Float32Array(radSegs);
    const sinTable = new Float32Array(radSegs);
    for (let j = 0; j < radSegs; j++) {
      const a = (j / radSegs) * Math.PI * 2;
      cosTable[j] = Math.cos(a);
      sinTable[j] = Math.sin(a);
    }

    const centers: THREE.Vector3[] = [];
    const tangents: THREE.Vector3[] = [];
    for (let i = 0; i < rings; i++) {
      centers.push(new THREE.Vector3());
      tangents.push(new THREE.Vector3());
    }

    const mesh = new THREE.Mesh(geo, material);
    mesh.frustumCulled = false;
    figureGroup.add(mesh);

    return {
      mesh,
      geo,
      pos,
      rings,
      radSegs,
      radii,
      cosTable,
      sinTable,
      centers,
      tangents
    };
  }

  // Pre-allocated temporaries for swept limb updates
  const _swA = new THREE.Vector3();
  const _swB = new THREE.Vector3();
  const _swN = new THREE.Vector3();
  const _swBin = new THREE.Vector3();
  const _swRef = new THREE.Vector3();
  const _swQ = new THREE.Quaternion();
  const _endDir = new THREE.Vector3();

  function updateSweptLimb(limb: SweptLimb, p0: THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3, outEndDir: THREE.Vector3 | null) {
    const { rings, radSegs, radii, cosTable, sinTable, centers, tangents, pos, geo } = limb;
    _swA.lerpVectors(p1, p0, 0.28);
    _swB.lerpVectors(p1, p2, 0.28);

    for (let i = 0; i < rings; i++) {
      const t = i / (rings - 1);
      const c = centers[i];
      if (t < 0.35) {
        c.lerpVectors(p0, _swA, t / 0.35);
      } else if (t <= 0.65) {
        const u = (t - 0.35) / 0.30;
        const om = 1 - u;
        c.set(
          om * om * _swA.x + 2 * om * u * p1.x + u * u * _swB.x,
          om * om * _swA.y + 2 * om * u * p1.y + u * u * _swB.y,
          om * om * _swA.z + 2 * om * u * p1.z + u * u * _swB.z
        );
      } else {
        c.lerpVectors(_swB, p2, (t - 0.65) / 0.35);
      }
    }

    for (let i = 0; i < rings; i++) {
      const ti = tangents[i];
      if (i === 0) {
        ti.subVectors(centers[1], centers[0]);
      } else if (i === rings - 1) {
        ti.subVectors(centers[rings - 1], centers[rings - 2]);
      } else {
        ti.subVectors(centers[i + 1], centers[i - 1]);
      }
      if (ti.lengthSq() < 1e-8) ti.set(0, -1, 0);
      else ti.normalize();
    }

    if (Math.abs(tangents[0].z) < 0.88) _swRef.set(0, 0, 1);
    else _swRef.set(1, 0, 0);
    _swN.crossVectors(tangents[0], _swRef).normalize();

    for (let i = 0; i < rings; i++) {
      const ti = tangents[i];
      if (i > 0) {
        _swQ.setFromUnitVectors(tangents[i - 1], ti);
        _swN.applyQuaternion(_swQ);
        _swN.addScaledVector(ti, -_swN.dot(ti)).normalize();
      }
      _swBin.crossVectors(ti, _swN).normalize();
      const c = centers[i];
      const r = radii[i];
      const base = i * radSegs * 3;
      for (let j = 0; j < radSegs; j++) {
        const cs = cosTable[j] * r;
        const sn = sinTable[j] * r;
        const idx = base + j * 3;
        pos[idx] = c.x + _swN.x * cs + _swBin.x * sn;
        pos[idx + 1] = c.y + _swN.y * cs + _swBin.y * sn;
        pos[idx + 2] = c.z + _swN.z * cs + _swBin.z * sn;
      }
    }

    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();
    if (outEndDir) outEndDir.copy(tangents[rings - 1]);
  }

  // ── Dynamic Legs (Continuous Trouser Tubes), Ankle Joints & Natural Bare Feet ──
  const LEG_RINGS = 17;
  const legRadii = new Float32Array(LEG_RINGS);
  for (let i = 0; i < LEG_RINGS; i++) {
    const t = i / (LEG_RINGS - 1);
    legRadii[i] = t === 0 ? 0.068 : (0.090 * (1 - t) + 0.046 * t);
  }

  function createLegObjects(side: number) {
    const xFoot = side * FOOT_X * SCALE;
    const footZ = -0.018;

    const footGroup = new THREE.Group();
    footGroup.position.set(xFoot, 0, footZ);
    footGroup.rotation.y = side * 0.13;
    figureGroup.add(footGroup);

    const heel = new THREE.Mesh(new THREE.SphereGeometry(0.031, 10, 10), skinMat);
    heel.scale.set(0.96, 0.87, 1.05);
    heel.position.set(0, 0.027, 0);
    footGroup.add(heel);

    const midfoot = new THREE.Mesh(new THREE.CapsuleGeometry(0.028, 0.082, 6, 10), skinMat);
    midfoot.rotation.x = Math.PI / 2;
    midfoot.scale.set(1.18, 1.0, 0.60);
    midfoot.position.set(0, 0.019, 0.056);
    footGroup.add(midfoot);

    const forefoot = new THREE.Mesh(new THREE.CapsuleGeometry(0.031, 0.042, 6, 10), skinMat);
    forefoot.rotation.x = Math.PI / 2;
    forefoot.scale.set(1.25, 1.0, 0.42);
    forefoot.position.set(0, 0.014, 0.114);
    footGroup.add(forefoot);

    const instep = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.034, 0.078, 10), skinMat);
    instep.rotation.x = 0.96;
    instep.scale.set(0.95, 1.0, 0.72);
    instep.position.set(0, 0.042, 0.042);
    footGroup.add(instep);

    const ankleJoint = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 10), skinShadowMat);
    ankleJoint.position.set(xFoot, 0.064, footZ);
    figureGroup.add(ankleJoint);

    const ankleShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.030, 0.082, 12), skinMat);
    ankleShaft.position.set(xFoot, 0.095, footZ);
    figureGroup.add(ankleShaft);

    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.053, 0.047, 0.054, 14), cuffMat);
    cuff.position.set(xFoot, 0.132, footZ);
    figureGroup.add(cuff);

    const legLimb = createSweptLimbMesh(LEG_RINGS, 12, legRadii, pantsMat);
    return { legLimb, xFoot, footZ };
  }

  const leftLeg = createLegObjects(-1);
  const rightLeg = createLegObjects(1);

  // ── Dynamic Arms (Continuous Swept Hoodie Sleeves), Wrist Joints & Slim Palms ──
  const ARM_RINGS = 19;
  const armRadii = new Float32Array(ARM_RINGS);
  for (let i = 0; i < ARM_RINGS; i++) {
    const t = i / (ARM_RINGS - 1);
    if (i === 0) armRadii[i] = 0.042; // rounded shoulder cap tucked cleanly inside hoodie
    else armRadii[i] = 0.068 * (1 - t) + 0.045 * t;
  }

  function createArmObjects(side: number) {
    const armLimb = createSweptLimbMesh(ARM_RINGS, 12, armRadii, hoodieMat);
    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.050, 0.045, 0.036, 14), pantsMat);

    const handGroup = new THREE.Group();
    const wristBridge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.020, 0.026, 0.040, 12),
      skinShadowMat
    );
    wristBridge.scale.set(1.05, 1.0, 0.68);
    wristBridge.position.set(0, -0.004, 0);
    handGroup.add(wristBridge);

    const wristJoint = new THREE.Mesh(new THREE.SphereGeometry(0.021, 10, 10), skinMat);
    wristJoint.scale.set(1.05, 0.85, 0.68);
    wristJoint.position.set(0, 0.011, 0);
    handGroup.add(wristJoint);

    const palmCore = new THREE.Mesh(new THREE.CapsuleGeometry(0.023, 0.056, 6, 12), skinMat);
    palmCore.scale.set(1.18, 1.0, 0.42);
    palmCore.position.set(0, 0.054, 0);
    handGroup.add(palmCore);

    const fingersTip = new THREE.Mesh(new THREE.CapsuleGeometry(0.018, 0.040, 6, 10), skinMat);
    fingersTip.scale.set(1.12, 1.0, 0.34);
    fingersTip.position.set(0, 0.106, 0);
    handGroup.add(fingersTip);

    const thumb = new THREE.Mesh(new THREE.CapsuleGeometry(0.009, 0.030, 4, 8), skinMat);
    thumb.scale.set(0.95, 1.0, 0.80);
    thumb.position.set(-side * 0.026, 0.046, 0.007);
    thumb.rotation.z = side * 0.46;
    handGroup.add(thumb);

    figureGroup.add(cuff, handGroup);
    return { armLimb, cuff, handGroup };
  }

  const leftArm = createArmObjects(-1);
  const rightArm = createArmObjects(1);

  // ── Soft Gold Palm Light Trails (Pre-allocated Float32Arrays, 0 GC) ──
  const MAX_TRAIL_PTS = 48;
  const TRAIL_MS = 900;
  const trailPoints: { t: number; lx: number; ly: number; lz: number; rx: number; ry: number; rz: number }[] = [];

  function createTrailLine() {
    const geo = new THREE.BufferGeometry();
    const posArr = new Float32Array(MAX_TRAIL_PTS * 3);
    const colArr = new Float32Array(MAX_TRAIL_PTS * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colArr, 3));
    geo.setDrawRange(0, 0);
    const mat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.72
    });
    const line = new THREE.Line(geo, mat);
    line.frustumCulled = false;
    scene.add(line);
    return { geo, posArr, colArr, line };
  }

  const trailLeft = createTrailLine();
  const trailRight = createTrailLine();

  // ── Pre-allocated Math Helpers (Zero GC inside render loop) ──
  const _vDir = new THREE.Vector3();
  const _vUp = new THREE.Vector3(0, 1, 0);
  const _quat = new THREE.Quaternion();
  const _euler = new THREE.Euler();
  const _qWrist = new THREE.Quaternion();

  const _sL3 = new THREE.Vector3();
  const _sR3 = new THREE.Vector3();
  const _eL3 = new THREE.Vector3();
  const _eR3 = new THREE.Vector3();
  const _hL3 = new THREE.Vector3();
  const _hR3 = new THREE.Vector3();
  const _hipL3 = new THREE.Vector3();
  const _hipR3 = new THREE.Vector3();
  const _kneeL3 = new THREE.Vector3();
  const _kneeR3 = new THREE.Vector3();
  const _ankL3 = new THREE.Vector3();
  const _ankR3 = new THREE.Vector3();

  function mapHand3D(hand2D: Pt, outVec: THREE.Vector3) {
    const x = to3DX(hand2D.x);
    const y = to3DY(hand2D.y);
    // Gentle depth (z) as hands pass in front of belly/chest vs extending laterally
    const highNorm = THREE.MathUtils.clamp((y - 0.84) / 0.56, 0, 1);
    const sideNorm = THREE.MathUtils.clamp((Math.abs(x) - 0.16) / 0.42, 0, 1);
    const centerZ = 0.22 + 0.08 * highNorm;
    const sideZ = 0.09;
    const z = centerZ * (1 - sideNorm * 0.7) + sideZ * (sideNorm * 0.7);
    outVec.set(x, y, z);
  }

  function mapElbow3D(elbow2D: Pt, shoulder3: THREE.Vector3, hand3: THREE.Vector3, outVec: THREE.Vector3) {
    const x = to3DX(elbow2D.x);
    const y = to3DY(elbow2D.y);
    const z = (shoulder3.z + hand3.z) * 0.45 + 0.03;
    outVec.set(x, y, z);
  }

  // The upper body turns about the hips (the bow folds there).
  const HIP_Y = to3DY(HEM_Y);
  const upperPivot = new THREE.Group();
  figureGroup.remove(upperGroup);
  upperPivot.add(upperGroup);
  upperGroup.position.y = -HIP_Y;
  figureGroup.add(upperPivot);

  // ── Hands ──
  const UP = new THREE.Vector3(0, 1, 0);
  const DOWN = new THREE.Vector3(0, -1, 0);
  const FWD = new THREE.Vector3(0, 0, 1);
  const BACK = new THREE.Vector3(0, 0, -1);
  const IN_L = new THREE.Vector3(1, 0, 0);   // towards the middle, for the screen-left hand
  const _f3 = new THREE.Vector3();
  const _n3 = new THREE.Vector3();
  const _x3 = new THREE.Vector3();
  const _m4 = new THREE.Matrix4();
  const _hint = new THREE.Vector3();
  const _rule = new THREE.Vector3();

  /** The hand: fingers along f, the palm facing as near to n as it can. */
  function orientHand(arm: { handGroup: THREE.Group }, f: THREE.Vector3, n: THREE.Vector3) {
    _f3.copy(f).normalize();
    _n3.copy(n).addScaledVector(_f3, -n.dot(_f3));
    if (_n3.lengthSq() < 1e-5) _n3.copy(FWD).addScaledVector(_f3, -_f3.z);
    _n3.normalize();
    _x3.crossVectors(_f3, _n3);
    _m4.makeBasis(_x3, _f3, _n3);
    arm.handGroup.quaternion.setFromRotationMatrix(_m4);
  }
  /** Fingers from the 2D turn (0 = down, ±180 = up), with a little of the forearm's depth. */
  function fingersFrom2D(rot: number, depth: number, out: THREE.Vector3) {
    const r = (rot * Math.PI) / 180;
    return out.set(-Math.sin(r), -Math.cos(r), depth).normalize();
  }
  /** The palm across the arm's own plane, as the 2D hero turns it. */
  function frontalPalm(rot: number, left: boolean, out: THREE.Vector3) {
    const r = (rot * Math.PI) / 180;
    return left ? out.set(Math.cos(r), -Math.sin(r), 0) : out.set(-Math.cos(r), Math.sin(r), 0);
  }
  const lerpDir = (a: THREE.Vector3, b: THREE.Vector3, k: number, out: THREE.Vector3) =>
    out.copy(a).multiplyScalar(1 - k).addScaledVector(b, k);

  /** Where the screen-left palm faces, for a movement at this moment (the right is its mirror). */
  function palmHint(type: string, bf: number, rising: boolean, out: THREE.Vector3) {
    if (type === '5-5') {
      if (rising) {
        // From the thighs, the palms turn up as the arms rise out to the sides,
        // and face each other as they meet above the head.
        if (bf < 0.1) return out.copy(IN_L);
        if (bf < 0.35) return lerpDir(IN_L, UP, smc((bf - 0.1) / 0.25), out);
        if (bf < 0.75) return out.copy(UP);
        return lerpDir(UP, IN_L, smc((bf - 0.75) / 0.25), out);
      }
      return out.copy(IN_L); // joined down the middle, then by the thighs
    }
    if (type === 'be-like-a-flower-5-5') {
      if (!rising) {
        const u = 1 - bf;
        if (u < 0.35) return out.copy(IN_L);
        if (u < 0.6) return lerpDir(IN_L, UP, smc((u - 0.35) / 0.25), out);
        return out.copy(UP);
      }
      if (bf < 0.5) return lerpDir(UP, IN_L, smc(bf / 0.5), out);
      if (bf < 0.72) return lerpDir(IN_L, UP, smc((bf - 0.5) / 0.22), out);
      return lerpDir(UP, IN_L, smc((bf - 0.72) / 0.28), out);
    }
    if (type === 'deep-bow-5-5' || type === 'bow') return out.copy(BACK);
    return out.copy(IN_L);
  }

  // A two-bone arm in 3D: the elbow on the side of `pole`.
  const _ikD = new THREE.Vector3();
  const _ikP = new THREE.Vector3();
  function solveArm3D(s: THREE.Vector3, h: THREE.Vector3, pole: THREE.Vector3, outE: THREE.Vector3) {
    const L1 = UPPER_ARM * SCALE, L2 = FOREARM * SCALE;
    _ikD.subVectors(h, s);
    let L = _ikD.length();
    const maxL = L1 + L2 - 0.004;
    if (L > maxL) { _ikD.multiplyScalar(maxL / L); h.copy(s).add(_ikD); L = maxL; }
    _ikD.divideScalar(Math.max(1e-6, L));
    const a = (L1 * L1 + L * L - L2 * L2) / (2 * L1 * Math.max(1e-6, L));
    const r = Math.sqrt(Math.max(0, L1 * L1 - a * a));
    _ikP.copy(pole).addScaledVector(_ikD, -pole.dot(_ikD)).normalize();
    outE.copy(s).addScaledVector(_ikD, a).addScaledVector(_ikP, r);
  }
  const _pole = new THREE.Vector3();
  const _pivotM = new THREE.Matrix4();

  // ── One frame ──
  const memo: PoseMemo = {};
  const startMs = performance.now();
  let prevMs = 0;
  function update(nowMs: number) {
    const { bf, isRising, idle } = state;
    const type = state.movementType === 'taichi' ? '5-5' : state.movementType;
    if (memo.type !== type || idle) { memo.type = type; memo.eL = undefined; memo.cL = undefined; memo.cR = undefined; memo.diff = undefined; }
    const pose = taiChiPose({ bf, isRising, movementType: type, idle, natural: false, seated: false, sway: 0 }, memo);
    const { sinkY, leanBackY, bodyShift, bowBend, palmVis, meetW } = pose;
    const isBow = type === 'deep-bow-5-5' || type === 'bow';
    const isSky = type === 'qigong-lifting-sky';
    const isCloud = type === 'tai-chi-cloud-hands';
    const isLotus = type === 'lotus-bloom-5-5' || type === 'lotus';
    const turnK = bodyShift / 6;
    const shift3X = bodyShift * SCALE;
    const tSec = (nowMs - startMs) / 1000;
    const dtSec = prevMs ? Math.min(0.1, (nowMs - prevMs) / 1000) : 0;
    prevMs = nowMs;

    // Upper body: the weight shift and waist turn (Cloud Hands), the bow from
    // the hips, the lift of the shoulders (Lifting the Sky) and the sink.
    const bowPitch = isBow ? Math.acos(Math.max(0.1, (38 - 34 * bowBend) / 38)) : 0;
    upperPivot.position.set(shift3X, HIP_Y - (leanBackY + sinkY) * SCALE, 0);
    upperPivot.rotation.set(isBow ? bowPitch : isSky ? -0.05 * bf : 0, isCloud ? turnK * 0.14 : 0, 0);
    headGroup.rotation.set(isSky ? -0.16 * bf : 0, isCloud ? turnK * 0.08 : 0, 0);
    const yawTarget = isBow ? 0.62 : 0;
    if (Math.abs(camYaw - yawTarget) > 1e-4) {
      camYaw += (yawTarget - camYaw) * Math.min(1, dtSec * 2.5);
      placeCamera();
    }
    infinityAura.material.opacity = 0.18 + 0.35 * bf;
    cosmosTex.offset.x = tSec * 0.004;
    cosmosMat.color.setScalar(0.8 + 0.25 * bf);

    // Legs: the feet stay; the hips and knees follow the weight and the sink.
    _hipL3.set(shift3X - 0.095, to3DY(HEM_Y - 3 + sinkY), 0);
    _hipR3.set(shift3X + 0.095, to3DY(HEM_Y - 3 + sinkY), 0);
    const kneeZ = 0.022 + sinkY * 0.012 + bowBend * 0.03;
    _kneeL3.set(leftLeg.xFoot + shift3X * 0.55, to3DY(KNEE_Y + sinkY * 0.5 + bowBend * 1.5), kneeZ);
    _kneeR3.set(rightLeg.xFoot + shift3X * 0.55, to3DY(KNEE_Y + sinkY * 0.5 + bowBend * 1.5), kneeZ);
    _ankL3.set(leftLeg.xFoot, 0.146, leftLeg.footZ);
    _ankR3.set(rightLeg.xFoot, 0.146, rightLeg.footZ);
    updateSweptLimb(leftLeg.legLimb, _hipL3, _kneeL3, _ankL3, null);
    updateSweptLimb(rightLeg.legLimb, _hipR3, _kneeR3, _ankR3, null);

    // Arms.
    const shInset = 3.5;
    let fwd = 0, front = 0;
    if (isBow) {
      // The shoulders go down and forward with the trunk; the hands slide down
      // the front of the thighs towards the knees, the elbows a little out.
      upperPivot.updateMatrixWorld(true);
      _pivotM.copy(upperGroup.matrixWorld);
      _sL3.set(to3DX(200 - SHOULDER_HALF + shInset), to3DY(SHOULDER_Y + 3), 0).applyMatrix4(_pivotM);
      _sR3.set(to3DX(200 + SHOULDER_HALF - shInset), to3DY(SHOULDER_Y + 3), 0).applyMatrix4(_pivotM);
      const hx = 0.27 - 0.13 * bowBend, hy = 0.8 - 0.24 * bowBend, hz = 0.03 + 0.14 * bowBend;
      _hL3.set(-hx, hy, hz); _hR3.set(hx, hy, hz);
      solveArm3D(_sL3, _hL3, _pole.set(-1, 0, -0.3), _eL3);
      solveArm3D(_sR3, _hR3, _pole.set(1, 0, -0.3), _eR3);
    } else {
      const yaw = isCloud ? turnK * 0.14 : 0;
      const shOffsetZ = Math.sin(yaw) * (SHOULDER_HALF - shInset) * SCALE;
      _sL3.set(to3DX(pose.sL.x + shInset), to3DY(pose.sL.y + sinkY + 3), shOffsetZ);
      _sR3.set(to3DX(pose.sR.x - shInset), to3DY(pose.sR.y + sinkY + 3), -shOffsetZ);
      const hL = { x: pose.hL.x, y: pose.hL.y + sinkY }, hR = { x: pose.hR.x, y: pose.hR.y + sinkY };
      mapHand3D(hL, _hL3);
      mapHand3D(hR, _hR3);
      if (isSky) {
        // On the way up the hands travel in front of the body (belly, chest,
        // face), parallel and apart; the flat picture cannot show that depth.
        front = isRising ? smc((bf - 0.04) / 0.16) * (1 - smc((bf - 0.68) / 0.22)) : 0;
        fwd = isRising ? 0.35 * smc((bf - 0.04) / 0.14) * (1 - smc((bf - 0.38) / 0.2)) : 0;
        _hL3.x *= 1 - 0.12 * front; _hR3.x *= 1 - 0.12 * front;
        _hL3.x = Math.min(_hL3.x, -0.15 * front); _hR3.x = Math.max(_hR3.x, 0.15 * front);
        _hL3.z += 0.16 * front; _hR3.z += 0.16 * front;
      }
      if (meetW > 0) {
        // Palms that meet in the middle touch, in front of the body.
        _hL3.x *= 1 - 0.7 * meetW; _hR3.x *= 1 - 0.7 * meetW;
        _hL3.z = Math.max(_hL3.z, 0.24 * meetW); _hR3.z = Math.max(_hR3.z, 0.24 * meetW);
      }
      // Fingers pointing to each other: the hands stay far enough apart that
      // the fingertips never cross (palms that meet point up instead).
      // (Not in Cloud Hands, where each hand crosses the middle on its loop.)
      const inL = isCloud ? 0 : Math.max(0, -Math.sin((pose.leftRot * Math.PI) / 180));
      const inR = isCloud ? 0 : Math.max(0, Math.sin((pose.rightRot * Math.PI) / 180));
      _hL3.x = Math.min(_hL3.x, -0.13 * smc((inL - 0.45) / 0.35));
      _hR3.x = Math.max(_hR3.x, 0.13 * smc((inR - 0.45) / 0.35));
      mapElbow3D({ x: pose.eL.x, y: pose.eL.y + sinkY }, _sL3, _hL3, _eL3);
      mapElbow3D({ x: pose.eR.x, y: pose.eR.y + sinkY }, _sR3, _hR3, _eR3);
      if (isSky) {
        _eL3.x *= 1 - 0.22 * front; _eR3.x *= 1 - 0.22 * front;
        _eL3.z += 0.06 * front; _eR3.z += 0.06 * front;
      }
    }

    const arms: [typeof leftArm, THREE.Vector3, THREE.Vector3, THREE.Vector3, number, boolean, Pt][] = [
      [leftArm, _sL3, _eL3, _hL3, pose.leftRot, true, pose.hL],
      [rightArm, _sR3, _eR3, _hR3, pose.rightRot, false, pose.hR],
    ];
    for (const [arm, s3, e3, h3, rot, left, h2] of arms) {
      updateSweptLimb(arm.armLimb, s3, e3, h3, _endDir);
      _quat.setFromUnitVectors(_vUp, _endDir);
      arm.cuff.position.copy(h3).addScaledVector(_endDir, -0.008);
      arm.cuff.quaternion.copy(_quat);
      arm.handGroup.position.copy(h3).addScaledVector(_endDir, 0.012);

      // Fingers.
      const sx = left ? 1 : -1;
      if (isBow) _f3.copy(_endDir);
      else fingersFrom2D(rot, _endDir.z * 0.6, _f3);
      if (fwd > 0) _f3.lerp(_x3.set(sx * 0.18, 0.05, 1).normalize(), fwd).normalize();
      const fingers = _vDir.copy(_f3);

      // Palm.
      if (isSky) {
        frontalPalm(rot, left, _hint);
      } else if (isLotus) {
        // Joined and rising, the palms face each other; open, they turn to the sky.
        lerpDir(_x3.set(sx, 0, 0), frontalPalm(rot, left, _rule), smc(palmVis / 0.3), _hint);
      } else if (isCloud) {
        // The upper hand's palm towards the body, the lower one's down.
        const lift = smc((238 - h2.y) / 40);
        lerpDir(DOWN, BACK, lift, _hint);
      } else {
        palmHint(type, bf, isRising, _hint);
        if (!left) _hint.x = -_hint.x;
      }
      // Seen a little: the palms turned to us (2D palmVis), and those facing
      // up lean a touch our way so they stay in view.
      const a = (isSky || isLotus ? Math.max(palmVis, isSky ? 0.4 * front : 0) : 0) * Math.PI / 2;
      _hint.normalize().multiplyScalar(Math.cos(a)).addScaledVector(FWD, Math.sin(a));
      _hint.z += 0.35 * Math.max(0, _hint.y);
      orientHand(arm, fingers, _hint);
    }

    // The light at the feet breathes.
    floorGlowLight.intensity = 0.65 + 0.35 * bf;

    // Soft gold trails behind the palms.
    if (idle) trailPoints.length = 0;
    const lastT = trailPoints[trailPoints.length - 1];
    if (!idle && (!lastT || nowMs - lastT.t > 20)) {
      const tip = (arm: typeof leftArm, h: THREE.Vector3, e: THREE.Vector3) => {
        _x3.subVectors(h, e).normalize();
        return _n3.copy(arm.handGroup.position).addScaledVector(_x3, 0.06);
      };
      const l = tip(leftArm, _hL3, _eL3); const lx = l.x, ly = l.y, lz = l.z;
      const r = tip(rightArm, _hR3, _eR3);
      // A jump (a new practice, a phase that starts elsewhere) starts afresh.
      if (lastT && Math.hypot(lastT.lx - lx, lastT.ly - ly, lastT.lz - lz) > 0.25) trailPoints.length = 0;
      trailPoints.push({ t: nowMs, lx, ly, lz, rx: r.x, ry: r.y, rz: r.z });
      if (trailPoints.length > MAX_TRAIL_PTS) trailPoints.shift();
    }
    while (trailPoints.length && nowMs - trailPoints[0].t > TRAIL_MS) trailPoints.shift();
    const nPts = trailPoints.length;
    for (let i = 0; i < nPts; i++) {
      const pt = trailPoints[i];
      const fresh = 1 - Math.min(1, (nowMs - pt.t) / TRAIL_MS);
      const fade = fresh * fresh;
      const cr = 0.027 + 0.91 * fade, cg = 0.043 + 0.78 * fade, cb = 0.078 + 0.51 * fade;
      for (const [tr, x, y, z] of [[trailLeft, pt.lx, pt.ly, pt.lz], [trailRight, pt.rx, pt.ry, pt.rz]] as const) {
        tr.posArr[i * 3] = x; tr.posArr[i * 3 + 1] = y; tr.posArr[i * 3 + 2] = z;
        tr.colArr[i * 3] = cr; tr.colArr[i * 3 + 1] = cg; tr.colArr[i * 3 + 2] = cb;
      }
    }
    for (const tr of [trailLeft, trailRight]) {
      tr.geo.attributes.position.needsUpdate = true;
      tr.geo.attributes.color.needsUpdate = true;
      tr.geo.setDrawRange(0, nPts);
    }
  }

  // ── Drawing: only while it can be seen; watching that the device keeps up ──
  let raf = 0;
  let visible = true;
  // Frame times while drawing (pauses, hidden tabs and the page's own loading
  // do not count): after three seconds of drawing, fewer than 22 frames a
  // second means the device is struggling.
  // (Not in automated test browsers, which draw in software.)
  let lastFrame = 0, drawnMs = 0, drawn = 0, slowRun = 0, watching = !navigator.webdriver;
  function loop(now: number) {
    raf = 0;
    if (!visible || document.hidden) { lastFrame = 0; return; }
    update(now);
    renderer.render(scene, camera);
    if (watching && now - startMs > 1200) {
      const dt = lastFrame ? now - lastFrame : 0;
      if (dt > 0 && dt < 400) { drawnMs += dt; drawn++; slowRun = 0; }
      else if (dt >= 400 && ++slowRun >= 5) { watching = false; onTrouble(); }
      if (drawnMs > 3000) {
        watching = false;
        if ((drawn * 1000) / drawnMs < 22) onTrouble();
      }
    }
    lastFrame = now;
    raf = requestAnimationFrame(loop);
  }
  const wake = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop); };
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; lastFrame = 0; if (visible) wake(); });
  io.observe(mount);
  const ro = new ResizeObserver(() => { fitCamera(); renderer.render(scene, camera); });
  ro.observe(mount);
  const onVis = () => { lastFrame = 0; wake(); };
  document.addEventListener('visibilitychange', onVis);
  wake();

  return {
    setState(s) { state = s; },
    dispose() {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      renderer.domElement.removeEventListener('webglcontextlost', onLost);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mats = m.material ? (Array.isArray(m.material) ? m.material : [m.material]) : [];
        for (const mat of mats) {
          for (const v of Object.values(mat)) if (v instanceof THREE.Texture) v.dispose();
          mat.dispose();
        }
      });
      scene.environment?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
