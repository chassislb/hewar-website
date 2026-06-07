import { createContext, useContext, useState, useCallback } from 'react'

const CursorContext = createContext(null)

export const CursorProvider = ({ children }) => {
  const [cursorType, setCursorType] = useState('default') // 'default' | 'hover' | 'view' | 'read'
  const [cursorLabel, setCursorLabel] = useState('')

  const setCursor = useCallback((type, label = '') => {
    setCursorType(type)
    setCursorLabel(label)
  }, [])

  const resetCursor = useCallback(() => {
    setCursorType('default')
    setCursorLabel('')
  }, [])

  return (
    <CursorContext.Provider value={{ cursorType, cursorLabel, setCursor, resetCursor }}>
      {children}
    </CursorContext.Provider>
  )
}

export const useCursor = () => {
  const ctx = useContext(CursorContext)
  if (!ctx) throw new Error('useCursor must be used inside CursorProvider')
  return ctx
}
