/*
  Hologram engine for the Careers "Apply" section (three.js, loaded on demand).
  A light-made object for the lane you pick; the name decides which piece, its tint, line density and angle.
  It builds itself bottom-up with a scan line, floats, turns slowly, can be dragged, and brightens on hover.
  The canvas is composited with mix-blend-mode: screen, so only the light shows over the section background.
*/
export const hashStr = (str) => { let h = 2166136261; for (const ch of str) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) } return h >>> 0 }
const mulberry = (a) => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 }

/* lane id -> the pieces it can show */
export const LANES = {
  designer: ['nib', 'bezier', 'sculpt'], art: ['bulb', 'compass'], copy: ['fpen', 'quote'],
  pr: ['mic', 'megaphone'], strategy: ['king', 'target'], digital: ['phone', 'globe'],
  events: ['spot', 'disco'], other: ['bubble'],
}
const PALETTES = [[[0.0, 0.42, 0.85], [0.45, 0.88, 1.0]], [[0.1, 0.2, 0.8], [0.35, 0.8, 1.0]], [[0.2, 0.08, 0.7], [0.4, 0.82, 1.0]]]

export function createHologram({ THREE: T, canvas, host, reduce = false, onFrame, onHoverEnter, side = () => 1 }) {
  const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setClearColor(0x000000, 1)
  const scene3 = new T.Scene()
  const camera = new T.PerspectiveCamera(32, 1, 0.1, 100)
  const world = new T.Group(); scene3.add(world)
  const holder = new T.Group(); world.add(holder)
  const U = { uTime: { value: 0 } }
  const size = () => {
    const w = host.clientWidth, h = host.clientHeight
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); renderer.setSize(w, h, false)
    camera.aspect = w / h
    /* frame the piece in the space above the dock; phones get a further, slightly higher camera */
    const narrow = w / h < 0.9
    camera.position.set(0, 1.85, narrow ? 10.5 : 7.6); camera.lookAt(0, narrow ? 1.05 : 1.42, 0)
    camera.updateProjectionMatrix()
  }

  /* the light material: fresnel glass, flowing contour lines, a sparkle, and a scan line that builds it bottom-up */
  const VS = `varying vec3 vN; varying vec3 vW; varying vec3 vV;
    void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; vN = normalize(normalMatrix * normal);
      vec4 mv = viewMatrix * w; vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`;
  const FS = `uniform float uTime; uniform float uReveal; uniform float uHover; uniform float uDensity; uniform float uAlpha; uniform vec3 uC1; uniform vec3 uC2;
    varying vec3 vN; varying vec3 vW; varying vec3 vV;
    float h(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,37.719))) * 43758.5453); }
    void main(){
      if (vW.y > uReveal) discard;
      float fr = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 1.8);
      float f = fract(vW.y * uDensity - uTime * 0.12 + sin(vW.x * 2.0 + vW.z * 1.7) * 0.08);
      float line = smoothstep(0.06, 0.0, abs(f - 0.5));
      float band = smoothstep(0.08, 0.0, abs(vW.y - uReveal));
      float sp = step(0.997, h(floor(vW * 55.0) + floor(uTime * 2.5)));
      vec3 col = mix(uC1, uC2, clamp(fr * 1.2 + line * 0.5, 0.0, 1.0));
      float a = (0.045 + fr * 0.75 + line * 0.22 + band * 1.4 + sp * 0.9) * (0.85 + uHover * 0.5) * uAlpha;
      gl_FragColor = vec4(col * a + vec3(band * 0.6 + sp), 1.0);
    }`;
  const LFS = `uniform float uReveal; uniform float uAlpha; uniform vec3 uC2; varying vec3 vW;
    void main(){ if (vW.y > uReveal) discard; gl_FragColor = vec4(uC2 * 0.38 * uAlpha, 1.0); }`;
  const LVS = `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;
  const makeMats = (pal, density) => {
    const u = { uTime: U.uTime, uReveal: { value: -1 }, uHover: { value: 0 }, uDensity: { value: density }, uAlpha: { value: 1 },
      uC1: { value: new T.Vector3(...pal[0]) }, uC2: { value: new T.Vector3(...pal[1]) } };
    const base = { transparent: true, depthWrite: false, blending: T.AdditiveBlending };
    return { u, skin: new T.ShaderMaterial({ ...base, uniforms: u, vertexShader: VS, fragmentShader: FS, side: T.DoubleSide }),
      line: new T.ShaderMaterial({ ...base, uniforms: u, vertexShader: LVS, fragmentShader: LFS }) };
  };
  const add = (g, geo, M, pos = [0, 0, 0], rot = [0, 0, 0], edges = 28) => {
    const m = new T.Mesh(geo, M.skin); m.position.set(...pos); m.rotation.set(...rot); g.add(m);
    if (edges) { const e = new T.LineSegments(new T.EdgesGeometry(geo, edges), M.line); e.position.copy(m.position); e.rotation.copy(m.rotation); g.add(e); }
    return m;
  };
  const lathe = (pts, seg = 72) => new T.LatheGeometry(pts.map(([r, y]) => new T.Vector2(r, y)), seg);
  const extrude = (shape, depth, bevel = 0.03) => { const g = new T.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 3, curveSegments: 28 }); g.center(); return g; };
  const roundRect = (w, h, r) => { const s = new T.Shape(); s.moveTo(-w / 2 + r, -h / 2); s.lineTo(w / 2 - r, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r); s.lineTo(w / 2, h / 2 - r); s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2); s.lineTo(-w / 2 + r, h / 2); s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r); s.lineTo(-w / 2, -h / 2 + r); s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2); return s; };

  /* every piece sits on the light column: base at y≈0.8, top under y≈2.9 */
  const BUILD = {
    nib(M, r) {  
      const g = new T.Group(), s = new T.Shape();
      s.moveTo(0, -1); s.bezierCurveTo(0.12, -0.6, 0.55, -0.15, 0.5, 0.35); s.lineTo(0.42, 0.75); s.lineTo(-0.42, 0.75); s.lineTo(-0.5, 0.35); s.bezierCurveTo(-0.55, -0.15, -0.12, -0.6, 0, -1);
      const hole = new T.Path(); hole.absarc(0, 0.02, 0.11, 0, Math.PI * 2, true); s.holes.push(hole);
      add(g, extrude(s, 0.16), M, [0, 1.75, 0], [0, 0, 0]);
      add(g, new T.BoxGeometry(0.012, 0.7, 0.2), M, [0, 1.38, 0], [0, 0, 0], 0);
      add(g, extrude(roundRect(0.95, 0.32, 0.08), 0.22), M, [0, 2.75, 0]);
      g.rotation.z = (r() - 0.5) * 0.5; return g;
    },
    bezier(M, r) {  
      const g = new T.Group(), pts = [];
      for (let i = 0; i < 5; i++) pts.push(new T.Vector3(-1.3 + i * 0.65, 1.2 + r() * 1.5, (r() - 0.5) * 0.9));
      const c = new T.CatmullRomCurve3(pts);
      add(g, new T.TubeGeometry(c, 160, 0.055, 14, false), M, [0, 0, 0], [0, 0, 0], 0);
      pts.forEach((p, i) => {
        add(g, new T.BoxGeometry(0.17, 0.17, 0.17), M, [p.x, p.y, p.z]);
        const tan = c.getTangent(i / 4).multiplyScalar(0.42);
        const hg = new T.BufferGeometry().setFromPoints([p.clone().sub(tan), p.clone().add(tan)]);
        g.add(new T.Line(hg, M.line));
        [p.clone().sub(tan), p.clone().add(tan)].forEach(q => add(g, new T.SphereGeometry(0.055, 14, 10), M, [q.x, q.y, q.z], [0, 0, 0], 0));
      });
      return g;
    },
    sculpt(M, r) {  
      const g = new T.Group();
      add(g, new T.BoxGeometry(0.9, 0.9, 0.9), M, [0, 1.25, 0], [0, r() * 3, 0]);
      add(g, new T.SphereGeometry(0.42, 40, 28), M, [0.15, 2.1, 0], [0, 0, 0], 0);
      add(g, new T.TorusGeometry(0.55, 0.07, 18, 80), M, [-0.1, 2.15, 0], [Math.PI / 2 + r() * 0.6, 0, 0], 0);
      add(g, new T.ConeGeometry(0.32, 0.7, 40), M, [0.62, 2.62, 0.1], [0, 0, -0.5]);
      return g;
    },
    bulb(M, r) { // eslint-disable-line no-unused-vars
      const g = new T.Group(), pts = [];
      for (let i = 0; i <= 24; i++) { const a = -Math.PI * 0.5 + i / 24 * Math.PI * 1.25; pts.push([Math.cos(a) * 0.7, 2.25 + Math.sin(a) * 0.7]); }
      const prof = [[0.0, 2.95]].concat(pts.reverse()).concat([[0.32, 1.35], [0.3, 1.2]]);
      add(g, lathe(prof.map(([x, y]) => [Math.max(0.001, x), y])), M, [0, 0, 0], [0, 0, 0], 0);
      for (let k = 0; k < 5; k++) add(g, new T.TorusGeometry(0.31, 0.03, 10, 60), M, [0, 1.15 - k * 0.09, 0], [Math.PI / 2, 0, 0], 0);
      add(g, lathe([[0.001, 0.68], [0.18, 0.72], [0.28, 0.8]]), M, [0, 0, 0], [0, 0, 0], 0);
      const fil = []; for (let i = 0; i <= 40; i++) { const u = i / 40; fil.push(new T.Vector3(-0.22 + u * 0.44, 2.05 + Math.sin(u * Math.PI * 6) * 0.07, 0)); }
      add(g, new T.TubeGeometry(new T.CatmullRomCurve3([new T.Vector3(-0.12, 1.3, 0), new T.Vector3(-0.22, 2.0, 0)].concat(fil, [new T.Vector3(0.22, 2.0, 0), new T.Vector3(0.12, 1.3, 0)])), 120, 0.018, 8), M, [0, 0, 0], [0, 0, 0], 0);
      return g;
    },
    compass(M, r) {  
      const g = new T.Group(), c = 1.95;
      add(g, new T.TorusGeometry(0.85, 0.07, 20, 100), M, [0, c, 0], [0, 0, 0], 0);
      add(g, new T.TorusGeometry(0.66, 0.015, 8, 100), M, [0, c, 0], [0, 0, 0], 0);
      add(g, new T.CylinderGeometry(0.82, 0.82, 0.06, 80, 1, true), M, [0, c, 0], [Math.PI / 2, 0, 0], 0);
      for (let i = 0; i < 4; i++) add(g, new T.BoxGeometry(0.04, 0.16, 0.04), M, [Math.sin(i * Math.PI / 2) * 0.74, c + Math.cos(i * Math.PI / 2) * 0.74, 0], [0, 0, -i * Math.PI / 2], 0);
      const needle = new T.Group(); needle.position.set(0, c, 0.06); needle.rotation.z = (r() - 0.5) * 1.6; g.add(needle); g.userData.needle = needle;
      add(needle, new T.ConeGeometry(0.11, 0.65, 4), M, [0, 0.32, 0]);
      add(needle, new T.ConeGeometry(0.11, 0.5, 4), M, [0, -0.25, 0], [Math.PI, 0, 0]);
      add(g, new T.SphereGeometry(0.07, 20, 14), M, [0, c, 0.08], [0, 0, 0], 0);
      add(g, lathe([[0.001, 0.75], [0.35, 0.78], [0.12, 0.9], [0.09, 1.1]]), M, [0, 0, 0], [0, 0, 0], 0);
      return g;
    },
    fpen(M, r) {  
      const g = new T.Group(), body = new T.Group(); g.add(body);
      add(body, lathe([[0.001, -1.25], [0.07, -1.15], [0.16, -0.95], [0.17, 0.4], [0.19, 0.42], [0.19, 1.15], [0.12, 1.3], [0.001, 1.32]]), M, [0, 0, 0], [0, 0, 0], 0);
      add(body, new T.TorusGeometry(0.19, 0.025, 10, 60), M, [0, 0.42, 0], [Math.PI / 2, 0, 0], 0);
      add(body, new T.BoxGeometry(0.05, 0.75, 0.05), M, [0.21, 0.85, 0], [0, 0, 0], 0);
      const s = new T.Shape(); s.moveTo(0, -0.55); s.bezierCurveTo(0.05, -0.3, 0.17, -0.1, 0.15, 0.12); s.lineTo(-0.15, 0.12); s.bezierCurveTo(-0.17, -0.1, -0.05, -0.3, 0, -0.55);
      add(body, extrude(s, 0.03, 0.01), M, [0, -1.48, 0]);
      body.position.set(0, 1.9, 0); body.rotation.z = -0.7 - r() * 0.3;
      const ink = []; for (let i = 0; i <= 60; i++) { const u = i / 60; ink.push(new T.Vector3(-1.4 + u * 1.7, 0.95 + Math.sin(u * 14 + r() * 0.2) * 0.08 * (1 - u), 0.3)); }
      add(g, new T.TubeGeometry(new T.CatmullRomCurve3(ink), 200, 0.016, 6), M, [0, 0, 0], [0, 0, 0], 0);
      return g;
    },
    quote(M, r) { // eslint-disable-line no-unused-vars
      const g = new T.Group();
      const mark = () => { const s = new T.Shape(); s.absarc(0, 0, 0.36, 0, Math.PI * 2, false); const t = new T.Shape(); t.moveTo(-0.3, 0.1); t.quadraticCurveTo(-0.3, 0.75, 0.32, 1.0); t.lineTo(0.36, 0.86); t.quadraticCurveTo(0.0, 0.62, 0.05, 0.2); return [s, t]; };
      [-0.5, 0.5].forEach(x => { const m = new T.Group(); mark().forEach(sh => add(m, extrude(sh, 0.22), M, [0, 0, 0])); m.position.set(x, 1.85, 0); m.rotation.z = Math.PI; m.scale.setScalar(0.95); g.add(m); });
      g.children[0].children[2] && (g.children[0].children[2].position.y = 0.45); g.children[1].children[2] && (g.children[1].children[2].position.y = 0.45);
      return g;
    },
    mic(M, r) {  
      const g = new T.Group();
      add(g, new T.SphereGeometry(0.48, 22, 16), M, [0, 2.45, 0], [0, 0, 0], 1);
      add(g, new T.TorusGeometry(0.48, 0.04, 10, 60), M, [0, 2.45, 0], [Math.PI / 2, 0, 0], 0);
      add(g, lathe([[0.3, 2.0], [0.2, 1.6], [0.13, 1.0], [0.13, 0.95]]), M, [0, 0, 0], [0, 0, 0], 0);
      add(g, new T.TorusGeometry(0.55, 0.03, 8, 60, Math.PI), M, [0, 2.15, 0], [0, 0, Math.PI], 0);
      add(g, lathe([[0.001, 0.8], [0.5, 0.82], [0.45, 0.9], [0.1, 0.95]]), M, [0, 0, 0], [0, 0, 0], 0);
      g.rotation.z = (r() - 0.5) * 0.25; return g;
    },
    megaphone(M, r) {  
      const g = new T.Group(), b = new T.Group(); g.add(b);
      add(b, lathe([[0.16, -0.75], [0.22, -0.5], [0.6, 0.6], [0.66, 0.66], [0.6, 0.68]]), M, [0, 0, 0], [0, 0, 0], 0);
      add(b, new T.TorusGeometry(0.63, 0.04, 10, 70), M, [0, 0.66, 0], [Math.PI / 2, 0, 0], 0);
      add(b, new T.CylinderGeometry(0.17, 0.17, 0.25, 30), M, [0, -0.87, 0]);
      add(b, new T.BoxGeometry(0.12, 0.5, 0.12), M, [0.32, -0.45, 0], [0, 0, 0.35]);
      b.position.set(0, 1.85, 0); b.rotation.z = -1.25 - r() * 0.25;
      for (let k = 1; k <= 3; k++) add(g, new T.TorusGeometry(0.35 * k, 0.012, 6, 60, 1.6), M, [1.05, 2.25, 0], [0, 0, -0.8], 0);
      return g;
    },
    king(M, r) { // eslint-disable-line no-unused-vars
      const g = new T.Group();
      add(g, lathe([[0.001, 0.8], [0.62, 0.8], [0.62, 0.92], [0.5, 0.98], [0.52, 1.06], [0.36, 1.12], [0.26, 1.4], [0.2, 1.9], [0.24, 2.0], [0.36, 2.05], [0.24, 2.12], [0.32, 2.42], [0.001, 2.48]], 80), M, [0, 0, 0], [0, 0, 0], 0);
      return g;
    },
    target(M, r) {  
      const g = new T.Group(), c = 1.9;
      [0.9, 0.62, 0.34].forEach((rad) => add(g, new T.TorusGeometry(rad, 0.06, 16, 90), M, [0, c, 0], [0, 0, 0], 0));
      add(g, new T.CylinderGeometry(0.9, 0.9, 0.1, 90, 1, true), M, [0, c, 0], [Math.PI / 2, 0, 0], 0);
      add(g, new T.SphereGeometry(0.12, 20, 14), M, [0, c, 0], [0, 0, 0], 0);
      const a = new T.Group(); a.position.set(0, c, 0); a.rotation.set(0, 0.6 + r() * 0.4, 0.55); g.add(a);
      add(a, new T.CylinderGeometry(0.025, 0.025, 1.7, 10), M, [0, 0, 0.85], [Math.PI / 2, 0, 0], 0);
      add(a, new T.ConeGeometry(0.07, 0.2, 10), M, [0, 0, -0.02], [-Math.PI / 2, 0, 0], 0);
      for (let k = 0; k < 3; k++) { const f = add(a, new T.BoxGeometry(0.01, 0.16, 0.3), M, [0, 0, 1.6], [0, 0, k * Math.PI * 2 / 3]); f.translateY(0.07); }
      add(g, lathe([[0.001, 0.75], [0.45, 0.78], [0.1, 0.9], [0.06, 1.0]]), M, [0, 0, 0], [0, 0, 0], 0);
      return g;
    },
    phone(M, r) { // eslint-disable-line no-unused-vars
      const g = new T.Group();
      add(g, extrude(roundRect(0.95, 1.85, 0.16), 0.09, 0.02), M, [0, 1.85, 0], [0, 0, 0], 20);
      for (let i = 0; i < 4; i++) add(g, new T.BoxGeometry(0.7, i % 2 ? 0.08 : 0.32, 0.02), M, [0, 2.45 - i * 0.34, 0.07], [0, 0, 0], 0);
      const h = new T.Shape(); h.moveTo(0, -0.25); h.bezierCurveTo(-0.45, 0.05, -0.25, 0.42, 0, 0.18); h.bezierCurveTo(0.25, 0.42, 0.45, 0.05, 0, -0.25);
      const ht = add(g, extrude(h, 0.1), M, [0.85, 2.55, 0.15]); g.userData.float = [ht];
      const b = add(g, extrude(roundRect(0.5, 0.32, 0.12), 0.06), M, [-0.85, 2.15, 0.1]); g.userData.float.push(b);
      return g;
    },
    globe(M, r) { // eslint-disable-line no-unused-vars
      const g = new T.Group(), c = 1.9;
      add(g, new T.SphereGeometry(0.8, 24, 16), M, [0, c, 0], [0, 0, 0.4], 1);
      const o = new T.Group(); o.position.set(0, c, 0); g.add(o); g.userData.spin = o;
      for (let k = 0; k < 3; k++) { const ring = new T.Group(); ring.rotation.set(Math.PI / 2 + (k - 1) * 0.5, k * 0.9, 0); o.add(ring);
        add(ring, new T.TorusGeometry(1.1 + k * 0.12, 0.01, 6, 120), M, [0, 0, 0], [0, 0, 0], 0);
        add(ring, new T.SphereGeometry(0.06, 14, 10), M, [1.1 + k * 0.12, 0, 0], [0, 0, 0], 0); }
      return g;
    },
    spot(M, r) {  
      const g = new T.Group(), head = new T.Group(); head.position.set(0, 2.35, 0); head.rotation.z = -(2.35 + r() * 0.35); g.add(head);
      add(head, lathe([[0.3, -0.5], [0.34, -0.45], [0.34, 0.35], [0.42, 0.42], [0.42, 0.5], [0.3, 0.5]]), M, [0, 0, 0], [0, 0, 0], 0);
      add(head, new T.CylinderGeometry(0.3, 0.3, 0.02, 40), M, [0, -0.5, 0], [0, 0, 0], 0);
      const beam = new T.Mesh(new T.ConeGeometry(0.5, 1.1, 48, 1, true), M.skin); beam.position.set(0, 1.05, 0); beam.rotation.z = Math.PI; head.add(beam);
      add(g, new T.TorusGeometry(0.5, 0.04, 10, 60, Math.PI), M, [0, 2.3, 0], [0, Math.PI / 2, Math.PI], 0);
      add(g, new T.CylinderGeometry(0.05, 0.05, 1.0, 12), M, [0, 1.3, 0], [0, 0, 0], 0);
      add(g, lathe([[0.001, 0.78], [0.5, 0.8], [0.12, 0.9]]), M, [0, 0, 0], [0, 0, 0], 0);
      return g;
    },
    disco(M, r) { // eslint-disable-line no-unused-vars
      const g = new T.Group(), ball = new T.IcosahedronGeometry(0.85, 2); ball.computeVertexNormals();
      const m = add(g, ball, M, [0, 1.8, 0], [0, 0, 0], 1); g.userData.spin = m; g.userData.spinE = g.children[1];
      add(g, new T.CylinderGeometry(0.02, 0.02, 0.6, 8), M, [0, 2.95, 0], [0, 0, 0], 0);
      for (let k = 0; k < 7; k++) { const a = k / 7 * Math.PI * 2; add(g, new T.CylinderGeometry(0.008, 0.008, 1.6, 6), M, [Math.cos(a) * 1.5, 1.6 + Math.sin(k) * 0.4, Math.sin(a) * 1.5], [Math.sin(a) * 1.2, 0, Math.cos(a) * 1.2], 0); }
      return g;
    },
    bubble(M, r) { // eslint-disable-line no-unused-vars
      const g = new T.Group(), s = roundRect(1.9, 1.1, 0.4);
      const tail = new T.Shape(); tail.moveTo(-0.5, -0.5); tail.lineTo(-0.75, -0.95); tail.lineTo(-0.2, -0.52);
      add(g, extrude(s, 0.18), M, [0, 2.05, 0]); add(g, extrude(tail, 0.18), M, [-0.45, 1.38, 0]);
      g.userData.dots = [-0.45, 0, 0.45].map(x => add(g, new T.SphereGeometry(0.11, 24, 16), M, [x, 2.05, 0.2], [0, 0, 0], 0));
      return g;
    },
  };


  /* sparkles floating in the light */
  const spG = new T.BufferGeometry(), spN = 140, spP = new Float32Array(spN * 3)
  for (let i = 0; i < spN; i++) { const a = Math.random() * Math.PI * 2, rr = Math.random() * 1.7; spP[i * 3] = Math.cos(a) * rr; spP[i * 3 + 1] = 0.4 + Math.random() * 2.8; spP[i * 3 + 2] = Math.sin(a) * rr * 0.8 }
  spG.setAttribute('position', new T.BufferAttribute(spP, 3))
  const spM = new T.PointsMaterial({ color: 0x9fe6ff, size: 0.028, transparent: true, opacity: 0.7, blending: T.AdditiveBlending, depthWrite: false })
  world.add(new T.Points(spG, spM))

  /* ---------- the piece ---------- */
  let piece = null, leaving = []
  const box = new T.Box3()
  const build = (name, lane) => {
    const seed = hashStr(name.toLowerCase() + '|' + lane), r = mulberry(seed), list = LANES[lane] || LANES.other
    const kind = list[(seed >>> 4) % list.length], pal = PALETTES[(seed >>> 9) % PALETTES.length]
    const M = makeMats(pal, 16 + (seed % 17))
    const g = BUILD[kind](M, r)
    g.userData = Object.assign(g.userData || {}, { kind, seed, M, t0: performance.now() / 1000 })
    box.setFromObject(g); g.userData.minY = box.min.y - 0.05; g.userData.maxY = box.max.y + 0.15
    M.u.uReveal.value = g.userData.minY
    return g
  }
  const disposeGroup = (g) => g.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material && o.material.dispose) o.material.dispose() })

  /* ---------- drag to turn; it drifts when left alone ---------- */
  const spin = { on: false, yaw: 0.35, pitch: 0, vy: 0, vp: 0, lx: 0, ly: 0, idle: 0 }
  const down = (e) => { if (e.button) return; spin.on = true; spin.lx = e.clientX; spin.ly = e.clientY; host.dataset.grabbing = '1'; try { canvas.setPointerCapture(e.pointerId) } catch { /* ignore */ } }
  const ray = new T.Raycaster(), mouse = new T.Vector2()
  let hoverOn = false, lastChime = 0
  const move = (e) => {
    if (spin.on) {
      const dx = e.clientX - spin.lx, dy = e.clientY - spin.ly; spin.lx = e.clientX; spin.ly = e.clientY
      spin.vy = dx * 0.008; spin.vp = dy * 0.004; spin.yaw += spin.vy; spin.pitch = Math.max(-0.35, Math.min(0.45, spin.pitch + spin.vp))
    }
    if (!piece || e.pointerType !== 'mouse') return
    const rc = canvas.getBoundingClientRect(); mouse.set((e.clientX - rc.left) / rc.width * 2 - 1, -(e.clientY - rc.top) / rc.height * 2 + 1)
    ray.setFromCamera(mouse, camera)
    const hit = ray.intersectObject(piece, true).length > 0
    if (hit && !hoverOn && performance.now() - lastChime > 380) { lastChime = performance.now(); onHoverEnter && onHoverEnter(piece.userData.seed) }
    hoverOn = hit
  }
  const endSpin = () => { if (spin.on) { spin.on = false; spin.idle = performance.now(); delete host.dataset.grabbing } }
  const leave = () => { hoverOn = false }
  canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move)
  canvas.addEventListener('pointerup', endSpin); canvas.addEventListener('pointercancel', endSpin); canvas.addEventListener('pointerleave', leave)

  /* a screen point beside the piece, for the caption's leader line */
  const v3 = new T.Vector3()
  const anchor = () => {
    if (!piece) return null
    v3.set(0.95 * side(), (piece.userData.minY + piece.userData.maxY) / 2 + 0.2, 0).project(camera)
    return [(v3.x + 1) / 2 * host.clientWidth, (1 - v3.y) / 2 * host.clientHeight]
  }

  /* ---------- frame loop (only while on screen) ---------- */
  let visible = false, raf = 0, lastT = performance.now() / 1000, yawNow = 0.35, pitchNow = 0, liveNow = 0, boost = 0
  const frame = (now) => {
    const t = now / 1000, dt = Math.min(0.05, t - lastT); lastT = t; U.uTime.value = t
    if (!spin.on) { spin.yaw += spin.vy; spin.vy *= 0.95; const idle = Math.min(1, (now - spin.idle) / 2500); spin.yaw += dt * 0.22 * idle; spin.pitch *= 0.99 }
    yawNow += (spin.yaw - yawNow) * 0.12; pitchNow += (spin.pitch - pitchNow) * 0.12
    holder.rotation.set(pitchNow, yawNow, 0)
    liveNow += ((piece ? 1 : 0) - liveNow) * 0.04
    spM.opacity = 0.15 + 0.55 * liveNow
    if (piece) {
      const u = piece.userData.M.u, age = t - piece.userData.t0
      const k = reduce ? 1 : Math.min(1, age / 2.2), e = 1 - Math.pow(1 - k, 3)
      u.uReveal.value = piece.userData.minY + (piece.userData.maxY - piece.userData.minY) * e + (k >= 1 ? 5 : 0)
      u.uHover.value += ((hoverOn ? 1 : 0) + boost - u.uHover.value) * 0.1
      u.uAlpha.value = 0.92 + 0.08 * Math.sin(t * 17) * Math.sin(t * 5.3)
      const d = piece.userData
      if (d.needle) d.needle.rotation.z = Math.sin(t * 0.8 + d.seed) * 0.5 + Math.sin(t * 3.1) * 0.05
      if (d.spin) d.spin.rotation.y += dt * 0.5
      if (d.spinE) d.spinE.rotation.y = d.spin.rotation.y
      if (d.float) d.float.forEach((m, i) => (m.position.y += Math.sin(t * 1.4 + i * 2) * 0.0025))
      if (d.dots) d.dots.forEach((m, i) => (m.position.y = 2.05 + Math.max(0, Math.sin(t * 5 - i * 0.9)) * 0.12))
      piece.position.y = Math.sin(t * 0.9) * 0.04
    }
    leaving = leaving.filter((g) => { const u = g.userData.M.u; u.uReveal.value -= dt * 3.2; if (u.uReveal.value < g.userData.minY) { holder.remove(g); disposeGroup(g); return false } return true })
    renderer.render(scene3, camera)
    onFrame && onFrame(anchor())
    raf = visible ? requestAnimationFrame(frame) : 0
  }
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) { lastT = performance.now() / 1000; raf = requestAnimationFrame(frame) } })
  io.observe(host)
  size()
  window.addEventListener('resize', size)

  return {
    /* swap the piece; returns { kind, seed } or null when cleared */
    setPiece(name, lane) {
      if (piece) { piece.userData.M.u.uReveal.value = Math.min(piece.userData.M.u.uReveal.value, piece.userData.maxY); leaving.push(piece); piece = null }
      if (!name || !lane) return null
      piece = build(name, lane); holder.add(piece)
      return { kind: piece.userData.kind, seed: piece.userData.seed }
    },
    celebrate() { boost = 1 },
    reset() { boost = 0 },
    resize: size,
    destroy() {
      cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', size)
      canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerup', endSpin); canvas.removeEventListener('pointercancel', endSpin); canvas.removeEventListener('pointerleave', leave)
      ;[...holder.children, ...leaving].forEach(disposeGroup)
      renderer.dispose()
    },
  }
}
