'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Lesson {
  id: number;
  title: string;
  description: string;
  progress: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  completed: boolean;
  category: string;
}

interface LessonCardProps {
  lesson: Lesson;
  delay?: number;
  className?: string;
}

export const LessonCard: React.FC<LessonCardProps> = ({ 
  lesson, 
  delay = 0,
  className = '' 
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Conversation':
        return '💬';
      case 'Food & Dining':
        return '🍽️';
      case 'Travel':
        return '✈️';
      case 'Shopping':
        return '🛍️';
      case 'Daily Life':
        return '🏠';
      default:
        return '📚';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 cursor-pointer ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">
            {getCategoryIcon(lesson.category)}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm">{lesson.title}</h3>
            <p className="text-xs text-gray-600 mt-1">{lesson.description}</p>
          </div>
        </div>
        
        {lesson.completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
          >
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </motion.div>
        )}
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
            {lesson.difficulty}
          </span>
          <span className="text-xs text-gray-500 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {lesson.duration}
          </span>
        </div>
        
        <span className="text-xs text-gray-500">
          {lesson.progress}% complete
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${lesson.progress}%` }}
          transition={{ duration: 1, delay: delay + 0.2 }}
          className={`h-2 rounded-full ${
            lesson.completed ? 'bg-green-500' : 'bg-blue-500'
          }`}
        />
      </div>

      {/* Action Button */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {lesson.category}
        </span>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
            lesson.completed
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {lesson.completed ? 'Review' : 'Continue'}
        </motion.button>
      </div>
    </motion.div>
  );
}; 