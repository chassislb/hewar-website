import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Container from '../../ui/Container/Container'
import Button from '../../ui/Button/Button'
import { insights } from '../../../data/insights'
import { useCursor } from '../../../context/CursorContext'
import { useTranslation } from '../../../i18n/useTranslation'
import styles from './Insights.module.css'

const InsightCard = ({ article, index, language, readArticleLabel }) => {
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
      <div className={styles.cardLink}>
        <div className={styles.cardTop}>
          <span className={styles.category}>{article.category[language]}</span>
          <span className={styles.readTime}>{article.publication}</span>
        </div>

        <Link to={`/insights/${article.id}`}>
          <h3 className={styles.title}>{article.title[language]}</h3>
        </Link>
        <p className={styles.excerpt}>{article.excerpt[language]}</p>

        <div className={styles.cardBottom}>
          <span className={styles.date}>{article.author} · {article.year}</span>
          <a
            href={article.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.arrow}
          >
            {readArticleLabel} ↗
          </a>
        </div>
      </div>
    </motion.article>
  )
}

const Insights = () => {
  const { t, language } = useTranslation()

  return (
    <section className={styles.insights} id="insights" data-section-theme="dark">
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
            <span>{t('insights.label')}</span>
          </div>
          <div className={styles.headingRow}>
            <h2 className={styles.heading}>{t('insights.heading')}</h2>
            <Button variant="text" href="/insights">{t('insights.viewAll')}</Button>
          </div>
        </motion.div>

        {/* Cards */}
        <div className={styles.grid}>
          {insights.map((article, i) => (
            <InsightCard
              key={article.id}
              article={article}
              index={i}
              language={language}
              readArticleLabel={t('insights.readArticle')}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}

export default Insights
