import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Container from '../../components/ui/Container/Container'
import Button from '../../components/ui/Button/Button'
import { insights } from '../../data/insights'
import styles from './InsightsPage.module.css'

gsap.registerPlugin(ScrollTrigger)

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

const InsightsPage = () => {
  const heroRef = useRef(null)
  const gridRef = useRef(null)
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
      '[data-insight-card]',
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
            Insights
          </p>
          <h1 className={styles.title} data-page-title>
            Ideas worth amplifying.
          </h1>
        </Container>
      </section>

      {/* ── Insights Grid ── */}
      <section className={styles.insightsSection} ref={gridRef}>
        <Container>
          <div className={styles.insightsGrid}>
            {insights.map((insight) => (
              <article key={insight.id} className={styles.insightCard} data-insight-card>
                <div className={styles.cardTop}>
                  <span className={styles.categoryBadge}>{insight.category}</span>
                </div>
                <h2 className={styles.cardTitle}>{insight.title}</h2>
                <p className={styles.cardExcerpt}>{insight.excerpt}</p>
                <div className={styles.cardFooter}>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardDate}>{insight.date}</span>
                    <span className={styles.metaDot} aria-hidden />
                    <span className={styles.cardReadTime}>{insight.readTime}</span>
                  </div>
                  <Link to={`/insights/${insight.id}`} className={styles.readMore}>
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <p className={styles.comingSoon}>More insights coming soon.</p>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection} ref={ctaRef}>
        <div className={styles.ctaOrb} aria-hidden />
        <Container size="narrow">
          <div className={styles.ctaContent}>
            <p className={styles.ctaEyebrow} data-cta-reveal>Work with us</p>
            <h2 className={styles.ctaTitle} data-cta-reveal>
              Ready to amplify your brand?
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

export default InsightsPage
