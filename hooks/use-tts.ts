'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { stripArabicDiacritics } from '@/lib/arabic-tts'
import { audioMapping } from '@/lib/audio-mapping'

interface UseTTSReturn {
  speak: (text: string, audioPath?: string) => void
  stop: () => void
  isSpeaking: boolean
  isSupported: boolean
}

export function useTTS(): UseTTSReturn {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [audioUnlocked, setAudioUnlocked] = useState(false)

  useEffect(() => {
    setIsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window)
    setAudioUnlocked(localStorage.getItem('kids_audio_unlocked') === 'true')

    const onAudioUnlocked = () => setAudioUnlocked(true)
    window.addEventListener('kids-audio-unlocked', onAudioUnlocked)
    return () => window.removeEventListener('kids-audio-unlocked', onAudioUnlocked)
  }, [])

  const speak = useCallback((text: string, audioPath?: string) => {
    if (!isSupported || !audioUnlocked) return

    const cleanedText = text
      .replace(/[؛;]/g, "،")
      .replace(/\s+/g, " ")
      .trim()

    // Keep diacritics for better Arabic pronunciation quality in TTS.
    const spokenText = cleanedText
    // Normalize lookup key so punctuation variants still map to the same clip.
    const lookupKey = stripArabicDiacritics(cleanedText)
      .replace(/[!؟?.:,،؛]/g, "")
      .trim()

    const stopAll = () => {
      window.speechSynthesis.cancel()
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current = null
      }
      setIsSpeaking(false)
    }

    stopAll()

    // Our real word clips are saved using English IDs (word-XXX.mp3) for stability.
    const wordId = audioMapping[lookupKey] || audioMapping[spokenText]
    let defaultWordPath = `/audio/words/${encodeURIComponent(lookupKey)}.mp3`
    
    if (wordId) {
      if (
        wordId.startsWith('phrase-') ||
        wordId.startsWith('official_intro_') ||
        wordId.startsWith('welcome_intro_')
      ) {
        defaultWordPath = `/audio/ui/${wordId}.mp3`
      } else {
        defaultWordPath = `/audio/words/${wordId}.mp3`
      }
    }
    
    // Candidates: 1. Passed audioPath, 2. Mapped ID path, 3. Original text path (old fallback)
    const clipCandidates = audioPath ? [audioPath, defaultWordPath] : [defaultWordPath]
    
    if (wordId && !audioPath) {
      // If we have a mapping, also try the encoded text path just in case
      clipCandidates.push(`/audio/words/${encodeURIComponent(spokenText)}.mp3`)
    }
    const uniqueClipCandidates = [...new Set(clipCandidates)]
    
    // Prefer recorded neural clips for all content; browser TTS is lower quality.
    const ttsFallbackEnabled = process.env.NEXT_PUBLIC_ENABLE_TTS_FALLBACK === 'true'

    const tryPlayClip = (index: number) => {
      if (index >= uniqueClipCandidates.length) {
        if (!ttsFallbackEnabled) {
          console.warn('[AUDIO] Missing real audio clip and TTS fallback is disabled:', spokenText)
          return
        }

        const utterance = new SpeechSynthesisUtterance(spokenText)
        utteranceRef.current = utterance

        const voices = window.speechSynthesis.getVoices()
        const voicePriority = ['ar-SA', 'ar-EG', 'ar']
        const arabicVoice =
          voicePriority
            .map((lang) => voices.find((voice) => voice.lang.toLowerCase().startsWith(lang.toLowerCase())))
            .find(Boolean) ||
          voices.find((voice) => /arabic|عربي/i.test(voice.name))

        if (arabicVoice) {
          utterance.voice = arabicVoice
        }

        utterance.lang = arabicVoice?.lang || 'ar-SA'
        utterance.rate = 0.72
        utterance.pitch = 0.98
        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)
        window.speechSynthesis.speak(utterance)
        return
      }

      // Bust cache to avoid stale audio when regenerating clips locally.
      const baseSrc = uniqueClipCandidates[index]
      const cacheBustedSrc = `${baseSrc}${baseSrc.includes('?') ? '&' : '?'}v=2`
      const audio = new Audio(cacheBustedSrc)
      audioRef.current = audio
      let movedNext = false
      const moveNextOnce = () => {
        if (movedNext) return
        movedNext = true
        tryPlayClip(index + 1)
      }
      audio.onplay = () => setIsSpeaking(true)
      audio.onended = () => {
        setIsSpeaking(false)
        audioRef.current = null
      }
      audio.onerror = () => {
        moveNextOnce()
      }
      void audio.play().catch(() => {
        moveNextOnce()
      })
    }

    tryPlayClip(0)
  }, [isSupported, audioUnlocked])

  const stop = useCallback(() => {
    if (!isSupported) return
    window.speechSynthesis.cancel()
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setIsSpeaking(false)
  }, [isSupported])

  // Load voices when they become available
  useEffect(() => {
    if (isSupported) {
      window.speechSynthesis.getVoices()
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices()
      }
    }
  }, [isSupported])

  return { speak, stop, isSpeaking, isSupported }
}
