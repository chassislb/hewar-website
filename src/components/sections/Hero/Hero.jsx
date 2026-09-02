import { useRef, useState, useEffect } from 'react'
import { useTranslation } from '../../../i18n/useTranslation'
import styles from './Hero.module.css'

const VIDEO_SRC = '/hewar-website/videos/amplified.mp4'

const Hero = () => {
  const { t } = useTranslation()
  const videoRef = useRef(null)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.playbackRate = 0.75
    video.muted = true
    video.play().catch(() => {})
  }, [])

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
          ref={videoRef}
          className={styles.heroVideo}
          autoPlay
          muted
          playsInline
          preload="auto"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>

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
