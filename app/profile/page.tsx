'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressOverview } from '@/components/performance/ProgressOverview';
import { StreakCounter } from '@/components/performance/StreakCounter';
import { DailyGoal } from '@/components/performance/DailyGoal';

interface UserProfile {
  name: string;
  email: string;
  level: string;
  nativeLanguage: string;
  learningGoals: string[];
  studyTime: number;
  joinDate: string;
  avatar?: string;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'streak' | 'vocabulary' | 'conversation' | 'grammar' | 'special';
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);

  const userProfile: UserProfile = {
    name: 'Max Mustermann',
    email: 'max.mustermann@example.com',
    level: 'Intermediate',
    nativeLanguage: 'English',
    learningGoals: ['Travel to Germany', 'Work with German clients', 'Read German literature'],
    studyTime: 45.5,
    joinDate: '2024-01-15',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  };

  const achievements: Achievement[] = [
    {
      id: 1,
      title: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🎯',
      unlockedAt: '2024-01-15',
      category: 'special'
    },
    {
      id: 2,
      title: 'Week Warrior',
      description: 'Study for 7 days in a row',
      icon: '🔥',
      unlockedAt: '2024-01-22',
      category: 'streak'
    },
    {
      id: 3,
      title: 'Vocabulary Master',
      description: 'Learn 100 words',
      icon: '📚',
      unlockedAt: '2024-01-25',
      category: 'vocabulary'
    },
    {
      id: 4,
      title: 'Conversation Starter',
      description: 'Complete 10 conversation lessons',
      icon: '💬',
      unlockedAt: '2024-01-28',
      category: 'conversation'
    },
    {
      id: 5,
      title: 'Grammar Guru',
      description: 'Master basic German grammar',
      icon: '📝',
      unlockedAt: '2024-02-01',
      category: 'grammar'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAchievementColor = (category: string) => {
    switch (category) {
      case 'streak':
        return 'from-orange-400 to-red-500';
      case 'vocabulary':
        return 'from-blue-400 to-purple-500';
      case 'conversation':
        return 'from-green-400 to-blue-500';
      case 'grammar':
        return 'from-purple-400 to-pink-500';
      case 'special':
        return 'from-yellow-400 to-orange-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            </div>
            <div className="flex items-center space-x-4">
              <StreakCounter days={7} />
              <DailyGoal completed={3} target={5} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-1">{userProfile.name}</h2>
                <p className="text-gray-600 mb-2">{userProfile.email}</p>
                
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {userProfile.level}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    {userProfile.nativeLanguage}
                  </span>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <p>Member since {formatDate(userProfile.joinDate)}</p>
                  <p>Total study time: {userProfile.studyTime}h</p>
                </div>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </button>
              </div>
            </motion.div>

            {/* Learning Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Goals</h3>
              <div className="space-y-3">
                {userProfile.learningGoals.map((goal, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{goal}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex space-x-1 mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-800'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProgressOverview />
                  </motion.div>
                )}

                {activeTab === 'achievements' && (
                  <motion.div
                    key="achievements"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {achievements.map((achievement, index) => (
                        <motion.div
                          key={achievement.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className={`bg-gradient-to-br ${getAchievementColor(achievement.category)} rounded-lg p-4 text-white`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{achievement.icon}</div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{achievement.title}</h4>
                              <p className="text-sm opacity-90">{achievement.description}</p>
                              <p className="text-xs opacity-75 mt-1">
                                Unlocked {formatDate(achievement.unlockedAt)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'settings' && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Daily Goal
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>3 lessons</option>
                          <option>5 lessons</option>
                          <option>10 lessons</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Study Reminders
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span className="ml-2 text-sm text-gray-700">Email notifications</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span className="ml-2 text-sm text-gray-700">Push notifications</span>
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Voice Settings
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option>German (Standard)</option>
                          <option>German (Austrian)</option>
                          <option>German (Swiss)</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
} 