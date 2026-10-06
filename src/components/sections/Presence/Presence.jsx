import { useCallback, useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Container from '../../ui/Container/Container'
import { useTranslation } from '../../../i18n/useTranslation'
import { WORLD_DOTS, COUNTRY_DOTS } from './globeDots'
import styles from './Presence.module.css'

gsap.registerPlugin(ScrollTrigger)

/* ─────────────────────────────────────────────
   Where Hewar works. One conversation, three dialects.
   Dotted orthographic globe on a 2D canvas — no three.js.
   Drag to spin, hover a city or a row to fly there.
───────────────────────────────────────────── */

const RAD = Math.PI / 180

const OFFICES = [
  { code: 'SA', lon: 46.6753, lat: 24.7136, tz: 'Asia/Riyadh' },
  { code: 'AE', lon: 55.2708, lat: 25.2048, tz: 'Asia/Dubai' },
  { code: 'LB', lon: 35.5018, lat: 33.8938, tz: 'Asia/Beirut' },
]

const ARCS = [
  ['SA', 'AE'],
  ['SA', 'LB'],
  ['LB', 'AE'],
]

/* Region centre — where the camera rests between Beirut, Riyadh and Dubai */
const HOME_VIEW = { lon: 44, lat: 22, scale: 1 }

const decode = (b64) => {
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  const ints = new Int16Array(bytes.buffer)
  const n = ints.length / 2
  /* pre-computed trig: cosLat, sinLat, lon(rad) */
  const out = { n, cosLat: new Float32Array(n), sinLat: new Float32Array(n), lon: new Float32Array(n) }
  for (let i = 0; i < n; i++) {
    const lon = ints[2 * i] / 100
    const lat = ints[2 * i + 1] / 100
    out.cosLat[i] = Math.cos(lat * RAD)
    out.sinLat[i] = Math.sin(lat * RAD)
    out.lon[i] = lon * RAD
  }
  return out
}

/* lon/lat → unit vector, and back — for great-circle arcs */
const toVec = (lon, lat) => [Math.cos(lat * RAD) * Math.cos(lon * RAD), Math.cos(lat * RAD) * Math.sin(lon * RAD), Math.sin(lat * RAD)]
const toLonLat = ([x, y, z]) => [Math.atan2(y, x) / RAD, Math.asin(Math.max(-1, Math.min(1, z))) / RAD]
const slerp = (a, b, t) => {
  const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))
  const w = Math.acos(dot)
  if (w < 1e-6) return a
  const s = Math.sin(w)
  const k1 = Math.sin((1 - t) * w) / s
  const k2 = Math.sin(t * w) / s
  return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2]
}

const useLocalTime = (tz, locale) => {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15000)
    return () => clearInterval(id)
  }, [])
  return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }).format(now)
}

const OfficeRow = ({ office, index, copy, locale, active, onEnter, onLeave, onSelect }) => {
  const time = useLocalTime(office.tz, locale)
  return (
    <li>
      <button
        type="button"
        className={`${styles.row} ${active ? styles.rowActive : ''}`}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onFocus={onEnter}
        onBlur={onLeave}
        onClick={onSelect}
        aria-pressed={active}
        data-presence-row
      >
        <span className={styles.rowNum}>{String(index + 1).padStart(2, '0')}</span>
        <span className={styles.rowMain}>
          <span className={styles.rowCountry}>{copy.country}</span>
          <span className={styles.rowCity}>{copy.city}</span>
        </span>
        <span className={styles.rowGreeting} lang="ar" dir="rtl">{copy.greeting}</span>
        <span className={styles.rowTime}>
          <span className={styles.liveDot} aria-hidden />
          {time}
        </span>
      </button>
    </li>
  )
}

const Presence = () => {
  const { t, language } = useTranslation()
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const canvasRef = useRef(null)
  const tagRef = useRef(null)

  const copy = t('presence.offices')
  const locale = language === 'ar' ? 'ar-SA-u-nu-latn' : 'en-GB'

  const [hovered, setHovered] = useState(null)
  const [selected, setSelected] = useState(null)
  const [autoCode, setAutoCode] = useState(null)
  const active = hovered ?? selected ?? autoCode

  /* mutable state the render loop reads every frame */
  const view = useRef({ ...HOME_VIEW, lon: -25, scale: 0.82 })
  const sim = useRef({
    active: null,
    dragging: false,
    userTouched: false,
    vel: 0,
    velLat: 0,
    lastInteract: 0,
    markers: {},
    hoverCanvas: null,
  })

  /* ── Fly the camera ── */
  const flyTo = useCallback((code) => {
    const target = code ? OFFICES.find((o) => o.code === code) : null
    gsap.to(view.current, {
      lon: target ? target.lon : HOME_VIEW.lon,
      lat: target ? target.lat - 6 : HOME_VIEW.lat,
      scale: target ? 1.18 : 1,
      duration: 1.4,
      ease: 'power3.inOut',
      overwrite: 'auto',
    })
  }, [])

  const firstRun = useRef(true)
  useEffect(() => {
    sim.current.active = active
    /* don't yank the camera on mount — the scroll intro owns it until then */
    if (firstRun.current) { firstRun.current = false; return }
    flyTo(active)
  }, [active, flyTo])

  /* ── Idle tour: cycle the three cities until someone touches something ── */
  useEffect(() => {
    if (hovered || selected) return undefined
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return undefined
    let i = 0
    let id
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 35%',
      end: 'bottom 30%',
      onToggle: (self) => {
        clearInterval(id)
        if (self.isActive && !sim.current.userTouched) {
          setAutoCode(OFFICES[i].code)
          id = setInterval(() => {
            if (sim.current.userTouched) return clearInterval(id)
            i = (i + 1) % (OFFICES.length + 1)
            setAutoCode(i === OFFICES.length ? null : OFFICES[i].code)
          }, 3600)
        } else {
          setAutoCode(null)
        }
      },
    })
    return () => {
      clearInterval(id)
      st.kill()
    }
  }, [hovered, selected])

  const markTouched = () => {
    sim.current.userTouched = true
    setAutoCode(null)
  }

  /* ── Scroll: spin in from Africa and settle on the region ── */
  useGSAP(() => {
    gsap.fromTo('[data-presence-line]', { y: '110%' }, {
      y: '0%', duration: 1, stagger: 0.1, ease: 'power4.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
    })
    gsap.fromTo('[data-presence-row]', { opacity: 0, y: 24 }, {
      opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 55%' },
    })
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'top 15%',
      scrub: 1,
      onUpdate: (self) => {
        if (sim.current.userTouched || sim.current.active) return
        const p = self.progress
        view.current.lon = -25 + (HOME_VIEW.lon + 25) * p
        view.current.scale = 0.82 + (1 - 0.82) * p
      },
    })
  }, { scope: sectionRef })

  /* ── The globe ── */
  useEffect(() => {
    const canvas = canvasRef.current
    const stage = stageRef.current
    const ctx = canvas.getContext('2d')
    const world = decode(WORLD_DOTS)
    const countries = Object.fromEntries(Object.entries(COUNTRY_DOTS).map(([k, v]) => [k, decode(v)]))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const officeVec = Object.fromEntries(OFFICES.map((o) => [o.code, toVec(o.lon, o.lat)]))
    const arcs = ARCS.map(([a, b], i) => {
      const A = officeVec[a]
      const B = officeVec[b]
      const dist = Math.acos(A[0] * B[0] + A[1] * B[1] + A[2] * B[2])
      const pts = []
      const N = 64
      for (let k = 0; k <= N; k++) {
        const tt = k / N
        const [lon, lat] = toLonLat(slerp(A, B, tt))
        pts.push({ lon: lon * RAD, cosLat: Math.cos(lat * RAD), sinLat: Math.sin(lat * RAD), h: 1 + Math.sin(Math.PI * tt) * dist * 0.55 })
      }
      return { a, b, pts, offset: i * 0.33 }
    })

    let w = 0
    let h = 0
    let dpr = 1
    const resize = () => {
      const r = stage.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = r.width
      h = r.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(stage)

    /* orthographic projection centred on (lon0, lat0) */
    let lon0 = 0
    let cP = 1
    let sP = 0
    let R = 1
    let cx = 0
    let cy = 0
    const project = (lon, cosLat, sinLat, r = 1) => {
      const dl = lon - lon0
      const cdl = Math.cos(dl)
      return {
        x: cx + R * r * cosLat * Math.sin(dl),
        y: cy - R * r * (cP * sinLat - sP * cosLat * cdl),
        z: sP * sinLat + cP * cosLat * cdl,
      }
    }

    let running = true
    let visible = true
    let raf = 0
    const t0 = performance.now()

    const drawDots = (set, color, size, limbFade) => {
      ctx.fillStyle = color
      for (let i = 0; i < set.n; i++) {
        const dl = set.lon[i] - lon0
        const cdl = Math.cos(dl)
        const z = sP * set.sinLat[i] + cP * set.cosLat[i] * cdl
        if (z <= 0.02) continue
        const x = cx + R * set.cosLat[i] * Math.sin(dl)
        const y = cy - R * (cP * set.sinLat[i] - sP * set.cosLat[i] * cdl)
        const s = size * (limbFade ? 0.45 + 0.55 * z : 1)
        ctx.globalAlpha = limbFade ? 0.25 + 0.75 * z : 1
        ctx.fillRect(x - s / 2, y - s / 2, s, s)
      }
      ctx.globalAlpha = 1
    }

    const frame = (now) => {
      if (!running) return
      raf = requestAnimationFrame(frame)
      if (!visible) return
      const time = (now - t0) / 1000
      const s = sim.current
      const v = view.current

      /* inertia after a drag, then a slow breathing sway */
      if (!s.dragging) {
        if (Math.abs(s.vel) > 0.001 || Math.abs(s.velLat) > 0.001) {
          v.lon -= s.vel
          v.lat = Math.max(-50, Math.min(60, v.lat + s.velLat))
          s.vel *= 0.94
          s.velLat *= 0.94
        }
      }
      const idle = !s.dragging && !s.active && now - s.lastInteract > 2500
      const sway = idle && !reduce ? Math.sin(time * 0.25) * 10 : 0

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      R = Math.min(w, h) * 0.37 * v.scale
      cx = w / 2
      cy = h / 2
      lon0 = (v.lon + sway) * RAD
      const p0 = v.lat * RAD
      cP = Math.cos(p0)
      sP = Math.sin(p0)

      /* atmosphere */
      const haloR = Math.min(R * 1.45, Math.min(w, h) / 2)
      const halo = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, haloR)
      halo.addColorStop(0, 'rgba(71, 0, 179, 0.38)')
      halo.addColorStop(0.45, 'rgba(40, 30, 160, 0.12)')
      halo.addColorStop(1, 'rgba(6, 26, 64, 0)')
      ctx.fillStyle = halo
      ctx.fillRect(0, 0, w, h)

      /* sphere body */
      const body = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R)
      body.addColorStop(0, '#1a2a78')
      body.addColorStop(0.6, '#0e1c5a')
      body.addColorStop(1, '#0a1240')
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fillStyle = body
      ctx.fill()
      ctx.strokeStyle = 'rgba(120, 140, 255, 0.18)'
      ctx.lineWidth = 1
      ctx.stroke()

      /* land */
      drawDots(world, 'rgb(150, 170, 255)', Math.max(1.4, R / 190), true)
      for (const o of OFFICES) {
        const on = s.active === o.code
        drawDots(countries[o.code], on ? '#ffffff' : '#00C8FF', Math.max(1.6, R / 170) * (o.code === 'LB' ? 0.8 : 1), false)
      }

      /* arcs — a faint full trace + a travelling comet */
      for (const arc of arcs) {
        const lit = !s.active || arc.a === s.active || arc.b === s.active
        const proj = arc.pts.map((p) => {
          const q = project(p.lon, p.cosLat, p.sinLat, p.h)
          const dx = (q.x - cx) / R
          const dy = (q.y - cy) / R
          q.vis = q.z > 0 || dx * dx + dy * dy > 1.0
          return q
        })
        ctx.lineWidth = 1.4
        ctx.strokeStyle = lit ? 'rgba(0, 200, 255, 0.4)' : 'rgba(0, 200, 255, 0.08)'
        ctx.beginPath()
        let pen = false
        proj.forEach((q) => {
          if (!q.vis) { pen = false; return }
          if (pen) ctx.lineTo(q.x, q.y)
          else { ctx.moveTo(q.x, q.y); pen = true }
        })
        ctx.stroke()

        if (!lit) continue
        const head = reduce ? 1 : ((time * 0.35 + arc.offset) % 1.4) / 1.1
        const tail = head - 0.35
        const n = proj.length - 1
        for (let k = 1; k <= n; k++) {
          const tt = k / n
          if (tt > head || tt < tail) continue
          const a = proj[k - 1]
          const b = proj[k]
          if (!a.vis || !b.vis) continue
          const f = (tt - tail) / (head - tail)
          ctx.strokeStyle = `rgba(${Math.round(98 + 157 * f)}, ${Math.round(80 + 175 * f)}, 255, ${0.15 + 0.85 * f})`
          ctx.lineWidth = 1.2 + f * 2
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }

      /* city markers */
      const tag = tagRef.current
      let tagPlaced = false
      for (const o of OFFICES) {
        const q = project(o.lon * RAD, Math.cos(o.lat * RAD), Math.sin(o.lat * RAD))
        s.markers[o.code] = q
        if (q.z <= 0) continue
        const on = s.active === o.code
        const pulse = reduce ? 0.5 : (time * 0.8 + OFFICES.indexOf(o) * 0.3) % 1
        ctx.beginPath()
        ctx.arc(q.x, q.y, 4 + pulse * (on ? 26 : 14), 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0, 200, 255, ${(1 - pulse) * (on ? 0.9 : 0.5)})`
        ctx.lineWidth = 1.2
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(q.x, q.y, on ? 5 : 3.5, 0, Math.PI * 2)
        ctx.fillStyle = on ? '#ffffff' : '#00C8FF'
        ctx.fill()
        if (on && tag) {
          tag.style.transform = `translate3d(${q.x}px, ${q.y}px, 0)`
          tag.style.opacity = q.z > 0.15 ? '1' : '0'
          tagPlaced = true
        }
      }
      if (tag && !tagPlaced) tag.style.opacity = '0'
    }
    raf = requestAnimationFrame(frame)

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { rootMargin: '100px' })
    io.observe(stage)

    /* ── drag to spin ── */
    let last = null
    const onDown = (e) => {
      sim.current.dragging = true
      sim.current.userTouched = true
      sim.current.lastInteract = performance.now()
      last = { x: e.clientX, y: e.clientY }
      canvas.setPointerCapture(e.pointerId)
      gsap.killTweensOf(view.current)
    }
    const onMove = (e) => {
      const s = sim.current
      if (s.dragging && last) {
        const k = 180 / (Math.PI * R)
        const dx = (e.clientX - last.x) * k
        const dy = (e.clientY - last.y) * k
        view.current.lon -= dx
        view.current.lat = Math.max(-50, Math.min(60, view.current.lat + dy))
        s.vel = dx
        s.velLat = dy
        last = { x: e.clientX, y: e.clientY }
        s.lastInteract = performance.now()
        return
      }
      /* hover a city on the globe */
      const r = canvas.getBoundingClientRect()
      const mx = e.clientX - r.left
      const my = e.clientY - r.top
      let hit = null
      for (const o of OFFICES) {
        const q = s.markers[o.code]
        if (q && q.z > 0 && Math.hypot(q.x - mx, q.y - my) < 22) hit = o.code
      }
      canvas.style.cursor = hit ? 'pointer' : 'grab'
      if (hit !== s.hoverCanvas) {
        s.hoverCanvas = hit
        if (hit) markTouched()
        setHovered(hit)
      }
    }
    const onUp = (e) => {
      const s = sim.current
      const moved = last && (Math.abs(s.vel) > 0.05 || Math.abs(s.velLat) > 0.05)
      s.dragging = false
      last = null
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId)
      if (!moved && s.hoverCanvas) setSelected((cur) => (cur === s.hoverCanvas ? null : s.hoverCanvas))
    }
    const onLeave = () => {
      if (sim.current.hoverCanvas) {
        sim.current.hoverCanvas = null
        setHovered(null)
      }
    }
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    canvas.addEventListener('pointerleave', onLeave)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  const headingLines = t('presence.headingLines')
  const activeIdx = OFFICES.findIndex((o) => o.code === active)
  const activeCopy = activeIdx >= 0 ? copy[activeIdx] : null

  return (
    <section className={styles.presence} ref={sectionRef} id="presence" data-section-theme="dark">
      <div className={styles.bgClip} aria-hidden>
        <div className={styles.glow} />
      </div>

      <Container>
        <div className={styles.grid}>
          <div className={styles.copy}>
            <div className={styles.label}>
              <span className={styles.dots} aria-hidden><span /><span /><span /></span>
              <span>{t('presence.label')}</span>
            </div>

            <h2 className={styles.heading}>
              {headingLines.map((line, i) => (
                <span key={i} className={styles.lineWrap}>
                  <span className={styles.lineInner} data-presence-line>{line}</span>
                </span>
              ))}
            </h2>

            <p className={styles.lede}>{t('presence.lede')}</p>

            <ul className={styles.rows}>
              {OFFICES.map((o, i) => (
                <OfficeRow
                  key={o.code}
                  office={o}
                  index={i}
                  copy={copy[i]}
                  locale={locale}
                  active={active === o.code}
                  onEnter={() => { markTouched(); setHovered(o.code) }}
                  onLeave={() => setHovered(null)}
                  onSelect={() => { markTouched(); setSelected((cur) => (cur === o.code ? null : o.code)) }}
                />
              ))}
            </ul>
          </div>

          <div className={styles.stage} ref={stageRef}>
            <canvas
              ref={canvasRef}
              className={styles.canvas}
              role="img"
              aria-label={t('presence.globeLabel')}
            />
            <div className={styles.tag} ref={tagRef} aria-hidden>
              {activeCopy && (
                <div className={styles.tagCard} key={active}>
                  <span className={styles.tagGreeting} lang="ar" dir="rtl">{activeCopy.greeting}</span>
                  <span className={styles.tagCity}>{activeCopy.city}</span>
                  <span className={styles.tagNote}>{activeCopy.note}</span>
                </div>
              )}
            </div>
            <p className={styles.hint} aria-hidden>{t('presence.hint')}</p>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Presence
