'use client'

/**
 * useManagedAudio — React hook wrapping the global AudioManager singleton.
 *
 * Usage:
 *   const audio = useManagedAudio()
 *
 *   // Play an MP3 file:
 *   audio.playUrl('/audio/ui/phrase-034.mp3', { id: 'phrase-034' })
 *
 *   // Speak Arabic text (Web Speech API with MP3 preferred):
 *   audio.playText('مرحباً بك')
 *
 *   // Legacy helper (same shape as before):
 *   audio.play({ id: 'phrase-034', src: '/audio/ui/phrase-034.mp3' })
 *
 * Rules:
 * - Only one audio source may play at any time across the whole app.
 * - Calling any play* method automatically stops the previous audio.
 * - The hook subscribes to the global state and re-renders on change.
 * - On unmount the hook does NOT automatically stop audio unless the
 *   caller provides `stopOnUnmount: true` or calls stop() explicitly.
 */

import { useCallback, useEffect, useState } from 'react'
import {
  audioManager,
  type AudioManagerState,
  type PlayUrlOptions,
  type PlayTextOptions,
  type VoiceGender,
} from '@/lib/audio/audio-manager'
import {
  // Keep these re-exports so existing code that reads from audio-player
  // still compiles without modification.
  getManagedAudioState,
  subscribeManagedAudio,
  playManagedAudio,
  pauseManagedAudio,
  resumeManagedAudio,
  stopManagedAudio,
  stopAllAudio,
  type ManagedAudioState,
} from '@/lib/audio-player'

// ─── Legacy play args (backward compat) ───────────────────────────────────────

interface PlayArgs {
  id: string
  src: string
  onEnded?: () => void
  onError?: (error: string) => void
}

// ─── Hook options ─────────────────────────────────────────────────────────────

interface UseManagedAudioOptions {
  /** If true, stop audio when the component unmounts. Default: false */
  stopOnUnmount?: boolean
}

// ─── Return type ──────────────────────────────────────────────────────────────

interface UseManagedAudioReturn {
  // ── New unified state (from AudioManager) ──────────────────────────────
  managerState: AudioManagerState

  // ── New primary API ────────────────────────────────────────────────────
  /** Play an MP3 / audio URL. Stops anything currently playing. */
  playUrl: (src: string, options?: PlayUrlOptions) => Promise<void>
  /** Speak text via Web Speech API. Stops anything currently playing. */
  playText: (text: string, options?: PlayTextOptions) => void
  /** Replay the last played audio (same src/text). */
  replay: () => Promise<void>

  // ── Shared controls ────────────────────────────────────────────────────
  pause: () => void
  resume: () => Promise<void>
  stop: () => void
  stopAll: () => void

  // ── AudioManager state helpers ─────────────────────────────────────────
  /** True if the given id is currently playing. */
  isPlayingId: (id: string) => boolean
  /** True if the given id is currently paused. */
  isPausedId: (id: string) => boolean
  /** True if the given id is active (playing or paused). */
  isActiveId: (id: string) => boolean

  // ── Legacy API (kept for backward compatibility) ───────────────────────
  /** @deprecated Use playUrl() instead. */
  state: ManagedAudioState
  /** @deprecated Use playUrl() instead. Calls playManagedAudio from lib/audio-player. */
  play: (args: PlayArgs) => Promise<void>
  /** Toggle: if this id is playing → pause; if paused → resume; else → play */
  toggle: (args: PlayArgs) => Promise<void>
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useManagedAudio(
  options: UseManagedAudioOptions = {}
): UseManagedAudioReturn {
  const { stopOnUnmount = false } = options

  // New state from AudioManager.
  const [managerState, setManagerState] = useState<AudioManagerState>(
    audioManager.getState
  )

  // Legacy state from audio-player (for code that still reads audio.state).
  const [state, setState] = useState<ManagedAudioState>(getManagedAudioState)

  // Subscribe to both state sources.
  useEffect(() => {
    const unsubManager = audioManager.subscribe(setManagerState)
    const unsubLegacy = subscribeManagedAudio(setState)
    return () => {
      unsubManager()
      unsubLegacy()
    }
  }, [])

  // Optional: stop on unmount.
  useEffect(() => {
    if (!stopOnUnmount) return
    return () => { audioManager.stop() }
  }, [stopOnUnmount])

  // ── New primary API ──────────────────────────────────────────────────────

  const playUrl = useCallback(
    (src: string, opts?: PlayUrlOptions) => audioManager.playUrl(src, opts),
    []
  )

  const playText = useCallback(
    (text: string, opts?: PlayTextOptions) => audioManager.playText(text, opts),
    []
  )

  const replay = useCallback(() => audioManager.replay(), [])

  // ── Shared controls ──────────────────────────────────────────────────────

  const pause = useCallback(() => audioManager.pause(), [])
  const resume = useCallback(() => audioManager.resume(), [])
  const stop = useCallback(() => audioManager.stop(), [])
  const stopAll = useCallback(() => audioManager.stop(), [])

  // ── State helpers ────────────────────────────────────────────────────────

  const isPlayingId = useCallback(
    (id: string) => audioManager.isPlayingId(id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [managerState]
  )

  const isPausedId = useCallback(
    (id: string) => audioManager.isPausedId(id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [managerState]
  )

  const isActiveId = useCallback(
    (id: string) => audioManager.isActiveId(id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [managerState]
  )

  // ── Legacy helpers ───────────────────────────────────────────────────────

  const play = useCallback(
    async (args: PlayArgs) => {
      await playManagedAudio(args.id, args.src)
    },
    []
  )

  const toggle = useCallback(
    async (args: PlayArgs) => {
      const current = getManagedAudioState()
      if (current.currentId === args.id && current.isPlaying) {
        pauseManagedAudio()
      } else if (current.currentId === args.id && current.isPaused) {
        await resumeManagedAudio()
      } else {
        await playManagedAudio(args.id, args.src)
      }
    },
    []
  )

  return {
    managerState,
    playUrl,
    playText,
    replay,
    pause,
    resume,
    stop,
    stopAll,
    isPlayingId,
    isPausedId,
    isActiveId,
    // legacy
    state,
    play,
    toggle,
  }
}
