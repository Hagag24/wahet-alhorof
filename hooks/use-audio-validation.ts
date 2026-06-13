'use client'

import { useEffect, useState } from 'react'
import { audioMapping } from '@/lib/audio-mapping'

/**
 * useAudioValidation — Check if an audio reference exists and is valid.
 * 
 * Usage:
 *   const { isValid, exists } = useAudioValidation('word-001')
 *   if (isValid) return <SoundButton ... />
 * 
 * Returns:
 *   - exists: boolean - True if the audio mapping exists
 *   - isValid: boolean - True if the reference appears valid (will render button)
 *   - path: string | null - The mapped audio path if valid
 */
export interface AudioValidationResult {
  exists: boolean
  isValid: boolean
  path: string | null
}

export function useAudioValidation(audioId: string | undefined): AudioValidationResult {
  const [result, setResult] = useState<AudioValidationResult>({
    exists: false,
    isValid: false,
    path: null,
  })

  useEffect(() => {
    if (!audioId) {
      setResult({ exists: false, isValid: false, path: null })
      return
    }

    // Check if audio mapping exists
    const mapped = audioMapping[audioId]
    if (!mapped) {
      setResult({ exists: false, isValid: false, path: null })
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[Audio Validation] Audio ID not in mapping: "${audioId}"`)
      }
      return
    }

    // Construct path (assuming mapping stores the filename/id)
    const audioPath = `/audio/words/${mapped}.mp3`

    // In a browser environment, we could check file existence with HEAD request
    // For now, we just validate the mapping exists
    setResult({
      exists: true,
      isValid: true,
      path: audioPath,
    })
  }, [audioId])

  return result
}
