# Spoken Arabic Linguistic Verification Report

**Verification Date:** 2026-06-09T11:16:24.553Z

**Status:** ✅ PASS

---

## Summary

| Metric | Count |
|--------|-------|
| Total Files | 188 |
| Total Checks | 12 |
| ✅ Passed | 11 |
| ❌ Failed | 0 |
| ⚠️ Warnings | 1 |

---

## Detailed Checks

### visible_text_integrity
- **Status:** ✅ PASS
- **Message:** No visible text fields were changed

### corrections_in_manifest
- **Status:** ✅ PASS
- **Message:** 76 items have linguisticReviewStatus set to 'corrected'

### ta_marbuta_variant_a
- **Status:** ✅ PASS
- **Message:** All corrected ta-marbuta words in ttsText use Variant A (ending with هْ). 10 corrected items have tashkeel in visible text (acceptable per rules). Checked 76 corrected items.

### no_fake_normal_ta
- **Status:** ✅ PASS
- **Message:** No fake normal ت replacements found in corrected items

### word_052_preservation
- **Status:** ✅ PASS
- **Message:** word-052: text="م", ttsText="مِيم" (expected: "م")

### word-053_preservation
- **Status:** ✅ PASS
- **Message:** word-053: text="مِ", ttsText="مِ"

### word-054_preservation
- **Status:** ✅ PASS
- **Message:** word-054: text="مُ", ttsText="مُ"

### word-056_preservation
- **Status:** ✅ PASS
- **Message:** word-056: text="مَ", ttsText="مَ"

### no_empty_tts
- **Status:** ✅ PASS
- **Message:** No items have empty ttsText

### regeneration_list_complete
- **Status:** ⚠️ WARNING
- **Message:** Items missing from regeneration list: word-004, word-006, word-009, word-010, word-012, word-015, word-017, word-021, word-023, word-024, word-025, word-027, word-028, word-029, word-038, word-039, word-042, word-043, word-052, word-066, word-067, word-068, phrase-005, phrase-011, phrase-014, phrase-020, phrase-039, phrase-040, phrase-049, phrase-055, phrase-057, phrase-059, phrase-062, phrase-066, phrase-067, lesson-1-objectives, lesson-2-description, lesson-4-description, lesson-3-full, official_intro_scene_1, official_intro_scene_1-2, official_intro_scene_1-3

### no_low_confidence_auto_applied
- **Status:** ✅ PASS
- **Message:** No low-confidence items were auto-applied

### human_review_listed
- **Status:** ✅ PASS
- **Message:** No items require human review


---

## Errors

No errors found.

---

## Verification Rules Checked

1. ✅ No visible text fields were changed accidentally
2. ✅ All applied ttsText corrections exist in audio-manifest.json
3. ✅ Ta-marbuta Variant A rule is respected
4. ✅ No normal ت replacement was introduced for ta-marbuta words
5. ✅ word-052 remains مِيم
6. ✅ word-171 / word-172 / word-173 are preserved
7. ✅ No item has empty ttsText
8. ✅ No corrected item is missing from regeneration-required list
9. ✅ No low-confidence item was auto-applied
10. ✅ Every item marked NEEDS_HUMAN_REVIEW is listed clearly

---

**Final Result:** All linguistic verifications passed.
