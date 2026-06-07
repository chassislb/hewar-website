import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import styles from './Preloader.module.css'

const Preloader = ({ onComplete }) => {
  const ref = useRef(null)

  useGSAP(() => {
    const tl = gsap.timeline()

    /* 1 — Logo slides in */
    tl.from('[data-pre-dots] span', {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: 'back.out(2)',
    })
    .from('[data-pre-name]', {
      y: 24,
      opacity: 0,
      duration: 0.6,
      ease: 'power4.out',
    }, '-=0.2')
    .from('[data-pre-tag]', {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
    }, '-=0.1')

    /* 2 — Progress bar fills */
    .to('[data-pre-bar]', {
      width: '100%',
      duration: 1.1,
      ease: 'power3.inOut',
    }, '-=0.1')

    /* 3 — Brief hold */
    .to({}, { duration: 0.15 })

    /* 4 — Content fades */
    .to('[data-pre-content]', {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: 'power2.in',
    })

    /* 5 — Overlay wipes up */
    .to(ref.current, {
      yPercent: -100,
      duration: 0.85,
      ease: 'power4.inOut',
      onComplete,
    })

  }, { scope: ref })

  return (
    <div ref={ref} className={styles.preloader} aria-hidden>
      <div className={styles.content} data-pre-content>
        <div className={styles.logoRow}>
          <span className={styles.dots} data-pre-dots>
            <span /><span /><span />
          </span>
          <span className={styles.name} data-pre-name>
            HEWAR<sup className={styles.sup}>GROUP</sup>
          </span>
        </div>

        <p className={styles.tag} data-pre-tag>
          Think. Create. Communicate.
        </p>

        <div className={styles.track}>
          <div className={styles.bar} data-pre-bar />
        </div>
      </div>
    </div>
  )
}

export default Preloader
