import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CursorProvider } from './context/CursorContext'
import SmoothScroll from './components/layout/SmoothScroll/SmoothScroll'
import Cursor from './components/layout/Cursor/Cursor'
import Preloader from './components/layout/Preloader/Preloader'
import Navbar from './components/layout/Navbar/Navbar'
import Footer from './components/layout/Footer/Footer'
import Home from './pages/Home/Home'
import './styles/globals.css'
import './styles/utilities.css'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, transition: { duration: 0.25 } },
}

const ComingSoon = ({ title }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1.25rem',
      paddingTop: '6rem',
    }}
  >
    <span style={{
      fontSize: '0.7rem',
      fontWeight: 600,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: 'var(--color-cyan)',
    }}>
      Coming Soon
    </span>
    <h1 style={{
      fontSize: 'clamp(2.5rem, 6vw, 6rem)',
      fontWeight: 900,
      letterSpacing: '-0.04em',
      color: 'var(--color-text-primary)',
      margin: 0,
    }}>
      {title}
    </h1>
    <p style={{
      fontSize: '1rem',
      color: 'var(--color-text-secondary)',
      margin: 0,
    }}>
      This page is under construction. Check back soon.
    </p>
  </motion.div>
)

const App = () => {
  /* Show preloader only once per browser session */
  const [ready, setReady] = useState(() =>
    sessionStorage.getItem('hewar-loaded') === 'true'
  )

  const handlePreloaderDone = () => {
    sessionStorage.setItem('hewar-loaded', 'true')
    setReady(true)
  }

  return (
    <BrowserRouter basename="/hewar-website">
      <CursorProvider>
        <SmoothScroll>
          {/* Preloader blocks content on first visit */}
          {!ready && <Preloader onComplete={handlePreloaderDone} />}

          <Cursor />
          <Navbar />

          <AnimatePresence mode="wait">
            <Routes>
              <Route
                path="/"
                element={
                  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
                    <Home />
                  </motion.div>
                }
              />
              <Route path="/about"    element={<ComingSoon title="About" />} />
              <Route path="/services" element={<ComingSoon title="Services" />} />
              <Route path="/work"     element={<ComingSoon title="Work" />} />
              <Route path="/insights" element={<ComingSoon title="Insights" />} />
              <Route path="/contact"  element={<ComingSoon title="Contact" />} />
            </Routes>
          </AnimatePresence>

          <Footer />
        </SmoothScroll>
      </CursorProvider>
    </BrowserRouter>
  )
}

export default App
