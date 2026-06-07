import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import Container from '../../ui/Container/Container'
import { work } from '../../../data/work'
import { useCursor } from '../../../context/CursorContext'
import styles from './Work.module.css'

gsap.registerPlugin(ScrollTrigger)

const WorkCard = ({ project, index }) => {
  const { setCursor, resetCursor } = useCursor()

  return (
    <div
      className={styles.card}
      onMouseEnter={() => setCursor('view', 'View')}
      onMouseLeave={resetCursor}
    >
      <Link to={`/work/${project.id}`} className={styles.cardLink}>
        {/* Visual */}
        <div className={styles.visual} style={{ '--card-color': project.color }}>
          <div className={styles.visualOrb} />
          <div className={styles.visualGrid} />
          <div className={styles.num} aria-hidden>
            {String(index + 1).padStart(2, '0')}
          </div>
          <div className={styles.overlay}>
            <span className={styles.overlayBtn}>View Project ↗</span>
          </div>
        </div>

        {/* Meta */}
        <div className={styles.meta}>
          <div className={styles.metaLeft}>
            <span className={styles.client}>{project.client}</span>
            <h3 className={styles.title}>{project.title}</h3>
          </div>
          <div className={styles.metaRight}>
            <span className={styles.category}>{project.category}</span>
            <span className={styles.year}>{project.year}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}

const Work = () => {
  const sectionRef = useRef(null)
  const trackRef   = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 769px)', () => {
      const getX = () => -(trackRef.current.scrollWidth - window.innerWidth)

      /* Set section tall enough to scroll all cards */
      const setHeight = () => {
        const extra = trackRef.current.scrollWidth - window.innerWidth
        sectionRef.current.style.minHeight = `calc(100vh + ${extra}px)`
      }
      setHeight()

      gsap.to(trackRef.current, {
        x: getX,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
          onRefresh: setHeight,
        },
      })
    })

    return () => mm.revert()
  }, { scope: sectionRef })

  return (
    <section className={styles.work} ref={sectionRef} id="work">
      <div className={styles.sticky}>
        {/* Header */}
        <Container>
          <div className={styles.header}>
            <div className={styles.label}>
              <span className={styles.dots} aria-hidden><span /><span /><span /></span>
              <span>Selected Work</span>
            </div>
            <h2 className={styles.heading}>Where Strategy<br />Meets Impact</h2>
          </div>
        </Container>

        {/* Horizontal track — GSAP drives translateX */}
        <div className={styles.track} ref={trackRef}>
          {work.map((project, i) => (
            <WorkCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Work
