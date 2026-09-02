import { useLanguage } from '../context/LanguageContext'
import { translations } from './translations'

export function useTranslation() {
  const { language, isRTL } = useLanguage()
  const dict = translations[language]

  const t = (path) => {
    const value = path.split('.').reduce((obj, key) => obj?.[key], dict)
    return value ?? path
  }

  return { t, language, isRTL }
}
