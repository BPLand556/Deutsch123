'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AssessmentQuiz } from '@/components/features/AssessmentQuiz';
import { MainNavigation } from '@/components/navigation/MainNavigation';

interface Assessment {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  questionCount: number;
  icon: string;
}

export default function AssessmentPage() {
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [assessmentResults, setAssessmentResults] = useState<Record<string, { score: number; total: number; timeSpent: number }>>({});

  const assessments: Assessment[] = [
    {
      id: 'basic-greetings',
      title: 'Basic Greetings',
      description: 'Test your knowledge of essential German greetings and introductions',
      category: 'Conversation',
      difficulty: 'Beginner',
      estimatedTime: '5 min',
      questionCount: 10,
      icon: '👋'
    },
    {
      id: 'vocabulary-basics',
      title: 'Vocabulary Basics',
      description: 'Assess your understanding of fundamental German vocabulary',
      category: 'Vocabulary',
      difficulty: 'Beginner',
      estimatedTime: '8 min',
      questionCount: 15,
      icon: '📚'
    },
    {
      id: 'grammar-fundamentals',
      title: 'Grammar Fundamentals',
      description: 'Test your knowledge of basic German grammar rules',
      category: 'Grammar',
      difficulty: 'Intermediate',
      estimatedTime: '12 min',
      questionCount: 20,
      icon: '📝'
    },
    {
      id: 'pronunciation-practice',
      title: 'Pronunciation Practice',
      description: 'Practice and test your German pronunciation skills',
      category: 'Pronunciation',
      difficulty: 'Intermediate',
      estimatedTime: '10 min',
      questionCount: 8,
      icon: '🎤'
    },
    {
      id: 'cultural-context',
      title: 'Cultural Context',
      description: 'Learn about German culture and customs through language',
      category: 'Culture',
      difficulty: 'Advanced',
      estimatedTime: '15 min',
      questionCount: 12,
      icon: '🏛️'
    }
  ];

  const getAssessmentQuestions = (assessmentId: string) => {
    const questionSets = {
      'basic-greetings': [
        {
          id: 1,
          type: 'multiple-choice' as const,
          question: 'What is the German word for "Good morning"?',
          options: ['Guten Tag', 'Guten Morgen', 'Gute Nacht', 'Auf Wiedersehen'],
          correctAnswer: 'Guten Morgen',
          explanation: '"Guten Morgen" is the correct German greeting for "Good morning".',
          difficulty: 'easy' as const,
          category: 'Conversation'
        },
        {
          id: 2,
          type: 'multiple-choice' as const,
          question: 'How do you say "Hello" in German?',
          options: ['Tschüss', 'Hallo', 'Danke', 'Bitte'],
          correctAnswer: 'Hallo',
          explanation: '"Hallo" is the most common way to say "Hello" in German.',
          difficulty: 'easy' as const,
          category: 'Conversation'
        },
        {
          id: 3,
          type: 'pronunciation' as const,
          question: 'Practice saying "Guten Tag"',
          germanText: 'Guten Tag',
          englishText: 'Good day',
          correctAnswer: 'Guten Tag',
          explanation: 'Practice the pronunciation: GOO-ten TAHK',
          difficulty: 'medium' as const,
          category: 'Pronunciation'
        }
      ],
      'vocabulary-basics': [
        {
          id: 1,
          type: 'multiple-choice' as const,
          question: 'What does "Brot" mean in English?',
          options: ['Water', 'Bread', 'Milk', 'Cheese'],
          correctAnswer: 'Bread',
          explanation: '"Brot" is the German word for "bread".',
          difficulty: 'easy' as const,
          category: 'Vocabulary'
        },
        {
          id: 2,
          type: 'multiple-choice' as const,
          question: 'What is the German word for "house"?',
          options: ['Auto', 'Haus', 'Buch', 'Tisch'],
          correctAnswer: 'Haus',
          explanation: '"Haus" is the German word for "house".',
          difficulty: 'easy' as const,
          category: 'Vocabulary'
        }
      ]
    };

    return questionSets[assessmentId as keyof typeof questionSets] || [];
  };

  const handleAssessmentComplete = (assessmentId: string, score: number, totalQuestions: number, timeSpent: number) => {
    setAssessmentResults(prev => ({
      ...prev,
      [assessmentId]: { score, total: totalQuestions, timeSpent }
    }));
    setSelectedAssessment(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Conversation':
        return 'bg-blue-100 text-blue-800';
      case 'Vocabulary':
        return 'bg-purple-100 text-purple-800';
      case 'Grammar':
        return 'bg-orange-100 text-orange-800';
      case 'Pronunciation':
        return 'bg-pink-100 text-pink-800';
      case 'Culture':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (selectedAssessment) {
    const questions = getAssessmentQuestions(selectedAssessment.id);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
        <MainNavigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AssessmentQuiz
            title={selectedAssessment.title}
            description={selectedAssessment.description}
            questions={questions}
            onComplete={(score, total, timeSpent) => 
              handleAssessmentComplete(selectedAssessment.id, score, total, timeSpent)
            }
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      <MainNavigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Language Assessments</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test your German language skills with our comprehensive assessments. 
            Choose from different categories and difficulty levels to track your progress.
          </p>
        </motion.div>

        {/* Assessment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((assessment, index) => {
            const result = assessmentResults[assessment.id];
            const isCompleted = !!result;
            const percentage = result ? Math.round((result.score / result.total) * 100) : 0;

            return (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedAssessment(assessment)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{assessment.icon}</div>
                  {isCompleted && (
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium text-gray-600">Score:</span>
                      <span className={`text-sm font-bold ${
                        percentage >= 80 ? 'text-green-600' : 
                        percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {percentage}%
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{assessment.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{assessment.description}</p>

                <div className="flex items-center space-x-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(assessment.category)}`}>
                    {assessment.category}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(assessment.difficulty)}`}>
                    {assessment.difficulty}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{assessment.questionCount} questions</span>
                  <span>{assessment.estimatedTime}</span>
                </div>

                {isCompleted && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Time spent: {Math.floor(result.timeSpent / 60)}:{(result.timeSpent % 60).toString().padStart(2, '0')}</span>
                      <span>{result.score}/{result.total} correct</span>
                    </div>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    isCompleted
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isCompleted ? 'Retake Assessment' : 'Start Assessment'}
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Progress Overview */}
        {Object.keys(assessmentResults).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Assessment Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(assessmentResults).map(([assessmentId, result]) => {
                const assessment = assessments.find(a => a.id === assessmentId);
                const percentage = Math.round((result.score / result.total) * 100);
                
                return (
                  <div key={assessmentId} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-lg">{assessment?.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{assessment?.title}</h3>
                        <p className="text-xs text-gray-600">{assessment?.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Score: {percentage}%</span>
                      <span className="text-gray-600">
                        {Math.floor(result.timeSpent / 60)}:{(result.timeSpent % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full ${
                          percentage >= 80 ? 'bg-green-500' : 
                          percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
} 