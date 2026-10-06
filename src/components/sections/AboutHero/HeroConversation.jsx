import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContactModal } from '../../../context/ContactModalContext'
import { useCursor } from '../../../context/CursorContext'
import { useTranslation } from '../../../i18n/useTranslation'
import styles from './HeroConversation.module.css'

/*
  About hero — "Hewar" means dialogue, so the page introduces itself as one.
  A visitor asks who we are, Hewar reacts to the question and types back,
  then the visitor gets three quick replies that lead into the site.

  Messages store *what* was said (keys), not the text, so switching EN/AR
  mid-conversation re-renders everything in the new language.
*/

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
// typing time grows with message length, within limits
const typingTime = (text = '') => Math.min(1600, Math.max(700, text.length * 22))

let uid = 0
const nextId = () => ++uid

const HeroConversation = () => {
  const { t } = useTranslation()
  const { openContactModal } = useContactModal()
  const { setCursor, resetCursor } = useCursor()
  const hoverable = { onMouseEnter: () => setCursor('hover'), onMouseLeave: resetCursor }
  const chat = t('aboutPage.chat')

  // reduced motion: skip the performance, show the whole conversation at once
  const [reduce] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [messages, setMessages] = useState(() =>
    reduce
      ? [
          { id: nextId(), from: 'you', kind: 'question' },
          ...chat.answers.map((_, i) => ({ id: nextId(), from: 'hewar', kind: 'answer', i })),
          { id: nextId(), from: 'you', kind: 'followAsk' },
          { id: nextId(), from: 'hewar', kind: 'followAnswer' },
        ]
      : [],
  )
  const [typing, setTyping] = useState(false)
  const [reacted, setReacted] = useState(reduce)
  const [chipsOpen, setChipsOpen] = useState(reduce)
  const [used, setUsed] = useState([])
  const busy = useRef(false)
  // every run of the script gets an id; a stale run (unmount, StrictMode
  // double-mount) sees the id has moved on and stops quietly
  const run = useRef(0)

  const push = (id, msg) => run.current === id && setMessages((m) => [...m, { id: nextId(), ...msg }])

  const hewarSays = async (id, msg, text) => {
    if (run.current !== id) return
    setTyping(true)
    await wait(typingTime(text))
    if (run.current !== id) return
    setTyping(false)
    push(id, { from: 'hewar', ...msg })
  }

  // the opening script
  useEffect(() => {
    const id = ++run.current
    if (reduce) return undefined

    const script = async () => {
      busy.current = true
      await wait(900)
      push(id, { from: 'you', kind: 'question' })
      await wait(700)
      if (run.current !== id) return
      setReacted(true)
      await wait(450)
      for (let i = 0; i < chat.answers.length; i++) {
        await hewarSays(id, { kind: 'answer', i }, chat.answers[i])
        await wait(350)
      }
      /* the visitor reacts to the name, Hewar explains it */
      await wait(900)
      push(id, { from: 'you', kind: 'followAsk' })
      await wait(500)
      await hewarSays(id, { kind: 'followAnswer' }, chat.followUp.answer)
      await wait(450)
      if (run.current !== id) return
      busy.current = false
      setChipsOpen(true)
    }
    script()

    // bump the id so this run stops if the component unmounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => { run.current++ }
    // runs once per visit; text is looked up at render time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const reply = async (r) => {
    if (busy.current) return
    busy.current = true
    setUsed((u) => [...u, r])
    const id = run.current
    push(id, { from: 'you', kind: 'ask', r })
    await wait(450)
    await hewarSays(id, { kind: 'reply', r }, chat.replies[r].answer)
    busy.current = false
  }

  const renderBody = (m) => {
    switch (m.kind) {
      case 'question':
        return chat.question
      case 'answer':
        return chat.answers[m.i]
      case 'followAsk':
        return chat.followUp.ask
      case 'followAnswer':
        return chat.followUp.answer
      case 'ask':
        return chat.replies[m.r].ask
      case 'reply': {
        const r = chat.replies[m.r]
        return (
          <>
            {r.answer}
            {!r.cta ? null : r.to ? (
              <Link to={r.to} className={styles.cta} {...hoverable}>
                {r.cta} <span aria-hidden>→</span>
              </Link>
            ) : (
              <button type="button" className={styles.cta} onClick={openContactModal} {...hoverable}>
                {r.cta} <span aria-hidden>→</span>
              </button>
            )}
          </>
        )
      }
      default:
        return null
    }
  }

  /* a fresh pair of questions each turn, with "let's talk" always last */
  const contactIdx = chat.replies.findIndex((r) => r.action === 'contact')
  const visibleChips = [
    ...chat.replies.map((_, i) => i).filter((i) => i !== contactIdx && !used.includes(i)).slice(0, 2),
    ...(contactIdx >= 0 && !used.includes(contactIdx) ? [contactIdx] : []),
  ]

  return (
    <div className={styles.chat}>
      <div className={styles.thread} aria-live="polite">
        {messages.map((m, idx) => {
          const prev = messages[idx - 1]
          const startsRun = !prev || prev.from !== m.from

          return (
            <div
              key={m.id}
              className={`${styles.row} ${m.from === 'you' ? styles.you : styles.hewar} ${startsRun ? styles.runStart : ''}`}
            >
              {startsRun && (
                <span className={styles.name}>
                  {m.from === 'hewar' && (
                    <span className={styles.avatar} aria-hidden>
                      <i /><i /><i />
                    </span>
                  )}
                  {m.from === 'hewar' ? chat.hewarName : chat.youName}
                </span>
              )}
              <div className={styles.bubble}>
                {renderBody(m)}
                {m.kind === 'question' && reacted && (
                  <span className={styles.reaction} aria-hidden>
                    <i /><i /><i />
                  </span>
                )}
              </div>
            </div>
          )
        })}

        {typing && (
          <div className={`${styles.row} ${styles.hewar}`}>
            <div className={`${styles.bubble} ${styles.typing}`} aria-label={chat.typing} role="status">
              <i /><i /><i />
            </div>
          </div>
        )}
      </div>

      <div className={`${styles.chips} ${chipsOpen ? styles.chipsOpen : ''}`}>
        <span className={styles.prompt}>{chat.prompt}</span>
        {chat.replies.map((r, i) =>
          !visibleChips.includes(i) ? null : (
            <button
              key={r.ask}
              type="button"
              className={styles.chip}
              onClick={() => reply(i)}
              {...hoverable}
              style={{ '--i': i }}
              tabIndex={chipsOpen ? 0 : -1}
            >
              {r.ask}
            </button>
          ),
        )}
      </div>
    </div>
  )
}

export default HeroConversation
