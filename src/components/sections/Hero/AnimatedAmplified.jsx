import styles from './AnimatedAmplified.module.css'

const VIDEO_SRC = '/hewar-website/videos/amplified.mp4'

const AnimatedAmplified = () => {
  return (
    <span className={styles.wrap} aria-label="Amplified.">
      <svg
        className={styles.svg}
        viewBox="0 0 1000 220"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-hidden
      >
        <defs>
          <clipPath id="amplifiedClip">
            <text
              x="500"
              y="158"
              textAnchor="middle"
              className={styles.maskText}
            >
              Amplified.
            </text>
          </clipPath>

          <linearGradient id="amplifiedTint" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#4700B3" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#2563EB" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#00C8FF" stopOpacity="0.55" />
          </linearGradient>
        </defs>

        <g clipPath="url(#amplifiedClip)">
          <foreignObject x="0" y="0" width="1000" height="220">
            <div className={styles.videoBox} xmlns="http://www.w3.org/1999/xhtml">
              <video
                className={styles.video}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              >
                <source src={VIDEO_SRC} type="video/mp4" />
              </video>
            </div>
          </foreignObject>

          <rect
            x="0"
            y="0"
            width="1000"
            height="220"
            fill="url(#amplifiedTint)"
            className={styles.tint}
          />
        </g>
      </svg>
    </span>
  )
}

export default AnimatedAmplified