'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceInput } from '@/components/voice/VoiceInput';
import { TextToSpeech } from '@/components/voice/TextToSpeech';

interface Question {
  id: number;
  type: 'multiple-choice' | 'fill-blank' | 'translation' | 'pronunciation' | 'listening';
  question: string;
  germanText?: string;
  englishText?: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

interface AssessmentQuizProps {
  title: string;
  description: string;
  questions: Question[];
  onComplete: (score: number, totalQuestions: number, timeSpent: number) => void;
  className?: string;
}

export const AssessmentQuiz: React.FC<AssessmentQuizProps> = ({
  title,
  description,
  questions,
  onComplete,
  className = ''
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string | string[]>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    if (isStarted && !isCompleted) {
      const timer = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isStarted, isCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsStarted(true);
    setStartTime(new Date());
  };

  const handleAnswerSelect = (answer: string) => {
    setUserAnswers({ ...userAnswers, [currentQuestion.id]: answer });
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    } else {
      const score = questions.filter(q => {
        const userAnswer = userAnswers[q.id];
        if (Array.isArray(q.correctAnswer)) {
          return Array.isArray(userAnswer) && 
                 userAnswer.length === q.correctAnswer.length &&
                 userAnswer.every(a => q.correctAnswer.includes(a));
        }
        return userAnswer === q.correctAnswer;
      }).length;

      setIsCompleted(true);
      onComplete(score, questions.length, timeSpent);
    }
  };

  const isAnswerCorrect = () => {
    const userAnswer = userAnswers[currentQuestion.id];
    if (!userAnswer) return null;
    
    if (Array.isArray(currentQuestion.correctAnswer)) {
      return Array.isArray(userAnswer) && 
             userAnswer.length === currentQuestion.correctAnswer.length &&
             userAnswer.every(a => currentQuestion.correctAnswer.includes(a));
    }
    return userAnswer === currentQuestion.correctAnswer;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isStarted) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-600 mb-6">{description}</p>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Quiz Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Questions:</span>
                <span className="ml-2 text-blue-900">{questions.length}</span>
              </div>
              <div>
                <span className="text-blue-700">Estimated time:</span>
                <span className="ml-2 text-blue-900">{Math.ceil(questions.length * 1.5)} min</span>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Start Assessment
          </motion.button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    const score = questions.filter(q => {
      const userAnswer = userAnswers[q.id];
      if (Array.isArray(q.correctAnswer)) {
        return Array.isArray(userAnswer) && 
               userAnswer.length === q.correctAnswer.length &&
               userAnswer.every(a => q.correctAnswer.includes(a));
      }
      return userAnswer === q.correctAnswer;
    }).length;

    const percentage = Math.round((score / questions.length) * 100);
    const getScoreMessage = () => {
      if (percentage >= 90) return { message: 'Excellent!', emoji: '🎉', color: 'text-green-600' };
      if (percentage >= 80) return { message: 'Great job!', emoji: '👏', color: 'text-blue-600' };
      if (percentage >= 70) return { message: 'Good work!', emoji: '👍', color: 'text-yellow-600' };
      if (percentage >= 60) return { message: 'Not bad!', emoji: '😊', color: 'text-orange-600' };
      return { message: 'Keep practicing!', emoji: '💪', color: 'text-red-600' };
    };

    const scoreInfo = getScoreMessage();

    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="text-center">
          <div className="text-6xl mb-4">{scoreInfo.emoji}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{scoreInfo.message}</h2>
          <p className={`text-lg font-semibold ${scoreInfo.color} mb-4`}>
            {score} out of {questions.length} correct ({percentage}%)
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Time spent:</span>
                <span className="ml-2 font-medium">{formatTime(timeSpent)}</span>
              </div>
              <div>
                <span className="text-gray-600">Average time per question:</span>
                <span className="ml-2 font-medium">{formatTime(Math.round(timeSpent / questions.length))}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setCurrentQuestionIndex(0);
                setUserAnswers({});
                setShowExplanation(false);
                setIsCompleted(false);
                setTimeSpent(0);
                setIsStarted(false);
              }}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Retake Assessment
            </motion.button>
            <button className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium">
              Review Answers
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Time: {formatTime(timeSpent)}</div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
            {currentQuestion.difficulty}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
          className="bg-blue-600 h-2 rounded-full"
        />
      </div>

      {/* Question */}
      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">{currentQuestion.question}</h3>
          
          {currentQuestion.germanText && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">German Text</span>
                <TextToSpeech
                  text={currentQuestion.germanText}
                  showControls={false}
                  className="inline"
                />
              </div>
              <p className="text-lg text-gray-900">{currentQuestion.germanText}</p>
            </div>
          )}

          {currentQuestion.englishText && (
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <span className="font-medium text-blue-900">English Translation</span>
              <p className="text-blue-900 mt-1">{currentQuestion.englishText}</p>
            </div>
          )}
        </div>

        {/* Answer Options */}
        {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswerSelect(option)}
                disabled={showExplanation}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  userAnswers[currentQuestion.id] === option
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    userAnswers[currentQuestion.id] === option
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300'
                  }`}>
                    {userAnswers[currentQuestion.id] === option && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {currentQuestion.type === 'pronunciation' && (
          <div className="space-y-4">
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>Instructions:</strong> Listen to the pronunciation and repeat it using voice input.
              </p>
            </div>
            <VoiceInput
              onTranscript={(transcript, confidence) => {
                console.log('Pronunciation attempt:', transcript, confidence);
                if (confidence > 0.7) {
                  handleAnswerSelect(transcript);
                }
              }}
              placeholder="Repeat the German phrase..."
              className="mb-4"
            />
          </div>
        )}

        {/* Explanation */}
        {showExplanation && currentQuestion.explanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border ${
              isAnswerCorrect()
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <span className={`text-lg ${isAnswerCorrect() ? 'text-green-600' : 'text-red-600'}`}>
                {isAnswerCorrect() ? '✅' : '❌'}
              </span>
              <span className={`font-medium ${isAnswerCorrect() ? 'text-green-800' : 'text-red-800'}`}>
                {isAnswerCorrect() ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            <p className={`text-sm ${isAnswerCorrect() ? 'text-green-700' : 'text-red-700'}`}>
              {currentQuestion.explanation}
            </p>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentQuestionIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!userAnswers[currentQuestion.id]}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              !userAnswers[currentQuestion.id]
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}; 