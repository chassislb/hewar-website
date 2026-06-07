import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Container from '../../ui/Container/Container'
import Button from '../../ui/Button/Button'
import { insights } from '../../../data/insights'
import { useCursor } from '../../../context/CursorContext'
import styles from './Insights.module.css'

const InsightCard = ({ article, index }) => {
  const { setCursor, resetCursor } = useCursor()

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setCursor('read', 'Read')}
      onMouseLeave={resetCursor}
    >
      <Link to={`/insights/${article.id}`} className={styles.cardLink}>
        <div className={styles.cardTop}>
          <span className={styles.category}>{article.category}</span>
          <span className={styles.readTime}>{article.readTime}</span>
        </div>

        <h3 className={styles.title}>{article.title}</h3>
        <p className={styles.excerpt}>{article.excerpt}</p>

        <div className={styles.cardBottom}>
          <span className={styles.date}>{article.date}</span>
          <span className={styles.arrow}>→</span>
        </div>
      </Link>
    </motion.article>
  )
}

const Insights = () => (
  <section className={styles.insights} id="insights">
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
          <span>Latest Thinking</span>
        </div>
        <div className={styles.headingRow}>
          <h2 className={styles.heading}>Ideas Worth Reading</h2>
          <Button variant="text" href="/insights">View All Insights</Button>
        </div>
      </motion.div>

      {/* Cards */}
      <div className={styles.grid}>
        {insights.map((article, i) => (
          <InsightCard key={article.id} article={article} index={i} />
        ))}
      </div>
    </Container>
  </section>
)

export default Insights
