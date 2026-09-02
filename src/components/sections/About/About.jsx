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

/* Tracks the same color as whichever photo is currently dominant, so
   the word row visibly shifts in sync with each image change. */
const WORD_COLORS = [
  [71, 0, 179], // violet — image 1
  [0, 130, 190], // cyan — image 2
  [6, 26, 64], // navy — image 3
]

const About = () => {
  const sectionRef = useRef(null)
  const pinWrapperRef = useRef(null)
  const { t } = useTranslation()
  const movingWords = t('about.words')
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

      /* Pin the whole photo + copy block in place while the reader scrolls
         through pinWrapper's extra height (set in CSS via .pinStage's
         position: sticky). That scroll distance is what drives the image
         crossfade and the word-row color — not page scroll in general —
         so the section only releases to the next one once the third photo
         has settled in. image[i] (and its matching color) peaks when
         progress === i / (count - 1), fading linearly toward its
         neighbors. */
      const images = gsap.utils.toArray('[data-about-img]')
      const words = gsap.utils.toArray('[data-about-word]')
      const step = 1 / (images.length - 1)

      ScrollTrigger.create({
        trigger: pinWrapperRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const weights = images.map((_, i) => {
            const distance = Math.abs(self.progress - i * step)
            return Math.max(0, 1 - distance / step)
          })

          images.forEach((img, i) => {
            img.style.opacity = weights[i]
          })

          const totalWeight = weights.reduce((sum, w) => sum + w, 0) || 1
          const rgb = [0, 0, 0]
          weights.forEach((w, i) => {
            rgb[0] += WORD_COLORS[i][0] * w
            rgb[1] += WORD_COLORS[i][1] * w
            rgb[2] += WORD_COLORS[i][2] * w
          })
          const color = `rgb(${Math.round(rgb[0] / totalWeight)}, ${Math.round(rgb[1] / totalWeight)}, ${Math.round(rgb[2] / totalWeight)})`

          words.forEach((word) => {
            word.style.color = color
            word.style.borderColor = color
          })
        },
      })
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
              <div className={styles.left}>
                <div className={styles.imageStack}>
                  {ABOUT_IMAGES.map((image, i) => (
                    <img
                      key={image.src}
                      className={styles.aboutImg}
                      data-about-img
                      src={`${import.meta.env.BASE_URL}images/about/${image.src}`}
                      alt={image.alt}
                      style={{ opacity: i === 0 ? 1 : 0 }}
                    />
                  ))}
                </div>
              </div>

              <div className={styles.right}>
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

            <div className={styles.wordsTrack} aria-hidden>
              <div className={styles.wordsMarquee}>
                {[...movingWords, ...movingWords].map((word, i) => (
                  <span key={`${word}-${i}`} className={styles.wordPill} data-about-word>
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default About
