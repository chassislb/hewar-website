import styles from './AnimatedAmplified.module.css'

const KEYWORDS = [
  'Influence',
  'Reputation',
  'Campaigns',
  'Media',
  'PR',
  'Creative',
  'Strategy',
  'Innovation',
  'Events',
  'Digital',
]

/* ── Place your video at: public/videos/amplified.mp4
      then change this to: '/hewar-website/videos/amplified.mp4'  ── */
const VIDEO_SRC = '/hewar-website/videos/amplified.mp4'

const AnimatedAmplified = () => {
  return (
    <span className={styles.wrap} aria-label="Amplified.">
      <svg
        className={styles.svg}
        viewBox="0 0 1000 220"
        preserveAspectRatio="xMidYMid meet"
        role="img"
      >
        <defs>
          <linearGradient id="amplifiedGradient" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#4700B3" />
            <stop offset="55%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#00C8FF" />
          </linearGradient>

          <mask id="amplifiedMask">
            <rect width="1000" height="220" fill="black" />
            <text
              x="500"
              y="158"
              textAnchor="middle"
              className={styles.maskText}
            >
              Amplified.
            </text>
          </mask>
        </defs>

        <g mask="url(#amplifiedMask)">

          {/* Video fill — clipped to letter shapes by the SVG mask, moves LTR */}
          {VIDEO_SRC && (
            <foreignObject x="0" y="0" width="1000" height="220">
              <video
                autoPlay
                muted
                loop
                playsInline
                className={styles.videoFill}
              >
                <source src={VIDEO_SRC} type="video/mp4" />
              </video>
            </foreignObject>
          )}

          {/* Gradient tint — full opacity with no video, accent layer when video is on */}
          <rect
            width="1000"
            height="220"
            fill="url(#amplifiedGradient)"
            opacity={VIDEO_SRC ? 0.45 : 1}
          />

          <g className={styles.network}>
            <line x1="80" y1="60" x2="230" y2="130" />
            <line x1="230" y1="130" x2="390" y2="70" />
            <line x1="390" y1="70" x2="560" y2="145" />
            <line x1="560" y1="145" x2="760" y2="80" />
            <line x1="760" y1="80" x2="920" y2="150" />

            <circle cx="80" cy="60" r="7" />
            <circle cx="230" cy="130" r="9" />
            <circle cx="390" cy="70" r="6" />
            <circle cx="560" cy="145" r="8" />
            <circle cx="760" cy="80" r="7" />
            <circle cx="920" cy="150" r="9" />
          </g>

          {KEYWORDS.map((word, index) => (
            <text
              key={word}
              x="500"
              y="118"
              textAnchor="middle"
              className={styles.keyword}
              style={{ animationDelay: `${index * 1.6}s` }}
            >
              {word}
            </text>
          ))}

        </g>
      </svg>
    </span>
  )
}

export default AnimatedAmplified