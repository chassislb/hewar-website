import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Container from '../../ui/Container/Container'
import Button from '../../ui/Button/Button'
import { work } from '../../../data/work'
import { useCursor } from '../../../context/CursorContext'
import styles from './Work.module.css'

const WorkCard = ({ project, large }) => {
  const { setCursor, resetCursor } = useCursor()

  return (
    <motion.div
      className={`${styles.card} ${large ? styles.cardLarge : styles.cardSmall}`}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setCursor('view', 'View')}
      onMouseLeave={resetCursor}
    >
      <Link to={`/work/${project.id}`} className={styles.cardLink}>
        {/* Visual block */}
        <div
          className={styles.visual}
          style={{ '--card-color': project.color }}
        >
          {/* Gradient orb inside visual */}
          <div className={styles.visualOrb} />
          <div className={styles.visualGrid} />

          {/* Hover overlay */}
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className={styles.overlayBtn}>View Project ↗</span>
          </motion.div>
        </div>

        {/* Meta */}
        <div className={styles.meta}>
          <div className={styles.metaLeft}>
            <span className={styles.client}>{project.client}</span>
            <h3 className={styles.title}>{project.title}</h3>
          </div>
          <div className={styles.metaRight}>
            <span className={styles.category}>{project.category}</span>
            <span className={styles.year}>{project.year}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

const Work = () => {
  const large  = work.find((p) => p.size === 'large')
  const smalls = work.filter((p) => p.size === 'small')

  return (
    <section className={styles.work} id="work">
      <Container>
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.label}>
            <span className={styles.dots} aria-hidden><span /><span /><span /></span>
            <span>Selected Work</span>
          </div>
          <h2 className={styles.heading}>Where Strategy<br />Meets Impact</h2>
        </motion.div>

        {/* Layout */}
        <div className={styles.grid}>
          {large && <WorkCard project={large} large />}
          <div className={styles.smallCol}>
            {smalls.map((p) => (
              <WorkCard key={p.id} project={p} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          className={styles.footerCta}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button variant="ghost" href="/work">View All Work</Button>
        </motion.div>
      </Container>
    </section>
  )
}

export default Work
