'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceModeSelectorProps {
  currentMode: 'voice' | 'text';
  onModeChange: (mode: 'voice' | 'text') => void;
  className?: string;
}

export const VoiceModeSelector: React.FC<VoiceModeSelectorProps> = ({
  currentMode,
  onModeChange,
  className = '',
}) => {
  const [showBenefits, setShowBenefits] = useState(false);

  const voiceBenefits = [
    '🎯 Better pronunciation practice',
    '🗣️ Natural conversation flow',
    '🎧 Improved listening skills',
    '⚡ Faster interaction',
    '🎭 More immersive experience'
  ];

  const textBenefits = [
    '📝 Clear communication',
    '🔍 Better for complex sentences',
    '📚 Easier vocabulary learning',
    '🔄 Review and edit messages',
    '🔇 Works in any environment'
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Mode Selection */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Conversation Mode</h3>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Voice Mode */}
          <motion.button
            onClick={() => onModeChange('voice')}
            className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
              currentMode === 'voice'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🎤</div>
              <div className="font-medium">Voice Mode</div>
              <div className="text-xs mt-1 opacity-75">Speak naturally</div>
            </div>
            
            {/* Active indicator */}
            {currentMode === 'voice' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
            )}
          </motion.button>

          {/* Text Mode */}
          <motion.button
            onClick={() => onModeChange('text')}
            className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
              currentMode === 'text'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">⌨️</div>
              <div className="font-medium">Text Mode</div>
              <div className="text-xs mt-1 opacity-75">Type messages</div>
            </div>
            
            {/* Active indicator */}
            {currentMode === 'text' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        </div>

        {/* Benefits Toggle */}
        <button
          onClick={() => setShowBenefits(!showBenefits)}
          className="mt-4 w-full text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          {showBenefits ? 'Hide benefits' : 'Show benefits of each mode'}
        </button>
      </div>

      {/* Benefits Panel */}
      <AnimatePresence>
        {showBenefits && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 border border-gray-200 rounded-lg p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Voice Benefits */}
              <div>
                <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-lg">🎤</span>
                  Voice Mode Benefits
                </h4>
                <ul className="space-y-1">
                  {voiceBenefits.map((benefit, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-primary-500 mt-0.5">•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Text Benefits */}
              <div>
                <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-lg">⌨️</span>
                  Text Mode Benefits
                </h4>
                <ul className="space-y-1">
                  {textBenefits.map((benefit, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-primary-500 mt-0.5">•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendation */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="text-blue-500 text-lg">💡</span>
                <div>
                  <p className="text-sm font-medium text-blue-800">Recommendation</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Start with voice mode for the most immersive experience. Switch to text mode if you need to practice complex sentences or are in a noisy environment.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Mode Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              currentMode === 'voice' ? 'bg-green-500 animate-pulse' : 'bg-blue-500'
            }`} />
            <span className="text-sm font-medium text-gray-700">
              Currently using: {currentMode === 'voice' ? 'Voice Mode' : 'Text Mode'}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {currentMode === 'voice' ? '🎤 Speaking enabled' : '⌨️ Typing enabled'}
          </span>
        </div>
      </div>
    </div>
  );
}; 