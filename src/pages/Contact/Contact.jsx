import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Container from '../../components/ui/Container/Container'
import Button from '../../components/ui/Button/Button'
import styles from './Contact.module.css'

gsap.registerPlugin(ScrollTrigger)

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

const contactInfo = [
  {
    label: 'Email',
    value: 'info@hewargroup.com',
    href: 'mailto:info@hewargroup.com',
  },
  {
    label: 'Phone',
    value: '+966 56 775 5776',
    href: 'tel:+966567755776',
  },
  {
    label: 'Riyadh',
    value: 'Salah Ad Din Al Ayyubi Rd, Riyadh',
    href: null,
  },
  {
    label: 'Beirut',
    value: 'Beirut, Lebanon',
    href: null,
  },
]

const Contact = () => {
  const heroRef = useRef(null)
  const bodyRef = useRef(null)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    message: '',
  })

  useGSAP(() => {
    gsap.fromTo(
      '[data-page-eyebrow]',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 }
    )
    gsap.fromTo(
      '[data-page-title]',
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.2 }
    )
  }, { scope: heroRef })

  useGSAP(() => {
    gsap.fromTo(
      '[data-reveal]',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: bodyRef.current, start: 'top 82%' },
      }
    )
  }, { scope: bodyRef })

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Contact form submitted:', formData)
    setSubmitted(true)
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {/* ── Hero ── */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroOrb} style={{ top: '-30%', right: '-15%', background: 'radial-gradient(circle, rgba(71,0,179,0.4) 0%, transparent 70%)', width: 'clamp(400px,60vw,900px)', height: 'clamp(400px,60vw,900px)' }} aria-hidden />
        <div className={styles.heroOrb} style={{ bottom: '-10%', left: '-8%', background: 'radial-gradient(circle, rgba(0,200,255,0.25) 0%, transparent 70%)', width: 'clamp(250px,40vw,600px)', height: 'clamp(250px,40vw,600px)' }} aria-hidden />
        <Container>
          <p className={styles.eyebrow} data-page-eyebrow>
            <span className={styles.eyebrowDot} aria-hidden />
            Get in Touch
          </p>
          <h1 className={styles.title} data-page-title>
            Your next idea deserves amplification.
          </h1>
        </Container>
      </section>

      {/* ── Body ── */}
      <section className={styles.bodySection} ref={bodyRef}>
        <Container>
          <div className={styles.bodyGrid}>
            {/* Left: Contact Info */}
            <div className={styles.infoCol} data-reveal>
              <p className={styles.infoIntro}>
                We'd love to hear from you. Reach out to start a conversation
                about your brand, campaign, or next big idea.
              </p>
              <div className={styles.infoItems}>
                {contactInfo.map((item) => (
                  <div key={item.label} className={styles.infoItem}>
                    <span className={styles.infoLabel}>{item.label}</span>
                    {item.href ? (
                      <a href={item.href} className={styles.infoValue}>
                        {item.value}
                      </a>
                    ) : (
                      <span className={styles.infoValue}>{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <div className={styles.formCol} data-reveal>
              {submitted ? (
                <div className={styles.successState}>
                  <div className={styles.successIcon} aria-hidden>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M10 16.5l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h2 className={styles.successTitle}>Thank you, we'll be in touch.</h2>
                  <p className={styles.successBody}>
                    We've received your message and will get back to you within
                    one business day.
                  </p>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                  <div className={styles.formRow}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel} htmlFor="name">Name</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        className={styles.fieldInput}
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel} htmlFor="company">Company</label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        autoComplete="organization"
                        className={styles.fieldInput}
                        placeholder="Your company"
                        value={formData.company}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className={styles.fieldInput}
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      className={styles.fieldTextarea}
                      placeholder="Tell us about your project or idea..."
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>
                  <Button variant="primary" size="lg" type="submit">
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </Container>
      </section>
    </motion.div>
  )
}

export default Contact
