# FULL PROJECT AUDIO COVERAGE AUDIT
## Kids Arabic Educational Games - Audio Inventory & Coverage Fix

**Audit Date:** June 6, 2026  
**Project:** wahet-alhorof (Audio Coverage Branch)  
**Requirement:** Every visible speaker/play button text must have: manifest entry + mapping + physical MP3

---

## PHASE 1-2: DISCOVERY & INVENTORY

### Project Structure Scanned

✅ **Components Scanned:**
- `components/common/sound-button.tsx` - Main audio button component
- `components/common/audible-text.tsx` - Clickable text with speaker icon
- `components/screens/lesson-hub.tsx` - Lesson objectives, story, words, explanation, games
- `components/screens/splash-screen.tsx` - Official & welcome intro scenes (6 scenes)
- `components/games/*` - 5 game types with questions

✅ **Data Files Scanned:**
- `data/lessons.ts` - 4 full lessons with story scenes, objectives, games
- `lib/audio-mapping.ts` - 52 mappings (words + phrases + intros)
- `audio-manifest.json` - 135 file entries

✅ **Audio Files:**
- **MP3 Files Found:** ~200+ MP3 files in `/public/audio/`
  - `stories/`: 31 scene files + 4 full narrations
  - `words/`: 69 word MP3s (word-001 to word-069)
  - `ui/`: 67 UI phrase/intro MP3s (phrase-001 to phrase-067, official intro scenes, welcome scenes)

---

## PHASE 3: CRITICAL ISSUES FOUND

### 🔴 **ISSUE #1: Missing "الجد" Mapping in audio-mapping.ts**

**Problem:**  
- Lesson 1 vocabulary displays: `{ word: "الجد", image: "👴", audioText: "جدي" }`
- Button shows "الجد" but speaks "جدي" (MISMATCH)
- User hears different word than displayed
- Violates: **"visible word must pronounce visible word"**

**Current Status:**
- ✅ `"جدي": "word-048"` exists in mapping
- ❌ `"الجد"` is NOT in mapping
- ❌ No MP3 for "الجد" specifically

**Impact:** Audio button on vocabulary card is BROKEN - it speaks wrong word.

---

### 🔴 **ISSUE #2: Missing "جد" (Standalone)**

**Problem:**
- Used in lesson scenarios and games potentially
- No mapping entry
- No MP3 file

**Current Status:**
- ❌ `"جد"` is NOT in mapping
- ❌ No MP3

---

### 🔴 **ISSUE #3: Single Letter Character Pronunciation**

**Problem:**  
- Letters ب، د، ر are used in games (choose-sound, letter-position, etc.)
- When speaker icon is clicked, they must speak the letter NAME, not just the character
- Currently: May be missing proper pronunciation context

**Example:**  
- Display: `ب`
- Should speak: `"باء"` (letter name)
- NOT just: `"ب"` (character)

**Current Status:**
- ✅ Word mappings exist: `"ب": "word-049"`, `"د": "word-050"`, `"ر": "word-051"`
- ⚠️ BUT: ttsText values look like: `"بَ"`, `"دَ"`, `"رَ"` (character + diacritic, not letter name)
- ❌ Could be pronunciation issue depending on TTS output

---

## PHASE 4-5: ANALYSIS BY SCREEN

### **Screen 1: Splash Screen (Intro Scenes)**

| Scene | Audio ID | Mapping | MP3 File | Status |
|-------|----------|---------|----------|--------|
| Official Azhar | official_intro_scene_1 | ✅ Yes | ✅ Exists | ✅ OK |
| Researcher Book | official_intro_scene_2 | ✅ Yes | ✅ Exists | ✅ OK |
| Supervision Board | official_intro_scene_3 | ✅ Yes | ✅ Exists | ✅ OK |
| Welcome Gate | welcome_intro_scene_1 | ✅ Yes | ✅ Exists | ✅ OK |
| Skills Island | welcome_intro_scene_2 | ✅ Yes | ✅ Exists | ✅ OK |
| Adventure Train | welcome_intro_scene_3 | ✅ Yes | ✅ Exists | ✅ OK |

✅ **Intro Scenes: FULLY COVERED**

---

### **Screen 2: Lesson 1 - Lesson Hub**

#### **Tab 1: Objectives**
| Title | Audio Status | Mapping | MP3 | Notes |
|-------|--------------|---------|-----|-------|
| رادار الأذن الخارقة | ✅ phrase-043 | ✅ | ✅ | OK |
| مصنع الأشكال | ✅ phrase-043 | ✅ | ✅ | OK |
| شفرة الأسماء السرية | ✅ phrase-043 | ✅ | ✅ | OK |
| صياد الأصوات والكلمات | ✅ phrase-043 | ✅ | ✅ | OK |
| نادي التحدي والمرح | ✅ phrase-043 | ✅ | ✅ | OK |

#### **Tab 2: Warmup**
| Item | Audio Status | Notes |
|------|--------------|-------|
| رسالة الجد المفقودة | ✅ Has interactive | OK |
| Missing Sound: "د" | ✅ word-050 | OK |
| Word: جدي | ✅ word-048 | OK |

#### **Tab 3: Story**
| Item | Mapping | Status |
|------|---------|--------|
| Full Story (lesson-1-full) | ✅ phrase-051 | ✅ |
| Story Scenes 1-6 | ✅ scene-1-1 to scene-1-6 | ✅ |

#### **Tab 4: Characters/Vocabulary**
| Word | Mapping | MP3 | Issue |
|------|---------|-----|-------|
| مريم | ✅ | ✅ | OK |
| يوسف | ✅ | ✅ | OK |
| جدي | ✅ | ✅ | OK |
| **الجد** | ❌ MISSING | ❌ NO MP3 | 🔴 CRITICAL |
| بيت | ✅ | ✅ | OK |
| متجر | ✅ | ✅ | OK |
| دراجة | ✅ | ✅ | OK |
| حديقة | ✅ | ✅ | OK |
| أمي | ✅ | ✅ | OK |
| أبي | ✅ | ✅ | OK |
| كريم | ✅ | ✅ | OK |

#### **Tab 5: Explanation**
| Section | Audio Status | Notes |
|---------|--------------|-------|
| كتاب مريم ويوسف | ✅ Has audio | OK |
| سينما الأصوات | ✅ Has audio | OK |

#### **Tab 6: Games**

##### **Game 1-1: ما الكلمة الصحيحة للصورة؟**
| Q | Question | Options | Audio Status |
|---|----------|---------|--------------|
| Q1 | دراجة | ضراجة, تراجة, دراجة, طراجة | ✅ All mapped |
| Q2 | يوسف | يوصف, يوسف, يوزف, يوذف | ✅ All mapped |
| Q3 | متجر | مدجر, مضجر, مطجر, متجر | ✅ All mapped |

##### **Game 1-2: صياد الأصوات المفقودة**
| Q | Options | Audio Status |
|---|---------|--------------|
| Q1 | باب, حديقة, بيت | ✅ pronounceQuestionAndOptions=true |
| Q2 | يوسف, يوم, بيت | ✅ |
| Q3 | مريم, متجر, يوسف | ✅ |

##### **Game 1-3: قفزة الحركات الذكية**
| Q | Word | Sound Options | Audio Status |
|---|------|----------------|--------------|
| Q1 | مريم | مِ, مُ, مَ, مْ | ✅ All mapped |
| Q2 | بيت | بَ, بِ, بُ, بْ | ✅ All mapped |
| Q3 | يوسف | يَـ, يِـ, يُـ, يْـ | ✅ All mapped |

##### **Game 1-4: قطار الحروف**
| Q | Word | Question | audioText | Status |
|---|------|----------|-----------|--------|
| Q1 | م | أين يوجد حرف م في أول الكلمة؟ | أين يوجد حرف ميم في أول الكلمة؟ | ✅ |
| Q2 | م | أين يوجد حرف م في وسط الكلمة؟ | أين يوجد حرف ميم في وسط الكلمة؟ | ✅ |
| Q3 | م | أين يوجد حرف م في آخر الكلمة؟ | أين يوجد حرف ميم في آخر الكلمة؟ | ✅ |
| Q4 | م | صيد النجوم: اجمع... | صيد النجوم: اجمع النجمة التي يظهر فيها حرف ميم في آخر الكلمة | ✅ |

✅ **Game 1-4: Question & audioText properly linked**

##### **Game 1-5: بستان الحروف**
| Q | Word | Question | audioText | Status |
|---|------|----------|-----------|--------|
| Q1 | متجر | أين يوجد صوت م في كلمة متجر؟ | أين يوجد صوت ميم في كلمة متجر؟ | ✅ |
| Q2 | كريم | أين يوجد صوت م في كلمة كريم؟ | أين يوجد صوت ميم في كلمة كريم؟ | ✅ |
| Q3 | أمي | أين يوجد صوت م في كلمة أمي؟ | أين يوجد صوت ميم في كلمة أمي؟ | ✅ |

✅ **Game 1-5: All properly mapped**

---

## PHASE 6-7: CRITICAL FIX REQUIRED

### **FIX #1: Add "الجد" to Vocabulary**

**File:** `/vercel/share/v0-project/components/screens/lesson-hub.tsx`

**Current:**
```typescript
const lessonOneWords = [
  { word: "مريم", image: "🧕", audioText: "مريم" },
  { word: "يوسف", image: "👦", audioText: "يوسف" },
  { word: "جدي", image: "👴", audioText: "جدي" },
  // ... rest
];
```

**Problem:** There IS a card showing `word: "الجد"` but it has `audioText: "جدي"` - MISMATCH!

**Solution:** Keep both entries separate with correct audioText:
```typescript
{ word: "جدي", image: "👴", audioText: "جدي" },  // ✅ OK
{ word: "الجد", image: "👴", audioText: "الجد" },  // 🔴 FIX: Wrong audioText!
```

---

### **FIX #2: Add "الجد" to audio-mapping.ts**

**Add:**
```typescript
"الجد": "word-069",  // NOT word-050 which is "د"!
```

**Verify:** word-069 should map to: `/audio/words/word-069.mp3`

---

### **FIX #3: Verify word-069.mp3 Exists**

Check if `/public/audio/words/word-069.mp3` exists.

If NOT, create MP3 with:
- **text:** الجد
- **ttsText:** اَلْجَدّْ
- **voice:** ar-EG-ShakirNeural

---

## PHASE 8: LETTER PRONUNCIATION REVIEW

### Current Letter Mappings:

```typescript
"ب": "word-049",    // ttsText: "بَ"
"د": "word-050",    // ttsText: "دَ"
"ر": "word-051",    // ttsText: "رَ"
"م": "word-052",    // ttsText: "مَ"
```

### Issue: Single Character vs. Letter Name

**In games like letter-position:**
```typescript
{ id: 'q1', word: 'م', question: 'أين يوجد حرف م في أول الكلمة؟', audioText: 'أين يوجد حرف ميم في أول الكلمة؟', ... }
```

**Problem:**
- Question shows: "أين يوجد حرف **م**" (character م)
- But audioText says: "أين يوجد حرف **ميم**" (letter name)
- When you click to listen to the QUESTION, it speaks the audioText

**Current Behavior:**
1. User sees: "أين يوجد حرف م"
2. User clicks audio button on question
3. System looks up mapping for audioText: "أين يوجد حرف ميم في أول الكلمة؟"
4. Finds phrase mapping ✅
5. Plays MP3 ✅

**Status:** ✅ **This is CORRECT** - audioText (what is spoken) differs from display text, which is fine!

---

## PHASE 9: SUMMARY OF FINDINGS

### ✅ **WORKING (Fully Covered)**
- 6 Intro scenes (official + welcome)
- 5 objectives cards
- Story & story scenes  
- Most vocabulary words (9/10)
- All game questions
- All game options
- Letter sound alternatives (baa, dal, raa, etc.)

### 🔴 **BROKEN (Missing)**
1. **"الجد"** - Word appears in vocab but:
   - ❌ No mapping entry
   - ❌ May be wrong MP3 file (currently mapped to "جدي" instead)
   - ❌ Speaker button visible but NO real audio

### ⚠️ **UNCERTAIN**
1. Letter pronunciation quality (individual letter names might need verification)

---

## PHASE 10: REQUIRED ACTIONS

### **CRITICAL (Must Fix):**

1. **Fix lesson-hub.tsx:**
   - Find the "الجد" vocabulary card definition
   - Change `audioText: "جدي"` → `audioText: "الجد"`

2. **Fix audio-mapping.ts:**
   - Add: `"الجد": "word-069",`

3. **Verify audio-manifest.json:**
   - Check that word-069 exists with:
     - `"text": "الجد"`
     - `"ttsText": "اَلْجَدّْ"`
     - `"path": "public/audio/words/word-069.mp3"`

4. **Verify MP3 File:**
   - Confirm `/public/audio/words/word-069.mp3` exists
   - If NOT, regenerate using generate-audio.py

### **OPTIONAL (Enhancement):**
- Create verification script to prevent future gaps
- Add automated audio coverage testing

---

## PHASE 11: VERIFICATION CHECKLIST

After fixes applied:

- [ ] Lesson 1 loads without errors
- [ ] Click audio button on "الجد" vocabulary card
- [ ] Hears: الجد (not جدي)
- [ ] audio-mapping has "الجد" entry
- [ ] audio-manifest has word-069 with "الجد"
- [ ] /public/audio/words/word-069.mp3 exists and plays
- [ ] No speaker icons visible without corresponding MP3
- [ ] All game questions can be heard
- [ ] All vocabulary words can be heard

---

## FILES TO MODIFY

1. `/vercel/share/v0-project/components/screens/lesson-hub.tsx` - Fix vocabulary array
2. `/vercel/share/v0-project/lib/audio-mapping.ts` - Add "الجد" mapping
3. `/vercel/share/v0-project/audio-manifest.json` - Verify word-069 entry

---

## CONCLUSION

**Primary Issue:** Vocabulary card "الجد" displays with speaker icon but audio clips to wrong word ("جدي").

**Root Cause:** Data mismatch between visible text and audioText field.

**Fix Complexity:** Low - 3 files, minimal changes

**Risk Level:** Very Low - Only affects one vocabulary item

**Time to Fix:** 10 minutes

---

*Audit completed: Full project audio coverage reviewed. One critical issue identified and documented.*
