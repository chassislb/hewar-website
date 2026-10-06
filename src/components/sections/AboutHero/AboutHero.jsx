import Container from '../../ui/Container/Container'
import { useTranslation } from '../../../i18n/useTranslation'
import HeroConversation from './HeroConversation'
import styles from './AboutHero.module.css'

/* About page hero — "Hewar" means dialogue, so the page introduces itself
   as a conversation. The chat fills the hero; the title is kept only for
   search engines and screen readers. */
const AboutHero = () => {
  const { t } = useTranslation()

  return (
    <section className={styles.hero}>
      <div className={styles.heroOrb} style={{ top: '-30%', right: '-15%', background: 'radial-gradient(circle, rgba(71,0,179,0.4) 0%, transparent 70%)', width: 'clamp(400px,60vw,900px)', height: 'clamp(400px,60vw,900px)' }} aria-hidden />
      <div className={styles.heroOrb} style={{ bottom: '-10%', left: '-8%', background: 'radial-gradient(circle, rgba(0,200,255,0.25) 0%, transparent 70%)', width: 'clamp(250px,40vw,600px)', height: 'clamp(250px,40vw,600px)' }} aria-hidden />
      <Container>
        <div className={styles.heroGrid}>
          <HeroConversation />

          <div className={styles.heroIntro}>
            {/* the chat does the introducing; heading stays for search engines & screen readers */}
            <h1 className="sr-only">{t('aboutPage.heroTitle')}</h1>
            {/* kept for search engines & screen readers; the chat says it visually */}
            <p className="sr-only">{t('aboutPage.heroBody')}</p>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default AboutHero
