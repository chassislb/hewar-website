import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Container from '../../ui/Container/Container'
import styles from './Methodology.module.css'

gsap.registerPlugin(ScrollTrigger)

const PILLARS = [
  {
    label: 'Think Smarter',
    items: ['Insight', 'Strategy', 'Culture', 'Data'],
  },
  {
    label: 'Create Faster',
    items: ['AI-assisted ideation', 'Design', 'Production'],
  },
  {
    label: 'Communicate Better',
    items: ['PR', 'Social', 'Campaigns', 'Reputation'],
  },
]

const Methodology = () => {
  const sectionRef = useRef(null)

  useGSAP(() => {
    gsap.from('[data-method-card]', {
      opacity: 0,
      y: 40,
      duration: 0.9,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
      },
    })
    gsap.from('[data-method-head]', {
      opacity: 0,
      y: 24,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
      },
    })
  }, { scope: sectionRef })

  return (
    <section className={styles.methodology} ref={sectionRef}>
      <Container>
        <div className={styles.head} data-method-head>
          <div className={styles.eyebrow}>
            <span className={styles.dot} aria-hidden />
            <span className={styles.eyebrowText}>Methodology</span>
          </div>
          <h2 className={styles.title}>
            Think Smarter. Create Faster.{' '}
            <span className={styles.accent}>Communicate Better.</span>
          </h2>
        </div>

        <div className={styles.grid}>
          {PILLARS.map((pillar) => (
            <div key={pillar.label} className={styles.card} data-method-card>
              <div className={styles.bars} aria-hidden>
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={styles.bar} style={{ animationDelay: `${i * 0.18}s` }} />
                ))}
              </div>
              <h3 className={styles.cardTitle}>{pillar.label}</h3>
              <ul className={styles.list}>
                {pillar.items.map((item) => (
                  <li key={item} className={styles.item}>
                    <span className={styles.bullet} aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default Methodology
