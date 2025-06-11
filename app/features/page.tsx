'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceInput } from '@/components/voice/VoiceInput';
import { TextToSpeech } from '@/components/voice/TextToSpeech';
import { TranslationReveal } from '@/components/translation/TranslationReveal';
import Link from 'next/link';

const features = [
  {
    id: 'voice-conversation',
    title: 'Voice Conversation System',
    description: 'Practice speaking German with advanced speech recognition and natural text-to-speech.',
    icon: '🎤',
    color: 'primary',
    demo: 'voice',
  },
  {
    id: 'translation-support',
    title: 'Smart Translation Reveal',
    description: 'Get contextual translations and cultural insights when you need them.',
    icon: '👁️',
    color: 'amber',
    demo: 'translation',
  },
  {
    id: 'immersive-scenarios',
    title: 'Immersive Learning Scenarios',
    description: 'Learn German in authentic contexts like coffee shops, universities, and business meetings.',
    icon: '🏢',
    color: 'burgundy',
    demo: 'scenario',
  },
  {
    id: 'adaptive-learning',
    title: 'Adaptive Learning System',
    description: 'AI-powered system that adjusts difficulty based on your progress and learning style.',
    icon: '🧠',
    color: 'bavarian',
    demo: 'adaptive',
  },
  {
    id: 'cultural-immersion',
    title: 'Cultural Immersion',
    description: 'Learn not just the language, but the culture, customs, and social nuances of German-speaking countries.',
    icon: '🇩🇪',
    color: 'german',
    demo: 'culture',
  },
  {
    id: 'progress-tracking',
    title: 'Comprehensive Progress Tracking',
    description: 'Track your learning journey with detailed analytics and personalized insights.',
    icon: '📊',
    color: 'coffee',
    demo: 'progress',
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer',
    company: 'Tech Startup',
    content: 'Deutsch123 helped me learn German for my job transfer to Berlin. The voice features made me confident in real conversations.',
    rating: 5,
    avatar: '👩‍💻',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Student',
    company: 'University of Munich',
    content: 'The cultural context and immersive scenarios made learning German feel natural and engaging.',
    rating: 5,
    avatar: '👨‍🎓',
  },
  {
    name: 'Emma Thompson',
    role: 'Business Consultant',
    company: 'International Corp',
    content: 'Perfect for business German. The formal language training and cultural insights were invaluable.',
    rating: 5,
    avatar: '👩‍💼',
  },
];

const curriculum = [
  {
    level: 'Beginner (A1-A2)',
    description: 'Master basic German for everyday situations',
    features: [
      'Essential greetings and introductions',
      'Basic conversation skills',
      'Simple grammar structures',
      'Cultural basics and etiquette',
    ],
    scenarios: ['Coffee Shop', 'Supermarket', 'Public Transport'],
    duration: '3-6 months',
  },
  {
    level: 'Intermediate (B1-B2)',
    description: 'Develop fluency for work and social situations',
    features: [
      'Complex grammar and vocabulary',
      'Professional communication',
      'Regional variations and dialects',
      'Advanced cultural understanding',
    ],
    scenarios: ['Business Meetings', 'University Life', 'Social Gatherings'],
    duration: '6-12 months',
  },
  {
    level: 'Advanced (C1-C2)',
    description: 'Achieve native-like proficiency',
    features: [
      'Academic and professional German',
      'Idiomatic expressions',
      'Literature and media comprehension',
      'Deep cultural integration',
    ],
    scenarios: ['Academic Presentations', 'Legal/Medical German', 'Creative Writing'],
    duration: '12-18 months',
  },
];

export default function FeaturesPage() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const handleFeatureClick = (featureId: string) => {
    setActiveFeature(activeFeature === featureId ? null : featureId);
    setActiveDemo(features.find(f => f.id === featureId)?.demo || null);
  };

  const getColorClasses = (color: string) => {
    const colors = {
      primary: 'bg-primary-500 text-white',
      amber: 'bg-amber-500 text-white',
      burgundy: 'bg-burgundy-500 text-white',
      bavarian: 'bg-bavarian-500 text-white',
      german: 'bg-german-500 text-white',
      coffee: 'bg-coffee-500 text-white',
    };
    return colors[color as keyof typeof colors] || colors.primary;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Deutsch123
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl">
              Experience the future of German language learning with our comprehensive suite of 
              immersive features designed to make you fluent faster.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Revolutionary Learning Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform combines cutting-edge technology with proven learning methods 
            to create an unparalleled German learning experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => handleFeatureClick(feature.id)}
            >
              <div className="p-6">
                <div className={`w-12 h-12 rounded-lg ${getColorClasses(feature.color)} flex items-center justify-center text-2xl mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                <button className="text-primary-600 hover:text-primary-700 font-medium">
                  Try Demo →
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive Demo Section */}
        <AnimatePresence>
          {activeDemo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl shadow-lg p-8 mb-16"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Interactive Demo: {features.find(f => f.demo === activeDemo)?.title}
              </h3>

              {activeDemo === 'voice' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Voice Recognition Demo</h4>
                    <VoiceInput
                      onTranscript={(transcript, confidence) => {
                        console.log('Transcript:', transcript, 'Confidence:', confidence);
                      }}
                      placeholder="Try saying 'Guten Morgen' or 'Wie geht es Ihnen'"
                      className="max-w-md"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Text-to-Speech Demo</h4>
                    <TextToSpeech
                      text="Willkommen bei Deutsch123! Lassen Sie uns gemeinsam Deutsch lernen."
                      showControls={true}
                      showVoiceSelector={true}
                      showSpeedControl={true}
                      className="max-w-md"
                    />
                  </div>
                </div>
              )}

              {activeDemo === 'translation' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Translation Reveal Demo</h4>
                  <p className="text-gray-700">
                    Hover over or click on these German phrases to see translations and cultural context:
                  </p>
                  <div className="space-y-2 text-lg">
                    <p>
                      <TranslationReveal germanText="Guten Morgen" />, wie geht es Ihnen heute?
                    </p>
                    <p>
                      Entschuldigung, können Sie mir helfen? Ich suche nach einem <TranslationReveal germanText="Kaffee und Kuchen" />.
                    </p>
                    <p>
                      Das ist wirklich <TranslationReveal germanText="Gemütlichkeit" /> hier!
                    </p>
                  </div>
                </div>
              )}

              {activeDemo === 'scenario' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Immersive Scenario Demo</h4>
                  <div className="bg-gradient-to-r from-coffee-100 to-coffee-200 rounded-lg p-6">
                    <h5 className="text-lg font-medium text-coffee-800 mb-3">Berlin Coffee Shop Scenario</h5>
                    <p className="text-coffee-700 mb-4">
                      Experience authentic German coffee culture with interactive conversations, 
                      cultural insights, and real-world vocabulary.
                    </p>
                    <button className="bg-coffee-500 text-white px-6 py-2 rounded-lg hover:bg-coffee-600 transition-colors">
                      Start Scenario
                    </button>
                  </div>
                </div>
              )}

              {activeDemo === 'adaptive' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Adaptive Learning Demo</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h6 className="font-medium text-green-800 mb-2">Beginner Mode</h6>
                      <p className="text-sm text-green-700">Full translation support, slower speech, basic vocabulary</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h6 className="font-medium text-yellow-800 mb-2">Intermediate Mode</h6>
                      <p className="text-sm text-yellow-700">Partial translations, natural speed, complex phrases</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h6 className="font-medium text-red-800 mb-2">Advanced Mode</h6>
                      <p className="text-sm text-red-700">Minimal support, native speed, idiomatic expressions</p>
                    </div>
                  </div>
                </div>
              )}

              {activeDemo === 'culture' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Cultural Immersion Demo</h4>
                  <div className="bg-gradient-to-r from-german-100 to-german-200 rounded-lg p-6">
                    <h5 className="text-lg font-medium text-german-800 mb-3">German Cultural Insights</h5>
                    <ul className="space-y-2 text-german-700">
                      <li>• Understanding formal vs informal address (Sie vs du)</li>
                      <li>• Regional customs and traditions</li>
                      <li>• Business etiquette and communication styles</li>
                      <li>• Social norms and cultural values</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeDemo === 'progress' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Progress Tracking Demo</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-coffee-50 p-4 rounded-lg">
                      <h6 className="font-medium text-coffee-800 mb-2">Vocabulary Mastery</h6>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-coffee-700">Basic Greetings</span>
                          <span className="text-sm font-medium text-coffee-800">95%</span>
                        </div>
                        <div className="w-full bg-coffee-200 rounded-full h-2">
                          <div className="bg-coffee-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-primary-50 p-4 rounded-lg">
                      <h6 className="font-medium text-primary-800 mb-2">Pronunciation Accuracy</h6>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-primary-700">Overall Score</span>
                          <span className="text-sm font-medium text-primary-800">87%</span>
                        </div>
                        <div className="w-full bg-primary-200 rounded-full h-2">
                          <div className="bg-primary-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Curriculum Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Curriculum
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our structured learning path takes you from beginner to advanced German proficiency 
              with authentic scenarios and cultural immersion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {curriculum.map((level, index) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-primary-500"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{level.level}</h3>
                <p className="text-gray-600 mb-4">{level.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {level.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="text-primary-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Scenarios:</h4>
                  <div className="flex flex-wrap gap-2">
                    {level.scenarios.map((scenario, idx) => (
                      <span key={idx} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                        {scenario}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  Estimated duration: {level.duration}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Learners Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of successful learners who have achieved their German language goals with Deutsch123.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                <div className="flex text-yellow-400">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary-500 to-burgundy-500 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your German Journey?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of learners and experience the most advanced German learning platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center">
                Start Free Trial
              </Link>
              <Link href="/pricing" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors text-center">
                View Pricing
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 