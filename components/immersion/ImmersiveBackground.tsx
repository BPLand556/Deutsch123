'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InteractiveElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'clickable' | 'hoverable' | 'animated';
  content: {
    title: string;
    description: string;
    culturalContext?: string;
    vocabulary?: string[];
    audioUrl?: string;
  };
  visualElement: React.ReactNode;
}

interface ImmersiveBackgroundProps {
  scenario: 'coffee-shop' | 'university' | 'business-meeting' | 'supermarket' | 'social-gathering';
  onElementClick?: (element: InteractiveElement) => void;
  onElementHover?: (element: InteractiveElement) => void;
  className?: string;
  showInteractions?: boolean;
}

const SCENARIO_CONFIGS = {
  'coffee-shop': {
    backgroundImage: '/images/coffee-shop-360.jpg',
    ambientAudio: '/audio/coffee-shop-ambient.mp3',
    interactiveElements: [
      {
        id: 'newspaper',
        x: 15,
        y: 70,
        width: 8,
        height: 12,
        type: 'clickable' as const,
        content: {
          title: 'Deutsche Zeitung',
          description: 'A local German newspaper with headlines about current events.',
          culturalContext: 'Germans are avid newspaper readers. Many coffee shops provide newspapers for customers.',
          vocabulary: ['Zeitung', 'Nachrichten', 'Artikel', 'Schlagzeile'],
        },
        visualElement: (
          <div className="w-full h-full bg-gray-800 rounded shadow-lg flex items-center justify-center">
            <span className="text-white text-xs font-medium">📰</span>
          </div>
        ),
      },
      {
        id: 'menu-board',
        x: 75,
        y: 20,
        width: 20,
        height: 15,
        type: 'hoverable' as const,
        content: {
          title: 'Speisekarte',
          description: 'The menu board showing today\'s specials and prices.',
          culturalContext: 'German coffee shops often have daily specials written on chalkboards.',
          vocabulary: ['Speisekarte', 'Tageskarte', 'Kaffee', 'Kuchen'],
        },
        visualElement: (
          <div className="w-full h-full bg-amber-100 border-2 border-amber-300 rounded-lg flex items-center justify-center">
            <span className="text-amber-800 text-xs font-medium">📋</span>
          </div>
        ),
      },
      {
        id: 'espresso-machine',
        x: 60,
        y: 50,
        width: 12,
        height: 18,
        type: 'animated' as const,
        content: {
          title: 'Espressomaschine',
          description: 'Professional espresso machine making coffee.',
          culturalContext: 'Germans take their coffee seriously. Many shops use high-quality Italian machines.',
          vocabulary: ['Espresso', 'Maschine', 'Kaffee', 'Barista'],
        },
        visualElement: (
          <motion.div 
            className="w-full h-full bg-silver-500 rounded-lg flex items-center justify-center"
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="text-gray-700 text-xs font-medium">☕</span>
          </motion.div>
        ),
      },
    ],
  },
  'university': {
    backgroundImage: '/images/university-classroom-360.jpg',
    ambientAudio: '/audio/university-ambient.mp3',
    interactiveElements: [
      {
        id: 'blackboard',
        x: 20,
        y: 15,
        width: 60,
        height: 30,
        type: 'clickable' as const,
        content: {
          title: 'Tafel',
          description: 'The blackboard with German grammar notes.',
          culturalContext: 'German universities still use blackboards extensively for teaching.',
          vocabulary: ['Tafel', 'Kreide', 'Grammatik', 'Unterricht'],
        },
        visualElement: (
          <div className="w-full h-full bg-green-800 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-medium">📝</span>
          </div>
        ),
      },
    ],
  },
  'business-meeting': {
    backgroundImage: '/images/business-meeting-360.jpg',
    ambientAudio: '/audio/business-ambient.mp3',
    interactiveElements: [
      {
        id: 'presentation',
        x: 30,
        y: 20,
        width: 40,
        height: 25,
        type: 'hoverable' as const,
        content: {
          title: 'Präsentation',
          description: 'Business presentation with German charts and data.',
          culturalContext: 'German business presentations are typically formal and data-driven.',
          vocabulary: ['Präsentation', 'Geschäft', 'Daten', 'Bericht'],
        },
        visualElement: (
          <div className="w-full h-full bg-blue-100 border-2 border-blue-300 rounded-lg flex items-center justify-center">
            <span className="text-blue-800 text-xs font-medium">📊</span>
          </div>
        ),
      },
    ],
  },
  'supermarket': {
    backgroundImage: '/images/supermarket-360.jpg',
    ambientAudio: '/audio/supermarket-ambient.mp3',
    interactiveElements: [
      {
        id: 'product-shelf',
        x: 25,
        y: 40,
        width: 50,
        height: 20,
        type: 'clickable' as const,
        content: {
          title: 'Regal',
          description: 'Shelf with German food products and labels.',
          culturalContext: 'German supermarkets have strict labeling requirements and many organic options.',
          vocabulary: ['Regal', 'Produkt', 'Etikett', 'Bio'],
        },
        visualElement: (
          <div className="w-full h-full bg-green-100 border-2 border-green-300 rounded-lg flex items-center justify-center">
            <span className="text-green-800 text-xs font-medium">🛒</span>
          </div>
        ),
      },
    ],
  },
  'social-gathering': {
    backgroundImage: '/images/social-gathering-360.jpg',
    ambientAudio: '/audio/social-gathering-ambient.mp3',
    interactiveElements: [
      {
        id: 'beer-garden',
        x: 40,
        y: 60,
        width: 30,
        height: 25,
        type: 'hoverable' as const,
        content: {
          title: 'Biergarten',
          description: 'Traditional German beer garden with communal tables.',
          culturalContext: 'Beer gardens are central to German social culture, especially in Bavaria.',
          vocabulary: ['Biergarten', 'Bier', 'Gesellschaft', 'Tisch'],
        },
        visualElement: (
          <div className="w-full h-full bg-amber-100 border-2 border-amber-300 rounded-lg flex items-center justify-center">
            <span className="text-amber-800 text-xs font-medium">🍺</span>
          </div>
        ),
      },
    ],
  },
};

export const ImmersiveBackground: React.FC<ImmersiveBackgroundProps> = ({
  scenario,
  onElementClick,
  onElementHover,
  className = '',
  showInteractions = true,
}) => {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [clickedElement, setClickedElement] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const config = SCENARIO_CONFIGS[scenario];
  if (!config) {
    return <div className={className}>Invalid scenario</div>;
  }
  const interactiveElements = config.interactiveElements;

  const handleElementClick = useCallback((element: InteractiveElement) => {
    setClickedElement(element.id);
    onElementClick?.(element);
    
    // Auto-hide after 3 seconds
    setTimeout(() => setClickedElement(null), 3000);
  }, [onElementClick]);

  const handleElementHover = useCallback((element: InteractiveElement) => {
    setHoveredElement(element.id);
    onElementHover?.(element);
  }, [onElementHover]);

  const handleElementLeave = useCallback(() => {
    setHoveredElement(null);
  }, []);

  const toggleAmbientAudio = useCallback(() => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      } else {
        audioRef.current.play();
        setIsAudioPlaying(true);
      }
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    // Initialize audio
    if (config.ambientAudio) {
      audioRef.current = new Audio(config.ambientAudio);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [config.ambientAudio]);

  const getScenarioTitle = (scenario: string) => {
    const titles = {
      'coffee-shop': 'Berlin Coffee Shop',
      'university': 'University Classroom',
      'business-meeting': 'Business Meeting',
      'supermarket': 'German Supermarket',
      'social-gathering': 'Social Gathering',
    };
    return titles[scenario as keyof typeof titles] || scenario;
  };

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-xl ${className}`}>
      {/* 360° Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${config.backgroundImage})`,
        }}
      >
        {/* Fallback gradient if image not available */}
        <div className="absolute inset-0 bg-gradient-to-br from-coffee-200 via-coffee-100 to-amber-100" />
      </div>

      {/* Interactive Elements Overlay */}
      {showInteractions && (
        <div className="absolute inset-0">
          {interactiveElements.map((element) => (
            <div
              key={element.id}
              className="absolute cursor-pointer transition-all duration-300"
              style={{
                left: `${element.x}%`,
                top: `${element.y}%`,
                width: `${element.width}%`,
                height: `${element.height}%`,
              }}
              onClick={() => handleElementClick(element)}
              onMouseEnter={() => handleElementHover(element)}
              onMouseLeave={handleElementLeave}
            >
              <div className="relative w-full h-full">
                {element.visualElement}
                
                {/* Hover Indicator */}
                <AnimatePresence>
                  {hoveredElement === element.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 border-2 border-primary-500 rounded-lg bg-primary-500/20"
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Scenario Title */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
        <h3 className="text-lg font-semibold text-gray-900">
          {getScenarioTitle(scenario)}
        </h3>
      </div>

      {/* Audio Control */}
      {config.ambientAudio && (
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleAmbientAudio}
            className={`p-3 rounded-full transition-all duration-300 ${
              isAudioPlaying 
                ? 'bg-primary-500 text-white shadow-lg' 
                : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
          >
            {isAudioPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
        </div>
      )}

      {/* Element Info Popup */}
      <AnimatePresence>
        {clickedElement && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg"
          >
            {(() => {
              const element = interactiveElements.find(el => el.id === clickedElement);
              if (!element) return null;

              return (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {element.content.title}
                  </h4>
                  <p className="text-gray-700 mb-3">
                    {element.content.description}
                  </p>
                  
                  {element.content.culturalContext && (
                    <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <h5 className="font-medium text-amber-800 mb-1">Cultural Context</h5>
                      <p className="text-sm text-amber-700">{element.content.culturalContext}</p>
                    </div>
                  )}
                  
                  {element.content.vocabulary && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Related Vocabulary</h5>
                      <div className="flex flex-wrap gap-2">
                        {element.content.vocabulary.map((word, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interaction Instructions */}
      {showInteractions && (
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-2 rounded-lg text-sm">
          Click elements to learn more
        </div>
      )}
    </div>
  );
}; 