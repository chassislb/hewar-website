import { createContext, useContext, useState, useCallback } from 'react'

const ContactModalContext = createContext(null)

export const ContactModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)

  const openContactModal = useCallback(() => setIsOpen(true), [])
  const closeContactModal = useCallback(() => setIsOpen(false), [])

  return (
    <ContactModalContext.Provider value={{ isOpen, openContactModal, closeContactModal }}>
      {children}
    </ContactModalContext.Provider>
  )
}

export const useContactModal = () => {
  const ctx = useContext(ContactModalContext)
  if (!ctx) throw new Error('useContactModal must be used inside ContactModalProvider')
  return ctx
}
