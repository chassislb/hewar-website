import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import App from './App.jsx'

/* Register GSAP plugins once at app entry */
gsap.registerPlugin(ScrollTrigger)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
