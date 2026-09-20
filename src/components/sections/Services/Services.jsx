import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'framer-motion'
import Container from '../../ui/Container/Container'
import { useCursor } from '../../../context/CursorContext'
import { useSectionTheme } from '../../../context/SectionThemeContext'
import { useTranslation } from '../../../i18n/useTranslation'
import styles from './Services.module.css'

gsap.registerPlugin(ScrollTrigger)

const backdropVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.3 } },
}

const panelVariants = {
  closed: { opacity: 0, y: 24, scale: 0.98 },
  open: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

const ServiceCard = ({ title, index, onOpen }) => {
  const { setCursor, resetCursor } = useCursor()

  return (
    <div
      className={styles.card}
      onMouseEnter={() => setCursor('hover')}
      onMouseLeave={resetCursor}
    >
      <button type="button" className={styles.cardLink} onClick={() => onOpen(index)}>
        <div className={styles.cardInner}>
          <div className={styles.cardTop}>
            <span className={styles.cardNum}>{String(index + 1).padStart(2, '0')}</span>
            <span className={styles.cardArrow}>↗</span>
          </div>

          <h3 className={styles.cardTitle}>{title}</h3>
        </div>

        <div className={styles.cardBorder} aria-hidden />
      </button>
    </div>
  )
}

const Services = () => {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const theme = useSectionTheme()
  const isLight = theme === 'light'
  const { t } = useTranslation()
  const { setCursor, resetCursor } = useCursor()
  const cards = t('services.cards')
  const cardDetails = t('services.cardDetails')
  const [openIndex, setOpenIndex] = useState(null)
  const isOpen = openIndex !== null

  const closeModal = () => setOpenIndex(null)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

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
    <section
      className={`${styles.services} ${isLight ? styles.themeLight : ''}`}
      ref={sectionRef}
      id="services"
      data-section-theme="dark"
    >
      <div className={styles.sticky}>
        <Container>
          <div className={styles.header}>
            <div className={styles.label}>
              <span className={styles.dots} aria-hidden>
                <span />
                <span />
                <span />
              </span>
              <span>{t('services.label')}</span>
            </div>

            <div className={styles.headingRow}>
              <h2 className={styles.heading}>
                {t('services.headingLine1')}<br />
                <span className={styles.headingAccent}>{t('services.headingAccent')}</span>
              </h2>

              <p className={styles.headingSub}>
                {t('services.sub')}
              </p>
            </div>
          </div>
        </Container>

        <div className={styles.track} ref={trackRef}>
          {cards.map((title, index) => (
            <ServiceCard key={title} title={title} index={index} onOpen={setOpenIndex} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.modalBackdrop}
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={closeModal}
          >
            <motion.div
              className={styles.modalPanel}
              variants={panelVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={cards[openIndex]}
            >
              <button
                type="button"
                className={styles.modalClose}
                onClick={closeModal}
                aria-label="Close"
                onMouseEnter={() => setCursor('hover')}
                onMouseLeave={resetCursor}
              >
                <span aria-hidden>×</span>
              </button>

              <p className={styles.modalEyebrow}>
                <span className={styles.eyebrowDot} aria-hidden />
                {t('services.modalLabel')}
              </p>
              <h3 className={styles.modalTitle}>{cards[openIndex]}</h3>

              <ul className={styles.modalList}>
                {cardDetails[openIndex].map((item) => (
                  <li key={item} className={styles.modalListItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Services
