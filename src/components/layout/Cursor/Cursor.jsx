import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useCursor } from '../../../context/CursorContext'
import { useSectionTheme } from '../../../context/SectionThemeContext'
import { useIsMobile } from '../../../hooks/useMediaQuery'
import styles from './Cursor.module.css'

const Cursor = () => {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const { cursorType, cursorLabel } = useCursor()
  const isMobile = useIsMobile()
  const theme = useSectionTheme()
  const themeClass = theme === 'light' ? styles.themeLight : ''

  useEffect(() => {
    if (isMobile) return

    let mouseX = window.innerWidth  / 2
    let mouseY = window.innerHeight / 2
    let ringX  = mouseX
    let ringY  = mouseY

    const dotSetter  = { x: gsap.quickSetter(dotRef.current,  'x', 'px'), y: gsap.quickSetter(dotRef.current,  'y', 'px') }
    const ringSetter = { x: gsap.quickSetter(ringRef.current, 'x', 'px'), y: gsap.quickSetter(ringRef.current, 'y', 'px') }

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dotSetter.x(mouseX)
      dotSetter.y(mouseY)
    }

    /* Ring follows with lerp (spring-like lag) */
    const ticker = gsap.ticker.add(() => {
      ringX += (mouseX - ringX) * 0.1
      ringY += (mouseY - ringY) * 0.1
      ringSetter.x(ringX)
      ringSetter.y(ringY)
    })

    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      gsap.ticker.remove(ticker)
    }
  }, [isMobile])

  if (isMobile) return null

  return (
    <>
      {/* Inner dot — snaps instantly */}
      <div
        ref={dotRef}
        className={`${styles.dot} ${cursorType !== 'default' ? styles.dotHidden : ''} ${themeClass}`}
        aria-hidden
      />

      {/* Outer ring — lags behind */}
      <div
        ref={ringRef}
        className={`${styles.ring} ${styles[cursorType]} ${themeClass}`}
        aria-hidden
      >
        {cursorLabel && (
          <span className={styles.label}>{cursorLabel}</span>
        )}
      </div>
    </>
  )
}

export default Cursor
