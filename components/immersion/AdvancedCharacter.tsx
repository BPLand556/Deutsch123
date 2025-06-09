'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextToSpeech } from '@/components/voice/TextToSpeech';

interface CharacterPersonality {
  name: string;
  age: number;
  region: 'Berlin' | 'Bavaria' | 'Hamburg' | 'Cologne' | 'Munich' | 'Vienna' | 'Zurich' | 'Frankfurt';
  profession: string;
  personality: 'friendly' | 'formal' | 'casual' | 'enthusiastic' | 'reserved' | 'direct';
  speakingStyle: 'slow' | 'normal' | 'fast';
  formality: 'formal' | 'informal' | 'mixed';
  interests: string[];
  background: string;
  voiceId: string;
}

interface CharacterEmotion {
  type: 'happy' | 'surprised' | 'confused' | 'thoughtful' | 'excited' | 'neutral' | 'concerned';
  intensity: number; // 0-1
  duration: number; // milliseconds
}

export interface AdvancedCharacterProps {
  character: CharacterPersonality;
  currentEmotion?: CharacterEmotion;
  isSpeaking?: boolean;
  className?: string;
  showControls?: boolean;
}

const EMOTION_ANIMATIONS = {
  happy: {
    facial: { scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] },
    color: 'bg-yellow-100',
    icon: '😊',
  },
  surprised: {
    facial: { scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] },
    color: 'bg-blue-100',
    icon: '😲',
  },
  confused: {
    facial: { scale: [1, 0.95, 1], rotate: [0, 3, -3, 0] },
    color: 'bg-purple-100',
    icon: '🤔',
  },
  thoughtful: {
    facial: { scale: [1, 0.98, 1], rotate: [0, -2, 2, 0] },
    color: 'bg-indigo-100',
    icon: '🤨',
  },
  excited: {
    facial: { scale: [1, 1.08, 1], rotate: [0, 5, -5, 0] },
    color: 'bg-orange-100',
    icon: '🤩',
  },
  neutral: {
    facial: { scale: 1, rotate: 0 },
    color: 'bg-gray-100',
    icon: '😐',
  },
  concerned: {
    facial: { scale: [1, 0.97, 1], rotate: [0, -1, 1, 0] },
    color: 'bg-red-100',
    icon: '😟',
  },
};

const REGIONAL_ACCENTS = {
  'Berlin': { description: 'Urban, modern German with some Berlinerisch influence', color: 'bg-blue-500' },
  'Bavaria': { description: 'Southern German with Bavarian dialect features', color: 'bg-blue-600' },
  'Hamburg': { description: 'Northern German with slight Plattdeutsch influence', color: 'bg-blue-400' },
  'Cologne': { description: 'Rhineland German with Kölsch dialect features', color: 'bg-green-500' },
  'Munich': { description: 'Bavarian German with formal, educated speech', color: 'bg-blue-700' },
  'Vienna': { description: 'Austrian German with Viennese dialect', color: 'bg-red-500' },
  'Zurich': { description: 'Swiss German with Zürich dialect', color: 'bg-red-600' },
  'Frankfurt': { description: 'Hessian German with business-oriented speech', color: 'bg-green-600' },
};

export const AdvancedCharacter: React.FC<AdvancedCharacterProps> = ({
  character,
  currentEmotion = { type: 'neutral', intensity: 0.5, duration: 2000 },
  isSpeaking = false,
  className = '',
  showControls = false,
}) => {
  const [displayedEmotion, setDisplayedEmotion] = useState<CharacterEmotion>(currentEmotion);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentDialogue] = useState<string>('');
  const [showPersonality, setShowPersonality] = useState(false);
  const emotionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const emotionConfig = EMOTION_ANIMATIONS[displayedEmotion.type];
  const regionalInfo = REGIONAL_ACCENTS[character.region];

  const handleEmotionChange = useCallback((newEmotion: CharacterEmotion) => {
    if (emotionTimeoutRef.current) {
      clearTimeout(emotionTimeoutRef.current);
    }

    setDisplayedEmotion(newEmotion);
    setIsAnimating(true);

    emotionTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
      setDisplayedEmotion({ type: 'neutral', intensity: 0.5, duration: 1000 });
    }, newEmotion.duration);
  }, []);

  const generateResponse = useCallback(() => {
    // Simple response generation based on character personality
    const responses = {
      'anna-barista': [
        'Hallo! Wie kann ich Ihnen helfen?',
        'Möchten Sie einen Kaffee oder Tee?',
        'Das Wetter in Berlin ist heute wunderbar!'
      ],
      'klaus-professor': [
        'Guten Tag. Haben Sie eine Frage zur deutschen Literatur?',
        'Die deutsche Sprache ist sehr reich an Geschichte.',
        'Wissen Sie, wer Goethe war?'
      ],
      'sophie-student': [
        'Hi! Ich liebe es, neue Leute kennenzulernen.',
        'Hast du Lust, über Nachhaltigkeit zu sprechen?',
        'Hamburg ist eine tolle Stadt für Studenten!'
      ],
      'hans-businessman': [
        'Guten Tag. Wie kann ich Ihnen geschäftlich weiterhelfen?',
        'Frankfurt ist das Finanzzentrum Deutschlands.',
        'Effizienz ist der Schlüssel zum Erfolg.'
      ],
      'lisa-artist': [
        'Hallo! Kunst ist meine Leidenschaft.',
        'Warst du schon mal auf einer Kunstausstellung in Köln?',
        'Jazzmusik inspiriert mich beim Malen.'
      ],
    };
    return responses[character.name.toLowerCase().replace(' ', '-') as keyof typeof responses]?.[Math.floor(Math.random() * 3)] || 'Hallo!';
  }, [character.name]);

  useEffect(() => {
    if (currentEmotion && currentEmotion !== displayedEmotion) {
      handleEmotionChange(currentEmotion);
    }
  }, [currentEmotion, displayedEmotion, handleEmotionChange]);

  useEffect(() => {
    return () => {
      if (emotionTimeoutRef.current) {
        clearTimeout(emotionTimeoutRef.current);
      }
    };
  }, []);

  const getPersonalityColor = (personality: string) => {
    const colors = {
      friendly: 'bg-green-500',
      formal: 'bg-blue-500',
      casual: 'bg-orange-500',
      enthusiastic: 'bg-yellow-500',
      reserved: 'bg-purple-500',
      direct: 'bg-red-500',
    };
    return colors[personality as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Character Avatar */}
      <div className="relative">
        <motion.div
          className={`relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 ${
            isSpeaking ? 'border-primary-500' : 'border-gray-300'
          } ${emotionConfig.color}`}
          animate={isAnimating ? emotionConfig.facial : {}}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Character Face */}
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {emotionConfig.icon}
          </div>

          {/* Speaking Indicator */}
          <AnimatePresence>
            {isSpeaking && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center"
              >
                <motion.div
                  className="w-3 h-3 bg-white rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Character Info */}
        <div className="mt-4 text-center">
          <h3 className="text-xl font-semibold text-gray-900">{character.name}</h3>
          <p className="text-sm text-gray-600">{character.profession}</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className={`px-2 py-1 rounded-full text-xs text-white ${regionalInfo.color}`}>
              {character.region}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs text-white ${getPersonalityColor(character.personality)}`}>
              {character.personality}
            </span>
          </div>
        </div>
      </div>

      {/* Character Dialogue */}
      <AnimatePresence>
        {currentDialogue && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 p-4 bg-white rounded-lg shadow-lg border border-gray-200"
          >
            <p className="text-gray-800 mb-3">{currentDialogue}</p>
            <TextToSpeech
              text={currentDialogue}
              autoPlay={true}
              showControls={false}
              className="mt-2"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character Controls */}
      {showControls && (
        <div className="mt-6 space-y-4">
          {/* Emotion Controls */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Emotions</h4>
            <div className="flex flex-wrap gap-2">
              {Object.keys(EMOTION_ANIMATIONS).map((emotion) => (
                <button
                  key={emotion}
                  onClick={() => handleEmotionChange({ 
                    type: emotion as keyof typeof EMOTION_ANIMATIONS, 
                    intensity: 0.7, 
                    duration: 2000 
                  })}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                >
                  {EMOTION_ANIMATIONS[emotion as keyof typeof EMOTION_ANIMATIONS].icon}
                </button>
              ))}
            </div>
          </div>

          {/* Interaction Controls */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Interactions</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => generateResponse()}
                className="px-3 py-1 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-full text-sm transition-colors"
              >
                Greet
              </button>
              <button
                onClick={() => setShowPersonality(!showPersonality)}
                className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-sm transition-colors"
              >
                Show Personality
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Personality Details */}
      <AnimatePresence>
        {showPersonality && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <h4 className="font-medium text-gray-900 mb-3">About {character.name}</h4>
            <p className="text-sm text-gray-700 mb-3">{character.background}</p>
            
            <div className="space-y-2">
              <div>
                <span className="text-xs font-medium text-gray-600">Age:</span>
                <span className="text-sm text-gray-800 ml-2">{character.age}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600">Region:</span>
                <span className="text-sm text-gray-800 ml-2">{character.region} - {regionalInfo.description}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600">Speaking Style:</span>
                <span className="text-sm text-gray-800 ml-2">{character.speakingStyle}, {character.formality}</span>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-600">Interests:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {character.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 