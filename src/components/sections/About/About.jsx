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
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-about-line]',
        { y: '110%' },
        {
          y: '0%',
          duration: 1,
          stagger: 0.1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 76%',
          },
        }
      )

      gsap.fromTo(
        '[data-about-story]',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 68%',
          },
        }
      )

      gsap.to('[data-about-orb]', {
        y: -70,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className={styles.about} ref={sectionRef} id="about">
      <div className={styles.orb} data-about-orb aria-hidden />
      <div className={styles.gridGlow} aria-hidden />

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
                'brand has',
                'something',
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

          <div className={styles.right}>
            <div className={styles.storyBlock}>
              <p className={styles.story} data-about-story>
                HEWAR — حوار — means <em>dialogue</em> in Arabic. It is not a
                metaphor. It is our operating principle. We believe the best
                communication is never one-directional. It listens as much as it
                speaks, and earns attention rather than demanding it.
              </p>

              <p className={styles.story} data-about-story>
                Founded in Saudi Arabia with 12+ years in the market, we craft
                bespoke communication solutions for partners from the public and
                private sectors across diverse industries. Built for the MENA
                region, we read the room before we shape the message — culture,
                timing, stakeholders, and public conversation included.
              </p>
            </div>
          </div>
        </div>
      </Container>

      <div className={styles.wordWave} aria-hidden>
        <div className={styles.wordTrack}>
          {[...MOVING_WORDS, ...MOVING_WORDS].map((word, i) => (
            <span key={`${word}-${i}`} className={`${styles.word} ${styles[`word${i + 1}`]}`}>
              {word}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About