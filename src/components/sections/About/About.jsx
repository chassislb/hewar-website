import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Container from '../../ui/Container/Container'
import styles from './About.module.css'

gsap.registerPlugin(ScrollTrigger)

const VALUES = [
  { id: '01', label: 'Growth',       desc: 'We scale with every client we serve.' },
  { id: '02', label: 'Methodology',  desc: 'Strategy before execution, always.' },
  { id: '03', label: 'Innovation',   desc: 'New thinking for changing markets.' },
  { id: '04', label: 'Creativity',   desc: 'Ideas that earn attention and trust.' },
]

const PILLARS = ['Expertise', 'Integrity', 'Excellence', 'Dedication']

const About = () => {
  const sectionRef = useRef(null)

  useGSAP(() => {
    /* Left column — headline lines slide up */
    gsap.from('[data-about-line]', {
      y: '110%',
      duration: 1.1,
      stagger: 0.12,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
      },
    })

    /* Right column — stagger in */
    gsap.from('[data-about-right] > *', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '[data-about-right]',
        start: 'top 82%',
      },
    })

    /* Value cards */
    gsap.from('[data-value-card]', {
      opacity: 0,
      y: 24,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '[data-value-card]',
        start: 'top 85%',
      },
    })

    /* Decorative orb parallax */
    gsap.to('[data-about-orb]', {
      y: -60,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      },
    })
  }, { scope: sectionRef })

  return (
    <section className={styles.about} ref={sectionRef} id="about">
      <div className={styles.orb} data-about-orb aria-hidden />

      <Container>
        <div className={styles.grid}>

          {/* ── Left — Editorial headline ── */}
          <div className={styles.left}>
            <div className={styles.label}>
              <span className={styles.dots} aria-hidden>
                <span /><span /><span />
              </span>
              <span>About HEWAR</span>
            </div>

            <h2 className={styles.heading}>
              {[
                'Born from the',
                'belief that every',
                'brand has something',
                'worth saying.',
              ].map((line, i) => (
                <span key={i} className={styles.lineWrap}>
                  <span className={styles.lineInner} data-about-line>{line}</span>
                </span>
              ))}
            </h2>

            {/* Brand pillars as a horizontal strip */}
            <div className={styles.pillars}>
              {PILLARS.map((p) => (
                <span key={p} className={styles.pillar}>{p}</span>
              ))}
            </div>
          </div>

          {/* ── Right — Story + Values ── */}
          <div className={styles.right} data-about-right>
            <p className={styles.story}>
              HEWAR — حوار — means <em>dialogue</em> in Arabic. It's not a
              metaphor. It's our operating principle. We believe the best
              communication is never one-directional. It listens as much as it
              speaks, and earns attention rather than demanding it.
            </p>
            <p className={styles.story}>
              Founded in Saudi Arabia with 12+ years in the market, we craft
              bespoke communication solutions for partners from the public and
              private sectors across diverse industries. From Riyadh to Beirut —
              we bring the same discipline and creative intensity to every
              engagement.
            </p>

            {/* Core values grid */}
            <div className={styles.valuesGrid}>
              {VALUES.map((v) => (
                <div key={v.id} className={styles.valueCard} data-value-card>
                  <span className={styles.valueNum}>{v.id}</span>
                  <span className={styles.valueLabel}>{v.label}</span>
                  <span className={styles.valueDesc}>{v.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default About
