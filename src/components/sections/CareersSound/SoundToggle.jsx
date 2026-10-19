import { useEffect, useState } from 'react'
import { useTranslation } from '../../../i18n/useTranslation'
import * as sound from './careersSound'
import styles from './SoundToggle.module.css'

/* Fixed bottom corner. Also unlocks audio on the first click/tap/key anywhere on the page. */
const SoundToggle = () => {
  const { t } = useTranslation()
  const [st, setSt] = useState(sound.state)
  useEffect(() => {
    const off = sound.subscribe(setSt)
    const unlock = () => sound.unlock()
    const evs = ['pointerdown', 'keydown', 'touchend']
    evs.forEach((ev) => window.addEventListener(ev, unlock, { passive: true }))
    return () => { off(); evs.forEach((ev) => window.removeEventListener(ev, unlock)) }
  }, [])
  const label = !st.on ? t('careersPage.sound.off') : st.running ? t('careersPage.sound.on') : t('careersPage.sound.tap')
  return (
    <button type="button" className={styles.snd} aria-pressed={st.on} data-on={st.on}
      onClick={(e) => { e.stopPropagation(); sound.toggle() }}>
      <i aria-hidden /><i aria-hidden /><i aria-hidden /><span>{label}</span>
    </button>
  )
}

export default SoundToggle
