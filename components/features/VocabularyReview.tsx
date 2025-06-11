'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VocabularyWord {
  id: number;
  german: string;
  english: string;
  pronunciation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed: string;
  nextReview: string;
  reviewCount: number;
}

export const VocabularyReview: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  const vocabularyWords: VocabularyWord[] = [
    {
      id: 1,
      german: 'Guten Morgen',
      english: 'Good morning',
      pronunciation: 'GOO-ten MOR-gen',
      difficulty: 'easy',
      lastReviewed: '2 days ago',
      nextReview: 'Today',
      reviewCount: 5
    },
    {
      id: 2,
      german: 'Entschuldigung',
      english: 'Excuse me / Sorry',
      pronunciation: 'ent-SHOOL-dee-goong',
      difficulty: 'medium',
      lastReviewed: '1 day ago',
      nextReview: 'Today',
      reviewCount: 3
    },
    {
      id: 3,
      german: 'Gemütlichkeit',
      english: 'Cozy comfort / Warmth',
      pronunciation: 'ge-MOOT-lich-kite',
      difficulty: 'hard',
      lastReviewed: '3 days ago',
      nextReview: 'Tomorrow',
      reviewCount: 1
    },
    {
      id: 4,
      german: 'Schmetterling',
      english: 'Butterfly',
      pronunciation: 'SHMET-ter-ling',
      difficulty: 'medium',
      lastReviewed: '4 days ago',
      nextReview: 'Today',
      reviewCount: 2
    },
    {
      id: 5,
      german: 'Wanderlust',
      english: 'Desire to travel',
      pronunciation: 'VAN-der-loost',
      difficulty: 'easy',
      lastReviewed: '1 day ago',
      nextReview: 'Today',
      reviewCount: 4
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getReviewStatus = (nextReview: string) => {
    if (nextReview === 'Today') {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const displayedWords = showAll ? vocabularyWords : vocabularyWords.slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Vocabulary Review</h3>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {showAll ? 'Show less' : 'Show all'}
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {displayedWords.map((word, index) => (
            <motion.div
              key={word.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900 text-sm">{word.german}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(word.difficulty)}`}>
                      {word.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{word.english}</p>
                  <p className="text-xs text-gray-500 italic">{word.pronunciation}</p>
                </div>
                
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReviewStatus(word.nextReview)}`}>
                    {word.nextReview}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Reviewed {word.reviewCount} times</span>
                <span>Last: {word.lastReviewed}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Review Progress */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Today's Reviews</span>
          <span className="text-sm text-gray-600">
            {vocabularyWords.filter(w => w.nextReview === 'Today').length} words ready
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '60%' }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-blue-500 h-2 rounded-full"
          />
        </div>
        
        <div className="mt-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Start Review Session
          </motion.button>
        </div>
      </div>
    </div>
  );
}; 