import React from 'react';
import { ChevronRight, Play, Zap } from 'lucide-react';
import {useNavigate} from 'react-router-dom'

const Hero = () => {
    const navigate = useNavigate()
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Crect x='0' y='0' width='30' height='30'/%3E%3Crect x='30' y='30' width='30' height='30'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo and Brand */}
        <div className="mb-8 animate-fadeInUp">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl mb-6 bg-amber-600 dark:bg-amber-500 shadow-2xl animate-scaleIn animate-delay-200">
            <span className="text-white text-5xl">♛</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-gray-900 dark:text-white animate-fadeInUp animate-delay-300">
            Open Review
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed text-gray-600 dark:text-gray-300 animate-fadeInUp animate-delay-400">
            Free chess game analysis powered by Stockfish engine and AI-driven insights. 
            Improve your chess skills with professional-grade reviews.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fadeInUp animate-delay-500">
          <button className="flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/25" onClick={() => navigate('/sign-in')}>
            <Zap size={20} />
            <span>Start Analyzing</span>
            <ChevronRight size={20} />
          </button>
          <a href="#demo">
            <button className="flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800" onClick={() => navigate("#demo")}>
                <Play size={20} />
                <span>Watch Demo</span>
            </button>
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto animate-fadeInUp animate-delay-600">
          <div className="p-6 rounded-xl bg-white/80 backdrop-blur-sm dark:bg-gray-800/50 shadow-lg animate-scaleIn animate-delay-100">
            <div className="text-3xl font-bold mb-2 text-amber-600 dark:text-amber-400">10K+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Games Analyzed</div>
          </div>
          <div className="p-6 rounded-xl bg-white/80 backdrop-blur-sm dark:bg-gray-800/50 shadow-lg animate-scaleIn animate-delay-200">
            <div className="text-3xl font-bold mb-2 text-amber-600 dark:text-amber-400">Free</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Always & Forever</div>
          </div>
          <div className="p-6 rounded-xl bg-white/80 backdrop-blur-sm dark:bg-gray-800/50 shadow-lg animate-scaleIn animate-delay-300">
            <div className="text-3xl font-bold mb-2 text-amber-600 dark:text-amber-400">AI</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Powered Analysis</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;