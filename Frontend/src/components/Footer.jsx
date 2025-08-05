import React from 'react';
import { Github, Twitter, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center animate-fadeInUp">
          {/* Logo and Brand */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 bg-amber-600 dark:bg-amber-500 animate-scaleIn animate-delay-100">
              <span className="text-white text-3xl">♛</span>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              Open Review
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Free chess analysis for everyone
            </p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-6 mb-8">
            <a
              href="#"
              className="p-3 rounded-lg transition-all duration-200 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-400 dark:hover:text-white"
            >
              <Github size={20} />
            </a>
            <a
              href="#"
              className="p-3 rounded-lg transition-all duration-200 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-400 dark:hover:text-white"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="p-3 rounded-lg transition-all duration-200 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-400 dark:hover:text-white"
            >
              <Mail size={20} />
            </a>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
            <a
              href="#"
              className="transition-colors duration-200 hover:text-amber-600 text-gray-600 dark:text-gray-400"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="transition-colors duration-200 hover:text-amber-600 text-gray-600 dark:text-gray-400"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="transition-colors duration-200 hover:text-amber-600 text-gray-600 dark:text-gray-400"
            >
              Documentation
            </a>
            <a
              href="#"
              className="transition-colors duration-200 hover:text-amber-600 text-gray-600 dark:text-gray-400"
            >
              Community
            </a>
          </div>

          {/* Copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <span>© {currentYear} Open Review.</span>
            <div className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart size={14} className="text-red-500" />
              <span>for the chess community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;