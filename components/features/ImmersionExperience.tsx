'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ImmersionScenario, Character, ConversationMessage } from '@/types'

interface ImmersionExperienceProps {
  scenario: ImmersionScenario
  onComplete: (results: any) => void
  onExit: () => void
}

export default function ImmersionExperience({ scenario, onComplete, onExit }: ImmersionExperienceProps) {
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [userInput, setUserInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [completedObjectives] = useState<string[]>([])
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null)

  useEffect(() => {
    // Initialize the experience
    if (scenario.characters.length > 0) {
      setCurrentCharacter(scenario.characters[0])
      // Add initial greeting
      const initialMessage: ConversationMessage = {
        id: '1',
        sender: 'ai',
        content: `Hallo! Willkommen in ${scenario.location}. Ich bin ${scenario.characters[0].name}, ${scenario.characters[0].role.toLowerCase()}. Wie kann ich Ihnen helfen?`,
        timestamp: new Date()
      }
      setMessages([initialMessage])
    }
  }, [scenario])

  const handleSendMessage = async () => {
    if (!userInput.trim() || isTyping) return

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: userInput,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setUserInput('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse()
      const aiMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: aiResponse,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (): string => {
    const responses = [
      "Das ist sehr gut! Können Sie das noch einmal sagen?",
      "Verstehe! Möchten Sie mehr über das lernen?",
      "Ausgezeichnet! Sie machen große Fortschritte.",
      "Das ist interessant. Lassen Sie uns weiter üben.",
      "Gut gemacht! Haben Sie noch Fragen?"
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const getProgressPercentage = () => {
    return (completedObjectives.length / scenario.objectives.length) * 100
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onExit}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Exit
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{scenario.title}</h1>
                <p className="text-gray-600">{scenario.location}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Progress</div>
              <div className="text-2xl font-bold text-blue-600">{Math.round(getProgressPercentage())}%</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Conversation Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 h-96 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  👤
                </div>
                <div>
                  <h3 className="font-semibold">{currentCharacter?.name}</h3>
                  <p className="text-sm text-gray-600">{currentCharacter?.role}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {message.content}
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message in German..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!userInput.trim() || isTyping}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Objectives */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Learning Objectives</h3>
              <div className="space-y-3">
                {scenario.objectives.map((objective) => (
                  <div key={objective.id} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      completedObjectives.includes(objective.id)
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300'
                    }`} />
                    <div>
                      <h4 className="font-medium text-sm">{objective.title}</h4>
                      <p className="text-xs text-gray-600">{objective.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vocabulary Helper */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Helpful Phrases</h3>
              <div className="space-y-2">
                <div className="text-sm">
                  <strong>Greetings:</strong>
                  <div className="text-gray-600">Hallo, Guten Tag, Wie geht es Ihnen?</div>
                </div>
                <div className="text-sm">
                  <strong>Questions:</strong>
                  <div className="text-gray-600">Was kostet das? Wo ist...? Können Sie mir helfen?</div>
                </div>
                <div className="text-sm">
                  <strong>Responses:</strong>
                  <div className="text-gray-600">Ja, Nein, Danke, Bitte, Entschuldigung</div>
                </div>
              </div>
            </div>

            {/* Cultural Notes */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Cultural Tips</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Germans appreciate direct communication</p>
                <p>• Use formal "Sie" with strangers</p>
                <p>• Punctuality is very important</p>
                <p>• Eye contact shows respect</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => {
              // Complete the experience
              onComplete({
                scenarioId: scenario.id,
                completedObjectives,
                messages,
                duration: 15 // This would be calculated based on actual time spent
              })
            }}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Complete Experience
          </button>
          <button
            onClick={onExit}
            className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Save & Exit
          </button>
        </div>
      </div>
    </div>
  )
} 