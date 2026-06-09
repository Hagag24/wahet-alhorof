# Client Feedback Fixes Checklist

| Issue | Status | Notes | Files Changed |
| --- | --- | --- | --- |
| Intro back button missing | Done | Added visible previous navigation; first scene shows disabled previous state. | `components/screens/splash-screen.tsx` |
| Intro next navigation unclear | Done | Added manual next/start controls alongside replay. | `components/screens/splash-screen.tsx` |
| Intro replay missing | Done | Added replay/play button for every scene. | `components/screens/splash-screen.tsx` |
| Scene 1 mobile audio not working | Done | Audio now starts from user interaction and stores `kids_audio_unlocked`. | `components/screens/splash-screen.tsx` |
| Scene 2 audio incomplete | Done | UI/manifest text is complete, including the full researcher attribution, and the MP3 was regenerated. | `components/screens/splash-screen.tsx`, `audio-manifest.json`, `public/audio/ui/official_intro_scene_2.mp3` |
| Scene 2 missing researcher line | Done | Text includes `إعداد الباحث: مصطفى أحمد محمد حسن حسان`; MP3 was regenerated from the updated `ttsText`. | `components/screens/splash-screen.tsx`, `audio-manifest.json`, `public/audio/ui/official_intro_scene_2.mp3` |
| Scene 3 audio incomplete | Done | Scene advances only on audio `ended`; MP3 was regenerated from the updated `ttsText`. | `components/screens/splash-screen.tsx`, `audio-manifest.json`, `public/audio/ui/official_intro_scene_3.mp3` |
| Scene 5 audio incomplete | Done | Scene advances only on audio `ended`; MP3 was regenerated from the updated `ttsText`. | `components/screens/splash-screen.tsx`, `audio-manifest.json`, `public/audio/ui/welcome_intro_scene_2.mp3` |
| Scene 6 audio incomplete | Done | Scene 6 says `هيا بنا ننطلق!`; `هيا` is shaped as `هَيَّا` in spoken text and MP3 was regenerated. | `components/screens/splash-screen.tsx`, `audio-manifest.json`, `public/audio/ui/welcome_intro_scene_3.mp3` |
| Fixed intro timers cut audio | Done | Removed fixed scene durations; transition waits for `audio.onended` plus small delay. | `components/screens/splash-screen.tsx`, `scripts/verify-pdf-change-request.cjs` |
| Audio failure silently skips | Done | Intro shows visible fallback error and does not auto-skip on audio failure. | `components/screens/splash-screen.tsx` |
| Lesson 1 objectives not spoken | Done | Objective cards remain clickable, and the objectives narration MP3 now exists and is wired. | `components/screens/lesson-hub.tsx`, `audio-manifest.json`, `public/audio/ui/lesson-1-objectives.mp3` |
| Warmup must be inside lesson | Done | Warmup is inside Lesson 1 after objectives and before story; narration MP3 now exists and is wired. | `components/screens/lesson-hub.tsx`, `public/audio/ui/lesson-1-warmup-jaddi.mp3` |
| Warmup must behave as a game | Done | Shows `ج _ ي`, choices `ب/د/ر`, shakes wrong answer, completes only on `د`. | `components/screens/lesson-hub.tsx`, `scripts/verify-pdf-change-request.cjs` |
| Story must be one continuous scene | Done | Hub and story page use one continuous story and the generated male MP3 exists. | `components/screens/lesson-hub.tsx`, `components/screens/story-player.tsx`, `data/lessons.ts`, `audio-manifest.json`, `public/audio/stories/lesson-1-full.mp3` |
| Characters/words inside lesson | Done | Added section after story and before explanation. | `components/screens/lesson-hub.tsx` |
| Explanation inside lesson | Done | Explanation cards are inside the flow, and the explanation narration MP3 now exists and is wired. | `components/screens/lesson-hub.tsx`, `audio-manifest.json`, `public/audio/ui/lesson-1-explanation.mp3` |
| Applications/games inside lesson | Done | Games section is inside Lesson 1 hub after explanation. | `components/screens/lesson-hub.tsx` |
| Level 2 not unlocking | Done | Game page now waits for localStorage progress before redirecting; functional storage updates use current state. | `app/lessons/[lessonId]/game/[gameIndex]/game-page-client.tsx`, `hooks/use-local-storage.ts` |
| Level 3 not unlocking | Done | Same unlock pipeline fixed for chained level progress. | `app/lessons/[lessonId]/game/[gameIndex]/game-page-client.tsx`, `hooks/use-local-storage.ts` |
| Level 4 not unlocking | Done | Same unlock pipeline fixed for chained level progress. | `app/lessons/[lessonId]/game/[gameIndex]/game-page-client.tsx`, `hooks/use-local-storage.ts` |
| Level 5 not unlocking | Done | Same unlock pipeline fixed for chained level progress. | `app/lessons/[lessonId]/game/[gameIndex]/game-page-client.tsx`, `hooks/use-local-storage.ts` |
| Lessons 2-4 lock behavior | Done | Existing lesson lock behavior was not removed. | No direct change |
| Warmup missing-sound button silent | Done | `اسمع الصوت الناقص` now calls a generated MP3 instead of relying on a missing dynamic lookup. | `components/screens/lesson-hub.tsx`, `audio-manifest.json`, `public/audio/ui/phrase-036.mp3` |
| Activity/game audio mappings incomplete | Done | Added coverage for visible game question audio texts and generated missing mapped word/phrase MP3s. Manifest now has zero missing/zero-byte files. | `lib/audio-mapping.ts`, `audio-manifest.json`, `public/audio/words/word-018.mp3`, `public/audio/words/word-019.mp3`, `public/audio/words/word-020.mp3`, `public/audio/words/word-021.mp3`, `public/audio/words/word-022.mp3`, `public/audio/ui/phrase-039.mp3`, `public/audio/ui/phrase-040.mp3`, `public/audio/ui/phrase-041.mp3`, `public/audio/ui/phrase-042.mp3`, `public/audio/ui/phrase-043.mp3` |
| Tests for requested behavior | Done | Updated verification script for intro, lesson order, warmup, story, unlock load, manifest entries, and game audio mappings/files. | `scripts/verify-pdf-change-request.cjs` |

## Generated Audio

These previously missing files now physically exist:

- `public/audio/stories/lesson-1-full.mp3` - 250416 bytes
- `public/audio/ui/lesson-1-warmup-jaddi.mp3` - 114768 bytes
- `public/audio/ui/lesson-1-objectives.mp3` - 144576 bytes
- `public/audio/ui/lesson-1-explanation.mp3` - 141120 bytes

The Lesson 1 story and explanation voices are set to male voice `ar-EG-ShakirNeural`.

Additional activity/game clips generated or regenerated:

- `public/audio/ui/phrase-036.mp3` - 19440 bytes
- `public/audio/ui/phrase-037.mp3` - 37440 bytes
- `public/audio/ui/phrase-038.mp3` - 40320 bytes
- `public/audio/ui/phrase-039.mp3` - 52272 bytes
- `public/audio/ui/phrase-040.mp3` - 55584 bytes
- `public/audio/ui/phrase-041.mp3` - 54432 bytes
- `public/audio/ui/phrase-042.mp3` - 20736 bytes
- `public/audio/ui/phrase-043.mp3` - 45936 bytes
- `public/audio/words/word-018.mp3` - 11520 bytes
- `public/audio/words/word-019.mp3` - 11952 bytes
- `public/audio/words/word-020.mp3` - 12672 bytes
- `public/audio/words/word-021.mp3` - 12816 bytes
- `public/audio/words/word-022.mp3` - 12384 bytes
- `public/audio/words/word-048.mp3` - 11376 bytes
- `public/audio/words/word-049.mp3` - 13248 bytes

## Existing Intro Audio

These intro files exist and are registered in `audio-manifest.json`:

- `public/audio/ui/official_intro_scene_1.mp3`
- `public/audio/ui/official_intro_scene_2.mp3`
- `public/audio/ui/official_intro_scene_3.mp3`
- `public/audio/ui/welcome_intro_scene_1.mp3`
- `public/audio/ui/welcome_intro_scene_2.mp3`
- `public/audio/ui/welcome_intro_scene_3.mp3`

If the existing MP3 content is stale or incomplete, regenerate those files from the updated manifest `ttsText`.

## Missing Images

The current project has intro and story images, but lesson-specific image folders mostly contain placeholders only. Optional future assets:

- Lesson 1 objective/explanation illustrations
- Lesson 1 word cards for `مريم`, `يوسف`, `جدي`, `دراجة`, `المتجر`, `حديقة`
- A single cover image for the continuous Lesson 1 story
