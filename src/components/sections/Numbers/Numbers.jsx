import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Container from '../../ui/Container/Container'
import { numbers } from '../../../data/numbers'
import styles from './Numbers.module.css'

gsap.registerPlugin(ScrollTrigger)

const StatItem = ({ stat }) => {
  return (
    <div className={styles.stat}>
      <div className={styles.statValue}>
        <span className={styles.statNum} data-stat-number data-value={stat.value}>
          0
        </span>
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
    const numberEls = gsap.utils.toArray('[data-stat-number]')
    const statEls = gsap.utils.toArray('[data-stat]')

    const resetNumbers = () => {
      numberEls.forEach((el) => {
        el.textContent = '0'
      })
    }

    const animateNumbers = () => {
      numberEls.forEach((el) => {
        const endValue = Number(el.dataset.value)
        const counter = { value: 0 }

        gsap.to(counter, {
          value: endValue,
          duration: 2.2,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = Math.round(counter.value)
          },
        })
      })
    }

    const introTween = gsap.fromTo(
      statEls,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: 'power4.out',
        paused: true,
      }
    )

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 80%',
      end: 'bottom 20%',

      onEnter: () => {
        resetNumbers()
        introTween.restart()
        animateNumbers()
      },

      onEnterBack: () => {
        resetNumbers()
        introTween.restart()
        animateNumbers()
      },

      onLeave: resetNumbers,
      onLeaveBack: resetNumbers,
    })

    return () => {
      trigger.kill()
      introTween.kill()
    }
  }, { scope: sectionRef })

  return (
    <section className={styles.numbers} ref={sectionRef}>
      <div className={styles.orb} aria-hidden />

      <Container>
        <div className={styles.grid}>
          {numbers.map((stat) => (
            <div key={stat.label} data-stat>
              <StatItem stat={stat} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default Numbers