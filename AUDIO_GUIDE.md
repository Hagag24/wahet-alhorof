# Audio Guide

## Profiles
- `quiet`: default profile for kids-sensitive listening.
- `normal`: balanced feedback sounds.
- `party`: celebratory mode with slightly higher effects.

The selected profile is stored in `localStorage` under `kids_sound_profile`.

## First-time audio unlock
- A startup gate asks the user to tap once to enable audio.
- Unlock state is stored in `localStorage` as `kids_audio_unlocked=true`.

## Regenerate audio files
Run:

```bash
python generate-audio.py
```

The script reads `audio-manifest.json` and regenerates all files under:
- `public/audio/words`
- `public/audio/stories`
- `public/audio/ui`

## Feedback voice source
- Game reinforcement audio is defined centrally in `lib/feedback-config.ts`.
- Clips are played directly from generated MP3 files, with short text fallback only when a file cannot play.
