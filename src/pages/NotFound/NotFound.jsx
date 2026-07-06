import { motion } from 'framer-motion'
import Container from '../../components/ui/Container/Container'
import Button from '../../components/ui/Button/Button'
import styles from './NotFound.module.css'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

const NotFound = () => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
    <section className={styles.notFound}>
      <div className={styles.orb} aria-hidden />
      <Container>
        <p className={styles.eyebrow}>
          <span className={styles.eyebrowDot} aria-hidden />
          404
        </p>
        <h1 className={styles.title}>This page doesn&rsquo;t exist.</h1>
        <p className={styles.sub}>
          The page you&rsquo;re looking for may have been moved or never existed.
        </p>
        <div className={styles.actions}>
          <Button variant="primary" href="/">← Back to Home</Button>
          <Button variant="ghost" href="/contact">Contact Us</Button>
        </div>
      </Container>
    </section>
  </motion.div>
)

export default NotFound
