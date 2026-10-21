import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Container from '../../components/ui/Container/Container'
import Button from '../../components/ui/Button/Button'
import InsightArt from '../../components/insights/InsightArt'
import { useReveal } from '../../components/insights/useReveal'
import { insights } from '../../data/insights'
import { useLanguage } from '../../context/LanguageContext'
import { useContactModal } from '../../context/ContactModalContext'
import { useCursor } from '../../context/CursorContext'
import { useTranslation } from '../../i18n/useTranslation'
import styles from './InsightsPage.module.css'

gsap.registerPlugin(ScrollTrigger)

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

const pad = (n) => String(n).padStart(2, '0')

/* newest first; the featured piece (flagged, else newest) leads the page */
const sorted = [...insights].sort((a, b) => Number(b.year) - Number(a.year))
const lead = sorted.find((i) => i.featured) ?? sorted[0]
const rest = sorted.filter((i) => i !== lead)
const categories = [...new Map(rest.map((i) => [i.category.en, i.category])).entries()]

const Card = ({ item, index, language }) => {
  const [ref, shown] = useReveal()
  const { setCursor, resetCursor } = useCursor()

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <Link
      ref={ref}
      to={`/insights/${item.id}`}
      className={`${styles.card} ${shown ? styles.in : ''} ${index % 5 === 0 ? styles.wide : ''}`}
      style={{ '--i': index % 6 }}
      onPointerMove={onMove}
      onMouseEnter={() => setCursor('hover')}
      onMouseLeave={resetCursor}
    >
      <span className={styles.spot} aria-hidden />
      <InsightArt id={item.id} image={item.image} className={styles.cardArt} />
      <span className={styles.cardChip}>{item.category[language]}</span>
      <span className={styles.cardNum} aria-hidden>{pad(index + 1)}</span>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{item.title[language]}</h3>
        <p className={styles.cardExcerpt}>{item.excerpt[language]}</p>
        <div className={styles.cardMeta}>
          <span>{item.author}</span>
          <i aria-hidden />
          <span>{item.publication} · {item.year}</span>
          <span className={styles.arrow} aria-hidden>↗</span>
        </div>
      </div>
    </Link>
  )
}

const InsightsPage = () => {
  const { language } = useLanguage()
  const { t } = useTranslation()
  const { openContactModal } = useContactModal()
  const { setCursor, resetCursor } = useCursor()

  const pageRef = useRef(null)
  const heroRef = useRef(null)
  const featRef = useRef(null)
  const tiltRef = useRef(null)

  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')

  const heroLines = t('insightsPage.headingLines')
  const tickerWords = t('insightsPage.ticker')

  const needle = q.trim().toLowerCase()
  const list = rest.filter((i) => {
    if (cat !== 'all' && i.category.en !== cat) return false
    if (!needle) return true
    return [i.title[language], i.excerpt[language], i.author, i.publication]
      .join(' ')
      .toLowerCase()
      .includes(needle)
  })

  const onTilt = (e) => {
    const el = tiltRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.setProperty('--rx', `${((0.5 - py) * 9).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${((px - 0.5) * 11).toFixed(2)}deg`)
    el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`)
    el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`)
  }
  const resetTilt = () => {
    const el = tiltRef.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
    el.style.setProperty('--gx', '50%')
    el.style.setProperty('--gy', '50%')
  }

  useGSAP(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      gsap.set('[data-line]', { yPercent: 0 })
      return
    }
    gsap.fromTo('[data-line]', { yPercent: 115 }, { yPercent: 0, duration: 1.1, stagger: 0.13, ease: 'power4.out', delay: 0.15 })
    gsap.fromTo('[data-fade]', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.55 })
    gsap.to('[data-watermark]', {
      xPercent: -14,
      ease: 'none',
      scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
    })
    gsap.fromTo('[data-feat-cover]', { scale: 0.9, y: 70, rotate: -2 }, {
      scale: 1, y: 0, rotate: 0, ease: 'none',
      scrollTrigger: { trigger: featRef.current, start: 'top 88%', end: 'top 30%', scrub: true },
    })
    gsap.fromTo('[data-feat-copy] > *', { y: 36, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: featRef.current, start: 'top 72%' },
    })
  }, { scope: pageRef })

  const feat = lead
  const showFilters = rest.length >= 2

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" ref={pageRef}>
      {/* ── Hero ── */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.glow} aria-hidden />
        <span className={styles.watermark} data-watermark aria-hidden>{t('insightsPage.eyebrow')}</span>
        <Container>
          <p className={styles.eyebrow} data-fade>
            <span className={styles.dot} aria-hidden />
            {t('insightsPage.eyebrow')}
          </p>
          <h1 className={styles.title}>
            {heroLines.map((line) => (
              <span key={line} className={styles.lineWrap}>
                <span className={styles.lineInner} data-line>{line}</span>
              </span>
            ))}
          </h1>
          <p className={styles.sub} data-fade>{t('insightsPage.sub')}</p>
        </Container>
      </section>

      {/* ── Featured ── */}
      <section className={styles.featured} ref={featRef}>
        <Container>
          <p className={styles.tag}>
            <span className={styles.dot} aria-hidden />
            {t('insightsPage.featured')}
          </p>
          <div className={styles.featGrid}>
            <div className={styles.featCopy} data-feat-copy>
              <span className={styles.chip}>{feat.category[language]}</span>
              <h2 className={styles.featTitle}>
                <Link
                  to={`/insights/${feat.id}`}
                  onMouseEnter={() => setCursor('hover')}
                  onMouseLeave={resetCursor}
                >
                  {feat.title[language]}
                </Link>
              </h2>
              <p className={styles.featExcerpt}>{feat.excerpt[language]}</p>
              <div className={styles.featMeta}>
                <span className={styles.byline}>
                  <b>{feat.author}</b>
                  <em>{feat.role[language]}</em>
                </span>
                <span className={styles.pub}>{feat.publication} · {feat.year}</span>
              </div>
              <div className={styles.featActions}>
                <Button variant="primary" href={`/insights/${feat.id}`}>
                  {t('insightsPage.readPiece')}
                </Button>
                <a
                  className={styles.outLink}
                  href={feat.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setCursor('hover')}
                  onMouseLeave={resetCursor}
                >
                  {t('insightsPage.readOn')} {feat.publication} <span aria-hidden>↗</span>
                </a>
              </div>
            </div>

            <div className={styles.featCover} data-feat-cover>
              <div
                className={styles.tilt}
                ref={tiltRef}
                onPointerMove={onTilt}
                onPointerLeave={resetTilt}
              >
                <Link
                  to={`/insights/${feat.id}`}
                  className={styles.coverLink}
                  aria-label={feat.title[language]}
                  onMouseEnter={() => setCursor('hover')}
                  onMouseLeave={resetCursor}
                >
                  <InsightArt id={feat.id} image={feat.image} className={styles.coverArt} />
                  <span className={styles.glare} aria-hidden />
                  <span className={styles.coverBadge}>{feat.publication}</span>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Topic ticker ── */}
      <div className={styles.ticker} aria-hidden>
        <div className={styles.track}>
          {[0, 1].map((g) => (
            <div className={styles.group} key={g}>
              {tickerWords.map((w) => (
                <span key={w} className={styles.tickWord}>
                  {w}
                  <i />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Library ── */}
      <section className={styles.library}>
        <Container>
          <div className={styles.libHead}>
            <h2 className={styles.libTitle}>{t('insightsPage.libraryTitle')}</h2>
          </div>

          {showFilters && (
            <div className={styles.filters}>
              <div className={styles.chips} role="group">
                <button
                  type="button"
                  className={`${styles.fChip} ${cat === 'all' ? styles.fOn : ''}`}
                  onClick={() => setCat('all')}
                  aria-pressed={cat === 'all'}
                  onMouseEnter={() => setCursor('hover')}
                  onMouseLeave={resetCursor}
                >
                  {t('insightsPage.all')}
                </button>
                {categories.map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    className={`${styles.fChip} ${cat === key ? styles.fOn : ''}`}
                    onClick={() => setCat(key)}
                    aria-pressed={cat === key}
                    onMouseEnter={() => setCursor('hover')}
                    onMouseLeave={resetCursor}
                  >
                    {label[language]}
                  </button>
                ))}
              </div>
              <label className={styles.search}>
                <span aria-hidden>⌕</span>
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t('insightsPage.search')}
                  aria-label={t('insightsPage.search')}
                />
              </label>
            </div>
          )}

          {rest.length === 0 ? (
            <div className={styles.soon}>
              <span className={styles.soonPulse} aria-hidden />
              <div>
                <h3>{t('insightsPage.soonTitle')}</h3>
                <p>{t('insightsPage.soonBody')}</p>
              </div>
              <Button variant="ghost" onClick={openContactModal}>
                {t('insightsPage.soonCta')}
              </Button>
            </div>
          ) : list.length === 0 ? (
            <p className={styles.none}>{t('insightsPage.noResults')}</p>
          ) : (
            <div className={styles.grid}>
              {list.map((item, i) => (
                <Card key={`${cat}|${needle}|${item.id}`} item={item} index={i} language={language} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* ── Closing call ── */}
      <section className={styles.cta}>
        <Container>
          <h2>{t('insightsPage.ctaTitle')}</h2>
          <p>{t('insightsPage.ctaBody')}</p>
          <Button variant="primary" onClick={openContactModal}>
            {t('footer.hewarUs')}
          </Button>
        </Container>
      </section>
    </motion.div>
  )
}

export default InsightsPage
