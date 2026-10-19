import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Container from '../../components/ui/Container/Container'
import WorkSpace from '../../components/sections/WorkSpace/WorkSpace'
import IndustriesIndex from '../../components/sections/IndustriesIndex/IndustriesIndex'
import { useLanguage } from '../../context/LanguageContext'
import styles from './WorkPage.module.css'

gsap.registerPlugin(ScrollTrigger)

const SHOWREEL_SRC = {
  en: '/hewar-website/videos/work-showreel-en.mp4',
  ar: '/hewar-website/videos/work-showreel-ar.mp4',
}


const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

const WorkPage = () => {
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
    gsap.fromTo(
      '[data-page-sub]',
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.4 }
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
            src={SHOWREEL_SRC[language]}
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
            Selected Work
          </p>
          <h1 className={styles.title} data-page-title>
            Human insight, amplified into impact.
          </h1>
          <p className={styles.heroSub} data-page-sub>
            A selection of campaigns, identities, and experiences we've created
            for partners across Saudi Arabia and the region.
          </p>
        </Container>
      </section>

      {/* ── Projects: 3D space you fly through ── */}
      <WorkSpace />

      {/* ── Industries We Empower: typographic index ── */}
      <IndustriesIndex />
    </motion.div>
  )
}

export default WorkPage
