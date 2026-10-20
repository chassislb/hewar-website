import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from '../../../i18n/useTranslation'
import { useLanguage } from '../../../context/LanguageContext'
import { useContactModal } from '../../../context/ContactModalContext'
import styles from './ServicePosters.module.css'

gsap.registerPlugin(ScrollTrigger)

// Card colour per service, in order (matches the approved preview)
const PALETTE = ['navy', 'violet', 'sand', 'cyan', 'deep', 'violet', 'sand']
const pad = (n) => String(n).padStart(2, '0')

/*
 * Desktop (≥1025px + mouse): section pins, the row slides sideways with scroll,
 * and the active card flips to its back. Card N is open at progress N/(total-1).
 * Tablet / mobile / touch: cards stack vertically, each flips when it crosses mid-screen.
 * Any card can also be flipped by click/tap.
 */
const ServicePosters = () => {
  const { t } = useTranslation()
  const { isRTL } = useLanguage()
  const { openContactModal } = useContactModal()

  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const barRef = useRef(null)
  const [active, setActive] = useState(0)        // driven by scroll
  const [manual, setManual] = useState({})       // per-card tap overrides

  const titles = t('services.cards')
  const summaries = t('services.summaries')
  const bullets = t('services.cardDetails')
  const tags = t('services.tags')
  const countLabel = t('services.countLabel')
  const briefCta = t('services.briefCta')
  const total = titles.length

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 1025px) and (pointer: fine)', () => {
      const track = trackRef.current
      const dist = () => track.scrollWidth - window.innerWidth
      let cur = 0

      gsap.to(track, {
        x: () => (isRTL ? dist() : -dist()),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          start: 'top top',
          end: () => '+=' + dist() * 1.15,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`
            const i = Math.round(self.progress * (total - 1))
            if (i !== cur) { cur = i; setActive(i); setManual({}) }
          },
        },
      })
      setActive(0)
    })

    mm.add('(max-width: 1024px), (pointer: coarse)', () => {
      gsap.utils.toArray('[data-poster]', sectionRef.current).forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 45%',
          onToggle: (st) => {
            if (st.isActive) { setActive(i); setManual({}) }
          },
        })
      })
    })

    return () => mm.revert()
  }, { scope: sectionRef, dependencies: [isRTL, total] })

  const isOpen = (i) => (i in manual ? manual[i] : i === active)
  const toggle = (i) => setManual((m) => ({ ...m, [i]: !isOpen(i) }))

  return (
    <section className={styles.run} ref={sectionRef} aria-label={t('services.label')}>
      <div className={styles.track} ref={trackRef}>
        {titles.map((title, i) => (
          <div
            key={title}
            data-poster
            className={`${styles.poster} ${styles[PALETTE[i % PALETTE.length]]} ${isOpen(i) ? styles.open : ''}`}
          >
            <div className={styles.flip}>
              {/* front */}
              <button
                type="button"
                className={styles.face}
                onClick={() => toggle(i)}
                aria-expanded={isOpen(i)}
                aria-label={title}
              >
                <span className={styles.num} aria-hidden>{pad(i + 1)}</span>
                <span className={styles.frontBottom}>
                  <span className={styles.title}>{title}</span>
                  <span className={styles.hint}>
                    <span>{tags[i]}</span>
                    <span>{bullets[i].length} {countLabel}</span>
                  </span>
                </span>
              </button>

              {/* back */}
              <div className={`${styles.face} ${styles.back}`} onClick={() => toggle(i)}>
                <h3 className={styles.backTitle}>{title}</h3>
                <p className={styles.backText}>{summaries[i]}</p>
                <ul className={styles.list}>
                  {bullets[i].map((b, k) => (
                    <li key={b}><span>{pad(k + 1)}</span>{b}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  className={styles.go}
                  onClick={(e) => { e.stopPropagation(); openContactModal() }}
                >
                  {briefCta} <span aria-hidden>{isRTL ? '←' : '→'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.bar} aria-hidden>
        <span className={styles.count}>{pad(active + 1)} / {pad(total)}</span>
        <span className={styles.line}><i ref={barRef} /></span>
      </div>
    </section>
  )
}

export default ServicePosters
