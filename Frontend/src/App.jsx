import React, { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Hero from './components/Hero.jsx'
import Features from './components/Features.jsx'
import Demo from './components/Demo.jsx'
import FAQ from './components/FAQ.jsx'

const App = () => {
  const [mobileMenu, setMobileMenu] = useState(false)
  return (
    <div className='min-h-screen transition-colors duration-300'>
      <Navbar mobileMenuOpen={mobileMenu} setMobileMenuOpen={setMobileMenu}/>
      <Hero />
      <Features />
      <Demo />
      <FAQ />
      <Footer />
    </div>
  )
}

export default App