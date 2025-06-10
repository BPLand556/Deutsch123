'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PronunciationFeedback {
  word: string;
  accuracy: number;
  stress: 'correct' | 'incorrect' | 'partial';
  intonation: 'correct' | 'incorrect' | 'partial';
  suggestions: string[];
}

interface PronunciationAssessmentProps {
  userInput: string;
  onFeedback?: (feedback: PronunciationFeedback[]) => void;
  showDetailed?: boolean;
  className?: string;
}

export const PronunciationAssessment: React.FC<PronunciationAssessmentProps> = ({
  userInput,
  onFeedback,
  showDetailed = true,
  className = '',
}) => {
  const [feedback, setFeedback] = useState<PronunciationFeedback[]>([]);
  const [overallScore, setOverallScore] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // German pronunciation patterns
  const germanPronunciationPatterns = {
    vowels: {
      'ä': { sound: 'eh', examples: ['Mädchen', 'Bär'] },
      'ö': { sound: 'uh', examples: ['König', 'Löffel'] },
      'ü': { sound: 'ee', examples: ['Müller', 'Tür'] },
      'ei': { sound: 'eye', examples: ['Eis', 'Mein'] },
      'ie': { sound: 'ee', examples: ['Bier', 'Liebe'] },
      'au': { sound: 'ow', examples: ['Haus', 'Frau'] },
      'eu': { sound: 'oy', examples: ['Deutsch', 'Leute'] },
    },
    consonants: {
      'ch': { sound: 'kh', examples: ['Ich', 'Buch'] },
      'sch': { sound: 'sh', examples: ['Schule', 'Tisch'] },
      'st': { sound: 'sht', examples: ['Stadt', 'Beste'] },
      'sp': { sound: 'shp', examples: ['Spiel', 'Sprechen'] },
      'ß': { sound: 'ss', examples: ['Straße', 'Fuß'] },
    },
    stress: {
      prefixes: ['ge', 'be', 'ver', 'er', 'ent'],
      suffixes: ['ung', 'heit', 'keit', 'lich', 'bar'],
    }
  };

  const analyzePronunciation = useCallback((input: string) => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      const words = input.toLowerCase().trim().split(/\s+/);
      const feedbackResults: PronunciationFeedback[] = [];
      
      words.forEach(word => {
        const analysis = analyzeWord(word);
        feedbackResults.push(analysis);
      });
      
      setFeedback(feedbackResults);
      
      // Calculate overall score
      const totalAccuracy = feedbackResults.reduce((sum, f) => sum + f.accuracy, 0);
      const averageAccuracy = feedbackResults.length > 0 ? totalAccuracy / feedbackResults.length : 0;
      setOverallScore(averageAccuracy);
      
      onFeedback?.(feedbackResults);
      setIsAnalyzing(false);
    }, 1000);
  }, [onFeedback]);

  const analyzeWord = (word: string): PronunciationFeedback => {
    let accuracy = 0;
    const suggestions: string[] = [];
    
    // Check for German-specific sounds
    let hasGermanSounds = false;
    let stressCorrect = false;
    let intonationCorrect = false;
    
    // Analyze vowels
    Object.entries(germanPronunciationPatterns.vowels).forEach(([pattern, info]) => {
      if (word.includes(pattern)) {
        hasGermanSounds = true;
        accuracy += 20;
        suggestions.push(`Practice "${pattern}" sound like in "${info.examples[0]}"`);
      }
    });
    
    // Analyze consonants
    Object.entries(germanPronunciationPatterns.consonants).forEach(([pattern, info]) => {
      if (word.includes(pattern)) {
        hasGermanSounds = true;
        accuracy += 15;
        suggestions.push(`Practice "${pattern}" sound like in "${info.examples[0]}"`);
      }
    });
    
    // Check word length and complexity
    if (word.length > 6) {
      accuracy += 10;
    }
    
    // Check for common German word patterns
    if (word.includes('ung') || word.includes('heit') || word.includes('keit')) {
      accuracy += 15;
      stressCorrect = true;
    }
    
    // Check for compound words
    if (word.includes('haus') || word.includes('mann') || word.includes('frau')) {
      accuracy += 10;
      intonationCorrect = true;
    }
    
    // Normalize accuracy to 0-100
    accuracy = Math.min(100, accuracy);
    
    // Determine stress and intonation
    const stress = stressCorrect ? 'correct' : hasGermanSounds ? 'partial' : 'incorrect';
    const intonation = intonationCorrect ? 'correct' : hasGermanSounds ? 'partial' : 'incorrect';
    
    // Add general suggestions
    if (accuracy < 50) {
      suggestions.push('Practice speaking more slowly and clearly');
      suggestions.push('Focus on German vowel sounds');
    } else if (accuracy < 80) {
      suggestions.push('Good progress! Work on stress patterns');
      suggestions.push('Practice with native speakers');
    } else {
      suggestions.push('Excellent pronunciation!');
      suggestions.push('Keep practicing to maintain consistency');
    }
    
    return {
      word,
      accuracy,
      stress,
      intonation,
      suggestions: suggestions.slice(0, 3), // Limit to 3 suggestions
    };
  };

  useEffect(() => {
    if (userInput.trim()) {
      analyzePronunciation(userInput);
    }
  }, [userInput, analyzePronunciation]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return '🎉';
    if (score >= 60) return '👍';
    return '💪';
  };

  if (!userInput.trim()) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Pronunciation Assessment</h3>
          {isAnalyzing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-blue-600">Analyzing...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
                {Math.round(overallScore)}%
              </span>
              <span className="text-2xl">{getScoreEmoji(overallScore)}</span>
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${overallScore}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Detailed Feedback */}
      {showDetailed && feedback.length > 0 && (
        <div className="space-y-3">
          {feedback.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 border border-gray-200 rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800">{item.word}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${getScoreColor(item.accuracy)}`}>
                    {Math.round(item.accuracy)}%
                  </span>
                  <div className="flex gap-1">
                    <div className={`w-2 h-2 rounded-full ${
                      item.stress === 'correct' ? 'bg-green-500' : 
                      item.stress === 'partial' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <div className={`w-2 h-2 rounded-full ${
                      item.intonation === 'correct' ? 'bg-green-500' : 
                      item.intonation === 'partial' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                  </div>
                </div>
              </div>
              
              {/* Suggestions */}
              {item.suggestions.length > 0 && (
                <div className="space-y-1">
                  {item.suggestions.map((suggestion, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span className="text-gray-700">{suggestion}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-3"
      >
        <h4 className="font-medium text-blue-800 mb-2">💡 Pronunciation Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• German vowels are pronounced more clearly than in English</li>
          <li>• Pay attention to word stress - usually on the first syllable</li>
          <li>• Practice the "ch" sound like in "Ich"</li>
          <li>• Compound words have stress on the first part</li>
        </ul>
      </motion.div>
    </div>
  );
}; 