'use client'

/**
 * Audio player state management - re-exports from audioManager
 */

import {
  audioManager,
  type AudioManagerState,
} from './audio/audio-manager'

export type ManagedAudioState = AudioManagerState

export function getManagedAudioState(): ManagedAudioState {
  return audioManager.getState()
}

export function subscribeManagedAudio(callback: (state: ManagedAudioState) => void) {
  return audioManager.subscribe(callback)
}

export async function playManagedAudio(id: string, src: string) {
  return audioManager.playUrl(src, { id })
}

export function pauseManagedAudio() {
  audioManager.pause()
}

export function resumeManagedAudio() {
  audioManager.resume()
}

export function stopManagedAudio() {
  audioManager.stop()
}

export function stopAllAudio() {
  audioManager.stop()
}
