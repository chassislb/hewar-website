import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Container from '../../components/ui/Container/Container'
import Button from '../../components/ui/Button/Button'
import styles from './About.module.css'

gsap.registerPlugin(ScrollTrigger)

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

const methodPillars = [
  {
    title: 'Think Smarter',
    items: ['Insight', 'Strategy', 'Culture', 'Data'],
  },
  {
    title: 'Create Faster',
    items: ['AI-assisted ideation', 'Design', 'Production'],
  },
  {
    title: 'Communicate Better',
    items: ['PR', 'Social', 'Campaigns', 'Reputation'],
  },
]

const values = [
  {
    title: 'Growth',
    body: 'We grow with our partners — measuring success by the impact we create together.',
  },
  {
    title: 'Methodology',
    body: 'Every idea is built on a strategic foundation, not guesswork.',
  },
  {
    title: 'Innovation',
    body: 'We lead with curiosity, embracing AI and new tools to stay ahead.',
  },
  {
    title: 'Creativity',
    body: 'Bold ideas, beautifully executed — always in service of the message.',
  },
]

const About = () => {
  const heroRef = useRef(null)
  const storyRef = useRef(null)
  const valuesRef = useRef(null)
  const ctaRef = useRef(null)

  useGSAP(() => {
    gsap.fromTo(
      '[data-page-title]',
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
    )
    gsap.fromTo(
      '[data-page-eyebrow]',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.15 }
    )
    gsap.fromTo(
      '[data-page-sub]',
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.35 }
    )
  }, { scope: heroRef })

  useGSAP(() => {
    gsap.fromTo(
      '[data-reveal]',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: storyRef.current, start: 'top 82%' },
      }
    )
  }, { scope: storyRef })

  useGSAP(() => {
    gsap.fromTo(
      '[data-value-card]',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: valuesRef.current, start: 'top 82%' },
      }
    )
  }, { scope: valuesRef })

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
            About HEWAR
          </p>
          <h1 className={styles.title} data-page-title>
            Born from the belief that every brand has something worth saying.
          </h1>
          <p className={styles.heroSub} data-page-sub>
            HEWAR — حوار — means dialogue in Arabic. We believe the best
            communication listens as much as it speaks.
          </p>
        </Container>
      </section>

      {/* ── Story + Method ── */}
      <section className={styles.story} ref={storyRef}>
        <Container>
          <div className={styles.storyGrid}>
            {/* Left: Story */}
            <div className={styles.storyLeft} data-reveal>
              <p className={styles.storyLabel}>Our Story</p>
              <p className={styles.storyText}>
                HEWAR — حوار — means dialogue in Arabic. We believe the best
                communication listens as much as it speaks. Founded in Saudi Arabia
                with 12+ years in the market, serving partners across the public
                and private sectors.
              </p>
              <div className={styles.statsRow}>
                <div className={styles.stat}>
                  <span className={styles.statNumber}>12+</span>
                  <span className={styles.statLabel}>Years in Market</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.stat}>
                  <span className={styles.statNumber}>2</span>
                  <span className={styles.statLabel}>Offices: Riyadh + Beirut</span>
                </div>
              </div>
              <p className={styles.offices}>Riyadh. Beirut.</p>
            </div>

            {/* Right: Method pillars */}
            <div className={styles.methodPillars} data-reveal>
              <p className={styles.storyLabel}>Our Method</p>
              {methodPillars.map((pillar) => (
                <div key={pillar.title} className={styles.pillarCard}>
                  <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                  <ul className={styles.pillarList}>
                    {pillar.items.map((item) => (
                      <li key={item} className={styles.pillarItem}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Values ── */}
      <section className={styles.valuesSection} ref={valuesRef}>
        <Container>
          <p className={styles.sectionEyebrow}>What We Stand For</p>
          <h2 className={styles.sectionTitle}>Our values.</h2>
          <div className={styles.valuesGrid}>
            {values.map((v) => (
              <div key={v.title} className={styles.valueCard} data-value-card>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueBody}>{v.body}</p>
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
            <p className={styles.ctaEyebrow} data-cta-reveal>Ready to amplify your brand?</p>
            <h2 className={styles.ctaTitle} data-cta-reveal>
              Start a Conversation.
            </h2>
            <div data-cta-reveal>
              <Button variant="primary" size="lg" href="/contact">
                Start a Conversation
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </motion.div>
  )
}

export default About
