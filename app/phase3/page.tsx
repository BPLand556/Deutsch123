'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AIConversationPartner } from '@/components/ai/AIConversationPartner';
import { CulturalSimulation } from '@/components/cultural/CulturalSimulation';
import { SocialLearningHub } from '@/components/social/SocialLearningHub';
import { useAdaptiveLearning } from '@/hooks/useAdaptiveLearning';

export default function Phase3Page() {
  const [selectedFeature, setSelectedFeature] = useState<string>('ai-conversation');
  const [selectedAIPersonality, setSelectedAIPersonality] = useState<string>('anna');
  const [selectedCulturalEvent, setSelectedCulturalEvent] = useState<string>('oktoberfest-munich');
  const [conversationInsights, setConversationInsights] = useState<string[]>([]);
  const [culturalInsights, setCulturalInsights] = useState<string[]>([]);

  const {
    userProfile,
    currentMetrics,
    recordInteraction,
    startSession
  } = useAdaptiveLearning();

  const AI_PERSONALITIES = {
    anna: {
      name: 'Anna',
      personality: 'friendly' as const,
      region: 'Berlin' as const,
      profession: 'Barista',
      interests: ['coffee', 'art', 'cycling', 'Berlin culture'],
      speakingStyle: 'normal' as const,
      formality: 'mixed' as const,
      expertise: ['coffee culture', 'Berlin lifestyle', 'casual conversation'],
    },
    klaus: {
      name: 'Prof. Dr. Klaus Weber',
      personality: 'formal' as const,
      region: 'Munich' as const,
      profession: 'University Professor',
      interests: ['classical music', 'literature', 'hiking', 'wine'],
      speakingStyle: 'slow' as const,
      formality: 'formal' as const,
      expertise: ['academic German', 'literature', 'cultural history'],
    },
    sophie: {
      name: 'Sophie',
      personality: 'enthusiastic' as const,
      region: 'Hamburg' as const,
      profession: 'University Student',
      interests: ['sustainability', 'travel', 'photography', 'indie music'],
      speakingStyle: 'fast' as const,
      formality: 'informal' as const,
      expertise: ['youth culture', 'environmental topics', 'modern German'],
    },
  };

  const CULTURAL_EVENTS = {
    'oktoberfest-munich': {
      id: 'oktoberfest-munich',
      title: 'Oktoberfest in Munich',
      description: 'Experience the world\'s largest beer festival and cultural celebration.',
      historicalPeriod: 'Modern (1810 - Present)',
      location: 'Munich, Bavaria',
      participants: ['Local Bavarians', 'International tourists', 'Beer tent staff', 'Traditional musicians'],
      culturalContext: 'Oktoberfest celebrates Bavarian culture, tradition, and community. It began as a royal wedding celebration and has grown into a global phenomenon.',
      vocabulary: ['Bier', 'Wiesn', 'Dirndl', 'Lederhosen', 'Prost', 'Gemütlichkeit', 'Bierzelt', 'Maß'],
      dialogue: [
        {
          role: 'Bavarian Local',
          text: 'Servus! Willkommen auf der Wiesn! Möchten Sie ein Maß Bier?',
          translation: 'Hello! Welcome to Oktoberfest! Would you like a liter of beer?',
          culturalNote: 'Servus is a traditional Bavarian greeting, and "Wiesn" is the local name for Oktoberfest.',
        },
        {
          role: 'User',
          text: 'Ja, gerne! Ein Maß bitte.',
          translation: 'Yes, please! A liter please.',
          culturalNote: 'Maß refers to the traditional 1-liter beer mug used at Oktoberfest.',
        },
        {
          role: 'Bavarian Local',
          text: 'Prost! Zum Wohl!',
          translation: 'Cheers! To your health!',
          culturalNote: 'Prost is the traditional German toast, and "Zum Wohl" means "to your health".',
        },
      ],
      outcomes: [
        'Learn about Bavarian traditions and customs',
        'Understand the importance of community celebrations',
        'Practice traditional German toasts and greetings',
        'Experience authentic cultural interaction',
      ],
      historicalSignificance: 'Oktoberfest represents the preservation of Bavarian culture and the importance of tradition in modern German society.',
    },
    'berlin-wall-fall': {
      id: 'berlin-wall-fall',
      title: 'The Fall of the Berlin Wall',
      description: 'Witness the historic moment when East and West Germany were reunited.',
      historicalPeriod: 'Cold War (1989)',
      location: 'Berlin, Germany',
      participants: ['East German citizens', 'West German citizens', 'International journalists', 'Political leaders'],
      culturalContext: 'The fall of the Berlin Wall symbolized the end of the Cold War and the reunification of Germany, marking a pivotal moment in European history.',
      vocabulary: ['Mauer', 'Wiedervereinigung', 'Freiheit', 'Demokratie', 'Grenze', 'Ost', 'West', 'Einheit'],
      dialogue: [
        {
          role: 'East German Citizen',
          text: 'Die Mauer ist gefallen! Wir sind frei!',
          translation: 'The wall has fallen! We are free!',
          culturalNote: 'This moment represented the end of decades of separation and oppression.',
        },
        {
          role: 'West German Citizen',
          text: 'Willkommen! Endlich sind wir wieder vereint!',
          translation: 'Welcome! Finally we are reunited!',
          culturalNote: 'The reunification brought together families and friends separated for decades.',
        },
      ],
      outcomes: [
        'Understand the historical significance of German reunification',
        'Learn about the impact of political change on ordinary citizens',
        'Practice vocabulary related to freedom and unity',
        'Experience the emotional weight of historical events',
      ],
      historicalSignificance: 'The fall of the Berlin Wall marked the end of the Cold War and the beginning of a new era in European history.',
    },
  };

  const MOCK_USER = {
    id: 'current-user',
    name: 'You',
    avatar: '👤',
    level: userProfile.currentLevel,
    points: 850,
    achievements: [],
    currentStreak: 5,
    totalStudyTime: 120,
    region: 'International',
  };

  const features = [
    {
      id: 'ai-conversation',
      title: 'AI Conversation Partners',
      description: 'Natural language processing with contextual understanding',
      icon: '🤖',
      color: 'bg-blue-500',
    },
    {
      id: 'cultural-simulations',
      title: 'Cultural Simulations',
      description: 'Historical contexts with authentic experiences',
      icon: '🏛️',
      color: 'bg-amber-500',
    },
    {
      id: 'social-learning',
      title: 'Social Learning',
      description: 'Multiplayer scenarios and community features',
      icon: '👥',
      color: 'bg-purple-500',
    },
    {
      id: 'gamification',
      title: 'Gamification',
      description: 'Achievements, leaderboards, and progress tracking',
      icon: '🏆',
      color: 'bg-green-500',
    },
  ];

  const handleFeatureSelect = (featureId: string) => {
    setSelectedFeature(featureId);
    startSession();
  };

  const handleConversationUpdate = useCallback((context: any) => {
    console.log('Conversation updated:', context);
    recordInteraction({
      type: 'conversation',
      success: true,
      responseTime: 2000,
    });
  }, [recordInteraction]);

  const handleLearningInsight = useCallback((insight: string) => {
    setConversationInsights(prev => [...prev, insight]);
  }, []);

  const handleCulturalInsight = useCallback((insight: string) => {
    setCulturalInsights(prev => [...prev, insight]);
  }, []);

  const handleScenarioJoin = useCallback((scenario: any) => {
    console.log('Joined scenario:', scenario);
    recordInteraction({
      type: 'cultural',
      success: true,
      responseTime: 3000,
    });
  }, [recordInteraction]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Phase 3: Advanced AI & Social Learning</h1>
              <p className="text-gray-600 mt-1">AI-powered conversations, cultural simulations, and social learning features</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                Level: {userProfile.currentLevel}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                {MOCK_USER.points} Points
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Feature Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => handleFeatureSelect(feature.id)}
              className={`p-6 rounded-xl border-2 transition-all ${
                selectedFeature === feature.id
                  ? 'border-purple-500 bg-purple-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="text-center">
                <div className={`w-12 h-12 ${feature.color} rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Feature Content */}
        <div className="space-y-8">
          {/* AI Conversation Partners */}
          {selectedFeature === 'ai-conversation' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">AI-Powered Conversation Partners</h2>
                
                {/* AI Personality Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Conversation Partner</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(AI_PERSONALITIES).map(([id, personality]) => (
                      <button
                        key={id}
                        onClick={() => setSelectedAIPersonality(id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedAIPersonality === id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3">
                            {personality.name.charAt(0)}
                          </div>
                          <h4 className="font-medium text-gray-900">{personality.name}</h4>
                          <p className="text-sm text-gray-600">{personality.profession}</p>
                          <p className="text-xs text-gray-500 mt-1">{personality.region}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Conversation */}
                <AIConversationPartner
                  personality={AI_PERSONALITIES[selectedAIPersonality as keyof typeof AI_PERSONALITIES]}
                  userLevel={userProfile.currentLevel}
                  topic="daily-life"
                  onConversationUpdate={handleConversationUpdate}
                  onLearningInsight={handleLearningInsight}
                  className="w-full"
                />
              </div>

              {/* Learning Insights */}
              {conversationInsights.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-3">Learning Insights</h3>
                  <div className="space-y-2">
                    {conversationInsights.slice(-3).map((insight, index) => (
                      <div key={index} className="flex items-center text-sm text-blue-700">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {insight}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Cultural Simulations */}
          {selectedFeature === 'cultural-simulations' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Advanced Cultural Simulations</h2>
                
                {/* Event Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose a Cultural Event</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(CULTURAL_EVENTS).map(([id, event]) => (
                      <button
                        key={id}
                        onClick={() => setSelectedCulturalEvent(id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedCulturalEvent === id
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <h4 className="font-medium text-gray-900 mb-2">{event.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {event.historicalPeriod}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {event.location}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cultural Simulation */}
                <CulturalSimulation
                  event={CULTURAL_EVENTS[selectedCulturalEvent as keyof typeof CULTURAL_EVENTS]}
                  onEventComplete={(eventId, performance) => {
                    console.log(`Cultural event ${eventId} completed with ${performance * 100}% performance`);
                    recordInteraction({
                      type: 'cultural',
                      success: performance > 0.7,
                      responseTime: 3000,
                    });
                  }}
                  onCulturalInsight={handleCulturalInsight}
                  className="w-full"
                />
              </div>

              {/* Cultural Insights */}
              {culturalInsights.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-900 mb-3">Cultural Insights</h3>
                  <div className="space-y-2">
                    {culturalInsights.slice(-3).map((insight, index) => (
                      <div key={index} className="flex items-center text-sm text-amber-700">
                        <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                        {insight}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Social Learning */}
          {selectedFeature === 'social-learning' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Social Learning Hub</h2>
                
                <SocialLearningHub
                  currentUser={MOCK_USER}
                  onScenarioJoin={handleScenarioJoin}
                  className="w-full"
                />
              </div>
            </motion.div>
          )}

          {/* Gamification */}
          {selectedFeature === 'gamification' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Gamification & Progress Tracking</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Progress Overview */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Your Progress</h3>
                    
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-4 text-white">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Total Points</span>
                          <span className="text-2xl font-bold">{MOCK_USER.points}</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div className="bg-white h-2 rounded-full" style={{ width: `${(MOCK_USER.points / 3000) * 100}%` }}></div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-4 text-white">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Learning Streak</span>
                          <span className="text-2xl font-bold">{MOCK_USER.currentStreak} days</span>
                        </div>
                        <div className="text-sm opacity-90">Keep it up! 🔥</div>
                      </div>

                      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg p-4 text-white">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Study Time</span>
                          <span className="text-2xl font-bold">{MOCK_USER.totalStudyTime} min</span>
                        </div>
                        <div className="text-sm opacity-90">This week</div>
                      </div>
                    </div>
                  </div>

                  {/* Learning Metrics */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Learning Metrics</h3>
                    
                    <div className="space-y-4">
                      {Object.entries(currentMetrics).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-gray-700 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="text-gray-600">{Math.round(value * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all"
                              style={{ width: `${value * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                      Start Practice
                    </button>
                    <button className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
                      Review Vocabulary
                    </button>
                    <button className="p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
                      Join Study Group
                    </button>
                    <button className="p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
                      Take Quiz
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
} 