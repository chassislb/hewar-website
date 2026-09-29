import { Link } from 'react-router-dom'
import Container from '../../ui/Container/Container'
import Button from '../../ui/Button/Button'
import { SOCIAL_LINKS } from '../../../utils/constants'
import { SOCIAL_META } from '../../icons/SocialIcons'
import { useCursor } from '../../../context/CursorContext'
import { useContactModal } from '../../../context/ContactModalContext'
import { useTranslation } from '../../../i18n/useTranslation'
import styles from './Footer.module.css'

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