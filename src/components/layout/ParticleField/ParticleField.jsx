import { useEffect, useRef } from 'react'
import styles from './ParticleField.module.css'

const PARTICLE_COUNT = 95
const CONNECT_DIST = 155
const MOUSE_RADIUS = 150
const MOUSE_PULL = 0.012

const COL_LINE = [0, 200, 255]
const COL_POINT = [180, 140, 255]
const COL_BRIGHT = [0, 200, 255]

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
    r: 1.2 + Math.random() * 2,
    alpha: 0.35 + Math.random() * 0.45,
    phase: Math.random() * Math.PI * 2,
  }
}

const ParticleField = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const cv = canvasRef.current
    const ctx = cv.getContext('2d')
    const DPR = Math.min(1.75, window.devicePixelRatio || 1)
    const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouch = matchMedia('(hover: none)').matches
    const count = isTouch ? 55 : PARTICLE_COUNT

    let W
    let H
    let particles = []
    let animId

    const mouse = {
      x: -9999,
      y: -9999,
      active: false,
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

    function render(now) {
      animId = requestAnimationFrame(render)
      ctx.clearRect(0, 0, W, H)

      if (prefersReducedMotion) return

      const cDist = CONNECT_DIST * DPR
      const cDist2 = cDist * cDist
      const time = now * 0.001

      for (const p of particles) {
        const floatX = Math.sin(time * 0.35 + p.phase) * 0.18
        const floatY = Math.cos(time * 0.28 + p.phase) * 0.18

        p.vx += floatX * 0.015
        p.vy += floatY * 0.015

        if (mouse.active) {
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < MOUSE_RADIUS && dist > 0) {
            const force = (1 - dist / MOUSE_RADIUS) * MOUSE_PULL
            p.vx += dx * force
            p.vy += dy * force
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

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]

        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const dx = (a.x - b.x) * DPR
          const dy = (a.y - b.y) * DPR
          const d2 = dx * dx + dy * dy

          if (d2 < cDist2) {
            const dist = Math.sqrt(d2)
            const alpha = (1 - dist / cDist) * 0.42

            ctx.strokeStyle = `rgba(${COL_LINE[0]}, ${COL_LINE[1]}, ${COL_LINE[2]}, ${alpha.toFixed(3)})`
            ctx.lineWidth = DPR * 0.75
            ctx.beginPath()
            ctx.moveTo(a.x * DPR, a.y * DPR)
            ctx.lineTo(b.x * DPR, b.y * DPR)
            ctx.stroke()
          }
        }
      }

      for (const p of particles) {
        const md = mouse.active ? Math.hypot(p.x - mouse.x, p.y - mouse.y) : 9999
        const near = md < MOUSE_RADIUS
        const pulse = p.alpha + 0.16 * Math.sin(time * 1.4 + p.phase)
        const alpha = Math.min(1, pulse + (near ? (1 - md / MOUSE_RADIUS) * 0.4 : 0))
        const radius = (p.r + (near ? (1 - md / MOUSE_RADIUS) * 1.4 : 0)) * DPR

        const [r, g, b] = near ? COL_BRIGHT : COL_POINT

        ctx.shadowColor = near
          ? `rgba(${COL_LINE[0]}, ${COL_LINE[1]}, ${COL_LINE[2]}, 0.85)`
          : `rgba(${COL_POINT[0]}, ${COL_POINT[1]}, ${COL_POINT[2]}, 0.45)`

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
    }

    const onLeave = () => {
      mouse.active = false
    }

    resize()

    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave, { passive: true })

    animId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden />
}

export default ParticleField