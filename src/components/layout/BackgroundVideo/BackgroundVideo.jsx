import { useEffect, useRef } from 'react'
import styles from './BackgroundVideo.module.css'

const VIDEO_SRC = '/hewar-website/videos/amplified.mp4'

export default function BackgroundVideo() {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.playbackRate = 0.55
  }, [])

  return (
    <div className={styles.wrapper} aria-hidden>
      <video
        ref={videoRef}
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      <div className={styles.overlay} />
    </div>
  )
}