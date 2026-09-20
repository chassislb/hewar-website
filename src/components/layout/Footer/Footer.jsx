import { Link } from 'react-router-dom'
import Container from '../../ui/Container/Container'
import Button from '../../ui/Button/Button'
import { CONTACT_EMAIL, SOCIAL_LINKS } from '../../../utils/constants'
import { useCursor } from '../../../context/CursorContext'
import { useContactModal } from '../../../context/ContactModalContext'
import { useTranslation } from '../../../i18n/useTranslation'
import styles from './Footer.module.css'

const SOCIAL_META = {
  linkedin: {
    label: 'LinkedIn',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zm-1.5-10.25A1.75 1.75 0 1 1 8.25 7a1.75 1.75 0 0 1-1.75 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0 0 13 14.19a.66.66 0 0 0 0 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
      </svg>
    ),
  },
  x: {
    label: 'X',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.9 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932Zm-1.29 19.497h2.039L6.486 3.24H4.298Z" />
      </svg>
    ),
  },
  instagram: {
    label: 'Instagram',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
        <circle cx="12" cy="12" r="4.3" />
        <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
}

const Footer = () => {
  const { setCursor, resetCursor } = useCursor()
  const { openContactModal } = useContactModal()
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.bg} aria-hidden>
        <div className={styles.orb} />
        <div className={styles.topBorder} />
      </div>

      <Container>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link
              to="/"
              className={styles.logo}
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={resetCursor}
            >
              <img
                src={`${import.meta.env.BASE_URL}hewar-logo-white.svg`}
                alt="HEWAR Group"
                className={styles.logoImg}
                height="48"
              />
            </Link>

            <p className={styles.tagline}>{t('footer.tagline')}</p>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className={styles.email}
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={resetCursor}
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <div className={styles.social}>
            <span className={styles.colLabel}>{t('footer.followUs')}</span>
            <ul className={styles.socialList}>
              {Object.entries(SOCIAL_LINKS).map(([platform, url]) => (
                <li key={platform}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    aria-label={SOCIAL_META[platform].label}
                    onMouseEnter={() => setCursor('hover')}
                    onMouseLeave={resetCursor}
                  >
                    {SOCIAL_META[platform].icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.miniCta}>
          <p className={styles.miniCtaText}>{t('footer.miniCta')}</p>

          <Button
            variant="primary"
            size="sm"
            onClick={openContactModal}
            onMouseEnter={() => setCursor('hover')}
            onMouseLeave={resetCursor}
          >
            {t('footer.hewarUs')}
          </Button>
        </div>

        <div className={styles.bottom}>
          <span className={styles.copy}>
            © {year} {t('common.siteName')}. {t('footer.rightsReserved')}
          </span>

          <div className={styles.legal}>
            <Link to="/privacy" className={styles.legalLink}>
              {t('footer.privacy')}
            </Link>
            <Link to="/terms" className={styles.legalLink}>
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer