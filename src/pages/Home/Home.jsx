import Hero from '../../components/sections/Hero/Hero'
import Manifesto from '../../components/sections/Manifesto/Manifesto'
import Services from '../../components/sections/Services/Services'
import Methodology from '../../components/sections/Methodology/Methodology'
import AISection from '../../components/sections/AISection/AISection'
import Numbers from '../../components/sections/Numbers/Numbers'
import About from '../../components/sections/About/About'
import Work from '../../components/sections/Work/Work'
import Clients from '../../components/sections/Clients/Clients'
import CTA from '../../components/sections/CTA/CTA'

const Home = () => (
  <main>
    <Hero />
    <Manifesto />
    <Services />
    <Methodology />
    <AISection />
    <Numbers />
    <About />
    <Work />
    <Clients />
    <CTA />
  </main>
)

export default Home
