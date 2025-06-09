import { useState, useCallback, useRef } from 'react';

interface TranslationData {
  german: string;
  english: string;
  culturalContext?: string;
  usageNotes?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  formality?: 'formal' | 'informal' | 'neutral';
  region?: string;
}

interface TranslationState {
  isRevealed: boolean;
  translationData: TranslationData | null;
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  translationSupport: 'full' | 'partial' | 'minimal';
  showCulturalContext: boolean;
}

interface UseTranslationRevealOptions {
  initialUserLevel?: 'beginner' | 'intermediate' | 'advanced';
  initialTranslationSupport?: 'full' | 'partial' | 'minimal';
  onTranslationReveal?: (data: TranslationData) => void;
  onUserLevelChange?: (level: 'beginner' | 'intermediate' | 'advanced') => void;
}

// Sample translation database - in production, this would come from an API
const TRANSLATION_DATABASE: Record<string, TranslationData> = {
  'Guten Morgen': {
    german: 'Guten Morgen',
    english: 'Good morning',
    culturalContext: 'Used until around 11 AM. In formal settings, this is the standard greeting.',
    usageNotes: 'More formal than "Hallo" but less formal than "Guten Tag".',
    difficulty: 'beginner',
    formality: 'formal',
    region: 'Germany',
  },
  'Wie geht es Ihnen': {
    german: 'Wie geht es Ihnen',
    english: 'How are you (formal)',
    culturalContext: 'The formal "you" (Sie) is used with strangers, elders, and in professional settings.',
    usageNotes: 'Use "Ihnen" for formal situations, "dir" for informal.',
    difficulty: 'beginner',
    formality: 'formal',
    region: 'Germany',
  },
  'Entschuldigung': {
    german: 'Entschuldigung',
    english: 'Excuse me / I\'m sorry',
    culturalContext: 'Germans are generally more direct than English speakers. This is used for both "excuse me" and "sorry".',
    usageNotes: 'Can be used to get attention or to apologize.',
    difficulty: 'beginner',
    formality: 'neutral',
    region: 'Germany',
  },
  'Bitte schön': {
    german: 'Bitte schön',
    english: 'You\'re welcome / Here you are',
    culturalContext: 'A polite response when giving something to someone or responding to "danke".',
    usageNotes: 'Often used when serving food or drinks.',
    difficulty: 'beginner',
    formality: 'neutral',
    region: 'Germany',
  },
  'Das ist mir egal': {
    german: 'Das ist mir egal',
    english: 'I don\'t care / It doesn\'t matter to me',
    culturalContext: 'Germans are known for being direct. This phrase is more acceptable in German than its English equivalent.',
    usageNotes: 'Can be considered rude in some contexts, use carefully.',
    difficulty: 'intermediate',
    formality: 'informal',
    region: 'Germany',
  },
  'Gemütlichkeit': {
    german: 'Gemütlichkeit',
    english: 'Cozy comfort / Warm atmosphere',
    culturalContext: 'A uniquely German concept describing a feeling of warmth, comfort, and good cheer, often associated with beer gardens and cozy cafes.',
    usageNotes: 'No direct English equivalent - represents German cultural values.',
    difficulty: 'advanced',
    formality: 'neutral',
    region: 'Germany',
  },
  'Schadenfreude': {
    german: 'Schadenfreude',
    english: 'Pleasure derived from another\'s misfortune',
    culturalContext: 'Another German word with no direct English equivalent, though the concept exists in many cultures.',
    usageNotes: 'Often used in English as a loanword.',
    difficulty: 'advanced',
    formality: 'neutral',
    region: 'Germany',
  },
  'Kaffee und Kuchen': {
    german: 'Kaffee und Kuchen',
    english: 'Coffee and cake',
    culturalContext: 'A traditional German afternoon ritual, especially on Sundays. Families often gather for this social event.',
    usageNotes: 'More than just food - represents social bonding time.',
    difficulty: 'intermediate',
    formality: 'neutral',
    region: 'Germany',
  },
  'Brotzeit': {
    german: 'Brotzeit',
    english: 'Bread time / Snack time',
    culturalContext: 'A Bavarian tradition of having a light meal with bread, cheese, and beer, often in beer gardens.',
    usageNotes: 'Common in southern Germany, especially Bavaria.',
    difficulty: 'intermediate',
    formality: 'informal',
    region: 'Bavaria',
  },
  'Feierabend': {
    german: 'Feierabend',
    english: 'End of work day / Quitting time',
    culturalContext: 'Literally means "celebration evening" - Germans value work-life balance and celebrate the end of the work day.',
    usageNotes: 'Often used to express relief at finishing work.',
    difficulty: 'intermediate',
    formality: 'neutral',
    region: 'Germany',
  },
};

export const useTranslationReveal = (options: UseTranslationRevealOptions = {}) => {
  const {
    initialUserLevel = 'beginner',
    initialTranslationSupport = 'full',
    onTranslationReveal,
    onUserLevelChange,
  } = options;

  const [state, setState] = useState<TranslationState>({
    isRevealed: false,
    translationData: null,
    userLevel: initialUserLevel,
    translationSupport: initialTranslationSupport,
    showCulturalContext: false,
  });

  const translationHistoryRef = useRef<Set<string>>(new Set());
  const userProgressRef = useRef<Record<string, { correct: number; incorrect: number; lastSeen: Date }>>({});

  const getTranslationData = useCallback((germanText: string): TranslationData | null => {
    // Try exact match first
    if (TRANSLATION_DATABASE[germanText]) {
      return TRANSLATION_DATABASE[germanText];
    }

    // Try case-insensitive match
    const lowerText = germanText.toLowerCase();
    const match = Object.values(TRANSLATION_DATABASE).find(
      data => data.german.toLowerCase() === lowerText
    );
    
    if (match) {
      return match;
    }

    // Try partial match for longer phrases
    const words = germanText.split(' ');
    if (words.length > 1) {
      for (const data of Object.values(TRANSLATION_DATABASE)) {
        if (data.german.toLowerCase().includes(lowerText) || 
            lowerText.includes(data.german.toLowerCase())) {
          return data;
        }
      }
    }

    return null;
  }, []);

  const shouldShowTranslation = useCallback((germanText: string): boolean => {
    const data = getTranslationData(germanText);
    if (!data) return false;

    // Check user level and translation support settings
    switch (state.translationSupport) {
      case 'full':
        return true;
      case 'partial':
        return data.difficulty === 'beginner' || 
               (data.difficulty === 'intermediate' && state.userLevel === 'beginner');
      case 'minimal':
        return data.difficulty === 'beginner' && state.userLevel === 'beginner';
      default:
        return false;
    }
  }, [getTranslationData, state.translationSupport, state.userLevel]);

  const revealTranslation = useCallback((germanText: string) => {
    const data = getTranslationData(germanText);
    if (!data) return;

    setState(prev => ({
      ...prev,
      isRevealed: true,
      translationData: data,
    }));

    // Track translation usage
    translationHistoryRef.current.add(germanText);
    onTranslationReveal?.(data);

    // Update user progress
    const progress = userProgressRef.current[germanText] || { correct: 0, incorrect: 0, lastSeen: new Date() };
    userProgressRef.current[germanText] = {
      ...progress,
      lastSeen: new Date(),
    };
  }, [getTranslationData, onTranslationReveal]);

  const hideTranslation = useCallback(() => {
    setState(prev => ({
      ...prev,
      isRevealed: false,
      translationData: null,
      showCulturalContext: false,
    }));
  }, []);

  const toggleCulturalContext = useCallback(() => {
    setState(prev => ({
      ...prev,
      showCulturalContext: !prev.showCulturalContext,
    }));
  }, []);

  const setUserLevel = useCallback((level: 'beginner' | 'intermediate' | 'advanced') => {
    setState(prev => ({ ...prev, userLevel: level }));
    onUserLevelChange?.(level);
  }, [onUserLevelChange]);

  const setTranslationSupport = useCallback((support: 'full' | 'partial' | 'minimal') => {
    setState(prev => ({ ...prev, translationSupport: support }));
  }, []);

  const recordUserResponse = useCallback((germanText: string, wasCorrect: boolean) => {
    const progress = userProgressRef.current[germanText] || { correct: 0, incorrect: 0, lastSeen: new Date() };
    userProgressRef.current[germanText] = {
      ...progress,
      correct: progress.correct + (wasCorrect ? 1 : 0),
      incorrect: progress.incorrect + (wasCorrect ? 0 : 1),
      lastSeen: new Date(),
    };
  }, []);

  const getTranslationIndicator = useCallback((germanText: string) => {
    const data = getTranslationData(germanText);
    if (!data || !shouldShowTranslation(germanText)) return null;

    const progress = userProgressRef.current[germanText];
    const masteryLevel = progress ? progress.correct / (progress.correct + progress.incorrect) : 0;

    return {
      shouldShow: true,
      difficulty: data.difficulty,
      masteryLevel,
      isNew: !translationHistoryRef.current.has(germanText),
    };
  }, [getTranslationData, shouldShowTranslation]);

  const getRecommendedUserLevel = useCallback(() => {
    const allProgress = Object.values(userProgressRef.current);
    if (allProgress.length === 0) return 'beginner';

    const totalCorrect = allProgress.reduce((sum, p) => sum + p.correct, 0);
    const totalAttempts = allProgress.reduce((sum, p) => sum + p.correct + p.incorrect, 0);
    
    if (totalAttempts < 10) return 'beginner';
    
    const accuracy = totalCorrect / totalAttempts;
    
    if (accuracy > 0.8) return 'advanced';
    if (accuracy > 0.6) return 'intermediate';
    return 'beginner';
  }, []);

  return {
    ...state,
    revealTranslation,
    hideTranslation,
    toggleCulturalContext,
    setUserLevel,
    setTranslationSupport,
    recordUserResponse,
    getTranslationIndicator,
    getRecommendedUserLevel,
    shouldShowTranslation,
  };
}; 