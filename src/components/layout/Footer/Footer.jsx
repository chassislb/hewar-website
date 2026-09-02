import { Link } from 'react-router-dom'
import Container from '../../ui/Container/Container'
import Button from '../../ui/Button/Button'
import { SITE_NAME, SITE_TAGLINE, CONTACT_EMAIL, SOCIAL_LINKS } from '../../../utils/constants'
import { useCursor } from '../../../context/CursorContext'
import styles from './Footer.module.css'

const Footer = () => {
  const { setCursor, resetCursor } = useCursor()
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

            <p className={styles.tagline}>{SITE_TAGLINE}</p>

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
            <span className={styles.colLabel}>Follow Us</span>
            <ul className={styles.navList}>
              {Object.entries(SOCIAL_LINKS).map(([platform, url]) => (
                <li key={platform}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.navLink}
                    onMouseEnter={() => setCursor('hover')}
                    onMouseLeave={resetCursor}
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.miniCta}>
          <p className={styles.miniCtaText}>Build something people remember.</p>

          <Button
            variant="primary"
            size="sm"
            href="/contact"
            onMouseEnter={() => setCursor('hover')}
            onMouseLeave={resetCursor}
          >
            Let’s Talk
          </Button>
        </div>

        <div className={styles.bottom}>
          <span className={styles.copy}>
            © {year} {SITE_NAME}. All rights reserved.
          </span>

          <div className={styles.legal}>
            <Link to="/privacy" className={styles.legalLink}>
              Privacy Policy
            </Link>
            <Link to="/terms" className={styles.legalLink}>
              Terms of Use
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer