import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Container from '../../ui/Container/Container'
import { useTranslation } from '../../../i18n/useTranslation'
import HeroConversation from './HeroConversation'
import styles from './AboutHero.module.css'

/* About page hero — "Hewar" means dialogue, so the page introduces itself
   as a conversation. Chat in the middle, title bottom-centre like the
   Services / Work / Careers heroes. */
const AboutHero = () => {
  const { t } = useTranslation()
  const heroRef = useRef(null)

  /* Hero entrance */
  useGSAP(() => {
    gsap.fromTo('[data-page-eyebrow]', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.15 })
    gsap.fromTo('[data-page-title]',   { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1,   ease: 'power4.out', delay: 0.05 })
  }, { scope: heroRef })

  return (
    <section className={styles.hero} ref={heroRef}>
      <div className={styles.heroOrb} style={{ top: '-30%', right: '-15%', background: 'radial-gradient(circle, rgba(71,0,179,0.4) 0%, transparent 70%)', width: 'clamp(400px,60vw,900px)', height: 'clamp(400px,60vw,900px)' }} aria-hidden />
      <div className={styles.heroOrb} style={{ bottom: '-10%', left: '-8%', background: 'radial-gradient(circle, rgba(0,200,255,0.25) 0%, transparent 70%)', width: 'clamp(250px,40vw,600px)', height: 'clamp(250px,40vw,600px)' }} aria-hidden />
      <Container>
        <div className={styles.heroGrid}>
          <HeroConversation />

          <div className={styles.heroIntro}>
            <p className={styles.eyebrow} data-page-eyebrow>
              <span className={styles.eyebrowDot} aria-hidden />
              {t('common.tagline')}
            </p>
            <h1 className={styles.title} data-page-title>
              {t('aboutPage.heroTitle')}
            </h1>
            {/* kept for search engines & screen readers; the chat says it visually */}
            <p className="sr-only">{t('aboutPage.heroBody')}</p>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default AboutHero
