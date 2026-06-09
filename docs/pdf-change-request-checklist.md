# PDF Change Request Checklist

Source note: the named PDF was not found in `c:\Kids` or the Codex attachment folder during this pass, so this checklist is based on the pasted change request text.

Status key: Done, Partial, Needs asset/audio, Not found in current project.

## Global Behavior

| Requirement | Status | Notes |
| --- | --- | --- |
| Keep the existing project and architecture | Done | Changes were made inside the current Next app, data, hooks, and generic game route. |
| Add official cinematic app intro | Partial | Three official cinematic scenes and full credit text are implemented in `components/screens/splash-screen.tsx`; MP3 generation is still needed. |
| Add/update student welcome intro | Partial | Three student welcome scenes, welcome title, visible narration, animated letters, and start button are implemented; final illustrated art/audio still needed. |
| Games inside lesson flow | Done | `components/screens/lesson-hub.tsx` now presents lesson sections and games inside each lesson. |
| Lesson structure: objectives, warmup, story, words/characters, explanation, applications | Done | The lesson hub now shows the full ordered structure. |
| Sequential internal level locking | Done | Visible games unlock in order only after the previous level is mastered. |
| 80% mastery threshold | Done | Centralized in `lib/game-rules.ts` and used by progress and routing. |
| Wrong answer does not advance | Done | Active generic game router retries the same question after a wrong answer. |
| Wrong answer does not reveal correct answer | Done | Active router marks only the selected wrong option and resets for retry. |
| Correct answer advances with positive feedback | Done | Active router plays success sounds/voice and advances only after a correct answer. |
| Store progress after reload | Done | Existing localStorage progress now includes per-game mastery. |
| Fix missing audio places | Partial | Audio routing and manifest entries were updated; actual `public/audio` MP3 files are currently missing/deleted. |

## Audio Manifest

| Requirement | Status | Notes |
| --- | --- | --- |
| Use existing audio system | Done | Kept `audio-manifest.json`, `generate-audio.py`, `useTTS`, and `audioMapping`. |
| Default Arabic narrator voice `ar-EG-ShakirNeural` | Done | Existing manifest setting preserved; new intro entries use `ar-EG-ShakirNeural`. |
| Add required intro/welcome audio lines | Needs asset/audio | Added scene keys `official_intro_scene_1..3` and `welcome_intro_scene_1..3`; see `docs/intro-assets.md`. |
| Required story/word MP3 files | Partial | Existing story/word/UI clips are present; the six new intro MP3 files still need to be generated. |

## Lesson 1: هيا نتعلم يا جدي

| Requirement | Status | Notes |
| --- | --- | --- |
| Title | Done | Current lesson title matches. |
| Objectives map: خريطة الأبطال السحرية | Done | All five stations are present in lesson sections. |
| Warmup: رسالة الجد المفقودة | Partial | Present as warmup section; a custom bubble/missing-word mini-scene is not separately built. |
| Listening story: كتاب مريم ويوسف المتحرك | Partial | Story scenes and corrected wording are present; custom animation/audio assets still needed. |
| Replace "كشراء" with "مثل شراء" | Done | Story text uses "مثل شراء". |
| Explanation: سينما الأصوات مع مريم ويوسف | Partial | Present as explanation section; custom non-interactive animation still needs asset work. |
| Level 1 audio says shown word only | Done | Questions use `audioText` for `دراجة`, `يوسف`, `متجر`. |
| Level 1 answer positions | Done | `دراجة` option 3, `يوسف` option 2, `متجر` option 4. |
| Level 2 exact words: باب، حديقة، بيت | Done | Present in exact order with question+options pronunciation flag. |
| Level 2 صائد الأصوات المفقودة | Done | Present as Lesson 1 level 2 data. |
| Level 3 مريم correct option 3 | Done | Present. |
| Level 3 قفزة الحركات الذكية | Done | Present as level 3. |
| Level 3 مظلة يوسف الملونة | Partial | Added to level 3 title/description and Yusuf question; custom umbrella/rain animation still needed. |
| Level 4 قطار الحروف والمحطات | Done | Present as level 4. |
| Level 4 صيد النجوم - حرف الميم | Partial | Added as an internal question in level 4; custom night-sky star interaction still needed. |
| Level 5 بستان الحروف | Done | Present as level 5. |

## Lesson 2: أميرة وأسرتها السعيدة

| Requirement | Status | Notes |
| --- | --- | --- |
| Title | Done | Current lesson title matches. |
| Objectives: صيد الحركة / القلم السحري | Partial | Present in objectives section; custom animations still needed. |
| Warmup: صندوق المفاجآت | Partial | Present in warmup section; drag-to-house interaction still generic/not custom-built. |
| Listening story | Partial | Story scenes present; synchronized custom animation/audio assets still needed. |
| Explanation: رحلة أميرة السعيدة | Partial | Present in explanation section. |
| Level 1 سلة الحركات مع أميرة | Done | Present. |
| Level 2 محقق المقاطع السحرية | Done | Present; fixed أميرة syllable chips to match 4. |
| Level 3 مكعبات أميرة السحرية | Done | Present. |
| Level 4 محطة الأصوات المتشابهة | Done | Present. |
| Hide/delete levels 5, 6, 7 | Done | Marked `hidden: true` and filtered out of student flow. |
| Level 8 صائد الكلمات الصحيحة | Done | Present. |
| Level 9 محطة قطار الأصوات | Done | Present. |
| Level 10 كاشف الكلمة المختلفة | Partial | Present; custom colored-letter visualization still needed. |

## Lesson 3: عالم الحيوان

| Requirement | Status | Notes |
| --- | --- | --- |
| Title | Done | Current lesson title matches. |
| Required lesson structure | Done | Objectives, warmup, story, words, explanation, and games appear inside lesson. |
| Objectives: ألبوم حيوانات سامي السحري | Partial | Present in objectives section; custom animated video still needed. |
| Warmup: من خلف الشجرة؟ | Partial | Present in warmup section; custom shadow/roar interaction still needs assets/audio. |
| Listening story: ألبوم الغابة السحري | Partial | Story scenes present; custom living-room/TV animation still needs assets/audio. |
| Explanation: قطار الكلمات في غابة الحيوان | Partial | Present in explanation section. |
| Apply PDF game descriptions where present | Partial | Existing current levels are retained; the full PDF was not available for deeper comparison. |
| Remove levels marked احذفه | Not found in current project | No Lesson 3 hidden/delete markers were found in available source text. |

## Lesson 4: يوم في المدرسة

| Requirement | Status | Notes |
| --- | --- | --- |
| Title | Done | Current lesson title matches. |
| Required lesson structure | Done | Objectives, warmup, story, words, explanation, and games appear inside lesson. |
| Objectives: فيديو الألوان والكلمات الذكي | Partial | Present in objectives section; custom drawing-classroom video still needs assets. |
| Continue Lesson 4 PDF updates | Partial | Only the pasted request details were available; named PDF was not found for additional specifics. |

## Tests

| Requirement | Status | Notes |
| --- | --- | --- |
| Wrong answer does not advance | Done | Covered by `scripts/verify-pdf-change-request.cjs`. |
| Wrong answer does not reveal correct answer | Done | Covered by `scripts/verify-pdf-change-request.cjs`. |
| Correct answer advances | Done | Covered by `scripts/verify-pdf-change-request.cjs`. |
| 80% unlocks next level | Done | Covered by `scripts/verify-pdf-change-request.cjs`. |
| Less than 80% keeps locked | Done | Covered by `scripts/verify-pdf-change-request.cjs`. |
| Lesson 1 answer positions | Done | Covered by `scripts/verify-pdf-change-request.cjs`. |
| Lesson 2 levels 5, 6, 7 hidden | Done | Covered by `scripts/verify-pdf-change-request.cjs`. |

## Remaining Client Assets

| Asset | Status | Notes |
| --- | --- | --- |
| Official Al-Azhar/faculty background artwork | Needs asset/audio | Current intro uses CSS minaret placeholders. |
| Welcome magical land artwork | Needs asset/audio | Current welcome uses animated layout and symbols. |
| Lesson custom animation scenes | Needs asset/audio | Bubble, umbrella, train, star, basket, cube, animal, and school scenes need final art/animation assets. |
| Generated intro MP3 audio files | Needs asset/audio | Existing generator can create them, but `official_intro_scene_1..3.mp3` and `welcome_intro_scene_1..3.mp3` are not yet present in `public/audio/ui`. |
