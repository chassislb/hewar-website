import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { work } from '../../../data/work'
import { insights } from '../../../data/insights'
import { useLanguage } from '../../../context/LanguageContext'
import { useTranslation } from '../../../i18n/useTranslation'

/* Gives every page its own browser-tab title, in the visitor's language. */
const PageMeta = () => {
  const { pathname } = useLocation()
  const { language } = useLanguage()
  const { t } = useTranslation()

  useEffect(() => {
    const site = t('common.siteName')
    const [, section, id] = pathname.split('/')
    let page

    if (!section) {
      document.title = `${site} | ${t('footer.tagline')}`
      return
    }
    if (section === 'about') page = t('nav.about')
    else if (section === 'services') page = t('nav.services')
    else if (section === 'work') page = id ? work.find((p) => p.id === id)?.client : t('nav.work')
    else if (section === 'careers') page = t('nav.careers')
    else if (section === 'insights') page = id ? insights.find((i) => i.id === id)?.title[language] : t('nav.insights')
    else if (section === 'contact') page = t('contact.eyebrow')
    else if (section === 'privacy') page = t('footer.privacy')
    else if (section === 'terms') page = t('footer.terms')
    else page = t('notFoundPage.title')

    document.title = page ? `${page} | ${site}` : site
  }, [pathname, language, t])

  return null
}

export default PageMeta
