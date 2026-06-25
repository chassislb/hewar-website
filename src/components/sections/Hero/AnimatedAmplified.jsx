import { useRef, useEffect } from 'react'
import styles from './AnimatedAmplified.module.css'

const VIDEO_SRC = '/hewar-website/videos/amplified.mp4'

export default function AnimatedAmplified() {
  const videoRef = useRef(null)

  /* Fade the video in once it has data — keeps white SVG text visible while buffering */
  useEffect(() => {
    const video = videoRef.current
    const show = () => { video.style.opacity = '1' }
    video.addEventListener('canplay', show, { once: true })
    return () => video.removeEventListener('canplay', show)
  }, [])

  return (
    <span className={styles.wrap} aria-label="Amplified.">
      {/* White SVG text — always visible, even before the video loads */}
      <svg
        className={styles.svg}
        viewBox="0 0 1000 220"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <text
          x="500"
          y="158"
          textAnchor="middle"
          fill="white"
          className={styles.letterText}
        >
          Amplified.
        </text>
      </svg>

      {/* Video fades in via JS; multiply blend makes it visible only inside white letters */}
      <video
        ref={videoRef}
        className={styles.videoOverlay}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      {/* Brand tint — screen blend adds purple→cyan colour cast inside the letters */}
      <div className={styles.colorTint} aria-hidden />
    </span>
  )
}
