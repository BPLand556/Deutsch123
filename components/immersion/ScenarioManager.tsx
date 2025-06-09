'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImmersiveBackground } from './ImmersiveBackground';
import { AdvancedCharacter } from './AdvancedCharacter';
import { useAdaptiveLearning } from '@/hooks/useAdaptiveLearning';

interface ScenarioContent {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  culturalContext: string;
  vocabulary: {
    essential: string[];
    intermediate: string[];
    advanced: string[];
  };
  grammar: {
    beginner: string[];
    intermediate: string[];
    advanced: string[];
  };
  dialogue: {
    role: 'user' | 'character';
    text: string;
    translation?: string;
    culturalNote?: string;
  }[];
  objectives: string[];
  culturalInsights: string[];
  regionalVariations: Record<string, string>;
}

interface ScenarioManagerProps {
  initialScenario?: string;
  onScenarioComplete?: (scenarioId: string, performance: number) => void;
  onScenarioChange?: (scenarioId: string) => void;
  className?: string;
}

const SCENARIO_DATABASE: Record<string, ScenarioContent> = {
  'coffee-shop-basic': {
    id: 'coffee-shop-basic',
    title: 'Ordering Coffee in Berlin',
    description: 'Learn to order coffee and engage in casual conversation at a Berlin coffee shop.',
    difficulty: 'beginner',
    culturalContext: 'Coffee culture in Berlin is relaxed and social. Many shops have a creative, international atmosphere.',
    vocabulary: {
      essential: ['Kaffee', 'Milch', 'Zucker', 'Bitte', 'Danke'],
      intermediate: ['Espresso', 'Cappuccino', 'Latte', 'Kuchen', 'Tisch'],
      advanced: ['Barista', 'Röstung', 'Bohnen', 'Filterkaffee', 'Kaffeeklatsch'],
    },
    grammar: {
      beginner: ['Present tense', 'Basic questions', 'Polite requests'],
      intermediate: ['Modal verbs', 'Past tense', 'Conditional'],
      advanced: ['Subjunctive', 'Complex sentences', 'Idiomatic expressions'],
    },
    dialogue: [
      {
        role: 'character',
        text: 'Guten Morgen! Wie kann ich Ihnen helfen?',
        translation: 'Good morning! How can I help you?',
        culturalNote: 'Germans are generally direct but polite in service situations.',
      },
      {
        role: 'user',
        text: 'Ich möchte einen Kaffee, bitte.',
        translation: 'I would like a coffee, please.',
        culturalNote: 'Using "möchte" (would like) is more polite than "will" (want).',
      },
      {
        role: 'character',
        text: 'Mit Milch und Zucker?',
        translation: 'With milk and sugar?',
        culturalNote: 'Germans often ask about preferences rather than assuming.',
      },
    ],
    objectives: [
      'Order a coffee in German',
      'Understand basic service interactions',
      'Learn coffee-related vocabulary',
    ],
    culturalInsights: [
      'Germans take their coffee seriously and prefer quality over quantity',
      'Many coffee shops in Berlin are international and English-friendly',
      'Tipping is appreciated but not mandatory in coffee shops',
    ],
    regionalVariations: {
      'Berlin': 'More casual, international atmosphere',
      'Munich': 'More traditional, formal service',
      'Hamburg': 'Modern, hipster coffee culture',
    },
  },
  'university-academic': {
    id: 'university-academic',
    title: 'Academic Discussion at University',
    description: 'Participate in an academic discussion about German literature and culture.',
    difficulty: 'intermediate',
    culturalContext: 'German universities value intellectual discourse and critical thinking.',
    vocabulary: {
      essential: ['Universität', 'Studium', 'Vorlesung', 'Professor', 'Student'],
      intermediate: ['Literatur', 'Kultur', 'Diskussion', 'Analyse', 'Theorie'],
      advanced: ['Geisteswissenschaften', 'Forschungsmethoden', 'Akademische Debatte', 'Kritische Betrachtung'],
    },
    grammar: {
      beginner: ['Present tense', 'Basic questions'],
      intermediate: ['Past tense', 'Modal verbs', 'Complex sentences'],
      advanced: ['Subjunctive', 'Academic language', 'Formal expressions'],
    },
    dialogue: [
      {
        role: 'character',
        text: 'Guten Tag. Heute diskutieren wir über Goethes "Faust".',
        translation: 'Good day. Today we will discuss Goethe\'s "Faust".',
        culturalNote: 'German academic discourse is formal and structured.',
      },
      {
        role: 'user',
        text: 'Das ist sehr interessant. Was denken Sie über die Hauptfigur?',
        translation: 'That is very interesting. What do you think about the main character?',
        culturalNote: 'Asking for opinions shows engagement in academic discussion.',
      },
    ],
    objectives: [
      'Participate in academic discussion',
      'Use formal academic language',
      'Understand German literary culture',
    ],
    culturalInsights: [
      'German universities have a long tradition of academic excellence',
      'Students are expected to be critical and analytical',
      'Formal titles and respect for professors are important',
    ],
    regionalVariations: {
      'Munich': 'Traditional academic culture, strong humanities focus',
      'Berlin': 'More diverse, international student body',
      'Heidelberg': 'Historic university with strong research tradition',
    },
  },
  'business-meeting-formal': {
    id: 'business-meeting-formal',
    title: 'Business Meeting in Frankfurt',
    description: 'Navigate a formal business meeting with German colleagues.',
    difficulty: 'advanced',
    culturalContext: 'German business culture values efficiency, precision, and direct communication.',
    vocabulary: {
      essential: ['Geschäft', 'Meeting', 'Präsentation', 'Projekt', 'Team'],
      intermediate: ['Strategie', 'Entscheidung', 'Verhandlung', 'Vertrag', 'Budget'],
      advanced: ['Geschäftsmodell', 'Marktanalyse', 'Investition', 'Risikobewertung', 'Stakeholder'],
    },
    grammar: {
      beginner: ['Present tense', 'Basic questions'],
      intermediate: ['Past tense', 'Modal verbs', 'Business vocabulary'],
      advanced: ['Subjunctive', 'Formal business language', 'Complex negotiations'],
    },
    dialogue: [
      {
        role: 'character',
        text: 'Willkommen zu unserem Meeting. Lassen Sie uns mit der Tagesordnung beginnen.',
        translation: 'Welcome to our meeting. Let\'s begin with the agenda.',
        culturalNote: 'German business meetings are structured and agenda-driven.',
      },
      {
        role: 'user',
        text: 'Vielen Dank. Ich möchte unsere Projektfortschritte präsentieren.',
        translation: 'Thank you. I would like to present our project progress.',
        culturalNote: 'Being prepared and direct is valued in German business culture.',
      },
    ],
    objectives: [
      'Conduct business discussions in German',
      'Use formal business language',
      'Understand German business etiquette',
    ],
    culturalInsights: [
      'Punctuality is crucial in German business culture',
      'Direct communication is preferred over small talk',
      'Decisions are often made based on data and analysis',
    ],
    regionalVariations: {
      'Frankfurt': 'Financial center, international business focus',
      'Munich': 'Technology and manufacturing focus',
      'Hamburg': 'Trade and logistics emphasis',
    },
  },
  'supermarket-daily': {
    id: 'supermarket-daily',
    title: 'Shopping at German Supermarket',
    description: 'Navigate a German supermarket and understand product labels.',
    difficulty: 'beginner',
    culturalContext: 'German supermarkets have strict labeling and many organic options.',
    vocabulary: {
      essential: ['Supermarkt', 'Produkt', 'Preis', 'Kasse', 'Einkaufswagen'],
      intermediate: ['Bio', 'Regional', 'Saison', 'Angebot', 'Rabatt'],
      advanced: ['Zutatenliste', 'Nährwertangaben', 'Allergene', 'Haltbarkeit', 'Nachhaltigkeit'],
    },
    grammar: {
      beginner: ['Present tense', 'Basic questions', 'Numbers'],
      intermediate: ['Past tense', 'Modal verbs', 'Comparisons'],
      advanced: ['Complex questions', 'Conditional', 'Passive voice'],
    },
    dialogue: [
      {
        role: 'character',
        text: 'Kann ich Ihnen helfen? Suchen Sie etwas Bestimmtes?',
        translation: 'Can I help you? Are you looking for something specific?',
        culturalNote: 'German customer service is helpful but not overly friendly.',
      },
      {
        role: 'user',
        text: 'Ja, wo finde ich Bio-Gemüse?',
        translation: 'Yes, where can I find organic vegetables?',
        culturalNote: 'Organic products are very popular in Germany.',
      },
    ],
    objectives: [
      'Navigate a German supermarket',
      'Understand product labels',
      'Ask for help and directions',
    ],
    culturalInsights: [
      'Germans value quality and are willing to pay more for organic products',
      'Sunday shopping is restricted in most German states',
      'Bottle deposits (Pfand) are common for beverages',
    ],
    regionalVariations: {
      'Bavaria': 'Strong emphasis on regional products',
      'Berlin': 'More international products available',
      'Hamburg': 'Focus on fresh seafood and northern specialties',
    },
  },
  'social-gathering-casual': {
    id: 'social-gathering-casual',
    title: 'Social Gathering at Beer Garden',
    description: 'Engage in casual conversation at a traditional German beer garden.',
    difficulty: 'intermediate',
    culturalContext: 'Beer gardens are central to German social culture, especially in Bavaria.',
    vocabulary: {
      essential: ['Bier', 'Garten', 'Freunde', 'Gespräch', 'Gesellschaft'],
      intermediate: ['Biergarten', 'Wirtshaus', 'Stammtisch', 'Gemütlichkeit', 'Feierabend'],
      advanced: ['Brauerei', 'Bierkultur', 'Geselligkeit', 'Tradition', 'Gemeinschaft'],
    },
    grammar: {
      beginner: ['Present tense', 'Basic questions', 'Informal speech'],
      intermediate: ['Past tense', 'Modal verbs', 'Casual expressions'],
      advanced: ['Subjunctive', 'Idiomatic expressions', 'Regional dialect'],
    },
    dialogue: [
      {
        role: 'character',
        text: 'Prost! Schön, dass du da bist. Wie geht\'s?',
        translation: 'Cheers! Nice that you\'re here. How are you?',
        culturalNote: 'Germans are more relaxed and friendly in social settings.',
      },
      {
        role: 'user',
        text: 'Danke, mir geht es gut. Das Bier schmeckt ausgezeichnet!',
        translation: 'Thank you, I\'m doing well. The beer tastes excellent!',
        culturalNote: 'Complimenting food and drink is appreciated in German culture.',
      },
    ],
    objectives: [
      'Engage in casual social conversation',
      'Understand German social customs',
      'Learn about beer garden culture',
    ],
    culturalInsights: [
      'Beer gardens are family-friendly and community-oriented',
      'Germans value quality time with friends and family',
      'Social gatherings often revolve around food and drink',
    ],
    regionalVariations: {
      'Bavaria': 'Traditional beer garden culture, lederhosen and dirndl common',
      'Berlin': 'More modern, diverse social scene',
      'Cologne': 'Kölsch beer culture, carnival traditions',
    },
  },
};

export const ScenarioManager: React.FC<ScenarioManagerProps> = ({
  initialScenario = 'coffee-shop-basic',
  onScenarioComplete,
  onScenarioChange,
  className = '',
}) => {
  const [currentScenario, setCurrentScenario] = useState<string>(initialScenario);
  const [scenarioProgress, setScenarioProgress] = useState<number>(0);
  const [showDialogue, setShowDialogue] = useState<boolean>(false);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState<number>(0);
  const [userResponses, setUserResponses] = useState<string[]>([]);

  const {
    userProfile,
    currentDifficulty,
    recommendations,
    nextSuggestedScenario,
    recordInteraction,
    startSession,
    endSession,
  } = useAdaptiveLearning({
    onDifficultyChange: (difficulty) => {
      console.log('Difficulty changed:', difficulty);
    },
    onRecommendationUpdate: (recs) => {
      console.log('New recommendations:', recs);
    },
    onProgressAlert: (insight) => {
      console.log('Learning insight:', insight);
    },
  });

  const currentScenarioData = SCENARIO_DATABASE[currentScenario];

  const handleScenarioChange = useCallback((scenarioId: string) => {
    setCurrentScenario(scenarioId);
    setScenarioProgress(0);
    setShowDialogue(false);
    setCurrentDialogueIndex(0);
    setUserResponses([]);
    onScenarioChange?.(scenarioId);
  }, [onScenarioChange]);

  const handleDialogueProgress = useCallback(() => {
    if (currentDialogueIndex < currentScenarioData.dialogue.length - 1) {
      setCurrentDialogueIndex(prev => prev + 1);
    } else {
      // Scenario complete
      const performance = Math.min(1, scenarioProgress + 0.2);
      setScenarioProgress(performance);
      onScenarioComplete?.(currentScenario, performance);
      
      // Record interaction
      recordInteraction({
        type: 'conversation',
        success: performance > 0.7,
        responseTime: 3000,
        difficulty: currentDifficulty.vocabularyComplexity,
      });
    }
  }, [currentDialogueIndex, currentScenarioData, scenarioProgress, onScenarioComplete, currentScenario, recordInteraction, currentDifficulty]);

  const handleUserResponse = useCallback((response: string) => {
    setUserResponses(prev => [...prev, response]);
    handleDialogueProgress();
  }, [handleDialogueProgress]);

  useEffect(() => {
    startSession();
    return () => endSession();
  }, [startSession, endSession]);

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-500',
      intermediate: 'bg-yellow-500',
      advanced: 'bg-red-500',
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-500';
  };

  const getRegionalVariation = (region: string) => {
    return currentScenarioData.regionalVariations[region] || 'Standard German';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Scenario Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{currentScenarioData.title}</h2>
            <p className="text-gray-600 mt-1">{currentScenarioData.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm text-white ${getDifficultyColor(currentScenarioData.difficulty)}`}>
              {currentScenarioData.difficulty}
            </span>
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
              {Math.round(scenarioProgress * 100)}% Complete
            </span>
          </div>
        </div>

        {/* Cultural Context */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-amber-800 mb-2">Cultural Context</h3>
          <p className="text-amber-700 text-sm">{currentScenarioData.culturalContext}</p>
        </div>

        {/* Learning Objectives */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Learning Objectives</h3>
            <ul className="space-y-1">
              {currentScenarioData.objectives.map((objective, index) => (
                <li key={index} className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                  {objective}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Cultural Insights</h3>
            <ul className="space-y-1">
              {currentScenarioData.culturalInsights.map((insight, index) => (
                <li key={index} className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Immersive Environment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Background */}
        <div className="lg:col-span-2">
          <ImmersiveBackground
            scenario={currentScenario.split('-')[0] as any}
            className="h-96"
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

        {/* Character */}
        <div className="lg:col-span-1">
          <AdvancedCharacter
            character={{
              name: 'Anna',
              age: 24,
              region: 'Berlin',
              profession: 'Barista',
              personality: 'friendly',
              speakingStyle: 'normal',
              formality: 'mixed',
              interests: ['coffee', 'art', 'cycling'],
              background: 'Anna loves the creative atmosphere of Berlin.',
              voiceId: 'de-DE-Wavenet-A',
            }}
            isSpeaking={showDialogue}
            showControls={true}
            onCharacterInteraction={(interaction) => {
              setShowDialogue(true);
              setTimeout(() => setShowDialogue(false), 3000);
            }}
          />
        </div>
      </div>

      {/* Dialogue System */}
      <AnimatePresence>
        {showDialogue && currentScenarioData.dialogue[currentDialogueIndex] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                  currentScenarioData.dialogue[currentDialogueIndex].role === 'character' 
                    ? 'bg-primary-500' 
                    : 'bg-green-500'
                }`}>
                  {currentScenarioData.dialogue[currentDialogueIndex].role === 'character' ? 'A' : 'U'}
                </div>
                <span className="font-medium text-gray-900">
                  {currentScenarioData.dialogue[currentDialogueIndex].role === 'character' ? 'Anna' : 'You'}
                </span>
              </div>
              
              <p className="text-lg text-gray-800 mb-2">
                {currentScenarioData.dialogue[currentDialogueIndex].text}
              </p>
              
              {currentScenarioData.dialogue[currentDialogueIndex].translation && (
                <p className="text-sm text-gray-600 italic">
                  {currentScenarioData.dialogue[currentDialogueIndex].translation}
                </p>
              )}
              
              {currentScenarioData.dialogue[currentDialogueIndex].culturalNote && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">Cultural Note:</span> {currentScenarioData.dialogue[currentDialogueIndex].culturalNote}
                  </p>
                </div>
              )}
            </div>

            {currentScenarioData.dialogue[currentDialogueIndex].role === 'user' && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Your response:</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUserResponse('Ja, das ist richtig.')}
                    className="px-4 py-2 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-lg text-sm transition-colors"
                  >
                    Ja, das ist richtig.
                  </button>
                  <button
                    onClick={() => handleUserResponse('Nein, ich verstehe nicht.')}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
                  >
                    Nein, ich verstehe nicht.
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scenario Navigation */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Available Scenarios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(SCENARIO_DATABASE).map(([id, scenario]) => (
            <button
              key={id}
              onClick={() => handleScenarioChange(id)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                currentScenario === id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{scenario.title}</h4>
                <span className={`px-2 py-1 rounded-full text-xs text-white ${getDifficultyColor(scenario.difficulty)}`}>
                  {scenario.difficulty}
                </span>
              </div>
              <p className="text-sm text-gray-600">{scenario.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Learning Progress */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Learning Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Current Level: {userProfile.currentLevel}</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Vocabulary Retention</span>
                <span>{Math.round(currentDifficulty.vocabularyComplexity * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all"
                  style={{ width: `${currentDifficulty.vocabularyComplexity * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Next Recommended</h4>
            <p className="text-sm text-gray-600 mb-2">
              {SCENARIO_DATABASE[nextSuggestedScenario]?.title}
            </p>
            {recommendations.length > 0 && (
              <div>
                <h5 className="font-medium text-gray-700 mb-1">Recommendations:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {recommendations.map((rec, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-1 h-1 bg-primary-500 rounded-full mr-2"></span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 