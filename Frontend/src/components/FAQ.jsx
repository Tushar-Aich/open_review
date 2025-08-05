import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Is Open Review really free to use?",
      answer: "Yes! Open Review is completely free and always will be. We believe that quality chess analysis should be accessible to everyone, regardless of their financial situation. There are no hidden fees, subscriptions, or premium features."
    },
    {
      question: "How accurate is the Stockfish analysis?",
      answer: "Open Review uses the latest version of Stockfish, one of the world's strongest chess engines. The analysis is extremely accurate and is used by professional players and chess platforms worldwide. The engine evaluation gives you precise numerical assessments and best move recommendations."
    },
    {
      question: "What makes the AI insights different from engine analysis?",
      answer: "While Stockfish provides precise calculations and evaluations, our AI-powered insights explain the 'why' behind moves in human-readable language. It helps you understand strategic concepts, tactical patterns, and positional ideas that might not be immediately obvious from engine evaluations alone."
    },
    {
      question: "Can I upload games in different formats?",
      answer: "Yes! Open Review supports standard chess formats including PGN (Portable Game Notation), FEN (Forsyth-Edwards Notation), and you can also input games manually. We're continuously working to support more formats based on community feedback."
    },
    {
      question: "How do I save and access my analyzed games?",
      answer: "All your analyzed games are automatically saved to your account. You can access them anytime from your dashboard, organize them into collections, and even share them with friends or coaches. Your game history is preserved indefinitely at no cost."
    },
    {
      question: "Can I use Open Review offline?",
      answer: "Currently, Open Review requires an internet connection to access the Stockfish engine and AI analysis features. However, we're exploring offline capabilities for future updates based on user demand."
    },
    {
      question: "Is my game data private and secure?",
      answer: "We take your privacy seriously. Your games and analysis are private by default and are only shared when you explicitly choose to do so. We use industry-standard security measures to protect your data and never sell or share your information with third parties."
    },
    {
      question: "How can I contribute to the Open Review project?",
      answer: "As an open-source project, we welcome contributions! You can contribute code on our GitHub repository, report bugs, suggest features, help with translations, or simply spread the word about Open Review in the chess community."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Find answers to common questions about Open Review
          </p>
        </div>

        <div className="space-y-4 animate-fadeInUp animate-delay-200">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl transition-all duration-200 bg-white dark:bg-gray-900 shadow-lg"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:opacity-80 transition-opacity text-gray-900 dark:text-white"
              >
                <span className="font-semibold text-lg pr-8">{faq.question}</span>
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                  {openIndex === index ? (
                    <Minus size={18} className="text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Plus size={18} className="text-gray-600 dark:text-gray-400" />
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center p-8 rounded-xl animate-fadeInUp animate-delay-300 bg-white dark:bg-gray-900 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Still have questions?
          </h3>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            We're here to help! Reach out to our community or support team.
          </p>
          <button className="px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-amber-600 hover:bg-amber-700 text-white">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;