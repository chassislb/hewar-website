import { useRef, useState, useEffect } from 'react'
import { useTranslation } from '../../../i18n/useTranslation'
import { useLanguage } from '../../../context/LanguageContext'
import styles from './Hero.module.css'

const VIDEO_SRC = {
  en: '/hewar-website/videos/home-hero-en.mp4',
  ar: '/hewar-website/videos/home-hero-ar.mp4',
}

const Hero = () => {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const videoRef = useRef(null)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.playbackRate = 0.75
    video.muted = true
    video.play().catch(() => {})
  }, [language])

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    const nextMuted = !video.muted
    video.muted = nextMuted
    setMuted(nextMuted)

    if (!nextMuted) {
      video.play().catch(() => {})
    }
  }

  return (
    <section className={styles.hero} data-section-theme="dark">
      <div className={styles.videoSection}>
        <div className={styles.videoStars} aria-hidden>
          <div className={styles.videoGlow} />
        </div>

        <video
          key={language}
          ref={videoRef}
          className={styles.heroVideo}
          src={VIDEO_SRC[language]}
          autoPlay
          muted
          playsInline
          preload="auto"
        />

        <div className={styles.videoOverlay} aria-hidden />

        <button
          type="button"
          className={styles.soundButton}
          onClick={toggleMute}
          aria-label={muted ? 'Turn sound on' : 'Mute video'}
        >
          {muted ? t('video.soundOn') : t('video.mute')}
        </button>
      </div>
    </section>
  )
}

export default Hero
