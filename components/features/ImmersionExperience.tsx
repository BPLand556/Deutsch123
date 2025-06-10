'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ImmersionScenario, Character, ConversationMessage } from '@/types'
import Image from 'next/image'
import { VoiceConversation } from '@/components/voice/VoiceConversation'
import { CharacterVoice, CHARACTER_VOICES } from '@/components/voice/CharacterVoice'
import { PronunciationAssessment } from '@/components/voice/PronunciationAssessment'
import { VoiceModeSelector } from '@/components/voice/VoiceModeSelector'

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
  
  // Voice conversation state
  const [conversationMode, setConversationMode] = useState<'voice' | 'text'>('voice')
  const [characterResponse, setCharacterResponse] = useState<string>('')
  const [voiceEnabled, setVoiceEnabled] = useState(true)

  // Scenario-specific background and audio
  const isBerlinCoffeeShop = scenario.title.toLowerCase().includes('coffee shop')
  const isFrankfurtBusiness = scenario.title.toLowerCase().includes('business')
  const isHamburgSupermarket = scenario.title.toLowerCase().includes('supermarket')
  const isCologneChristmas = scenario.title.toLowerCase().includes('christmas')
  const isBerlinArtGallery = scenario.title.toLowerCase().includes('art')
  const isMunichBeerGarden = scenario.title.toLowerCase().includes('beer')
  
  // Interactive elements for different scenarios
  const scenarioElements = {
    coffeeShop: [
      { id: 'menu', name: 'Speisekarte', translation: 'Menu', vocabulary: ['Kaffee', 'Tee', 'Kuchen', 'Croissant'] },
      { id: 'coffee-machine', name: 'Kaffeemaschine', translation: 'Coffee Machine', vocabulary: ['Espresso', 'Cappuccino', 'Latte', 'Filterkaffee'] },
      { id: 'seating', name: 'Sitzbereich', translation: 'Seating Area', vocabulary: ['Tisch', 'Stuhl', 'Platz', 'Terrasse'] },
      { id: 'counter', name: 'Theke', translation: 'Counter', vocabulary: ['Bestellung', 'Zahlen', 'Rechnung', 'Trinkgeld'] }
    ],
    business: [
      { id: 'conference-table', name: 'Konferenztisch', translation: 'Conference Table', vocabulary: ['Meeting', 'Präsentation', 'Projekt', 'Strategie'] },
      { id: 'whiteboard', name: 'Whiteboard', translation: 'Whiteboard', vocabulary: ['Planung', 'Ziele', 'Timeline', 'Budget'] },
      { id: 'coffee-station', name: 'Kaffeestation', translation: 'Coffee Station', vocabulary: ['Pause', 'Networking', 'Gespräch', 'Kontakte'] },
      { id: 'documents', name: 'Unterlagen', translation: 'Documents', vocabulary: ['Vertrag', 'Bericht', 'Analyse', 'Daten'] }
    ],
    supermarket: [
      { id: 'produce-section', name: 'Obst- und Gemüseabteilung', translation: 'Produce Section', vocabulary: ['Obst', 'Gemüse', 'Bio', 'Regional'] },
      { id: 'bakery', name: 'Bäckerei', translation: 'Bakery', vocabulary: ['Brot', 'Brötchen', 'Kuchen', 'Gebäck'] },
      { id: 'dairy', name: 'Milchprodukte', translation: 'Dairy', vocabulary: ['Milch', 'Käse', 'Joghurt', 'Butter'] },
      { id: 'checkout', name: 'Kasse', translation: 'Checkout', vocabulary: ['Zahlen', 'Karte', 'Bargeld', 'Quittung'] }
    ],
    christmasMarket: [
      { id: 'craft-stall', name: 'Handwerksstand', translation: 'Craft Stall', vocabulary: ['Handwerk', 'Geschenk', 'Dekoration', 'Tradition'] },
      { id: 'food-stall', name: 'Essensstand', translation: 'Food Stall', vocabulary: ['Glühwein', 'Bratwurst', 'Lebkuchen', 'Stollen'] },
      { id: 'christmas-tree', name: 'Weihnachtsbaum', translation: 'Christmas Tree', vocabulary: ['Tanne', 'Lichter', 'Schmuck', 'Weihnachten'] },
      { id: 'stage', name: 'Bühne', translation: 'Stage', vocabulary: ['Musik', 'Konzert', 'Aufführung', 'Feier'] }
    ],
    artGallery: [
      { id: 'exhibition', name: 'Ausstellung', translation: 'Exhibition', vocabulary: ['Kunst', 'Gemälde', 'Skulptur', 'Installation'] },
      { id: 'artist-corner', name: 'Künstlerecke', translation: 'Artist Corner', vocabulary: ['Künstler', 'Inspiration', 'Kreativität', 'Stil'] },
      { id: 'catalog', name: 'Katalog', translation: 'Catalog', vocabulary: ['Information', 'Beschreibung', 'Preis', 'Kontakt'] },
      { id: 'cafe', name: 'Café', translation: 'Café', vocabulary: ['Pause', 'Gespräch', 'Reflexion', 'Atmosphäre'] }
    ],
    beerGarden: [
      { id: 'beer-tent', name: 'Bierzelt', translation: 'Beer Tent', vocabulary: ['Bier', 'Fest', 'Tradition', 'Gesellschaft'] },
      { id: 'food-court', name: 'Essensbereich', translation: 'Food Court', vocabulary: ['Bratwurst', 'Brezel', 'Schweinshaxe', 'Kartoffelsalat'] },
      { id: 'music-stage', name: 'Musikbühne', translation: 'Music Stage', vocabulary: ['Musik', 'Tanz', 'Unterhaltung', 'Stimmung'] },
      { id: 'seating-area', name: 'Sitzbereich', translation: 'Seating Area', vocabulary: ['Tisch', 'Bänke', 'Gemeinschaft', 'Freunde'] }
    ]
  }

  // Character responses for different scenarios
  const characterResponses = {
    anna: {
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
    },
    weber: {
      greeting: [
        'Guten Tag! Willkommen zu unserem Meeting. Ich bin Frau Weber.',
        'Hallo! Schön, dass Sie da sind. Lassen Sie uns beginnen.',
        'Guten Morgen! Bereit für eine produktive Diskussion?'
      ],
      business: [
        'Lassen Sie uns die wichtigsten Punkte durchgehen.',
        'Was denken Sie über diese Strategie?',
        'Wir sollten die nächsten Schritte planen.'
      ],
      formal: [
        'Das ist ein sehr guter Vorschlag.',
        'Können Sie das genauer erklären?',
        'Ich stimme Ihrem Ansatz zu.'
      ],
      cultural: [
        'In Deutschland schätzen wir direkte Kommunikation.',
        'Pünktlichkeit ist in der Geschäftswelt sehr wichtig.',
        'Wir bevorzugen strukturierte Meetings.'
      ]
    },
    klaus: {
      greeting: [
        'Hallo! Kann ich Ihnen helfen, etwas zu finden?',
        'Guten Tag! Willkommen in unserem Supermarkt.',
        'Hallo! Brauchen Sie Hilfe bei der Produktauswahl?'
      ],
      products: [
        'Hier finden Sie alle frischen Produkte.',
        'Diese Produkte kommen aus der Region.',
        'Möchten Sie etwas Bestimmtes suchen?'
      ],
      quality: [
        'Unsere Produkte sind von höchster Qualität.',
        'Wir achten sehr auf frische Zutaten.',
        'Alle Produkte sind sorgfältig ausgewählt.'
      ],
      cultural: [
        'Deutsche Verbraucher legen Wert auf Qualität.',
        'Viele bevorzugen regionale Produkte.',
        'Die Kennzeichnung ist sehr wichtig.'
      ]
    },
    maria: {
      greeting: [
        'Frohe Weihnachten! Willkommen auf unserem Markt!',
        'Hallo! Schön, dass Sie da sind. Möchten Sie etwas Schönes?',
        'Guten Tag! Entdecken Sie unsere traditionellen Handarbeiten.'
      ],
      crafts: [
        'Diese Stücke sind handgefertigt.',
        'Jedes Stück ist einzigartig.',
        'Traditionelle Handwerkskunst ist sehr wertvoll.'
      ],
      traditions: [
        'Weihnachtsmärkte sind eine alte deutsche Tradition.',
        'Hier finden Sie echte Handwerkskunst.',
        'Die Atmosphäre ist magisch, nicht wahr?'
      ],
      cultural: [
        'Weihnachtsmärkte bringen Menschen zusammen.',
        'Tradition ist uns sehr wichtig.',
        'Jeder Markt hat seinen eigenen Charme.'
      ]
    },
    lisa: {
      greeting: [
        'Hallo! Willkommen in unserer Galerie. Ich bin Lisa.',
        'Guten Tag! Schön, dass Sie sich für Kunst interessieren.',
        'Hallo! Möchten Sie die Ausstellung erkunden?'
      ],
      art: [
        'Dieser Künstler arbeitet mit modernen Techniken.',
        'Das Stück erzählt eine interessante Geschichte.',
        'Was denken Sie über diese Arbeit?'
      ],
      creativity: [
        'Kunst ist eine Form der Kommunikation.',
        'Jeder interpretiert Kunst anders.',
        'Kreativität kennt keine Grenzen.'
      ],
      cultural: [
        'Berlin ist ein Zentrum für zeitgenössische Kunst.',
        'Künstler aus der ganzen Welt kommen hierher.',
        'Die Kunstszene ist sehr lebendig.'
      ]
    },
    hans: {
      greeting: [
        'Servus! Willkommen in unserem Biergarten!',
        'Hallo! Schön, dass Sie da sind. Prost!',
        'Guten Tag! Genießen Sie die bayerische Atmosphäre.'
      ],
      beer: [
        'Unser Bier ist nach traditioneller Rezeptur gebraut.',
        'Möchten Sie eine Maß Bier probieren?',
        'Das ist ein typisch bayerisches Bier.'
      ],
      traditions: [
        'Biergärten sind ein wichtiger Teil der bayerischen Kultur.',
        'Hier treffen sich Familien und Freunde.',
        'Die Tradition geht auf das 19. Jahrhundert zurück.'
      ],
      cultural: [
        'Bayerische Gastfreundschaft ist weltberühmt.',
        'Bier ist Teil unserer Kultur und Tradition.',
        'Hier können Sie die echte bayerische Lebensart erleben.'
      ]
    }
  }

  // Get current character voice configuration
  const getCurrentCharacterVoice = () => {
    if (isBerlinCoffeeShop) return CHARACTER_VOICES.anna_barista
    if (isFrankfurtBusiness) return CHARACTER_VOICES.thomas_business
    if (isHamburgSupermarket) return CHARACTER_VOICES.lisa_supermarket
    if (isCologneChristmas) return CHARACTER_VOICES.klaus_christmas
    if (isBerlinArtGallery) return CHARACTER_VOICES.sophia_art
    if (isMunichBeerGarden) return CHARACTER_VOICES.hans_beer
    return CHARACTER_VOICES.anna_barista // Default
  }

  const getCurrentElements = () => {
    if (isBerlinCoffeeShop) return scenarioElements.coffeeShop
    if (isFrankfurtBusiness) return scenarioElements.business
    if (isHamburgSupermarket) return scenarioElements.supermarket
    if (isCologneChristmas) return scenarioElements.christmasMarket
    if (isBerlinArtGallery) return scenarioElements.artGallery
    if (isMunichBeerGarden) return scenarioElements.beerGarden
    return scenarioElements.coffeeShop
  }

  const getCurrentResponses = () => {
    if (isBerlinCoffeeShop) return characterResponses.anna
    if (isFrankfurtBusiness) return characterResponses.weber
    if (isHamburgSupermarket) return characterResponses.klaus
    if (isCologneChristmas) return characterResponses.maria
    if (isBerlinArtGallery) return characterResponses.lisa
    if (isMunichBeerGarden) return characterResponses.hans
    return characterResponses.anna
  }

  const handleElementClick = (element: any) => {
    setInteractiveElements(prev => [...prev, element.id])
    
    // Add vocabulary learning message
    const vocabularyMessage: ConversationMessage = {
      id: Date.now().toString(),
      sender: 'ai',
      content: `You discovered: ${element.name} (${element.translation})`,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, vocabularyMessage])
    
    // Generate character response about the element
    const responses = getCurrentResponses()
    const response = responses.greeting?.[0] || 'Das ist interessant!'
    setCharacterResponse(response)
  }

  const generateAnnaResponse = (userMessage: string): string => {
    const responses = getCurrentResponses()
    const message = userMessage.toLowerCase()
    
    // Check for specific keywords and generate appropriate responses
    if (message.includes('hallo') || message.includes('guten')) {
      return responses.greeting?.[Math.floor(Math.random() * responses.greeting.length)] || 'Hallo!'
    }
    
    if (message.includes('kaffee') || message.includes('menu') || message.includes('speisekarte')) {
      // Handle different response types based on scenario
      if ('menu' in responses) {
        return (responses as any).menu?.[Math.floor(Math.random() * (responses as any).menu.length)] || 'Hier ist unsere Speisekarte.'
      }
      return responses.greeting?.[0] || 'Hier ist unsere Speisekarte.'
    }
    
    if (message.includes('bestellen') || message.includes('order') || message.includes('nehmen')) {
      // Handle different response types based on scenario
      if ('order' in responses) {
        return (responses as any).order?.[Math.floor(Math.random() * (responses as any).order.length)] || 'Was möchten Sie bestellen?'
      }
      return responses.greeting?.[0] || 'Was möchten Sie bestellen?'
    }
    
    if (message.includes('berlin') || message.includes('kultur') || message.includes('tradition')) {
      return responses.cultural?.[Math.floor(Math.random() * responses.cultural.length)] || 'Das ist sehr interessant!'
    }
    
    // Default response
    return responses.greeting?.[0] || 'Das ist interessant! Erzählen Sie mir mehr.'
  }

  // Handle voice input from VoiceConversation component
  const handleVoiceInput = async (transcript: string, confidence: number) => {
    // Add user message to conversation
    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: transcript,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    
    // Generate character response
    const response = generateAnnaResponse(transcript)
    setCharacterResponse(response)
    
    // Log confidence for debugging
    console.log(`Voice input confidence: ${Math.round(confidence * 100)}%`)
  }

  const handleSendMessage = async () => {
    if (!userInput.trim()) return

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: userInput,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setUserInput('')
    setIsTyping(true)

    // Generate character response
    const response = generateAnnaResponse(userInput)
    setCharacterResponse(response)

    setTimeout(() => {
      setIsTyping(false)
    }, 1000)
  }

  const getProgressPercentage = () => {
    const totalObjectives = scenario.objectives.length
    const completed = completedObjectives.length
    return totalObjectives > 0 ? (completed / totalObjectives) * 100 : 0
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
      {/* Scenario-specific backgrounds */}
      {isBerlinCoffeeShop && (
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/berlin-coffee-shop.jpg"
            alt="Berlin Coffee Shop Background"
            fill
            style={{ objectFit: 'cover', opacity: 0.25 }}
            priority
          />
        </div>
      )}
      {isFrankfurtBusiness && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-100 to-blue-100 opacity-50"></div>
      )}
      {isHamburgSupermarket && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-green-100 to-yellow-100 opacity-50"></div>
      )}
      {isCologneChristmas && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-red-100 to-green-100 opacity-50"></div>
      )}
      {isBerlinArtGallery && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-100 to-pink-100 opacity-50"></div>
      )}
      {isMunichBeerGarden && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-amber-100 to-green-100 opacity-50"></div>
      )}
      
      {/* Interactive Elements for all scenarios */}
      {(isBerlinCoffeeShop || isFrankfurtBusiness || isHamburgSupermarket || isCologneChristmas || isBerlinArtGallery || isMunichBeerGarden) && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="relative w-full h-full">
            {getCurrentElements().map((element, index) => (
              <button
                key={element.id}
                onClick={() => handleElementClick(element)}
                className={`absolute w-24 h-32 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border-2 border-amber-300 hover:border-amber-500 transition-all duration-300 pointer-events-auto ${
                  index === 0 ? 'top-20 right-20' :
                  index === 1 ? 'top-1/2 right-32' :
                  index === 2 ? 'bottom-32 left-20' :
                  'bottom-20 left-1/2 transform -translate-x-1/2'
                }`}
              >
                <div className="p-2 text-center">
                  <div className="text-2xl mb-1">
                    {element.id.includes('menu') ? '📋' :
                     element.id.includes('coffee') ? '☕' :
                     element.id.includes('seating') ? '🪑' :
                     element.id.includes('counter') ? '💼' :
                     element.id.includes('conference') ? '🏢' :
                     element.id.includes('whiteboard') ? '📊' :
                     element.id.includes('produce') ? '🥬' :
                     element.id.includes('bakery') ? '🥖' :
                     element.id.includes('dairy') ? '🥛' :
                     element.id.includes('checkout') ? '💳' :
                     element.id.includes('craft') ? '🎨' :
                     element.id.includes('food') ? '🍖' :
                     element.id.includes('tree') ? '🎄' :
                     element.id.includes('stage') ? '🎭' :
                     element.id.includes('exhibition') ? '🖼️' :
                     element.id.includes('artist') ? '👨‍🎨' :
                     element.id.includes('catalog') ? '📖' :
                     element.id.includes('cafe') ? '☕' :
                     element.id.includes('beer') ? '🍺' :
                     element.id.includes('food-court') ? '🍽️' :
                     element.id.includes('music') ? '🎵' :
                     '📍'}
                  </div>
                  <div className="text-xs font-medium text-gray-800">{element.name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scenario Intro Overlay */}
      <AnimatePresence>
        {showIntro && (isBerlinCoffeeShop || isFrankfurtBusiness || isHamburgSupermarket || isCologneChristmas || isBerlinArtGallery || isMunichBeerGarden) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-60"
          >
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full text-center">
              <h2 className="text-3xl font-bold mb-4">
                {isBerlinCoffeeShop ? 'Willkommen im Berliner Café!' :
                 isFrankfurtBusiness ? 'Willkommen zum Geschäftstreffen!' :
                 isHamburgSupermarket ? 'Willkommen im Supermarkt!' :
                 isCologneChristmas ? 'Frohe Weihnachten!' :
                 isBerlinArtGallery ? 'Willkommen in der Kunstgalerie!' :
                 isMunichBeerGarden ? 'Servus im Biergarten!' :
                 'Willkommen!'}
              </h2>
              <p className="mb-4 text-gray-700">{scenario.description}</p>
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

        <div className="flex flex-col xl:flex-row gap-6 min-h-screen">
          {/* Main Conversation Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col flex-1 min-h-0">
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
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 min-h-0">
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
              {/* Voice Conversation Interface */}
              <div className="space-y-4">
                <VoiceConversation
                  onUserInput={handleVoiceInput}
                  characterResponse={characterResponse}
                  characterName={currentCharacter?.name || 'Character'}
                  placeholder="Click to speak in German..."
                  language="de-DE"
                  autoStop={true}
                  timeoutMs={5000}
                  disabled={isTyping || !voiceEnabled}
                  showWaveform={conversationMode === 'voice'}
                  showConfidence={conversationMode === 'voice'}
                  showTranscript={true}
                  onError={(error) => console.error('Voice error:', error)}
                />
                {conversationMode === 'text' && (
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
                )}
                {messages.length > 0 && messages[messages.length - 1]?.sender === 'user' && (
                  <PronunciationAssessment
                    userInput={messages[messages.length - 1]?.content || ''}
                    showDetailed={false}
                    className="mt-4"
                  />
                )}
              </div>
            </div>
          </div>
          {/* Sidebar */}
          <aside className="w-full xl:w-[370px] flex-shrink-0 flex flex-col gap-6 min-w-0 xl:max-h-[calc(100vh-4rem)] xl:overflow-y-auto">
            <div className="bg-white rounded-lg shadow-lg p-4 sticky top-0 z-10">
              <VoiceModeSelector
                currentMode={conversationMode}
                onModeChange={setConversationMode}
                className="mb-0"
              />
            </div>
            {/* Character Voice Card */}
            {(isBerlinCoffeeShop || isFrankfurtBusiness || isHamburgSupermarket || isCologneChristmas || isBerlinArtGallery || isMunichBeerGarden) && (
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Character Voice</h3>
                <CharacterVoice
                  character={getCurrentCharacterVoice()}
                  text={characterResponse || 'Hallo! Wie kann ich Ihnen helfen?'}
                  autoPlay={false}
                  className="mb-0"
                />
              </div>
            )}
            {/* Character Card */}
            {(isBerlinCoffeeShop || isFrankfurtBusiness || isHamburgSupermarket || isCologneChristmas || isBerlinArtGallery || isMunichBeerGarden) && (
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold mb-3">
                  {isBerlinCoffeeShop ? 'Anna - Barista' :
                   isFrankfurtBusiness ? 'Frau Weber - Manager' :
                   isHamburgSupermarket ? 'Klaus - Verkäufer' :
                   isCologneChristmas ? 'Maria - Händlerin' :
                   isBerlinArtGallery ? 'Lisa - Kuratorin' :
                   isMunichBeerGarden ? 'Hans - Wirt' :
                   'Character'}
                </h3>
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl mb-2 ${
                    'bg-gray-100'
                  }`}>
                    {''}
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm">
                    {isBerlinCoffeeShop ? 'Anna' :
                     isFrankfurtBusiness ? 'Frau Weber' :
                     isHamburgSupermarket ? 'Klaus' :
                     isCologneChristmas ? 'Maria' :
                     isBerlinArtGallery ? 'Lisa' :
                     isMunichBeerGarden ? 'Hans' :
                     'Character'}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {isBerlinCoffeeShop ? 'Barista aus Berlin' :
                     isFrankfurtBusiness ? 'Manager aus Frankfurt' :
                     isHamburgSupermarket ? 'Verkäufer aus Hamburg' :
                     isCologneChristmas ? 'Händlerin aus Köln' :
                     isBerlinArtGallery ? 'Kuratorin aus Berlin' :
                     isMunichBeerGarden ? 'Wirt aus München' :
                     'Character'}
                  </p>
                </div>
              </div>
            )}
            {/* Voice Settings */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Voice Settings</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Voice Mode</span>
                  <button
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      voiceEnabled 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {voiceEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Pronunciation Feedback</span>
                  <span className="text-xs text-blue-600">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Character Voice</span>
                  <span className="text-xs text-blue-600">Berlin Dialect</span>
                </div>
              </div>
            </div>
            {/* Objectives */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Learning Objectives</h3>
              <div className="space-y-2">
                {scenario.objectives.map((objective) => (
                  <div key={objective.id} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${
                      completedObjectives.includes(objective.id)
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300'
                    }`} />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-xs">{objective.title}</h4>
                      <p className="text-xs text-gray-600">{objective.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Interactive Elements Progress */}
            {(isBerlinCoffeeShop || isFrankfurtBusiness || isHamburgSupermarket || isCologneChristmas || isBerlinArtGallery || isMunichBeerGarden) && (
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Entdeckte Elemente</h3>
                <div className="space-y-1">
                  {getCurrentElements().map(element => (
                    <div key={element.id} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        interactiveElements.includes(element.id) ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      <span className="text-xs text-gray-700">{element.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Vocabulary Helper */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Helpful Phrases</h3>
              <div className="space-y-2">
                <div className="text-xs">
                  <strong>Greetings:</strong>
                  <div className="text-gray-600">Hallo, Guten Tag, Wie geht es Ihnen?</div>
                </div>
                <div className="text-xs">
                  <strong>Questions:</strong>
                  <div className="text-gray-600">Was kostet das? Wo ist...? Können Sie mir helfen?</div>
                </div>
                <div className="text-xs">
                  <strong>Responses:</strong>
                  <div className="text-gray-600">Ja, Nein, Danke, Bitte, Entschuldigung</div>
                </div>
              </div>
            </div>
            {/* Cultural Notes */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Cultural Tips</h3>
              <div className="space-y-1 text-xs text-gray-600">
                <p>• Germans appreciate direct communication</p>
                <p>• Use formal "Sie" with strangers</p>
                <p>• Punctuality is very important</p>
                <p>• Eye contact shows respect</p>
              </div>
            </div>
          </aside>
        </div>
        {/* Sticky Action Buttons */}
        <div className="sticky bottom-0 left-0 w-full bg-white border-t z-30 flex justify-center gap-4 py-4 mt-8">
          <button
            onClick={() => {
              onComplete({
                scenarioId: scenario.id,
                completedObjectives,
                messages,
                interactiveElements,
                duration: 15
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