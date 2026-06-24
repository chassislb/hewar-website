import styles from './AnimatedAmplified.module.css'

const VIDEO_SRC = '/hewar-website/videos/amplified.mp4'

const AnimatedAmplified = () => (
  <span className={styles.wrap} aria-label="Amplified.">
    {/* White SVG text — multiply blend makes video visible only inside letters */}
    <svg
      className={styles.svg}
      viewBox="0 0 1000 220"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
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

    {/* Video sweeps LTR; mix-blend-mode:multiply × white text = video shows through letters */}
    <video
      className={styles.videoOverlay}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
    >
      <source src={VIDEO_SRC} type="video/mp4" />
    </video>

    {/* Brand-color tint layered over video via screen blend */}
    <div className={styles.colorTint} aria-hidden />
  </span>
)

export default AnimatedAmplified
