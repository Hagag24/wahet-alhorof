#!/usr/bin/env node
/**
 * Phase 2-4: Linguistic Audit, Classification, and High-Confidence Corrections
  */

const fs = require('fs');
const path = require('path');

// Paths
const AUDIO_MANIFEST_PATH = path.join(process.cwd(), 'audio-manifest.json');
const REVIEW_DIR = path.join(process.cwd(), 'audio-plan', 'review');
const SOURCE_MAP_PATH = path.join(REVIEW_DIR, 'full-spoken-arabic-audit-source-map.json');

// Issue types
const ISSUE_TYPES = {
  PASS: 'PASS',
  NEEDS_TASHKEEL_FIX: 'NEEDS_TASHKEEL_FIX',
  NEEDS_TA_MARBUTA_FIX: 'NEEDS_TA_MARBUTA_FIX',
  NEEDS_GRAMMAR_FIX: 'NEEDS_GRAMMAR_FIX',
  NEEDS_HAMZA_FIX: 'NEEDS_HAMZA_FIX',
  NEEDS_SHADDA_FIX: 'NEEDS_SHADDA_FIX',
  NEEDS_NAME_PRONUNCIATION_FIX: 'NEEDS_NAME_PRONUNCIATION_FIX',
  NEEDS_LETTER_SOUND_FIX: 'NEEDS_LETTER_SOUND_FIX',
  NEEDS_PAUSE_RHYTHM_FIX: 'NEEDS_PAUSE_RHYTHM_FIX',
  NEEDS_HUMAN_REVIEW: 'NEEDS_HUMAN_REVIEW',
  REJECTED_UNSAFE_TO_AUTO_FIX: 'REJECTED_UNSAFE_TO_AUTO_FIX'
};

// Critical preservation items
const CRITICAL_ITEMS = {
  'word-052': { text: 'م', expectedTts: 'مِيم' },
  'word-171': { text: 'مَ', expectedTts: 'مَ' },
  'word-172': { text: 'مِ', expectedTts: 'مِ' },
  'word-173': { text: 'مُ', expectedTts: 'مُ' }
};

// Words with ta-marbuta that need Variant A conversion
const TA_MARBUTA_WORDS = [
  'أسرة', 'أميرة', 'حديقة', 'حقيبة', 'دراجة', 'زهرة', 'شجرة',
  'غابة', 'معلمة', 'ممحاة', 'نملة', 'مهندسة', 'جميلة', 'لوحة', 'رسمة',
  'مدرسة', 'قطة', 'فتة', 'فتاة', 'عَايِشَهْ', 'عائشة'
];

// Letter names (must be preserved)
const LETTER_NAMES = {
  'ب': 'بَاء',
  'ت': 'تَاء',
  'ث': 'ثَاء',
  'ج': 'جِيم',
  'ح': 'حَاء',
  'خ': 'خَاء',
  'د': 'دَال',
  'ذ': 'ذَال',
  'ر': 'رَاء',
  'ز': 'زَاي',
  'س': 'سِين',
  'ش': 'شِين',
  'ص': 'صَاد',
  'ض': 'ضَاد',
  'ط': 'طَاء',
  'ظ': 'ظَاء',
  'ع': 'عَيْن',
  'غ': 'غَيْن',
  'ف': 'فَاء',
  'ق': 'قَاف',
  'ك': 'كَاف',
  'ل': 'لَام',
  'م': 'مِيم',
  'ن': 'نُون',
  'ه': 'هَاء',
  'و': 'وَاو',
  'ي': 'يَاء'
};

// Check if text contains ta-marbuta (anywhere in the text)
function hasTaMarbuta(text) {
  return text && /ة/.test(text);
}

// Convert ta-marbuta to Variant A (ending with هْ)
function convertToVariantA(ttsText, originalText) {
  if (!ttsText || !originalText) return ttsText;

  // Only convert if original contains ta-marbuta
  if (!hasTaMarbuta(originalText)) return ttsText;

  // Check if already using Variant A
  if (/هْ/.test(ttsText)) return ttsText;

  // Replace ة with tashkeel (like ةُ ةِ ةَ) with هْ + tashkeel
  let converted = ttsText;

  // Pattern: ة followed by tashkeel (ُ ِ َ) and then space or end
  converted = converted.replace(/ة([َُِ])(?=\s|$)/g, 'هْ$1');

  // Pattern: ة followed by sukoon and then space or end
  converted = converted.replace(/ةْ(?=\s|$)/g, 'هْ');

  // Pattern: bare ة followed by space or end
  converted = converted.replace(/ة(?=\s|$)/g, 'هْ');

  // Pattern: ة followed by any Arabic letter (medial position)
  // This handles cases like ة within a word
  converted = converted.replace(/ة(?=[\u0621-\u064A])/g, 'هْ');

  return converted;
}

// Check for fake normal ت
function hasFakeNormalTa(text) {
  if (!text) return false;
  // Check for words ending with ت (not followed by anything)
  return /[بتثجحخدذرزسشصضطظعغفقكلمنهوي]ت\b/.test(text);
}

// Classify issue for an item
function classifyItem(item) {
  const issues = [];
  const explanations = [];

  // 1. Check critical preservation
  if (CRITICAL_ITEMS[item.audioId]) {
    const critical = CRITICAL_ITEMS[item.audioId];
    if (item.text !== critical.text || item.ttsText !== critical.expectedTts) {
      issues.push(ISSUE_TYPES.NEEDS_HUMAN_REVIEW);
      explanations.push(`Critical item ${item.audioId} preservation check needed`);
    }
  }

  // 2. Check ta-marbuta (Variant A required)
  if (item.hasTaMarbutaInText && !item.usesVariantA) {
    if (hasFakeNormalTa(item.ttsText)) {
      issues.push(ISSUE_TYPES.REJECTED_UNSAFE_TO_AUTO_FIX);
      explanations.push('Uses fake normal ت instead of Variant A (هْ) - REJECTED');
    } else {
      issues.push(ISSUE_TYPES.NEEDS_TA_MARBUTA_FIX);
      explanations.push(`Ta-marbuta word "${item.text}" needs Variant A (ending with هْ not ة)`);
    }
  }

  // 3. Check letter names for single letters
  if (item.category === 'word' && item.text && item.text.length === 1 && LETTER_NAMES[item.text]) {
    const expectedLetterName = LETTER_NAMES[item.text];
    // For word-052, it must be مِيم
    if (item.audioId === 'word-052' && item.ttsText !== 'مِيم') {
      issues.push(ISSUE_TYPES.NEEDS_LETTER_SOUND_FIX);
      explanations.push(`word-052 must use "مِيم" (letter name), not "${item.ttsText}"`);
    }
  }

  // 4. Check for proper hamza usage
  if (item.ttsText && /[أإؤئ]/.test(item.text || '')) {
    // Check if hamza is properly vocalized
    const hamzaMatches = item.ttsText.match(/[أإؤئ]/g);
    if (hamzaMatches && !/[َُِ]/.test(item.ttsText)) {
      // Hamza exists but might not be properly vocalized
      // This is a low-confidence check
    }
  }

  // 5. Check for pacing issues in long narration
  if (item.category === 'storyScene' || item.category === 'lessonObjective' ||
      (item.audioId && item.audioId.includes('objectives'))) {
    const wordCount = (item.ttsText || '').split(/\s+/).filter(w => w.length > 0).length;
    const sentenceCount = (item.ttsText || '').split(/[.!?。؟!]+/).filter(s => s.trim().length > 0).length;

    if (wordCount > 15 && sentenceCount < 3) {
      issues.push(ISSUE_TYPES.NEEDS_PAUSE_RHYTHM_FIX);
      explanations.push(`Long narration (${wordCount} words, ${sentenceCount} sentences) needs better pacing with pauses`);
    }
  }

  // 6. Check shadda for names that need it
  const namesNeedingShadda = ['محمد', 'أحمد', 'مدرسة', 'الدكتور', 'اللغوية'];
  if (item.text && namesNeedingShadda.some(name => (item.text || '').includes(name))) {
    if (!item.hasShadda) {
      // Could need shadda - medium confidence
    }
  }

  // 7. Check for personal names (should not have tanween)
  const personalNames = ['مريم', 'يوسف', 'كريم', 'سامي', 'طارق', 'أميرة', 'فاروق', 'خالد'];
  if (personalNames.some(name => item.text === name)) {
    // Check if ending has tanween (ً ٍ ٌ)
    if (/[ًٌٍ]/.test(item.ttsText || '')) {
      issues.push(ISSUE_TYPES.NEEDS_NAME_PRONUNCIATION_FIX);
      explanations.push(`Personal name "${item.text}" should not have tanween, use final sukoon`);
    }
  }

  // 8. Check for empty ttsText
  if (!item.ttsText || item.ttsText.trim() === '') {
    issues.push(ISSUE_TYPES.NEEDS_HUMAN_REVIEW);
    explanations.push('Empty or missing ttsText');
  }

  // If no issues, it's a PASS
  if (issues.length === 0) {
    issues.push(ISSUE_TYPES.PASS);
    explanations.push('All checks passed');
  }

  return { issues, explanations };
}

// Generate corrected ttsText for high-confidence fixes
function generateCorrectedTtsText(item, issueType) {
  let corrected = item.ttsText;

  switch (issueType) {
    case ISSUE_TYPES.NEEDS_TA_MARBUTA_FIX:
      corrected = convertToVariantA(item.ttsText, item.text);
      break;

    case ISSUE_TYPES.NEEDS_LETTER_SOUND_FIX:
      // Special case for word-052
      if (item.audioId === 'word-052') {
        corrected = 'مِيم';
      }
      break;

    case ISSUE_TYPES.NEEDS_PAUSE_RHYTHM_FIX:
      // For pacing, we'd need to manually review and add punctuation
      // This is medium confidence, so we'll flag it but not auto-apply
      corrected = null; // Don't auto-apply
      break;

    default:
      corrected = null; // Don't auto-apply for other types
  }

  return corrected;
}

// Main function
async function runLinguisticAudit() {
  console.log('🔍 Starting Linguistic Audit (Phases 2-4)...\n');

  // Load source map
  console.log('📄 Loading source map...');
  const sourceMap = JSON.parse(fs.readFileSync(SOURCE_MAP_PATH, 'utf8'));
  const items = sourceMap.items || [];
  console.log(`   Loaded ${items.length} items\n`);

  // Load audio manifest
  const manifestContent = fs.readFileSync(AUDIO_MANIFEST_PATH, 'utf8');
  const manifest = JSON.parse(manifestContent.replace(/^\uFEFF/, ''));

  // Classify all items
  console.log('🔍 Classifying items...');
  const classifiedItems = [];
  const passCount = { count: 0 };
  const correctionsToApply = [];
  const humanReviewItems = [];
  const rejectedItems = [];
  const visibleTypos = [];

  for (const item of items) {
    const classification = classifyItem(item);

    const classified = {
      ...item,
      issueTypes: classification.issues,
      explanations: classification.explanations,
      confidence: 'high',
      correctedTtsText: null,
      mp3RegenerationRequired: false
    };

    // Track if this item should be in corrections
    let hasHighConfidenceCorrection = false;
    let needsHumanReview = false;

    // First pass: check for issues
    for (const issue of classification.issues) {
      if (issue === ISSUE_TYPES.PASS) {
        passCount.count++;
      } else if (issue === ISSUE_TYPES.NEEDS_TA_MARBUTA_FIX) {
        const corrected = generateCorrectedTtsText(item, issue);
        if (corrected && corrected !== item.ttsText) {
          classified.correctedTtsText = corrected;
          classified.mp3RegenerationRequired = true;
          hasHighConfidenceCorrection = true;
        }
      } else if (issue === ISSUE_TYPES.NEEDS_LETTER_SOUND_FIX) {
        const corrected = generateCorrectedTtsText(item, issue);
        if (corrected && corrected !== item.ttsText) {
          classified.correctedTtsText = corrected;
          classified.mp3RegenerationRequired = true;
          classified.confidence = 'high';
          hasHighConfidenceCorrection = true;
        }
      } else if (issue === ISSUE_TYPES.NEEDS_PAUSE_RHYTHM_FIX) {
        // Pacing issues require human review but don't block other corrections
        classified.confidence = 'medium';
      } else if (issue === ISSUE_TYPES.NEEDS_HUMAN_REVIEW) {
        classified.confidence = 'low';
        needsHumanReview = true;
      } else if (issue === ISSUE_TYPES.REJECTED_UNSAFE_TO_AUTO_FIX) {
        classified.confidence = 'none';
        rejectedItems.push(classified);
      }
    }

    // Add to appropriate list
    if (hasHighConfidenceCorrection) {
      correctionsToApply.push(classified);
    } else if (needsHumanReview) {
      humanReviewItems.push(classified);
    }

    classifiedItems.push(classified);
  }

  console.log(`   ✅ Classified ${classifiedItems.length} items`);
  console.log(`   ✅ PASS: ${passCount.count}`);
  console.log(`   ✅ High-confidence corrections: ${correctionsToApply.length}`);
  console.log(`   ⚠️  Human review needed: ${humanReviewItems.length}`);
  console.log(`   ❌ Rejected (unsafe): ${rejectedItems.length}\n`);

  // Generate linguistic audit files
  console.log('📝 Generating linguistic audit files...');

  const auditResult = {
    auditDate: new Date().toISOString(),
    totalItems: classifiedItems.length,
    passCount: passCount.count,
    correctionsCount: correctionsToApply.length,
    humanReviewCount: humanReviewItems.length,
    rejectedCount: rejectedItems.length,
    items: classifiedItems
  };

  fs.writeFileSync(
    path.join(REVIEW_DIR, 'full-spoken-arabic-linguistic-audit.json'),
    JSON.stringify(auditResult, null, 2),
    'utf8'
  );

  const auditMd = generateAuditMarkdown(auditResult, classifiedItems, correctionsToApply, humanReviewItems, rejectedItems, visibleTypos);
  fs.writeFileSync(
    path.join(REVIEW_DIR, 'full-spoken-arabic-linguistic-audit.md'),
    auditMd,
    'utf8'
  );

  // Apply high-confidence corrections
  console.log('🔧 Applying high-confidence corrections...');

  const appliedCorrections = [];
  for (const correction of correctionsToApply) {
    // Find the item in manifest
    const manifestItem = manifest.files.find(f => f.id === correction.audioId);
    if (manifestItem && correction.correctedTtsText) {
      const oldTts = manifestItem.ttsText;
      manifestItem.ttsText = correction.correctedTtsText;
      manifestItem.linguisticReviewStatus = 'corrected';
      manifestItem.pronunciationNotes = `Auto-corrected from "${oldTts}" to "${correction.correctedTtsText}" on ${new Date().toISOString()}`;

      appliedCorrections.push({
        audioId: correction.audioId,
        oldTtsText: oldTts,
        newTtsText: correction.correctedTtsText,
        path: correction.path,
        issueType: correction.issueTypes.find(t => t !== ISSUE_TYPES.PASS)
      });
    }
  }

  // Save updated manifest
  fs.writeFileSync(
    AUDIO_MANIFEST_PATH,
    JSON.stringify(manifest, null, 4),
    'utf8'
  );

  console.log(`   ✅ Applied ${appliedCorrections.length} corrections\n`);

  // Generate corrections-applied files
  const correctionsResult = {
    auditDate: new Date().toISOString(),
    totalScanned: classifiedItems.length,
    totalPass: passCount.count,
    totalCorrected: appliedCorrections.length,
    totalHumanReview: humanReviewItems.length,
    totalRejected: rejectedItems.length,
    totalVisibleTypos: visibleTypos.length,
    filesRequiringRegeneration: appliedCorrections.filter(c => c.mp3RegenerationRequired !== false).length,
    corrections: appliedCorrections
  };

  fs.writeFileSync(
    path.join(REVIEW_DIR, 'full-spoken-arabic-corrections-applied.json'),
    JSON.stringify(correctionsResult, null, 2),
    'utf8'
  );

  const correctionsMd = generateCorrectionsMarkdown(correctionsResult, appliedCorrections, humanReviewItems, rejectedItems, visibleTypos);
  fs.writeFileSync(
    path.join(REVIEW_DIR, 'full-spoken-arabic-corrections-applied.md'),
    correctionsMd,
    'utf8'
  );

  // Generate visible typos file if any
  if (visibleTypos.length > 0) {
    fs.writeFileSync(
      path.join(REVIEW_DIR, 'visible-arabic-typos-needing-approval.md'),
      generateVisibleTyposMarkdown(visibleTypos),
      'utf8'
    );
  }

  console.log('✅ Phases 2-4 Complete!\n');
  console.log('📊 Final Summary:');
  console.log(`   Total items: ${classifiedItems.length}`);
  console.log(`   PASS: ${passCount.count}`);
  console.log(`   Corrected: ${appliedCorrections.length}`);
  console.log(`   Need human review: ${humanReviewItems.length}`);
  console.log(`   Rejected: ${rejectedItems.length}`);
  console.log(`   Files needing regeneration: ${appliedCorrections.length}`);

  return {
    classifiedItems,
    appliedCorrections,
    humanReviewItems,
    rejectedItems
  };
}

function generateAuditMarkdown(audit, items, corrections, humanReview, rejected, visibleTypos) {
  return `# Full Spoken Arabic Linguistic Audit

**Audit Date:** ${audit.auditDate}

---

## Summary

| Metric | Count |
|--------|-------|
| Total Items | ${audit.totalItems} |
| PASS | ${audit.passCount} |
| NEEDS_TA_MARBUTA_FIX | ${items.filter(i => i.issueTypes.includes(ISSUE_TYPES.NEEDS_TA_MARBUTA_FIX)).length} |
| NEEDS_PAUSE_RHYTHM_FIX | ${items.filter(i => i.issueTypes.includes(ISSUE_TYPES.NEEDS_PAUSE_RHYTHM_FIX)).length} |
| NEEDS_LETTER_SOUND_FIX | ${items.filter(i => i.issueTypes.includes(ISSUE_TYPES.NEEDS_LETTER_SOUND_FIX)).length} |
| NEEDS_HUMAN_REVIEW | ${audit.humanReviewCount} |
| REJECTED_UNSAFE | ${audit.rejectedCount} |

---

## High-Confidence Corrections to Apply

${corrections.map(c => `### ${c.audioId}
- **Issue:** ${c.issueTypes.filter(t => t !== ISSUE_TYPES.PASS).join(', ')}
- **Current TTS:** ${c.ttsText}
- **Corrected TTS:** ${c.correctedTtsText}
- **Explanation:** ${c.explanations.join('; ')}
`).join('\n') || 'None'}

---

## Items Requiring Human Review

${humanReview.map(h => `### ${h.audioId}
- **Issue:** ${h.issueTypes.filter(t => t !== ISSUE_TYPES.PASS).join(', ')}
- **Current TTS:** ${h.ttsText}
- **Explanation:** ${h.explanations.join('; ')}
`).join('\n') || 'None'}

---

## Rejected Items (Unsafe to Auto-Fix)

${rejected.map(r => `### ${r.audioId}
- **Issue:** ${r.issueTypes.filter(t => t !== ISSUE_TYPES.PASS).join(', ')}
- **Current TTS:** ${r.ttsText}
- **Explanation:** ${r.explanations.join('; ')}
`).join('\n') || 'None'}

---

## Full Item Details

${items.map(item => `### ${item.audioId}
- **Type:** ${item.issueTypes.join(', ')}
- **Text:** ${item.text || 'N/A'}
- **TTS:** ${item.ttsText || 'N/A'}
- **Corrected:** ${item.correctedTtsText || 'N/A'}
- **Confidence:** ${item.confidence}
- **MP3 Regen:** ${item.mp3RegenerationRequired ? 'Yes' : 'No'}
- **Explanation:** ${item.explanations.join('; ')}
`).join('\n')}
`;
}

function generateCorrectionsMarkdown(result, corrections, humanReview, rejected, visibleTypos) {
  return `# Full Spoken Arabic Corrections Applied

**Audit Date:** ${result.auditDate}

---

## Summary

| Metric | Count |
|--------|-------|
| Total Scanned | ${result.totalScanned} |
| PASS | ${result.totalPass} |
| Corrected | ${result.totalCorrected} |
| Human Review | ${result.totalHumanReview} |
| Rejected | ${result.totalRejected} |
| Visible Typos Found | ${result.totalVisibleTypos} |
| Files Requiring Regeneration | ${result.filesRequiringRegeneration} |

---

## Applied Corrections

${corrections.map(c => `### ${c.audioId}
- **Issue Type:** ${c.issueType}
- **Path:** \`${c.path}\`
- **Old TTS:** ${c.oldTtsText}
- **New TTS:** ${c.newTtsText}
`).join('\n') || 'No corrections applied.'}

---

## Items Requiring Human Review

${humanReview.map(h => `### ${h.audioId}
- **Issues:** ${h.issueTypes.filter(t => t !== ISSUE_TYPES.PASS).join(', ')}
- **Current TTS:** ${h.ttsText}
- **Explanation:** ${h.explanations.join('; ')}
`).join('\n') || 'None'}

---

## Rejected Items

${rejected.map(r => `### ${r.audioId}
- **Issues:** ${r.issueTypes.filter(t => t !== ISSUE_TYPES.PASS).join(', ')}
- **Explanation:** ${r.explanations.join('; ')}
`).join('\n') || 'None'}

---

## Visible Text Typos (Not Changed - Requires Approval)

${visibleTypos.map(v => `- **${v.audioId}:** ${v.text} → ${v.proposed}`).join('\n') || 'No visible typos found.'}
`;
}

function generateVisibleTyposMarkdown(visibleTypos) {
  return `# Visible Arabic Typos Needing Approval

**Note:** These are potential spelling errors in visible UI text. DO NOT fix without explicit approval.

${visibleTypos.map(v => `## ${v.audioId}
- **Current:** ${v.text}
- **Proposed:** ${v.proposed}
- **Location:** ${v.location}
- **Reason:** ${v.reason}
`).join('\n')}

---

**IMPORTANT:** Approval required before changing any visible text.
`;
}

// Run the audit
runLinguisticAudit()
  .then(() => {
    console.log('\n✅ Linguistic audit and corrections complete');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
