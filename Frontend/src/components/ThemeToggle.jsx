import React from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme()
    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }
  return (
    <button
        onClick={toggleTheme}
        className="p-2 rounded-lg transition-all duration-200 bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-yellow-400"
    >
        {theme === 'dark' ? <Sun size={20}/> : <Moon size={20}/>}
    </button>
  )
}

export default ThemeToggle