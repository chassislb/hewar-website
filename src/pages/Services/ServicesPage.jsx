import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Container from '../../components/ui/Container/Container'
import Button from '../../components/ui/Button/Button'
import { services } from '../../data/services'
import { useLanguage } from '../../context/LanguageContext'
import styles from './ServicesPage.module.css'

gsap.registerPlugin(ScrollTrigger)

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

const processSteps = [
  {
    number: '01',
    title: 'Discover',
    description:
      'We begin by listening. Deep research, stakeholder interviews, and cultural analysis give us the intelligence to make every creative decision a strategic one.',
  },
  {
    number: '02',
    title: 'Create',
    description:
      'Strategy unlocked, our creative and production teams get to work — fast. AI-assisted ideation means we explore more directions, more quickly, without sacrificing quality.',
  },
  {
    number: '03',
    title: 'Amplify',
    description:
      'The right message, to the right audience, through the right channels. PR, social, campaigns, and earned media work together to drive real-world impact.',
  },
]

const ServicesPage = () => {
  const { language } = useLanguage()
  const heroRef = useRef(null)
  const listRef = useRef(null)
  const processRef = useRef(null)
  const ctaRef = useRef(null)

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

  useGSAP(() => {
    gsap.fromTo(
      '[data-service-row]',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: { trigger: listRef.current, start: 'top 82%' },
      }
    )
  }, { scope: listRef })

  useGSAP(() => {
    gsap.fromTo(
      '[data-step]',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: processRef.current, start: 'top 82%' },
      }
    )
  }, { scope: processRef })

  useGSAP(() => {
    gsap.fromTo(
      '[data-cta-reveal]',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: ctaRef.current, start: 'top 85%' },
      }
    )
  }, { scope: ctaRef })

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {/* ── Hero ── */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroOrb} style={{ top: '-30%', right: '-15%', background: 'radial-gradient(circle, rgba(71,0,179,0.4) 0%, transparent 70%)', width: 'clamp(400px,60vw,900px)', height: 'clamp(400px,60vw,900px)' }} aria-hidden />
        <div className={styles.heroOrb} style={{ bottom: '-10%', left: '-8%', background: 'radial-gradient(circle, rgba(0,200,255,0.25) 0%, transparent 70%)', width: 'clamp(250px,40vw,600px)', height: 'clamp(250px,40vw,600px)' }} aria-hidden />
        <Container>
          <p className={styles.eyebrow} data-page-eyebrow>
            <span className={styles.eyebrowDot} aria-hidden />
            Our Services
          </p>
          <h1 className={styles.title} data-page-title>
            Everything a modern brand needs — amplified.
          </h1>
        </Container>
      </section>

      {/* ── Services List ── */}
      <section className={styles.servicesList} ref={listRef}>
        <Container>
          <div className={styles.listInner}>
            {services.map((service) => (
              <div key={service.id} className={styles.serviceRow} data-service-row>
                <span className={styles.serviceNumber}>{service.id}</span>
                <div className={styles.serviceContent}>
                  <h2 className={styles.serviceTitle}>{service.title[language]}</h2>
                  <p className={styles.serviceDesc}>{service.description[language]}</p>
                </div>
                <div className={styles.serviceTags}>
                  {service.tags[language].map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Process ── */}
      <section className={styles.processSection} ref={processRef}>
        <Container>
          <div className={styles.processHeader}>
            <p className={styles.sectionEyebrow}>How We Work</p>
            <h2 className={styles.sectionTitle}>The HEWAR Method.</h2>
          </div>
          <div className={styles.processGrid}>
            {processSteps.map((step) => (
              <div key={step.number} className={styles.stepCard} data-step>
                <span className={styles.stepNumber}>{step.number}</span>
                <h3 className={styles.stepTitle}>
                  {step.number} — {step.title}
                </h3>
                <p className={styles.stepDesc}>{step.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection} ref={ctaRef}>
        <div className={styles.ctaOrb} aria-hidden />
        <Container size="narrow">
          <div className={styles.ctaContent}>
            <p className={styles.ctaEyebrow} data-cta-reveal>Ready to start?</p>
            <h2 className={styles.ctaTitle} data-cta-reveal>
              Amplify Your Brand.
            </h2>
            <div data-cta-reveal>
              <Button variant="primary" size="lg" href="/contact">
                Start a Project
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </motion.div>
  )
}

export default ServicesPage
