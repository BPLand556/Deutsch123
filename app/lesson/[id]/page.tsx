'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { VoiceInput } from '@/components/voice/VoiceInput';
import { TextToSpeech } from '@/components/voice/TextToSpeech';
import { VoiceModeSelector } from '@/components/voice/VoiceModeSelector';
import { AIConversationPartner } from '@/components/ai/AIConversationPartner';

interface LessonStep {
  id: number;
  type: 'vocabulary' | 'conversation' | 'grammar' | 'practice';
  title: string;
  content: string;
  germanText?: string;
  englishText?: string;
  pronunciation?: string;
  options?: string[];
  correctAnswer?: string;
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  category: string;
  steps: LessonStep[];
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [currentMode, setCurrentMode] = useState<'voice' | 'text'>('voice');
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showHint, setShowHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Mock lesson data - in a real app, this would come from an API
  const lesson: Lesson = {
    id: parseInt(params.id as string),
    title: 'Basic Greetings',
    description: 'Learn essential German greetings and introductions',
    difficulty: 'Beginner',
    duration: '15 min',
    category: 'Conversation',
    steps: [
      {
        id: 1,
        type: 'vocabulary',
        title: 'Essential Greetings',
        content: 'Let\'s learn the most common German greetings',
        germanText: 'Guten Morgen',
        englishText: 'Good morning',
        pronunciation: 'GOO-ten MOR-gen'
      },
      {
        id: 2,
        type: 'vocabulary',
        title: 'More Greetings',
        content: 'Here are more ways to greet people',
        germanText: 'Guten Tag',
        englishText: 'Good day',
        pronunciation: 'GOO-ten TAHK'
      },
      {
        id: 3,
        type: 'conversation',
        title: 'Practice Conversation',
        content: 'Practice these greetings with our AI partner',
        germanText: 'Hallo, wie geht es Ihnen?',
        englishText: 'Hello, how are you?',
        pronunciation: 'HAH-lo, vee GAYT es EE-nen'
      },
      {
        id: 4,
        type: 'practice',
        title: 'Test Your Knowledge',
        content: 'Choose the correct German greeting',
        options: ['Guten Morgen', 'Guten Tag', 'Gute Nacht', 'Auf Wiedersehen'],
        correctAnswer: 'Guten Morgen'
      }
    ]
  };

  const currentStepData = lesson.steps[currentStep];
  const progress = ((currentStep + 1) / lesson.steps.length) * 100;

  const handleNext = () => {
    if (currentStep < lesson.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowHint(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowHint(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setUserAnswers({ ...userAnswers, [currentStepData.id]: answer });
  };

  const handleDashboardClick = () => {
    router.push('/dashboard');
  };

  const isAnswerCorrect = () => {
    if (currentStepData.type === 'practice' && currentStepData.correctAnswer) {
      return userAnswers[currentStepData.id] === currentStepData.correctAnswer;
    }
    return true;
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4 text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson Completed!</h1>
          <p className="text-gray-600 mb-6">
            Congratulations! You've successfully completed "{lesson.title}".
          </p>
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleDashboardClick}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Back to Dashboard
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentStep(0);
                setIsCompleted(false);
                setUserAnswers({});
              }}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Review Lesson
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={handleDashboardClick}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{lesson.title}</h1>
                <p className="text-sm text-gray-600">{lesson.category} • {lesson.difficulty}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <VoiceModeSelector
                currentMode={currentMode}
                onModeChange={setCurrentMode}
                className="w-auto"
              />
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 h-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="bg-blue-600 h-1"
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              {/* Step Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{currentStepData.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Step {currentStep + 1} of {lesson.steps.length}
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {currentStepData.type}
                  </span>
                </div>
              </div>

              {/* Step Content */}
              <div className="space-y-6">
                <p className="text-gray-700">{currentStepData.content}</p>

                {currentStepData.germanText && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">German</h3>
                        <TextToSpeech
                          text={currentStepData.germanText}
                          showControls={false}
                          className="inline"
                        />
                      </div>
                      <p className="text-lg text-gray-900">{currentStepData.germanText}</p>
                      {currentStepData.pronunciation && (
                        <p className="text-sm text-gray-600 italic">
                          {currentStepData.pronunciation}
                        </p>
                      )}
                      {currentStepData.englishText && (
                        <p className="text-sm text-gray-700">
                          <strong>English:</strong> {currentStepData.englishText}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {currentStepData.type === 'practice' && currentStepData.options && (
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-900">Choose the correct answer:</h3>
                    <div className="grid gap-3">
                      {currentStepData.options.map((option, index) => (
                        <motion.button
                          key={index}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAnswerSelect(option)}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            userAnswers[currentStepData.id] === option
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {option}
                        </motion.button>
                      ))}
                    </div>
                    
                    {userAnswers[currentStepData.id] && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-lg ${
                          isAnswerCorrect()
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-red-50 border border-red-200'
                        }`}
                      >
                        <p className={`text-sm font-medium ${
                          isAnswerCorrect() ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {isAnswerCorrect() ? '✅ Correct!' : '❌ Try again!'}
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}

                {currentStepData.type === 'conversation' && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-3">Practice with AI</h3>
                    <AIConversationPartner
                      personality={{
                        name: 'Anna',
                        personality: 'friendly',
                        region: 'Berlin',
                        profession: 'Teacher',
                        interests: ['music', 'travel', 'cooking'],
                        speakingStyle: 'normal',
                        formality: 'informal',
                        expertise: ['German language', 'culture']
                      }}
                      userLevel="beginner"
                      topic="daily-life"
                    />
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentStep === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>

                <div className="flex items-center space-x-3">
                  {currentStepData.type === 'practice' && (
                    <button
                      type="button"
                      onClick={() => setShowHint(!showHint)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {showHint ? 'Hide hint' : 'Show hint'}
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {currentStep === lesson.steps.length - 1 ? 'Complete' : 'Next'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lesson Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lesson Overview</h3>
              <div className="space-y-3">
                {lesson.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                      index === currentStep
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      index < currentStep
                        ? 'bg-green-500 text-white'
                        : index === currentStep
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index < currentStep ? '✓' : index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{step.title}</p>
                      <p className="text-xs text-gray-600 capitalize">{step.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Voice Practice */}
            {currentMode === 'voice' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Voice Practice</h3>
                <VoiceInput
                  onTranscript={() => {}}
                  placeholder="Practice speaking German..."
                  className="mb-4"
                />
                <p className="text-xs text-gray-600">
                  Try repeating the German phrases you've learned!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 