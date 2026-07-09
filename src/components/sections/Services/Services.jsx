import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Container from '../../ui/Container/Container'
import { services } from '../../../data/services'
import { useCursor } from '../../../context/CursorContext'
import styles from './Services.module.css'

gsap.registerPlugin(ScrollTrigger)

const ServiceCard = ({ service }) => {
  const { setCursor, resetCursor } = useCursor()

  return (
    <div
      className={styles.card}
      onMouseEnter={() => setCursor('hover')}
      onMouseLeave={resetCursor}
    >
      <div className={styles.cardInner}>
        <div className={styles.cardTop}>
          <span className={styles.cardNum}>{service.id}</span>
          <span className={styles.cardArrow}>↗</span>
        </div>

        <h3 className={styles.cardTitle}>{service.title}</h3>
        <p className={styles.cardDesc}>{service.description}</p>

        <div className={styles.cardTags}>
          {service.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.cardBorder} aria-hidden />
    </div>
  )
}

const Services = () => {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 769px)', () => {
      let timeline
      let trigger

      const setup = () => {
        const travel = Math.max(0, trackRef.current.scrollWidth - window.innerWidth)

        const startPause = window.innerHeight * 0.45
        const scrollDistance = Math.max(travel * 1.8, window.innerHeight * 1.5)
        const endPause = window.innerHeight * 1.15

        const totalDistance = startPause + scrollDistance + endPause

        sectionRef.current.style.minHeight = `calc(100vh + ${totalDistance}px)`

        timeline?.kill()
        trigger?.kill()

        timeline = gsap.timeline({ paused: true })

        timeline
          .to(trackRef.current, {
            x: 0,
            duration: startPause,
            ease: 'none',
          })
          .to(trackRef.current, {
            x: -travel,
            duration: scrollDistance,
            ease: 'none',
          })
          .to(trackRef.current, {
            x: -travel,
            duration: endPause,
            ease: 'none',
          })

        trigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          animation: timeline,
          invalidateOnRefresh: true,
        })
      }

      setup()

      window.addEventListener('resize', setup)
      ScrollTrigger.refresh()

      return () => {
        window.removeEventListener('resize', setup)
        timeline?.kill()
        trigger?.kill()
      }
    })

    return () => mm.revert()
  }, { scope: sectionRef })

  return (
    <section className={styles.services} ref={sectionRef} id="services" data-section-theme="dark">
      <div className={styles.sticky}>
        <Container>
          <div className={styles.header}>
            <div className={styles.label}>
              <span className={styles.dots} aria-hidden>
                <span />
                <span />
                <span />
              </span>
              <span>Our Services</span>
            </div>

            <div className={styles.headingRow}>
              <h2 className={styles.heading}>
                Everything a modern brand needs —<br />
                <span className={styles.headingAccent}>amplified.</span>
              </h2>

              <p className={styles.headingSub}>
                Seven disciplines. One team. Zero compromise.
              </p>
            </div>
          </div>
        </Container>

        <div className={styles.track} ref={trackRef}>
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services