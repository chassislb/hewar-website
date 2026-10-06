import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Container from '../../ui/Container/Container'
import { useTranslation } from '../../../i18n/useTranslation'
import styles from './About.module.css'

gsap.registerPlugin(ScrollTrigger)

const ABOUT_IMAGES = [
  { src: 'about-01-speaking.png', alt: 'HEWAR team member speaking in front of the HEWAR Group office sign' },
  { src: 'about-03-award.png', alt: 'HEWAR team accepting the Employee Happiness Awards KSA' },
  { src: 'about-02-panel.png', alt: 'HEWAR representatives on a panel discussion' },
]

/* the three photos, looped so the ribbon reads as a chain, not a slideshow */
const RIBBON = [...ABOUT_IMAGES, ...ABOUT_IMAGES]

const About = () => {
  const sectionRef = useRef(null)
  const pinWrapperRef = useRef(null)
  const leftRef = useRef(null)
  const trackRef = useRef(null)
  const rightRef = useRef(null)
  const { t } = useTranslation()
  const headingLines = t('about.headingLines')

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-about-line]',
        { y: '110%' },
        {
          y: '0%',
          duration: 1,
          stagger: 0.1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 76%',
          },
        }
      )

      gsap.fromTo(
        '[data-about-story]',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 68%',
          },
        }
      )

      gsap.to('[data-about-orb]', {
        y: -70,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
      })

      /* Ribbon: one row of same-size circles, spaced so they never overlap.
         They enter from the right edge, pass BEHIND the copy at low opacity,
         hit 100% once fully clear of it, keep sliding left, and the last one
         parks in the photo spot while the page carries on scrolling.
         The track lives inside .left but is stretched to 100vw in JS. */
      const beads = gsap.utils.toArray('[data-about-img]')
      const track = trackRef.current
      const left = leftRef.current
      const right = rightRef.current
      const N = beads.length
      const BEHIND = 0.18
      const HOLD = 0.85

      let W = 0, size = 0, gap = 0, cy = 0, spotX = 0
      let text = { l: 0, t: 0, b: 0 }
      const measure = () => {
        const r = left.getBoundingClientRect()
        W = window.innerWidth
        size = r.width
        cy = r.height / 2
        spotX = r.left
        /* gap ≥ distance to the left edge, so once the last circle parks the
           one before it is fully off-screen */
        gap = Math.max(size * 0.12, r.left + 8)
        track.style.left = `${-r.left}px`
        track.style.width = `${W}px`
        beads.forEach((b) => { b.style.width = `${size}px` })
        const t = right.getBoundingClientRect()
        text = { l: t.left - 16, t: t.top - r.top - 16, b: t.bottom - r.top + 16 }
      }
      const smooth = (a, b, v) => {
        const t = Math.max(0, Math.min(1, (v - a) / (b - a)))
        return t * t * (3 - 2 * t)
      }

      const render = (progress) => {
        const step = size + gap
        const pe = Math.min(1, progress / HOLD)
        const travel = W + (N - 1) * step - spotX
        beads.forEach((bead, i) => {
          const x = W + i * step - pe * travel
          if (x > W || x + size < 0) {
            bead.style.visibility = 'hidden'
            return
          }
          const top = cy - size / 2
          const vOverlap = top < text.b && top + size > text.t
          const behind = vOverlap ? Math.max(0, x + size - text.l) : 0
          bead.style.visibility = 'visible'
          bead.style.opacity = String(BEHIND + (1 - BEHIND) * (1 - smooth(0, size * 0.3, behind)))
          bead.style.transform = `translate3d(${x}px, ${top}px, 0)`
        })
      }

      let last = 0
      measure()
      render(0)
      const onResize = () => { measure(); render(last) }
      window.addEventListener('resize', onResize)

      const mm = gsap.matchMedia()
      const make = (trigger, start, end) => ScrollTrigger.create({
        trigger, start, end, scrub: 0.6,
        onUpdate: (self) => { last = self.progress; render(last) },
        onRefresh: () => { measure(); render(last) },
      })
      mm.add('(min-width: 901px)', () => { make(pinWrapperRef.current, 'top 85%', 'bottom bottom') })
      mm.add('(max-width: 900px)', () => { make(sectionRef.current, 'top 80%', 'bottom 20%') })

      return () => {
        window.removeEventListener('resize', onResize)
        mm.revert()
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className={styles.about} ref={sectionRef} id="about" data-section-theme="light">
      <div className={styles.bgClip} aria-hidden>
        <div className={styles.orb} data-about-orb />
        <div className={styles.gridGlow} />
      </div>

      <Container>
        <div className={styles.label}>
          <span className={styles.dots} aria-hidden>
            <span />
            <span />
            <span />
          </span>
          <span>{t('about.label')}</span>
        </div>

        <div className={styles.pinWrapper} ref={pinWrapperRef}>
          <div className={styles.pinStage}>
            <div className={styles.grid}>
              <div className={styles.left} ref={leftRef}>
                <div className={styles.imageStack} aria-hidden />
                <div className={styles.ribbonTrack} ref={trackRef}>
                  {RIBBON.map((image, i) => (
                    <img
                      key={`${image.src}-${i}`}
                      className={styles.aboutImg}
                      data-about-img
                      src={`${import.meta.env.BASE_URL}images/about/${image.src}`}
                      alt={i < ABOUT_IMAGES.length ? image.alt : ''}
                      aria-hidden={i >= ABOUT_IMAGES.length || undefined}
                      draggable={false}
                    />
                  ))}
                </div>
              </div>

              <div className={styles.right} ref={rightRef}>
                <h2 className={styles.heading}>
                  {headingLines.map((line, i) => (
                    <span key={i} className={styles.lineWrap}>
                      <span className={styles.lineInner} data-about-line>
                        {line}
                      </span>
                    </span>
                  ))}
                </h2>

                <div className={styles.storyBlock}>
                  <p className={styles.story} data-about-story>
                    {t('about.p1Before')}<em>{t('about.p1Emphasis')}</em>{t('about.p1After')}
                  </p>

                  <p className={styles.story} data-about-story>
                    {t('about.p2')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default About
