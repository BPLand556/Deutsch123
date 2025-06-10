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
        'Bayerische Gastfreundschaft ist legendär.',
        'Gemütlichkeit ist uns wichtig.',
        'Hier fühlt sich jeder willkommen.'
      ]
    }
  }

  const getCurrentElements = () => {
    if (isBerlinCoffeeShop) return scenarioElements.coffeeShop
    if (isFrankfurtBusiness) return scenarioElements.business
    if (isHamburgSupermarket) return scenarioElements.supermarket
    if (isCologneChristmas) return scenarioElements.christmasMarket
    if (isBerlinArtGallery) return scenarioElements.artGallery
    if (isMunichBeerGarden) return scenarioElements.beerGarden
    return []
  }

  const getCurrentResponses = () => {
    if (isBerlinCoffeeShop) return characterResponses.anna
    if (isFrankfurtBusiness) return characterResponses.weber
    if (isHamburgSupermarket) return characterResponses.klaus
    if (isCologneChristmas) return characterResponses.maria
    if (isBerlinArtGallery) return characterResponses.lisa
    if (isMunichBeerGarden) return characterResponses.hans
    return characterResponses.anna // fallback
  }

  const coffeeShopElements = getCurrentElements()
  const annaResponses = getCurrentResponses()

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
    const responses = getCurrentResponses()
    
    if (lowerMessage.includes('hallo') || lowerMessage.includes('guten')) {
      return responses.greeting[Math.floor(Math.random() * responses.greeting.length)]
    }
    if (lowerMessage.includes('menu') || lowerMessage.includes('karte') || lowerMessage.includes('was')) {
      return (responses as any).menu ? (responses as any).menu[Math.floor(Math.random() * (responses as any).menu.length)] : responses.greeting[0]
    }
    if (lowerMessage.includes('kaffee') || lowerMessage.includes('bestellen') || lowerMessage.includes('möchte')) {
      return (responses as any).order ? (responses as any).order[Math.floor(Math.random() * (responses as any).order.length)] : responses.greeting[0]
    }
    if (lowerMessage.includes('berlin') || lowerMessage.includes('kultur') || lowerMessage.includes('warum')) {
      return responses.cultural ? responses.cultural[Math.floor(Math.random() * responses.cultural.length)] : responses.greeting[0]
    }
    if (lowerMessage.includes('business') || lowerMessage.includes('geschäft') || lowerMessage.includes('meeting')) {
      return (responses as any).business ? (responses as any).business[Math.floor(Math.random() * (responses as any).business.length)] : responses.greeting[0]
    }
    if (lowerMessage.includes('produkt') || lowerMessage.includes('einkaufen') || lowerMessage.includes('supermarkt')) {
      return (responses as any).products ? (responses as any).products[Math.floor(Math.random() * (responses as any).products.length)] : responses.greeting[0]
    }
    if (lowerMessage.includes('weihnachten') || lowerMessage.includes('markt') || lowerMessage.includes('handwerk')) {
      return (responses as any).crafts ? (responses as any).crafts[Math.floor(Math.random() * (responses as any).crafts.length)] : responses.greeting[0]
    }
    if (lowerMessage.includes('kunst') || lowerMessage.includes('galerie') || lowerMessage.includes('ausstellung')) {
      return (responses as any).art ? (responses as any).art[Math.floor(Math.random() * (responses as any).art.length)] : responses.greeting[0]
    }
    if (lowerMessage.includes('bier') || lowerMessage.includes('garten') || lowerMessage.includes('bayerisch')) {
      return (responses as any).beer ? (responses as any).beer[Math.floor(Math.random() * (responses as any).beer.length)] : responses.greeting[0]
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
            {/* Character Card */}
            {(isBerlinCoffeeShop || isFrankfurtBusiness || isHamburgSupermarket || isCologneChristmas || isBerlinArtGallery || isMunichBeerGarden) && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {isBerlinCoffeeShop ? 'Anna - Barista' :
                   isFrankfurtBusiness ? 'Frau Weber - Manager' :
                   isHamburgSupermarket ? 'Klaus - Verkäufer' :
                   isCologneChristmas ? 'Maria - Händlerin' :
                   isBerlinArtGallery ? 'Lisa - Kuratorin' :
                   isMunichBeerGarden ? 'Hans - Wirt' :
                   'Character'}
                </h3>
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
                  <h4 className="font-medium text-gray-900">
                    {isBerlinCoffeeShop ? 'Anna' :
                     isFrankfurtBusiness ? 'Frau Weber' :
                     isHamburgSupermarket ? 'Klaus' :
                     isCologneChristmas ? 'Maria' :
                     isBerlinArtGallery ? 'Lisa' :
                     isMunichBeerGarden ? 'Hans' :
                     'Character'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {isBerlinCoffeeShop ? 'Barista aus Berlin' :
                     isFrankfurtBusiness ? 'Manager aus Frankfurt' :
                     isHamburgSupermarket ? 'Verkäufer aus Hamburg' :
                     isCologneChristmas ? 'Händlerin aus Köln' :
                     isBerlinArtGallery ? 'Kuratorin aus Berlin' :
                     isMunichBeerGarden ? 'Wirt aus München' :
                     'Character'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {isBerlinCoffeeShop ? 'Kreativ, freundlich, kaffeebegeistert' :
                     isFrankfurtBusiness ? 'Professionell, direkt, effizient' :
                     isHamburgSupermarket ? 'Hilfsbereit, kenntnisreich, freundlich' :
                     isCologneChristmas ? 'Festlich, warm, traditionell' :
                     isBerlinArtGallery ? 'Kreativ, leidenschaftlich, kunstbegeistert' :
                     isMunichBeerGarden ? 'Traditionell, gastfreundlich, bayerisch' :
                     'Character personality'}
                  </p>
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
            {(isBerlinCoffeeShop || isFrankfurtBusiness || isHamburgSupermarket || isCologneChristmas || isBerlinArtGallery || isMunichBeerGarden) && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Entdeckte Elemente</h3>
                <div className="space-y-2">
                  {getCurrentElements().map(element => (
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