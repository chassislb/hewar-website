import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Container from '../../ui/Container/Container'
import Button from '../../ui/Button/Button'
import { useCursor } from '../../../context/CursorContext'
import styles from './Hero.module.css'

const HEADLINE = ['Human Intelligence.', 'Amplified.']

const Hero = () => {
  const heroRef                    = useRef(null)
  const { setCursor, resetCursor } = useCursor()

  useGSAP(() => {
    /* Preloader runs ~2s on first visit; skip it on return visits */
    const preloaderSeen = sessionStorage.getItem('hewar-loaded') === 'true'
    const tl = gsap.timeline({ delay: preloaderSeen ? 0.15 : 2.0 })

    /* Orbs drift in from invisible */
    tl.from('[data-hero-orb]', {
      scale: 0.4, opacity: 0,
      duration: 2.8, stagger: 0.3, ease: 'power2.out',
    })

    /* Eyebrow */
    .from('[data-hero-eyebrow]', {
      opacity: 0, y: 18,
      duration: 0.7, ease: 'power3.out',
    }, '-=2.2')

    /* Headline — line masks */
    .from('[data-hero-line]', {
      y: '115%',
      duration: 1.2, stagger: 0.13, ease: 'power4.out',
    }, '-=0.5')

    /* Descriptor */
    .from('[data-hero-sub]', {
      opacity: 0, y: 28,
      duration: 0.85, ease: 'power3.out',
    }, '-=0.75')

    /* CTAs */
    .from('[data-hero-cta]', {
      opacity: 0, y: 20,
      duration: 0.7, ease: 'power3.out',
    }, '-=0.55')

    /* Scroll hint */
    .from('[data-hero-scroll]', {
      opacity: 0, duration: 0.5,
    }, '-=0.3')

    /* Subtle parallax on scroll */
    gsap.to('[data-hero-headline]', {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
    })

    gsap.to('[data-hero-orb]', {
      yPercent: 30,
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

      {/* ── Depth layers ── */}
      <div className={styles.bg} aria-hidden>
        <div className={styles.orb1} data-hero-orb />
        <div className={styles.orb2} data-hero-orb />
        <div className={styles.orb3} data-hero-orb />
        <div className={styles.grid} />
        <div className={styles.vignette} />
      </div>

      {/* ── Content ── */}
      <Container className={styles.container}>
        <div className={styles.content}>

          {/* Eyebrow */}
          <div className={styles.eyebrow} data-hero-eyebrow>
            <span className={styles.dots} aria-hidden>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </span>
            <span className={styles.eyebrowText}>Riyadh · Marketing · PR · Creative</span>
          </div>

          {/* Headline */}
          <h1 className={styles.headline} data-hero-headline>
            {HEADLINE.map((line, i) => (
              <span key={i} className={styles.lineWrap}>
                <span className={styles.lineInner} data-hero-line>
                  {i === 1
                    ? <><span className={styles.period}>{line}</span></>
                    : line}
                </span>
              </span>
            ))}
          </h1>

          {/* Sub */}
          <p className={styles.sub} data-hero-sub>
            A creative, PR and marketing agency using AI to amplify ideas,
            influence and impact.
          </p>

          {/* CTAs */}
          <div className={styles.ctas} data-hero-cta>
            <Button
              variant="primary" size="lg" href="/contact"
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={resetCursor}
            >
              Amplify Your Brand
            </Button>
            <Button
              variant="ghost" size="lg" href="/work"
              onMouseEnter={() => setCursor('view', 'View')}
              onMouseLeave={resetCursor}
            >
              See Our Work
            </Button>
          </div>
        </div>
      </Container>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator} data-hero-scroll aria-hidden>
        <div className={styles.scrollLine} />
        <span className={styles.scrollLabel}>Scroll</span>
      </div>

      {/* Bottom fade into next section */}
      <div className={styles.bottomFade} aria-hidden />
    </section>
  )
}

export default Hero
