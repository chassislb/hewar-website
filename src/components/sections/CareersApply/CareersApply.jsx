import { useEffect, useRef, useState } from 'react'
import { useTranslation } from '../../../i18n/useTranslation'
import { SFX, unlock } from '../CareersSound/careersSound'
import { LANES, hashStr } from './hologram'
import styles from './CareersApply.module.css'

/*
  Apply — four steps in a compact dock: name → lane → contact → CV.
  Picking a lane renders a hologram in light for that craft (three.js, loaded on demand);
  the name decides which piece, its tint and its angle. Drag to turn it; hover to make it chime.
  Before a lane is picked the dock sits centred, so there is no empty stage.
  NOTE for dev: submit only logs today — wire it to the real endpoint (fields + CV file).
*/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const pieceOf = (name, lane) => {
  if (!name || !lane) return null
  const seed = hashStr(name.toLowerCase() + '|' + lane), list = LANES[lane] || LANES.other
  return { kind: list[(seed >>> 4) % list.length], seed }
}

const CareersApply = () => {
  const { t, isRTL } = useTranslation()
  const lanes = t('careersPage.apply.lanes')
  const [step, setStep] = useState(1)
  const [maxStep, setMaxStep] = useState(1)
  const [name, setName] = useState('')
  const [shownName, setShownName] = useState('')
  const [lane, setLane] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [cv, setCv] = useState(null)
  const [bad, setBad] = useState({})
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const holoRef = useRef(null)
  const latest = useRef({ name: '', lane: '' })
  const callRef = useRef(null)
  const lineRef = useRef(null)
  const dotRef = useRef(null)
  const dockRef = useRef(null)
  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const submitRef = useRef(null)
  const laneRef = useRef(null)

  const trimmed = name.trim()
  const piece = pieceOf(shownName, lane)
  const live = !!piece
  const laneLabel = lanes.find((l) => l.id === lane)?.label || ''

  /* the name settles half a second after typing stops, then the piece is rebuilt */
  useEffect(() => {
    const id = setTimeout(() => setShownName(trimmed), 500)
    return () => clearTimeout(id)
  }, [trimmed])

  /* load three.js only when the section is near, then keep the hologram in sync */
  useEffect(() => {
    const host = sectionRef.current
    let cancelled = false
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || holoRef.current) return
      io.disconnect()
      Promise.all([import('three'), import('./hologram')]).then(([THREE, mod]) => {
        if (cancelled) return
        holoRef.current = mod.createHologram({
          THREE, canvas: canvasRef.current, host, reduce,
          side: () => (document.documentElement.dir === 'rtl' ? -1 : 1),
          onHoverEnter: (seed) => SFX.chime(seed),
          onFrame: (pt) => {
            const call = callRef.current, line = lineRef.current, dot = dotRef.current
            if (!pt || !call) return
            const W = host.clientWidth, rtl = document.documentElement.dir === 'rtl'
            const cw = call.offsetWidth
            const x = rtl ? Math.max(16, Math.min(pt[0] - 90 - cw, W * 0.24)) : Math.min(W - cw - 16, Math.max(pt[0] + 90, W * 0.76))
            const y = Math.max(90, pt[1] - 20)
            call.style.transform = `translate(${x}px, ${y}px)`
            line.setAttribute('x1', pt[0] + (rtl ? -8 : 8)); line.setAttribute('y1', pt[1])
            line.setAttribute('x2', rtl ? x + cw + 10 : x - 10); line.setAttribute('y2', pt[1])
            dot.setAttribute('cx', pt[0] + (rtl ? -8 : 8)); dot.setAttribute('cy', pt[1])
          },
        })
        const { name: n, lane: l } = latest.current
        if (n && l) holoRef.current.setPiece(n, l)
      })
    }, { rootMargin: '400px' })
    io.observe(host)
    return () => { cancelled = true; io.disconnect(); holoRef.current?.destroy(); holoRef.current = null }
  }, [])

  useEffect(() => {
    latest.current = { name: shownName, lane }
    const holo = holoRef.current
    if (!holo) return
    const p = holo.setPiece(shownName, lane)
    if (p) { SFX.whoosh(true, 0.2); const id = setTimeout(() => SFX.idea(), 500); return () => clearTimeout(id) }
    return undefined
  }, [shownName, lane])

  /* the dock height tells the hint where to sit */
  useEffect(() => {
    const dock = dockRef.current
    const ro = new ResizeObserver(() => sectionRef.current?.style.setProperty('--dock', dock.offsetHeight + 'px'))
    ro.observe(dock)
    return () => ro.disconnect()
  }, [])

  const focusStep = (n) => setTimeout(() => {
    const el = n === 1 ? nameRef.current : n === 2 ? laneRef.current?.querySelector('input:checked, input') : n === 3 ? emailRef.current : submitRef.current
    el?.focus({ preventScroll: true })
  }, 40)
  const goStep = (n) => { setStep(n); setMaxStep((m) => Math.max(m, n)); SFX.tick(988 + n * 120, 0.05); focusStep(n) }
  const fail = (msg, keys) => { setBad((b) => ({ ...b, ...Object.fromEntries(keys.map((k) => [k, true])) })); setNote(msg); SFX.error() }
  const missList = (keys) => t('careersPage.apply.missing').replace('{list}', keys.map((k) => t('careersPage.apply.miss')[k]).join(isRTL ? '، ' : ', '))
  const stepOk = (n) => {
    if (n === 1 && trimmed.length < 2) { fail(t('careersPage.apply.errName'), ['name']); return false }
    if (n === 3) {
      const miss = []
      if (!EMAIL.test(email.trim())) miss.push('email')
      if (mobile.replace(/\D/g, '').length < 8) miss.push('mobile')
      if (miss.length) { fail(missList(miss), miss); return false }
    }
    setNote(''); return true
  }
  const next = (to) => { if (stepOk(to - 1)) goStep(to) }
  const onKey = (e) => {
    if (e.target.matches('input:not([type=radio]):not([type=file])') && (e.key.length === 1 || e.key === 'Backspace')) SFX.key(e.target.name !== 'name')
    if (e.key !== 'Enter' || e.target.type === 'submit') return
    if (step === 1 || step === 3) { e.preventDefault(); next(step + 1) }
  }
  const edit = (k, setter) => (e) => { setter(e.target.value); setBad((b) => ({ ...b, [k]: false })); if (note && !sent) setNote(''); if (k === 'name') unlock() }

  const pickLane = (id) => {
    setLane(id); setBad((b) => ({ ...b, lane: false }))
    setShownName(trimmed)
    setTimeout(() => goStep(3), 450)
  }

  const takeFile = (f) => {
    if (!f) return
    if (!/\.(pdf|docx?)$/i.test(f.name)) { setNote(t('careersPage.apply.errCvType')); return }
    if (f.size > 10 * 1024 * 1024) { setNote(t('careersPage.apply.errCvSize')); return }
    setCv(f); setBad((b) => ({ ...b, cv: false })); setNote(''); SFX.attach()
  }

  const submit = (e) => {
    e.preventDefault()
    if (sent) return
    const miss = []
    if (!lane) miss.push('lane')
    if (trimmed.length < 2) miss.push('name')
    if (!EMAIL.test(email.trim())) miss.push('email')
    if (mobile.replace(/\D/g, '').length < 8) miss.push('mobile')
    if (!cv) miss.push('cv')
    if (miss.length) { fail(missList(miss), miss); return }
    console.log('Career application submitted:', { name: trimmed, lane, email: email.trim(), mobile, cv: cv.name })
    setSent(true); setNote(''); SFX.success(); holoRef.current?.celebrate()
  }
  const again = () => {
    setSent(false); setName(''); setShownName(''); setLane(''); setEmail(''); setMobile(''); setCv(null); setBad({}); setNote('')
    setMaxStep(1); holoRef.current?.reset(); goStep(1)
  }

  const steps = t('careersPage.apply.steps')
  const sums = [trimmed || steps[0], laneLabel || steps[1], email.trim() || steps[2], steps[3]]
  const pieceText = piece ? t('careersPage.apply.pieces')[piece.kind] : null
  const first = trimmed.split(/\s+/)[0]

  return (
    <section id="apply" ref={sectionRef} className={`${styles.apply} ${live ? styles.live : styles.idle}`} aria-labelledby="apply-title"
      onDragOver={(e) => { if (!sent) { e.preventDefault(); setDragOver(true) } }}
      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDragOver(false) }}
      onDrop={(e) => { if (!sent) { e.preventDefault(); setDragOver(false); takeFile(e.dataTransfer.files?.[0]) } }}>
      <canvas ref={canvasRef} className={styles.holo} aria-hidden />
      <svg className={styles.leaders} aria-hidden><line ref={lineRef} /><circle ref={dotRef} r="2.5" /></svg>
      <div className={styles.top}>
        <p className={styles.eyebrow}><i aria-hidden />{t('careersPage.apply.label')}</p>
        <h2 id="apply-title" className="sr-only">{t('careersPage.apply.title')}</h2>
      </div>
      <div className={styles.call} ref={callRef} aria-live="polite">
        {pieceText && (<>
          <b>{pieceText[0]}</b>
          <span>{pieceText[1]}<br />{laneLabel} · {t('careersPage.apply.madeFor').replace('{name}', shownName)}</span>
        </>)}
      </div>
      <p className={styles.hint} aria-hidden>← {t('careersPage.apply.drag')} →</p>

      <form ref={dockRef} className={`${styles.dock} ${sent ? styles.sent : ''}`} noValidate onSubmit={submit} onKeyDown={onKey}>
        {!sent && (<>
          <ol className={styles.steps} aria-label="Steps">
            {steps.map((s, i) => {
              const n = i + 1
              const cls = [n === step && styles.on, (n < step || (n < maxStep && n !== step)) && styles.done, n > maxStep && styles.lock].filter(Boolean).join(' ')
              return (
                <li key={s} className={cls}>
                  <button type="button" onClick={() => n <= maxStep && goStep(n)} aria-current={n === step ? 'step' : undefined} disabled={n > maxStep}>
                    <b dir="ltr">{String(n).padStart(2, '0')}</b><span>{sums[i]}</span>
                  </button>
                </li>
              )
            })}
          </ol>

          {step === 1 && (
            <div className={styles.pane}>
              <div className={`${styles.d} ${bad.name ? styles.bad : ''}`}>
                <label htmlFor="f-name" className="sr-only">{t('careersPage.apply.name')}</label>
                <input id="f-name" name="name" ref={nameRef} className={styles.big} autoComplete="name" maxLength={40}
                  placeholder={t('careersPage.apply.namePh')} value={name} onChange={edit('name', setName)} />
              </div>
              <button type="button" className={styles.next} onClick={() => next(2)}>{t('careersPage.apply.next')} <span aria-hidden>{isRTL ? '←' : '→'}</span></button>
            </div>
          )}
          {step === 2 && (
            <fieldset className={`${styles.pane} ${styles.lanes}`} ref={laneRef}>
              <legend className="sr-only">{t('careersPage.apply.lane')}</legend>
              {lanes.map((l) => (
                <label key={l.id} className={styles.chip} onPointerEnter={() => SFX.tick(1318, 0.05)}>
                  <input type="radio" name="lane" value={l.id} checked={lane === l.id} onChange={() => pickLane(l.id)} />
                  <span>{l.label}</span>
                </label>
              ))}
            </fieldset>
          )}
          {step === 3 && (
            <div className={styles.pane}>
              <div className={`${styles.d} ${bad.email ? styles.bad : ''}`}>
                <label htmlFor="f-email" className="sr-only">{t('careersPage.apply.email')}</label>
                <input id="f-email" name="email" ref={emailRef} type="email" dir="ltr" autoComplete="email" placeholder={t('careersPage.apply.email')} value={email} onChange={edit('email', setEmail)} />
              </div>
              <div className={`${styles.d} ${bad.mobile ? styles.bad : ''}`}>
                <label htmlFor="f-mobile" className="sr-only">{t('careersPage.apply.mobile')}</label>
                <input id="f-mobile" name="mobile" type="tel" dir="ltr" autoComplete="tel" placeholder={t('careersPage.apply.mobile')} value={mobile} onChange={edit('mobile', setMobile)} />
              </div>
              <button type="button" className={styles.next} onClick={() => next(4)}>{t('careersPage.apply.next')} <span aria-hidden>{isRTL ? '←' : '→'}</span></button>
            </div>
          )}
          {step === 4 && (
            <div className={styles.pane}>
              <div className={`${styles.d} ${cv ? styles.has : ''} ${bad.cv ? styles.bad : ''} ${dragOver ? styles.drag : ''}`}>
                <label htmlFor="f-cv" className={styles.cvbtn}>{cv ? cv.name : `${t('careersPage.apply.cv')} ↑`}</label>
                <input id="f-cv" type="file" className="sr-only" accept=".pdf,.doc,.docx" onChange={(e) => takeFile(e.target.files?.[0])} />
              </div>
              <button ref={submitRef} className={styles.submit} type="submit">{t('careersPage.apply.submit')} <span aria-hidden>{isRTL ? '←' : '→'}</span></button>
            </div>
          )}
        </>)}
        <p className={`${styles.note} ${note ? styles.err : ''}`} aria-live="polite">
          {sent ? (<>
            <b>{t('careersPage.apply.doneTitle')}</b>
            {t('careersPage.apply.thanks').replace('{name}', first)}{' '}
            <button type="button" onClick={again}>{t('careersPage.apply.again')}</button>
          </>) : note}
        </p>
      </form>
    </section>
  )
}

export default CareersApply
