import { useEffect, useRef } from 'react'
import { useSectionTheme } from '../../../context/SectionThemeContext'
import styles from './ParticleField.module.css'

const PARTICLE_COUNT = 150
const MOUSE_RADIUS = 150
const MOUSE_PULL = 0.012
const CONNECT_DIST = 140
const RIPPLE_SPEED = 0.32
const RIPPLE_LIFE = 950
const RIPPLE_BAND = 22

const PALETTE = {
  dark: {
    point: [180, 140, 255],
    bright: [0, 200, 255],
    line: [150, 150, 220],
    lineAlpha: 0.16,
  },
  light: {
    point: [71, 0, 179],
    bright: [0, 130, 190],
    line: [71, 0, 179],
    lineAlpha: 0.1,
  },
}

function makeParticle(w, h) {
  const baseX = Math.random() * w
  const baseY = Math.random() * h

  return {
    x: baseX,
    y: baseY,
    baseX,
    baseY,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18,
    r: 1.1 + Math.random() * 1.9,
    alpha: 0.35 + Math.random() * 0.45,
    phase: Math.random() * Math.PI * 2,
  }
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

const ParticleField = () => {
  const canvasRef = useRef(null)
  const theme = useSectionTheme()
  const themeRef = useRef(theme)

  useEffect(() => {
    themeRef.current = theme
  }, [theme])

  useEffect(() => {
    const cv = canvasRef.current
    const ctx = cv.getContext('2d')
    const DPR = Math.min(1.75, window.devicePixelRatio || 1)
    const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouch = matchMedia('(hover: none)').matches
    const count = isTouch ? 80 : PARTICLE_COUNT

    let W
    let H
    let particles = []
    let ripples = []
    let animId

    const color = {
      point: [...PALETTE.dark.point],
      bright: [...PALETTE.dark.bright],
      line: [...PALETTE.dark.line],
      lineAlpha: PALETTE.dark.lineAlpha,
    }

    const mouse = {
      x: -9999,
      y: -9999,
      active: false,
      lastMove: 0,
    }

    function resize() {
      W = Math.floor(window.innerWidth * DPR)
      H = Math.floor(window.innerHeight * DPR)

      cv.width = W
      cv.height = H
      cv.style.width = `${window.innerWidth}px`
      cv.style.height = `${window.innerHeight}px`

      particles = []

      for (let i = 0; i < count; i++) {
        particles.push(makeParticle(window.innerWidth, window.innerHeight))
      }
    }

    function updateColor() {
      const target = themeRef.current === 'light' ? PALETTE.light : PALETTE.dark
      for (let i = 0; i < 3; i++) {
        color.point[i] = lerp(color.point[i], target.point[i], 0.04)
        color.bright[i] = lerp(color.bright[i], target.bright[i], 0.04)
        color.line[i] = lerp(color.line[i], target.line[i], 0.04)
      }
      color.lineAlpha = lerp(color.lineAlpha, target.lineAlpha, 0.04)
    }

    function render(now) {
      animId = requestAnimationFrame(render)
      ctx.clearRect(0, 0, W, H)

      if (prefersReducedMotion) return

      updateColor()

      const time = now * 0.001

      ripples = ripples.filter((r) => now - r.t < RIPPLE_LIFE)

      const mouseIsLive = mouse.active && now - mouse.lastMove < 3000

      for (const p of particles) {
        const floatX = Math.sin(time * 0.35 + p.phase) * 0.18
        const floatY = Math.cos(time * 0.28 + p.phase) * 0.18

        p.vx += floatX * 0.015
        p.vy += floatY * 0.015

        if (mouseIsLive) {
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < MOUSE_RADIUS && dist > 0) {
            const force = (1 - dist / MOUSE_RADIUS) * MOUSE_PULL
            p.vx += dx * force
            p.vy += dy * force
          }
        }

        for (const r of ripples) {
          const age = now - r.t
          const ringR = age * RIPPLE_SPEED
          const dx = p.x - r.x
          const dy = p.y - r.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (Math.abs(dist - ringR) < RIPPLE_BAND && dist > 0) {
            const force = (1 - age / RIPPLE_LIFE) * 0.85
            p.vx += (dx / dist) * force
            p.vy += (dy / dist) * force
          }
        }

        const homeDx = p.baseX - p.x
        const homeDy = p.baseY - p.y

        p.vx += homeDx * 0.0008
        p.vy += homeDy * 0.0008

        p.vx *= 0.94
        p.vy *= 0.94

        p.x += p.vx
        p.y += p.vy
      }

      /* Constellation lines between nearby particles, batched into a few
         stroke() calls (bucketed by opacity) instead of one per pair —
         O(n^2) pair checks are cheap, but individual stroke() calls are not. */
      const BUCKETS = 6
      const bucketPaths = Array.from({ length: BUCKETS }, () => new Path2D())

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < CONNECT_DIST) {
            const closeness = 1 - dist / CONNECT_DIST
            const bucket = Math.min(BUCKETS - 1, Math.floor(closeness * BUCKETS))
            bucketPaths[bucket].moveTo(a.x * DPR, a.y * DPR)
            bucketPaths[bucket].lineTo(b.x * DPR, b.y * DPR)
          }
        }
      }

      ctx.lineWidth = 1
      for (let k = 0; k < BUCKETS; k++) {
        const alpha = ((k + 1) / BUCKETS) * color.lineAlpha
        ctx.strokeStyle = `rgba(${color.line[0]}, ${color.line[1]}, ${color.line[2]}, ${alpha.toFixed(3)})`
        ctx.stroke(bucketPaths[k])
      }

      for (const p of particles) {
        const md = mouseIsLive ? Math.hypot(p.x - mouse.x, p.y - mouse.y) : 9999
        const near = md < MOUSE_RADIUS
        const pulse = p.alpha + 0.16 * Math.sin(time * 1.4 + p.phase)
        const alpha = Math.min(1, pulse + (near ? (1 - md / MOUSE_RADIUS) * 0.4 : 0))
        const radius = (p.r + (near ? (1 - md / MOUSE_RADIUS) * 1.4 : 0)) * DPR

        const [r, g, b] = near ? color.bright : color.point

        ctx.shadowColor = near
          ? `rgba(${color.bright[0]}, ${color.bright[1]}, ${color.bright[2]}, 0.85)`
          : `rgba(${color.point[0]}, ${color.point[1]}, ${color.point[2]}, 0.45)`

        ctx.shadowBlur = near ? 9 * DPR : 4 * DPR
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`

        ctx.beginPath()
        ctx.arc(p.x * DPR, p.y * DPR, radius, 0, Math.PI * 2)
        ctx.fill()

        ctx.shadowBlur = 0
      }
    }

    const onMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.active = true
      mouse.lastMove = performance.now()
    }

    const onLeave = () => {
      mouse.active = false
    }

    const onDown = (e) => {
      ripples.push({ x: e.clientX, y: e.clientY, t: performance.now() })
    }

    resize()

    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })

    animId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden />
}

export default ParticleField
