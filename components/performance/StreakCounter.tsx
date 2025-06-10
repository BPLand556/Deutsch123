'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface StreakCounterProps {
  days: number;
  className?: string;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ 
  days, 
  className = '' 
}) => {
  const getStreakEmoji = (days: number) => {
    if (days >= 30) return '🔥';
    if (days >= 14) return '⚡';
    if (days >= 7) return '💪';
    if (days >= 3) return '🎯';
    return '🌟';
  };

  const getStreakColor = (days: number) => {
    if (days >= 30) return 'from-red-500 to-orange-500';
    if (days >= 14) return 'from-purple-500 to-pink-500';
    if (days >= 7) return 'from-blue-500 to-purple-500';
    if (days >= 3) return 'from-green-500 to-blue-500';
    return 'from-yellow-500 to-orange-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`bg-white rounded-lg border border-gray-200 p-3 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
            className="text-lg"
          >
            {getStreakEmoji(days)}
          </motion.div>
          <div>
            <p className="text-xs font-medium text-gray-700">Streak</p>
            <p className="text-sm font-bold text-gray-900">{days} days</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className={`w-2 h-2 rounded-full ${
                i < Math.min(days, 7) 
                  ? `bg-gradient-to-r ${getStreakColor(days)}` 
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
      
      {days > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-2 text-xs text-gray-600"
        >
          {days >= 30 && "🔥 Amazing! 30+ day streak!"}
          {days >= 14 && days < 30 && "⚡ Fantastic! Keep it up!"}
          {days >= 7 && days < 14 && "💪 Great consistency!"}
          {days >= 3 && days < 7 && "🎯 Building momentum!"}
          {days >= 1 && days < 3 && "🌟 Getting started!"}
        </motion.div>
      )}
    </motion.div>
  );
}; 