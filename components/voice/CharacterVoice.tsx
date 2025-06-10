'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextToSpeech } from './TextToSpeech';

interface CharacterVoiceConfig {
  name: string;
  voiceName: string;
  dialect: string;
  personality: string;
  speechRate: number;
  pitch: number;
  volume: number;
  emotionalRange: 'low' | 'medium' | 'high';
  formality: 'casual' | 'neutral' | 'formal';
  regionalFeatures: string[];
}

interface CharacterVoiceProps {
  character: CharacterVoiceConfig;
  text: string;
  autoPlay?: boolean;
  onVoiceChange?: (config: CharacterVoiceConfig) => void;
  className?: string;
  disabled?: boolean;
}

// Predefined character voice configurations
export const CHARACTER_VOICES: Record<string, CharacterVoiceConfig> = {
  anna_barista: {
    name: 'Anna',
    voiceName: 'Anna',
    dialect: 'Berlin',
    personality: 'Friendly and enthusiastic barista with coffee passion',
    speechRate: 0.9,
    pitch: 1.1,
    volume: 0.9,
    emotionalRange: 'high',
    formality: 'casual',
    regionalFeatures: ['Berlin accent', 'coffee terminology', 'customer service vocabulary'],
  },
  thomas_business: {
    name: 'Thomas',
    voiceName: 'Thomas',
    dialect: 'Frankfurt',
    personality: 'Professional business consultant with formal demeanor',
    speechRate: 0.8,
    pitch: 0.9,
    volume: 0.8,
    emotionalRange: 'low',
    formality: 'formal',
    regionalFeatures: ['Hessian accent', 'business terminology', 'formal expressions'],
  },
  lisa_supermarket: {
    name: 'Lisa',
    voiceName: 'Lisa',
    dialect: 'Hamburg',
    personality: 'Helpful supermarket employee with northern German warmth',
    speechRate: 1.0,
    pitch: 1.0,
    volume: 0.85,
    emotionalRange: 'medium',
    formality: 'neutral',
    regionalFeatures: ['Northern German accent', 'everyday vocabulary', 'helpful expressions'],
  },
  klaus_christmas: {
    name: 'Klaus',
    voiceName: 'Klaus',
    dialect: 'Cologne',
    personality: 'Jovial Christmas market vendor with Rhineland cheer',
    speechRate: 1.1,
    pitch: 0.95,
    volume: 0.95,
    emotionalRange: 'high',
    formality: 'casual',
    regionalFeatures: ['Rhineland accent', 'festive vocabulary', 'warm expressions'],
  },
  sophia_art: {
    name: 'Sophia',
    voiceName: 'Sophia',
    dialect: 'Munich',
    personality: 'Sophisticated art gallery curator with Bavarian elegance',
    speechRate: 0.85,
    pitch: 1.05,
    volume: 0.8,
    emotionalRange: 'medium',
    formality: 'formal',
    regionalFeatures: ['Bavarian accent', 'art terminology', 'cultural expressions'],
  },
  hans_beer: {
    name: 'Hans',
    voiceName: 'Hans',
    dialect: 'Munich',
    personality: 'Traditional beer garden owner with Bavarian hospitality',
    speechRate: 0.9,
    pitch: 0.9,
    volume: 0.9,
    emotionalRange: 'high',
    formality: 'casual',
    regionalFeatures: ['Bavarian accent', 'beer terminology', 'traditional expressions'],
  },
};

export const CharacterVoice: React.FC<CharacterVoiceProps> = ({
  character,
  text,
  autoPlay = true,
  onVoiceChange,
  className = '',
  disabled = false,
}) => {
  const [currentConfig, setCurrentConfig] = useState<CharacterVoiceConfig>(character);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [previewText, setPreviewText] = useState('');

  // Update character-specific text modifications
  const modifyTextForCharacter = useCallback((text: string, config: CharacterVoiceConfig) => {
    let modifiedText = text;
    
    // Add character-specific expressions based on personality
    if (config.personality.includes('barista')) {
      // Add coffee-related enthusiasm
      if (text.includes('Kaffee') || text.includes('coffee')) {
        modifiedText = text.replace(/\.$/, '! Das ist wunderbar!');
      }
    }
    
    if (config.personality.includes('business')) {
      // Add formal business expressions
      if (!text.includes('bitte') && !text.includes('danke')) {
        modifiedText = text.replace(/\.$/, '. Vielen Dank.');
      }
    }
    
    if (config.personality.includes('Christmas')) {
      // Add festive expressions
      if (text.includes('Weihnachten') || text.includes('Christmas')) {
        modifiedText = text.replace(/\.$/, '! Fröhliche Weihnachten!');
      }
    }
    
    return modifiedText;
  }, []);

  const handleConfigChange = useCallback((updates: Partial<CharacterVoiceConfig>) => {
    const newConfig = { ...currentConfig, ...updates };
    setCurrentConfig(newConfig);
    onVoiceChange?.(newConfig);
  }, [currentConfig, onVoiceChange]);

  const handlePreview = useCallback(() => {
    const sampleTexts = {
      anna_barista: 'Guten Morgen! Wie kann ich Ihnen heute helfen?',
      thomas_business: 'Guten Tag. Ich freue mich, Sie kennenzulernen.',
      lisa_supermarket: 'Kann ich Ihnen bei der Suche nach etwas helfen?',
      klaus_christmas: 'Willkommen auf unserem Weihnachtsmarkt!',
      sophia_art: 'Herzlich willkommen in unserer Galerie.',
      hans_beer: 'Prost! Genießen Sie Ihr Bier!',
    };
    
    const key = Object.keys(CHARACTER_VOICES).find(k => CHARACTER_VOICES[k].name === character.name);
    setPreviewText(sampleTexts[key as keyof typeof sampleTexts] || 'Hallo! Wie geht es Ihnen?');
  }, [character.name]);

  const modifiedText = modifyTextForCharacter(text, currentConfig);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Character Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {character.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{character.name}</h3>
              <p className="text-sm text-gray-600">{character.dialect} • {character.personality}</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {isCustomizing ? 'Done' : 'Customize'}
          </button>
        </div>
      </div>

      {/* Voice Customization */}
      <AnimatePresence>
        {isCustomizing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4"
          >
            <h4 className="font-medium text-gray-800">Voice Settings</h4>
            
            {/* Speech Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speech Rate: {currentConfig.speechRate}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={currentConfig.speechRate}
                onChange={(e) => handleConfigChange({ speechRate: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Pitch */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pitch: {currentConfig.pitch}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={currentConfig.pitch}
                onChange={(e) => handleConfigChange({ pitch: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Volume */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Volume: {Math.round(currentConfig.volume * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={currentConfig.volume}
                onChange={(e) => handleConfigChange({ volume: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Emotional Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emotional Range
              </label>
              <select
                value={currentConfig.emotionalRange}
                onChange={(e) => handleConfigChange({ emotionalRange: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="low">Low (Calm)</option>
                <option value="medium">Medium (Balanced)</option>
                <option value="high">High (Expressive)</option>
              </select>
            </div>

            {/* Formality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formality Level
              </label>
              <select
                value={currentConfig.formality}
                onChange={(e) => handleConfigChange({ formality: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="casual">Casual (Du)</option>
                <option value="neutral">Neutral</option>
                <option value="formal">Formal (Sie)</option>
              </select>
            </div>

            {/* Preview Button */}
            <button
              onClick={handlePreview}
              className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Preview Voice
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character Speech */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
            {character.name.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700 mb-1">{character.name}</p>
            <p className="text-gray-800 mb-3">{modifiedText}</p>
            
            {/* Voice Controls */}
            <div className="flex items-center gap-2">
              <TextToSpeech
                text={modifiedText}
                autoPlay={autoPlay}
                showControls={true}
                showVoiceSelector={false}
                showSpeedControl={false}
                className="flex-1"
                disabled={disabled}
              />
              
              {/* Regional Features Indicator */}
              <div className="flex gap-1">
                {currentConfig.regionalFeatures.slice(0, 2).map((feature, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Text */}
      {previewText && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-3"
        >
          <p className="text-sm text-blue-800 mb-2">Preview:</p>
          <p className="text-blue-900">{previewText}</p>
          <TextToSpeech
            text={previewText}
            autoPlay={false}
            showControls={true}
            className="mt-2"
          />
        </motion.div>
      )}
    </div>
  );
}; 