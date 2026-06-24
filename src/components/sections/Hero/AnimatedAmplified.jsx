import styles from './AnimatedAmplified.module.css'

const VIDEO_SRC = '/hewar-website/videos/amplified.mp4'

const AnimatedAmplified = () => {
  return (
    <span className={styles.wrap} aria-label="Amplified.">
      <svg
        className={styles.svg}
        viewBox="0 0 1000 220"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <mask id="amplifiedVideoMask">
            <rect width="1000" height="220" fill="black" />
            <text
              x="500"
              y="158"
              textAnchor="middle"
              className={styles.letterText}
              fill="white"
            >
              Amplified.
            </text>
          </mask>
        </defs>

        <foreignObject
          x="0"
          y="0"
          width="1000"
          height="220"
          mask="url(#amplifiedVideoMask)"
        >
          <div className={styles.videoHolder} xmlns="http://www.w3.org/1999/xhtml">
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
              tabIndex="-1"
            >
              <source src={VIDEO_SRC} type="video/mp4" />
            </video>
          </div>
        </foreignObject>

        <text
          x="500"
          y="158"
          textAnchor="middle"
          className={styles.strokeText}
        >
          Amplified.
        </text>
      </svg>
    </span>
  )
}

export default AnimatedAmplified