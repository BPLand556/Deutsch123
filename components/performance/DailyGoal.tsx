'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DailyGoalProps {
  completed: number;
  target: number;
  className?: string;
}

export const DailyGoal: React.FC<DailyGoalProps> = ({ 
  completed, 
  target, 
  className = '' 
}) => {
  const percentage = Math.min((completed / target) * 100, 100);
  const isComplete = completed >= target;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`bg-white rounded-lg border border-gray-200 p-3 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            isComplete ? 'bg-green-500 animate-pulse' : 'bg-blue-500'
          }`} />
          <span className="text-xs font-medium text-gray-700">Daily Goal</span>
        </div>
        <span className="text-xs text-gray-500">
          {completed}/{target}
        </span>
      </div>
      
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`h-1.5 rounded-full ${
              isComplete ? 'bg-green-500' : 'bg-blue-500'
            }`}
          />
        </div>
        
        {isComplete && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
          >
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </motion.div>
        )}
      </div>
      
      <p className="text-xs text-gray-600 mt-1">
        {isComplete ? 'Goal achieved! 🎉' : `${target - completed} more to go`}
      </p>
    </motion.div>
  );
}; 