import { useId } from 'react'
import styles from './ServiceGlyph.module.css'

/*
  Abstract glow icons for the Services cards.
  Each glyph = one silhouette drawn three times:
    1. a soft outer glow (heavily blurred)
    2. the solid gradient body (crisp edge, violet → blue → cyan)
    3. a light "hotspot" masked inside the body — this is what moves on hover
  No tile behind them — the glow sits straight on the section.
  `shown` drives the pop-in; it replays every time the card scrolls back into view.
*/

const s = styles

const GLYPHS = [
  // 01 — Strategic Corporate Communication: a send/launch arrow
  {
    key: 'strategy',
    round: 10,
    hot: { cx: 40, cy: 70 },
    shape: () => <path d="M90 10 L10 42 L44 56 L58 90 Z" />,
  },
  // 02 — PR and Media: speech bubble
  {
    key: 'pr',
    round: 4,
    hot: { cx: 30, cy: 72 },
    shape: () => (
      <>
        <rect x="10" y="16" width="80" height="58" rx="29" />
        <path d="M24 62 L14 96 L52 70 Z" />
      </>
    ),
    overlay: () => (
      <g className={s.dots}>
        <circle cx="34" cy="45" r="4.5" />
        <circle cx="50" cy="45" r="4.5" />
        <circle cx="66" cy="45" r="4.5" />
      </g>
    ),
  },
  // 03 — Content and Editorial: lines of copy
  {
    key: 'editorial',
    round: 0,
    hot: { cx: 22, cy: 86 },
    shape: () => (
      <>
        <rect className={s.line1} x="6" y="16" width="88" height="18" rx="9" />
        <rect className={s.line2} x="6" y="42" width="68" height="18" rx="9" />
        <rect className={s.line3} x="6" y="68" width="46" height="18" rx="9" />
      </>
    ),
  },
  // 04 — Creative Lab: the iridescent orb
  {
    key: 'lab',
    round: 0,
    hot: { cx: 50, cy: 34 },
    shape: () => <circle cx="50" cy="50" r="36" />,
    inner: (id) => (
      <ellipse
        className={s.band}
        cx="50"
        cy="66"
        rx="44"
        ry="7"
        fill={`url(#${id}-band)`}
        filter={`url(#${id}-bm)`}
      />
    ),
  },
  // 05 — Digital Marketing: rising bars
  {
    key: 'digital',
    round: 0,
    hot: { cx: 30, cy: 96 },
    shape: () => (
      <>
        <rect className={s.bar1} x="8" y="58" width="22" height="36" rx="11" />
        <rect className={s.bar2} x="39" y="36" width="22" height="58" rx="11" />
        <rect className={s.bar3} x="70" y="10" width="22" height="84" rx="11" />
      </>
    ),
  },
  // 06 — Monitoring and Media Research: lens
  {
    key: 'monitor',
    round: 6,
    hot: { cx: 26, cy: 64 },
    shape: () => (
      <>
        <path
          fillRule="evenodd"
          d="M12 44 a32 32 0 1 0 64 0 a32 32 0 1 0 -64 0 Z M28 44 a16 16 0 1 0 32 0 a16 16 0 1 0 -32 0 Z"
        />
        <path d="M62 68 L68 62 L94 88 L88 94 Z" />
      </>
    ),
  },
  // 07 — Events Management: sparkle
  {
    key: 'events',
    round: 0,
    hot: { cx: 50, cy: 78 },
    shape: () => (
      <path d="M50 4 C54 38 62 46 96 50 C62 54 54 62 50 96 C46 62 38 54 4 50 C38 46 46 38 50 4 Z" />
    ),
    overlay: () => (
      <path
        className={s.spark}
        d="M74 12 C75 21 77 23 86 24 C77 25 75 27 74 36 C73 27 71 25 62 24 C71 23 73 21 74 12 Z"
        fill="#fff"
      />
    ),
  },
]

const ServiceGlyph = ({ index, active = false, shown = true, className = '' }) => {
  const id = `g${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const g = GLYPHS[index % GLYPHS.length]
  const Shape = g.shape

  return (
    <svg
      className={`${s.glyph} ${s[g.key]} ${className}`}
      data-active={active || undefined}
      data-shown={shown || undefined}
      viewBox="0 0 100 100"
      aria-hidden
      focusable="false"
    >
      <defs>

        <linearGradient id={`${id}-body`} gradientUnits="userSpaceOnUse" x1="10" y1="10" x2="90" y2="95">
          <stop offset="0" stopColor="#4700B3" />
          <stop offset="0.5" stopColor="#2F3DFF" />
          <stop offset="1" stopColor="#00C8FF" />
        </linearGradient>

        <radialGradient id={`${id}-hot`}>
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.35" stopColor="#CFEFFF" stopOpacity="0.9" />
          <stop offset="0.7" stopColor="#00C8FF" stopOpacity="0.45" />
          <stop offset="1" stopColor="#00C8FF" stopOpacity="0" />
        </radialGradient>

        <linearGradient id={`${id}-band`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#00C8FF" />
          <stop offset="0.5" stopColor="#FF5FD2" />
          <stop offset="1" stopColor="#FFD6A5" />
        </linearGradient>

        <filter id={`${id}-bs`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
        <filter id={`${id}-bm`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id={`${id}-bl`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="10" />
        </filter>

        <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x="-20" y="-20" width="140" height="140">
          <g fill="#fff" stroke="#fff" strokeWidth={g.round} strokeLinejoin="round">
            <Shape />
          </g>
        </mask>
      </defs>

      <g className={s.pop}>
        <g className={s.wrap}>
          <g className={s.glow} fill={`url(#${id}-body)`} filter={`url(#${id}-bl)`}>
            <Shape />
          </g>

          <g
            fill={`url(#${id}-body)`}
            stroke={`url(#${id}-body)`}
            strokeWidth={g.round}
            strokeLinejoin="round"
            filter={`url(#${id}-bs)`}
          >
            <Shape />
          </g>

          <g mask={`url(#${id}-mask)`}>
            <g className={s.hotMove}>
              <ellipse
                className={s.hot}
                cx={g.hot.cx}
                cy={g.hot.cy}
                rx="38"
                ry="34"
                fill={`url(#${id}-hot)`}
                filter={`url(#${id}-bm)`}
              />
            </g>
            {g.inner?.(id)}
          </g>

          {g.overlay?.()}
        </g>
      </g>
    </svg>
  )
}

export default ServiceGlyph
