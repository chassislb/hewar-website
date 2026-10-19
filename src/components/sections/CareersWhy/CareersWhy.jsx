import { useEffect, useRef } from 'react'
import { useTranslation } from '../../../i18n/useTranslation'
import { SFX, humTo, hz, SCALE } from '../CareersSound/careersSound'
import styles from './CareersWhy.module.css'

/*
  Why join — "At Hewar, you're ___".
  A pinned section (6 screens of scroll). One giant word rebuilds itself letter by letter as you scroll:
  letters the next word shares slide into place, the rest fly out / drop in.
  The letters are windows: each state's photo shows only through the type (multiply knockout).
  State 4 ("the stage.") dims the room and the cursor becomes a spotlight.
  Arabic is a connected script, so in Arabic the whole word cross-fades instead of letters flying.
  Every state has its own sound (see CareersSound).
*/
const BASE = import.meta.env.BASE_URL
const BG = [
  { img: `${BASE}images/about/about-02-panel.png` },
  { img: `${BASE}images/about/about-01-speaking.png` },
  { lab: true },
  { stage: true, img: `${BASE}images/careers/riyadh-skyline.jpg` },
  { img: `${BASE}images/work-posters/neom.jpg` },
  { img: `${BASE}images/about/about-03-award.png` },
]
const STATE_SFX = ['idea', 'voice', 'tech', 'stage', 'headline', 'next']

const CareersWhy = () => {
  const { t, isRTL } = useTranslation()
  const states = t('careersPage.why.states')
  const N = states.length
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const wordRef = useRef(null)
  const measureRef = useRef(null)
  const preRef = useRef(null)
  const subRef = useRef(null)
  const ctaRef = useRef(null)
  const countRef = useRef(null)
  const spotRef = useRef(null)
  const bgRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current, stage = stageRef.current, wordEl = wordRef.current, measure = measureRef.current
    const preEl = preRef.current, subEl = subRef.current, cta = ctaRef.current, spot = spotRef.current
    const imgs = [...bgRef.current.children]
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const letters = !isRTL
    let fs = 0, live = [], cur = -1, raf = 0, mx = -1e4, my = -1e4, lastLean = 0
    const timers = new Set()
    const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); fn() }, ms); timers.add(id) }

    /* one font size for every word, fitted to the longest one */
    const fit = () => {
      measure.style.fontSize = '100px'
      let widest = 0
      states.forEach((s) => { measure.textContent = s.word; widest = Math.max(widest, measure.getBoundingClientRect().width) })
      const w = window.innerWidth
      fs = Math.min(w * (w < 760 ? 0.92 : 0.88) / widest * 100, window.innerHeight * 0.3, 260)
      stage.style.setProperty('--fs', fs + 'px')
      measure.style.fontSize = fs + 'px'
    }
    const layout = (word) => {
      measure.innerHTML = ''
      ;[...word].forEach((c) => { const sp = document.createElement('span'); sp.textContent = c; measure.appendChild(sp) })
      const spans = [...measure.children], x0 = measure.getBoundingClientRect().left
      const total = measure.getBoundingClientRect().width, off = (wordEl.clientWidth - total) / 2
      return spans.map((s, k) => ({ ch: word[k], x: off + s.getBoundingClientRect().left - x0 }))
    }
    const place = (L, x, y = 0, r = 0) => { L.x = x; L.el.style.transform = `translate(${x}px, ${y}em) rotate(${r}deg)` }
    const morphTo = (i, instant) => {
      if (!letters) {
        /* Arabic: whole-word cross-fade */
        live.forEach((L) => { L.el.classList.add(styles.out); later(() => L.el.remove(), 700) })
        const el = document.createElement('span'); el.className = `${styles.l} ${styles.whole}`
        el.innerHTML = '<i></i>'; el.firstChild.textContent = states[i].word
        if (!instant && !reduce) { el.classList.add(styles.preIn); wordEl.appendChild(el); el.getBoundingClientRect(); el.classList.remove(styles.preIn) } else wordEl.appendChild(el)
        live = [{ el, ch: '', x: 0 }]
        return
      }
      const chars = layout(states[i].word), pool = live.slice(), next = []
      chars.forEach((c, k) => {
        if (c.ch === ' ') return
        const j = pool.findIndex((L) => L.ch.toLowerCase() === c.ch.toLowerCase())
        if (j > -1) {
          const L = pool.splice(j, 1)[0]
          L.el.style.transitionDelay = instant ? '0s' : `${k * 0.025}s`
          L.ch = c.ch; L.el.firstChild.textContent = c.ch; place(L, c.x); next.push(L)
        } else {
          const el = document.createElement('span'); el.className = styles.l; el.innerHTML = '<i></i>'; el.firstChild.textContent = c.ch
          const L = { ch: c.ch, el, x: c.x }
          if (!instant && !reduce) {
            el.classList.add(styles.preIn); place(L, c.x, 0.55, (Math.random() - 0.5) * 30)
            wordEl.appendChild(el); el.getBoundingClientRect()
            el.classList.remove(styles.preIn); el.style.transitionDelay = `${0.18 + k * 0.035}s`
          } else wordEl.appendChild(el)
          place(L, c.x); next.push(L)
        }
      })
      pool.forEach((L, k) => {
        L.el.style.transitionDelay = `${k * 0.02}s`
        L.el.classList.add(styles.out)
        place(L, L.x + (Math.random() - 0.5) * fs * 0.6, -0.6 - Math.random() * 0.4, (Math.random() - 0.5) * 70)
        later(() => L.el.remove(), 900)
      })
      live = next
    }
    const swapText = (el, txt) => {
      if (el.textContent === txt) return
      if (reduce) { el.textContent = txt; return }
      el.classList.add(styles.swap)
      later(() => { el.textContent = txt; el.classList.remove(styles.swap) }, 260)
    }
    const setState = (i, instant) => {
      if (i === cur) return
      cur = i
      morphTo(i, instant)
      imgs.forEach((im, k) => im.classList.toggle(styles.on, k === i))
      swapText(preEl, states[i].pre); swapText(subEl, states[i].sub)
      stage.classList.toggle(styles.lightsOff, i === 3)
      if (!instant) { SFX.flurry(letters ? states[i].word.length : 6); SFX[STATE_SFX[i]]() }
      if (i !== 3) humTo(0)
      cta.classList.toggle(styles.on, i === N - 1); cta.tabIndex = i === N - 1 ? 0 : -1
      countRef.current.textContent = String(i + 1).padStart(2, '0')
    }

    const move = (e) => {
      mx = e.clientX; my = e.clientY
      stage.style.setProperty('--mx', mx + 'px'); stage.style.setProperty('--my', my + 'px')
      if (cur === 3) humTo(0.05)
    }
    const leave = () => { mx = my = -1e4; humTo(0) }
    stage.addEventListener('pointermove', move)
    stage.addEventListener('pointerleave', leave)

    const frame = () => {
      const r = section.getBoundingClientRect()
      const p = Math.max(0, Math.min(0.9999, -r.top / (r.height - window.innerHeight)))
      const i = Math.floor(p * N)
      setState(i)
      if (i === 3) {
        /* spotlight follows the cursor; on touch it sweeps across the word by itself */
        const tt = performance.now() / 1000, auto = mx < -1000
        spot.style.setProperty('--sx', auto ? `${50 + Math.sin(tt * 0.9) * 28}%` : mx + 'px')
        spot.style.setProperty('--sy', auto ? `${45 + Math.sin(tt * 1.7) * 4}%` : my + 'px')
      }
      /* letters lean away from the cursor, each with a small note */
      if (letters && !reduce && r.top < window.innerHeight && r.bottom > 0) live.forEach((L) => {
        const b = L.el.getBoundingClientRect(), cx = b.left + b.width / 2, cy = b.top + b.height / 2
        const dx = cx - mx, dy = cy - my, d = Math.hypot(dx, dy), R = fs * 1.1
        const k = i !== 3 && d < R ? (1 - d / R) ** 2 : 0
        if (k > 0.35 && !L.leaning && performance.now() - lastLean > 70) { lastLean = performance.now(); SFX.tick(hz(SCALE[L.ch.charCodeAt(0) % 9] + 12), 0.04) }
        L.leaning = k > 0.35
        L.el.firstChild.style.transform = k ? `translate(${(dx / (d || 1)) * k * fs * 0.18}px, ${(dy / (d || 1)) * k * fs * 0.18}px)` : ''
      })
      raf = requestAnimationFrame(frame)
    }
    const resize = () => { fit(); const i = cur; cur = -1; live.forEach((L) => L.el.remove()); live = []; setState(i < 0 ? 0 : i, true) }
    let alive = true
    ;(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
      if (!alive) return
      fit(); setState(0, true); raf = requestAnimationFrame(frame)
    })
    window.addEventListener('resize', resize)
    return () => {
      alive = false
      cancelAnimationFrame(raf); timers.forEach(clearTimeout)
      window.removeEventListener('resize', resize)
      stage.removeEventListener('pointermove', move); stage.removeEventListener('pointerleave', leave)
      humTo(0)
      wordEl.innerHTML = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRTL, states])

  const goApply = () => {
    SFX.whoosh(false, 0.3)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById('apply')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
    setTimeout(() => document.getElementById('f-name')?.focus({ preventScroll: true }), reduce ? 0 : 800)
  }

  return (
    <section className={styles.mo} ref={sectionRef} aria-labelledby="why-title">
      <div className={styles.stage} ref={stageRef}>
        <div className={styles.bg} ref={bgRef} aria-hidden>
          {BG.map((b, i) => (
            <div key={i} className={`${styles.img} ${b.lab ? styles.lab : ''} ${b.stage ? styles.stageImg : ''}`}
              style={b.img && !b.stage ? { backgroundImage: `url(${b.img})` } : b.stage ? { '--stage-img': `url(${b.img})` } : undefined} />
          ))}
        </div>
        <div className={styles.knock} aria-hidden>
          <div className={styles.col}>
            <p className={styles.pre}>&nbsp;</p>
            <div className={styles.word} ref={wordRef} />
            <p className={styles.sub}>&nbsp;</p>
            <span className={styles.cta}>&nbsp;</span>
          </div>
        </div>
        <div className={styles.glow} aria-hidden />
        <div className={styles.grain} aria-hidden />
        <div className={styles.back} aria-hidden />
        <div className={styles.spot} ref={spotRef} aria-hidden />
        <div className={styles.col} aria-hidden>
          <p className={styles.pre} ref={preRef}>{states[0].pre}</p>
          <div className={styles.word} />
          <p className={styles.sub} ref={subRef}>{states[0].sub}</p>
          <button type="button" className={styles.cta} ref={ctaRef} tabIndex={-1}
            onPointerEnter={() => SFX.tick(988, 0.06)} onClick={goApply}>
            {t('careersPage.why.cta')} <span aria-hidden>→</span>
          </button>
        </div>
        <div className={styles.top}>
          <p className={styles.eyebrow}><i aria-hidden />{t('careersPage.why.label')}</p>
          <p className={styles.count} aria-hidden dir="ltr"><b ref={countRef}>01</b> / {String(N).padStart(2, '0')}</p>
        </div>
        <span className={styles.measure} ref={measureRef} aria-hidden />
      </div>
      <div className="sr-only">
        <h2 id="why-title">{t('careersPage.why.title')}</h2>
        <ul>{states.map((s) => <li key={s.word}>{s.pre} {s.word} {s.sub}</li>)}</ul>
      </div>
    </section>
  )
}

export default CareersWhy
