import { createContext, useContext, useState, useCallback } from 'react'

const CursorContext = createContext(null)

export const CursorProvider = ({ children }) => {
  const [cursorType, setCursorType] = useState('default') // 'default' | 'hover' | 'view' | 'read'
  const [cursorLabel, setCursorLabel] = useState('')
  /* Modals always render a dark panel regardless of the ambient section
     theme behind them, so while one is open the cursor must stay in its
     dark-background (light) styling even if the page underneath is
     currently light-themed — otherwise a dark cursor can disappear
     against the dark modal panel. Counter-based so nested/overlapping
     modals can't prematurely unlock each other. */
  const [modalOpenCount, setModalOpenCount] = useState(0)
  const forceDarkBgCursor = modalOpenCount > 0

  const setCursor = useCallback((type, label = '') => {
    setCursorType(type)
    setCursorLabel(label)
  }, [])

  const resetCursor = useCallback(() => {
    setCursorType('default')
    setCursorLabel('')
  }, [])

  const lockCursorToModal = useCallback(() => {
    setModalOpenCount((c) => c + 1)
  }, [])

  const unlockCursorFromModal = useCallback(() => {
    setModalOpenCount((c) => Math.max(0, c - 1))
  }, [])

  return (
    <CursorContext.Provider value={{
      cursorType,
      cursorLabel,
      setCursor,
      resetCursor,
      forceDarkBgCursor,
      lockCursorToModal,
      unlockCursorFromModal,
    }}>
      {children}
    </CursorContext.Provider>
  )
}

export const useCursor = () => {
  const ctx = useContext(CursorContext)
  if (!ctx) throw new Error('useCursor must be used inside CursorProvider')
  return ctx
}
