import styles from './AnimatedAmplified.module.css'

const VIDEO_SRC = '/hewar-website/videos/amplified.mp4'

const AnimatedAmplified = () => (
  <span className={styles.wrap} aria-label="Amplified.">
    <video
      className={styles.video}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      controls={false}
      disablePictureInPicture
      controlsList="nodownload noplaybackrate nofullscreen"
      aria-hidden="true"
      tabIndex="-1"
    >
      <source src={VIDEO_SRC} type="video/mp4" />
    </video>

    <svg
      className={styles.svg}
      viewBox="0 0 1000 220"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <mask id="amplifiedTextMask">
          <rect width="1000" height="220" fill="white" />
          <text
            x="500"
            y="158"
            textAnchor="middle"
            className={styles.letterText}
            fill="black"
          >
            Amplified.
          </text>
        </mask>
      </defs>

      <rect
        width="1000"
        height="220"
        fill="var(--color-bg-primary)"
        mask="url(#amplifiedTextMask)"
      />
    </svg>
  </span>
)

export default AnimatedAmplified