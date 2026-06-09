'use client'

import { useCallback, useRef, useEffect, useState } from 'react'
import { SoundType, SoundProfile } from '@/types'

// Simple sound generator using Web Audio API
export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const [soundProfile, setSoundProfileState] = useState<SoundProfile>('quiet')

  useEffect(() => {
    const stored = localStorage.getItem('kids_sound_profile')
    if (stored === 'quiet' || stored === 'normal' || stored === 'party') {
      setSoundProfileState(stored)
    }
  }, [])

  const setSoundProfile = useCallback((profile: SoundProfile) => {
    setSoundProfileState(profile)
    localStorage.setItem('kids_sound_profile', profile)
  }, [])

  const getVolumeMultiplier = useCallback(() => {
    if (soundProfile === 'quiet') return 0.45
    if (soundProfile === 'party') return 1.05
    return 1
  }, [soundProfile])

  useEffect(() => {
    // Initialize audio context on user interaction
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      }
      localStorage.setItem('kids_audio_unlocked', 'true')
      window.dispatchEvent(new Event('kids-audio-unlocked'))
    }

    window.addEventListener('click', initAudio, { once: true })
    window.addEventListener('touchstart', initAudio, { once: true })

    return () => {
      window.removeEventListener('click', initAudio)
      window.removeEventListener('touchstart', initAudio)
    }
  }, [])

  const playTone = useCallback(async (frequency: number, duration: number, type: OscillatorType = 'sine') => {
    const ctx = audioContextRef.current
    if (!ctx) return

    if (ctx.state === 'suspended') {
      await ctx.resume()
    }

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.value = frequency
    oscillator.type = type

    const volume = 0.3 * getVolumeMultiplier()
    gainNode.gain.setValueAtTime(volume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)
  }, [getVolumeMultiplier])

  const playApplause = useCallback(async () => {
    const ctx = audioContextRef.current
    if (!ctx) return
    if (ctx.state === 'suspended') {
      await ctx.resume()
    }

    const duration = 0.55
    const bufferSize = Math.floor(ctx.sampleRate * duration)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i += 1) {
      const t = i / ctx.sampleRate
      const envelope = Math.exp(-7 * t)
      const burst = Math.random() > 0.92 ? 1 : 0.35
      data[i] = (Math.random() * 2 - 1) * envelope * burst
    }

    const noise = ctx.createBufferSource()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()

    noise.buffer = buffer
    filter.type = 'bandpass'
    filter.frequency.value = 1800
    filter.Q.value = 0.8
    gain.gain.value = 0.18 * getVolumeMultiplier()

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    noise.start()
  }, [getVolumeMultiplier])

  const playWhistle = useCallback(async () => {
    const ctx = audioContextRef.current
    if (!ctx) return
    if (ctx.state === 'suspended') {
      await ctx.resume()
    }

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(900, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.18)
    oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.35)
    gainNode.gain.setValueAtTime(0.001, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.22 * getVolumeMultiplier(), ctx.currentTime + 0.04)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.36)
  }, [getVolumeMultiplier])

  const playSound = useCallback((type: SoundType) => {
    switch (type) {
      case 'correct':
        // Happy ascending tones
        playTone(523.25, 0.15) // C5
        setTimeout(() => playTone(659.25, 0.15), 100) // E5
        setTimeout(() => playTone(783.99, 0.2), 200) // G5
        break
      case 'wrong':
        // Descending tone
        playTone(300, 0.3, 'triangle')
        break
      case 'click':
        playTone(800, 0.05, 'sine')
        break
      case 'reward':
        // Celebratory melody
        playTone(523.25, 0.1) // C5
        setTimeout(() => playTone(587.33, 0.1), 80) // D5
        setTimeout(() => playTone(659.25, 0.1), 160) // E5
        setTimeout(() => playTone(783.99, 0.1), 240) // G5
        setTimeout(() => playTone(1046.5, 0.2), 320) // C6
        break
      case 'finish':
        // Victory fanfare
        playTone(523.25, 0.15)
        setTimeout(() => playTone(659.25, 0.15), 150)
        setTimeout(() => playTone(783.99, 0.15), 300)
        setTimeout(() => playTone(1046.5, 0.3), 450)
        break
      case 'pop':
        playTone(600, 0.08, 'sine')
        break
      case 'applause':
        void playApplause()
        break
      case 'whistle':
        void playWhistle()
        break
    }
  }, [playTone, playApplause, playWhistle])

  return { playSound, soundProfile, setSoundProfile }
}
