# AUDIO AUDIT - LESSONS 2-4 PENDING

This document outlines what still needs to be audited for Lessons 2, 3, and 4.

**Lesson 1 Status:** ✅ AUDITED & FIXED (46 gaps documented)  
**Lesson 2-4 Status:** ⏳ PENDING AUDIT

---

## LESSON 2: "أميرة وأسرتها السعيدة"

### Vocabulary Items (6):
- أميرة
- أسرة
- بيت
- أمي
- أبي
- حديقة

### Estimated Gaps: ~95%+

**Why:** Same pattern as Lesson 1:
- Vocabulary words likely MISSING from manifest
- Section narrations likely MISSING audio IDs
- Game questions likely MISSING audio IDs

### Games to Audit:
- سلة الحركات مع أميرة (choose-sound)
- محقق المقاطع السحرية (syllable-clap)
- مكعبات أميرة السحرية (build-word)
- محطة الأصوات المتشابهة (similar-words)
- حدد موقع الحرف (letter-position) [hidden]
- أكمل الكلمة (complete-word) [hidden]
- اختر الحركة (harakat) [hidden]
- صائد الكلمات الصحيحة (match-picture-word)
- محطة قطار الأصوات (similar-sound-letters)
- كاشف الكلمة المختلفة (catch-different-word)

### Priority:
1. Audit vocabulary audio
2. Audit game questions
3. Audit warmup section
4. Audit objectives section

---

## LESSON 3: "عالم الحيوان"

### Vocabulary Items (8):
- سامي
- أسد
- أرنب
- نملة
- غابة
- شجرة
- حيوان
- بلبل

### Estimated Gaps: ~95%+

### Games to Audit:
- صفق المقاطع (syllable-clap)
- ركّب الكلمة (build-word)
- طابق الصورة بالكلمة (match-picture-word)
- اختر الصوت الصحيح (choose-sound) [hidden]
- صيد الأصوات المتقاطعة (catch-different-word) [hidden]
- محقق الكلمات المختلفة (similar-words) [hidden]
- قطار الحروف (letter-forms) [hidden]

### Story Scenes (7):
- All likely missing individual audio IDs

---

## LESSON 4: Status Unknown

**Data Not Yet Reviewed** - Need to:
1. Load lesson data
2. Identify vocabulary
3. Identify games
4. Identify sections
5. Run systematic audit

---

## AUDIT METHODOLOGY

For each lesson, follow the Lesson 1 pattern:

### 1. IDENTIFY ALL SPOKEN ITEMS

**Sections:**
- Objectives (6-7 cards typically)
- Warmup (1-3 items)
- Story (2-7 scene narrations)
- Vocabulary (5-12 words)
- Explanation (2-4 cards)
- Games (15-40 items per game)

### 2. CHECK AUDIO COVERAGE

For each item, verify:
- Does it have an `audioId` in data?
- Is there a manifest entry?
- Does the MP3 file exist in `/public/audio/`?
- Is the MP3 file > 0 bytes?

### 3. DOCUMENT GAPS

- NO_AUDIO_ID: Item has no audio reference at all
- MISSING_MANIFEST: AudioId exists but not in manifest.json
- MISSING_MP3: Manifest exists but no file in /public/audio/
- ZERO_BYTE: File exists but is empty

### 4. UPDATE COVERAGE

Add items to `/lib/audio-coverage.ts`:
```typescript
export const AUDIO_COVERAGE: Record<string, boolean> = {
  // Lesson 2
  'أميرة': false,
  // Lesson 3
  'سامي': false,
  // Lesson 4
  // ...
}
```

### 5. CREATE DOCUMENTATION

Document section-by-section for each lesson (like Lesson 1).

---

## HOW TO GENERATE MISSING AUDIO

### Option 1: Generate with TTS Service
```bash
node scripts/generate-audio.js lesson-2
# Generates all MP3s for Lesson 2 using TTS API
```

### Option 2: Manual Recording
```bash
# Record audio for specific word
sox input.wav /public/audio/words/word-NNN.mp3
# Update coverage whitelist
```

### Option 3: Use Existing Audio Files
If MP3s exist elsewhere:
```bash
# Copy to correct location
cp /external/words/مريم.mp3 /public/audio/words/word-022.mp3
# Update coverage
```

---

## COVERAGE UPDATE PROCESS

Once MP3s are generated:

1. Place MP3 in `/public/audio/words/{audio-id}.mp3`
2. Add to `/lib/audio-coverage.ts`:
```typescript
'مريم': true,  // Was false, now true
```
3. Speaker button automatically appears ✅

---

## PROJECTED TOTAL GAPS

### Lesson 1: 46 gaps ✅ DOCUMENTED
### Lesson 2: ~60 gaps (estimated)
### Lesson 3: ~50 gaps (estimated)
### Lesson 4: ~40+ gaps (estimated)

**TOTAL: ~200+ audio gaps across all 4 lessons**

---

## CRITICAL SUCCESS FACTORS

- ✅ Audio coverage check prevents invalid speaker icons
- ✅ Documentation provides clear path forward
- ✅ Scalable system: Add MP3 → Update coverage → Done
- ✅ No manual component updates needed
- ✅ Backward compatible with existing code

---

## QUICK STATS

| Metric | Value |
|--------|-------|
| Total MP3 Files Needed | ~200 |
| Files Currently Existing | ~2-3 |
| Coverage Percentage | ~1-1.5% |
| Speaker Icons Hidden | 46+ (Lesson 1) |
| Audio Gaps Documented | Lesson 1 complete |
| Lessons Awaiting Audit | Lessons 2, 3, 4 |

---

## REFERENCES

- Complete Lesson 1 audit: `/docs/audio-audit/AUDIO_GAPS_LESSON_1_DETAILED.md`
- Implementation details: `/docs/audio-audit/IMPLEMENTATION_SUMMARY.md`
- Coverage whitelist: `/lib/audio-coverage.ts`
- Audio components: `/components/common/sound-button.tsx`, `/components/common/audible-text.tsx`
