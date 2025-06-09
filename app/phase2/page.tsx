'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ImmersiveBackground } from '@/components/immersion/ImmersiveBackground';
import { AdvancedCharacter } from '@/components/immersion/AdvancedCharacter';
import { ScenarioManager } from '@/components/immersion/ScenarioManager';
import { useAdaptiveLearning } from '@/hooks/useAdaptiveLearning';
import { VoiceInput } from '@/components/voice/VoiceInput';
import { TextToSpeech } from '@/components/voice/TextToSpeech';
import { TranslationReveal } from '@/components/translation/TranslationReveal';

export default function Phase2Page() {
  const [selectedFeature, setSelectedFeature] = useState<string>('scenarios');
  const [currentScenario, setCurrentScenario] = useState<string>('coffee-shop-basic');
  const [selectedCharacter, setSelectedCharacter] = useState<string>('anna-barista');
  const [showLearningDashboard, setShowLearningDashboard] = useState<boolean>(false);

  const {
    userProfile,
    currentMetrics,
    currentDifficulty,
    recommendations,
    progressTrend,
    nextSuggestedScenario,
    learningInsights,
    recordInteraction,
    startSession,
    endSession,
  } = useAdaptiveLearning({
    onDifficultyChange: (difficulty) => {
      console.log('Difficulty adjusted:', difficulty);
    },
    onRecommendationUpdate: (recs) => {
      console.log('New recommendations:', recs);
    },
    onProgressAlert: (insight) => {
      console.log('Learning insight:', insight);
    },
  });

  const CHARACTERS = {
    'anna-barista': {
      name: 'Anna',
      age: 24,
      region: 'Berlin' as const,
      profession: 'Barista',
      personality: 'friendly' as const,
      speakingStyle: 'normal' as const,
      formality: 'mixed' as const,
      interests: ['coffee', 'art', 'cycling', 'Berlin culture'],
      background: 'Anna grew up in Kreuzberg and loves the diverse, creative atmosphere of Berlin.',
      voiceId: 'de-DE-Wavenet-A',
    },
    'klaus-professor': {
      name: 'Prof. Dr. Klaus Weber',
      age: 58,
      region: 'Munich' as const,
      profession: 'University Professor',
      personality: 'formal' as const,
      speakingStyle: 'slow' as const,
      formality: 'formal' as const,
      interests: ['classical music', 'literature', 'hiking', 'wine'],
      background: 'Professor Weber teaches German literature at LMU Munich.',
      voiceId: 'de-DE-Wavenet-D',
    },
    'sophie-student': {
      name: 'Sophie',
      age: 20,
      region: 'Hamburg' as const,
      profession: 'University Student',
      personality: 'enthusiastic' as const,
      speakingStyle: 'fast' as const,
      formality: 'informal' as const,
      interests: ['sustainability', 'travel', 'photography', 'indie music'],
      background: 'Sophie is studying environmental science and loves meeting international students.',
      voiceId: 'de-DE-Wavenet-C',
    },
  };

  const features = [
    {
      id: 'scenarios',
      title: 'Expanded Scenarios',
      description: 'Diverse cultural contexts with progressive complexity',
      icon: '🌍',
      color: 'bg-blue-500',
    },
    {
      id: 'characters',
      title: 'Advanced Characters',
      description: 'Sophisticated personalities with regional diversity',
      icon: '👥',
      color: 'bg-green-500',
    },
    {
      id: 'learning',
      title: 'Adaptive Learning',
      description: 'Intelligent system with real-time analysis',
      icon: '🧠',
      color: 'bg-purple-500',
    },
    {
      id: 'immersion',
      title: '360° Immersion',
      description: 'Interactive environments with ambient audio',
      icon: '🎮',
      color: 'bg-orange-500',
    },
  ];

  const handleFeatureSelect = (featureId: string) => {
    setSelectedFeature(featureId);
    startSession();
  };

  const handleScenarioComplete = (scenarioId: string, performance: number) => {
    console.log(`Scenario ${scenarioId} completed with ${performance * 100}% performance`);
    recordInteraction({
      type: 'conversation',
      success: performance > 0.7,
      responseTime: 3000,
      difficulty: currentDifficulty.vocabularyComplexity,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Phase 2: Advanced Immersive Experience</h1>
              <p className="text-gray-600 mt-1">Enhanced virtual environments, intelligent learning, and expanded scenarios</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                Level: {userProfile.currentLevel}
              </span>
              <button
                onClick={() => setShowLearningDashboard(!showLearningDashboard)}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                Learning Dashboard
              </button>
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
                  ? 'border-primary-500 bg-primary-50 shadow-lg'
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
          {/* Expanded Scenarios */}
          {selectedFeature === 'scenarios' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Expanded Scenario Development</h2>
              <ScenarioManager
                initialScenario={currentScenario}
                onScenarioComplete={handleScenarioComplete}
                className="space-y-6"
              />
            </motion.div>
          )}

          {/* Advanced Characters */}
          {selectedFeature === 'characters' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Advanced Character Development</h2>
              
              {/* Character Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {Object.entries(CHARACTERS).map(([id, character]) => (
                  <button
                    key={id}
                    onClick={() => setSelectedCharacter(id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedCharacter === id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <AdvancedCharacter
                      character={character}
                      showControls={false}
                      className="w-full"
                    />
                  </button>
                ))}
              </div>

              {/* Selected Character Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <AdvancedCharacter
                  character={CHARACTERS[selectedCharacter as keyof typeof CHARACTERS]}
                  showControls={true}
                  className="w-full"
                />
              </div>
            </motion.div>
          )}

          {/* Adaptive Learning */}
          {selectedFeature === 'learning' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Intelligent Adaptive Learning System</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                            className="bg-primary-500 h-2 rounded-full transition-all"
                            style={{ width: `${value * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Difficulty & Recommendations */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Current Settings</h3>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Current Difficulty Level</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Vocabulary Complexity</span>
                        <span>{Math.round(currentDifficulty.vocabularyComplexity * 100)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Grammar Complexity</span>
                        <span>{Math.round(currentDifficulty.grammarComplexity * 100)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Speech Speed</span>
                        <span>{Math.round(currentDifficulty.speechSpeed * 100)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Translation Support</span>
                        <span>{Math.round(currentDifficulty.translationSupport * 100)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">Recommendations</h4>
                    {recommendations.length > 0 ? (
                      <ul className="space-y-1">
                        {recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-green-700 flex items-center">
                            <span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-green-600">Complete more scenarios to get personalized recommendations.</p>
                    )}
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="font-medium text-amber-900 mb-2">Learning Insights</h4>
                    {learningInsights.length > 0 ? (
                      <ul className="space-y-1">
                        {learningInsights.map((insight, index) => (
                          <li key={index} className="text-sm text-amber-700 flex items-center">
                            <span className="w-1 h-1 bg-amber-500 rounded-full mr-2"></span>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-amber-600">Continue learning to receive insights.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 360° Immersion */}
          {selectedFeature === 'immersion' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">360° Immersive Environments</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Interactive Background */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Interactive Coffee Shop</h3>
                  <div className="h-80">
                    <ImmersiveBackground
                      scenario="coffee-shop"
                      className="h-full"
                      showInteractions={true}
                      onElementClick={(element) => {
                        console.log('Interactive element clicked:', element);
                        recordInteraction({
                          type: 'cultural',
                          success: true,
                          responseTime: 2000,
                          difficulty: currentDifficulty.culturalContext,
                        });
                      }}
                    />
                  </div>
                </div>

                {/* Voice Interaction Demo */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Voice Interaction Demo</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Try speaking German:</h4>
                      <VoiceInput
                        onTranscript={(transcript) => {
                          console.log('Voice input:', transcript);
                          recordInteraction({
                            type: 'pronunciation',
                            success: transcript.length > 0,
                            responseTime: 2000,
                            difficulty: currentDifficulty.speechSpeed,
                          });
                        }}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Text-to-Speech Demo:</h4>
                      <TextToSpeech
                        text="Guten Tag! Wie geht es Ihnen heute?"
                        autoPlay={false}
                        showControls={true}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Hidden Translation Demo:</h4>
                      <TranslationReveal
                        germanText="Ich möchte einen Kaffee, bitte."
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Learning Dashboard Modal */}
        {showLearningDashboard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Learning Dashboard</h2>
                <button
                  onClick={() => setShowLearningDashboard(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Profile */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">User Profile</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Level:</span> {userProfile.currentLevel}</div>
                    <div><span className="font-medium">Sessions:</span> {userProfile.sessionsCompleted}</div>
                    <div><span className="font-medium">Time Learning:</span> {Math.round(userProfile.timeSpentLearning)} minutes</div>
                    <div><span className="font-medium">Learning Style:</span> {userProfile.preferredLearningStyle}</div>
                    <div><span className="font-medium">Interests:</span> {userProfile.interests.join(', ')}</div>
                  </div>
                </div>

                {/* Progress Trend */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-3">Progress Trend</h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm text-white ${
                      progressTrend === 'improving' ? 'bg-green-500' :
                      progressTrend === 'declining' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}>
                      {progressTrend}
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">
                    {progressTrend === 'improving' && 'Great progress! Keep up the good work.'}
                    {progressTrend === 'stable' && 'Steady progress. Consider challenging yourself more.'}
                    {progressTrend === 'declining' && 'Consider reviewing previous material to reinforce learning.'}
                  </p>
                </div>

                {/* Next Scenario */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-3">Next Recommended Scenario</h3>
                  <p className="text-sm text-green-700">
                    Based on your progress and interests, we recommend trying the{' '}
                    <span className="font-medium">{nextSuggestedScenario.replace('-', ' ')}</span> scenario.
                  </p>
                </div>

                {/* Performance Score */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-3">Overall Performance</h3>
                  <div className="text-3xl font-bold text-purple-700">
                    {Math.round((currentMetrics.vocabularyRetention + currentMetrics.pronunciationAccuracy + currentMetrics.conversationConfidence) / 3 * 100)}%
                  </div>
                  <p className="text-sm text-purple-600 mt-1">Combined score across all metrics</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 