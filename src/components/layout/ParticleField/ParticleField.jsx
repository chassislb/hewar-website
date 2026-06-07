import { useEffect, useRef } from 'react'
import styles from './ParticleField.module.css'

/* ─── Tuning ─────────────────────────────── */
const PARTICLE_COUNT  = 100
const CONNECT_DIST    = 130   // px — max line length between particles
const MOUSE_RADIUS    = 160   // px — cursor influence radius
const REPEL_FORCE     = 0.5   // how hard cursor pushes particles away
const RIPPLE_SPEED    = 0.14  // px per ms — outward ripple wave speed
const RIPPLE_LIFE     = 900   // ms — ripple duration

/* ─── Brand colours ─────────────────────── */
const COL_LINE   = [0, 200, 255]      // cyan  #00C8FF
const COL_POINT  = [180, 140, 255]    // light lavender — visible as stars on navy
const COL_BRIGHT = [0, 200, 255]      // cyan highlight near cursor
/* ─────────────────────────────────────────── */

function makeParticle(w, h) {
  const angle = Math.random() * Math.PI * 2
  const speed = 0.12 + Math.random() * 0.18
  return {
    x:     Math.random() * w,
    y:     Math.random() * h,
    vx:    Math.cos(angle) * speed,
    vy:    Math.sin(angle) * speed,
    r:     1.2 + Math.random() * 2,
    alpha: 0.4 + Math.random() * 0.5,
    phase: Math.random() * Math.PI * 2,
  }
}

const ParticleField = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const cv  = canvasRef.current
    const ctx = cv.getContext('2d')
    const DPR = Math.min(1.75, window.devicePixelRatio || 1)
    const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouch = matchMedia('(hover: none)').matches
    const count = isTouch ? 60 : PARTICLE_COUNT

    let W, H, particles = [], ripples = []
    const mouse = { x: -9999, y: -9999, active: false }
    let animId

    function resize() {
      W = Math.floor(innerWidth  * DPR)
      H = Math.floor(innerHeight * DPR)
      cv.width  = W
      cv.height = H
      cv.style.width  = `${innerWidth}px`
      cv.style.height = `${innerHeight}px`
      if (!particles.length) {
        for (let i = 0; i < count; i++) particles.push(makeParticle(innerWidth, innerHeight))
      }
    }

    function render(now) {
      animId = requestAnimationFrame(render)
      ctx.clearRect(0, 0, W, H)
      if (prefersReducedMotion) return

      const cDist  = CONNECT_DIST * DPR
      const cDist2 = cDist * cDist
      const mR     = MOUSE_RADIUS
      const mR2    = mR * mR

      /* ── Update particle physics ── */
      for (const p of particles) {
        /* cursor repulsion */
        if (mouse.active) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y
          const d2 = dx * dx + dy * dy
          if (d2 > 0 && d2 < mR2) {
            const dist = Math.sqrt(d2)
            const f = (1 - dist / mR) * REPEL_FORCE
            p.vx += (dx / dist) * f
            p.vy += (dy / dist) * f
          }
        }

        /* ripple impulses */
        for (const r of ripples) {
          const age  = now - r.t
          const wave = age * RIPPLE_SPEED
          const dx   = p.x - r.x, dy = p.y - r.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (Math.abs(dist - wave) < 18) {
            const f = (1 - age / RIPPLE_LIFE) * 0.9
            if (dist > 0) { p.vx += (dx / dist) * f; p.vy += (dy / dist) * f }
          }
        }

        p.vx *= 0.976; p.vy *= 0.976
        p.x  += p.vx;  p.y  += p.vy

        if (p.x < -10)          p.x = innerWidth  + 10
        if (p.x > innerWidth  + 10) p.x = -10
        if (p.y < -10)          p.y = innerHeight + 10
        if (p.y > innerHeight + 10) p.y = -10
      }

      ripples = ripples.filter(r => now - r.t < RIPPLE_LIFE)

      /* ── Draw lines between nearby particles ── */
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const b  = particles[j]
          const dx = (a.x - b.x) * DPR
          const dy = (a.y - b.y) * DPR
          const d2 = dx * dx + dy * dy
          if (d2 < cDist2) {
            const al = (1 - Math.sqrt(d2) / cDist) * 0.35
            ctx.strokeStyle = `rgba(${COL_LINE[0]},${COL_LINE[1]},${COL_LINE[2]},${al.toFixed(3)})`
            ctx.lineWidth   = DPR * 0.7
            ctx.beginPath()
            ctx.moveTo(a.x * DPR, a.y * DPR)
            ctx.lineTo(b.x * DPR, b.y * DPR)
            ctx.stroke()
          }
        }

        /* lines to cursor */
        if (mouse.active) {
          const dx = (a.x - mouse.x) * DPR
          const dy = (a.y - mouse.y) * DPR
          const d2 = dx * dx + dy * dy
          if (d2 < mR2 * DPR * DPR) {
            const al = (1 - Math.sqrt(d2) / (mR * DPR)) * 0.6
            ctx.strokeStyle = `rgba(${COL_LINE[0]},${COL_LINE[1]},${COL_LINE[2]},${al.toFixed(3)})`
            ctx.lineWidth   = DPR
            ctx.beginPath()
            ctx.moveTo(a.x * DPR, a.y * DPR)
            ctx.lineTo(mouse.x * DPR, mouse.y * DPR)
            ctx.stroke()
          }
        }
      }

      /* ── Draw particles ── */
      for (const p of particles) {
        const md     = mouse.active ? Math.hypot(p.x - mouse.x, p.y - mouse.y) : 9999
        const near   = md < mR
        const t      = now * 0.0014
        const pulse  = p.alpha + 0.18 * Math.sin(t + p.phase)
        const alpha  = Math.min(1, pulse + (near ? (1 - md / mR) * 0.45 : 0))
        const radius = (p.r + (near ? (1 - md / mR) * 2.2 : 0)) * DPR

        const [r, g, b] = near ? COL_BRIGHT : COL_POINT

        ctx.shadowColor = near
          ? `rgba(${COL_LINE[0]},${COL_LINE[1]},${COL_LINE[2]},0.9)`
          : `rgba(${COL_POINT[0]},${COL_POINT[1]},${COL_POINT[2]},0.5)`
        ctx.shadowBlur  = near ? 10 * DPR : 4 * DPR

        ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`
        ctx.beginPath()
        ctx.arc(p.x * DPR, p.y * DPR, radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }
    }

    const onMove  = e => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true }
    const onLeave = ()  => { mouse.active = false }
    const onClick = e  => ripples.push({ x: e.clientX, y: e.clientY, t: performance.now() })

    resize()
    window.addEventListener('resize',       resize,  { passive: true })
    window.addEventListener('pointermove',  onMove,  { passive: true })
    window.addEventListener('pointerleave', onLeave, { passive: true })
    window.addEventListener('pointerdown',  onClick, { passive: true })

    animId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize',       resize)
      window.removeEventListener('pointermove',  onMove)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerdown',  onClick)
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden />
}

export default ParticleField
