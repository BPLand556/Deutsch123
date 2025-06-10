'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ImmersionScenario, Character, ConversationMessage } from '@/types'
import Image from 'next/image'

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
  const [showIntro, setShowIntro] = useState(scenario.title.includes('Coffee Shop'))
  const [interactiveElements, setInteractiveElements] = useState<string[]>([])
  const [annaEmotion, setAnnaEmotion] = useState<'happy' | 'surprised' | 'confused' | 'thoughtful' | 'excited' | 'neutral' | 'concerned'>('neutral')

  // Scenario-specific background and audio
  const isBerlinCoffeeShop = scenario.title.toLowerCase().includes('coffee shop')
  
  // Coffee shop interactive elements
  const coffeeShopElements = [
    { id: 'menu', name: 'Speisekarte', translation: 'Menu', vocabulary: ['Kaffee', 'Tee', 'Kuchen', 'Croissant'] },
    { id: 'coffee-machine', name: 'Kaffeemaschine', translation: 'Coffee Machine', vocabulary: ['Espresso', 'Cappuccino', 'Latte', 'Filterkaffee'] },
    { id: 'seating', name: 'Sitzbereich', translation: 'Seating Area', vocabulary: ['Tisch', 'Stuhl', 'Platz', 'Terrasse'] },
    { id: 'counter', name: 'Theke', translation: 'Counter', vocabulary: ['Bestellung', 'Zahlen', 'Rechnung', 'Trinkgeld'] }
  ]

  // Anna's coffee shop responses
  const annaResponses = {
    greeting: [
      'Hallo! Willkommen in unserem Café! Wie kann ich Ihnen helfen?',
      'Guten Tag! Schön, dass Sie da sind. Was darf es sein?',
      'Hallo! Heute haben wir eine tolle Auswahl an Kaffeesorten.'
    ],
    menu: [
      'Hier ist unsere Speisekarte. Wir haben verschiedene Kaffeesorten und leckere Kuchen.',
      'Möchten Sie einen Blick auf unsere Angebote werfen?',
      'Unser Kaffee kommt aus lokalen Röstereien in Berlin.'
    ],
    order: [
      'Ausgezeichnete Wahl! Das ist einer unserer beliebtesten Kaffees.',
      'Gut! Soll ich Ihnen das zubereiten?',
      'Perfekt! Möchten Sie das hier trinken oder zum Mitnehmen?'
    ],
    cultural: [
      'In Berlin lieben wir guten Kaffee! Viele Cafés haben eine kreative Atmosphäre.',
      'Wussten Sie, dass Berlin eine der besten Kaffeeszenen in Europa hat?',
      'Hier treffen sich oft Künstler und Studenten zum Arbeiten.'
    ]
  }

  const handleElementClick = (element: any) => {
    if (!interactiveElements.includes(element.id)) {
      setInteractiveElements(prev => [...prev, element.id])
      
      // Add vocabulary learning message
      const vocabMessage: ConversationMessage = {
        id: Date.now().toString(),
        sender: 'ai',
        content: `Ah, Sie schauen sich die ${element.name} an! Hier sind einige nützliche Wörter: ${element.vocabulary.join(', ')}`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, vocabMessage])
      
      // Change Anna's emotion
      setAnnaEmotion('excited')
      setTimeout(() => setAnnaEmotion('neutral'), 2000)
    }
  }

  const generateAnnaResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('hallo') || lowerMessage.includes('guten')) {
      return annaResponses.greeting[Math.floor(Math.random() * annaResponses.greeting.length)]
    }
    if (lowerMessage.includes('menu') || lowerMessage.includes('karte') || lowerMessage.includes('was')) {
      return annaResponses.menu[Math.floor(Math.random() * annaResponses.menu.length)]
    }
    if (lowerMessage.includes('kaffee') || lowerMessage.includes('bestellen') || lowerMessage.includes('möchte')) {
      return annaResponses.order[Math.floor(Math.random() * annaResponses.order.length)]
    }
    if (lowerMessage.includes('berlin') || lowerMessage.includes('kultur') || lowerMessage.includes('warum')) {
      return annaResponses.cultural[Math.floor(Math.random() * annaResponses.cultural.length)]
    }
    
    return 'Das ist interessant! Können Sie das noch einmal sagen?'
  }

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

    // Generate Anna's response
    setTimeout(() => {
      const aiResponse = generateAnnaResponse(userInput)
      const aiMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: aiResponse,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
      
      // Change Anna's emotion based on response
      setAnnaEmotion('happy')
      setTimeout(() => setAnnaEmotion('neutral'), 1500)
    }, 1500)
  }

  const getProgressPercentage = () => {
    return (completedObjectives.length / scenario.objectives.length) * 100
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      {/* Berlin Coffee Shop immersive background */}
      {isBerlinCoffeeShop && (
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/berlin-coffee-shop.jpg"
            alt="Berlin Coffee Shop Background"
            fill
            style={{ objectFit: 'cover', opacity: 0.25 }}
            priority
          />
          {/* Ambient audio placeholder */}
          {/* <audio src="/audio/berlin-coffee-shop-ambience.mp3" autoPlay loop /> */}
        </div>
      )}
      
      {/* Interactive Coffee Shop Elements */}
      {isBerlinCoffeeShop && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="relative w-full h-full">
            {/* Menu - Top Right */}
            <button
              onClick={() => handleElementClick(coffeeShopElements[0])}
              className="absolute top-20 right-20 w-24 h-32 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border-2 border-amber-300 hover:border-amber-500 transition-all duration-300 pointer-events-auto"
            >
              <div className="p-2 text-center">
                <div className="text-2xl mb-1">📋</div>
                <div className="text-xs font-medium text-gray-800">Speisekarte</div>
              </div>
            </button>
            
            {/* Coffee Machine - Center Right */}
            <button
              onClick={() => handleElementClick(coffeeShopElements[1])}
              className="absolute top-1/2 right-32 w-20 h-16 bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg border-2 border-gray-600 hover:border-gray-400 transition-all duration-300 pointer-events-auto"
            >
              <div className="p-2 text-center">
                <div className="text-xl mb-1">☕</div>
                <div className="text-xs font-medium text-white">Kaffeemaschine</div>
              </div>
            </button>
            
            {/* Seating Area - Bottom Left */}
            <button
              onClick={() => handleElementClick(coffeeShopElements[2])}
              className="absolute bottom-32 left-20 w-32 h-20 bg-amber-100/80 backdrop-blur-sm rounded-lg shadow-lg border-2 border-amber-400 hover:border-amber-600 transition-all duration-300 pointer-events-auto"
            >
              <div className="p-2 text-center">
                <div className="text-2xl mb-1">🪑</div>
                <div className="text-xs font-medium text-gray-800">Sitzbereich</div>
              </div>
            </button>
            
            {/* Counter - Bottom Center */}
            <button
              onClick={() => handleElementClick(coffeeShopElements[3])}
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-28 h-12 bg-brown-100/80 backdrop-blur-sm rounded-lg shadow-lg border-2 border-brown-400 hover:border-brown-600 transition-all duration-300 pointer-events-auto"
            >
              <div className="p-2 text-center">
                <div className="text-xl mb-1">💼</div>
                <div className="text-xs font-medium text-gray-800">Theke</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Scenario Intro Overlay */}
      <AnimatePresence>
        {showIntro && isBerlinCoffeeShop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-60"
          >
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full text-center">
              <h2 className="text-3xl font-bold mb-4">Willkommen im Berliner Café!</h2>
              <p className="mb-4 text-gray-700">Tauche ein in die Atmosphäre eines echten Berliner Cafés. Übe Bestellen, Smalltalk und entdecke deutsche Kaffeekultur.</p>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Lernziele</h3>
                <ul className="text-left space-y-1">
                  {scenario.objectives.map(obj => (
                    <li key={obj.id} className="text-sm text-gray-800 flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>{obj.title}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Kulturelle Tipps</h3>
                <ul className="text-left space-y-1">
                  {scenario.culturalNotes && scenario.culturalNotes.length > 0 ? scenario.culturalNotes.slice(0,3).map(note => (
                    <li key={note.id} className="text-xs text-gray-600 flex items-center"><span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>{note.title || note.description}</li>
                  )) : <li className="text-xs text-gray-500">Keine Tipps verfügbar</li>}
                </ul>
              </div>
              <button
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setShowIntro(false)}
              >
                Start Experience
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8 relative z-20">
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
            {/* Anna the Barista */}
            {isBerlinCoffeeShop && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Anna - Barista</h3>
                <div className="text-center">
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl mb-3 ${
                    annaEmotion === 'happy' ? 'bg-yellow-100' :
                    annaEmotion === 'excited' ? 'bg-orange-100' :
                    annaEmotion === 'surprised' ? 'bg-blue-100' :
                    'bg-gray-100'
                  }`}>
                    {annaEmotion === 'happy' ? '😊' :
                     annaEmotion === 'excited' ? '🤩' :
                     annaEmotion === 'surprised' ? '😲' :
                     '😐'}
                  </div>
                  <h4 className="font-medium text-gray-900">Anna</h4>
                  <p className="text-sm text-gray-600">Barista aus Berlin</p>
                  <p className="text-xs text-gray-500 mt-2">Kreativ, freundlich, kaffeebegeistert</p>
                </div>
              </div>
            )}

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

            {/* Interactive Elements Progress */}
            {isBerlinCoffeeShop && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Entdeckte Elemente</h3>
                <div className="space-y-2">
                  {coffeeShopElements.map(element => (
                    <div key={element.id} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        interactiveElements.includes(element.id) ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      <span className="text-sm text-gray-700">{element.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                interactiveElements,
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