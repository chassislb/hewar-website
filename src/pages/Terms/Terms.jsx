import { motion } from 'framer-motion'
import Container from '../../components/ui/Container/Container'
import { CONTACT_EMAIL } from '../../utils/constants'
import styles from '../Privacy/Privacy.module.css'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

const Terms = () => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
    <section className={styles.hero}>
      <div className={styles.heroOrb} aria-hidden />
      <Container>
        <p className={styles.eyebrow}>
          <span className={styles.eyebrowDot} aria-hidden />
          Legal
        </p>
        <h1 className={styles.title}>Terms of Use</h1>
        <p className={styles.updated}>Last updated: 2026</p>
      </Container>
    </section>

    <section className={styles.body}>
      <Container size="narrow">
        <div className={styles.prose}>
          <p className={styles.notice}>
            This is a general placeholder terms page provided for site-review
            purposes. Please have HEWAR Group&rsquo;s legal counsel review and
            finalize this content before public launch.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing this website, you agree to be bound by these Terms of
            Use. If you do not agree with any part of these terms, please do
            not use this site.
          </p>

          <h2>2. Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, and
            case study visuals, is the property of HEWAR Group or its clients
            and partners, and is protected by applicable intellectual property
            laws. Case studies are presented with permission and represent
            creative and communications work delivered by HEWAR Group.
          </p>

          <h2>3. Use of Website</h2>
          <p>
            You agree to use this website only for lawful purposes and in a way
            that does not infringe the rights of, or restrict or inhibit the
            use and enjoyment of, this site by any third party.
          </p>

          <h2>4. No Warranty</h2>
          <p>
            This website and its content are provided on an &ldquo;as is&rdquo;
            basis without warranties of any kind, express or implied.
          </p>

          <h2>5. Limitation of Liability</h2>
          <p>
            HEWAR Group shall not be liable for any damages arising from the
            use of, or inability to use, this website.
          </p>

          <h2>6. Contact</h2>
          <p>
            Questions about these terms can be sent to{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        </div>
      </Container>
    </section>
  </motion.div>
)

export default Terms
