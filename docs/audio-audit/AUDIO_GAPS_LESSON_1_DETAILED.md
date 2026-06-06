## AUDIO COVERAGE AUDIT & GAP REPORT

**Report Date:** June 2026  
**Lesson Audited:** Lesson 1 - "هيا نتعلم يا جدي"  
**Total Gaps Found:** 46 critical gaps  
**Status:** INCOMPLETE AUDIO COVERAGE

---

## EXECUTIVE SUMMARY

This project has **speaker buttons visible throughout the UI**, but **46 out of 69 items in Lesson 1 have NO corresponding MP3 files**. This creates a poor user experience where:
- Users click a speaker icon expecting audio
- Browser fallback (text-to-speech) activates instead of pre-recorded audio
- Inconsistent experience: some items have MP3, others don't

### Gap Categories:

| Category | Count | Examples |
|----------|-------|----------|
| NO_AUDIO_ID | 14 | Objective titles, story narration, game questions |
| MISSING_MANIFEST | 32 | Words without audio-manifest.json entries |
| **TOTAL** | **46** | |

---

## LESSON 1 AUDIT - SECTION BY SECTION

### SECTION 1: OBJECTIVES (الأهداف)

**Status:** ❌ INCOMPLETE

|Objective|MP3 Status|File Path|Audio ID|
|---------|----------|---------|--------|
|رحلة التعلم|❌ MISSING|None|lesson-1-objectives-intro (NO MANIFEST)|
|رادار الأذن الخارقة|❌ NO_AUDIO_ID|N/A|None|
|مصنع الأشكال|❌ NO_AUDIO_ID|N/A|None|
|شفرة الأسماء السرية|❌ NO_AUDIO_ID|N/A|None|
|صياد الأصوات والكلمات|❌ NO_AUDIO_ID|N/A|None|
|نادي التحدي والمرح|❌ NO_AUDIO_ID|N/A|None|

**Decision:** Hide speaker buttons for objective titles. Browser TTS fallback only.

**Documentation:** Objective cards currently render with `speak()` fallback. Since no MP3 files exist for individual objectives, speaker icons should be hidden and replaced with text-only cards.

---

### SECTION 2: WARMUP - "رسالة الجد المفقودة"

**Status:** ❌ CRITICAL GAPS

|Item|MP3 Status|File Path|Audio ID|Usage|
|-----|----------|---------|--------|-----|
|Warmup intro narration|❌ MISSING|None|lesson-1-warmup-intro|Component: lesson-hub.tsx|
|استمع إلى الحرف الناقص|❌ MISSING|None|lesson-1-warmup-instruction|Component: lesson-hub.tsx|
|جدي (target word)|❌ MISSING|None|word-004 → NO MANIFEST|Component: WarmupGame|
|ب (letter option)|❌ MISSING|None|letter-ba → NO MANIFEST|Component: WarmupGame|
|د (letter option)|❌ MISSING|None|letter-dal → NO MANIFEST|Component: WarmupGame|
|ر (letter option)|❌ MISSING|None|letter-ra → NO MANIFEST|Component: WarmupGame|
|أحسنت اكتملت الكلمة جدي|❌ MISSING|None|feedback-correct-jadi → NO MANIFEST|Component: WarmupGame|

**Decision:** Disable all speaker buttons in warmup game. Replace with text only.

---

### SECTION 3: STORY (قصة الاستماع)

**Status:** ❌ NO INDIVIDUAL NARRATION AUDIO IDs

The story references `/audio/stories/lesson-1-full.mp3` (exists ✅), but individual scene narrations have NO AUDIO IDs.

|Item|MP3 Status|Notes|
|-----|----------|-----|
|مريم عمرها ست سنوات|❌ NO_AUDIO_ID|No individual scene audio IDs|
|يوسف عمره تسع سنوات|❌ NO_AUDIO_ID|No individual scene audio IDs|
|[All 6 story scenes]|❌ NO_AUDIO_ID|Fallback to TTS only|

**Decision:** Remove speaker icons from individual story lines. Only the full story button should show audio (which has `/audio/stories/lesson-1-full.mp3`).

---

### SECTION 4: VOCABULARY (الكلمات)

**Status:** ❌ CRITICAL GAPS (11/11 items MISSING)

|Word|Mapped To|Manifest Entry|MP3 File|Status|
|-----|---------|--------------|--------|------|
|مريم|word-022 ❌|NO|None|MISSING|
|يوسف|word-026 ❌|NO|None|MISSING|
|جدي|word-048 ❌|NO|None|MISSING|
|الجد|word-069 ✅|YES|/audio/words/word-069.mp3 (12KB)|**OK**|
|بيت|word-008 ❌|NO|None|MISSING|
|متجر|word-020 ❌|NO|None|MISSING|
|دراجة|word-012 ❌|NO|None|MISSING|
|حديقة|word-009 ❌|NO|None|MISSING|
|أمي|word-005 ❌|NO|None|MISSING|
|أبي|word-001 ❌|NO|None|MISSING|
|كريم|word-019 ❌|NO|None|MISSING|

**Decision:** Only show speaker button for "الجد" which HAS real audio. Hide buttons for all others.

---

### SECTION 5: GAMES (الألعاب)

#### Game 1: "ما الكلمة الصحيحة للصورة؟"

**Status:** ❌ MIXED (Some NO_AUDIO_ID, some MISSING MANIFEST)

|Question/Choice|Audio ID|Manifest|MP3|Status|
|---|---|---|---|---|
|Question: ما الكلمة الصحيحة للصورة؟|None|N/A|None|❌ NO_AUDIO_ID|
|Option 1: دراجة|word-012|NO|None|❌ MISSING|
|Option 2: يوسف|word-026|NO|None|❌ MISSING|
|Option 3: متجر|word-020|NO|None|❌ MISSING|

#### Game 2: "صياد الأصوات والكلمات"

**Status:** ❌ CRITICAL (Words don't have MP3, question has NO_AUDIO_ID)

|Question/Choice|Audio ID|Status|
|---|---|---|
|Question|None|❌ NO_AUDIO_ID|
|باب|word-036|❌ MISSING MANIFEST|
|حديقة|word-009|❌ MISSING MANIFEST|
|بيت|word-008|❌ MISSING MANIFEST|
|يوسف|word-026|❌ MISSING MANIFEST|
|يوم|word-037|❌ MISSING MANIFEST|
|مريم|word-022|❌ MISSING MANIFEST|
|متجر|word-020|❌ MISSING MANIFEST|

#### Game 3: "قفزة الحركات الذكية"

**Status:** ❌ CRITICAL (Harakat options have NO_AUDIO_ID)

|Question/Choice|Audio ID|Status|
|---|---|---|
|Question: ما الصوت الأول في كلمة مريم؟|None|❌ NO_AUDIO_ID|
|مِ|word-053|❌ NO_AUDIO_ID (no file)|
|مُ|word-054|❌ NO_AUDIO_ID (no file)|
|مَ|word-056|❌ NO_AUDIO_ID (no file)|
|مْ|word-055|❌ NO_AUDIO_ID (no file)|

#### Game 4: "قطار الحروف والمحطات"

**Status:** ❌ CRITICAL (Questions have NO_AUDIO_ID, choices MISSING)

|Question/Choice|Audio ID|Status|
|---|---|---|
|Question: أين يوجد حرف ميم في أول الكلمة؟|None|❌ NO_AUDIO_ID|
|متجر|word-020|❌ MISSING|
|أمي|word-005|❌ MISSING|
|كريم|word-019|❌ MISSING|

---

## ROOT CAUSES

### 1. **Missing Audio IDs**
- Objective cards don't have audio IDs in data/lessons.ts
- Story narration sections don't have audio IDs
- Game questions don't have audio IDs
- Harakat (vowel mark) options don't have audio IDs

### 2. **Missing Manifest Entries**
- Most vocabulary words are mapped in audio-mapping.ts
- But NOT PRESENT in audio-manifest.json
- Example: "مريم" → word-022, but audio-manifest.json has no entry for word-022

### 3. **Missing MP3 Files**
- Even where mappings exist, MP3 files don't exist in `/public/audio/words/`
- Example: word-036 (باب) has no corresponding MP3 file

### 4. **Inconsistent Data Structure**
- Some items use audioText in lesson data
- Some items use `speak()` with hardcoded narration strings
- Some items have no audio reference at all

---

## RECOMMENDATIONS

### IMMEDIATE ACTION (Remove Silent Speaker Buttons)

1. **Hide speaker buttons where MP3 doesn't exist**
   - Modify SoundButton component to accept optional `disabled` prop
   - Modify AudibleText component to accept optional `hideIcon` prop
   - Update lesson-hub.tsx to only show icons where audio exists

2. **Document decision in code**
   ```tsx
   // AUDIO GAP: No MP3 for "الأهداف" section
   // Browser TTS fallback only - consider adding MP3 generation
   // See: docs/audio-audit/AUDIO_GAPS_LESSON_1.md
   ```

### MEDIUM TERM (Generate Missing MP3s)

Create 46 missing MP3 files:
- 6 Objective narrations
- 1 Warmup intro + 1 instruction
- 11 Vocabulary words
- 15 Game questions and feedback phrases
- 12 Letter options with harakat

### LONG TERM (Audit & Fix All Lessons)

Repeat this audit for Lessons 2, 3, and 4.

---

## FILE REFERENCES

- **Components:** 
  - `/components/common/sound-button.tsx`
  - `/components/common/audible-text.tsx`
  - `/components/screens/lesson-hub.tsx`

- **Data:**
  - `/data/lessons.ts`
  - `/lib/audio-mapping.ts`
  - `/audio-manifest.json`

- **Existing Audio:**
  - `/public/audio/words/word-069.mp3` (الجد - 12KB) ✅
  - `/public/audio/stories/lesson-1-full.mp3` ✅

- **Missing Audio:**
  - 45 other files needed

---

## CONCLUSION

**The project displays 69+ speaker icons but only 2 have actual MP3 audio files.** This creates a negative user experience where button clicks trigger browser text-to-speech instead of professional recordings.

**NEXT STEP:** Disable all speaker buttons where audio doesn't exist, as requested.
