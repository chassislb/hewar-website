import { motion } from 'framer-motion'
import Container from '../../components/ui/Container/Container'
import Button from '../../components/ui/Button/Button'
import { useTranslation } from '../../i18n/useTranslation'
import { useLanguage } from '../../context/LanguageContext'
import styles from './NotFound.module.css'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

const NotFound = () => {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const back = language === 'ar' ? '→' : '←'
  return (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
    <section className={styles.notFound}>
      <div className={styles.orb} aria-hidden />
      <Container>
        <p className={styles.eyebrow}>
          <span className={styles.eyebrowDot} aria-hidden />
          404
        </p>
        <h1 className={styles.title}>{t('notFoundPage.title')}</h1>
        <p className={styles.sub}>{t('notFoundPage.sub')}</p>
        <div className={styles.actions}>
          <Button variant="primary" href="/">{back} {t('notFoundPage.home')}</Button>
          <Button variant="ghost" href="/contact">{t('notFoundPage.contact')}</Button>
        </div>
      </Container>
    </section>
  </motion.div>
  )
}

export default NotFound
