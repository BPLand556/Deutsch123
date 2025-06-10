'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VoiceModeSelector } from '@/components/voice/VoiceModeSelector';
import { ProgressOverview } from '@/components/performance/ProgressOverview';
import { LessonCard } from '@/components/features/LessonCard';
import { VocabularyReview } from '@/components/features/VocabularyReview';
import { DailyGoal } from '@/components/performance/DailyGoal';
import { StreakCounter } from '@/components/performance/StreakCounter';
import { MainNavigation } from '@/components/navigation/MainNavigation';

export default function Dashboard() {
  const [currentMode, setCurrentMode] = useState<'voice' | 'text'>('voice');

  const recentLessons = [
    {
      id: 1,
      title: 'Basic Greetings',
      description: 'Learn essential German greetings and introductions',
      progress: 85,
      difficulty: 'Beginner',
      duration: '15 min',
      completed: true,
      category: 'Conversation'
    },
    {
      id: 2,
      title: 'Ordering at a Restaurant',
      description: 'Practice ordering food and drinks in German',
      progress: 60,
      difficulty: 'Intermediate',
      duration: '20 min',
      completed: false,
      category: 'Food & Dining'
    },
    {
      id: 3,
      title: 'Travel Vocabulary',
      description: 'Essential words and phrases for traveling in Germany',
      progress: 30,
      difficulty: 'Beginner',
      duration: '25 min',
      completed: false,
      category: 'Travel'
    }
  ];

  const upcomingLessons = [
    {
      id: 4,
      title: 'Shopping Conversations',
      description: 'Learn to shop and bargain in German',
      progress: 0,
      difficulty: 'Intermediate',
      duration: '18 min',
      completed: false,
      category: 'Shopping'
    },
    {
      id: 5,
      title: 'Weather and Seasons',
      description: 'Discuss weather and seasonal activities',
      progress: 0,
      difficulty: 'Beginner',
      duration: '12 min',
      completed: false,
      category: 'Daily Life'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      <MainNavigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ProgressOverview />
            </motion.div>

            {/* Recent Lessons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Continue Learning</h2>
                <div className="space-y-4">
                  {recentLessons.map((lesson, index) => (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Upcoming Lessons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended Next</h2>
                <div className="space-y-4">
                  {upcomingLessons.map((lesson, index) => (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      delay={index * 0.1}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Voice Mode Selector */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <VoiceModeSelector
                currentMode={currentMode}
                onModeChange={setCurrentMode}
              />
            </motion.div>

            {/* Streak Counter */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <StreakCounter days={7} />
            </motion.div>

            {/* Daily Goal */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.37 }}
            >
              <DailyGoal completed={3} target={5} />
            </motion.div>

            {/* Vocabulary Review */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <VocabularyReview />
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Start New Lesson
                </button>
                <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium">
                  Practice Speaking
                </button>
                <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                  Review Vocabulary
                </button>
                <button className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium">
                  Take Assessment
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
} 