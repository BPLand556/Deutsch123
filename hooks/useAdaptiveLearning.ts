import { useState, useCallback, useRef } from 'react';

interface LearningMetrics {
  vocabularyRetention: number; // 0-1
  pronunciationAccuracy: number; // 0-1
  conversationConfidence: number; // 0-1
  culturalKnowledge: number; // 0-1
  engagementLevel: number; // 0-1
  responseTime: number; // milliseconds
  errorRate: number; // 0-1
  completionRate: number; // 0-1
}

interface DifficultyLevel {
  level: 'beginner' | 'intermediate' | 'advanced';
  vocabularyComplexity: number; // 0-1
  grammarComplexity: number; // 0-1
  speechSpeed: number; // 0-1 (0 = slow, 1 = native)
  translationSupport: number; // 0-1 (0 = none, 1 = full)
  culturalContext: number; // 0-1
  scenarioComplexity: number; // 0-1
}

interface UserProfile {
  id: string;
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  learningGoals: string[];
  preferredLearningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  interests: string[];
  timeSpentLearning: number; // minutes
  sessionsCompleted: number;
  lastActive: Date;
}

interface AdaptiveLearningState {
  userProfile: UserProfile;
  currentMetrics: LearningMetrics;
  currentDifficulty: DifficultyLevel;
  recommendations: string[];
  progressTrend: 'improving' | 'stable' | 'declining';
  nextSuggestedScenario: string;
  learningInsights: string[];
}

interface UseAdaptiveLearningOptions {
  initialUserProfile?: Partial<UserProfile>;
  onDifficultyChange?: (difficulty: DifficultyLevel) => void;
  onRecommendationUpdate?: (recommendations: string[]) => void;
  onProgressAlert?: (insight: string) => void;
}

export const useAdaptiveLearning = (options: UseAdaptiveLearningOptions = {}) => {
  const {
    initialUserProfile,
    onDifficultyChange,
    onRecommendationUpdate,
    onProgressAlert,
  } = options;

  const [state, setState] = useState<AdaptiveLearningState>({
    userProfile: {
      id: 'user-' + Date.now(),
      currentLevel: 'beginner',
      learningGoals: ['basic conversation', 'cultural understanding'],
      preferredLearningStyle: 'mixed',
      interests: ['travel', 'culture', 'business'],
      timeSpentLearning: 0,
      sessionsCompleted: 0,
      lastActive: new Date(),
      ...initialUserProfile,
    },
    currentMetrics: {
      vocabularyRetention: 0.5,
      pronunciationAccuracy: 0.4,
      conversationConfidence: 0.3,
      culturalKnowledge: 0.6,
      engagementLevel: 0.7,
      responseTime: 3000,
      errorRate: 0.4,
      completionRate: 0.8,
    },
    currentDifficulty: {
      level: 'beginner',
      vocabularyComplexity: 0.3,
      grammarComplexity: 0.2,
      speechSpeed: 0.4,
      translationSupport: 0.8,
      culturalContext: 0.6,
      scenarioComplexity: 0.3,
    },
    recommendations: [],
    progressTrend: 'stable',
    nextSuggestedScenario: 'coffee-shop',
    learningInsights: [],
  });

  const metricsHistoryRef = useRef<LearningMetrics[]>([]);
  const sessionStartTimeRef = useRef<Date>(new Date());

  // Calculate overall performance score
  const calculatePerformanceScore = useCallback((metrics: LearningMetrics): number => {
    const weights = {
      vocabularyRetention: 0.2,
      pronunciationAccuracy: 0.2,
      conversationConfidence: 0.2,
      culturalKnowledge: 0.15,
      engagementLevel: 0.15,
      completionRate: 0.1,
    };

    return Object.entries(weights).reduce((score, [key, weight]) => {
      return score + (metrics[key as keyof LearningMetrics] as number) * weight;
    }, 0);
  }, []);

  // Analyze progress trend
  const analyzeProgressTrend = useCallback((metrics: LearningMetrics): 'improving' | 'stable' | 'declining' => {
    if (metricsHistoryRef.current.length < 3) return 'stable';

    const recentScores = metricsHistoryRef.current.slice(-3).map(calculatePerformanceScore);
    const currentScore = calculatePerformanceScore(metrics);

    const avgRecentScore = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
    
    if (currentScore > avgRecentScore + 0.1) return 'improving';
    if (currentScore < avgRecentScore - 0.1) return 'declining';
    return 'stable';
  }, [calculatePerformanceScore]);

  // Generate difficulty recommendations
  const generateDifficultyRecommendations = useCallback((metrics: LearningMetrics, currentDifficulty: DifficultyLevel): DifficultyLevel => {
    const performanceScore = calculatePerformanceScore(metrics);
    const newDifficulty = { ...currentDifficulty };

    // Adjust based on performance
    if (performanceScore > 0.8 && currentDifficulty.level !== 'advanced') {
      // User is performing well, increase difficulty
      if (currentDifficulty.level === 'beginner') {
        newDifficulty.level = 'intermediate';
        newDifficulty.vocabularyComplexity = Math.min(0.6, currentDifficulty.vocabularyComplexity + 0.2);
        newDifficulty.grammarComplexity = Math.min(0.5, currentDifficulty.grammarComplexity + 0.2);
        newDifficulty.speechSpeed = Math.min(0.7, currentDifficulty.speechSpeed + 0.2);
        newDifficulty.translationSupport = Math.max(0.4, currentDifficulty.translationSupport - 0.2);
      } else if (currentDifficulty.level === 'intermediate') {
        newDifficulty.level = 'advanced';
        newDifficulty.vocabularyComplexity = Math.min(0.9, currentDifficulty.vocabularyComplexity + 0.2);
        newDifficulty.grammarComplexity = Math.min(0.8, currentDifficulty.grammarComplexity + 0.2);
        newDifficulty.speechSpeed = Math.min(1.0, currentDifficulty.speechSpeed + 0.2);
        newDifficulty.translationSupport = Math.max(0.1, currentDifficulty.translationSupport - 0.2);
      }
    } else if (performanceScore < 0.4) {
      // User is struggling, decrease difficulty
      newDifficulty.vocabularyComplexity = Math.max(0.1, currentDifficulty.vocabularyComplexity - 0.1);
      newDifficulty.grammarComplexity = Math.max(0.1, currentDifficulty.grammarComplexity - 0.1);
      newDifficulty.speechSpeed = Math.max(0.2, currentDifficulty.speechSpeed - 0.1);
      newDifficulty.translationSupport = Math.min(1.0, currentDifficulty.translationSupport + 0.1);
    }

    // Adjust based on specific metrics
    if (metrics.pronunciationAccuracy < 0.3) {
      newDifficulty.speechSpeed = Math.max(0.2, newDifficulty.speechSpeed - 0.1);
    }

    if (metrics.vocabularyRetention < 0.3) {
      newDifficulty.translationSupport = Math.min(1.0, newDifficulty.translationSupport + 0.1);
    }

    if (metrics.engagementLevel < 0.4) {
      newDifficulty.culturalContext = Math.min(1.0, newDifficulty.culturalContext + 0.1);
    }

    return newDifficulty;
  }, [calculatePerformanceScore]);

  // Generate content recommendations
  const generateContentRecommendations = useCallback((userProfile: UserProfile, metrics: LearningMetrics): string[] => {
    const recommendations: string[] = [];

    // Based on performance gaps
    if (metrics.pronunciationAccuracy < 0.5) {
      recommendations.push('Focus on pronunciation practice with voice recognition exercises');
    }

    if (metrics.vocabularyRetention < 0.5) {
      recommendations.push('Review vocabulary with spaced repetition exercises');
    }

    if (metrics.culturalKnowledge < 0.5) {
      recommendations.push('Explore cultural scenarios to improve cultural understanding');
    }

    if (metrics.conversationConfidence < 0.5) {
      recommendations.push('Practice conversation with AI partners in low-pressure scenarios');
    }

    // Based on interests
    if (userProfile.interests.includes('business')) {
      recommendations.push('Try business meeting scenarios for professional German');
    }

    if (userProfile.interests.includes('travel')) {
      recommendations.push('Practice travel-related scenarios like airport and hotel situations');
    }

    // Based on learning style
    if (userProfile.preferredLearningStyle === 'visual') {
      recommendations.push('Use visual learning aids and interactive diagrams');
    }

    if (userProfile.preferredLearningStyle === 'auditory') {
      recommendations.push('Focus on listening exercises and pronunciation practice');
    }

    return recommendations.slice(0, 3); // Limit to top 3 recommendations
  }, []);

  // Suggest next scenario
  const suggestNextScenario = useCallback((userProfile: UserProfile, metrics: LearningMetrics): string => {
    const scenarios = ['coffee-shop', 'university', 'business-meeting', 'supermarket', 'social-gathering'];
    
    // Weight scenarios based on user interests and performance
    const scenarioWeights = scenarios.map(scenario => {
      let weight = 1;

      // Interest-based weighting
      if (scenario === 'business-meeting' && userProfile.interests.includes('business')) weight += 2;
      if (scenario === 'university' && userProfile.learningGoals.includes('academic')) weight += 2;
      if (scenario === 'social-gathering' && userProfile.interests.includes('culture')) weight += 1.5;

      // Performance-based weighting
      if (metrics.culturalKnowledge < 0.5 && scenario === 'social-gathering') weight += 1;
      if (metrics.conversationConfidence < 0.5 && scenario === 'coffee-shop') weight += 1;

      return { scenario, weight };
    });

    // Select scenario with highest weight
    scenarioWeights.sort((a, b) => b.weight - a.weight);
    return scenarioWeights[0].scenario;
  }, []);

  // Generate learning insights
  const generateLearningInsights = useCallback((metrics: LearningMetrics, trend: string): string[] => {
    const insights: string[] = [];

    if (trend === 'improving') {
      insights.push('Great progress! Your German skills are improving steadily.');
    } else if (trend === 'declining') {
      insights.push('Consider reviewing previous material to reinforce your learning.');
    }

    if (metrics.pronunciationAccuracy > 0.7) {
      insights.push('Excellent pronunciation! You\'re developing a natural German accent.');
    } else if (metrics.pronunciationAccuracy < 0.3) {
      insights.push('Focus on pronunciation - try speaking more slowly and clearly.');
    }

    if (metrics.engagementLevel > 0.8) {
      insights.push('High engagement! You\'re clearly motivated to learn German.');
    }

    if (metrics.responseTime < 2000) {
      insights.push('Quick responses! Your German is becoming more automatic.');
    }

    return insights;
  }, []);

  // Update metrics
  const updateMetrics = useCallback((newMetrics: Partial<LearningMetrics>) => {
    setState(prevState => {
      const updatedMetrics = { ...prevState.currentMetrics, ...newMetrics };
      
      // Add to history
      metricsHistoryRef.current.push(updatedMetrics);
      if (metricsHistoryRef.current.length > 10) {
        metricsHistoryRef.current.shift();
      }

      // Analyze and update
      const trend = analyzeProgressTrend(updatedMetrics);
      const newDifficulty = generateDifficultyRecommendations(updatedMetrics, prevState.currentDifficulty);
      const recommendations = generateContentRecommendations(prevState.userProfile, updatedMetrics);
      const nextScenario = suggestNextScenario(prevState.userProfile, updatedMetrics);
      const insights = generateLearningInsights(updatedMetrics, trend);

      // Notify callbacks
      if (newDifficulty.level !== prevState.currentDifficulty.level) {
        onDifficultyChange?.(newDifficulty);
      }

      if (recommendations.length > 0) {
        onRecommendationUpdate?.(recommendations);
      }

      insights.forEach(insight => onProgressAlert?.(insight));

      return {
        ...prevState,
        currentMetrics: updatedMetrics,
        currentDifficulty: newDifficulty,
        recommendations,
        progressTrend: trend,
        nextSuggestedScenario: nextScenario,
        learningInsights: insights,
      };
    });
  }, [calculatePerformanceScore, analyzeProgressTrend, generateDifficultyRecommendations, generateContentRecommendations, suggestNextScenario, generateLearningInsights, onDifficultyChange, onRecommendationUpdate, onProgressAlert]);

  // Record user interaction
  const recordInteraction = useCallback((interaction: {
    type: 'vocabulary' | 'pronunciation' | 'conversation' | 'cultural';
    success: boolean;
    responseTime: number;
  }) => {
    const { type, success, responseTime } = interaction;

    setState(prevState => {
      const newMetrics = { ...prevState.currentMetrics };

      // Update specific metrics based on interaction type
      switch (type) {
        case 'vocabulary':
          newMetrics.vocabularyRetention = success 
            ? Math.min(1, newMetrics.vocabularyRetention + 0.05)
            : Math.max(0, newMetrics.vocabularyRetention - 0.02);
          break;
        case 'pronunciation':
          newMetrics.pronunciationAccuracy = success
            ? Math.min(1, newMetrics.pronunciationAccuracy + 0.05)
            : Math.max(0, newMetrics.pronunciationAccuracy - 0.02);
          break;
        case 'conversation':
          newMetrics.conversationConfidence = success
            ? Math.min(1, newMetrics.conversationConfidence + 0.05)
            : Math.max(0, newMetrics.conversationConfidence - 0.02);
          break;
        case 'cultural':
          newMetrics.culturalKnowledge = success
            ? Math.min(1, newMetrics.culturalKnowledge + 0.05)
            : Math.max(0, newMetrics.culturalKnowledge - 0.02);
          break;
      }

      // Update general metrics
      newMetrics.responseTime = responseTime;
      newMetrics.errorRate = success ? Math.max(0, newMetrics.errorRate - 0.01) : Math.min(1, newMetrics.errorRate + 0.02);
      newMetrics.engagementLevel = Math.min(1, newMetrics.engagementLevel + 0.02);

      updateMetrics(newMetrics);
      return prevState;
    });
  }, [updateMetrics]);

  // Start/end session tracking
  const startSession = useCallback(() => {
    sessionStartTimeRef.current = new Date();
    setState(prevState => ({
      ...prevState,
      userProfile: {
        ...prevState.userProfile,
        sessionsCompleted: prevState.userProfile.sessionsCompleted + 1,
        lastActive: new Date(),
      },
    }));
  }, []);

  const endSession = useCallback(() => {
    const sessionDuration = (new Date().getTime() - sessionStartTimeRef.current.getTime()) / 1000 / 60; // minutes
    
    setState(prevState => ({
      ...prevState,
      userProfile: {
        ...prevState.userProfile,
        timeSpentLearning: prevState.userProfile.timeSpentLearning + sessionDuration,
        lastActive: new Date(),
      },
    }));
  }, []);

  return {
    ...state,
    updateMetrics,
    recordInteraction,
    startSession,
    endSession,
    calculatePerformanceScore: () => calculatePerformanceScore(state.currentMetrics),
  };
}; 