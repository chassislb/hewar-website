import { useEffect, useRef } from 'react'
import { useContactModal } from '../../../context/ContactModalContext'
import { useTranslation } from '../../../i18n/useTranslation'
import styles from './IntroHero.module.css'

const PARTICLE_COUNT = 220
const LOGO_SRC = `${import.meta.env.BASE_URL}thinkmate-logo-mark.png`

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
const lerp = (a, b, t) => a + (b - a) * t
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

function makeParticle(w, h, cx, cy, mainRadius) {
  const sx = w * 0.08 + Math.random() * w * 0.84
  const sy = h * 0.1 + Math.random() * h * 0.8
  const angle = Math.random() * Math.PI * 2
  const dist = Math.sqrt(Math.random()) * mainRadius

  return {
    sx,
    sy,
    tx: cx + Math.cos(angle) * dist,
    ty: cy + Math.sin(angle) * dist,
    r: 1.2 + Math.random() * 1.6,
    phase: Math.random() * Math.PI * 2,
    speed: 0.6 + Math.random() * 0.8,
  }
}

/*
  Twinkling dots converge into two CSS gradient spheres, which cross-fade
  into the real HEWAR logo, then a tagline and a "Let's Talk" button fade
  in. Progress is driven by how far .wrapper has scrolled through its
  tall spacer height (not absolute page scroll), same pattern as the
  Services/Work horizontal-scroll sections, so this works regardless of
  where it sits on the page.
*/
const IntroHero = () => {
  const { openContactModal } = useContactModal()
  const { t } = useTranslation()
  const wrapperRef = useRef(null)
  const canvasRef = useRef(null)
  const titleMainRef = useRef(null)
  const introHeadlineRef = useRef(null)
  const sphereMainRef = useRef(null)
  const sphereSecondaryRef = useRef(null)
  const logoMarkRef = useRef(null)
  const ctaButtonRef = useRef(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const titleMain = titleMainRef.current
    const introHeadline = introHeadlineRef.current
    const sphereMain = sphereMainRef.current
    const sphereSecondary = sphereSecondaryRef.current
    const logoMark = logoMarkRef.current
    const ctaButton = ctaButtonRef.current

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let W, H, mainRadius
    let particles = []
    let progress = 0
    let rafId

    function buildParticles() {
      const cx = W / 2
      const cy = H / 2
      particles = []
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(makeParticle(W, H, cx, cy, mainRadius))
      }
    }

    function resize() {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      mainRadius = (0.2 * Math.min(W, H)) / 2 // keep in sync with .sphereMain's 20vmin
      buildParticles()
    }

    function render(time) {
      rafId = requestAnimationFrame(render)
      ctx.clearRect(0, 0, W, H)

      const settleT = easeOutCubic(clamp(progress / 0.4, 0, 1))
      const fadeOut = 1 - clamp((progress - 0.35) / 0.2, 0, 1)

      if (fadeOut > 0.01) {
        ctx.fillStyle = '#8fd8ff'
        particles.forEach((p) => {
          const x = lerp(p.sx, p.tx, settleT)
          const y = lerp(p.sy, p.ty, settleT)
          const twinkle = 0.25 + (Math.sin(time * 0.001 * p.speed + p.phase) * 0.5 + 0.5) * 0.7
          ctx.globalAlpha = twinkle * fadeOut
          ctx.beginPath()
          ctx.arc(x, y, p.r, 0, Math.PI * 2)
          ctx.fill()
        })
        ctx.globalAlpha = 1
      }
    }

    function onScroll() {
      const rect = wrapper.getBoundingClientRect()
      const runway = wrapper.offsetHeight - window.innerHeight
      progress = runway > 0 ? clamp(-rect.top / runway, 0, 1) : 0

      // "Human Intelligence. Amplified." fades out over the first 15% of scroll
      const titleT = 1 - clamp(progress / 0.15, 0, 1)
      titleMain.style.opacity = titleT

      // main sphere fades/scales in as the dots finish gathering
      const mainT = easeOutCubic(clamp((progress - 0.32) / 0.25, 0, 1))

      // secondary sphere slides out from behind the main one
      const secT = easeOutCubic(clamp((progress - 0.55) / 0.3, 0, 1))
      const dx = lerp(0, mainRadius * 0.82, secT)
      const dy = lerp(0, mainRadius * 0.46, secT)

      // both CSS spheres cross-fade into the real logo image
      const logoT = clamp((progress - 0.82) / 0.1, 0, 1)
      logoMark.style.opacity = logoT
      logoMark.style.transform = `translate(-50%, -50%) scale(${lerp(0.92, 1, logoT)})`

      sphereMain.style.opacity = mainT * (1 - logoT)
      sphereMain.style.transform = `translate(-50%, -50%) scale(${lerp(0.7, 1, mainT)})`
      sphereSecondary.style.opacity = secT * (1 - logoT)
      sphereSecondary.style.transform =
        `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${lerp(0.35, 1, secT)})`

      // tagline settles in once the logo has mostly appeared
      const headT = clamp((progress - 0.9) / 0.06, 0, 1)
      introHeadline.style.opacity = headT
      introHeadline.style.transform = `translateY(${lerp(16, 0, headT)}px)`

      // button is the very last thing to appear
      const ctaT = clamp((progress - 0.95) / 0.05, 0, 1)
      ctaButton.style.opacity = ctaT
      ctaButton.style.transform = `translateY(${lerp(10, 0, ctaT)}px)`
    }

    const onResize = () => {
      resize()
      onScroll()
    }

    resize()
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    rafId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section className={styles.wrapper} ref={wrapperRef} data-section-theme="dark">
      <div className={styles.stage}>
        <canvas ref={canvasRef} className={styles.dotsCanvas} aria-hidden />

        <div ref={sphereSecondaryRef} className={`${styles.sphere} ${styles.sphereSecondary}`} aria-hidden />
        <div ref={sphereMainRef} className={`${styles.sphere} ${styles.sphereMain}`} aria-hidden />

        <img ref={logoMarkRef} className={styles.logoImg} src={LOGO_SRC} alt="ThinkMate" />

        <div className={styles.copy}>
          <h1 ref={titleMainRef} className={styles.titleMain}>
            {t('hero.line1')}
            <br />
            <span className={styles.gradientText}>{t('hero.line2')}</span>
          </h1>

          <p ref={introHeadlineRef} className={styles.introHeadline}>
            {t('hero.tagline')}
          </p>

          <button
            ref={ctaButtonRef}
            type="button"
            className={styles.ctaButton}
            onClick={openContactModal}
          >
            {t('hero.cta')}
          </button>
        </div>
      </div>
    </section>
  )
}

export default IntroHero
