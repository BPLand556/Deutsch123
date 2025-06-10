'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressStats {
  totalLessons: number;
  completedLessons: number;
  currentStreak: number;
  totalStudyTime: number;
  vocabularyWords: number;
  accuracy: number;
  level: string;
  xpPoints: number;
}

export const ProgressOverview: React.FC = () => {
  const stats: ProgressStats = {
    totalLessons: 24,
    completedLessons: 18,
    currentStreak: 7,
    totalStudyTime: 12.5,
    vocabularyWords: 342,
    accuracy: 87,
    level: 'Intermediate',
    xpPoints: 2840
  };

  const progressPercentage = Math.round((stats.completedLessons / stats.totalLessons) * 100);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Your Progress</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Level</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {stats.level}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-blue-800">Overall Progress</h3>
            <span className="text-lg font-bold text-blue-900">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className="bg-blue-600 h-2 rounded-full"
            />
          </div>
          <p className="text-xs text-blue-700 mt-2">
            {stats.completedLessons} of {stats.totalLessons} lessons completed
          </p>
        </motion.div>

        {/* Study Streak */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-green-800">Study Streak</h3>
            <span className="text-lg font-bold text-green-900">{stats.currentStreak}</span>
          </div>
          <div className="flex items-center space-x-1">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < Math.min(stats.currentStreak, 7) ? 'bg-green-500' : 'bg-green-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-green-700 mt-2">
            {stats.currentStreak} days in a row
          </p>
        </motion.div>

        {/* Study Time */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-purple-800">Study Time</h3>
            <span className="text-lg font-bold text-purple-900">{stats.totalStudyTime}h</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-purple-700">This week</span>
          </div>
          <p className="text-xs text-purple-700 mt-2">
            {Math.round(stats.totalStudyTime / 7 * 10) / 10}h average per day
          </p>
        </motion.div>

        {/* Vocabulary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-orange-800">Vocabulary</h3>
            <span className="text-lg font-bold text-orange-900">{stats.vocabularyWords}</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-orange-700">Words learned</span>
          </div>
          <p className="text-xs text-orange-700 mt-2">
            {Math.round(stats.accuracy)}% accuracy rate
          </p>
        </motion.div>
      </div>

      {/* XP Points and Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-6 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-yellow-900 font-bold text-lg">⭐</span>
            </div>
            <div>
              <h3 className="font-medium text-yellow-900">Experience Points</h3>
              <p className="text-sm text-yellow-700">{stats.xpPoints} XP earned</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-yellow-900">{stats.xpPoints}</div>
            <div className="text-xs text-yellow-700">Total XP</div>
          </div>
        </div>
        
        {/* XP Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-yellow-700 mb-1">
            <span>Level {stats.level}</span>
            <span>Next: 3000 XP</span>
          </div>
          <div className="w-full bg-yellow-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(stats.xpPoints % 1000) / 10}%` }}
              transition={{ duration: 1, delay: 0.6 }}
              className="bg-yellow-500 h-2 rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}; 