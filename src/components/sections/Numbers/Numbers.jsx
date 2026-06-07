import { useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Container from '../../ui/Container/Container'
import { numbers } from '../../../data/numbers'
import { revealCounter } from '../../../animations/gsap/reveal'
import styles from './Numbers.module.css'

gsap.registerPlugin(ScrollTrigger)

const StatItem = ({ stat, index }) => {
  const numRef = useRef(null)

  useEffect(() => {
    if (!numRef.current) return
    const tween = revealCounter(numRef.current, stat.value, {
      suffix: stat.suffix,
      start: 'top 80%',
      duration: 2.2,
    })
    return () => {
      tween?.scrollTrigger?.kill()
      tween?.kill()
    }
  }, [stat.value, stat.suffix])

  return (
    <div className={styles.stat}>
      <div className={styles.statValue}>
        <span ref={numRef} className={styles.statNum}>0</span>
        <span className={styles.statSuffix}>{stat.suffix}</span>
      </div>
      <div className={styles.statMeta}>
        <span className={styles.statLabel}>{stat.label}</span>
        <span className={styles.statDesc}>{stat.description}</span>
      </div>
    </div>
  )
}

const Numbers = () => {
  const sectionRef = useRef(null)

  useGSAP(() => {
    gsap.from('[data-stat]', {
      opacity: 0,
      y: 40,
      stagger: 0.12,
      duration: 0.9,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
      },
    })
  }, { scope: sectionRef })

  return (
    <section className={styles.numbers} ref={sectionRef}>
      <div className={styles.orb} aria-hidden />

      <Container>
        <div className={styles.grid}>
          {numbers.map((stat, i) => (
            <div key={stat.label} data-stat>
              <StatItem stat={stat} index={i} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default Numbers
