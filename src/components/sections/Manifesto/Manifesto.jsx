import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Container from '../../ui/Container/Container'
import styles from './Manifesto.module.css'

gsap.registerPlugin(ScrollTrigger)

const WORDS = ['Creativity', 'was', 'never', 'the', 'challenge.', 'Amplification', 'is.']

const Manifesto = () => {
  const sectionRef = useRef(null)

  useGSAP(() => {
    const words = sectionRef.current.querySelectorAll('[data-word]')

    /* Words reveal on scroll — each word brightens from dim */
    gsap.from(words, {
      opacity: 0.12,
      duration: 0.6,
      stagger: 0.06,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        end: 'bottom 60%',
        toggleActions: 'play none none reverse',
      },
    })

    /* Gradient orb parallax */
    gsap.to('[data-manifesto-orb]', {
      y: -80,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    })

  }, { scope: sectionRef })

  return (
    <section className={styles.manifesto} ref={sectionRef}>
      {/* Background orb */}
      <div className={styles.orb} data-manifesto-orb aria-hidden />
      <div className={styles.line} aria-hidden />

      <Container size="narrow">
        <p className={styles.statement} aria-label="We don't just tell your story — we shape how the world receives it.">
          {WORDS.map((word, i) => (
            <span key={i} className={styles.wordWrap}>
              <span className={styles.word} data-word>
                {word === '—' ? <span className={styles.dash}>{word}</span> : word}
              </span>
              {i < WORDS.length - 1 && ' '}
            </span>
          ))}
        </p>

        <p className={styles.body}>
          Today, every brand can create content. Few can create influence.{' '}
          <strong>HEWAR helps brands turn ideas into movements, campaigns into
          conversations, and attention into measurable impact.</strong>
        </p>

        <div className={styles.meta}>
          <span className={styles.dots} aria-hidden>
            <span /><span /><span />
          </span>
          <span className={styles.metaText}>HEWAR Group · Saudi Arabia</span>
        </div>
      </Container>
    </section>
  )
}

export default Manifesto
