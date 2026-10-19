import { useCallback, useEffect, useRef, useState } from 'react'
import Container from '../../ui/Container/Container'
import { useTranslation } from '../../../i18n/useTranslation'
import { useCursor } from '../../../context/CursorContext'
import { industryClients, logoHeight } from '../../../data/industryClients'
import styles from './IndustriesIndex.module.css'

/*
  Industries we empower — one screen, no icons, no cards.
  A compact numbered list on one side; on the other, the active sector
  (number, name, a one-line take) and the
  real client logos Hewar has worked with in it (src/data/industryClients.js).
  It cycles on its own with a progress line; hover / tap / keyboard focus
  picks a sector and pauses the cycle.
*/
const DUR = 4200
const pad = (n) => String(n).padStart(2, '0')
const clientCount = (n, lang) => {
  if (lang === 'ar') return n === 1 ? 'عميل واحد' : n === 2 ? 'عميلان' : `${n} عملاء`
  return n === 1 ? '1 client' : `${n} clients`
}

const IndustriesIndex = () => {
  const { t, language } = useTranslation()
  const { setCursor, resetCursor } = useCursor()
  const names = t('workPage.industries')
  const takes = t('workPage.industryTakes')
  const title = t('workPage.industriesTitle')
  const N = names.length

  const [cur, setCur] = useState(0)
  const [shown, setShown] = useState(0)
  const [out, setOut] = useState(false)
  const [paused, setPaused] = useState(false)
  const [reduce] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const swapT = useRef(0)

  const show = useCallback((i) => {
    setCur(i)
    setOut(true)
    clearTimeout(swapT.current)
    swapT.current = setTimeout(() => { setShown(i); setOut(false) }, reduce ? 0 : 220)
  }, [reduce])

  /* auto-cycle */
  useEffect(() => {
    if (paused || reduce) return undefined
    const id = setInterval(() => show((cur + 1) % N), DUR)
    return () => clearInterval(id)
  }, [paused, reduce, cur, N, show])

  useEffect(() => () => clearTimeout(swapT.current), [])

  const pick = (i) => { setPaused(true); if (i !== cur) show(i) }

  return (
    <section className={styles.section} aria-labelledby="industries-title">
      <Container>
        <div className={styles.grid}>
          <div className={styles.text}>
            <div className={styles.head}>
              <p className={styles.eyebrow}><i aria-hidden />{t('workPage.industriesLabel')}</p>
              <h2 id="industries-title" className={styles.heading}>
                {title[0]}<br /><span>{title[1]}</span>
              </h2>
            </div>
            <ul
              className={`${styles.list} ${paused ? styles.paused : ''}`}
              style={{ '--dur': `${DUR}ms` }}
              onMouseLeave={() => { setPaused(false); resetCursor() }}
            >
              {names.map((name, i) => (
                <li key={name} className={i === cur ? styles.on : ''}>
                  <button
                    type="button"
                    aria-pressed={i === cur}
                    onMouseEnter={() => { pick(i); setCursor('hover') }}
                    onFocus={() => pick(i)}
                    onClick={() => pick(i)}
                  >
                    <span className={styles.n}>{pad(i + 1)}</span>
                    <span>{name}</span>
                    <span className={styles.arrow} aria-hidden>{language === 'ar' ? '←' : '→'}</span>
                    {/* keyed so the progress line restarts on every change */}
                    {i === cur && <span key={`p-${cur}`} className={styles.progress} aria-hidden />}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`${styles.stage} ${out ? styles.out : ''}`}
            aria-live="polite"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <p className={`${styles.bigN} ${styles.swap}`} aria-hidden>{pad(shown + 1)}</p>
            <h3 className={`${styles.name} ${styles.swap}`}>{names[shown]}</h3>
            <p className={`${styles.take} ${styles.swap}`}>{takes[shown]}</p>
            <p className={`${styles.count} ${styles.swap}`}>
              {clientCount(industryClients[shown].length, language)}
            </p>
            <ul className={`${styles.logos} ${styles.swap}`} key={`logos-${shown}`}>
              {industryClients[shown].map((c, k) => (
                <li key={c.logo} style={{ '--k': k }}>
                  <img src={c.src} alt={c.name} title={c.name} loading="lazy" style={{ '--lh': logoHeight(c) }} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default IndustriesIndex
