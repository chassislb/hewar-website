import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Container from '../../components/ui/Container/Container'
import CareersWhy from '../../components/sections/CareersWhy/CareersWhy'
import CareersApply from '../../components/sections/CareersApply/CareersApply'
import SoundToggle from '../../components/sections/CareersSound/SoundToggle'
import { useTranslation } from '../../i18n/useTranslation'
import styles from './CareersPage.module.css'

gsap.registerPlugin(ScrollTrigger)

const VIDEO_SRC = '/hewar-website/videos/careers-hero.mp4'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

const CareersPage = () => {
  const { t } = useTranslation()

  const heroRef = useRef(null)
  const heroVideoRef = useRef(null)

  useEffect(() => {
    const video = heroVideoRef.current
    if (!video) return
    video.muted = true
    video.play().catch(() => {})
  }, [])

  useGSAP(() => {
    gsap.fromTo('[data-page-eyebrow]', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 })
    gsap.fromTo('[data-page-title]', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.2 })
  }, { scope: heroRef })

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {/* ── Hero ── */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroVideoBg} aria-hidden>
          <video ref={heroVideoRef} className={styles.heroVideo} src={VIDEO_SRC} autoPlay muted loop playsInline />
        </div>
        <div className={styles.heroVideoOverlay} aria-hidden />
        <Container>
          <h1 className={styles.title} data-page-title>{t('careersPage.heroTitle')}</h1>
          <p className={styles.heroSub} data-page-eyebrow>{t('careersPage.heroTagline')}</p>
        </Container>
      </section>

      <CareersWhy />
      <CareersApply />
      <SoundToggle />
    </motion.div>
  )
}

export default CareersPage
