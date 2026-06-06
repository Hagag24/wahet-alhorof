/**
 * Hook to check if audio coverage is available
 * 
 * AUDIO GAP ISSUE:
 * Project displays 69+ speaker icons but only has 2-3 MP3 files.
 * This hook prevents showing speaker buttons for audio that doesn't exist.
 * 
 * Reference: docs/audio-audit/AUDIO_GAPS_LESSON_1_DETAILED.md
 */

export const AUDIO_COVERAGE: Record<string, boolean> = {
  // Lesson 1 - Vocabulary (ONLY الجد HAS AUDIO)
  'الجد': true, // word-069 - /public/audio/words/word-069.mp3 ✅ 12KB
  
  // These have NO MP3 files (speaker button should be hidden)
  'مريم': false, // word-022 - NO MANIFEST, NO MP3
  'يوسف': false, // word-026 - NO MANIFEST, NO MP3
  'جدي': false, // word-048 - NO MANIFEST, NO MP3
  'بيت': false, // word-008 - NO MANIFEST, NO MP3
  'متجر': false, // word-020 - NO MANIFEST, NO MP3
  'دراجة': false, // word-012 - NO MANIFEST, NO MP3
  'حديقة': false, // word-009 - NO MANIFEST, NO MP3
  'أمي': false, // word-005 - NO MANIFEST, NO MP3
  'أبي': false, // word-001 - NO MANIFEST, NO MP3
  'كريم': false, // word-019 - NO MANIFEST, NO MP3
  
  // Story sections - NO INDIVIDUAL AUDIO IDs
  'مريم عمرها ست سنوات': false,
  'يوسف عمره تسع سنوات': false,
  
  // Game questions - NO AUDIO IDs
  'ما الكلمة الصحيحة للصورة؟': false,
  'ما الكلمة المختلفة في الصوت الأول؟': false,
  
  // Harakat/vowel marks - NO MP3 FILES
  'مِ': false,
  'مُ': false,
  'مَ': false,
  'مْ': false,
  'بَ': false,
  'بِ': false,
  'بُ': false,
  'بْ': false,
  'يَـ': false,
  'يِـ': false,
  'يُـ': false,
  'يْـ': false,
}

/**
 * Determine if speaker button should be visible
 * 
 * @param text - The text to speak
 * @returns true if audio file exists, false if fallback only
 */
export function hasAudioCoverage(text: string | undefined): boolean {
  if (!text) return false
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
