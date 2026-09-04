import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null)
  const { pathname } = useLocation()

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis

    /* Keep ScrollTrigger in sync with Lenis scroll position */
    lenis.on('scroll', ScrollTrigger.update)

    /* Share a single RAF loop between Lenis and GSAP */
    const onTick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(onTick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  /* Jump to top on every route change — Lenis owns scroll, so a plain
     window.scrollTo alone gets overridden by its next raf tick. */
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
  }, [pathname])

  return <>{children}</>
}

export default SmoothScroll
