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

const SLIDE_DISTANCE = 70

const About = () => {
  const sectionRef = useRef(null)
  const pinWrapperRef = useRef(null)
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

      /* Pin the whole photo + copy block in place while the reader scrolls
         through pinWrapper's extra height (set in CSS via .pinStage's
         position: sticky). That scroll distance is what drives the image
         transition — not page scroll in general — so the section only
         releases to the next one once the third photo has settled in.
         image[i] peaks when progress === i / (count - 1), sliding
         horizontally in/out as it fades toward its neighbors. */
      const images = gsap.utils.toArray('[data-about-img]')
      const step = 1 / (images.length - 1)

      ScrollTrigger.create({
        trigger: pinWrapperRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          images.forEach((img, i) => {
            const offset = self.progress - i * step
            const weight = Math.max(0, 1 - Math.abs(offset) / step)
            img.style.opacity = weight
            img.style.transform = `translateX(${offset * SLIDE_DISTANCE}px)`
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
          </div>
        </div>
      </Container>
    </section>
  )
}

export default About
