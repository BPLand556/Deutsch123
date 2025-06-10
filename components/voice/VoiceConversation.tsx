'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceInput } from './VoiceInput';
import { TextToSpeech } from './TextToSpeech';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface VoiceConversationProps {
  onUserInput: (transcript: string, confidence: number) => void;
  characterResponse?: string;
  characterName?: string;
  placeholder?: string;
  language?: string;
  autoStop?: boolean;
  timeoutMs?: number;
  className?: string;
  disabled?: boolean;
  showWaveform?: boolean;
  showConfidence?: boolean;
  showTranscript?: boolean;
  onError?: (error: string) => void;
}

export const VoiceConversation: React.FC<VoiceConversationProps> = ({
  onUserInput,
  characterResponse,
  characterName = 'Character',
  placeholder = 'Click to speak in German...',
  language = 'de-DE',
  autoStop = true,
  timeoutMs = 5000,
  className = '',
  disabled = false,
  showWaveform = true,
  showConfidence = true,
  showTranscript = true,
  onError,
}) => {
  const [conversationMode, setConversationMode] = useState<'voice' | 'text'>('voice');
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pronunciationFeedback, setPronunciationFeedback] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<Array<{
    type: 'user' | 'character';
    text: string;
    timestamp: Date;
    confidence?: number;
  }>>([]);

  const {
    isListening: isSRListening,
    confidence,
  } = useSpeechRecognition({
    language,
    onResult: (transcript, confidence) => {
      handleUserInput(transcript, confidence);
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  const handleUserInput = useCallback((input: string, conf: number) => {
    if (!input.trim()) return;
    
    setIsProcessing(true);
    setUserInput(input);
    
    // Add to conversation history
    setConversationHistory(prev => [...prev, {
      type: 'user',
      text: input,
      timestamp: new Date(),
      confidence: conf,
    }]);

    // Analyze pronunciation (simplified version)
    analyzePronunciation(input);
    
    // Call the parent handler
    onUserInput(input, conf);
    
    // Reset after processing
    setTimeout(() => {
      setIsProcessing(false);
      setUserInput('');
    }, 1000);
  }, [onUserInput]);

  const analyzePronunciation = useCallback((text: string) => {
    // Simplified pronunciation analysis
    // In a real implementation, this would use more sophisticated analysis
    const germanWords = text.toLowerCase().split(' ');
    const commonGermanWords = ['hallo', 'danke', 'bitte', 'guten', 'tag', 'morgen', 'abend'];
    const matches = germanWords.filter(word => commonGermanWords.includes(word));
    
    if (matches.length > 0) {
      setPronunciationFeedback(`Great pronunciation of: ${matches.join(', ')}`);
    } else {
      setPronunciationFeedback('Keep practicing your German pronunciation!');
    }
    
    // Clear feedback after 3 seconds
    setTimeout(() => setPronunciationFeedback(null), 3000);
  }, []);

  const handleVoiceModeToggle = useCallback(() => {
    setConversationMode(prev => prev === 'voice' ? 'text' : 'voice');
  }, []);

  // Add character response to history when it changes
  useEffect(() => {
    if (characterResponse) {
      setConversationHistory(prev => [...prev, {
        type: 'character',
        text: characterResponse,
        timestamp: new Date(),
      }]);
    }
  }, [characterResponse]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Mode Toggle */}
      <div className="flex items-center justify-center gap-2 p-2 bg-gray-50 rounded-lg">
        <button
          onClick={handleVoiceModeToggle}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            conversationMode === 'voice'
              ? 'bg-primary-500 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          🎤 Voice Mode
        </button>
        <button
          onClick={handleVoiceModeToggle}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            conversationMode === 'text'
              ? 'bg-primary-500 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          ⌨️ Text Mode
        </button>
      </div>

      {/* Voice Input Section */}
      {conversationMode === 'voice' && (
        <div className="space-y-3">
          {/* Main Voice Input */}
          <VoiceInput
            onTranscript={handleUserInput}
            onError={onError}
            placeholder={placeholder}
            language={language}
            autoStop={autoStop}
            timeoutMs={timeoutMs}
            disabled={disabled || isProcessing}
            className="w-full"
          />

          {/* Waveform Visualization */}
          {showWaveform && isSRListening && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 60 }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-r from-primary-100 to-primary-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-center gap-1 h-8">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-primary-500 rounded-full"
                    animate={{
                      height: [4, 20, 4],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
              <p className="text-center text-sm text-primary-600 mt-2">
                Listening... Speak now!
              </p>
            </motion.div>
          )}

          {/* Confidence Indicator */}
          {showConfidence && confidence > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 p-2 bg-blue-50 rounded-lg"
            >
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm text-blue-700">
                Confidence: {Math.round(confidence * 100)}%
              </span>
            </motion.div>
          )}
        </div>
      )}

      {/* Text Input Section */}
      {conversationMode === 'text' && (
        <div className="space-y-3">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message in German..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={3}
            disabled={disabled || isProcessing}
          />
          <button
            onClick={() => handleUserInput(userInput, 1.0)}
            disabled={!userInput.trim() || disabled || isProcessing}
            className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send Message
          </button>
        </div>
      )}

      {/* Character Response */}
      {characterResponse && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {characterName.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 mb-1">{characterName}</p>
              <p className="text-gray-800">{characterResponse}</p>
              <div className="mt-2">
                <TextToSpeech
                  text={characterResponse}
                  autoPlay={true}
                  showControls={false}
                  className="inline-block"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Pronunciation Feedback */}
      <AnimatePresence>
        {pronunciationFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-green-50 border border-green-200 rounded-lg p-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-sm text-green-700">{pronunciationFeedback}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing Indicator */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2 p-3 bg-blue-50 rounded-lg"
          >
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-blue-700">Processing your message...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conversation History (Optional) */}
      {showTranscript && conversationHistory.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
          <p className="text-xs font-medium text-gray-600 mb-2">Recent conversation:</p>
          {conversationHistory.slice(-3).map((entry, index) => (
            <div key={index} className="text-xs text-gray-700 mb-1">
              <span className="font-medium">
                {entry.type === 'user' ? 'You' : characterName}:
              </span>
              <span className="ml-1">{entry.text}</span>
              {entry.confidence && (
                <span className="ml-2 text-gray-500">
                  ({Math.round(entry.confidence * 100)}%)
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 