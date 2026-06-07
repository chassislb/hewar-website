import { useRef } from 'react'
import { motion } from 'framer-motion'
import Container from '../../ui/Container/Container'
import { clients } from '../../../data/clients'
import styles from './Clients.module.css'

/* Duplicate the list for seamless infinite loop */
const MARQUEE_ITEMS = [...clients, ...clients]

const Clients = () => {
  const sectionRef = useRef(null)

  return (
    <section className={styles.clients} ref={sectionRef}>
      <Container>
        <motion.div
          className={styles.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className={styles.dots} aria-hidden><span /><span /><span /></span>
          <span>Trusted By</span>
        </motion.div>
      </Container>

      {/* Full-width marquee — outside Container for edge-to-edge */}
      <div className={styles.track} aria-hidden>
        <div className={styles.marquee}>
          {MARQUEE_ITEMS.map((client, i) => (
            <div key={i} className={styles.item}>
              <span className={styles.itemText}>{client}</span>
              <span className={styles.separator} aria-hidden>·</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Clients
