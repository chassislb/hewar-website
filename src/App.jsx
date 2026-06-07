import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CursorProvider } from './context/CursorContext'
import SmoothScroll from './components/layout/SmoothScroll/SmoothScroll'
import Cursor from './components/layout/Cursor/Cursor'
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

/* Stub page for routes not yet built */
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
      gap: '1rem',
      paddingTop: '6rem',
    }}
  >
    <span style={{
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: 'var(--color-cyan)',
    }}>
      Coming Soon
    </span>
    <h1 style={{
      fontSize: 'clamp(2rem, 5vw, 5rem)',
      fontWeight: 900,
      letterSpacing: '-0.03em',
      color: 'var(--color-text-primary)',
    }}>
      {title}
    </h1>
  </motion.div>
)

const App = () => (
  <BrowserRouter>
    <CursorProvider>
      <SmoothScroll>
        <Cursor />
        <Navbar />

        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/"         element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><Home /></motion.div>} />
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

export default App
