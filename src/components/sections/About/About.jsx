import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Container from '../../ui/Container/Container'
import styles from './About.module.css'

gsap.registerPlugin(ScrollTrigger)

const MOVING_WORDS = [
  'Expertise',
  'Integrity',
  'Excellence',
  'Dedication',
  'Growth',
  'Methodology',
  'Innovation',
  'Creativity',
]

const About = () => {
  const sectionRef = useRef(null)

  useGSAP(() => {
    gsap.fromTo(
      '[data-about-line]',
      { y: '110%' },
      {
        y: '0%',
        duration: 1.1,
        stagger: 0.12,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      }
    )

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
          <div className={styles.left}>
            <div className={styles.label}>
              <span className={styles.dots} aria-hidden>
                <span />
                <span />
                <span />
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
                  <span className={styles.lineInner} data-about-line>
                    {line}
                  </span>
                </span>
              ))}
            </h2>
          </div>

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
              private sectors across diverse industries. Built for the MENA
              region, we read the room before we shape the message — culture,
              timing, stakeholders, and public conversation included.
            </p>
          </div>
        </div>

        <div className={styles.diagonalWrap} aria-hidden>
          <div className={styles.diagonalTrack}>
            {[...MOVING_WORDS, ...MOVING_WORDS, ...MOVING_WORDS].map((word, i) => (
              <span key={`${word}-${i}`} className={styles.movingWord}>
                {word}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default About