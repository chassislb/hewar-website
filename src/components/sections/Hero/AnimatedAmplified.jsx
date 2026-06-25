import { useRef, useEffect } from 'react'
import styles from './AnimatedAmplified.module.css'

const VIDEO_SRC = '/hewar-website/videos/amplified.mp4'
const TEXT = 'Amplified.'
const LS_EM = -0.055 // letter-spacing in em

/* Draw text centered at (cx, baselineY) with manual letter-spacing */
function drawText(ctx, text, cx, baselineY, fontSize) {
  ctx.font = `700 ${fontSize}px "Inter", system-ui, sans-serif`
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'left'

  const lsPx = LS_EM * fontSize

  let totalW = -lsPx
  for (const ch of text) totalW += ctx.measureText(ch).width + lsPx

  let x = cx - totalW / 2
  for (const ch of text) {
    ctx.fillText(ch, x, baselineY)
    x += ctx.measureText(ch).width + lsPx
  }
}

export default function AnimatedAmplified() {
  const canvasRef = useRef(null)
  const videoRef  = useRef(null)
  const rafRef    = useRef(null)
  const st        = useRef({ W: 0, H: 0, grad: null })

  useEffect(() => {
    const canvas = canvasRef.current
    const video  = videoRef.current
    const ctx    = canvas.getContext('2d')

    /* Setup — called on mount and whenever the canvas resizes */
    function setup() {
      const dpr  = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      const W    = rect.width
      if (!W) return

      /* Compute H from aspect ratio explicitly — avoids relying on CSS aspect-ratio
         (not supported in Safari < 15) */
      const H = W * (220 / 1000)
      canvas.style.height = `${H}px` // ensure correct CSS height in all browsers

      /* Set physical resolution */
      canvas.width  = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      /* Rebuild gradient (invalidated after canvas resize) */
      const grad = ctx.createLinearGradient(0, 0, W, 0)
      grad.addColorStop(0,    'rgba( 71,  0, 179, 0.52)')
      grad.addColorStop(0.55, 'rgba( 37, 99, 235, 0.42)')
      grad.addColorStop(1,    'rgba(  0,200, 255, 0.52)')

      st.current = { W, H, grad }
    }

    /* Draw loop */
    function draw(ts) {
      rafRef.current = requestAnimationFrame(draw)

      const { W, H, grad } = st.current
      if (!W || !H || video.readyState < 2) return

      ctx.clearRect(0, 0, W, H)

      /* ── 1. Draw video scaled 120% with slow LTR pan ── */
      const pan = Math.sin(ts / 5000) * 0.08 // ±8% over ~31 s
      const S   = 1.2
      ctx.drawImage(
        video,
        (W - W * S) / 2 + pan * W, // x: centred + pan offset
        (H - H * S) / 2,            // y: vertically centred
        W * S, H * S,
      )

      /* ── 2. Clip to letter shapes (destination-in) ── */
      ctx.globalCompositeOperation = 'destination-in'
      ctx.fillStyle = '#ffffff'
      /* Scale matches SVG viewBox 1000×220: font at 178/220 × H, baseline at 158/220 × H */
      drawText(ctx, TEXT, W / 2, H * (158 / 220), H * (178 / 220))
      ctx.globalCompositeOperation = 'source-over'

      /* ── 3. Brand gradient tint — only on existing (letter) pixels ── */
      ctx.globalCompositeOperation = 'source-atop'
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'source-over'
    }

    setup()

    const ro = new ResizeObserver(setup)
    ro.observe(canvas)

    /* Start RAF after fonts are ready so letter-spacing is exact */
    document.fonts.ready.then(() => {
      rafRef.current = requestAnimationFrame(draw)
    })

    /* Kick autoplay (some browsers need an explicit call) */
    video.play().catch(() => {})

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [])

  return (
    <span className={styles.wrap} aria-label="Amplified.">
      {/* Canvas renders video-in-text via composite operations */}
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      {/* Video lives off-screen — no controls, no black box, no PiP */}
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
