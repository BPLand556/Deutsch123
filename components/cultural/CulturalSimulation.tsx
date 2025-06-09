'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextToSpeech } from '@/components/voice/TextToSpeech';

interface CulturalEvent {
  id: string;
  title: string;
  description: string;
  historicalPeriod: string;
  location: string;
  participants: string[];
  culturalContext: string;
  vocabulary: string[];
  dialogue: {
    role: string;
    text: string;
    translation: string;
    culturalNote: string;
  }[];
  outcomes: string[];
  historicalSignificance: string;
}

interface CulturalSimulationProps {
  event: CulturalEvent;
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  onEventComplete?: (eventId: string, performance: number) => void;
  onCulturalInsight?: (insight: string) => void;
  className?: string;
}

export const CulturalSimulation: React.FC<Omit<CulturalSimulationProps, 'userLevel'>> = ({
  event,
  onEventComplete,
  onCulturalInsight,
  className = '',
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [simulationProgress, setSimulationProgress] = useState<number>(0);
  const [showHistoricalContext, setShowHistoricalContext] = useState<boolean>(false);
  const [currentDialogue, setCurrentDialogue] = useState<number>(0);

  const handleChoice = useCallback(() => {
    setCurrentStep(prev => prev + 1);
    setSimulationProgress(prev => Math.min(100, prev + 25));

    // Generate cultural insight
    if (Math.random() > 0.7) {
      const insights = [
        `Excellent choice! This reflects understanding of ${event.historicalPeriod} customs.`,
        `This decision shows awareness of the cultural context of the time.`,
        `Your response demonstrates respect for historical traditions.`,
        `This choice aligns with the values of ${event.historicalPeriod} society.`,
      ];
      const randomInsight = insights[Math.floor(Math.random() * insights.length)];
      onCulturalInsight?.(randomInsight);
    }

    // Complete simulation if all steps done
    if (currentStep >= event.dialogue.length - 1) {
      const performance = Math.min(1, simulationProgress / 100 + 0.2);
      onEventComplete?.(event.id, performance);
    }
  }, [currentStep, event, simulationProgress, onEventComplete, onCulturalInsight]);

  const handleDialogueProgress = useCallback(() => {
    if (currentDialogue < event.dialogue.length - 1) {
      setCurrentDialogue(prev => prev + 1);
    } else {
      setCurrentDialogue(0);
    }
  }, [currentDialogue, event.dialogue.length]);

  useEffect(() => {
    // Auto-advance dialogue for demonstration
    const interval = setInterval(() => {
      handleDialogueProgress();
    }, 5000);
    return () => clearInterval(interval);
  }, [handleDialogueProgress]);

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Event Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{event.title}</h2>
            <p className="text-amber-100 mt-1">{event.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                {event.historicalPeriod}
              </span>
              <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                {event.location}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{Math.round(simulationProgress)}%</div>
            <div className="text-amber-100 text-sm">Complete</div>
          </div>
        </div>
      </div>

      {/* Historical Context */}
      <div className="p-6 border-b">
        <button
          onClick={() => setShowHistoricalContext(!showHistoricalContext)}
          className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Historical Context
        </button>
        
        <AnimatePresence>
          {showHistoricalContext && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg"
            >
              <h3 className="font-semibold text-amber-900 mb-2">Cultural Background</h3>
              <p className="text-amber-800 text-sm mb-3">{event.culturalContext}</p>
              
              <h4 className="font-medium text-amber-900 mb-2">Historical Significance</h4>
              <p className="text-amber-800 text-sm">{event.historicalSignificance}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Simulation Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dialogue Scene */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Cultural Dialogue</h3>
            
            <div className="bg-gray-50 rounded-lg p-4">
              {event.dialogue[currentDialogue] && (
                <motion.div
                  key={currentDialogue}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {event.dialogue[currentDialogue].role.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-900">{event.dialogue[currentDialogue].role}</span>
                  </div>
                  
                  <div className="ml-11">
                    <p className="text-gray-900 mb-2">{event.dialogue[currentDialogue].text}</p>
                    <p className="text-sm text-gray-600 italic mb-2">{event.dialogue[currentDialogue].translation}</p>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700">{event.dialogue[currentDialogue].culturalNote}</p>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <TextToSpeech
                text={event.dialogue[currentDialogue]?.text || ''}
                autoPlay={false}
                showControls={true}
                className="mt-4"
              />
            </div>
          </div>

          {/* Interactive Choices */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Response</h3>
            
            <div className="space-y-3">
              {currentStep < event.dialogue.length && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">How would you respond in this situation?</p>
                  
                  {['Polite agreement', 'Ask for clarification', 'Express enthusiasm', 'Show cultural respect'].map((choice, index) => (
                    <button
                      key={index}
                      onClick={() => handleChoice()}
                      className="w-full p-3 text-left bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{choice}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {currentStep >= event.dialogue.length && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">Simulation Complete!</h4>
                  <p className="text-green-700 text-sm">You have successfully navigated this cultural scenario.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vocabulary Section */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Key Vocabulary</h3>
          <div className="flex flex-wrap gap-2">
            {event.vocabulary.map((word, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* Learning Outcomes */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-900 mb-3">Learning Outcomes</h3>
          <ul className="space-y-2">
            {event.outcomes.map((outcome, index) => (
              <li key={index} className="flex items-center text-sm text-gray-700">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                {outcome}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}; 