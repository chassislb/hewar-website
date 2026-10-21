import { useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Container from '../../components/ui/Container/Container'
import Button from '../../components/ui/Button/Button'
import InsightArt from '../../components/insights/InsightArt'
import { insights } from '../../data/insights'
import { useLanguage } from '../../context/LanguageContext'
import { useCursor } from '../../context/CursorContext'
import { useTranslation } from '../../i18n/useTranslation'
import styles from './InsightDetail.module.css'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

const wordsIn = (blocks) =>
  blocks.reduce((n, b) => n + (typeof b === 'string' ? b : b.h || b.quote || '').split(/\s+/).filter(Boolean).length, 0)

const InsightDetail = () => {
  const { language } = useLanguage()
  const { t } = useTranslation()
  const { setCursor, resetCursor } = useCursor()
  const { id } = useParams()
  const pageRef = useRef(null)

  const index = insights.findIndex((i) => i.id === id)
  const insight = insights[index]
  const bodyFallback = Boolean(insight?.body) && !insight.body[language]
  const body = insight?.body?.[language] ?? insight?.body?.en
  const minutes = body ? Math.max(1, Math.round(wordsIn(body) / 200)) : null
  const next = insights.length > 1 ? insights[(index + 1) % insights.length] : null
  const prev = insights.length > 2 ? insights[(index - 1 + insights.length) % insights.length] : null

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.fromTo('[data-line]', { yPercent: 115 }, { yPercent: 0, duration: 1, stagger: 0.1, ease: 'power4.out', delay: 0.1 })
    gsap.fromTo('[data-fade]', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.4 })
  }, { scope: pageRef, dependencies: [id] })

  if (!insight) {
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <section className={styles.notFound}>
          <Container>
            <h1 className={styles.notFoundTitle}>{t('insightsPage.notFound')}</h1>
            <Button variant="ghost" href="/insights">{t('insightsPage.backAll')}</Button>
          </Container>
        </section>
      </motion.div>
    )
  }

  const title = insight.title[language]

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" ref={pageRef}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <InsightArt id={insight.id} image={insight.image} className={styles.heroArt} />
        <div className={styles.heroFade} aria-hidden />
        <Container size="narrow">
          <Link
            to="/insights"
            className={styles.back}
            data-fade
            onMouseEnter={() => setCursor('hover')}
            onMouseLeave={resetCursor}
          >
            <span aria-hidden>←</span> {t('insightsPage.back')}
          </Link>
          <span className={styles.chip} data-fade>{insight.category[language]}</span>
          <h1 className={styles.title}>
            <span className={styles.lineWrap}>
              <span className={styles.lineInner} data-line>{title}</span>
            </span>
          </h1>

          <dl className={styles.facts} data-fade>
            <div>
              <dt>{t('insightsPage.by')}</dt>
              <dd>{insight.author}<em>{insight.role[language]}</em></dd>
            </div>
            <div>
              <dt>{t('insightsPage.publishedIn')}</dt>
              <dd>{insight.publication}<em>{insight.year}</em></dd>
            </div>
            {minutes && (
              <div>
                <dt>{language === 'ar' ? 'القراءة' : 'Read'}</dt>
                <dd>{minutes} {t('insightsPage.minRead')}</dd>
              </div>
            )}
          </dl>
        </Container>
      </section>

      {/* ── Reading ── */}
      <section className={styles.reading}>
        <Container size="narrow">
          {body ? (
            <article className={styles.article} {...(bodyFallback ? { lang: 'en', dir: 'ltr' } : {})}>
              {body.map((block, i) => {
                if (typeof block === 'string') return <p key={i}>{block}</p>
                if (block.h) return <h2 key={i}>{block.h}</h2>
                if (block.quote) return <blockquote key={i}>{block.quote}</blockquote>
                return null
              })}
            </article>
          ) : (
            <div className={styles.bridge}>
              <span className={styles.bigMark} aria-hidden>“</span>
              <p className={styles.lead}>{insight.excerpt[language]}</p>
              <p className={styles.note}>
                {t('insightsPage.firstPublished')} {insight.publication}. {t('insightsPage.fullArticle')}
              </p>
            </div>
          )}

          <div className={styles.actions}>
            <Button variant="primary" href={insight.externalUrl} external>
              {body ? `${t('insightsPage.readOn')} ${insight.publication}` : t('insightsPage.readFull')}
            </Button>
            <Button variant="ghost" href="/insights">{t('insightsPage.backAll')}</Button>
          </div>
        </Container>
      </section>

      {/* ── Keep reading ── */}
      {next && (
        <section className={styles.more}>
          <Container>
            <div className={`${styles.moreGrid} ${prev ? styles.two : ''}`}>
              {[prev && { item: prev, label: t('insightsPage.previous') }, { item: next, label: t('insightsPage.next') }]
                .filter(Boolean)
                .map(({ item, label }) => (
                  <Link
                    key={item.id}
                    to={`/insights/${item.id}`}
                    className={styles.moreCard}
                    onMouseEnter={() => setCursor('hover')}
                    onMouseLeave={resetCursor}
                  >
                    <InsightArt id={item.id} image={item.image} className={styles.moreArt} />
                    <span className={styles.moreLabel}>{label} <i aria-hidden>→</i></span>
                    <span className={styles.moreTitle}>{item.title[language]}</span>
                  </Link>
                ))}
            </div>
          </Container>
        </section>
      )}
    </motion.div>
  )
}

export default InsightDetail
