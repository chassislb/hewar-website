import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Container from '../../ui/Container/Container'
import { useCursor } from '../../../context/CursorContext'
import { useSectionTheme } from '../../../context/SectionThemeContext'
import { useTranslation } from '../../../i18n/useTranslation'
import ServiceGlyph from './ServiceGlyph'
import styles from './Services.module.css'

gsap.registerPlugin(ScrollTrigger)

const ServiceCard = ({ title, index, onPick }) => {
  const { setCursor, resetCursor } = useCursor()
  const [active, setActive] = useState(false)
  const [shown, setShown] = useState(false)
  const cardRef = useRef(null)
  const iconRef = useRef(null)
  const frame = useRef(0)

  // Magnet: feed the cursor position (relative to the icon, normalised to
  // the card size) into CSS vars. The glyph's CSS does the easing.
  const setMagnet = (mx, my) => {
    const el = iconRef.current
    if (!el) return
    el.style.setProperty('--mx', mx.toFixed(3))
    el.style.setProperty('--my', my.toFixed(3))
  }

  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const { clientX, clientY } = e
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const card = cardRef.current.getBoundingClientRect()
      const icon = iconRef.current.getBoundingClientRect()
      const clamp = (v) => Math.max(-1, Math.min(1, v))
      setMagnet(
        clamp((clientX - (icon.left + icon.width / 2)) / (card.width / 2)),
        clamp((clientY - (icon.top + icon.height / 2)) / (card.height / 2)),
      )
    })
  }

  const onPointerLeave = () => {
    cancelAnimationFrame(frame.current)
    setMagnet(0, 0)
  }

  // Pop the icon in whenever the card enters the viewport — works with the
  // GSAP horizontal track (observer sees transformed positions) and the
  // mobile swipe strip alike. Resets on exit so it pops again next pass.
  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setShown(entry.isIntersecting),
      { threshold: 0.45 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={cardRef}
      className={styles.card}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onMouseEnter={() => {
        setCursor('hover')
        setActive(true)
      }}
      onMouseLeave={() => {
        resetCursor()
        setActive(false)
      }}
    >
      <button
        type="button"
        className={styles.cardLink}
        onClick={() => onPick(index)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
      >
        <div className={styles.cardInner}>
          <div className={styles.cardTop}>
              <span className={styles.iconSlot} ref={iconRef}>
                <ServiceGlyph className={styles.cardIcon} index={index} active={active} shown={shown} />
              </span>
            <span className={styles.cardMeta}>
              <span className={styles.cardNum}>{String(index + 1).padStart(2, '0')}</span>
              <span className={styles.cardArrow}>↗</span>
            </span>
          </div>

          <div className={styles.cardBottom}>
            <h3 className={styles.cardTitle}>{title}</h3>
          </div>
        </div>

        <div className={styles.cardBorder} aria-hidden />
      </button>
    </div>
  )
}

const Services = () => {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const stickyRef = useRef(null)
  const spotRef = useRef(null)
  const theme = useSectionTheme()
  const isLight = theme === 'light'
  const { t } = useTranslation()
  const cards = t('services.cards')
  const summaries = t('services.summaries')
  const railRef = useRef(null)
  const pinnedRef = useRef(null)
  const [focus, setFocus] = useState(0)

  // Click a card: the spotlight + info jump to it until the user scrolls again.
  const pickCard = (index) => {
    pinnedRef.current = { index, y: window.scrollY, x: trackRef.current?.scrollLeft ?? 0 }
  }

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 769px)', () => {
      let timeline
      let trigger

      const setup = () => {
        const travel = Math.max(0, trackRef.current.scrollWidth - window.innerWidth)

        const startPause = window.innerHeight * 0.45
        const scrollDistance = Math.max(travel * 1.8, window.innerHeight * 1.5)
        const endPause = window.innerHeight * 1.15

        const totalDistance = startPause + scrollDistance + endPause

        sectionRef.current.style.minHeight = `calc(100vh + ${totalDistance}px)`

        timeline?.kill()
        trigger?.kill()

        timeline = gsap.timeline({ paused: true })

        timeline
          .to(trackRef.current, {
            x: 0,
            duration: startPause,
            ease: 'none',
          })
          .to(trackRef.current, {
            x: -travel,
            duration: scrollDistance,
            ease: 'none',
          })
          .to(trackRef.current, {
            x: -travel,
            duration: endPause,
            ease: 'none',
          })

        trigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          animation: timeline,
          invalidateOnRefresh: true,
        })
      }

      setup()

      window.addEventListener('resize', setup)
      ScrollTrigger.refresh()

      return () => {
        window.removeEventListener('resize', setup)
        timeline?.kill()
        trigger?.kill()
      }
    })

    return () => mm.revert()
  }, { scope: sectionRef })

  // Spotlight: one glow travels along the strip as you scroll, landing on
  // card 1 at the start and card 7 at the end. The card under it is "in
  // focus" (icon lit); the rest dim. Runs only while the section is on screen.
  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    const sticky = stickyRef.current
    const spot = spotRef.current
    if (!section || !track || !sticky || !spot) return

    let raf = 0
    let running = false
    let cur = null
    let focused = -1
    let railX = null

    const tick = () => {
      const cards = Array.from(track.children)
      if (!cards.length) return
      const base = sticky.getBoundingClientRect()
      const tr = track.getBoundingClientRect()

      // progress through the strip, 0 → 1 (desktop: GSAP transform, mobile: native scroll)
      const isScroller = track.scrollWidth > track.clientWidth + 1
      const p = isScroller
        ? track.scrollLeft / (track.scrollWidth - track.clientWidth)
        : (() => {
            const travel = track.scrollWidth - window.innerWidth
            return travel > 0 ? -(tr.left - base.left) / travel : 0
          })()
      // a clicked card overrides scroll until the user scrolls again
      const pin = pinnedRef.current
      if (pin && (Math.abs(window.scrollY - pin.y) > 40 || Math.abs(track.scrollLeft - pin.x) > 40)) {
        pinnedRef.current = null
      }
      const f = pinnedRef.current
        ? pinnedRef.current.index
        : Math.max(0, Math.min(1, p || 0)) * (cards.length - 1)
      const i = Math.floor(f)
      const a = cards[i].getBoundingClientRect()
      const b = cards[Math.min(i + 1, cards.length - 1)].getBoundingClientRect()
      const k = f - i
      const target = {
        x: a.left + a.width / 2 + ((b.left + b.width / 2) - (a.left + a.width / 2)) * k - base.left,
        y: a.top + a.height / 2 - base.top,
      }

      cur = cur
        ? { x: cur.x + (target.x - cur.x) * 0.12, y: cur.y + (target.y - cur.y) * 0.12 }
        : target
      spot.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0) translate(-50%, -50%)`

      const next = Math.round(f)
      if (next !== focused) {
        cards[focused]?.removeAttribute('data-focus')
        cards[next]?.setAttribute('data-focus', '')
        focused = next
        setFocus(next)
      }

      // info rail slides along under the lit card (desktop only)
      const rail = railRef.current
      if (rail) {
        if (isScroller) {
          rail.style.transform = ''
        } else {
          const lit = cards[next].getBoundingClientRect()
          const pad = 24
          const maxX = base.width - rail.offsetWidth - pad
          // centre the rail under the lit card, kept inside the screen
          const centre = lit.left - base.left + lit.width / 2 - rail.offsetWidth / 2
          const want = Math.max(pad, Math.min(maxX, centre))
          railX = railX === null ? want : railX + (want - railX) * 0.12
          rail.style.transform = `translate3d(${railX}px, 0, 0)`
        }
      }

      if (running) raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting
      cancelAnimationFrame(raf)
      if (running) raf = requestAnimationFrame(tick)
    })
    io.observe(section)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [])

  return (
    <section
      className={`${styles.services} ${isLight ? styles.themeLight : ''}`}
      ref={sectionRef}
      id="services"
      data-section-theme="dark"
    >
      <div className={styles.sticky} ref={stickyRef}>
        <div className={styles.spotlight} ref={spotRef} aria-hidden />
        <Container>
          <div className={styles.header}>
            <div className={styles.label}>
              <span className={styles.dots} aria-hidden>
                <span />
                <span />
                <span />
              </span>
              <span>{t('services.label')}</span>
            </div>

            <div className={styles.headingRow}>
              <h2 className={styles.heading}>
                {t('services.headingLine1')}<br />
                <span className={styles.headingAccent}>{t('services.headingAccent')}</span>
              </h2>

              <p className={styles.headingSub}>
                {t('services.sub')}
              </p>
            </div>
          </div>
        </Container>

        <div className={styles.track} ref={trackRef}>
          {cards.map((title, index) => (
            <ServiceCard key={title} title={title} index={index} onPick={pickCard} />
          ))}
        </div>

        {/* Info rail: what the lit card actually covers. Remounts on focus
            change so the text + chips animate in fresh each time. */}
        <div className={styles.railWrap}>
          <div className={styles.rail} ref={railRef} aria-live="polite">
            <div className={styles.railInner} key={focus}>
              <span className={styles.railDot} aria-hidden />
              <p className={styles.railSummary}>{summaries[focus]}</p>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}

export default Services
