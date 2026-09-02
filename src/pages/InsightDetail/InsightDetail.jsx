import { useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Container from '../../components/ui/Container/Container'
import Button from '../../components/ui/Button/Button'
import { insights } from '../../data/insights'
import { useLanguage } from '../../context/LanguageContext'
import styles from './InsightDetail.module.css'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

const InsightDetail = () => {
  const { language } = useLanguage()
  const { id } = useParams()
  const heroRef = useRef(null)
  const insight = insights.find((i) => i.id === id)

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

  if (!insight) {
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <section className={styles.notFound}>
          <Container>
            <h1 className={styles.notFoundTitle}>Insight not found.</h1>
            <Button variant="ghost" href="/insights">← Back to Insights</Button>
          </Container>
        </section>
      </motion.div>
    )
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroOrb} style={{ top: '-30%', right: '-15%', background: 'radial-gradient(circle, rgba(71,0,179,0.4) 0%, transparent 70%)', width: 'clamp(400px,60vw,900px)', height: 'clamp(400px,60vw,900px)' }} aria-hidden />
        <Container size="narrow">
          <Link to="/insights" className={styles.backLink}>← All Insights</Link>
          <div className={styles.categoryBadge} data-page-eyebrow>{insight.category[language]}</div>
          <h1 className={styles.title} data-page-title>{insight.title[language]}</h1>
          <div className={styles.meta} data-page-sub>
            <span>{insight.author}</span>
            <span className={styles.metaDot} aria-hidden />
            <span>{insight.role[language]}</span>
            <span className={styles.metaDot} aria-hidden />
            <span>{insight.publication} · {insight.year}</span>
          </div>
          <p className={styles.excerpt}>{insight.excerpt[language]}</p>
          <div className={styles.comingSoonBox}>
            <p className={styles.comingSoonText}>
              This piece was written for external publication. Read the full
              article on {insight.publication}.
            </p>
            <div className={styles.detailActions}>
              <Button variant="primary" href={insight.externalUrl} external>
                Read Full Article
              </Button>
              <Button variant="ghost" href="/insights">← Back to Insights</Button>
            </div>
          </div>
        </Container>
      </section>
    </motion.div>
  )
}

export default InsightDetail
