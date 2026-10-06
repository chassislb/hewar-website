import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { work } from '../../../data/work'
import { useLanguage } from '../../../context/LanguageContext'
import { useCursor } from '../../../context/CursorContext'
import styles from './WorkSpace.module.css'

/*
  Work "tunnel". The section is pinned while you scroll through it and a
  WebGL scene (workScene.js, three.js loaded only on this page) flies the
  camera through the projects: holographic projections floating at
  different depths, with the site's particles streaming past. It ends on
  the last project and the page carries on to the footer.

  - project 1 waits ahead from the start; the rest arrive one by one
  - arriving at a project: it holds, plays, and a case panel shows details
  - keep scrolling: you fly through the frame to the next project
  - hover also plays a frame; click (or "Enter the project") opens it out to
    full screen, then we route to the project page
  - an accessible list of project links is kept for keyboard/screen readers
*/

const BASE = import.meta.env.BASE_URL
const posterOf = (p) => p.image || `${BASE}images/work-posters/${p.id}.jpg`
const clipOf = (p) => p.video?.short || p.video?.long || null
const pad = (n) => String(n).padStart(2, '0')

/* full-screen transition from the frame's rectangle. Plain DOM on <body>
   so it survives the route change and can fade out over the project page. */
const openPortal = (project, from, onCovered) => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const vw = window.innerWidth
  const vh = window.innerHeight
  const clip = (q) => `inset(${q.y0}px ${vw - q.x1}px ${vh - q.y1}px ${q.x0}px round ${q.r}px)`
  const start = { ...from, r: 14 }
  const end = { x0: 0, y0: 0, x1: vw, y1: vh, r: 0 }
  const el = document.createElement('div')
  Object.assign(el.style, {
    position: 'fixed', inset: '0', zIndex: '9000', background: '#061A40', overflow: 'hidden',
    clipPath: clip(start), pointerEvents: 'none',
  })
  const still = document.createElement('img')
  still.src = posterOf(project)
  still.alt = ''
  Object.assign(still.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'cover' })
  el.appendChild(still)
  const clipSrc = clipOf(project)
  if (clipSrc) {
    const v = document.createElement('video')
    Object.assign(v, { src: clipSrc, muted: true, loop: true, playsInline: true, autoplay: true, poster: posterOf(project) })
    if (from.time) v.currentTime = from.time
    Object.assign(v.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'cover' })
    el.appendChild(v)
  }
  document.body.appendChild(el)

  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
  const dur = reduce ? 1 : 900
  const t0 = performance.now()
  const step = (now) => {
    const e = ease(Math.min(1, (now - t0) / dur))
    const m = {}
    for (const k of ['x0', 'y0', 'x1', 'y1', 'r']) m[k] = start[k] + (end[k] - start[k]) * e
    el.style.clipPath = clip(m)
    if (e < 1) return requestAnimationFrame(step)
    onCovered()
    /* let the project page mount underneath, then dissolve the overlay */
    setTimeout(() => {
      el.style.transition = 'opacity 0.6s ease'
      el.style.opacity = '0'
      setTimeout(() => el.remove(), 650)
    }, 350)
    return undefined
  }
  requestAnimationFrame(step)
}

/* frame → full screen → project page */
const goToProject = (i, { sceneRef, busy, navigate, resetCursor }) => {
  if (busy.current || !sceneRef.current) return
  busy.current = true
  resetCursor()
  openPortal(work[i], sceneRef.current.screenRect(i), () => {
    navigate(`/work/${work[i].id}`)
    window.scrollTo(0, 0)
  })
}

const COPY = {
  en: {
    label: 'Projects',
    client: 'Client', category: 'Category', year: 'Year',
    enter: 'Enter the project',
    travel: 'Keep scrolling to travel through',
  },
  ar: {
    label: 'المشاريع',
    client: 'العميل', category: 'الفئة', year: 'السنة',
    enter: 'ادخل المشروع',
    travel: 'تابع التمرير للعبور',
  },
}

/* short version of the case text for the panel */
const excerpt = (text, max = 190) => {
  if (!text || text.length <= max) return text
  const cut = text.slice(0, max)
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

const WorkSpace = () => {
  const { language } = useLanguage()
  const { setCursor, resetCursor } = useCursor()
  const navigate = useNavigate()
  const tunnelRef = useRef(null)
  const stageRef = useRef(null)
  const canvasRef = useRef(null)
  const hudNumRef = useRef(null)
  const hudBarRef = useRef(null)
  const sceneRef = useRef(null)
  const swapTimer = useRef(0)
  const busy = useRef(false)
  const [shown, setShown] = useState(-1)
  const [active, setActive] = useState(false)
  const [panelRight, setPanelRight] = useState(true)
  const N = work.length
  const c = COPY[language] || COPY.en

  const open = (i) => goToProject(i, { sceneRef, busy, navigate, resetCursor })

  useEffect(() => {
    const tunnel = tunnelRef.current
    /* each project gets a stretch of scroll to arrive, hold, and pass through */
    tunnel.style.height = `${(N * 1.2 + 1) * 100}svh`
    let alive = true
    let scene = null

    import('three').then((THREE) => {
      if (!alive) return
      import('./workScene').then(({ createWorkScene }) => {
        if (!alive) return
        scene = createWorkScene(THREE, {
          tunnel,
          stage: stageRef.current,
          canvas: canvasRef.current,
          projects: work.map((p) => ({ id: p.id, poster: posterOf(p), clip: clipOf(p) })),
          onFocus: (i, side) => {
            clearTimeout(swapTimer.current)
            if (i < 0) { setActive(false); return }
            /* panel goes on the side the frame isn't */
            swapTimer.current = setTimeout(() => {
              setShown(i)
              setPanelRight(side === 'left')
              setActive(true)
            }, 120)
          },
          onHover: (i) => (i >= 0 ? setCursor('hover') : resetCursor()),
          onOpen: (i) => goToProject(i, { sceneRef, busy, navigate, resetCursor }),
          onHud: (n, p) => {
            if (hudNumRef.current) hudNumRef.current.textContent = pad(n)
            if (hudBarRef.current) hudBarRef.current.style.width = `${p * 100}%`
          },
        })
        sceneRef.current = scene
      })
    })

    return () => {
      alive = false
      clearTimeout(swapTimer.current)
      scene?.destroy()
      sceneRef.current = null
    }
    // setCursor/resetCursor come from context and are stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [N])

  const current = shown >= 0 ? work[shown] : null

  return (
    <section className={styles.tunnel} ref={tunnelRef} aria-label={c.label}>
      <div className={styles.stage} ref={stageRef}>
        <canvas className={styles.gl} ref={canvasRef} aria-hidden />
        <p className={styles.label}><i aria-hidden />{c.label}</p>

        {/* keyboard / screen-reader route to every project */}
        <ul className="sr-only">
          {work.map((p) => (
            <li key={p.id}><Link to={`/work/${p.id}`}>{p.client}: {p.title[language]}</Link></li>
          ))}
        </ul>

        {/* case details, shown while you hold in front of a project */}
        <aside
          className={`${styles.panel} ${active ? styles.panelOn : ''} ${panelRight ? styles.panelRight : ''}`}
          aria-live="polite"
          aria-hidden={!active}
        >
          {current && (
            <div className={styles.panelIn} key={current.id}>
              <span className={styles.num}>{pad(shown + 1)} / {pad(N)}</span>
              <h2 className={styles.title}>{current.title[language]}</h2>
              <p className={styles.desc}>{excerpt(current.description?.[language])}</p>
              <dl className={styles.facts}>
                <div><dt>{c.client}</dt><dd>{current.client}</dd></div>
                <div><dt>{c.category}</dt><dd>{current.category[language]}</dd></div>
                <div><dt>{c.year}</dt><dd>{current.year}</dd></div>
              </dl>
              <button
                type="button"
                className={styles.go}
                tabIndex={active ? 0 : -1}
                onClick={() => open(shown)}
                onMouseEnter={() => setCursor('hover')}
                onMouseLeave={resetCursor}
              >
                {c.enter} <span aria-hidden>→</span>
              </button>
              <span className={styles.travel}>{c.travel} <i aria-hidden>↓</i></span>
            </div>
          )}
        </aside>

        <div className={styles.hud} aria-hidden>
          <span ref={hudNumRef}>01</span>
          <span className={styles.bar}><span ref={hudBarRef} /></span>
          <span>{pad(N)}</span>
        </div>
      </div>
    </section>
  )
}

export default WorkSpace
