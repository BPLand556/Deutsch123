'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface VoiceInputProps {
  onTranscript: (transcript: string, confidence: number) => void;
  onError?: (error: string) => void;
  placeholder?: string;
  language?: string;
  autoStop?: boolean;
  timeoutMs?: number;
  className?: string;
  disabled?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  onError,
  placeholder = 'Click to speak in German...',
  language = 'de-DE',
  autoStop = true,
  timeoutMs = 5000,
  className = '',
  disabled = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showError, setShowError] = useState(false);
  const [permissionState, setPermissionState] = useState<'idle' | 'requesting' | 'denied' | 'granted'>('idle');

  const {
    isListening,
    transcript,
    isSupported,
    error,
    confidence,
    startListening,
    stopListening,
    startListeningWithTimeout,
    reset,
  } = useSpeechRecognition({
    language,
    onResult: (transcript, confidence) => {
      onTranscript(transcript, confidence);
      reset();
    },
    onError: (error) => {
      setShowError(true);
      onError?.(error);
      setTimeout(() => setShowError(false), 5000);
      if (error.toLowerCase().includes('denied')) {
        setPermissionState('denied');
      }
    },
  });

  // Check for permission on mount
  React.useEffect(() => {
    if (!navigator.permissions) return;
    navigator.permissions.query({ name: 'microphone' as PermissionName }).then((result) => {
      if (result.state === 'granted') setPermissionState('granted');
      else if (result.state === 'denied') setPermissionState('denied');
      else setPermissionState('idle');
      result.onchange = () => {
        if (result.state === 'granted') setPermissionState('granted');
        else if (result.state === 'denied') setPermissionState('denied');
        else setPermissionState('idle');
      };
    }).catch(() => {
      // Permissions API not supported
      setPermissionState('idle');
    });
  }, []);

  const handleStartListening = useCallback(() => {
    console.log('VoiceInput: handleStartListening called');
    if (disabled || !isSupported) {
      console.log('VoiceInput: disabled or not supported', { disabled, isSupported });
      return;
    }
    setPermissionState('requesting');
    // Try to start listening, which will trigger browser permission prompt if needed
    try {
      if (autoStop) {
        startListeningWithTimeout(timeoutMs);
      } else {
        startListening();
      }
      setPermissionState('granted');
      console.log('Microphone: listening started');
    } catch (err) {
      console.error('VoiceInput: Error starting listening', err);
      setPermissionState('denied');
      setShowError(true);
      onError?.('Microphone access denied or unavailable.');
      setTimeout(() => setShowError(false), 5000);
      console.error('Microphone error:', err);
    }
  }, [disabled, isSupported, autoStop, timeoutMs, startListening, startListeningWithTimeout, onError]);

  const handleStopListening = useCallback(() => {
    stopListening();
    setPermissionState('idle');
    console.log('Microphone: listening stopped');
  }, [stopListening]);

  const handleReset = useCallback(() => {
    reset();
    setShowError(false);
    setPermissionState('idle');
  }, [reset]);

  if (!isSupported) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <p className="text-red-600 text-sm">
          Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.<br/>
          <span className="font-medium">Tip:</span> If you are on a supported browser and still see this, check your browser settings to enable microphone access.
        </p>
      </div>
    );
  }

  if (permissionState === 'denied') {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <p className="text-red-600 text-sm">
          Microphone access was denied. Please enable microphone permissions in your browser settings and reload the page.<br/>
          <span className="font-medium">Troubleshooting:</span> Check your browser's privacy settings or click the lock icon in the address bar.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Voice Input Button */}
      <motion.button
        type="button"
        onClick={isListening ? handleStopListening : handleStartListening}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={disabled}
        className={`
          relative w-full h-16 px-6 py-4 rounded-xl border-2 transition-all duration-300
          flex items-center justify-center gap-3 font-medium text-lg
          ${isListening 
            ? 'bg-red-500 border-red-600 text-white shadow-lg shadow-red-500/25' 
            : 'bg-white border-primary-200 text-primary-700 hover:border-primary-300 hover:bg-primary-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isHovered && !isListening ? 'scale-105' : ''}
        `}
        whileTap={{ scale: 0.98 }}
        animate={{
          scale: isListening ? [1, 1.02, 1] : 1,
        }}
        transition={{
          duration: 1.5,
          repeat: isListening ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        {/* Microphone Icon */}
        <motion.div
          className="relative"
          animate={{
            scale: isListening ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 0.8,
            repeat: isListening ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          <svg
            className={`w-6 h-6 ${isListening ? 'text-white' : 'text-primary-600'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
          
          {/* Recording indicator */}
          {isListening && (
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>

        {/* Button Text */}
        <span>
          {permissionState === 'requesting' ? 'Waiting for permission...' : isListening ? 'Listening...' : placeholder}
        </span>

        {/* Confidence indicator */}
        {isListening && confidence > 0 && (
          <motion.div
            className="absolute top-2 right-2 px-2 py-1 bg-white/20 rounded-full text-xs"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {Math.round(confidence * 100)}%
          </motion.div>
        )}
      </motion.button>

      {/* Live Transcript Display */}
      <AnimatePresence>
        {isListening && transcript && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 p-3 bg-primary-50 border border-primary-200 rounded-lg"
          >
            <p className="text-sm text-primary-700 font-medium">Live transcript:</p>
            <p className="text-primary-800 mt-1">{transcript}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      <AnimatePresence>
        {showError && error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={handleReset}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      {!isListening && !showError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-xs text-gray-500 text-center"
        >
          {autoStop 
            ? `Click and speak. Auto-stops after ${timeoutMs / 1000} seconds.`
            : 'Click to start, click again to stop.'
          }
        </motion.div>
      )}
    </div>
  );
}; 