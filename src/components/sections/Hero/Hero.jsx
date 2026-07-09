import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Container from '../../ui/Container/Container'
import ParticleField from '../../layout/ParticleField/ParticleField'
import HeroReveal from './HeroReveal'
import styles from './Hero.module.css'

const Hero = () => {
  const heroRef = useRef(null)

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
    <section className={styles.hero} ref={heroRef} data-section-theme="dark">
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

      <HeroReveal />
    </section>
  )
}

export default Hero