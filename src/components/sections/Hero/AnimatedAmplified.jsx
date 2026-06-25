import { useRef, useEffect } from 'react'
import styles from './AnimatedAmplified.module.css'

const VIDEO_SRC = '/hewar-website/videos/amplified.mp4'
const TEXT      = 'Amplified.'
const LS_EM     = -0.055 // letter-spacing

/* Draw text with manual letter-spacing in physical (canvas) pixels */
function fillText(ctx, text, cx, y, size) {
  const ls  = LS_EM * size
  ctx.font          = `700 ${size}px Inter, system-ui, sans-serif`
  ctx.textBaseline  = 'alphabetic'
  ctx.textAlign     = 'left'

  const widths = [...text].map(ch => ctx.measureText(ch).width)
  const totalW = widths.reduce((s, w) => s + w + ls, 0) - ls

  let x = cx - totalW / 2
  text.split('').forEach((ch, i) => {
    ctx.fillText(ch, x, y)
    x += widths[i] + ls
  })
}

export default function AnimatedAmplified() {
  const canvasRef = useRef(null)
  const videoRef  = useRef(null)
  const frameRef  = useRef(null)

  useEffect(() => {
    const cv  = canvasRef.current
    const vid = videoRef.current
    const ctx = cv.getContext('2d')
    let grad  = null

    /* Build canvas dimensions and gradient whenever width changes */
    function resize() {
      const dpr = window.devicePixelRatio || 1
      const css = cv.clientWidth
      if (!css) return

      const h = css * (220 / 1000)          // preserve SVG viewBox 1000×220 ratio
      cv.style.height = `${h}px`
      cv.width  = Math.round(css * dpr)     // physical pixels
      cv.height = Math.round(h   * dpr)

      /* Gradient in physical pixels */
      const g = ctx.createLinearGradient(0, 0, cv.width, 0)
      g.addColorStop(0,    '#4700b3')
      g.addColorStop(0.55, '#2563eb')
      g.addColorStop(1,    '#00c8ff')
      grad = g
    }

    function draw(ts) {
      frameRef.current = requestAnimationFrame(draw)

      const W = cv.width    // physical px
      const H = cv.height
      if (!W || !H) { resize(); return }

      ctx.clearRect(0, 0, W, H)

      /* SVG viewBox mapping: font-size 178/220×H, baseline 158/220×H */
      const fSize = H * (178 / 220)
      const baseY = H * (158 / 220)

      /* ── No video yet: draw brand-gradient text as fallback ── */
      if (vid.readyState < 2 || !vid.videoWidth) {
        if (grad) {
          ctx.fillStyle = grad
          fillText(ctx, TEXT, W / 2, baseY, fSize)
        }
        return
      }

      /* ── 1. Video with slow LTR pan (scale 120% to allow panning) ── */
      const pan = Math.sin(ts / 5000) * 0.08
      const S   = 1.2
      ctx.drawImage(vid,
        (W - W * S) / 2 + pan * W,
        (H - H * S) / 2,
        W * S, H * S,
      )

      /* ── 2. Clip to letter shapes ── */
      ctx.globalCompositeOperation = 'destination-in'
      ctx.fillStyle = '#ffffff'
      fillText(ctx, TEXT, W / 2, baseY, fSize)
      ctx.globalCompositeOperation = 'source-over'

      /* ── 3. Brand-colour tint over letters only ── */
      if (grad) {
        ctx.globalCompositeOperation = 'source-atop'
        ctx.globalAlpha  = 0.45
        ctx.fillStyle    = grad
        ctx.fillRect(0, 0, W, H)
        ctx.globalAlpha  = 1
        ctx.globalCompositeOperation = 'source-over'
      }
    }

    resize()
    window.addEventListener('resize', resize)
    vid.play().catch(() => {})
    frameRef.current = requestAnimationFrame(draw)   // start immediately — no font gate

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <span className={styles.wrap} aria-label="Amplified.">
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      {/* Kept in DOM so Safari can load + play; opacity:0 hides the raw video element */}
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
