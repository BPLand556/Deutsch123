'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CulturalTopic {
  id: number;
  title: string;
  description: string;
  category: 'traditions' | 'holidays' | 'food' | 'etiquette' | 'history' | 'regional';
  content: string;
  germanPhrases: string[];
  englishTranslations: string[];
  funFact: string;
  imageUrl?: string;
}

export const CulturalInsights: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<CulturalTopic | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const culturalTopics: CulturalTopic[] = [
    {
      id: 1,
      title: 'Oktoberfest Traditions',
      description: 'Discover the world-famous German beer festival',
      category: 'traditions',
      content: 'Oktoberfest is the world\'s largest Volksfest, featuring a beer festival and a travelling funfair. It is held annually in Munich, Bavaria, Germany. It is a 16- to 18-day folk festival running from mid- or late-September to around the first Sunday in October.',
      germanPhrases: ['Prost!', 'Ein Maß Bier, bitte', 'Guten Appetit'],
      englishTranslations: ['Cheers!', 'One liter of beer, please', 'Enjoy your meal'],
      funFact: 'The first Oktoberfest was held in 1810 to celebrate the marriage of Crown Prince Ludwig to Princess Therese of Saxony-Hildburghausen.',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'German Christmas Markets',
      description: 'Experience the magic of Weihnachtsmärkte',
      category: 'holidays',
      content: 'German Christmas markets are street markets associated with the celebration of Christmas during the four weeks of Advent. These markets originated in Germany, but are now held in many other countries. They sell food, drink, and seasonal items from open-air stalls.',
      germanPhrases: ['Frohe Weihnachten', 'Glühwein', 'Lebkuchen'],
      englishTranslations: ['Merry Christmas', 'Mulled wine', 'Gingerbread'],
      funFact: 'The first documented Christmas market was held in Dresden in 1434, making it one of the oldest Christmas markets in the world.',
      imageUrl: 'https://images.unsplash.com/photo-1543589923-d58f523daa0e?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      title: 'German Cuisine',
      description: 'Explore traditional German food and dining customs',
      category: 'food',
      content: 'German cuisine varies from region to region, but is generally hearty and substantial. It includes many different types of bread, sausage, cheese, and beer. Traditional dishes often feature potatoes, cabbage, and meat.',
      germanPhrases: ['Guten Appetit', 'Das schmeckt gut', 'Ich bin satt'],
      englishTranslations: ['Enjoy your meal', 'That tastes good', 'I am full'],
      funFact: 'Germany has over 1,500 different types of sausage (Wurst), and each region has its own specialties.',
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      title: 'German Etiquette',
      description: 'Learn about proper manners and social customs',
      category: 'etiquette',
      content: 'German etiquette emphasizes punctuality, directness, and respect for rules. Handshakes are common greetings, and it\'s important to address people formally until invited to use informal terms.',
      germanPhrases: ['Guten Tag', 'Auf Wiedersehen', 'Entschuldigung'],
      englishTranslations: ['Good day', 'Goodbye', 'Excuse me'],
      funFact: 'In Germany, it\'s considered rude to be late, even by just a few minutes. Punctuality is highly valued.',
      imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop'
    },
    {
      id: 5,
      title: 'Regional Differences',
      description: 'Discover the diversity across German states',
      category: 'regional',
      content: 'Germany is a federal republic with 16 states, each with its own unique culture, dialect, and traditions. From the beer culture of Bavaria to the maritime traditions of the north, each region offers distinct experiences.',
      germanPhrases: ['Servus', 'Moin', 'Grüß Gott'],
      englishTranslations: ['Hello/Goodbye (Bavarian)', 'Hello (Northern)', 'Greet God (Southern)'],
      funFact: 'There are over 250 dialects spoken in Germany, with some being so different that speakers from different regions might not understand each other.',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Topics', icon: '🌍' },
    { id: 'traditions', label: 'Traditions', icon: '🎭' },
    { id: 'holidays', label: 'Holidays', icon: '🎄' },
    { id: 'food', label: 'Food & Dining', icon: '🍽️' },
    { id: 'etiquette', label: 'Etiquette', icon: '🤝' },
    { id: 'regional', label: 'Regional', icon: '🗺️' }
  ];

  const filteredTopics = activeCategory === 'all' 
    ? culturalTopics 
    : culturalTopics.filter(topic => topic.category === activeCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'traditions':
        return 'bg-purple-100 text-purple-800';
      case 'holidays':
        return 'bg-red-100 text-red-800';
      case 'food':
        return 'bg-orange-100 text-orange-800';
      case 'etiquette':
        return 'bg-blue-100 text-blue-800';
      case 'regional':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Cultural Insights</h3>
        <span className="text-sm text-gray-600">Learn about German culture</span>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {selectedTopic ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          {/* Back Button */}
          <button
            onClick={() => setSelectedTopic(null)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to topics</span>
          </button>

          {/* Topic Content */}
          <div className="space-y-6">
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">{selectedTopic.title}</h4>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedTopic.category)}`}>
                {categories.find(c => c.id === selectedTopic.category)?.label}
              </span>
            </div>

            {selectedTopic.imageUrl && (
              <div className="rounded-lg overflow-hidden">
                <img
                  src={selectedTopic.imageUrl}
                  alt={selectedTopic.title}
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed">{selectedTopic.content}</p>
            </div>

            {/* German Phrases */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h5 className="font-semibold text-blue-900 mb-3">Useful German Phrases</h5>
              <div className="space-y-2">
                {selectedTopic.germanPhrases.map((phrase, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium text-blue-800">{phrase}</span>
                    <span className="text-sm text-blue-600">{selectedTopic.englishTranslations[index]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fun Fact */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <span className="text-yellow-600 text-lg">💡</span>
                <div>
                  <h5 className="font-semibold text-yellow-900 mb-1">Fun Fact</h5>
                  <p className="text-yellow-800 text-sm">{selectedTopic.funFact}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filteredTopics.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => setSelectedTopic(topic)}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">
                    {categories.find(c => c.id === topic.category)?.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{topic.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{topic.description}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(topic.category)}`}>
                      {categories.find(c => c.id === topic.category)?.label}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}; 