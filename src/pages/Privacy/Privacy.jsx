import { motion } from 'framer-motion'
import Container from '../../components/ui/Container/Container'
import { CONTACT_EMAIL } from '../../utils/constants'
import styles from './Privacy.module.css'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

const Privacy = () => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
    <section className={styles.hero}>
      <div className={styles.heroOrb} aria-hidden />
      <Container>
        <p className={styles.eyebrow}>
          <span className={styles.eyebrowDot} aria-hidden />
          Legal
        </p>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: 2026</p>
      </Container>
    </section>

    <section className={styles.body}>
      <Container size="narrow">
        <div className={styles.prose}>
          <p className={styles.notice}>
            This is a general placeholder policy provided for site-review purposes.
            Please have HEWAR Group&rsquo;s legal counsel review and finalize this
            content before public launch.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            We may collect information you provide directly to us, such as your
            name, company, email address, and any message content, when you use
            our contact form or otherwise correspond with us.
          </p>

          <h2>2. How We Use Information</h2>
          <p>
            Information submitted through this website is used solely to respond
            to your inquiry and to communicate about potential or ongoing work
            with HEWAR Group. We do not sell or rent personal information to
            third parties.
          </p>

          <h2>3. Cookies</h2>
          <p>
            This website may use minimal, functional cookies to support core
            site behaviour. It does not use third-party advertising or tracking
            cookies at this time.
          </p>

          <h2>4. Data Retention</h2>
          <p>
            We retain information you provide only for as long as necessary to
            respond to your inquiry or fulfill a business relationship, unless a
            longer retention period is required by law.
          </p>

          <h2>5. Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of your
            personal information at any time by contacting us using the details
            below.
          </p>

          <h2>6. Contact</h2>
          <p>
            Questions about this policy can be sent to{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        </div>
      </Container>
    </section>
  </motion.div>
)

export default Privacy
