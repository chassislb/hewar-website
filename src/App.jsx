import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CursorProvider } from './context/CursorContext'
import { SectionThemeProvider } from './context/SectionThemeContext'
import { ContactModalProvider } from './context/ContactModalContext'
import { LanguageProvider } from './context/LanguageContext'
import SmoothScroll from './components/layout/SmoothScroll/SmoothScroll'
import ParticleField from './components/layout/ParticleField/ParticleField'
import Cursor from './components/layout/Cursor/Cursor'
import Preloader from './components/layout/Preloader/Preloader'
import Navbar from './components/layout/Navbar/Navbar'
import Footer from './components/layout/Footer/Footer'
import ContactModal from './components/layout/ContactModal/ContactModal'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import ServicesPage from './pages/Services/ServicesPage'
import WorkPage from './pages/Work/WorkPage'
import WorkDetail from './pages/WorkDetail/WorkDetail'
import InsightsPage from './pages/Insights/InsightsPage'
import InsightDetail from './pages/InsightDetail/InsightDetail'
import Contact from './pages/Contact/Contact'
import Privacy from './pages/Privacy/Privacy'
import Terms from './pages/Terms/Terms'
import NotFound from './pages/NotFound/NotFound'
import './styles/globals.css'
import './styles/utilities.css'

const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.25 },
  },
}

const App = () => {
  const [ready, setReady] = useState(() =>
    sessionStorage.getItem('hewar-loaded') === 'true'
  )

  const handlePreloaderDone = () => {
    sessionStorage.setItem('hewar-loaded', 'true')
    setReady(true)
  }

  return (
    <BrowserRouter basename="/hewar-website">
      <LanguageProvider>
        <SectionThemeProvider>
          <CursorProvider>
            <ContactModalProvider>
              <SmoothScroll>
                {!ready && <Preloader onComplete={handlePreloaderDone} />}

                <ParticleField />
                <Cursor />
                <Navbar />
                <ContactModal />

                <AnimatePresence mode="wait">
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <motion.div
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          <Home />
                        </motion.div>
                      }
                    />

                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/work" element={<WorkPage />} />
                    <Route path="/work/:id" element={<WorkDetail />} />
                    <Route path="/insights" element={<InsightsPage />} />
                    <Route path="/insights/:id" element={<InsightDetail />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AnimatePresence>

                <Footer />
              </SmoothScroll>
            </ContactModalProvider>
          </CursorProvider>
        </SectionThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}

export default App
