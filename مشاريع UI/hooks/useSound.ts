'use client'

import { useCallback } from 'react'
import { playSound, setVolume, getVolume } from '@/lib/sounds'

export const useSound = () => {
  const play = useCallback(async (soundName: 'success' | 'click' | 'correct' | 'wrong' | 'levelUp' | 'collect' | 'gameOver' | 'letterSound' | 'swoosh' | 'celebrate', letterParam?: string) => {
    await playSound(soundName, letterParam)
  }, [])

  return {
    play,
    setVolume,
    getVolume,
  }
}
