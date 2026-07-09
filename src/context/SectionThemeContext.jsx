import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

const SectionThemeContext = createContext('dark')

/*
  Sections opt in via data-section-theme="dark" | "light". Whichever
  section's own center is closest to the viewport center wins — this
  stays unambiguous even when a tall section overlaps the trigger zone
  of its neighbor. Falls back to 'dark' on routes with no themed
  sections (e.g. inner pages).
*/
export const SectionThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark')
  const ticking = useRef(false)
  const location = useLocation()

  const evaluate = useCallback(() => {
    ticking.current = false
    const sections = document.querySelectorAll('[data-section-theme]')

    if (sections.length === 0) {
      setTheme('dark')
      return
    }

    const viewportCenter = window.innerHeight / 2
    let closest = null
    let closestDistance = Infinity

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect()
      const sectionCenter = rect.top + rect.height / 2
      const distance = Math.abs(sectionCenter - viewportCenter)
      if (distance < closestDistance) {
        closestDistance = distance
        closest = section
      }
    })

    if (closest) setTheme(closest.dataset.sectionTheme)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(evaluate)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [evaluate])

  /* Re-evaluate on route change, since sections mount/unmount with the page */
  useEffect(() => {
    evaluate()
  }, [evaluate, location.pathname])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <SectionThemeContext.Provider value={theme}>
      {children}
    </SectionThemeContext.Provider>
  )
}

export const useSectionTheme = () => useContext(SectionThemeContext)
