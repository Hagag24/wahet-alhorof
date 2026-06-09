'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  getTTSEngine,
  speakLetter,
  speakWord,
  speakInstruction,
  speakFeedback,
  speakNumber,
  type TTSOptions,
} from '@/lib/tts'

export interface UseTTSOptions {
  volume?: number
  autoSpeak?: boolean
}

export function useTTS(options: UseTTSOptions = {}) {
  const [isSupported, setIsSupported] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [volume, setVolume] = useState(options.volume ?? 1.0)

  useEffect(() => {
    const tts = getTTSEngine()
    setIsSupported(tts.getIsSupported())
    tts.setVolume(volume)
  }, [volume])

  const speak = useCallback(async (text: string, ttsOptions?: TTSOptions) => {
    setIsSpeaking(true)
    const tts = getTTSEngine()
    await tts.speak(text, ttsOptions)
    setIsSpeaking(false)
  }, [])

  const stop = useCallback(() => {
    const tts = getTTSEngine()
    tts.stop()
    setIsSpeaking(false)
  }, [])

  const pause = useCallback(() => {
    const tts = getTTSEngine()
    tts.pause()
  }, [])

  const resume = useCallback(() => {
    const tts = getTTSEngine()
    tts.resume()
  }, [])

  return {
    // Basic methods
    speak,
    speakLetter,
    speakWord,
    speakInstruction,
    speakFeedback,
    speakNumber,
    stop,
    pause,
    resume,

    // State
    isSupported,
    isSpeaking,
    volume,
    setVolume,
  }
}
