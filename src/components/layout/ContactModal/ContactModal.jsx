import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '../../ui/Button/Button'
import { useContactModal } from '../../../context/ContactModalContext'
import { useCursor } from '../../../context/CursorContext'
import { useTranslation } from '../../../i18n/useTranslation'
import styles from './ContactModal.module.css'

const backdropVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.3 } },
}

const panelVariants = {
  closed: { opacity: 0, y: 24, scale: 0.98 },
  open: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

const ContactModal = () => {
  const { isOpen, closeContactModal } = useContactModal()
  const { setCursor, resetCursor } = useCursor()
  const { t } = useTranslation()
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', company: '', email: '', message: '' })

  const contactInfo = [
    { label: t('contact.emailLabel'), value: 'info@hewargroup.com', href: 'mailto:info@hewargroup.com' },
    { label: t('contact.phoneLabel'), value: '+966 56 775 5776', href: 'tel:+966567755776' },
    { label: t('contact.riyadhLabel'), value: t('contact.riyadhValue'), href: null },
    { label: t('contact.beirutLabel'), value: t('contact.beirutValue'), href: null },
  ]

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeContactModal()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, closeContactModal])

  useEffect(() => {
    if (isOpen) return
    // reset a moment after close, once the exit animation has played
    const id = setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', company: '', email: '', message: '' })
    }, 300)
    return () => clearTimeout(id)
  }, [isOpen])

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Contact form submitted:', formData)
    setSubmitted(true)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.backdrop}
          variants={backdropVariants}
          initial="closed"
          animate="open"
          exit="closed"
          onClick={closeContactModal}
        >
          <motion.div
            className={styles.panel}
            variants={panelVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Contact HEWAR Group"
          >
            <button
              type="button"
              className={styles.closeButton}
              onClick={closeContactModal}
              aria-label="Close"
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={resetCursor}
            >
              <span aria-hidden>×</span>
            </button>

            <div className={styles.grid}>
              <div className={styles.infoCol}>
                <p className={styles.eyebrow}>
                  <span className={styles.eyebrowDot} aria-hidden />
                  {t('contact.eyebrow')}
                </p>
                <h2 className={styles.title}>{t('contact.title')}</h2>
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

              <div className={styles.formCol}>
                {submitted ? (
                  <div className={styles.successState}>
                    <div className={styles.successIcon} aria-hidden>
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M10 16.5l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h3 className={styles.successTitle}>{t('contact.thankYou')}</h3>
                    <p className={styles.successBody}>
                      {t('contact.thankYouBody')}
                    </p>
                  </div>
                ) : (
                  <form className={styles.form} onSubmit={handleSubmit} noValidate>
                    <div className={styles.formRow}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel} htmlFor="modal-name">{t('contact.name')}</label>
                        <input
                          id="modal-name"
                          name="name"
                          type="text"
                          required
                          autoComplete="name"
                          className={styles.fieldInput}
                          placeholder={t('contact.namePlaceholder')}
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel} htmlFor="modal-company">{t('contact.company')}</label>
                        <input
                          id="modal-company"
                          name="company"
                          type="text"
                          autoComplete="organization"
                          className={styles.fieldInput}
                          placeholder={t('contact.companyPlaceholder')}
                          value={formData.company}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel} htmlFor="modal-email">{t('contact.emailLabel')}</label>
                      <input
                        id="modal-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        className={styles.fieldInput}
                        placeholder={t('contact.emailPlaceholder')}
                        value={formData.email}
                        onChange={handleChange}
                        dir="ltr"
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel} htmlFor="modal-message">{t('contact.message')}</label>
                      <textarea
                        id="modal-message"
                        name="message"
                        required
                        rows={4}
                        className={styles.fieldTextarea}
                        placeholder={t('contact.messagePlaceholder')}
                        value={formData.message}
                        onChange={handleChange}
                      />
                    </div>
                    <Button
                      variant="primary"
                      size="lg"
                      type="submit"
                      onMouseEnter={() => setCursor('hover')}
                      onMouseLeave={resetCursor}
                    >
                      {t('contact.send')}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ContactModal
