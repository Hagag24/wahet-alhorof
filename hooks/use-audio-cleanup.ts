'use client'

import { useEffect } from 'react'
import { audioManager } from '@/lib/audio/audio-manager'

/**
 * useAudioCleanup — Stop audio when component unmounts or route changes.
 * 
 * Usage:
 *   useAudioCleanup() // in any component that navigates away
 * 
 * This ensures that audio doesn't continue playing when the user
 * navigates to a different route or the component unmounts.
 */
export function useAudioCleanup() {
  useEffect(() => {
    return () => {
      // Stop audio when component unmounts
      audioManager.stop()
    }
  }, [])
}
