import React from 'react';
import { Play, RotateCcw, Download, Share2, Brain, BarChart3 } from 'lucide-react';

const Demo = () => {
  return (
    <section id="demo" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            See It In Action
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
            Watch how Open Review analyzes a real chess game with both engine precision and AI insights.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Demo Interface */}
          <div className="rounded-2xl shadow-2xl overflow-hidden animate-slideInLeft bg-white dark:bg-gray-800">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Game Analysis
              </h3>
              <div className="flex space-x-2">
                <button className="p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700">
                  <RotateCcw size={16} className="text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700">
                  <Download size={16} className="text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700">
                  <Share2 size={16} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Chess Board */}
            <div className="p-6">
              <div className="aspect-square mb-6 relative">
                <div className="grid grid-cols-8 h-full border-2 border-gray-300 rounded-lg overflow-hidden">
                  {Array.from({ length: 64 }, (_, i) => {
                    const row = Math.floor(i / 8);
                    const col = i % 8;
                    const isLight = (row + col) % 2 === 0;
                    return (
                      <div
                        key={i}
                        className={`aspect-square flex items-center justify-center text-2xl ${
                          isLight ? 'bg-amber-100' : 'bg-amber-800'
                        }`}
                      >
                        {i === 4 && '♔'}
                        {i === 60 && '♚'}
                        {i === 3 && '♕'}
                        {i === 59 && '♛'}
                        {i === 2 && '♗'}
                        {i === 5 && '♗'}
                        {i === 58 && '♝'}
                        {i === 61 && '♝'}
                        {i === 1 && '♘'}
                        {i === 6 && '♘'}
                        {i === 57 && '♞'}
                        {i === 62 && '♞'}
                        {i === 0 && '♖'}
                        {i === 7 && '♖'}
                        {i === 56 && '♜'}
                        {i === 63 && '♜'}
                        {(i >= 8 && i <= 15) && '♙'}
                        {(i >= 48 && i <= 55) && '♟'}
                      </div>
                    );
                  })}
                </div>
                <button className={`absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/60 transition-colors rounded-lg group`}>
                  <div className="flex items-center space-x-3 text-white">
                    <Play size={32} />
                    <span className="text-lg font-semibold">Play Demo</span>
                  </div>
                </button>
              </div>

              {/* Analysis Panel */}
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Engine Evaluation</span>
                    <span className="font-mono text-green-600 dark:text-green-400">+0.3</span>
                  </div>
                  <div className="text-sm">Best move: Nf3</div>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                  <div className="font-semibold mb-2">AI Insight</div>
                  <div className="text-sm">This move develops the knight to a central square, controlling important central squares and preparing for castling.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-8 animate-slideInRight">
            <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 animate-fadeInUp animate-delay-100">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-amber-600">
                <Brain size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Dual Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get both precise engine calculations and human-readable AI explanations for every position.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 animate-fadeInUp animate-delay-200">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-green-600">
                <BarChart3 size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Progress Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor your improvement over time with detailed statistics and pattern recognition.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 animate-fadeInUp animate-delay-300">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-purple-600">
                <Share2 size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Easy Sharing
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Share your analyzed games with friends, coaches, or the community with a single click.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;