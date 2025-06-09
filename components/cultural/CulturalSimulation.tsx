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

const CULTURAL_EVENTS: Record<string, CulturalEvent> = {
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
  'weimar-republic': {
    id: 'weimar-republic',
    title: 'Weimar Republic Cultural Scene',
    description: 'Experience the vibrant arts and culture of 1920s Germany.',
    historicalPeriod: 'Weimar Republic (1919-1933)',
    location: 'Berlin, Weimar',
    participants: ['Artists', 'Writers', 'Musicians', 'Intellectuals', 'Students'],
    culturalContext: 'The Weimar Republic was a period of intense cultural creativity and social change, despite political instability.',
    vocabulary: ['Kunst', 'Literatur', 'Musik', 'Theater', 'Avantgarde', 'Expressionismus', 'Demokratie', 'Freiheit'],
    dialogue: [
      {
        role: 'Artist',
        text: 'Die Kunst muss die Gesellschaft widerspiegeln und verändern.',
        translation: 'Art must reflect and change society.',
        culturalNote: 'Weimar artists believed in the power of art to transform society.',
      },
      {
        role: 'Student',
        text: 'Wir leben in einer Zeit großer Veränderungen und Möglichkeiten.',
        translation: 'We live in a time of great change and possibilities.',
        culturalNote: 'The Weimar period was marked by optimism and experimentation.',
      },
    ],
    outcomes: [
      'Learn about German cultural and artistic movements',
      'Understand the relationship between art and society',
      'Practice vocabulary related to culture and creativity',
      'Experience the intellectual atmosphere of the time',
    ],
    historicalSignificance: 'The Weimar Republic represents a golden age of German culture and intellectual achievement.',
  },
  'medieval-market': {
    id: 'medieval-market',
    title: 'Medieval German Market',
    description: 'Experience daily life in a medieval German market town.',
    historicalPeriod: 'Medieval (12th-15th Century)',
    location: 'Various German cities',
    participants: ['Merchants', 'Craftsmen', 'Nobles', 'Peasants', 'Monks'],
    culturalContext: 'Medieval markets were centers of trade, culture, and social interaction, playing a crucial role in the development of German cities.',
    vocabulary: ['Markt', 'Händler', 'Handwerk', 'Gilde', 'Münze', 'Ware', 'Preis', 'Handel'],
    dialogue: [
      {
        role: 'Merchant',
        text: 'Guten Tag, edler Herr! Welche Waren suchen Sie?',
        translation: 'Good day, noble sir! What goods are you looking for?',
        culturalNote: 'Medieval society was highly hierarchical, reflected in language and customs.',
      },
      {
        role: 'Customer',
        text: 'Ich suche feine Stoffe aus dem Orient.',
        translation: 'I am looking for fine fabrics from the Orient.',
        culturalNote: 'Medieval trade routes brought exotic goods from distant lands.',
      },
    ],
    outcomes: [
      'Learn about medieval German society and economy',
      'Understand the importance of trade in historical development',
      'Practice vocabulary related to commerce and daily life',
      'Experience the social structure of medieval times',
    ],
    historicalSignificance: 'Medieval markets were the foundation of modern European commerce and urban development.',
  },
};

export const CulturalSimulation: React.FC<CulturalSimulationProps> = ({
  event,
  userLevel,
  onEventComplete,
  onCulturalInsight,
  className = '',
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [userChoices, setUserChoices] = useState<string[]>([]);
  const [simulationProgress, setSimulationProgress] = useState<number>(0);
  const [showHistoricalContext, setShowHistoricalContext] = useState<boolean>(false);
  const [currentDialogue, setCurrentDialogue] = useState<number>(0);

  const handleChoice = useCallback((choice: string) => {
    setUserChoices(prev => [...prev, choice]);
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
                      onClick={() => handleChoice(choice)}
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