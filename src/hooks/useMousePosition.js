import { useEffect, useRef } from 'react'

export const useMousePosition = () => {
  const position = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      position.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return position
}
