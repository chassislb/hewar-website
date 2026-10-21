import Hero from '../../components/sections/Hero/Hero'
import Services from '../../components/sections/Services/Services'
import Numbers from '../../components/sections/Numbers/Numbers'
import About from '../../components/sections/About/About'
import Presence from '../../components/sections/Presence/Presence'
import Work from '../../components/sections/Work/Work'
import Clients from '../../components/sections/Clients/Clients'
import Insights from '../../components/sections/Insights/Insights'
import { useTranslation } from '../../i18n/useTranslation'

const Home = () => {
  const { t } = useTranslation()
  return (
  <main>
    <h1 className="sr-only">{t('common.siteName')}. {t('footer.tagline')}</h1>
    <Hero />
    <Services />
    <Numbers />
    <About />
    <Presence />
    <Work />
    <Clients />
    <Insights />
  </main>
  )
}

export default Home