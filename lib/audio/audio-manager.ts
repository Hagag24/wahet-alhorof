/**
 * AudioManager — Global singleton audio controller.
 *
 * Guarantees that ONLY ONE audio source speaks/plays at any time across the
 * whole application, regardless of whether it is an MP3 file or Web Speech API
 * text-to-speech.
 *
 * SSR / static-export safe: all browser APIs are guarded with
 *   `typeof window !== "undefined"` checks.
 *
 * Usage (module level, any file):
 *   import { audioManager } from '@/lib/audio/audio-manager'
 *   audioManager.playUrl('/audio/ui/phrase-001.mp3', { id: 'phrase-001' })
 *   audioManager.playText('مرحباً بك')
 *   audioManager.stop()
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export type AudioKind = 'url' | 'tts' | 'idle';

export interface AudioManagerState {
  /** The id/key of the currently active audio, or null if idle. */
  currentId: string | null;
  /** The src URL of the currently playing MP3, or null. */
  currentSrc: string | null;
  /** The text being spoken via TTS, or null. */
  currentText: string | null;
  /** What is currently active. */
  kind: AudioKind;
  isPlaying: boolean;
  isPaused: boolean;
  duration: number;
  currentTime: number;
  error: string | null;
}

export interface PlayUrlOptions {
  /** Stable id used to identify this audio across renders. Defaults to src. */
  id?: string;
  onEnded?: () => void;
  onError?: (message: string) => void;
}

export type VoiceGender = 'male' | 'female';

export interface PlayTextOptions {
  /** Stable id used to identify this TTS utterance. Defaults to the text. */
  id?: string;
  /** BCP-47 language tag. Defaults to 'ar-SA'. */
  lang?: string;
  /** Speech rate, 0–2. Defaults to 0.8. */
  rate?: number;
  /** Pitch, 0–2. Defaults to 1. */
  pitch?: number;
  /** Preferred voice gender for Egyptian Arabic voices. */
  voiceGender?: VoiceGender;
  onEnded?: () => void;
  onError?: (message: string) => void;
}

type StateListener = (state: AudioManagerState) => void;

// ─── Singleton state ─────────────────────────────────────────────────────────

const _IDLE_STATE: AudioManagerState = {
  currentId: null,
  currentSrc: null,
  currentText: null,
  kind: 'idle',
  isPlaying: false,
  isPaused: false,
  duration: 0,
  currentTime: 0,
  error: null,
};

let _state: AudioManagerState = { ..._IDLE_STATE };
let _listeners: StateListener[] = [];

// Active HTMLAudioElement (for URL playback).
let _audio: HTMLAudioElement | null = null;

// Snapshot of the last play*() call so replay() works.
type LastCall =
  | { kind: 'url'; src: string; options: PlayUrlOptions }
  | { kind: 'tts'; text: string; options: PlayTextOptions }
  | null;
let _lastCall: LastCall = null;

// ─── Internal helpers ────────────────────────────────────────────────────────

function _emit(): void {
  const snap = { ..._state };
  _listeners.forEach((fn) => {
    try { fn(snap) } catch { /* listener must not crash manager */ }
  });
}

function _patch(patch: Partial<AudioManagerState>): void {
  _state = { ..._state, ...patch };
  _emit();
}

/** Tear down the active HTMLAudioElement without touching _state. */
function _teardownAudio(): void {
  if (!_audio) return;
  const el = _audio;
  _audio = null;
  el.onplay = null;
  el.onpause = null;
  el.onended = null;
  el.onerror = null;
  el.ontimeupdate = null;
  el.ondurationchange = null;
  el.pause();
  el.src = '';
  try { el.load() } catch { /* ignore empty-src load error */ }
}

/** Cancel any active Web Speech API utterance. */
function _teardownTTS(): void {
  if (typeof window === 'undefined') return;
  if ('speechSynthesis' in window) {
    try { window.speechSynthesis.cancel() } catch { /* ignore */ }
  }
}

/** Stop everything and set state back to IDLE. */
function _stopAll(): void {
  _teardownAudio();
  _teardownTTS();
  _patch({ ..._IDLE_STATE });
}

/**
 * Select the best Arabic voice for the given gender preference.
 * Prefers Egyptian voices, then any Arabic voice, with gender hints.
 */
function _selectBestArabicVoice(voiceGender?: VoiceGender): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const normalizedGender = voiceGender ?? null;

  const arabicVoices = voices.filter((voice) => {
    const lang = voice.lang.toLowerCase();
    const name = voice.name.toLowerCase();
    return lang.startsWith('ar') || name.includes('arabic') || name.includes('عربي');
  });

  const egyptianVoices = arabicVoices.filter((voice) => {
    const lang = voice.lang.toLowerCase();
    const name = voice.name.toLowerCase();
    return lang.includes('ar-eg') || name.includes('egypt') || name.includes('egyptian') || name.includes('مصر');
  });

  const maleHints = ['shakir', 'naayf', 'hamed', 'male', 'رجل', 'ولد'];
  const femaleHints = ['salma', 'hoda', 'zeina', 'female', 'امرأة', 'بنت'];

  const genderHints =
    normalizedGender === 'male'
      ? maleHints
      : normalizedGender === 'female'
        ? femaleHints
        : [];

  const findByGender = (list: SpeechSynthesisVoice[]) => {
    if (!genderHints.length) return null;
    return (
      list.find((voice) => {
        const name = voice.name.toLowerCase();
        return genderHints.some((hint) => name.includes(hint));
      }) ?? null
    );
  };

  return (
    findByGender(egyptianVoices) ??
    findByGender(arabicVoices) ??
    egyptianVoices[0] ??
    arabicVoices[0] ??
    null
  );
}

// ─── Public singleton class ──────────────────────────────────────────────────

class AudioManagerClass {
  // ── Subscription ────────────────────────────────────────────────────────

  /**
   * Subscribe to state changes. Returns an unsubscribe function.
   *
   *   const unsub = audioManager.subscribe(state => setMyState(state))
   *   // later:
   *   unsub()
   */
  subscribe(listener: StateListener): () => void {
    _listeners = [..._listeners, listener];
    return () => {
      _listeners = _listeners.filter((fn) => fn !== listener);
    };
  }

  // ── State accessors ──────────────────────────────────────────────────────

  getState(): AudioManagerState {
    return { ..._state };
  }

  isPlaying(): boolean {
    return _state.isPlaying;
  }

  /** True if the given id is the currently active audio and is playing. */
  isPlayingId(id: string): boolean {
    return _state.currentId === id && _state.isPlaying;
  }

  /** True if the given id is the currently active audio and is paused. */
  isPausedId(id: string): boolean {
    return _state.currentId === id && _state.isPaused;
  }

  /** True if the given id is active (playing or paused). */
  isActiveId(id: string): boolean {
    return _state.currentId === id && (_state.isPlaying || _state.isPaused);
  }

  // ── Playback ─────────────────────────────────────────────────────────────

  /**
   * Play an MP3 (or any URL-addressable audio file).
   * Automatically stops whatever is currently playing.
   */
  async playUrl(src: string, options: PlayUrlOptions = {}): Promise<void> {
    if (typeof window === 'undefined') return;

    const id = options.id ?? src;
    _lastCall = { kind: 'url', src, options };

    // Stop existing audio first.
    _stopAll();

    _patch({
      currentId: id,
      currentSrc: src,
      currentText: null,
      kind: 'url',
      isPlaying: false,
      isPaused: false,
      duration: 0,
      currentTime: 0,
      error: null,
    });

    const audio = new Audio(src);
    _audio = audio;

    audio.onplay = () => {
      if (_audio !== audio) return;
      _patch({ isPlaying: true, isPaused: false, error: null });
    };

    audio.onpause = () => {
      if (_audio !== audio) return;
      if (!audio.ended) {
        _patch({ isPlaying: false, isPaused: true });
      }
    };

    audio.ondurationchange = () => {
      if (_audio !== audio) return;
      _patch({ duration: audio.duration || 0 });
    };

    audio.ontimeupdate = () => {
      if (_audio !== audio) return;
      _patch({ currentTime: audio.currentTime });
    };

    audio.onended = () => {
      if (_audio !== audio) return;
      _patch({ isPlaying: false, isPaused: false, currentTime: 0 });
      _teardownAudio();
      options.onEnded?.();
    };

    audio.onerror = () => {
      if (_audio !== audio) return;
      const msg = `Audio error: ${src}`;
      _patch({ isPlaying: false, isPaused: false, error: msg });
      _teardownAudio();
      options.onError?.(msg);
    };

    try {
      await audio.play();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      _patch({ isPlaying: false, isPaused: false, error: msg });
      _teardownAudio();
      options.onError?.(msg);
    }
  }

  /**
   * Speak Arabic (or any) text using the Web Speech API.
   * Automatically stops whatever is currently playing.
   *
   * Falls back silently if speechSynthesis is unavailable.
   */
  playText(text: string, options: PlayTextOptions = {}): void {
    if (typeof window === 'undefined') return;
    if (!('speechSynthesis' in window)) {
      options.onError?.('speechSynthesis not supported');
      return;
    }

    const id = options.id ?? text;
    _lastCall = { kind: 'tts', text, options };

    // Stop existing audio first.
    _stopAll();

    _patch({
      currentId: id,
      currentSrc: null,
      currentText: text,
      kind: 'tts',
      isPlaying: true,
      isPaused: false,
      duration: 0,
      currentTime: 0,
      error: null,
    });

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang ?? 'ar-SA';
    utterance.rate = options.rate ?? 0.8;
    utterance.pitch = options.pitch ?? 1;

    const selectedVoice = _selectBestArabicVoice(options.voiceGender);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }

    utterance.onend = () => {
      // Only update state if this TTS is still the active one.
      if (_state.currentId === id && _state.kind === 'tts') {
        _patch({ ..._IDLE_STATE });
      }
      options.onEnded?.();
    };

    utterance.onerror = (evt) => {
      if (_state.currentId === id && _state.kind === 'tts') {
        _patch({ isPlaying: false, isPaused: false, error: evt.error });
      }
      options.onError?.(evt.error);
    };

    window.speechSynthesis.speak(utterance);
  }

  // ── Controls ─────────────────────────────────────────────────────────────

  /** Pause current audio (MP3 only; TTS cannot be paused in most browsers). */
  pause(): void {
    if (typeof window === 'undefined') return;
    if (_state.kind === 'url' && _audio && _state.isPlaying) {
      _audio.pause();
      // onpause handler updates state.
    }
    if (_state.kind === 'tts') {
      try { window.speechSynthesis.pause() } catch { /* ignore */ }
      _patch({ isPlaying: false, isPaused: true });
    }
  }

  /** Resume a paused audio. */
  async resume(): Promise<void> {
    if (typeof window === 'undefined') return;
    if (_state.kind === 'url' && _audio && _state.isPaused) {
      try {
        await _audio.play();
        // onplay handler updates state.
      } catch { /* leave state as-is */ }
    }
    if (_state.kind === 'tts' && _state.isPaused) {
      try { window.speechSynthesis.resume() } catch { /* ignore */ }
      _patch({ isPlaying: true, isPaused: false });
    }
  }

  /** Stop all audio and reset to IDLE. */
  stop(): void {
    if (typeof window === 'undefined') return;
    _stopAll();
  }

  /**
   * Replay the last played audio (same src/text and options).
   * No-op if nothing has been played yet.
   */
  async replay(): Promise<void> {
    if (!_lastCall) return;
    if (_lastCall.kind === 'url') {
      await this.playUrl(_lastCall.src, _lastCall.options);
    } else {
      this.playText(_lastCall.text, _lastCall.options);
    }
  }
}

// ─── Export singleton ────────────────────────────────────────────────────────

export const audioManager = new AudioManagerClass();

// ─── Convenience re-exports for backward compatibility ────────────────────────
// Existing code that imports from lib/audio-player still works.
// New code should import from here.

export type { StateListener as AudioStateListener };
