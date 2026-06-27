import { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Container from '../../ui/Container/Container'
import ParticleField from '../../layout/ParticleField/ParticleField'
import styles from './Hero.module.css'

const VIDEO_SRC = '/hewar-website/videos/amplified.mp4'

const Hero = () => {
  const heroRef = useRef(null)
  const videoRef = useRef(null)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.playbackRate = 0.75
    video.muted = true
    video.play().catch(() => {})
  }, [])

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    const nextMuted = !video.muted
    video.muted = nextMuted
    setMuted(nextMuted)

    if (!nextMuted) {
      video.play().catch(() => {})
    }
  }

  useGSAP(() => {
    const preloaderSeen = sessionStorage.getItem('hewar-loaded') === 'true'
    const tl = gsap.timeline({ delay: preloaderSeen ? 0.1 : 2.0 })

    tl.fromTo(
      '[data-hero-orb]',
      { scale: 0.4, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2.8, stagger: 0.3, ease: 'power2.out' }
    )
      .fromTo(
        '[data-hero-line]',
        { y: '115%' },
        { y: '0%', duration: 1.2, stagger: 0.13, ease: 'power4.out' },
        '-=1.8'
      )
      .fromTo(
        '[data-hero-sub]',
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' },
        '-=0.65'
      )

    gsap.to('[data-hero-headline]', {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
    })

    gsap.to('[data-hero-orb]', {
      yPercent: 22,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 2,
      },
    })
  }, { scope: heroRef })

  return (
    <section className={styles.hero} ref={heroRef}>
      <div className={styles.heroIntro}>
        <ParticleField />

        <div className={styles.bg} aria-hidden>
          <div className={styles.orb1} data-hero-orb />
          <div className={styles.orb2} data-hero-orb />
          <div className={styles.orb3} data-hero-orb />
          <div className={styles.grid} />
          <div className={styles.vignette} />
        </div>

        <Container className={styles.container}>
          <div className={styles.content}>
            <h1 className={styles.headline} data-hero-headline>
              <span className={styles.lineWrap}>
                <span className={styles.lineInner} data-hero-line>
                  Human Intelligence.
                </span>
              </span>

              <span className={styles.lineWrap}>
                <span className={styles.lineInner} data-hero-line>
                  <span className={styles.gradientText}>Amplified.</span>
                </span>
              </span>
            </h1>

            <p className={styles.sub} data-hero-sub>
              A creative, PR and marketing agency using AI to amplify ideas,
              influence and impact.
            </p>
          </div>
        </Container>
      </div>

      <div className={styles.videoSection}>
        <div className={styles.videoStars} aria-hidden>
          <div className={styles.videoGlow} />
        </div>

        <video
          ref={videoRef}
          className={styles.heroVideo}
          autoPlay
          muted
          playsInline
          preload="auto"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>

        <div className={styles.videoOverlay} aria-hidden />

        <button
          type="button"
          className={styles.soundButton}
          onClick={toggleMute}
          aria-label={muted ? 'Turn sound on' : 'Mute video'}
        >
          {muted ? 'Sound On' : 'Mute'}
        </button>
      </div>
    </section>
  )
}

export default Hero