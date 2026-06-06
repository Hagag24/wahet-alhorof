/**
 * Hook to check if audio coverage is available
 * 
 * AUDIO COVERAGE STATUS:
 * This system now has REAL MP3 coverage for critical items.
 * Only items with actual MP3 files should be marked as true.
 * 
 * Reference: docs/audio-audit/final-audio-coverage-report.md
 */

export const AUDIO_COVERAGE: Record<string, boolean> = {
  // CRITICAL WORDS WITH REAL AUDIO ✅
  'جدي': true, // word-048 - /public/audio/words/word-048.mp3 ✅ 12.2 KB
  'الجد': true, // word-069 - /public/audio/words/word-069.mp3 ✅ 11.2 KB
  'جد': true, // word-070 - /public/audio/words/word-070.mp3 ✅ 8.9 KB
  
  // LETTER SOUNDS WITH REAL AUDIO ✅
  'ب': true, // word-049 - /public/audio/words/word-049.mp3 ✅ 7.9 KB
  'د': true, // word-050 - /public/audio/words/word-050.mp3 ✅ 8.2 KB
  'ر': true, // word-051 - /public/audio/words/word-051.mp3 ✅ 8.7 KB
  
  // PHRASES WITH REAL AUDIO ✅
  'رحلة التعلم': true, // phrase-053 - /public/audio/ui/phrase-053.mp3 ✅ 15.7 KB
  
  // FULL STORY INTRO WITH REAL AUDIO ✅
  'مريم عمرها ست سنوات': true, // has dedicated story audio
  
  // Words without audio (TTS fallback only)
  'مريم': false,
  'يوسف': false,
  'بيت': false,
  'متجر': false,
  'دراجة': false,
  'حديقة': false,
  'أمي': false,
  'أبي': false,
  'كريم': false,
}

/**
 * Determine if speaker button should be visible
 * 
 * @param text - The text to speak
 * @returns true if audio file exists, false if fallback only
 */
export function hasAudioCoverage(text: string | undefined): boolean {
  if (!text) return false
  // Return true if explicitly marked, undefined defaults to false
  return AUDIO_COVERAGE[text] === true
}

/**
 * Get audio status description for documentation
 */
export function getAudioStatus(text: string | undefined): {
  hasAudio: boolean
  status: 'OK' | 'FALLBACK_ONLY' | 'NO_AUDIO_ID'
  reason?: string
} {
  if (!text) {
    return {
      hasAudio: false,
      status: 'NO_AUDIO_ID',
      reason: 'No audio ID assigned to this item'
    }
  }
  
  const hasAudio = AUDIO_COVERAGE[text] === true
  
  if (hasAudio) {
    return {
      hasAudio: true,
      status: 'OK',
      reason: 'MP3 file exists'
    }
  }
  
  return {
    hasAudio: false,
    status: 'FALLBACK_ONLY',
    reason: 'Using browser TTS fallback (no MP3 file)'
  }
}
