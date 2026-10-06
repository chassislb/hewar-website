/*
  WebGL scene for the Work page (three.js, loaded on demand).

  The scroll is a journey through a dark space:
    · project 1 is already waiting ahead; you start moving toward it as
      soon as you scroll off the video
    · each project waits ahead on its own; the camera comes close and holds:
      the frame sits to one side, its video plays and the case details show
    · if you don't click, the camera flies THROUGH the frame like a doorway
      and the next project is waiting on the other side
  The site's purple/cyan particles stream past with speed trails, and the
  lens kicks wider as you pass through each frame.
  Hover also plays a frame; click opens it to full screen.

  The React component owns the DOM (caption, HUD, portal); this file only
  draws and reports back through callbacks.
*/

const clamp01 = (v) => Math.max(0, Math.min(1, v))
const smooth = (a, b, v) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

const VERT = `
  uniform float hover; uniform float time;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    /* gentle cloth-like bend, stronger on hover */
    p.z += sin(uv.x * 3.1416) * (0.06 + 0.1 * hover) + sin(uv.y * 6.0 + time * 1.6) * 0.012 * hover;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }`

/* holographic projection: no frame or stroke. Soft feathered edges,
   scanlines, a slight RGB split, a cyan/violet light tint and the odd
   glitch band. It locks in (clearer, full colour) when you arrive or hover. */
const FRAG = `
  uniform sampler2D map; uniform sampler2D vmap;
  uniform float aspect; uniform float vaspect; uniform float plane;
  uniform float mixV; uniform float opacity; uniform float hover; uniform float time;
  uniform vec3 rimA; uniform vec3 rimB;
  varying vec2 vUv;
  float hash(float n) { return fract(sin(n) * 43758.5453); }
  vec2 cover(vec2 uv, float img) {
    vec2 s = img > plane ? vec2(plane / img, 1.0) : vec2(1.0, img / plane);
    return (uv - 0.5) * s + 0.5;
  }
  vec3 sampleAt(vec2 uv) {
    vec3 a = texture2D(map, cover(uv, aspect)).rgb;
    vec3 b = texture2D(vmap, cover(uv, vaspect)).rgb;
    return mix(a, b, mixV);
  }
  void main() {
    float solid = hover;                 /* 0 = drifting projection, 1 = locked in */
    vec2 uv = vUv;
    /* glitch: a few horizontal bands jump sideways now and then */
    float row = floor(uv.y * 38.0);
    float tick = floor(time * 9.0);
    float g = step(0.985 - 0.02 * (1.0 - solid), hash(row * 1.7 + tick));
    uv.x += g * (hash(row + tick) - 0.5) * 0.06 * (1.0 - solid * 0.8);
    /* soft ripple */
    vec2 d = uv - 0.5;
    uv += normalize(d + 1e-4) * sin(length(d) * 26.0 - time * 4.0) * 0.004 * solid;
    uv = (uv - 0.5) * (1.0 - 0.05 * solid) + 0.5;
    /* RGB split */
    float sh = mix(0.006, 0.0018, solid);
    vec3 c;
    c.r = sampleAt(uv + vec2(sh, 0.0)).r;
    c.g = sampleAt(uv).g;
    c.b = sampleAt(uv - vec2(sh, 0.0)).b;
    /* hologram light: luminance pushed into cyan/violet, less once locked in */
    float lum = dot(c, vec3(0.299, 0.587, 0.114));
    vec3 holo = mix(rimA * 0.55, rimB * 1.15, smoothstep(0.1, 0.9, lum + vUv.y * 0.25));
    c = mix(c, holo * (0.35 + lum), mix(0.62, 0.12, solid));
    /* scanlines + fine moving bar */
    float scan = 0.82 + 0.18 * sin(vUv.y * 420.0 + time * 6.0);
    float bar = smoothstep(0.0, 0.04, abs(fract(vUv.y - time * 0.12) - 0.5) - 0.44);
    c *= mix(scan, 1.0, solid * 0.6);
    c += rimB * (1.0 - bar) * 0.12;
    /* grain */
    c += (hash(dot(vUv, vec2(127.1, 311.7)) + time) - 0.5) * 0.05;
    /* flicker */
    float flick = 0.94 + 0.06 * sin(time * 23.0 + hash(tick) * 6.0);
    /* feathered edges, no stroke: the image just fades into the space */
    vec2 e = min(vUv, 1.0 - vUv);
    float edge = smoothstep(0.0, 0.07, e.x * plane) * smoothstep(0.0, 0.07, e.y);
    float alpha = edge * mix(0.78, 1.0, solid) * mix(flick, 1.0, solid);
    gl_FragColor = vec4(c, alpha * opacity);
  }`

const radialTexture = (THREE, size, stops) => {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  stops.forEach(([o, col]) => gr.addColorStop(o, col))
  g.fillStyle = gr
  g.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(c)
}

/* where each frame floats (x, y, idle tilt); kept close to the path so the
   camera can fly through every one */
const SLOTS = [
  [-0.9, 0.25, 0.1], [1.0, -0.2, -0.12], [-0.6, -0.35, 0.08], [0.9, 0.35, -0.1],
  [-1.0, -0.1, 0.12], [0.7, 0.2, -0.08], [-0.8, 0.35, 0.1], [1.0, -0.3, -0.12],
]

export function createWorkScene(THREE, { tunnel, stage, canvas, projects, onFocus, onHover, onOpen, onHud }) {
  const N = projects.length
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const touch = window.matchMedia('(hover: none)').matches

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.LinearSRGBColorSpace
  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x030c22, 8, 34)
  const camera = new THREE.PerspectiveCamera(50, 1, 0.05, 120)

  let W = 1, H = 1, mobile = false, baseFov = 50
  const resize = () => {
    W = stage.clientWidth
    H = stage.clientHeight
    mobile = W < 700
    renderer.setSize(W, H, false)
    camera.aspect = W / H
    baseFov = mobile ? 64 : 50
    camera.fov = baseFov
    camera.updateProjectionMatrix()
  }
  resize()
  window.addEventListener('resize', resize)

  /* ── the path ──
     t is the camera position in "project" units: t = k → holding in front of
     project k; between k and k+1 the camera flies through frame k (at k + C). */
  const GAP = 6.2
  const VIEW = 3.95
  const C = VIEW / GAP
  const HEIGHT = 2.2
  const LEAD = 1.1
  const TRAVEL = 0.6
  /* ends holding on the last project, then the page simply scrolls on */
  const pathAt = (p) => {
    const u = Math.min(p * N, N - 1e-6)
    const k = Math.floor(u)
    const f = u - k
    const from = k === 0 ? -LEAD : k - 1
    return from + (k - from) * smooth(0, TRAVEL, f)
  }
  const frameZ = (i) => -i * GAP
  const camZ = (t) => VIEW - t * GAP
  const slot = (i) => {
    const [x, y, ry] = SLOTS[i % SLOTS.length]
    return mobile ? [x * 0.25, y * 0.4, ry * 0.5] : [x, y, ry]
  }
  const sideOf = (i) => (slot(i)[0] < 0 ? -1 : 1)
  /* where the camera stands while holding at project i: off to one side so the
     frame sits left/right and the case details get the other half (on phones
     the frame sits high and details go underneath) */
  const holdXY = (i) => {
    const [x, y] = slot(i)
    return mobile ? [x, y - 0.95] : [x - sideOf(i) * 1.3, y * 0.75]
  }
  const camXY = (t) => {
    if (t <= 0) {
      const [hx, hy] = holdXY(0)
      const e = smooth(-LEAD, 0, t)
      return [hx * e, hy * e]
    }
    const k = Math.floor(t)
    const f = t - k
    const [fx, fy] = slot(k)
    const a = holdXY(k)
    if (f < C) {
      const e = smooth(0, C, f)
      return [a[0] + (fx - a[0]) * e, a[1] + (fy - a[1]) * e]
    }
    const b = k + 1 < N ? holdXY(k + 1) : [fx, fy]
    const e = smooth(C, 1, f)
    return [fx + (b[0] - fx) * e, fy + (b[1] - fy) * e]
  }

  const loader = new THREE.TextureLoader()
  const items = projects.map((p, i) => {
    const uniforms = {
      map: { value: null }, vmap: { value: null }, aspect: { value: 1.6 }, vaspect: { value: 16 / 9 },
      plane: { value: 1.6 }, mixV: { value: 0 }, opacity: { value: 0 }, hover: { value: 0 }, time: { value: 0 },
      rimA: { value: new THREE.Color(0x4700b3) }, rimB: { value: new THREE.Color(0x00c8ff) },
    }
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(HEIGHT * 1.6, HEIGHT, 32, 20),
      new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG, transparent: true, side: THREE.DoubleSide, depthWrite: false }),
    )
    mesh.userData.i = i
    scene.add(mesh)
    loader.load(p.poster, (t) => {
      if ('colorSpace' in t) t.colorSpace = THREE.LinearSRGBColorSpace
      uniforms.map.value = t
      const a = t.image.width / t.image.height
      uniforms.aspect.value = a
      const plane = Math.max(0.78, Math.min(1.78, a))
      uniforms.plane.value = plane
      mesh.geometry.dispose()
      mesh.geometry = new THREE.PlaneGeometry(HEIGHT * plane, HEIGHT, 32, 20)
      if (!uniforms.vmap.value) uniforms.vmap.value = t
    })
    const it = { p, i, mesh, uniforms, hover: 0, hot: false, focused: false, video: null }
    it.ensureVideo = () => {
      if (!p.clip || it.video) return
      const v = document.createElement('video')
      Object.assign(v, { src: p.clip, muted: true, loop: true, playsInline: true, preload: 'auto' })
      const vt = new THREE.VideoTexture(v)
      if ('colorSpace' in vt) vt.colorSpace = THREE.LinearSRGBColorSpace
      v.addEventListener('loadeddata', () => {
        uniforms.vmap.value = vt
        uniforms.vaspect.value = v.videoWidth / v.videoHeight
      })
      it.video = v
    }
    return it
  })

  /* particles + speed trails */
  const PN = touch ? 900 : 1800
  const SPAN = 64
  const pPos = new Float32Array(PN * 3)
  const pCol = new Float32Array(PN * 3)
  const purple = new THREE.Color(180 / 255, 140 / 255, 1)
  const cyan = new THREE.Color(0, 200 / 255, 1)
  for (let k = 0; k < PN; k++) {
    pPos[k * 3] = (Math.random() * 2 - 1) * 12
    pPos[k * 3 + 1] = (Math.random() * 2 - 1) * 7.5
    pPos[k * 3 + 2] = camZ(-LEAD) + 6 - Math.random() * SPAN
    const c = Math.random() < 0.28 ? cyan : purple
    pCol[k * 3] = c.r; pCol[k * 3 + 1] = c.g; pCol[k * 3 + 2] = c.b
  }
  const dotTex = radialTexture(THREE, 64, [[0, 'rgba(255,255,255,1)'], [0.3, 'rgba(255,255,255,0.8)'], [1, 'rgba(255,255,255,0)']])
  const pGeo = new THREE.BufferGeometry()
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
  pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3))
  const dots = new THREE.Points(pGeo, new THREE.PointsMaterial({
    size: 0.085, map: dotTex, vertexColors: true, transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending, sizeAttenuation: true, opacity: 0.9,
  }))
  scene.add(dots)
  const tPos = new Float32Array(PN * 6)
  const tCol = new Float32Array(PN * 6)
  for (let k = 0; k < PN; k++) {
    for (let e = 0; e < 2; e++) {
      tCol[k * 6 + e * 3] = pCol[k * 3]
      tCol[k * 6 + e * 3 + 1] = pCol[k * 3 + 1]
      tCol[k * 6 + e * 3 + 2] = pCol[k * 3 + 2]
    }
  }
  const tGeo = new THREE.BufferGeometry()
  tGeo.setAttribute('position', new THREE.BufferAttribute(tPos, 3))
  tGeo.setAttribute('color', new THREE.BufferAttribute(tCol, 3))
  const trails = new THREE.LineSegments(tGeo, new THREE.LineBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false,
  }))
  scene.add(trails)
  const LMAX = 260
  const lPos = new Float32Array(LMAX * 6)
  const lGeo = new THREE.BufferGeometry()
  lGeo.setAttribute('position', new THREE.BufferAttribute(lPos, 3))
  const links = new THREE.LineSegments(lGeo, new THREE.LineBasicMaterial({
    color: 0x9696dc, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false,
  }))
  scene.add(links)

  /* input */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0, sx: -1, sy: -1 }
  const onMove = (e) => {
    const r = stage.getBoundingClientRect()
    mouse.sx = e.clientX - r.left
    mouse.sy = e.clientY - r.top
    mouse.tx = (mouse.sx / W) * 2 - 1
    mouse.ty = (mouse.sy / H) * 2 - 1
  }
  const onLeave = () => { mouse.tx = 0; mouse.ty = 0; mouse.sx = -1; mouse.sy = -1 }
  stage.addEventListener('pointermove', onMove)
  stage.addEventListener('pointerleave', onLeave)

  const ray = new THREE.Raycaster()
  const ndc = new THREE.Vector2()
  const pick = () => {
    if (mouse.sx < 0) return -1
    ndc.set((mouse.sx / W) * 2 - 1, -(mouse.sy / H) * 2 + 1)
    ray.setFromCamera(ndc, camera)
    const hits = ray.intersectObjects(items.filter((it) => it.uniforms.opacity.value > 0.6).map((it) => it.mesh))
    return hits.length ? hits[0].object.userData.i : -1
  }
  const setHot = (i, on) => {
    const it = items[i]
    if (!it) return
    it.hot = on
    if (on) {
      it.ensureVideo()
      it.video?.play().catch(() => {})
    } else if (!it.focused) {
      it.video?.pause()
    }
  }
  const onClick = () => {
    const i = pick()
    if (i >= 0) onOpen(i)
  }
  canvas.addEventListener('click', onClick)

  /* starts while the section is still rising into view, so you begin
     moving toward project 1 as soon as you scroll off the video */
  const progress = () => {
    const r = tunnel.getBoundingClientRect()
    const pre = window.innerHeight * 0.6
    return clamp01((pre - r.top) / (r.height - window.innerHeight + pre))
  }
  let pt = -LEAD
  let lastZ = camZ(pt)
  let speed = 0
  let hovered = -1
  let lastFocus = -2
  let visible = true
  let raf = 0
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
  io.observe(stage)
  const clock = new THREE.Clock()

  const tick = () => {
    raf = requestAnimationFrame(tick)
    if (!visible) return
    const t = clock.getElapsedTime()
    const p = progress()
    pt += (pathAt(p) - pt) * (reduce ? 1 : 0.08)
    const cz = camZ(pt)
    speed += (lastZ - cz - speed) * 0.2
    lastZ = cz
    mouse.x += (mouse.tx - mouse.x) * 0.05
    mouse.y += (mouse.ty - mouse.y) * 0.05

    const [px, py] = camXY(pt)
    camera.position.set(px + mouse.x * 0.35, py - mouse.y * 0.22, cz)
    camera.lookAt(px + mouse.x * 0.12, py - mouse.y * 0.08, cz - 10)

    /* lens kick as you pass through a frame */
    let through = 0
    items.forEach((it, i) => {
      const dz = cz - frameZ(i)
      through = Math.max(through, Math.exp(-(dz * dz) / 0.5))
      it._dz = dz
    })
    camera.fov = baseFov + through * 14
    camera.updateProjectionMatrix()

    let best = -1
    let bestD = 9
    items.forEach((it, i) => {
      const [x, y, ry] = slot(i)
      const z = frameZ(i)
      const rel = i - pt
      /* each project only appears once you've passed through the one before;
         the first is already waiting ahead when you arrive */
      const appear = i === 0 ? 1 : smooth(1 - C + 0.12, 1 - C - 0.15, rel)
      /* the frame dissolves around you as you fly through it */
      const pass = smooth(0.05, 1.2, it._dz)
      const op = appear * pass
      it.mesh.visible = op > 0.002
      it.uniforms.opacity.value = op
      it.uniforms.time.value = t
      const focus = 1 - smooth(0.04, 0.26, Math.abs(rel))
      if (focus > 0.55 && !it.focused) { it.focused = true; it.ensureVideo(); it.video?.play().catch(() => {}) }
      if (focus < 0.4 && it.focused) { it.focused = false; if (!it.hot) it.video?.pause() }
      it.hover += (Math.max(it.hot ? 1 : 0, focus) - it.hover) * 0.08
      it.uniforms.hover.value = it.hover
      const vReady = (it.hot || it.focused) && it.video && it.video.readyState >= 2 ? 1 : 0
      it.uniforms.mixV.value += (vReady - it.uniforms.mixV.value) * 0.1
      const bob = Math.sin(t * 0.5 + i * 1.7) * 0.05
      const rise = (1 - appear) * -4
      it.mesh.position.set(x, y + bob, z + rise)
      /* idle tilt, squares up to you as you arrive and as you go through */
      const square = Math.max(it.hover, smooth(2.2, 0.6, it._dz))
      it.mesh.rotation.y = ry * (1 - square) + mouse.x * 0.04
      it.mesh.rotation.x = -mouse.y * 0.04 + Math.sin(t * 0.4 + i) * 0.012 * (1 - square)
      it.mesh.scale.setScalar((0.7 + 0.3 * appear) * (1 + it.hover * 0.04 + focus * 0.12))
      if (Math.abs(rel) < bestD) { bestD = Math.abs(rel); best = i }
    })

    /* the case panel: shown while holding at a project, hidden in transit */
    const focus = bestD < 0.2 ? best : -1
    if (focus !== lastFocus) {
      lastFocus = focus
      onFocus(focus, focus >= 0 ? (sideOf(focus) < 0 ? 'left' : 'right') : null)
    }

    if (!touch) {
      const h = pick()
      if (h !== hovered) {
        if (hovered >= 0) setHot(hovered, false)
        if (h >= 0) setHot(h, true)
        hovered = h
        onHover(h)
      }
    }

    /* particles */
    const drift = reduce ? 0 : 0.012
    const trail = Math.min(3, Math.abs(speed) * 2.2 + through * 1.5)
    let L = 0
    for (let k = 0; k < PN; k++) {
      let z = pPos[k * 3 + 2] + drift
      if (z > cz + 2) {
        z -= SPAN
        pPos[k * 3] = px + (Math.random() * 2 - 1) * 12
        pPos[k * 3 + 1] = py + (Math.random() * 2 - 1) * 7.5
      }
      if (z < cz - SPAN + 2) z += SPAN
      pPos[k * 3 + 2] = z
      const x = pPos[k * 3]
      const y = pPos[k * 3 + 1]
      tPos[k * 6] = x; tPos[k * 6 + 1] = y; tPos[k * 6 + 2] = z
      tPos[k * 6 + 3] = x; tPos[k * 6 + 4] = y; tPos[k * 6 + 5] = z - trail
    }
    for (let a = 0; a < PN && L < LMAX; a += 3) {
      const az = pPos[a * 3 + 2]
      if (az > cz - 1.5 || az < cz - 9) continue
      for (let b = a + 3; b < PN && L < LMAX; b += 3) {
        const dx = pPos[a * 3] - pPos[b * 3]
        const dy = pPos[a * 3 + 1] - pPos[b * 3 + 1]
        const dz = az - pPos[b * 3 + 2]
        if (dx * dx + dy * dy + dz * dz < 1.1) {
          lPos.set([pPos[a * 3], pPos[a * 3 + 1], az, pPos[b * 3], pPos[b * 3 + 1], pPos[b * 3 + 2]], L * 6)
          L++
        }
      }
    }
    lGeo.setDrawRange(0, L * 2)
    lGeo.attributes.position.needsUpdate = true
    pGeo.attributes.position.needsUpdate = true
    tGeo.attributes.position.needsUpdate = true
    trails.material.opacity = Math.min(0.8, trail * 0.6)
    dots.material.opacity = 0.9 + through * 0.1

    renderer.render(scene, camera)
    onHud(Math.min(N, Math.max(1, Math.round(pt) + 1)), p)
  }
  tick()

  /* the frame's rectangle on screen right now (for the full-screen portal) */
  const v3 = new THREE.Vector3()
  const screenRect = (i) => {
    const it = items[i]
    it.mesh.geometry.computeBoundingBox()
    const bb = it.mesh.geometry.boundingBox
    const r = canvas.getBoundingClientRect()
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
    for (const cx of [bb.min.x, bb.max.x]) {
      for (const cy of [bb.min.y, bb.max.y]) {
        v3.set(cx, cy, 0).applyMatrix4(it.mesh.matrixWorld).project(camera)
        const sx = r.left + (v3.x * 0.5 + 0.5) * W
        const sy = r.top + (-v3.y * 0.5 + 0.5) * H
        x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy)
      }
    }
    return { x0, y0, x1, y1, time: it.video?.currentTime }
  }

  const destroy = () => {
    cancelAnimationFrame(raf)
    io.disconnect()
    window.removeEventListener('resize', resize)
    stage.removeEventListener('pointermove', onMove)
    stage.removeEventListener('pointerleave', onLeave)
    canvas.removeEventListener('click', onClick)
    items.forEach((it) => {
      it.video?.pause()
      it.uniforms.map.value?.dispose()
      it.mesh.geometry.dispose()
      it.mesh.material.dispose()
    })
    pGeo.dispose(); tGeo.dispose(); lGeo.dispose(); dotTex.dispose()
    renderer.dispose()
  }

  return { screenRect, destroy }
}
