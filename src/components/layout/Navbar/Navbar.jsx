import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import Container from '../../ui/Container/Container'
import Button from '../../ui/Button/Button'
import { navLinks } from '../../../data/navigation'
import { useCursor } from '../../../context/CursorContext'
import { useScrollProgress } from '../../../hooks/useScrollProgress'
import styles from './Navbar.module.css'

const Navbar = () => {
  const [scrolled, setScrolled]     = useState(false)
  const [menuOpen, setMenuOpen]     = useState(false)
  const navRef                      = useRef(null)
  const location                    = useLocation()
  const { setCursor, resetCursor }  = useCursor()
  const scrollProgress              = useScrollProgress()

  useEffect(() => { setMenuOpen(false) }, [location])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const preloaderSeen = sessionStorage.getItem('hewar-loaded') === 'true'
    gsap.from(navRef.current, {
      y: -30, opacity: 0, duration: 1, delay: preloaderSeen ? 0.1 : 2.2, ease: 'power4.out',
    })
  }, [])

  const menuVariants = {
    closed: { clipPath: 'inset(0 0 100% 0)', opacity: 0, transition: { duration: 0.45, ease: [0.85, 0, 0.15, 1] } },
    open:   { clipPath: 'inset(0 0 0% 0)',   opacity: 1, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
  }

  const linkVariants = {
    closed: { opacity: 0, y: 24 },
    open:   (i) => ({ opacity: 1, y: 0, transition: { delay: 0.12 + i * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] } }),
  }

  return (
    <>
      <header
        ref={navRef}
        className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${menuOpen ? styles.menuOpen : ''}`}
      >
        {/* Scroll progress bar */}
        <div
          className={styles.progressBar}
          style={{ transform: `scaleX(${scrollProgress})` }}
          aria-hidden
        />

        <Container>
          <nav className={styles.inner}>
            {/* Logo */}
            <Link
              to="/"
              className={styles.logo}
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={resetCursor}
            >
              <span className={styles.logoMark}>
                <span className={styles.logoDot} />
                <span className={styles.logoDot} />
                <span className={styles.logoDot} />
              </span>
              <span className={styles.logoText}>
                HEWAR<span className={styles.logoSub}>GROUP</span>
              </span>
            </Link>

            {/* Desktop links */}
            <ul className={styles.links}>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className={`${styles.link} ${location.pathname.startsWith(link.href) ? styles.active : ''}`}
                    onMouseEnter={() => setCursor('hover')}
                    onMouseLeave={resetCursor}
                  >
                    {link.label}
                    <span className={styles.linkUnderline} />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop CTA */}
            <div className={styles.cta}>
              <Button
                variant="primary"
                size="sm"
                href="/contact"
                onMouseEnter={() => setCursor('hover')}
                onMouseLeave={resetCursor}
              >
                Let's Talk
              </Button>
            </div>

            {/* Hamburger */}
            <button
              className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={resetCursor}
            >
              <span className={styles.bar} />
              <span className={styles.bar} />
            </button>
          </nav>
        </Container>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.mobileMenu}
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <Container>
              <ul className={styles.mobileLinks}>
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    custom={i}
                    variants={linkVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    <Link
                      to={link.href}
                      className={styles.mobileLink}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className={styles.mobileLinkNum}>0{i + 1}</span>
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                className={styles.mobileCta}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.5 } }}
                exit={{ opacity: 0 }}
              >
                <Button variant="primary" href="/contact" onClick={() => setMenuOpen(false)}>
                  Let's Talk
                </Button>
              </motion.div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
