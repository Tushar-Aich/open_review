import React from 'react'
import ThemeToggle from './ThemeToggle.jsx'
import { Menu, User, X } from 'lucide-react'
import {useNavigate} from 'react-router-dom'

const Navbar = ({mobileMenuOpen, setMobileMenuOpen}) => {
  const navigate = useNavigate()
  const navlinks = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'Demo', href: '#demo' },
    { name: 'FAQ', href: '#faq' },
  ]
  return (
    <nav className='fixed w-full z-50 transition-all duration-300 bg-gray-100/95 backdrop-blur-sm border-b border-gray-200 dark:bg-gray-900/95 dark:border-gray-800 animate-fadeIn'>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-600 dark:bg-amber-500">
              <span className="text-white font-bold text-xl">♕</span>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">Open Review</span>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 lg:space-x-20">
            {navlinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className='font-medium transition-colors duration-200 hover:text-amber-600 text-gray-700 dark:text-gray-300'
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-amber-600 hover:bg-amber-700 text-white cursor-pointer" onClick={() => navigate('/sign-in')}>
              <User size={18} />
              <span>Sign In</span>
            </button>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='p-2 rounded-lg transition-all duration-200 bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white'
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24}/>}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col space-y-4">
              {navlinks.map((link) => (
                <a href={link.href} key={link.name} onClick={() => setMobileMenuOpen(false)}
                  className='font-medium transition-colors duration-200 hover:text-amber-600 text-gray-700 dark:text-gray-300'
                >
                  {link.name}
                </a>
              ))}
              <button className='flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 w-full bg-amber-600 hover:bg-amber-700 text-white cursor-pointer' onClick={() => navigate('/sign-in')}>
                <User size={18} />
                <span>Sign In</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar