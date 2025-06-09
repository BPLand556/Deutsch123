'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextToSpeech } from '@/components/voice/TextToSpeech';
import { VoiceInput } from '@/components/voice/VoiceInput';

interface ConversationContext {
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  previousMessages: Message[];
  culturalContext: string;
  regionalVariation: string;
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  translation?: string;
  culturalNote?: string;
  timestamp: Date;
  confidence?: number;
  corrections?: string[];
}

interface AIPersonality {
  name: string;
  personality: 'friendly' | 'formal' | 'casual' | 'enthusiastic' | 'reserved' | 'direct';
  region: 'Berlin' | 'Munich' | 'Hamburg' | 'Cologne' | 'Vienna' | 'Zurich' | 'Frankfurt';
  profession: string;
  interests: string[];
  speakingStyle: 'slow' | 'normal' | 'fast';
  formality: 'formal' | 'informal' | 'mixed';
  expertise: string[];
}

interface AIConversationPartnerProps {
  personality: AIPersonality;
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  topic?: string;
  onConversationUpdate?: (context: ConversationContext) => void;
  onLearningInsight?: (insight: string) => void;
  className?: string;
}

const CONVERSATION_TOPICS = {
  'daily-life': {
    title: 'Daily Life',
    beginner: ['greetings', 'weather', 'basic questions'],
    intermediate: ['hobbies', 'work', 'family'],
    advanced: ['politics', 'culture', 'philosophy'],
  },
  'travel': {
    title: 'Travel',
    beginner: ['directions', 'transportation', 'basic needs'],
    intermediate: ['accommodation', 'sightseeing', 'restaurants'],
    advanced: ['cultural experiences', 'local customs', 'history'],
  },
  'business': {
    title: 'Business',
    beginner: ['introductions', 'basic meetings', 'simple requests'],
    intermediate: ['presentations', 'negotiations', 'project discussions'],
    advanced: ['strategic planning', 'market analysis', 'complex negotiations'],
  },
  'culture': {
    title: 'Culture',
    beginner: ['traditions', 'holidays', 'basic customs'],
    intermediate: ['arts', 'literature', 'regional differences'],
    advanced: ['historical context', 'societal issues', 'contemporary debates'],
  },
};

const REGIONAL_EXPRESSIONS = {
  'Berlin': {
    greetings: ['Moin!', 'Na?', 'Alles klar?'],
    casual: ['Digga', 'Alter', 'Ey'],
    formal: ['Guten Tag', 'Auf Wiedersehen'],
  },
  'Munich': {
    greetings: ['Servus!', 'Grüß Gott!', 'Moin!'],
    casual: ['Ois guad', 'Servus'],
    formal: ['Guten Tag', 'Auf Wiedersehen'],
  },
  'Hamburg': {
    greetings: ['Moin!', 'Tach!', 'Alles klar?'],
    casual: ['Moin', 'Tschüss'],
    formal: ['Guten Tag', 'Auf Wiedersehen'],
  },
  'Cologne': {
    greetings: ['Juten Tach!', 'Alles jut?', 'Servus!'],
    casual: ['Alaaf', 'Kölle Alaaf'],
    formal: ['Guten Tag', 'Auf Wiedersehen'],
  },
  'Vienna': {
    greetings: ['Servus!', 'Grüß Gott!', 'Guten Tag!'],
    casual: ['Servus', 'Tschüss'],
    formal: ['Guten Tag', 'Auf Wiedersehen'],
  },
  'Zurich': {
    greetings: ['Grüezi!', 'Hallo!', 'Guten Tag!'],
    casual: ['Tschüss', 'Ciao'],
    formal: ['Guten Tag', 'Auf Wiedersehen'],
  },
  'Frankfurt': {
    greetings: ['Moin!', 'Hallo!', 'Guten Tag!'],
    casual: ['Tschüss', 'Ciao'],
    formal: ['Guten Tag', 'Auf Wiedersehen'],
  },
};

export const AIConversationPartner: React.FC<AIConversationPartnerProps> = ({
  personality,
  userLevel,
  topic = 'daily-life',
  onConversationUpdate,
  onLearningInsight,
  className = '',
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    topic,
    difficulty: userLevel,
    userLevel,
    previousMessages: [],
    culturalContext: '',
    regionalVariation: personality.region,
  });
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
  const [conversationScore, setConversationScore] = useState<number>(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate AI response based on context
  const generateAIResponse = useCallback(async (userMessage: string): Promise<string> => {
    setIsThinking(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const context = {
      ...conversationContext,
      userMessage,
      personality,
      userLevel,
    };

    // Generate contextual response
    let response = '';
    const regionalExpressions = REGIONAL_EXPRESSIONS[personality.region] || REGIONAL_EXPRESSIONS['Berlin'];

    // Analyze user message and generate appropriate response
    if (userMessage.toLowerCase().includes('hallo') || userMessage.toLowerCase().includes('hello')) {
      response = `${regionalExpressions.greetings[Math.floor(Math.random() * regionalExpressions.greetings.length)]} ${personality.name} hier! Wie kann ich Ihnen heute helfen?`;
    } else if (userMessage.toLowerCase().includes('wie geht') || userMessage.toLowerCase().includes('how are')) {
      response = 'Mir geht es sehr gut, danke! Und Ihnen? Ich freue mich, mit Ihnen zu sprechen.';
    } else if (userMessage.toLowerCase().includes('woher') || userMessage.toLowerCase().includes('where')) {
      response = `Ich komme aus ${personality.region}. Es ist eine wunderschöne Stadt mit einer reichen Kultur und Geschichte.`;
    } else if (userMessage.toLowerCase().includes('arbeit') || userMessage.toLowerCase().includes('work')) {
      response = `Ich arbeite als ${personality.profession}. Es ist ein sehr interessanter Beruf, der mir viel Freude bereitet.`;
    } else if (userMessage.toLowerCase().includes('hobby') || userMessage.toLowerCase().includes('interest')) {
      const interests = personality.interests.join(', ');
      response = `Meine Interessen sind ${interests}. Was interessiert Sie besonders?`;
    } else {
      // Generate contextual response based on topic
      const topicData = CONVERSATION_TOPICS[topic as keyof typeof CONVERSATION_TOPICS];
      if (topicData) {
        const levelTopics = topicData[userLevel as keyof typeof topicData] as string[];
        const randomTopic = levelTopics[Math.floor(Math.random() * levelTopics.length)];
        
        switch (randomTopic) {
          case 'greetings':
            response = `${regionalExpressions.greetings[0]}! Schön, Sie kennenzulernen. Lassen Sie uns über ${topicData.title} sprechen.`;
            break;
          case 'weather':
            response = 'Das Wetter ist heute wirklich schön, nicht wahr? In Deutschland haben wir vier sehr unterschiedliche Jahreszeiten.';
            break;
          case 'culture':
            response = `Die deutsche Kultur ist sehr vielfältig. Jede Region hat ihre eigenen Traditionen und Bräuche. In ${personality.region} zum Beispiel...`;
            break;
          default:
            response = `Das ist ein sehr interessantes Thema! Lassen Sie uns mehr über ${randomTopic} sprechen. Was denken Sie darüber?`;
        }
      } else {
        response = 'Das ist eine sehr interessante Frage! Können Sie das bitte genauer erklären?';
      }
    }

    // Adjust response based on user level
    if (userLevel === 'beginner') {
      response = response.replace(/[äöüß]/g, (match) => {
        const replacements: Record<string, string> = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' };
        return replacements[match] || match;
      });
    }

    setIsThinking(false);
    return response;
  }, [conversationContext, personality, userLevel, topic]);

  const handleUserMessage = useCallback(async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Generate AI response
    const aiResponse = await generateAIResponse(message);
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      content: aiResponse,
      timestamp: new Date(),
      culturalNote: personality.region !== 'Berlin' ? `This response uses ${personality.region} regional expressions.` : undefined,
    };

    setMessages(prev => [...prev, aiMessage]);

    // Update conversation context
    const newContext = {
      ...conversationContext,
      previousMessages: [...messages, userMessage, aiMessage],
    };
    setConversationContext(newContext);
    onConversationUpdate?.(newContext);

    // Generate learning insights
    if (Math.random() > 0.7) {
      const insights = [
        `Great use of vocabulary! You're making excellent progress.`,
        `Consider using more formal language in this context.`,
        `Your pronunciation is improving! Keep practicing.`,
        `Try incorporating more regional expressions from ${personality.region}.`,
      ];
      const randomInsight = insights[Math.floor(Math.random() * insights.length)];
      onLearningInsight?.(randomInsight);
    }

    // Update conversation score
    setConversationScore(prev => Math.min(100, prev + 5));
  }, [conversationContext, messages, generateAIResponse, personality, onConversationUpdate, onLearningInsight]);

  const handleVoiceInput = useCallback((transcript: string) => {
    if (transcript.trim()) {
      handleUserMessage(transcript);
    }
  }, [handleUserMessage]);

  const getPersonalityColor = (personality: string) => {
    const colors = {
      friendly: 'bg-green-500',
      formal: 'bg-blue-500',
      casual: 'bg-orange-500',
      enthusiastic: 'bg-yellow-500',
      reserved: 'bg-purple-500',
      direct: 'bg-red-500',
    };
    return colors[personality as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* AI Partner Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl">
            {personality.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold">{personality.name}</h2>
            <p className="text-primary-100">{personality.profession} aus {personality.region}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2 py-1 rounded-full text-xs ${getPersonalityColor(personality.personality)}`}>
                {personality.personality}
              </span>
              <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                {personality.speakingStyle}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Conversation Area */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="text-lg font-medium mb-2">Start a conversation with {personality.name}!</p>
            <p className="text-sm">Try asking about their interests, work, or culture.</p>
          </div>
        ) : (
          messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {message.culturalNote && (
                  <p className="text-xs opacity-75 mt-1 italic">{message.culturalNote}</p>
                )}
                <p className="text-xs opacity-60 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))
        )}
        
        {/* Thinking indicator */}
        <AnimatePresence>
          {isThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">{personality.name} is thinking...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <VoiceInput
            onTranscript={handleVoiceInput}
            className="flex-1"
          />
          <button
            onClick={() => {
              const suggestions = [
                'Wie geht es Ihnen?',
                'Woher kommen Sie?',
                'Was machen Sie beruflich?',
                'Was sind Ihre Hobbys?',
                'Erzählen Sie mir über Ihre Stadt.',
              ];
              const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
              handleUserMessage(randomSuggestion);
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
          >
            💡
          </button>
        </div>
      </div>

      {/* Conversation Stats */}
      <div className="border-t bg-gray-50 p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Messages: {messages.length}</span>
            <span className="text-gray-600">Score: {conversationScore}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Topic:</span>
            <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
              {CONVERSATION_TOPICS[topic as keyof typeof CONVERSATION_TOPICS]?.title || topic}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}; 