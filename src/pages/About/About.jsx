import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Container from '../../components/ui/Container/Container'
import Button from '../../components/ui/Button/Button'
import styles from './About.module.css'

gsap.registerPlugin(ScrollTrigger)

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

const methodPillars = [
  { title: 'Think Smarter',      items: ['Insight', 'Strategy', 'Culture', 'Data'] },
  { title: 'Create Faster',      items: ['AI-assisted ideation', 'Design', 'Production'] },
  { title: 'Communicate Better', items: ['PR', 'Social', 'Campaigns', 'Reputation'] },
]

const values = [
  { num: '01', title: 'Growth',      body: 'We scale with every client we serve.' },
  { num: '02', title: 'Methodology', body: 'Strategy before execution, always.' },
  { num: '03', title: 'Innovation',  body: 'New thinking for changing markets.' },
  { num: '04', title: 'Creativity',  body: 'Ideas that earn attention and trust.' },
]

const IMAGE_TAGS = ['Expertise', 'Integrity', 'Excellence', 'Dedication']

const ABOUT_IMAGE = '/hewar-website/Website/Website/About/HEWAR/3.png'

const ABOUT_MOMENTS = [
  { src: '/hewar-website/Website/Website/About/HEWAR/1.png', caption: 'Speaking at a regional industry summit' },
  { src: '/hewar-website/Website/Website/About/HEWAR/2.png', caption: 'Employer Happiness Awards KSA — Best in Class' },
]

const About = () => {
  const heroRef   = useRef(null)
  const storyRef  = useRef(null)
  const valuesRef = useRef(null)
  const ctaRef    = useRef(null)

  /* Hero entrance */
  useGSAP(() => {
    gsap.fromTo('[data-page-eyebrow]', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.15 })
    gsap.fromTo('[data-page-title]',   { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1,   ease: 'power4.out', delay: 0.05 })
    gsap.fromTo('[data-page-sub]',     { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.35 })
  }, { scope: heroRef })

  /* Story — sticky image + parallax + text reveals */
  useGSAP(() => {
    /* Image wipes UP into frame as section enters */
    gsap.fromTo('[data-story-image]',
      { clipPath: 'inset(100% 0% 0% 0% round 14px)' },
      {
        clipPath: 'inset(0% 0% 0% 0% round 14px)',
        duration: 1.6,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: storyRef.current, start: 'top 78%', toggleActions: 'play none none none' },
      }
    )

    /* Parallax — image drifts up slower than scroll speed */
    gsap.to('[data-story-img]', {
      yPercent: -14,
      ease: 'none',
      scrollTrigger: {
        trigger: storyRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      },
    })

    /* Right column text blocks reveal in sequence */
    gsap.fromTo('[data-story-text]',
      { y: 55, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.95,
        stagger: 0.22,
        ease: 'power3.out',
        scrollTrigger: { trigger: storyRef.current, start: 'top 70%' },
      }
    )
  }, { scope: storyRef })

  /* Values */
  useGSAP(() => {
    gsap.fromTo('[data-value-card]',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: valuesRef.current, start: 'top 82%' } }
    )
  }, { scope: valuesRef })

  /* CTA */
  useGSAP(() => {
    gsap.fromTo('[data-cta-reveal]',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: ctaRef.current, start: 'top 85%' } }
    )
  }, { scope: ctaRef })

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">

      {/* ── Hero ── */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroOrb} style={{ top: '-30%', right: '-15%', background: 'radial-gradient(circle, rgba(71,0,179,0.4) 0%, transparent 70%)', width: 'clamp(400px,60vw,900px)', height: 'clamp(400px,60vw,900px)' }} aria-hidden />
        <div className={styles.heroOrb} style={{ bottom: '-10%', left: '-8%', background: 'radial-gradient(circle, rgba(0,200,255,0.25) 0%, transparent 70%)', width: 'clamp(250px,40vw,600px)', height: 'clamp(250px,40vw,600px)' }} aria-hidden />
        <Container>
          <p className={styles.eyebrow} data-page-eyebrow>
            <span className={styles.eyebrowDot} aria-hidden />
            About HEWAR
          </p>
          <h1 className={styles.title} data-page-title>
            Born from the belief that every brand has something worth saying.
          </h1>
          <p className={styles.heroSub} data-page-sub>
            HEWAR — حوار — means dialogue in Arabic. We believe the best
            communication listens as much as it speaks.
          </p>
        </Container>
      </section>

      {/* ── Story — sticky image left, scrolling text right ── */}
      <section className={styles.story} ref={storyRef}>
        <Container>
          <div className={styles.storyGrid}>

            {/* ── LEFT: sticky image panel ── */}
            <div className={styles.storyImageCol} data-story-image>
              <div className={styles.imageFrame}>

                {/* Branded placeholder — replaced by real photo when ready */}
                {!ABOUT_IMAGE && (
                  <div className={styles.imagePlaceholder} aria-hidden>
                    <div className={styles.imagePlaceholderGrid} />
                    <div className={styles.imagePlaceholderOrb} />
                  </div>
                )}

                {/* Real image — GSAP drives yPercent parallax */}
                {ABOUT_IMAGE && (
                  <img
                    src={ABOUT_IMAGE}
                    alt="HEWAR Group team"
                    className={styles.storyImg}
                    data-story-img
                  />
                )}

                {/* Value tags overlaid at bottom */}
                <div className={styles.imageTags}>
                  {IMAGE_TAGS.map(tag => (
                    <span key={tag} className={styles.imageTag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT: scrolling content ── */}
            <div className={styles.storyTextCol}>

              {/* Story copy */}
              <div className={styles.storyBlock} data-story-text>
                <p className={styles.storyLabel}>Our Story</p>
                <p className={styles.storyText}>
                  HEWAR — حوار — means <em>dialogue</em> in Arabic. It's not a
                  metaphor. It's our operating principle. We believe the best
                  communication is never one-directional. It listens as much
                  as it speaks, and earns attention rather than demanding it.
                </p>
                <p className={styles.storyText}>
                  Founded in Saudi Arabia with 12+ years in the market, we
                  craft bespoke communication solutions for partners from
                  the public and private sectors across diverse industries.
                  From Riyadh to Beirut — we bring the same discipline and
                  creative intensity to every engagement.
                </p>
                <div className={styles.statsRow}>
                  <div className={styles.stat}>
                    <span className={styles.statNumber}>12+</span>
                    <span className={styles.statLabel}>Years in Market</span>
                  </div>
                  <div className={styles.statDivider} />
                  <div className={styles.stat}>
                    <span className={styles.statNumber}>2</span>
                    <span className={styles.statLabel}>Offices</span>
                  </div>
                  <div className={styles.statDivider} />
                  <div className={styles.stat}>
                    <span className={styles.statNumber}>100+</span>
                    <span className={styles.statLabel}>Brands Served</span>
                  </div>
                </div>
              </div>

              {/* Method pillars */}
              <div className={styles.storyBlock} data-story-text>
                <p className={styles.storyLabel}>Our Method</p>
                {methodPillars.map((pillar) => (
                  <div key={pillar.title} className={styles.pillarCard}>
                    <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                    <ul className={styles.pillarList}>
                      {pillar.items.map((item) => (
                        <li key={item} className={styles.pillarItem}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </Container>
      </section>

      {/* ── Moments ── */}
      <section className={styles.momentsSection}>
        <Container>
          <div className={styles.momentsGrid}>
            {ABOUT_MOMENTS.map((m) => (
              <figure key={m.src} className={styles.momentFigure}>
                <div className={styles.momentImgWrap}>
                  <img src={m.src} alt={m.caption} className={styles.momentImg} />
                </div>
                <figcaption className={styles.momentCaption}>{m.caption}</figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Values ── */}
      <section className={styles.valuesSection} ref={valuesRef}>
        <Container>
          <p className={styles.sectionEyebrow}>What We Stand For</p>
          <h2 className={styles.sectionTitle}>Our values.</h2>
          <div className={styles.valuesGrid}>
            {values.map((v) => (
              <div key={v.title} className={styles.valueCard} data-value-card>
                <span className={styles.valueNum}>{v.num}</span>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueBody}>{v.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection} ref={ctaRef}>
        <div className={styles.ctaOrb} aria-hidden />
        <Container size="narrow">
          <div className={styles.ctaContent}>
            <p className={styles.ctaEyebrow} data-cta-reveal>Ready to amplify your brand?</p>
            <h2 className={styles.ctaTitle} data-cta-reveal>Start a Conversation.</h2>
            <div data-cta-reveal>
              <Button variant="primary" size="lg" href="/contact">
                Get in Touch
              </Button>
            </div>
          </div>
        </Container>
      </section>

    </motion.div>
  )
}

export default About
