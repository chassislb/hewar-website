import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Container from '../../ui/Container/Container'
import { useTranslation } from '../../../i18n/useTranslation'
import cxLoyalty2024 from '../../../assets/awards/cx-loyalty-2024.webp'
import eventexGold from '../../../assets/awards/eventex-gold.webp'
import employeeHappiness from '../../../assets/awards/employee-happiness.webp'
import silverAward from '../../../assets/awards/silver-award.webp'
import styles from './AwardsUnveiling.module.css'

gsap.registerPlugin(ScrollTrigger)

/* One image per award, same order as aboutPage.awards in translations.js.
   `flat` = a logo/badge rather than a physical trophy (drawn a bit smaller,
   no floor reflection). */
const AWARD_IMAGES = [
  { src: cxLoyalty2024 },
  { src: eventexGold },
  { src: employeeHappiness, flat: true },
  { src: silverAward, flat: true },
]

const AwardsUnveiling = () => {
  const { t } = useTranslation()
  const awardsRef = useRef(null)
  const awards = t('aboutPage.awards')

  /* Awards — "The Unveiling": lights down, then one beam at a time drops
     onto each trophy, the trophy rises out of the dark, its name writes in.
     Replays every time you scroll back into the section. */
  useGSAP(() => {
    const q = gsap.utils.selector(awardsRef)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const hidden = () => {
      gsap.set(q('[data-awards-dark]'), { opacity: 0 })
      gsap.set(q('[data-awards-eyebrow]'), { opacity: 0, y: 14 })
      gsap.set(q('[data-beam]'), { scaleY: 0, opacity: 0 })
      gsap.set(q('[data-floor]'), { opacity: 0, scale: 0.5 })
      gsap.set(q('[data-trophy]'), { opacity: 0, y: 46, filter: 'brightness(0) blur(8px)' })
      gsap.set(q('[data-award-word]'), { opacity: 0, y: 12 })
      gsap.set(q('[data-award-meta]'), { opacity: 0 })
    }

    const unveil = (slot, tl, at) => {
      const s = gsap.utils.selector(slot)
      tl.to(s('[data-beam]'), { scaleY: 1, duration: 0.45, ease: 'power2.out' }, at)
        // stage light flickers on
        .to(s('[data-beam]'), {
          keyframes: { opacity: [0, 0.9, 0.25, 1, 0.55, 1] },
          duration: 0.55,
          ease: 'none',
        }, at)
        .to(s('[data-floor]'), { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' }, at + 0.3)
        .to(s('[data-trophy]'), {
          opacity: 1,
          y: 0,
          keyframes: { filter: ['brightness(0) blur(8px)', 'brightness(1.7) blur(0px)', 'brightness(1) blur(0px)'] },
          duration: 1.2,
          ease: 'power3.out',
        }, at + 0.25)
        .to(s('[data-award-word]'), { opacity: 1, y: 0, duration: 0.45, stagger: 0.05, ease: 'power3.out' }, at + 0.7)
        .to(s('[data-award-meta]'), { opacity: 1, duration: 0.6 }, at + 1.1)
    }

    const slots = q('[data-award-slot]')
    const mm = gsap.matchMedia()

    if (reduce) {
      return
    }

    // Desktop / tablet: the whole row is visible, so play it as one show.
    mm.add('(min-width: 561px)', () => {
      hidden()
      const tl = gsap.timeline({ paused: true })
      tl.to(q('[data-awards-dark]'), { opacity: 1, duration: 0.9, ease: 'power2.inOut' }, 0)
        .to(q('[data-awards-eyebrow]'), { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.3)
      slots.forEach((slot, i) => unveil(slot, tl, 0.9 + i * 0.85))

      ScrollTrigger.create({
        trigger: awardsRef.current,
        start: 'top 55%',
        onEnter: () => tl.restart(),
        onLeaveBack: () => tl.pause(0),
      })
    })

    // Phones: trophies are stacked, so each one unveils as it scrolls in.
    mm.add('(max-width: 560px)', () => {
      hidden()
      const intro = gsap.timeline({ paused: true })
        .to(q('[data-awards-dark]'), { opacity: 1, duration: 0.9 }, 0)
        .to(q('[data-awards-eyebrow]'), { opacity: 1, y: 0, duration: 0.7 }, 0.3)
      ScrollTrigger.create({
        trigger: awardsRef.current,
        start: 'top 70%',
        onEnter: () => intro.restart(),
        onLeaveBack: () => intro.pause(0),
      })
      slots.forEach((slot) => {
        const tl = gsap.timeline({ paused: true })
        unveil(slot, tl, 0)
        ScrollTrigger.create({
          trigger: slot,
          start: 'top 75%',
          onEnter: () => tl.restart(),
          onLeaveBack: () => tl.pause(0),
        })
      })
    })

    return () => mm.revert()
  }, { scope: awardsRef })

  return (
    <section className={styles.awardsSection} ref={awardsRef}>
      <div className={styles.awardsDark} data-awards-dark aria-hidden />
      <Container>
        <div className={styles.awardsHead}>
          <p className={styles.sectionEyebrow} data-awards-eyebrow>{t('aboutPage.awardsLabel')}</p>
        </div>

        <div className={styles.stage}>
          {awards.map((award, i) => {
            const img = AWARD_IMAGES[i]
            return (
              <div key={award.title} className={styles.slot} data-award-slot>
                <div className={styles.pedestal}>
                  <span className={styles.beam} data-beam aria-hidden />
                  <span className={styles.floorGlow} data-floor aria-hidden />
                  {img && (
                    <img
                      className={`${styles.trophy} ${img.flat ? styles.trophyFlat : ''}`}
                      src={img.src}
                      alt=""
                      loading="lazy"
                      data-trophy
                    />
                  )}
                </div>

                <div className={styles.awardCopy}>
                  <h3 className={styles.awardTitle}>
                    {award.title.split(' ').map((word, w) => (
                      <span key={w} className={styles.awardWord} data-award-word>
                        {word}{' '}
                      </span>
                    ))}
                    {award.year && (
                      <span className={`${styles.awardWord} ${styles.awardYear}`} data-award-word>
                        {award.year}
                      </span>
                    )}
                  </h3>
                  {award.category && (
                    <p className={styles.awardCategory} data-award-meta>{award.category}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

export default AwardsUnveiling
