import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Container from '../../components/ui/Container/Container'
import ServicePosters from '../../components/sections/ServicePosters/ServicePosters'
import { useTranslation } from '../../i18n/useTranslation'
import { useLanguage } from '../../context/LanguageContext'
import styles from './ServicesPage.module.css'

gsap.registerPlugin(ScrollTrigger)

const VIDEO_SRC = {
  en: '/hewar-website/videos/services-en.mp4',
  ar: '/hewar-website/videos/services-ar.mp4',
}

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

const ServicesPage = () => {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const heroRef = useRef(null)
  const heroVideoRef = useRef(null)

  useEffect(() => {
    const video = heroVideoRef.current
    if (!video) return
    video.muted = true
    video.play().catch(() => {})
  }, [language])

  useGSAP(() => {
    gsap.fromTo(
      '[data-page-eyebrow]',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 }
    )
    gsap.fromTo(
      '[data-page-title]',
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.2 }
    )
  }, { scope: heroRef })

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {/* ── Hero ── */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroVideoBg} aria-hidden>
          <video
            key={language}
            ref={heroVideoRef}
            className={styles.heroVideo}
            src={VIDEO_SRC[language]}
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
        <div className={styles.heroVideoOverlay} aria-hidden />
        <Container>
          <p className={styles.eyebrow} data-page-eyebrow>
            <span className={styles.eyebrowDot} aria-hidden />
            {t('services.label')}
          </p>
          <h1 className={styles.title} data-page-title>
            {t('services.headingLine1')} {t('services.headingAccent')}
          </h1>
        </Container>
      </section>

      {/* ── Services: scroll-driven poster cards ── */}
      <ServicePosters />
    </motion.div>
  )
}

export default ServicesPage
