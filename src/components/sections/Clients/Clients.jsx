import { useRef } from 'react'
import { motion } from 'framer-motion'
import Container from '../../ui/Container/Container'
import { clients } from '../../../data/clients'
import { useTranslation } from '../../../i18n/useTranslation'
import styles from './Clients.module.css'

const MARQUEE_ITEMS = [...clients, ...clients]

const Clients = () => {
  const sectionRef = useRef(null)
  const { t } = useTranslation()

  return (
    <section className={styles.clients} ref={sectionRef} data-section-theme="dark">
      <Container>
        <motion.div
          className={styles.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className={styles.dots} aria-hidden>
            <span />
            <span />
            <span />
          </span>
          <span>{t('clients.trustedBy')}</span>
        </motion.div>
      </Container>

      <div className={styles.track} aria-label="Trusted clients">
        <div className={styles.marquee}>
          {MARQUEE_ITEMS.map((client, i) => (
            <div key={`${client.logo}-${i}`} className={styles.item}>
              <img
                src={client.logo}
                alt={client.name}
                className={styles.logo}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Clients