import { Link } from 'react-router-dom'
import Container from '../../ui/Container/Container'
import { navLinks } from '../../../data/navigation'
import { SITE_NAME, SITE_TAGLINE, CONTACT_EMAIL, SOCIAL_LINKS } from '../../../utils/constants'
import { useCursor } from '../../../context/CursorContext'
import styles from './Footer.module.css'

const Footer = () => {
  const { setCursor, resetCursor } = useCursor()
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.top}>
          {/* Brand column */}
          <div className={styles.brand}>
            <Link
              to="/"
              className={styles.logo}
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={resetCursor}
            >
              <span className={styles.logoDots}>
                <span /><span /><span />
              </span>
              <span className={styles.logoText}>
                HEWAR<span className={styles.logoSub}>GROUP</span>
              </span>
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

          {/* Navigation column */}
          <div className={styles.nav}>
            <span className={styles.colLabel}>Navigation</span>
            <ul className={styles.navList}>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className={styles.navLink}
                    onMouseEnter={() => setCursor('hover')}
                    onMouseLeave={resetCursor}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/contact"
                  className={styles.navLink}
                  onMouseEnter={() => setCursor('hover')}
                  onMouseLeave={resetCursor}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social column */}
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

        <div className={styles.bottom}>
          <span className={styles.copy}>
            © {year} {SITE_NAME}. All rights reserved.
          </span>
          <div className={styles.legal}>
            <Link to="/privacy" className={styles.legalLink}>Privacy Policy</Link>
            <Link to="/terms"   className={styles.legalLink}>Terms of Use</Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
