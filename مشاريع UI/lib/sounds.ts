'use client'

import * as Tone from 'tone'

// Initialize Tone.js
let isInitialized = false

const initTone = async () => {
  if (isInitialized) return
  await Tone.start()
  isInitialized = true
}

// Sound Effects Library
export const sounds = {
  // Success/Positive sounds
  success: async () => {
    await initTone()
    const synth = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.1 },
    }).toDestination()

    synth.triggerAttackRelease('C4', '8n')
    synth.triggerAttackRelease('E4', '8n', '+0.1')
    synth.triggerAttackRelease('G4', '8n', '+0.2')
  },

  // Click/Button sound
  click: async () => {
    await initTone()
    const synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.002, decay: 0.05, sustain: 0, release: 0.05 },
    }).toDestination()

    synth.triggerAttackRelease('A4', '16n')
  },

  // Correct answer sound
  correct: async () => {
    await initTone()
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'square' },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.1 },
    }).toDestination()

    synth.triggerAttackRelease('G4', '8n')
    synth.triggerAttackRelease('C5', '8n', '+0.08')
    synth.triggerAttackRelease('E5', '8n', '+0.16')
  },

  // Wrong answer sound
  wrong: async () => {
    await initTone()
    const synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 },
    }).toDestination()

    synth.triggerAttackRelease('D3', '16n')
    synth.triggerAttackRelease('C3', '16n', '+0.05')
  },

  // Level up/Achievement sound
  levelUp: async () => {
    await initTone()
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.01, decay: 0.15, sustain: 0, release: 0.1 },
    }).toDestination()

    synth.triggerAttackRelease('C4', '16n')
    synth.triggerAttackRelease('D4', '16n', '+0.05')
    synth.triggerAttackRelease('E4', '16n', '+0.1')
    synth.triggerAttackRelease('G4', '8n', '+0.15')
    synth.triggerAttackRelease('C5', '8n', '+0.3')
  },

  // Coin/Star collect sound
  collect: async () => {
    await initTone()
    const synth = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.005, decay: 0.08, sustain: 0, release: 0.08 },
    }).toDestination()

    synth.triggerAttackRelease('F5', '16n')
    synth.triggerAttackRelease('A5', '16n', '+0.04')
  },

  // Game over/Negative sound
  gameOver: async () => {
    await initTone()
    const synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.1 },
    }).toDestination()

    synth.triggerAttackRelease('A3', '8n')
    synth.triggerAttackRelease('G3', '8n', '+0.1')
    synth.triggerAttackRelease('F3', '8n', '+0.2')
  },

  // Letter/Alphabet sound (with pronunciation simulation)
  letterSound: async (arabicLetter: string) => {
    await initTone()
    const synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.02, decay: 0.15, sustain: 0.05, release: 0.1 },
    }).toDestination()

    // Map letters to different pitches for variety
    const pitchMap: Record<string, string> = {
      ا: 'C4',
      ب: 'D4',
      ت: 'E4',
      ث: 'F4',
      ج: 'G4',
      ح: 'A4',
      خ: 'B4',
      د: 'C5',
      ذ: 'D5',
      ر: 'E5',
      ز: 'F5',
      س: 'G5',
      ش: 'A5',
      ص: 'B5',
      ض: 'C6',
      ط: 'D6',
      ظ: 'E6',
      ع: 'F6',
      غ: 'G6',
      ف: 'A6',
      ق: 'B6',
      ك: 'C7',
      ل: 'D7',
      م: 'E7',
      ن: 'F7',
      ه: 'G7',
      و: 'A7',
      ي: 'B7',
    }

    const pitch = pitchMap[arabicLetter] || 'C4'
    synth.triggerAttackRelease(pitch, '0.5')
  },

  // Swoosh/UI transition sound
  swoosh: async () => {
    await initTone()
    const synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.05 },
    }).toDestination()

    synth.triggerAttackRelease('A4', '32n')
    synth.triggerAttackRelease('B4', '32n', '+0.02')
    synth.triggerAttackRelease('C5', '32n', '+0.04')
  },

  // Celebration/Confetti sound
  celebrate: async () => {
    await initTone()
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.1 },
    }).toDestination()

    // Play a cheerful chord progression
    synth.triggerAttackRelease('C4', '16n')
    synth.triggerAttackRelease('E4', '16n', '+0.02')
    synth.triggerAttackRelease('G4', '16n', '+0.04')
    
    synth.triggerAttackRelease('E4', '16n', '+0.1')
    synth.triggerAttackRelease('G4', '16n', '+0.12')
    synth.triggerAttackRelease('C5', '16n', '+0.14')
    
    synth.triggerAttackRelease('G4', '8n', '+0.25')
    synth.triggerAttackRelease('C5', '8n', '+0.27')
    synth.triggerAttackRelease('E5', '8n', '+0.29')
  },
}

// Utility function to safely play sounds
export const playSound = async (soundName: keyof typeof sounds, param?: string) => {
  try {
    if (soundName === 'letterSound' && param) {
      await sounds[soundName](param)
    } else {
      await sounds[soundName as Exclude<keyof typeof sounds, 'letterSound'>]()
    }
  } catch (error) {
    console.error('[v0] Sound playback error:', error)
  }
}

// Volume control
let masterVolume = 0.3

export const setVolume = (volume: number) => {
  masterVolume = Math.max(0, Math.min(1, volume))
  Tone.Destination.volume.value = Tone.gainToDb(masterVolume)
}

export const getVolume = () => masterVolume
