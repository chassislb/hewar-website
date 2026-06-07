import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Container from '../../ui/Container/Container'
import styles from './AISection.module.css'

gsap.registerPlugin(ScrollTrigger)

const AISection = () => {
  const sectionRef = useRef(null)

  useGSAP(() => {
    gsap.from('[data-ai-card]', {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 78%',
      },
    })
  }, { scope: sectionRef })

  return (
    <section className={styles.aiSection} ref={sectionRef}>
      <Container>
        <div className={styles.card} data-ai-card>
          <div className={styles.glow} aria-hidden />
          <div className={styles.content}>
            <h2 className={styles.heading}>
              AI is not the idea.
              <br />
              <span className={styles.accent}>It is the amplifier.</span>
            </h2>
            <p className={styles.body}>
              Human strategy remains the source. Human creativity remains the driver.
              AI expands the possibilities, accelerates production, and helps brands
              move with sharper intelligence.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default AISection
