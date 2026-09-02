import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const LanguageContext = createContext(null)

const STORAGE_KEY = 'hewar-language'

function getInitialLanguage() {
  if (typeof window === 'undefined') return 'en'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'ar' ? 'ar' : 'en'
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(getInitialLanguage)

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang === 'ar' ? 'ar' : 'en')
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === 'ar' ? 'en' : 'ar'))
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    window.localStorage.setItem(STORAGE_KEY, language)
  }, [language])

  const isRTL = language === 'ar'

  return (
    <LanguageContext.Provider value={{ language, isRTL, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
