import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Container from '../../components/ui/Container/Container'
import AwardsUnveiling from '../../components/sections/AwardsUnveiling/AwardsUnveiling'
import { useTranslation } from '../../i18n/useTranslation'
import styles from './About.module.css'

gsap.registerPlugin(ScrollTrigger)

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

const About = () => {
  const { t } = useTranslation()

  const heroRef = useRef(null)
  const pillarsRef = useRef(null)
  const valuesRef = useRef(null)
  const teamRef = useRef(null)

  const values = t('aboutPage.values')
  const team = t('aboutPage.team')

  /* Hero entrance */
  useGSAP(() => {
    gsap.fromTo('[data-page-eyebrow]', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.15 })
    gsap.fromTo('[data-page-title]',   { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1,   ease: 'power4.out', delay: 0.05 })
    gsap.fromTo('[data-page-sub]',     { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.35 })
  }, { scope: heroRef })

  /* Mission / Vision — big editorial blocks */
  useGSAP(() => {
    gsap.fromTo('[data-pillar]',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.18, ease: 'power3.out',
        scrollTrigger: { trigger: pillarsRef.current, start: 'top 78%' } }
    )
  }, { scope: pillarsRef })

  /* Values — numbered list rows */
  useGSAP(() => {
    gsap.fromTo('[data-value-row]',
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: valuesRef.current, start: 'top 78%' } }
    )
  }, { scope: valuesRef })

  /* Team */
  useGSAP(() => {
    gsap.fromTo('[data-team-card]',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: teamRef.current, start: 'top 80%' } }
    )
  }, { scope: teamRef })

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">

      {/* ── Hero — Who We Are ── */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroOrb} style={{ top: '-30%', right: '-15%', background: 'radial-gradient(circle, rgba(71,0,179,0.4) 0%, transparent 70%)', width: 'clamp(400px,60vw,900px)', height: 'clamp(400px,60vw,900px)' }} aria-hidden />
        <div className={styles.heroOrb} style={{ bottom: '-10%', left: '-8%', background: 'radial-gradient(circle, rgba(0,200,255,0.25) 0%, transparent 70%)', width: 'clamp(250px,40vw,600px)', height: 'clamp(250px,40vw,600px)' }} aria-hidden />
        <Container>
          <p className={styles.eyebrow} data-page-eyebrow>
            <span className={styles.eyebrowDot} aria-hidden />
            {t('common.tagline')}
          </p>
          <h1 className={styles.title} data-page-title>
            {t('aboutPage.heroTitle')}
          </h1>
          <p className={styles.heroSub} data-page-sub>
            {t('aboutPage.heroBody')}
          </p>
        </Container>
      </section>

      {/* ── Mission / Vision — big numbered editorial blocks ── */}
      <section className={styles.pillars} ref={pillarsRef}>
        <Container>
          <div className={styles.pillarsGrid}>
            <div className={styles.pillarBlock} data-pillar>
              <span className={styles.pillarNum}>01</span>
              <h2 className={styles.pillarHeading}>{t('aboutPage.missionLabel')}</h2>
              <p className={styles.pillarBody}>{t('aboutPage.missionBody')}</p>
            </div>
            <div className={styles.pillarBlock} data-pillar>
              <span className={styles.pillarNum}>02</span>
              <h2 className={styles.pillarHeading}>{t('aboutPage.visionLabel')}</h2>
              <p className={styles.pillarBody}>{t('aboutPage.visionBody')}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Values — numbered list ── */}
      <section className={styles.valuesSection} ref={valuesRef}>
        <Container>
          <h2 className={styles.valuesTitle}>{t('aboutPage.valuesLabel')}</h2>
          <div className={styles.valuesList}>
            {values.map((value, i) => (
              <div key={value} className={styles.valueRow} data-value-row>
                <span className={styles.valueRowNum}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.valueRowTitle}>{value}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Team — The Minds Behind Hewar ── */}
      <section className={styles.teamSection} ref={teamRef}>
        <Container>
          <p className={styles.sectionEyebrow}>{t('aboutPage.teamLabel')}</p>
          <div className={styles.teamGrid}>
            {team.map((member) => (
              <div key={member.name} className={styles.teamCard} data-team-card>
                <img
                  className={styles.teamPhoto}
                  src={`${import.meta.env.BASE_URL}images/team/${member.photo}`}
                  alt={member.name}
                />
                <div className={styles.teamCardOverlay} aria-hidden />
                <div className={styles.teamCardContent}>
                  <h3 className={styles.teamName}>{member.name}</h3>
                  <p className={styles.teamTitle}>{member.title}</p>
                  <p className={styles.teamQuote}>&ldquo;{member.quote}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <AwardsUnveiling />

    </motion.div>
  )
}

export default About
