import React from 'react';
import { Brain, Zap, BarChart3, Users, Shield, Clock } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Brain size={32} />,
      title: 'AI-Powered Analysis',
      description: 'Get human-like insights powered by Gemini AI alongside precise Stockfish engine analysis.',
      color: 'text-blue-500'
    },
    {
      icon: <Zap size={32} />,
      title: 'Lightning Fast',
      description: 'Analyze your games in seconds with our optimized Stockfish integration.',
      color: 'text-yellow-500'
    },
    {
      icon: <BarChart3 size={32} />,
      title: 'Detailed Statistics',
      description: 'Track your progress with comprehensive game statistics and improvement metrics.',
      color: 'text-green-500'
    },
    {
      icon: <Users size={32} />,
      title: 'Community Driven',
      description: 'Share analyses and learn from a community of chess enthusiasts worldwide.',
      color: 'text-purple-500'
    },
    {
      icon: <Shield size={32} />,
      title: 'Always Free',
      description: 'No subscriptions, no limits. Our commitment to keeping chess analysis accessible to everyone.',
      color: 'text-red-500'
    },
    {
      icon: <Clock size={32} />,
      title: 'Game History',
      description: 'Keep track of all your analyzed games with our comprehensive history system.',
      color: 'text-indigo-500'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Powerful Features
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
            Everything you need to analyze and improve your chess games, completely free and open source.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-8 rounded-2xl transition-all duration-300 hover:scale-105 animate-fadeInUp bg-white hover:shadow-xl shadow-lg dark:bg-gray-900 dark:hover:bg-gray-850 dark:shadow-xl ${index % 2 === 0 ? 'animate-delay-100' : 'animate-delay-200'}`}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 bg-gray-100 dark:bg-gray-800">
                <div className={feature.color}>
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;