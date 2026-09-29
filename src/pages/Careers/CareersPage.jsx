import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Container from '../../components/ui/Container/Container'
import Button from '../../components/ui/Button/Button'
import { useTranslation } from '../../i18n/useTranslation'
import styles from './CareersPage.module.css'

gsap.registerPlugin(ScrollTrigger)

const VIDEO_SRC = 'https://hewar-media.netlify.app/careers-hero.mp4'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

const CareersPage = () => {
  const { t } = useTranslation()
  const benefits = t('careersPage.benefits')

  const heroRef = useRef(null)
  const benefitsRef = useRef(null)
  const applyRef = useRef(null)

  const [isDragging, setIsDragging] = useState(false)
  const [cvFile, setCvFile] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', mobile: '', jobTitle: '',
  })

  useGSAP(() => {
    gsap.fromTo('[data-page-eyebrow]', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 })
    gsap.fromTo('[data-page-title]', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.2 })
  }, { scope: heroRef })

  useGSAP(() => {
    gsap.fromTo('[data-benefit-card]',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: benefitsRef.current, start: 'top 80%' } }
    )
  }, { scope: benefitsRef })

  useGSAP(() => {
    gsap.fromTo('[data-apply-reveal]',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: applyRef.current, start: 'top 80%' } }
    )
  }, { scope: applyRef })

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFile = (file) => {
    if (file) setCvFile(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Career application submitted:', { ...formData, cv: cvFile?.name })
    setSubmitted(true)
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {/* ── Hero ── */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroOrb} style={{ top: '-30%', right: '-15%', background: 'radial-gradient(circle, rgba(71,0,179,0.4) 0%, transparent 70%)', width: 'clamp(400px,60vw,900px)', height: 'clamp(400px,60vw,900px)' }} aria-hidden />
        <div className={styles.heroOrb} style={{ bottom: '-10%', left: '-8%', background: 'radial-gradient(circle, rgba(0,200,255,0.25) 0%, transparent 70%)', width: 'clamp(250px,40vw,600px)', height: 'clamp(250px,40vw,600px)' }} aria-hidden />
        <Container>
          <h1 className={styles.title} data-page-title>{t('careersPage.heroTitle')}</h1>
          <p className={styles.heroSub} data-page-eyebrow>{t('careersPage.heroTagline')}</p>

          <div className={styles.videoWrapper}>
            <video className={styles.video} src={VIDEO_SRC} controls playsInline />
          </div>
        </Container>
      </section>

      {/* ── Why Join Us ── */}
      <section className={styles.benefitsSection} ref={benefitsRef}>
        <Container>
          <p className={styles.sectionEyebrow}>{t('careersPage.whyJoinLabel')}</p>
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit) => (
              <div key={benefit.title} className={styles.benefitCard} data-benefit-card>
                <img
                  src={`${import.meta.env.BASE_URL}images/careers/${benefit.icon}.png`}
                  alt=""
                  className={styles.benefitIcon}
                  aria-hidden
                />
                <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                <p className={styles.benefitBody}>{benefit.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Apply ── */}
      <section className={styles.applySection} ref={applyRef}>
        <Container size="narrow">
          <p className={styles.sectionEyebrow} data-apply-reveal>{t('careersPage.applyLabel')}</p>

          {submitted ? (
            <div className={styles.successState} data-apply-reveal>
              <div className={styles.successIcon} aria-hidden>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M10 16.5l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className={styles.successTitle}>{t('careersPage.thankYou')}</h2>
              <p className={styles.successBody}>{t('careersPage.thankYouBody')}</p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate data-apply-reveal>
              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="firstName">{t('careersPage.formFirstName')}</label>
                  <input
                    id="firstName" name="firstName" type="text" required autoComplete="given-name"
                    className={styles.fieldInput} value={formData.firstName} onChange={handleChange}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="lastName">{t('careersPage.formLastName')}</label>
                  <input
                    id="lastName" name="lastName" type="text" required autoComplete="family-name"
                    className={styles.fieldInput} value={formData.lastName} onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="email">{t('careersPage.formEmail')}</label>
                  <input
                    id="email" name="email" type="email" required autoComplete="email" dir="ltr"
                    className={styles.fieldInput} value={formData.email} onChange={handleChange}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="mobile">{t('careersPage.formMobile')}</label>
                  <input
                    id="mobile" name="mobile" type="tel" required autoComplete="tel" dir="ltr"
                    className={styles.fieldInput} value={formData.mobile} onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="jobTitle">{t('careersPage.formJobTitle')}</label>
                <input
                  id="jobTitle" name="jobTitle" type="text" required
                  className={styles.fieldInput} value={formData.jobTitle} onChange={handleChange}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>{t('careersPage.formCv')}</label>
                <label
                  className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''} ${cvFile ? styles.dropzoneFilled : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  htmlFor="cv-upload"
                >
                  <input
                    id="cv-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className={styles.dropzoneInput}
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />
                  {cvFile ? (
                    <span className={styles.dropzoneFileName}>{cvFile.name}</span>
                  ) : (
                    <>
                      <span className={styles.dropzoneLabel}>{t('careersPage.formCv')}</span>
                      <span className={styles.dropzoneHint}>{t('careersPage.formCvHint')}</span>
                    </>
                  )}
                </label>
              </div>

              <Button variant="primary" size="lg" type="submit">
                {t('careersPage.formSubmit')}
              </Button>
            </form>
          )}
        </Container>
      </section>
    </motion.div>
  )
}

export default CareersPage
