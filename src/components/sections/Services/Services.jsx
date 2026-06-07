import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import Container from '../../ui/Container/Container'
import Button from '../../ui/Button/Button'
import { services } from '../../../data/services'
import { useCursor } from '../../../context/CursorContext'
import styles from './Services.module.css'

gsap.registerPlugin(ScrollTrigger)

const ServiceCard = ({ service, index }) => {
  const { setCursor, resetCursor } = useCursor()

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover="hover"
      onMouseEnter={() => setCursor('hover')}
      onMouseLeave={resetCursor}
    >
      <div className={styles.cardInner}>
        <div className={styles.cardTop}>
          <span className={styles.cardNum}>{service.id}</span>
          <motion.div
            className={styles.cardArrow}
            variants={{ hover: { x: 4, y: -4 } }}
            transition={{ duration: 0.3 }}
          >
            ↗
          </motion.div>
        </div>

        <h3 className={styles.cardTitle}>{service.title}</h3>
        <p className={styles.cardDesc}>{service.description}</p>

        <div className={styles.cardTags}>
          {service.tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Hover glow border */}
      <motion.div
        className={styles.cardBorder}
        variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
        transition={{ duration: 0.3 }}
        aria-hidden
      />
    </motion.article>
  )
}

const Services = () => {
  const sectionRef = useRef(null)

  useGSAP(() => {
    gsap.from('[data-services-heading]', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: '[data-services-heading]',
        start: 'top 85%',
      },
    })
  }, { scope: sectionRef })

  return (
    <section className={styles.services} ref={sectionRef} id="services">
      <Container>
        {/* Header */}
        <div className={styles.header} data-services-heading>
          <div className={styles.label}>
            <span className={styles.dots} aria-hidden>
              <span /><span /><span />
            </span>
            <span>What We Do</span>
          </div>

          <div className={styles.headingRow}>
            <h2 className={styles.heading}>Our Services</h2>
            <p className={styles.headingSub}>
              Twelve integrated disciplines — from public relations and events to digital
              media and financial communication — unified by one commitment: making every
              partner's voice impossible to ignore.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

        {/* Footer CTA */}
        <div className={styles.footerCta}>
          <Button variant="ghost" href="/services">
            View All Services
          </Button>
        </div>
      </Container>
    </section>
  )
}

export default Services
