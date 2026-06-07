import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Container from '../../ui/Container/Container'
import Button from '../../ui/Button/Button'
import { useCursor } from '../../../context/CursorContext'
import styles from './Hero.module.css'

gsap.registerPlugin()

const HEADLINE_LINES = ['We Shape the Way', 'Ideas Reach', 'the World.']

const Hero = () => {
  const heroRef               = useRef(null)
  const { setCursor, resetCursor } = useCursor()

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.4 })

    /* Orbs drift in */
    tl.from('[data-hero-orb]', {
      scale: 0.3,
      opacity: 0,
      duration: 2.5,
      stagger: 0.25,
      ease: 'power2.out',
    })

    /* Eyebrow */
    .from('[data-hero-eyebrow]', {
      opacity: 0,
      y: 16,
      duration: 0.7,
      ease: 'power3.out',
    }, '-=2')

    /* Headline lines — slide up from behind mask */
    .from('[data-hero-line]', {
      y: '115%',
      duration: 1.2,
      stagger: 0.14,
      ease: 'power4.out',
    }, '-=0.5')

    /* Subtext */
    .from('[data-hero-sub]', {
      opacity: 0,
      y: 28,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.7')

    /* CTAs */
    .from('[data-hero-cta]', {
      opacity: 0,
      y: 20,
      duration: 0.7,
      ease: 'power3.out',
    }, '-=0.5')

    /* Scroll indicator */
    .from('[data-hero-scroll]', {
      opacity: 0,
      duration: 0.6,
    }, '-=0.3')

  }, { scope: heroRef })

  return (
    <section className={styles.hero} ref={heroRef}>
      {/* ── Background depth layers ── */}
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

          {/* Eyebrow — 3-dot motif + brand tagline */}
          <div className={styles.eyebrow} data-hero-eyebrow>
            <span className={styles.dots} aria-hidden>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </span>
            <span className={styles.eyebrowText}>Think. Create. Communicate.</span>
          </div>

          {/* Headline */}
          <h1 className={styles.headline}>
            {HEADLINE_LINES.map((line, i) => (
              <span key={i} className={styles.lineWrap}>
                <span className={styles.lineInner} data-hero-line>
                  {i === 2
                    ? <>{line.slice(0, -1)}<span className={styles.period}>.</span></>
                    : line}
                </span>
              </span>
            ))}
          </h1>

          {/* Sub-descriptor */}
          <p className={styles.sub} data-hero-sub>
            HEWAR Group is Saudi Arabia's premier communication and innovation company —
            where strategy, creativity, and technology converge to drive lasting impact.
          </p>

          {/* CTAs */}
          <div className={styles.ctas} data-hero-cta>
            <Button
              variant="primary"
              size="lg"
              href="/work"
              onMouseEnter={() => setCursor('view', 'Explore')}
              onMouseLeave={resetCursor}
            >
              Explore Our Work
            </Button>
            <Button
              variant="ghost"
              size="lg"
              href="/contact"
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={resetCursor}
            >
              Get in Touch
            </Button>
          </div>
        </div>
      </Container>

      {/* ── Scroll indicator ── */}
      <div className={styles.scrollIndicator} data-hero-scroll aria-hidden>
        <div className={styles.scrollLine} />
        <span className={styles.scrollLabel}>Scroll</span>
      </div>

      {/* ── Bottom gradient fade ── */}
      <div className={styles.bottomFade} aria-hidden />
    </section>
  )
}

export default Hero
