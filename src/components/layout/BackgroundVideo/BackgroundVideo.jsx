import styles from './BackgroundVideo.module.css'

export default function BackgroundVideo() {
  return (
    <div className={styles.wrapper} aria-hidden>
      <video
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source
          src="/hewar-website/videos/amplified.mp4"
          type="video/mp4"
        />
      </video>

      <div className={styles.overlay} />
    </div>
  )
}