import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Container from '../../components/ui/Container/Container'
import { work } from '../../data/work'
import { useLanguage } from '../../context/LanguageContext'
import { useTranslation } from '../../i18n/useTranslation'
import styles from './WorkPage.module.css'

gsap.registerPlugin(ScrollTrigger)

const SHOWREEL_SRC = {
  en: '/hewar-website/videos/work-showreel-en.mp4',
  ar: '/hewar-website/videos/work-showreel-ar.mp4',
}

/* Matches the fixed order of workPage.industries in translations.js */
const INDUSTRY_ICONS = [
  'telecommunications-technology.png',
  'government-public-services.png',
  'financial-economic-development.png',
  'transportation-logistics.png',
  'tourism-culture-hospitality.png',
  'energy-environmental-sustainability.png',
  'research-education.png',
  'health-medical-sector.png',
  'real-estate-infrastructure.png',
]

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

const WorkPage = () => {
  const { language } = useLanguage()
  const { t } = useTranslation()
  const industries = t('workPage.industries')
  const heroRef = useRef(null)
  const gridRef = useRef(null)
  const industriesRef = useRef(null)
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

  useGSAP(() => {
    gsap.fromTo(
      '[data-work-card]',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 82%' },
      }
    )
  }, { scope: gridRef })

  useGSAP(() => {
    gsap.fromTo(
      '[data-industry-item]',
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: { trigger: industriesRef.current, start: 'top 82%' },
      }
    )
  }, { scope: industriesRef })

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

      {/* ── Work Grid ── */}
      <section className={styles.workSection} ref={gridRef}>
        <Container>
          <div className={styles.workGrid}>
            {work.map((project, index) => (
              <Link
                key={project.id}
                to={`/work/${project.id}`}
                className={styles.workCard}
                data-work-card
                style={{ '--card-color': project.color }}
              >
                {project.video?.short ? (
                  <video
                    className={styles.cardBg}
                    src={project.video.short}
                    autoPlay
                    muted
                    loop
                    playsInline
                    aria-hidden
                  />
                ) : project.image ? (
                  <img
                    className={styles.cardBg}
                    src={project.image}
                    alt=""
                    aria-hidden
                  />
                ) : (
                  <div className={styles.cardBg} style={{ background: project.color }} />
                )}
                <div className={styles.cardGradient} aria-hidden />
                <div className={styles.cardContent}>
                  <span className={styles.cardNumber}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className={styles.cardMeta}>
                    {project.logo ? (
                      <img className={styles.cardLogo} src={project.logo} alt={project.client} />
                    ) : (
                      <span className={styles.cardClient}>{project.client}</span>
                    )}
                  </div>
                  <h2 className={styles.cardTitle}>{project.title[language]}</h2>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardCategory}>{project.category[language]}</span>
                    <span className={styles.cardYear}>{project.year}</span>
                  </div>
                </div>
                <div className={styles.cardOverlay}>
                  <span className={styles.viewLabel}>View Project ↗</span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Industries We Empower ── */}
      <section className={styles.industriesSection} ref={industriesRef}>
        <Container>
          <p className={styles.sectionEyebrow}>{t('workPage.industriesLabel')}</p>
          <div className={styles.industriesGrid}>
            {industries.map((industry, i) => (
              <div key={industry} className={styles.industryItem} data-industry-item>
                <img
                  className={styles.industryIcon}
                  src={`${import.meta.env.BASE_URL}images/industries/${INDUSTRY_ICONS[i]}`}
                  alt=""
                  aria-hidden
                />
                {industry}
              </div>
            ))}
          </div>
        </Container>
      </section>
    </motion.div>
  )
}

export default WorkPage
