'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ImmersionScenario, ScenarioType } from '@/types'
import ImmersionExperience from '@/components/features/ImmersionExperience'

const sampleScenarios: ImmersionScenario[] = [
  {
    id: '1',
    title: 'Berlin Coffee Shop',
    description: 'Order coffee and practice casual conversation in a typical Berlin café.',
    type: 'restaurant',
    difficulty: 'A1',
    duration: 15,
    location: 'Berlin, Germany',
    characters: [
      {
        id: '1',
        name: 'Anna',
        role: 'Barista',
        personality: 'Friendly and patient',
        dialect: 'Berlin',
        avatar: '/images/characters/anna.jpg',
        background: 'Anna has been working at this café for 3 years and loves helping tourists practice German.',
        dialogueOptions: []
      }
    ],
    objectives: [
      {
        id: '1',
        title: 'Order a drink',
        description: 'Learn to order coffee and other beverages in German',
        type: 'vocabulary',
        completed: false
      },
      {
        id: '2',
        title: 'Make small talk',
        description: 'Practice basic greetings and casual conversation',
        type: 'communication',
        completed: false
      }
    ],
    vocabulary: [
      {
        id: '1',
        word: 'Kaffee',
        translation: 'coffee',
        pronunciation: 'KAH-fee',
        partOfSpeech: 'noun',
        difficulty: 'A1',
        context: 'restaurant',
        examples: ['Ich möchte einen Kaffee, bitte.'],
        synonyms: ['Bohne'],
        antonyms: [],
        relatedWords: ['Tee', 'Milch', 'Zucker'],
        culturalNotes: 'Coffee culture is very important in Germany',
        audioUrl: '/audio/kaffee.mp3',
        srsData: {
          interval: 1,
          repetitions: 0,
          easeFactor: 2.5,
          nextReview: new Date(),
          lastReview: new Date(),
          streak: 0
        }
      }
    ],
    grammar: [],
    culturalNotes: [
      {
        id: '1',
        title: 'Berlin Coffee Culture',
        description: 'Berlin has a vibrant coffee scene with many independent cafés',
        category: 'customs',
        relevance: 'restaurant',
        examples: ['Many cafés have creative, international atmospheres']
      }
    ],
    media: []
  },
  {
    id: '2',
    title: 'Munich Train Station',
    description: 'Navigate a German train station and buy tickets for your journey.',
    type: 'transportation',
    difficulty: 'A2',
    duration: 20,
    location: 'Munich, Germany',
    characters: [
      {
        id: '2',
        name: 'Thomas',
        role: 'Ticket Agent',
        personality: 'Professional and helpful',
        dialect: 'Bavarian',
        avatar: '/images/characters/thomas.jpg',
        background: 'Thomas has worked at the train station for 10 years and knows all the routes.',
        dialogueOptions: []
      }
    ],
    objectives: [
      {
        id: '3',
        title: 'Buy train tickets',
        description: 'Learn vocabulary and phrases for purchasing tickets',
        type: 'vocabulary',
        completed: false
      },
      {
        id: '4',
        title: 'Ask for directions',
        description: 'Practice asking and understanding directions',
        type: 'communication',
        completed: false
      }
    ],
    vocabulary: [
      {
        id: '2',
        word: 'Fahrkarte',
        translation: 'ticket',
        pronunciation: 'FAHR-kar-te',
        partOfSpeech: 'noun',
        difficulty: 'A2',
        context: 'transportation',
        examples: ['Ich brauche eine Fahrkarte nach Berlin.'],
        synonyms: ['Ticket'],
        antonyms: [],
        relatedWords: ['Zug', 'Bahnhof', 'Gleis'],
        culturalNotes: 'German trains are known for punctuality',
        audioUrl: '/audio/fahrkarte.mp3',
        srsData: {
          interval: 1,
          repetitions: 0,
          easeFactor: 2.5,
          nextReview: new Date(),
          lastReview: new Date(),
          streak: 0
        }
      }
    ],
    grammar: [],
    culturalNotes: [
      {
        id: '2',
        title: 'German Punctuality',
        description: 'Germans value punctuality, especially in transportation',
        category: 'customs',
        relevance: 'transportation',
        examples: ['Trains typically run on time']
      }
    ],
    media: []
  },
  {
    id: '3',
    title: 'Vienna University',
    description: 'Attend a university lecture and interact with professors and students.',
    type: 'university',
    difficulty: 'B1',
    duration: 25,
    location: 'Vienna, Austria',
    characters: [
      {
        id: '3',
        name: 'Dr. Schmidt',
        role: 'Professor',
        personality: 'Academic and encouraging',
        dialect: 'Viennese',
        avatar: '/images/characters/schmidt.jpg',
        background: 'Dr. Schmidt teaches German literature and welcomes international students.',
        dialogueOptions: []
      }
    ],
    objectives: [
      {
        id: '5',
        title: 'Academic vocabulary',
        description: 'Learn university and academic terminology',
        type: 'vocabulary',
        completed: false
      },
      {
        id: '6',
        title: 'Formal speech',
        description: 'Practice formal German used in academic settings',
        type: 'grammar',
        completed: false
      }
    ],
    vocabulary: [
      {
        id: '3',
        word: 'Vorlesung',
        translation: 'lecture',
        pronunciation: 'FOR-lay-zung',
        partOfSpeech: 'noun',
        difficulty: 'B1',
        context: 'university',
        examples: ['Die Vorlesung beginnt um 10 Uhr.'],
        synonyms: ['Unterricht'],
        antonyms: [],
        relatedWords: ['Professor', 'Student', 'Universität'],
        culturalNotes: 'Austrian universities have a long academic tradition',
        audioUrl: '/audio/vorlesung.mp3',
        srsData: {
          interval: 1,
          repetitions: 0,
          easeFactor: 2.5,
          nextReview: new Date(),
          lastReview: new Date(),
          streak: 0
        }
      }
    ],
    grammar: [],
    culturalNotes: [
      {
        id: '3',
        title: 'Austrian Academic Culture',
        description: 'Austrian universities emphasize formal academic discourse',
        category: 'customs',
        relevance: 'university',
        examples: ['Students address professors formally']
      }
    ],
    media: []
  },
  {
    id: '4',
    title: 'Frankfurt Business Meeting',
    description: 'Participate in a formal business meeting in Germany\'s financial capital.',
    type: 'workplace',
    difficulty: 'B2',
    duration: 30,
    location: 'Frankfurt, Germany',
    characters: [
      {
        id: '4',
        name: 'Frau Weber',
        role: 'Business Manager',
        personality: 'Professional and direct',
        dialect: 'Hessian',
        avatar: '/images/characters/weber.jpg',
        background: 'Frau Weber manages international business relations and values efficiency.',
        dialogueOptions: []
      }
    ],
    objectives: [
      {
        id: '7',
        title: 'Business vocabulary',
        description: 'Learn professional German business terminology',
        type: 'vocabulary',
        completed: false
      },
      {
        id: '8',
        title: 'Formal negotiations',
        description: 'Practice formal business communication and negotiations',
        type: 'communication',
        completed: false
      }
    ],
    vocabulary: [
      {
        id: '4',
        word: 'Geschäftsmodell',
        translation: 'business model',
        pronunciation: 'ge-SHEFTS-mo-del',
        partOfSpeech: 'noun',
        difficulty: 'B2',
        context: 'workplace',
        examples: ['Unser Geschäftsmodell ist sehr erfolgreich.'],
        synonyms: ['Unternehmensmodell'],
        antonyms: [],
        relatedWords: ['Geschäft', 'Strategie', 'Planung'],
        culturalNotes: 'German business culture values thorough planning',
        audioUrl: '/audio/geschaeftsmodell.mp3',
        srsData: {
          interval: 1,
          repetitions: 0,
          easeFactor: 2.5,
          nextReview: new Date(),
          lastReview: new Date(),
          streak: 0
        }
      }
    ],
    grammar: [],
    culturalNotes: [
      {
        id: '4',
        title: 'German Business Etiquette',
        description: 'German business culture emphasizes punctuality and direct communication',
        category: 'customs',
        relevance: 'workplace',
        examples: ['Meetings start exactly on time']
      }
    ],
    media: []
  },
  {
    id: '5',
    title: 'Hamburg Supermarket',
    description: 'Navigate a German supermarket and understand product labels and prices.',
    type: 'shopping',
    difficulty: 'A1',
    duration: 18,
    location: 'Hamburg, Germany',
    characters: [
      {
        id: '5',
        name: 'Klaus',
        role: 'Store Clerk',
        personality: 'Helpful and knowledgeable',
        dialect: 'Hamburg',
        avatar: '/images/characters/klaus.jpg',
        background: 'Klaus knows all the products and loves helping customers find what they need.',
        dialogueOptions: []
      }
    ],
    objectives: [
      {
        id: '9',
        title: 'Shopping vocabulary',
        description: 'Learn supermarket and shopping-related words',
        type: 'vocabulary',
        completed: false
      },
      {
        id: '10',
        title: 'Read labels',
        description: 'Practice reading German product labels and prices',
        type: 'vocabulary',
        completed: false
      }
    ],
    vocabulary: [
      {
        id: '5',
        word: 'Supermarkt',
        translation: 'supermarket',
        pronunciation: 'SOO-per-markt',
        partOfSpeech: 'noun',
        difficulty: 'A1',
        context: 'shopping',
        examples: ['Ich gehe zum Supermarkt einkaufen.'],
        synonyms: ['Geschäft', 'Laden'],
        antonyms: [],
        relatedWords: ['Einkaufswagen', 'Kasse', 'Produkt'],
        culturalNotes: 'German supermarkets have strict labeling requirements',
        audioUrl: '/audio/supermarkt.mp3',
        srsData: {
          interval: 1,
          repetitions: 0,
          easeFactor: 2.5,
          nextReview: new Date(),
          lastReview: new Date(),
          streak: 0
        }
      }
    ],
    grammar: [],
    culturalNotes: [
      {
        id: '5',
        title: 'German Shopping Culture',
        description: 'Germans value quality and often prefer local products',
        category: 'customs',
        relevance: 'shopping',
        examples: ['Many products are labeled with origin information']
      }
    ],
    media: []
  },
  {
    id: '6',
    title: 'Cologne Christmas Market',
    description: 'Experience the magic of a traditional German Christmas market.',
    type: 'cultural_event',
    difficulty: 'A2',
    duration: 22,
    location: 'Cologne, Germany',
    characters: [
      {
        id: '6',
        name: 'Maria',
        role: 'Market Vendor',
        personality: 'Festive and warm',
        dialect: 'Cologne',
        avatar: '/images/characters/maria.jpg',
        background: 'Maria has been selling traditional Christmas decorations for 15 years.',
        dialogueOptions: []
      }
    ],
    objectives: [
      {
        id: '11',
        title: 'Holiday vocabulary',
        description: 'Learn Christmas and holiday-related German words',
        type: 'vocabulary',
        completed: false
      },
      {
        id: '12',
        title: 'Cultural traditions',
        description: 'Understand German Christmas market traditions',
        type: 'cultural',
        completed: false
      }
    ],
    vocabulary: [
      {
        id: '6',
        word: 'Weihnachtsmarkt',
        translation: 'Christmas market',
        pronunciation: 'VY-nakhts-markt',
        partOfSpeech: 'noun',
        difficulty: 'A2',
        context: 'cultural_event',
        examples: ['Der Weihnachtsmarkt ist sehr schön.'],
        synonyms: ['Christkindlmarkt'],
        antonyms: [],
        relatedWords: ['Weihnachten', 'Markt', 'Glühwein'],
        culturalNotes: 'Christmas markets are a beloved German tradition',
        audioUrl: '/audio/weihnachtsmarkt.mp3',
        srsData: {
          interval: 1,
          repetitions: 0,
          easeFactor: 2.5,
          nextReview: new Date(),
          lastReview: new Date(),
          streak: 0
        }
      }
    ],
    grammar: [],
    culturalNotes: [
      {
        id: '6',
        title: 'German Christmas Traditions',
        description: 'Christmas markets are central to German holiday culture',
        category: 'traditions',
        relevance: 'cultural_event',
        examples: ['Markets feature traditional crafts and food']
      }
    ],
    media: []
  },
  {
    id: '7',
    title: 'Berlin Art Gallery',
    description: 'Explore contemporary art and discuss creativity in German.',
    type: 'city_exploration',
    difficulty: 'B1',
    duration: 28,
    location: 'Berlin, Germany',
    characters: [
      {
        id: '7',
        name: 'Lisa',
        role: 'Art Curator',
        personality: 'Creative and passionate',
        dialect: 'Berlin',
        avatar: '/images/characters/lisa.jpg',
        background: 'Lisa curates contemporary art exhibitions and loves discussing art with visitors.',
        dialogueOptions: []
      }
    ],
    objectives: [
      {
        id: '13',
        title: 'Art vocabulary',
        description: 'Learn art and creativity-related German terms',
        type: 'vocabulary',
        completed: false
      },
      {
        id: '14',
        title: 'Express opinions',
        description: 'Practice expressing opinions about art in German',
        type: 'communication',
        completed: false
      }
    ],
    vocabulary: [
      {
        id: '7',
        word: 'Kunstgalerie',
        translation: 'art gallery',
        pronunciation: 'KOONST-ga-le-ree',
        partOfSpeech: 'noun',
        difficulty: 'B1',
        context: 'city_exploration',
        examples: ['Die Kunstgalerie zeigt moderne Kunst.'],
        synonyms: ['Galerie', 'Museum'],
        antonyms: [],
        relatedWords: ['Kunst', 'Ausstellung', 'Künstler'],
        culturalNotes: 'Berlin is known for its vibrant contemporary art scene',
        audioUrl: '/audio/kunstgalerie.mp3',
        srsData: {
          interval: 1,
          repetitions: 0,
          easeFactor: 2.5,
          nextReview: new Date(),
          lastReview: new Date(),
          streak: 0
        }
      }
    ],
    grammar: [],
    culturalNotes: [
      {
        id: '7',
        title: 'Berlin Art Scene',
        description: 'Berlin is a major center for contemporary art in Europe',
        category: 'arts',
        relevance: 'city_exploration',
        examples: ['Many artists choose Berlin for its creative atmosphere']
      }
    ],
    media: []
  },
  {
    id: '8',
    title: 'Munich Beer Garden',
    description: 'Experience traditional Bavarian culture at a beer garden.',
    type: 'social_gathering',
    difficulty: 'A2',
    duration: 24,
    location: 'Munich, Germany',
    characters: [
      {
        id: '8',
        name: 'Hans',
        role: 'Beer Garden Host',
        personality: 'Traditional and welcoming',
        dialect: 'Bavarian',
        avatar: '/images/characters/hans.jpg',
        background: 'Hans has been working at this beer garden for 20 years and knows all the traditions.',
        dialogueOptions: []
      }
    ],
    objectives: [
      {
        id: '15',
        title: 'Social vocabulary',
        description: 'Learn social and hospitality-related German words',
        type: 'vocabulary',
        completed: false
      },
      {
        id: '16',
        title: 'Cultural customs',
        description: 'Understand Bavarian beer garden traditions',
        type: 'cultural',
        completed: false
      }
    ],
    vocabulary: [
      {
        id: '8',
        word: 'Biergarten',
        translation: 'beer garden',
        pronunciation: 'BEER-gar-ten',
        partOfSpeech: 'noun',
        difficulty: 'A2',
        context: 'social_gathering',
        examples: ['Wir gehen zum Biergarten.'],
        synonyms: ['Gartenwirtschaft'],
        antonyms: [],
        relatedWords: ['Bier', 'Garten', 'Gesellschaft'],
        culturalNotes: 'Beer gardens are central to Bavarian social life',
        audioUrl: '/audio/biergarten.mp3',
        srsData: {
          interval: 1,
          repetitions: 0,
          easeFactor: 2.5,
          nextReview: new Date(),
          lastReview: new Date(),
          streak: 0
        }
      }
    ],
    grammar: [],
    culturalNotes: [
      {
        id: '8',
        title: 'Bavarian Beer Culture',
        description: 'Beer gardens are important social spaces in Bavaria',
        category: 'customs',
        relevance: 'social_gathering',
        examples: ['Families often bring their own food']
      }
    ],
    media: []
  }
]

export default function ImmersionPage() {
  const [selectedScenario, setSelectedScenario] = useState<ImmersionScenario | null>(null)
  const [isInExperience, setIsInExperience] = useState(false)
  const [filter, setFilter] = useState<ScenarioType | 'all'>('all')
  const [loadingScenario, setLoadingScenario] = useState<ImmersionScenario | null>(null)

  useEffect(() => {
    if (loadingScenario) {
      const timer = setTimeout(() => {
        setSelectedScenario(loadingScenario)
        setLoadingScenario(null)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [loadingScenario])

  const filteredScenarios = filter === 'all' 
    ? sampleScenarios 
    : sampleScenarios.filter(scenario => scenario.type === filter)

  const getScenarioIcon = (type: ScenarioType) => {
    switch (type) {
      case 'restaurant':
        return '🍽️'
      case 'transportation':
        return '🚆'
      case 'university':
        return '🎓'
      case 'shopping':
        return '🛍️'
      case 'workplace':
        return '💼'
      case 'city_exploration':
        return '🏙️'
      case 'social_gathering':
        return '👥'
      case 'cultural_event':
        return '🎭'
      default:
        return '📍'
    }
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'A1':
      case 'A2':
        return 'bg-green-100 text-green-800'
      case 'B1':
      case 'B2':
        return 'bg-yellow-100 text-yellow-800'
      case 'C1':
      case 'C2':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleStartExperience = () => {
    setIsInExperience(true)
  }

  const handleCompleteExperience = (results: any) => {
    console.log('Experience completed:', results)
    setIsInExperience(false)
    setSelectedScenario(null)
    // Here you would typically save the results to the backend
  }

  const handleExitExperience = () => {
    setIsInExperience(false)
  }

  if (isInExperience && selectedScenario) {
    return (
      <ImmersionExperience
        scenario={selectedScenario}
        onComplete={handleCompleteExperience}
        onExit={handleExitExperience}
      />
    )
  }

  if (selectedScenario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={() => setSelectedScenario(null)}
            className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
          >
            ← Back to Scenarios
          </button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl">{getScenarioIcon(selectedScenario.type)}</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{selectedScenario.title}</h1>
                <p className="text-gray-600">{selectedScenario.location}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Scenario Description</h2>
                  <p className="text-gray-700 mb-4">{selectedScenario.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className={`px-3 py-1 rounded-full ${getDifficultyColor(selectedScenario.difficulty)}`}>
                      {selectedScenario.difficulty}
                    </span>
                    <span>⏱️ {selectedScenario.duration} minutes</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Learning Objectives</h2>
                  <div className="space-y-3">
                    {selectedScenario.objectives.map((objective) => (
                      <div key={objective.id} className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          objective.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                        }`} />
                        <div>
                          <h3 className="font-medium">{objective.title}</h3>
                          <p className="text-sm text-gray-600">{objective.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Characters</h2>
                  <div className="space-y-4">
                    {selectedScenario.characters.map((character) => (
                      <div key={character.id} className="text-center">
                        <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
                          👤
                        </div>
                        <h3 className="font-medium">{character.name}</h3>
                        <p className="text-sm text-gray-600">{character.role}</p>
                        <p className="text-xs text-gray-500">{character.dialect}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleStartExperience}
                  className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Immersion Experience
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Virtual Immersion Experiences
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Step into authentic German-speaking environments and practice your language skills
            in realistic scenarios with AI-powered characters.
          </p>
        </motion.div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {['all', 'restaurant', 'transportation', 'university', 'shopping', 'workplace', 'city_exploration', 'social_gathering', 'cultural_event'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type as ScenarioType | 'all')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  filter === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {type === 'all' ? 'All Scenarios' : type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScenarios.map((scenario, index) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setLoadingScenario(scenario)}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{getScenarioIcon(scenario.type)}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{scenario.title}</h3>
                    <p className="text-sm text-gray-600">{scenario.location}</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-3">{scenario.description}</p>

                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(scenario.difficulty)}`}>
                    {scenario.difficulty}
                  </span>
                  <span className="text-sm text-gray-600">⏱️ {scenario.duration} min</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Loading Overlay */}
        {loadingScenario && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full text-center"
            >
              <h2 className="text-2xl font-bold mb-4">{loadingScenario.title}</h2>
              <p className="text-gray-700 mb-4">{loadingScenario.description}</p>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Learning Objectives</h3>
                <ul className="text-left space-y-1 mb-2">
                  {loadingScenario.objectives.map((obj) => (
                    <li key={obj.id} className="text-sm text-gray-700 flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>{obj.title}</li>
                  ))}
                </ul>
                <h3 className="font-semibold text-gray-900 mb-2">Vocabulary Preview</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(loadingScenario.vocabulary && loadingScenario.vocabulary.length > 0) ? loadingScenario.vocabulary.slice(0, 5).map((vocab) => (
                    <span key={vocab.id} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{vocab.word}</span>
                  )) : <span className="text-xs text-gray-500">No vocabulary preview</span>}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Cultural Tips</h3>
                <ul className="text-left space-y-1">
                  {(loadingScenario.culturalNotes && loadingScenario.culturalNotes.length > 0) ? loadingScenario.culturalNotes.slice(0, 3).map((note, i) => (
                    <li key={note.id} className="text-xs text-gray-600 flex items-center"><span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>{note.title || note.description}</li>
                  )) : <li className="text-xs text-gray-500">No cultural tips</li>}
                </ul>
              </div>
              <div className="text-blue-600 font-medium animate-pulse">Loading immersive environment...</div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
} 