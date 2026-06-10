import { useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Container from '../../components/ui/Container/Container'
import Button from '../../components/ui/Button/Button'
import { work } from '../../data/work'
import styles from './WorkDetail.module.css'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

const WorkDetail = () => {
  const { id } = useParams()
  const heroRef = useRef(null)
  const bodyRef = useRef(null)
  const project = work.find((p) => p.id === id)

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
      '[data-page-meta]',
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.4 }
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
        stagger: 0.12,
        ease: 'power3.out',
      }
    )
  }, { scope: bodyRef })

  if (!project) {
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <section className={styles.notFound}>
          <Container>
            <h1 className={styles.notFoundTitle}>Project not found.</h1>
            <Button variant="ghost" href="/work">← Back to Work</Button>
          </Container>
        </section>
      </motion.div>
    )
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {/* ── Hero ── */}
      <section
        className={styles.hero}
        ref={heroRef}
        style={{ '--project-color': project.color }}
      >
        <div className={styles.heroBg} aria-hidden>
          {project.image
            ? <img src={project.image} alt="" className={styles.heroBgImg} />
            : <div className={styles.heroBgColor} style={{ background: project.color }} />
          }
        </div>
        <div className={styles.heroOverlay} aria-hidden />
        <Container>
          <Link to="/work" className={styles.backLink}>
            ← All Work
          </Link>
          <p className={styles.eyebrow} data-page-eyebrow>
            <span className={styles.eyebrowDot} aria-hidden />
            {project.client}
          </p>
          <h1 className={styles.title} data-page-title>
            {project.title}
          </h1>
          <div className={styles.heroMeta} data-page-meta>
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>Category</span>
              <span className={styles.metaValue}>{project.category}</span>
            </span>
            <span className={styles.metaDivider} aria-hidden />
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>Year</span>
              <span className={styles.metaValue}>{project.year}</span>
            </span>
          </div>
        </Container>
      </section>

      {/* ── Body ── */}
      <section className={styles.bodySection} ref={bodyRef}>
        <Container size="narrow">
          <div className={styles.bodyInner}>
            <p className={styles.description} data-reveal>
              {project.description}
            </p>
            <div className={styles.actions} data-reveal>
              <Button variant="ghost" href="/work">
                ← Back to Work
              </Button>
              <Button variant="primary" href="/contact">
                Work With Us
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Gallery ── */}
      {project.images && project.images.length > 1 && (
        <section className={styles.gallerySection}>
          <Container>
            <p className={styles.galleryLabel}>Project Visuals</p>
            <div className={styles.gallery}>
              {project.images.map((src, i) => (
                <div key={i} className={styles.galleryItem}>
                  <img src={src} alt={`${project.client} — visual ${i + 1}`} className={styles.galleryImg} />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}
    </motion.div>
  )
}

export default WorkDetail
