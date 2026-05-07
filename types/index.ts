// Lesson Types
export interface Lesson {
  id: string
  title: string
  description: string
  environment: string
  characters: string[]
  story: string
  storyScenes: StoryScene[]
  vocabulary: VocabularyWord[]
  games: GameConfig[]
  icon: string
  color: string
  order: number
}


export interface VocabularyWord {
  word: string
  image?: string
  audio?: string
}

export interface StoryScene {
  id: string
  text: string
  image?: string
  images?: string[]
}

// Game Types
export type GameType = 
  | 'choose-sound'
  | 'letter-position'
  | 'letter-forms'
  | 'catch-different-word'
  | 'similar-sound-letters'
  | 'syllable-clap'
  | 'build-word'
  | 'match-picture-word'
  | 'complete-word'
  | 'harakat'
  | 'similar-words'
  | 'complete-sentence'

export interface GameConfig {
  id: string
  type: GameType
  title: string
  description: string
  icon: string
  questions: GameQuestion[]
}

export interface GameQuestion {
  id: string
  word?: string
  image?: string
  question: string
  options: string[]
  correctAnswer: string | number
  hint?: string
  // For syllable clap
  syllables?: string[]
  syllableCount?: number
  // For build word
  parts?: string[]
  // For match picture word
  pairs?: { image: string; word: string }[]
  // For complete sentence
  sentence?: string
}

// Character Types
export interface Character {
  id: string
  name: string
  image: string
  color: string
  description: string
}

// Progress Types
export interface UserProgress {
  selectedCharacter: Character | null
  studentName: string
  totalStars: number
  lessonsProgress: Record<string, LessonProgress>
  currentLevel: number
  lastPlayedAt: string
}

export interface LessonProgress {
  lessonId: string
  completed: boolean
  stars: number
  gamesCompleted: string[]
  bestScore: number
  lastAttempt: string
}

export interface GameResult {
  gameId: string
  lessonId: string
  score: number
  totalQuestions: number
  correctAnswers: number
  wrongAnswers: number
  stars: number
  attempts: number
  completedAt: string
  timeSpent: number
}

export interface Reward {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: string
  type: 'badge' | 'achievement'
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: string | null
  requirement: string
}

// Sound Types
export type SoundType = 'correct' | 'wrong' | 'click' | 'reward' | 'finish' | 'pop' | 'applause' | 'whistle'
export type SoundProfile = 'quiet' | 'normal' | 'party'

// Student for Teacher Dashboard
export interface Student {
  id: string
  name: string
  avatar: string
  progress: UserProgress
  lastActive: string
}
