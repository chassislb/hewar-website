import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Container from '../../ui/Container/Container'
import Button from '../../ui/Button/Button'
import ParticleField from '../../layout/ParticleField/ParticleField'
import { useCursor } from '../../../context/CursorContext'
import styles from './CTA.module.css'

gsap.registerPlugin(ScrollTrigger)

const CTA = () => {
  const sectionRef = useRef(null)
  const { setCursor, resetCursor } = useCursor()

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 82%',
      },
    })

    tl.from('[data-cta-line]', {
      y: '110%',
      duration: 0.9,
      stagger: 0.1,
      ease: 'power4.out',
    })
      .from('[data-cta-sub]', {
        opacity: 0,
        y: 18,
        duration: 0.7,
        ease: 'power3.out',
      }, '-=0.45')
      .from('[data-cta-btn]', {
        opacity: 0,
        y: 16,
        duration: 0.65,
        ease: 'power3.out',
      }, '-=0.4')

    gsap.to('[data-cta-orb]', {
      y: -50,
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
    <section className={styles.cta} ref={sectionRef}>
      <ParticleField />

      <div className={styles.bg} aria-hidden>
        <div className={styles.orb1} data-cta-orb />
        <div className={styles.orb2} data-cta-orb />
        <div className={styles.topBorder} />
      </div>

      <Container>
        <div className={styles.content}>
          <div className={styles.eyebrow}>
            <span className={styles.dots} aria-hidden>
              <span />
              <span />
              <span />
            </span>
            <span className={styles.eyebrowText}>Ready to Amplify?</span>
          </div>

          <h2 className={styles.heading}>
            {['Build something people', 'remember.'].map((line, i) => (
              <span key={i} className={styles.lineWrap}>
                <span className={styles.lineInner} data-cta-line>
                  {line}
                </span>
              </span>
            ))}
          </h2>

          <p className={styles.sub} data-cta-sub>
            Whether you are launching a brand, repositioning one, or telling a
            story that deserves attention, let’s start the conversation.
          </p>

          <div className={styles.btns} data-cta-btn>
            <Button
              variant="primary"
              size="md"
              href="/contact"
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={resetCursor}
            >
              Let’s Talk
            </Button>

            <Button
              variant="ghost"
              size="md"
              href="/work"
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={resetCursor}
            >
              See Our Work
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default CTA