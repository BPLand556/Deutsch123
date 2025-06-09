'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslationReveal } from '@/hooks/useTranslationReveal';

interface TranslationRevealProps {
  germanText: string;
  className?: string;
  showIndicator?: boolean;
  onTranslationReveal?: (data: any) => void;
}

export const TranslationReveal: React.FC<TranslationRevealProps> = ({
  germanText,
  className = '',
  showIndicator = true,
  onTranslationReveal,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const {
    isRevealed,
    translationData,
    showCulturalContext,
    revealTranslation,
    hideTranslation,
    toggleCulturalContext,
    getTranslationIndicator,
  } = useTranslationReveal({
    onTranslationReveal,
  });

  const indicator = getTranslationIndicator(germanText);

  const handleClick = useCallback(() => {
    if (isRevealed) {
      hideTranslation();
    } else {
      revealTranslation(germanText);
    }
  }, [isRevealed, hideTranslation, revealTranslation, germanText]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (!isRevealed && indicator?.shouldShow) {
      setShowTooltip(true);
    }
  }, [isRevealed, indicator]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setShowTooltip(false);
  }, []);

  // Don't render if no translation is available
  if (!indicator?.shouldShow) {
    return <span className={className}>{germanText}</span>;
  }

  return (
    <span className={`relative inline-block ${className}`}>
      {/* German Text */}
      <span
        className={`
          cursor-pointer transition-colors duration-200
          ${isHovered ? 'text-primary-600' : 'text-gray-900'}
          ${indicator.isNew ? 'font-semibold' : ''}
        `}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {germanText}
      </span>

      {/* Translation Indicator */}
      {showIndicator && (
        <motion.span
          className="inline-block ml-1 text-primary-500"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered ? 1 : 0.6, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            className="w-4 h-4 inline"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </motion.span>
      )}

      {/* Difficulty Badge */}
      {indicator.isNew && (
        <motion.span
          className="inline-block ml-1 px-1.5 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          New
        </motion.span>
      )}

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && !isRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10 whitespace-nowrap"
          >
            Click to reveal translation
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Translation Reveal */}
      <AnimatePresence>
        {isRevealed && translationData && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="absolute top-full left-0 mt-2 p-4 bg-white border border-primary-200 rounded-lg shadow-lg z-20 min-w-80 max-w-md"
          >
            {/* Translation */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-primary-700">Translation</h4>
                <button
                  onClick={hideTranslation}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-lg font-medium text-gray-900 mb-1">{translationData.english}</p>
              <p className="text-sm text-gray-600">{translationData.german}</p>
            </div>

            {/* Usage Notes */}
            {translationData.usageNotes && (
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h5 className="font-medium text-blue-800 mb-1">Usage Notes</h5>
                <p className="text-sm text-blue-700">{translationData.usageNotes}</p>
              </div>
            )}

            {/* Cultural Context */}
            {translationData.culturalContext && (
              <div className="mb-3">
                <button
                  onClick={toggleCulturalContext}
                  className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Cultural Context
                  <svg
                    className={`w-4 h-4 transition-transform ${showCulturalContext ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <AnimatePresence>
                  {showCulturalContext && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg"
                    >
                      <p className="text-sm text-amber-800">{translationData.culturalContext}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Metadata */}
            <div className="flex items-center gap-4 text-xs text-gray-500 border-t pt-3">
              <span className={`px-2 py-1 rounded-full ${
                translationData.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                translationData.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {translationData.difficulty}
              </span>
              {translationData.formality && (
                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  {translationData.formality}
                </span>
              )}
              {translationData.region && (
                <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                  {translationData.region}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}; 