'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

interface TextToSpeechProps {
  text: string;
  autoPlay?: boolean;
  showControls?: boolean;
  showVoiceSelector?: boolean;
  showSpeedControl?: boolean;
  className?: string;
  disabled?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

export const TextToSpeech: React.FC<TextToSpeechProps> = ({
  text,
  autoPlay = false,
  showControls = true,
  showVoiceSelector = false,
  showSpeedControl = false,
  className = '',
  disabled = false,
  onStart,
  onEnd,
  onError,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  const {
    isPlaying,
    isSupported,
    error,
    currentVoice,
    availableVoices,
    playbackRate,
    volume,
    speak,
    stop,
    pause,
    resume,
    setVoice,
    setPlaybackRate,
    setVolume,
    reset,
  } = useTextToSpeech({
    onStart,
    onEnd,
    onError,
  });

  const handlePlay = useCallback(() => {
    if (disabled || !isSupported || !text) return;
    speak(text);
  }, [disabled, isSupported, text, speak]);

  const handleStop = useCallback(() => {
    stop();
  }, [stop]);

  const handlePause = useCallback(() => {
    pause();
  }, [pause]);

  const handleResume = useCallback(() => {
    resume();
  }, [resume]);

  const handleVoiceChange = useCallback((voiceName: string) => {
    setVoice(voiceName);
  }, [setVoice]);

  const handleSpeedChange = useCallback((speed: number) => {
    setPlaybackRate(speed);
  }, [setPlaybackRate]);

  const handleVolumeChange = useCallback((vol: number) => {
    setVolume(vol);
  }, [setVolume]);

  // Auto-play when text changes
  React.useEffect(() => {
    if (autoPlay && text && isSupported && !disabled) {
      speak(text);
    }
  }, [autoPlay, text, isSupported, disabled, speak]);

  if (!isSupported) {
    return (
      <div className={`p-3 bg-amber-50 border border-amber-200 rounded-lg ${className}`}>
        <p className="text-amber-600 text-sm">
          Text-to-speech is not supported in your browser.
        </p>
      </div>
    );
  }

  if (!text) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Play Button */}
      <div className="flex items-center gap-3">
        <motion.button
          type="button"
          onClick={isPlaying ? handleStop : handlePlay}
          disabled={disabled}
          className={`
            relative w-12 h-12 rounded-full border-2 transition-all duration-300
            flex items-center justify-center
            ${isPlaying 
              ? 'bg-red-500 border-red-600 text-white shadow-lg shadow-red-500/25' 
              : 'bg-primary-500 border-primary-600 text-white hover:bg-primary-600 hover:border-primary-700'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          animate={{
            scale: isPlaying ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: isPlaying ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </motion.button>

        {/* Text Preview */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-700 truncate">
            {text.length > 100 ? `${text.substring(0, 100)}...` : text}
          </p>
          {currentVoice && (
            <p className="text-xs text-gray-500">
              Voice: {currentVoice.description || currentVoice.name}
            </p>
          )}
        </div>

        {/* Settings Toggle */}
        {showControls && (
          <motion.button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </motion.button>
        )}
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && showControls && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4"
          >
            {/* Voice Selection */}
            {showVoiceSelector && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voice
                </label>
                <select
                  value={currentVoice?.name || ''}
                  onChange={(e) => handleVoiceChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {availableVoices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.description || voice.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Speed Control */}
            {showSpeedControl && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speed: {playbackRate}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={playbackRate}
                  onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0.5x</span>
                  <span>1x</span>
                  <span>2x</span>
                </div>
              </div>
            )}

            {/* Volume Control */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Volume: {Math.round(volume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Additional Controls */}
            <div className="flex gap-2">
              {isPlaying && (
                <>
                  <button
                    onClick={handlePause}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  >
                    Pause
                  </button>
                  <button
                    onClick={handleResume}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  >
                    Resume
                  </button>
                </>
              )}
              <button
                onClick={reset}
                className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
              >
                Reset
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-sm text-red-600">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 