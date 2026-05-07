'use client'

/**
 * Text-to-Speech System for Arabic Educational Platform
 * يوفر نطق الحروف والكلمات والجمل باللغة العربية
 */

export interface TTSOptions {
  rate?: number // 0.5 - 2.0
  pitch?: number // 0 - 2.0
  volume?: number // 0 - 1.0
}

class TextToSpeechEngine {
  private synthesis: SpeechSynthesis
  private isSupported: boolean
  private currentUtterance: SpeechSynthesisUtterance | null = null
  private isSpeaking = false
  private volume = 1.0

  constructor() {
    this.synthesis = typeof window !== 'undefined' ? window.speechSynthesis : ({} as SpeechSynthesis)
    this.isSupported = !!this.synthesis
  }

  async speak(text: string, options: TTSOptions = {}): Promise<void> {
    if (!this.isSupported) {
      console.warn('[TTS] Speech Synthesis not supported')
      return
    }

    // Cancel any ongoing speech
    this.stop()

    return new Promise((resolve) => {
      // Remove Arabic diacritics for clearer pronunciation
      const cleanText = removeDiacritics(text)
      const utterance = new SpeechSynthesisUtterance(cleanText)

      utterance.lang = 'ar-SA' // Arabic language
      utterance.rate = options.rate || 1.0
      utterance.pitch = options.pitch || 1.0
      utterance.volume = options.volume ?? this.volume

      // Get Arabic voices
      const voices = this.synthesis.getVoices()
      const arabicVoice = voices.find(
        (voice) => voice.lang.includes('ar') || voice.name.includes('Arabic')
      )

      if (arabicVoice) {
        utterance.voice = arabicVoice
      }

      utterance.onstart = () => {
        this.isSpeaking = true
        console.log('[TTS] Speaking:', cleanText)
      }

      utterance.onend = () => {
        this.isSpeaking = false
        this.currentUtterance = null
        resolve()
      }

      utterance.onerror = (error) => {
        console.error('[TTS] Error:', error.error)
        this.isSpeaking = false
        this.currentUtterance = null
        resolve()
      }

      this.currentUtterance = utterance
      this.synthesis.speak(utterance)
    })
  }

  stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel()
      this.isSpeaking = false
      this.currentUtterance = null
    }
  }

  pause(): void {
    if (this.synthesis?.pause) {
      this.synthesis.pause()
    }
  }

  resume(): void {
    if (this.synthesis?.resume) {
      this.synthesis.resume()
    }
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume))
  }

  getVolume(): number {
    return this.volume
  }

  isSpeakingNow(): boolean {
    return this.isSpeaking
  }

  getIsSupported(): boolean {
    return this.isSupported
  }
}

// Singleton instance
let ttsInstance: TextToSpeechEngine | null = null

export function getTTSEngine(): TextToSpeechEngine {
  if (typeof window !== 'undefined' && !ttsInstance) {
    ttsInstance = new TextToSpeechEngine()
  }
  return ttsInstance || new TextToSpeechEngine()
}

/**
 * Common Arabic letters for pronunciation
 */
/**
 * Remove Arabic diacritical marks (Tashkeel)
 * يزيل التشكيل من النصوص العربية
 */
export function removeDiacritics(text: string): string {
  const diacriticsPattern = /[\u064B-\u0652]/g
  return text.replace(diacriticsPattern, '')
}

export const ARABIC_LETTERS = {
  ا: 'الف',
  ب: 'باء',
  ت: 'تاء',
  ث: 'ثاء',
  ج: 'جيم',
  ح: 'حاء',
  خ: 'خاء',
  د: 'دال',
  ذ: 'ذال',
  ر: 'راء',
  ز: 'زاي',
  س: 'سين',
  ش: 'شين',
  ص: 'صاد',
  ض: 'ضاد',
  ط: 'طاء',
  ظ: 'ظاء',
  ع: 'عين',
  غ: 'غين',
  ف: 'فاء',
  ق: 'قاف',
  ك: 'كاف',
  ل: 'لام',
  م: 'ميم',
  ن: 'نون',
  ه: 'هاء',
  و: 'واو',
  ي: 'ياء',
}

/**
 * Get the Arabic name of a letter
 */
export function getLetterName(letter: string): string {
  return ARABIC_LETTERS[letter as keyof typeof ARABIC_LETTERS] || letter
}

/**
 * Speak a letter with its Arabic name
 */
export async function speakLetter(letter: string, options?: TTSOptions): Promise<void> {
  const tts = getTTSEngine()
  const cleanLetter = removeDiacritics(letter)
  const letterName = getLetterName(cleanLetter)
  await tts.speak(`${cleanLetter}, ${letterName}`, options)
}

/**
 * Speak a word
 */
export async function speakWord(word: string, options?: TTSOptions): Promise<void> {
  const tts = getTTSEngine()
  const cleanWord = removeDiacritics(word)
  await tts.speak(cleanWord, options)
}

/**
 * Speak an instruction
 */
export async function speakInstruction(text: string, options?: TTSOptions): Promise<void> {
  const tts = getTTSEngine()
  const cleanText = removeDiacritics(text)
  const instructionOptions: TTSOptions = {
    rate: 0.9,
    pitch: 1.1,
    ...options,
  }
  await tts.speak(cleanText, instructionOptions)
}

/**
 * Speak feedback message
 */
export async function speakFeedback(isCorrect: boolean, options?: TTSOptions): Promise<void> {
  const tts = getTTSEngine()
  const message = isCorrect ? 'ممتاز احسنت' : 'حاول مرة اخرى'
  const feedbackOptions: TTSOptions = {
    pitch: isCorrect ? 1.2 : 0.9,
    ...options,
  }
  await tts.speak(message, feedbackOptions)
}

/**
 * Speak a number
 */
export async function speakNumber(num: number, options?: TTSOptions): Promise<void> {
  const tts = getTTSEngine()
  const arabicNumbers: Record<number, string> = {
    0: 'صفر',
    1: 'واحد',
    2: 'اثنان',
    3: 'ثلاثة',
    4: 'أربعة',
    5: 'خمسة',
    6: 'ستة',
    7: 'سبعة',
    8: 'ثمانية',
    9: 'تسعة',
    10: 'عشرة',
  }
  const word = arabicNumbers[num] || num.toString()
  await tts.speak(word, options)
}
