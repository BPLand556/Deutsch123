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

interface AdvancedCharacterProps {
  character: CharacterPersonality;
  currentEmotion?: CharacterEmotion;
  isSpeaking?: boolean;
  onCharacterInteraction?: (interaction: string) => void;
  className?: string;
  showControls?: boolean;
}

const CHARACTER_DATABASE: Record<string, CharacterPersonality> = {
  'anna-barista': {
    name: 'Anna',
    age: 24,
    region: 'Berlin',
    profession: 'Barista',
    personality: 'friendly',
    speakingStyle: 'normal',
    formality: 'mixed',
    interests: ['coffee', 'art', 'cycling', 'Berlin culture'],
    background: 'Anna grew up in Kreuzberg and loves the diverse, creative atmosphere of Berlin. She\'s passionate about coffee and enjoys meeting people from around the world.',
    voiceId: 'de-DE-Wavenet-A',
  },
  'klaus-professor': {
    name: 'Prof. Dr. Klaus Weber',
    age: 58,
    region: 'Munich',
    profession: 'University Professor',
    personality: 'formal',
    speakingStyle: 'slow',
    formality: 'formal',
    interests: ['classical music', 'literature', 'hiking', 'wine'],
    background: 'Professor Weber teaches German literature at LMU Munich. He values precision and traditional academic standards.',
    voiceId: 'de-DE-Wavenet-D',
  },
  'sophie-student': {
    name: 'Sophie',
    age: 20,
    region: 'Hamburg',
    profession: 'University Student',
    personality: 'enthusiastic',
    speakingStyle: 'fast',
    formality: 'informal',
    interests: ['sustainability', 'travel', 'photography', 'indie music'],
    background: 'Sophie is studying environmental science and is passionate about climate change. She loves exploring new places and meeting international students.',
    voiceId: 'de-DE-Wavenet-C',
  },
  'hans-businessman': {
    name: 'Hans Müller',
    age: 42,
    region: 'Frankfurt',
    profession: 'Business Consultant',
    personality: 'direct',
    speakingStyle: 'normal',
    formality: 'formal',
    interests: ['golf', 'fine dining', 'classical cars', 'business networking'],
    background: 'Hans works in international business and values efficiency and direct communication. He\'s well-traveled and understands cultural differences.',
    voiceId: 'de-DE-Wavenet-B',
  },
  'lisa-artist': {
    name: 'Lisa',
    age: 29,
    region: 'Cologne',
    profession: 'Artist',
    personality: 'casual',
    speakingStyle: 'normal',
    formality: 'informal',
    interests: ['contemporary art', 'jazz', 'street food', 'alternative culture'],
    background: 'Lisa is a contemporary artist who loves the creative scene in Cologne. She\'s open-minded and enjoys discussing art and culture.',
    voiceId: 'de-AT-Wavenet-A',
  },
};

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
  onCharacterInteraction,
  className = '',
  showControls = false,
}) => {
  const [displayedEmotion, setDisplayedEmotion] = useState<CharacterEmotion>(currentEmotion);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentDialogue, setCurrentDialogue] = useState<string>('');
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

  const generateResponse = useCallback((userInput: string) => {
    // Simple response generation based on character personality
    const responses = {
      'anna-barista': [
        'Guten Morgen! Wie kann ich Ihnen heute helfen?',
        'Ah, das ist interessant! Möchten Sie etwas über Berlin erfahren?',
        'Kaffee ist wirklich eine Kunst, finden Sie nicht?',
      ],
      'klaus-professor': [
        'Guten Tag. Wie kann ich Ihnen behilflich sein?',
        'Das ist eine sehr interessante Frage. Lassen Sie mich das erklären.',
        'In der deutschen Literatur gibt es viele faszinierende Aspekte.',
      ],
      'sophie-student': [
        'Hey! Wie geht\'s? Hast du Fragen über das Studentenleben?',
        'Das ist super! Ich liebe es, neue Leute kennenzulernen!',
        'Nachhaltigkeit ist so wichtig, findest du nicht?',
      ],
      'hans-businessman': [
        'Guten Tag. Wie kann ich Ihnen helfen?',
        'Das ist ein wichtiger Punkt. Lassen Sie uns das besprechen.',
        'In der Geschäftswelt ist Effizienz entscheidend.',
      ],
      'lisa-artist': [
        'Hi! Wie geht\'s? Bist du auch an Kunst interessiert?',
        'Das ist echt cool! Kunst ist so vielfältig, oder?',
        'Köln hat eine fantastische Kunstszene!',
      ],
    };

    const characterResponses = responses[character.name.toLowerCase().replace(' ', '-') as keyof typeof responses] || responses['anna-barista'];
    const randomResponse = characterResponses[Math.floor(Math.random() * characterResponses.length)];
    
    setCurrentDialogue(randomResponse);
    onCharacterInteraction?.(randomResponse);
  }, [character, onCharacterInteraction]);

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
                onClick={() => generateResponse('greeting')}
                className="px-3 py-1 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-full text-sm transition-colors"
              >
                Greet
              </button>
              <button
                onClick={() => generateResponse('question')}
                className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-full text-sm transition-colors"
              >
                Ask Question
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