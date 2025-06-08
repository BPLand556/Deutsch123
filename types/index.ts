// User and Authentication Types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  level: LanguageLevel
  streak: number
  xp: number
  createdAt: Date
  updatedAt: Date
  preferences: UserPreferences
  progress: UserProgress
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  notifications: NotificationSettings
  learningGoals: LearningGoal[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  focusAreas: FocusArea[]
}

export interface UserProgress {
  vocabulary: VocabularyProgress
  grammar: GrammarProgress
  speaking: SpeakingProgress
  listening: ListeningProgress
  reading: ReadingProgress
  writing: WritingProgress
  cultural: CulturalProgress
}

// Language Learning Types
export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export interface LearningGoal {
  id: string
  title: string
  description: string
  targetLevel: LanguageLevel
  deadline?: Date
  progress: number
  completed: boolean
}

export type FocusArea = 
  | 'vocabulary'
  | 'grammar'
  | 'speaking'
  | 'listening'
  | 'reading'
  | 'writing'
  | 'cultural'

// Grammar Types
export interface GrammarPoint {
  id: string
  title: string
  description: string
  category: GrammarCategory
  difficulty: LanguageLevel
  rules: GrammarRule[]
  examples: string[]
  exercises: GrammarExercise[]
}

export type GrammarCategory = 
  | 'nouns'
  | 'verbs'
  | 'adjectives'
  | 'adverbs'
  | 'pronouns'
  | 'prepositions'
  | 'conjunctions'
  | 'sentence_structure'
  | 'tenses'
  | 'cases'

export interface GrammarRule {
  id: string
  description: string
  examples: string[]
  exceptions?: string[]
}

export interface GrammarExercise {
  id: string
  type: 'multiple_choice' | 'fill_blank' | 'transformation' | 'translation'
  question: string
  options?: string[]
  correctAnswer: string
  explanation: string
}

export interface GrammarError {
  type: string
  message: string
  suggestion: string
  severity: 'low' | 'medium' | 'high'
}

// Virtual Immersion Types
export interface ImmersionScenario {
  id: string
  title: string
  description: string
  type: ScenarioType
  difficulty: LanguageLevel
  duration: number // in minutes
  location: string
  characters: Character[]
  objectives: LearningObjective[]
  vocabulary: VocabularyItem[]
  grammar: GrammarPoint[]
  culturalNotes: CulturalNote[]
  media: MediaContent[]
}

export type ScenarioType = 
  | 'city_exploration'
  | 'workplace'
  | 'restaurant'
  | 'shopping'
  | 'transportation'
  | 'social_gathering'
  | 'cultural_event'
  | 'university'

export interface Character {
  id: string
  name: string
  role: string
  personality: string
  dialect: string
  avatar: string
  background: string
  dialogueOptions: DialogueOption[]
}

export interface DialogueOption {
  id: string
  text: string
  response: string
  difficulty: LanguageLevel
  vocabulary: string[]
  grammar: string[]
}

export interface LearningObjective {
  id: string
  title: string
  description: string
  type: 'vocabulary' | 'grammar' | 'cultural' | 'communication'
  completed: boolean
}

// Vocabulary System Types
export interface VocabularyItem {
  id: string
  word: string
  translation: string
  pronunciation: string
  partOfSpeech: PartOfSpeech
  difficulty: LanguageLevel
  context: string
  examples: string[]
  synonyms: string[]
  antonyms: string[]
  relatedWords: string[]
  culturalNotes: string
  audioUrl: string
  imageUrl?: string
  srsData: SRSData
}

export type PartOfSpeech = 
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'pronoun'
  | 'preposition'
  | 'conjunction'
  | 'interjection'

export interface SRSData {
  interval: number
  repetitions: number
  easeFactor: number
  nextReview: Date
  lastReview: Date
  streak: number
}

// AI Conversation Types
export interface ConversationSession {
  id: string
  userId: string
  partnerId: string
  startTime: Date
  endTime?: Date
  messages: ConversationMessage[]
  feedback: ConversationFeedback
  difficulty: LanguageLevel
  topics: string[]
}

export interface ConversationMessage {
  id: string
  sender: 'user' | 'ai'
  content: string
  timestamp: Date
  pronunciation?: PronunciationFeedback
  grammar?: GrammarFeedback
  vocabulary?: VocabularyFeedback
}

export interface ConversationFeedback {
  pronunciation: PronunciationFeedback
  grammar: GrammarFeedback
  vocabulary: VocabularyFeedback
  fluency: number
  confidence: number
  suggestions: string[]
}

export interface PronunciationFeedback {
  accuracy: number
  issues: string[]
  suggestions: string[]
}

export interface GrammarFeedback {
  accuracy: number
  errors: GrammarError[]
  suggestions: string[]
}

export interface VocabularyFeedback {
  accuracy: number
  suggestions: string[]
  newWords: string[]
}

// Progress Tracking Types
export interface VocabularyProgress {
  totalWords: number
  masteredWords: number
  learningWords: number
  reviewWords: number
  streak: number
  lastStudyDate: Date
}

export interface GrammarProgress {
  totalPoints: number
  masteredPoints: number
  learningPoints: number
  accuracy: number
  lastPracticeDate: Date
}

export interface SpeakingProgress {
  totalSessions: number
  totalTime: number
  accuracy: number
  fluency: number
  confidence: number
  lastSessionDate: Date
}

export interface ListeningProgress {
  totalExercises: number
  accuracy: number
  comprehension: number
  lastExerciseDate: Date
}

export interface ReadingProgress {
  totalTexts: number
  wordsRead: number
  comprehension: number
  speed: number
  lastReadDate: Date
}

export interface WritingProgress {
  totalEssays: number
  wordsWritten: number
  accuracy: number
  lastEssayDate: Date
}

export interface CulturalProgress {
  totalScenarios: number
  culturalKnowledge: number
  lastScenarioDate: Date
}

// Media Content Types
export interface MediaContent {
  id: string
  type: MediaType
  title: string
  description: string
  url: string
  duration?: number
  difficulty: LanguageLevel
  tags: string[]
  transcript?: string
  vocabulary: VocabularyItem[]
  culturalNotes: CulturalNote[]
}

export type MediaType = 
  | 'video'
  | 'audio'
  | 'image'
  | 'text'
  | 'interactive'

export interface CulturalNote {
  id: string
  title: string
  description: string
  category: CulturalCategory
  relevance: string
  examples: string[]
}

export type CulturalCategory = 
  | 'customs'
  | 'traditions'
  | 'history'
  | 'geography'
  | 'politics'
  | 'arts'
  | 'food'
  | 'business'

// Gamification Types
export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: AchievementCategory
  unlockedAt?: Date
  progress: number
  maxProgress: number
}

export type AchievementCategory = 
  | 'streak'
  | 'vocabulary'
  | 'grammar'
  | 'speaking'
  | 'cultural'
  | 'social'
  | 'special'

export interface Badge {
  id: string
  title: string
  description: string
  icon: string
  rarity: BadgeRarity
  unlockedAt?: Date
}

export type BadgeRarity = 
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'

// Social Learning Types
export interface StudyGroup {
  id: string
  name: string
  description: string
  members: GroupMember[]
  level: LanguageLevel
  focusArea: FocusArea
  meetingSchedule: MeetingSchedule[]
  challenges: GroupChallenge[]
}

export interface GroupMember {
  userId: string
  role: 'admin' | 'moderator' | 'member'
  joinedAt: Date
  contribution: number
}

export interface MeetingSchedule {
  id: string
  dayOfWeek: number
  time: string
  duration: number
  timezone: string
  active: boolean
}

export interface GroupChallenge {
  id: string
  title: string
  description: string
  type: ChallengeType
  startDate: Date
  endDate: Date
  participants: ChallengeParticipant[]
  rewards: Reward[]
}

export type ChallengeType = 
  | 'vocabulary'
  | 'speaking'
  | 'reading'
  | 'writing'
  | 'cultural'

export interface ChallengeParticipant {
  userId: string
  progress: number
  completed: boolean
  rank?: number
}

export interface Reward {
  id: string
  type: 'xp' | 'badge' | 'achievement' | 'premium'
  value: number | string
}

// Notification Types
export interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  reminders: boolean
  achievements: boolean
  social: boolean
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: Date
  actionUrl?: string
}

export type NotificationType = 
  | 'reminder'
  | 'achievement'
  | 'social'
  | 'system'
  | 'progress'

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Error Types
export interface AppError {
  code: string
  message: string
  details?: any
}

export interface ValidationError {
  field: string
  message: string
} 