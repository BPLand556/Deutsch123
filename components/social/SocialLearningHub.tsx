'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  id: string;
  name: string;
  avatar: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  achievements: Achievement[];
  currentStreak: number;
  totalStudyTime: number;
  region: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface LeaderboardEntry {
  rank: number;
  user: User;
  points: number;
  achievements: number;
  streak: number;
}

interface MultiplayerScenario {
  id: string;
  title: string;
  description: string;
  maxPlayers: number;
  currentPlayers: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  scenario: string;
  status: 'waiting' | 'active' | 'completed';
  participants: User[];
}

interface SocialLearningHubProps {
  currentUser: User;
  onScenarioJoin?: (scenario: MultiplayerScenario) => void;
  onAchievementUnlocked?: (achievement: Achievement) => void;
  className?: string;
}

const ACHIEVEMENTS: Record<string, Achievement> = {
  'first-conversation': {
    id: 'first-conversation',
    title: 'First Steps',
    description: 'Complete your first German conversation',
    icon: '🗣️',
    unlockedAt: new Date(),
    rarity: 'common',
  },
  'streak-7': {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
    unlockedAt: new Date(),
    rarity: 'rare',
  },
  'cultural-master': {
    id: 'cultural-master',
    title: 'Cultural Master',
    description: 'Complete 10 cultural simulations',
    icon: '🏛️',
    unlockedAt: new Date(),
    rarity: 'epic',
  },
  'conversation-champion': {
    id: 'conversation-champion',
    title: 'Conversation Champion',
    description: 'Have 50 conversations with AI partners',
    icon: '👑',
    unlockedAt: new Date(),
    rarity: 'legendary',
  },
  'regional-explorer': {
    id: 'regional-explorer',
    title: 'Regional Explorer',
    description: 'Interact with characters from all German regions',
    icon: '🗺️',
    unlockedAt: new Date(),
    rarity: 'epic',
  },
  'vocabulary-virtuoso': {
    id: 'vocabulary-virtuoso',
    title: 'Vocabulary Virtuoso',
    description: 'Learn 500 German words',
    icon: '📚',
    unlockedAt: new Date(),
    rarity: 'rare',
  },
};

const MULTIPLAYER_SCENARIOS: MultiplayerScenario[] = [
  {
    id: 'coffee-shop-group',
    title: 'Coffee Shop Meetup',
    description: 'Practice ordering coffee with other learners',
    maxPlayers: 4,
    currentPlayers: 2,
    difficulty: 'beginner',
    scenario: 'coffee-shop',
    status: 'waiting',
    participants: [],
  },
  {
    id: 'business-meeting-team',
    title: 'Business Meeting Simulation',
    description: 'Participate in a formal business discussion',
    maxPlayers: 6,
    currentPlayers: 3,
    difficulty: 'intermediate',
    scenario: 'business-meeting',
    status: 'active',
    participants: [],
  },
  {
    id: 'cultural-festival',
    title: 'Cultural Festival',
    description: 'Experience German festivals together',
    maxPlayers: 8,
    currentPlayers: 5,
    difficulty: 'advanced',
    scenario: 'social-gathering',
    status: 'waiting',
    participants: [],
  },
];

const MOCK_USERS: User[] = [
  {
    id: 'user1',
    name: 'Anna Schmidt',
    avatar: '👩‍🎓',
    level: 'intermediate',
    points: 1250,
    achievements: [ACHIEVEMENTS['first-conversation'], ACHIEVEMENTS['streak-7']],
    currentStreak: 12,
    totalStudyTime: 180,
    region: 'Berlin',
  },
  {
    id: 'user2',
    name: 'Hans Müller',
    avatar: '👨‍💼',
    level: 'advanced',
    points: 2100,
    achievements: [ACHIEVEMENTS['cultural-master'], ACHIEVEMENTS['conversation-champion']],
    currentStreak: 25,
    totalStudyTime: 320,
    region: 'Munich',
  },
  {
    id: 'user3',
    name: 'Lisa Weber',
    avatar: '👩‍🎨',
    level: 'beginner',
    points: 450,
    achievements: [ACHIEVEMENTS['first-conversation']],
    currentStreak: 3,
    totalStudyTime: 45,
    region: 'Hamburg',
  },
];

export const SocialLearningHub: React.FC<SocialLearningHubProps> = ({
  currentUser,
  onScenarioJoin,
  onAchievementUnlocked,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'scenarios' | 'achievements' | 'community'>('leaderboard');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [scenarios, setScenarios] = useState<MultiplayerScenario[]>(MULTIPLAYER_SCENARIOS);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);

  // Generate leaderboard
  useEffect(() => {
    const entries: LeaderboardEntry[] = MOCK_USERS.map((user, index) => ({
      rank: index + 1,
      user,
      points: user.points,
      achievements: user.achievements.length,
      streak: user.currentStreak,
    }));
    setLeaderboard(entries.sort((a, b) => b.points - a.points));
  }, []);

  const handleJoinScenario = useCallback((scenario: MultiplayerScenario) => {
    const updatedScenario = {
      ...scenario,
      currentPlayers: scenario.currentPlayers + 1,
      participants: [...scenario.participants, currentUser],
    };
    
    setScenarios(prev => prev.map(s => s.id === scenario.id ? updatedScenario : s));
    onScenarioJoin?.(updatedScenario);
  }, [currentUser, onScenarioJoin]);

  const handleAchievementUnlock = useCallback((achievement: Achievement) => {
    setShowAchievement(achievement);
    onAchievementUnlocked?.(achievement);
    
    setTimeout(() => setShowAchievement(null), 3000);
  }, [onAchievementUnlocked]);

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'bg-gray-100 text-gray-700',
      rare: 'bg-blue-100 text-blue-700',
      epic: 'bg-purple-100 text-purple-700',
      legendary: 'bg-yellow-100 text-yellow-700',
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getLevelColor = (level: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-700',
      intermediate: 'bg-yellow-100 text-yellow-700',
      advanced: 'bg-red-100 text-red-700',
    };
    return colors[level as keyof typeof colors] || colors.beginner;
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white">
        <h2 className="text-2xl font-bold">Social Learning Hub</h2>
        <p className="text-purple-100 mt-1">Connect, compete, and learn together</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <div className="flex">
          {[
            { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
            { id: 'scenarios', label: 'Multiplayer', icon: '👥' },
            { id: 'achievements', label: 'Achievements', icon: '🏅' },
            { id: 'community', label: 'Community', icon: '🌍' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-500'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* Leaderboard */}
          {activeTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Global Leaderboard</h3>
              
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.user.id}
                  className={`flex items-center p-4 rounded-lg border-2 ${
                    entry.user.id === currentUser.id
                      ? 'border-purple-300 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                    {entry.rank}
                  </div>
                  
                  <div className="flex items-center flex-1">
                    <span className="text-2xl mr-3">{entry.user.avatar}</span>
                    <div>
                      <div className="font-medium text-gray-900">{entry.user.name}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(entry.user.level)}`}>
                          {entry.user.level}
                        </span>
                        <span>{entry.user.region}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{entry.points} pts</div>
                    <div className="text-sm text-gray-600">
                      {entry.achievements} achievements • {entry.streak} day streak
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Multiplayer Scenarios */}
          {activeTab === 'scenarios' && (
            <motion.div
              key="scenarios"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Multiplayer Scenarios</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{scenario.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(scenario.difficulty)}`}>
                        {scenario.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-gray-600">
                        {scenario.currentPlayers}/{scenario.maxPlayers} players
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        scenario.status === 'active' ? 'bg-green-100 text-green-700' :
                        scenario.status === 'waiting' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {scenario.status}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleJoinScenario(scenario)}
                      disabled={scenario.currentPlayers >= scenario.maxPlayers}
                      className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                    >
                      {scenario.currentPlayers >= scenario.maxPlayers ? 'Full' : 'Join Scenario'}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Achievements */}
          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(ACHIEVEMENTS).map((achievement) => {
                  const isUnlocked = currentUser.achievements.some(a => a.id === achievement.id);
                  
                  return (
                    <div
                      key={achievement.id}
                      className={`border-2 rounded-lg p-4 transition-all ${
                        isUnlocked
                          ? 'border-purple-300 bg-purple-50'
                          : 'border-gray-200 bg-gray-50 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs ${getRarityColor(achievement.rarity)}`}>
                            {achievement.rarity}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                      
                      {isUnlocked && (
                        <div className="text-xs text-purple-600">
                          Unlocked {achievement.unlockedAt.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Community */}
          {activeTab === 'community' && (
            <motion.div
              key="community"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Community</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Study Groups */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-3">Study Groups</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">Berlin Beginners</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">12 members</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">Advanced Conversation</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">8 members</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">Cultural Exchange</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">15 members</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-3">Recent Activity</h4>
                  <div className="space-y-2 text-sm">
                    <div className="text-green-700">Anna completed Oktoberfest simulation</div>
                    <div className="text-green-700">Hans unlocked "Cultural Master" achievement</div>
                    <div className="text-green-700">Lisa joined Coffee Shop scenario</div>
                    <div className="text-green-700">New study group "Munich Learners" created</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Achievement Notification */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className="fixed bottom-4 right-4 bg-white border border-purple-300 rounded-lg shadow-lg p-4 z-50"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{showAchievement.icon}</span>
              <div>
                <h4 className="font-medium text-gray-900">Achievement Unlocked!</h4>
                <p className="text-sm text-gray-600">{showAchievement.title}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 