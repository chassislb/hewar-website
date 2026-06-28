import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Container from '../../ui/Container/Container'
import styles from './About.module.css'

gsap.registerPlugin(ScrollTrigger)

const CHAPTERS = [
  {
    title: 'Who We Are',
    image: null,
  },
  {
    title: 'What We Believe',
    image: null,
  },
  {
    title: 'How We Work',
    image: null,
  },
  {
    title: 'Why It Matters',
    image: null,
  },
]

const About = () => {
  const sectionRef = useRef(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-about-headline-line]',
        { y: '110%' },
        {
          y: '0%',
          duration: 1,
          stagger: 0.1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      )

      gsap.fromTo(
        '[data-about-story]',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      )

      CHAPTERS.forEach((_, index) => {
        gsap.to(`[data-about-chapter="${index}"]`, {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `${index * 25}% top`,
            end: `${(index + 1) * 25}% top`,
            scrub: true,
          },
        })

        gsap.to(`[data-about-chapter="${index}"]`, {
          opacity: 0,
          y: -36,
          duration: 0.45,
          ease: 'power3.in',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `${(index + 0.72) * 25}% top`,
            end: `${(index + 1) * 25}% top`,
            scrub: true,
          },
        })

        gsap.to(`[data-about-image="${index}"]`, {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `${index * 25}% top`,
            end: `${(index + 0.85) * 25}% top`,
            scrub: true,
          },
        })

        gsap.to(`[data-about-image="${index}"]`, {
          x: '-28vw',
          opacity: 0,
          scale: 0.94,
          duration: 0.65,
          ease: 'power3.in',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `${(index + 0.72) * 25}% top`,
            end: `${(index + 1) * 25}% top`,
            scrub: true,
          },
        })
      })

      gsap.to('[data-about-orb]', {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className={styles.aboutOuter} ref={sectionRef} id="about">
      <div className={styles.orb} data-about-orb aria-hidden />

      <div className={styles.stickyFrame}>
        <Container className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.left}>
              <div className={styles.label}>
                <span className={styles.dots} aria-hidden>
                  <span />
                  <span />
                  <span />
                </span>
                <span>About HEWAR</span>
              </div>

              <h2 className={styles.heading}>
                {[
                  'Born from the',
                  'belief that every',
                  'brand has something',
                  'worth saying.',
                ].map((line, i) => (
                  <span key={i} className={styles.lineWrap}>
                    <span className={styles.lineInner} data-about-headline-line>
                      {line}
                    </span>
                  </span>
                ))}
              </h2>

              <div className={styles.chapterStage}>
                {CHAPTERS.map((chapter, index) => (
                  <h3
                    key={chapter.title}
                    className={styles.chapterTitle}
                    data-about-chapter={index}
                  >
                    {chapter.title}
                  </h3>
                ))}
              </div>
            </div>

            <div className={styles.right}>
              <div className={styles.storyWrap}>
                <p className={styles.story} data-about-story>
                  HEWAR — حوار — means <em>dialogue</em> in Arabic. It's not a
                  metaphor. It's our operating principle. We believe the best
                  communication is never one-directional. It listens as much as it
                  speaks, and earns attention rather than demanding it.
                </p>

                <p className={styles.story} data-about-story>
                  Founded in Saudi Arabia with 12+ years in the market, we craft
                  bespoke communication solutions for partners from the public and
                  private sectors across diverse industries. Built for the MENA
                  region, we read the room before we shape the message — culture,
                  timing, stakeholders, and public conversation included.
                </p>
              </div>
            </div>
          </div>
        </Container>

        <div className={styles.imageStage} aria-hidden>
          {CHAPTERS.map((chapter, index) => (
            <div
              key={chapter.title}
              className={styles.imageCard}
              data-about-image={index}
            >
              {chapter.image ? (
                <img src={chapter.image} alt="" className={styles.image} />
              ) : (
                <div className={styles.imagePlaceholder} />
              )}
              <div className={styles.imageOverlay} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About