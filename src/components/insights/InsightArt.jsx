import styles from './InsightArt.module.css'

/*
  Cover art for an insight. If the article has an image it is used; otherwise a
  one-of-a-kind brand-coloured cover is generated from the article id, so every
  piece looks designed even before it has artwork.
*/
const PALETTES = [
  ['#4700B3', '#00C8FF', '#2F3DFF'],
  ['#0A2255', '#6200F0', '#00C8FF'],
  ['#2F3DFF', '#00C8FF', '#4700B3'],
  ['#6200F0', '#2F3DFF', '#0A2255'],
  ['#00A8E6', '#4700B3', '#061A40'],
  ['#4700B3', '#2F3DFF', '#00A8E6'],
]

const hash = (s) => {
  let h = 2166136261
  for (const ch of s) {
    h ^= ch.codePointAt(0)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const InsightArt = ({ id, image, className = '' }) => {
  const h = hash(id)
  const p = PALETTES[h % PALETTES.length]
  const pos = (shift, min, span) => `${min + ((h >>> shift) % span)}%`

  const style = {
    '--c1': p[0],
    '--c2': p[1],
    '--c3': p[2],
    '--ax': pos(0, 5, 45),
    '--ay': pos(5, 0, 40),
    '--bx': pos(9, 35, 50),
    '--by': pos(13, 30, 45),
    '--cx': pos(17, 10, 55),
    '--cy': pos(21, 50, 40),
    '--tilt': `${(h % 40) + 100}deg`,
  }

  return (
    <div className={`${styles.art} ${className}`} style={style} aria-hidden>
      {image ? (
        <img className={styles.image} src={image} alt="" loading="lazy" />
      ) : (
        <>
          <span className={`${styles.blob} ${styles.a}`} />
          <span className={`${styles.blob} ${styles.b}`} />
          <span className={`${styles.blob} ${styles.c}`} />
          <span className={styles.lines} />
          <span className={styles.mark}>“</span>
        </>
      )}
      <span className={styles.shade} />
    </div>
  )
}

export default InsightArt
