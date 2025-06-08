'use client'

import { useState } from 'react'
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
    vocabulary: [],
    grammar: [],
    culturalNotes: [],
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
    vocabulary: [],
    grammar: [],
    culturalNotes: [],
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
    vocabulary: [],
    grammar: [],
    culturalNotes: [],
    media: []
  }
]

export default function ImmersionPage() {
  const [selectedScenario, setSelectedScenario] = useState<ImmersionScenario | null>(null)
  const [isInExperience, setIsInExperience] = useState(false)
  const [filter, setFilter] = useState<ScenarioType | 'all'>('all')

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
              onClick={() => setSelectedScenario(scenario)}
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
      </div>
    </div>
  )
} 