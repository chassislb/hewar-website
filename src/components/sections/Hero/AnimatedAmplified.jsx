import { useRef, useEffect } from 'react'
import styles from './AnimatedAmplified.module.css'

const VIDEO_SRC = '/hewar-website/videos/amplified.mp4'
const TEXT = 'Amplified.'
const LS_EM = -0.055

/* Draw text centered at (cx, baseline) with manual letter-spacing */
function drawText(ctx, text, cx, baseline, fontSize) {
  ctx.font = `700 ${fontSize}px "Inter", system-ui, sans-serif`
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'left'

  const lsPx = LS_EM * fontSize

  /* Compute total advance width */
  let totalW = -lsPx
  for (const ch of text) totalW += ctx.measureText(ch).width + lsPx

  let x = cx - totalW / 2
  for (const ch of text) {
    ctx.fillText(ch, x, baseline)
    x += ctx.measureText(ch).width + lsPx
  }
}

export default function AnimatedAmplified() {
  const canvasRef = useRef(null)
  const videoRef  = useRef(null)
  const rafRef    = useRef(null)
  const st        = useRef({ W: 0, H: 0, grad: null, gradFull: null })

  useEffect(() => {
    const canvas = canvasRef.current
    const video  = videoRef.current
    const ctx    = canvas.getContext('2d')
    let cancelled = false

    /* ── Resize / setup ── */
    function setup() {
      const dpr  = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      const W    = rect.width
      if (!W) return

      /* Derive height from SVG viewBox ratio (1000 × 220) */
      const H = W * (220 / 1000)
      canvas.style.height = `${H}px` // explicit fallback for Safari < 15 (no CSS aspect-ratio)

      canvas.width  = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      /* Gradient tint — applied over video pixels */
      const grad = ctx.createLinearGradient(0, 0, W, 0)
      grad.addColorStop(0,    'rgba( 71,  0, 179, 0.50)')
      grad.addColorStop(0.55, 'rgba( 37, 99, 235, 0.40)')
      grad.addColorStop(1,    'rgba(  0,200, 255, 0.50)')

      /* Solid gradient — shown as fallback while video loads */
      const gradFull = ctx.createLinearGradient(0, 0, W, 0)
      gradFull.addColorStop(0,    '#4700b3')
      gradFull.addColorStop(0.55, '#2563eb')
      gradFull.addColorStop(1,    '#00c8ff')

      st.current = { W, H, grad, gradFull }
    }

    /* ── Draw loop ── */
    function draw(ts) {
      rafRef.current = requestAnimationFrame(draw)

      const { W, H, grad, gradFull } = st.current
      if (!W || !H) return

      const fSize    = H * (178 / 220) // matches SVG viewBox font-size
      const baseline = H * (158 / 220) // matches SVG text y="158"

      ctx.clearRect(0, 0, W, H)

      /* ── Fallback: gradient text while video is buffering ── */
      if (video.readyState < 2 || video.videoWidth === 0) {
        ctx.fillStyle = gradFull
        drawText(ctx, TEXT, W / 2, baseline, fSize)
        return
      }

      /* ── 1. Video: scaled 120% with a slow LTR pan ── */
      const pan = Math.sin(ts / 5000) * 0.08 // ±8% over ~31 s
      const S   = 1.2
      ctx.drawImage(
        video,
        (W - W * S) / 2 + pan * W,
        (H - H * S) / 2,
        W * S, H * S,
      )

      /* ── 2. Clip to letter shapes via destination-in composite ── */
      ctx.globalCompositeOperation = 'destination-in'
      ctx.fillStyle = '#ffffff'
      drawText(ctx, TEXT, W / 2, baseline, fSize)
      ctx.globalCompositeOperation = 'source-over'

      /* ── 3. Brand gradient tint — only on letter pixels (source-atop) ── */
      ctx.globalCompositeOperation = 'source-atop'
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'source-over'
    }

    setup()

    const ro = new ResizeObserver(setup)
    ro.observe(canvas)

    /* Start RAF once fonts are confirmed loaded */
    document.fonts.ready.then(() => {
      if (!cancelled) rafRef.current = requestAnimationFrame(draw)
    })

    video.play().catch(() => {})

    return () => {
      cancelled = true
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [])

  return (
    <span className={styles.wrap} aria-label="Amplified.">
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      {/* Off-screen video — plays but has no UI (no black box, no controls, no PiP) */}
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        className={styles.hiddenVideo}
      />
    </span>
  )
}
