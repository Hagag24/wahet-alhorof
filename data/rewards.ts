import { Badge } from '@/types'

export const badges: Badge[] = [
  {
    id: 'listener',
    name: 'مستمع ممتاز',
    description: 'استمعت لأول قصة كاملة',
    icon: '👂',
    earnedAt: null,
    requirement: 'complete-first-story',
  },
  {
    id: 'word-hunter',
    name: 'صياد الكلمات',
    description: 'أنهيت لعبة اصطياد الكلمات',
    icon: '🎣',
    earnedAt: null,
    requirement: 'complete-catch-game',
  },
  {
    id: 'syllable-hero',
    name: 'بطل المقاطع',
    description: 'أتقنت تقسيم الكلمات إلى مقاطع',
    icon: '👏',
    earnedAt: null,
    requirement: 'complete-syllable-game',
  },
  {
    id: 'school-star',
    name: 'نجم المدرسة',
    description: 'أنهيت درس يوم في المدرسة',
    icon: '⭐',
    earnedAt: null,
    requirement: 'complete-lesson-4',
  },
  {
    id: 'awareness-champion',
    name: 'بطل الوعي الصوتي',
    description: 'أنهيت جميع الدروس الأربعة',
    icon: '🏆',
    earnedAt: null,
    requirement: 'complete-all-lessons',
  },
  {
    id: 'first-star',
    name: 'النجمة الأولى',
    description: 'حصلت على أول نجمة',
    icon: '🌟',
    earnedAt: null,
    requirement: 'earn-first-star',
  },
  {
    id: 'ten-stars',
    name: 'عشر نجوم',
    description: 'جمعت 10 نجوم',
    icon: '✨',
    earnedAt: null,
    requirement: 'earn-ten-stars',
  },
  {
    id: 'builder',
    name: 'بنّاء الكلمات',
    description: 'ركّبت 5 كلمات بنجاح',
    icon: '🧩',
    earnedAt: null,
    requirement: 'build-five-words',
  },
]

export const getBadgeById = (id: string): Badge | undefined => {
  return badges.find(badge => badge.id === id)
}

export const encouragingMessages = {
  correct: [
    'أحسنت!',
    'رائع يا بطل!',
    'إجابة صحيحة!',
    'ممتاز!',
    'أنت نجم!',
    'استمر هكذا!',
  ],
  wrong: [
    'حاول مرة أخرى',
    'اسمع الكلمة جيدًا',
    'أنت قريب جدًا',
    'لا بأس، جرّب مرة أخرى',
    'فكّر قليلًا وحاول',
  ],
  complete: [
    'أنهيت اللعبة!',
    'عمل رائع!',
    'أنت بطل حقيقي!',
    'مبروك!',
  ],
}

export const getRandomMessage = (type: 'correct' | 'wrong' | 'complete'): string => {
  const messages = encouragingMessages[type]
  return messages[Math.floor(Math.random() * messages.length)]
}
