import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Container from '../../ui/Container/Container'
import Button from '../../ui/Button/Button'
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
        start: 'top 75%',
      },
    })

    tl.from('[data-cta-line]', {
      y: '110%',
      duration: 1.1,
      stagger: 0.12,
      ease: 'power4.out',
    })
    .from('[data-cta-sub]', {
      opacity: 0,
      y: 25,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.6')
    .from('[data-cta-btn]', {
      opacity: 0,
      y: 20,
      duration: 0.7,
      ease: 'power3.out',
    }, '-=0.5')

    /* Orb parallax */
    gsap.to('[data-cta-orb]', {
      y: -100,
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
      {/* Background */}
      <div className={styles.bg} aria-hidden>
        <div className={styles.orb1} data-cta-orb />
        <div className={styles.orb2} data-cta-orb />
        <div className={styles.topBorder} />
      </div>

      <Container size="narrow">
        <div className={styles.content}>
          {/* 3-dot motif */}
          <div className={styles.eyebrow}>
            <span className={styles.dots} aria-hidden>
              <span /><span /><span />
            </span>
            <span className={styles.eyebrowText}>Ready to Begin?</span>
          </div>

          {/* Headline */}
          <h2 className={styles.heading}>
            {["Let's Build", "Something", "Worth Remembering."].map((line, i) => (
              <span key={i} className={styles.lineWrap}>
                <span className={styles.lineInner} data-cta-line>
                  {line}
                </span>
              </span>
            ))}
          </h2>

          {/* Sub */}
          <p className={styles.sub} data-cta-sub>
            Whether you're launching, repositioning, or scaling — HEWAR Group is ready
            to think, create, and communicate alongside you.
          </p>

          {/* Buttons */}
          <div className={styles.btns} data-cta-btn>
            <Button
              variant="primary"
              size="lg"
              href="/contact"
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={resetCursor}
            >
              Start a Conversation
            </Button>
            <Button
              variant="ghost"
              size="lg"
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
